/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility & Interface Segregation
 * İnsan Kaynakları Yönetim Servisi (Database Filtreleme, Paging, Bloke Hesap Yönetimi)
 */

import { IAdminHRService } from './interfaces/IAdminHRService';
import { ICVRepository } from '../repositories/interfaces/ICVRepository';
import { IUserRepository } from '../repositories/interfaces/IUserRepository';
import { CVRepository } from '../repositories/CVRepository';
import { UserRepository } from '../repositories/UserRepository';
import { CandidateCVEntity, FilterCriteria, Page, Pageable, UserEntity } from '../types/models';
import { ApplicationStatus, MilitaryStatus, LogLevel } from '../types/enums';
import { AuditLogService } from './AuditLogService';
import { AuthService } from './AuthService';

export class AdminHRService implements IAdminHRService {
  private static instance: AdminHRService | null = null;
  private cvRepository: ICVRepository;
  private userRepository: IUserRepository;
  private auditService: AuditLogService;

  private constructor() {
    this.cvRepository = new CVRepository();
    this.userRepository = new UserRepository();
    this.auditService = AuditLogService.getInstance();
  }

  public static getInstance(): AdminHRService {
    if (!AdminHRService.instance) {
      AdminHRService.instance = new AdminHRService();
    }
    return AdminHRService.instance;
  }

  public searchCandidates(criteria: FilterCriteria, pageable: Pageable): Page<CandidateCVEntity> {
    const page = this.cvRepository.findPage(criteria, pageable);
    
    // Filtreleme yapıldığında log tut (Sistem gereksinimi: "Yapılan her bir işlem için mutlaka loglama")
    if (criteria.militaryStatus || criteria.minExperienceYears || criteria.searchTerm || criteria.skillKeyword) {
      this.auditService.log(
        'İK_FİLTRELEME_SORGUSU',
        `Veritabanı Arama Sorgusu: Askerlik=[${criteria.militaryStatus || 'TÜMÜ'}], MinDeneyim=[${criteria.minExperienceYears || 0} yıl], Arama='${criteria.searchTerm || '-'}', Sonuç=${page.totalElements} aday`,
        LogLevel.INFO
      );
    }

    return page;
  }

  public updateCandidateStatus(cvId: string, newStatus: ApplicationStatus, hrNotes?: string): CandidateCVEntity {
    const cvOpt = this.cvRepository.findById(cvId);
    if (cvOpt.isEmpty()) {
      throw new Error(`Aday CV bulunamadı! ID: ${cvId}`);
    }

    const cv = cvOpt.get();
    const oldStatus = cv.applicationStatus;
    cv.applicationStatus = newStatus;
    if (hrNotes !== undefined) {
      cv.hrNotes = hrNotes;
    }

    const updated = this.cvRepository.update(cv);

    this.auditService.log(
      'ADAY_DURUMU_GÜNCELLENDİ',
      `${cv.firstName} ${cv.lastName} için başvuru durumu '${oldStatus}' -> '${newStatus}' olarak değiştirildi.`,
      LogLevel.INFO
    );

    return updated;
  }

  public getBlockedUsers(): UserEntity[] {
    return this.userRepository.findBlockedUsers();
  }

  public unblockUserAccount(userId: string): boolean {
    const authService = AuthService.getInstance();
    return authService.unblockUser(userId);
  }

  public getHRDashboardStats(): {
    totalCandidates: number;
    completedMilitary: number;
    seniorCount: number;
    pendingReviews: number;
    blockedUsersCount: number;
  } {
    const all = this.cvRepository.findAll();
    const blocked = this.getBlockedUsers();

    return {
      totalCandidates: all.length,
      completedMilitary: all.filter((c) => c.militaryStatus === MilitaryStatus.DONE).length,
      seniorCount: all.filter((c) => c.totalExperienceYears >= 5).length,
      pendingReviews: all.filter((c) => c.applicationStatus === ApplicationStatus.NEW || c.applicationStatus === ApplicationStatus.UNDER_REVIEW).length,
      blockedUsersCount: blocked.length,
    };
  }
}
