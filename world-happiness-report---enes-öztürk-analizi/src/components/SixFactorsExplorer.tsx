import React, { useState } from 'react';
import { DollarSign, Users, HeartPulse, Compass, ShieldCheck, Gift, Info, BarChart2 } from 'lucide-react';
import { FACTOR_LEADERS, HAPPINESS_DATASET, FactorLeaderInfo } from '../data/happinessData';

export const SixFactorsExplorer: React.FC = () => {
  const [selectedFactorKey, setSelectedFactorKey] = useState<FactorLeaderInfo['factorKey']>('gdpPerCapita');
  const [searchTerm, setSearchTerm] = useState('');

  const currentFactor = FACTOR_LEADERS.find((f) => f.factorKey === selectedFactorKey)!;

  const factorIcons: Record<FactorLeaderInfo['factorKey'], React.ReactNode> = {
    gdpPerCapita: <DollarSign className="w-5 h-5 text-amber-800" />,
    socialSupport: <Users className="w-5 h-5 text-blue-800" />,
    healthyLifeExpectancy: <HeartPulse className="w-5 h-5 text-rose-800" />,
    freedom: <Compass className="w-5 h-5 text-emerald-800" />,
    trustGovCorruption: <ShieldCheck className="w-5 h-5 text-purple-800" />,
    generosity: <Gift className="w-5 h-5 text-orange-800" />,
  };

  // Sort full dataset by selected factor
  const sortedCountries = [...HAPPINESS_DATASET]
    .filter((c) => c.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => (b[selectedFactorKey] as number) - (a[selectedFactorKey] as number));

  const maxFactorValue = Math.max(...HAPPINESS_DATASET.map((c) => c[selectedFactorKey] as number));

  return (
    <section className="py-12 bg-[#FAF7F2] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Araştırma Sorusu 01: Faktör ve Bölge Bazlı Liderlik
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Mutluluğu Belirleyen 6 Temel Faktör Atlası
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            Her faktörün küresel dağılımını, zirvedeki ülkeleri ve genel mutlulukla olan korelasyonunu interaktif olarak inceleyin.
          </p>
        </div>

        {/* Infographic Banner */}
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-0">
          <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-center bg-[#FDFBF7]">
            <span className="text-xs font-mono uppercase tracking-wider text-amber-900 font-semibold">
              İnfografik & Metodoloji Şeması
            </span>
            <h3 className="text-xl font-serif font-bold text-stone-900 mt-2 mb-3">
              İnsani İyi Oluş & Sosyal Refahın 6 Taşıyıcı Kolonu
            </h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Dünya Mutluluk Raporu, ülkeleri sadece gayri safi yurtiçi hasıla ile değerlendirmenin yanıltıcı olduğunu savunur. 
              Toplumsal güven, bireysel seçim özgürlüğü ve cömertlik gibi manevi-sosyal sermaye bileşenleri, 
              toplumların krizlere direnç göstermesinde ve sürdürülebilir refahında birincil rol oynar.
            </p>
          </div>
          <div className="lg:col-span-7 aspect-16/9 bg-stone-100 overflow-hidden">
            <img
              src="/src/assets/images/world_happiness_infographic_1794041979549.jpg"
              alt="İnsani İyi Oluş ve Sosyal Refah Faktörleri Şeması"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Factor Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {FACTOR_LEADERS.map((factor) => {
            const isSelected = factor.factorKey === selectedFactorKey;
            return (
              <button
                key={factor.factorKey}
                onClick={() => setSelectedFactorKey(factor.factorKey)}
                className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-sm'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className={`p-1.5 rounded ${isSelected ? 'bg-stone-800' : 'bg-stone-100'}`}>
                    {factorIcons[factor.factorKey]}
                  </div>
                  <span className={`text-[10px] font-mono tabular-nums ${isSelected ? 'text-amber-300' : 'text-stone-500'}`}>
                    r = {factor.correlationWithHappiness.toFixed(2)}
                  </span>
                </div>
                <div>
                  <div className={`text-xs font-semibold leading-tight ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {factor.factorNameTr}
                  </div>
                  <div className={`text-[11px] mt-1 truncate ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    Zirve: {factor.topCountries[0].country}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Factor Inspection Card */}
        <div className="bg-white border border-stone-200 rounded-xl p-6 lg:p-8 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-stone-100 rounded-lg">
                {factorIcons[selectedFactorKey]}
              </div>
              <div>
                <h3 className="text-xl font-serif font-bold text-stone-900">
                  {currentFactor.factorName}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {currentFactor.descriptionTr}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="px-3 py-1.5 bg-stone-50 border border-stone-200 rounded">
                <span className="text-stone-500">Dünya Ortalaması: </span>
                <strong className="text-stone-900 tabular-nums">{currentFactor.worldAverage.toFixed(3)}</strong>
              </div>
              <div className="px-3 py-1.5 bg-amber-50 border border-amber-200 rounded">
                <span className="text-amber-800">Mutlulukla Korelasyon: </span>
                <strong className="text-amber-950 tabular-nums">+{currentFactor.correlationWithHappiness.toFixed(2)}</strong>
              </div>
            </div>
          </div>

          {/* Analytical Insight Paragraph */}
          <div className="p-4 bg-[#FBF9F5] border border-stone-200 rounded-lg text-xs sm:text-sm text-stone-700 leading-relaxed flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="text-stone-900 font-serif">Enes Öztürk Analitik Çıkarımı: </strong>
              {currentFactor.importanceInsightTr}
            </div>
          </div>

          {/* Top 5 vs Bottom 3 in this factor */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-xs font-serif font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>Bu Faktörde Dünyanın En İleri 5 Ülkesi</span>
                <span className="text-stone-500 font-sans font-normal text-[11px]">Katkı Puanı</span>
              </div>
              <div className="space-y-2">
                {currentFactor.topCountries.map((c, idx) => (
                  <div key={c.country} className="p-3 bg-stone-50 border border-stone-200 rounded-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900 flex items-center gap-2">
                        <span className="w-4 text-stone-400 font-mono text-[11px]">{idx + 1}.</span>
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-mono font-bold text-stone-950 tabular-nums">
                        {c.value.toFixed(3)}
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-stone-900 h-full rounded-full"
                        style={{ width: `${(c.value / (maxFactorValue || 1)) * 100}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1.5">
                      {c.note}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="text-xs font-serif font-bold text-stone-900 mb-3 flex items-center justify-between">
                <span>En Çok Gelişime Açık / En Düşük Seviyeler</span>
                <span className="text-stone-500 font-sans font-normal text-[11px]">Katkı Puanı</span>
              </div>
              <div className="space-y-2">
                {currentFactor.bottomCountries.map((c, idx) => (
                  <div key={c.country} className="p-3 bg-rose-50/40 border border-rose-200/60 rounded-md">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-stone-900 flex items-center gap-2">
                        <span>{c.flag}</span>
                        <span>{c.country}</span>
                      </span>
                      <span className="font-mono font-bold text-rose-800 tabular-nums">
                        {c.value.toFixed(3)}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                      <div
                        className="bg-rose-700 h-full rounded-full"
                        style={{ width: `${Math.max(4, (c.value / (maxFactorValue || 1)) * 100)}%` }}
                      />
                    </div>
                    <p className="text-[11px] text-stone-500 mt-1">
                      Kriz, yoksulluk veya kurumsal tahribatın doğrudan yansıması.
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Full Interactive Searchable Leaderboard by Selected Factor */}
          <div className="border-t border-stone-200 pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div className="text-sm font-serif font-bold text-stone-900">
                Seçili Faktöre Göre Ülke Sıralaması ({sortedCountries.length} Ülke)
              </div>
              <input
                type="text"
                placeholder="Ülke ara (Örn: Türkiye, Norveç, Singapur)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="px-3 py-1.5 text-xs border border-stone-300 rounded-md bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-stone-900 w-full sm:w-64"
              />
            </div>

            <div className="max-h-72 overflow-y-auto border border-stone-200 rounded-lg">
              <table className="w-full text-xs text-left">
                <thead className="bg-stone-100 text-stone-600 font-medium sticky top-0 border-b border-stone-200">
                  <tr>
                    <th className="py-2.5 px-3">Faktör Sırası</th>
                    <th className="py-2.5 px-3">Ülke</th>
                    <th className="py-2.5 px-3">Bölge</th>
                    <th className="py-2.5 px-3 text-right">Faktör Değeri</th>
                    <th className="py-2.5 px-3 text-right">Genel Mutluluk Puanı</th>
                    <th className="py-2.5 px-3 text-right">Genel Sıra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-200 font-sans">
                  {sortedCountries.map((c, index) => {
                    const factorVal = c[selectedFactorKey] as number;
                    return (
                      <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                        <td className="py-2 px-3 font-mono text-stone-500 tabular-nums">#{index + 1}</td>
                        <td className="py-2 px-3 font-medium text-stone-900 flex items-center gap-2">
                          <span>{c.flag}</span>
                          <span>{c.nameTr}</span>
                        </td>
                        <td className="py-2 px-3 text-stone-600 text-[11px]">{c.regionTr}</td>
                        <td className="py-2 px-3 text-right font-mono font-bold text-stone-950 tabular-nums">
                          {factorVal.toFixed(3)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-stone-700 tabular-nums">
                          {c.score2017.toFixed(3)}
                        </td>
                        <td className="py-2 px-3 text-right font-mono text-stone-500 tabular-nums">
                          #{c.rank2017}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
