/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Pattern: Factory Pattern for Entity Creation and Audit Logging
 */

import { User } from '../entities/UserEntity.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { Company } from '../entities/CompanyEntity.ts';
import { AuditLog } from '../entities/AuditLogEntity.ts';
import { Role, MilitaryStatus, LogLevel } from '../types/enums.ts';
import { PasswordService } from '../security/PasswordService.ts';

export class UserFactory {
  /**
   * Factory method to create a Candidate (Job Seeker) User & Profile
   */
  public static createCandidate(params: {
    email: string;
    rawPassword: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    militaryStatus: MilitaryStatus;
    experienceYears: number;
    currentTitle: string;
    skills?: string[];
  }): { user: User; profile: CandidateProfile } {
    const passwordHash = PasswordService.hashPassword(params.rawPassword);
    const fullName = `${params.firstName} ${params.lastName}`;

    const user = new User({
      email: params.email,
      passwordHash,
      role: Role.USER,
      fullName,
      phone: params.phone,
    });

    const profile = new CandidateProfile({
      userId: user.getId(),
      firstName: params.firstName,
      lastName: params.lastName,
      phone: params.phone,
      city: params.city,
      militaryStatus: params.militaryStatus,
      experienceYears: params.experienceYears,
      currentTitle: params.currentTitle,
      skills: params.skills || [],
    });

    user.setCandidateProfileId(profile.getId());

    return { user, profile };
  }

  /**
   * Factory method to create an Employer / Admin User & Company
   */
  public static createEmployerAdmin(params: {
    email: string;
    rawPassword: string;
    fullName: string;
    phone: string;
    companyName: string;
    industry: string;
    taxNumber: string;
    city: string;
    website?: string;
  }): { user: User; company: Company } {
    const passwordHash = PasswordService.hashPassword(params.rawPassword);

    const user = new User({
      email: params.email,
      passwordHash,
      role: Role.ADMIN,
      fullName: params.fullName,
      phone: params.phone,
    });

    const company = new Company({
      name: params.companyName,
      industry: params.industry,
      taxNumber: params.taxNumber,
      city: params.city,
      website: params.website,
      adminUserId: user.getId(),
    });

    user.setCompanyId(company.getId());

    return { user, company };
  }
}

export class LogFactory {
  public static createInfo(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    return new AuditLog({
      level: LogLevel.INFO,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
  }

  public static createSecurity(action: string, details: string, email?: string): AuditLog {
    return new AuditLog({
      level: LogLevel.SECURITY,
      action,
      details,
      userEmail: email,
    });
  }

  public static createWarning(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    return new AuditLog({
      level: LogLevel.WARN,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
  }

  public static createAudit(action: string, details: string, user?: { id?: string; email?: string; role?: Role }): AuditLog {
    return new AuditLog({
      level: LogLevel.AUDIT,
      action,
      details,
      userId: user?.id,
      userEmail: user?.email,
      role: user?.role,
    });
  }
}
