import { City } from '../data/turkeyCities';

export interface WeatherCondition {
  label: string;
  description: string;
  iconName: 'sun' | 'cloud-sun' | 'cloud' | 'cloud-fog' | 'cloud-drizzle' | 'cloud-rain' | 'cloud-lightning' | 'cloud-snow';
  theme: 'sunny' | 'cloudy' | 'rainy' | 'stormy' | 'snowy' | 'foggy';
  badgeColor: string;
}

export interface DayForecast {
  date: string; // YYYY-MM-DD
  dayName: string; // Pazartesi, Salı vb.
  dayShort: string; // Pzt, Sal vb.
  formattedDate: string; // 27 Ekim Salı
  isToday: boolean;
  weatherCode: number;
  condition: WeatherCondition;
  tempMax: number;
  tempMin: number;
  apparentTempMax: number;
  apparentTempMin: number;
  precipitationProbability: number;
  precipitationSum: number;
  uvIndexMax: number;
  windSpeedMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourForecast {
  time: string; // 2026-10-27T14:00
  hourStr: string; // 14:00
  isCurrentHour: boolean;
  temp: number;
  weatherCode: number;
  condition: WeatherCondition;
  precipitationProbability: number;
  humidity: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  weatherCode: number;
  condition: WeatherCondition;
  windSpeed: number;
  windDirection: number;
  pressure: number;
  isDay: boolean;
  precipitation: number;
}

export interface WeatherData {
  city: City;
  current: CurrentWeather;
  daily: DayForecast[]; // 7 days
  hourly: HourForecast[]; // Next 24 hours
  timezone: string;
  fetchedAt: string;
}

export type TempUnit = 'C' | 'F';
