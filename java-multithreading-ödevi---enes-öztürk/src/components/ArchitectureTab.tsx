import React from 'react';
import { GitBranch, Layers, ShieldCheck, ShieldAlert, Cpu, ArrowDown, Database, CheckCircle2 } from 'lucide-react';

export const ArchitectureTab: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Overview */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-white">
              Sistem Mimarisi ve Veri Akış Şeması
            </h2>
            <p className="text-xs text-slate-400">
              10.000 elemanın 4 Thread tarafından parçalanması, işlenmesi ve senkronize havuzlara aktarılma süreci.
            </p>
          </div>
        </div>
      </div>

      {/* Visual Flow Diagram */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-sm">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Step 1: Main List */}
          <div className="flex flex-col items-center">
            <div className="w-full max-w-md p-4 rounded-2xl bg-indigo-950/40 border border-indigo-800/60 text-center shadow-lg">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Database className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-white text-sm">Ana Liste (ArrayList&lt;Integer&gt;)</span>
              </div>
              <span className="text-xs text-indigo-300 font-mono">1'den 10.000'e Kadar Sayılar [1, 2, 3, ... 10000]</span>
              <div className="mt-2 text-[11px] text-slate-400">Toplam Boyut: 10.000 Eleman</div>
            </div>

            <div className="my-2 flex flex-col items-center">
              <ArrowDown className="w-5 h-5 text-slate-500 animate-bounce" />
              <span className="text-[11px] font-mono text-slate-400">subList() ile 4 eşit parçaya bölme</span>
            </div>
          </div>

          {/* Step 2: 4 SubLists */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-blue-950/30 border border-blue-900/50 text-center">
              <span className="text-xs font-bold text-blue-400 block mb-1">Parça 1</span>
              <span className="text-[11px] font-mono text-slate-300">[1 ... 2500]</span>
              <span className="text-[10px] text-slate-400 block mt-1">2500 Eleman</span>
            </div>

            <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-900/50 text-center">
              <span className="text-xs font-bold text-purple-400 block mb-1">Parça 2</span>
              <span className="text-[11px] font-mono text-slate-300">[2501 ... 5000]</span>
              <span className="text-[10px] text-slate-400 block mt-1">2500 Eleman</span>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-center">
              <span className="text-xs font-bold text-emerald-400 block mb-1">Parça 3</span>
              <span className="text-[11px] font-mono text-slate-300">[5001 ... 7500]</span>
              <span className="text-[10px] text-slate-400 block mt-1">2500 Eleman</span>
            </div>

            <div className="p-3 rounded-xl bg-amber-950/30 border border-amber-900/50 text-center">
              <span className="text-xs font-bold text-amber-400 block mb-1">Parça 4</span>
              <span className="text-[11px] font-mono text-slate-300">[7501 ... 10000]</span>
              <span className="text-[10px] text-slate-400 block mt-1">2500 Eleman</span>
            </div>
          </div>

          {/* Step 3: 4 Concurrent Threads */}
          <div className="flex flex-col items-center my-1">
            <ArrowDown className="w-5 h-5 text-slate-500" />
            <span className="text-[11px] font-mono text-slate-400 my-1">Her parçayı ayrı bir Thread eşzamanlı işler (t.start())</span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950 border border-blue-500/40 text-center">
              <Cpu className="w-5 h-5 text-blue-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Thread-1</span>
              <span className="text-[10px] text-slate-400">SayiIsleyici gorev1</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-purple-500/40 text-center">
              <Cpu className="w-5 h-5 text-purple-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Thread-2</span>
              <span className="text-[10px] text-slate-400">SayiIsleyici gorev2</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-emerald-500/40 text-center">
              <Cpu className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Thread-3</span>
              <span className="text-[10px] text-slate-400">SayiIsleyici gorev3</span>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-amber-500/40 text-center">
              <Cpu className="w-5 h-5 text-amber-400 mx-auto mb-1" />
              <span className="text-xs font-bold text-white block">Thread-4</span>
              <span className="text-[10px] text-slate-400">SayiIsleyici gorev4</span>
            </div>
          </div>

          {/* Step 4: The Critical Synchronization Barrier */}
          <div className="p-4 rounded-2xl bg-slate-950 border-2 border-dashed border-amber-500/50 my-4 text-center">
            <div className="flex items-center justify-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Senkronizasyon Katmanı: synchronized(ciftKilit) & synchronized(tekKilit)
              </span>
            </div>
            <p className="text-[11px] text-slate-300 max-w-xl mx-auto">
              ArrayList thread-safe (iş parçacığı güvenli) değildir! Aynı anda iki thread <code className="text-amber-400 font-mono">list.add()</code> çağırdığında dizi boyutu bozulur ve elemanlar ezilir. Kilit mekanizması aynı anda sadece 1 thread'in listeye yazmasına izin verir.
            </p>
          </div>

          {/* Step 5: The 2 Target Shared Lists */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-emerald-950/30 border border-emerald-800/60 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="text-sm font-bold text-emerald-300">ciftSayilar (ArrayList)</span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">Sayı % 2 == 0 Olanlar</span>
              <span className="text-xs text-emerald-400 font-bold block mt-1">Tam 5.000 Eleman</span>
            </div>

            <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-800/60 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <CheckCircle2 className="w-4 h-4 text-indigo-400" />
                <span className="text-sm font-bold text-indigo-300">tekSayilar (ArrayList)</span>
              </div>
              <span className="text-xs font-mono text-slate-300 block">Sayı % 2 != 0 Olanlar</span>
              <span className="text-xs text-indigo-400 font-bold block mt-1">Tam 5.000 Eleman</span>
            </div>
          </div>
        </div>
      </div>

      {/* Deep-Dive Technical Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="p-5 rounded-2xl bg-rose-950/20 border border-rose-900/40 space-y-2">
          <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
            <ShieldAlert className="w-4 h-4" />
            Senkronizasyon Olmazsa Ne Olur? (Race Condition)
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
            <li>ArrayList arka planda dinamik bir dizi (<code className="text-rose-300 font-mono">Object[] elementData</code>) ve boyut sayacı (<code className="text-rose-300 font-mono">size</code>) tutar.</li>
            <li>İki thread aynı anda <code className="text-rose-300 font-mono">add()</code> çağırdığında aynı index'e yazabilir; biri diğerinin verisini ezer.</li>
            <li>Sonuçta 5000 yerine 4800, 4920 gibi eksik eleman kalır veya <code className="text-rose-300 font-mono">ArrayIndexOutOfBoundsException</code> hatası oluşur.</li>
          </ul>
        </div>

        <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
            <ShieldCheck className="w-4 h-4" />
            Bizim Çözümümüz Neden %100 Güvenli?
          </div>
          <ul className="text-xs text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
            <li><code className="text-emerald-300 font-mono">synchronized(ciftKilit)</code> ve <code className="text-emerald-300 font-mono">synchronized(tekKilit)</code> blokları ile mutual exclusion (karşılıklı dışlama) sağlandı.</li>
            <li>Çift sayılara yazan thread tek sayılara yazan thread'i engellemez; iki bağımsız kilit sayesinde performans korunur.</li>
            <li><code className="text-emerald-300 font-mono">join()</code> metodu ile ana thread tüm thread'lerin işini bitirmesini bekler.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
