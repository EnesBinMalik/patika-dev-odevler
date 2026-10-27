import React from 'react';
import { CurrentWeather, DailyForecast, HourlyForecast } from '../types/weather';
import { TurkeyCity } from '../data/cities';
import { WeatherIcon } from './WeatherIcon';
import {
  Wind,
  Droplets,
  CloudRain,
  SunMedium,
  Gauge,
  Sunrise,
  Sunset,
  ArrowUp,
  Sparkles,
  RefreshCw,
} from 'lucide-react';

interface HeroWeatherProps {
  city: TurkeyCity;
  current: CurrentWeather;
  selectedDay: DailyForecast;
  isToday: boolean;
  hourly: HourlyForecast[];
  unit: 'C' | 'F';
  onToggleUnit: () => void;
  onRefresh: () => void;
  isLoading: boolean;
}

export const HeroWeather: React.FC<HeroWeatherProps> = ({
  city,
  current,
  selectedDay,
  isToday,
  hourly,
  unit,
  onToggleUnit,
  onRefresh,
  isLoading,
}) => {
  const convertTemp = (tempC: number) => {
    if (unit === 'F') {
      return Math.round((tempC * 9) / 5 + 32);
    }
    return tempC;
  };

  // If today is selected, display live current temperature; otherwise display the day's peak temperature
  const displayTemp = isToday ? convertTemp(current.temperature) : convertTemp(selectedDay.tempMax);
  const displayApparent = isToday
    ? convertTemp(current.apparentTemperature)
    : convertTemp(selectedDay.apparentMax);
  const maxTemp = convertTemp(selectedDay.tempMax);
  const minTemp = convertTemp(selectedDay.tempMin);

  // UV index level label
  const getUvLevel = (uv: number) => {
    if (uv <= 2) return { label: 'Düşük', color: 'text-emerald-400' };
    if (uv <= 5) return { label: 'Orta', color: 'text-amber-400' };
    if (uv <= 7) return { label: 'Yüksek', color: 'text-orange-400' };
    return { label: 'Çok Yüksek', color: 'text-rose-400' };
  };

  const uvInfo = getUvLevel(selectedDay.uvIndexMax);

  return (
    <div className="w-full relative overflow-hidden rounded-3xl bg-slate-900/80 border border-slate-800 backdrop-blur-md shadow-2xl p-6 md:p-8 transition-all">
      {/* Arka Plan Yumuşak Meteorolojik Işıltı Efekti */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Üst Bilgi Satırı: Şehir Adı, Tarih ve Yenileme / Birim Düğmeleri */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-6 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-600 to-sky-400 flex items-center justify-center text-white font-mono font-bold text-lg shadow-md shadow-sky-500/20">
            {city.id}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                {city.name}
              </h1>
              <span className="text-xs px-2 py-0.5 rounded-md bg-slate-800 border border-slate-700 font-medium text-slate-300">
                {city.region}
              </span>
            </div>
            <p className="text-xs md:text-sm text-slate-400 mt-0.5">
              {selectedDay.formattedDate}
              {isToday && ` · Canlı Rapor (${current.timeFormatted})`}
            </p>
          </div>
        </div>

        {/* Sağ Düğmeler: °C/°F Değiştirici ve Yenileme */}
        <div className="flex items-center gap-2">
          {/* Birim Değiştirici */}
          <div className="inline-flex rounded-xl bg-slate-800/90 p-1 border border-slate-700">
            <button
              type="button"
              onClick={unit === 'C' ? undefined : onToggleUnit}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'C'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °C
            </button>
            <button
              type="button"
              onClick={unit === 'F' ? undefined : onToggleUnit}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                unit === 'F'
                  ? 'bg-sky-500 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              °F
            </button>
          </div>

          {/* Yenileme Butonu */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isLoading}
            title="Canlı hava verilerini güncelle"
            className="p-2.5 rounded-xl bg-slate-800/90 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-700/80 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Orta Bölüm: Büyük Sıcaklık ve Görsel + Tavsiye Kartı */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 my-6 items-center relative z-10">
        {/* Sol Kolon: Büyük Sıcaklık ve Ana Durum */}
        <div className="lg:col-span-7 flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="p-2">
            <WeatherIcon
              type={isToday ? current.weatherInfo.iconType : selectedDay.weatherInfo.iconType}
              size="xl"
              className="drop-shadow-2xl"
            />
          </div>

          <div className="flex flex-col">
            <div className="flex items-baseline justify-center sm:justify-start gap-3">
              <span className="text-6xl sm:text-7xl md:text-8xl font-black font-mono tracking-tighter text-white tabular-nums drop-shadow-sm">
                {displayTemp > 0 ? `+${displayTemp}` : displayTemp}°
              </span>
              <div className="flex flex-col text-left">
                <span className="text-xl sm:text-2xl font-bold text-slate-200">
                  {isToday ? current.weatherInfo.title : selectedDay.weatherInfo.title}
                </span>
                <span className="text-xs sm:text-sm text-slate-400">
                  Hissedilen: <span className="font-mono text-slate-200">{displayApparent}°</span>
                </span>
              </div>
            </div>

            {/* Günün Sıcaklık Aralığı */}
            <div className="flex items-center justify-center sm:justify-start gap-4 mt-3 text-sm text-slate-300">
              <span className="flex items-center gap-1 font-mono">
                <span className="text-xs text-rose-400">En Yüksek:</span>
                <strong className="text-white">{maxTemp}°</strong>
              </span>
              <span className="text-slate-600">|</span>
              <span className="flex items-center gap-1 font-mono">
                <span className="text-xs text-sky-400">En Düşük:</span>
                <strong className="text-white">{minTemp}°</strong>
              </span>
            </div>

            {/* Durum Açıklaması */}
            <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-md">
              {isToday ? current.weatherInfo.description : selectedDay.weatherInfo.description}
            </p>
          </div>
        </div>

        {/* Sağ Kolon: Günün Tavsiyesi / Meteorolojik Özet Kartı */}
        <div className="lg:col-span-5 p-5 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-300 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Meteorolojik Tavsiye</span>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed">
            &quot;{isToday ? current.weatherInfo.advice : selectedDay.weatherInfo.advice}&quot;
          </p>
          <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
            <span>Seçili Gün: <strong>{selectedDay.dayName}</strong></span>
            <span className="text-sky-400 font-medium">Enes Öztürk Analizi</span>
          </div>
        </div>
      </div>

      {/* 6 Ayrıntılı Meteorolojik Metrik Kartı */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-4 border-t border-slate-800/80 relative z-10">
        {/* 1. Rüzgar */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Rüzgar</span>
            <Wind className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-auto">
            {isToday ? current.windSpeed : selectedDay.windSpeedMax} <span className="text-xs text-slate-400 font-normal">km/s</span>
          </div>
          <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
            <ArrowUp
              className="w-3 h-3 text-sky-400 inline"
              style={{
                transform: `rotate(${isToday ? current.windDirection : 180}deg)`,
              }}
            />
            {isToday ? `${current.windDirection}° Yön` : 'Maksimum'}
          </div>
        </div>

        {/* 2. Nem Oranı */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Nem Oranı</span>
            <Droplets className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-auto">
            %{isToday ? current.humidity : 55}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {isToday && current.humidity > 70 ? 'Yüksek nem' : 'İdeal konfor'}
          </div>
        </div>

        {/* 3. Yağış İhtimali */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Yağış İhtimali</span>
            <CloudRain className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-auto">
            %{selectedDay.precipitationProbability}
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            {selectedDay.precipitationSum > 0
              ? `${selectedDay.precipitationSum} mm toplam`
              : 'Yağış beklenmiyor'}
          </div>
        </div>

        {/* 4. UV İndeksi */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">UV İndeksi</span>
            <SunMedium className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-auto">
            {selectedDay.uvIndexMax} <span className="text-xs text-slate-400 font-normal">/ 11</span>
          </div>
          <div className={`text-[11px] font-medium mt-0.5 ${uvInfo.color}`}>
            {uvInfo.label}
          </div>
        </div>

        {/* 5. Hava Basıncı */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Hava Basıncı</span>
            <Gauge className="w-4 h-4 text-teal-400" />
          </div>
          <div className="text-lg font-bold font-mono tabular-nums text-white mt-auto">
            {isToday ? current.surfacePressure : 1015} <span className="text-xs text-slate-400 font-normal">hPa</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-0.5">
            Normal atmosferik
          </div>
        </div>

        {/* 6. Gün Doğumu / Batımı */}
        <div className="p-3.5 rounded-2xl bg-slate-950/40 border border-slate-800 flex flex-col">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-medium">Güneş Saatleri</span>
            <Sunrise className="w-4 h-4 text-orange-400" />
          </div>
          <div className="text-xs font-mono font-bold text-white mt-auto flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sunrise className="w-3 h-3 text-amber-400" /> {selectedDay.sunrise}
            </span>
          </div>
          <div className="text-xs font-mono font-bold text-slate-300 mt-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Sunset className="w-3 h-3 text-orange-400" /> {selectedDay.sunset}
            </span>
          </div>
        </div>
      </div>

      {/* 24 Saatlik Saatlik Tahmin Şeridi (Eğer saatlik veri varsa) */}
      {hourly && hourly.length > 0 && (
        <div className="mt-6 pt-5 border-t border-slate-800/80 relative z-10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              Önümüzdeki 24 Saatlik Sıcaklık Değişimi
            </h3>
            <span className="text-[11px] text-slate-500 font-mono">Saatlik Tahminler</span>
          </div>

          <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700">
            {hourly.slice(0, 16).map((h, index) => {
              const hTemp = convertTemp(h.temperature);
              return (
                <div
                  key={index}
                  className="flex flex-col items-center justify-between py-2 px-3 rounded-xl bg-slate-950/40 border border-slate-800/70 min-w-[4.25rem] shrink-0"
                >
                  <span className="text-xs font-mono text-slate-400">{h.time}</span>
                  <div className="my-1.5">
                    <WeatherIcon
                      type={h.weatherCode === 0 ? 'clear-day' : h.weatherCode < 4 ? 'partly-cloudy-day' : h.weatherCode < 70 ? 'rain' : 'snow'}
                      size="sm"
                      animate={false}
                    />
                  </div>
                  <span className="text-sm font-bold font-mono text-white tabular-nums">
                    {hTemp}°
                  </span>
                  {h.precipitationProbability > 0 && (
                    <span className="text-[10px] text-sky-400 font-mono mt-0.5">
                      %{h.precipitationProbability}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
