import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { StatsCards } from './components/StatsCards';
import { CountryPicker } from './components/CountryPicker';
import { DataCharts } from './components/DataCharts';
import { CountryDetailMetrics } from './components/CountryDetailMetrics';
import { DocumentationModal } from './components/DocumentationModal';
import { Footer } from './components/Footer';
import {
  fetchGlobalData,
  fetchCountries,
  fetchCountryData,
  fetchHistoricalData,
} from './services/covidApi';
import { CovidDataCommon, CovidCountryData, DailyPoint } from './types/covid';

export default function App() {
  const [globalData, setGlobalData] = useState<CovidDataCommon | null>(null);
  const [currentData, setCurrentData] = useState<CovidDataCommon | null>(null);
  const [countries, setCountries] = useState<CovidCountryData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('global');
  const [historicalData, setHistoricalData] = useState<DailyPoint[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [isDocModalOpen, setIsDocModalOpen] = useState<boolean>(false);

  // Initial load: Global data, country list, global historical timeline
  const loadInitialData = useCallback(async () => {
    setLoading(true);
    try {
      const [globalRes, countriesRes, historyRes] = await Promise.all([
        fetchGlobalData(),
        fetchCountries(),
        fetchHistoricalData('global', 30),
      ]);

      setGlobalData(globalRes);
      setCurrentData(globalRes);
      setCountries(countriesRes);
      setHistoricalData(historyRes);
    } catch (err) {
      console.error('Veri yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // Handle Country selection
  const handleSelectCountry = async (countryName: string) => {
    setSelectedCountry(countryName);

    if (countryName === 'global') {
      if (globalData) {
        setCurrentData(globalData);
      } else {
        const fresh = await fetchGlobalData();
        setGlobalData(fresh);
        setCurrentData(fresh);
      }
      const history = await fetchHistoricalData('global', 30);
      setHistoricalData(history);
      return;
    }

    // Specific country selected
    setLoading(true);
    try {
      const [countryRes, historyRes] = await Promise.all([
        fetchCountryData(countryName),
        fetchHistoricalData(countryName, 30),
      ]);

      if (countryRes) {
        setCurrentData(countryRes);
      }
      setHistoricalData(historyRes);
    } catch (e) {
      console.error('Ülke verisi alınamadı:', e);
    } finally {
      setLoading(false);
    }
  };

  // Manual Refresh handler
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      if (selectedCountry === 'global') {
        const freshGlobal = await fetchGlobalData();
        setGlobalData(freshGlobal);
        setCurrentData(freshGlobal);
        const freshHistory = await fetchHistoricalData('global', 30);
        setHistoricalData(freshHistory);
      } else {
        const [freshCountry, freshHistory] = await Promise.all([
          fetchCountryData(selectedCountry),
          fetchHistoricalData(selectedCountry, 30),
        ]);
        if (freshCountry) setCurrentData(freshCountry);
        setHistoricalData(freshHistory);
      }
    } catch (e) {
      console.error('Yenileme sırasında hata:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 500);
    }
  };

  const selectedCountryObj = countries.find(
    (c) => c.country.toLowerCase() === selectedCountry.toLowerCase()
  );

  const displayRegionName = selectedCountry === 'global' ? 'Tüm Dünya (Global)' : selectedCountry;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      {/* 1. Header (Top Bar 3-Zone Contract) */}
      <Header
        onOpenDoc={() => setIsDocModalOpen(true)}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        lastUpdated={currentData?.updated || 0}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Hero Section with High-Fidelity visual and Enes Öztürk kicker */}
        <HeroSection
          countryName={displayRegionName}
          countryFlag={selectedCountryObj?.countryInfo.flag}
          lastUpdated={currentData?.updated || 0}
          population={currentData?.population}
        />

        {/* 2. 4 Cards: Enfekte Olan, İyileşen, Ölen (Vefat), Aktif Hasta + Son Güncelleme Tarihi */}
        <StatsCards
          data={currentData}
          loading={loading && !currentData}
        />

        {/* 3. Country Dropdown: Immediately below the 4 cards as specified in requirements */}
        <CountryPicker
          countries={countries}
          selectedCountry={selectedCountry}
          onSelectCountry={handleSelectCountry}
          loading={loading}
        />

        {/* Additional Selected Country In-Depth Indicators */}
        {currentData && (
          <CountryDetailMetrics
            data={currentData}
            selectedCountry={selectedCountry}
            countryObj={selectedCountryObj}
          />
        )}

        {/* 4. Chart Visualization Section (Bar Chart & Timeline) at the bottom */}
        <DataCharts
          data={currentData}
          historicalData={historicalData}
          regionName={displayRegionName}
          loading={loading && !currentData}
        />
      </main>

      {/* Footer signed by Enes Öztürk */}
      <Footer onOpenDoc={() => setIsDocModalOpen(true)} />

      {/* Signed Documentation Modal by Enes Öztürk */}
      <DocumentationModal
        isOpen={isDocModalOpen}
        onClose={() => setIsDocModalOpen(false)}
      />
    </div>
  );
}
