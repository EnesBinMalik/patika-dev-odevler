import { Hesap } from './Hesap';
import { IHesapJSON } from '../types/banking';

export class VadeliHesap extends Hesap {
  private vadeGunu: number;
  private faizOrani: number; // Yıllık brüt faiz oranı örn: 45
  private vadeBaslangic: string;
  private vadeBitis: string;

  constructor(
    hesapNo: string,
    iban: string,
    bakiye: number,
    vadeGunu: number = 32,
    faizOrani: number = 45,
    olusturmaTarihi: string = new Date().toISOString(),
    vadeBaslangic: string = new Date().toISOString(),
    vadeBitis?: string
  ) {
    super(hesapNo, iban, bakiye, 'Vadeli TL', 'TRY', olusturmaTarihi, 0);
    this.vadeGunu = vadeGunu;
    this.faizOrani = faizOrani;
    this.vadeBaslangic = vadeBaslangic;

    if (vadeBitis) {
      this.vadeBitis = vadeBitis;
    } else {
      const bitis = new Date(vadeBaslangic);
      bitis.setDate(bitis.getDate() + vadeGunu);
      this.vadeBitis = bitis.toISOString();
    }
  }

  public getVadeGunu(): number {
    return this.vadeGunu;
  }

  public getFaizOrani(): number {
    return this.faizOrani;
  }

  public getVadeBaslangic(): string {
    return this.vadeBaslangic;
  }

  public getVadeBitis(): string {
    return this.vadeBitis;
  }

  /**
   * Türk Bankacılık Vadeli Mevduat Faiz Formülü:
   * Faiz Getirisi = (Anapara * Faiz Oranı * Vade Günü) / 36500
   * %5 Stopaj vergisi düşülür.
   */
  public getNetFaizGetirisi(): number {
    const brutFaiz = (this.bakiye * this.faizOrani * this.vadeGunu) / 36500;
    const stopaj = brutFaiz * 0.05; // %5 mevduat stopajı
    return Number((brutFaiz - stopaj).toFixed(2));
  }

  public getVadeSonuToplamTutar(): number {
    return Number((this.bakiye + this.getNetFaizGetirisi()).toFixed(2));
  }

  public override toJSON(): IHesapJSON {
    return {
      ...super.toJSON(),
      vadeGunu: this.vadeGunu,
      faizOrani: this.faizOrani,
      vadeBaslangic: this.vadeBaslangic,
      vadeBitis: this.vadeBitis,
    };
  }

  public static override fromJSON(data: IHesapJSON): VadeliHesap {
    return new VadeliHesap(
      data.hesapNo,
      data.iban,
      data.bakiye,
      data.vadeGunu ?? 32,
      data.faizOrani ?? 45,
      data.olusturmaTarihi,
      data.vadeBaslangic ?? data.olusturmaTarihi,
      data.vadeBitis
    );
  }
}
