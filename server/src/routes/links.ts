import { FastifyInstance } from 'fastify';
import { db } from '../db';
import { links } from '../db/schema';
import { eq } from 'drizzle-orm';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { stringify } from 'csv-stringify/sync';
import { v4 as uuidv4 } from 'uuid';

export async function linkRoutes(app: FastifyInstance) {
  // S3 client configurado fora das rotas
  const s3 = new S3Client({
    region: process.env.S3_REGION,
    credentials: {
      accessKeyId: process.env.S3_ACCESS_KEY!,
      secretAccessKey: process.env.S3_SECRET_KEY!,
    },
    endpoint: process.env.S3_ENDPOINT,
  });

  // Rota de criação de link
  app.post('/links', async (request, reply) => {
    const { originalUrl, shortCode } = request.body as {
      originalUrl: string;
      shortCode: string;
    };

    if (!originalUrl || !shortCode) {
      return reply.status(400).send({ error: 'Campos obrigatórios' });
    }

    const shortCodeRegex = /^[a-zA-Z0-9-_]{3,30}$/;
    if (!shortCodeRegex.test(shortCode)) {
      return reply.status(400).send({ error: 'Formato inválido para o link encurtado' });
    }

    try {
      const existing = await db
        .select()
        .from(links)
        .where(eq(links.shortCode, shortCode));

      if (existing.length > 0) {
        return reply.status(400).send({ error: 'Esse encurtamento já está em uso' });
      }

      const [newLink] = await db
        .insert(links)
        .values({ originalUrl, shortCode })
        .returning();

      return reply.send(newLink);
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro interno ao criar o link' });
    }
  });

  // Rota de redirecionamento
  app.get('/links/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    const [link] = await db.select().from(links).where(eq(links.shortCode, code));

    if (!link) return reply.status(404).send({ error: 'Link não encontrado' });

    await db.update(links)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(links.id, link.id));

    return reply.redirect(link.originalUrl);
  });

  // Rota de exclusão
  app.delete('/links/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    await db.delete(links).where(eq(links.shortCode, code));
    return reply.send({ success: true });
  });

  // Rota de listagem de links
  app.get('/links', async () => {
    return db.select().from(links);
  });

  // Rota de exportação CSV
  app.post('/export', async (request, reply) => {
    try {
      const rows = await db.select().from(links);

      const records = rows.map(link => ({
        originalUrl: link.originalUrl,
        shortUrl: `${process.env.BASE_URL}/links/${link.shortCode}`,
        accessCount: link.accessCount,
        createdAt: link.createdAt?.toISOString() ?? ''
      }));

      const csvContent = stringify(records, {
        header: true,
        columns: ['originalUrl', 'shortUrl', 'accessCount', 'createdAt']
      });

      const fileName = `export-${uuidv4()}.csv`;

      await s3.send(new PutObjectCommand({
        Bucket: process.env.S3_BUCKET!,
        Key: fileName,
        Body: csvContent,
        ContentType: 'text/csv'
      }));

      const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

      return reply.send({ url: publicUrl });
    } catch (error: any) {
      console.error(error);
      return reply.status(500).send({ error: 'Erro ao exportar CSV' });
    }
  });
}
