import Fastify from 'fastify';
import cors from '@fastify/cors';
import { linkRoutes } from './routes/links';

const app = Fastify();

app.register(cors, {
  origin: 'http://localhost:5173'  
});

app.register(linkRoutes);

app.listen({ port: 3000 }, () => {
  console.log('🚀 Server running at http://localhost:3000');
});
