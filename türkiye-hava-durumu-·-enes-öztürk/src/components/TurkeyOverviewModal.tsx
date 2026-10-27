import React, { useState } from 'react';
import { TurkeyCity, TURKEY_CITIES, normalizeTurkish } from '../data/cities';
import { X, Search, MapPin, Check } from 'lucide-react';

interface TurkeyOverviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCity: TurkeyCity;
  onSelectCity: (city: TurkeyCity) => void;
}

const REGIONS = [
  'Tümü',
  'Marmara',
  'İç Anadolu',
  'Ege',
  'Akdeniz',
  'Karadeniz',
  'Doğu Anadolu',
  'Güneydoğu Anadolu',
];

export const TurkeyOverviewModal: React.FC<TurkeyOverviewModalProps> = ({
  isOpen,
  onClose,
  currentCity,
  onSelectCity,
}) => {
  const [selectedRegion, setSelectedRegion] = useState('Tümü');
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const filteredCities = TURKEY_CITIES.filter((city) => {
    const regionMatches = selectedRegion === 'Tümü' || city.region === selectedRegion;
    if (!regionMatches) return false;

    if (!search.trim()) return true;
    const q = normalizeTurkish(search.trim());
    return (
      normalizeTurkish(city.name).includes(q) ||
      city.id.includes(q) ||
      normalizeTurkish(city.region).includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-4xl max-h-[85vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden">
        {/* Modal Başlığı */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                Türkiye 81 İl Rehberi
              </h2>
              <p className="text-xs text-slate-400">
                Hava durumunu görüntülemek istediğiniz ili listeden veya bölgeden seçin
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Arama ve Bölge Filtreleri */}
        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex flex-col gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="İl adı veya plaka kodu arayın (örn: 06 Ankara, 38 Kayseri)..."
              className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {REGIONS.map((reg) => (
              <button
                key={reg}
                type="button"
                onClick={() => setSelectedRegion(reg)}
                className={`px-3 py-1 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  selectedRegion === reg
                    ? 'bg-sky-500 text-white font-semibold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {reg}
              </button>
            ))}
          </div>
        </div>

        {/* 81 İl Tablosu / Grid */}
        <div className="p-4 overflow-y-auto flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
          {filteredCities.map((city) => {
            const isSelected = city.id === currentCity.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => {
                  onSelectCity(city);
                  onClose();
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                  isSelected
                    ? 'bg-sky-500/20 border-sky-400 text-sky-200 shadow-sm'
                    : 'bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/60 text-slate-300'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700/80 text-sky-400">
                    {city.id}
                  </span>
                  <div className="truncate">
                    <div className="text-sm font-semibold truncate text-white">
                      {city.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {city.region}
                    </div>
                  </div>
                </div>

                {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0 ml-1" />}
              </button>
            );
          })}
        </div>

        {/* Modal Alt Bilgi */}
        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between text-xs text-slate-400">
          <span>Toplam {filteredCities.length} il listelendi</span>
          <span>Enes Öztürk İmzalı Meteoroloji Paneli</span>
        </div>
      </div>
    </div>
  );
};
