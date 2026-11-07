import { IKrediJSON, KrediTuru } from '../types/banking';

export class Kredi {
  private krediId: string;
  private krediTuru: KrediTuru;
  private anaPara: number;
  private faizOrani: number; // Aylık faiz oranı (yüzde cinsinden, örn 3.50)
  private vadeAy: number;
  private aylikTaksit: number;
  private toplamGeriOdeme: number;
  private kalanBorc: number;
  private kalanTaksit: number;
  private toplamTaksit: number;
  private baslangicTarihi: string;
  private durum: 'Aktif' | 'Tamamlandı';

  constructor(
    krediId: string,
    krediTuru: KrediTuru,
    anaPara: number,
    faizOrani: number,
    vadeAy: number,
    aylikTaksit?: number,
    toplamGeriOdeme?: number,
    kalanBorc?: number,
    kalanTaksit?: number,
    toplamTaksit?: number,
    baslangicTarihi: string = new Date().toISOString(),
    durum: 'Aktif' | 'Tamamlandı' = 'Aktif'
  ) {
    this.krediId = krediId;
    this.krediTuru = krediTuru;
    this.anaPara = anaPara;
    this.faizOrani = faizOrani;
    this.vadeAy = vadeAy;
    this.baslangicTarihi = baslangicTarihi;
    this.durum = durum;

    // Eğer parametre verilmemişse standart finansal kredi amortisman formülüyle hesapla
    if (!aylikTaksit || !toplamGeriOdeme) {
      const hesap = Kredi.hesaplaKrediPlani(anaPara, faizOrani, vadeAy);
      this.aylikTaksit = hesap.aylikTaksit;
      this.toplamGeriOdeme = hesap.toplamGeriOdeme;
    } else {
      this.aylikTaksit = aylikTaksit;
      this.toplamGeriOdeme = toplamGeriOdeme;
    }

    this.toplamTaksit = toplamTaksit ?? vadeAy;
    this.kalanTaksit = kalanTaksit ?? vadeAy;
    this.kalanBorc = kalanBorc !== undefined ? kalanBorc : this.toplamGeriOdeme;
  }

  // Getters
  public getKrediId(): string {
    return this.krediId;
  }

  public getKrediTuru(): KrediTuru {
    return this.krediTuru;
  }

  public getAnaPara(): number {
    return this.anaPara;
  }

  public getFaizOrani(): number {
    return this.faizOrani;
  }

  public getVadeAy(): number {
    return this.vadeAy;
  }

  public getAylikTaksit(): number {
    return this.aylikTaksit;
  }

  public getToplamGeriOdeme(): number {
    return this.toplamGeriOdeme;
  }

  public getKalanBorc(): number {
    return this.kalanBorc;
  }

  public getKalanTaksit(): number {
    return this.kalanTaksit;
  }

  public getToplamTaksit(): number {
    return this.toplamTaksit;
  }

  public getBaslangicTarihi(): string {
    return this.baslangicTarihi;
  }

  public getDurum(): 'Aktif' | 'Tamamlandı' {
    return this.durum;
  }

  /**
   * Kullanıcı bankaya kredi taksiti öder
   */
  public taksitOde(odenecekTutar: number = this.aylikTaksit): {
    odenen: number;
    kalanTaksit: number;
    kalanBorc: number;
    krediKapandiMi: boolean;
  } {
    if (this.durum === 'Tamamlandı' || this.kalanBorc <= 0 || this.kalanTaksit <= 0) {
      throw new Error('Bu kredi borcu zaten tamamen kapatılmıştır.');
    }

    const odenen = Math.min(odenecekTutar, this.kalanBorc);
    this.kalanBorc = Number(Math.max(0, this.kalanBorc - odenen).toFixed(2));
    this.kalanTaksit = Math.max(0, this.kalanTaksit - 1);

    if (this.kalanBorc <= 0 || this.kalanTaksit === 0) {
      this.durum = 'Tamamlandı';
      this.kalanBorc = 0;
    }

    return {
      odenen,
      kalanTaksit: this.kalanTaksit,
      kalanBorc: this.kalanBorc,
      krediKapandiMi: this.durum === 'Tamamlandı',
    };
  }

  /**
   * Statik Finansal Kredi Taksit Hesaplama (Eşit Taksitli Kredi / Anüite Formülü):
   * Taksit = P * [ r * (1 + r)^n ] / [ (1 + r)^n - 1 ]
   * (KKDF %15 ve BSMV %5 bankacılık vergileri faize dahil edilmiştir)
   */
  public static hesaplaKrediPlani(
    anaPara: number,
    aylikFaizYuzdesi: number,
    vadeAy: number
  ): { aylikTaksit: number; toplamGeriOdeme: number; toplamFaiz: number } {
    if (anaPara <= 0 || vadeAy <= 0) {
      return { aylikTaksit: 0, toplamGeriOdeme: 0, toplamFaiz: 0 };
    }

    // Efektif faiz (KKDF ve BSMV dahil)
    const vergiCarpani = 1.2; // %15 KKDF + %5 BSMV
    const efektifAylikFaiz = (aylikFaizYuzdesi / 100) * vergiCarpani;

    const carpan = Math.pow(1 + efektifAylikFaiz, vadeAy);
    const aylikTaksit = (anaPara * (efektifAylikFaiz * carpan)) / (carpan - 1);

    const yuvarlanmisTaksit = Number(aylikTaksit.toFixed(2));
    const toplamGeriOdeme = Number((yuvarlanmisTaksit * vadeAy).toFixed(2));
    const toplamFaiz = Number((toplamGeriOdeme - anaPara).toFixed(2));

    return {
      aylikTaksit: yuvarlanmisTaksit,
      toplamGeriOdeme,
      toplamFaiz,
    };
  }

  public toJSON(): IKrediJSON {
    return {
      krediId: this.krediId,
      krediTuru: this.krediTuru,
      anaPara: this.anaPara,
      faizOrani: this.faizOrani,
      vadeAy: this.vadeAy,
      aylikTaksit: this.aylikTaksit,
      toplamGeriOdeme: this.toplamGeriOdeme,
      kalanBorc: this.kalanBorc,
      kalanTaksit: this.kalanTaksit,
      toplamTaksit: this.toplamTaksit,
      baslangicTarihi: this.baslangicTarihi,
      durum: this.durum,
    };
  }

  public static fromJSON(data: IKrediJSON): Kredi {
    return new Kredi(
      data.krediId,
      data.krediTuru,
      data.anaPara,
      data.faizOrani,
      data.vadeAy,
      data.aylikTaksit,
      data.toplamGeriOdeme,
      data.kalanBorc,
      data.kalanTaksit,
      data.toplamTaksit,
      data.baslangicTarihi,
      data.durum
    );
  }
}
