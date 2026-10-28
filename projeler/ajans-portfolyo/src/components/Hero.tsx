import React from 'react';
import { ArrowRight, PlusCircle, CheckCircle, Database } from 'lucide-react';

interface HeroProps {
  onOpenAddModal: () => void;
  onExplorePortfolio: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAddModal, onExplorePortfolio }) => {
  return (
    <section className="relative overflow-hidden border-b border-neutral-800 bg-neutral-950 py-16 lg:py-24">
      {/* Subtle radial gradient background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-amber-500/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Proposition & Copy */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-2 text-xs font-medium text-amber-400 tracking-wider uppercase">
              <span>Enes Öztürk İmzalı</span>
              <span aria-hidden="true">·</span>
              <span>Dinamik Full-Stack Ajans Mimarisi</span>
              <span aria-hidden="true">·</span>
              <span>PCAT & SmartEdu Entegre</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1] text-balance">
              Dinamik Portföy & Modern Web Mühendisliği
            </h1>

            <p className="text-base sm:text-lg text-neutral-300 font-normal leading-relaxed max-w-2xl text-pretty">
              PCAT projesinde fotoğraf CRUD işlemleriyle başlattığımız dinamik veri yönetimi ve SmartEdu projesindeki aktif mesajlaşma mimarisi, Ajans projemizde profesyonel bir ekosistem olarak buluşuyor. Portföy içeriklerinizi anında ekleyin, düzenleyin ve silin.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onExplorePortfolio}
                className="px-6 py-3.5 text-sm font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-md shadow-amber-500/10 flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <span>Portföyü İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenAddModal}
                className="px-6 py-3.5 text-sm font-semibold text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-all flex items-center gap-2 whitespace-nowrap shrink-0 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4 text-amber-400" />
                <span>+ Yeni Proje Ekle (CRUD)</span>
              </button>
            </div>

            {/* Architectural Trust Indicators (Clean unboxed text) */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>Gerçek Zamanlı CRUD İşlemleri</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Database className="w-4 h-4 text-amber-400" />
                <span>Kalıcı Yerel & Bulut Depolama</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Heroku & GitHub Dağıtıma Hazır</span>
              </span>
            </div>
          </div>

          {/* Right Column: Dominant Focal Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-900 shadow-2xl group">
              <img
                src="/assets/images/agency_hero_studio_1793201689310.jpg"
                alt="Enes Öztürk Ajans İstanbul Çalışma Stüdyosu"
                className="w-full h-auto aspect-video object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/30 to-transparent pointer-events-none" />
              
              <div className="absolute bottom-4 left-4 right-4 text-xs text-neutral-300 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white text-sm">Galata Stüdyo & İnovasyon Merkezi</p>
                  <p className="text-neutral-400">İstanbul, TR · Dijital Mühendislik & Tasarım</p>
                </div>
                <div className="text-right">
                  <span className="text-amber-400 font-bold tabular-nums">100% Canlı</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width KPI Strip below the hero split */}
        <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-xl border border-neutral-800/80 bg-neutral-900/60 backdrop-blur-sm">
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              48+
            </div>
            <div className="text-xs text-neutral-400 mt-1">Tamamlanan Proje</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 tabular-nums tracking-tight">
              %99.4
            </div>
            <div className="text-xs text-neutral-400 mt-1">Müşteri Memnuniyeti</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              3 Kademe
            </div>
            <div className="text-xs text-neutral-400 mt-1">PCAT · SmartEdu · Agency</div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tabular-nums tracking-tight">
              100%
            </div>
            <div className="text-xs text-neutral-400 mt-1">Dinamik CRUD Desteği</div>
          </div>
        </div>
      </div>
    </section>
  );
};
