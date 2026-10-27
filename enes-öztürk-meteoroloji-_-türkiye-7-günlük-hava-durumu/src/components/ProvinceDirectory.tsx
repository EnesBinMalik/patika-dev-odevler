import React, { useState } from 'react';
import { MapPin, Filter } from 'lucide-react';
import { TURKEY_CITIES, City } from '../data/turkeyCities';
import { useWeather } from '../context/WeatherContext';

const REGIONS = [
  'Tümü',
  'Marmara',
  'İç Anadolu',
  'Ege',
  'Akdeniz',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
] as const;

export const ProvinceDirectory: React.FC = () => {
  const { selectedCity, setSelectedCity } = useWeather();
  const [activeRegion, setActiveRegion] = useState<string>('Tümü');

  const filtered = TURKEY_CITIES.filter((city) => {
    if (activeRegion === 'Tümü') return true;
    return city.region === activeRegion;
  });

  const handleCityClick = (city: City) => {
    setSelectedCity(city);
    // Smooth scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <section id="turkiye-haritasi" className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-400" />
            <h3 className="text-base font-bold text-white tracking-tight">
              Türkiye 81 İl Hava Durumu Rehberi
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            İstediğiniz ilin üzerine tıklayarak anlık ve 7 günlük meteoroloji tahminini görüntüleyin.
          </p>
        </div>

        {/* Region filter buttons */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <Filter className="w-3.5 h-3.5 text-slate-400 mr-1 hidden sm:inline" />
          {REGIONS.map((region) => (
            <button
              key={region}
              type="button"
              onClick={() => setActiveRegion(region)}
              className={`px-2.5 py-1 text-[11px] font-medium rounded-lg transition-colors ${
                activeRegion === region
                  ? 'bg-sky-500 text-white font-semibold shadow-sm'
                  : 'bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700/60'
              }`}
            >
              {region}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Cities */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
        {filtered.map((city) => {
          const isSelected = city.id === selectedCity.id;
          return (
            <button
              key={city.id}
              type="button"
              onClick={() => handleCityClick(city)}
              className={`p-2 rounded-lg flex items-center justify-between text-left transition-all ${
                isSelected
                  ? 'bg-sky-500/20 border border-sky-400 text-white font-bold ring-1 ring-sky-400/40'
                  : 'bg-slate-800/50 hover:bg-slate-800 border border-slate-700/50 text-slate-300 hover:text-white'
              }`}
            >
              <span className="text-xs truncate">{city.name}</span>
              <span className="text-[10px] font-mono text-slate-400 shrink-0 ml-1">
                {city.plate}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
};
