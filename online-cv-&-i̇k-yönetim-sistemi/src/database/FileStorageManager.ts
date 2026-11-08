/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * I/O (Input / Output) Dosya Kaydetme & Dışa/İçe Aktarma Yöneticisi
 * Gereksinim: "Hem database kaydetmek ve io(input/output) dosya kaydetmek"
 */

import { DatabaseContext } from './DatabaseContext';
import { CandidateCVEntity, AuditLogEntity } from '../types/models';
import { CVExportFactory, ExportFormat } from '../patterns/CVExportFactory';

export class FileStorageManager {
  private static instance: FileStorageManager | null = null;
  private db: DatabaseContext;

  private constructor() {
    this.db = DatabaseContext.getInstance();
  }

  public static getInstance(): FileStorageManager {
    if (!FileStorageManager.instance) {
      FileStorageManager.instance = new FileStorageManager();
    }
    return FileStorageManager.instance;
  }

  /**
   * Tarayıcı üzerinden dosya indirme tetikler (I/O File Output)
   */
  public triggerDownload(content: string, filename: string, mimeType: string): void {
    if (typeof window === 'undefined') return;
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * Aday CV'sini I/O dosyası olarak kaydetme (JSON / TXT / MD)
   */
  public exportCVToFile(cv: CandidateCVEntity, format: ExportFormat = 'JSON'): void {
    const file = CVExportFactory.createExport(cv, format);
    this.triggerDownload(file.content, file.filename, file.mimeType);
  }

  /**
   * Tüm veritabanını I/O dosyası olarak dışa aktarma (Full DB Backup)
   */
  public exportFullDatabaseToFile(): void {
    const backupData = {
      meta: {
        app: 'Online CV & İK Portalı',
        developer: 'Enes Öztürk',
        version: '1.0.0',
        exportedAt: new Date().toISOString(),
        totalUsers: this.db.users.size,
        totalCVs: this.db.candidateCVs.size,
        totalLogs: this.db.auditLogs.length,
      },
      users: Array.from(this.db.users.values()),
      candidateCVs: Array.from(this.db.candidateCVs.values()),
      auditLogs: this.db.auditLogs,
    };

    const content = JSON.stringify(backupData, null, 2);
    const dateStr = new Date().toISOString().slice(0, 10);
    this.triggerDownload(content, `online_cv_database_backup_${dateStr}.json`, 'application/json');
  }

  /**
   * Sistem Denetim Loglarını I/O `.log` dosyası olarak kaydetme
   */
  public exportAuditLogsToFile(): void {
    const logs = this.db.auditLogs;
    const lines = [
      `# =================================================================`,
      `# ONLİNE CV SİSTEMİ - İŞLEM DENETİM GÜNLÜĞÜ (AUDIT LOGS)`,
      `# Geliştirici: Enes Öztürk | S.O.L.I.D & Clean Code`,
      `# Dışa Aktarılma Zamanı: ${new Date().toLocaleString('tr-TR')}`,
      `# Toplam Kayıt: ${logs.length}`,
      `# =================================================================`,
      '',
    ];

    logs.forEach((log) => {
      lines.push(
        `[${log.createdAt}] [${log.level.padEnd(8)}] [${log.action}] User: ${log.username} (${log.role}) | Details: ${log.details} | IP: ${log.ipAddress}`
      );
    });

    const content = lines.join('\n');
    const dateStr = new Date().toISOString().slice(0, 10);
    this.triggerDownload(content, `system_audit_${dateStr}.log`, 'text/plain;charset=utf-8');
  }

  /**
   * I/O Dosyasından Veritabanını Geri Yükleme (Input File)
   */
  public async importDatabaseFromFile(file: File): Promise<{ success: boolean; message: string }> {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);

      if (!parsed.users || !parsed.candidateCVs) {
        return { success: false, message: 'Geçersiz yedek dosyası formatı! users veya candidateCVs bulunamadı.' };
      }

      this.db.users.clear();
      this.db.candidateCVs.clear();
      this.db.auditLogs = [];

      parsed.users.forEach((u: any) => this.db.users.set(u.id, u));
      parsed.candidateCVs.forEach((c: any) => this.db.candidateCVs.set(c.id, c));
      if (Array.isArray(parsed.auditLogs)) {
        this.db.auditLogs = parsed.auditLogs;
      }

      this.db.persist();
      return { success: true, message: 'Veritabanı başarıyla dosyadan içe aktarıldı!' };
    } catch (err: any) {
      return { success: false, message: `İçe aktarma hatası: ${err.message || 'Dosya okunamadı'}` };
    }
  }
}
