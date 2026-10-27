import React from 'react';
import { Clock, Droplets } from 'lucide-react';
import { useWeather } from '../context/WeatherContext';
import { WeatherIcon } from './WeatherIcon';

export const HourlyForecast: React.FC = () => {
  const { weatherData, loading, formatTemp, selectedDayIndex } = useWeather();

  if (loading || !weatherData) {
    return null;
  }

  const { hourly, daily } = weatherData;
  const currentSelectedDay = daily[selectedDayIndex] || daily[0];

  return (
    <section id="saatlik-rapor" className="w-full bg-slate-900/60 border border-slate-800 rounded-2xl p-5 backdrop-blur-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-sky-400" />
          <h3 className="text-sm font-bold text-white tracking-tight">
            Saatlik Hava Durumu Tahmini
          </h3>
          <span className="text-xs text-slate-400">
            · {currentSelectedDay.isToday ? 'Bugün (24 Saat)' : currentSelectedDay.formattedDate}
          </span>
        </div>
        <span className="text-xs text-slate-400">Yatay kaydırılabilir</span>
      </div>

      {/* Hourly scroll area */}
      <div className="flex items-center gap-3 overflow-x-auto pb-3 pt-1 scrollbar-thin scrollbar-thumb-slate-700">
        {hourly.map((h, i) => (
          <div
            key={i}
            className={`flex flex-col items-center justify-between p-3 rounded-xl min-w-[76px] shrink-0 text-center transition-colors border ${
              h.isCurrentHour
                ? 'bg-sky-500/15 border-sky-400/40'
                : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/50'
            }`}
          >
            {/* Hour time */}
            <span
              className={`text-xs font-semibold font-mono ${
                h.isCurrentHour ? 'text-sky-300' : 'text-slate-300'
              }`}
            >
              {h.hourStr}
            </span>

            {/* Weather icon */}
            <div className="my-2.5">
              <WeatherIcon condition={h.condition} size={24} />
            </div>

            {/* Temperature */}
            <span className="text-xs font-bold text-white font-mono">
              {formatTemp(h.temp)}
            </span>

            {/* Rain chance */}
            <div className="mt-1 flex items-center gap-0.5 text-[10px] text-sky-400/90 font-mono">
              <Droplets className="w-2.5 h-2.5" />
              <span>%{h.precipitationProbability}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
