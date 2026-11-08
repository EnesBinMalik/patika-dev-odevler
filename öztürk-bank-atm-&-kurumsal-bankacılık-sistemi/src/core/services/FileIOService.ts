/**
 * FileIOService - Girdi / Çıktı (I/O) Dosya Yönetim Servisi
 * Kural: Hem database'e kaydetmek hem de I/O dosya olarak kaydetmek
 * Mimar: Enes Öztürk
 */

import { DatabaseManager } from '../database/DatabaseManager';
import { Transaction } from '../models/Transaction';
import { Account } from '../models/Account';
import { User } from '../models/User';
import { PasswordService } from '../security/PasswordService';

export class FileIOService {
  private static triggerDownload(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  /**
   * Tüm sistem veritabanını JSON dosyası olarak diske kaydeder (I/O)
   */
  public static exportDatabaseBackup(): void {
    const db = DatabaseManager.getInstance();
    const jsonContent = db.exportDatabaseToJson();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.triggerDownload(jsonContent, `OzturkBank_Database_Backup_${timestamp}.json`, 'application/json');
  }

  /**
   * Müşteri ve hesap listesini CSV formatında diske kaydeder (I/O)
   */
  public static exportCustomersCsv(): void {
    const db = DatabaseManager.getInstance();
    const csvContent = db.exportCustomersToCsv();
    const timestamp = new Date().toISOString().slice(0, 10);
    this.triggerDownload(csvContent, `OzturkBank_Musteri_ve_Bakiye_Raporu_${timestamp}.csv`, 'text/csv;charset=utf-8;');
  }

  /**
   * İşlem Dekontu (Nakit Çekme, Yatırma veya Havale) için resmi banka dekontu oluşturup kaydeder
   * Enes Öztürk İmzalı
   */
  public static generateAndDownloadReceipt(transaction: Transaction, account?: Account, user?: User): void {
    const now = new Date(transaction.createdAt).toLocaleString('tr-TR');
    const maskedIban = account ? PasswordService.maskIban(account.iban) : 'TR33 **** **** ****';
    const maskedCard = account ? account.maskCardNumber() : '5421 **** **** ****';
    const customerName = user ? user.fullName : 'Değerli Müşterimiz';
    const maskedTc = user ? PasswordService.maskTcNo(user.tcNo) : '111*****11';

    const slip = `
================================================================================
                    ÖZTÜRK BANK T.A.Ş. - RESMİ BANKA DEKONTU
             Sistem Baş Mimarı & Yönetim Kurulu Başkanı: ENES ÖZTÜRK
================================================================================
İşlem Referans No : ${transaction.transactionNumber}
Tarih ve Saat     : ${now}
Terminal / Kanal  : Öztürk Bank Akıllı ATM Terminali #04 (Kadıköy)
Onay Kodu         : APPRV-${Math.floor(100000 + Math.random() * 900000)}

-------------------------------- MÜŞTERİ BİLGİLERİ -----------------------------
Müşteri Ad Soyad  : ${customerName}
TC Kimlik No      : ${maskedTc}
Hesap Numarası    : ${account ? account.accountNumber : '---'}
IBAN              : ${maskedIban}
Kart Numarası     : ${maskedCard}

-------------------------------- İŞLEM DETAYLARI -------------------------------
İşlem Türü        : ${transaction.transactionType}
Açıklama          : ${transaction.description}
${transaction.targetIban ? `Alıcı IBAN         : ${transaction.targetIban}\n` : ''}${transaction.targetRecipientName ? `Alıcı Ad Soyad    : ${transaction.targetRecipientName}\n` : ''}
İşlem Tutarı      : ${transaction.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
İşlem Masrafı     : ${transaction.fee.toFixed(2)} TL
Toplam Tahsilat   : ${(transaction.amount + transaction.fee).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
Kalan Bakiye      : ${transaction.balanceAfter.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} TL
İşlem Durumu      : ${transaction.status} (ONAYLANDI)

================================================================================
Bu belge 5411 sayılı Bankacılık Kanunu uyarınca elektronik ortamda üretilmiştir.
Geliştirici & Sistem Mimarı: ENES ÖZTÜRK
Tasarım Prensipleri: S.O.L.I.D, Clean Code, OOP Katmanlı Mimari
Müşteri Hizmetleri: 0850 555 00 00 | www.ozturkbank.com.tr
================================================================================
`;

    this.triggerDownload(slip.trim(), `Dekont_${transaction.transactionNumber}.txt`, 'text/plain;charset=utf-8;');
  }

  /**
   * Tüm sistem loglarını metin belgesi olarak indirir
   */
  public static exportAuditLogsTxt(): void {
    const db = DatabaseManager.getInstance();
    const logs = db.auditLogs.findAll();
    const content = logs.map(l => `[${l.timestamp}] [${l.level}] [${l.action}] [IP: ${l.ipAddress}] ${l.details}`).join('\n');
    this.triggerDownload(content, `OzturkBank_Sistem_Guvenlik_Loglari_${Date.now()}.txt`, 'text/plain;charset=utf-8;');
  }
}
