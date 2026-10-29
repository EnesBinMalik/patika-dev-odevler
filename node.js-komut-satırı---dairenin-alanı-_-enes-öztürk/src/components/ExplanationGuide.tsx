import React from 'react';
import { Sparkles, Layers, AlertTriangle, CheckCircle, Code, HelpCircle } from 'lucide-react';
import { ARGV_BREAKDOWN } from '../data/codeSnippet';

export const ExplanationGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Title Card */}
      <div className="bg-slate-900/40 p-4 sm:p-5 rounded-2xl border border-slate-800 space-y-1">
        <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>Node.JS Komut Satırı (CLI) & process.argv Mimarisi</span>
        </h2>
        <p className="text-xs text-slate-400">
          Node.js çalışma ortamında komut satırından parametre okumanın iç yapısı ve çalışma prensipleri.
        </p>
      </div>

      {/* Visual Array Diagram */}
      <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-slate-200 flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-400" />
            <span>Terminal Komutu ve Dizi Eşleşmesi</span>
          </span>
          <span className="text-[11px] font-mono-code text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
            Array (Dizi) Yapısı
          </span>
        </div>

        {/* Command line preview */}
        <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 font-mono-code text-xs sm:text-sm text-slate-300 flex items-center gap-2 flex-wrap">
          <span className="text-emerald-400 font-bold">$</span>
          <span className="bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded border border-blue-500/30">node</span>
          <span className="bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded border border-purple-500/30">daireAlani.js</span>
          <span className="bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30 font-bold">5</span>
        </div>

        {/* Array Cards Mapping */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {ARGV_BREAKDOWN.map((item, idx) => (
            <div
              key={idx}
              className={`p-3.5 rounded-xl border space-y-2 ${
                idx === 2
                  ? 'bg-amber-950/20 border-amber-500/40 ring-1 ring-amber-500/20'
                  : 'bg-slate-900/60 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono-code text-xs font-bold text-amber-300 bg-black/40 px-2 py-0.5 rounded border border-slate-700">
                  {item.index}
                </span>
                {idx === 2 && (
                  <span className="text-[10px] uppercase font-bold text-emerald-400 tracking-wider">
                    Hedef Parametre
                  </span>
                )}
              </div>

              <div className="text-xs font-semibold text-slate-200">
                {item.name}
              </div>

              <div className="font-mono-code text-[11px] text-slate-400 bg-slate-950 p-2 rounded border border-slate-800/80 truncate">
                {item.example}
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Deep-dive Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Why slice(2)? */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <Code className="w-4 h-4 text-sky-400" />
            <span>Neden <code className="text-sky-300 font-mono-code">process.argv.slice(2)</code> Kullanılır?</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Dizinin ilk 2 elemanı Node.js sistemine aittir. Kullanıcıların gönderdiği argümanlar her zaman 2. indisten başlar.
            <code className="text-amber-300 font-mono-code ml-1">.slice(2)</code> metodunu çağırdığımızda, sistem elemanları atılır ve geriye doğrudan kullanıcının parametrelerinden oluşan temiz bir dizi kalır:
          </p>
          <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono-code text-xs text-slate-300">
            <span className="text-purple-400">const</span> args = process.argv.<span className="text-sky-300">slice</span>(<span className="text-amber-300">2</span>);<br />
            <span className="text-slate-500">// args[0] artık doğrudan '5' değerini verir!</span>
          </div>
        </div>

        {/* Type Conversion Pitfall */}
        <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-2.5">
          <div className="flex items-center gap-2 text-slate-200 font-bold text-xs">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <span>Kritik Detay: Tip Dönüşümü (String'den Number'a)</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Komut satırından gelen tüm değerler JavaScript'e <strong>String (Metin)</strong> tipinde aktarılır.
            Matematiksel işlemlerde güvenli hesaplama için mutlaka sayıya dönüştürülmelidir:
          </p>
          <div className="bg-black/60 p-2.5 rounded-lg border border-slate-800 font-mono-code text-xs text-slate-300">
            <span className="text-purple-400">const</span> yaricap = <span className="text-sky-400">Number</span>(args[<span className="text-amber-300">0</span>]);<br />
            <span className="text-slate-500">// veya parseFloat(args[0])</span>
          </div>
        </div>
      </div>

      {/* Assignment Quality Checklist */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-500/30 space-y-3">
        <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          Ödev 1 Değerlendirme & Başarı Kriterleri
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Parametre konsoldan dinamik alınıyor</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Formül tam ve doğru: Alan = π × r²</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Konsol çıktısı istenen şablona birebir uygun</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950/60 border border-slate-800 text-slate-300">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>Enes Öztürk imzalı el emeği titiz kod yapısı</span>
          </div>
        </div>
      </div>
    </div>
  );
};
