import React, { useState } from 'react';
import {
  X,
  Send,
  AlertCircle,
  Building2,
  ArrowRight,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Islem } from '../models/Islem';

interface TransferModalProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  onKapat: () => void;
  onTransferBasarili: (islem: Islem) => void;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  banka,
  aktifKullanici,
  onKapat,
  onTransferBasarili,
}) => {
  const hesaplar = aktifKullanici.getHesaplar().filter((h) => h.getParaBirimi() === 'TRY');
  const [kaynakIban, setKaynakIban] = useState(hesaplar[0]?.getIban() || '');
  const [hedefIban, setHedefIban] = useState('');
  const [aliciAd, setAliciAd] = useState('');
  const [tutar, setTutar] = useState('');
  const [aciklama, setAciklama] = useState('Borç / Masraf Paylaşımı');
  const [hata, setHata] = useState('');

  const seciliKaynakHesap = aktifKullanici.hesapBul(kaynakIban) || hesaplar[0];

  // Banka içindeki diğer müşteriler (Kolay transfer rehberi)
  const digerMusteriler = banka
    .getMusteriler()
    .filter((m) => m.getTcNo() !== aktifKullanici.getTcNo());

  const handleMusteriSec = (m: Kullanici) => {
    const vadesiz = m.varsayilanVadesizHesap();
    if (vadesiz) {
      setHedefIban(vadesiz.getIban());
      setAliciAd(m.getTamAd());
    } else {
      setHedefIban(m.getTcNo());
      setAliciAd(m.getTamAd());
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHata('');

    const transferTutari = parseFloat(tutar);
    if (isNaN(transferTutari) || transferTutari <= 0) {
      setHata('Lütfen geçerli bir transfer tutarı giriniz.');
      return;
    }

    if (!hedefIban.trim()) {
      setHata('Lütfen alıcı IBAN veya T.C. Kimlik numarasını giriniz.');
      return;
    }

    if (hedefIban.replace(/\s+/g, '') === kaynakIban.replace(/\s+/g, '')) {
      setHata('Kendi hesabınıza bu yöntemle transfer yapamazsınız.');
      return;
    }

    try {
      const islem = banka.paraTransferi(
        aktifKullanici.getTcNo(),
        kaynakIban,
        hedefIban,
        transferTutari,
        aciklama,
        aliciAd.trim() || undefined
      );

      onTransferBasarili(islem);
    } catch (err: any) {
      setHata(err.message || 'Transfer gerçekleştirilemedi.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Kapat Butonu */}
        <button
          onClick={onKapat}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Send className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-white">Para Transferi (Havale / FAST)</h2>
            <p className="text-xs text-slate-400">Öztürk Bank müşterilerine anında, 7/24 ücretsiz</p>
          </div>
        </div>

        {hata && (
          <div className="mb-4 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{hata}</span>
          </div>
        )}

        {/* Hızlı Müşteri Rehberi */}
        {digerMusteriler.length > 0 && (
          <div className="mb-5 p-3 bg-slate-950 rounded-xl border border-slate-800/80">
            <div className="text-[11px] font-medium text-slate-400 mb-2 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              <span>Kayıtlı Banka Müşterileri (Hızlı Seçim):</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {digerMusteriler.map((m) => {
                const vadesiz = m.varsayilanVadesizHesap();
                return (
                  <button
                    key={m.getTcNo()}
                    type="button"
                    onClick={() => handleMusteriSec(m)}
                    className="px-2.5 py-1 text-xs rounded-lg bg-slate-900 border border-slate-700/80 hover:border-emerald-500/60 hover:text-emerald-400 text-slate-300 transition-all font-medium flex items-center gap-1.5"
                  >
                    <span>{m.getTamAd()}</span>
                    <span className="text-[10px] text-slate-500 font-mono">
                      (..{vadesiz?.getIban().slice(-4)})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <form onSubmit={handleTransferSubmit} className="space-y-4">
          {/* Gönderici Kaynak Hesap */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Gönderen Hesap
            </label>
            <select
              value={kaynakIban}
              onChange={(e) => setKaynakIban(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              {hesaplar.map((h) => (
                <option key={h.getIban()} value={h.getIban()}>
                  {h.getHesapTuru()} - Bakiye: {h.getBakiye().toLocaleString('tr-TR')}{' '}
                  {h.getParaBirimi()} ({h.getIban()})
                </option>
              ))}
            </select>
            {seciliKaynakHesap && (
              <div className="mt-1 text-[11px] font-mono text-emerald-400/90 text-right">
                Kullanılabilir: {seciliKaynakHesap.getKullanilabilirBakiye().toLocaleString('tr-TR')}{' '}
                {seciliKaynakHesap.getParaBirimi()}
              </div>
            )}
          </div>

          {/* Alıcı IBAN veya T.C. */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Alıcı IBAN veya T.C. Kimlik No
            </label>
            <input
              type="text"
              value={hedefIban}
              onChange={(e) => setHedefIban(e.target.value)}
              placeholder="TR45 0188 0000 0000 0000 0000 00 veya 11 haneli T.C."
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Alıcı Ad Soyad (Opsiyonel / Dış Bankalar İçin) */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Alıcı Adı Soyadı
            </label>
            <input
              type="text"
              value={aliciAd}
              onChange={(e) => setAliciAd(e.target.value)}
              placeholder="Örn: Ayşe Kaya"
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Transfer Tutarı */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Transfer Tutarı (TL)
            </label>
            <div className="relative">
              <input
                type="number"
                step="0.01"
                min="1"
                value={tutar}
                onChange={(e) => setTutar(e.target.value)}
                placeholder="0.00"
                required
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
              />
              <span className="absolute right-3.5 top-2.5 text-xs font-bold text-slate-400">
                TL
              </span>
            </div>
            {/* Hızlı Tutar Seçicileri */}
            <div className="flex gap-2 mt-2">
              {[250, 500, 1000, 2500, 5000].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTutar(t.toString())}
                  className="px-2.5 py-1 text-[11px] font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors"
                >
                  +{t.toLocaleString('tr-TR')} ₺
                </button>
              ))}
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Açıklama (Dekontta Görünecek)
            </label>
            <input
              type="text"
              value={aciklama}
              onChange={(e) => setAciklama(e.target.value)}
              placeholder="Örn: Kira ödemesi, borç transferi"
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4 stroke-[2.5]" />
              <span>Transferi Onayla & Gönder</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
