import React, { useState } from 'react';
import { ArrowUp, ArrowDown, Minus, Filter, Search, BarChart3, TrendingUp } from 'lucide-react';
import { HAPPINESS_DATASET, CountryHappiness } from '../data/happinessData';

export const HistoricalEvolutionView: React.FC = () => {
  const [comparisonPeriod, setComparisonPeriod] = useState<'1517' | '1617'>('1517');
  const [filterRegion, setFilterRegion] = useState<string>('all');
  const [trendFilter, setTrendFilter] = useState<'all' | 'gainers' | 'droppers'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'rank' | 'score' | 'rankDelta' | 'scoreDelta'>('rank');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Regions list
  const regions = [
    { id: 'all', label: 'Tüm Bölgeler' },
    { id: 'Western Europe', label: 'Batı Avrupa' },
    { id: 'Central & Eastern Europe', label: 'Orta & Doğu Avrupa' },
    { id: 'Latin America & Caribbean', label: 'Latin Amerika & Karayipler' },
    { id: 'Middle East & North Africa', label: 'Orta Doğu & Kuzey Afrika' },
    { id: 'Sub-Saharan Africa', label: 'Sahra Altı Afrika' },
    { id: 'East Asia', label: 'Doğu Asya' },
    { id: 'Southeast Asia', label: 'Güneydoğu Asya' },
    { id: 'South Asia', label: 'Güney Asya' },
    { id: 'North America & ANZ', label: 'Kuzey Amerika & Okyanusya' },
  ];

  const filteredCountries = HAPPINESS_DATASET.filter((c) => {
    const matchesSearch = c.nameTr.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = filterRegion === 'all' || c.region === filterRegion;
    const scoreDelta = comparisonPeriod === '1517' ? c.scoreDelta1517 : c.scoreDelta1617;
    
    let matchesTrend = true;
    if (trendFilter === 'gainers') matchesTrend = scoreDelta > 0.05;
    if (trendFilter === 'droppers') matchesTrend = scoreDelta < -0.05;

    return matchesSearch && matchesRegion && matchesTrend;
  });

  const sortedCountries = [...filteredCountries].sort((a, b) => {
    let comparison = 0;
    if (sortBy === 'rank') {
      comparison = a.rank2017 - b.rank2017;
    } else if (sortBy === 'score') {
      comparison = b.score2017 - a.score2017;
    } else if (sortBy === 'rankDelta') {
      const deltaA = comparisonPeriod === '1517' ? a.rankDelta1517 : a.rankDelta1617;
      const deltaB = comparisonPeriod === '1517' ? b.rankDelta1517 : b.rankDelta1617;
      comparison = deltaB - deltaA;
    } else if (sortBy === 'scoreDelta') {
      const deltaA = comparisonPeriod === '1517' ? a.scoreDelta1517 : a.scoreDelta1617;
      const deltaB = comparisonPeriod === '1517' ? b.scoreDelta1617 : b.scoreDelta1617;
      comparison = deltaB - deltaA;
    }
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  // Global calculations
  const totalGainers = HAPPINESS_DATASET.filter((c) => (comparisonPeriod === '1517' ? c.scoreDelta1517 : c.scoreDelta1617) > 0).length;
  const totalDroppers = HAPPINESS_DATASET.filter((c) => (comparisonPeriod === '1517' ? c.scoreDelta1517 : c.scoreDelta1617) < 0).length;

  return (
    <section className="py-12 bg-white border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Araştırma Sorusu 02: Tarihsel Değişim Dinamiği
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              2015-2016 ile 2016-2017 Sıralama ve Puan Dönüşümleri
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            Ülkelerin 2 yıllık periyotta nasıl basamak atladığını veya gerilediğini, puan farklarını ve yapısal kırılmaları karşılaştırın.
          </p>
        </div>

        {/* Period Selector and High-level stats bar */}
        <div className="p-4 sm:p-6 bg-[#FBF9F5] border border-stone-200 rounded-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs font-serif font-bold text-stone-900">Kıyaslama Periyodu:</span>
              <div className="inline-flex rounded-lg border border-stone-300 p-1 bg-white">
                <button
                  onClick={() => setComparisonPeriod('1517')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    comparisonPeriod === '1517'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  2015 ➔ 2017 (2 Yıllık Dönüşüm)
                </button>
                <button
                  onClick={() => setComparisonPeriod('1617')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    comparisonPeriod === '1617'
                      ? 'bg-stone-900 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  2016 ➔ 2017 (Yıllık Değişim)
                </button>
              </div>
            </div>

            {/* Quick aggregate counters */}
            <div className="flex items-center gap-4 text-xs font-mono">
              <span className="text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
                ▲ Puanı Artan: <strong>{totalGainers} Ülke</strong>
              </span>
              <span className="text-rose-800 bg-rose-50 px-2.5 py-1 rounded border border-rose-200">
                ▼ Puanı Düşen: <strong>{totalDroppers} Ülke</strong>
              </span>
            </div>
          </div>

          {/* Filtering and Search Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
            <div className="sm:col-span-4 relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Ülke filtrele (Örn: Norveç, Türkiye, Letonya)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>

            <div className="sm:col-span-4">
              <select
                value={filterRegion}
                onChange={(e) => setFilterRegion(e.target.value)}
                className="w-full py-2 px-3 text-xs border border-stone-300 rounded-md bg-white focus:outline-none focus:ring-1 focus:ring-stone-900"
              >
                {regions.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-4 flex items-center gap-1.5">
              <button
                onClick={() => setTrendFilter('all')}
                className={`flex-1 py-2 text-xs rounded-md border text-center font-medium cursor-pointer transition-colors ${
                  trendFilter === 'all'
                    ? 'bg-stone-900 text-white border-stone-900'
                    : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-100'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => setTrendFilter('gainers')}
                className={`flex-1 py-2 text-xs rounded-md border text-center font-medium cursor-pointer transition-colors ${
                  trendFilter === 'gainers'
                    ? 'bg-emerald-900 text-white border-emerald-900'
                    : 'bg-white text-emerald-800 border-stone-300 hover:bg-emerald-50'
                }`}
              >
                Yükselenler
              </button>
              <button
                onClick={() => setTrendFilter('droppers')}
                className={`flex-1 py-2 text-xs rounded-md border text-center font-medium cursor-pointer transition-colors ${
                  trendFilter === 'droppers'
                    ? 'bg-rose-900 text-white border-rose-900'
                    : 'bg-white text-rose-800 border-stone-300 hover:bg-rose-50'
                }`}
              >
                Düşenler
              </button>
            </div>
          </div>
        </div>

        {/* Historical Evolution Matrix Table */}
        <div className="border border-stone-300 rounded-xl overflow-hidden shadow-2xs">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-stone-100 text-stone-700 font-semibold border-b border-stone-300">
                <tr>
                  <th
                    className="py-3 px-3 cursor-pointer hover:bg-stone-200"
                    onClick={() => {
                      setSortBy('rank');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    2017 Sırası
                  </th>
                  <th className="py-3 px-3">Ülke</th>
                  <th className="py-3 px-3">Bölge</th>
                  <th className="py-3 px-3 text-right">
                    {comparisonPeriod === '1517' ? '2015 Skoru' : '2016 Skoru'}
                  </th>
                  <th className="py-3 px-3 text-right">2017 Skoru</th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer hover:bg-stone-200"
                    onClick={() => {
                      setSortBy('scoreDelta');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Puan Farkı (Δ)
                  </th>
                  <th
                    className="py-3 px-3 text-right cursor-pointer hover:bg-stone-200"
                    onClick={() => {
                      setSortBy('rankDelta');
                      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                    }}
                  >
                    Sıra Değişimi
                  </th>
                  <th className="py-3 px-3">Önemli Gözlem & Dinamik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 font-sans">
                {sortedCountries.map((c) => {
                  const baseScore = comparisonPeriod === '1517' ? c.score2015 : c.score2016;
                  const baseRank = comparisonPeriod === '1517' ? c.rank2015 : c.rank2016;
                  const scoreDelta = comparisonPeriod === '1517' ? c.scoreDelta1517 : c.scoreDelta1617;
                  const rankDelta = comparisonPeriod === '1517' ? c.rankDelta1517 : c.rankDelta1617;

                  const isPositiveScore = scoreDelta > 0.001;
                  const isNegativeScore = scoreDelta < -0.001;

                  return (
                    <tr key={c.id} className="hover:bg-amber-50/30 transition-colors">
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900 tabular-nums">
                        #{c.rank2017}
                      </td>
                      <td className="py-2.5 px-3 font-medium text-stone-900 whitespace-nowrap">
                        <span className="mr-1.5">{c.flag}</span>
                        <span>{c.nameTr}</span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-600 text-[11px] whitespace-nowrap">
                        {c.regionTr}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono text-stone-600 tabular-nums">
                        {baseScore.toFixed(3)} <span className="text-[10px] text-stone-400">(#{baseRank})</span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold text-stone-950 tabular-nums">
                        {c.score2017.toFixed(3)}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono font-bold tabular-nums">
                        <span
                          className={`inline-flex items-center justify-end gap-1 ${
                            isPositiveScore
                              ? 'text-emerald-700'
                              : isNegativeScore
                              ? 'text-rose-700'
                              : 'text-stone-500'
                          }`}
                        >
                          {isPositiveScore ? '+' : ''}
                          {scoreDelta.toFixed(3)}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono tabular-nums">
                        {rankDelta > 0 ? (
                          <span className="text-emerald-700 font-semibold inline-flex items-center gap-0.5">
                            <ArrowUp className="w-3 h-3" />
                            +{rankDelta}
                          </span>
                        ) : rankDelta < 0 ? (
                          <span className="text-rose-700 font-semibold inline-flex items-center gap-0.5">
                            <ArrowDown className="w-3 h-3" />
                            {rankDelta}
                          </span>
                        ) : (
                          <span className="text-stone-400 inline-flex items-center gap-0.5">
                            <Minus className="w-3 h-3" /> 0
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-[11px] text-stone-600 max-w-xs truncate">
                        {c.keyObservation || `${c.regionTr} ortalamasına paralel dengeli seyir.`}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Card: Why did positions fluctuate? */}
        <div className="p-6 bg-[#FAF7F2] border border-stone-200 rounded-xl space-y-3">
          <div className="text-sm font-serif font-bold text-stone-900">
            Enes Öztürk Araştırma Notu: Değişimlerin Sosyolojik Yorumu
          </div>
          <p className="text-xs text-stone-700 leading-relaxed">
            2015-2017 yılları arasında dünya genelindeki mutluluk değişimleri incelendiğinde; sıralamalardaki 
            büyük oynamaların yalnızca para ve kişi başı gelirle açıklanamayacağı görülmektedir. 
            Venezuela'daki -59 sıralık çöküş, bir ülkede kurumsal mekanizmalar ve özgürlük hissi çöktüğünde 
            halkın mutluluğunun aniden nasıl buharlaştığını gösterir. Diğer taraftan Togo'nun 2015 sonunculuğundan 
            başlayarak 0.65 puan sıçraması ve Letonya'nın 35 sıra atlaması, temel hizmetlerdeki ve hukuki reformlardaki 
            iyileşmenin bireyler üzerindeki doğrudan pozitif dönüştürücü etkisini belgeler.
          </p>
        </div>
      </div>
    </section>
  );
};
