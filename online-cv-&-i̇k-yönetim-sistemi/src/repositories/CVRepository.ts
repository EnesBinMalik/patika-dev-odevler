/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility & Liskov Substitution
 * Stream API ile Veritabanı Filtreleme (Askerlik, Deneyim Yılı, Yetenek, Şehir vb.)
 * ve Spring Data Page<T> Sayfalama Mimarisi
 */

import { ICVRepository } from './interfaces/ICVRepository';
import { CandidateCVEntity, FilterCriteria, Page, Pageable } from '../types/models';
import { DatabaseContext } from '../database/DatabaseContext';
import { Optional } from '../core/Optional';
import { Stream } from '../core/Stream';
import { MilitaryStatus } from '../types/enums';

export class CVRepository implements ICVRepository {
  private db: DatabaseContext;

  constructor() {
    this.db = DatabaseContext.getInstance();
  }

  public findById(id: string): Optional<CandidateCVEntity> {
    const cv = this.db.candidateCVs.get(id);
    return Optional.ofNullable(cv);
  }

  public findByUserId(userId: string): Optional<CandidateCVEntity> {
    return Stream.of(Array.from(this.db.candidateCVs.values()))
      .filter((cv) => cv.userId === userId)
      .findFirst();
  }

  public findAll(): CandidateCVEntity[] {
    return Stream.of(Array.from(this.db.candidateCVs.values()))
      .sorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      .collectToList();
  }

  /**
   * İK Filtreleme Motoru - Stream API ile dinamik kriter sorgulama
   * Örnek: Askerliği Yapmış + 5 Yıllık Deneyime Sahip Kişiler
   */
  public findByCriteria(criteria: FilterCriteria): CandidateCVEntity[] {
    const today = new Date().toISOString().split('T')[0];

    return Stream.of(Array.from(this.db.candidateCVs.values()))
      .filter((cv) => {
        // 1. Arama Metni (İsim, Soyisim, Ünvan veya Şehir)
        if (criteria.searchTerm && criteria.searchTerm.trim() !== '') {
          const term = criteria.searchTerm.trim().toLowerCase();
          const fullName = `${cv.firstName} ${cv.lastName}`.toLowerCase();
          const title = (cv.title || '').toLowerCase();
          const city = (cv.city || '').toLowerCase();
          const summary = (cv.summary || '').toLowerCase();
          const match = fullName.includes(term) || title.includes(term) || city.includes(term) || summary.includes(term);
          if (!match) return false;
        }

        // 2. Askerlik Durumu Filtresi (Örn: "YAPILDI" aranırsa)
        if (criteria.militaryStatus && criteria.militaryStatus !== 'ALL') {
          if (cv.militaryStatus !== criteria.militaryStatus) {
            return false;
          }
        }

        // 3. Minimum Deneyim Yılı (Örn: 5 yıl ve üzeri)
        if (criteria.minExperienceYears !== undefined && criteria.minExperienceYears !== null) {
          if (cv.totalExperienceYears < criteria.minExperienceYears) {
            return false;
          }
        }

        // 4. Maksimum Deneyim Yılı
        if (criteria.maxExperienceYears !== undefined && criteria.maxExperienceYears !== null) {
          if (cv.totalExperienceYears > criteria.maxExperienceYears) {
            return false;
          }
        }

        // 5. Şehir Filtresi
        if (criteria.city && criteria.city !== 'ALL') {
          if (cv.city.toLowerCase() !== criteria.city.toLowerCase()) {
            return false;
          }
        }

        // 6. Başvuru Durumu Filtresi
        if (criteria.applicationStatus && criteria.applicationStatus !== 'ALL') {
          if (cv.applicationStatus !== criteria.applicationStatus) {
            return false;
          }
        }

        // 7. Yetenek Anahtar Kelimesi
        if (criteria.skillKeyword && criteria.skillKeyword.trim() !== '') {
          const skillQuery = criteria.skillKeyword.trim().toLowerCase();
          const hasSkill = cv.skills.some((s) => s.toLowerCase().includes(skillQuery));
          if (!hasSkill) return false;
        }

        // 8. Yalnızca Aktif KVKK Saklama İzni Olanlar
        if (criteria.onlyActiveKvkk) {
          if (!cv.kvkkConsentGiven || cv.kvkkExpiryDate < today) {
            return false;
          }
        }

        return true;
      })
      .sorted((a, b) => b.totalExperienceYears - a.totalExperienceYears) // En deneyimliler üstte
      .collectToList();
  }

  /**
   * Spring Data Sayfalama (Paging): Page<T> ve Pageable
   */
  public findPage(criteria: FilterCriteria, pageable: Pageable): Page<CandidateCVEntity> {
    const allFiltered = this.findByCriteria(criteria);
    const totalElements = allFiltered.length;
    const pageSize = Math.max(1, pageable.size);
    const totalPages = Math.ceil(totalElements / pageSize) || 1;
    
    // Geçerli sayfa sınırlarını koru (1-indexed)
    const currentPage = Math.min(Math.max(1, pageable.page), totalPages);
    const startIndex = (currentPage - 1) * pageSize;

    const pageContent = Stream.of(allFiltered)
      .skip(startIndex)
      .limit(pageSize)
      .collectToList();

    return {
      content: pageContent,
      pageNumber: currentPage,
      pageSize: pageSize,
      totalElements: totalElements,
      totalPages: totalPages,
      isFirst: currentPage === 1,
      isLast: currentPage === totalPages,
      hasNext: currentPage < totalPages,
      hasPrevious: currentPage > 1,
    };
  }

  public save(cv: CandidateCVEntity): CandidateCVEntity {
    this.db.candidateCVs.set(cv.id, cv);
    this.db.persist();
    return cv;
  }

  public update(cv: CandidateCVEntity): CandidateCVEntity {
    cv.touch();
    this.db.candidateCVs.set(cv.id, cv);
    this.db.persist();
    return cv;
  }

  public deleteById(id: string): boolean {
    const deleted = this.db.candidateCVs.delete(id);
    if (deleted) {
      this.db.persist();
    }
    return deleted;
  }

  public count(): number {
    return this.db.candidateCVs.size;
  }
}
