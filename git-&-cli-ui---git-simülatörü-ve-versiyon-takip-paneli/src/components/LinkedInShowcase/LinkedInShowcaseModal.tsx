import React, { useState } from 'react';
import { X, Copy, Check, Share2, Linkedin, Github, Award, Sparkles, Terminal, GitBranch, Layers } from 'lucide-react';

interface LinkedInShowcaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadPreset: (preset: 'starter' | 'branching' | 'conflict') => void;
}

export const LinkedInShowcaseModal: React.FC<LinkedInShowcaseModalProps> = ({
  isOpen,
  onClose,
  onLoadPreset,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const linkedInPostText = `🚀 Yeni Projem: Modüler Git Komut Simülatörü ve Versiyon Takip Paneli (GIT & CLI UI)

Versiyon kontrol sistemlerinin çalışma mantığını ön yüzde görselleştiren, Git komut simülasyon aracı.

Geliştiricilerin sıklıkla kullandığı temel Git komutlarını (commit, push, pull, branch, merge, stash, reset) interaktif bir web arayüzünde simüle eden bu projede neler var?

✨ Temel Özellikler:
1. 🌳 İnteraktif Git Versiyon Ağacı (DAG): Commit zincirlerini, dallanmaları (branching), Fast-Forward ve 3-Way merge operasyonlarını dinamik SVG grafiğiyle canlı olarak görselleştirir.
2. 💻 Gerçekçi Mini Terminal (CLI): Komut geçmişi (Yukarı/Aşağı ok tuşları), sekme ile otomatik tamamlama (Tab autocompletion) ve renkli Git çıktıları.
3. 🛠️ VS Code Stili Kaynak Kontrolü: Çalışma alanı (Working Tree) -> Hazırlık (Staging Area) -> Yerel Depo -> Uzak Depo (Remote Origin) akışı.
4. ⚡ Merge Çakışması & Çözücü: Farklı dallardaki çakışmaları simüle eden ve görsel olarak çözmenizi sağlayan 3-way resolver.
5. 🎯 Adım Adım İnteraktif Senaryolar: Git öğrenenler için uygulamalı interaktif görevler.

👨‍💻 Geliştirici: Enes Öztürk
🛠️ Teknolojiler: React, TypeScript, Tailwind CSS, SVG DAG Rendering, Canvas Confetti

#Git #VersionControl #Frontend #SoftwareEngineering #JavaScript #React #WebDevelopment #DeveloperTools #EnesOzturk`;

  const handleCopy = () => {
    navigator.clipboard.writeText(linkedInPostText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-2xl w-full p-6 space-y-5 shadow-2xl overflow-y-auto max-h-[90vh] custom-scrollbar">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-indigo-500/20 to-emerald-500/20 border border-indigo-500/30 text-indigo-400">
              <Linkedin className="w-5 h-5 text-sky-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                <span>LinkedIn Sunum & Paylaşım Paneli</span>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-normal">
                  Enes Öztürk İmzalı
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Projeyi portfolyonuzda veya LinkedIn gönderinizde öne çıkaracak hazır içerik ve vitrin senaryoları.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pitch Quote */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-3 opacity-10">
            <GitBranch className="w-16 h-16 text-emerald-400" />
          </div>
          <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-400 font-semibold block mb-1">
            Resmi Sunum Mottosu
          </span>
          <blockquote className="text-sm font-medium text-slate-100 italic leading-relaxed">
            “Versiyon kontrol sistemlerinin çalışma mantığını ön yüzde görselleştiren, Git komut simülasyon aracı.”
          </blockquote>
          <div className="mt-2 text-xs text-slate-400 font-mono">
            — Enes Öztürk (Frontend & Software Engineer)
          </div>
        </div>

        {/* LinkedIn Post Copy Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-semibold flex items-center gap-1.5">
              <Share2 className="w-3.5 h-3.5 text-sky-400" />
              LinkedIn Gönderi Taslağı (Kopyalanmaya Hazır)
            </span>
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-medium text-xs transition-colors shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Metni Kopyala</span>
                </>
              )}
            </button>
          </div>

          <pre className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto custom-scrollbar">
            {linkedInPostText}
          </pre>
        </div>

        {/* Quick Demo Presets for Video Recording */}
        <div className="space-y-2 pt-2 border-t border-slate-800">
          <h4 className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Sunum / Ekran Kaydı İçin Hızlı Durumlar (Presets):
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              onClick={() => {
                onLoadPreset('starter');
                onClose();
              }}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-850 text-left transition-colors"
            >
              <div className="text-xs font-semibold text-emerald-400">Temiz Başlangıç</div>
              <div className="text-[11px] text-slate-400 mt-1">2 temel commit, main dalı aktif.</div>
            </button>

            <button
              onClick={() => {
                onLoadPreset('branching');
                onClose();
              }}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-500/50 hover:bg-slate-850 text-left transition-colors"
            >
              <div className="text-xs font-semibold text-cyan-400">Çoklu Dal (Branching)</div>
              <div className="text-[11px] text-slate-400 mt-1">feature/auth ve main dalları açık.</div>
            </button>

            <button
              onClick={() => {
                onLoadPreset('conflict');
                onClose();
              }}
              className="p-3 rounded-lg bg-slate-950 border border-slate-800 hover:border-rose-500/50 hover:bg-slate-850 text-left transition-colors"
            >
              <div className="text-xs font-semibold text-rose-400">Çakışma (Conflict)</div>
              <div className="text-[11px] text-slate-400 mt-1">Merge çakışmasını göstermek için hazır.</div>
            </button>
          </div>
        </div>

        {/* Footer info */}
        <div className="pt-2 text-[11px] text-slate-500 text-center flex items-center justify-center gap-4">
          <span>Tasarım ve Geliştirme: Enes Öztürk</span>
          <span>·</span>
          <span>Portfolyo & LinkedIn Sunumuna Özel</span>
        </div>
      </div>
    </div>
  );
};
