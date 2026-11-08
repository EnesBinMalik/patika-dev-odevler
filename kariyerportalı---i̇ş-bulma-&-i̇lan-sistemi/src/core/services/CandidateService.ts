/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Service: CandidateService
 * Implements candidate database filtering (Strategy pattern), resume management and profiling
 */

import { DatabaseService } from './DatabaseService.ts';
import { LoggerService } from './LoggerService.ts';
import { CandidateProfile, IWorkExperience, IEducation } from '../entities/CandidateProfileEntity.ts';
import { User } from '../entities/UserEntity.ts';
import { Optional } from '../types/optional.ts';
import { Stream } from '../types/stream.ts';
import { MilitaryStatus } from '../types/enums.ts';
import {
  CompositeCandidateFilter,
  MilitaryStatusFilterStrategy,
  MinExperienceYearsFilterStrategy,
  SkillsFilterStrategy,
  CityFilterStrategy,
} from '../patterns/FilterStrategy.ts';

export interface ICandidateFilterOptions {
  militaryStatuses?: MilitaryStatus[];
  minExperienceYears?: number;
  skills?: string[];
  city?: string;
  searchKeyword?: string;
}

export class CandidateService {
  private static instance: CandidateService | null = null;
  private db: DatabaseService;
  private logger: LoggerService;

  private constructor() {
    this.db = DatabaseService.getInstance();
    this.logger = LoggerService.getInstance();
  }

  public static getInstance(): CandidateService {
    if (!CandidateService.instance) {
      CandidateService.instance = new CandidateService();
    }
    return CandidateService.instance;
  }

  public getProfileByUserId(userId: string): Optional<CandidateProfile> {
    return this.db.candidates.findByUserId(userId);
  }

  public getProfileById(profileId: string): Optional<CandidateProfile> {
    return this.db.candidates.findById(profileId);
  }

  public getAllCandidates(): CandidateProfile[] {
    return this.db.candidates.findAll().toList();
  }

  /**
   * Filter candidates based on complex employer criteria (Strategy Pattern)
   * Example: Askerliği yapmış (DONE / EXEMPT) + 5 yıllık deneyim + React/Java
   */
  public filterCandidates(options: ICandidateFilterOptions): CandidateProfile[] {
    const composite = new CompositeCandidateFilter();

    if (options.militaryStatuses && options.militaryStatuses.length > 0) {
      composite.addStrategy(new MilitaryStatusFilterStrategy(options.militaryStatuses));
    }

    if (options.minExperienceYears !== undefined && options.minExperienceYears > 0) {
      composite.addStrategy(new MinExperienceYearsFilterStrategy(options.minExperienceYears));
    }

    if (options.skills && options.skills.length > 0) {
      composite.addStrategy(new SkillsFilterStrategy(options.skills, false));
    }

    if (options.city && options.city !== 'ALL') {
      composite.addStrategy(new CityFilterStrategy(options.city));
    }

    let stream = this.db.candidates.findAll().filter(c => composite.meetsCriteria(c));

    if (options.searchKeyword && options.searchKeyword.trim() !== '') {
      const q = options.searchKeyword.toLowerCase().trim();
      stream = stream.filter(c =>
        c.getFullName().toLowerCase().includes(q) ||
        c.getCurrentTitle().toLowerCase().includes(q) ||
        c.getSkills().some(s => s.toLowerCase().includes(q))
      );
    }

    return stream.toList();
  }

  /**
   * Update candidate details and sync back to user entity
   */
  public updateProfile(
    userId: string,
    profileData: {
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
    }
  ): boolean {
    const profOpt = this.db.candidates.findByUserId(userId);
    const userOpt = this.db.users.findById(userId);

    if (profOpt.isPresent() && userOpt.isPresent()) {
      const profile = profOpt.get();
      const user = userOpt.get();

      profile.updateProfileInfo(profileData);
      this.db.candidates.save(profile);

      if (profileData.firstName || profileData.lastName) {
        user.setFullName(profile.getFullName());
      }
      if (profileData.phone) {
        user.setPhone(profileData.phone);
      }
      this.db.users.save(user);
      this.db.notify();

      this.logger.info(
        'PROFILE_UPDATED',
        `Aday profil bilgileri güncellendi: ${profile.getFullName()} (Tamamlanma: %${profile.calculateCompleteness()})`,
        { id: user.getId(), email: user.getEmail(), role: user.getRole() }
      );
      return true;
    }
    return false;
  }

  public addExperience(userId: string, exp: Omit<IWorkExperience, 'id'>): boolean {
    const profOpt = this.db.candidates.findByUserId(userId);
    if (profOpt.isPresent()) {
      const prof = profOpt.get();
      prof.addWorkExperience(exp);
      this.db.candidates.save(prof);
      this.db.notify();
      return true;
    }
    return false;
  }

  public removeExperience(userId: string, expId: string): boolean {
    const profOpt = this.db.candidates.findByUserId(userId);
    if (profOpt.isPresent()) {
      const prof = profOpt.get();
      prof.removeWorkExperience(expId);
      this.db.candidates.save(prof);
      this.db.notify();
      return true;
    }
    return false;
  }

  public addEducation(userId: string, edu: Omit<IEducation, 'id'>): boolean {
    const profOpt = this.db.candidates.findByUserId(userId);
    if (profOpt.isPresent()) {
      const prof = profOpt.get();
      prof.addEducation(edu);
      this.db.candidates.save(prof);
      this.db.notify();
      return true;
    }
    return false;
  }

  public removeEducation(userId: string, eduId: string): boolean {
    const profOpt = this.db.candidates.findByUserId(userId);
    if (profOpt.isPresent()) {
      const prof = profOpt.get();
      prof.removeEducation(eduId);
      this.db.candidates.save(prof);
      this.db.notify();
      return true;
    }
    return false;
  }
}
