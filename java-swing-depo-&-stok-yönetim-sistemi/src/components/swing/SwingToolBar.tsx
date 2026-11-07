import React from 'react';
import { SwingTheme } from '../../types/warehouse';
import {
  Plus,
  Minus,
  ShieldAlert,
  Truck,
  PackagePlus,
  Code2,
  Share2,
  RefreshCw,
  Layers,
  Sparkles,
} from 'lucide-react';

interface SwingToolBarProps {
  theme: SwingTheme;
  onOpenStockIn: () => void;
  onOpenStockOut: () => void;
  onOpenNewProduct: () => void;
  onOpenLinkedIn: () => void;
  onOpenArchitecture: () => void;
  onSimulateCritical: () => void;
  onAutoReorder: () => void;
  onRefresh: () => void;
}

export const SwingToolBar: React.FC<SwingToolBarProps> = ({
  theme,
  onOpenStockIn,
  onOpenStockOut,
  onOpenNewProduct,
  onOpenLinkedIn,
  onOpenArchitecture,
  onSimulateCritical,
  onAutoReorder,
  onRefresh,
}) => {
  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const toolbarClasses = isDark
    ? 'bg-[#313335] border-b border-[#2b2b2b] text-[#bbbbbb]'
    : isNimbus
    ? 'bg-[#dce1e9] border-b border-[#a8b0bd] text-[#2c3e50]'
    : 'bg-[#d4d0c8] border-b border-[#808080] text-black';

  const btnClasses = isDark
    ? 'hover:bg-[#45494a] active:bg-[#2b2b2b] text-slate-200 border border-transparent hover:border-[#555] rounded-xs'
    : isNimbus
    ? 'hover:bg-white active:bg-[#c0c8d6] text-slate-800 border border-transparent hover:border-[#a0a8b5] rounded'
    : 'bg-[#d4d0c8] hover:bg-[#e0dcd4] active:border-t-black active:border-l-black active:border-b-white active:border-r-white border border-t-white border-l-white border-b-black border-r-black text-black';

  return (
    <div className={`flex items-center gap-1 px-3 py-1.5 select-none overflow-x-auto text-xs ${toolbarClasses}`}>
      {/* Depo Girişi */}
      <button
        onClick={onOpenStockIn}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses}`}
        title="Depo Girişi Yap (Tedarikçi kabulü veya stok artırımı)"
      >
        <div className="w-4 h-4 rounded-xs bg-emerald-600/20 text-emerald-400 flex items-center justify-center font-bold">
          <Plus className="w-3.5 h-3.5" />
        </div>
        <span className="font-medium whitespace-nowrap">Depo Girişi (+)</span>
      </button>

      {/* Depo Çıkışı */}
      <button
        onClick={onOpenStockOut}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses}`}
        title="Depo Çıkışı Yap (Müşteri sevkiyatı veya montaj bandına çıkış)"
      >
        <div className="w-4 h-4 rounded-xs bg-red-600/20 text-red-400 flex items-center justify-center font-bold">
          <Minus className="w-3.5 h-3.5" />
        </div>
        <span className="font-medium whitespace-nowrap">Depo Çıkışı (-)</span>
      </button>

      <div className={`h-5 w-px mx-1 ${isDark ? 'bg-[#4e5254]' : 'bg-slate-400'}`} />

      {/* Kritik Stok Simülatörü */}
      <button
        onClick={onSimulateCritical}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses} text-amber-300 font-medium`}
        title="Event-Driven Mantık: Bir ürünü anında kritik seviyeye veya 0 stoğa çekip Swing JOptionPane uyarısını tetikler"
      >
        <ShieldAlert className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
        <span className="whitespace-nowrap">Kritik Stok Simülatörü (Event)</span>
      </button>

      {/* Otomatik Tedarik Siparişi */}
      <button
        onClick={onAutoReorder}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses}`}
        title="Kritik seviyedeki tüm ürünler için anlaşmalı tedarikçilere otomatik satın alma emri üretir"
      >
        <Truck className="w-3.5 h-3.5 text-blue-400" />
        <span className="whitespace-nowrap">Otomatik Sipariş Üret</span>
      </button>

      <div className={`h-5 w-px mx-1 ${isDark ? 'bg-[#4e5254]' : 'bg-slate-400'}`} />

      {/* Yeni Ürün */}
      <button
        onClick={onOpenNewProduct}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses}`}
        title="Yeni OOP Ürün Tanımla (Perishable, Hazardous, Electronic veya Standard)"
      >
        <PackagePlus className="w-3.5 h-3.5 text-indigo-400" />
        <span className="whitespace-nowrap">Yeni Ürün Ekle</span>
      </button>

      {/* OOP & Java Kodları */}
      <button
        onClick={onOpenArchitecture}
        className={`flex items-center gap-1.5 px-2.5 py-1 transition-all ${btnClasses}`}
        title="Java 101, Kalıtım, Çok Biçimlilik ve Kapsülleme Kod Gezgini"
      >
        <Code2 className="w-3.5 h-3.5 text-amber-400" />
        <span className="whitespace-nowrap">Java OOP Kodları</span>
      </button>

      {/* Yenile */}
      <button
        onClick={onRefresh}
        className={`p-1.5 transition-all ${btnClasses}`}
        title="Verileri Yenile"
      >
        <RefreshCw className="w-3.5 h-3.5" />
      </button>

      {/* LinkedIn Sunumu (Enes Öztürk) */}
      <div className="ml-auto flex items-center gap-1">
        <button
          onClick={onOpenLinkedIn}
          className={`flex items-center gap-1.5 px-3 py-1 font-semibold rounded-xs shadow-xs transition-all ${
            isDark
              ? 'bg-blue-600 hover:bg-blue-500 text-white'
              : 'bg-[#0077b5] hover:bg-[#005f93] text-white'
          }`}
          title="LinkedIn Sunum Kartı ve Enes Öztürk İmzası"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="whitespace-nowrap">LinkedIn Sunum Kartı [Enes Öztürk]</span>
        </button>
      </div>
    </div>
  );
};
