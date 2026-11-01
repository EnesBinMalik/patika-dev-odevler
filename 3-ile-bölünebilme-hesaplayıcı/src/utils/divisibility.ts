/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * ============================================================================
 * ÖDEV: 3 İLE BÖLÜNEBİLİRLİK VE EN YAKIN BÖLÜNEBİLEN SAYI HESAPLAYICI
 * HAZIRLAYAN: ENES ÖZTÜRK
 * ============================================================================
 */

import { getTurkishCopula } from './turkishGrammar';

export interface DivisibilityResult {
  girilenSayi: number;
  bolunebilirMi: boolean;
  kalan: number;
  bolum: number;
  ilkBolunebilenSayi: number;
  oncekiBolunebilenSayi: number;
  eklenecekMiktar: number;
  cikarilacakMiktar: number;
  rakamlarToplami: number;
  rakamlarDizisi: number[];
  mesaj: string;
  detayliAciklama: string;
  imza: string;
  tarih: string;
}

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  parsedNumber?: number;
}

/**
 * Kullanıcı girdisini doğrular.
 * Boş değer kontrolü ve sayısal geçerlilik kontrolü yapar.
 */
export function girdiyiDogrula(deger: string | null | undefined): ValidationResult {
  if (deger === null || deger === undefined || deger.trim() === '') {
    return {
      isValid: false,
      errorMessage: 'Değer boş olamaz! Lütfen bir sayı giriniz.',
    };
  }

  const temizDeger = deger.trim();

  // Tam sayı kontrolü (negatif sayılar dahil)
  if (!/^-?\d+$/.test(temizDeger)) {
    return {
      isValid: false,
      errorMessage: 'Lütfen geçerli bir tam sayı giriniz (örneğin: 4, 15, -9).',
    };
  }

  const sayi = Number(temizDeger);

  if (!Number.isSafeInteger(sayi)) {
    return {
      isValid: false,
      errorMessage: 'Lütfen JavaScript güvenli tam sayı sınırları içinde bir değer giriniz.',
    };
  }

  return {
    isValid: true,
    parsedNumber: sayi,
  };
}

/**
 * ÖDEVİN ANA FONKSİYONU:
 * Gelen sayı değerinin 3 ile bölümünden kalanın 0 olup olmadığını kontrol eder.
 * Bölünemiyorsa bölünebilecek ilk sayıyı hesaplar.
 * 
 * @param sayi Kontrol edilecek tam sayı
 * @returns DivisibilityResult
 */
export function ucIleBolunebilirlikKontrolu(sayi: number): DivisibilityResult {
  // Pozitif kalan hesabı (negatif sayılarda da modülo 3 sonucunu 0, 1, 2 yapar)
  const pozitifKalan = ((sayi % 3) + 3) % 3;
  const bolunebilirMi = pozitifKalan === 0;
  
  // Ödevde istenen formülasyon:
  // Bölünemiyorsa, sayıyı aşan ve 3'e tam bölünebilen ilk tam sayı:
  // Örnek: Sayı 4 ise -> pozitifKalan = 1 -> eklenecek = 3 - 1 = 2 -> ilk = 4 + 2 = 6
  let eklenecekMiktar = 0;
  let cikarilacakMiktar = 0;
  let ilkBolunebilenSayi = sayi;
  let oncekiBolunebilenSayi = sayi;

  if (bolunebilirMi) {
    eklenecekMiktar = 0;
    cikarilacakMiktar = 0;
    ilkBolunebilenSayi = sayi;
    oncekiBolunebilenSayi = sayi;
  } else {
    eklenecekMiktar = 3 - pozitifKalan;
    cikarilacakMiktar = pozitifKalan;
    ilkBolunebilenSayi = sayi + eklenecekMiktar;
    oncekiBolunebilenSayi = sayi - cikarilacakMiktar;
  }

  // Rakamlar toplamı analizi (3 ile bölünebilme kuralı)
  const basamaklar = Math.abs(sayi).toString().split('').map(Number);
  const rakamlarToplami = basamaklar.reduce((toplam, r) => toplam + r, 0);

  // Standart bölme işlemi sonuçları
  const bolum = Math.floor(sayi / 3);

  // İstenen standart mesaj:
  let mesaj = '';
  if (bolunebilirMi) {
    mesaj = `Girdiğiniz sayı (${sayi}) 3'e tam bölünür.`;
  } else {
    const copula = getTurkishCopula(ilkBolunebilenSayi);
    mesaj = `Girdiğiniz sayı 3'e bölünemez. Bölünebilecek ilk sayı ${copula}.`;
  }

  const detayliAciklama = bolunebilirMi
    ? `${sayi} sayısı 3'e tam bölünebilir çünkü rakamları toplamı (${rakamlarToplami}) 3'ün tam bir katıdır (${sayi} = 3 × ${bolum} + 0).`
    : `${sayi} sayısının rakamları toplamı ${rakamlarToplami} olup 3 ile bölümünden kalan ${pozitifKalan}'dir. 3'e tam bölünebilmesi için ${eklenecekMiktar} eklenerek ${ilkBolunebilenSayi} elde edilir.`;

  return {
    girilenSayi: sayi,
    bolunebilirMi,
    kalan: pozitifKalan,
    bolum,
    ilkBolunebilenSayi,
    oncekiBolunebilenSayi,
    eklenecekMiktar,
    cikarilacakMiktar,
    rakamlarToplami,
    rakamlarDizisi: basamaklar,
    mesaj,
    detayliAciklama,
    imza: 'Enes Öztürk',
    tarih: new Date().toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }),
  };
}
