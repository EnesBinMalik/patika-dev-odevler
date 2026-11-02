import React from 'react';
import { BookOpen, ShieldCheck, CheckCircle2, Award, Terminal, Cpu } from 'lucide-react';

interface AssignmentBriefProps {
  allPassed: boolean;
  onOpenCertificate: () => void;
}

export const AssignmentBrief: React.FC<AssignmentBriefProps> = ({
  allPassed,
  onOpenCertificate,
}) => {
  return (
    <section id="gorev-detaylari" className="space-y-6">
      {/* Title & Metadata Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          {/* Clean unboxed metadata with typographic separators */}
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span>Rust Programlama Dili</span>
            <span aria-hidden="true">·</span>
            <span>Bellek Güvenliği & Sahiplik (Ownership)</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-medium">Eğitmen: Enes Öztürk</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            Sahiplik, Ödünç Alma ve Dize Dilimleri Laboratuvarı
          </h1>
          <p className="mt-2 text-sm text-slate-400 max-w-3xl leading-relaxed">
            Bu görevde öğrenciler, Rust'ın temel taşları olan <strong className="text-slate-200">sahiplik (ownership)</strong>,{' '}
            <strong className="text-slate-200">ödünç alma (borrowing)</strong> ve <strong className="text-slate-200">referans (&amp;str)</strong> kavramlarını
            uygulayarak iki diziyi birleştiren ve sahiplik kurallarını ihlal etmeden ekrana yazdıran güvenli bir program geliştireceklerdir.
          </p>
        </div>

        {/* Enes Öztürk Author Badge / Signoff Card */}
        <div id="egitmen-bilgisi" className="shrink-0 bg-slate-900/80 border border-slate-800 p-3.5 rounded-xl flex items-center gap-3.5 shadow-sm">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shrink-0">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs text-slate-400">Görev Sorumlusu &amp; İmzası</div>
            <div className="text-sm font-bold text-white flex items-center gap-1.5 font-sans">
              Enes Öztürk
              <span className="text-xs text-emerald-400 font-normal">✓ Onaylı</span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Eğitmen İmzası &amp; Referans No: #EO-RUST-2026
            </div>
          </div>
        </div>
      </div>

      {/* Split Hero visual & Assignment Steps */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        {/* Left: Memory Architecture Diagram Card */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden flex flex-col justify-between">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
              <Cpu className="w-4 h-4 text-amber-400" />
              <span>Rust Donanım ve Bellek Düzeni</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">Stack ↔ Heap</span>
          </div>

          <div className="relative aspect-video w-full bg-slate-950 overflow-hidden">
            <img
              src="/src/assets/images/rust_ownership_memory_hero_1793607646604.jpg"
              alt="Rust Stack and Heap Memory Architecture Schema"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-2 left-3 right-3 text-[11px] text-slate-300 bg-slate-950/70 backdrop-blur-sm p-1.5 rounded border border-slate-800/60">
              <strong className="text-amber-300">İpucu:</strong> &amp;str dilimleri, heap verisini kopyalamadan stack üzerinde yalnızca 16 baytlık (işaretçi + uzunluk) ödünç referansı tutar.
            </div>
          </div>

          <div className="p-4 bg-slate-900/90 text-xs text-slate-400 space-y-1.5">
            <div className="flex items-center gap-2 text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Sıfır Çöp Toplayıcı (Zero GC), Sıfır Bellek Sızıntısı</span>
            </div>
            <p className="text-[11px] leading-relaxed text-slate-400">
              Rust, C/C++ hızını korurken çöp toplayıcıya ihtiyaç duymadan derleme anında (Borrow Checker) bellek güvenliğini garanti eder.
            </p>
          </div>
        </div>

        {/* Right: Steps breakdown */}
        <div className="lg:col-span-7 bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-3">
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Adım Adım Uygulama Rehberi</span>
            </div>

            <ol className="space-y-3 text-xs text-slate-300">
              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">01.</span>
                <div>
                  <strong className="text-white block font-medium">Fonksiyon İmzasını Tanımlayın</strong>
                  İki dizi dilimini (<code className="text-amber-300 font-mono">&amp;str</code>) argüman alan ve iki giriş dizesinin birleştirilmesiyle yeni bir <code className="text-amber-300 font-mono">String</code> döndüren <code className="text-sky-300 font-mono">concatenate_strings</code> adlı bir fonksiyon oluşturun.
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">02.</span>
                <div>
                  <strong className="text-white block font-medium">push_str() ile Dizeyi Oluşturun</strong>
                  <code className="text-sky-300 font-mono">concatenate_strings</code> fonksiyonunun içinde, <code className="text-amber-300 font-mono">result</code> adlı yeni bir String oluşturun (<code className="text-amber-300 font-mono">String::new()</code>). İlk giriş dizisinin içeriğini eklemek için <code className="text-sky-300 font-mono">push_str()</code> yöntemini kullanın, ardından ikinci giriş dizisi dilimini ekleyin.
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">03.</span>
                <div>
                  <strong className="text-white block font-medium">Sonuç Dizesini Geri Getirin (Return)</strong>
                  Fonksiyondan oluşturulan sonuç dizesini (<code className="text-amber-300 font-mono">result</code>) geri döndürerek sahipliğini çağıran fonksiyona devredin.
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">04.</span>
                <div>
                  <strong className="text-white block font-medium">Ana Fonksiyonda Değişkenleri Başlatın</strong>
                  <code className="text-sky-300 font-mono">main</code> fonksiyonunda, iki String değişkeni oluşturun (<code className="text-amber-300 font-mono">string1</code> ve <code className="text-amber-300 font-mono">string2</code>) ve bunları uygun değerlerle başlatın (<code className="text-amber-300 font-mono">String::from(...)</code>).
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">05.</span>
                <div>
                  <strong className="text-white block font-medium">Referanslarla Fonksiyonu Çağırın</strong>
                  <code className="text-amber-300 font-mono">string1</code> ve <code className="text-amber-300 font-mono">string2</code>'ye referanslar içeren <code className="text-sky-300 font-mono">concatenate_strings</code> fonksiyonunu çağırın (<code className="text-amber-300 font-mono">&amp;string1, &amp;string2</code>). Sonucu <code className="text-sky-300 font-mono">concatenated_string</code> adlı yeni bir değişkende depolayın.
                </div>
              </li>

              <li className="flex items-start gap-3 p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/60">
                <span className="font-mono text-amber-400 font-bold text-xs shrink-0 mt-0.5">06. &amp; 07.</span>
                <div>
                  <strong className="text-white block font-medium">Konsola Yazdırın ve Derleyip Test Edin</strong>
                  <code className="text-sky-300 font-mono">concatenated_string</code> değişkenini konsola yazdırın (<code className="text-amber-300 font-mono">println!("{}", ...)</code>). Programı derleyip çalıştırarak beklenen çıktıyı doğrulayın.
                </div>
              </li>
            </ol>
          </div>

          {/* Quick status bar */}
          <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs">
            <span className="text-slate-400 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-slate-400" />
              Hedef: 6/6 Kontrol Listesi Maddesi
            </span>
            {allPassed ? (
              <button
                onClick={onOpenCertificate}
                className="text-amber-400 hover:text-amber-300 font-medium underline flex items-center gap-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                Görev Tamamlandı — İmzalı Belgenizi Alın
              </button>
            ) : (
              <span className="text-slate-400">
                Kod editöründe yönergeleri tamamlayın
              </span>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
