import React from 'react';
import { ArrowRight, BarChart3, BookOpen, Compass, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onExploreClick: () => void;
  onViewExecutiveAnswers: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onExploreClick, onViewExecutiveAnswers }) => {
  return (
    <section className="relative bg-[#FBF9F5] border-b border-stone-200 py-12 lg:py-16 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Editorial Top Kicker */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-stone-600 mb-4 tracking-wide font-medium">
          <span className="uppercase text-amber-900 font-bold">Birleşmiş Milletler SDSN Referansı</span>
          <span aria-hidden="true">·</span>
          <span>155 Ülke Veri Seti (2012–2017+)</span>
          <span aria-hidden="true">·</span>
          <span>6 Boyutlu Sosyal Refah Modeli</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Editorial Headline & Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 leading-[1.18] tracking-tight text-balance">
              Daha Mutlu Toplumlar İçin Dünya Mutluluk Raporu Analizi
            </h1>

            <p className="text-base sm:text-lg text-stone-700 leading-relaxed max-w-2xl">
              İlk kez 2012 yılında yayınlanan Dünya Mutluluk Raporu, toplumların refahını yalnızca ekonomik üretimle değil; 
              <strong className="text-stone-900 font-semibold"> sosyal destek</strong>, 
              <strong className="text-stone-900 font-semibold"> sağlıklı yaşam beklentisi</strong>, 
              <strong className="text-stone-900 font-semibold"> özgürlük</strong>, 
              <strong className="text-stone-900 font-semibold"> kurumsal şeffaflık</strong> ve 
              <strong className="text-stone-900 font-semibold"> cömertlik</strong> gibi 6 temel insani dinamik üzerinden ölçmektedir.
            </p>

            {/* Prominent Signature Badge for Enes Öztürk */}
            <div className="p-4 bg-[#F4EFE6] border border-stone-300 rounded-lg max-w-xl">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-stone-600 uppercase tracking-widest font-semibold">
                    Araştırma & Analitik Modelleme
                  </div>
                  <div className="text-lg font-serif font-bold text-stone-950 mt-0.5">
                    Enes Öztürk
                  </div>
                  <div className="text-xs text-stone-600 mt-0.5">
                    2015–2017 Veri Setleri Kıyaslamalı Raporu ve Vaka Analizi
                  </div>
                </div>
                <div className="hidden sm:flex flex-col items-end">
                  <div className="font-serif italic text-stone-800 text-sm border-b border-stone-400 pb-0.5 px-2">
                    Enes Öztürk
                  </div>
                  <span className="text-[11px] text-stone-500 font-mono mt-1">Onaylı Analist Raporu</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onViewExecutiveAnswers}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white rounded-md text-sm font-medium hover:bg-stone-800 transition-colors shadow-xs cursor-pointer"
              >
                <span>3 Temel Araştırma Sorusunu İncele</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-stone-800 border border-stone-300 rounded-md text-sm font-medium hover:bg-stone-100 transition-colors cursor-pointer"
              >
                <BarChart3 className="w-4 h-4 text-stone-600" />
                <span>6 Faktör & Ülke Sıralamaları</span>
              </button>
            </div>
          </div>

          {/* Right Column: High Fidelity Hero Exhibition Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-lg overflow-hidden border border-stone-300 shadow-md bg-stone-900 aspect-16/10">
              <img
                src="/src/assets/images/world_happiness_hero_1794041979529.jpg"
                alt="World Happiness Report Sergisi ve Küresel İnceleme"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-95 transition-transform duration-500 hover:scale-102"
                onError={(e) => {
                  // Fallback styling if image cannot load
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white text-xs">
                <span className="font-serif font-semibold text-amber-200">World Happiness Analytics 2012–2026</span>
                <p className="text-stone-300 text-[11px] mt-0.5 line-clamp-1">
                  155 ülkenin kolektif refah ve insan odaklı kalkınma göstergeleri sergisi
                </p>
              </div>
            </div>

            {/* Mini metrics bar beneath hero image */}
            <div className="grid grid-cols-3 gap-2 mt-3 text-center">
              <div className="p-2 bg-stone-100/80 border border-stone-200 rounded text-stone-800">
                <div className="text-base font-serif font-bold text-stone-950 tabular-nums">155</div>
                <div className="text-[11px] text-stone-600">Ülke Puanlandı</div>
              </div>
              <div className="p-2 bg-stone-100/80 border border-stone-200 rounded text-stone-800">
                <div className="text-base font-serif font-bold text-stone-950 tabular-nums">6</div>
                <div className="text-[11px] text-stone-600">Sosyal Faktör</div>
              </div>
              <div className="p-2 bg-stone-100/80 border border-stone-200 rounded text-stone-800">
                <div className="text-base font-serif font-bold text-stone-950 tabular-nums">2015-17</div>
                <div className="text-[11px] text-stone-600">Dönemsel Kıyas</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
