/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Provider } from 'react-redux';
import { store } from './store';
import { Header } from './components/Header';
import { ScoreBoard } from './components/ScoreBoard';
import { GameBoard } from './components/GameBoard';
import { VictoryModal } from './components/VictoryModal';
import { Footer } from './components/Footer';

function MemoryGameApp() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between">
      <div>
        <Header />

        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 sm:pt-8 pb-4">
          {/* Title and Intro */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white mb-1.5">
              5x5 Kart Eşleştirme Hafıza Oyunu
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-lg mx-auto">
              Kartları çevirin, eşleşen çiftleri bulun. Her doğru eşleşme{' '}
              <strong className="text-emerald-400 font-semibold">+50 puan</strong>, her hatalı deneme{' '}
              <strong className="text-rose-400 font-semibold">-10 puan</strong> kazandırır.
            </p>
          </div>

          {/* User Score HUD */}
          <ScoreBoard />

          {/* 5x5 Matrix Game Grid */}
          <GameBoard />
        </main>
      </div>

      {/* Victory Modal with "Yeniden Oyna" button */}
      <VictoryModal />

      {/* Footer with Enes Öztürk Signature */}
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <MemoryGameApp />
    </Provider>
  );
}
