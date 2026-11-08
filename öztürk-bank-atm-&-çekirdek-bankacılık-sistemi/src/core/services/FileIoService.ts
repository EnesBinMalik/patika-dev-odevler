/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Dosya Girdi / Çıktı Servisi (File I/O Service)
 * Geliştirici: Enes Öztürk
 *
 * Kurallar:
 * - Sistemdeki kullanıcılar ve loglar için hem database kaydetmek hem de dosya (I/O) olarak dışa aktarabilmek.
 * - Enes Öztürk imzalı resmi banka dekontu oluşturma ve indirme.
 */

import { AuditLog, CustomerAccountProjection, Transaction } from '../../types/models';
import { LocalStorageBankRepository } from '../repositories/LocalStorageBankRepository';

export class FileIoService {
  private static triggerDownload(blob: Blob, filename: string): void {
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
   * Sistem Denetim Loglarını CSV Formatında İndir
   */
  public static exportLogsToCsv(logs: AuditLog[]): void {
    const headers = ['Log_ID', 'Tarih_Saat', 'Eylem', 'Kullanici_ID', 'Kullanici_Adi', 'Rol', 'IP_Adresi', 'Durum', 'Tutar_TL', 'Detay'];
    const rows = logs.map((log) => [
      log.id,
      `"${new Date(log.createdAt).toLocaleString('tr-TR')}"`,
      log.action,
      log.userId || '-',
      `"${log.userFullName || '-'}"`,
      log.userRole,
      log.ipAddress,
      log.status,
      log.amount || 0,
      `"${(log.details || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `ozturkbank_audit_logs_${new Date().toISOString().slice(0, 10)}.csv`;
    this.triggerDownload(blob, filename);
  }

  /**
   * Sistem Denetim Loglarını JSON Formatında İndir
   */
  public static exportLogsToJson(logs: AuditLog[]): void {
    const jsonContent = JSON.stringify(logs, null, 2);
    const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
    const filename = `ozturkbank_audit_logs_${new Date().toISOString().slice(0, 10)}.json`;
    this.triggerDownload(blob, filename);
  }

  /**
   * Müşteri ve Hesap Veritabanını (SQL Projection) CSV Olarak İndir
   */
  public static exportCustomersToCsv(customers: CustomerAccountProjection[]): void {
    const headers = [
      'Musteri_ID',
      'TC_Kimlik_No',
      'Ad_Soyad',
      'E_Posta',
      'Telefon',
      'Hesap_Durumu',
      'Hatali_Giris_Sayisi',
      'Hesap_No',
      'IBAN',
      'Bakiye_TL',
      'Kart_No',
      'Kayitli_Sube',
    ];

    const rows = customers.map((c) => [
      c.customerId,
      `"${c.tcNo}"`,
      `"${c.fullName}"`,
      `"${c.email}"`,
      `"${c.phone}"`,
      c.status,
      c.failedAttempts,
      `"${c.accountNumber}"`,
      `"${c.iban}"`,
      c.balance,
      `"${c.cardNumber}"`,
      `"${c.registeredBranchName}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const filename = `ozturkbank_musteri_veritabani_${new Date().toISOString().slice(0, 10)}.csv`;
    this.triggerDownload(blob, filename);
  }

  /**
   * Tüm Veritabanı Yedeği (JSON I/O)
   */
  public static exportFullDatabaseBackup(): void {
    const repo = LocalStorageBankRepository.getInstance();
    const jsonStr = repo.exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json;charset=utf-8;' });
    const filename = `ozturkbank_tam_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    this.triggerDownload(blob, filename);
  }

  /**
   * Resmi İşlem Dekontu (Text / Printable Format) - Enes Öztürk İmzalı
   */
  public static generateReceiptText(
    transaction: Transaction,
    customerName: string,
    accountNumber: string,
    iban: string
  ): string {
    const formattedDate = new Date(transaction.createdAt).toLocaleString('tr-TR');
    return `===============================================================
              ÖZTÜRK BANK A.Ş. - RESMİ İŞLEM DEKONTU
             Kadıköy Merkez Şubesi | Şube Kodu: 3401
===============================================================
Dekont / Ref No   : ${transaction.transactionNumber}
İşlem Tarihi/Saat : ${formattedDate}
Kanal             : ${transaction.channel === 'ATM_TERMINAL' ? 'ATM Terminali (01)' : 'İnternet Şubesi'}
İşlem Türü        : ${transaction.type}
---------------------------------------------------------------
MÜŞTERİ BİLGİLERİ:
Ad Soyad          : ${customerName}
Hesap No          : ${accountNumber}
IBAN              : ${iban}
---------------------------------------------------------------
İŞLEM DETAYLARI:
İşlem Tutarı      : ${transaction.amount.toLocaleString('tr-TR')} ₺
Önceki Bakiye     : ${transaction.previousBalance.toLocaleString('tr-TR')} ₺
Güncel Bakiye     : ${transaction.newBalance.toLocaleString('tr-TR')} ₺
Açıklama          : ${transaction.description}
${transaction.targetIban ? `Alıcı IBAN         : ${transaction.targetIban}\n` : ''}${transaction.targetAccountTitle ? `Alıcı Ünvan        : ${transaction.targetAccountTitle}\n` : ''}
İşlem Durumu      : ${transaction.status} (ONAYLANDI)
===============================================================
Güvenlik Kodu     : SEC-${Math.random().toString(36).substring(2, 8).toUpperCase()}-${Date.now().toString().slice(-6)}
Sistem Yöneticisi &
Baş Yazılım Mimarı: ENES ÖZTÜRK [E-İMZALIDIR]
Tasarım & Mimari  : S.O.L.I.D & Clean Code Mimari Standartları
===============================================================`;
  }

  /**
   * Dekontu TXT dosyası olarak indir
   */
  public static downloadReceiptFile(
    transaction: Transaction,
    customerName: string,
    accountNumber: string,
    iban: string
  ): void {
    const text = this.generateReceiptText(transaction, customerName, accountNumber, iban);
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8;' });
    const filename = `Dekont_${transaction.transactionNumber}.txt`;
    this.triggerDownload(blob, filename);
  }
}
