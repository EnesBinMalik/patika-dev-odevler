/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion - İnsan Kaynakları Yönetim Servis Arayüzü
 */

import { CandidateCVEntity, FilterCriteria, Page, Pageable, UserEntity } from '../../types/models';
import { ApplicationStatus } from '../../types/enums';

export interface IAdminHRService {
  searchCandidates(criteria: FilterCriteria, pageable: Pageable): Page<CandidateCVEntity>;
  updateCandidateStatus(cvId: string, newStatus: ApplicationStatus, hrNotes?: string): CandidateCVEntity;
  getBlockedUsers(): UserEntity[];
  unblockUserAccount(userId: string): boolean;
  getHRDashboardStats(): {
    totalCandidates: number;
    completedMilitary: number;
    seniorCount: number;
    pendingReviews: number;
    blockedUsersCount: number;
  };
}
