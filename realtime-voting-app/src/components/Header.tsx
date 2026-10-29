import React from 'react';
import { Plus, Radio, Terminal, Sparkles, Activity } from 'lucide-react';

interface HeaderProps {
  onOpenCreate: () => void;
  onOpenGraphiQL: () => void;
  onRandomTestVote: () => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
  isVoting: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenCreate,
  onOpenGraphiQL,
  onRandomTestVote,
  connectionStatus,
  isVoting,
}) => {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & Signature */}
          <div className="flex items-center gap-3.5">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-fuchsia-500 shadow-lg shadow-indigo-500/25 ring-1 ring-white/20">
              <Radio className="w-5 h-5 text-white animate-pulse" />
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white">
                  Vote<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-violet-300">Sync</span>
                </span>
                <span className="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  GraphQL Realtime
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Geliştirici:</span>
                <span className="font-medium text-slate-200 hover:text-indigo-400 transition-colors">
                  Enes Öztürk
                </span>
                <span className="text-slate-600">•</span>
                <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                  Subscriptions Aktif
                </span>
              </div>
            </div>
          </div>

          {/* Center Connection Indicator (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/90 border border-slate-800 text-xs text-slate-300 shadow-inner">
            <span
              className={`w-2 h-2 rounded-full ${
                connectionStatus === 'connected'
                  ? 'bg-emerald-400 animate-pulse'
                  : connectionStatus === 'connecting'
                  ? 'bg-amber-400 animate-ping'
                  : 'bg-rose-400'
              }`}
            />
            <span className="font-mono text-[11px]">
              {connectionStatus === 'connected' && 'GraphQL SSE Canlı Akış'}
              {connectionStatus === 'connecting' && 'Bağlanıyor...'}
              {connectionStatus === 'disconnected' && 'Bağlantı Kesildi (Yeniden deneniyor)'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Quick Simulation Vote button to test real-time update */}
            <button
              onClick={onRandomTestVote}
              disabled={isVoting}
              title="Farklı bir kullanıcıymış gibi rastgele bir seçeneğe oy gönderip canlı güncellemeyi test edin"
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 rounded-xl transition-all duration-200 active:scale-95 disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Canlı Test Oyu At</span>
            </button>

            {/* GraphiQL IDE button */}
            <button
              onClick={onOpenGraphiQL}
              title="GraphQL Şemasını ve GraphiQL Playground'ı görüntüle"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 rounded-xl transition-all duration-200 active:scale-95"
            >
              <Terminal className="w-3.5 h-3.5 text-indigo-400" />
              <span className="hidden sm:inline">GraphiQL</span>
            </button>

            {/* Create New Question Button */}
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 rounded-xl shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 border border-indigo-400/30 transition-all duration-200 active:scale-95 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Soru</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
