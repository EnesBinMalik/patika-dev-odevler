/**
 * RESTful WebApi Route Registrations
 * Author: Enes Öztürk
 */

import { Router } from 'express';
import {
  MovieController,
  ActorController,
  DirectorController,
  CustomerController,
  OrderController,
  GenreController,
} from '../controllers/Controllers.ts';
import { TestRunnerController, LogsController } from '../controllers/TestRunnerController.ts';
import { SwaggerSpecController } from '../controllers/SwaggerSpecController.ts';
import { customerAuthGuard } from '../middleware/AuthGuard.ts';

export function createApiRouter(): Router {
  const router = Router();

  const movieCtrl = new MovieController();
  const actorCtrl = new ActorController();
  const directorCtrl = new DirectorController();
  const customerCtrl = new CustomerController();
  const orderCtrl = new OrderController();
  const genreCtrl = new GenreController();
  const testCtrl = new TestRunnerController();
  const logsCtrl = new LogsController();
  const swaggerCtrl = new SwaggerSpecController();

  // Signature Header on all API responses
  router.use((req, res, next) => {
    res.setHeader('X-Powered-By', 'MovieStore WebApi by Enes Öztürk');
    res.setHeader('X-Architecture', 'Clean-Architecture-DTO-AutoMapper-DI');
    next();
  });

  // ---- 1. Movie Endpoints ----
  router.get('/movies', movieCtrl.getAll);
  router.get('/movies/:id', movieCtrl.getById);
  router.post('/movies', movieCtrl.create);
  router.put('/movies/:id', movieCtrl.update);
  router.delete('/movies/:id', movieCtrl.delete);

  // ---- 2. Actor Endpoints ----
  router.get('/actors', actorCtrl.getAll);
  router.get('/actors/:id', actorCtrl.getById);
  router.post('/actors', actorCtrl.create);
  router.put('/actors/:id', actorCtrl.update);
  router.delete('/actors/:id', actorCtrl.delete);

  // ---- 3. Director Endpoints ----
  router.get('/directors', directorCtrl.getAll);
  router.get('/directors/:id', directorCtrl.getById);
  router.post('/directors', directorCtrl.create);
  router.put('/directors/:id', directorCtrl.update);
  router.delete('/directors/:id', directorCtrl.delete);

  // ---- 4. Customer Endpoints ----
  router.get('/customers', customerCtrl.getAll);
  router.get('/customers/me', customerAuthGuard, customerCtrl.getMe);
  router.get('/customers/:id', customerCtrl.getById);
  router.post('/customers/register', customerCtrl.register);
  router.post('/customers/login', customerCtrl.login);
  router.delete('/customers/:id', customerCtrl.delete);

  // ---- 5. Order Endpoints (Satın Alma - Müşteri Korumalı) ----
  router.post('/orders', customerAuthGuard, orderCtrl.purchaseMovie);
  router.get('/orders/my-orders', customerAuthGuard, orderCtrl.getMyOrders);
  router.get('/orders', orderCtrl.getAll);

  // ---- 6. Genre Endpoints ----
  router.get('/genres', genreCtrl.getAll);

  // ---- 7. Test Runner & Database Management ----
  router.get('/tests/run', testCtrl.runTests);
  router.post('/database/reset', testCtrl.resetDatabase);

  // ---- 8. Logging Monitoring ----
  router.get('/logs', logsCtrl.getLogs);
  router.post('/logs/clear', logsCtrl.clearLogs);

  // ---- 9. Swagger Spec ----
  router.get('/docs/spec', swaggerCtrl.getSpec);

  return router;
}
