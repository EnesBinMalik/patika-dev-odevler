/**
 * Research Pillar 2: Kaza Oranlarını Ne Artırır? (Risk Faktörleri & Şiddet Çarpanları)
 * Author & Analysis: Enes Öztürk
 */
import React, { useState } from 'react';
import { 
  ShieldAlert, CloudRain, Sun, Moon, AlertTriangle, 
  Clock, Compass, Calculator, Check, ArrowUpRight
} from 'lucide-react';
import { 
  WEATHER_CONDITIONS, LIGHT_CONDITIONS, ROAD_TYPES, HOURLY_TRAFFIC_PATTERNS 
} from '../data/accidentData.ts';

export const Pillar2RiskFactors: React.FC = () => {
  // Calculator State
  const [selectedWeather, setSelectedWeather] = useState<string>('fog_mist');
  const [selectedLight, setSelectedLight] = useState<string>('dark_no_lights');
  const [selectedRoad, setSelectedRoad] = useState<string>('single_carriageway');
  const [selectedSpeed, setSelectedSpeed] = useState<number>(60);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<'day' | 'night' | 'rush'>('night');

  // Active Category View
  const [activeTab, setActiveTab] = useState<'weather' | 'lighting' | 'road' | 'hourly'>('weather');

  // Compute Empirical Risk Index based on 1.6M dataset coefficients
  const weatherObj = WEATHER_CONDITIONS.find((w) => w.id === selectedWeather) || WEATHER_CONDITIONS[0];
  const lightObj = LIGHT_CONDITIONS.find((l) => l.id === selectedLight) || LIGHT_CONDITIONS[0];
  const roadObj = ROAD_TYPES.find((r) => r.id === selectedRoad) || ROAD_TYPES[0];

  const speedMultiplier = selectedSpeed === 20 ? 0.4 : selectedSpeed === 30 ? 0.9 : selectedSpeed === 40 ? 1.4 : selectedSpeed === 50 ? 1.9 : selectedSpeed === 60 ? 2.8 : 2.2;
  const timeMultiplier = selectedTimeSlot === 'night' ? 1.6 : selectedTimeSlot === 'rush' ? 1.2 : 1.0;

  // Combined Relative Risk
  const combinedRisk = (weatherObj.relativeRisk * lightObj.relativeRisk * (roadObj.fatalRate / 1.5) * speedMultiplier * timeMultiplier) / 2.2;
  const riskScore = Math.min(99, Math.max(12, Math.round(combinedRisk * 16)));

  let riskTier = 'Düşük Risk';
  let tierColor = 'text-emerald-400';
  let tierBg = 'bg-emerald-500/10 border-emerald-500/30';

  if (riskScore >= 75) {
    riskTier = 'Kritik Ölümcül Risk';
    tierColor = 'text-rose-400';
    tierBg = 'bg-rose-500/10 border-rose-500/30';
  } else if (riskScore >= 45) {
    riskTier = 'Yüksek Kaza Riski';
    tierColor = 'text-amber-400';
    tierBg = 'bg-amber-500/10 border-amber-500/30';
  }

  const estimatedFatalRate = Math.min(18.5, Math.max(0.3, Number((roadObj.fatalRate * (lightObj.fatalRate / 2) * (weatherObj.fatalRate / 2) * (speedMultiplier / 1.5)).toFixed(2))));

  return (
    <section id="risk-factors" className="py-12 border-b border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Section Header */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400">
            <span className="w-5 h-5 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center font-bold">2</span>
            <span>ARAŞTIRMA SORUSU 2</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-slate-400">İmza: Enes Öztürk</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
            Kaza Oranlarını ve Ölümcüllüğü Ne Artırır?
          </h2>

          <p className="text-sm sm:text-base text-slate-300 max-w-3xl leading-relaxed">
            1.6 milyonluk veride kaza sayısı ile kaza şiddeti farklı faktörlerle tetiklenmektedir. Yağmur ve iş çıkışı trafiği kaza <strong className="text-white">adetlerini</strong> tırmandırırken; <span className="text-amber-300 font-medium">aydınlatmasız zifiri karanlık, 60 mph tek şeritli yollar ve yoğun sis</span> kaza başına <strong className="text-white">ölüm oranını 3 ila 5 katına</strong> çıkarmaktadır.
          </p>
        </div>

        {/* Category Navigation (Interactive Segmented Control) */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900 rounded-xl border border-slate-800 max-w-fit">
          <button
            onClick={() => setActiveTab('weather')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'weather' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <CloudRain className="w-3.5 h-3.5" />
            Hava Koşulları
          </button>
          <button
            onClick={() => setActiveTab('lighting')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'lighting' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Sun className="w-3.5 h-3.5" />
            Aydınlatma & Görüş
          </button>
          <button
            onClick={() => setActiveTab('road')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'road' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Yol Tipi & Geometri
          </button>
          <button
            onClick={() => setActiveTab('hourly')}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'hourly' ? 'bg-amber-400 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            Saatlik Yoğunluk
          </button>
        </div>

        {/* Tab 1: Weather Conditions */}
        {activeTab === 'weather' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEATHER_CONDITIONS.map((w) => (
              <div 
                key={w.id} 
                className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{w.nameTr}</h3>
                    <div className="text-[11px] font-mono text-slate-400">{w.nameEn}</div>
                  </div>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    w.relativeRisk > 2.0 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : w.relativeRisk > 1.2 
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {w.relativeRisk}x Risk
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1 border-y border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Kaza Sayısı:</span>
                    <span className="text-slate-200 font-bold">{w.accidents.toLocaleString()} (%{w.percent})</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Ölüm Oranı:</span>
                    <span className="text-rose-400 font-bold">%{w.fatalRate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {w.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Light Conditions */}
        {activeTab === 'lighting' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {LIGHT_CONDITIONS.map((l) => (
              <div 
                key={l.id} 
                className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <h3 className="text-sm font-bold text-white">{l.nameTr}</h3>
                  <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${
                    l.relativeRisk >= 4.0 
                      ? 'bg-rose-500/10 text-rose-400 border-rose-500/30' 
                      : 'bg-slate-800 text-slate-300 border-slate-700'
                  }`}>
                    {l.relativeRisk}x
                  </span>
                </div>

                <div className="space-y-1 text-xs font-mono py-1">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Toplam Kaza:</span>
                    <span className="text-slate-200">{l.accidents.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ölüm Sayısı:</span>
                    <span className="text-rose-400 font-bold">{l.fatalCount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Ölüm Oranı:</span>
                    <span className="text-amber-400 font-bold">%{l.fatalRate}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-2">
                  {l.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 3: Road Types */}
        {activeTab === 'road' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ROAD_TYPES.map((r) => (
              <div 
                key={r.id} 
                className="p-5 bg-slate-900/70 border border-slate-800 rounded-xl space-y-3 hover:border-slate-700 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{r.nameTr}</h3>
                    <div className="text-[11px] font-mono text-slate-400">{r.nameEn}</div>
                  </div>
                  <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                    Ort. {r.avgSpeedMph} mph
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono py-1 border-y border-slate-800/80">
                  <div>
                    <span className="text-slate-500 block text-[10px]">Toplam Kaza Payı:</span>
                    <span className="text-slate-200 font-bold">%{r.percent}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px]">Kaza Başı Ölüm:</span>
                    <span className={r.fatalRate < 1 ? 'text-emerald-400 font-bold' : 'text-rose-400 font-bold'}>
                      %{r.fatalRate}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">
                  {r.description}
                </p>
              </div>
            ))}
          </div>
        )}

        {/* Tab 4: Hourly Heatmap Curve */}
        {activeTab === 'hourly' && (
          <div className="p-6 bg-slate-900/70 border border-slate-800 rounded-xl space-y-6">
            <div>
              <h3 className="text-base font-bold text-white">24 Saatlik Kaza Sıklığı vs Şiddet Oranı</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Akşam iş çıkışı (17:00) kaza frekansı pik yaparken, gece yarısı (01:00-04:00) kaza başına ölüm ve ağır yaralanma oranı %31.8 ile tepeye çıkar.
              </p>
            </div>

            <div className="w-full overflow-x-auto">
              <div className="min-w-[700px] h-56 flex items-end gap-1.5 pb-6 pt-4 px-2 bg-slate-950/70 rounded-lg border border-slate-800">
                {HOURLY_TRAFFIC_PATTERNS.map((item) => {
                  const accidentHeight = (item.accidentPercent / 10) * 100;
                  const severityHeight = (item.severityRatio / 35) * 100;

                  return (
                    <div key={item.hour} className="flex-1 flex flex-col items-center h-full justify-end group relative">
                      {/* Tooltip */}
                      <div className="absolute bottom-full mb-2 hidden group-hover:flex flex-col items-center z-20 pointer-events-none">
                        <div className="bg-slate-900 text-slate-100 text-[10px] p-2 rounded border border-slate-700 shadow-xl font-mono whitespace-nowrap">
                          <div className="font-bold text-amber-400">Saat: {item.label}</div>
                          <div>Kaza Payı: %{item.accidentPercent}</div>
                          <div>Ağır/Ölüm Şiddeti: %{item.severityRatio}</div>
                          <div>Trafik İndeksi: {item.congestionIndex}/100</div>
                        </div>
                      </div>

                      <div className="w-full flex items-end justify-center gap-0.5 h-full">
                        <div style={{ height: `${accidentHeight}%` }} className="w-1/2 bg-amber-400/80 rounded-t" />
                        <div style={{ height: `${severityHeight}%` }} className="w-1/2 bg-rose-500/80 rounded-t" />
                      </div>
                      <span className="text-[9px] font-mono text-slate-500 mt-1 block">
                        {item.hour % 2 === 0 ? item.label : ''}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center justify-between text-xs font-mono text-slate-400 pt-1">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-400" />
                  Kaza Sayısı Payı (%)
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                  Şiddet Oranı (Ölüm+Ağır Yaralanma %)
                </span>
              </div>
              <span className="text-slate-500 text-[11px]">Kaynak: DfT STATS19 Zaman Serisi</span>
            </div>
          </div>
        )}

        {/* 2. Interactive Empirical Risk Calculator */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Calculator className="w-5 h-5 text-amber-400" />
                İnteraktif Kaza Risk & Şiddet Hesaplayıcısı
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Yol, hava ve aydınlatma parametrelerini seçin; 1.6 milyon kaza olasılık matrisinden anlık risk indeksini hesaplayın.
              </p>
            </div>
            <div className="text-xs font-mono text-amber-400">
              Enes Öztürk Risk Matrisi v2.1
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            
            {/* Inputs (7 cols) */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4 bg-slate-950/60 p-5 rounded-xl border border-slate-800">
              
              {/* Weather Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Hava Durumu</label>
                <select
                  value={selectedWeather}
                  onChange={(e) => setSelectedWeather(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {WEATHER_CONDITIONS.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.nameTr} (x{w.relativeRisk})
                    </option>
                  ))}
                </select>
              </div>

              {/* Lighting Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Aydınlatma Durumu</label>
                <select
                  value={selectedLight}
                  onChange={(e) => setSelectedLight(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {LIGHT_CONDITIONS.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.nameTr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Road Type Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Yol Geometrisi</label>
                <select
                  value={selectedRoad}
                  onChange={(e) => setSelectedRoad(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  {ROAD_TYPES.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.nameTr}
                    </option>
                  ))}
                </select>
              </div>

              {/* Speed Limit Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-300">Yol Hız Limiti</label>
                <select
                  value={selectedSpeed}
                  onChange={(e) => setSelectedSpeed(Number(e.target.value))}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value={20}>20 MPH (Kentsel Sakin)</option>
                  <option value={30}>30 MPH (Şehir İçi Standart)</option>
                  <option value={40}>40 MPH (Çevre Yolu)</option>
                  <option value={50}>50 MPH (Hızlı Bağlantı)</option>
                  <option value={60}>60 MPH (Kırsal Tek Şerit)</option>
                  <option value={70}>70 MPH (Otoyol)</option>
                </select>
              </div>

              {/* Time Slot Input */}
              <div className="sm:col-span-2 space-y-1.5 pt-1">
                <label className="text-xs font-medium text-slate-300">Günün Zaman Dilimi</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedTimeSlot('rush')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTimeSlot === 'rush'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Yoğun Saat (07-09 / 16-18)
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTimeSlot('day')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTimeSlot === 'day'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Gündüz Normal
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedTimeSlot('night')}
                    className={`py-1.5 text-xs font-medium rounded-lg border transition-all ${
                      selectedTimeSlot === 'night'
                        ? 'bg-amber-400 text-slate-950 border-amber-400 font-semibold'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    Gece Yarısı (23:00 - 05:00)
                  </button>
                </div>
              </div>

            </div>

            {/* Calculated Risk Output (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              
              <div className={`p-5 rounded-xl border ${tierBg} transition-all`}>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs uppercase font-mono tracking-wider text-slate-400">Hesaplanan Risk Seviyesi</span>
                  <span className="text-xs font-mono font-bold text-white">İndeks: {riskScore}/100</span>
                </div>
                
                <div className={`text-2xl font-bold ${tierColor} flex items-center gap-2`}>
                  <AlertTriangle className="w-6 h-6" />
                  {riskTier}
                </div>

                <div className="mt-4 space-y-2 text-xs font-mono border-t border-slate-800/80 pt-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Normal Duruma Göre Risk:</span>
                    <span className="text-white font-bold">{combinedRisk.toFixed(1)}x Kat</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Tahmini Kaza Başı Ölüm Oranı:</span>
                    <span className="text-rose-400 font-bold">%{estimatedFatalRate}</span>
                  </div>
                </div>
              </div>

              {/* Research Insight Card */}
              <div className="p-3.5 bg-slate-950/50 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1">
                <span className="text-amber-400 font-semibold block">Enes Öztürk Model Değerlendirmesi:</span>
                <p className="text-slate-400 leading-relaxed text-[11px]">
                  {selectedRoad === 'single_carriageway' && selectedSpeed >= 60 && selectedLight === 'dark_no_lights'
                    ? "Ölümcül üçlü bir aradadır: Kırsal viraj, aydınlatmasız zifiri karanlık ve 60 mph hız. Veri setinde bu kombinasyon tüm ölümcül tek araç savrulmalarının %41'ini oluşturmaktadır."
                    : selectedRoad === 'roundabout'
                    ? "Dönel kavşak seçimi risk indeksini keskin şekilde baskılamaktadır. Araçlar birbirine teğetsel açıyla yanaştığı için yüksek şiddetli kafa kafaya çarpışmalar bertaraf edilir."
                    : "Mevcut parametreler altında sürat kontrolü ve aydınlatma, kaza şiddetini düşürmede en yüksek marjinal faydayı sağlayan politika müdahalesidir."}
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
};
