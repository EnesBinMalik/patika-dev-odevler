/**
 * Express Middlewares for Logging, Exception Handling, and Authentication
 * Author: Enes Öztürk
 */

import { Request, Response, NextFunction } from 'express';
import { ConsoleLoggerService } from '../services/LoggerService.ts';
import { ValidationException } from '../validation/Validator.ts';
import {
  NotFoundException,
  BusinessRuleException,
  AuthenticationException,
  AuthorizationException,
} from '../exceptions/Exceptions.ts';
import { Customer } from '../entities/Entities.ts';

// Extend Express Request to include customer
declare global {
  namespace Express {
    interface Request {
      customer?: Customer;
      startTime?: number;
    }
  }
}

const logger = ConsoleLoggerService.getInstance();

/**
 * Request and Response Logging Middleware
 * Logs every incoming request and outgoing response with latency in ms.
 */
export function requestResponseLogger(req: Request, res: Response, next: NextFunction): void {
  // Ignore static assets or vite internals
  if (req.path.startsWith('/@') || req.path.startsWith('/src') || req.path.includes('.')) {
    return next();
  }

  const startTime = Date.now();
  req.startTime = startTime;

  // Log incoming request
  logger.info(
    `--> ${req.method} ${req.originalUrl || req.url}`,
    'HTTP_REQUEST',
    { ip: req.ip, userAgent: req.headers['user-agent']?.substring(0, 50) }
  );

  // Hook into response finish event
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const statusCode = res.statusCode;
    const msg = `<-- ${req.method} ${req.originalUrl || req.url} ${statusCode} (${duration}ms)`;

    if (statusCode >= 500) {
      logger.error(msg, 'HTTP_RESPONSE', { duration, statusCode });
    } else if (statusCode >= 400) {
      logger.warn(msg, 'HTTP_RESPONSE', { duration, statusCode });
    } else {
      logger.info(msg, 'HTTP_RESPONSE', { duration, statusCode });
    }
  });

  next();
}

/**
 * Centralized Global Exception Handling Middleware
 * Catches all exceptions, formats them, logs them via logger, and returns structured API responses.
 */
export function errorHandlingMiddleware(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const timestamp = new Date().toISOString();

  // 1. Validation Exception
  if (err instanceof ValidationException) {
    logger.warn(
      `Validation Error on ${req.method} ${req.path}: ${err.failures.map(f => `${f.propertyName}: ${f.errorMessage}`).join(', ')}`,
      'VALIDATION',
      { failures: err.failures }
    );

    res.status(400).json({
      success: false,
      message: 'Gönderilen veriler doğrulama kurallarından geçemedi.',
      errors: err.failures.map(f => `${f.propertyName}: ${f.errorMessage}`),
      validationDetails: err.failures,
      meta: {
        author: 'Enes Öztürk',
        timestamp,
        version: '1.0.0',
      },
    });
    return;
  }

  // 2. Not Found Exception
  if (err instanceof NotFoundException) {
    logger.warn(`Not Found: ${err.message}`, 'BUSINESS_RULE', { path: req.path });
    res.status(404).json({
      success: false,
      message: err.message,
      meta: { author: 'Enes Öztürk', timestamp, version: '1.0.0' },
    });
    return;
  }

  // 3. Business Rule Exception
  if (err instanceof BusinessRuleException) {
    logger.warn(`Business Rule Violated: ${err.message}`, 'BUSINESS_RULE', { path: req.path });
    res.status(422).json({
      success: false,
      message: err.message,
      meta: { author: 'Enes Öztürk', timestamp, version: '1.0.0' },
    });
    return;
  }

  // 4. Authentication Exception
  if (err instanceof AuthenticationException) {
    logger.warn(`Authentication Failure: ${err.message}`, 'SECURITY', { path: req.path });
    res.status(401).json({
      success: false,
      message: err.message,
      meta: { author: 'Enes Öztürk', timestamp, version: '1.0.0' },
    });
    return;
  }

  // 5. Authorization Exception
  if (err instanceof AuthorizationException) {
    logger.warn(`Authorization Forbidden: ${err.message}`, 'SECURITY', { path: req.path });
    res.status(403).json({
      success: false,
      message: err.message,
      meta: { author: 'Enes Öztürk', timestamp, version: '1.0.0' },
    });
    return;
  }

  // 6. Generic Internal Server Error
  logger.error(
    `Unhandled Server Exception: ${err.message || err}`,
    'SYSTEM',
    { stack: err.stack, path: req.path }
  );

  res.status(500).json({
    success: false,
    message: 'Sunucu tarafında beklenmeyen bir hata oluştu.',
    errors: [err.message || 'Bilinmeyen hata'],
    meta: {
      author: 'Enes Öztürk',
      timestamp,
      version: '1.0.0',
    },
  });
}
