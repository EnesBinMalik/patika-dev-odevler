import express from 'express';
import { createServer as createViteServer } from 'vite';
import { graphql } from 'graphql';
import path from 'path';
import { fileURLToPath } from 'url';
import { schema, SCHEMA_SDL } from './src/graphql/schema.ts';
import { CONTINENTS, COUNTRIES, LANGUAGES } from './src/graphql/data.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  // CORS middleware
  app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  app.use(express.json({ limit: '10mb' }));

  // Metadata and API info
  app.get('/api/health', (_req, res) => {
    res.json({
      status: 'ok',
      service: 'Countries GraphQL API',
      author: 'Enes Öztürk',
      endpoint: '/graphql',
      stats: {
        continentsCount: CONTINENTS.length,
        countriesCount: COUNTRIES.length,
        languagesCount: LANGUAGES.length,
      },
      timestamp: new Date().toISOString(),
    });
  });

  // Schema SDL raw endpoint
  app.get('/api/schema', (_req, res) => {
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.send(SCHEMA_SDL);
  });

  // GraphQL POST endpoint
  app.post('/graphql', async (req, res) => {
    const { query, variables, operationName } = req.body || {};

    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        errors: [{ message: 'Must provide query string in request body.' }],
      });
    }

    try {
      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
      });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({
        errors: [{ message: err.message || 'Internal GraphQL execution error.' }],
      });
    }
  });

  // GraphQL GET endpoint (for direct browser/cURL testing)
  app.get('/graphql', async (req, res) => {
    const query = req.query.query as string;
    const operationName = req.query.operationName as string | undefined;
    let variables: Record<string, any> | undefined;

    if (req.query.variables) {
      try {
        variables = JSON.parse(req.query.variables as string);
      } catch {
        return res.status(400).json({
          errors: [{ message: 'Variables must be valid JSON string.' }],
        });
      }
    }

    if (!query) {
      // If visited in browser without query, serve quick guide
      return res.json({
        service: 'Countries GraphQL API',
        author: 'Enes Öztürk',
        instructions: 'Send POST request to /graphql with JSON { query, variables } or GET ?query=...',
        exampleQuery: '{ countries { code name emoji continent { name } languages { name } } }',
      });
    }

    try {
      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
      });
      return res.json(result);
    } catch (err: any) {
      return res.status(500).json({
        errors: [{ message: err.message || 'Internal GraphQL execution error.' }],
      });
    }
  });

  // Vite middleware in dev or static files in production
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(PORT), '0.0.0.0', () => {
    console.log(`Countries GraphQL API Server by Enes Öztürk running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
