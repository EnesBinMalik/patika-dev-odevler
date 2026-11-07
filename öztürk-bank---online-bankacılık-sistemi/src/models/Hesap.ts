import { HesapTuru, ParaBirimi, IHesapJSON } from '../types/banking';

export class Hesap {
  protected hesapNo: string;
  protected iban: string;
  protected bakiye: number;
  protected hesapTuru: HesapTuru;
  protected paraBirimi: ParaBirimi;
  protected olusturmaTarihi: string;
  protected ekHesapLimiti: number;

  constructor(
    hesapNo: string,
    iban: string,
    bakiye: number = 0,
    hesapTuru: HesapTuru = 'Vadesiz TL',
    paraBirimi: ParaBirimi = 'TRY',
    olusturmaTarihi: string = new Date().toISOString(),
    ekHesapLimiti: number = 0
  ) {
    this.hesapNo = hesapNo;
    this.iban = iban;
    this.bakiye = bakiye;
    this.hesapTuru = hesapTuru;
    this.paraBirimi = paraBirimi;
    this.olusturmaTarihi = olusturmaTarihi;
    this.ekHesapLimiti = ekHesapLimiti;
  }

  // Getter & Setter methods
  public getHesapNo(): string {
    return this.hesapNo;
  }

  public getIban(): string {
    return this.iban;
  }

  public getBakiye(): number {
    return this.bakiye;
  }

  public getHesapTuru(): HesapTuru {
    return this.hesapTuru;
  }

  public getParaBirimi(): ParaBirimi {
    return this.paraBirimi;
  }

  public getOlusturmaTarihi(): string {
    return this.olusturmaTarihi;
  }

  public getEkHesapLimiti(): number {
    return this.ekHesapLimiti;
  }

  public getKullanilabilirBakiye(): number {
    return this.bakiye + this.ekHesapLimiti;
  }

  // OOP İşlem Metotları
  public paraYatir(tutar: number): boolean {
    if (tutar <= 0) {
      throw new Error('Yatırılacak tutar sıfırdan büyük olmalıdır.');
    }
    this.bakiye = Number((this.bakiye + tutar).toFixed(2));
    return true;
  }

  public paraCek(tutar: number): boolean {
    if (tutar <= 0) {
      throw new Error('Çekilecek tutar sıfırdan büyük olmalıdır.');
    }
    if (tutar > this.getKullanilabilirBakiye()) {
      throw new Error(
        `Yetersiz bakiye! Kullanılabilir bakiye: ${this.getKullanilabilirBakiye().toLocaleString('tr-TR')} ${this.paraBirimi}`
      );
    }
    this.bakiye = Number((this.bakiye - tutar).toFixed(2));
    return true;
  }

  // JSON Serialization
  public toJSON(): IHesapJSON {
    return {
      hesapNo: this.hesapNo,
      iban: this.iban,
      bakiye: this.bakiye,
      hesapTuru: this.hesapTuru,
      paraBirimi: this.paraBirimi,
      olusturmaTarihi: this.olusturmaTarihi,
      ekHesapLimiti: this.ekHesapLimiti,
    };
  }

  public static fromJSON(data: IHesapJSON): Hesap {
    return new Hesap(
      data.hesapNo,
      data.iban,
      data.bakiye,
      data.hesapTuru,
      data.paraBirimi,
      data.olusturmaTarihi,
      data.ekHesapLimiti ?? 0
    );
  }
}
