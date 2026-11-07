import React from 'react';
import {
  Building2,
  FileCode2,
  LogOut,
  Moon,
  Sun,
  ShieldCheck,
  User as UserIcon,
} from 'lucide-react';
import { Kullanici } from '../models/Kullanici';
import { Banka } from '../models/Banka';

interface HeaderProps {
  banka: Banka;
  aktifKullanici: Kullanici | null;
  onCikisYap: () => void;
  onGirisAc: () => void;
  onJsonMasasiAc: () => void;
  onYonetimPaneliAc: () => void;
  aktifTab: string;
  onTabDegistir: (tab: string) => void;
  darkMode: boolean;
  onDarkModeToggle: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  banka,
  aktifKullanici,
  onCikisYap,
  onGirisAc,
  onJsonMasasiAc,
  onYonetimPaneliAc,
  aktifTab,
  onTabDegistir,
  darkMode,
  onDarkModeToggle,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800 bg-slate-950/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Sol: Banka Marka ve İmza */}
          <div className="flex items-center gap-6 shrink-0">
            <button
              onClick={() => onTabDegistir('hesaplar')}
              className="flex items-center gap-3 text-left group transition-transform focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-lg tracking-tight text-white group-hover:text-emerald-400 transition-colors">
                    Öztürk Bank
                  </span>
                  <span className="text-[10px] font-mono font-medium text-emerald-400/90 uppercase tracking-wider bg-emerald-950/60 border border-emerald-800/60 px-1.5 py-0.5 rounded">
                    0188
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 font-medium tracking-wide flex items-center gap-1">
                  <span>Enes Öztürk İmzalı</span>
                  <span className="text-slate-600">·</span>
                  <span className="text-emerald-500/80">Online Bankacılık</span>
                </div>
              </div>
            </button>

            {/* Navigasyon Sekmeleri */}
            {aktifKullanici && (
              <nav className="hidden lg:flex items-center gap-1 bg-slate-900/80 p-1 rounded-xl border border-slate-800/80">
                <button
                  onClick={() => onTabDegistir('hesaplar')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    aktifTab === 'hesaplar'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Hesaplarım
                </button>
                <button
                  onClick={() => onTabDegistir('transfer')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    aktifTab === 'transfer'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Para Transferi
                </button>
                <button
                  onClick={() => onTabDegistir('kartlar')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    aktifTab === 'kartlar'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Kredi Kartlarım
                </button>
                <button
                  onClick={() => onTabDegistir('krediler')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    aktifTab === 'krediler'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  Kredilerim
                </button>
                <button
                  onClick={() => onTabDegistir('gecmis')}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap ${
                    aktifTab === 'gecmis'
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                  }`}
                >
                  İşlemler & Dekont
                </button>
              </nav>
            )}
          </div>

          {/* Sağ: JSON Veri Masası, Yönetim & Kullanıcı Profili */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* JSON Veritabanı Görüntüleyici Butonu */}
            <button
              onClick={onJsonMasasiAc}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white hover:border-emerald-500/50 transition-all shadow-sm"
              title="Projede veritabanı yerine işlenen canlı JSON verisini inceleyin"
            >
              <FileCode2 className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">JSON Verisi</span>
              <span className="text-[10px] text-emerald-400 bg-emerald-950 px-1 py-0.2 rounded border border-emerald-800/50">
                DB'siz
              </span>
            </button>

            {/* Banka Yönetim Paneli (Tüm Banka Görünümü) */}
            <button
              onClick={onYonetimPaneliAc}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 hover:text-white transition-all shadow-sm"
              title="Banka kasası, toplam krediler ve müşteri portföyünü inceleyin"
            >
              <Building2 className="w-3.5 h-3.5 text-teal-400" />
              <span className="hidden md:inline">Banka Kasası</span>
            </button>

            {/* Tema Değiştirici */}
            <button
              onClick={onDarkModeToggle}
              className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700"
              aria-label="Tema değiştir"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Kullanıcı Durumu */}
            {aktifKullanici ? (
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div className="text-right hidden sm:block">
                  <div className="text-xs font-bold text-white leading-tight">
                    {aktifKullanici.getTamAd()}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    TC: {aktifKullanici.getTcNo().slice(0, 3)}*****{aktifKullanici.getTcNo().slice(-2)}
                  </div>
                </div>

                <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-xs font-bold text-emerald-400">
                  {aktifKullanici.getAd().charAt(0)}
                  {aktifKullanici.getSoyad().charAt(0)}
                </div>

                <button
                  onClick={onCikisYap}
                  className="p-2 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
                  title="Güvenli Çıkış"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={onGirisAc}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-slate-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-md shadow-emerald-500/20"
              >
                <UserIcon className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>Giriş Yap</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
