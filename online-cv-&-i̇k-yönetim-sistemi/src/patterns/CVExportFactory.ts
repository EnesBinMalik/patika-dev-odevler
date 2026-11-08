/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Design Pattern: Factory Pattern (CV Dışa Aktarma & I/O Dosya Fabrikası)
 * S.O.L.I.D: Interface Segregation & Dependency Inversion
 */

import { CandidateCVEntity } from '../types/models';

export type ExportFormat = 'JSON' | 'TEXT' | 'MARKDOWN';

export interface IExportedFile {
  filename: string;
  mimeType: string;
  content: string;
}

export class CVExportFactory {
  /**
   * İstenen formata göre uygun dosya çıktısını üretir
   */
  public static createExport(cv: CandidateCVEntity, format: ExportFormat): IExportedFile {
    const safeName = `${cv.firstName.toLowerCase()}_${cv.lastName.toLowerCase()}`.replace(/\s+/g, '_');
    const timestamp = new Date().toISOString().split('T')[0];

    switch (format) {
      case 'JSON':
        return {
          filename: `cv_${safeName}_${timestamp}.json`,
          mimeType: 'application/json',
          content: JSON.stringify(
            {
              meta: {
                exportedBy: 'Online CV & İK Yönetim Portalı (Enes Öztürk)',
                exportDate: new Date().toISOString(),
                formatVersion: '2.0-SOLID',
              },
              candidate: cv,
            },
            null,
            2
          ),
        };

      case 'TEXT':
        return {
          filename: `cv_${safeName}_${timestamp}.txt`,
          mimeType: 'text/plain;charset=utf-8',
          content: this.generatePlainText(cv),
        };

      case 'MARKDOWN':
        return {
          filename: `cv_${safeName}_${timestamp}.md`,
          mimeType: 'text/markdown;charset=utf-8',
          content: this.generateMarkdown(cv),
        };

      default:
        throw new Error(`Desteklenmeyen dosya formatı: ${format}`);
    }
  }

  private static generatePlainText(cv: CandidateCVEntity): string {
    return `=================================================================
ONLINE CV - ADAY BİLGİ RAPORU
Geliştirici Mimarisi: Enes Öztürk (S.O.L.I.D & Clean Code)
Tarih: ${new Date().toLocaleDateString('tr-TR')}
=================================================================

KİŞİSEL BİLGİLER:
Ad Soyad        : ${cv.firstName} ${cv.lastName}
Ünvan           : ${cv.title || 'Belirtilmedi'}
E-Posta         : ${cv.email}
Telefon         : ${cv.phone}
Şehir           : ${cv.city}
Toplam Deneyim  : ${cv.totalExperienceYears} Yıl
Askerlik Durumu : ${cv.militaryStatus}
Başvuru Durumu  : ${cv.applicationStatus}
KVKK Bitiş Tar. : ${cv.kvkkExpiryDate}

ÖZET BİLGİ:
${cv.summary || 'Özet bilgi girilmemiş.'}

İŞ VE ÇALIŞMA DENEYİMLERİ:
${
  cv.experiences.length > 0
    ? cv.experiences
        .map(
          (e, i) =>
            `${i + 1}. ${e.companyName} | ${e.position} (${e.startDate} - ${e.endDate}) [${e.years} Yıl]\n   ${e.description}`
        )
        .join('\n\n')
    : 'Kayıtlı iş deneyimi bulunmamaktadır.'
}

EĞİTİM GEÇMİŞİ:
${
  cv.educations.length > 0
    ? cv.educations
        .map(
          (edu, i) =>
            `${i + 1}. ${edu.schoolName} - ${edu.department} (${edu.degree}) [${edu.startYear} - ${edu.graduationYear || 'Devam Ediyor'}]`
        )
        .join('\n')
    : 'Kayıtlı eğitim bilgisi bulunmamaktadır.'
}

YETENEKLER:
${cv.skills.length > 0 ? cv.skills.join(', ') : 'Belirtilmedi'}

YABANCI DİLLER:
${cv.languages.length > 0 ? cv.languages.join(', ') : 'Belirtilmedi'}

İK NOTLARI:
${cv.hrNotes || 'Henüz not eklenmedi.'}
=================================================================`;
  }

  private static generateMarkdown(cv: CandidateCVEntity): string {
    return `# ${cv.firstName} ${cv.lastName}
**${cv.title || 'Aday'}** | *${cv.city}* | Toplam Deneyim: **${cv.totalExperienceYears} Yıl**

- **E-Posta:** ${cv.email}
- **Telefon:** ${cv.phone}
- **Askerlik Durumu:** ${cv.militaryStatus}
- **Başvuru Durumu:** ${cv.applicationStatus}
- **KVKK Geçerlilik:** ${cv.kvkkExpiryDate}

---

## 📌 Profesyonel Özet
${cv.summary || 'Özet bulunmamaktadır.'}

## 💼 İş Deneyimi
${cv.experiences
  .map(
    (e) => `### ${e.position} @ ${e.companyName}
*${e.startDate} - ${e.endDate}* (${e.years} Yıl)
${e.description}
`
  )
  .join('\n')}

## 🎓 Eğitim
${cv.educations
  .map(
    (edu) => `- **${edu.schoolName}** - ${edu.department} (${edu.degree}) [${edu.startYear} - ${edu.graduationYear || 'Devam Ediyor'}]`
  )
  .join('\n')}

## 🛠️ Yetenekler
${cv.skills.map((s) => `\`${s}\``).join(' ')}

---
*Bu CV, Enes Öztürk imzalı Online CV & İK Portalı üzerinden dışa aktarılmıştır.*
`;
  }
}
