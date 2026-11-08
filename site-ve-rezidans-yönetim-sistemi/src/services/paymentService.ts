import { TEST_BANKA_KARTLARI } from '../data/initialData';
import { Odeme, FaturaAidat, TestBankaKarti } from '../types';

export interface OdemeIstegi {
  fatura: FaturaAidat;
  kullaniciAdi: string;
  kartSahibi: string;
  kartNo: string;
  sktAy: string;
  sktYil: string;
  cvv: string;
}

export interface OdemeSonucu {
  basarili: boolean;
  hataMesaji?: string;
  odeme?: Odeme;
  bankaKodu?: string;
  onayKodu?: string;
}

/**
 * .NET WebAPI & MongoDB Banka Kredi Kartı Servisi Simülasyonu
 * Gerçek dünya kuralları: Kart no formatı, SKT kontrolü, CVV kontrolü, bakiye ve kredi limiti sorgulama.
 */
export class KrediKartiBankaServisi {
  private static kartVeritabani: TestBankaKarti[] = [...TEST_BANKA_KARTLARI];

  public static bankaKartlariniGetir(): TestBankaKarti[] {
    return this.kartVeritabani;
  }

  public static async odemeYap(istek: OdemeIstegi): Promise<OdemeSonucu> {
    // Ağ gecikmesi simülasyonu (600ms)
    await new Promise((resolve) => setTimeout(resolve, 600));

    const temizKartNo = istek.kartNo.replace(/\s+/g, '');

    // 1. Kart No Kontrolü
    if (temizKartNo.length < 15 || temizKartNo.length > 16 || !/^\d+$/.test(temizKartNo)) {
      return {
        basarili: false,
        hataMesaji: 'Geçersiz kredi kartı numarası! Lütfen 16 haneli kart numaranızı kontrol ediniz.',
        bankaKodu: 'ERR_INVALID_CARD_NUMBER',
      };
    }

    // 2. CVV Kontrolü
    if (!istek.cvv || istek.cvv.length < 3 || !/^\d{3,4}$/.test(istek.cvv)) {
      return {
        basarili: false,
        hataMesaji: 'Geçersiz güvenlik kodu (CVV)! Kartın arkasındaki 3 haneli kodu giriniz.',
        bankaKodu: 'ERR_INVALID_CVV',
      };
    }

    // 3. SKT Kontrolü
    const suankiYil = new Date().getFullYear() % 100;
    const suankiAy = new Date().getMonth() + 1;
    const girilenYil = parseInt(istek.sktYil, 10);
    const girilenAy = parseInt(istek.sktAy, 10);

    if (
      isNaN(girilenYil) ||
      isNaN(girilenAy) ||
      girilenAy < 1 ||
      girilenAy > 12 ||
      girilenYil < suankiYil ||
      (girilenYil === suankiYil && girilenAy < suankiAy)
    ) {
      return {
        basarili: false,
        hataMesaji: 'Kartın son kullanma tarihi geçmiş veya geçersiz!',
        bankaKodu: 'ERR_EXPIRED_CARD',
      };
    }

    // 4. MongoDB Banka Kayıtları ve Bakiye Kontrolü
    const bankaKaydi = this.kartVeritabani.find(
      (k) => k.kartNo.replace(/\s+/g, '') === temizKartNo
    );

    // Tanımlı test kartı ise bakiye kontrol et, bilinmeyen gerçek formattaki kart ise başarılı say
    if (bankaKaydi) {
      if (bankaKaydi.bakiye < istek.fatura.tutar) {
        return {
          basarili: false,
          hataMesaji: `Banka Reddi: Yetersiz Kredi Kartı Limiti / Bakiye! (Kart Bakiyesi: ${bankaKaydi.bakiye} TL, Gerekli: ${istek.fatura.tutar} TL)`,
          bankaKodu: 'ERR_INSUFFICIENT_FUNDS_51',
        };
      }
      // Bakiyeden düş
      bankaKaydi.bakiye -= istek.fatura.tutar;
      bankaKaydi.kullanilanLimit = (bankaKaydi.kullanilanLimit || 0) + istek.fatura.tutar;
    }

    // 5. Başarılı İşlem ve Makbuz Üretimi
    const now = new Date();
    const tarihStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(
      now.getDate()
    ).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(
      now.getMinutes()
    ).padStart(2, '0')}`;
    const timestamp = Date.now().toString().slice(-6);
    const makbuzNo = `MKB-${now.getFullYear()}-${timestamp}`;
    const bankaRef = `TXN-${Math.floor(1000000 + Math.random() * 9000000)}`;

    const yeniOdeme: Odeme = {
      id: `odm-${Date.now()}`,
      faturaId: istek.fatura.id,
      daireId: istek.fatura.daireId,
      kullaniciId: istek.fatura.kullaniciId || 'u-bilinmeyen',
      kullaniciAdi: istek.kullaniciAdi,
      faturaTuru: istek.fatura.tur,
      donemAy: istek.fatura.donemAy,
      tutar: istek.fatura.tutar,
      odemeTarihi: tarihStr,
      kartSahibi: istek.kartSahibi.toUpperCase(),
      kartSon4: temizKartNo.slice(-4),
      makbuzNo: makbuzNo,
      islemDurumu: 'Onaylandı',
      bankaReferansNo: bankaRef,
    };

    return {
      basarili: true,
      odeme: yeniOdeme,
      bankaKodu: 'SUCCESS_00',
      onayKodu: `AUTH-${Math.floor(100000 + Math.random() * 900000)}`,
    };
  }
}
