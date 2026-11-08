/**
 * Test Runner and Logs Controllers
 * Author: Enes Öztürk
 */

import { Request, Response, NextFunction } from 'express';
import { UnitTestRunner } from '../tests/UnitTests.ts';
import { ConsoleLoggerService } from '../services/LoggerService.ts';
import { Database } from '../data/Database.ts';

export class TestRunnerController {
  public runTests = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const report = await UnitTestRunner.runAllTests();
      res.json({
        success: true,
        data: report,
        meta: {
          author: 'Enes Öztürk',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public resetDatabase = (req: Request, res: Response, next: NextFunction): void => {
    try {
      Database.getInstance().reset();
      ConsoleLoggerService.getInstance().info('Veritabanı varsayılan tohum (seed) verilerine sıfırlandı.', 'SYSTEM');
      res.json({
        success: true,
        message: 'Veritabanı başarıyla ilk haline sıfırlandı.',
        meta: {
          author: 'Enes Öztürk',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (err) {
      next(err);
    }
  };
}

export class LogsController {
  public getLogs = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const limit = Number(req.query.limit) || 100;
      const logs = ConsoleLoggerService.getInstance().getRecentLogs(limit);
      res.json({
        success: true,
        data: logs,
        meta: {
          author: 'Enes Öztürk',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (err) {
      next(err);
    }
  };

  public clearLogs = (req: Request, res: Response, next: NextFunction): void => {
    try {
      ConsoleLoggerService.getInstance().clearLogs();
      res.json({
        success: true,
        message: 'Log kayıtları temizlendi.',
        meta: {
          author: 'Enes Öztürk',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        },
      });
    } catch (err) {
      next(err);
    }
  };
}
