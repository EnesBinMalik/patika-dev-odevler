/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  RotateCw,
  Award,
  BookOpen,
  Sparkles,
  Handshake,
  RotateCcw,
  Volume2,
  VolumeX,
  Crown,
} from 'lucide-react';
import { useAppDispatch, useAppSelector } from './store';
import {
  toggleBoardOrientation,
  toggleMoveAssistance,
  toggleSound,
  openRulesModal,
  agreeDraw,
  undoMove,
} from './store/damaSlice';
import { Header } from './components/Header';
import { Board } from './components/Board';
import { PlayerPanel } from './components/PlayerPanel';
import { MoveHistory } from './components/MoveHistory';
import { RulesModal } from './components/RulesModal';
import { GameOverModal } from './components/GameOverModal';

export default function App() {
  const dispatch = useAppDispatch();
  const {
    boardOrientation,
    turn,
    allLegalMoves,
    soundEnabled,
    moveAssistance,
    snapshots,
    status,
  } = useAppSelector((state) => state.dama);

  // Top and bottom player configurations based on orientation
  const topPlayer = boardOrientation === 'white' ? 'black' : 'white';
  const bottomPlayer = boardOrientation === 'white' ? 'white' : 'black';

  const hasMandatoryCapture =
    status === 'playing' && allLegalMoves.length > 0 && allLegalMoves[0].isCapture;

  const handleAgreeDraw = () => {
    if (window.confirm('Karşılıklı beraberlik ilan etmek istiyor musunuz?')) {
      dispatch(agreeDraw());
    }
  };

  return (
    <div className="min-h-screen bg-[#140c07] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,60,20,0.25),rgba(20,12,7,1))] text-[#f4ecd8] flex flex-col font-sans-ui selection:bg-[#c2843a] selection:text-white pb-12">
      {/* Top Bar Navigation */}
      <Header />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col">
        {/* Sub-header artisan banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 pb-3 border-b border-[#2b190f]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[#92400e] to-[#f59e0b] p-0.5 flex items-center justify-center shadow">
              <Award className="w-4 h-4 text-[#140c07]" />
            </div>
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#fde047] flex items-center gap-2">
                <span>Enes Öztürk İmzalı Özel Üretim</span>
                <span className="text-[10px] text-[#caa777] bg-[#29170e] px-2 py-0.5 rounded border border-[#3d2417]">
                  2 Kişilik Yerel Oyun
                </span>
              </div>
              <p className="text-[11px] text-[#8c7457]">
                Aynı cihaz üzerinde karşılıklı el emeği Türk Daması deneyimi
              </p>
            </div>
          </div>

          {/* Quick Notice Pill-free text */}
          <div className="flex items-center gap-3 text-xs text-[#caa777]">
            <span className="flex items-center gap-1.5 font-medium">
              <span
                className={`w-2 h-2 rounded-full ${
                  turn === 'white' ? 'bg-[#fef08a]' : 'bg-[#78350f] ring-1 ring-[#caa777]'
                }`}
              />
              Sıradaki Hamle: <strong className="text-[#fde047]">{turn === 'white' ? 'Beyaz' : 'Siyah'}</strong>
            </span>
            {hasMandatoryCapture && (
              <>
                <span aria-hidden="true" className="text-[#573d2f]">·</span>
                <span className="text-[#ef4444] font-bold animate-pulse">
                  Çok Taş Yeme Zorunlu!
                </span>
              </>
            )}
          </div>
        </div>

        {/* Center Game Arena Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left/Main Column: Board & Player Panels */}
          <div className="lg:col-span-8 flex flex-col items-center">
            {/* Top Player Panel */}
            <div className="w-full max-w-[min(88vw,480px)] sm:max-w-[500px] lg:max-w-[540px] mb-3">
              <PlayerPanel
                playerColor={topPlayer}
                playerName={topPlayer === 'white' ? 'Beyaz Oyuncu' : 'Siyah Oyuncu'}
              />
            </div>

            {/* The 8x8 Wooden Board */}
            <div className="my-1 flex items-center justify-center">
              <Board />
            </div>

            {/* Bottom Player Panel */}
            <div className="w-full max-w-[min(88vw,480px)] sm:max-w-[500px] lg:max-w-[540px] mt-3">
              <PlayerPanel
                playerColor={bottomPlayer}
                playerName={bottomPlayer === 'white' ? 'Beyaz Oyuncu' : 'Siyah Oyuncu'}
              />
            </div>
          </div>

          {/* Right Column: Move History, Controls & Artisan Craft Information */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            {/* Quick Actions Card */}
            <div className="bg-[#1c120a] border border-[#3d2417] rounded-xl p-4 shadow-lg">
              <h4 className="text-xs font-semibold text-[#caa777] uppercase tracking-wider mb-3">
                Masa Kontrolleri
              </h4>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => dispatch(toggleBoardOrientation())}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#27170e] hover:bg-[#381f13] text-[#caa777] hover:text-[#fde047] text-xs font-medium border border-[#4a2e1d] transition-all active:scale-95"
                >
                  <RotateCw className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Tahtayı Çevir</span>
                </button>

                <button
                  onClick={() => dispatch(undoMove())}
                  disabled={snapshots.length === 0 || status !== 'playing'}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#27170e] hover:bg-[#381f13] text-[#caa777] hover:text-[#fde047] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium border border-[#4a2e1d] transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Geri Al</span>
                </button>

                <button
                  onClick={() => dispatch(toggleMoveAssistance())}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium border transition-all active:scale-95 ${
                    moveAssistance
                      ? 'bg-[#d97706]/15 border-[#d97706] text-[#facc15]'
                      : 'bg-[#27170e] hover:bg-[#381f13] border-[#4a2e1d] text-[#caa777]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{moveAssistance ? 'Kılavuz Açık' : 'Kılavuz Kapalı'}</span>
                </button>

                <button
                  onClick={handleAgreeDraw}
                  disabled={status !== 'playing'}
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg bg-[#27170e] hover:bg-[#381f13] text-[#caa777] hover:text-[#fde047] disabled:opacity-40 disabled:cursor-not-allowed text-xs font-medium border border-[#4a2e1d] transition-all active:scale-95"
                >
                  <Handshake className="w-3.5 h-3.5 text-[#d97706]" />
                  <span>Beraberlik</span>
                </button>
              </div>
            </div>

            {/* Move History Ledger */}
            <MoveHistory />

            {/* Artisan Seal & Craft Story Card */}
            <div className="bg-[#180f08] border border-[#382013] rounded-xl p-4 shadow">
              <div className="flex items-center gap-2 mb-2">
                <Crown className="w-4 h-4 text-[#eab308]" />
                <h4 className="font-cinzel text-xs font-bold text-[#fde047] tracking-wider uppercase">
                  Otantik Zanaat Tasarımı
                </h4>
              </div>
              <p className="text-xs text-[#a88d6c] leading-relaxed">
                Bu oyun, kadim Türk Daması geleneğini ceviz ve şimşir ağacı dokusuyla harmanlayarak
                <strong> Enes Öztürk</strong> imzası ve el emeğiyle iki kişinin aynı ekranda
                kesintisiz yarışabilmesi için tasarlandı.
              </p>

              <div className="mt-3 pt-3 border-t border-[#2b190f] flex items-center justify-between text-[11px] text-[#785d43]">
                <button
                  onClick={() => dispatch(openRulesModal())}
                  className="flex items-center gap-1 text-[#caa777] hover:text-[#fde047] transition-colors"
                >
                  <BookOpen className="w-3 h-3" />
                  <span>Kuralları Görüntüle</span>
                </button>
                <button
                  onClick={() => dispatch(toggleSound())}
                  className="flex items-center gap-1 text-[#caa777] hover:text-[#fde047] transition-colors"
                >
                  {soundEnabled ? (
                    <>
                      <Volume2 className="w-3 h-3 text-[#22c55e]" />
                      <span>Sesler Etkin</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3 h-3 text-[#ef4444]" />
                      <span>Sessiz Mod</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Rules Modal */}
      <RulesModal />

      {/* Game Over Celebration Modal */}
      <GameOverModal />
    </div>
  );
}
