"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.links = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
exports.links = (0, pg_core_1.pgTable)('links', {
    id: (0, pg_core_1.serial)('id').primaryKey(),
    originalUrl: (0, pg_core_1.text)('original_url').notNull(),
    shortCode: (0, pg_core_1.varchar)('short_code', { length: 10 }).notNull().unique(),
    accessCount: (0, pg_core_1.integer)('access_count').notNull().default(0),
    createdAt: (0, pg_core_1.timestamp)('created_at').defaultNow(),
});
