import React from 'react';
import { Binary, ShieldCheck, Check, Lightbulb, FunctionSquare } from 'lucide-react';

export const AlgorithmExplainer: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-4 rounded bg-slate-900/80 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-mono text-cyan-400 font-semibold tracking-wider uppercase">
            ENES ÖZTÜRK · MATEMATİKSEL ALGORİTMA DOKÜMANTASYONU
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Java <code>java.lang.Math</code> kütüphanesi kullanılmadan sıfırdan inşa edilen algoritmaların analizi.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
          <ShieldCheck className="w-4 h-4" />
          <span>Hazır Sınıf Bağımlılığı: %0</span>
        </div>
      </div>

      {/* Grid of Algorithms */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Square Root Newton-Raphson */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">1</span>
              <span>Karekök Alma: Newton-Raphson (Babil) Yöntemi</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">O(log n)</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300">
            x_{'{n+1}'} = 0.5 × (x_n + S / x_n)
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              <code>Math.sqrt(S)</code> yerine fonksiyonun kökü olan $f(x) = x^2 - S = 0$ denklemi çözülmüştür.
            </p>
            <p>
              Teğet doğrusunun x-eksenini kestiği nokta olan yineleme kuralı, her adımda doğru basamak sayısını ikiye katlar (ikinci dereceden kuadratik yakınsama).
            </p>
            <div className="bg-slate-950/60 p-2.5 rounded border border-slate-800 text-[11px] font-mono text-slate-300">
              Durma Koşulu: |x_{'{n+1}'} - x_n| &le; 10⁻¹⁴ (Çift duyarlıklı sınır)
            </div>
          </div>
        </div>

        {/* Card 2: Power Algorithm */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">2</span>
              <span>Üs Alma: İkili Hızlı Üs & Taylor Serisi</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">O(log p)</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300">
            x^y = e^(y · ln(x)) &ensp;|&ensp; İkili: x^13 = x^8 · x^4 · x^1
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              <code>Math.pow</code> yerine iki aşamalı hibrit mimari kullanılmıştır:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
              <li><strong>Tam Sayı Üsler:</strong> İkili Üs Alma (Binary Exponentiation) ile $O(\log p)$ adımda hesaplanır.</li>
              <li><strong>Ondalıklı Üsler:</strong> Doğal logaritma $\ln(x)$ ve üstel fonksiyon $e^z$ Taylor serisi açılarak hesaplanır.</li>
            </ul>
          </div>
        </div>

        {/* Card 3: Polynomial Derivative */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-amber-500/10 text-amber-400 flex items-center justify-center text-xs font-mono">3</span>
              <span>Polinom Türevi: Kuvvet Kuralı Operatörü</span>
            </h3>
            <span className="text-[11px] font-mono text-amber-400">Doğrusal O(n)</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-amber-300">
            d/dx [a_k · x^k] = (k · a_k) · x^(k-1)
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              Polinomlar ayrık katsayı dizisi olarak nesnelleştirilmiştir. Diferansiyel operatörü her terime uygulanarak derece 1 düşürülür:
            </p>
            <p>
              Sabit terim türevde sıfırlanır ($d/dx(a_0) = 0$). Elde edilen yeni katsayı dizisi yeni bir <code>Polinom</code> nesnesine dönüştürülür.
            </p>
          </div>
        </div>

        {/* Card 4: Polynomial Integral */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">4</span>
              <span>Polinom İntegrali: Newton-Leibniz Teoremi</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Tam Çözüm</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300">
            ∫ a_k · x^k dx = (a_k / (k + 1)) · x^(k+1) + C
          </div>

          <div className="text-xs text-slate-400 leading-relaxed space-y-2">
            <p>
              <strong>Belirsiz İntegral:</strong> Kuvvet kuralının tersi uygulanarak anti-türev fonksiyonu üretilir ve entegrasyon sabiti $+ C$ eklenir.
            </p>
            <p>
              <strong>Belirli İntegral:</strong> Kalkülüsün Temel Teoremi uyarınca $[F(b) - F(a)]$ Horner algoritmasıyla hassas bir şekilde hesaplanır.
            </p>
          </div>
        </div>

        {/* Card 5: Modulo & Remainder */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">5</span>
              <span>Mod Alma: Bölüm ve Kalan Bağıntısı</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Aritmetik</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300">
            kalan = a - (⌊a / b⌋ × b)
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            Tam sayı bölümü (truncation) yapılarak kalan miktar saf çarpma ve çıkarma işlemleriyle elde edilir. Sıfıra bölme durumunda <code>ArithmeticException</code> fırlatılır.
          </div>
        </div>

        {/* Card 6: Absolute Value & Factorial */}
        <div className="bg-slate-900 border border-slate-800 rounded p-5 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <span className="w-5 h-5 rounded bg-cyan-500/10 text-cyan-400 flex items-center justify-center text-xs font-mono">6</span>
              <span>Mutlak Değer (|x|) & Faktöriyel (n!)</span>
            </h3>
            <span className="text-[11px] font-mono text-cyan-400">Saf Mantık</span>
          </div>

          <div className="p-3 bg-slate-950 rounded border border-slate-800/80 font-mono text-xs text-cyan-300">
            |x| = (x &lt; 0) ? -x : x &ensp;|&ensp; n! = ∏_{'{i=1}'}^n i
          </div>

          <div className="text-xs text-slate-400 leading-relaxed">
            <code>Math.abs</code> çağrısı yerine temel şartlı dallanma kullanılmıştır. Faktöriyel fonksiyonu 0! = 1 özel durumunu ve 64-bit tam sayı sınırını güvenli şekilde denetler.
          </div>
        </div>
      </div>
    </div>
  );
};
