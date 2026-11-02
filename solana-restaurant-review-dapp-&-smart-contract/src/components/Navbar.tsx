import React, { useState } from 'react';
import { ActiveTab, WalletState } from '../types/review';
import { Wallet, Sparkles, Check, Copy } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  wallet: WalletState;
  onConnectWallet: () => void;
  onAirdrop: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  wallet,
  onConnectWallet,
  onAirdrop,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyPubkey = () => {
    navigator.clipboard.writeText(wallet.publicKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('reviews')}
          className="text-left group cursor-pointer shrink-0"
        >
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold tracking-tight text-white group-hover:text-amber-400 transition-colors whitespace-nowrap">
              Solana Restaurant Review
            </span>
            <span className="text-xs text-amber-400/90 font-mono tracking-wider">
              [Enes Öztürk]
            </span>
          </div>
        </button>

        {/* Zone 2: 4–5 concise single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          <button
            onClick={() => setActiveTab('reviews')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'reviews'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            İncelemeler
          </button>
          
          <button
            onClick={() => setActiveTab('add')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'add'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            + İnceleme Ekle
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'code'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Rust Sözleşmesi
          </button>

          <button
            onClick={() => setActiveTab('borsh')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'borsh'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Borsh & PDA Analizörü
          </button>

          <button
            onClick={() => setActiveTab('readme')}
            className={`whitespace-nowrap transition-colors cursor-pointer py-1 ${
              activeTab === 'readme'
                ? 'text-amber-400 font-semibold border-b-2 border-amber-400'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            README & Rapor
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {wallet.connected ? (
            <div className="flex items-center gap-2">
              <button
                onClick={onAirdrop}
                title="Devnet Musluğundan 1 SOL İste"
                className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 rounded-lg transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>+1 SOL Airdrop</span>
              </button>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-lg text-xs font-mono">
                <span className="text-amber-400 font-semibold tabular-nums">
                  {wallet.balanceSol.toFixed(2)} SOL
                </span>
                <span className="text-slate-600">|</span>
                <button
                  onClick={handleCopyPubkey}
                  className="flex items-center gap-1 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Cüzdan Adresini Kopyala"
                >
                  <span>
                    {wallet.publicKey.slice(0, 4)}...{wallet.publicKey.slice(-4)}
                  </span>
                  {copied ? (
                    <Check className="w-3 h-3 text-emerald-400" />
                  ) : (
                    <Copy className="w-3 h-3 text-slate-400" />
                  )}
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={onConnectWallet}
              className="flex items-center gap-2 px-4 py-2 text-xs font-medium text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer shadow-sm shadow-amber-500/20 whitespace-nowrap"
            >
              <Wallet className="w-3.5 h-3.5" />
              <span>Cüzdanı Bağla</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
