/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: Application (JPA @Entity @Table(name = "job_applications"))
 * Relation: @ManyToOne JobPosting, @ManyToOne CandidateUser
 */

import { BaseEntity } from './BaseEntity.ts';
import { ApplicationStatus } from '../types/enums.ts';

export class Application extends BaseEntity {
  private jobId: string;
  private jobTitle: string;
  private companyId: string;
  private companyName: string;
  private candidateUserId: string;
  private candidateProfileId: string;
  private candidateFullName: string;
  private candidateEmail: string;
  private candidatePhone: string;
  private status: ApplicationStatus;
  private coverLetter: string;
  private notes: string;
  private appliedAt: string;
  private reviewedAt?: string;

  constructor(params: {
    id?: string;
    jobId: string;
    jobTitle: string;
    companyId: string;
    companyName: string;
    candidateUserId: string;
    candidateProfileId: string;
    candidateFullName: string;
    candidateEmail: string;
    candidatePhone: string;
    status?: ApplicationStatus;
    coverLetter?: string;
    notes?: string;
    appliedAt?: string;
    reviewedAt?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.jobId = params.jobId;
    this.jobTitle = params.jobTitle.trim();
    this.companyId = params.companyId;
    this.companyName = params.companyName.trim();
    this.candidateUserId = params.candidateUserId;
    this.candidateProfileId = params.candidateProfileId;
    this.candidateFullName = params.candidateFullName.trim();
    this.candidateEmail = params.candidateEmail.toLowerCase().trim();
    this.candidatePhone = params.candidatePhone.trim();
    this.status = params.status || ApplicationStatus.APPLIED;
    this.coverLetter = params.coverLetter || '';
    this.notes = params.notes || '';
    this.appliedAt = params.appliedAt || new Date().toISOString();
    this.reviewedAt = params.reviewedAt;
  }

  // Getters
  public getJobId(): string { return this.jobId; }
  public getJobTitle(): string { return this.jobTitle; }
  public getCompanyId(): string { return this.companyId; }
  public getCompanyName(): string { return this.companyName; }
  public getCandidateUserId(): string { return this.candidateUserId; }
  public getCandidateProfileId(): string { return this.candidateProfileId; }
  public getCandidateFullName(): string { return this.candidateFullName; }
  public getCandidateEmail(): string { return this.candidateEmail; }
  public getCandidatePhone(): string { return this.candidatePhone; }
  public getStatus(): ApplicationStatus { return this.status; }
  public getCoverLetter(): string { return this.coverLetter; }
  public getNotes(): string { return this.notes; }
  public getAppliedAt(): string { return this.appliedAt; }
  public getReviewedAt(): string | undefined { return this.reviewedAt; }

  // Status transition methods
  public updateStatus(newStatus: ApplicationStatus, reviewerNote?: string): void {
    this.status = newStatus;
    this.reviewedAt = new Date().toISOString();
    if (reviewerNote) {
      this.notes = reviewerNote.trim();
    }
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      jobId: this.jobId,
      jobTitle: this.jobTitle,
      companyId: this.companyId,
      companyName: this.companyName,
      candidateUserId: this.candidateUserId,
      candidateProfileId: this.candidateProfileId,
      candidateFullName: this.candidateFullName,
      candidateEmail: this.candidateEmail,
      candidatePhone: this.candidatePhone,
      status: this.status,
      coverLetter: this.coverLetter,
      notes: this.notes,
      appliedAt: this.appliedAt,
      reviewedAt: this.reviewedAt,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
