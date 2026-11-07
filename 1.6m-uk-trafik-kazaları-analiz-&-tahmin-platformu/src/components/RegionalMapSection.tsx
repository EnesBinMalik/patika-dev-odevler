/**
 * UK Regional Geographic Accident & Hotspots Explorer
 * Author & Analysis: Enes Öztürk
 */
import React, { useState } from 'react';
import { MapPin, Navigation, AlertOctagon, TrendingUp, Info, ShieldAlert } from 'lucide-react';
import { REGIONAL_STATISTICS, RegionalData } from '../data/accidentData.ts';

export const RegionalMapSection: React.FC = () => {
  const [selectedRegionId, setSelectedRegionId] = useState<string>('london');

  const currentRegion = REGIONAL_STATISTICS.find((r) => r.id === selectedRegionId) || REGIONAL_STATISTICS[0];

  return (
    <section id="regional-map" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="w-5 h-5 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold">5</span>
            <span>COĞRAFİ DAĞILIM ANALİZİ</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">İmza: Enes Öztürk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Birleşik Krallık Bölgesel Kaza & Kara Nokta Haritası
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            1.6 milyonluk veride Londra gibi metropoller devasa kaza sayılarına sahipken ölüm oranı en düşüktür (%0.67); Galler ve İskoçya gibi dağlık/kırsal bölgeler ise %3.47 ölüm oranı ile İngiltere'nin en tehlikeli yol ağlarına ev sahipliği yapmaktadır.
          </p>
        </div>

        {/* 2-Column Layout: Region Selector List & Detail Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left: Region Pills / Buttons (5 cols) */}
          <div className="lg:col-span-5 space-y-2">
            <div className="text-xs font-mono text-slate-400 mb-2 px-1 flex justify-between">
              <span>BÖLGE LİSTESİ</span>
              <span>Kaza Sayısı & Ölüm Oranı</span>
            </div>

            <div className="space-y-1.5 max-h-[520px] overflow-y-auto pr-1">
              {REGIONAL_STATISTICS.map((region) => {
                const isSelected = region.id === selectedRegionId;
                return (
                  <button
                    key={region.id}
                    type="button"
                    onClick={() => setSelectedRegionId(region.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-amber-400/10 border-amber-400 text-white shadow-sm'
                        : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:bg-slate-900 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className={`w-2 h-2 rounded-full ${isSelected ? 'bg-amber-400' : 'bg-slate-600'}`} />
                      <div>
                        <div className="text-xs font-bold">{region.name}</div>
                        <div className="text-[10px] text-slate-500 font-mono">
                          %{region.urbanPercent} Kentsel / %{region.ruralPercent} Kırsal
                        </div>
                      </div>
                    </div>

                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-slate-200">
                        {region.totalAccidents.toLocaleString()}
                      </div>
                      <div className={`text-[10px] ${region.fatalityRate > 3 ? 'text-rose-400 font-bold' : 'text-slate-400'}`}>
                        %{region.fatalityRate} Ölüm
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Selected Region Deep Dive (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/80 border border-slate-800 rounded-2xl p-6 space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-mono text-amber-400 uppercase tracking-wider block mb-1">
                  Seçili Bölge Analiz Raporu
                </span>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" />
                  {currentRegion.name}
                </h3>
              </div>
              <div className="text-xs font-mono text-slate-400 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
                <span>Trafik Hacim İndeksi:</span>
                <span className="text-amber-400 font-bold">{currentRegion.trafficVolumeIndex}/100</span>
              </div>
            </div>

            {/* Metrics 3-Col Strip */}
            <div className="grid grid-cols-3 gap-3 font-mono">
              <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-500 block">Toplam Kaza</span>
                <span className="text-base sm:text-lg font-bold text-white">
                  {currentRegion.totalAccidents.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-500 block">Toplam Can Kaybı</span>
                <span className="text-base sm:text-lg font-bold text-rose-400">
                  {currentRegion.fatalities.toLocaleString()}
                </span>
              </div>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800/80 rounded-xl space-y-0.5">
                <span className="text-[10px] text-slate-500 block">Kaza Başı Ölüm</span>
                <span className={`text-base sm:text-lg font-bold ${currentRegion.fatalityRate > 3 ? 'text-rose-400' : 'text-amber-400'}`}>
                  %{currentRegion.fatalityRate}
                </span>
              </div>
            </div>

            {/* Urban vs Rural Distribution Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-slate-300">
                <span>Kentsel Yol Payı: %{currentRegion.urbanPercent}</span>
                <span>Kırsal Yol Payı: %{currentRegion.ruralPercent}</span>
              </div>
              <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden flex">
                <div style={{ width: `${currentRegion.urbanPercent}%` }} className="bg-blue-500" />
                <div style={{ width: `${currentRegion.ruralPercent}%` }} className="bg-rose-500" />
              </div>
            </div>

            {/* Key Risk Factor */}
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-1.5">
              <div className="text-xs font-bold text-white flex items-center gap-1.5">
                <AlertOctagon className="w-4 h-4 text-amber-400" />
                Bölgesel Kritik Risk Faktörü
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                {currentRegion.keyRiskFactor}
              </p>
            </div>

            {/* High-Risk Road Hotspots */}
            <div className="space-y-2">
              <div className="text-xs font-mono text-slate-400 uppercase tracking-wider">
                Bölgedeki En Tehlikeli Karayolu Kara Noktaları (Hotspots)
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentRegion.hotspots.map((spot, i) => (
                  <div
                    key={i}
                    className="p-2.5 bg-slate-950/40 border border-slate-800/80 rounded-lg text-xs text-slate-300 flex items-center gap-2"
                  >
                    <Navigation className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-medium text-slate-200">{spot}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs text-amber-300/90 flex items-center justify-between font-mono">
              <span>Bölge Analizi Sorumlusu: Enes Öztürk</span>
              <span>Stats19 Geocoded Dataset</span>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
