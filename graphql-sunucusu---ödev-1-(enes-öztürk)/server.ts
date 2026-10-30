import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { executeGraphQL, schemaSDL, getDatabase, resetDatabase } from './src/graphql/schema';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProd = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // CORS Headers
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }
    next();
  });

  // Health and info endpoint
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({
      status: 'ok',
      author: 'Enes Öztürk',
      assignment: 'Ödev 1 - GraphQL Sunucusu',
      endpoint: '/graphql',
      time: new Date().toISOString(),
    });
  });

  // GraphQL Schema SDL endpoint
  app.get('/api/schema', (_req: Request, res: Response) => {
    res.type('text/plain').send(schemaSDL);
  });

  // Database snapshot endpoint
  app.get('/api/data', (_req: Request, res: Response) => {
    res.json(getDatabase());
  });

  // Reset database endpoint
  app.post('/api/reset', (_req: Request, res: Response) => {
    resetDatabase();
    res.json({ success: true, message: 'Veri seti sıfırlandı' });
  });

  // Live GraphQL endpoint (Supports both POST and GET)
  const handleGraphQL = async (req: Request, res: Response) => {
    const query = req.method === 'POST' ? req.body.query : (req.query.query as string);
    const variables =
      req.method === 'POST'
        ? req.body.variables
        : req.query.variables
        ? typeof req.query.variables === 'string'
          ? JSON.parse(req.query.variables)
          : req.query.variables
        : null;
    const operationName =
      req.method === 'POST'
        ? req.body.operationName
        : (req.query.operationName as string | undefined);

    if (!query) {
      res.status(400).json({
        errors: [{ message: 'Geçersiz GraphQL isteği: "query" parametresi zorunludur.' }],
      });
      return;
    }

    const result = await executeGraphQL(query, variables, operationName);
    const statusCode = result.errors && !result.data ? 400 : 200;
    res.status(statusCode).json(result);
  };

  app.post('/graphql', handleGraphQL);
  app.get('/graphql', handleGraphQL);

  // Frontend Integration: Vite middlewares in dev, static files in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log(`[Vite] Dev server middleware mounted`);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`===================================================`);
    console.log(`🚀 GraphQL Sunucusu Başarıyla Başlatıldı!`);
    console.log(`✍️  Hazırlayan: Enes Öztürk`);
    console.log(`📍 HTTP / GraphQL Port: http://0.0.0.0:${PORT}`);
    console.log(`⚡ GraphQL Uç Noktası: http://0.0.0.0:${PORT}/graphql`);
    console.log(`===================================================`);
  });
}

startServer().catch((err) => {
  console.error('Sunucu başlatılırken hata oluştu:', err);
  process.exit(1);
});
