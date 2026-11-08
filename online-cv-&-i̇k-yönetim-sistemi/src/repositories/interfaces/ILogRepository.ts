/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion Prensibi (DIP) - Log Repository Arayüzü
 */

import { AuditLogEntity } from '../../types/models';
import { LogLevel } from '../../types/enums';

export interface ILogRepository {
  save(log: AuditLogEntity): AuditLogEntity;
  findAll(): AuditLogEntity[];
  findByLevel(level: LogLevel): AuditLogEntity[];
  findByUserId(userId: string): AuditLogEntity[];
  getRecentLogs(limit: number): AuditLogEntity[];
  clear(): void;
  count(): number;
}
