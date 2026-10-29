/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useTransition } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { SearchBar } from './components/SearchBar';
import { FilterBar } from './components/FilterBar';
import { CharacterCard } from './components/CharacterCard';
import { CharacterTableView } from './components/CharacterTableView';
import { CharacterModal } from './components/CharacterModal';
import { Pagination } from './components/Pagination';
import { FavoritesModal } from './components/FavoritesModal';
import { Footer } from './components/Footer';

import {
  Character,
  FilterState,
  LocationItem,
  PageInfo,
  ViewMode,
} from './types/rickAndMorty';
import {
  fetchCharacters,
  fetchCharacterById,
  fetchLocationsList,
} from './services/rickAndMortyApi';
import {
  initAudioPref,
  playClickSound,
  playPortalSound,
  playZapSound,
} from './utils/audioEffects';
import {
  AlertCircle,
  Loader2,
  Sparkles,
  RotateCcw,
  Compass,
} from 'lucide-react';

const INITIAL_FILTERS: FilterState = {
  name: '',
  status: 'all',
  species: 'all',
  gender: 'all',
  locationId: 'all',
  locationName: '',
};

export default function App() {
  const [, startTransition] = useTransition();

  // Search & Filters State
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [viewMode, setViewMode] = useState<ViewMode>('grid');

  // Characters Data State
  const [characters, setCharacters] = useState<Character[]>([]);
  const [pageInfo, setPageInfo] = useState<PageInfo>({
    count: 0,
    pages: 1,
    next: null,
    prev: null,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Locations for dropdown filter
  const [locationsList, setLocationsList] = useState<LocationItem[]>([]);
  const [isLoadingLocations, setIsLoadingLocations] = useState<boolean>(false);

  // Selected Character for Modal
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);
  const [isLoadingRandom, setIsLoadingRandom] = useState<boolean>(false);

  // Favorites in LocalStorage
  const [favorites, setFavorites] = useState<Character[]>(() => {
    try {
      const stored = localStorage.getItem('rm_favorites_enes');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);

  // Audio preference
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => initAudioPref());

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('rm_favorites_enes', JSON.stringify(favorites));
    } catch (e) {
      console.error('Failed to save favorites to localStorage', e);
    }
  }, [favorites]);

  // Load locations on mount
  useEffect(() => {
    let isCancelled = false;
    const loadLocations = async () => {
      setIsLocationsLoading(true);
      try {
        // Load first 2 pages of popular locations (40 locations)
        const res1 = await fetchLocationsList('', 1);
        const res2 = await fetchLocationsList('', 2);
        if (!isCancelled) {
          const combined = [...res1.locations, ...res2.locations];
          // deduplicate by id
          const unique = Array.from(new Map(combined.map((l) => [l.id, l])).values());
          setLocationsList(unique);
        }
      } catch (err) {
        console.error('Could not load locations', err);
      } finally {
        if (!isCancelled) {
          setIsLocationsLoading(false);
        }
      }
    };

    loadLocations();
    return () => {
      isCancelled = true;
    };
  }, []);

  function setIsLocationsLoading(val: boolean) {
    setIsLoadingLocations(val);
  }

  // Debounce search input and sync to filters.name
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.name) {
        setFilters((prev) => ({ ...prev, name: searchTerm }));
        setCurrentPage(1);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.name]);

  // Main data fetch on page or filters change
  const loadCharacters = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetchCharacters(currentPage, filters);
      setCharacters(response.results);
      setPageInfo(response.info);
    } catch (err) {
      console.error('Failed to fetch characters', err);
      setError(
        err instanceof Error ? err.message : 'Karakterler yüklenirken bir hata oluştu.'
      );
      setCharacters([]);
      setPageInfo({ count: 0, pages: 0, next: null, prev: null });
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, filters]);

  useEffect(() => {
    loadCharacters();
  }, [loadCharacters]);

  // Handle filter changes
  const handleFilterChange = (newFilters: Partial<FilterState>) => {
    startTransition(() => {
      setFilters((prev) => ({ ...prev, ...newFilters }));
      setCurrentPage(1);
    });
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setSearchTerm('');
    setFilters(INITIAL_FILTERS);
    setCurrentPage(1);
  };

  // Handle favorite toggle
  const handleToggleFavorite = (char: Character) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.id === char.id);
      if (exists) {
        return prev.filter((f) => f.id !== char.id);
      } else {
        return [...prev, char];
      }
    });
  };

  const handleRemoveFavorite = (id: string) => {
    setFavorites((prev) => prev.filter((f) => f.id !== id));
  };

  const handleClearAllFavorites = () => {
    setFavorites([]);
  };

  // Quick Random Character feature
  const handleRandomCharacter = async () => {
    setIsLoadingRandom(true);
    try {
      // Rick and Morty character IDs range from 1 to 826
      const randomId = Math.floor(Math.random() * 826) + 1;
      const char = await fetchCharacterById(randomId.toString());
      if (char) {
        setSelectedCharacter(char);
      }
    } catch (err) {
      console.error('Failed to load random character', err);
    } finally {
      setIsLoadingRandom(false);
    }
  };

  const handleQuickFilter = (name: string) => {
    playClickSound();
    setSearchTerm(name);
    setFilters((prev) => ({ ...prev, name }));
    setCurrentPage(1);
    const element = document.getElementById('character-results');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#06090e] text-slate-100 selection:bg-emerald-500 selection:text-black">
      {/* Top Header */}
      <Header
        soundEnabled={soundEnabled}
        setSoundEnabled={setSoundEnabled}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        totalCharactersCount={pageInfo.count || 826}
      />

      <main className="flex-1">
        {/* Hero Banner with Enes Öztürk Signature and Randomizer */}
        <HeroSection
          onRandomCharacter={handleRandomCharacter}
          onQuickFilter={handleQuickFilter}
          isLoadingRandom={isLoadingRandom}
        />

        {/* Search and Filters Section */}
        <div id="character-results" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="space-y-4 mb-8">
            {/* Search Input Bar */}
            <SearchBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              onClear={() => setSearchTerm('')}
            />

            {/* Filter Bar */}
            <FilterBar
              filters={filters}
              onFilterChange={handleFilterChange}
              onResetFilters={handleResetFilters}
              locationsList={locationsList}
              isLoadingLocations={isLoadingLocations}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResultsCount={pageInfo.count}
            />
          </div>

          {/* Results Area */}
          <div>
            {/* Loading Indicator */}
            {isLoading ? (
              <div className="py-24 flex flex-col items-center justify-center space-y-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-emerald-500/20 border-t-emerald-400 animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center text-xl">
                    🧪
                  </div>
                </div>
                <div className="font-chakra text-lg font-bold text-emerald-300">
                  Boyutlar taranıyor...
                </div>
                <p className="text-xs text-slate-400 font-mono-code">
                  GraphQL veritabanından karakter kayıtları getiriliyor
                </p>
              </div>
            ) : error ? (
              /* Error State */
              <div className="py-16 px-6 text-center max-w-lg mx-auto bg-slate-900/80 border border-rose-500/30 rounded-3xl space-y-4">
                <div className="w-14 h-14 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center mx-auto">
                  <AlertCircle className="w-7 h-7" />
                </div>
                <h3 className="font-chakra text-xl font-bold text-white">
                  Veri Çekilirken Sorun Oluştu
                </h3>
                <p className="text-sm text-slate-300">{error}</p>
                <button
                  onClick={() => {
                    playZapSound();
                    loadCharacters();
                  }}
                  className="px-4 py-2 rounded-xl bg-emerald-500 text-black font-bold text-sm hover:bg-emerald-400 transition cursor-pointer"
                >
                  Yeniden Dene
                </button>
              </div>
            ) : characters.length === 0 ? (
              /* Empty State */
              <div className="py-16 px-6 text-center max-w-lg mx-auto bg-[#0a0f18]/90 border border-slate-800 rounded-3xl space-y-4">
                <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center mx-auto">
                  <Compass className="w-8 h-8 animate-pulse" />
                </div>
                <h3 className="font-chakra text-2xl font-bold text-white">
                  Hiçbir Karakter Bulunamadı
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Belirttiğiniz arama veya filtre kriterlerine uygun karakter bu evrende mevcut değil.
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => {
                      playZapSound();
                      handleResetFilters();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/50 text-emerald-300 font-chakra font-bold text-sm flex items-center gap-2 mx-auto transition cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Tüm Filtreleri Temizle</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Character Results Display */
              <div className="space-y-8">
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                    {characters.map((char) => (
                      <CharacterCard
                        key={char.id}
                        character={char}
                        onSelect={setSelectedCharacter}
                        isFavorite={favorites.some((f) => f.id === char.id)}
                        onToggleFavorite={handleToggleFavorite}
                      />
                    ))}
                  </div>
                ) : (
                  <CharacterTableView
                    characters={characters}
                    onSelect={setSelectedCharacter}
                    favorites={favorites}
                    onToggleFavorite={handleToggleFavorite}
                  />
                )}

                {/* Pagination Controls */}
                <Pagination
                  pageInfo={pageInfo}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                  isLoading={isLoading}
                />
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Detail Modal */}
      <CharacterModal
        character={selectedCharacter}
        onClose={() => setSelectedCharacter(null)}
        isFavorite={Boolean(
          selectedCharacter && favorites.some((f) => f.id === selectedCharacter.id)
        )}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Favorites Modal */}
      <FavoritesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectCharacter={setSelectedCharacter}
        onRemoveFavorite={handleRemoveFavorite}
        onClearAll={handleClearAllFavorites}
      />

      {/* Footer with Enes Öztürk Signature */}
      <Footer />
    </div>
  );
}
