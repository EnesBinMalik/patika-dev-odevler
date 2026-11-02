import React from 'react';
import { BookOpen, ShieldAlert, Cpu, CheckCircle } from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  return (
    <div className="rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl space-y-4">
      <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
        <BookOpen className="w-4 h-4 text-orange-400" />
        <h3 className="text-sm font-bold text-white tracking-wide">
          Rust Hata Yönetimi Mimarisi &amp; Temel Kavramlar Rehberi
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-cyan-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Result&lt;T, E&gt; Türü</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust'ta diğer dillerdeki gibi beklenmeyen <code className="text-rose-400 font-mono">null</code> veya yakalanmamış <code className="text-rose-400 font-mono">Exception</code> yoktur. Bunun yerine geri dönülebilir hatalar için standart kütüphanedeki <code className="text-cyan-300 font-mono">enum Result&lt;T, E&gt;</code> kullanılır.
          </p>
          <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
            pub enum Result&lt;T, E&gt; &#123;<br />
            &nbsp;&nbsp;Ok(T),<br />
            &nbsp;&nbsp;Err(E),<br />
            &#125;
          </div>
        </div>

        {/* Card 2 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-emerald-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Neden Result&lt;(), String&gt;?</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Para yatırma ve çekme işlemlerinde başarılı olunduğunda geriye ekstra bir değer döndürmek gerekmez. Bu yüzden başarı tipi olarak Rust'ın boş demet türü olan <code className="text-emerald-300 font-mono">()</code> (unit type) kullanılır: <code className="text-emerald-300 font-mono">Ok(())</code>.
          </p>
          <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
            // Başarı:&nbsp;&nbsp;Ok(())<br />
            // Hata:&nbsp;&nbsp;&nbsp;&nbsp;Err(&quot;Mesaj&quot;.to_string())
          </div>
        </div>

        {/* Card 3 */}
        <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
          <div className="flex items-center gap-2 text-orange-400 font-mono text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-orange-400"></span>
            <span>match ile Desen Eşleme</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust derleyicisi (<code className="text-orange-300 font-mono">rustc</code>), <code className="text-orange-300 font-mono">Result</code> dönen bir fonksiyon çağrıldığında sonucun göz ardı edilmesini uyarır. <code className="text-orange-300 font-mono">match</code> ifadesi tüm olası durumların (exhaustive) ele alınmasını zorunlu kılar.
          </p>
          <div className="bg-slate-900 p-2 rounded text-[11px] font-mono text-slate-300 border border-slate-800">
            match account.deposit(100.0) &#123;<br />
            &nbsp;&nbsp;Ok(()) =&gt; println!(&quot;Başarılı&quot;),<br />
            &nbsp;&nbsp;Err(e) =&gt; println!(&quot;Hata: &#123;&#125;&quot;, e),<br />
            &#125;
          </div>
        </div>
      </div>
    </div>
  );
};
