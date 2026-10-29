import React, { useState, useMemo } from 'react';
import { Search, Globe2, Languages, Compass, ArrowRight, ExternalLink, Filter, MapPin, Phone, Coins } from 'lucide-react';
import { CONTINENTS, COUNTRIES, LANGUAGES, CountryData } from '../graphql/data.ts';

interface DataExplorerProps {
  onOpenQueryInStudio: (query: string) => void;
}

export const DataExplorer: React.FC<DataExplorerProps> = ({ onOpenQueryInStudio }) => {
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [selectedLanguageCode, setSelectedLanguageCode] = useState<string | null>(null);

  // Filtered countries
  const filteredCountries = useMemo(() => {
    return COUNTRIES.filter(country => {
      // Continent filter
      if (selectedContinent !== 'ALL' && country.continentCode !== selectedContinent) {
        return false;
      }
      // Language filter
      if (selectedLanguageCode && !country.languageCodes.includes(selectedLanguageCode)) {
        return false;
      }
      // Text search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = country.name.toLowerCase().includes(query);
        const matchNative = country.native.toLowerCase().includes(query);
        const matchCode = country.code.toLowerCase().includes(query);
        const matchCapital = country.capital.toLowerCase().includes(query);
        const matchCurrency = country.currency.toLowerCase().includes(query);
        return matchName || matchNative || matchCode || matchCapital || matchCurrency;
      }
      return true;
    });
  }, [selectedContinent, selectedLanguageCode, searchQuery]);

  // Query generation helper
  const handleQuerySingle = (code: string) => {
    const q = `query Single {
  country(code: "${code}") {
    name
    emoji
    continent {
      name
    }
    languages {
      name
      native
    }
  }
}`;
    onOpenQueryInStudio(q);
  };

  const handleQueryContinent = (code: string) => {
    const q = `query ContinentCountries {
  continent(code: "${code}") {
    code
    name
    countries {
      code
      name
      emoji
      capital
    }
  }
}`;
    onOpenQueryInStudio(q);
  };

  const handleQueryLanguage = (code: string) => {
    const q = `query LanguageCountries {
  language(code: "${code}") {
    code
    name
    native
    rtl
    countries {
      code
      name
      emoji
    }
  }
}`;
    onOpenQueryInStudio(q);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header and Filter Controls */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Compass className="w-5 h-5 text-pink-400" />
              İlişkisel Veri Gezgini (Data Explorer)
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Kıtaları, ülkeleri ve konuşulan dilleri grafiksel olarak keşfedin ve GraphQL sorgularını anında üretin.
            </p>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Ülke, kod, başkent, dil ara..."
              className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-pink-500 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-500 hover:text-slate-300"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Continents Filter Bar */}
        <div className="pt-4 flex flex-wrap items-center gap-1.5">
          <span className="text-xs font-semibold text-slate-400 mr-2 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-pink-400" />
            Kıta Filtresi:
          </span>

          <button
            onClick={() => setSelectedContinent('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedContinent === 'ALL'
                ? 'bg-pink-600 text-white font-semibold'
                : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
            }`}
          >
            Tümü ({COUNTRIES.length})
          </button>

          {CONTINENTS.map(continent => {
            const count = COUNTRIES.filter(c => c.continentCode === continent.code).length;
            const isSelected = selectedContinent === continent.code;
            return (
              <button
                key={continent.code}
                onClick={() => setSelectedContinent(continent.code)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-pink-600 text-white font-semibold'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-700/80 border border-slate-700/50'
                }`}
              >
                <span>{continent.name}</span>
                <span className="text-[10px] opacity-70 tabular-nums">({count})</span>
              </button>
            );
          })}

          {selectedLanguageCode && (
            <button
              onClick={() => setSelectedLanguageCode(null)}
              className="ml-auto px-2.5 py-1 bg-amber-500/10 text-amber-300 border border-amber-500/30 rounded-lg text-xs font-medium flex items-center gap-1 hover:bg-amber-500/20"
            >
              <span>Dil Filtresini Temizle ({selectedLanguageCode})</span>
              <span>✕</span>
            </button>
          )}
        </div>
      </div>

      {/* Results Header / Stats */}
      <div className="flex items-center justify-between px-1 text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <span>Gösterilen: <strong className="text-white font-mono">{filteredCountries.length}</strong> ülke</span>
          <span className="text-slate-600">·</span>
          <span>Aktif Kıta: <strong className="text-pink-400">{selectedContinent === 'ALL' ? 'Tümü' : CONTINENTS.find(c => c.code === selectedContinent)?.name}</strong></span>
        </div>

        {selectedContinent !== 'ALL' && (
          <button
            onClick={() => handleQueryContinent(selectedContinent)}
            className="flex items-center gap-1 text-pink-400 hover:text-pink-300 font-medium transition-colors"
          >
            <span>Bu kıtayı GraphQL'de sorgula</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Grid of Countries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCountries.map(country => {
          const continent = CONTINENTS.find(c => c.code === country.continentCode);
          const langs = country.languageCodes
            .map(code => LANGUAGES.find(l => l.code === code))
            .filter(Boolean);

          return (
            <div
              key={country.code}
              className="group bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-pink-500/50 rounded-xl p-4 transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-pink-500/5"
            >
              <div>
                {/* Card Top: Flag, Name, Code */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="text-3xl leading-none select-none" role="img" aria-label={country.name}>
                      {country.emoji}
                    </span>
                    <div>
                      <h3 className="font-bold text-white group-hover:text-pink-300 transition-colors text-sm">
                        {country.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">{country.native}</p>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 font-mono text-[11px] font-semibold bg-slate-800 border border-slate-700 text-slate-300 rounded">
                    {country.code}
                  </span>
                </div>

                {/* Country Key Details */}
                <div className="space-y-1.5 text-xs text-slate-400 mb-3 pt-2 border-t border-slate-800/80">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Globe2 className="w-3 h-3 text-slate-500" />
                      Kıta:
                    </span>
                    <button
                      onClick={() => setSelectedContinent(country.continentCode)}
                      className="text-slate-300 hover:text-pink-400 font-medium transition-colors"
                    >
                      {continent?.name || country.continentCode}
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <MapPin className="w-3 h-3 text-slate-500" />
                      Başkent:
                    </span>
                    <span className="text-slate-300">{country.capital || '—'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Coins className="w-3 h-3 text-slate-500" />
                      Para Birimi:
                    </span>
                    <span className="font-mono text-slate-300">{country.currency || '—'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1 text-slate-500">
                      <Phone className="w-3 h-3 text-slate-500" />
                      Telefon Kodu:
                    </span>
                    <span className="font-mono text-slate-300">+{country.phone}</span>
                  </div>
                </div>

                {/* Spoken Languages */}
                <div className="pt-2 border-t border-slate-800/80">
                  <div className="text-[11px] font-medium text-slate-500 mb-1.5 flex items-center gap-1">
                    <Languages className="w-3 h-3 text-pink-400" />
                    Konuşulan Diller:
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {langs.map(lang => (
                      <button
                        key={lang?.code}
                        onClick={() => setSelectedLanguageCode(lang?.code || null)}
                        title={`${lang?.name} (${lang?.native}) - Filtrele`}
                        className="px-2 py-0.5 rounded text-[11px] bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition-colors"
                      >
                        {lang?.name} <span className="text-slate-500 text-[10px]">({lang?.native})</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Button: Query in Studio */}
              <div className="pt-3 mt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedCountry(country)}
                  className="text-xs text-slate-400 hover:text-white transition-colors"
                >
                  Detaylar
                </button>

                <button
                  onClick={() => handleQuerySingle(country.code)}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium text-pink-400 hover:text-pink-300 bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 rounded-md transition-colors"
                >
                  <span>GraphQL Single ({country.code})</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredCountries.length === 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-12 text-center">
          <Globe2 className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-semibold text-white">Arama Kriterine Uygun Ülke Bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1">Lütfen filtreleri sıfırlamayı veya farklı bir arama terimi girmeyi deneyin.</p>
          <button
            onClick={() => {
              setSelectedContinent('ALL');
              setSelectedLanguageCode(null);
              setSearchQuery('');
            }}
            className="mt-4 px-4 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-lg text-xs font-semibold"
          >
            Tüm Filtreleri Temizle
          </button>
        </div>
      )}

      {/* Country Detail Modal */}
      {selectedCountry && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setSelectedCountry(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
            >
              ✕
            </button>

            <div className="flex items-center gap-4 mb-4">
              <span className="text-5xl">{selectedCountry.emoji}</span>
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  {selectedCountry.name}
                  <span className="text-xs font-mono px-2 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700">
                    {selectedCountry.code}
                  </span>
                </h3>
                <p className="text-sm text-slate-400">{selectedCountry.native}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-slate-300 mb-6 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
              <div>
                <span className="text-slate-500 block mb-0.5">Kıta:</span>
                <span className="font-semibold text-white">
                  {CONTINENTS.find(c => c.code === selectedCountry.continentCode)?.name} ({selectedCountry.continentCode})
                </span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Başkent:</span>
                <span className="font-semibold text-white">{selectedCountry.capital}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Para Birimi:</span>
                <span className="font-mono font-semibold text-white">{selectedCountry.currency}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Telefon Kodu:</span>
                <span className="font-mono font-semibold text-white">+{selectedCountry.phone}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Unicode Emoji:</span>
                <span className="font-mono text-slate-400">{selectedCountry.emojiU}</span>
              </div>
              <div>
                <span className="text-slate-500 block mb-0.5">Dil Sayısı:</span>
                <span className="font-semibold text-white">{selectedCountry.languageCodes.length}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-semibold text-slate-400 mb-2">Konuşulan Diller & Detayları:</h4>
              <div className="space-y-2">
                {selectedCountry.languageCodes.map(code => {
                  const lang = LANGUAGES.find(l => l.code === code);
                  return (
                    <div
                      key={code}
                      className="flex items-center justify-between p-2.5 bg-slate-800/60 rounded-lg text-xs"
                    >
                      <div>
                        <span className="font-semibold text-white">{lang?.name}</span>
                        <span className="text-slate-400 ml-2">({lang?.native})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {lang?.rtl && (
                          <span className="px-1.5 py-0.5 text-[10px] bg-amber-900/60 text-amber-200 rounded">
                            RTL
                          </span>
                        )}
                        <button
                          onClick={() => {
                            setSelectedCountry(null);
                            handleQueryLanguage(code);
                          }}
                          className="text-pink-400 hover:text-pink-300 font-mono text-[11px]"
                        >
                          Sorgula →
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedCountry(null)}
                className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  const cCode = selectedCountry.code;
                  setSelectedCountry(null);
                  handleQuerySingle(cCode);
                }}
                className="px-4 py-2 text-xs font-semibold bg-pink-600 hover:bg-pink-500 text-white rounded-lg shadow-sm"
              >
                GraphQL Studio'da Çalıştır
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
