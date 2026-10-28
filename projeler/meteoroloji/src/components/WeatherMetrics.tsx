import React from 'react';
import {
  Wind,
  Droplets,
  Sunrise,
  Sunset,
  Gauge,
  Sun,
  ShieldAlert,
  Compass,
} from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { getTurkishWindDirection, getUVDescription } from '../utils/weatherUtils';

export const WeatherMetrics: React.FC = () => {
  const { weatherData, loading, formatTemp, selectedDayIndex } = useWeather();

  if (loading || !weatherData) {
    return null;
  }

  const { current, daily } = weatherData;
  const activeDay = daily[selectedDayIndex] || daily[0];
  const windDir = getTurkishWindDirection(current.windDirection);
  const uvInfo = getUVDescription(activeDay.uvIndexMax);

  return (
    <section id="detayli-metrikler" className="w-full space-y-4">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <h3 className="text-base font-bold text-white tracking-tight flex items-center gap-2">
          <Gauge className="w-4 h-4 text-sky-400" />
          <span>Detaylı Meteoroloji Göstergeleri</span>
        </h3>
        <span className="text-xs text-slate-400">
          Seçili Gün: <strong className="text-white font-semibold">{activeDay.dayName}</strong>
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Rüzgar */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Rüzgar Durumu</span>
            <Wind className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="my-3">
            <div className="text-2xl font-black text-white font-mono">
              {Math.round(activeDay.windSpeedMax || current.windSpeed)} <span className="text-xs font-normal text-slate-400">km/s</span>
            </div>
            <div className="text-xs text-slate-300 mt-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-sky-400" />
              <span>Yön: {windDir} ({Math.round(current.windDirection)}°)</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Maksimum anlık rüzgar hamlesi
          </div>
        </div>

        {/* Metric 2: UV İndeksi */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">UV İndeksi</span>
            <Sun className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-white font-mono">{activeDay.uvIndexMax}</span>
              <span className={`text-xs px-2 py-0.5 rounded font-semibold ${uvInfo.color}`}>
                {uvInfo.label}
              </span>
            </div>
            <div className="text-xs text-slate-300 mt-1 line-clamp-1">
              {uvInfo.advice}
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Güneş ışınımı yoğunluğu
          </div>
        </div>

        {/* Metric 3: Gün Doğumu ve Batımı */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Güneş Döngüsü</span>
            <Sunrise className="w-4 h-4 text-amber-400" />
          </div>
          <div className="my-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Sunrise className="w-3.5 h-3.5 text-amber-400" /> Doğuş:
              </span>
              <span className="font-mono font-bold text-white">{activeDay.sunrise}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400 flex items-center gap-1">
                <Sunset className="w-3.5 h-3.5 text-orange-400" /> Batış:
              </span>
              <span className="font-mono font-bold text-white">{activeDay.sunset}</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Yerel Türkiye saati ile
          </div>
        </div>

        {/* Metric 4: Nem ve Basınç */}
        <div className="bg-slate-800/60 border border-slate-700/60 rounded-xl p-4 flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span className="font-medium">Nem & Basınç</span>
            <Droplets className="w-4 h-4 text-sky-400" />
          </div>
          <div className="my-2 space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Bağıl Nem:</span>
              <span className="font-mono font-bold text-white">%{current.humidity}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Atmosfer Basıncı:</span>
              <span className="font-mono font-bold text-white">{Math.round(current.pressure)} hPa</span>
            </div>
          </div>
          <div className="text-[11px] text-slate-400 border-t border-slate-700/50 pt-2">
            Deniz seviyesi barometrik değer
          </div>
        </div>
      </div>
    </section>
  );
};
