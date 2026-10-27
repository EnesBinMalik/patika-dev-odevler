import React, { useState, useRef, useEffect } from 'react';
import { Globe, Search, ChevronDown, Check, X } from 'lucide-react';
import { CovidCountryData } from '../types/covid';

interface CountryPickerProps {
  countries: CovidCountryData[];
  selectedCountry: string; // 'global' or country name
  onSelectCountry: (countryName: string) => void;
  loading: boolean;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  countries,
  selectedCountry,
  onSelectCountry,
  loading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

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

  const filteredCountries = countries.filter((c) =>
    c.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (c.countryInfo.iso2 && c.countryInfo.iso2.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (c.countryInfo.iso3 && c.countryInfo.iso3.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const currentCountryObj = countries.find(
    (c) => c.country.toLowerCase() === selectedCountry.toLowerCase()
  );

  const quickPicks = [
    { label: 'Tüm Dünya', value: 'global' },
    { label: 'Türkiye', value: 'Turkey' },
    { label: 'ABD', value: 'USA' },
    { label: 'Almanya', value: 'Germany' },
    { label: 'Birleşik Krallık', value: 'UK' },
    { label: 'Fransa', value: 'France' },
    { label: 'İtalya', value: 'Italy' },
    { label: 'Japonya', value: 'Japan' },
  ];

  return (
    <section id="ulke-secici" className="mb-8" ref={dropdownRef}>
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <label
              htmlFor="country-dropdown-btn"
              className="block text-sm font-bold text-slate-800 mb-1"
            >
              Ülke Seçimi (Detaylı Analiz İçin Ülke Belirleyin)
            </label>
            <p className="text-xs text-slate-500">
              Kartlardaki ve aşağıdaki grafiklerdeki verileri anında seçilen ülkeye göre güncelleyin.
            </p>
          </div>

          {/* Quick Select Buttons (clean segmented control) */}
          <div className="flex flex-wrap items-center gap-1.5">
            {quickPicks.map((pick) => {
              const isSelected = selectedCountry.toLowerCase() === pick.value.toLowerCase();
              return (
                <button
                  key={pick.value}
                  onClick={() => {
                    onSelectCountry(pick.value);
                    setIsOpen(false);
                  }}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                  }`}
                >
                  {pick.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dropdown Box Trigger */}
        <div className="mt-4 relative">
          <button
            id="country-dropdown-btn"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            disabled={loading}
            className="w-full flex items-center justify-between px-4 py-3 bg-slate-50 hover:bg-slate-100/80 border border-slate-300 rounded-lg text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <div className="flex items-center gap-3 truncate">
              {selectedCountry === 'global' ? (
                <>
                  <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                    <Globe className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-semibold text-slate-900">
                    Tüm Dünya (Global Veriler)
                  </span>
                </>
              ) : currentCountryObj ? (
                <>
                  <img
                    src={currentCountryObj.countryInfo.flag}
                    alt={currentCountryObj.country}
                    referrerPolicy="no-referrer"
                    className="w-6 h-4 object-cover rounded-xs shadow-2xs shrink-0"
                  />
                  <span className="text-sm font-semibold text-slate-900">
                    {currentCountryObj.country}
                  </span>
                  <span className="text-xs text-slate-500 font-mono-numbers">
                    ({currentCountryObj.cases.toLocaleString('tr-TR')} vaka)
                  </span>
                </>
              ) : (
                <span className="text-sm font-semibold text-slate-900">
                  {selectedCountry}
                </span>
              )}
            </div>
            <ChevronDown
              className={`w-4 h-4 text-slate-500 transition-transform ${
                isOpen ? 'rotate-180' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Modal/Panel */}
          {isOpen && (
            <div className="absolute z-50 left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-xl overflow-hidden max-h-96 flex flex-col">
              {/* Search input in dropdown */}
              <div className="p-3 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Ülke adı veya kodu arayın (örn. Turkey, DE, USA)..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                  className="w-full text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-800 placeholder-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="p-1 text-slate-400 hover:text-slate-600 rounded"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Country List Options */}
              <div className="overflow-y-auto divide-y divide-slate-100 flex-1">
                {/* Global option */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectCountry('global');
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2.5 text-left text-sm hover:bg-indigo-50/60 transition-colors cursor-pointer ${
                    selectedCountry === 'global' ? 'bg-indigo-50/80 font-bold text-indigo-900' : 'text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-sm bg-indigo-100 text-indigo-700 flex items-center justify-center shrink-0">
                      <Globe className="w-3.5 h-3.5" />
                    </div>
                    <span>Tüm Dünya (Global Veriler)</span>
                  </div>
                  {selectedCountry === 'global' && (
                    <Check className="w-4 h-4 text-indigo-600" />
                  )}
                </button>

                {/* Country items */}
                {filteredCountries.map((c) => {
                  const isSelected = selectedCountry.toLowerCase() === c.country.toLowerCase();
                  return (
                    <button
                      key={c.country}
                      type="button"
                      onClick={() => {
                        onSelectCountry(c.country);
                        setIsOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-4 py-2 text-left text-xs sm:text-sm hover:bg-slate-50 transition-colors cursor-pointer ${
                        isSelected ? 'bg-indigo-50/80 font-bold text-indigo-900' : 'text-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={c.countryInfo.flag}
                          alt={c.country}
                          referrerPolicy="no-referrer"
                          className="w-5 h-3.5 object-cover rounded-2xs shadow-2xs shrink-0"
                        />
                        <span className="truncate">{c.country}</span>
                        {c.countryInfo.iso2 && (
                          <span className="text-[10px] text-slate-400 font-mono uppercase">
                            {c.countryInfo.iso2}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-slate-400 font-mono-numbers">
                          {c.cases.toLocaleString('tr-TR')}
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-indigo-600" />}
                      </div>
                    </button>
                  );
                })}

                {filteredCountries.length === 0 && (
                  <div className="p-6 text-center text-xs text-slate-500">
                    "{searchTerm}" ile eşleşen ülke bulunamadı.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
