/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Pattern: Strategy Pattern for Dynamic Database Filtering (Specification / Criteria Pattern)
 * Conforms to Open/Closed Principle (OCP) and Single Responsibility Principle (SRP)
 */

import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { JobPosting } from '../entities/JobPostingEntity.ts';
import { MilitaryStatus, WorkType, ExperienceLevel } from '../types/enums.ts';

// Candidate Filter Strategy Interface
export interface ICandidateFilterStrategy {
  meetsCriteria(candidate: CandidateProfile): boolean;
  getDescription(): string;
}

/**
 * Filter strategy for Military Service (e.g. Askerliği Yapmış / Muaf)
 */
export class MilitaryStatusFilterStrategy implements ICandidateFilterStrategy {
  constructor(private allowedStatuses: MilitaryStatus[]) {}

  public meetsCriteria(candidate: CandidateProfile): boolean {
    return this.allowedStatuses.includes(candidate.getMilitaryStatus());
  }

  public getDescription(): string {
    return `Askerlik Durumu: ${this.allowedStatuses.join(', ')}`;
  }
}

/**
 * Filter strategy for Minimum Experience Years (e.g. En az 5 yıllık deneyim)
 */
export class MinExperienceYearsFilterStrategy implements ICandidateFilterStrategy {
  constructor(private minYears: number) {}

  public meetsCriteria(candidate: CandidateProfile): boolean {
    return candidate.getExperienceYears() >= this.minYears;
  }

  public getDescription(): string {
    return `En az ${this.minYears} Yıl Deneyim`;
  }
}

/**
 * Filter strategy for Skills requirement (e.g. React, Spring Boot, PostgreSQL)
 */
export class SkillsFilterStrategy implements ICandidateFilterStrategy {
  constructor(private requiredSkills: string[], private matchAll: boolean = false) {}

  public meetsCriteria(candidate: CandidateProfile): boolean {
    if (this.requiredSkills.length === 0) return true;
    const candidateSkillsLower = candidate.getSkills().map(s => s.toLowerCase());

    if (this.matchAll) {
      return this.requiredSkills.every(req =>
        candidateSkillsLower.some(cs => cs.includes(req.toLowerCase()))
      );
    } else {
      return this.requiredSkills.some(req =>
        candidateSkillsLower.some(cs => cs.includes(req.toLowerCase()))
      );
    }
  }

  public getDescription(): string {
    return `Yetenekler: ${this.requiredSkills.join(', ')}`;
  }
}

/**
 * Filter strategy for City / Location
 */
export class CityFilterStrategy implements ICandidateFilterStrategy {
  constructor(private city: string) {}

  public meetsCriteria(candidate: CandidateProfile): boolean {
    if (!this.city || this.city === 'ALL') return true;
    return candidate.getCity().toLowerCase().includes(this.city.toLowerCase());
  }

  public getDescription(): string {
    return `Şehir: ${this.city}`;
  }
}

/**
 * Composite Candidate Filter combining multiple strategies (AND logic)
 */
export class CompositeCandidateFilter implements ICandidateFilterStrategy {
  private strategies: ICandidateFilterStrategy[] = [];

  public addStrategy(strategy: ICandidateFilterStrategy): this {
    this.strategies.push(strategy);
    return this;
  }

  public meetsCriteria(candidate: CandidateProfile): boolean {
    return this.strategies.every(strat => strat.meetsCriteria(candidate));
  }

  public getDescription(): string {
    return this.strategies.map(s => s.getDescription()).join(' AND ');
  }
}

// ==========================================
// Job Posting Filter Strategies
// ==========================================

export interface IJobFilterStrategy {
  meetsCriteria(job: JobPosting): boolean;
}

export class WorkTypeJobFilterStrategy implements IJobFilterStrategy {
  constructor(private allowedWorkTypes: WorkType[]) {}

  public meetsCriteria(job: JobPosting): boolean {
    if (this.allowedWorkTypes.length === 0) return true;
    return this.allowedWorkTypes.includes(job.getWorkType());
  }
}

export class ExperienceLevelJobFilterStrategy implements IJobFilterStrategy {
  constructor(private maxExperienceRequiredYears?: number) {}

  public meetsCriteria(job: JobPosting): boolean {
    if (this.maxExperienceRequiredYears === undefined) return true;
    return job.getMinExperienceYears() <= this.maxExperienceRequiredYears;
  }
}

export class CandidateMatchingJobFilterStrategy implements IJobFilterStrategy {
  constructor(private candidate: CandidateProfile) {}

  public meetsCriteria(job: JobPosting): boolean {
    // 1. Military requirement check
    if (job.getMilitaryRequirement() !== 'ANY') {
      const candidateMil = this.candidate.getMilitaryStatus();
      if (job.getMilitaryRequirement() === MilitaryStatus.DONE) {
        // if job requires DONE, candidate must have DONE or EXEMPT
        if (candidateMil !== MilitaryStatus.DONE && candidateMil !== MilitaryStatus.EXEMPT) {
          return false;
        }
      } else if (candidateMil !== job.getMilitaryRequirement()) {
        return false;
      }
    }

    // 2. Experience years check (candidate experience must be >= job min required)
    if (this.candidate.getExperienceYears() < job.getMinExperienceYears()) {
      return false;
    }

    return true;
  }

  /**
   * Calculates Match Score (0 - 100) between Candidate and Job
   */
  public calculateMatchScore(job: JobPosting): number {
    let score = 40; // Base score for eligibility

    // Experience bonus
    if (this.candidate.getExperienceYears() >= job.getMinExperienceYears()) {
      const diff = this.candidate.getExperienceYears() - job.getMinExperienceYears();
      score += Math.min(25, 15 + diff * 3);
    }

    // Skill overlap bonus
    const candidateSkills = this.candidate.getSkills().map(s => s.toLowerCase());
    const jobSkills = job.getSkillsRequired().map(s => s.toLowerCase());
    if (jobSkills.length > 0) {
      const matched = jobSkills.filter(js => candidateSkills.some(cs => cs.includes(js) || js.includes(cs)));
      const ratio = matched.length / jobSkills.length;
      score += Math.round(ratio * 30);
    } else {
      score += 20;
    }

    // Military check bonus
    if (this.candidate.getMilitaryStatus() === MilitaryStatus.DONE || this.candidate.getMilitaryStatus() === MilitaryStatus.EXEMPT) {
      score += 5;
    }

    return Math.min(100, Math.max(0, score));
  }
}
