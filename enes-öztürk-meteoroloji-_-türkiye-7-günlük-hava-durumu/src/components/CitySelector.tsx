import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, MapPin, Check, Sparkles } from 'lucide-react';
import { TURKEY_CITIES, POPULAR_CITIES, City } from '../data/turkeyCities';
import { useWeather } from '../context/WeatherContext';

export const CitySelector: React.FC = () => {
  const { selectedCity, setSelectedCity, isLocating, locationError } = useWeather();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filter cities by name or plate
  const filteredCities = TURKEY_CITIES.filter((city) => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return true;
    const nameMatch = city.name.toLowerCase().includes(query);
    const plateMatch = city.plate.includes(query) || city.id.toString() === query;
    const regionMatch = city.region.toLowerCase().includes(query);
    return nameMatch || plateMatch || regionMatch;
  });

  const handleSelectCity = (city: City) => {
    setSelectedCity(city);
    setIsOpen(false);
    setSearchQuery('');
  };

  return (
    <div className="w-full relative z-30" ref={dropdownRef}>
      {locationError && (
        <div className="mb-3 px-3 py-2 text-xs rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Dropdown Container */}
        <div className="relative flex-1 max-w-md">
          <label htmlFor="city-select-native" className="sr-only">
            Şehir Seçimi
          </label>

          {/* Custom Trigger Button */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(!isOpen);
              setTimeout(() => inputRef.current?.focus(), 100);
            }}
            className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-slate-800/90 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/50 rounded-xl text-left text-slate-100 shadow-sm transition-all duration-200 group focus:outline-none focus:ring-2 focus:ring-sky-500/40"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-400/20 text-sky-400 font-mono text-xs font-bold flex items-center justify-center shrink-0">
                {selectedCity.plate}
              </div>
              <div className="truncate">
                <div className="text-sm font-semibold text-white tracking-tight flex items-center gap-2">
                  <span className="truncate">{selectedCity.name}</span>
                  <span className="text-xs font-normal text-slate-400">· {selectedCity.region}</span>
                </div>
                <div className="text-xs text-slate-400 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-sky-400/80" />
                  <span>Türkiye Cumhuriyeti · 81 İl Raporu</span>
                </div>
              </div>
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 group-hover:text-sky-400 transition-transform duration-200 shrink-0 ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Accessible Native Dropdown for form auto-fills / quick select */}
          <select
            id="city-select-native"
            value={selectedCity.id}
            onChange={(e) => {
              const city = TURKEY_CITIES.find((c) => c.id === parseInt(e.target.value, 10));
              if (city) setSelectedCity(city);
            }}
            className="sr-only"
            tabIndex={-1}
          >
            {TURKEY_CITIES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.plate} - {c.name} ({c.region})
              </option>
            ))}
          </select>

          {/* Dropdown Menu Modal */}
          {isOpen && (
            <div className="absolute left-0 right-0 top-full mt-2 bg-slate-900 border border-slate-700/80 rounded-xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              {/* Search Bar inside Dropdown */}
              <div className="p-3 border-b border-slate-800 bg-slate-950/50">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Şehir adı veya plaka ara (örn: 34, Kayseri)..."
                    className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* City List */}
              <div className="max-h-64 overflow-y-auto divide-y divide-slate-800/60 p-1">
                {filteredCities.length > 0 ? (
                  filteredCities.map((city) => {
                    const isSelected = city.id === selectedCity.id;
                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleSelectCity(city)}
                        className={`w-full px-3 py-2.5 rounded-lg flex items-center justify-between text-left transition-colors text-xs ${
                          isSelected
                            ? 'bg-sky-500/15 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="w-6 text-center font-mono text-[11px] font-bold text-sky-400/90">
                            {city.plate}
                          </span>
                          <span className="text-sm">{city.name}</span>
                          <span className="text-[11px] text-slate-400">({city.region})</span>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-sky-400" />}
                      </button>
                    );
                  })
                ) : (
                  <div className="p-4 text-center text-xs text-slate-400">
                    "{searchQuery}" aramasıyla eşleşen il bulunamadı.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Quick Pick Metropolitan Cities */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-xs font-medium text-slate-400 hidden xl:inline">Hızlı Seçim:</span>
          {POPULAR_CITIES.map((name) => {
            const city = TURKEY_CITIES.find((c) => c.name === name);
            if (!city) return null;
            const isSelected = city.id === selectedCity.id;
            return (
              <button
                key={city.id}
                type="button"
                onClick={() => setSelectedCity(city)}
                className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all ${
                  isSelected
                    ? 'bg-sky-500 text-white shadow-sm font-semibold'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {city.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
