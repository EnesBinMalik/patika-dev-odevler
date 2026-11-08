/**
 * Navbar - Öztürk Bank Üst Menü & Navigasyon
 * Mimar: Enes Öztürk
 */

import React from 'react';
import { 
  Building2, 
  CreditCard, 
  LayoutDashboard, 
  ShieldCheck, 
  FileCode2, 
  Database, 
  Download, 
  LogOut, 
  LogIn, 
  RotateCcw,
  Sparkles,
  GitBranch
} from 'lucide-react';
import { User } from '../core/models/User';
import { UserRole } from '../core/enums';
import { FileIOService } from '../core/services/FileIOService';

export type AppViewMode = 'atm' | 'customer' | 'admin' | 'uml' | 'eer' | 'springboot';

interface NavbarProps {
  currentView: AppViewMode;
  onViewChange: (view: AppViewMode) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onResetDb: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onViewChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onResetDb
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-xl backdrop-blur-md bg-opacity-95">
      {/* Üst Mimari & İmza Şeridi */}
      <div className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 px-4 py-1 text-xs text-amber-100 flex items-center justify-between font-mono">
        <div className="flex items-center space-x-2">
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Öztürk Bank Kurumsal Bankacılık & ATM İşlem Sistemi</span>
          <span className="hidden md:inline text-amber-200">| Katmanlı Mimari (Clean Code & S.O.L.I.D)</span>
        </div>
        <div className="flex items-center space-x-3">
          <span className="bg-black/30 px-2 py-0.5 rounded text-[11px] font-semibold text-amber-200">
            Sistem Baş Mimarı: Enes Öztürk
          </span>
          <button 
            onClick={() => onViewChange('springboot')} 
            className="hover:text-white underline text-[11px] flex items-center gap-1 transition-colors"
            title="Spring Boot & Mimari Kodları İncele"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            Mimari Raporu
          </button>
        </div>
      </div>

      {/* Ana Navigasyon */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Marka */}
        <div 
          onClick={() => onViewChange(currentUser?.isAdmin() ? 'admin' : 'atm')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center shadow-lg shadow-amber-600/30 group-hover:scale-105 transition-transform border border-amber-400/40">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-amber-200 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
                ÖZTÜRK BANK
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-1.5 py-0.5 rounded font-mono font-bold">
                T.A.Ş.
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono tracking-wide">
              Mimar: Enes Öztürk
            </p>
          </div>
        </div>

        {/* Mod Seçicileri */}
        <nav className="hidden lg:flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => onViewChange('atm')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'atm'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-300" />
            <span>ATM Kiosk</span>
          </button>

          <button
            onClick={() => onViewChange('customer')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'customer'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-400" />
            <span>Müşteri Paneli</span>
          </button>

          <button
            onClick={() => onViewChange('admin')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'admin'
                ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-sky-400" />
            <span>Admin Paneli</span>
          </button>

          <span className="w-px h-5 bg-slate-800 mx-1"></span>

          <button
            onClick={() => onViewChange('uml')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'uml'
                ? 'bg-blue-600 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="OOP UML Sınıf Diyagramı"
          >
            <GitBranch className="w-4 h-4 text-blue-400" />
            <span>UML Sınıfları</span>
          </button>

          <button
            onClick={() => onViewChange('eer')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'eer'
                ? 'bg-purple-600 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Database EER İlişki Diyagramı"
          >
            <Database className="w-4 h-4 text-purple-400" />
            <span>EER Şeması</span>
          </button>

          <button
            onClick={() => onViewChange('springboot')}
            className={`flex items-center space-x-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
              currentView === 'springboot'
                ? 'bg-emerald-600 text-white shadow-md font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
            title="Spring Boot Katmanlı Mimari & SOLID"
          >
            <FileCode2 className="w-4 h-4 text-emerald-400" />
            <span>Spring Boot & SOLID</span>
          </button>
        </nav>

        {/* Sağ Alan: Kullanıcı Bilgisi ve Aksiyonlar */}
        <div className="flex items-center space-x-3">
          {/* I/O Veritabanı Yedek İndirme Butonu */}
          <button
            onClick={() => FileIOService.exportDatabaseBackup()}
            title="Veritabanını JSON Dosyası Olarak Kaydet (I/O File Persistence)"
            className="hidden sm:flex items-center space-x-1.5 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>I/O Yedek</span>
          </button>

          {/* Fabrika Ayarlarına Dön / Sıfırla */}
          <button
            onClick={onResetDb}
            title="Veritabanını Başlangıç Tohum Verilerine Sıfırla"
            className="p-1.5 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Kullanıcı Durumu */}
          {currentUser ? (
            <div className="flex items-center space-x-2 bg-slate-800/80 border border-slate-700/80 px-3 py-1.5 rounded-xl">
              <div className={`w-2.5 h-2.5 rounded-full ${currentUser.isAdmin() ? 'bg-amber-400' : 'bg-emerald-400'}`}></div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-100 flex items-center gap-1.5">
                  <span>{currentUser.fullName}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded font-mono font-bold ${
                    currentUser.isAdmin() ? 'bg-amber-500/20 text-amber-300' : 'bg-emerald-500/20 text-emerald-300'
                  }`}>
                    {currentUser.role === UserRole.ADMIN ? 'YÖNETİCİ' : 'MÜŞTERİ'}
                  </span>
                </p>
                <p className="text-[10px] text-slate-400 font-mono">
                  {currentUser.tcNo}
                </p>
              </div>
              <button
                onClick={onLogout}
                title="Güvenli Çıkış Yap"
                className="ml-2 p-1 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-2 bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-medium text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md shadow-amber-600/25 transition-all"
            >
              <LogIn className="w-4 h-4" />
              <span>Giriş / Kayıt Ol</span>
            </button>
          )}
        </div>
      </div>

      {/* Mobil Görünüm Alt Menüsü */}
      <div className="lg:hidden flex items-center justify-around bg-slate-950 px-2 py-2 border-t border-slate-800 text-xs">
        <button
          onClick={() => onViewChange('atm')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentView === 'atm' ? 'text-amber-400 font-bold' : 'text-slate-400'}`}
        >
          <CreditCard className="w-4 h-4" />
          <span>ATM</span>
        </button>
        <button
          onClick={() => onViewChange('customer')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentView === 'customer' ? 'text-emerald-400 font-bold' : 'text-slate-400'}`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Müşteri</span>
        </button>
        <button
          onClick={() => onViewChange('admin')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentView === 'admin' ? 'text-sky-400 font-bold' : 'text-slate-400'}`}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Admin</span>
        </button>
        <button
          onClick={() => onViewChange('uml')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentView === 'uml' ? 'text-blue-400 font-bold' : 'text-slate-400'}`}
        >
          <GitBranch className="w-4 h-4" />
          <span>UML</span>
        </button>
        <button
          onClick={() => onViewChange('eer')}
          className={`flex flex-col items-center py-1 px-2 rounded ${currentView === 'eer' ? 'text-purple-400 font-bold' : 'text-slate-400'}`}
        >
          <Database className="w-4 h-4" />
          <span>EER</span>
        </button>
      </div>
    </header>
  );
};
