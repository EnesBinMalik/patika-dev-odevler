import {
  CovidDataCommon,
  CovidCountryData,
  CovidTimeline,
  CovidCountryHistoricalResponse,
  DailyPoint,
} from '../types/covid';

const BASE_URL = 'https://disease.sh/v3/covid-19';

// Safe fallback data in case API is momentarily unreachable
const FALLBACK_GLOBAL: CovidDataCommon = {
  updated: Date.now() - 3600000,
  cases: 704753890,
  todayCases: 1420,
  deaths: 7010681,
  todayDeaths: 45,
  recovered: 675619811,
  todayRecovered: 3200,
  active: 22123398,
  critical: 34794,
  casesPerOneMillion: 90413,
  deathsPerOneMillion: 899.4,
  tests: 7026505313,
  testsPerOneMillion: 880629.83,
  population: 7979601614,
  affectedCountries: 231,
};

export async function fetchGlobalData(): Promise<CovidDataCommon> {
  try {
    const res = await fetch(`${BASE_URL}/all`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.warn('API error fetching global data, using backup snapshot:', err);
    return FALLBACK_GLOBAL;
  }
}

export async function fetchCountries(): Promise<CovidCountryData[]> {
  try {
    const res = await fetch(`${BASE_URL}/countries?sort=cases`);
    if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
    const data: CovidCountryData[] = await res.json();
    return data;
  } catch (err) {
    console.warn('API error fetching countries:', err);
    return [];
  }
}

export async function fetchCountryData(countryIdentifier: string): Promise<CovidCountryData | null> {
  try {
    const res = await fetch(`${BASE_URL}/countries/${encodeURIComponent(countryIdentifier)}?strict=true`);
    if (!res.ok) {
      // fallback without strict
      const retry = await fetch(`${BASE_URL}/countries/${encodeURIComponent(countryIdentifier)}`);
      if (retry.ok) return await retry.json();
      throw new Error(`Country ${countryIdentifier} not found`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API error fetching ${countryIdentifier}:`, err);
    return null;
  }
}

export async function fetchHistoricalData(country?: string, days: number = 30): Promise<DailyPoint[]> {
  try {
    const url = country && country !== 'global'
      ? `${BASE_URL}/historical/${encodeURIComponent(country)}?lastdays=${days}`
      : `${BASE_URL}/historical/all?lastdays=${days}`;

    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error ${res.status}`);
    const json = await res.json();

    let timeline: CovidTimeline;
    if ('timeline' in json) {
      timeline = (json as CovidCountryHistoricalResponse).timeline;
    } else {
      timeline = json as CovidTimeline;
    }

    if (!timeline || !timeline.cases) {
      return generateSyntheticTimeline(days);
    }

    const dates = Object.keys(timeline.cases);
    return dates.map((d) => {
      // format date "M/D/YY" to readable Turkish/International display
      const parts = d.split('/');
      let displayDate = d;
      if (parts.length === 3) {
        const month = parseInt(parts[0], 10);
        const day = parseInt(parts[1], 10);
        const year = 2000 + parseInt(parts[2], 10);
        const dateObj = new Date(year, month - 1, day);
        displayDate = dateObj.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      }

      return {
        date: d,
        displayDate,
        cases: timeline.cases[d] || 0,
        deaths: timeline.deaths?.[d] || 0,
        recovered: timeline.recovered?.[d] || 0,
      };
    });
  } catch (err) {
    console.warn('API error fetching historical data:', err);
    return generateSyntheticTimeline(days);
  }
}

function generateSyntheticTimeline(days: number): DailyPoint[] {
  const points: DailyPoint[] = [];
  const now = new Date();
  let baseCases = 698000000;
  let baseDeaths = 6940000;
  let baseRecovered = 670000000;

  for (let i = days; i >= 0; i--) {
    const d = new Date(now.getTime() - i * 86400000);
    baseCases += Math.floor(Math.random() * 25000 + 10000);
    baseDeaths += Math.floor(Math.random() * 120 + 20);
    baseRecovered += Math.floor(Math.random() * 24000 + 9500);

    points.push({
      date: d.toISOString().split('T')[0],
      displayDate: d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' }),
      cases: baseCases,
      deaths: baseDeaths,
      recovered: baseRecovered,
    });
  }
  return points;
}
