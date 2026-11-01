import React from 'react';
import { CheckCircle2, Award, Terminal, Code2, ArrowRight, BookMarked, Layers, FileCode } from 'lucide-react';
import { Book } from '../types/book';

interface HeroSignatureProps {
  books: Book[];
  onOpenTerminal: () => void;
  setActiveTab: (tab: string) => void;
}

export const HeroSignature: React.FC<HeroSignatureProps> = ({ books, onOpenTerminal, setActiveTab }) => {
  const booksOver100Count = books.filter(b => b.pageCount > 100).length;
  const totalPages = books.reduce((acc, b) => acc + b.pageCount, 0);

  return (
    <section className="relative overflow-hidden pt-8 pb-10 border-b border-slate-800/80 bg-gradient-to-b from-slate-900/50 via-slate-950 to-slate-950">
      {/* Subtle background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Title & Description (7 Cols) */}
          <div className="lg:col-span-7 space-y-5">
            {/* Attribution Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs text-amber-300">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span className="font-semibold">Enes Öztürk İmzalı Ödev Çözümü</span>
              <span className="text-amber-500/50">·</span>
              <span className="text-slate-400">Java 102 Stream API</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight text-balance">
              Stream API & Lambda ile <br />
              <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-amber-200 bg-clip-text text-transparent">
                Kitap Listesi İşleme
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              <strong className="text-white">Book</strong> sınıfından üretilen 10 nesneyi <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded text-xs font-mono">ArrayList</code> içinde saklayarak; Java Stream API ve Lambda ifadeleriyle <code className="text-amber-300 bg-slate-900 px-1.5 py-0.5 rounded text-xs font-mono">Map&lt;String, String&gt;</code> dönüşümü ve 100 sayfadan büyük kitapları filtreleme gereksinimlerini interaktif olarak inceleyin.
            </p>

            {/* Assignment Requirements Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">
                  <strong className="text-white font-medium">Book Sınıfı:</strong> isim, sayfa sayısı, yazar, yayın tarihi
                </span>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">
                  <strong className="text-white font-medium">10 Nesne & ArrayList:</strong> Başlangıç koleksiyonu
                </span>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">
                  <strong className="text-white font-medium">Stream to Map:</strong> Kitap İsmi &rarr; Yazar İsmi
                </span>
              </div>

              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span className="text-xs text-slate-300">
                  <strong className="text-white font-medium">Predicate Filter:</strong> Sayfa sayısı &gt; 100 filtresi
                </span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onOpenTerminal}
                className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-500 hover:to-orange-500 shadow-lg shadow-orange-600/20 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Konsol Çıktısını Gör (Terminal)</span>
              </button>

              <button
                onClick={() => setActiveTab('code')}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 transition-all cursor-pointer"
              >
                <FileCode className="w-4 h-4 text-amber-400" />
                <span>Java Kodlarını İncele & Kopyala</span>
              </button>
            </div>
          </div>

          {/* Enes Öztürk Signature & Live Data Matrix Card (5 Cols) */}
          <div className="lg:col-span-5">
            <div className="p-6 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-amber-500/20 shadow-2xl relative">
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-amber-500/20">
                    EÖ
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">Enes Öztürk</h3>
                    <p className="text-xs text-amber-400 font-medium">Java Geliştirici & Mühendis</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-500 block">DURUM</span>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                    Tamamlandı
                  </span>
                </div>
              </div>

              {/* Live Metric Strip */}
              <div className="grid grid-cols-3 gap-3 my-5">
                <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-center">
                  <div className="text-[11px] text-slate-400 font-medium">Koleksiyon</div>
                  <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">{books.length}</div>
                  <div className="text-[10px] text-slate-500 mt-0.5">Book Nesnesi</div>
                </div>

                <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-center">
                  <div className="text-[11px] text-amber-400 font-medium">Map Eşleşme</div>
                  <div className="text-2xl font-bold font-mono text-amber-300 tabular-nums mt-0.5">{books.length}</div>
                  <div className="text-[10px] text-amber-400/70 mt-0.5">Key &rarr; Value</div>
                </div>

                <div className="p-3 rounded-xl bg-emerald-500/5 border border-emerald-500/20 text-center">
                  <div className="text-[11px] text-emerald-400 font-medium">&gt; 100 Sayfa</div>
                  <div className="text-2xl font-bold font-mono text-emerald-300 tabular-nums mt-0.5">{booksOver100Count}</div>
                  <div className="text-[10px] text-emerald-400/70 mt-0.5">Filtrelenen Kitap</div>
                </div>
              </div>

              {/* Signature note */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-300 space-y-1.5">
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Ders: Java 102</span>
                  <span>Modül: Stream API</span>
                </div>
                <p className="text-slate-300 text-xs italic">
                  &ldquo;Stream yapısı veri üzerinde fonksiyonel dönüşümler yaparken orijinal koleksiyonu korur (immutability), lazy evaluation ile performansı maksimize eder.&rdquo;
                </p>
                <div className="text-right text-[11px] text-amber-400 font-semibold pt-1">
                  — Enes Öztürk
                </div>
              </div>

              {/* Navigation jump shortcuts */}
              <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                <button 
                  onClick={() => setActiveTab('map')}
                  className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Map İncele</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setActiveTab('filter')}
                  className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Filtreyi İncele</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
                <button 
                  onClick={() => setActiveTab('pipeline')}
                  className="text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1 transition-colors"
                >
                  <span>Pipeline Simülatörü</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
