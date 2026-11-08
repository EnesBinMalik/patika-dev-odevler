/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion - CV Servis Arayüzü
 */

import { CandidateCVEntity } from '../../types/models';
import { Optional } from '../../core/Optional';

export interface ICVService {
  getCVByUserId(userId: string): Optional<CandidateCVEntity>;
  getCVById(id: string): Optional<CandidateCVEntity>;
  createOrUpdateCV(cv: CandidateCVEntity): CandidateCVEntity;
  validateKvkkValidity(cv: CandidateCVEntity): { isValid: boolean; remainingDays: number };
}
