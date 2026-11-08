/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Pattern: Builder Pattern for Fluent Domain Object Construction (GoF Builder)
 */

import { JobPosting } from '../entities/JobPostingEntity.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { WorkType, ExperienceLevel, MilitaryStatus } from '../types/enums.ts';

export class JobPostingBuilder {
  private companyId!: string;
  private companyName!: string;
  private title!: string;
  private department: string = 'Yazılım ve Teknoloji';
  private city: string = 'İstanbul';
  private workType: WorkType = WorkType.REMOTE;
  private experienceLevel: ExperienceLevel = ExperienceLevel.MID;
  private minExperienceYears: number = 2;
  private militaryRequirement: MilitaryStatus | 'ANY' = 'ANY';
  private salaryMin?: number;
  private salaryMax?: number;
  private currency: string = 'TL';
  private skillsRequired: string[] = [];
  private description: string = '';
  private requirements: string[] = [];

  public setCompany(companyId: string, companyName: string): this {
    this.companyId = companyId;
    this.companyName = companyName;
    return this;
  }

  public setTitle(title: string): this {
    this.title = title;
    return this;
  }

  public setDepartment(dept: string): this {
    this.department = dept;
    return this;
  }

  public setLocation(city: string, workType: WorkType): this {
    this.city = city;
    this.workType = workType;
    return this;
  }

  public setExperience(level: ExperienceLevel, minYears: number): this {
    this.experienceLevel = level;
    this.minExperienceYears = minYears;
    return this;
  }

  public setMilitaryRequirement(requirement: MilitaryStatus | 'ANY'): this {
    this.militaryRequirement = requirement;
    return this;
  }

  public setSalary(min?: number, max?: number, currency: string = 'TL'): this {
    this.salaryMin = min;
    this.salaryMax = max;
    this.currency = currency;
    return this;
  }

  public addSkill(skill: string): this {
    this.skillsRequired.push(skill.trim());
    return this;
  }

  public setSkills(skills: string[]): this {
    this.skillsRequired = [...skills];
    return this;
  }

  public setDescription(desc: string): this {
    this.description = desc;
    return this;
  }

  public addRequirement(req: string): this {
    this.requirements.push(req.trim());
    return this;
  }

  public build(): JobPosting {
    if (!this.companyId || !this.title) {
      throw new Error('JobPostingBuilder: companyId and title are required');
    }
    return new JobPosting({
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
    });
  }
}
