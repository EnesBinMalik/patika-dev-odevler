import React from 'react';
import { SwingTheme } from '../../types/warehouse';
import { Database, AlertTriangle, ShieldCheck, User } from 'lucide-react';

interface SwingStatusBarProps {
  theme: SwingTheme;
  totalProducts: number;
  criticalCount: number;
  depletedCount: number;
  totalValuation: number;
  activeOrdersCount: number;
}

export const SwingStatusBar: React.FC<SwingStatusBarProps> = ({
  theme,
  totalProducts,
  criticalCount,
  depletedCount,
  totalValuation,
  activeOrdersCount,
}) => {
  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const statusClasses = isDark
    ? 'bg-[#2b2b2b] text-[#999999] border-t border-[#3c3f41]'
    : isNimbus
    ? 'bg-[#d6dae2] text-[#4b5563] border-t border-[#b0b8c5]'
    : 'bg-[#d4d0c8] text-black border-t border-[#808080]';

  return (
    <footer className={`flex items-center justify-between px-3 py-1 text-[11px] select-none font-mono ${statusClasses}`}>
      <div className="flex items-center gap-3 overflow-x-auto">
        <span className="flex items-center gap-1">
          <span className="text-amber-500 font-bold">☕</span>
          <span className="font-semibold text-slate-300">JVM 21.0.2</span>
          <span className="text-slate-500">(HotSpot 64-Bit)</span>
        </span>

        <span className="text-slate-600">|</span>

        <span className="flex items-center gap-1.5">
          <Database className="w-3 h-3 text-blue-400" />
          <span>Ürün: <strong className="text-slate-200">{totalProducts}</strong></span>
          <span>·</span>
          <span>Aktif Sipariş: <strong className="text-slate-200">{activeOrdersCount}</strong></span>
        </span>

        <span className="text-slate-600">|</span>

        {criticalCount > 0 || depletedCount > 0 ? (
          <span className="flex items-center gap-1 text-amber-400 font-semibold">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>Kritik/Tükenen: {criticalCount + depletedCount}</span>
          </span>
        ) : (
          <span className="flex items-center gap-1 text-emerald-400">
            <ShieldCheck className="w-3 h-3" />
            <span>Stoklar Güvenli</span>
          </span>
        )}

        <span className="text-slate-600">|</span>

        <span>
          Toplam Envanter: <strong className="text-emerald-400 font-semibold">{totalValuation.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺</strong>
        </span>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <span className="flex items-center gap-1.5 text-slate-400">
          <User className="w-3 h-3 text-blue-400" />
          <span>Geliştirici & Yetkili:</span>
          <strong className="text-amber-300 font-sans">Enes Öztürk</strong>
        </span>

        <span className="text-slate-600">|</span>

        <span className="capitalize text-slate-400">
          L&F: <strong className="text-slate-300">{theme}</strong>
        </span>
      </div>
    </footer>
  );
};
