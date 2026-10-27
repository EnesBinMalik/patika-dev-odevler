export interface CovidDataCommon {
  updated: number;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion?: number;
  population: number;
  affectedCountries?: number;
}

export interface CovidCountryData extends CovidDataCommon {
  country: string;
  countryInfo: {
    _id: number | null;
    iso2: string | null;
    iso3: string | null;
    lat: number;
    long: number;
    flag: string;
  };
  continent?: string;
}

export interface CovidTimeline {
  cases: Record<string, number>;
  deaths: Record<string, number>;
  recovered: Record<string, number>;
}

export interface CovidCountryHistoricalResponse {
  country: string;
  province?: string[];
  timeline: CovidTimeline;
}

export interface DailyPoint {
  date: string;
  displayDate: string;
  cases: number;
  deaths: number;
  recovered: number;
}
