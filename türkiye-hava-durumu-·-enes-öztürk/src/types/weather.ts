export type WeatherIconType =
  | 'clear-day'
  | 'clear-night'
  | 'partly-cloudy-day'
  | 'partly-cloudy-night'
  | 'cloudy'
  | 'overcast'
  | 'fog'
  | 'drizzle'
  | 'rain'
  | 'heavy-rain'
  | 'thunderstorm'
  | 'snow'
  | 'heavy-snow'
  | 'sleet';

export interface WeatherConditionInfo {
  code: number;
  title: string;
  description: string;
  iconType: WeatherIconType;
  advice: string;
}

export interface DailyForecast {
  date: string; // YYYY-MM-DD
  dayName: string; // "Bugün", "Pazartesi", vb.
  dayShort: string; // "Bugün", "Pzt", "Sal"
  formattedDate: string; // "27 Ekim Salı"
  weatherCode: number;
  weatherInfo: WeatherConditionInfo;
  tempMax: number;
  tempMin: number;
  apparentMax: number;
  apparentMin: number;
  precipitationSum: number;
  precipitationProbability: number;
  windSpeedMax: number;
  uvIndexMax: number;
  sunrise: string;
  sunset: string;
}

export interface HourlyForecast {
  time: string; // "14:00"
  fullDateTime: string;
  temperature: number;
  weatherCode: number;
  precipitationProbability: number;
}

export interface CurrentWeather {
  temperature: number;
  apparentTemperature: number;
  humidity: number;
  isDay: boolean;
  precipitation: number;
  weatherCode: number;
  weatherInfo: WeatherConditionInfo;
  windSpeed: number;
  windDirection: number;
  surfacePressure: number;
  timeFormatted: string;
}

export interface WeatherData {
  city: {
    id: string;
    name: string;
    region: string;
    latitude: number;
    longitude: number;
  };
  current: CurrentWeather;
  daily: DailyForecast[];
  hourly: HourlyForecast[];
  lastUpdated: string;
}
