import React, { useState } from 'react';
import { CONTRACT_FILES, ContractFile } from '../solana/contractCode';
import { Code2, Copy, Check, FileCode, CheckCircle2 } from 'lucide-react';

export const RustCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<ContractFile>(CONTRACT_FILES[0]);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-amber-400/10 rounded-lg border border-amber-400/20">
            <Code2 className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              Solana Akıllı Sözleşmesi Kaynak Kodu (Rust / BPF)
            </h2>
            <p className="text-xs text-slate-400">
              Mezuniyet projesinde Adım 1, 2, 3 ve 4 ile güncellenen Rust kaynak dosyalarını inceleyin
            </p>
          </div>
        </div>

        {/* Step Badges summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4 pt-4 border-t border-slate-800">
          <button
            onClick={() => setSelectedFile(CONTRACT_FILES.find((f) => f.name === 'state.rs') || CONTRACT_FILES[0])}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedFile.name === 'state.rs'
                ? 'bg-amber-500/10 border-amber-400/60'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adım 1: state.rs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              AccountState yapısına `location: String` eklendi.
            </p>
          </button>

          <button
            onClick={() => setSelectedFile(CONTRACT_FILES.find((f) => f.name === 'instruction.rs') || CONTRACT_FILES[1])}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedFile.name === 'instruction.rs'
                ? 'bg-amber-500/10 border-amber-400/60'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-blue-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adım 2 & 3: instruction.rs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              ReviewInstruction, Payload ve unpack'e `location` entegre edildi.
            </p>
          </button>

          <button
            onClick={() => setSelectedFile(CONTRACT_FILES.find((f) => f.name === 'processor.rs') || CONTRACT_FILES[2])}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedFile.name === 'processor.rs'
                ? 'bg-amber-500/10 border-amber-400/60'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-purple-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Adım 4: processor.rs</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Ekleme ve güncellemede `location` account_data'ya yazıldı.
            </p>
          </button>

          <button
            onClick={() => setSelectedFile(CONTRACT_FILES.find((f) => f.name === 'Cargo.toml') || CONTRACT_FILES[5])}
            className={`p-3 rounded-lg border text-left transition-colors cursor-pointer ${
              selectedFile.name === 'Cargo.toml'
                ? 'bg-amber-500/10 border-amber-400/60'
                : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-400 mb-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Yapılandırma: Cargo.toml</span>
            </div>
            <p className="text-[11px] text-slate-400">
              solana-program & borsh bağımlılıkları tanımlandı.
            </p>
          </button>
        </div>
      </div>

      {/* Main Code Box */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        {/* File Tabs Bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950 border-b border-slate-800 overflow-x-auto">
          <div className="flex items-center gap-1.5">
            {CONTRACT_FILES.map((file) => (
              <button
                key={file.name}
                onClick={() => setSelectedFile(file)}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer whitespace-nowrap ${
                  selectedFile.name === file.name
                    ? 'bg-slate-800 text-amber-400 shadow-sm border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors cursor-pointer shrink-0 ml-4 border border-slate-700/60"
            title="Kodu Panoya Kopyala"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>
        </div>

        {/* File Description Banner */}
        <div className="px-5 py-3 bg-slate-950/60 border-b border-slate-800/80 text-xs text-slate-300 flex items-center justify-between gap-4">
          <div>
            <span className="font-mono text-amber-400 font-semibold">{selectedFile.path}</span>
            <p className="text-slate-400 mt-0.5">{selectedFile.description}</p>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            {selectedFile.stepTags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] text-slate-300 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700/60"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto bg-slate-950 font-mono text-xs leading-relaxed text-slate-200">
          <pre className="selection:bg-amber-400/30">
            {selectedFile.code.split('\n').map((line, index) => {
              const isHighlight = line.includes('🎯') || line.includes('location') || line.includes('ADIM');
              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 py-0.5 px-2 rounded ${
                    isHighlight
                      ? 'bg-amber-500/10 text-amber-300 font-semibold border-l-2 border-amber-400'
                      : 'hover:bg-slate-900/60'
                  }`}
                >
                  <span className="text-slate-600 select-none w-8 text-right shrink-0 tabular-nums">
                    {index + 1}
                  </span>
                  <span className="whitespace-pre">{line}</span>
                </div>
              );
            })}
          </pre>
        </div>
      </div>
    </div>
  );
};
