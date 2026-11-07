import { Banka } from '../models/Banka';
import { IBankaJSON } from '../types/banking';
import defaultData from '../data/initialBankData.json';

const STORAGE_KEY = 'ozturk_bank_data_json';

export class BankStorageService {
  /**
   * JSON verisini okur ve Banka OOP nesnesi olarak başlatır.
   * Veritabanı kullanılmaz; JSON yapısı okunur ve işlenir.
   */
  public static loadBank(): Banka {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as IBankaJSON;
        return new Banka(parsed);
      }
    } catch (err) {
      console.warn('LocalStorage JSON okunamadı, varsayılan JSON verisi yükleniyor:', err);
    }

    // İlk açılışta initial JSON verisini yükle ve kaydet
    const defaultBank = new Banka(defaultData as unknown as IBankaJSON);
    BankStorageService.saveBank(defaultBank);
    return defaultBank;
  }

  /**
   * Banka nesnesini doğrudan JSON formatına dönüştürerek saklar.
   */
  public static saveBank(banka: Banka): void {
    try {
      const jsonObj = banka.toJSON();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jsonObj, null, 2));
    } catch (err) {
      console.error('Banka JSON verisi kaydedilemedi:', err);
    }
  }

  /**
   * JSON verilerini fabrika ayarlarına döndürür
   */
  public static resetToInitial(): Banka {
    localStorage.removeItem(STORAGE_KEY);
    const bank = new Banka(defaultData as unknown as IBankaJSON);
    BankStorageService.saveBank(bank);
    return bank;
  }

  /**
   * Ham JSON string çıktısı verir (İnceleme & Dışa Aktarma için)
   */
  public static getRawJSONString(banka: Banka): string {
    return JSON.stringify(banka.toJSON(), null, 2);
  }

  /**
   * Dışarıdan yüklenen JSON string'i parse edip sisteme yükler
   */
  public static importFromJSONString(jsonString: string): Banka {
    const parsed = JSON.parse(jsonString) as IBankaJSON;
    if (!parsed.bankaKodu || !Array.isArray(parsed.musteriler)) {
      throw new Error('Geçersiz Banka JSON formatı! Eksik alanlar mevcut.');
    }
    const yeniBanka = new Banka(parsed);
    BankStorageService.saveBank(yeniBanka);
    return yeniBanka;
  }
}
