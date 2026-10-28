import React from 'react';
import { Calendar, Umbrella, ArrowUp, ArrowDown } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from './WeatherIcon';

export const WeeklyForecastGrid: React.FC = () => {
  const { weatherData, loading, formatTemp, selectedDayIndex, setSelectedDayIndex, selectedCity } = useWeather();

  if (loading || !weatherData) {
    return (
      <section id="haftalik-rapor" className="w-full space-y-4">
        <div className="flex items-center justify-between">
          <div className="h-6 w-48 bg-slate-800 rounded animate-pulse"></div>
          <div className="h-4 w-32 bg-slate-800 rounded animate-pulse"></div>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-48 bg-slate-800/60 border border-slate-700/50 rounded-xl animate-pulse"></div>
          ))}
        </div>
      </section>
    );
  }

  const { daily } = weatherData;

  return (
    <section id="haftalik-rapor" className="w-full space-y-4">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-sky-400" />
          <h2 className="text-lg font-bold text-white tracking-tight">
            1 Haftalık Hava Durumu Raporu
          </h2>
          <span className="text-xs text-slate-400 font-medium hidden sm:inline">
            · {selectedCity.name} İli 7 Günlük Tahmin
          </span>
        </div>
        <span className="text-xs text-slate-400">
          Detayları görmek için gün kartına tıklayın
        </span>
      </div>

      {/* 7 Days Grid - Current Day Highlighted with Distinct Border & Background */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        {daily.map((day, idx) => {
          const isSelected = selectedDayIndex === idx;
          const isToday = day.isToday;

          return (
            <button
              key={day.date}
              type="button"
              onClick={() => setSelectedDayIndex(idx)}
              className={`relative flex flex-col items-center justify-between p-4 rounded-xl text-center transition-all duration-200 cursor-pointer focus:outline-none text-left w-full ${
                isToday
                  ? /* Mandatory requirement: içinde bulunduğumuz gün, bir background ve border ile belirginleştirilmelidir */
                    'bg-sky-500/15 border-2 border-sky-400 ring-2 ring-sky-400/20 shadow-md shadow-sky-500/10 hover:bg-sky-500/20'
                  : isSelected
                  ? 'bg-slate-800 border-2 border-slate-500 shadow-md'
                  : 'bg-slate-800/70 hover:bg-slate-800 border border-slate-700/70 hover:border-slate-600'
              }`}
            >
              {/* Highlight Badge for Today */}
              {isToday && (
                <div className="absolute -top-2.5 bg-sky-500 text-slate-950 text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-sm">
                  Bugün
                </div>
              )}

              {/* Day Header */}
              <div className="w-full mb-2">
                <span className={`block text-xs font-bold truncate ${isToday ? 'text-sky-300 font-extrabold' : 'text-white'}`}>
                  {isToday ? 'Bugün' : day.dayName}
                </span>
                <span className="block text-[11px] text-slate-400 mt-0.5 font-mono">
                  {day.date.split('-').slice(1).reverse().join('/')}
                </span>
              </div>

              {/* Weather Visual Icon */}
              <div className="my-2 p-2 rounded-xl bg-slate-900/60 border border-slate-700/40 flex items-center justify-center">
                <WeatherIcon condition={day.condition} size={36} />
              </div>

              {/* Weather Condition Label */}
              <div className="text-[11px] font-medium text-slate-300 line-clamp-1 mb-3 px-1">
                {day.condition.label.split('/')[0].trim()}
              </div>

              {/* Temperatures: En Yüksek ve En Düşük Sıcaklık */}
              <div className="w-full pt-2 border-t border-slate-700/60 flex items-center justify-around font-mono">
                <div className="flex items-center text-xs font-bold text-white" title="En Yüksek Sıcaklık">
                  <ArrowUp className="w-3 h-3 text-rose-400 mr-0.5" />
                  <span>{formatTemp(day.tempMax)}</span>
                </div>
                <div className="flex items-center text-xs font-medium text-slate-400" title="En Düşük Sıcaklık">
                  <ArrowDown className="w-3 h-3 text-sky-400 mr-0.5" />
                  <span>{formatTemp(day.tempMin)}</span>
                </div>
              </div>

              {/* Rain Probability */}
              {day.precipitationProbability > 0 && (
                <div className="mt-2 text-[10px] text-sky-400 flex items-center gap-1 font-mono">
                  <Umbrella className="w-3 h-3" />
                  <span>%{day.precipitationProbability}</span>
                </div>
              )}

              {/* Active selection dot indicator */}
              {isSelected && (
                <div className="w-1.5 h-1.5 rounded-full bg-sky-400 mt-2" />
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
};
