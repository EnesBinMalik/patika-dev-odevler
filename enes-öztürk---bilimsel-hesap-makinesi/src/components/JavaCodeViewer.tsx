import React, { useState } from 'react';
import { JAVA_FILES, JavaFile } from '../math/javaSourceCode';
import { Copy, Check, Download, FileCode, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

export const JavaCodeViewer: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<JavaFile>(JAVA_FILES[JAVA_FILES.length - 1]);
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (file: JavaFile) => {
    const blob = new Blob([file.code], { type: 'text/x-java-source;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = file.filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Signature Proof */}
      <div className="p-4 rounded bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase flex items-center gap-2">
            <Award className="w-4 h-4 text-cyan-400" />
            <span>ENES ÖZTÜRK İMZALI JAVA NESNE YÖNELİMLİ (OOP) KAYNAK KODLARI</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Proje modüler sınıflar ve metotlar halinde tasarlanmış olup, hiçbir standart <code>Math</code> hazır sınıfı kullanılmamıştır.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => handleDownload(selectedFile)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-cyan-400" />
            <span>{selectedFile.filename} İndir</span>
          </button>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Kopyalandı!' : 'Kodu Kopyala'}</span>
          </button>
        </div>
      </div>

      {/* Badges of Compliance */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-white">Sıfır Hazır Sınıf Kuralı</div>
            <div className="text-slate-400 mt-0.5 text-[11px]">
              <code>Math.sqrt</code>, <code>Math.pow</code>, <code>Math.abs</code> ve benzeri hiçbir hazır sınıf çağrılmamıştır.
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-start gap-3">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-white">Modüler OOP Mimarisi</div>
            <div className="text-slate-400 mt-0.5 text-[11px]">
              Temel, İleri, Polinom ve HesapMakinesi şeklinde ayrık sınıflar ve metotlar halinde yapılandırılmıştır.
            </div>
          </div>
        </div>

        <div className="p-3 bg-slate-900 border border-slate-800 rounded flex items-start gap-3">
          <Award className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          <div className="text-xs">
            <div className="font-semibold text-white">İmzalı & Belgelendirilmiş</div>
            <div className="text-slate-400 mt-0.5 text-[11px]">
              Her sınıf ve metot <strong>Enes Öztürk</strong> imzası ve detaylı Javadoc açıklamalarıyla donatılmıştır.
            </div>
          </div>
        </div>
      </div>

      {/* File Selector Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800 scrollbar-none">
        {JAVA_FILES.map((f) => (
          <button
            key={f.filename}
            onClick={() => setSelectedFile(f)}
            className={`flex items-center gap-2 px-3 py-2 text-xs font-mono font-medium rounded-t border-t border-x transition-colors whitespace-nowrap ${
              selectedFile.filename === f.filename
                ? 'bg-slate-900 border-slate-700 text-cyan-300'
                : 'bg-slate-950/40 border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
            }`}
          >
            <FileCode className="w-3.5 h-3.5 text-cyan-400" />
            <span>{f.filename}</span>
          </button>
        ))}
      </div>

      {/* Code Container */}
      <div className="bg-slate-900 border border-slate-800 rounded overflow-hidden shadow-2xl">
        {/* Code Header Bar */}
        <div className="px-4 py-2.5 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-bold text-cyan-400">{selectedFile.filename}</span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-400 text-[11px]">{selectedFile.description}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500 font-mono">Java SE 8+ Uyumlu</span>
            <button
              onClick={handleCopy}
              className="p-1 hover:bg-slate-800 text-slate-400 hover:text-white rounded transition-colors"
              title="Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 bg-slate-950/80 font-mono text-xs overflow-x-auto max-h-[580px] leading-relaxed select-text">
          <pre className="text-slate-300">
            {selectedFile.code.split('\n').map((line, idx) => (
              <div key={idx} className="table-row hover:bg-slate-850/50">
                <span className="table-cell pr-4 text-slate-600 text-right select-none w-10 tabular-nums">
                  {idx + 1}
                </span>
                <span className="table-cell whitespace-pre">
                  {highlightJava(line)}
                </span>
              </div>
            ))}
          </pre>
        </div>

        {/* Compile instructions */}
        <div className="px-4 py-3 bg-slate-950 border-t border-slate-800 text-xs font-mono text-slate-400 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <span className="text-cyan-400 font-semibold">Terminalden Derleme: </span>
            <code className="text-slate-200 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
              javac {selectedFile.filename} && java {selectedFile.filename.replace('.java', '')}
            </code>
          </div>
          <span className="text-[11px] text-slate-500">İmza: Enes Öztürk</span>
        </div>
      </div>
    </div>
  );
};

// Basit sentaks renklendirme yardımcısı
function highlightJava(line: string): React.ReactNode {
  if (line.trim().startsWith('//') || line.trim().startsWith('/*') || line.trim().startsWith('*')) {
    return <span className="text-slate-500 italic">{line}</span>;
  }
  if (line.includes('ENES ÖZTÜRK') || line.includes('@author Enes Öztürk')) {
    return <span className="text-cyan-400 font-bold bg-cyan-950/30 px-1 rounded">{line}</span>;
  }

  // Anahtar kelimeler
  const keywords = ['public', 'private', 'class', 'static', 'final', 'double', 'long', 'int', 'void', 'return', 'if', 'else', 'while', 'for', 'throw', 'new', 'switch', 'case', 'break', 'default', 'import'];
  const parts = line.split(/(\s+|[(){}[\];,=+\-*/<>!&|":])/);

  return (
    <>
      {parts.map((p, i) => {
        if (keywords.includes(p)) {
          return <span key={i} className="text-purple-400 font-semibold">{p}</span>;
        }
        if (p.startsWith('"') && p.endsWith('"')) {
          return <span key={i} className="text-emerald-300">{p}</span>;
        }
        if (/^\d+(\.\d+)?$/.test(p)) {
          return <span key={i} className="text-amber-300">{p}</span>;
        }
        if (['TemelMatematik', 'IleriMatematik', 'Polinom', 'PolinomIslemleri', 'HesapMakinesi', 'Main', 'BilimselHesapMakinesiEnesOzturk', 'Scanner', 'String', 'System', 'Math'].includes(p)) {
          return <span key={i} className="text-cyan-300 font-semibold">{p}</span>;
        }
        return <span key={i}>{p}</span>;
      })}
    </>
  );
}
