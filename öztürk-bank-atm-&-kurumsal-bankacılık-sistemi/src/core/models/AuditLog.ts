/**
 * AuditLog & LoginSession Entities
 * Bankacılık Güvenliği, Sistem İzleme ve Denetim Kayıtları
 * Mimar: Enes Öztürk
 */

import { BaseEntity } from '../oop/abstracts';
import { IAuditLogEntity, ILoginSessionEntity } from '../oop/interfaces';
import { LogLevel, LogAction, UserRole } from '../enums';

export class AuditLog extends BaseEntity implements IAuditLogEntity {
  public action: LogAction;
  public level: LogLevel;
  public userId?: string;
  public userRole?: UserRole;
  public ipAddress: string;
  public details: string;
  public timestamp: string;

  constructor(
    action: LogAction,
    level: LogLevel,
    details: string,
    ipAddress: string = '192.168.1.105',
    userId?: string,
    userRole?: UserRole,
    timestamp?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this.action = action;
    this.level = level;
    this.details = details;
    this.ipAddress = ipAddress;
    this.userId = userId;
    this.userRole = userRole;
    this.timestamp = timestamp || new Date().toISOString();
  }

  public static fromJSON(json: Record<string, unknown>): AuditLog {
    return new AuditLog(
      (json.action as LogAction) || LogAction.LOGIN_SUCCESS,
      (json.level as LogLevel) || LogLevel.INFO,
      String(json.details || ''),
      String(json.ipAddress || '127.0.0.1'),
      json.userId ? String(json.userId) : undefined,
      json.userRole ? (json.userRole as UserRole) : undefined,
      json.timestamp ? String(json.timestamp) : undefined,
      json.id ? String(json.id) : undefined,
      json.createdAt ? String(json.createdAt) : undefined,
      json.updatedAt ? String(json.updatedAt) : undefined
    );
  }
}

export class LoginSession extends BaseEntity implements ILoginSessionEntity {
  public userId: string;
  public fullName: string;
  public role: UserRole;
  public loginTime: string;
  public ipAddress: string;
  public userAgent: string;
  public success: boolean;
  public failureReason?: string;

  constructor(
    userId: string,
    fullName: string,
    role: UserRole,
    loginTime: string,
    ipAddress: string,
    userAgent: string,
    success: boolean,
    failureReason?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this.userId = userId;
    this.fullName = fullName;
    this.role = role;
    this.loginTime = loginTime;
    this.ipAddress = ipAddress;
    this.userAgent = userAgent;
    this.success = success;
    this.failureReason = failureReason;
  }

  public static fromJSON(json: Record<string, unknown>): LoginSession {
    return new LoginSession(
      String(json.userId || ''),
      String(json.fullName || ''),
      (json.role as UserRole) || UserRole.CUSTOMER,
      String(json.loginTime || new Date().toISOString()),
      String(json.ipAddress || '192.168.1.1'),
      String(json.userAgent || 'Chrome / ATM Terminal #04'),
      Boolean(json.success !== undefined ? json.success : true),
      json.failureReason ? String(json.failureReason) : undefined,
      json.id ? String(json.id) : undefined,
      json.createdAt ? String(json.createdAt) : undefined,
      json.updatedAt ? String(json.updatedAt) : undefined
    );
  }
}
