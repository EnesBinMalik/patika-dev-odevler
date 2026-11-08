/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: LoggerService
 * Layered Architecture - Cross-cutting Concerns (AOP Simulation & Audit Logging)
 */

import { DatabaseService } from './DatabaseService.ts';
import { AuditLog } from '../entities/AuditLogEntity.ts';
import { LogLevel, Role } from '../types/enums.ts';

export interface ILoggerService {
  info(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog;
  warn(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog;
  security(action: string, details: string, email?: string): AuditLog;
  error(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog;
  audit(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog;
  exportLogFileContent(): string;
}

export class LoggerService implements ILoggerService {
  private static instance: LoggerService | null = null;
  private db: DatabaseService;

  private constructor() {
    this.db = DatabaseService.getInstance();
  }

  public static getInstance(): LoggerService {
    if (!LoggerService.instance) {
      LoggerService.instance = new LoggerService();
    }
    return LoggerService.instance;
  }

  public info(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    const log = new AuditLog({
      level: LogLevel.INFO,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
    this.db.logs.save(log);
    this.db.notify();
    return log;
  }

  public warn(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    const log = new AuditLog({
      level: LogLevel.WARN,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
    this.db.logs.save(log);
    this.db.notify();
    return log;
  }

  public security(action: string, details: string, email?: string): AuditLog {
    const log = new AuditLog({
      level: LogLevel.SECURITY,
      action,
      details,
      userEmail: email,
      role: 'ANONYMOUS',
    });
    this.db.logs.save(log);
    this.db.notify();
    return log;
  }

  public error(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    const log = new AuditLog({
      level: LogLevel.ERROR,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
    this.db.logs.save(log);
    this.db.notify();
    return log;
  }

  public audit(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    const log = new AuditLog({
      level: LogLevel.AUDIT,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
    this.db.logs.save(log);
    this.db.notify();
    return log;
  }

  public exportLogFileContent(): string {
    const header = [
      '# =====================================================================',
      '# KARIYER PORTALI - SPRING BOOT AUDIT & SECURITY LOG DUMP',
      '# Geliştirici & Sistem Mimarı: Enes Öztürk',
      `# Export Timestamp: ${new Date().toISOString()}`,
      `# Total Log Entries: ${this.db.logs.count()}`,
      '# Format: [TIMESTAMP] [THREAD] [LEVEL] [ROLE] [USER] - ACTION: DETAILS',
      '# =====================================================================',
      '',
    ].join('\n');

    const logLines = this.db.logs
      .findAll()
      .sorted((a, b) => new Date(a.getCreatedAt()).getTime() - new Date(b.getCreatedAt()).getTime())
      .map(l => l.toLogbackFormat())
      .toList()
      .join('\n');

    return header + logLines;
  }
}
