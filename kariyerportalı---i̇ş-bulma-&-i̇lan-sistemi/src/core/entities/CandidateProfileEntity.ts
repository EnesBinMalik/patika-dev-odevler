/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Entity: CandidateProfile (JPA @Entity @Table(name = "candidate_profiles"))
 * Models Job Seeker resume, experience history, military service status, education and skills
 */

import { BaseEntity } from './BaseEntity.ts';
import { MilitaryStatus } from '../types/enums.ts';

export interface IWorkExperience {
  id: string;
  companyName: string;
  title: string;
  startDate: string;
  endDate?: string;
  isCurrent: boolean;
  description: string;
}

export interface IEducation {
  id: string;
  institution: string;
  degree: string; // Lisans, Yüksek Lisans, Ön Lisans vb.
  department: string;
  graduationYear: number;
}

export class CandidateProfile extends BaseEntity {
  private userId: string;
  private firstName: string;
  private lastName: string;
  private phone: string;
  private city: string;
  private militaryStatus: MilitaryStatus;
  private militaryExemptReason?: string;
  private experienceYears: number;
  private currentTitle: string;
  private bio: string;
  private skills: string[];
  private workExperiences: IWorkExperience[];
  private educations: IEducation[];
  private cvFileName?: string;

  constructor(params: {
    id?: string;
    userId: string;
    firstName: string;
    lastName: string;
    phone: string;
    city: string;
    militaryStatus: MilitaryStatus;
    militaryExemptReason?: string;
    experienceYears: number;
    currentTitle: string;
    bio?: string;
    skills?: string[];
    workExperiences?: IWorkExperience[];
    educations?: IEducation[];
    cvFileName?: string;
    createdAt?: string;
    updatedAt?: string;
    version?: number;
  }) {
    super(params.id, params.createdAt, params.updatedAt, params.version);
    this.userId = params.userId;
    this.firstName = params.firstName.trim();
    this.lastName = params.lastName.trim();
    this.phone = params.phone.trim();
    this.city = params.city.trim();
    this.militaryStatus = params.militaryStatus;
    this.militaryExemptReason = params.militaryExemptReason;
    this.experienceYears = Math.max(0, params.experienceYears);
    this.currentTitle = params.currentTitle.trim();
    this.bio = params.bio || '';
    this.skills = params.skills || [];
    this.workExperiences = params.workExperiences || [];
    this.educations = params.educations || [];
    this.cvFileName = params.cvFileName;
  }

  // Getters
  public getUserId(): string { return this.userId; }
  public getFirstName(): string { return this.firstName; }
  public getLastName(): string { return this.lastName; }
  public getFullName(): string { return `${this.firstName} ${this.lastName}`; }
  public getPhone(): string { return this.phone; }
  public getCity(): string { return this.city; }
  public getMilitaryStatus(): MilitaryStatus { return this.militaryStatus; }
  public getMilitaryExemptReason(): string | undefined { return this.militaryExemptReason; }
  public getExperienceYears(): number { return this.experienceYears; }
  public getCurrentTitle(): string { return this.currentTitle; }
  public getBio(): string { return this.bio; }
  public getSkills(): string[] { return [...this.skills]; }
  public getWorkExperiences(): IWorkExperience[] { return [...this.workExperiences]; }
  public getEducations(): IEducation[] { return [...this.educations]; }
  public getCvFileName(): string | undefined { return this.cvFileName; }

  // Setters / Business Mutators
  public updateProfileInfo(info: {
    firstName?: string;
    lastName?: string;
    phone?: string;
    city?: string;
    militaryStatus?: MilitaryStatus;
    militaryExemptReason?: string;
    experienceYears?: number;
    currentTitle?: string;
    bio?: string;
    skills?: string[];
    cvFileName?: string;
  }): void {
    if (info.firstName) this.firstName = info.firstName.trim();
    if (info.lastName) this.lastName = info.lastName.trim();
    if (info.phone) this.phone = info.phone.trim();
    if (info.city) this.city = info.city.trim();
    if (info.militaryStatus) this.militaryStatus = info.militaryStatus;
    if (info.militaryExemptReason !== undefined) this.militaryExemptReason = info.militaryExemptReason;
    if (info.experienceYears !== undefined) this.experienceYears = Math.max(0, info.experienceYears);
    if (info.currentTitle) this.currentTitle = info.currentTitle.trim();
    if (info.bio !== undefined) this.bio = info.bio;
    if (info.skills) this.skills = [...info.skills];
    if (info.cvFileName !== undefined) this.cvFileName = info.cvFileName;
    this.updateTimestamp();
  }

  public addWorkExperience(exp: Omit<IWorkExperience, 'id'>): void {
    const newExp: IWorkExperience = {
      ...exp,
      id: 'exp_' + Math.random().toString(36).substring(2, 8),
    };
    this.workExperiences.unshift(newExp);
    this.updateTimestamp();
  }

  public removeWorkExperience(id: string): void {
    this.workExperiences = this.workExperiences.filter(e => e.id !== id);
    this.updateTimestamp();
  }

  public addEducation(edu: Omit<IEducation, 'id'>): void {
    const newEdu: IEducation = {
      ...edu,
      id: 'edu_' + Math.random().toString(36).substring(2, 8),
    };
    this.educations.unshift(newEdu);
    this.updateTimestamp();
  }

  public removeEducation(id: string): void {
    this.educations = this.educations.filter(e => e.id !== id);
    this.updateTimestamp();
  }

  /**
   * Calculates Profile Completeness Percentage (0 - 100%)
   */
  public calculateCompleteness(): number {
    let score = 0;
    if (this.firstName && this.lastName) score += 20;
    if (this.phone) score += 15;
    if (this.city) score += 10;
    if (this.currentTitle) score += 15;
    if (this.skills.length > 0) score += 15;
    if (this.workExperiences.length > 0) score += 15;
    if (this.educations.length > 0) score += 10;
    return Math.min(100, score);
  }

  public toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      firstName: this.firstName,
      lastName: this.lastName,
      fullName: this.getFullName(),
      phone: this.phone,
      city: this.city,
      militaryStatus: this.militaryStatus,
      militaryExemptReason: this.militaryExemptReason,
      experienceYears: this.experienceYears,
      currentTitle: this.currentTitle,
      bio: this.bio,
      skills: this.skills,
      workExperiences: this.workExperiences,
      educations: this.educations,
      cvFileName: this.cvFileName,
      completeness: this.calculateCompleteness(),
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      version: this.version,
    };
  }
}
