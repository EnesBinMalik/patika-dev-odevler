import React, { useState } from 'react';
import { EnergyHourlyData, TargetVariable } from '../types/energy';
import { DatasetSummary, DATASET_CORRELATION_MATRIX } from '../data/spainEnergyData';
import { TimeSeriesChart } from './Charts/TimeSeriesChart';
import { CorrelationHeatmap } from './Charts/CorrelationHeatmap';
import { Zap, Euro, Wind, Sun, CloudRain, Thermometer, ExternalLink, Flame, Atom } from 'lucide-react';

interface DataExplorationTabProps {
  data: EnergyHourlyData[];
  summary: DatasetSummary;
  target: TargetVariable;
}

export const DataExplorationTab: React.FC<DataExplorationTabProps> = ({
  data,
  summary,
}) => {
  const [tableSearch, setTableSearch] = useState('');
  const [page, setPage] = useState(0);
  const pageSize = 8;

  const filteredData = data.filter(d =>
    d.time.includes(tableSearch) ||
    d.weather_main.toLowerCase().includes(tableSearch.toLowerCase())
  );

  const paginatedData = filteredData.slice(page * pageSize, (page + 1) * pageSize);
  const totalPages = Math.ceil(filteredData.length / pageSize);

  // Cities metadata
  const cities = [
    { name: 'Madrid', role: 'Başkent & İç Anadolu', temp: summary.avgTempMadrid, popWeight: '%30', coldRisk: 'Yüksek (Kış -5°C)' },
    { name: 'Barselona', role: 'Katalonya Sahil Şeridi', temp: Number((summary.avgTempMadrid + 3.2).toFixed(1)), popWeight: '%25', coldRisk: 'Orta (Akdeniz)' },
    { name: 'Valensiya', role: 'Doğu Kıyı & Liman', temp: Number((summary.avgTempMadrid + 4.1).toFixed(1)), popWeight: '%15', coldRisk: 'Düşük (Nemli)' },
    { name: 'Sevilla', role: 'Endülüs Sıcaklık Merkezi', temp: summary.avgTempSeville, popWeight: '%15', coldRisk: 'Kritik Yaz Sıcağı (+43°C)' },
    { name: 'Bilbao', role: 'Kuzey Atlantik Yağış Hattı', temp: Number((summary.avgTempMadrid + 1.5).toFixed(1)), popWeight: '%15', coldRisk: 'Yüksek Yağış & Rüzgar' },
  ];

  return (
    <div className="space-y-6">
      {/* Overview & Academic Context */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-blue-900/60 text-blue-300 border border-blue-700/50">
                Kaggle Benchmark Veri Seti
              </span>
              <span className="text-xs text-slate-400">Nicholas Jhana / REE & AEMET</span>
            </div>
            <h2 className="text-lg font-bold text-white">
              İspanya 4 Yıllık Elektrik Tüketimi, Üretimi, Fiyatlandırması ve Hava Durumu
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
              Bu problemde İspanya iletim sistemi operatörü (<strong>Red Eléctrica de España - REE</strong>) ve devlet meteoroloji ajansı (<strong>AEMET</strong>) verileri kullanılarak saatlik elektrik talebi (MW) ve spot elektrik fiyatı (€/MWh) modellenmektedir. Aşırı soğuk veya aşırı sıcak günlerde oluşan pik yükleri önceden tahmin etmek, belediyeler ve şebeke operatörleri için hem arz güvenliği hem de vatandaşları koruyucu dinamik sübvansiyon politikaları açısından hayati öneme sahiptir.
            </p>
          </div>

          <a
            href="https://www.kaggle.com/nicholasjhana/energy-consumption-generation-prices-and-weather"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium whitespace-nowrap self-start transition"
          >
            <span>Kaggle Veri Setini İncele</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>
        </div>

        {/* Key Metrics Quick Ribbon */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4 pt-4 border-t border-slate-800">
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Zap className="w-3 h-3 text-blue-400" /> Ort. Elektrik Talebi
            </span>
            <span className="text-sm font-bold text-white font-mono block mt-0.5">
              {summary.meanLoad.toLocaleString('tr-TR')} MW
            </span>
            <span className="text-[10px] text-slate-500">Min: {summary.minLoad.toLocaleString('tr-TR')} MW</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Euro className="w-3 h-3 text-emerald-400" /> Ort. Spot Fiyatı
            </span>
            <span className="text-sm font-bold text-emerald-400 font-mono block mt-0.5">
              {summary.meanPrice.toFixed(2)} €/MWh
            </span>
            <span className="text-[10px] text-slate-500">Aralık: {summary.minPrice} - {summary.maxPrice} €</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Wind className="w-3 h-3 text-cyan-400" /> Ort. Rüzgar Üretimi
            </span>
            <span className="text-sm font-bold text-cyan-300 font-mono block mt-0.5">
              {summary.avgWindMW.toLocaleString('tr-TR')} MW
            </span>
            <span className="text-[10px] text-slate-500">Merit-order fiyat düşürücü</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Sun className="w-3 h-3 text-amber-400" /> Ort. Güneş Üretimi
            </span>
            <span className="text-sm font-bold text-amber-300 font-mono block mt-0.5">
              {summary.avgSolarMW.toLocaleString('tr-TR')} MW
            </span>
            <span className="text-[10px] text-slate-500">Öğle saatleri pik üretimi</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Thermometer className="w-3 h-3 text-rose-400" /> Madrid / Sevilla Sıcaklık
            </span>
            <span className="text-sm font-bold text-rose-300 font-mono block mt-0.5">
              {summary.avgTempMadrid}° / {summary.avgTempSeville}°C
            </span>
            <span className="text-[10px] text-slate-500">U-eğrisi talep tetikleyici</span>
          </div>

          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80">
            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <CloudRain className="w-3 h-3 text-purple-400" /> Zaman Aralığı
            </span>
            <span className="text-sm font-bold text-white font-mono block mt-0.5">
              2015 - 2018
            </span>
            <span className="text-[10px] text-emerald-400">4 Tam Yıl Saatlik</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Time Series Chart */}
      <TimeSeriesChart data={data} highlightOutliers={true} />

      {/* 5 Spanish Cities Climate Drivers & Generation Mix */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Five Cities Breakdown */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
            <Thermometer className="w-4 h-4 text-rose-400" />
            <span>İspanya 5 Büyük Şehir Meteoroloji & Nüfus Ağırlıkları</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Toplam elektrik talebini yönlendiren 5 stratejik merkezin iklim profilleri
          </p>

          <div className="space-y-3">
            {cities.map(c => (
              <div key={c.name} className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white">{c.name}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-blue-950 text-blue-300 border border-blue-800">
                      Nüfus Ağırlığı: {c.popWeight}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400 block mt-0.5">{c.role}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-amber-400 font-mono">{c.temp} °C</span>
                  <span className="text-[10px] text-slate-400 block">{c.coldRisk}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Spain Energy Generation Fuel Mix */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
          <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
            <Flame className="w-4 h-4 text-amber-400" />
            <span>İspanya Elektrik Üretim Kaynak Dağılımı (Merit-Order)</span>
          </h3>
          <p className="text-xs text-slate-400 mb-4">
            Spot elektrik fiyatını en çok belirleyen yakıt ve yenilenebilir üretim kompozisyonu
          </p>

          <div className="space-y-3.5">
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5"><Atom className="w-3.5 h-3.5 text-indigo-400" /> Nükleer (Nuclear Baseload)</span>
                <span className="font-mono text-indigo-300">~7,000 MW (%24)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full" style={{ width: '24%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-cyan-400" /> Rüzgar Santralleri (Wind Farms)</span>
                <span className="font-mono text-cyan-300">~6,800 MW (%23)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-cyan-500 h-full rounded-full" style={{ width: '23%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5"><Flame className="w-3.5 h-3.5 text-orange-400" /> Doğal Gaz Çevrim Santralleri (CCGT)</span>
                <span className="font-mono text-orange-300">~5,900 MW (%20) - Marjinal Fiyat Belirleyici</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-orange-500 h-full rounded-full" style={{ width: '20%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5"><Sun className="w-3.5 h-3.5 text-amber-400" /> Güneş Enerjisi (PV & CSP)</span>
                <span className="font-mono text-amber-300">~3,400 MW (%12)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full rounded-full" style={{ width: '12%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-slate-300 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-400" /> Hidroelektrik & Diğer</span>
                <span className="font-mono text-blue-300">~6,000 MW (%21)</span>
              </div>
              <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full rounded-full" style={{ width: '21%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Correlation Matrix Heatmap */}
      <CorrelationHeatmap correlations={DATASET_CORRELATION_MATRIX} />

      {/* Interactive Data Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-base font-semibold text-white">Ham Veri Örneklem Tablosu</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              İspanya saatlik gözlemlerinden canlı örneklem ({filteredData.length} kayıt)
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Zaman veya hava ara..."
              value={tableSearch}
              onChange={e => {
                setTableSearch(e.target.value);
                setPage(0);
              }}
              className="bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950 text-slate-400 font-medium border-b border-slate-800">
              <tr>
                <th className="p-2.5">Zaman (CET)</th>
                <th className="p-2.5">Talep (MW)</th>
                <th className="p-2.5">Piyasa Fiyatı (€)</th>
                <th className="p-2.5">Rüzgar (MW)</th>
                <th className="p-2.5">Güneş (MW)</th>
                <th className="p-2.5">Doğal Gaz (MW)</th>
                <th className="p-2.5">Madrid Sıcaklık</th>
                <th className="p-2.5">Hava Durumu</th>
                <th className="p-2.5">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-800/40">
                  <td className="p-2.5 font-mono text-slate-300 whitespace-nowrap">{row.time}</td>
                  <td className="p-2.5 font-mono font-semibold text-blue-400">
                    {isNaN(row.total_load_actual) ? (
                      <span className="text-rose-400 font-bold">NaN (Eksik)</span>
                    ) : (
                      row.total_load_actual.toLocaleString('tr-TR')
                    )}
                  </td>
                  <td className="p-2.5 font-mono font-semibold text-emerald-400">
                    {isNaN(row.price_actual) ? (
                      <span className="text-rose-400 font-bold">NaN (Eksik)</span>
                    ) : (
                      `${row.price_actual.toFixed(2)} €`
                    )}
                  </td>
                  <td className="p-2.5 font-mono text-cyan-300">{row.generation_wind.toLocaleString('tr-TR')}</td>
                  <td className="p-2.5 font-mono text-amber-300">{row.generation_solar.toLocaleString('tr-TR')}</td>
                  <td className="p-2.5 font-mono text-orange-300">{row.generation_fossil_gas.toLocaleString('tr-TR')}</td>
                  <td className="p-2.5 font-mono text-slate-300">{row.temp_madrid} °C</td>
                  <td className="p-2.5 text-slate-300">{row.weather_main}</td>
                  <td className="p-2.5">
                    {row.is_outlier ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950 text-rose-300 border border-rose-800 font-medium">
                        Aykırı Değer
                      </span>
                    ) : row.is_missing_load || row.is_missing_price ? (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-800 font-medium">
                        Eksik Değer
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 font-medium">
                        Normal
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between text-xs text-slate-400 mt-4 pt-3 border-t border-slate-800">
          <span>Sayfa {page + 1} / {totalPages || 1}</span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40 cursor-pointer"
            >
              Önceki
            </button>
            <button
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1 rounded bg-slate-800 text-slate-200 disabled:opacity-40 cursor-pointer"
            >
              Sonraki
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
