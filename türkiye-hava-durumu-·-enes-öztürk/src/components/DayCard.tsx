import React from 'react';
import { DailyForecast } from '../types/weather';
import { WeatherIcon } from './WeatherIcon';
import { Droplets, Wind } from 'lucide-react';

interface DayCardProps {
  day: DailyForecast;
  isSelected: boolean;
  isToday: boolean;
  unit: 'C' | 'F';
  onClick: () => void;
}

export const DayCard: React.FC<DayCardProps> = ({
  day,
  isSelected,
  isToday,
  unit,
  onClick,
}) => {
  const convertTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  const maxT = convertTemp(day.tempMax);
  const minT = convertTemp(day.tempMin);

  return (
    <button
      type="button"
      onClick={onClick}
      className={`group relative flex flex-col items-center justify-between p-4 rounded-2xl transition-all duration-300 text-left outline-none focus-visible:ring-2 focus-visible:ring-sky-400 cursor-pointer select-none ${
        isSelected
          ? 'bg-gradient-to-b from-sky-500/20 via-slate-800/80 to-slate-900/90 border-2 border-sky-400/80 shadow-lg shadow-sky-950/50 scale-[1.02] z-10'
          : 'bg-slate-900/60 hover:bg-slate-800/70 border border-slate-800/80 hover:border-slate-700/80 hover:scale-[1.01]'
      }`}
    >
      {/* Bugün Vurgusu veya Gün Adı */}
      <div className="w-full flex items-center justify-between gap-1 mb-2">
        <span
          className={`text-sm font-semibold tracking-tight transition-colors ${
            isSelected
              ? 'text-sky-300'
              : isToday
              ? 'text-amber-300'
              : 'text-slate-200 group-hover:text-white'
          }`}
        >
          {day.dayName}
        </span>
        <span className="text-[11px] font-mono tabular-nums text-slate-400">
          {day.date.split('-').slice(1).reverse().join('/')}
        </span>
      </div>

      {/* Hava Durumu İkonu */}
      <div className="py-2.5 my-auto flex flex-col items-center">
        <WeatherIcon
          type={day.weatherInfo.iconType}
          size="md"
          className="transition-transform duration-300 group-hover:scale-110 drop-shadow-md"
        />
        <span className="text-[12px] font-medium text-slate-300 text-center line-clamp-1 mt-1.5 px-1">
          {day.weatherInfo.title}
        </span>
      </div>

      {/* Sıcaklık Bilgisi (Max / Min) */}
      <div className="w-full mt-3 pt-2.5 border-t border-slate-800/60 flex flex-col gap-1.5">
        <div className="flex items-baseline justify-between w-full">
          <div className="flex items-baseline gap-0.5">
            <span className="text-lg font-bold font-mono tabular-nums text-slate-100">
              {maxT > 0 ? `+${maxT}` : maxT}°
            </span>
            <span className="text-[10px] text-slate-400 font-medium">maks</span>
          </div>
          <div className="flex items-baseline gap-0.5">
            <span className="text-sm font-medium font-mono tabular-nums text-slate-400">
              {minT > 0 ? `+${minT}` : minT}°
            </span>
            <span className="text-[10px] text-slate-500">min</span>
          </div>
        </div>

        {/* Sıcaklık Çubuğu */}
        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden flex">
          <div
            className="h-full bg-gradient-to-r from-sky-400 via-amber-300 to-orange-400 rounded-full transition-all duration-500"
            style={{
              width: `${Math.min(100, Math.max(20, ((day.tempMax + 10) / 45) * 100))}%`,
            }}
          />
        </div>

        {/* Ek Küçük İpuçları: Yağış veya Rüzgar */}
        <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Droplets className="w-3 h-3 text-sky-400 shrink-0" />
            %{day.precipitationProbability}
          </span>
          <span className="flex items-center gap-1 font-mono tabular-nums">
            <Wind className="w-3 h-3 text-slate-400 shrink-0" />
            {day.windSpeedMax} km/s
          </span>
        </div>
      </div>
    </button>
  );
};
