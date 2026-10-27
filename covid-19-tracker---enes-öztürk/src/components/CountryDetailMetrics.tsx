import React from 'react';
import { Microscope, ShieldCheck, Users, Activity, AlertTriangle, Layers } from 'lucide-react';
import { CovidDataCommon, CovidCountryData } from '../types/covid';

interface CountryDetailMetricsProps {
  data: CovidDataCommon;
  selectedCountry: string;
  countryObj?: CovidCountryData | null;
}

export const CountryDetailMetrics: React.FC<CountryDetailMetricsProps> = ({
  data,
  selectedCountry,
  countryObj,
}) => {
  const {
    tests,
    testsPerOneMillion,
    casesPerOneMillion,
    deathsPerOneMillion,
    critical,
    population,
  } = data;

  const continent = countryObj?.continent || (selectedCountry === 'global' ? 'Tüm Kıtalar' : 'Bilinmiyor');

  const metrics = [
    {
      label: 'Yapılan Toplam Test',
      value: tests ? tests.toLocaleString('tr-TR') : 'Kayıt Yok',
      subtext: testsPerOneMillion
        ? `${testsPerOneMillion.toLocaleString('tr-TR')} test / 1M kişi`
        : 'Veri mevcut değil',
      icon: Microscope,
      color: 'text-indigo-600',
      bg: 'bg-indigo-50',
    },
    {
      label: '1 Milyon Başına Vaka',
      value: casesPerOneMillion ? casesPerOneMillion.toLocaleString('tr-TR') : '0',
      subtext: 'Bölgesel yayılım yoğunluğu',
      icon: Activity,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      label: '1 Milyon Başına Vefat',
      value: deathsPerOneMillion ? deathsPerOneMillion.toLocaleString('tr-TR') : '0',
      subtext: 'Mortalite yoğunluğu indeksi',
      icon: ShieldCheck,
      color: 'text-rose-600',
      bg: 'bg-rose-50',
    },
    {
      label: 'Kritik Yoğun Bakım',
      value: critical ? critical.toLocaleString('tr-TR') : '0',
      subtext: 'Hayati tehlikesi süren hastalar',
      icon: AlertTriangle,
      color: 'text-amber-600',
      bg: 'bg-amber-50',
    },
    {
      label: 'Toplam Nüfus',
      value: population ? population.toLocaleString('tr-TR') : 'Bilinmiyor',
      subtext: `Kıta: ${continent}`,
      icon: Users,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50',
    },
    {
      label: 'Kayıtlı Bölge / Kıta',
      value: continent,
      subtext: countryObj?.countryInfo.iso3 ? `ISO: ${countryObj.countryInfo.iso3}` : 'Global',
      icon: Layers,
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
  ];

  return (
    <section className="bg-white rounded-xl border border-slate-200 p-6 mb-8 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            {selectedCountry === 'global' ? 'Küresel' : countryObj?.country || selectedCountry} Ek Göstergeler & Test Verileri
          </h3>
          <p className="text-xs text-slate-500">
            Sağlık altyapısı, test oranları ve kritik vaka yoğunluğu
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {metrics.map((m, idx) => {
          const Icon = m.icon;
          return (
            <div
              key={idx}
              className="p-4 rounded-lg bg-slate-50/80 border border-slate-100 flex items-start gap-3.5 hover:bg-slate-100/60 transition-colors"
            >
              <div className={`w-9 h-9 rounded-lg ${m.bg} ${m.color} flex items-center justify-center shrink-0`}>
                <Icon className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-xs text-slate-500 font-medium block">
                  {m.label}
                </span>
                <span className="text-base font-bold text-slate-900 font-mono-numbers block truncate">
                  {m.value}
                </span>
                <span className="text-[11px] text-slate-400 block truncate">
                  {m.subtext}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
