import React, { useState } from 'react';
import {
  X,
  FileCheck2,
  AlertCircle,
  Building2,
  Calendar,
  CheckCircle2,
  Coins,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Islem } from '../models/Islem';
import { Kredi } from '../models/Kredi';

interface LoanPaymentModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  seciliKredi?: Kredi;
  onKapat: () => void;
  onOdemeBasarili: (islem: Islem) => void;
}

export const LoanPaymentModal: React.FC<LoanPaymentModalProps> = ({
  banka,
  aktifKullanici,
  seciliKredi,
  onKapat,
  onOdemeBasarili,
}) => {
  const krediler = aktifKullanici.getKrediler().filter((k) => k.getDurum() === 'Aktif');
  const hesaplar = aktifKullanici.getHesaplar().filter((h) => h.getParaBirimi() === 'TRY');

  const [secilenKrediId, setSecilenKrediId] = useState<string>(
    seciliKredi?.getKrediId() || krediler[0]?.getKrediId() || ''
  );
  const [kaynakIban, setKaynakIban] = useState<string>(hesaplar[0]?.getIban() || '');
  const [hata, setHata] = useState<string>('');

  const aktifKredi = krediler.find((k) => k.getKrediId() === secilenKrediId) || krediler[0];
  const kaynakHesap = aktifKullanici.hesapBul(kaynakIban) || hesaplar[0];

  if (!aktifKredi) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center max-w-sm w-full">
          <p className="text-sm text-slate-300">Ödenecek aktif kredi borcunuz bulunmamaktadır.</p>
          <button
            onClick={onKapat}
            className="mt-4 px-4 py-2 bg-slate-800 text-white rounded-lg text-xs"
          >
            Kapat
          </button>
        </div>
      </div>
    );
  }

  const taksitTutari = aktifKredi.getAylikTaksit();

  const handleTaksitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    if (!kaynakHesap) {
      setHata('Ödeme yapılacak kaynak vadesiz hesap bulunamadı.');
      return;
    }

    if (kaynakHesap.getKullanilabilirBakiye() < taksitTutari) {
      setHata(
        `Hesabınızda taksit tutarı için yeterli bakiye bulunmuyor! Gereken: ${taksitTutari.toLocaleString('tr-TR')} TL, Mevcut Bakiye: ${kaynakHesap.getKullanilabilirBakiye().toLocaleString('tr-TR')} TL`
      );
      return;
    }

    try {
      const sonuc = banka.krediTaksitiOde(
        aktifKullanici.getTcNo(),
        aktifKredi.getKrediId(),
        kaynakHesap.getIban()
      );

      onOdemeBasarili(sonuc.islem);
    } catch (err: any) {
      setHata(err.message || 'Kredi taksit ödemesi sırasında hata oluştu.');
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
          <div className="w-10 h-10 rounded-xl bg-teal-600/20 border border-teal-500/30 flex items-center justify-center text-teal-400">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bankaya Kredi Taksit Ödemesi</h2>
            <p className="text-xs text-slate-400">
              Vadesiz hesabınızdan kredi taksitini anında tahsil edin
            </p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={handleTaksitSubmit} className="space-y-4">
          {krediler.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ödenecek Kredi Sözleşmesi
              </label>
              <select
                value={secilenKrediId}
                onChange={(e) => setSecilenKrediId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {krediler.map((k) => (
                  <option key={k.getKrediId()} value={k.getKrediId()}>
                    {k.getKrediTuru()} (#{k.getKrediId()}) - Taksit:{' '}
                    {k.getAylikTaksit().toLocaleString('tr-TR')} TL
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Kredi Bilgi Kartı */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Kredi Türü & No:</span>
              <span className="font-semibold text-white">
                {aktifKredi.getKrediTuru()} (#{aktifKredi.getKrediId()})
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Kalan Taksit / Toplam Vade:</span>
              <span className="font-mono text-emerald-400 font-bold">
                {aktifKredi.getKalanTaksit()} / {aktifKredi.getToplamTaksit()} Ay
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Kalan Toplam Kredi Borcu:</span>
              <span className="font-mono text-rose-400 font-bold">
                {aktifKredi.getKalanBorc().toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Aylık Ödenecek Taksit Tutarı:</span>
              <span className="font-mono text-emerald-400 text-sm font-extrabold">
                {taksitTutari.toLocaleString('tr-TR')} TL
              </span>
            </div>
          </div>

          {/* Kaynak Vadesiz Hesap */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Taksitin Tahsil Edileceği Vadesiz Hesap
            </label>
            <select
              value={kaynakIban}
              onChange={(e) => setKaynakIban(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {hesaplar.map((h) => (
                <option key={h.getIban()} value={h.getIban()}>
                  {h.getHesapTuru()} - Bakiye: {h.getBakiye().toLocaleString('tr-TR')}{' '}
                  {h.getParaBirimi()} ({h.getIban().slice(-8)})
                </option>
              ))}
            </select>
            {kaynakHesap && (
              <div className="mt-1 text-[11px] font-mono text-emerald-400/90 text-right">
                Kullanılabilir: {kaynakHesap.getKullanilabilirBakiye().toLocaleString('tr-TR')} TL
              </div>
            )}
          </div>

          <div className="p-3 bg-teal-950/40 border border-teal-800/40 rounded-xl text-xs text-teal-300 flex items-center gap-2">
            <Building2 className="w-4 h-4 shrink-0 text-teal-400" />
            <span>
              Taksit tutarı Öztürk Bank Krediler Hazine hesabına anında aktarılacak ve kredi kalan
              taksit sayısı 1 düşürülecektir.
            </span>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <FileCheck2 className="w-4 h-4 stroke-[2.5]" />
              <span>{taksitTutari.toLocaleString('tr-TR')} TL Kredi Taksitini Öde</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
