import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { City, TURKEY_CITIES } from '../data/turkeyCities';
import { DayForecast, HourForecast, TempUnit, WeatherData } from '../types/weather';
import {
  findNearestTurkishCity,
  formatTemperature,
  formatTimeStr,
  formatTurkishDate,
  getWeatherCondition,
} from '../utils/weatherUtils';

interface WeatherContextType {
  selectedCity: City;
  setSelectedCity: (city: City) => void;
  weatherData: WeatherData | null;
  loading: boolean;
  error: string | null;
  unit: TempUnit;
  toggleUnit: () => void;
  selectedDayIndex: number;
  setSelectedDayIndex: (index: number) => void;
  refreshWeather: () => Promise<void>;
  getUserLocation: () => void;
  isLocating: boolean;
  locationError: string | null;
  formatTemp: (celsius: number) => string;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

const DEFAULT_CITY = TURKEY_CITIES.find((c) => c.name === 'İstanbul') || TURKEY_CITIES[33];

export const WeatherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedCity, setSelectedCityState] = useState<City>(() => {
    try {
      const saved = localStorage.getItem('eo_weather_selected_city');
      if (saved) {
        const parsed = JSON.parse(saved);
        const match = TURKEY_CITIES.find((c) => c.id === parsed.id || c.name === parsed.name);
        if (match) return match;
      }
    } catch {
      // ignore
    }
    return DEFAULT_CITY;
  });

  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<TempUnit>(() => {
    try {
      const saved = localStorage.getItem('eo_weather_unit') as TempUnit;
      if (saved === 'C' || saved === 'F') return saved;
    } catch {
      // ignore
    }
    return 'C';
  });
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);

  const setSelectedCity = (city: City) => {
    setSelectedCityState(city);
    setSelectedDayIndex(0);
    try {
      localStorage.setItem('eo_weather_selected_city', JSON.stringify(city));
    } catch {
      // ignore
    }
  };

  const toggleUnit = () => {
    setUnit((prev) => {
      const next = prev === 'C' ? 'F' : 'C';
      try {
        localStorage.setItem('eo_weather_unit', next);
      } catch {
        // ignore
      }
      return next;
    });
  };

  const fetchWeatherForCity = useCallback(async (city: City) => {
    setLoading(true);
    setError(null);
    try {
      const url = `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,surface_pressure,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_sum,precipitation_probability_max,wind_speed_10m_max,uv_index_max&hourly=temperature_2m,relative_humidity_2m,weather_code,precipitation_probability&timezone=auto&forecast_days=7`;

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`Meteoroloji sunucu yanıt vermedi (${res.status})`);
      }

      const data = await res.json();

      // Process 7-day forecast
      const dailyDates: string[] = data.daily?.time || [];
      const dailyForecasts: DayForecast[] = dailyDates.slice(0, 7).map((dateStr, idx) => {
        const dateInfo = formatTurkishDate(dateStr);
        const wCode = data.daily.weather_code[idx] ?? 0;
        return {
          date: dateStr,
          dayName: idx === 0 ? 'Bugün' : dateInfo.dayName,
          dayShort: dateInfo.dayShort,
          formattedDate: dateInfo.formattedDate,
          isToday: idx === 0,
          weatherCode: wCode,
          condition: getWeatherCondition(wCode),
          tempMax: data.daily.temperature_2m_max[idx] ?? 0,
          tempMin: data.daily.temperature_2m_min[idx] ?? 0,
          apparentTempMax: data.daily.apparent_temperature_max[idx] ?? 0,
          apparentTempMin: data.daily.apparent_temperature_min[idx] ?? 0,
          precipitationProbability: data.daily.precipitation_probability_max[idx] ?? 0,
          precipitationSum: data.daily.precipitation_sum[idx] ?? 0,
          uvIndexMax: data.daily.uv_index_max[idx] ?? 0,
          windSpeedMax: data.daily.wind_speed_10m_max[idx] ?? 0,
          sunrise: formatTimeStr(data.daily.sunrise[idx]),
          sunset: formatTimeStr(data.daily.sunset[idx]),
        };
      });

      // Process next 24 hours
      const hourlyTimes: string[] = data.hourly?.time || [];
      const nowIso = new Date().toISOString();
      const currentHourPrefix = nowIso.slice(0, 13); // YYYY-MM-DDTHH

      let currentHourIdx = hourlyTimes.findIndex((t) => t.startsWith(currentHourPrefix));
      if (currentHourIdx === -1) currentHourIdx = 0;

      const next24Hours: HourForecast[] = hourlyTimes
        .slice(currentHourIdx, currentHourIdx + 24)
        .map((timeStr, idx) => {
          const wCode = data.hourly.weather_code[currentHourIdx + idx] ?? 0;
          const hourStr = timeStr.split('T')[1]?.substring(0, 5) || '';
          return {
            time: timeStr,
            hourStr: idx === 0 ? 'Şimdi' : hourStr,
            isCurrentHour: idx === 0,
            temp: data.hourly.temperature_2m[currentHourIdx + idx] ?? 0,
            weatherCode: wCode,
            condition: getWeatherCondition(wCode),
            precipitationProbability: data.hourly.precipitation_probability[currentHourIdx + idx] ?? 0,
            humidity: data.hourly.relative_humidity_2m[currentHourIdx + idx] ?? 0,
          };
        });

      const currentWeatherCode = data.current?.weather_code ?? 0;

      const parsed: WeatherData = {
        city,
        current: {
          temperature: data.current?.temperature_2m ?? 0,
          apparentTemperature: data.current?.apparent_temperature ?? 0,
          humidity: data.current?.relative_humidity_2m ?? 0,
          weatherCode: currentWeatherCode,
          condition: getWeatherCondition(currentWeatherCode),
          windSpeed: data.current?.wind_speed_10m ?? 0,
          windDirection: data.current?.wind_direction_10m ?? 0,
          pressure: data.current?.surface_pressure ?? 1013,
          isDay: Boolean(data.current?.is_day ?? 1),
          precipitation: data.current?.precipitation ?? 0,
        },
        daily: dailyForecasts,
        hourly: next24Hours,
        timezone: data.timezone || 'Europe/Istanbul',
        fetchedAt: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      };

      setWeatherData(parsed);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Hava durumu verisi alınırken hata oluştu.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshWeather = useCallback(async () => {
    await fetchWeatherForCity(selectedCity);
  }, [fetchWeatherForCity, selectedCity]);

  // Initial and city-change fetch
  useEffect(() => {
    fetchWeatherForCity(selectedCity);
  }, [fetchWeatherForCity, selectedCity]);

  // Geolocation handling
  const getUserLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationError('Tarayıcınız konum servisini desteklemiyor.');
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const nearestCity = findNearestTurkishCity(latitude, longitude);
        setSelectedCity(nearestCity);
      },
      (err) => {
        setIsLocating(false);
        let errorMsg = 'Konumunuza ulaşılamadı.';
        if (err.code === err.PERMISSION_DENIED) {
          errorMsg = 'Konum izni verilmedi. Varsayılan şehir gösteriliyor.';
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          errorMsg = 'Konum bilgisi şu anda mevcut değil.';
        } else if (err.code === err.TIMEOUT) {
          errorMsg = 'Konum isteği zaman aşımına uğradı.';
        }
        setLocationError(errorMsg);
        setTimeout(() => setLocationError(null), 5000);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const formatTemp = useCallback(
    (celsius: number) => {
      return formatTemperature(celsius, unit);
    },
    [unit]
  );

  return (
    <WeatherContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        weatherData,
        loading,
        error,
        unit,
        toggleUnit,
        selectedDayIndex,
        setSelectedDayIndex,
        refreshWeather,
        getUserLocation,
        isLocating,
        locationError,
        formatTemp,
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) {
    throw new Error('useWeather must be used within a WeatherProvider');
  }
  return context;
};
