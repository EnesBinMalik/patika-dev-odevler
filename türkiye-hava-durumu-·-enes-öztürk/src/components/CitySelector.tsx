import React, { useState, useRef, useEffect } from 'react';
import { TurkeyCity, TURKEY_CITIES, normalizeTurkish } from '../data/cities';
import { MapPin, Search, ChevronDown, Navigation, Check, Sparkles } from 'lucide-react';

interface CitySelectorProps {
  currentCity: TurkeyCity;
  onSelectCity: (city: TurkeyCity) => void;
  onRequestGeolocation: () => void;
  isLocating: boolean;
}

export const CitySelector: React.FC<CitySelectorProps> = ({
  currentCity,
  onSelectCity,
  onRequestGeolocation,
  isLocating,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    } else {
      setSearchQuery('');
    }
  }, [isOpen]);

  const filteredCities = TURKEY_CITIES.filter((city) => {
    if (!searchQuery.trim()) return true;
    const q = normalizeTurkish(searchQuery.trim());
    const nameMatch = normalizeTurkish(city.name).includes(q);
    const idMatch = city.id.includes(q);
    const regionMatch = normalizeTurkish(city.region).includes(q);
    return nameMatch || idMatch || regionMatch;
  });

  const popularCities = TURKEY_CITIES.filter((c) => c.isPopular);

  return (
    <div className="w-full flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 relative z-30">
      {/* Şehir Seçim Dropdown & Konum Butonu Grubu */}
      <div className="flex items-center gap-2 flex-1 max-w-xl">
        <div ref={dropdownRef} className="relative flex-1">
          {/* Ana Dropdown Açma Butonu */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-500/80 text-left transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400 group cursor-pointer"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="w-7 h-7 rounded-lg bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-xs font-mono font-bold text-sky-400 shrink-0">
                {currentCity.id}
              </span>
              <div className="flex flex-col truncate">
                <span className="text-base font-semibold text-slate-100 group-hover:text-sky-300 transition-colors truncate">
                  {currentCity.name}
                </span>
                <span className="text-[11px] text-slate-400 truncate">
                  {currentCity.region} Bölgesi · Türkiye
                </span>
              </div>
            </div>

            <ChevronDown
              className={`w-4 h-4 text-slate-400 transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180 text-sky-400' : ''
              }`}
            />
          </button>

          {/* Açılır Liste Paneli (81 İl) */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 max-h-96 flex flex-col">
              {/* Arama Kutusu */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/50 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="İl adı, plaka veya bölge yazın (örn: 38, Kayseri)..."
                  className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-xs text-slate-400 hover:text-slate-200 px-1"
                  >
                    Temizle
                  </button>
                )}
              </div>

              {/* Hızlı Şehir Önerileri */}
              {!searchQuery && (
                <div className="px-3 py-2 bg-slate-950/30 border-b border-slate-800/80">
                  <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-400" />
                    Popüler Şehirler
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {popularCities.map((pc) => (
                      <button
                        key={pc.id}
                        type="button"
                        onClick={() => {
                          onSelectCity(pc);
                          setIsOpen(false);
                        }}
                        className={`text-xs px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1.5 ${
                          currentCity.id === pc.id
                            ? 'bg-sky-500 text-white font-medium'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        <span className="text-[10px] opacity-70 font-mono">{pc.id}</span>
                        <span>{pc.name}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 81 İl Kaydırılabilir Listesi */}
              <div className="overflow-y-auto flex-1 divide-y divide-slate-800/50">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => {
                    const isSelected = city.id === currentCity.id;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => {
                          onSelectCity(city);
                          setIsOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 flex items-center justify-between text-left transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-sky-500/15 text-sky-300 font-medium'
                            : 'hover:bg-slate-800/70 text-slate-200'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className="font-mono text-xs w-6 text-slate-400 tabular-nums">
                            {city.id}
                          </span>
                          <div>
                            <span className="text-sm font-medium">{city.name}</span>
                            <span className="text-xs text-slate-500 ml-2">
                              {city.region}
                            </span>
                          </div>
                        </div>

                        {isSelected && <Check className="w-4 h-4 text-sky-400 shrink-0" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-6 text-center text-sm text-slate-400">
                    &quot;{searchQuery}&quot; ile eşleşen bir Türkiye şehri bulunamadı.
                  </div>
                )}
              </div>

              {/* Liste Altı Bilgisi */}
              <div className="px-4 py-2 border-t border-slate-800 bg-slate-950/60 text-[11px] text-slate-500 flex items-center justify-between">
                <span>Toplam 81 İl</span>
                <span>Enes Öztürk Meteoroloji Sistemi</span>
              </div>
            </div>
          )}
        </div>

        {/* Konumumu Kullan Butonu */}
        <button
          type="button"
          onClick={onRequestGeolocation}
          disabled={isLocating}
          title="Mevcut konumunuza göre en yakın ili belirleyin"
          className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-sky-500 hover:text-sky-300 text-slate-200 text-sm font-medium transition-all shadow-sm focus-visible:ring-2 focus-visible:ring-sky-400 shrink-0 disabled:opacity-60 cursor-pointer"
        >
          <Navigation
            className={`w-4 h-4 ${
              isLocating ? 'animate-spin text-sky-400' : 'text-sky-400'
            }`}
          />
          <span className="hidden sm:inline">Konumumu Kullan</span>
        </button>
      </div>

      {/* Hızlı İl Çubuğu (Geniş Ekranda) */}
      <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
        <span className="text-slate-500 text-[11px] uppercase tracking-wider mr-1 flex items-center gap-1">
          <MapPin className="w-3 h-3 text-slate-400" />
          Hızlı:
        </span>
        {popularCities.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => onSelectCity(c)}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              currentCity.id === c.id
                ? 'bg-sky-500 text-white font-semibold shadow-sm'
                : 'bg-slate-900/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
};
