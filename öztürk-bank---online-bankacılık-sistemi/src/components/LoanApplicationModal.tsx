import React, { useState } from 'react';
import {
  X,
  BadgePercent,
  Calculator,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Building2,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Kredi } from '../models/Kredi';
import { KrediTuru } from '../types/banking';

interface LoanApplicationModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  onKapat: () => void;
  onBasvuruBasarili: (yeniKredi: Kredi) => void;
}

export const LoanApplicationModal: React.FC<LoanApplicationModalProps> = ({
  banka,
  aktifKullanici,
  onKapat,
  onBasvuruBasarili,
}) => {
  const [krediTuru, setKrediTuru] = useState<KrediTuru>('İhtiyaç Kredisi');
  const [tutar, setTutar] = useState<number>(50000);
  const [vadeAy, setVadeAy] = useState<number>(12);
  const [hedefIban, setHedefIban] = useState<string>(
    aktifKullanici.varsayilanVadesizHesap()?.getIban() || ''
  );
  const [hata, setHata] = useState<string>('');

  const faizler = banka.getGuncelFaizler();
  let faizOrani = faizler.ihtiyacKredisiAylik;
  if (krediTuru === 'Taşıt Kredisi') faizOrani = faizler.tasitKredisiAylik;
  if (krediTuru === 'Konut Kredisi') faizOrani = faizler.konutKredisiAylik;

  // Anlık amortisman hesaplaması
  const sim = Kredi.hesaplaKrediPlani(tutar, faizOrani, vadeAy);

  const handleBasvuruSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    if (tutar <= 0) {
      setHata('Lütfen geçerli bir kredi tutarı belirleyiniz.');
      return;
    }

    if (!hedefIban) {
      setHata('Kredi tutarının yatırılacağı vadesiz hesap seçilmelidir.');
      return;
    }

    try {
      const yeniKredi = banka.krediBasvurusu(
        aktifKullanici.getTcNo(),
        tutar,
        vadeAy,
        krediTuru,
        hedefIban
      );

      onBasvuruBasarili(yeniKredi);
    } catch (err: any) {
      setHata(err.message || 'Kredi başvurusu onaylanırken sorun oluştu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onKapat}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Calculator className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Anında Kredi Başvurusu</h2>
            <p className="text-xs text-slate-400">
              Onaylanan kredi tutarı anında vadesiz hesabınıza geçer
            </p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={handleBasvuruSubmit} className="space-y-4">
          {/* Kredi Türü */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Kredi Türü</label>
            <div className="grid grid-cols-3 gap-2">
              {(['İhtiyaç Kredisi', 'Taşıt Kredisi', 'Konut Kredisi'] as KrediTuru[]).map(
                (tur) => (
                  <button
                    key={tur}
                    type="button"
                    onClick={() => setKrediTuru(tur)}
                    className={`py-2 px-2 text-xs font-medium rounded-xl border text-center transition-all ${
                      krediTuru === tur
                        ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm'
                        : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {tur.replace(' Kredisi', '')}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Kredi Tutarı Slider & Input */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Talep Edilen Kredi Tutarı</label>
              <span className="font-mono text-sm font-bold text-emerald-400">
                {tutar.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <input
              type="range"
              min="5000"
              max="250000"
              step="5000"
              value={tutar}
              onChange={(e) => setTutar(Number(e.target.value))}
              className="w-full accent-emerald-500 bg-slate-800 h-2 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
              <span>5.000 TL</span>
              <span>125.000 TL</span>
              <span>250.000 TL</span>
            </div>
          </div>

          {/* Vade Ay Seçimi */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-medium text-slate-300">Vade Seçeneği</label>
              <span className="font-mono text-xs font-semibold text-white">{vadeAy} Ay</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[6, 12, 24, 36].map((ay) => (
                <button
                  key={ay}
                  type="button"
                  onClick={() => setVadeAy(ay)}
                  className={`py-2 text-xs font-mono font-medium rounded-xl border transition-all ${
                    vadeAy === ay
                      ? 'bg-slate-800 text-emerald-400 border-emerald-500 shadow-sm'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {ay} Ay
                </button>
              ))}
            </div>
          </div>

          {/* Kredi Hesaplama Tablosu */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Aylık Faiz Oranı:</span>
              <span className="font-mono text-slate-200">%{faizOrani.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Aylık Taksit Tutarı:</span>
              <span className="font-mono text-emerald-400 text-sm font-extrabold">
                {sim.aylikTaksit.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Toplam Faiz Tutarı (Vergiler Dahil):</span>
              <span className="font-mono text-slate-300">
                {sim.toplamFaiz.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Toplam Geri Ödenecek Tutar:</span>
              <span className="font-mono text-amber-400 font-bold">
                {sim.toplamGeriOdeme.toLocaleString('tr-TR')} TL
              </span>
            </div>
          </div>

          {/* Kredi Parası Nereye Yatsın? */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Kredinin Aktarılacağı Vadesiz Hesap
            </label>
            <select
              value={hedefIban}
              onChange={(e) => setHedefIban(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {aktifKullanici
                .getHesaplar()
                .filter((h) => h.getParaBirimi() === 'TRY')
                .map((h) => (
                  <option key={h.getIban()} value={h.getIban()}>
                    {h.getHesapTuru()} ({h.getIban()}) - Bakiye:{' '}
                    {h.getBakiye().toLocaleString('tr-TR')} TL
                  </option>
                ))}
            </select>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Krediyi Anında Onayla & Hesaba Aktar</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
