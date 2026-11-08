/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility & Liskov Substitution
 * Aday CV İş Mantığı ve KVKK Saklama Süresi Servisi
 */

import { ICVService } from './interfaces/ICVService';
import { ICVRepository } from '../repositories/interfaces/ICVRepository';
import { CVRepository } from '../repositories/CVRepository';
import { CandidateCVEntity } from '../types/models';
import { Optional } from '../core/Optional';
import { AuditLogService } from './AuditLogService';
import { LogLevel } from '../types/enums';

export class CVService implements ICVService {
  private static instance: ICVService | null = null;
  private cvRepository: ICVRepository;
  private auditService: AuditLogService;

  private constructor() {
    this.cvRepository = new CVRepository();
    this.auditService = AuditLogService.getInstance();
  }

  public static getInstance(): ICVService {
    if (!CVService.instance) {
      CVService.instance = new CVService();
    }
    return CVService.instance;
  }

  public getCVByUserId(userId: string): Optional<CandidateCVEntity> {
    return this.cvRepository.findByUserId(userId);
  }

  public getCVById(id: string): Optional<CandidateCVEntity> {
    return this.cvRepository.findById(id);
  }

  public createOrUpdateCV(cv: CandidateCVEntity): CandidateCVEntity {
    const existing = this.cvRepository.findById(cv.id);
    let saved: CandidateCVEntity;

    if (existing.isPresent()) {
      saved = this.cvRepository.update(cv);
      this.auditService.log(
        'CV_GÜNCELLENDİ',
        `Aday ${cv.firstName} ${cv.lastName} CV bilgilerini ve KVKK süresini (${cv.kvkkExpiryDate}) güncelledi.`,
        LogLevel.INFO,
        { id: cv.userId, username: `${cv.firstName} ${cv.lastName}`, role: 'ROLE_USER' as any }
      );
    } else {
      saved = this.cvRepository.save(cv);
      this.auditService.log(
        'CV_OLUŞTURULDU',
        `Yeni CV profili oluşturuldu: ${cv.firstName} ${cv.lastName}`,
        LogLevel.INFO,
        { id: cv.userId, username: `${cv.firstName} ${cv.lastName}`, role: 'ROLE_USER' as any }
      );
    }

    return saved;
  }

  public validateKvkkValidity(cv: CandidateCVEntity): { isValid: boolean; remainingDays: number } {
    if (!cv.kvkkConsentGiven || !cv.kvkkExpiryDate) {
      return { isValid: false, remainingDays: 0 };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(cv.kvkkExpiryDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry.getTime() - today.getTime();
    const remainingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      isValid: remainingDays > 0,
      remainingDays: Math.max(0, remainingDays),
    };
  }
}
