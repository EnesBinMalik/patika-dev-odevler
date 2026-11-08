/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D & Clean Code İlkeleri - Varlık (Entity) ve Model Tanımlamaları
 */

import { Role, MilitaryStatus, EducationDegree, ApplicationStatus, LogLevel } from './enums';

/**
 * OOP Kalıtım (Inheritance) Temeli: Abstract BaseEntity
 * Tüm veritabanı varlıkları bu sınıftan türetilir.
 */
export abstract class BaseEntity {
  public id: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(id?: string, createdAt?: string, updatedAt?: string) {
    const now = new Date().toISOString();
    this.id = id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `id_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }

  public touch(): void {
    this.updatedAt = new Date().toISOString();
  }
}

/**
 * User Entity - Sistem Kullanıcısı
 * Spring Data @OneToMany / @ManyToOne İlişkisi:
 * Admin(1) - User(N): adminId ile bağlıdır.
 */
export class UserEntity extends BaseEntity {
  public username: string;
  public email: string;
  public passwordHash: string; // Veritabanında maskelenmiş/tuzlanmış şifre
  public role: Role;
  public isBlocked: boolean;
  public failedLoginAttempts: number; // 3 denemeden sonra bloke olur
  public adminId: string | null; // Atanmış İK Yetkilisi (ManyToOne)
  public lastLoginAt: string | null;

  constructor(params: {
    id?: string;
    username: string;
    email: string;
    passwordHash: string;
    role: Role;
    isBlocked?: boolean;
    failedLoginAttempts?: number;
    adminId?: string | null;
    lastLoginAt?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.username = params.username;
    this.email = params.email;
    this.passwordHash = params.passwordHash;
    this.role = params.role;
    this.isBlocked = params.isBlocked ?? false;
    this.failedLoginAttempts = params.failedLoginAttempts ?? 0;
    this.adminId = params.adminId ?? null;
    this.lastLoginAt = params.lastLoginAt ?? null;
  }
}

export interface IExperience {
  id: string;
  companyName: string;
  position: string;
  startDate: string;
  endDate: string; // "Devam Ediyor" veya tarih
  years: number;
  description: string;
}

export interface IEducation {
  id: string;
  schoolName: string;
  department: string;
  degree: EducationDegree;
  startYear: number;
  graduationYear: number | null; // null ise devam ediyor
}

export interface ISkill {
  name: string;
  level: number; // 1-5 arası
}

/**
 * CandidateCV Entity - Aday CV Varlığı
 * User ile 1:1 ilişki, Admin ile N:1 ilişki
 */
export class CandidateCVEntity extends BaseEntity {
  public userId: string;             // İlişkili User (FK)
  public firstName: string;          // Ad
  public lastName: string;           // Soyad
  public phone: string;              // Telefon no
  public email: string;              // İletişim e-posta
  public city: string;               // Şehir
  public title: string;              // Ünvan (Örn: Kıdemli Full-Stack Geliştirici)
  public summary: string;            // Özet önyazı
  public totalExperienceYears: number; // Toplam iş deneyimi (yıl)
  public militaryStatus: MilitaryStatus; // Askerlik durumu (Enum)
  public kvkkConsentGiven: boolean;   // KVKK Onayı
  public kvkkExpiryDate: string;     // CV ne zamana kadar saklanabilir (KVKK Saklama Süresi)
  public applicationStatus: ApplicationStatus; // Başvuru Durumu (Enum)
  public experiences: IExperience[]; // İş ve çalışma deneyimleri
  public educations: IEducation[];   // Eğitim bilgileri
  public skills: string[];           // Yetenekler
  public languages: string[];        // Diller
  public hrNotes: string | null;     // İnsan Kaynakları Notu

  constructor(params: {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    city: string;
    title: string;
    summary: string;
    totalExperienceYears: number;
    militaryStatus: MilitaryStatus;
    kvkkConsentGiven: boolean;
    kvkkExpiryDate: string;
    applicationStatus?: ApplicationStatus;
    experiences?: IExperience[];
    educations?: IEducation[];
    skills?: string[];
    languages?: string[];
    hrNotes?: string | null;
    createdAt?: string;
    updatedAt?: string;
  }) {
    super(params.id, params.createdAt, params.updatedAt);
    this.userId = params.userId;
    this.firstName = params.firstName;
    this.lastName = params.lastName;
    this.phone = params.phone;
    this.email = params.email;
    this.city = params.city;
    this.title = params.title;
    this.summary = params.summary;
    this.totalExperienceYears = params.totalExperienceYears;
    this.militaryStatus = params.militaryStatus;
    this.kvkkConsentGiven = params.kvkkConsentGiven;
    this.kvkkExpiryDate = params.kvkkExpiryDate;
    this.applicationStatus = params.applicationStatus ?? ApplicationStatus.NEW;
    this.experiences = params.experiences || [];
    this.educations = params.educations || [];
    this.skills = params.skills || [];
    this.languages = params.languages || [];
    this.hrNotes = params.hrNotes ?? null;
  }
}

/**
 * Audit Log Entity - Sistem Denetim ve İşlem Günlüğü
 */
export class AuditLogEntity extends BaseEntity {
  public action: string;
  public userId: string | null;
  public username: string;
  public role: Role | 'ANONYMOUS';
  public level: LogLevel;
  public details: string;
  public ipAddress: string;

  constructor(params: {
    id?: string;
    action: string;
    userId?: string | null;
    username: string;
    role: Role | 'ANONYMOUS';
    level: LogLevel;
    details: string;
    ipAddress?: string;
    createdAt?: string;
  }) {
    super(params.id, params.createdAt);
    this.action = params.action;
    this.userId = params.userId ?? null;
    this.username = params.username;
    this.role = params.role;
    this.level = params.level;
    this.details = params.details;
    this.ipAddress = params.ipAddress || '192.168.1.100 (Yerel Ağ)';
  }
}

/**
 * İK Filtreleme Kriterleri (Database Filter DTO)
 */
export interface FilterCriteria {
  searchTerm?: string;
  militaryStatus?: MilitaryStatus | 'ALL';
  minExperienceYears?: number;
  maxExperienceYears?: number;
  city?: string | 'ALL';
  applicationStatus?: ApplicationStatus | 'ALL';
  skillKeyword?: string;
  onlyActiveKvkk?: boolean;
}

/**
 * Spring Data Paging Modeli (Page<T>)
 */
export interface Page<T> {
  content: T[];
  pageNumber: number; // 0-indexed veya 1-indexed
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface Pageable {
  page: number; // 1'den başlar
  size: number;
}
