import React from 'react';
import { Sparkles, ShieldCheck, Check, AlertTriangle, Lightbulb, BookOpen, GitCompare, Code2, ArrowRight } from 'lucide-react';

export const TheoryTab: React.FC = () => {
  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Hero Banner */}
      <div className="bg-gradient-to-r from-[#141824] via-[#10141f] to-[#0c0e14] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex items-center gap-2 text-xs font-semibold text-purple-400 uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>Rust Pedagojik Konsept Rehberi</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Neden Kapanış (Closure) Kullanmadık?
        </h2>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl leading-relaxed">
          Rust diline yeni başlayan öğrenciler için kapanışlar (<code className="text-orange-300 font-mono">|x| x == target</code>), derleyicinin arka planda ürettiği anonim yapılar ve <code className="text-orange-300 font-mono">Fn, FnMut, FnOnce</code> trait'leri nedeniyle kafa karıştırıcı olabilir. Bu ödevde, filtreleme mantığı doğrudan <strong className="text-zinc-200">Struct ve Impl</strong> kullanılarak somutlaştırılmıştır.
        </p>

        <div className="mt-4 pt-4 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-400">
          <span className="flex items-center gap-1.5 text-amber-300 font-medium">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            Hazırlayan: Enes Öztürk
          </span>
          <span className="font-mono text-zinc-500">Rust 2021 Edition</span>
        </div>
      </div>

      {/* Side-by-side comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Our Struct Solution */}
        <div className="bg-[#10131d] border border-emerald-500/30 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold">
                ✓ Bizim Çözümümüz (Kapanışsız / Ödev)
              </span>
              <span className="text-[11px] text-zinc-400 font-mono">Yeni Başlayan Dostu</span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Struct + Impl + Referans Tabanlı Filtreleme
            </h3>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Veri <code className="text-emerald-300 font-mono">FilterCondition</code> yapısı içinde açıkça saklanır. Metot çağrısı <code className="text-emerald-300 font-mono">condition.is_match(item)</code> klasik nesne yönelimli programlama benzeri şeffaf bir akış sağlar.
            </p>

            <div className="bg-[#090b10] p-3 rounded-lg font-mono text-xs text-zinc-300 border border-zinc-800/80 mb-4">
              <div className="text-zinc-500">// 1. Koşul nesnesi oluşturulur:</div>
              <div>let condition = FilterCondition &#123; desired_value: 25 &#125;;</div>
              <div className="text-zinc-500 mt-2">// 2. Açık fonksiyon çağrısı yapılır:</div>
              <div>let filtered = custom_filter(&numbers, &condition);</div>
            </div>

            <ul className="space-y-2 text-xs text-zinc-300">
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Değişken kapsamı (scope) ve sahiplik tamamen görünür ve kontrol edilebilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Gizli heap tahsisi veya karmaşık trait sınırları (<code className="text-orange-300 font-mono">FnMut</code> vb.) yoktur.</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Rust'ın <code className="text-orange-300 font-mono">&</code> (ödünç alma / borrow) mekanizmasını doğrudan öğretir.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Standard Closure Way */}
        <div className="bg-[#10131d] border border-zinc-800 rounded-xl p-5 shadow-lg flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2.5 py-1 rounded-md bg-zinc-800 text-zinc-400 border border-zinc-700 text-xs font-bold">
                Standart Rust (Kapanışlı / Iterator)
              </span>
              <span className="text-[11px] text-zinc-500 font-mono">İleri Seviye</span>
            </div>

            <h3 className="text-base font-bold text-white mb-2">
              Iterator Filter ve Closure (|x| ...)
            </h3>

            <p className="text-xs text-zinc-400 mb-4 leading-relaxed">
              Standart Rust'ta genellikle <code className="text-purple-300 font-mono">.filter()</code> metodu ve bir kapanış kullanılır. Ancak bu yaklaşım arka planda gizli yapılar üretir.
            </p>

            <div className="bg-[#090b10] p-3 rounded-lg font-mono text-xs text-zinc-300 border border-zinc-800/80 mb-4">
              <div className="text-zinc-500">// Standart Rust yaklaşımı:</div>
              <div>let filtered: Vec&lt;i32&gt; = numbers</div>
              <div className="pl-4">.iter()</div>
              <div className="pl-4">.filter(|&x| *x == 25) <span className="text-purple-400">// Kapanış!</span></div>
              <div className="pl-4">.cloned()</div>
              <div className="pl-4">.collect();</div>
            </div>

            <ul className="space-y-2 text-xs text-zinc-400">
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Kapanış dışındaki değişkenleri ödünç alma veya taşıma (<code className="text-amber-400 font-mono">move</code>) kuralları karmaşıktır.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><code className="text-amber-400 font-mono">Fn, FnMut, FnOnce</code> arasındaki farklar yeni başlayanların hata yapmasına yol açar.</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span>Derleyicinin yaşam süresi (lifetime) hatalarını çözmek yeni başlayanlar için zordur.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* 3 Core Rust Concepts Taught in This Task */}
      <div className="space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-orange-400" />
          Bu Görevde Öğrenilen 3 Temel Rust Prensibi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#11141d] border border-zinc-800 rounded-xl p-4">
            <div className="text-orange-400 font-mono text-sm font-bold mb-1">1. Struct & Impl</div>
            <h4 className="text-xs font-semibold text-white mb-2">Veri ve Davranışın Ayrılması</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Rust'ta sınıflar (classes) yoktur. Veriler <code className="text-orange-300 font-mono">struct</code> içinde, metotlar ise ayrı bir <code className="text-orange-300 font-mono">impl</code> bloğunda tanımlanır. <code className="text-orange-300 font-mono">is_match</code> metodumuz bu prensibi gösterir.
            </p>
          </div>

          <div className="bg-[#11141d] border border-zinc-800 rounded-xl p-4">
            <div className="text-blue-400 font-mono text-sm font-bold mb-1">2. Ödünç Alma (&)</div>
            <h4 className="text-xs font-semibold text-white mb-2">Borrowing ve Referanslar</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Fonksiyonumuza <code className="text-blue-300 font-mono">&numbers</code> şeklinde referans vererek vektörün sahipliğini (ownership) koruduk. Böylece fonksiyon bittikten sonra orijinal vektör silinmez ve kullanılabilir.
            </p>
          </div>

          <div className="bg-[#11141d] border border-zinc-800 rounded-xl p-4">
            <div className="text-purple-400 font-mono text-sm font-bold mb-1">3. Dereferans (*)</div>
            <h4 className="text-xs font-semibold text-white mb-2">*item Operatörü</h4>
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Döngüde <code className="text-purple-300 font-mono">item</code> bir <code className="text-purple-300 font-mono">&i32</code> referansıdır. Değerin kendisini elde etmek ve karşılaştırmak için <code className="text-purple-300 font-mono">*item</code> dereferans operatörü kullanılır.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
