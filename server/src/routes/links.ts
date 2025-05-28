import { FastifyInstance } from 'fastify';
import { db } from '../db';
import { links } from '../db/schema';
import { generateShortCode } from '../lib/shortener';
import { eq } from 'drizzle-orm';

export async function linkRoutes(app: FastifyInstance) {
  app.post('/links', async (request, reply) => {
    const { originalUrl, shortCode } = request.body as {
      originalUrl: string;
      shortCode?: string;
    };
  
    if (!originalUrl) {
      return reply.status(400).send({ error: 'URL original é obrigatória' });
    }
  
    const codeToUse =
    shortCode && shortCode.trim().length > 0
      ? shortCode.trim()
      : generateShortCode();
        
    try {
      const existing = await db
        .select()
        .from(links)
        .where(eq(links.shortCode, codeToUse));
  
      if (existing.length > 0) {
        return reply.status(400).send({ error: 'Esse código já está em uso' });
      }
  
      const [newLink] = await db
        .insert(links)
        .values({ originalUrl, shortCode: codeToUse })
        .returning();
  
      return reply.send(newLink);
    } catch (error: any) {
      return reply.status(500).send({ error: error.message });
    }
  });
  

  app.get('/links/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    const [link] = await db.select().from(links).where(eq(links.shortCode, code));
    if (!link) return reply.status(404).send({ error: 'Link not found' });

    await db.update(links)
      .set({ accessCount: link.accessCount + 1 })
      .where(eq(links.id, link.id));

    return reply.redirect(link.originalUrl);
  });

  app.delete('/links/:code', async (request, reply) => {
    const { code } = request.params as { code: string };
    await db.delete(links).where(eq(links.shortCode, code));
    return reply.send({ success: true });
  });

  app.get('/links', async () => {
    return db.select().from(links);
  });
}
