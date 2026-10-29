/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileText, Sparkles, HelpCircle, Layers } from 'lucide-react';
import {
  CODE_SNIPPET_IF_ELSE,
  CODE_SNIPPET_SWITCH_CASE,
  CODE_SNIPPET_ES_MODULE,
  PACKAGE_JSON_SNIPPET,
} from '../data/codeTemplates';

export const CodeViewer: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'if-else' | 'switch' | 'esm'>('if-else');
  const [copied, setCopied] = useState(false);

  const getCode = () => {
    switch (selectedVariant) {
      case 'if-else':
        return CODE_SNIPPET_IF_ELSE;
      case 'switch':
        return CODE_SNIPPET_SWITCH_CASE;
      case 'esm':
        return CODE_SNIPPET_ES_MODULE;
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (filename: string, content: string) => {
    const blob = new Blob([content], { type: 'text/javascript;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Code Header and Variant Selectors */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20">
              index.js
            </span>
            <span className="text-xs text-slate-400">Node.js Web Sunucusu Kodu</span>
          </div>
          <h2 className="text-lg font-bold text-white mt-1">
            Ödev 5 Tam Çözüm Kodu (Enes Öztürk İmzalı)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            İster doğrudan kopyalayıp bilgisayarınızda çalıştırın, ister dosya olarak indirin.
          </p>
        </div>

        {/* Variant Tabs & Actions */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Method Selector */}
          <div className="bg-slate-950 p-1 rounded-xl border border-slate-800 flex items-center text-xs">
            <button
              onClick={() => setSelectedVariant('if-else')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedVariant === 'if-else'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Standart (if/else)
            </button>
            <button
              onClick={() => setSelectedVariant('switch')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedVariant === 'switch'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Switch/Case
            </button>
            <button
              onClick={() => setSelectedVariant('esm')}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                selectedVariant === 'esm'
                  ? 'bg-emerald-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              ES Module (import)
            </button>
          </div>

          {/* Copy Button */}
          <button
            onClick={() => handleCopy(getCode())}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition active:scale-95"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span>Kopyalandı!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-slate-400" />
                <span>Kodu Kopyala</span>
              </>
            )}
          </button>

          {/* Download index.js */}
          <button
            onClick={() => handleDownload('index.js', getCode())}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-semibold shadow-lg shadow-emerald-600/20 flex items-center gap-1.5 transition active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>index.js İndir</span>
          </button>
        </div>
      </div>

      {/* Code Editor Box with Line Numbers */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
        <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80"></div>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80"></div>
            <span className="text-slate-300 ml-2 font-semibold">index.js</span>
            <span className="text-slate-600">•</span>
            <span className="text-slate-500">JavaScript (Node.js)</span>
          </div>
          <span className="text-emerald-400/90 font-sans font-medium text-[11px] flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            Hazırlayan: Enes Öztürk
          </span>
        </div>

        {/* Code Content */}
        <div className="p-4 sm:p-6 overflow-x-auto font-mono text-xs text-slate-200 leading-relaxed max-h-[550px] overflow-y-auto">
          <pre className="text-slate-300">
            {getCode()
              .split('\n')
              .map((line, idx) => {
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('*') || line.trim().startsWith('/*');
                const isKeyword =
                  line.includes('const ') ||
                  line.includes('require(') ||
                  line.includes('import ') ||
                  line.includes('if ') ||
                  line.includes('else if') ||
                  line.includes('else') ||
                  line.includes('switch') ||
                  line.includes('case ') ||
                  line.includes('break;') ||
                  line.includes('default:');
                const isHeading = line.includes('<h2>');

                return (
                  <div key={idx} className="flex hover:bg-slate-900/50 py-0.5 px-1 rounded">
                    <span className="w-10 shrink-0 text-slate-600 select-none text-right pr-4 font-mono text-[11px]">
                      {idx + 1}
                    </span>
                    <span
                      className={`${
                        isComment
                          ? 'text-slate-500 italic'
                          : isHeading
                          ? 'text-amber-300 font-semibold'
                          : isKeyword
                          ? 'text-sky-300'
                          : 'text-slate-200'
                      }`}
                    >
                      {line || ' '}
                    </span>
                  </div>
                );
              })}
          </pre>
        </div>
      </div>

      {/* Code Architecture Breakdown Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            1. http.createServer
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Node.js yerleşik <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded font-mono">http</code> modülü içindeki <code className="text-emerald-300 bg-slate-950 px-1 py-0.5 rounded font-mono">createServer</code> metodu, her gelen istemci isteğinde çalıştırılacak istek (<code className="text-sky-300">req</code>) ve yanıt (<code className="text-sky-300">res</code>) fonksiyonunu tanımlar.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
            <FileText className="w-4 h-4" />
            2. req.url ve Rotalama
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Kullanıcının tarayıcıdan girdiği adres <code className="text-sky-300 bg-slate-950 px-1 py-0.5 rounded font-mono">req.url</code> üzerinden okunur. <code className="text-amber-300">/</code>, <code className="text-amber-300">/index</code>, <code className="text-amber-300">/hakkimda</code> ve <code className="text-amber-300">/iletisim</code> rotalarına göre uygun <code className="text-emerald-300 font-mono">&lt;h2&gt;</code> başlıkları basılır.
          </p>
        </div>

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
            <HelpCircle className="w-4 h-4" />
            3. res.writeHead ve res.end
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Türkçe karakterlerin bozulmaması için <code className="text-amber-300 bg-slate-950 px-1 py-0.5 rounded font-mono">Content-Type: text/html; charset=utf-8</code> başlığı eklenir. <code className="text-indigo-300 font-mono">res.end()</code> ile veri istemciye tamamlanmış olarak iletilir.
          </p>
        </div>
      </div>

      {/* Bonus package.json Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            Ek Dosya: package.json
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Projeyi <code className="text-slate-300 font-mono">npm start</code> ile çalıştırmak için örnek yapılandırma dosyası.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => handleCopy(PACKAGE_JSON_SNIPPET)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700 transition"
          >
            Kopyala
          </button>
          <button
            onClick={() => handleDownload('package.json', PACKAGE_JSON_SNIPPET)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-medium border border-slate-700 transition flex items-center gap-1"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            package.json İndir
          </button>
        </div>
      </div>
    </div>
  );
};
