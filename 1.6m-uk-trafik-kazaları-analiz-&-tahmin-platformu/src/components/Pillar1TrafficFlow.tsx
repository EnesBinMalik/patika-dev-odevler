/**
 * Research Pillar 1: Trafik Akışının Değişmesi Kazaları Nasıl Etkiler?
 * Author & Analysis: Enes Öztürk
 */
import React, { useState } from 'react';
import { Activity, Gauge, AlertCircle, Info, ChevronRight, Sliders, Zap } from 'lucide-react';
import { YEARLY_ACCIDENT_DATA, SPEED_LIMIT_DISTRIBUTION, HOURLY_TRAFFIC_PATTERNS } from '../data/accidentData.ts';

export const Pillar1TrafficFlow: React.FC = () => {
  // Simulator State
  const [density, setDensity] = useState<number>(45); // vehicles/km/lane
  const [speed, setSpeed] = useState<number>(48); // mph
  const [lanes, setLanes] = useState<number>(3); // road capacity

  // Calculate Traffic Flow Regime (Greenshields Model Simulation)
  // Flow q = k * v (Vehicles per hour per lane)
  const flowPerHourPerLane = Math.round(density * (speed * 1.609));
  const capacityPerLane = 2100; // standard highway saturation capacity
  const volumeCapacityRatio = flowPerHourPerLane / capacityPerLane;

  let flowRegime = 'Serbest Akış (Free-Flow)';
  let regimeColor = 'text-emerald-400';
  let regimeBg = 'bg-emerald-500/10 border-emerald-500/30';
  let accidentLikelihood = 'Düşük - Seyrek Kaza';
  let fatalProbability = 'Yüksek (%4.2 - %6.8)';
  let slightProbability = '%68.5';
  let regimeNote = 'Yol boş ve akış serbesttir; kaza sayısı düşüktür ancak yüksek hız kinetik enerjiyi katlayarak ölümcül sonuçları tetikler.';

  if (density > 75 || speed < 25) {
    flowRegime = 'Dur-Kalk Tıkanıklık (Congested Breakdown)';
    regimeColor = 'text-rose-400';
    regimeBg = 'bg-rose-500/10 border-rose-500/30';
    accidentLikelihood = 'Aşırı Yüksek (Sık Temas & Arkadan Çarpma)';
    fatalProbability = 'Çok Düşük (%0.4 - %0.8)';
    slightProbability = '%93.2';
    regimeNote = 'Tıkanıklık Paradoksu: Kaza sayısı zirve yapar ancak düşük hız (15-20 mph) nedeniyle ölümlü kaza oranı neredeyse sıfıra yaklaşır.';
  } else if (density >= 40 || volumeCapacityRatio > 0.65) {
    flowRegime = 'Senkronize Yoğun Akış (Synchronized Flow)';
    regimeColor = 'text-amber-400';
    regimeBg = 'bg-amber-500/10 border-amber-500/30';
    accidentLikelihood = 'Orta / Yüksek (Şerit Değiştirme Sürtüşmesi)';
    fatalProbability = 'Orta (%1.8 - %2.5)';
    slightProbability = '%82.4';
    regimeNote = 'Takip mesafesi daralır, ani fren dalgaları zincirleme çarpışma riskini artırır.';
  }

  return (
    <section id="traffic-flow" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="w-5 h-5 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold">1</span>
            <span>ARAŞTIRMA SORUSU 1</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">İmza: Enes Öztürk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Trafik Akışının Değişmesi Kazaları Nasıl Etkiler?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            1.6 milyonluk veri seti iki temel gerçeği ortaya koymaktadır: 
            <span className="text-amber-300 font-medium"> Trafik hacmindeki büyüme otomatik olarak kazaları artırmaz.</span> 
            Ayrıca yoğun saatlerdeki tıkanıklık kaza <strong className="text-white">sayısını</strong> artırırken, gece serbest akış kaza <strong className="text-white">şiddetini</strong> tırmandırır (Tıkanıklık Paradoksu).
          </p>
        </div>

        {/* 1. Macro Analysis: Traffic Volume (BVM) vs Accident Rate (2000-2016) */}
        <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-amber-400" />
                Trafik Hacmi (Mil) vs Kaza Oranı Paradoksu (2000–2016)
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                UK toplam araç mili %12.3 artarken, 100 milyon mil başına düşen kaza oranı %48.2 azalmıştır.
              </p>
            </div>
            <div className="text-xs font-mono text-slate-400 flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-blue-500 inline-block" />
                Trafik Hacmi (BVM)
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-amber-400 inline-block" />
                Kaza Oranı (100M mil başı)
              </span>
            </div>
          </div>

          {/* Custom Responsive SVG Chart */}
          <div className="w-full overflow-x-auto">
            <div className="min-w-[680px] h-64 relative flex items-end justify-between gap-2 pt-8 pb-6 px-4 bg-slate-950/60 rounded-xl border border-slate-850">
              {YEARLY_ACCIDENT_DATA.map((item) => {
                // Volume scale 450 to 540 -> height %
                const volumeHeight = Math.max(15, ((item.trafficVolumeBVM - 450) / 90) * 100);
                // Rate scale 20 to 55 -> height %
                const rateHeight = Math.max(15, ((item.accidentRatePer100MBVM - 20) / 35) * 100);

                return (
                  <div key={item.year} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                    
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                      <div className="bg-slate-900 text-slate-100 text-[11px] p-2.5 rounded-lg border border-slate-700 shadow-xl font-mono whitespace-nowrap">
                        <div className="font-bold text-amber-400 border-b border-slate-800 pb-1 mb-1">{item.year} Verileri</div>
                        <div>Trafik Hacmi: {item.trafficVolumeBVM} Milyar Mil</div>
                        <div>Kaza Oranı: {item.accidentRatePer100MBVM} / 100M mil</div>
                        <div>Toplam Kaza: {item.totalAccidents.toLocaleString()}</div>
                      </div>
                    </div>

                    {/* Dual Bars */}
                    <div className="w-full flex items-end justify-center gap-1 h-full">
                      {/* Volume Bar */}
                      <div
                        style={{ height: `${volumeHeight}%` }}
                        className="w-1/2 max-w-[12px] bg-blue-600/70 hover:bg-blue-500 rounded-t transition-all"
                      />
                      {/* Accident Rate Bar */}
                      <div
                        style={{ height: `${rateHeight}%` }}
                        className="w-1/2 max-w-[12px] bg-amber-400/80 hover:bg-amber-300 rounded-t transition-all"
                      />
                    </div>

                    <span className="text-[10px] font-mono text-slate-400 mt-2 block">
                      {item.year.toString().slice(2)}'
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-300 pt-2">
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-white block mb-1">1. Altyapı ve ESP Etkisi</span>
              2000'lerin başından itibaren ABS ve elektronik denge sistemlerinin (ESP) yaygınlaşması, araç mili artsa dahi savrulma kazalarını önlemiştir.
            </div>
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-white block mb-1">2. Dijital Hız Kameraları</span>
              İngiltere otoyollarında devreye alınan SPECS (ortalama hız kameraları), serbest akıştaki aşırı sürat varyasyonunu törpülemiştir.
            </div>
            <div className="p-3 bg-slate-950/40 rounded-lg border border-slate-800/80">
              <span className="font-semibold text-white block mb-1">3. Şehir İçi Hız Düşürme</span>
              Londra ve Manchester gibi metropollerde 20 mph pilot bölgeleri, araç yoğunluğunun kazaya dönüşme katsayısını düşürmüştür.
            </div>
          </div>
        </div>

        {/* 2. Interactive Flow & Congestion Simulator */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Sliders className="w-5 h-5 text-amber-400" />
                İnteraktif Trafik Akışı & Tıkanıklık Simülatörü
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Greenshields akış formülü ile yoğunluk, hız ve şerit kapasitesini değiştirerek rejim ve kaza şiddeti değişimini test edin.
              </p>
            </div>
            <div className="px-3 py-1 rounded bg-slate-800 text-[11px] font-mono text-amber-400 border border-slate-700 hidden sm:block">
              Enes Öztürk Akış Modeli
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Sliders (Left 6 cols) */}
            <div className="lg:col-span-6 space-y-5 bg-slate-950/50 p-5 rounded-xl border border-slate-800/80">
              
              {/* Density Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Trafik Yoğunluğu (Araç / km / şerit)</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">{density} araç/km</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="120"
                  step="1"
                  value={density}
                  onChange={(e) => setDensity(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Seyrek (5)</span>
                  <span>Optimal Akış (35-50)</span>
                  <span>Tıkanıklık (100+)</span>
                </div>
              </div>

              {/* Speed Slider */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Ortalama Akış Sürati (mph)</span>
                  <span className="font-mono text-amber-400 font-bold tabular-nums">{speed} mph ({Math.round(speed * 1.609)} km/s)</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="80"
                  step="2"
                  value={speed}
                  onChange={(e) => setSpeed(Number(e.target.value))}
                  className="w-full accent-amber-400 bg-slate-800 rounded-lg h-2 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>Şehir İçi / Tıkalı (15)</span>
                  <span>A-Yolu (50)</span>
                  <span>Otoyol Hızı (70+)</span>
                </div>
              </div>

              {/* Lanes Selector */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="font-medium text-slate-300">Yol Geometrisi & Şerit Sayısı</span>
                  <span className="font-mono text-slate-400">{lanes} Şeritli Koridor</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {[2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setLanes(num)}
                      className={`py-2 text-xs font-semibold rounded-lg border transition-all ${
                        lanes === num
                          ? 'bg-amber-400 text-slate-900 border-amber-400 shadow-sm'
                          : 'bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      {num} Şerit
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Simulation Dynamic Output (Right 6 cols) */}
            <div className="lg:col-span-6 space-y-4">
              
              <div className={`p-4 rounded-xl border ${regimeBg} transition-all`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs uppercase tracking-wider font-mono text-slate-400">Belirlenen Akış Rejimi</span>
                  <span className="text-xs font-mono text-slate-300">v/C Oranı: {volumeCapacityRatio.toFixed(2)}</span>
                </div>
                <div className={`text-xl font-bold ${regimeColor} flex items-center gap-2`}>
                  <Zap className="w-5 h-5" />
                  {flowRegime}
                </div>
                <p className="text-xs text-slate-300 mt-2 leading-relaxed">
                  {regimeNote}
                </p>
              </div>

              {/* Empirical Probability Indicators */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-slate-400">Kaza Gerçekleşme Sıklığı</div>
                  <div className="text-sm font-bold text-white">{accidentLikelihood}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Yoğunluk katsayısı: {(density / 35).toFixed(1)}x</div>
                </div>

                <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                  <div className="text-[11px] text-slate-400">Ölümcül Kaza Olasılığı</div>
                  <div className="text-sm font-bold text-rose-400 font-mono">{fatalProbability}</div>
                  <div className="text-[10px] text-slate-500 font-mono">Hız karesi (Kinetik Enerji): {Math.round((speed * speed) / 100)}</div>
                </div>
              </div>

              <div className="p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-start gap-2.5">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <span>
                  <strong className="text-slate-200">Enes Öztürk Çıkarımı:</strong> Karayolu politikalarında hedef yalnızca kaza adedini düşürmek değil, akış hızını kontrol ederek kazanın kinetik enerjisini (ve dolayısıyla ölümcüllük oranını) sıfıra yakın tutmaktır.
                </span>
              </div>

            </div>

          </div>
        </div>

        {/* 3. Speed Limit Breakdown (20, 30, 40, 50, 60, 70 mph) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
              <Gauge className="w-4 h-4 text-amber-400" />
              Yasal Hız Limitine Göre Kaza Hacmi & Ölümcüllük Oranları
            </h3>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">1.6M Kaza Dağılımı</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {SPEED_LIMIT_DISTRIBUTION.map((item) => (
              <div 
                key={item.speedMph}
                className="p-4 bg-slate-900/60 border border-slate-800 rounded-xl hover:border-slate-700 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-9 h-9 rounded-full border-2 border-red-500/80 bg-white text-slate-900 font-bold flex items-center justify-center font-mono text-sm shadow-sm">
                      {item.speedMph}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white">{item.speedMph} MPH Limiti</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {item.accidents.toLocaleString()} Kaza (%{item.percent})
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-mono font-bold text-rose-400 tabular-nums">%{item.fatalRate}</div>
                    <div className="text-[10px] text-slate-500">Ölüm Oranı</div>
                  </div>
                </div>

                {/* Progress bar showing Urban vs Rural share */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Kentsel: %{item.urbanShare}</span>
                    <span>Kırsal: %{item.ruralShare}</span>
                  </div>
                  <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden flex">
                    <div style={{ width: `${item.urbanShare}%` }} className="bg-blue-500" />
                    <div style={{ width: `${item.ruralShare}%` }} className="bg-amber-500" />
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 border-t border-slate-800 pt-2">
                  {item.speedMph === 60 ? (
                    <span className="text-amber-300 font-medium">En yüksek ölüm oranı (%5.82): Kırsal tek şeritli yollar.</span>
                  ) : item.speedMph === 30 ? (
                    <span>En yüksek kaza adedi (1.08M kaza): Şehir içi kavşak ve yaya etkileşimi.</span>
                  ) : item.speedMph === 20 ? (
                    <span className="text-emerald-400 font-medium">En güvenli hız bölgesi: Yaya ölüm oranı %0.35 ile asgari düzeyde.</span>
                  ) : (
                    <span>Ciddi yaralanma oranı: %{item.seriousRate}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
