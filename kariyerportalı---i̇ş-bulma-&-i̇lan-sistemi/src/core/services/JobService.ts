/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: JobService
 * Implements Job Posting management and "Bana Uygun İş Var mı?" intelligent matching engine
 */

import { DatabaseService } from './DatabaseService.ts';
import { LoggerService } from './LoggerService.ts';
import { JobPosting } from '../entities/JobPostingEntity.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { JobPostingBuilder } from '../patterns/Builder.ts';
import { CandidateMatchingJobFilterStrategy } from '../patterns/FilterStrategy.ts';
import { WorkType, ExperienceLevel, MilitaryStatus, Role } from '../types/enums.ts';
import { Optional } from '../types/optional.ts';

export interface IJobFilterCriteria {
  searchKeyword?: string;
  department?: string;
  city?: string;
  workType?: WorkType | 'ALL';
  experienceLevel?: ExperienceLevel | 'ALL';
  minSalary?: number;
  militaryRequirement?: MilitaryStatus | 'ANY' | 'ALL';
  onlyActive?: boolean;
}

export interface IMatchingJobResult {
  job: JobPosting;
  matchScore: number; // 0 - 100
  isEligible: boolean;
  militaryMatch: boolean;
  experienceMatch: boolean;
  matchedSkills: string[];
  missingSkills: string[];
}

export class JobService {
  private static instance: JobService | null = null;
  private db: DatabaseService;
  private logger: LoggerService;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  public static getInstance(): JobService {
    if (!JobService.instance) {
      JobService.instance = new JobService();
    }
    return JobService.instance;
  }

  public getJobById(jobId: string): Optional<JobPosting> {
    return this.db.jobs.findById(jobId);
  }

  public getAllActiveJobs(): JobPosting[] {
    return this.db.jobs.findActiveJobs().toList();
  }

  public getJobsByCompany(companyId: string): JobPosting[] {
    return this.db.jobs.findByCompanyId(companyId).toList();
  }

  /**
   * "Bana Uygun İş Var Mı?" Matching Engine
   * Evaluates candidate's military status, years of experience, and skills against all jobs
   */
  public findMatchingJobsForCandidate(candidateUserId: string): IMatchingJobResult[] {
    const candidateOpt = this.db.candidates.findByUserId(candidateUserId);
    if (candidateOpt.isEmpty()) {
      return [];
    }

    const candidate = candidateOpt.get();
    const strategy = new CandidateMatchingJobFilterStrategy(candidate);
    const candidateSkillsLower = candidate.getSkills().map(s => s.toLowerCase());

    const activeJobs = this.db.jobs.findActiveJobs().toList();

    const results: IMatchingJobResult[] = activeJobs.map(job => {
      const matchScore = strategy.calculateMatchScore(job);
      const isEligible = strategy.meetsCriteria(job);

      // Military check
      let militaryMatch = true;
      if (job.getMilitaryRequirement() !== 'ANY') {
        const cMil = candidate.getMilitaryStatus();
        if (job.getMilitaryRequirement() === MilitaryStatus.DONE) {
          militaryMatch = (cMil === MilitaryStatus.DONE || cMil === MilitaryStatus.EXEMPT);
        } else {
          militaryMatch = (cMil === job.getMilitaryRequirement());
        }
      }

      // Experience check
      const experienceMatch = candidate.getExperienceYears() >= job.getMinExperienceYears();

      // Skills check
      const matchedSkills: string[] = [];
      const missingSkills: string[] = [];
      job.getSkillsRequired().forEach(reqSkill => {
        if (candidateSkillsLower.some(cs => cs.includes(reqSkill.toLowerCase()) || reqSkill.toLowerCase().includes(cs))) {
          matchedSkills.push(reqSkill);
        } else {
          missingSkills.push(reqSkill);
        }
      });

      return {
        job,
        matchScore,
        isEligible,
        militaryMatch,
        experienceMatch,
        matchedSkills,
        missingSkills,
      };
    });

    // Sort by matchScore descending
    results.sort((a, b) => b.matchScore - a.matchScore);
    return results;
  }

  /**
   * Filter job postings based on search criteria
   */
  public filterJobs(criteria: IJobFilterCriteria): JobPosting[] {
    let stream = this.db.jobs.findAll();

    if (criteria.onlyActive !== false) {
      stream = stream.filter(j => j.getIsActive());
    }

    if (criteria.searchKeyword && criteria.searchKeyword.trim() !== '') {
      const q = criteria.searchKeyword.toLowerCase().trim();
      stream = stream.filter(j =>
        j.getTitle().toLowerCase().includes(q) ||
        j.getCompanyName().toLowerCase().includes(q) ||
        j.getDepartment().toLowerCase().includes(q) ||
        j.getDescription().toLowerCase().includes(q) ||
        j.getSkillsRequired().some(s => s.toLowerCase().includes(q))
      );
    }

    if (criteria.city && criteria.city !== 'ALL') {
      stream = stream.filter(j => j.getCity().toLowerCase().includes(criteria.city!.toLowerCase()));
    }

    if (criteria.workType && criteria.workType !== 'ALL') {
      stream = stream.filter(j => j.getWorkType() === criteria.workType);
    }

    if (criteria.experienceLevel && criteria.experienceLevel !== 'ALL') {
      stream = stream.filter(j => j.getExperienceLevel() === criteria.experienceLevel);
    }

    if (criteria.minSalary !== undefined && criteria.minSalary > 0) {
      stream = stream.filter(j => (j.getSalaryMax() || 0) >= criteria.minSalary!);
    }

    if (criteria.militaryRequirement && criteria.militaryRequirement !== 'ALL') {
      stream = stream.filter(j => j.getMilitaryRequirement() === criteria.militaryRequirement);
    }

    return stream.toList();
  }

  /**
   * Create a new Job Posting via Builder Pattern
   */
  public createJob(
    adminUserId: string,
    data: {
      title: string;
      department: string;
      city: string;
      workType: WorkType;
      experienceLevel: ExperienceLevel;
      minExperienceYears: number;
      militaryRequirement: MilitaryStatus | 'ANY';
      salaryMin?: number;
      salaryMax?: number;
      skillsRequired: string[];
      description: string;
      requirements: string[];
    }
  ): JobPosting {
    const user = this.db.users.findById(adminUserId).orElseThrow(() => new Error('User not found'));
    const companyId = user.getCompanyId();
    if (!companyId) {
      throw new Error('Only Company Admins with an active company can post jobs');
    }
    const company = this.db.companies.findById(companyId).orElseThrow(() => new Error('Company not found'));

    const builder = new JobPostingBuilder();
    builder
      .setCompany(company.getId(), company.getName())
      .setTitle(data.title)
      .setDepartment(data.department)
      .setLocation(data.city, data.workType)
      .setExperience(data.experienceLevel, data.minExperienceYears)
      .setMilitaryRequirement(data.militaryRequirement)
      .setSalary(data.salaryMin, data.salaryMax, 'TL')
      .setSkills(data.skillsRequired)
      .setDescription(data.description);

    data.requirements.forEach(req => builder.addRequirement(req));

    const job = builder.build();
    this.db.jobs.save(job);
    this.db.notify();

    this.logger.audit(
      'JOB_CREATED',
      `Yeni iş ilanı yayınlandı: "${job.getTitle()}" - Şirket: ${company.getName()}`,
      { id: user.getId(), email: user.getEmail(), role: Role.ADMIN }
    );

    return job;
  }

  /**
   * Toggle Job Active/Passive state
   */
  public toggleJobStatus(jobId: string, adminUserId: string): boolean {
    const jobOpt = this.db.jobs.findById(jobId);
    if (jobOpt.isPresent()) {
      const job = jobOpt.get();
      job.toggleActive();
      this.db.jobs.save(job);
      this.db.notify();

      this.logger.info(
        'JOB_STATUS_CHANGED',
        `İlan durumu değiştirildi: "${job.getTitle()}" -> ${job.getIsActive() ? 'AKTİF' : 'PASİF'}`,
        { id: adminUserId }
      );
      return true;
    }
    return false;
  }
}
