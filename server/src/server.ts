import Fastify from 'fastify';
import { linkRoutes } from './routes/links';

const app = Fastify();

app.register(linkRoutes);

app.listen({ port: 3000 }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server listening at ${address}`);
});
