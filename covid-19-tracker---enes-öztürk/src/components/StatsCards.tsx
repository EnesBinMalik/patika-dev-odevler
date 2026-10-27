import React from 'react';
import { UserCheck, HeartPulse, Skull, Activity, Clock, TrendingUp } from 'lucide-react';
import { CovidDataCommon } from '../types/covid';

interface StatsCardsProps {
  data: CovidDataCommon | null;
  loading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ data, loading }) => {
  if (loading || !data) {
    return (
      <section id="durum-kartlari" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="p-6 bg-white rounded-xl border border-slate-200 shadow-xs animate-pulse"
          >
            <div className="h-4 w-24 bg-slate-200 rounded mb-4" />
            <div className="h-9 w-36 bg-slate-200 rounded mb-2" />
            <div className="h-3 w-28 bg-slate-100 rounded mb-4" />
            <div className="h-px bg-slate-100 my-3" />
            <div className="h-3 w-40 bg-slate-100 rounded" />
          </div>
        ))}
      </section>
    );
  }

  const { cases, recovered, deaths, active, todayCases, todayRecovered, todayDeaths, critical, updated } = data;

  const formattedDate = updated
    ? new Date(updated).toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'Bilinmiyor';

  // Calculate percentages
  const recoveryRate = cases > 0 ? ((recovered / cases) * 100).toFixed(1) : '0.0';
  const deathRate = cases > 0 ? ((deaths / cases) * 100).toFixed(2) : '0.00';
  const activeRate = cases > 0 ? ((active / cases) * 100).toFixed(1) : '0.0';

  const cards = [
    {
      id: 'infected',
      title: 'Enfekte Olan',
      subtitle: 'Toplam pozitif vaka sayısı',
      value: cases,
      todayChange: todayCases,
      todayLabel: 'yeni vaka',
      rate: 'Tüm vakaların %100\'ü',
      accentColor: 'indigo',
      textColor: 'text-indigo-600',
      bgColor: 'bg-indigo-50/50',
      borderColor: 'border-indigo-100 hover:border-indigo-200',
      bottomLineColor: 'bg-indigo-500',
      icon: Activity,
    },
    {
      id: 'recovered',
      title: 'İyileşen',
      subtitle: 'Sağlığına kavuşan toplam hasta',
      value: recovered,
      todayChange: todayRecovered,
      todayLabel: 'yeni iyileşen',
      rate: `%${recoveryRate} iyileşme oranı`,
      accentColor: 'emerald',
      textColor: 'text-emerald-600',
      bgColor: 'bg-emerald-50/50',
      borderColor: 'border-emerald-100 hover:border-emerald-200',
      bottomLineColor: 'bg-emerald-500',
      icon: HeartPulse,
    },
    {
      id: 'deaths',
      title: 'Vefat Eden',
      subtitle: 'COVID-19 kaynaklı vefatlar',
      value: deaths,
      todayChange: todayDeaths,
      todayLabel: 'yeni vefat',
      rate: `%${deathRate} ölüm oranı`,
      accentColor: 'rose',
      textColor: 'text-rose-600',
      bgColor: 'bg-rose-50/50',
      borderColor: 'border-rose-100 hover:border-rose-200',
      bottomLineColor: 'bg-rose-500',
      icon: Skull,
    },
    {
      id: 'active',
      title: 'Aktif Hasta',
      subtitle: 'Tedavisi devam eden vakalar',
      value: active,
      todayChange: critical,
      todayLabel: 'kritik yoğun bakım',
      rate: `%${activeRate} aktif vaka oranı`,
      accentColor: 'amber',
      textColor: 'text-amber-600',
      bgColor: 'bg-amber-50/50',
      borderColor: 'border-amber-100 hover:border-amber-200',
      bottomLineColor: 'bg-amber-500',
      icon: UserCheck,
    },
  ];

  return (
    <section id="durum-kartlari" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`relative overflow-hidden rounded-xl bg-white border ${card.borderColor} p-5 sm:p-6 shadow-xs transition-all duration-200 hover:shadow-md flex flex-col justify-between`}
          >
            {/* Top row: Title and Icon */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold tracking-wide text-slate-700">
                  {card.title}
                </span>
                <div className={`w-9 h-9 rounded-lg ${card.bgColor} ${card.textColor} flex items-center justify-center shrink-0`}>
                  <Icon className="w-5 h-5" />
                </div>
              </div>

              {/* Metric Value */}
              <div className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${card.textColor} font-mono-numbers mb-1.5`}>
                {card.value.toLocaleString('tr-TR')}
              </div>

              {/* Subtitle description */}
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                {card.subtitle}
              </p>

              {/* Secondary stats & rate */}
              <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-3 pt-2 border-t border-slate-100">
                <span className="flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-slate-400" />
                  <span>{card.rate}</span>
                </span>
                {card.todayChange > 0 && (
                  <span className="font-mono-numbers text-slate-700">
                    +{card.todayChange.toLocaleString('tr-TR')} {card.todayLabel}
                  </span>
                )}
              </div>
            </div>

            {/* Bottom: Last updated timestamp - as clean unboxed text */}
            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>Son Güncelleme:</span>
              </span>
              <span className="font-mono-numbers text-slate-500 font-medium">
                {formattedDate}
              </span>
            </div>

            {/* Subtle bottom indicator strip */}
            <div className={`absolute bottom-0 left-0 right-0 h-1 ${card.bottomLineColor}`} />
          </div>
        );
      })}
    </section>
  );
};
