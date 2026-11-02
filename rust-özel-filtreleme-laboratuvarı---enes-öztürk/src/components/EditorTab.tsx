import React, { useState } from 'react';
import { Copy, Check, Download, RotateCcw, Play, CheckCircle, AlertCircle, FileCode, Layers, ShieldCheck, HelpCircle } from 'lucide-react';
import { PRESET_OPTIONS, CARGO_TOML_CONTENT, README_CONTENT } from '../data/rustSamples';
import { RunResult } from '../services/rustRunner';

interface EditorTabProps {
  code: string;
  setCode: (newCode: string) => void;
  onRun: () => void;
  isRunning: boolean;
  runResult: RunResult | null;
  onSelectPreset: (presetId: string) => void;
  selectedPresetId: string;
  onReset: () => void;
}

export const EditorTab: React.FC<EditorTabProps> = ({
  code,
  setCode,
  onRun,
  isRunning,
  runResult,
  onSelectPreset,
  selectedPresetId,
  onReset,
}) => {
  const [activeFile, setActiveFile] = useState<'main.rs' | 'Cargo.toml' | 'README.md'>('main.rs');
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const textToCopy =
      activeFile === 'main.rs'
        ? code
        : activeFile === 'Cargo.toml'
        ? CARGO_TOML_CONTENT
        : README_CONTENT;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const textToDownload =
      activeFile === 'main.rs'
        ? code
        : activeFile === 'Cargo.toml'
        ? CARGO_TOML_CONTENT
        : README_CONTENT;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  const displayedContent =
    activeFile === 'main.rs'
      ? code
      : activeFile === 'Cargo.toml'
      ? CARGO_TOML_CONTENT
      : README_CONTENT;

  const lines = displayedContent.split('\n');

  return (
    <div className="space-y-4">
      {/* Preset Selector Banner */}
      <div className="bg-[#131620] border border-zinc-800 rounded-xl p-3 sm:p-4 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-orange-500/10 text-orange-400 border border-orange-500/20">
            <Layers className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              Örnek Kod Varyasyonları
              <span className="text-[11px] font-normal text-zinc-400">
                (Kapanışsız Rust Çözümleri)
              </span>
            </h3>
            <p className="text-xs text-zinc-400">
              Ödevin i32, String ve Generic Rust versiyonları arasında geçiş yapabilirsiniz.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {PRESET_OPTIONS.map((preset) => (
            <button
              key={preset.id}
              onClick={() => {
                setActiveFile('main.rs');
                onSelectPreset(preset.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedPresetId === preset.id && activeFile === 'main.rs'
                  ? 'bg-orange-500/20 text-orange-300 border border-orange-500/50 shadow-sm'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-zinc-700/60'
              }`}
            >
              {preset.title.split(':')[0]}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Code Editor on Left, Terminal / Cargo Output on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Code Editor Panel */}
        <div className="lg:col-span-7 bg-[#11141d] border border-zinc-800 rounded-xl overflow-hidden shadow-xl flex flex-col min-h-[620px]">
          {/* File Tab Bar */}
          <div className="bg-[#0b0d13] border-b border-zinc-800 px-3 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-1">
              <button
                onClick={() => setActiveFile('main.rs')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  activeFile === 'main.rs'
                    ? 'bg-[#181c28] text-orange-400 border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-orange-500" />
                <span>src/main.rs</span>
              </button>

              <button
                onClick={() => setActiveFile('Cargo.toml')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  activeFile === 'Cargo.toml'
                    ? 'bg-[#181c28] text-amber-400 border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-amber-500 font-bold">📦</span>
                <span>Cargo.toml</span>
              </button>

              <button
                onClick={() => setActiveFile('README.md')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                  activeFile === 'README.md'
                    ? 'bg-[#181c28] text-blue-400 border border-zinc-700/80'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                <span className="text-blue-400 font-bold">📖</span>
                <span>README.md</span>
              </button>
            </div>

            {/* Editor Actions */}
            <div className="flex items-center gap-1">
              <button
                onClick={handleCopy}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                title="Kodu Kopyala"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
              <button
                onClick={handleDownload}
                className="p-1.5 text-zinc-400 hover:text-white rounded hover:bg-zinc-800 transition-colors"
                title="Dosyayı İndir"
              >
                <Download className="w-4 h-4" />
              </button>
              {activeFile === 'main.rs' && (
                <button
                  onClick={onReset}
                  className="p-1.5 text-zinc-400 hover:text-amber-400 rounded hover:bg-zinc-800 transition-colors"
                  title="Varsayılan Koda Sıfırla"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Code Textarea / Display */}
          <div className="relative flex-1 bg-[#0e111a] p-4 font-mono text-xs sm:text-[13px] leading-relaxed overflow-auto flex">
            {/* Line numbers */}
            <div className="select-none text-zinc-600 pr-4 text-right border-r border-zinc-800/80">
              {lines.map((_, idx) => (
                <div key={idx} className="leading-6">
                  {idx + 1}
                </div>
              ))}
            </div>

            {/* Code editor / viewer */}
            {activeFile === 'main.rs' ? (
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                spellCheck={false}
                className="w-full h-full bg-transparent text-zinc-200 pl-4 resize-none outline-none leading-6 font-mono selection:bg-orange-600/30"
              />
            ) : (
              <pre className="w-full pl-4 text-zinc-300 leading-6 font-mono whitespace-pre overflow-x-auto">
                {displayedContent}
              </pre>
            )}
          </div>

          {/* Footer note inside editor */}
          <div className="bg-[#0b0d13] border-t border-zinc-800 px-4 py-2 flex items-center justify-between text-[11px] text-zinc-500 font-mono">
            <span>UTF-8 • Rust 2021 Edition</span>
            <span className="text-amber-400/80 font-sans">
              İmza: Enes Öztürk
            </span>
          </div>
        </div>

        {/* Cargo Execution & Output Panel */}
        <div className="lg:col-span-5 flex flex-col space-y-4">
          {/* Action Trigger Card */}
          <div className="bg-[#11141d] border border-zinc-800 rounded-xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-orange-500"></span>
                </span>
                <h4 className="text-sm font-semibold text-white">Cargo Yürütme Konsolu</h4>
              </div>

              <div className="text-[11px] text-zinc-400 bg-zinc-800/60 px-2 py-0.5 rounded border border-zinc-700/50">
                my_project/src/main.rs
              </div>
            </div>

            <p className="text-xs text-zinc-400 mb-4">
              Kodu derlemek ve konsol çıktısını görmek için aşağıdaki butona basın.
            </p>

            <button
              onClick={onRun}
              disabled={isRunning}
              className={`w-full py-2.5 px-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md ${
                isRunning
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-600 hover:to-amber-600 text-white shadow-orange-500/20 active:scale-[0.99]'
              }`}
            >
              {isRunning ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Program Derleniyor ve Çalıştırılıyor...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-current" />
                  <span>cargo run (Programı Çalıştır)</span>
                </>
              )}
            </button>
          </div>

          {/* Terminal Output */}
          <div className="bg-[#0b0d13] border border-zinc-800 rounded-xl p-4 flex-1 flex flex-col font-mono text-xs shadow-inner min-h-[350px]">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-800/80 mb-3 text-zinc-400">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="text-[11px] text-zinc-500 ml-1">Terminal Çıktısı</span>
              </div>
              {runResult && (
                <div className="flex items-center gap-2 text-[11px]">
                  {runResult.success ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-3.5 h-3.5" /> Başarılı ({runResult.executionTimeMs}ms)
                    </span>
                  ) : (
                    <span className="text-red-400 flex items-center gap-1">
                      <AlertCircle className="w-3.5 h-3.5" /> Derleme Hatası
                    </span>
                  )}
                </div>
              )}
            </div>

            <div className="flex-1 overflow-auto whitespace-pre leading-relaxed select-text">
              {isRunning ? (
                <div className="text-zinc-500 animate-pulse flex items-center gap-2">
                  <span>$ cargo run</span>
                  <span className="inline-block w-2 h-4 bg-orange-400 animate-bounce"></span>
                </div>
              ) : runResult ? (
                <div>
                  {runResult.stderr && (
                    <div className="text-amber-400/90 mb-2 font-mono">
                      {runResult.stderr}
                    </div>
                  )}
                  {runResult.stdout ? (
                    <div className="text-zinc-200 font-mono">
                      {runResult.stdout}
                    </div>
                  ) : (
                    !runResult.stderr && (
                      <span className="text-zinc-500 italic">Çıktı üretilmedi.</span>
                    )
                  )}
                </div>
              ) : (
                <div className="text-zinc-600 flex flex-col items-center justify-center h-full text-center py-8">
                  <Play className="w-8 h-8 text-zinc-700 mb-2" />
                  <p className="text-zinc-400 font-sans font-medium">Henüz bir çalıştırma yapılmadı.</p>
                  <p className="text-zinc-600 text-[11px] font-sans mt-1">
                    Yukarıdaki "cargo run" butonuna basarak programı test edebilirsiniz.
                  </p>
                </div>
              )}
            </div>

            {/* Developer Signature footer on terminal */}
            <div className="mt-3 pt-2 border-t border-zinc-800/80 flex items-center justify-between text-[11px] text-zinc-500 font-sans">
              <span className="flex items-center gap-1.5 text-amber-400/90 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Hazırlayan: Enes Öztürk
              </span>
              <span>my_project v0.1.0</span>
            </div>
          </div>

          {/* Quick Explanation Highlight */}
          <div className="bg-[#121623] border border-blue-500/20 rounded-xl p-3.5 text-xs text-zinc-300">
            <div className="flex items-center gap-2 text-blue-400 font-semibold mb-1">
              <HelpCircle className="w-4 h-4" />
              <span>Neden Kapanışsız (Without Closures)?</span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed">
              Ödevin temel amacı, yeni başlayan öğrencilerin <code className="text-orange-300 font-mono">|x| x == target</code> gibi karmaşık kapanışlar yerine, doğrudan <code className="text-orange-300 font-mono">struct</code> ve <code className="text-orange-300 font-mono">is_match</code> metodunu yazarak Rust'ın referans (<code className="text-orange-300 font-mono">&</code>) ve metot çağrı sistemini somut olarak kavramasıdır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
