import React from 'react';
import { Layers, ArrowDown, CheckCircle2, XCircle, Sparkles, BookOpen, GitFork, ShieldCheck } from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Banner explaining the design */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-900 border border-indigo-500/30">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider mb-2">
          <Sparkles className="w-4 h-4" />
          <span>En Az Kod ve En Mantıklı Yol Prensibi</span>
        </div>
        <h2 className="text-xl md:text-2xl font-extrabold text-white tracking-tight">
          Neden Kare Doğrudan Dikdörtgen’den Türetildi?
        </h2>
        <p className="text-sm text-slate-300 mt-2 max-w-3xl leading-relaxed">
          Geometride her kare aslında genişliği ve yüksekliği eşit olan özel bir dikdörtgendir.
          Gereksiz yere <code className="text-indigo-300 font-mono">Sekil</code>'den türetip alan ve çevre formüllerini baştan yazmak yerine;
          <code className="text-emerald-300 font-mono"> Kare extends Dikdortgen</code> mimarisiyle
          <strong className="text-white"> sıfır matematik kodu tekrarı (DRY ilkesi)</strong> sağlanır.
        </p>
        <div className="mt-4 flex items-center gap-3 text-xs text-amber-300 font-medium">
          <span className="font-signature text-xl">Enes Öztürk</span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Yazılım Mimarisi Notu</span>
        </div>
      </div>

      {/* Visual UML Tree */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-6 flex items-center gap-2">
          <GitFork className="w-5 h-5 text-indigo-400" />
          <span>Sınıf Miras Hiyerarşisi (UML Şeması)</span>
        </h3>

        {/* Tree Container */}
        <div className="flex flex-col items-center">
          {/* Base: Sekil */}
          <div className="w-full max-w-md p-4 rounded-xl bg-slate-950 border-2 border-indigo-500/60 text-center shadow-lg relative">
            <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded-full font-bold">
              Soyut Temel Sınıf (Abstract)
            </span>
            <div className="text-lg font-bold text-white mt-1">Sekil</div>
            <div className="text-xs text-slate-400 font-mono mt-2 space-y-0.5 border-t border-slate-800 pt-2 text-left">
              <div className="text-indigo-300">+ isim: string</div>
              <div className="text-emerald-400 font-semibold">+ abstract alanHesapla(): number</div>
              <div className="text-cyan-400 font-semibold">+ abstract cevreHesapla(): number</div>
              <div className="text-slate-400">+ bilgiVer(): string</div>
            </div>
          </div>

          {/* Connection Lines */}
          <div className="w-0.5 h-8 bg-indigo-500/50 my-1" />
          <div className="w-80 h-0.5 bg-indigo-500/50" />
          <div className="w-80 flex justify-between">
            <div className="w-0.5 h-6 bg-indigo-500/50" />
            <div className="w-0.5 h-6 bg-indigo-500/50" />
          </div>

          {/* Level 2: Dikdortgen & Ucgen */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mt-2">
            {/* Dikdortgen Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-indigo-500/40 relative shadow-md">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-indigo-500/10 text-indigo-300 rounded font-semibold">
                Sekil'den Türetildi
              </span>
              <div className="text-base font-bold text-indigo-300 mt-1">Dikdortgen</div>
              <div className="text-xs text-slate-300 font-mono mt-2 space-y-0.5 border-t border-slate-800 pt-2">
                <div>+ genislik: number</div>
                <div>+ yukseklik: number</div>
                <div className="text-emerald-400">+ alanHesapla() =&gt; g * y</div>
                <div className="text-cyan-400">+ cevreHesapla() =&gt; 2*(g + y)</div>
              </div>

              {/* Sub-Branch to Kare */}
              <div className="mt-4 pt-3 border-t border-dashed border-emerald-500/30 flex flex-col items-center">
                <ArrowDown className="w-4 h-4 text-emerald-400 mb-1 animate-bounce" />
                <div className="w-full p-3 rounded-lg bg-emerald-950/30 border border-emerald-500/40">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-emerald-300">Kare</span>
                    <span className="text-[10px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold">
                      Dikdortgen'den Miras
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-emerald-200/90 mt-1.5 space-y-0.5">
                    <div>constructor(kenar) &#123;</div>
                    <div className="pl-3 text-amber-300 font-bold">super(kenar, kenar, 'Kare');</div>
                    <div>&#125;</div>
                  </div>
                  <p className="text-[10px] text-emerald-400 mt-2 font-medium">
                    ✓ Metotlar tekrar yazılmaz! Otomatik miras alınır.
                  </p>
                </div>
              </div>
            </div>

            {/* Ucgen Box */}
            <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/40 relative shadow-md">
              <span className="text-[10px] font-mono uppercase px-2 py-0.5 bg-amber-500/10 text-amber-300 rounded font-semibold">
                Sekil'den Türetildi
              </span>
              <div className="text-base font-bold text-amber-300 mt-1">Ucgen</div>
              <div className="text-xs text-slate-300 font-mono mt-2 space-y-0.5 border-t border-slate-800 pt-2">
                <div>+ a: number, b: number, c: number</div>
                <div className="text-cyan-400">+ cevreHesapla() =&gt; a + b + c</div>
                <div className="text-emerald-400">+ alanHesapla() =&gt; Heron Formülü</div>
                <div className="text-slate-400">+ gecerliMi(): boolean</div>
                <div className="text-slate-400">+ turBelirle(): string</div>
              </div>
              <p className="text-[11px] text-amber-400/90 mt-4 p-2 bg-amber-950/20 rounded border border-amber-500/20 leading-relaxed">
                Heron Formülü sayesinde yükseklik bilinmese bile 3 kenardan kusursuz alan hesabı yapılır.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Code Comparison: Good OOP vs Bad Duplicate Code */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Bad Approach */}
        <div className="p-5 rounded-2xl bg-rose-950/15 border border-rose-500/30">
          <div className="flex items-center gap-2 text-rose-400 text-sm font-bold mb-2">
            <XCircle className="w-5 h-5 shrink-0" />
            <span>Kötü Yaklaşım: Gereksiz Kod Tekrarı</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Kare sınıfını Sekil'den sıfırdan türetmek aynı matematik işlemlerini tekrar ettirir:
          </p>
          <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-slate-300 overflow-x-auto border border-rose-500/20">
{`// ❌ KÖTÜ: 10 satır gereksiz kod tekrarı
class Kare extends Sekil {
  kenar: number;
  constructor(k: number) {
    super('Kare');
    this.kenar = k;
  }
  alanHesapla() {
    return this.kenar * this.kenar; // Tekrar!
  }
  cevreHesapla() {
    return 4 * this.kenar; // Tekrar!
  }
}`}
          </pre>
        </div>

        {/* Good Enes Öztürk Approach */}
        <div className="p-5 rounded-2xl bg-emerald-950/15 border border-emerald-500/30">
          <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold mb-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>Enes Öztürk'ün Akılcı OOP Çözümü</span>
          </div>
          <p className="text-xs text-slate-400 mb-3">
            Kare, Dikdörtgen'in alt sınıfıdır. Sadece 3 satır kurucu kod ile sıfır tekrar:
          </p>
          <pre className="p-3 rounded-lg bg-slate-950 text-xs font-mono text-emerald-300 overflow-x-auto border border-emerald-500/20">
{`// ✅ MÜKEMMEL: Sadece 3 satır, %100 kod tasarrufu!
class Kare extends Dikdortgen {
  constructor(kenar: number) {
    // Dikdortgen'in alan ve çevre fonksiyonları
    // hiçbir tekrar olmadan doğrudan çalışır!
    super(kenar, kenar, 'Kare');
  }
}`}
          </pre>
        </div>
      </div>

      {/* 4 Pillars of OOP Card */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-indigo-400" />
          <span>Bu Ödevde Uygulanan 4 Temel OOP İlkesi</span>
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs font-bold text-indigo-400 uppercase tracking-wide">1. Soyutlama (Abstraction)</div>
            <div className="text-sm font-bold text-white mt-1">Sekil Sınıfı</div>
            <p className="text-xs text-slate-400 mt-1">
              Ortak şablonu belirler; her şekil alan ve çevre hesaplamak zorundadır.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs font-bold text-emerald-400 uppercase tracking-wide">2. Kalıtım (Inheritance)</div>
            <div className="text-sm font-bold text-white mt-1">Kare & Dikdörtgen</div>
            <p className="text-xs text-slate-400 mt-1">
              Kare, Dikdortgen'den miras alarak metotları tekrar yazmaktan kurtulur.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wide">3. Çok Biçimlilik (Polymorphism)</div>
            <div className="text-sm font-bold text-white mt-1">Sekil[] Dizisi</div>
            <p className="text-xs text-slate-400 mt-1">
              Farklı şekiller tek bir döngüde aynı metot adı (alanHesapla) ile hesaplanır.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
            <div className="text-xs font-bold text-cyan-400 uppercase tracking-wide">4. Kapsülleme (Encapsulation)</div>
            <div className="text-sm font-bold text-white mt-1">Veri Doğrulama</div>
            <p className="text-xs text-slate-400 mt-1">
              Üçgen eşitsizliği ve negatif kenar kontrolleri sınıf içinde korunur.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
