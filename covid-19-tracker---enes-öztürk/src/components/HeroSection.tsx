import React from 'react';
import { ShieldAlert, Globe, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  countryName: string;
  countryFlag?: string;
  lastUpdated: number;
  population?: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  countryName,
  countryFlag,
  lastUpdated,
  population,
}) => {
  const formattedUpdate = lastUpdated
    ? new Date(lastUpdated).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      })
    : 'Güncelleniyor...';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 text-white mb-8 shadow-sm border border-slate-800">
      {/* Background Graphic Scrim */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none">
        <img
          src="/src/assets/images/covid_tracker_banner_1793125604830.jpg"
          alt="COVID-19 Araştırma Ağı"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent" />
      </div>

      <div className="relative z-10 p-6 sm:p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="max-w-3xl">
            {/* Editorial Human Kicker - No Pills */}
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-3 tracking-wide">
              <span>Sistem Mimarı: Enes Öztürk</span>
              <span aria-hidden="true">·</span>
              <span>Canlı Epidemiolojik Veri Akışı</span>
              <span aria-hidden="true">·</span>
              <span>disease.sh API</span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3 text-balance">
              COVID-19 Küresel ve Bölgesel Takip Paneli
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Dünya Sağlık Örgütü ve resmi sağlık bakanlıkları kaynaklı anlık enfekte, iyileşen, vefat ve aktif hasta verilerini tek bir panelde analiz edin.
            </p>
          </div>

          {/* Current Selection Summary Card */}
          <div className="bg-slate-800/80 backdrop-blur-sm border border-slate-700/80 rounded-xl p-4 sm:p-5 shrink-0 min-w-[260px]">
            <div className="text-xs text-slate-400 mb-1.5 font-medium">Görüntülenen Bölge</div>
            <div className="flex items-center gap-3 mb-3">
              {countryFlag ? (
                <img
                  src={countryFlag}
                  alt={countryName}
                  referrerPolicy="no-referrer"
                  className="w-8 h-5 object-cover rounded-xs shadow-xs"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <Globe className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="text-lg font-bold text-white leading-tight">
                  {countryName}
                </div>
                {population ? (
                  <div className="text-xs text-slate-400 font-mono-numbers">
                    Nüfus: {population.toLocaleString('tr-TR')}
                  </div>
                ) : null}
              </div>
            </div>

            <div className="pt-2.5 border-t border-slate-700/70 text-xs text-slate-400 flex flex-col gap-1">
              <span className="text-slate-400">Son Güncelleme:</span>
              <span className="text-slate-200 font-medium font-mono-numbers">
                {formattedUpdate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
