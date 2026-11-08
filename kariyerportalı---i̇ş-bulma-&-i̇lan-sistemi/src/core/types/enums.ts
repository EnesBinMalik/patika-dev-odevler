/**
 * @license
 * Enes Öztürk - KariyerPortalı & İstihdam Sistemi
 * Core Domain Enums
 */

export enum Role {
  ADMIN = 'ADMIN', // Şirket / İşveren Yetkilisi
  USER = 'USER',   // İş Arayan / Aday
}

export enum MilitaryStatus {
  DONE = 'DONE',         // Yapıldı
  EXEMPT = 'EXEMPT',     // Muaf
  DEFERRED = 'DEFERRED', // Tecilli
  NOT_DONE = 'NOT_DONE', // Yapılmadı
}

export const MilitaryStatusLabels: Record<MilitaryStatus, string> = {
  [MilitaryStatus.DONE]: 'Yapıldı',
  [MilitaryStatus.EXEMPT]: 'Muaf',
  [MilitaryStatus.DEFERRED]: 'Tecilli',
  [MilitaryStatus.NOT_DONE]: 'Yapılmadı / Tecilsiz',
};

export enum WorkType {
  REMOTE = 'REMOTE',   // Uzaktan / Remote
  HYBRID = 'HYBRID',   // Hibrit
  ONSITE = 'ONSITE',   // Ofis / İş Yerinde
}

export const WorkTypeLabels: Record<WorkType, string> = {
  [WorkType.REMOTE]: 'Uzaktan (Remote)',
  [WorkType.HYBRID]: 'Hibrit',
  [WorkType.ONSITE]: 'Ofis (Yerinde)',
};

export enum ExperienceLevel {
  JUNIOR = 'JUNIOR',   // 0 - 2 Yıl
  MID = 'MID',         // 2 - 5 Yıl
  SENIOR = 'SENIOR',   // 5+ Yıl
  LEAD = 'LEAD',       // 8+ Yıl
}

export const ExperienceLevelLabels: Record<ExperienceLevel, string> = {
  [ExperienceLevel.JUNIOR]: 'Junior (0-2 Yıl)',
  [ExperienceLevel.MID]: 'Mid-Level (2-5 Yıl)',
  [ExperienceLevel.SENIOR]: 'Senior (5+ Yıl)',
  [ExperienceLevel.LEAD]: 'Lead / Principal (8+ Yıl)',
};

export enum ApplicationStatus {
  APPLIED = 'APPLIED',       // Başvuruldu
  REVIEWING = 'REVIEWING',   // İncelemede
  INTERVIEW = 'INTERVIEW',   // Mülakata Çağrıldı
  ACCEPTED = 'ACCEPTED',     // Kabul Edildi
  REJECTED = 'REJECTED',     // Reddedildi
}

export const ApplicationStatusLabels: Record<ApplicationStatus, string> = {
  [ApplicationStatus.APPLIED]: 'Başvuruldu',
  [ApplicationStatus.REVIEWING]: 'İnceleniyor',
  [ApplicationStatus.INTERVIEW]: 'Mülakat Aşaması',
  [ApplicationStatus.ACCEPTED]: 'Teklif / Kabul',
  [ApplicationStatus.REJECTED]: 'Reddedildi',
};

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  SECURITY = 'SECURITY',
  AUDIT = 'AUDIT',
}
