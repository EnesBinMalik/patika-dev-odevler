/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion - Loglama Servis Arayüzü
 */

import { AuditLogEntity } from '../../types/models';
import { LogLevel, Role } from '../../types/enums';

export interface IAuditLogService {
  log(action: string, details: string, level?: LogLevel, user?: { id: string | null; username: string; role: Role | 'ANONYMOUS' }): AuditLogEntity;
  getAllLogs(): AuditLogEntity[];
  getRecentLogs(limit?: number): AuditLogEntity[];
  clearLogs(): void;
}
