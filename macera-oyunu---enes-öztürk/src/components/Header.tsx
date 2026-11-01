import { Shield, Volume2, VolumeX, BookOpen, RotateCcw } from 'lucide-react';
import { sound } from '../utils/audio';

interface HeaderProps {
  onOpenSpecs: () => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  playerName?: string;
  inGame: boolean;
}

export function Header({
  onOpenSpecs,
  onResetGame,
  soundEnabled,
  onToggleSound,
  playerName,
  inGame,
}: HeaderProps) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/80 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-lg tracking-wider text-amber-100">
                MACERA OYUNU
              </span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono border border-amber-500/30">
                Java 102
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Geliştirici: <span className="text-slate-200 font-medium">Enes Öztürk</span>
            </p>
          </div>
        </div>

        {/* Center info or greeting */}
        {inGame && playerName && (
          <div className="hidden md:flex items-center gap-2 text-xs text-slate-400">
            <span>Maceracı:</span>
            <span className="text-amber-300 font-semibold">{playerName}</span>
            <span className="text-slate-600">·</span>
            <span>Hedef: 3 Ödülü Topla ve Güvenli Ev'e Dön</span>
          </div>
        )}

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playInitiative();
              onOpenSpecs();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors"
            title="Ödev Maddeleri ve Mekanikleri"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Ödev Kriterleri</span>
          </button>

          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border text-xs transition-colors ${
              soundEnabled
                ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-400'
            }`}
            title={soundEnabled ? 'Sesi Kapat' : 'Sesi Aç'}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {inGame && (
            <button
              onClick={() => {
                if (window.confirm('Oyunu sıfırlayıp karakter seçim ekranına dönmek istediğinize emin misiniz?')) {
                  onResetGame();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-300 bg-red-950/40 hover:bg-red-900/60 border border-red-800/50 rounded-lg transition-colors"
              title="Yeni Oyun Başlat"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Yeniden Başlat</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
