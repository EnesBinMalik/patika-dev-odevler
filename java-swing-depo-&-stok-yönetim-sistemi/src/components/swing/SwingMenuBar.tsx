import React, { useState, useRef, useEffect } from 'react';
import { SwingTheme } from '../../types/warehouse';
import {
  FileText,
  Plus,
  Minus,
  RefreshCw,
  AlertTriangle,
  Code2,
  Share2,
  PackageCheck,
  Truck,
  Layers,
  Sparkles,
  Info,
  Check,
  ShieldAlert,
} from 'lucide-react';

interface SwingMenuBarProps {
  theme: SwingTheme;
  setTheme: (t: SwingTheme) => void;
  onOpenStockIn: () => void;
  onOpenStockOut: () => void;
  onOpenNewProduct: () => void;
  onOpenNewSupplier: () => void;
  onOpenLinkedIn: () => void;
  onOpenArchitecture: () => void;
  onResetData: () => void;
  onExportJson: () => void;
  onSimulateCritical: () => void;
}

export const SwingMenuBar: React.FC<SwingMenuBarProps> = ({
  theme,
  setTheme,
  onOpenStockIn,
  onOpenStockOut,
  onOpenNewProduct,
  onOpenNewSupplier,
  onOpenLinkedIn,
  onOpenArchitecture,
  onResetData,
  onExportJson,
  onSimulateCritical,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setActiveMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';
  const isClassic = theme === 'classic';

  const menuBarClasses = isDark
    ? 'bg-[#3c3f41] text-[#bbbbbb] border-b border-[#313335]'
    : isNimbus
    ? 'bg-[#e7eaf0] text-[#2c3e50] border-b border-[#a8b0bd]'
    : 'bg-[#d4d0c8] text-black border-b border-[#808080]';

  const dropdownClasses = isDark
    ? 'bg-[#3c3f41] border border-[#555] text-[#bbb] shadow-xl shadow-black/50'
    : isNimbus
    ? 'bg-[#f4f6f9] border border-[#a8b0bd] text-[#2c3e50] shadow-lg'
    : 'bg-[#d4d0c8] border-2 border-t-white border-l-white border-b-black border-r-black text-black shadow-lg';

  const itemHoverClasses = isDark
    ? 'hover:bg-[#2f65ca] hover:text-white'
    : isNimbus
    ? 'hover:bg-[#2f5597] hover:text-white'
    : 'hover:bg-[#000080] hover:text-white';

  return (
    <div
      ref={menuRef}
      className={`flex items-center px-2 py-0.5 text-xs select-none relative z-30 font-sans ${menuBarClasses}`}
    >
      {/* DOSYA */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'dosya' ? null : 'dosya')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'dosya' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          Dosya (F)
        </button>

        {activeMenu === 'dosya' && (
          <div className={`absolute left-0 top-full mt-0.5 w-60 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                onOpenNewProduct();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2">
                <Plus className="w-3.5 h-3.5" /> Yeni Ürün Ekle...
              </span>
              <span className="text-[10px] opacity-60 font-mono">Ctrl+N</span>
            </button>

            <button
              onClick={() => {
                onExportJson();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5" /> Veritabanı Yedeği (JSON)
              </span>
              <span className="text-[10px] opacity-60 font-mono">Ctrl+S</span>
            </button>

            <div className={`my-1 border-t ${isDark ? 'border-[#4a4a4a]' : 'border-slate-300'}`} />

            <button
              onClick={() => {
                onResetData();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2 text-amber-500">
                <RefreshCw className="w-3.5 h-3.5" /> Fabrika Ayarlarına Sıfırla
              </span>
            </button>
          </div>
        )}
      </div>

      {/* İŞLEMLER */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'islemler' ? null : 'islemler')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'islemler' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          İşlemler (T)
        </button>

        {activeMenu === 'islemler' && (
          <div className={`absolute left-0 top-full mt-0.5 w-64 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                onOpenStockIn();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2 text-emerald-400">
                <Plus className="w-3.5 h-3.5" /> Depo Girişi Yap (Stock In)
              </span>
              <span className="text-[10px] opacity-60 font-mono">+</span>
            </button>

            <button
              onClick={() => {
                onOpenStockOut();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2 text-red-400">
                <Minus className="w-3.5 h-3.5" /> Depo Çıkışı Yap (Stock Out)
              </span>
              <span className="text-[10px] opacity-60 font-mono">-</span>
            </button>

            <div className={`my-1 border-t ${isDark ? 'border-[#4a4a4a]' : 'border-slate-300'}`} />

            <button
              onClick={() => {
                onSimulateCritical();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2 text-amber-400">
                <ShieldAlert className="w-3.5 h-3.5" /> Kritik Stok Simülatörü (Event)
              </span>
              <span className="text-[10px] opacity-60 font-mono">F5</span>
            </button>
          </div>
        )}
      </div>

      {/* TEDARİK ZİNCİRİ */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'tedarik' ? null : 'tedarik')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'tedarik' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          Tedarik Zinciri (S)
        </button>

        {activeMenu === 'tedarik' && (
          <div className={`absolute left-0 top-full mt-0.5 w-60 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                onOpenNewSupplier();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5" /> Yeni Tedarikçi Kaydet...
              </span>
            </button>
          </div>
        )}
      </div>

      {/* OOP & MİMARİ */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'oop' ? null : 'oop')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'oop' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          OOP & Mimari (O)
        </button>

        {activeMenu === 'oop' && (
          <div className={`absolute left-0 top-full mt-0.5 w-68 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                onOpenArchitecture();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2">
                <Layers className="w-3.5 h-3.5 text-blue-400" /> UML Sınıf & Kalıtım Şeması
              </span>
            </button>

            <button
              onClick={() => {
                onOpenArchitecture();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2">
                <Code2 className="w-3.5 h-3.5 text-amber-400" /> Java Kaynak Kodları (Java 101)
              </span>
              <span className="text-[10px] opacity-60 font-mono">F12</span>
            </button>
          </div>
        )}
      </div>

      {/* GÖRÜNÜM (LOOK AND FEEL) */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'lookAndFeel' ? null : 'lookAndFeel')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'lookAndFeel' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          Görünüm (L&F)
        </button>

        {activeMenu === 'lookAndFeel' && (
          <div className={`absolute left-0 top-full mt-0.5 w-56 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                setTheme('darcula');
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span>Darcula (IntelliJ Dark)</span>
              {theme === 'darcula' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                setTheme('nimbus');
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span>Nimbus (Modern Java Swing)</span>
              {theme === 'nimbus' && <Check className="w-3.5 h-3.5" />}
            </button>

            <button
              onClick={() => {
                setTheme('classic');
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs ${itemHoverClasses}`}
            >
              <span>Classic Metal (Retro Swing)</span>
              {theme === 'classic' && <Check className="w-3.5 h-3.5" />}
            </button>
          </div>
        )}
      </div>

      {/* HAKKINDA / LINKEDIN */}
      <div className="relative">
        <button
          onClick={() => setActiveMenu(activeMenu === 'hakkinda' ? null : 'hakkinda')}
          className={`px-2 py-1 rounded-xs transition-colors ${
            activeMenu === 'hakkinda' ? (isDark ? 'bg-[#4e5254] text-white' : 'bg-blue-600 text-white') : 'hover:bg-black/10'
          }`}
        >
          Hakkında & İmzalı (A)
        </button>

        {activeMenu === 'hakkinda' && (
          <div className={`absolute left-0 top-full mt-0.5 w-72 py-1 ${dropdownClasses}`}>
            <button
              onClick={() => {
                onOpenLinkedIn();
                setActiveMenu(null);
              }}
              className={`w-full flex items-center justify-between px-3 py-1.5 text-left text-xs font-semibold ${itemHoverClasses}`}
            >
              <span className="flex items-center gap-2 text-blue-400">
                <Share2 className="w-3.5 h-3.5" /> LinkedIn Sunumu [Enes Öztürk]
              </span>
              <span className="text-[10px] text-amber-400 font-mono">PORTFOLYO</span>
            </button>

            <div className={`my-1 border-t ${isDark ? 'border-[#4a4a4a]' : 'border-slate-300'}`} />

            <div className="px-3 py-1.5 text-[11px] leading-tight text-slate-400">
              Geliştirici: <strong className="text-slate-200">Enes Öztürk</strong>
              <div className="text-[10px] text-slate-500 mt-0.5">Java Swing & OOP Mimari Otomasyonu</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
