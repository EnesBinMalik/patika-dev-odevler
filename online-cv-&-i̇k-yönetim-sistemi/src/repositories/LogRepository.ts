/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility Prensibi
 * Sistem Günlükleri Veri Erişim Katmanı (Audit Log Repository)
 */

import { ILogRepository } from './interfaces/ILogRepository';
import { AuditLogEntity } from '../types/models';
import { DatabaseContext } from '../database/DatabaseContext';
import { Stream } from '../core/Stream';
import { LogLevel } from '../types/enums';

export class LogRepository implements ILogRepository {
  private db: DatabaseContext;

  constructor() {
    this.db = DatabaseContext.getInstance();
  }

  public save(log: AuditLogEntity): AuditLogEntity {
    this.db.auditLogs.unshift(log); // En yeni log en başa
    // 300'den fazla log birikirse eski olanları kırp
    if (this.db.auditLogs.length > 300) {
      this.db.auditLogs = this.db.auditLogs.slice(0, 300);
    }
    this.db.persist();
    return log;
  }

  public findAll(): AuditLogEntity[] {
    return [...this.db.auditLogs];
  }

  public findByLevel(level: LogLevel): AuditLogEntity[] {
    return Stream.of(this.db.auditLogs)
      .filter((l) => l.level === level)
      .collectToList();
  }

  public findByUserId(userId: string): AuditLogEntity[] {
    return Stream.of(this.db.auditLogs)
      .filter((l) => l.userId === userId)
      .collectToList();
  }

  public getRecentLogs(limit: number): AuditLogEntity[] {
    return Stream.of(this.db.auditLogs)
      .limit(limit)
      .collectToList();
  }

  public clear(): void {
    this.db.auditLogs = [];
    this.db.persist();
  }

  public count(): number {
    return this.db.auditLogs.length;
  }
}
