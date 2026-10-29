import React from 'react';
import { RotateCcw, SlidersHorizontal, MapPin, User, Dna, Activity, LayoutGrid, ListFilter } from 'lucide-react';
import { FilterState, LocationItem, ViewMode } from '../types/rickAndMorty';
import { playClickSound, playZapSound } from '../utils/audioEffects';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (newFilters: Partial<FilterState>) => void;
  onResetFilters: () => void;
  locationsList: LocationItem[];
  isLoadingLocations: boolean;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  totalResultsCount: number;
}

const GENDER_OPTIONS = [
  { value: 'all', label: 'Tüm Cinsiyetler' },
  { value: 'Male', label: 'Erkek (Male)' },
  { value: 'Female', label: 'Kadın (Female)' },
  { value: 'Genderless', label: 'Cinsiyetsiz (Genderless)' },
  { value: 'unknown', label: 'Bilinmiyor (Unknown)' },
];

const SPECIES_OPTIONS = [
  { value: 'all', label: 'Tüm Türler' },
  { value: 'Human', label: 'İnsan (Human)' },
  { value: 'Alien', label: 'Uzaylı (Alien)' },
  { value: 'Humanoid', label: 'İnsansı (Humanoid)' },
  { value: 'Robot', label: 'Robot' },
  { value: 'Poopybutthole', label: 'Poopybutthole' },
  { value: 'Mythological Creature', label: 'Mitolojik Yaratık' },
  { value: 'Animal', label: 'Hayvan (Animal)' },
  { value: 'Cronenberg', label: 'Cronenberg' },
  { value: 'Disease', label: 'Hastalık (Disease)' },
];

const STATUS_OPTIONS = [
  { value: 'all', label: 'Tüm Durumlar', color: 'bg-slate-400' },
  { value: 'Alive', label: 'Yaşıyor (Alive)', color: 'bg-emerald-400' },
  { value: 'Dead', label: 'Ölü (Dead)', color: 'bg-rose-500' },
  { value: 'unknown', label: 'Bilinmiyor (Unknown)', color: 'bg-slate-400' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  locationsList,
  isLoadingLocations,
  viewMode,
  onViewModeChange,
  totalResultsCount,
}) => {
  const isFiltered =
    Boolean(filters.name.trim()) ||
    (filters.status && filters.status !== 'all') ||
    (filters.species && filters.species !== 'all') ||
    (filters.gender && filters.gender !== 'all') ||
    (filters.locationId && filters.locationId !== 'all');

  const activeFiltersCount = [
    Boolean(filters.name.trim()),
    filters.status && filters.status !== 'all',
    filters.species && filters.species !== 'all',
    filters.gender && filters.gender !== 'all',
    filters.locationId && filters.locationId !== 'all',
  ].filter(Boolean).length;

  return (
    <div className="bg-[#0b101b]/90 border border-slate-800/90 rounded-2xl p-4 sm:p-5 shadow-xl shadow-black/40">
      {/* Top row: Section Header, View Mode, Clear button */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-chakra text-sm sm:text-base font-bold text-white flex items-center gap-2">
              Filtreleme & Arama Seçenekleri
              {activeFiltersCount > 0 && (
                <span className="px-2 py-0.5 text-xs font-mono-code rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  {activeFiltersCount} aktif filtre
                </span>
              )}
            </h3>
            <p className="text-xs text-slate-400">
              Cinsiyet, tür, durum veya konuma göre sonuçları daraltın
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* View Mode Switcher */}
          <div className="flex items-center bg-slate-900 border border-slate-700/80 rounded-xl p-0.5">
            <button
              onClick={() => {
                playClickSound();
                onViewModeChange('grid');
              }}
              title="Kart Görünümü"
              className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'grid'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden md:inline">Kart</span>
            </button>
            <button
              onClick={() => {
                playClickSound();
                onViewModeChange('table');
              }}
              title="Tablo Görünümü"
              className={`p-2 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
                viewMode === 'table'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ListFilter className="w-4 h-4" />
              <span className="hidden md:inline">Tablo</span>
            </button>
          </div>

          {/* Clear Filters Button */}
          <button
            onClick={() => {
              playZapSound();
              onResetFilters();
            }}
            disabled={!isFiltered}
            title="Tüm Filtreleri Temizle"
            className={`px-3 py-2 rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              isFiltered
                ? 'bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 border border-rose-500/40 shadow-sm shadow-rose-950/50'
                : 'bg-slate-900/60 text-slate-500 border border-slate-800 cursor-not-allowed opacity-50'
            }`}
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isFiltered ? 'animate-spin-reverse' : ''}`} />
            <span>Filtreleri Temizle</span>
          </button>
        </div>
      </div>

      {/* Filter Select Controls Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* 1. Cinsiyet Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-teal-400" />
            <span>Cinsiyet (Gender)</span>
          </label>
          <div className="relative">
            <select
              value={filters.gender || 'all'}
              onChange={(e) => {
                playClickSound();
                onFilterChange({ gender: e.target.value });
              }}
              className="w-full bg-slate-900 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition cursor-pointer appearance-none"
            >
              {GENDER_OPTIONS.map((g) => (
                <option key={g.value} value={g.value} className="bg-slate-900 text-slate-200">
                  {g.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 2. Tür Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Dna className="w-3.5 h-3.5 text-emerald-400" />
            <span>Tür (Species)</span>
          </label>
          <div className="relative">
            <select
              value={filters.species || 'all'}
              onChange={(e) => {
                playClickSound();
                onFilterChange({ species: e.target.value });
              }}
              className="w-full bg-slate-900 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition cursor-pointer appearance-none"
            >
              {SPECIES_OPTIONS.map((s) => (
                <option key={s.value} value={s.value} className="bg-slate-900 text-slate-200">
                  {s.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 3. Durum Filter */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <Activity className="w-3.5 h-3.5 text-lime-400" />
            <span>Yaşam Durumu (Status)</span>
          </label>
          <div className="relative">
            <select
              value={filters.status || 'all'}
              onChange={(e) => {
                playClickSound();
                onFilterChange({ status: e.target.value });
              }}
              className="w-full bg-slate-900 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition cursor-pointer appearance-none"
            >
              {STATUS_OPTIONS.map((st) => (
                <option key={st.value} value={st.value} className="bg-slate-900 text-slate-200">
                  {st.label}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>

        {/* 4. Konum Filter (Location) */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-cyan-400" />
            <span>Konum (Location)</span>
          </label>
          <div className="relative">
            <select
              value={filters.locationId || 'all'}
              onChange={(e) => {
                playClickSound();
                const sel = locationsList.find((loc) => loc.id === e.target.value);
                onFilterChange({
                  locationId: e.target.value,
                  locationName: sel ? sel.name : '',
                });
              }}
              className="w-full bg-slate-900 text-slate-200 text-xs sm:text-sm rounded-xl px-3 py-2.5 border border-slate-700/80 focus:border-emerald-400 focus:outline-none focus:ring-1 focus:ring-emerald-400 transition cursor-pointer appearance-none"
            >
              <option value="all" className="bg-slate-900 text-slate-200">
                {isLoadingLocations ? 'Konumlar yükleniyor...' : 'Tüm Konumlar (Boyutlar)'}
              </option>
              {locationsList.map((loc) => (
                <option key={loc.id} value={loc.id} className="bg-slate-900 text-slate-200">
                  {loc.name} {loc.dimension && loc.dimension !== 'unknown' ? `(${loc.dimension})` : ''}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
                <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Active filter badges bar if any active */}
      {isFiltered && (
        <div className="mt-4 pt-3 border-t border-slate-800/80 flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400">Aktif Kriterler:</span>

          {filters.name.trim() && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono-code">
              Ad: "{filters.name}"
              <button
                onClick={() => onFilterChange({ name: '' })}
                className="hover:text-white cursor-pointer"
                title="Kaldır"
              >
                ✕
              </button>
            </span>
          )}

          {filters.gender && filters.gender !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-500/10 text-teal-300 border border-teal-500/30 text-xs font-mono-code">
              Cinsiyet: {GENDER_OPTIONS.find((g) => g.value === filters.gender)?.label}
              <button
                onClick={() => onFilterChange({ gender: 'all' })}
                className="hover:text-white cursor-pointer"
                title="Kaldır"
              >
                ✕
              </button>
            </span>
          )}

          {filters.species && filters.species !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-300 border border-emerald-500/30 text-xs font-mono-code">
              Tür: {SPECIES_OPTIONS.find((s) => s.value === filters.species)?.label}
              <button
                onClick={() => onFilterChange({ species: 'all' })}
                className="hover:text-white cursor-pointer"
                title="Kaldır"
              >
                ✕
              </button>
            </span>
          )}

          {filters.status && filters.status !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-lime-500/10 text-lime-300 border border-lime-500/30 text-xs font-mono-code">
              Durum: {STATUS_OPTIONS.find((st) => st.value === filters.status)?.label}
              <button
                onClick={() => onFilterChange({ status: 'all' })}
                className="hover:text-white cursor-pointer"
                title="Kaldır"
              >
                ✕
              </button>
            </span>
          )}

          {filters.locationId && filters.locationId !== 'all' && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-mono-code">
              Konum: {filters.locationName || 'Seçili Konum'}
              <button
                onClick={() => onFilterChange({ locationId: 'all', locationName: '' })}
                className="hover:text-white cursor-pointer"
                title="Kaldır"
              >
                ✕
              </button>
            </span>
          )}

          <span className="ml-auto text-xs text-slate-400 font-mono-code">
            {totalResultsCount} eşleşme bulundu
          </span>
        </div>
      )}
    </div>
  );
};
