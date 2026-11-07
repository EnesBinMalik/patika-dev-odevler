import React, { useState } from 'react';
import {
  ShieldAlert,
  Building2,
  Lock,
  UserCheck,
  ArrowRight,
  UserPlus,
  AlertCircle,
  CheckCircle2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { Kullanici } from '../models/Kullanici';

interface AuthScreenProps {
  banka: Banka;
  onGirisBasarili: (kullanici: Kullanici) => void;
}

export const AuthScreen: React.FC<AuthScreenProps> = ({ banka, onGirisBasarili }) => {
  const [mod, setMod] = useState<'giris' | 'kayit'>('giris');

  // Giriş State
  const [tcGiris, setTcGiris] = useState('');
  const [sifreGiris, setSifreGiris] = useState('');
  const [girisHata, setGirisHata] = useState('');

  // Kayıt State
  const [yeniTc, setYeniTc] = useState('');
  const [yeniAd, setYeniAd] = useState('');
  const [yeniSoyad, setYeniSoyad] = useState('');
  const [yeniDogumTarihi, setYeniDogumTarihi] = useState('');
  const [yeniSifre, setYeniSifre] = useState('');
  const [yeniTelefon, setYeniTelefon] = useState('05');
  const [yeniEmail, setYeniEmail] = useState('');
  const [kayitHata, setKayitHata] = useState('');
  const [kayitBasariliMesaj, setKayitBasariliMesaj] = useState('');

  // Canlı doğum tarihi şifre kontrolü
  const canliSifreKontrol =
    mod === 'kayit' && yeniDogumTarihi && yeniSifre
      ? Kullanici.sifreDogumTarihiIceriyorMu(yeniDogumTarihi, yeniSifre)
      : { iceriyor: false };

  const handleGirisSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGirisHata('');
    try {
      const musteri = banka.kullaniciGiris(tcGiris, sifreGiris);
      onGirisBasarili(musteri);
    } catch (err: any) {
      setGirisHata(err.message || 'Giriş yapılamadı.');
    }
  };

  const handleKayitSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setKayitHata('');
    try {
      const yeniMusteri = banka.kullaniciKayit(
        yeniTc,
        yeniAd,
        yeniSoyad,
        yeniDogumTarihi,
        yeniSifre,
        yeniTelefon,
        yeniEmail
      );
      setKayitBasariliMesaj(
        `Sayın ${yeniMusteri.getTamAd()}, kaydınız başarıyla oluşturuldu! Hoş geldin bakiyeniz tanımlandı. Şimdi giriş yapabilirsiniz.`
      );
      setMod('giris');
      setTcGiris(yeniTc);
      setSifreGiris(yeniSifre);
    } catch (err: any) {
      setKayitHata(err.message || 'Kayıt sırasında hata oluştu.');
    }
  };

  // Hızlı Demo Girişi
  const demoKullaniciSec = (tc: string, sifre: string) => {
    setTcGiris(tc);
    setSifreGiris(sifre);
    setGirisHata('');
    try {
      const musteri = banka.kullaniciGiris(tc, sifre);
      onGirisBasarili(musteri);
    } catch (err: any) {
      setGirisHata(err.message);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Sol Taraf: Banka Tanıtımı & Mimari Bilgi */}
        <div className="lg:col-span-5 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800/60 text-emerald-400 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Java OOP Mimarili Online Banka</span>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Öztürk Bank <span className="text-emerald-400 font-serif">Dijital</span>
            </h1>
            <p className="text-sm text-slate-400 leading-relaxed">
              Kullanıcılar arası anında para transferi (Havale / FAST), kredi kartı ekstre ve borç
              ödemesi, anında kredi taksit tahsilatı işlemlerini gerçekleştirebileceğiniz kurumsal
              bankacılık platformu.
            </p>
          </div>

          {/* Zorunlu Şifre Kuralı Bilgilendirme Kutusu */}
          <div className="p-4 rounded-xl bg-slate-900/90 border border-amber-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-amber-400 font-semibold">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>Zorunlu Güvenlik Kuralı</span>
            </div>
            <p className="text-slate-300 leading-normal">
              Bankacılık güvenlik standartları gereği{' '}
              <strong className="text-white">şifre içerisinde doğum tarihi</strong> (doğum yılı,
              gün/ay kombinasyonu veya ardışık tarih dizisi) kesinlikle barındırılamaz.
            </p>
          </div>

          {/* Hızlı Demo Kullanıcı Girişleri */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-medium text-slate-400 flex items-center justify-between">
              <span>Hızlı Test İçin Hazır Kullanıcılar:</span>
              <span className="text-[10px] font-mono text-emerald-400">1 Tıkla Giriş</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                onClick={() => demoKullaniciSec('12345678901', 'Ahmet.9876!')}
                className="p-3 text-left rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Ahmet Yılmaz
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Aktif Kredi+Kart</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  34.850 TL · Ekstre: 4.850 TL
                </div>
              </button>

              <button
                onClick={() => demoKullaniciSec('98765432109', 'AyseKaya345!')}
                className="p-3 text-left rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Ayşe Kaya
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Transfer Alıcısı</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  48.200 TL · Kart: 3.200 TL
                </div>
              </button>

              <button
                onClick={() => demoKullaniciSec('55544433322', 'MehmetDemir99!')}
                className="p-3 text-left rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-slate-800 hover:border-emerald-500/40 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-emerald-400 transition-colors">
                    Mehmet Demir
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Taşıt Kredisi</span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  18.500 TL · Kredi Taksitli
                </div>
              </button>

              <button
                onClick={() => demoKullaniciSec('11111111110', 'EnesOzturk2026!')}
                className="p-3 text-left rounded-xl bg-slate-900 hover:bg-slate-800/90 border border-emerald-800/50 hover:border-emerald-500 transition-all group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400">
                    Enes Öztürk
                  </span>
                  <span className="text-[10px] font-mono text-emerald-500 bg-emerald-950/80 px-1 rounded">
                    Yönetici
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-mono mt-1">
                  Genel Müdür · 750.000 TL
                </div>
              </button>
            </div>
          </div>

          <div className="text-[11px] text-slate-500 font-mono pt-2 border-t border-slate-900 flex items-center justify-between">
            <span>Enes Öztürk İmzalı Bankacılık Çözümü</span>
            <span>JSON DB Engine v1.0</span>
          </div>
        </div>

        {/* Sağ Taraf: Giriş & Kayıt Form Kartı */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-sm">
            {/* Sekme Değiştirici: Giriş / Kayıt */}
            <div className="flex items-center p-1 bg-slate-950 rounded-xl mb-6 border border-slate-800">
              <button
                type="button"
                onClick={() => {
                  setMod('giris');
                  setGirisHata('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mod === 'giris'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                İnternet Şubesi Girişi
              </button>
              <button
                type="button"
                onClick={() => {
                  setMod('kayit');
                  setKayitHata('');
                }}
                className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                  mod === 'kayit'
                    ? 'bg-emerald-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Yeni Müşteri Ol
              </button>
            </div>

            {kayitBasariliMesaj && (
              <div className="mb-5 p-3.5 bg-emerald-950/80 border border-emerald-700/80 rounded-xl text-emerald-200 text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>{kayitBasariliMesaj}</span>
              </div>
            )}

            {/* GİRİŞ FORMU */}
            {mod === 'giris' && (
              <form onSubmit={handleGirisSubmit} className="space-y-4">
                {girisHata && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{girisHata}</span>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    T.C. Kimlik Numarası (11 Hane)
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      maxLength={11}
                      value={tcGiris}
                      onChange={(e) => setTcGiris(e.target.value.replace(/\D/g, ''))}
                      placeholder="11111111111"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Banka Şifresi
                  </label>
                  <div className="relative">
                    <input
                      type="password"
                      value={sifreGiris}
                      onChange={(e) => setSifreGiris(e.target.value)}
                      placeholder="••••••••"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-colors"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm rounded-xl transition-colors shadow-lg shadow-emerald-500/20 flex items-center justify-center gap-2"
                  >
                    <UserCheck className="w-4 h-4 stroke-[2.5]" />
                    <span>Güvenli Giriş Yap</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            )}

            {/* YENİ MÜŞTERİ KAYIT FORMU */}
            {mod === 'kayit' && (
              <form onSubmit={handleKayitSubmit} className="space-y-3.5">
                {kayitHata && (
                  <div className="p-3.5 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-start gap-2.5">
                    <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                    <span>{kayitHata}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Adınız</label>
                    <input
                      type="text"
                      value={yeniAd}
                      onChange={(e) => setYeniAd(e.target.value)}
                      placeholder="Örn: Can"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">Soyadınız</label>
                    <input
                      type="text"
                      value={yeniSoyad}
                      onChange={(e) => setYeniSoyad(e.target.value)}
                      placeholder="Örn: Yılmaz"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      T.C. Kimlik No
                    </label>
                    <input
                      type="text"
                      maxLength={11}
                      value={yeniTc}
                      onChange={(e) => setYeniTc(e.target.value.replace(/\D/g, ''))}
                      placeholder="11 haneli T.C."
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm font-mono text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                      <span>Doğum Tarihi</span>
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    </label>
                    <input
                      type="date"
                      value={yeniDogumTarihi}
                      onChange={(e) => setYeniDogumTarihi(e.target.value)}
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-medium text-slate-300">
                      Banka Şifresi (Min. 6 Karakter)
                    </label>
                    <span className="text-[11px] text-amber-400 font-medium">
                      Doğum tarihi içeremez!
                    </span>
                  </div>
                  <input
                    type="password"
                    value={yeniSifre}
                    onChange={(e) => setYeniSifre(e.target.value)}
                    placeholder="Şifrenizi belirleyin"
                    required
                    className={`w-full bg-slate-950 border rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none transition-colors ${
                      canliSifreKontrol.iceriyor
                        ? 'border-rose-500 bg-rose-950/20 ring-1 ring-rose-500'
                        : 'border-slate-700 focus:border-emerald-500'
                    }`}
                  />
                  {canliSifreKontrol.iceriyor && (
                    <div className="mt-1.5 text-xs text-rose-400 flex items-center gap-1.5 font-medium">
                      <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                      <span>{canliSifreKontrol.mesaj}</span>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      Telefon Numarası
                    </label>
                    <input
                      type="text"
                      value={yeniTelefon}
                      onChange={(e) => setYeniTelefon(e.target.value)}
                      placeholder="05XX XXX XX XX"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1">
                      E-Posta Adresi
                    </label>
                    <input
                      type="email"
                      value={yeniEmail}
                      onChange={(e) => setYeniEmail(e.target.value)}
                      placeholder="ornek@mail.com"
                      required
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={canliSifreKontrol.iceriyor}
                    className={`w-full py-3 px-4 font-bold text-sm rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 ${
                      canliSifreKontrol.iceriyor
                        ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                        : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 shadow-emerald-500/20'
                    }`}
                  >
                    <UserPlus className="w-4 h-4 stroke-[2.5]" />
                    <span>Müşteri Kaydını Tamamla (5.000 TL Bakiye Tanımlanır)</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
