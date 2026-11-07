import React, { useState } from 'react';
import {
  X,
  CreditCard,
  AlertCircle,
  CheckCircle2,
  Receipt,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Islem } from '../models/Islem';
import { KrediKarti } from '../models/KrediKarti';

interface CardPaymentModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  seciliKart?: KrediKarti;
  onKapat: () => void;
  onOdemeBasarili: (islem: Islem) => void;
}

export const CardPaymentModal: React.FC<CardPaymentModalProps> = ({
  banka,
  aktifKullanici,
  seciliKart,
  onKapat,
  onOdemeBasarili,
}) => {
  const kartlar = aktifKullanici.getKrediKartlari();
  const hesaplar = aktifKullanici.getHesaplar().filter((h) => h.getParaBirimi() === 'TRY');

  const [secilenKartId, setSecilenKartId] = useState<string>(
    seciliKart?.getKartId() || kartlar[0]?.getKartId() || ''
  );
  const [kaynakIban, setKaynakIban] = useState<string>(hesaplar[0]?.getIban() || '');
  const [odemeTuru, setOdemeTuru] = useState<'asgari' | 'ekstre' | 'toplam' | 'ozel'>('ekstre');
  const [ozelTutar, setOzelTutar] = useState<string>('');
  const [hata, setHata] = useState<string>('');

  const aktifKart = kartlar.find((k) => k.getKartId() === secilenKartId) || kartlar[0];
  const kaynakHesap = aktifKullanici.hesapBul(kaynakIban) || hesaplar[0];

  if (!aktifKart) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 text-center max-w-sm w-full">
          <p className="text-sm text-slate-300">Ödenecek kredi kartınız bulunmamaktadır.</p>
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

  const asgariTutar = aktifKart.getAsgariOdemeTutari();
  const ekstreBorcu = aktifKart.getEkstreBorcu();
  const guncelBorc = aktifKart.getGuncelBorc();

  // Hesaplanan ödeme tutarı
  const hesaplananOdemeTutari = (): number => {
    switch (odemeTuru) {
      case 'asgari':
        return asgariTutar;
      case 'ekstre':
        return ekstreBorcu > 0 ? ekstreBorcu : guncelBorc;
      case 'toplam':
        return guncelBorc;
      case 'ozel':
        return parseFloat(ozelTutar) || 0;
    }
  };

  const handleOdemeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    const tutar = hesaplananOdemeTutari();
    if (tutar <= 0) {
      setHata('Lütfen ödenecek geçerli bir tutar belirleyiniz.');
      return;
    }

    if (tutar > guncelBorc && guncelBorc > 0) {
      setHata(
        `Ödeme tutarı güncel kart borcunuzdan (${guncelBorc.toLocaleString('tr-TR')} TL) fazla olamaz.`
      );
      return;
    }

    if (!kaynakHesap) {
      setHata('Ödeme yapılacak kaynak vadesiz hesap bulunamadı.');
      return;
    }

    if (tutar > kaynakHesap.getKullanilabilirBakiye()) {
      setHata(
        `Hesap bakiyeniz yetersiz! Kullanılabilir Bakiye: ${kaynakHesap.getKullanilabilirBakiye().toLocaleString('tr-TR')} TL`
      );
      return;
    }

    try {
      const sonuc = banka.krediKartiBorcuOde(
        aktifKullanici.getTcNo(),
        aktifKart.getKartId(),
        kaynakHesap.getIban(),
        tutar
      );

      onOdemeBasarili(sonuc.islem);
    } catch (err: any) {
      setHata(err.message || 'Kredi kartı ödemesi sırasında bir sorun oluştu.');
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
            <CreditCard className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Bankaya Kredi Kartı Ekstresi / Borç Ödeme</h2>
            <p className="text-xs text-slate-400">
              Vadesiz hesabınızdan kredi kartı borcunu anında kapatın
            </p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        <form onSubmit={handleOdemeSubmit} className="space-y-4">
          {/* Kart Seçimi */}
          {kartlar.length > 1 && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ödeme Yapılacak Kredi Kartı
              </label>
              <select
                value={secilenKartId}
                onChange={(e) => setSecilenKartId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              >
                {kartlar.map((k) => (
                  <option key={k.getKartId()} value={k.getKartId()}>
                    {k.getMaskeliKartNo()} - Güncel Borç: {k.getGuncelBorc().toLocaleString('tr-TR')}{' '}
                    TL
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Kart Borç Özeti Bilgi Kartı */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Kart Sahibi / Numarası:</span>
              <span className="font-mono text-slate-200 font-semibold">
                {aktifKart.getMaskeliKartNo()}
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Dönem İçi Kesilen Ekstre Borcu:</span>
              <span className="font-mono text-amber-400 font-bold">
                {ekstreBorcu.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-400">Toplam Güncel Borç:</span>
              <span className="font-mono text-rose-400 font-bold">
                {guncelBorc.toLocaleString('tr-TR')} TL
              </span>
            </div>
            <div className="flex justify-between items-center text-xs pt-1 border-t border-slate-800">
              <span className="text-slate-400">Asgari Ödeme Tutarı (%20):</span>
              <span className="font-mono text-emerald-400 font-bold">
                {asgariTutar.toLocaleString('tr-TR')} TL
              </span>
            </div>
          </div>

          {/* Ödeme Türü Seçenekleri */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-2">
              Ödeme Tutarı Seçimi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOdemeTuru('ekstre')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  odemeTuru === 'ekstre'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">Ekstre Borcu</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                  {(ekstreBorcu > 0 ? ekstreBorcu : guncelBorc).toLocaleString('tr-TR')} TL
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOdemeTuru('asgari')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  odemeTuru === 'asgari'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">Asgari Ödeme (%20)</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                  {asgariTutar.toLocaleString('tr-TR')} TL
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOdemeTuru('toplam')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  odemeTuru === 'toplam'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">Toplam Güncel Borç</div>
                <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
                  {guncelBorc.toLocaleString('tr-TR')} TL
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOdemeTuru('ozel')}
                className={`p-3 text-left rounded-xl border transition-all ${
                  odemeTuru === 'ozel'
                    ? 'bg-emerald-950/60 border-emerald-500 text-white'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="text-xs font-semibold">Farklı Tutar</div>
                <div className="text-xs text-slate-500 mt-1">Özel Miktar Belirle</div>
              </button>
            </div>
          </div>

          {/* Özel Tutar Girişi */}
          {odemeTuru === 'ozel' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ödemek İstediğiniz Tutar (TL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.01"
                  min="1"
                  max={guncelBorc}
                  value={ozelTutar}
                  onChange={(e) => setOzelTutar(e.target.value)}
                  placeholder="0.00"
                  required
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                  TL
                </span>
              </div>
            </div>
          )}

          {/* Kaynak Vadesiz Hesap */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Ödemenin Çekileceği Hesap
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

          <div className="pt-2">
            <button
              type="submit"
              disabled={guncelBorc <= 0}
              className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                guncelBorc <= 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
              }`}
            >
              <CreditCard className="w-4 h-4 stroke-[2.5]" />
              <span>
                {guncelBorc <= 0
                  ? 'Kart Borcunuz Bulunmuyor'
                  : `${hesaplananOdemeTutari().toLocaleString('tr-TR')} TL Borç Ödemesini Tamamla`}
              </span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
