import React, { useState } from 'react';
import {
  Send,
  CreditCard,
  Building2,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Copy,
  Check,
  Plus,
  Coins,
  Receipt,
  ShieldCheck,
  Lock,
  Unlock,
  TrendingUp,
  ShoppingBag,
  Clock,
  Sparkles,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';
import { Hesap } from '../models/Hesap';
import { VadeliHesap } from '../models/VadeliHesap';
import { KrediKarti } from '../models/KrediKarti';
import { Kredi } from '../models/Kredi';
import { Islem } from '../models/Islem';

interface CustomerDashboardProps {
  banka: Banka;
  aktifKullanici: Kullanici;
  aktifTab: string;
  onTabDegistir: (tab: string) => void;
  onTransferAc: () => void;
  onKartOdemeAc: (kart?: KrediKarti) => void;
  onKrediOdemeAc: (kredi?: Kredi) => void;
  onKrediBasvuruAc: () => void;
  onHesapAcilisiAc: () => void;
  onAtmIslemiAc: (hesap: Hesap, tur: 'yatir' | 'cek') => void;
  onKartHarcamaAc: (kart: KrediKarti) => void;
  onDekontAc: (islem: Islem) => void;
  onBankaGuncellendi: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  banka,
  aktifKullanici,
  aktifTab,
  onTabDegistir,
  onTransferAc,
  onKartOdemeAc,
  onKrediOdemeAc,
  onKrediBasvuruAc,
  onHesapAcilisiAc,
  onAtmIslemiAc,
  onKartHarcamaAc,
  onDekontAc,
  onBankaGuncellendi,
}) => {
  const [kopyalananIban, setKopyalananIban] = useState<string | null>(null);
  const [islemFiltre, setIslemFiltre] = useState<string>('tum');

  const hesaplar = aktifKullanici.getHesaplar();
  const kartlar = aktifKullanici.getKrediKartlari();
  const krediler = aktifKullanici.getKrediler();
  const kullaniciIslemleri = banka.getMusteriIslemleri(aktifKullanici.getTcNo());

  const toplamVarlik = aktifKullanici.getToplamVarlikTL();
  const toplamBorc = aktifKullanici.getToplamBorcTL();

  const handleIbanKopyala = (iban: string) => {
    navigator.clipboard.writeText(iban.replace(/\s+/g, ''));
    setKopyalananIban(iban);
    setTimeout(() => setKopyalananIban(null), 2000);
  };

  const handleKartKilitToggle = (kart: KrediKarti) => {
    kart.toggleDurum();
    onBankaGuncellendi();
  };

  const filtrelenmisIslemler = kullaniciIslemleri.filter((islem) => {
    if (islemFiltre === 'transfer') return islem.getTur() === 'HAVALE' || islem.getTur() === 'EFT_FAST';
    if (islemFiltre === 'kart') return islem.getTur() === 'KREDI_KARTI_ODEMESI' || islem.getTur() === 'KART_HARCAMASI';
    if (islemFiltre === 'kredi') return islem.getTur() === 'KREDI_ODEMESI';
    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-fadeIn">
      {/* 1. ÜST PORTFÖY ÖZETİ VE HIZLI AKSİYONLAR */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl relative overflow-hidden">
        {/* Arka plan yumuşak ışık efekti */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Sol Taraf: Karşılama ve Varlıklar */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2.5 py-0.5 rounded-full">
                Bireysel Dijital Bankacılık
              </span>
              <span className="text-xs text-slate-400 font-mono">
                {new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Hoş Geldiniz, <span className="text-emerald-400">{aktifKullanici.getTamAd()}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1 font-mono">
                T.C. Kimlik: {aktifKullanici.getTcNo().slice(0, 3)}*****{aktifKullanici.getTcNo().slice(-2)} · Müşteri No: {aktifKullanici.getId()}
              </p>
            </div>

            {/* Varlık & Borç Rakamları */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Toplam Varlıklarım</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-emerald-400 mt-1">
                  {toplamVarlik.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80">
                <div className="text-[11px] text-slate-400 font-medium">Toplam Banka Borcum</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-rose-400 mt-1">
                  {toplamBorc.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800/80 col-span-2 sm:col-span-1">
                <div className="text-[11px] text-slate-400 font-medium">Net Finansal Durum</div>
                <div className="text-xl sm:text-2xl font-black font-mono text-white mt-1">
                  {(toplamVarlik - toplamBorc).toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf: Ana Bankacılık Aksiyon Butonları */}
          <div className="lg:col-span-5 grid grid-cols-2 gap-2.5">
            <button
              onClick={onTransferAc}
              className="p-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-600/20 flex flex-col items-start justify-between min-h-[90px] group"
            >
              <div className="w-8 h-8 rounded-xl bg-slate-950/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Send className="w-4 h-4 stroke-[2.5]" />
              </div>
              <div className="text-left">
                <div className="font-extrabold text-sm text-slate-950">Para Transferi</div>
                <div className="text-[10px] text-slate-900/80 font-medium">Havale / FAST Anında</div>
              </div>
            </button>

            <button
              onClick={() => onKartOdemeAc()}
              className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 text-white font-bold text-xs transition-all flex flex-col items-start justify-between min-h-[90px] group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-950/80 border border-emerald-800/50 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                <CreditCard className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white">Kart Borcu Öde</div>
                <div className="text-[10px] text-slate-400">Ekstre / Asgari Tutar</div>
              </div>
            </button>

            <button
              onClick={() => onKrediOdemeAc()}
              className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-teal-500/50 text-white font-bold text-xs transition-all flex flex-col items-start justify-between min-h-[90px] group"
            >
              <div className="w-8 h-8 rounded-xl bg-teal-950/80 border border-teal-800/50 flex items-center justify-center text-teal-400 group-hover:scale-110 transition-transform">
                <Coins className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white">Kredi Taksiti Öde</div>
                <div className="text-[10px] text-slate-400">Bankaya Taksit Yatır</div>
              </div>
            </button>

            <button
              onClick={onKrediBasvuruAc}
              className="p-3.5 rounded-2xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 text-white font-bold text-xs transition-all flex flex-col items-start justify-between min-h-[90px] group"
            >
              <div className="w-8 h-8 rounded-xl bg-amber-950/80 border border-amber-800/50 flex items-center justify-center text-amber-400 group-hover:scale-110 transition-transform">
                <TrendingUp className="w-4 h-4" />
              </div>
              <div className="text-left">
                <div className="font-bold text-sm text-white">Kredi Başvurusu</div>
                <div className="text-[10px] text-slate-400">Anında Hesaba Geçer</div>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* 2. SEKME İÇERİKLERİ */}
      <div className="space-y-6">
        {/* MOBİL İÇİN HIZLI SEKME DEĞİŞTİRİCİ */}
        <div className="flex lg:hidden overflow-x-auto gap-2 pb-2">
          {[
            { id: 'hesaplar', label: 'Hesaplarım' },
            { id: 'transfer', label: 'Transfer' },
            { id: 'kartlar', label: 'Kartlarım' },
            { id: 'krediler', label: 'Kredilerim' },
            { id: 'gecmis', label: 'İşlemler' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onTabDegistir(item.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                aktifTab === item.id ? 'bg-emerald-600 text-white' : 'bg-slate-900 text-slate-400'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* SEKME 1: HESAPLARIM */}
        {aktifTab === 'hesaplar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-emerald-400" />
                  <span>Mevduat ve Vadesiz Hesaplarım ({hesaplar.length})</span>
                </h2>
                <p className="text-xs text-slate-400">Tüm banka hesaplarınız ve bakiye hareketleri</p>
              </div>

              <button
                onClick={onHesapAcilisiAc}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Yeni Hesap Aç</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {hesaplar.map((hesap) => {
                const isVadeli = hesap instanceof VadeliHesap;
                const vadeliHesap = isVadeli ? (hesap as VadeliHesap) : null;

                return (
                  <div
                    key={hesap.getIban()}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-bold text-white bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800">
                          {hesap.getHesapTuru()}
                        </span>
                        <span className="text-[11px] font-mono font-semibold text-slate-400">
                          Hesap No: {hesap.getHesapNo()}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-xs text-slate-400">Bakiye</div>
                        <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                          {hesap.getBakiye().toLocaleString('tr-TR', { minimumFractionDigits: 2 })}{' '}
                          <span className="text-sm font-bold text-slate-300">
                            {hesap.getParaBirimi()}
                          </span>
                        </div>
                      </div>

                      {/* Vadeli Hesap Detayı */}
                      {vadeliHesap && (
                        <div className="mt-3 p-3 bg-slate-950 rounded-xl border border-slate-800/80 text-xs space-y-1.5">
                          <div className="flex justify-between text-slate-400">
                            <span>Vade / Faiz:</span>
                            <span className="font-mono text-white font-semibold">
                              {vadeliHesap.getVadeGunu()} Gün · %{vadeliHesap.getFaizOrani()}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Net Faiz Getirisi:</span>
                            <span className="font-mono text-emerald-400 font-bold">
                              +{vadeliHesap.getNetFaizGetirisi().toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-400">
                            <span>Vade Sonu Toplam:</span>
                            <span className="font-mono text-amber-400 font-bold">
                              {vadeliHesap.getVadeSonuToplamTutar().toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                        </div>
                      )}

                      {/* Ek Hesap Limiti Varsa */}
                      {hesap.getEkHesapLimiti() > 0 && (
                        <div className="mt-2 text-[11px] font-mono text-slate-400 flex justify-between">
                          <span>Ek Hesap (KMH) Limiti:</span>
                          <span className="text-white font-semibold">
                            {hesap.getEkHesapLimiti().toLocaleString('tr-TR')} TL
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-3 pt-3 border-t border-slate-800/80">
                      {/* IBAN Kopyalama */}
                      <button
                        onClick={() => handleIbanKopyala(hesap.getIban())}
                        className="w-full flex items-center justify-between px-3 py-2 bg-slate-950 hover:bg-slate-800/80 rounded-xl border border-slate-800 text-[11px] font-mono text-slate-300 transition-colors"
                      >
                        <span className="truncate">{hesap.getIban()}</span>
                        {kopyalananIban === hesap.getIban() ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : (
                          <Copy className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                        )}
                      </button>

                      {/* Hızlı İşlem Butonları */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => onAtmIslemiAc(hesap, 'yatir')}
                          className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Yatır</span>
                        </button>
                        <button
                          onClick={() => onAtmIslemiAc(hesap, 'cek')}
                          className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                          <span>Çek</span>
                        </button>
                        <button
                          onClick={onTransferAc}
                          className="flex-1 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 text-xs font-bold rounded-lg transition-colors flex items-center justify-center gap-1"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Gönder</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* SEKME 2: PARA TRANSFERİ */}
        {aktifTab === 'transfer' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-400" />
                  <span>Para Transferi (Havale / FAST)</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Öztürk Bank müşterileri arasında veya diğer bankalara FAST ile anında transfer yapın
                </p>
              </div>

              <button
                onClick={onTransferAc}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20"
              >
                Transfer Formunu Aç
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-3">
              <div className="font-semibold text-emerald-400 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" />
                <span>Kolay Transfer Özelliği</span>
              </div>
              <p className="text-slate-300">
                Alıcının IBAN numarasını veya 11 haneli T.C. Kimlik numarasını girerek Öztürk Bank
                müşterileri arasında transferi 1 saniyede gerçekleştirebilirsiniz. İşlem sonucunda
                anında resmi dijital dekont üretilir.
              </p>
            </div>
          </div>
        )}

        {/* SEKME 3: KREDİ KARTLARIM */}
        {aktifTab === 'kartlar' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-emerald-400" />
                  <span>Kredi Kartlarım ({kartlar.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Kart limiti, güncel ve ekstre borçlarınızı görüntüleyin ve bankaya anında ödeyin
                </p>
              </div>
            </div>

            {kartlar.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-sm">
                Henüz adınıza tanımlı bir kredi kartı bulunmamaktadır.
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {kartlar.map((kart) => {
                  const kullanimYuzdesi = Math.min(
                    100,
                    Math.round((kart.getGuncelBorc() / kart.getLimit()) * 100)
                  );

                  return (
                    <div
                      key={kart.getKartId()}
                      className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 flex flex-col justify-between"
                    >
                      {/* Gerçekçi Kredi Kartı Görseli (Titanium / Luxury Finish) */}
                      <div className="relative w-full h-52 rounded-2xl bg-gradient-to-tr from-slate-950 via-slate-900 to-slate-800 border border-slate-700/80 p-6 flex flex-col justify-between shadow-2xl overflow-hidden group">
                        {/* Çip ve Temassız Simgesi */}
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-300 to-amber-600 border border-amber-200/50 flex items-center justify-center shadow-inner">
                              <div className="w-6 h-5 border border-amber-800/40 rounded-sm" />
                            </div>
                            <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800/50">
                              Platinum
                            </span>
                          </div>

                          <div className="text-right">
                            <div className="font-extrabold text-white text-sm tracking-wider">
                              Öztürk Bank
                            </div>
                            <div className="text-[9px] font-mono text-emerald-400">0188</div>
                          </div>
                        </div>

                        {/* Kart Numarası */}
                        <div className="font-mono text-lg sm:text-xl font-bold tracking-widest text-slate-100 select-all">
                          {kart.getMaskeliKartNo()}
                        </div>

                        {/* Kart Sahibi & Son Kullanma & Logo */}
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                              Kart Sahibi
                            </div>
                            <div className="font-semibold text-xs text-white uppercase tracking-wider">
                              {kart.getKartSahibi()}
                            </div>
                          </div>

                          <div>
                            <div className="text-[9px] text-slate-400 uppercase tracking-wider">
                              Son Kull.
                            </div>
                            <div className="font-mono text-xs text-white font-bold">
                              {kart.getSonKullanma()}
                            </div>
                          </div>

                          {/* Mastercard / Visa Logosu */}
                          <div className="flex -space-x-2">
                            <div className="w-6 h-6 rounded-full bg-rose-500/90" />
                            <div className="w-6 h-6 rounded-full bg-amber-500/90" />
                          </div>
                        </div>
                      </div>

                      {/* Kart Finansal Bilgileri */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Kart Limiti:</span>
                          <span className="font-mono font-bold text-white">
                            {kart.getLimit().toLocaleString('tr-TR')} TL
                          </span>
                        </div>

                        {/* Limit Kullanım Barı */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Limit Kullanımı (%{kullanimYuzdesi})</span>
                            <span className="font-mono text-emerald-400 font-semibold">
                              Kalan: {kart.getKullanilabilirLimit().toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${kullanimYuzdesi}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-800 text-xs">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-slate-400 text-[11px]">Dönem Ekstre Borcu</div>
                            <div className="text-base font-bold font-mono text-amber-400 mt-0.5">
                              {kart.getEkstreBorcu().toLocaleString('tr-TR')} TL
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-slate-400 text-[11px]">Asgari Ödeme (%20)</div>
                            <div className="text-base font-bold font-mono text-emerald-400 mt-0.5">
                              {kart.getAsgariOdemeTutari().toLocaleString('tr-TR')} TL
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Kart Aksiyonları */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-800">
                        <button
                          onClick={() => onKartOdemeAc(kart)}
                          className="flex-1 py-2.5 px-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center justify-center gap-1.5"
                        >
                          <CreditCard className="w-4 h-4 stroke-[2.5]" />
                          <span>Borç / Ekstre Öde</span>
                        </button>

                        <button
                          onClick={() => onKartHarcamaAc(kart)}
                          className="py-2.5 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl transition-colors flex items-center gap-1.5"
                          title="Kredi kartı ile alışveriş simülasyonu"
                        >
                          <ShoppingBag className="w-3.5 h-3.5 text-amber-400" />
                          <span>Harcama Yap</span>
                        </button>

                        <button
                          onClick={() => handleKartKilitToggle(kart)}
                          className={`p-2.5 rounded-xl border text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                            kart.getDurum() === 'Aktif'
                              ? 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                              : 'bg-rose-950/40 border-rose-800 text-rose-300'
                          }`}
                          title={kart.getDurum() === 'Aktif' ? 'Kartı Güvenli Kilitle' : 'Kart Kilidini Aç'}
                        >
                          {kart.getDurum() === 'Aktif' ? (
                            <Lock className="w-3.5 h-3.5" />
                          ) : (
                            <Unlock className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SEKME 4: KREDİLERİM */}
        {aktifTab === 'krediler' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Coins className="w-5 h-5 text-teal-400" />
                  <span>Kredi Hesaplarım & Taksit Ödemesi ({krediler.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Mevcut kredi taksitlerinizi görüntüleyin, bankaya taksit yatırın veya anında yeni kredi çekin
                </p>
              </div>

              <button
                onClick={onKrediBasvuruAc}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20"
              >
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Anında Kredi Çek</span>
              </button>
            </div>

            {krediler.length === 0 ? (
              <div className="p-8 text-center bg-slate-900 rounded-2xl border border-slate-800 text-slate-400 text-sm space-y-3">
                <p>Henüz aktif bir kredi borcunuz bulunmamaktadır.</p>
                <button
                  onClick={onKrediBasvuruAc}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl"
                >
                  Hemen Kredi Başvurusu Yap
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {krediler.map((kredi) => {
                  const odenenTaksit = kredi.getToplamTaksit() - kredi.getKalanTaksit();
                  const taksitYuzdesi = Math.round(
                    (odenenTaksit / kredi.getToplamTaksit()) * 100
                  );

                  return (
                    <div
                      key={kredi.getKrediId()}
                      className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5 flex flex-col justify-between"
                    >
                      <div className="space-y-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="text-xs font-mono font-semibold text-teal-400 bg-teal-950/80 border border-teal-800/80 px-2 py-0.5 rounded">
                              #{kredi.getKrediId()}
                            </span>
                            <h3 className="text-base font-bold text-white mt-1">
                              {kredi.getKrediTuru()}
                            </h3>
                          </div>

                          <span
                            className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                              kredi.getDurum() === 'Aktif'
                                ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                : 'bg-slate-800 text-slate-400'
                            }`}
                          >
                            {kredi.getDurum()}
                          </span>
                        </div>

                        {/* Rakamlar */}
                        <div className="grid grid-cols-2 gap-3 text-xs">
                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-slate-400 text-[11px]">Aylık Taksit Tutarı</div>
                            <div className="text-lg font-black font-mono text-emerald-400 mt-0.5">
                              {kredi.getAylikTaksit().toLocaleString('tr-TR')} TL
                            </div>
                          </div>

                          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                            <div className="text-slate-400 text-[11px]">Kalan Toplam Borç</div>
                            <div className="text-lg font-black font-mono text-rose-400 mt-0.5">
                              {kredi.getKalanBorc().toLocaleString('tr-TR')} TL
                            </div>
                          </div>
                        </div>

                        {/* Taksit İlerleme Durumu */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-400">
                            <span>
                              Ödenen Taksit: <strong className="text-white">{odenenTaksit}</strong> /{' '}
                              {kredi.getToplamTaksit()} Ay
                            </span>
                            <span className="font-mono text-teal-400 font-semibold">
                              %{taksitYuzdesi}
                            </span>
                          </div>
                          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                            <div
                              className="bg-teal-500 h-full rounded-full transition-all duration-500"
                              style={{ width: `${taksitYuzdesi}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Taksit Ödeme Butonu */}
                      <div className="pt-2 border-t border-slate-800">
                        {kredi.getDurum() === 'Aktif' ? (
                          <button
                            onClick={() => onKrediOdemeAc(kredi)}
                            className="w-full py-2.5 px-4 bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-teal-500/20 flex items-center justify-center gap-2"
                          >
                            <Coins className="w-4 h-4 stroke-[2.5]" />
                            <span>
                              {kredi.getAylikTaksit().toLocaleString('tr-TR')} TL Taksiti Şimdi Öde
                            </span>
                          </button>
                        ) : (
                          <div className="text-center py-2 text-xs font-semibold text-emerald-400 bg-emerald-950/40 rounded-xl border border-emerald-800/40">
                            Kredi Borcu Tamamen Kapatılmıştır
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SEKME 5: İŞLEM GEÇMİŞİ VE RESMİ DİJİTAL DEKONTLAR */}
        {aktifTab === 'gecmis' && (
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-emerald-400" />
                  <span>Hesap Hareketleri & Dijital Dekontlar ({kullaniciIslemleri.length})</span>
                </h2>
                <p className="text-xs text-slate-400">
                  Tüm para transferleri, kredi taksit ve kart ödemeleri için resmi banka dekontu oluşturun
                </p>
              </div>

              {/* Filtre Butonları */}
              <div className="flex gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800">
                {[
                  { id: 'tum', label: 'Tümü' },
                  { id: 'transfer', label: 'Transferler' },
                  { id: 'kart', label: 'Kart' },
                  { id: 'kredi', label: 'Kredi' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setIslemFiltre(item.id)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                      islemFiltre === item.id
                        ? 'bg-emerald-600 text-white shadow-sm'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {filtrelenmisIslemler.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                Seçilen kategoride işlem kaydı bulunmamaktadır.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="py-3 px-4">Tarih</th>
                      <th className="py-3 px-4">İşlem Türü</th>
                      <th className="py-3 px-4">Alıcı / Gönderen</th>
                      <th className="py-3 px-4 text-right">Tutar</th>
                      <th className="py-3 px-4 text-center">Dekont</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 font-medium">
                    {filtrelenmisIslemler.map((islem) => {
                      const j = islem.toJSON();
                      const gidenMi = j.gonderenTc === aktifKullanici.getTcNo();

                      return (
                        <tr key={j.id} className="hover:bg-slate-800/40 transition-colors">
                          <td className="py-3.5 px-4 font-mono text-slate-400">
                            {new Date(j.tarih).toLocaleDateString('tr-TR', {
                              day: '2-digit',
                              month: '2-digit',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="font-semibold text-white">{islem.getTurBasligi()}</div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {j.referansNo}
                            </div>
                          </td>

                          <td className="py-3.5 px-4">
                            <div className="text-slate-200">
                              {gidenMi ? `➔ ${j.aliciAd}` : `⬅ ${j.gonderenAd}`}
                            </div>
                            <div className="text-[11px] text-slate-500 truncate max-w-xs">
                              {j.aciklama}
                            </div>
                          </td>

                          <td className="py-3.5 px-4 text-right font-mono">
                            <span
                              className={`font-bold text-sm ${
                                gidenMi ? 'text-slate-200' : 'text-emerald-400'
                              }`}
                            >
                              {gidenMi ? '-' : '+'}
                              {j.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}{' '}
                              {j.paraBirimi}
                            </span>
                          </td>

                          <td className="py-3.5 px-4 text-center">
                            <button
                              onClick={() => onDekontAc(islem)}
                              className="px-2.5 py-1.5 bg-slate-800 hover:bg-emerald-600 hover:text-white text-slate-300 rounded-lg text-xs font-semibold transition-colors inline-flex items-center gap-1 border border-slate-700 hover:border-emerald-500"
                            >
                              <Receipt className="w-3.5 h-3.5" />
                              <span>Dekont</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ALT İMZA BİLGİ ŞERİDİ */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Öztürk Bank A.Ş. Güvenli Çevrim İçi Bankacılık Sistemi</span>
        </div>
        <div className="font-mono text-emerald-400/90 font-medium">
          Geliştirici & Sistem Mimarı: <strong className="text-white">Enes Öztürk</strong>
        </div>
      </div>
    </div>
  );
};
