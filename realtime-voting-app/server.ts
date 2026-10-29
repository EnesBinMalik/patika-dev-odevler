import express from 'express';
import { createServer } from 'http';
import path from 'path';
import { fileURLToPath } from 'url';
import { createYoga } from 'graphql-yoga';
import { schema } from './src/server/schema.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

async function bootstrap() {
  const app = express();
  const httpServer = createServer(app);

  // Setup GraphQL Yoga
  const yoga = createYoga({
    schema,
    graphqlEndpoint: '/graphql',
    cors: true,
    graphiql: {
      title: 'Realtime Voting App - GraphiQL (Enes Öztürk)',
    },
  });

  // Mount Yoga at /graphql
  app.use(yoga.graphqlEndpoint, yoga);

  // Health check endpoint
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      time: new Date().toISOString(),
      developer: 'Enes Öztürk',
      version: '1.0.0',
    });
  });

  if (!isProd) {
    // Development mode with Vite dev middleware
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve built client files
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Realtime Voting Server ready at http://localhost:${PORT}`);
    console.log(`📊 GraphQL Endpoint ready at http://localhost:${PORT}/graphql`);
    console.log(`👨‍💻 Enes Öztürk Realtime Voting Engine initialized`);
  });
}

bootstrap().catch((err) => {
  console.error('Fatal server startup error:', err);
  process.exit(1);
});
