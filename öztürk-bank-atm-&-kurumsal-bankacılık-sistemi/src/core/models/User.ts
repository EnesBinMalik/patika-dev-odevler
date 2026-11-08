/**
 * User Entity & Subclasses
 * OOP: Inheritance, Encapsulation, Polymorphism
 * Mimar: Enes Öztürk
 */

import { BaseEntity } from '../oop/abstracts';
import { IUserEntity } from '../oop/interfaces';
import { UserRole } from '../enums';

export class User extends BaseEntity implements IUserEntity {
  public tcNo: string;
  public fullName: string;
  public email: string;
  public phone: string;
  public passwordHash: string; // Hashlenmiş şifre
  public role: UserRole;
  public isBlocked: boolean;
  public failedLoginAttempts: number;
  public lastLoginDate?: string;
  public adminId?: string; // 1-N ilişkisi için (Şube/Banka Admin ID)

  constructor(
    tcNo: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    role: UserRole = UserRole.CUSTOMER,
    isBlocked: boolean = false,
    failedLoginAttempts: number = 0,
    lastLoginDate?: string,
    adminId?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(id, createdAt, updatedAt);
    this.tcNo = tcNo;
    this.fullName = fullName;
    this.email = email;
    this.phone = phone;
    this.passwordHash = passwordHash;
    this.role = role;
    this.isBlocked = isBlocked;
    this.failedLoginAttempts = failedLoginAttempts;
    this.lastLoginDate = lastLoginDate;
    this.adminId = adminId;
  }

  public incrementFailedAttempts(): number {
    this.failedLoginAttempts += 1;
    if (this.failedLoginAttempts >= 3) {
      this.isBlocked = true;
    }
    this.touch();
    return this.failedLoginAttempts;
  }

  public resetFailedAttempts(): void {
    this.failedLoginAttempts = 0;
    this.lastLoginDate = new Date().toISOString();
    this.touch();
  }

  public unblock(): void {
    this.isBlocked = false;
    this.failedLoginAttempts = 0;
    this.touch();
  }

  public isCustomer(): boolean {
    return this.role === UserRole.CUSTOMER;
  }

  public isAdmin(): boolean {
    return this.role === UserRole.ADMIN;
  }

  public static fromJSON(json: Record<string, unknown>): User {
    return new User(
      String(json.tcNo || ''),
      String(json.fullName || ''),
      String(json.email || ''),
      String(json.phone || ''),
      String(json.passwordHash || ''),
      (json.role as UserRole) || UserRole.CUSTOMER,
      Boolean(json.isBlocked || false),
      Number(json.failedLoginAttempts || 0),
      json.lastLoginDate ? String(json.lastLoginDate) : undefined,
      json.adminId ? String(json.adminId) : undefined,
      json.id ? String(json.id) : undefined,
      json.createdAt ? String(json.createdAt) : undefined,
      json.updatedAt ? String(json.updatedAt) : undefined
    );
  }
}

export class CustomerUser extends User {
  public preferredBranch: string;

  constructor(
    tcNo: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    preferredBranch: string = 'Öztürk Bank Merkez Şube',
    isBlocked: boolean = false,
    failedLoginAttempts: number = 0,
    lastLoginDate?: string,
    adminId?: string,
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(
      tcNo,
      fullName,
      email,
      phone,
      passwordHash,
      UserRole.CUSTOMER,
      isBlocked,
      failedLoginAttempts,
      lastLoginDate,
      adminId,
      id,
      createdAt,
      updatedAt
    );
    this.preferredBranch = preferredBranch;
  }
}

export class AdminUser extends User {
  public staffCode: string;
  public department: string;

  constructor(
    tcNo: string,
    fullName: string,
    email: string,
    phone: string,
    passwordHash: string,
    staffCode: string = 'OZ-ADM-001',
    department: string = 'Genel Müdürlük / ATM Operasyon',
    id?: string,
    createdAt?: string,
    updatedAt?: string
  ) {
    super(
      tcNo,
      fullName,
      email,
      phone,
      passwordHash,
      UserRole.ADMIN,
      false,
      0,
      undefined,
      undefined,
      id,
      createdAt,
      updatedAt
    );
    this.staffCode = staffCode;
    this.department = department;
  }
}
