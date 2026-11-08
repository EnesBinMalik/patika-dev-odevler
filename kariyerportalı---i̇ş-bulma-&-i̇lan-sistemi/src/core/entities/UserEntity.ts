/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: User (Spring Security & JPA @Entity @Table(name = "users"))
 * Demonstrates OOP Inheritance from BaseEntity, Encapsulation & Security Lockout
 */

import { BaseEntity } from './BaseEntity.ts';
import { Role } from '../types/enums.ts';
import { PasswordService } from '../security/PasswordService.ts';

export class User extends BaseEntity {
  private email: string;
  private passwordHash: string;
  private role: Role;
  private fullName: string;
  private phone: string;
  private failedLoginAttempts: number;
  private isLocked: boolean;
  private lockedAt?: string;
  private companyId?: string;
  private candidateProfileId?: string;

  constructor(params: {
    id?: string;
    email: string;
    passwordHash: string;
    role: Role;
    fullName: string;
    phone: string;
    failedLoginAttempts?: number;
    isLocked?: boolean;
    lockedAt?: string;
    companyId?: string;
    candidateProfileId?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.email = params.email.toLowerCase().trim();
    this.passwordHash = params.passwordHash;
    this.role = params.role;
    this.fullName = params.fullName.trim();
    this.phone = params.phone.trim();
    this.failedLoginAttempts = params.failedLoginAttempts ?? 0;
    this.isLocked = params.isLocked ?? false;
    this.lockedAt = params.lockedAt;
    this.companyId = params.companyId;
    this.candidateProfileId = params.candidateProfileId;
  }

  // Getters & Encapsulation
  public getEmail(): string {
    return this.email;
  }

  public getPasswordHash(): string {
    return this.passwordHash;
  }

  public getRole(): Role {
    return this.role;
  }

  public getFullName(): string {
    return this.fullName;
  }

  public getPhone(): string {
    return this.phone;
  }

  public getFailedLoginAttempts(): number {
    return this.failedLoginAttempts;
  }

  public getIsLocked(): boolean {
    return this.isLocked;
  }

  public getLockedAt(): string | undefined {
    return this.lockedAt;
  }

  public getCompanyId(): string | undefined {
    return this.companyId;
  }

  public getCandidateProfileId(): string | undefined {
    return this.candidateProfileId;
  }

  // Business Logic Methods
  public registerFailedAttempt(): boolean {
    this.failedLoginAttempts += 1;
    this.updateTimestamp();

    if (this.failedLoginAttempts >= PasswordService.MAX_FAILED_ATTEMPTS) {
      this.isLocked = true;
      this.lockedAt = new Date().toISOString();
      return true; // Locked now
    }
    return false;
  }

  public resetFailedAttempts(): void {
    this.failedLoginAttempts = 0;
    this.isLocked = false;
    this.lockedAt = undefined;
    this.updateTimestamp();
  }

  public unlockAccount(): void {
    this.isLocked = false;
    this.failedLoginAttempts = 0;
    this.lockedAt = undefined;
    this.updateTimestamp();
  }

  public setCompanyId(companyId: string): void {
    this.companyId = companyId;
    this.updateTimestamp();
  }

  public setCandidateProfileId(profileId: string): void {
    this.candidateProfileId = profileId;
    this.updateTimestamp();
  }

  public setPhone(phone: string): void {
    this.phone = phone;
    this.updateTimestamp();
  }

  public setFullName(fullName: string): void {
    this.fullName = fullName;
    this.updateTimestamp();
  }

  public setPassword(rawPassword: string): void {
    this.passwordHash = PasswordService.hashPassword(rawPassword);
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      email: this.email,
      passwordHash: this.passwordHash,
      role: this.role,
      fullName: this.fullName,
      phone: this.phone,
      failedLoginAttempts: this.failedLoginAttempts,
      isLocked: this.isLocked,
      lockedAt: this.lockedAt,
      companyId: this.companyId,
      candidateProfileId: this.candidateProfileId,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
