import React, { useState } from 'react';
import { X, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Islem } from '../models/Islem';
import { KrediKarti } from '../models/KrediKarti';

interface SpendSimulatorModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  seciliKart: KrediKarti;
  onKapat: () => void;
  onHarcamaBasarili: (islem: Islem) => void;
}

export const SpendSimulatorModal: React.FC<SpendSimulatorModalProps> = ({
  banka,
  aktifKullanici,
  seciliKart,
  onKapat,
  onHarcamaBasarili,
}) => {
  const [tutar, setTutar] = useState<string>('750');
  const [magaza, setMagaza] = useState<string>('Trendyol / Online Alışveriş');
  const [hata, setHata] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    const tutarNum = parseFloat(tutar);
    if (isNaN(tutarNum) || tutarNum <= 0) {
      setHata('Lütfen geçerli bir harcama tutarı giriniz.');
      return;
    }

    try {
      const islem = banka.kartHarcamasiYap(
        aktifKullanici.getTcNo(),
        seciliKart.getKartId(),
        tutarNum,
        magaza
      );
      onHarcamaBasarili(islem);
    } catch (err: any) {
      setHata(err.message || 'Harcama yapılamadı.');
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
          <div className="w-10 h-10 rounded-xl bg-amber-600/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <ShoppingBag className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Kart Harcama Simülasyonu</h2>
            <p className="text-xs text-slate-400">{seciliKart.getMaskeliKartNo()}</p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <div className="mb-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs flex justify-between">
          <span className="text-slate-400">Kullanılabilir Kart Limiti:</span>
          <span className="font-mono font-bold text-emerald-400">
            {seciliKart.getKullanilabilirLimit().toLocaleString('tr-TR')} TL
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              İşyeri / Mağaza Adı
            </label>
            <input
              type="text"
              value={magaza}
              onChange={(e) => setMagaza(e.target.value)}
              placeholder="Örn: Migros, Teknosa"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Harcama Tutarı (TL)
            </label>
            <input
              type="number"
              step="0.01"
              min="1"
              value={tutar}
              onChange={(e) => setTutar(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
            />
            <div className="flex gap-2 mt-2">
              {[250, 500, 1000, 2500].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTutar(t.toString())}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  +{t} ₺
                </button>
              ))}
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-amber-500/20"
            >
              Harcamayı Gerçekleştir (Borcu Arttır)
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
