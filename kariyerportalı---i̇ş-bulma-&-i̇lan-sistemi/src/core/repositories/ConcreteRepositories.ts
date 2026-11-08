/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Concrete Repositories implementing Spring Data JPA repository semantics
 */

import { GenericInMemoryRepository } from '../patterns/Repository.ts';
import { User } from '../entities/UserEntity.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { Company } from '../entities/CompanyEntity.ts';
import { JobPosting } from '../entities/JobPostingEntity.ts';
import { Application } from '../entities/ApplicationEntity.ts';
import { AuditLog } from '../entities/AuditLogEntity.ts';
import { Optional } from '../types/optional.ts';
import { Stream } from '../types/stream.ts';

export class UserRepository extends GenericInMemoryRepository<User> {
  public findByEmail(email: string): Optional<User> {
    const normalized = email.toLowerCase().trim();
    return this.findAll()
      .filter(u => u.getEmail() === normalized)
      .findFirst();
  }
}

export class CandidateProfileRepository extends GenericInMemoryRepository<CandidateProfile> {
  public findByUserId(userId: string): Optional<CandidateProfile> {
    return this.findAll()
      .filter(c => c.getUserId() === userId)
      .findFirst();
  }
}

export class CompanyRepository extends GenericInMemoryRepository<Company> {
  public findByAdminUserId(adminUserId: string): Optional<Company> {
    return this.findAll()
      .filter(c => c.getAdminUserId() === adminUserId)
      .findFirst();
  }
}

export class JobPostingRepository extends GenericInMemoryRepository<JobPosting> {
  public findByCompanyId(companyId: string): Stream<JobPosting> {
    return this.findAll().filter(j => j.getCompanyId() === companyId);
  }

  public findActiveJobs(): Stream<JobPosting> {
    return this.findAll().filter(j => j.getIsActive());
  }
}

export class ApplicationRepository extends GenericInMemoryRepository<Application> {
  public findByCandidateUserId(candidateUserId: string): Stream<Application> {
    return this.findAll().filter(a => a.getCandidateUserId() === candidateUserId);
  }

  public findByJobId(jobId: string): Stream<Application> {
    return this.findAll().filter(a => a.getJobId() === jobId);
  }

  public findByCompanyId(companyId: string): Stream<Application> {
    return this.findAll().filter(a => a.getCompanyId() === companyId);
  }

  public hasApplied(candidateUserId: string, jobId: string): boolean {
    return this.findAll().anyMatch(a => a.getCandidateUserId() === candidateUserId && a.getJobId() === jobId);
  }
}

export class AuditLogRepository extends GenericInMemoryRepository<AuditLog> {
  public findRecent(limitCount: number = 100): Stream<AuditLog> {
    return this.findAll()
      .sorted((a, b) => new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime())
      .limit(limitCount);
  }
}
