/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D & Clean Code İlkeleri - Sistem Enum Tanımlamaları
 */

export enum Role {
  ADMIN = 'ROLE_ADMIN', // İnsan Kaynakları Yetkilisi
  USER = 'ROLE_USER',   // İş Arayan / Aday
}

export enum MilitaryStatus {
  DONE = 'YAPILDI',                     // Askerlik Yapıldı
  EXEMPT = 'MUAF',                      // Askerlikten Muaf
  POSTPONED = 'TECİLLİ',                // Tecilli
  NOT_APPLICABLE = 'MUAF_KADIN_ADAY',   // Kadın Aday / Muaf
}

export enum EducationDegree {
  HIGH_SCHOOL = 'LİSE',
  ASSOCIATE = 'ÖN_LİSANS',
  BACHELOR = 'LİSANS',
  MASTER = 'YÜKSEK_LİSANS',
  DOCTORATE = 'DOKTORA',
}

export enum ApplicationStatus {
  NEW = 'YENİ_BAŞVURU',
  UNDER_REVIEW = 'İNCELEMEDE',
  INTERVIEW_SCHEDULED = 'MÜLAKAT_AŞAMASINDA',
  OFFERED = 'TEKLİF_YAPILDI',
  REJECTED = 'OLUMSUZ_DEĞERLENDİRİLDİ',
}

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY_AUDIT',
}

export enum ExperienceLevel {
  JUNIOR = 'JUNIOR (0-2 Yıl)',
  MID = 'MID-LEVEL (3-5 Yıl)',
  SENIOR = 'SENIOR (5+ Yıl)',
  LEAD = 'LEAD / PRINCIPAL (8+ Yıl)',
}
