/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: AuditLog (JPA @Entity @Table(name = "audit_logs"))
 * Captures all user logins, failed attempts, account locks, profile updates, and applications
 */

import { BaseEntity } from './BaseEntity.ts';
import { LogLevel, Role } from '../types/enums.ts';

export class AuditLog extends BaseEntity {
  private level: LogLevel;
  private action: string;
  private userId?: string;
  private userEmail?: string;
  private role?: Role | 'ANONYMOUS';
  private details: string;
  private ipAddress: string;

  constructor(params: {
    id?: string;
    level: LogLevel;
    action: string;
    userId?: string;
    userEmail?: string;
    role?: Role | 'ANONYMOUS';
    details: string;
    ipAddress?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.level = params.level;
    this.action = params.action.trim();
    this.userId = params.userId;
    this.userEmail = params.userEmail;
    this.role = params.role || 'ANONYMOUS';
    this.details = params.details;
    this.ipAddress = params.ipAddress || '127.0.0.1 (Spring Proxy)';
  }

  public getLevel(): LogLevel { return this.level; }
  public getAction(): string { return this.action; }
  public getUserId(): string | undefined { return this.userId; }
  public getUserEmail(): string | undefined { return this.userEmail; }
  public getRole(): Role | 'ANONYMOUS' | undefined { return this.role; }
  public getDetails(): string { return this.details; }
  public getIpAddress(): string { return this.ipAddress; }

  /**
   * Formats log row in standard Spring Boot Logback format:
   * 2026-11-06 14:02:11.123 [THREAD-1] INFO c.e.service.AuthService - User login success
   */
  public toLogbackFormat(): string {
    const formattedDate = this.createdAt.replace('T', ' ').replace('Z', '');
    return `${formattedDate} [MAIN-THREAD] [${this.level.padEnd(8)}] [${this.role}] [${this.userEmail || 'GUEST'}] - ${this.action}: ${this.details}`;
  }

  public toJSON() {
    return {
      id: this.id,
      timestamp: this.createdAt,
      level: this.level,
      action: this.action,
      userId: this.userId,
      userEmail: this.userEmail,
      role: this.role,
      details: this.details,
      ipAddress: this.ipAddress,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
