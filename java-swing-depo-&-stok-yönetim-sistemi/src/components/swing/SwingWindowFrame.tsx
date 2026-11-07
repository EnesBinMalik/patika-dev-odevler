import React, { useState } from 'react';
import { SwingTheme } from '../../types/warehouse';
import {
  Package,
  Layers,
  Truck,
  Code2,
  TrendingUp,
  Minus,
  Square,
  X,
  Share2,
} from 'lucide-react';

interface SwingWindowFrameProps {
  theme: SwingTheme;
  activeTab: 'INVENTORY' | 'TRANSACTIONS' | 'SUPPLIERS' | 'ARCHITECTURE' | 'ANALYTICS';
  setActiveTab: (tab: 'INVENTORY' | 'TRANSACTIONS' | 'SUPPLIERS' | 'ARCHITECTURE' | 'ANALYTICS') => void;
  children: React.ReactNode;
  menuBar: React.ReactNode;
  toolBar: React.ReactNode;
  statusBar: React.ReactNode;
  criticalCount: number;
  depletedCount: number;
}

export const SwingWindowFrame: React.FC<SwingWindowFrameProps> = ({
  theme,
  activeTab,
  setActiveTab,
  children,
  menuBar,
  toolBar,
  statusBar,
  criticalCount,
  depletedCount,
}) => {
  const [isMaximized, setIsMaximized] = useState(false);

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';
  const isClassic = theme === 'classic';

  const windowContainerClasses = isDark
    ? 'bg-[#2b2b2b] text-slate-100 border border-[#444]'
    : isNimbus
    ? 'bg-[#edf0f5] text-slate-900 border border-[#9ea7b5]'
    : 'bg-[#d4d0c8] text-black border-2 border-t-white border-l-white border-b-black border-r-black';

  const titleBarClasses = isDark
    ? 'bg-[#1f2224] text-slate-200 border-b border-[#333]'
    : isNimbus
    ? 'bg-gradient-to-r from-[#2f5597] via-[#24457e] to-[#1e3b6d] text-white border-b border-[#1c3660]'
    : 'bg-[#000080] text-white font-bold';

  const tabItemClasses = (isSelected: boolean) => {
    if (isDark) {
      return isSelected
        ? 'bg-[#2b2b2b] text-white border-t-2 border-blue-500 font-semibold shadow-xs'
        : 'bg-[#35383a] text-slate-400 hover:text-slate-200 hover:bg-[#3c4042]';
    }
    if (isNimbus) {
      return isSelected
        ? 'bg-[#edf0f5] text-blue-900 border-t-2 border-[#2f5597] font-semibold'
        : 'bg-[#d8dde6] text-slate-600 hover:text-slate-900';
    }
    return isSelected
      ? 'bg-[#d4d0c8] text-black border-t-2 border-t-white border-l-2 border-l-white font-bold'
      : 'bg-[#b8b4ac] text-slate-800';
  };

  return (
    <div className="w-full h-screen p-2 sm:p-4 bg-slate-950 flex flex-col justify-center items-center overflow-hidden">
      <div
        className={`w-full max-w-7xl h-full flex flex-col rounded-xs shadow-2xl transition-all duration-150 overflow-hidden ${windowContainerClasses}`}
        style={{
          boxShadow: isDark
            ? '0 25px 60px -15px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)'
            : '0 20px 50px rgba(0, 0, 0, 0.3)',
        }}
      >
        {/* JFrame Title Bar */}
        <div className={`flex items-center justify-between px-3 py-1.5 select-none text-xs ${titleBarClasses}`}>
          <div className="flex items-center gap-2 font-mono font-medium truncate">
            <span className="text-amber-400 text-sm font-bold">☕</span>
            <span className="font-bold truncate">
              DepoStokPro v3.2 - Depo & Tedarik Zinciri Otomasyonu [JVM 21 · Enes Öztürk]
            </span>
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {}}
              className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-white/20 text-slate-300 transition-colors"
              title="Simge Durumuna Küçült"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setIsMaximized(!isMaximized)}
              className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-white/20 text-slate-300 transition-colors"
              title="Ekranı Kapla / Normal Boyut"
            >
              <Square className="w-3 h-3" />
            </button>
            <button
              onClick={() => {}}
              className="w-5 h-5 flex items-center justify-center rounded-xs hover:bg-red-600 text-slate-300 hover:text-white transition-colors"
              title="Kapat"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* JMenuBar */}
        {menuBar}

        {/* JToolBar */}
        {toolBar}

        {/* JTabbedPane Tabs Bar */}
        <div
          className={`flex items-center gap-1 px-2 pt-1 border-b text-xs select-none overflow-x-auto ${
            isDark ? 'bg-[#313335] border-[#252728]' : isNimbus ? 'bg-[#d0d6e2] border-[#b0b8c5]' : 'bg-[#d4d0c8] border-[#808080]'
          }`}
        >
          {/* Tab 1: Stok Listesi */}
          <button
            onClick={() => setActiveTab('INVENTORY')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xs transition-all whitespace-nowrap font-sans text-xs ${tabItemClasses(
              activeTab === 'INVENTORY'
            )}`}
          >
            <Package className="w-3.5 h-3.5 text-amber-400" />
            <span>Stok & Depo Listesi (JTable)</span>
            {criticalCount + depletedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-mono rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {criticalCount + depletedCount}
              </span>
            )}
          </button>

          {/* Tab 2: Depo Giriş/Çıkış */}
          <button
            onClick={() => setActiveTab('TRANSACTIONS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xs transition-all whitespace-nowrap font-sans text-xs ${tabItemClasses(
              activeTab === 'TRANSACTIONS'
            )}`}
          >
            <Layers className="w-3.5 h-3.5 text-blue-400" />
            <span>Depo Giriş / Çıkış Defteri</span>
          </button>

          {/* Tab 3: Tedarik Zinciri */}
          <button
            onClick={() => setActiveTab('SUPPLIERS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xs transition-all whitespace-nowrap font-sans text-xs ${tabItemClasses(
              activeTab === 'SUPPLIERS'
            )}`}
          >
            <Truck className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tedarikçiler & Siparişler</span>
          </button>

          {/* Tab 4: OOP & Java Kodları */}
          <button
            onClick={() => setActiveTab('ARCHITECTURE')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xs transition-all whitespace-nowrap font-sans text-xs ${tabItemClasses(
              activeTab === 'ARCHITECTURE'
            )}`}
          >
            <Code2 className="w-3.5 h-3.5 text-amber-400" />
            <span>OOP Mimarisi & Java 101</span>
          </button>

          {/* Tab 5: Depo İstatistikleri */}
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-t-xs transition-all whitespace-nowrap font-sans text-xs ${tabItemClasses(
              activeTab === 'ANALYTICS'
            )}`}
          >
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span>Depo Analitiği & Finans</span>
          </button>
        </div>

        {/* Central Viewport Content */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </div>

        {/* JStatusBar */}
        {statusBar}
      </div>
    </div>
  );
};
