import React, { useState } from 'react';
import {
  X,
  Wallet,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Hesap } from '../models/Hesap';
import { HesapTuru, ParaBirimi } from '../types/banking';

interface OpenAccountModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  onKapat: () => void;
  onHesapAcildi: (yeniHesap: Hesap) => void;
}

export const OpenAccountModal: React.FC<OpenAccountModalProps> = ({
  banka,
  aktifKullanici,
  onKapat,
  onHesapAcildi,
}) => {
  const [hesapTuru, setHesapTuru] = useState<HesapTuru>('Vadesiz TL');
  const [paraBirimi, setParaBirimi] = useState<ParaBirimi>('TRY');
  const [baslangicBakiye, setBaslangicBakiye] = useState<string>('0');
  const [vadeGunu, setVadeGunu] = useState<number>(32);
  const [hata, setHata] = useState<string>('');

  const handleHesapTuruSecim = (tur: HesapTuru) => {
    setHesapTuru(tur);
    if (tur === 'Vadesiz USD') setParaBirimi('USD');
    else if (tur === 'Vadesiz EUR') setParaBirimi('EUR');
    else setParaBirimi('TRY');
  };

  const handleHesapAcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    const bakiyeNum = parseFloat(baslangicBakiye) || 0;
    if (bakiyeNum < 0) {
      setHata('Başlangıç bakiyesi negatif olamaz.');
      return;
    }

    try {
      const yeniHesap = banka.yeniHesapAc(
        aktifKullanici.getTcNo(),
        hesapTuru,
        paraBirimi,
        bakiyeNum,
        vadeGunu
      );

      onHesapAcildi(yeniHesap);
    } catch (err: any) {
      setHata(err.message || 'Hesap açılışı sırasında bir hata oluştu.');
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
            <Wallet className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Yeni Banka Hesabı Açılışı</h2>
            <p className="text-xs text-slate-400">Vadesiz ve vadeli mevduat hesaplarınızı hemen tanımlayın</p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={handleHesapAcSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">Açılacak Hesap Türü</label>
            <div className="grid grid-cols-2 gap-2">
              {(['Vadesiz TL', 'Vadeli TL', 'Vadesiz USD', 'Vadesiz EUR'] as HesapTuru[]).map((tur) => (
                <button
                  key={tur}
                  type="button"
                  onClick={() => handleHesapTuruSecim(tur)}
                  className={`p-3 text-left rounded-xl border transition-all ${
                    hesapTuru === tur
                      ? 'bg-emerald-950/60 border-emerald-500 text-white shadow-sm'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <div className="text-xs font-bold text-white">{tur}</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">
                    {tur === 'Vadeli TL' ? 'Yıllık %46.5 Faiz' : 'Günlük Bankacılık'}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {hesapTuru === 'Vadeli TL' && (
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
                <TrendingUp className="w-4 h-4" />
                <span>Vadeli Mevduat Koşulları</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Brüt Faiz Oranı:</span>
                <span className="font-mono font-bold text-white">Yıllık %46.50</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400">Vade Süresi:</span>
                <div className="flex gap-1.5">
                  {[32, 45, 92, 181].map((gun) => (
                    <button
                      key={gun}
                      type="button"
                      onClick={() => setVadeGunu(gun)}
                      className={`px-2 py-1 text-xs font-mono rounded ${
                        vadeGunu === gun ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {gun} Gün
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Açılış Başlangıç Bakiyesi ({paraBirimi})
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={baslangicBakiye}
              onChange={(e) => setBaslangicBakiye(e.target.value)}
              placeholder="0.00"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              <span>Yeni Hesabı Aç & IBAN Üret</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
