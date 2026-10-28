import React from 'react';
import { WeatherProvider, useWeather } from './context/WeatherContext';
import { Navbar } from './components/Navbar';
import { CitySelector } from './components/CitySelector';
import { CurrentWeatherBanner } from './components/CurrentWeatherBanner';
import { WeeklyForecastGrid } from './components/WeeklyForecastGrid';
import { HourlyForecast } from './components/HourlyForecast';
import { WeatherMetrics } from './components/WeatherMetrics';
import { WeatherAdvice } from './components/WeatherAdvice';
import { ProvinceDirectory } from './components/ProvinceDirectory';
import { Footer } from './components/Footer';
import { AlertCircle, RefreshCw } from 'lucide-react';

const WeatherAppContent: React.FC = () => {
  const { error, refreshWeather, loading } = useWeather();

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-sky-500 selection:text-white">
      {/* Top Bar */}
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-7">
        {/* Error Banner if API fails */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-200 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => refreshWeather()}
              disabled={loading}
              className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-100 rounded-lg font-semibold flex items-center gap-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Tekrar Dene</span>
            </button>
          </div>
        )}

        {/* 1. City Dropdown & Quick Select Bar */}
        <CitySelector />

        {/* 2. Hero Current Weather Card */}
        <CurrentWeatherBanner />

        {/* 3. 7-Day Forecast Grid (Core Requirement: Today card highlighted with background & border) */}
        <WeeklyForecastGrid />

        {/* 4. Hourly Forecast Slider */}
        <HourlyForecast />

        {/* 5. Detailed Meteorological Metrics Grid */}
        <WeatherMetrics />

        {/* 6. Contextual Weather Insights & Clothing Advice */}
        <WeatherAdvice />

        {/* 7. Turkey 81 Provinces Directory */}
        <ProvinceDirectory />
      </main>

      {/* Signature Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <WeatherProvider>
      <WeatherAppContent />
    </WeatherProvider>
  );
}
