import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import {
  Radio,
  Volume2,
  VolumeX,
  RotateCcw,
  Plus,
  HelpCircle,
  LayoutGrid,
  Columns2,
  Sparkles,
  Users
} from 'lucide-react';
import { AssignmentInfoModal } from './AssignmentInfoModal';

interface NavbarProps {
  onOpenCreateEvent: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCreateEvent }) => {
  const {
    isConnected,
    activeClientsCount,
    soundEnabled,
    setSoundEnabled,
    resetToSeed,
    splitScreenMode,
    setSplitScreenMode,
    setSelectedEventId
  } = useRealtime();

  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  const handleReset = async () => {
    if (confirm('Tüm etkinlik ve katılımcı verileri başlangıç durumuna döndürülecek. Onaylıyor musunuz?')) {
      setIsResetting(true);
      await resetToSeed();
      setIsResetting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 gap-2">
            {/* Logo and signature */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSelectedEventId(null)}
                className="flex items-center gap-2.5 text-left group cursor-pointer focus:outline-none"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                  <Radio className="w-5 h-5 text-white animate-pulse" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-base tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                      EtkinlikHub
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      Realtime
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1.5">
                    <span>Ödev 5</span>
                    <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
                    <span className="font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                      Enes Öztürk
                    </span>
                  </div>
                </div>
              </button>
            </div>

            {/* Middle Live Status Indicator */}
            <div className="hidden md:flex items-center gap-3">
              <div
                className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border ${
                  isConnected
                    ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/30'
                    : 'bg-amber-950/40 text-amber-300 border-amber-500/30'
                }`}
              >
                <span className="relative flex h-2 w-2">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  )}
                  <span
                    className={`relative inline-flex rounded-full h-2 w-2 ${
                      isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}
                  />
                </span>
                <span>{isConnected ? 'Canlı WebSocket Aktif' : 'Yeniden Bağlanıyor...'}</span>
                <span className="inline-block w-1 h-1 rounded-full bg-slate-600" />
                <span className="flex items-center gap-1 text-[11px] text-slate-400">
                  <Users className="w-3 h-3 text-slate-400" />
                  {activeClientsCount} İstemci
                </span>
              </div>

              {/* Split Screen Simulator Toggle */}
              <button
                onClick={() => setSplitScreenMode(!splitScreenMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition cursor-pointer ${
                  splitScreenMode
                    ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/25'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800 hover:text-white'
                }`}
                title="Aynı ekranda iki kullanıcıyı yan yana simüle ederek gerçek zamanlı güncellemeleri anında test edin"
              >
                {splitScreenMode ? (
                  <>
                    <Columns2 className="w-3.5 h-3.5 text-indigo-200" />
                    <span>Çift Ekran Modu (Aktif)</span>
                  </>
                ) : (
                  <>
                    <LayoutGrid className="w-3.5 h-3.5 text-indigo-400" />
                    <span>Çift Ekran Canlı Test</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Controls */}
            <div className="flex items-center gap-2 sm:gap-2.5">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-2 rounded-lg border transition cursor-pointer ${
                  soundEnabled
                    ? 'bg-slate-900 text-indigo-400 border-indigo-500/30 hover:bg-slate-800'
                    : 'bg-slate-900 text-slate-500 border-slate-800 hover:text-slate-300'
                }`}
                title={soundEnabled ? 'Bildirim Sesleri Açık' : 'Bildirim Sesleri Kapalı'}
                aria-label="Ses"
              >
                {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Assignment Info */}
              <button
                onClick={() => setIsInfoOpen(true)}
                className="p-2 rounded-lg bg-slate-900 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800 transition cursor-pointer"
                title="Ödev 5 Gereksinimleri ve İmza Bilgisi"
                aria-label="Ödev Bilgisi"
              >
                <HelpCircle className="w-4 h-4 text-indigo-400" />
              </button>

              {/* Reset to Seed */}
              <button
                onClick={handleReset}
                disabled={isResetting}
                className="p-2 rounded-lg bg-slate-900 text-slate-400 border border-slate-800 hover:text-rose-400 hover:border-rose-500/30 hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
                title="Verileri Sıfırla"
                aria-label="Sıfırla"
              >
                <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              </button>

              {/* Add Event Button */}
              <button
                onClick={onOpenCreateEvent}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold shadow-md shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span className="hidden sm:inline">Yeni Etkinlik</span>
                <span className="sm:hidden">Ekle</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <AssignmentInfoModal isOpen={isInfoOpen} onClose={() => setIsInfoOpen(false)} />
    </>
  );
};
