/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: JobPosting (JPA @Entity @Table(name = "job_postings"))
 * Spring Data Relation: @ManyToOne(fetch = FetchType.LAZY) Company company
 * Relation: @OneToMany(mappedBy = "jobPosting") List<Application> applications
 */

import { BaseEntity } from './BaseEntity.ts';
import { WorkType, ExperienceLevel, MilitaryStatus } from '../types/enums.ts';

export class JobPosting extends BaseEntity {
  private companyId: string;
  private companyName: string;
  private title: string;
  private department: string;
  private city: string;
  private workType: WorkType;
  private experienceLevel: ExperienceLevel;
  private minExperienceYears: number;
  private militaryRequirement: MilitaryStatus | 'ANY';
  private salaryMin?: number;
  private salaryMax?: number;
  private currency: string;
  private skillsRequired: string[];
  private description: string;
  private requirements: string[];
  private isActive: boolean;
  private applicationCount: number;

  constructor(params: {
    id?: string;
    companyId: string;
    companyName: string;
    title: string;
    department: string;
    city: string;
    workType: WorkType;
    experienceLevel: ExperienceLevel;
    minExperienceYears: number;
    militaryRequirement?: MilitaryStatus | 'ANY';
    salaryMin?: number;
    salaryMax?: number;
    currency?: string;
    skillsRequired?: string[];
    description: string;
    requirements?: string[];
    isActive?: boolean;
    applicationCount?: number;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.companyId = params.companyId;
    this.companyName = params.companyName.trim();
    this.title = params.title.trim();
    this.department = params.department.trim();
    this.city = params.city.trim();
    this.workType = params.workType;
    this.experienceLevel = params.experienceLevel;
    this.minExperienceYears = Math.max(0, params.minExperienceYears);
    this.militaryRequirement = params.militaryRequirement || 'ANY';
    this.salaryMin = params.salaryMin;
    this.salaryMax = params.salaryMax;
    this.currency = params.currency || 'TL';
    this.skillsRequired = params.skillsRequired || [];
    this.description = params.description.trim();
    this.requirements = params.requirements || [];
    this.isActive = params.isActive ?? true;
    this.applicationCount = params.applicationCount ?? 0;
  }

  // Getters
  public getCompanyId(): string { return this.companyId; }
  public getCompanyName(): string { return this.companyName; }
  public getTitle(): string { return this.title; }
  public getDepartment(): string { return this.department; }
  public getCity(): string { return this.city; }
  public getWorkType(): WorkType { return this.workType; }
  public getExperienceLevel(): ExperienceLevel { return this.experienceLevel; }
  public getMinExperienceYears(): number { return this.minExperienceYears; }
  public getMilitaryRequirement(): MilitaryStatus | 'ANY' { return this.militaryRequirement; }
  public getSalaryMin(): number | undefined { return this.salaryMin; }
  public getSalaryMax(): number | undefined { return this.salaryMax; }
  public getCurrency(): string { return this.currency; }
  public getSkillsRequired(): string[] { return [...this.skillsRequired]; }
  public getDescription(): string { return this.description; }
  public getRequirements(): string[] { return [...this.requirements]; }
  public getIsActive(): boolean { return this.isActive; }
  public getApplicationCount(): number { return this.applicationCount; }

  // Business operations
  public toggleActive(): void {
    this.isActive = !this.isActive;
    this.updateTimestamp();
  }

  public incrementApplicationCount(): void {
    this.applicationCount += 1;
    this.updateTimestamp();
  }

  public toJSON() {
    return {
      id: this.id,
      companyId: this.companyId,
      companyName: this.companyName,
      title: this.title,
      department: this.department,
      city: this.city,
      workType: this.workType,
      experienceLevel: this.experienceLevel,
      minExperienceYears: this.minExperienceYears,
      militaryRequirement: this.militaryRequirement,
      salaryMin: this.salaryMin,
      salaryMax: this.salaryMax,
      currency: this.currency,
      skillsRequired: this.skillsRequired,
      description: this.description,
      requirements: this.requirements,
      isActive: this.isActive,
      applicationCount: this.applicationCount,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
