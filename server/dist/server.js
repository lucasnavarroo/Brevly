"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const links_1 = require("./routes/links");
const app = (0, fastify_1.default)();
app.register(cors_1.default, {
    origin: 'http://localhost:5173'
});
app.register(links_1.linkRoutes);
app.listen({ port: 3000 }, () => {
    console.log('🚀 Server running at http://localhost:3000');
});
