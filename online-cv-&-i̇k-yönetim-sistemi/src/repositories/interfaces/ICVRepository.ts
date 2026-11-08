/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion Prensibi (DIP) - CV Repository Arayüzü
 */

import { CandidateCVEntity, FilterCriteria, Page, Pageable } from '../../types/models';
import { Optional } from '../../core/Optional';

export interface ICVRepository {
  findById(id: string): Optional<CandidateCVEntity>;
  findByUserId(userId: string): Optional<CandidateCVEntity>;
  findAll(): CandidateCVEntity[];
  findByCriteria(criteria: FilterCriteria): CandidateCVEntity[];
  findPage(criteria: FilterCriteria, pageable: Pageable): Page<CandidateCVEntity>;
  save(cv: CandidateCVEntity): CandidateCVEntity;
  update(cv: CandidateCVEntity): CandidateCVEntity;
  deleteById(id: string): boolean;
  count(): number;
}
