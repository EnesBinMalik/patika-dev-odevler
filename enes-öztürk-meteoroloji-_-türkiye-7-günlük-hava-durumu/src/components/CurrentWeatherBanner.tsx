import React from 'react';
import { Thermometer, Wind, Droplets, Sun, Compass } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from './WeatherIcon';
import { getTurkishWindDirection } from '../utils/weatherUtils';

export const CurrentWeatherBanner: React.FC = () => {
  const { weatherData, loading, formatTemp, selectedCity } = useWeather();

  if (loading || !weatherData) {
    return (
      <div className="w-full bg-slate-800/50 border border-slate-700/60 rounded-2xl p-6 sm:p-8 animate-pulse">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="space-y-3">
            <div className="h-6 w-32 bg-slate-700 rounded-md"></div>
            <div className="h-12 w-48 bg-slate-700 rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-700 rounded-md"></div>
          </div>
          <div className="h-20 w-20 bg-slate-700 rounded-full"></div>
        </div>
      </div>
    );
  }

  const { current, daily } = weatherData;
  const todayForecast = daily[0];
  const windDir = getTurkishWindDirection(current.windDirection);

  // Background gradient tint based on weather condition
  const getBackgroundGradient = () => {
    switch (current.condition.theme) {
      case 'sunny':
        return 'from-amber-500/10 via-sky-500/10 to-transparent border-amber-500/20';
      case 'rainy':
        return 'from-blue-600/15 via-slate-800/40 to-transparent border-blue-500/20';
      case 'stormy':
        return 'from-violet-600/15 via-slate-900/60 to-transparent border-violet-500/20';
      case 'snowy':
        return 'from-cyan-500/15 via-slate-800/40 to-transparent border-cyan-500/20';
      default:
        return 'from-sky-500/10 via-slate-800/30 to-transparent border-sky-500/20';
    }
  };

  return (
    <div
      className={`w-full bg-gradient-to-br ${getBackgroundGradient()} bg-slate-900/80 border rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md shadow-xl transition-all duration-300`}
    >
      {/* Decorative ambient atmospheric glow */}
      <div className="absolute -right-16 -top-16 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left Side: City, Date, Condition */}
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-400 mb-1">
            <span>{selectedCity.region} Bölgesi</span>
            <span>·</span>
            <span>Plaka: {selectedCity.plate}</span>
            <span>·</span>
            <span className="text-slate-400 normal-case font-normal">Son Güncelleme: {weatherData.fetchedAt}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            {selectedCity.name}
          </h1>

          <p className="text-sm text-slate-300 mt-1 max-w-lg">
            {todayForecast?.formattedDate || 'Bugün'} · {current.condition.description}
          </p>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-4 sm:gap-6 mt-4 text-xs text-slate-300 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Thermometer className="w-4 h-4 text-rose-400 shrink-0" />
              <span>Hissedilen:</span>
              <span className="font-semibold text-white font-mono">{formatTemp(current.apparentTemperature)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Droplets className="w-4 h-4 text-sky-400 shrink-0" />
              <span>Nem:</span>
              <span className="font-semibold text-white font-mono">%{current.humidity}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Wind className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Rüzgar:</span>
              <span className="font-semibold text-white font-mono">{Math.round(current.windSpeed)} km/s ({windDir})</span>
            </div>
            {todayForecast && (
              <div className="flex items-center gap-1.5">
                <Sun className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Gündüz / Gece:</span>
                <span className="font-semibold text-white font-mono">
                  {formatTemp(todayForecast.tempMax)} / {formatTemp(todayForecast.tempMin)}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Big Temperature & Weather Icon */}
        <div className="flex items-center gap-5 sm:gap-7 self-stretch sm:self-auto justify-between sm:justify-end border-t sm:border-t-0 border-slate-800 pt-4 sm:pt-0">
          <div className="text-right">
            <div className="text-5xl sm:text-6xl font-black text-white font-mono tracking-tighter">
              {formatTemp(current.temperature)}
            </div>
            <div className="text-xs font-semibold text-sky-400 uppercase tracking-wider mt-0.5">
              {current.condition.label}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700/80 shadow-inner flex items-center justify-center shrink-0">
            <WeatherIcon condition={current.condition} size={56} />
          </div>
        </div>
      </div>
    </div>
  );
};
