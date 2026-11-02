import React from 'react';
import { BookOpen, Check, Layers, Cpu, ShieldAlert, Sparkles, Binary } from 'lucide-react';

export const TheoryGuide: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
        <div className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-1">
          Rust Dil Mimarisi
        </div>
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <span>Enumlar ve Desen Eşleştirme (Pattern Matching) Rehberi</span>
        </h2>
        <p className="text-sm text-slate-400 mt-1 max-w-3xl">
          Rust dilindeki enumlar, C veya Java'daki basit tam sayı sabitlerinin ötesindedir. 
          Cebirsel Veri Tipleri (Algebraic Data Types - ADT) ve etiketli birlikler (Tagged Unions) 
          olarak çalışarak tip güvenliğini ve yüksek performansı garanti altına alırlar.
        </p>
      </div>

      {/* Grid of Key Concepts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* 1. Enum Tuple Varyantları */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-purple-500/20 text-purple-400 flex items-center justify-center font-mono text-xs">
              1
            </span>
            <span>Veri Taşıyan Enumlar (Tuple Varyantları)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust'ta bir enum varyantı veri depolayabilir. Bu görevde tanımladığımız:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
            <span className="text-purple-400">enum</span> <span className="text-emerald-400">Operasyon</span> &#123;<br />
            &nbsp;&nbsp;Ekleme(<span className="text-cyan-400">f64</span>, <span className="text-cyan-400">f64</span>),<br />
            &nbsp;&nbsp;Cikarma(<span className="text-cyan-400">f64</span>, <span className="text-cyan-400">f64</span>),<br />
            &nbsp;&nbsp;Carpma(<span className="text-cyan-400">f64</span>, <span className="text-cyan-400">f64</span>),<br />
            &nbsp;&nbsp;Bolme(<span className="text-cyan-400">f64</span>, <span className="text-cyan-400">f64</span>),<br />
            &#125;
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Burada her varyant tam olarak iki adet 64-bit ondalıklı sayı saklar. Böylece ayrı bir struct tanımlamaya gerek kalmadan hem işlemin türü hem de işlenecek sayılar tek bir türde atomik olarak paketlenir.
          </p>
        </div>

        {/* 2. Kapsamlı (Exhaustive) Desen Eşleştirme */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 flex items-center justify-center font-mono text-xs">
              2
            </span>
            <span>Kapsamlı (Exhaustive) Desen Eşleştirme</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust derleyicisi, bir <code className="text-amber-300 font-mono">match</code> ifadesinde tüm olası durumların eksiksiz kontrol edilmesini zorunlu kılar:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 font-mono text-xs text-amber-300">
            <span className="text-purple-400">match</span> op &#123;<br />
            &nbsp;&nbsp;Operasyon::Ekleme(a, b) =&gt; a + b,<br />
            &nbsp;&nbsp;Operasyon::Cikarma(a, b) =&gt; a - b,<br />
            &nbsp;&nbsp;Operasyon::Carpma(a, b) =&gt; a * b,<br />
            &nbsp;&nbsp;Operasyon::Bolme(a, b) =&gt; a / b,<br />
            &#125;
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Gelecekte enum'a yeni bir <code className="text-amber-300 font-mono">ModAlma(f64, f64)</code> eklendiğinde, derleyici tüm match bloklarında hata vererek unutulmasını imkansız kılar.
          </p>
        </div>

        {/* 3. Desen Parçalama (Destructuring) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-blue-500/20 text-blue-400 flex items-center justify-center font-mono text-xs">
              3
            </span>
            <span>Desen Parçalama (Destructuring)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Match kolunda <code className="text-amber-300 font-mono">Operasyon::Ekleme(a, b)</code> yazıldığında, Rust varyantın içindeki değerleri otomatik olarak çıkarıp yerel <code className="text-amber-300 font-mono">a</code> ve <code className="text-amber-300 font-mono">b</code> değişkenlerine bağlar.
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800 pb-1">
              <span>Gelen Enum</span>
              <span>Ayıklanan Değişkenler</span>
            </div>
            <div className="flex items-center justify-between font-mono text-[11px] pt-1">
              <span className="text-amber-400">Operasyon::Ekleme(15.5, 4.5)</span>
              <span className="text-emerald-400">a = 15.5, b = 4.5</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Bu sayede getteri, casting veya indeks erişimi gerekmeden temiz, güvenli ve okunabilir bir sözdizimi elde edilir.
          </p>
        </div>

        {/* 4. Bellek Verimliliği (Zero-Cost Abstractions) */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-white font-bold text-sm">
            <span className="w-6 h-6 rounded-md bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-mono text-xs">
              4
            </span>
            <span>Bellek Düzeni ve Sıfır Maliyet</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Rust enumları bellekte bir <strong>Discriminant (Etiket)</strong> ve varyantın gerektirdiği alan büyüklüğünde bir <strong>Payload (Yük)</strong> olarak tutulur:
          </p>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 grid grid-cols-3 gap-2 text-center text-xs font-mono">
            <div className="bg-slate-900 p-2 rounded border border-purple-500/40">
              <span className="text-[10px] text-purple-400 block">Etiket</span>
              <span className="text-white font-bold">1 Byte + Pad</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-amber-500/40">
              <span className="text-[10px] text-amber-400 block">Sayı 1 (f64)</span>
              <span className="text-white font-bold">8 Bytes</span>
            </div>
            <div className="bg-slate-900 p-2 rounded border border-blue-500/40">
              <span className="text-[10px] text-blue-400 block">Sayı 2 (f64)</span>
              <span className="text-white font-bold">8 Bytes</span>
            </div>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Çalışma zamanı maliyeti minimumdur; derleme esnasında Rust LLVM, bu match yapısını doğrudan CPU'nun atlama tablolarına (jump tables) dönüştürür.
          </p>
        </div>

      </div>

      {/* Comparison Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-3">
        <h3 className="font-bold text-white text-sm">
          Karşılaştırma: Rust Desen Eşleştirme vs Klasik Switch-Case
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="text-[11px] uppercase bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-2.5 px-3">Özellik</th>
                <th className="py-2.5 px-3 text-amber-400 font-bold">Rust (match & enum)</th>
                <th className="py-2.5 px-3 text-slate-400">Klasik C / Java switch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Varyant İçinde Veri Taşıma</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">Doğrudan destekler (Tuple / Struct varyantları)</td>
                <td className="py-2.5 px-3 text-slate-400">Desteklemez (Yalnızca sabit tamsayı)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Kapsamlılık (Exhaustiveness)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">Derleme hatası verir (Eksik durum bırakılamaz)</td>
                <td className="py-2.5 px-3 text-slate-400">İsteğe bağlıdır (Unutulan durumlar sessiz hata üretir)</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">Fallthrough (break zorunluluğu)</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">Yoktur (Otomatik güvenli dallanma)</td>
                <td className="py-2.5 px-3 text-slate-400">break unutulursa bir sonraki case'e düşer</td>
              </tr>
              <tr>
                <td className="py-2.5 px-3 font-semibold text-white">İfade (Expression) Olarak Değer Dönme</td>
                <td className="py-2.5 px-3 text-emerald-400 font-semibold">Evet, match bir ifadedir (let sonuc = match ...)</td>
                <td className="py-2.5 px-3 text-slate-400">Geleneksel olarak ifadedir değil deyimdir (statement)</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
