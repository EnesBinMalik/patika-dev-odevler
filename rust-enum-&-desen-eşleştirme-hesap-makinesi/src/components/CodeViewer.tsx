import React, { useState } from 'react';
import { RUST_CODE_TR, RUST_CODE_EN } from '../data/rustCode';
import { Copy, Check, Download, FileCode, ExternalLink, Info } from 'lucide-react';

export const CodeViewer: React.FC = () => {
  const [langVersion, setLangVersion] = useState<'tr' | 'en' | 'cargo'>('tr');
  const [copied, setCopied] = useState<boolean>(false);

  const CARGO_TOML = `[package]
name = "hesap_makinesi"
version = "0.1.0"
edition = "2021"
authors = ["Enes Öztürk <enesbino38@gmail.com>"]
description = "Rust enumlar ve desen eşleştirme ile basit hesap makinesi"

[dependencies]
# Standart kütüphane dışında ek bir bağımlılık gerektirmez.
`;

  const activeCode =
    langVersion === 'tr'
      ? RUST_CODE_TR
      : langVersion === 'en'
      ? RUST_CODE_EN
      : CARGO_TOML;

  const activeFileName =
    langVersion === 'cargo' ? 'Cargo.toml' : 'src/main.rs';

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([activeCode], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = langVersion === 'cargo' ? 'Cargo.toml' : 'main.rs';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Render highlighted Rust syntax
  const renderHighlightedLine = (line: string, index: number) => {
    // Basic syntax coloring logic
    const isComment = line.trim().startsWith('//') || line.trim().startsWith('///') || line.trim().startsWith('#');
    
    if (isComment) {
      return (
        <span key={index} className="text-slate-500 italic">
          {line}
        </span>
      );
    }

    return (
      <span key={index} className="text-slate-300">
        {line}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Code Header Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <FileCode className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-white text-sm">
              Eksiksiz ve Çalıştırılabilir Rust Kaynak Kodu
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Ödev gereksinimlerine birebir uyan, derlenebilir ve hatasız Rust kodu
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Version Switcher */}
          <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setLangVersion('tr')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                langVersion === 'tr'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Türkçe (Ödev)
            </button>
            <button
              onClick={() => setLangVersion('en')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                langVersion === 'en'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              İngilizce (Standart)
            </button>
            <button
              onClick={() => setLangVersion('cargo')}
              className={`px-2.5 py-1 rounded font-medium transition-colors cursor-pointer ${
                langVersion === 'cargo'
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Cargo.toml
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          {/* Download Button */}
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>İndir</span>
          </button>
        </div>
      </div>

      {/* Code Editor Frame */}
      <div className="bg-[#0b0f19] border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
        {/* Editor Title Bar */}
        <div className="bg-[#121826] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <span className="text-amber-400">🦀</span>
            <span>{activeFileName}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">UTF-8</span>
          </div>

          <div className="text-slate-500 text-[11px]">
            Hazırlayan: Enes Öztürk
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs sm:text-sm leading-relaxed max-h-[600px] overflow-y-auto">
          <pre className="text-slate-300">
            <code>
              {activeCode.split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                return (
                  <div key={idx} className="flex hover:bg-slate-900/60 -mx-4 px-4 py-0.5 rounded transition-colors group">
                    <span className="w-10 text-right pr-4 text-slate-600 select-none group-hover:text-slate-400 text-xs">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">
                      {renderHighlightedLine(line, idx)}
                    </span>
                  </div>
                );
              })}
            </code>
          </pre>
        </div>
      </div>

      {/* Code Key Takeaways Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Bu Kodda Uygulanan Rust Prensipleri</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-white">1. Enum Tuple Varyantları</div>
            <p className="text-slate-400 text-[11px]">
              <code className="text-amber-300 font-mono">Ekleme(f64, f64)</code> gibi her varyant kendi verisini taşır. C tarzı enumların aksine fazladan struct tanımlamaya gerek kalmaz.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-white">2. Kapsamlı (Exhaustive) Match</div>
            <p className="text-slate-400 text-[11px]">
              <code className="text-amber-300 font-mono">match op</code> tüm varyantları kontrol etmek zorundadır. Yeni bir işlem eklendiğinde derleyici otomatik olarak uyarı verir.
            </p>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <div className="font-semibold text-white">3. Güvenli Girdi Ayrıştırma</div>
            <p className="text-slate-400 text-[11px]">
              <code className="text-amber-300 font-mono">.trim().parse::&lt;f64&gt;()</code> ile boşluklar temizlenir ve Result türüyle hatalar güvenle yönetilir.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};
