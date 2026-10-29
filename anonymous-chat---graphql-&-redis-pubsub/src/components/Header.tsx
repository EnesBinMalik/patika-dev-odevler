import React from 'react';
import {
  Radio,
  Volume2,
  VolumeX,
  Code2,
  Menu,
  ShieldCheck,
  Zap,
} from 'lucide-react';
import { Room } from '../types';

interface HeaderProps {
  currentRoom: Room | null;
  wsConnected: boolean;
  redisEngine: string;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenInspector: () => void;
  onOpenSidebar: () => void;
  unreadCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  currentRoom,
  wsConnected,
  redisEngine,
  soundEnabled,
  onToggleSound,
  onOpenInspector,
  onOpenSidebar,
}) => {
  return (
    <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-4 flex items-center justify-between sticky top-0 z-20">
      {/* Left: Mobile menu toggle + Room title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="md:hidden p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
          aria-label="Menüyü Aç"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-bold text-lg">
            #
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-semibold text-slate-100 text-sm md:text-base leading-none">
                {currentRoom?.name || 'Anonim Sohbet'}
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                GraphQL Live
              </span>
            </div>
            <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-[220px] sm:max-w-md">
              {currentRoom?.description || 'Gerçek zamanlı anonim mesajlaşma'}
            </p>
          </div>
        </div>
      </div>

      {/* Center / Right: Signature Badge & Tools */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Developer Signature Stamp */}
        <div className="hidden lg:flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-indigo-500/30 text-xs shadow-inner">
          <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
          <span className="text-slate-400">İmza:</span>
          <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300">
            Enes Öztürk
          </span>
        </div>

        {/* Redis PubSub Status Pill */}
        <div
          onClick={onOpenInspector}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800/60 border border-slate-700/80 text-xs text-slate-300 cursor-pointer hover:border-indigo-500/40 hover:bg-slate-800 transition"
          title="Redis PubSub & GraphQL Mimarisi"
        >
          <Zap className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
          <span className="font-mono text-[11px] text-slate-300">Redis PubSub</span>
          <span
            className={`w-2 h-2 rounded-full ${
              wsConnected ? 'bg-emerald-400 shadow-sm shadow-emerald-400' : 'bg-amber-400'
            }`}
          />
        </div>

        {/* Audio Toggle */}
        <button
          onClick={onToggleSound}
          className={`p-2 rounded-lg border transition ${
            soundEnabled
              ? 'bg-slate-800/80 border-slate-700 text-indigo-400 hover:text-indigo-300'
              : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
          }`}
          title={soundEnabled ? 'Sesler Açık' : 'Sesler Kapalı'}
          aria-label="Ses Ayarı"
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* GraphQL / Architecture Inspector Button */}
        <button
          onClick={onOpenInspector}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/40 text-indigo-300 text-xs font-medium transition shadow-sm"
          title="GraphQL & Redis Canlı Takip"
        >
          <Code2 className="w-4 h-4" />
          <span className="hidden sm:inline">GraphQL Konsol</span>
        </button>
      </div>
    </header>
  );
};
