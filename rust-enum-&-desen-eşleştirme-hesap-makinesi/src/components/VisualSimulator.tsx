import React, { useState, useMemo } from 'react';
import { OperationVariant } from '../types';
import { Play, ArrowRight, Layers, Cpu, AlertTriangle, Sparkles, Check, Hash, Binary } from 'lucide-react';

export const VisualSimulator: React.FC = () => {
  const [num1Str, setNum1Str] = useState<string>('15.5');
  const [num2Str, setNum2Str] = useState<string>('4.5');
  const [operator, setOperator] = useState<'+' | '-' | '*' | '/'>('+');

  // Parse validation (simulating Rust's parse::<f64>())
  const parseNum1 = useMemo(() => {
    const trimmed = num1Str.trim();
    if (trimmed === '') return { ok: false, error: 'Boş girdi' };
    const val = Number(trimmed);
    if (isNaN(val)) return { ok: false, error: 'ParseFloatError: Geçersiz sayı formatı' };
    return { ok: true, value: val };
  }, [num1Str]);

  const parseNum2 = useMemo(() => {
    const trimmed = num2Str.trim();
    if (trimmed === '') return { ok: false, error: 'Boş girdi' };
    const val = Number(trimmed);
    if (isNaN(val)) return { ok: false, error: 'ParseFloatError: Geçersiz sayı formatı' };
    return { ok: true, value: val };
  }, [num2Str]);

  // Map operator to Operation enum variant
  const variant: OperationVariant = useMemo(() => {
    switch (operator) {
      case '+': return 'Ekleme';
      case '-': return 'Cikarma';
      case '*': return 'Carpma';
      case '/': return 'Bolme';
    }
  }, [operator]);

  // Discriminant tag in Rust enum representation
  const discriminant = useMemo(() => {
    switch (variant) {
      case 'Ekleme': return 0;
      case 'Cikarma': return 1;
      case 'Carpma': return 2;
      case 'Bolme': return 3;
    }
  }, [variant]);

  // Calculate result (simulating fn hesaplama)
  const calculationResult = useMemo(() => {
    if (!parseNum1.ok || !parseNum2.ok) return null;
    const a = parseNum1.value!;
    const b = parseNum2.value!;

    switch (variant) {
      case 'Ekleme': return { res: a + b, isInf: false, isNan: false, note: `${a} + ${b}` };
      case 'Cikarma': return { res: a - b, isInf: false, isNan: false, note: `${a} - ${b}` };
      case 'Carpma': return { res: a * b, isInf: false, isNan: false, note: `${a} * ${b}` };
      case 'Bolme': {
        if (b === 0) {
          const res = a / b;
          return {
            res,
            isInf: !isNaN(res),
            isNan: isNaN(res),
            note: 'Rust IEEE 754 standardında f64 sıfıra bölündüğünde paniklemek yerine Infinity veya NaN döner.',
          };
        }
        return { res: a / b, isInf: false, isNan: false, note: `${a} / ${b}` };
      }
    }
  }, [parseNum1, parseNum2, variant]);

  // Presets
  const applyPreset = (n1: string, op: '+' | '-' | '*' | '/', n2: string) => {
    setNum1Str(n1);
    setOperator(op);
    setNum2Str(n2);
  };

  return (
    <div className="space-y-6">
      
      {/* Overview Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
              Görsel Algoritma & Bellek Modeli
            </div>
            <h2 className="text-xl font-bold text-white">
              Canlı Desen Eşleştirme (Pattern Matching) Simülatörü
            </h2>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Rust dilindeki <code className="text-amber-300 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">Operasyon</code> enum'ının bellekteki yapısını, 
              kullanıcı girdisinin çözümlenmesini ve <code className="text-amber-300 font-mono text-xs bg-slate-800 px-1.5 py-0.5 rounded">match</code> mekanizmasının adım adım çalışmasını görsel olarak inceleyin.
            </p>
          </div>

          {/* Quick presets */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-400 font-medium mr-1">Hazır Örnekler:</span>
            <button
              onClick={() => applyPreset('15.5', '+', '4.5')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors cursor-pointer"
            >
              15.5 + 4.5
            </button>
            <button
              onClick={() => applyPreset('100.0', '-', '35.75')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors cursor-pointer"
            >
              100.0 - 35.75
            </button>
            <button
              onClick={() => applyPreset('12.5', '*', '8.0')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors cursor-pointer"
            >
              12.5 * 8.0
            </button>
            <button
              onClick={() => applyPreset('84.0', '/', '4.0')}
              className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 font-mono transition-colors cursor-pointer"
            >
              84.0 / 4.0
            </button>
            <button
              onClick={() => applyPreset('42.0', '/', '0.0')}
              className="px-2.5 py-1 rounded bg-red-950/60 hover:bg-red-900/60 text-red-300 border border-red-800/60 font-mono transition-colors cursor-pointer"
            >
              42.0 / 0.0 (Sıfıra Bölme)
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* Left Column: Interactive Inputs (Adım 4 & 5) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                  1
                </span>
                <h3 className="font-semibold text-white text-sm">
                  Girdi ve Ayrıştırma (Parse)
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">std::io & parse::&lt;f64&gt;()</span>
            </div>

            {/* Input 1 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>İlk Sayı (String girdi)</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {parseNum1.ok ? `Ok(${parseNum1.value}_f64)` : 'Err(ParseFloatError)'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={num1Str}
                  onChange={(e) => setNum1Str(e.target.value)}
                  placeholder="Örn: 15.5 veya -3.14"
                  className={`w-full bg-slate-950 px-3.5 py-2.5 rounded-lg border font-mono text-sm transition-colors focus:outline-none ${
                    parseNum1.ok
                      ? 'border-slate-700 text-amber-300 focus:border-amber-500'
                      : 'border-red-500 text-red-300 focus:border-red-400'
                  }`}
                />
              </div>
              {!parseNum1.ok && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {parseNum1.error}
                </p>
              )}
            </div>

            {/* Operator Selection */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300">
                Yapılacak İşlem (Operasyon Sembolü)
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { symbol: '+', label: 'Ekleme', desc: '+' },
                  { symbol: '-', label: 'Çıkarma', desc: '-' },
                  { symbol: '*', label: 'Çarpma', desc: '×' },
                  { symbol: '/', label: 'Bölme', desc: '÷' },
                ].map((item) => (
                  <button
                    key={item.symbol}
                    onClick={() => setOperator(item.symbol as any)}
                    className={`py-2 px-3 rounded-lg border font-mono text-center transition-all cursor-pointer ${
                      operator === item.symbol
                        ? 'bg-amber-500 border-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/20'
                        : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700 hover:text-white'
                    }`}
                  >
                    <div className="text-base font-bold">{item.desc}</div>
                    <div className="text-[10px] opacity-80 mt-0.5">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2 */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                <span>İkinci Sayı (String girdi)</span>
                <span className="text-[11px] font-mono text-slate-400">
                  {parseNum2.ok ? `Ok(${parseNum2.value}_f64)` : 'Err(ParseFloatError)'}
                </span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={num2Str}
                  onChange={(e) => setNum2Str(e.target.value)}
                  placeholder="Örn: 4.5 veya 0.0"
                  className={`w-full bg-slate-950 px-3.5 py-2.5 rounded-lg border font-mono text-sm transition-colors focus:outline-none ${
                    parseNum2.ok
                      ? 'border-slate-700 text-amber-300 focus:border-amber-500'
                      : 'border-red-500 text-red-300 focus:border-red-400'
                  }`}
                />
              </div>
              {!parseNum2.ok && (
                <p className="text-xs text-red-400 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {parseNum2.error}
                </p>
              )}
            </div>

            {/* In-Memory Enum Representation */}
            {parseNum1.ok && parseNum2.ok && (
              <div className="pt-2 border-t border-slate-800 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-amber-400" />
                    Bellekteki Enum Temsili (RAM)
                  </span>
                  <span className="text-[11px] font-mono text-slate-400">24 Bytes (Tagged Union)</span>
                </div>
                
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs space-y-1.5">
                  <div className="text-slate-400 text-[11px]">
                    <span className="text-purple-400">let</span> operasyon = <span className="text-emerald-400">Operasyon</span>::<span className="text-amber-400">{variant}</span>({parseNum1.value}, {parseNum2.value});
                  </div>
                  
                  {/* Memory layout visualization */}
                  <div className="grid grid-cols-3 gap-1 pt-2">
                    <div className="bg-slate-900 border border-purple-500/40 p-1.5 rounded text-center">
                      <div className="text-[10px] text-purple-400">Tag (Discriminant)</div>
                      <div className="text-xs font-bold text-white mt-0.5">{discriminant}</div>
                      <div className="text-[9px] text-slate-400">8 bytes</div>
                    </div>
                    <div className="bg-slate-900 border border-amber-500/40 p-1.5 rounded text-center">
                      <div className="text-[10px] text-amber-400">Alan 0 (f64)</div>
                      <div className="text-xs font-bold text-white mt-0.5 truncate">{parseNum1.value}</div>
                      <div className="text-[9px] text-slate-400">8 bytes</div>
                    </div>
                    <div className="bg-slate-900 border border-blue-500/40 p-1.5 rounded text-center">
                      <div className="text-[10px] text-blue-400">Alan 1 (f64)</div>
                      <div className="text-xs font-bold text-white mt-0.5 truncate">{parseNum2.value}</div>
                      <div className="text-[9px] text-slate-400">8 bytes</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Right Column: Pattern Matching Visualizer & Output (Adım 2, 3, 7, 8) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Pattern Matching Inspection Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 font-bold text-xs flex items-center justify-center font-mono">
                  2
                </span>
                <h3 className="font-semibold text-white text-sm">
                  Desen Eşleştirme (Pattern Matching) Yürütmesi
                </h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Exhaustive Match
              </span>
            </div>

            {/* Pattern Matching Code Window */}
            <div className="bg-slate-950 rounded-lg border border-slate-800 p-4 font-mono text-xs sm:text-sm overflow-x-auto">
              <div className="text-slate-400">
                <span className="text-purple-400">fn</span> <span className="text-blue-400">hesaplama</span>(op: <span className="text-emerald-400">Operasyon</span>) -&gt; <span className="text-cyan-400">f64</span> &#123;
              </div>
              <div className="pl-4 text-slate-300">
                <span className="text-purple-400">match</span> op &#123;
              </div>

              {/* Match arms */}
              <div className="space-y-1.5 my-2">
                {[
                  {
                    name: 'Ekleme',
                    code: 'Operasyon::Ekleme(a, b) => a + b,',
                    isMatched: variant === 'Ekleme' && parseNum1.ok && parseNum2.ok,
                    desc: 'İki f64 sayıyı toplayarak sonucu döner',
                  },
                  {
                    name: 'Cikarma',
                    code: 'Operasyon::Cikarma(a, b) => a - b,',
                    isMatched: variant === 'Cikarma' && parseNum1.ok && parseNum2.ok,
                    desc: 'İlk sayıdan ikinci sayıyı çıkarır',
                  },
                  {
                    name: 'Carpma',
                    code: 'Operasyon::Carpma(a, b) => a * b,',
                    isMatched: variant === 'Carpma' && parseNum1.ok && parseNum2.ok,
                    desc: 'İki f64 sayıyı çarpar',
                  },
                  {
                    name: 'Bolme',
                    code: 'Operasyon::Bolme(a, b) => a / b,',
                    isMatched: variant === 'Bolme' && parseNum1.ok && parseNum2.ok,
                    desc: 'İlk sayıyı ikinciye böler (IEEE-754 sıfıra bölme destekli)',
                  },
                ].map((arm) => (
                  <div
                    key={arm.name}
                    className={`pl-8 py-2 px-3 rounded-md transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 ${
                      arm.isMatched
                        ? 'bg-amber-500/15 border-l-4 border-amber-400 text-amber-200 ring-1 ring-amber-500/20'
                        : 'text-slate-400 opacity-60 hover:opacity-80'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {arm.isMatched && (
                        <ArrowRight className="w-3.5 h-3.5 text-amber-400 shrink-0 animate-pulse" />
                      )}
                      <span>{arm.code}</span>
                    </div>

                    {arm.isMatched && (
                      <span className="text-[11px] font-sans font-medium px-2 py-0.5 rounded bg-amber-400 text-slate-950 self-start sm:self-auto shrink-0 font-bold">
                        Eşleşti (Matched)
                      </span>
                    )}
                  </div>
                ))}
              </div>

              <div className="pl-4 text-slate-300">&#125;</div>
              <div className="text-slate-400">&#125;</div>
            </div>

            {/* Execution Breakdown */}
            {calculationResult !== null && (
              <div className="bg-slate-950/70 border border-slate-800 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-slate-300 flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-amber-400" />
                    <span>Fonksiyon Yürütme Detayı</span>
                  </div>
                  <span className="text-[11px] font-mono text-slate-400">
                    op = Operasyon::{variant}({parseNum1.value}, {parseNum2.value})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Unpacked Değişkenler:</span>
                    <span className="text-amber-300 font-semibold">a = {parseNum1.value}</span>
                    <span className="text-slate-400 mx-1.5">,</span>
                    <span className="text-amber-300 font-semibold">b = {parseNum2.value}</span>
                  </div>

                  <div className="bg-slate-900 p-2.5 rounded border border-slate-800">
                    <span className="text-slate-400 block text-[11px]">Değerlendirilen İfade:</span>
                    <span className="text-emerald-400 font-semibold">{calculationResult.note}</span>
                  </div>
                </div>

                {/* Warning for division by zero */}
                {calculationResult.isInf && (
                  <div className="flex items-start gap-2 p-2.5 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200 text-xs">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong>Sıfıra Bölme Tespit Edildi:</strong> Rust'ta f64 sıfıra bölündüğünde işlem paniklemez, IEEE-754 standardı gereği <code className="bg-amber-900/60 px-1 py-0.5 rounded font-mono">inf</code> döner.
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Final Result Card */}
            <div className="bg-gradient-to-br from-slate-950 to-slate-900 border-2 border-amber-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-semibold text-amber-400">
                    println!(&quot;Sonuç: &#123;&#125;&quot;, sonuc);
                  </div>
                  <div className="text-2xl sm:text-3xl font-mono font-bold text-white mt-1 flex items-baseline gap-2">
                    <span>
                      {calculationResult !== null
                        ? String(calculationResult.res)
                        : 'Geçersiz Giriş'}
                    </span>
                    {calculationResult !== null && (
                      <span className="text-xs font-mono text-slate-400 font-normal">
                        (f64 64-bit IEEE-754)
                      </span>
                    )}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[11px] text-slate-400">İmza & Denetim</div>
                  <div className="text-xs font-semibold text-slate-200">Enes Öztürk</div>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
};
