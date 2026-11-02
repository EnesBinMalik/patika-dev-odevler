import React, { useState } from 'react';
import { Copy, Check, FileCode, Split, BookOpen, Download } from 'lucide-react';
import { AssignmentMode } from '../types';
import {
  INITIAL_RUST_CODE,
  STEP1_RUST_CODE,
  OPTIONAL_RUST_CODE,
  CARGO_TOML_CONTENT,
  TYPESCRIPT_TEST_CONTENT,
} from '../data/assignmentData';

interface CodeViewerProps {
  currentMode: AssignmentMode;
  onSelectMode: (mode: AssignmentMode) => void;
}

export const CodeViewer: React.FC<CodeViewerProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [activeFile, setActiveFile] = useState<'lib.rs' | 'Cargo.toml' | 'test.ts' | 'diff'>('lib.rs');
  const [copied, setCopied] = useState(false);

  const getActiveCode = () => {
    if (activeFile === 'Cargo.toml') return CARGO_TOML_CONTENT;
    if (activeFile === 'test.ts') return TYPESCRIPT_TEST_CONTENT;
    if (currentMode === 'step1') return STEP1_RUST_CODE;
    if (currentMode === 'optional') return OPTIONAL_RUST_CODE;
    return INITIAL_RUST_CODE;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(getActiveCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const code = getActiveCode();
    const fileName =
      activeFile === 'Cargo.toml'
        ? 'Cargo.toml'
        : activeFile === 'test.ts'
        ? 'token_transfer.test.ts'
        : 'lib.rs';
    const blob = new Blob([code], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4">
      {/* Top Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-3 sm:px-4 rounded-xl border border-slate-800">
        {/* File Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFile('lib.rs')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeFile === 'lib.rs'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>src/lib.rs</span>
          </button>
          <button
            onClick={() => setActiveFile('diff')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeFile === 'diff'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Split className="w-3.5 h-3.5" />
            <span>Satır Değişimi Diff</span>
          </button>
          <button
            onClick={() => setActiveFile('Cargo.toml')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeFile === 'Cargo.toml'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Cargo.toml</span>
          </button>
          <button
            onClick={() => setActiveFile('test.ts')}
            className={`flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-lg transition-colors whitespace-nowrap ${
              activeFile === 'test.ts'
                ? 'bg-slate-800 text-cyan-400 border border-slate-700 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>tests/token_transfer.ts</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          {activeFile === 'lib.rs' && (
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => onSelectMode('step1')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentMode === 'step1'
                    ? 'bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Adım 1: Sabit
              </button>
              <button
                onClick={() => onSelectMode('optional')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentMode === 'optional'
                    ? 'bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Opsiyonel: Girdi + Enes Öztürk
              </button>
              <button
                onClick={() => onSelectMode('initial')}
                className={`px-2.5 py-1 rounded transition-colors ${
                  currentMode === 'initial'
                    ? 'bg-red-500/20 text-red-300 font-semibold border border-red-500/40'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Önceki (Hatalı)
              </button>
            </div>
          )}

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Kodu Panoya Kopyala"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors whitespace-nowrap"
            title="Dosyayı İndir"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">İndir</span>
          </button>
        </div>
      </div>

      {/* Code Display Area or Diff View */}
      {activeFile === 'diff' ? (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-xl">
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <span>Satır Karşılaştırması (Adım 1 & Opsiyonel Değişikliği)</span>
            <span className="text-[11px] text-slate-500">git diff programs/token_transfer/src/lib.rs</span>
          </div>
          <div className="p-4 space-y-1 overflow-x-auto leading-relaxed">
            <div className="text-slate-500">// Ödevde istenen satır değişikliği analizi:</div>
            <div className="text-slate-500">@@ -11,4 +11,16 @@ pub fn transfer_tokens(ctx: Context&lt;TransferTokens&gt;) -&gt; Result&lt;()&gt; &#123;</div>
            <div className="p-2 bg-red-950/40 border border-red-900/50 rounded text-red-300">
              <span className="text-red-500 mr-2">-</span>
              <strong>let amount = ctx.accounts.source_account.amount;</strong>
              <div className="text-[11px] text-red-400/80 mt-1 pl-4">
                ⚠ HATA: Kaynak hesabın tüm bakiyesini çeker (Örn. 1000 token'ın 1000'i birden aktarılır).
              </div>
            </div>

            <div className="my-2 border-t border-slate-800" />

            <div className="text-cyan-400 font-semibold mb-1">
              [ADIM 1 ÇÖZÜMÜ] - Sabit Kodlanmış Miktar:
            </div>
            <div className="p-2 bg-cyan-950/40 border border-cyan-900/50 rounded text-cyan-200">
              <span className="text-cyan-500 mr-2">+</span>
              <strong>let amount: u64 = 50;</strong>
              <div className="text-[11px] text-cyan-300/80 mt-1 pl-4">
                ✓ Doğru: Sabit kodlanmış 50 birimlik token transferi yapılır.
              </div>
            </div>

            <div className="my-2 border-t border-slate-800" />

            <div className="text-indigo-400 font-semibold mb-1">
              [OPSİYONEL ÇÖZÜM] - Kullanıcı Girdisi + Enes Öztürk İmzası:
            </div>
            <div className="p-2 bg-indigo-950/40 border border-indigo-900/50 rounded text-indigo-200 space-y-1">
              <div>
                <span className="text-indigo-400 mr-2">+</span>
                <strong>pub fn transfer_tokens(ctx: Context&lt;TransferTokens&gt;, amount: u64) -&gt; Result&lt;()&gt; &#123;</strong>
              </div>
              <div className="pl-4 text-emerald-300">
                + require!(amount &gt; 0, TransferError::InvalidAmount);
              </div>
              <div className="pl-4 text-emerald-300">
                + require!(ctx.accounts.source_account.amount &gt;= amount, TransferError::InsufficientFunds);
              </div>
              <div className="pl-4 text-purple-300">
                + msg!("Yetkili İmza Doğrulandı: Enes Öztürk ({})", ctx.accounts.authority.key());
              </div>
              <div className="text-[11px] text-indigo-300/80 mt-1 pl-4">
                ✓ Enes Öztürk imzalı: Kullanıcı dinamik transfer miktarını girer, yetkili imza kriptografik olarak doğrulanır.
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-xl">
          {/* Editor Header */}
          <div className="bg-slate-900/90 px-4 py-2 border-b border-slate-800 flex items-center justify-between text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/70" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/70" />
              <span className="text-xs font-mono text-slate-300 ml-2">
                {activeFile === 'Cargo.toml'
                  ? 'Cargo.toml'
                  : activeFile === 'test.ts'
                  ? 'tests/token_transfer.ts'
                  : `programs/token_transfer/src/lib.rs (${currentMode === 'step1' ? 'Adım 1' : currentMode === 'optional' ? 'Opsiyonel (Enes Öztürk)' : 'Önceki'})`}
              </span>
            </div>
            <span className="text-[11px] text-slate-500">Rust 2021 / Anchor 0.29.0</span>
          </div>

          {/* Code Body with Line Numbers */}
          <div className="p-4 overflow-x-auto max-h-[600px] overflow-y-auto leading-relaxed">
            <pre className="text-slate-300 font-mono text-xs">
              {getActiveCode().split('\n').map((line, idx) => {
                const lineNum = idx + 1;
                const isHighlight =
                  line.includes('let amount = ctx.accounts.source_account.amount') ||
                  line.includes('let amount: u64 = 50') ||
                  line.includes('pub fn transfer_tokens(ctx: Context<TransferTokens>, amount: u64)') ||
                  line.includes('Enes Öztürk');

                return (
                  <div
                    key={idx}
                    className={`flex items-start ${
                      isHighlight
                        ? currentMode === 'initial'
                          ? 'bg-red-950/40 text-red-300 font-bold -mx-4 px-4 py-0.5'
                          : currentMode === 'step1'
                          ? 'bg-cyan-950/40 text-cyan-200 font-bold -mx-4 px-4 py-0.5'
                          : 'bg-indigo-950/40 text-indigo-200 font-bold -mx-4 px-4 py-0.5'
                        : 'hover:bg-slate-900/40'
                    }`}
                  >
                    <span className="select-none text-slate-600 text-right w-8 pr-4 shrink-0 text-[11px]">
                      {lineNum}
                    </span>
                    <span className="flex-1 whitespace-pre">{line || ' '}</span>
                  </div>
                );
              })}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
