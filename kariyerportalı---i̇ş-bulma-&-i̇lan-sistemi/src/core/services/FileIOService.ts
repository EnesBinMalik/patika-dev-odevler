/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: FileIOService
 * Implements I/O operations: File Export & Import (JSON, SQL Schema DDL/DML, Logback .log, and CV files)
 */

import { DatabaseService } from './DatabaseService.ts';
import { LoggerService } from './LoggerService.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { User } from '../entities/UserEntity.ts';
import { Role } from '../types/enums.ts';

export class FileIOService {
  private static instance: FileIOService | null = null;
  private db: DatabaseService;
  private logger: LoggerService;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  public static getInstance(): FileIOService {
    if (!FileIOService.instance) {
      FileIOService.instance = new FileIOService();
    }
    return FileIOService.instance;
  }

  /**
   * Helper to trigger browser file download without third-party dependencies
   */
  private triggerDownload(content: string, filename: string, mimeType: string = 'application/json'): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Export Entire Database to JSON File
   */
  public exportDatabaseJSON(): void {
    const dump = this.db.exportDatabaseToJSON();
    const jsonStr = JSON.stringify(dump, null, 2);
    const timestamp = new Date().toISOString().slice(0, 10);
    this.triggerDownload(jsonStr, `kariyer_portali_database_dump_${timestamp}.json`, 'application/json');

    this.logger.audit('DATABASE_EXPORT_JSON', `Veritabanı JSON formatında dışa aktarıldı (${Object.keys(dump.tables).length} tablo).`);
  }

  /**
   * Export Database to SQL DDL + DML Script (PostgreSQL / H2 / MySQL compatible)
   */
  public exportDatabaseSQL(): void {
    const tables = this.db.exportDatabaseToJSON().tables;
    const now = new Date().toISOString();

    let sql = `-- =====================================================================\n`;
    sql += `-- KARIYER PORTALI - RELATIONAL DATABASE DDL & DML SCRIPT\n`;
    sql += `-- Mimar: Enes Öztürk | Target: PostgreSQL / MySQL / H2 Database\n`;
    sql += `-- Export Date: ${now}\n`;
    sql += `-- =====================================================================\n\n`;

    // DDL: Schema creation
    sql += `-- [DDL] CREATE TABLES WITH CONSTRAINTS AND FOREIGN KEYS\n`;
    sql += `CREATE TABLE IF NOT EXISTS users (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    email VARCHAR(120) NOT NULL UNIQUE,\n`;
    sql += `    password_hash VARCHAR(255) NOT NULL,\n`;
    sql += `    role VARCHAR(20) NOT NULL,\n`;
    sql += `    full_name VARCHAR(100) NOT NULL,\n`;
    sql += `    phone VARCHAR(30) NOT NULL,\n`;
    sql += `    failed_login_attempts INT DEFAULT 0,\n`;
    sql += `    is_locked BOOLEAN DEFAULT FALSE,\n`;
    sql += `    locked_at TIMESTAMP NULL,\n`;
    sql += `    company_id VARCHAR(64) NULL,\n`;
    sql += `    candidate_profile_id VARCHAR(64) NULL,\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS candidate_profiles (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    user_id VARCHAR(64) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE,\n`;
    sql += `    first_name VARCHAR(50) NOT NULL,\n`;
    sql += `    last_name VARCHAR(50) NOT NULL,\n`;
    sql += `    phone VARCHAR(30) NOT NULL,\n`;
    sql += `    city VARCHAR(50) NOT NULL,\n`;
    sql += `    military_status VARCHAR(20) NOT NULL,\n`;
    sql += `    military_exempt_reason VARCHAR(255) NULL,\n`;
    sql += `    experience_years INT NOT NULL DEFAULT 0,\n`;
    sql += `    current_title VARCHAR(120) NOT NULL,\n`;
    sql += `    bio TEXT NULL,\n`;
    sql += `    skills JSONB NULL,\n`;
    sql += `    work_experiences JSONB NULL,\n`;
    sql += `    educations JSONB NULL,\n`;
    sql += `    cv_file_name VARCHAR(255) NULL,\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS companies (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    name VARCHAR(150) NOT NULL,\n`;
    sql += `    industry VARCHAR(100) NOT NULL,\n`;
    sql += `    tax_number VARCHAR(30) NOT NULL UNIQUE,\n`;
    sql += `    website VARCHAR(255) NULL,\n`;
    sql += `    city VARCHAR(50) NOT NULL,\n`;
    sql += `    address TEXT NULL,\n`;
    sql += `    employee_count VARCHAR(50) NULL,\n`;
    sql += `    description TEXT NULL,\n`;
    sql += `    admin_user_id VARCHAR(64) NOT NULL REFERENCES users(id),\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS job_postings (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    company_id VARCHAR(64) NOT NULL REFERENCES companies(id) ON DELETE CASCADE,\n`;
    sql += `    company_name VARCHAR(150) NOT NULL,\n`;
    sql += `    title VARCHAR(150) NOT NULL,\n`;
    sql += `    department VARCHAR(100) NOT NULL,\n`;
    sql += `    city VARCHAR(50) NOT NULL,\n`;
    sql += `    work_type VARCHAR(20) NOT NULL,\n`;
    sql += `    experience_level VARCHAR(20) NOT NULL,\n`;
    sql += `    min_experience_years INT NOT NULL DEFAULT 0,\n`;
    sql += `    military_requirement VARCHAR(20) NOT NULL DEFAULT 'ANY',\n`;
    sql += `    salary_min NUMERIC(12,2) NULL,\n`;
    sql += `    salary_max NUMERIC(12,2) NULL,\n`;
    sql += `    currency VARCHAR(10) DEFAULT 'TL',\n`;
    sql += `    skills_required JSONB NULL,\n`;
    sql += `    description TEXT NOT NULL,\n`;
    sql += `    requirements JSONB NULL,\n`;
    sql += `    is_active BOOLEAN DEFAULT TRUE,\n`;
    sql += `    application_count INT DEFAULT 0,\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS job_applications (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    job_id VARCHAR(64) NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,\n`;
    sql += `    company_id VARCHAR(64) NOT NULL REFERENCES companies(id),\n`;
    sql += `    candidate_user_id VARCHAR(64) NOT NULL REFERENCES users(id),\n`;
    sql += `    candidate_profile_id VARCHAR(64) NOT NULL REFERENCES candidate_profiles(id),\n`;
    sql += `    status VARCHAR(30) NOT NULL DEFAULT 'APPLIED',\n`;
    sql += `    cover_letter TEXT NULL,\n`;
    sql += `    notes TEXT NULL,\n`;
    sql += `    applied_at TIMESTAMP NOT NULL,\n`;
    sql += `    reviewed_at TIMESTAMP NULL,\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    sql += `CREATE TABLE IF NOT EXISTS audit_logs (\n`;
    sql += `    id VARCHAR(64) PRIMARY KEY,\n`;
    sql += `    level VARCHAR(20) NOT NULL,\n`;
    sql += `    action VARCHAR(80) NOT NULL,\n`;
    sql += `    user_id VARCHAR(64) NULL,\n`;
    sql += `    user_email VARCHAR(120) NULL,\n`;
    sql += `    role VARCHAR(20) NULL,\n`;
    sql += `    details TEXT NOT NULL,\n`;
    sql += `    ip_address VARCHAR(45) NOT NULL,\n`;
    sql += `    created_at TIMESTAMP NOT NULL,\n`;
    sql += `    updated_at TIMESTAMP NOT NULL,\n`;
    sql += `    version INT DEFAULT 1\n`;
    sql += `);\n\n`;

    // DML: Inserts for current data
    sql += `-- [DML] INSERT INITIAL SEED DATA\n`;
    tables.users.forEach((u: any) => {
      sql += `INSERT INTO users (id, email, password_hash, role, full_name, phone, failed_login_attempts, is_locked, created_at, updated_at) VALUES ('${u.id}', '${u.email}', '${u.passwordHash}', '${u.role}', '${u.fullName}', '${u.phone}', ${u.failedLoginAttempts}, ${u.isLocked}, '${u.createdAt}', '${u.updatedAt}');\n`;
    });
    sql += `\n`;

    tables.candidate_profiles.forEach((c: any) => {
      sql += `INSERT INTO candidate_profiles (id, user_id, first_name, last_name, phone, city, military_status, experience_years, current_title, created_at, updated_at) VALUES ('${c.id}', '${c.userId}', '${c.firstName}', '${c.lastName}', '${c.phone}', '${c.city}', '${c.militaryStatus}', ${c.experienceYears}, '${c.currentTitle.replace(/'/g, "''")}', '${c.createdAt}', '${c.updatedAt}');\n`;
    });
    sql += `\n`;

    tables.companies.forEach((cmp: any) => {
      sql += `INSERT INTO companies (id, name, industry, tax_number, city, admin_user_id, created_at, updated_at) VALUES ('${cmp.id}', '${cmp.name.replace(/'/g, "''")}', '${cmp.industry}', '${cmp.taxNumber}', '${cmp.city}', '${cmp.adminUserId}', '${cmp.createdAt}', '${cmp.updatedAt}');\n`;
    });
    sql += `\n`;

    tables.job_postings.forEach((j: any) => {
      sql += `INSERT INTO job_postings (id, company_id, company_name, title, department, city, work_type, experience_level, min_experience_years, military_requirement, is_active, created_at, updated_at) VALUES ('${j.id}', '${j.companyId}', '${j.companyName.replace(/'/g, "''")}', '${j.title.replace(/'/g, "''")}', '${j.department}', '${j.city}', '${j.workType}', '${j.experienceLevel}', ${j.minExperienceYears}, '${j.militaryRequirement}', ${j.isActive}, '${j.createdAt}', '${j.updatedAt}');\n`;
    });
    sql += `\n`;

    const timestamp = new Date().toISOString().slice(0, 10);
    this.triggerDownload(sql, `kariyer_portali_schema_${timestamp}.sql`, 'text/plain');
    this.logger.audit('DATABASE_EXPORT_SQL', 'Veritabanı ilişkisel SQL şeması ve DDL/DML scripti dışa aktarıldı.');
  }

  /**
   * Export Spring Boot Audit Log file (.log)
   */
  public exportLogFile(): void {
    const logContent = this.logger.exportLogFileContent();
    const timestamp = new Date().toISOString().slice(0, 10);
    this.triggerDownload(logContent, `spring_boot_audit_${timestamp}.log`, 'text/plain');
  }

  /**
   * Export Candidate CV as formatted text file
   */
  public exportCandidateCV(candidate: CandidateProfile, user?: User): void {
    const divider = '========================================================================\n';
    let cv = `${divider}`;
    cv += `ÖZGEÇMİŞ / CURRICULUM VITAE (CV)\n`;
    cv += `KariyerPortalı - Aday İstihdam Belgesi\n`;
    cv += `Sistem Mimarı: Enes Öztürk\n`;
    cv += `${divider}\n`;

    cv += `KİŞİSEL BİLGİLER\n`;
    cv += `Ad Soyad        : ${candidate.getFullName()}\n`;
    cv += `E-Posta         : ${user?.getEmail() || 'Belirtilmedi'}\n`;
    cv += `Telefon         : ${candidate.getPhone()}\n`;
    cv += `Şehir           : ${candidate.getCity()}\n`;
    cv += `Mevcut Unvan    : ${candidate.getCurrentTitle()}\n`;
    cv += `Toplam Deneyim  : ${candidate.getExperienceYears()} Yıl\n`;
    cv += `Askerlik Durumu : ${candidate.getMilitaryStatus()} ${candidate.getMilitaryExemptReason() ? '(' + candidate.getMilitaryExemptReason() + ')' : ''}\n\n`;

    if (candidate.getBio()) {
      cv += `ÖZET / HAKKINDA\n${candidate.getBio()}\n\n`;
    }

    cv += `TEKNOLOJİK YETENEKLER\n`;
    cv += `${candidate.getSkills().join(' • ')}\n\n`;

    cv += `İŞ VE ÇALIŞMA DENEYİMLERİ\n`;
    const exps = candidate.getWorkExperiences();
    if (exps.length === 0) {
      cv += `Belirtilmiş iş deneyimi bulunmuyor.\n\n`;
    } else {
      exps.forEach((exp, idx) => {
        cv += `${idx + 1}. ${exp.companyName} - ${exp.title}\n`;
        cv += `   Dönem: ${exp.startDate} -> ${exp.isCurrent ? 'Halen Devam Ediyor' : exp.endDate || 'Bitiş'}\n`;
        cv += `   Açıklama: ${exp.description}\n\n`;
      });
    }

    cv += `EĞİTİM BİLGİLERİ\n`;
    const edus = candidate.getEducations();
    if (edus.length === 0) {
      cv += `Belirtilmiş eğitim bilgisi bulunmuyor.\n\n`;
    } else {
      edus.forEach((edu, idx) => {
        cv += `${idx + 1}. ${edu.institution} (${edu.degree} - ${edu.department}) - Mezuniyet: ${edu.graduationYear}\n`;
      });
    }

    cv += `\n${divider}`;
    cv += `Oluşturulma Tarihi: ${new Date().toLocaleString('tr-TR')}\n`;

    const safeName = candidate.getFullName().toLowerCase().replace(/\s+/g, '_');
    this.triggerDownload(cv, `CV_${safeName}.txt`, 'text/plain');

    this.logger.info(
      'CV_EXPORTED',
      `${candidate.getFullName()} adayının CV belgesi dışa aktarıldı.`,
      user ? { id: user.getId(), email: user.getEmail(), role: user.getRole() } : undefined
    );
  }

  /**
   * Import Database from JSON File
   */
  public importDatabaseJSON(fileContent: string): { success: boolean; message: string } {
    try {
      const dump = JSON.parse(fileContent);
      if (!dump || !dump.tables) {
        return {
          success: false,
          message: 'Geçersiz veritabanı JSON formatı! "tables" kök nesnesi bulunamadı.',
        };
      }
      this.db.hydrateFromJSON(dump);
      this.db.saveToStorage();
      this.db.notify();

      this.logger.audit(
        'DATABASE_IMPORTED',
        `Veritabanı harici JSON dosyasından başarıyla içe aktarıldı. (Sürüm: ${dump.version || '1.0.0'})`
      );

      return {
        success: true,
        message: 'Veritabanı başarıyla içe aktarıldı ve tablolar güncellendi.',
      };
    } catch (err: any) {
      return {
        success: false,
        message: `JSON ayrıştırma hatası: ${err.message || 'Bilinmeyen hata'}`,
      };
    }
  }
}
