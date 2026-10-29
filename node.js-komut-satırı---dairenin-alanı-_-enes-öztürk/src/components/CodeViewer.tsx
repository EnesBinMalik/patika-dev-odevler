import React, { useState } from 'react';
import { Code2, Copy, Check, Download, ExternalLink, Terminal, FileCode, CheckCircle2 } from 'lucide-react';
import { NODE_SCRIPT_CODE } from '../data/codeSnippet';

export const CodeViewer: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [selectedAnnotation, setSelectedAnnotation] = useState<number | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(NODE_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([NODE_SCRIPT_CODE], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daireAlani.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const codeLines = NODE_SCRIPT_CODE.trim().split('\n');

  const annotations = [
    {
      lines: [13, 14],
      title: 'process.argv.slice(2) & Parametre Alma',
      desc: 'process.argv dizisinin 0. ve 1. indisleri sırasıyla Node ikili dosyasını ve script dosya yolunu tutar. slice(2) ile doğrudan kullanıcı parametrelerine ulaşılır.',
    },
    {
      lines: [16, 23],
      title: 'Giriş Kontrolü & Güvenlik (Validation)',
      desc: 'Kullanıcının parametre girmemesi (arguments.length === 0) ya da harf girmesi (isNaN) durumunda programın çökmemesi için kontrollü uyarı verilir.',
    },
    {
      lines: [28],
      title: 'Daire Alan Formülü: Alan = π * r²',
      desc: "JavaScript'te pi sayısı Math.PI sabitiyle temsil edilir. r² işlemi ise üs alma operatörü (r ** 2) veya Math.pow(r, 2) ile hesaplanır.",
    },
    {
      lines: [32],
      title: 'İstenen Konsol Çıktısı Şablonu',
      desc: "Ödev yönergesindeki tam format: 'Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)' şeklinde şablon dizgisi (template literal) ile yazdırılır.",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Top Header Card */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <FileCode className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <span>daireAlani.js</span>
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono-code">
                Temiz Kod (Clean Code)
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Enes Öztürk tarafından hazırlanan, standartlara uygun tam Node.JS çözüm dosyası
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400">Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors cursor-pointer shadow-sm"
          >
            <Download className="w-4 h-4" />
            <span>daireAlani.js İndir</span>
          </button>
        </div>
      </div>

      {/* Code Editor Mockup */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono-code text-xs sm:text-sm">
        {/* Editor Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900 border-b border-slate-800 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/60 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/60 inline-block"></span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/60 inline-block"></span>
            <span className="ml-2 text-xs text-slate-400 font-sans font-medium flex items-center gap-1.5">
              <span>daireAlani.js</span>
              <span className="text-[10px] text-slate-600">• UTF-8 • JavaScript</span>
            </span>
          </div>

          <div className="text-[11px] text-slate-500 font-sans">
            Ödev 1: Node.JS Komut Satırı
          </div>
        </div>

        {/* Code Content with Line Numbers */}
        <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto leading-relaxed">
          <table className="w-full border-collapse">
            <tbody>
              {codeLines.map((line, index) => {
                const lineNum = index + 1;
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*');
                const isImportant = line.includes('process.argv') || line.includes('Math.PI') || line.includes('Yarıçapı');

                return (
                  <tr
                    key={index}
                    className={`hover:bg-slate-900/60 transition-colors ${
                      isImportant ? 'bg-amber-500/[0.03]' : ''
                    }`}
                  >
                    <td className="w-10 pr-4 text-right text-slate-600 select-none text-[11px] align-top font-mono-code border-r border-slate-800/80">
                      {lineNum}
                    </td>
                    <td className="pl-4 whitespace-pre text-slate-300 font-mono-code">
                      {isComment ? (
                        <span className="text-slate-500 italic">{line}</span>
                      ) : (
                        <span>
                          {line
                            .replace('const ', 'const ')
                            .split(/(\bfunction\b|\bconst\b|\blet\b|\breturn\b|\bif\b|\bNumber\b|\bMath\b|\bconsole\b)/g)
                            .map((part, pIdx) => {
                              if (['function', 'const', 'let', 'return', 'if'].includes(part)) {
                                return (
                                  <span key={pIdx} className="text-purple-400 font-bold">
                                    {part}
                                  </span>
                                );
                              }
                              if (['Number', 'Math', 'console'].includes(part)) {
                                return (
                                  <span key={pIdx} className="text-sky-400 font-semibold">
                                    {part}
                                  </span>
                                );
                              }
                              if (part.includes('`') || part.includes('"') || part.includes("'")) {
                                return (
                                  <span key={pIdx} className="text-emerald-300">
                                    {part}
                                  </span>
                                );
                              }
                              return <span key={pIdx}>{part}</span>;
                            })}
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Code Annotations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {annotations.map((ann, idx) => (
          <div
            key={idx}
            className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-colors space-y-1.5"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <h4 className="text-xs font-bold text-slate-200">{ann.title}</h4>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed pl-6">
              {ann.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Terminal Usage Guide Card */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/20 border border-slate-800 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <Terminal className="w-4 h-4 text-amber-400" />
          Kendi Bilgisayarınızda Nasıl Çalıştırırsınız?
        </h3>
        <ol className="text-xs text-slate-400 space-y-2 list-decimal list-inside leading-relaxed">
          <li>
            Yukarıdaki <span className="text-slate-200 font-semibold">.js İndir</span> butonuna basarak <code className="text-amber-300 font-mono-code">daireAlani.js</code> dosyasını kaydedin.
          </li>
          <li>
            Terminali (Komut İstemi / PowerShell / Mac Terminal) dosyanın bulunduğu klasörde açın.
          </li>
          <li>
            Aşağıdaki komutu yazıp <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300 font-mono-code">Enter</kbd> tuşuna basın:
            <div className="mt-1.5 bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono-code text-emerald-300 flex items-center justify-between">
              <span>node daireAlani.js 5</span>
              <span className="text-slate-500 text-[11px] font-sans"># 5 yarıçap değeri için</span>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
};
