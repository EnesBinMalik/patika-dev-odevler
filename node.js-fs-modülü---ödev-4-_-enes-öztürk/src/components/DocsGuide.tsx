import React from 'react';
import { BookOpen, FileText, Cpu, AlertTriangle, ShieldCheck, HelpCircle } from 'lucide-react';
import { AUTHOR_NAME } from '../data/codeSnippets';

export const DocsGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Intro Header */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-emerald-400" />
          <h2 className="text-base font-bold text-white">
            Node.js File System (FS) Modülü Detaylı Rehberi
          </h2>
        </div>
        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
          Ödev 4 kapsamında kullanılan File System (fs) fonksiyonlarının çalışma prensipleri, en iyi pratikler ve püf noktaları.
        </p>
      </div>

      {/* Grid of Concept Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Card 1: FS Modülü Nedir? */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4.5 space-y-2.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
            <Cpu className="w-4 h-4" />
            <span>Node.js fs Core Modülü</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Node.js dahili (built-in) olarak gelen <code className="text-emerald-300 font-mono text-[11px]">fs</code> modülü, işletim sisteminin dosya yapısıyla doğrudan iletişim kurmanızı sağlar. Ekstra bir <code className="text-slate-400 font-mono">npm install</code> gerektirmez.
          </p>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-[11px] text-amber-300">
            const fs = require(&apos;fs&apos;); // CommonJS<br/>
            import fs from &apos;fs/promises&apos;; // ES Modules
          </div>
        </div>

        {/* Card 2: Error-First Callback Yapısı */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4.5 space-y-2.5">
          <div className="flex items-center gap-2 text-blue-400 font-bold text-xs">
            <AlertTriangle className="w-4 h-4" />
            <span>Error-First Callback Standardı</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Node.js asenkron fonksiyonlarında geri çağırma (callback) fonksiyonunun ilk parametresi daima <code className="text-rose-300 font-mono text-[11px]">err</code> (hata) nesnesidir. İşlem başarılı ise <code className="text-slate-400 font-mono">err</code> null veya undefined döner.
          </p>
          <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 font-mono text-[11px] text-blue-300">
            fs.readFile(&apos;employees.json&apos;, &apos;utf8&apos;, (err, data) =&gt; &#123;<br/>
            &nbsp;&nbsp;if (err) return console.error(err);<br/>
            &nbsp;&nbsp;console.log(data);<br/>
            &#125;);
          </div>
        </div>

        {/* Card 3: Neden &apos;utf8&apos; Parametresi Verilir? */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4.5 space-y-2.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs">
            <FileText className="w-4 h-4" />
            <span>UTF-8 Kodlaması vs Buffer</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            <code className="text-amber-300 font-mono text-[11px]">fs.readFile</code> fonksiyonuna encoding olarak <code className="text-amber-300 font-mono text-[11px]">&apos;utf8&apos;</code> verilmezse geriye ham ikili veri (Raw Buffer: <code className="text-slate-400 font-mono">&lt;Buffer 7b 22...&gt;</code>) döner. Metin olarak okumak için kodlama tipi belirtilmelidir.
          </p>
        </div>

        {/* Card 4: JSON İşlemleri */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4.5 space-y-2.5">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-xs">
            <HelpCircle className="w-4 h-4" />
            <span>JSON.stringify &amp; JSON.parse</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Dosya sistemine JavaScript nesneleri doğrudan yazılamaz; önce <code className="text-purple-300 font-mono text-[11px]">JSON.stringify(obj, null, 2)</code> ile metne çevrilir. Dosyadan okunan metin ise <code className="text-purple-300 font-mono text-[11px]">JSON.parse(str)</code> ile objeye dönüştürülür.
          </p>
        </div>
      </div>

      {/* Signature Banner */}
      <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-emerald-400 shrink-0" />
          <div>
            <h4 className="text-xs font-bold text-white font-mono">
              Hazırlayan &amp; İmzalı: {AUTHOR_NAME}
            </h4>
            <p className="text-[11px] text-slate-400">
              Kodluyoruz / Patika.dev Node.js Bootcamp Ödev 4 Tam Çözümü
            </p>
          </div>
        </div>
        <span className="text-[10px] text-emerald-400 uppercase tracking-wider font-mono font-bold bg-emerald-500/10 px-2.5 py-1 rounded border border-emerald-500/20">
          Onaylandı
        </span>
      </div>
    </div>
  );
};
