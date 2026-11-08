/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility & Observer/Log Pattern
 */

import { IAuditLogService } from './interfaces/IAuditLogService';
import { ILogRepository } from '../repositories/interfaces/ILogRepository';
import { LogRepository } from '../repositories/LogRepository';
import { AuditLogEntity } from '../types/models';
import { LogLevel, Role } from '../types/enums';

export class AuditLogService implements IAuditLogService {
  private static instance: AuditLogService | null = null;
  private logRepository: ILogRepository;

  private constructor() {
    this.logRepository = new LogRepository();
  }

  public static getInstance(): AuditLogService {
    if (!AuditLogService.instance) {
      AuditLogService.instance = new AuditLogService();
    }
    return AuditLogService.instance;
  }

  public log(
    action: string,
    details: string,
    level: LogLevel = LogLevel.INFO,
    user?: { id: string | null; username: string; role: Role | 'ANONYMOUS' }
  ): AuditLogEntity {
    const logEntity = new AuditLogEntity({
      action,
      details,
      level,
      userId: user?.id || null,
      username: user?.username || 'Sistem / Anonim',
      role: user?.role || 'ANONYMOUS',
    });

    return this.logRepository.save(logEntity);
  }

  public getAllLogs(): AuditLogEntity[] {
    return this.logRepository.findAll();
  }

  public getRecentLogs(limit: number = 50): AuditLogEntity[] {
    return this.logRepository.getRecentLogs(limit);
  }

  public clearLogs(): void {
    this.logRepository.clear();
    this.log('LOG_TEMİZLENDİ', 'Tüm denetim log kayıtları yönetici tarafından temizlendi.', LogLevel.WARN);
  }
}
