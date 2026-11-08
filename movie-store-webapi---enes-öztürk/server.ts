/**
 * Main Full-Stack Server Entry Point
 * Movie Store WebApi - Enes Öztürk
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { requestResponseLogger, errorHandlingMiddleware } from './server/middleware/Middlewares.ts';
import { createApiRouter } from './server/routes/apiRoutes.ts';
import { ConsoleLoggerService } from './server/services/LoggerService.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
  const isProduction = process.env.NODE_ENV === 'production';
  const logger = ConsoleLoggerService.getInstance();

  // 1. Core Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // 2. Request / Response Logging Middleware
  app.use(requestResponseLogger);

  // 3. API Routes
  app.use('/api', createApiRouter());

  // 4. API Error Handling Middleware (must follow API routes)
  app.use('/api', errorHandlingMiddleware);

  // 5. Front-End Handling (Vite Dev Server in Dev, Static Files in Prod)
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  // 6. Global Catch-All Error Handler
  app.use(errorHandlingMiddleware);

  app.listen(port, '0.0.0.0', () => {
    logger.info(`=======================================================`, 'SYSTEM');
    logger.info(`🎬 Movie Store WebApi - Geliştirici: Enes Öztürk`, 'SYSTEM');
    logger.info(`🚀 Sunucu port ${port} üzerinde aktif: http://localhost:${port}`, 'SYSTEM');
    logger.info(`📚 Swagger / API Dokümantasyonu ve Test Arayüzü hazır!`, 'SYSTEM');
    logger.info(`=======================================================`, 'SYSTEM');
  });
}

startServer().catch((err) => {
  console.error('Fatal Server Error:', err);
  process.exit(1);
});
