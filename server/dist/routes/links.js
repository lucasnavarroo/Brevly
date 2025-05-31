"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkRoutes = linkRoutes;
const db_1 = require("../db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const client_s3_1 = require("@aws-sdk/client-s3");
const sync_1 = require("csv-stringify/sync");
const uuid_1 = require("uuid");
async function linkRoutes(app) {
    // S3 client configurado fora das rotas
    const s3 = new client_s3_1.S3Client({
        region: process.env.S3_REGION,
        credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY,
            secretAccessKey: process.env.S3_SECRET_KEY,
        },
        endpoint: process.env.S3_ENDPOINT,
    });
    // Rota de criação de link
    app.post('/links', async (request, reply) => {
        const { originalUrl, shortCode } = request.body;
        if (!originalUrl || !shortCode) {
            return reply.status(400).send({ error: 'Campos obrigatórios' });
        }
        const shortCodeRegex = /^[a-zA-Z0-9-_]{3,30}$/;
        if (!shortCodeRegex.test(shortCode)) {
            return reply.status(400).send({ error: 'Formato inválido para o link encurtado' });
        }
        try {
            const existing = await db_1.db
                .select()
                .from(schema_1.links)
                .where((0, drizzle_orm_1.eq)(schema_1.links.shortCode, shortCode));
            if (existing.length > 0) {
                return reply.status(400).send({ error: 'Esse encurtamento já está em uso' });
            }
            const [newLink] = await db_1.db
                .insert(schema_1.links)
                .values({ originalUrl, shortCode })
                .returning();
            return reply.send(newLink);
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: 'Erro interno ao criar o link' });
        }
    });
    // Rota de redirecionamento
    app.get('/links/:code', async (request, reply) => {
        const { code } = request.params;
        const [link] = await db_1.db.select().from(schema_1.links).where((0, drizzle_orm_1.eq)(schema_1.links.shortCode, code));
        if (!link)
            return reply.status(404).send({ error: 'Link não encontrado' });
        await db_1.db.update(schema_1.links)
            .set({ accessCount: link.accessCount + 1 })
            .where((0, drizzle_orm_1.eq)(schema_1.links.id, link.id));
        return reply.redirect(link.originalUrl);
    });
    // Rota de exclusão
    app.delete('/links/:code', async (request, reply) => {
        const { code } = request.params;
        await db_1.db.delete(schema_1.links).where((0, drizzle_orm_1.eq)(schema_1.links.shortCode, code));
        return reply.send({ success: true });
    });
    // Rota de listagem de links
    app.get('/links', async () => {
        return db_1.db.select().from(schema_1.links);
    });
    // Rota de exportação CSV
    app.post('/export', async (request, reply) => {
        try {
            const rows = await db_1.db.select().from(schema_1.links);
            const records = rows.map(link => ({
                originalUrl: link.originalUrl,
                shortUrl: `${process.env.BASE_URL}/links/${link.shortCode}`,
                accessCount: link.accessCount,
                createdAt: link.createdAt?.toISOString() ?? ''
            }));
            const csvContent = (0, sync_1.stringify)(records, {
                header: true,
                columns: ['originalUrl', 'shortUrl', 'accessCount', 'createdAt']
            });
            const fileName = `export-${(0, uuid_1.v4)()}.csv`;
            await s3.send(new client_s3_1.PutObjectCommand({
                Bucket: process.env.S3_BUCKET,
                Key: fileName,
                Body: csvContent,
                ContentType: 'text/csv'
            }));
            const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;
            return reply.send({ url: publicUrl });
        }
        catch (error) {
            console.error(error);
            return reply.status(500).send({ error: 'Erro ao exportar CSV' });
        }
    });
}
