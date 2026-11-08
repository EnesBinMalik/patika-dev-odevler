/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: ApplicationService
 * Manages Job Applications lifecycle, status transitions and candidate tracking
 */

import { DatabaseService } from './DatabaseService.ts';
import { LoggerService } from './LoggerService.ts';
import { Application } from '../entities/ApplicationEntity.ts';
import { ApplicationStatus, Role } from '../types/enums.ts';
import { Optional } from '../types/optional.ts';

export class ApplicationService {
  private static instance: ApplicationService | null = null;
  private db: DatabaseService;
  private logger: LoggerService;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  public static getInstance(): ApplicationService {
    if (!ApplicationService.instance) {
      ApplicationService.instance = new ApplicationService();
    }
    return ApplicationService.instance;
  }

  public getApplicationById(id: string): Optional<Application> {
    return this.db.applications.findById(id);
  }

  public getApplicationsByCandidate(candidateUserId: string): Application[] {
    return this.db.applications
      .findByCandidateUserId(candidateUserId)
      .sorted((a, b) => new Date(b.getAppliedAt()).getTime() - new Date(a.getAppliedAt()).getTime())
      .toList();
  }

  public getApplicationsByJob(jobId: string): Application[] {
    return this.db.applications
      .findByJobId(jobId)
      .sorted((a, b) => new Date(b.getAppliedAt()).getTime() - new Date(a.getAppliedAt()).getTime())
      .toList();
  }

  public getApplicationsByCompany(companyId: string): Application[] {
    return this.db.applications
      .findByCompanyId(companyId)
      .sorted((a, b) => new Date(b.getAppliedAt()).getTime() - new Date(a.getAppliedAt()).getTime())
      .toList();
  }

  public hasCandidateApplied(candidateUserId: string, jobId: string): boolean {
    return this.db.applications.hasApplied(candidateUserId, jobId);
  }

  /**
   * Submit new job application
   */
  public submitApplication(
    candidateUserId: string,
    jobId: string,
    coverLetter?: string
  ): { success: boolean; application?: Application; errorMessage?: string } {
    if (this.hasCandidateApplied(candidateUserId, jobId)) {
      return {
        success: false,
        errorMessage: 'Bu ilana zaten daha önce başvuruda bulundunuz.',
      };
    }

    const userOpt = this.db.users.findById(candidateUserId);
    const profileOpt = this.db.candidates.findByUserId(candidateUserId);
    const jobOpt = this.db.jobs.findById(jobId);

    if (userOpt.isEmpty() || profileOpt.isEmpty()) {
      return {
        success: false,
        errorMessage: 'Aday profili bulunamadı. Lütfen önce profilinizi tamamlayın.',
      };
    }

    if (jobOpt.isEmpty() || !jobOpt.get().getIsActive()) {
      return {
        success: false,
        errorMessage: 'İlan aktif değil veya bulunamadı.',
      };
    }

    const user = userOpt.get();
    const profile = profileOpt.get();
    const job = jobOpt.get();

    const application = new Application({
      jobId: job.getId(),
      jobTitle: job.getTitle(),
      companyId: job.getCompanyId(),
      companyName: job.getCompanyName(),
      candidateUserId: user.getId(),
      candidateProfileId: profile.getId(),
      candidateFullName: profile.getFullName(),
      candidateEmail: user.getEmail(),
      candidatePhone: profile.getPhone(),
      coverLetter: coverLetter || '',
      status: ApplicationStatus.APPLIED,
    });

    job.incrementApplicationCount();

    this.db.applications.save(application);
    this.db.jobs.save(job);
    this.db.notify();

    this.logger.audit(
      'APPLICATION_SUBMITTED',
      `${profile.getFullName()} adlı aday "${job.getTitle()}" pozisyonuna başvurdu.`,
      { id: user.getId(), email: user.getEmail(), role: Role.USER }
    );

    return {
      success: true,
      application,
    };
  }

  /**
   * Review application and update status
   */
  public updateApplicationStatus(
    applicationId: string,
    newStatus: ApplicationStatus,
    reviewerUserId: string,
    reviewerNote?: string
  ): boolean {
    const appOpt = this.db.applications.findById(applicationId);
    if (appOpt.isEmpty()) return false;

    const application = appOpt.get();
    const prevStatus = application.getStatus();
    application.updateStatus(newStatus, reviewerNote);

    this.db.applications.save(application);
    this.db.notify();

    const reviewer = this.db.users.findById(reviewerUserId);

    this.logger.audit(
      'APPLICATION_STATUS_UPDATED',
      `Başvuru durumu güncellendi: ${application.getCandidateFullName()} -> ${prevStatus} -> ${newStatus}. Not: ${reviewerNote || 'Yok'}`,
      reviewer.isPresent()
        ? { id: reviewer.get().getId(), email: reviewer.get().getEmail(), role: reviewer.get().getRole() }
        : undefined
    );

    return true;
  }
}
