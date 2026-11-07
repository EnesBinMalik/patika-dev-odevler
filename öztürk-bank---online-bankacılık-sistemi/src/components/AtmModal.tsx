import React, { useState } from 'react';
import { X, ArrowDownCircle, ArrowUpCircle, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Islem } from '../models/Islem';
import { Hesap } from '../models/Hesap';

interface AtmModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  seciliHesap?: Hesap;
  islemTuru: 'yatir' | 'cek';
  onKapat: () => void;
  onBasarili: (islem: Islem) => void;
}

export const AtmModal: React.FC<AtmModalProps> = ({
  banka,
  aktifKullanici,
  seciliHesap,
  islemTuru,
  onKapat,
  onBasarili,
}) => {
  const hesaplar = aktifKullanici.getHesaplar();
  const [iban, setIban] = useState<string>(
    seciliHesap?.getIban() || hesaplar[0]?.getIban() || ''
  );
  const [tutar, setTutar] = useState<string>('');
  const [hata, setHata] = useState<string>('');

  const hedefHesap = aktifKullanici.hesapBul(iban) || hesaplar[0];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    const tutarNum = parseFloat(tutar);
    if (isNaN(tutarNum) || tutarNum <= 0) {
      setHata('Lütfen geçerli bir tutar giriniz.');
      return;
    }

    if (!hedefHesap) {
      setHata('İşlem yapılacak hesap bulunamadı.');
      return;
    }

    try {
      let islem: Islem;
      if (islemTuru === 'yatir') {
        islem = banka.paraYatir(aktifKullanici.getTcNo(), hedefHesap.getIban(), tutarNum);
      } else {
        islem = banka.paraCek(aktifKullanici.getTcNo(), hedefHesap.getIban(), tutarNum);
      }
      onBasarili(islem);
    } catch (err: any) {
      setHata(err.message || 'İşlem gerçekleştirilemedi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100">
        <button
          onClick={onKapat}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            {islemTuru === 'yatir' ? (
              <ArrowDownCircle className="w-5 h-5 text-emerald-400" />
            ) : (
              <ArrowUpCircle className="w-5 h-5 text-amber-400" />
            )}
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">
              {islemTuru === 'yatir' ? 'Öztürk Bank ATM - Para Yatırma' : 'Öztürk Bank ATM - Para Çekme'}
            </h2>
            <p className="text-xs text-slate-400">Anında komisyonsuz nakit işlem</p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">Hesap Seçimi</label>
            <select
              value={iban}
              onChange={(e) => setIban(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {hesaplar.map((h) => (
                <option key={h.getIban()} value={h.getIban()}>
                  {h.getHesapTuru()} - Bakiye: {h.getBakiye().toLocaleString('tr-TR')}{' '}
                  {h.getParaBirimi()} ({h.getIban().slice(-8)})
                </option>
              ))}
            </select>
            {hedefHesap && (
              <div className="mt-1 text-[11px] font-mono text-emerald-400 text-right">
                Mevcut Bakiye: {hedefHesap.getBakiye().toLocaleString('tr-TR')}{' '}
                {hedefHesap.getParaBirimi()}
              </div>
            )}
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              İşlem Tutarı ({hedefHesap?.getParaBirimi() || 'TRY'})
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="10"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
            <div className="flex gap-2 mt-2">
              {[100, 250, 500, 1000, 2000].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTutar(t.toString())}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  +{t}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20"
            >
              {islemTuru === 'yatir' ? 'Hesaba Parayı Yatır' : 'Nakit Parayı Çek'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
