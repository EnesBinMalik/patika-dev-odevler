import React, { useState } from 'react';
import { MunicipalityScenario } from '../types/energy';
import { evaluateMunicipalityScenario } from '../utils/mlEngine';
import {
  Building2,
  AlertOctagon,
  TrendingUp,
  ShieldCheck,
  Send,
  ThermometerSnowflake,
  Flame,
  Wind,
  Check,
  Copy,
} from 'lucide-react';

export const MunicipalitySimulatorTab: React.FC = () => {
  const [scenario, setScenario] = useState<MunicipalityScenario>({
    scenarioName: 'Kutup Soğuğu Dalgası (Polar Vortex - Madrid -4°C)',
    season: 'winter',
    targetDateStr: '2026-01-18',
    hour: 20, // 20:00 evening peak
    isWeekend: false,
    tempMadrid: -4,
    tempSeville: 6,
    tempBarcelona: 2,
    windSpeed: 3.5,
    solarInsolation: 0.0,
    gasPricePerMWh: 55.0,
    subsidyRate: 25, // 25% municipal discount
    peakHourFeeWaiver: true,
    emergencyBudgetEuro: 150000,
  });

  const [copiedNotification, setCopiedNotification] = useState(false);

  // Evaluate scenario through trained model equations
  const result = evaluateMunicipalityScenario(scenario);

  // Pre-set scenario templates
  const presets = [
    {
      name: '❄️ Şiddetli Soğuk Dalgası (Madrid -4°C)',
      apply: () =>
        setScenario(prev => ({
          ...prev,
          scenarioName: 'Kutup Soğuğu Dalgası (Madrid -4°C)',
          season: 'winter',
          hour: 20,
          isWeekend: false,
          tempMadrid: -4,
          tempSeville: 5,
          tempBarcelona: 2,
          windSpeed: 3.2,
          solarInsolation: 0.0,
          subsidyRate: 25,
          peakHourFeeWaiver: true,
        })),
    },
    {
      name: '🔥 Endülüs Aşırı Sıcak Dalgası (Sevilla +43°C)',
      apply: () =>
        setScenario(prev => ({
          ...prev,
          scenarioName: 'Aşırı Yaz Sıcak Dalgası (Sevilla +43°C)',
          season: 'summer',
          hour: 15,
          isWeekend: false,
          tempMadrid: 39,
          tempSeville: 43,
          tempBarcelona: 34,
          windSpeed: 2.1,
          solarInsolation: 1.0,
          subsidyRate: 20,
          peakHourFeeWaiver: false,
        })),
    },
    {
      name: '💨 Fırtınalı Bahar (Yüksek Rüzgar & Düşük Fiyat)',
      apply: () =>
        setScenario(prev => ({
          ...prev,
          scenarioName: 'Fırtınalı Bahar (Rüzgar Bolluğu)',
          season: 'spring',
          hour: 11,
          isWeekend: false,
          tempMadrid: 16,
          tempSeville: 21,
          tempBarcelona: 17,
          windSpeed: 16.5,
          solarInsolation: 0.6,
          subsidyRate: 5,
          peakHourFeeWaiver: false,
        })),
    },
    {
      name: '🌿 Ilıman Standart Gün (Nominal Yük)',
      apply: () =>
        setScenario(prev => ({
          ...prev,
          scenarioName: 'Ilıman Bahar Günü (Dengeli Şebeke)',
          season: 'spring',
          hour: 14,
          isWeekend: false,
          tempMadrid: 19,
          tempSeville: 23,
          tempBarcelona: 20,
          windSpeed: 6.0,
          solarInsolation: 0.8,
          subsidyRate: 0,
          peakHourFeeWaiver: false,
        })),
    },
  ];

  const notificationTemplate = `[BELEDİYE ACİL ENERJİ BİLDİRİMİ]
Sayın Hemşehrilerimiz,
Meteoroloji verileri ve yapay zeka tahmin modelimize göre önümüzdeki saatlerde hava sıcaklığının ${scenario.tempMadrid}°C'ye düşmesi ve elektrik talebinin pik seviyeye (${result.predictedDemandMW.toLocaleString('tr-TR')} MW) ulaşması öngörülmektedir.

Belediye Başkanlığımız, aşırı soğuk hava dalgası süresince dar gelirli ve korumasız hanelerimizi enerji yoksulluğundan korumak amacıyla son kullanıcı elektrik tarifesine %${scenario.subsidyRate} dinamik sübvansiyon desteği sağlamıştır.

Şebeke kararlılığı ve arz güvenliği için 18:00 - 22:00 saatleri arasında yüksek güçlü cihazların (çamaşır/bulaşık makinesi) kullanımının ötelenmesi rica olunur.`;

  const handleCopyNotification = () => {
    navigator.clipboard.writeText(notificationTemplate);
    setCopiedNotification(true);
    setTimeout(() => setCopiedNotification(false), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Header and Municipal Vision Statement */}
      <div className="bg-gradient-to-r from-blue-950/90 via-slate-900 to-indigo-950/90 border border-blue-500/30 rounded-xl p-5 shadow-lg">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="p-1 rounded bg-blue-600/30 text-blue-400 border border-blue-500/40">
            <Building2 className="w-4 h-4" />
          </span>
          <span className="text-xs font-semibold text-blue-300">
            Kamu Karar Destek Sistemi & Dinamik Tarife Modeli
          </span>
        </div>
        <h2 className="text-lg font-bold text-white">
          Belediyeler İçin Aşırı Soğuk / Sıcak Hava Dalgası ve Dinamik Fiyatlandırma Simülatörü
        </h2>
        <p className="text-xs text-slate-300 mt-1 max-w-4xl leading-relaxed">
          &quot;Havaların çok soğuk olacağı ve elektriğin aşırı kullanılacağı tahmin edilen gün ve haftalarda belediyeler son kullanıcı için elektrik fiyatını düzenleyebilir.&quot; Bu karar destek modülü; sıcaklık, rüzgar ve saatlik tüketim tahminlerini alarak piyasa spot fiyatını hesaplar ve belediyelerin uygulayabileceği dinamik sübvansiyon, bütçe maliyeti ve vatandaş koruma politikalarını canlı olarak simüle eder.
        </p>

        {/* Quick Scenario Preset Pills */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-slate-800">
          <span className="text-xs text-slate-400 font-medium">Hızlı Senaryo Seç:</span>
          {presets.map((p, idx) => (
            <button
              key={idx}
              onClick={p.apply}
              className="px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-xs text-slate-200 border border-slate-700 font-medium transition cursor-pointer"
            >
              {p.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main Simulation Grid: Controls (Left) and Live Forecast & Impact (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Controls Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Weather & Grid Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <ThermometerSnowflake className="w-4 h-4 text-rose-400" />
              <span>Meteorolojik & Zaman Koşulları</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Madrid Temp */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Madrid Sıcaklığı (İç İklim):</span>
                  <span className={`font-mono font-bold ${scenario.tempMadrid < 0 ? 'text-cyan-400' : scenario.tempMadrid > 32 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {scenario.tempMadrid} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="-10"
                  max="45"
                  step="1"
                  value={scenario.tempMadrid}
                  onChange={e => setScenario(prev => ({ ...prev, tempMadrid: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Seville Temp */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Sevilla Sıcaklığı (Endülüs Yaz Pik Hattı):</span>
                  <span className={`font-mono font-bold ${scenario.tempSeville > 35 ? 'text-rose-400' : 'text-amber-400'}`}>
                    {scenario.tempSeville} °C
                  </span>
                </div>
                <input
                  type="range"
                  min="-5"
                  max="48"
                  step="1"
                  value={scenario.tempSeville}
                  onChange={e => setScenario(prev => ({ ...prev, tempSeville: parseInt(e.target.value) }))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              {/* Wind Speed */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Rüzgar Hızı (İspanya Ortalaması):</span>
                  <span className="font-mono font-bold text-cyan-300">{scenario.windSpeed} m/s</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="20"
                  step="0.5"
                  value={scenario.windSpeed}
                  onChange={e => setScenario(prev => ({ ...prev, windSpeed: parseFloat(e.target.value) }))}
                  className="w-full accent-cyan-500 cursor-pointer"
                />
              </div>

              {/* Hour of Day */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Günün Saati (Döngüsel Talep):</span>
                  <span className="font-mono font-bold text-white">
                    {scenario.hour.toString().padStart(2, '0')}:00 {scenario.hour >= 19 && scenario.hour <= 22 ? '(Akşam Piki)' : ''}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="23"
                  step="1"
                  value={scenario.hour}
                  onChange={e => setScenario(prev => ({ ...prev, hour: parseInt(e.target.value) }))}
                  className="w-full accent-blue-500 cursor-pointer"
                />
              </div>

              {/* Weekend toggle */}
              <label className="flex items-center gap-2 pt-1 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scenario.isWeekend}
                  onChange={e => setScenario(prev => ({ ...prev, isWeekend: e.target.checked }))}
                  className="accent-blue-500"
                />
                <span>Hafta Sonu (Sanayi tüketimi ~%18 düşer)</span>
              </label>
            </div>
          </div>

          {/* Municipality Policy Sliders */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Belediye Tarife Düzenleme & Sübvansiyon Ayarları</span>
            </h3>

            <div className="space-y-4 text-xs">
              {/* Subsidy Rate */}
              <div>
                <div className="flex justify-between text-slate-300 mb-1">
                  <span>Belediye Fiyat Sübvansiyon Oranı:</span>
                  <span className="font-mono font-bold text-emerald-400">%{scenario.subsidyRate} İndirim</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="5"
                  value={scenario.subsidyRate}
                  onChange={e => setScenario(prev => ({ ...prev, subsidyRate: parseInt(e.target.value) }))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />
                <span className="text-[10px] text-slate-400">Belediye bütçesinden doğrudan faturaya yansıtılan koruma</span>
              </div>

              {/* Peak Fee Waiver */}
              <label className="flex items-start gap-2.5 p-3 rounded-lg border border-slate-800 bg-slate-950/60 cursor-pointer">
                <input
                  type="checkbox"
                  checked={scenario.peakHourFeeWaiver}
                  onChange={e => setScenario(prev => ({ ...prev, peakHourFeeWaiver: e.target.checked }))}
                  className="mt-0.5 accent-emerald-500"
                />
                <div>
                  <span className="font-semibold text-white block">Pik Saat İletim Bedeli Muafiyeti</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5">
                    18:00 - 22:00 pik saatlerindeki 8.50 €/MWh iletim ek yükünü belediye üstlenir.
                  </span>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Results & Action Column (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Grid Stress & Primary Forecast Banner */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <div>
                <span className="text-xs text-slate-400 block">Şebeke Stres Seviyesi (Grid Stress):</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      result.gridStressLevel === 'KRİTİK ALARM'
                        ? 'bg-rose-950 text-rose-300 border-rose-700 animate-pulse'
                        : result.gridStressLevel === 'YÜKSEK'
                        ? 'bg-amber-950 text-amber-300 border-amber-700'
                        : 'bg-emerald-950 text-emerald-300 border-emerald-700'
                    }`}
                  >
                    {result.gridStressLevel}
                  </span>
                  <span className="text-xs text-slate-300 font-mono">
                    Stres İndeksi: %{result.gridStressIndex} / 100
                  </span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-400 block">Tahmini Talep Artışı</span>
                <span className="text-sm font-bold font-mono text-white">
                  +{Math.max(0, result.predictedDemandMW - result.baselineDemandMW).toLocaleString('tr-TR')} MW Sapma
                </span>
              </div>
            </div>

            {/* Gauge bar */}
            <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden p-0.5 border border-slate-800">
              <div
                className={`h-full rounded-full transition-all duration-500 ${
                  result.gridStressIndex > 80
                    ? 'bg-rose-500'
                    : result.gridStressIndex > 50
                    ? 'bg-amber-500'
                    : 'bg-emerald-500'
                }`}
                style={{ width: `${result.gridStressIndex}%` }}
              />
            </div>

            {/* 4 Impact Stat Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 pt-3 border-t border-slate-800 text-xs">
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Model Tahmini Talep</span>
                <span className="text-base font-bold text-blue-400 font-mono">
                  {result.predictedDemandMW.toLocaleString('tr-TR')} MW
                </span>
                <span className="text-[10px] text-slate-500 block">Normal: {result.baselineDemandMW.toLocaleString('tr-TR')} MW</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Toptan Spot Fiyatı</span>
                <span className="text-base font-bold text-rose-400 font-mono">
                  {result.predictedWholesalePriceEUR} €/MWh
                </span>
                <span className="text-[10px] text-slate-500 block">Ham Piyasa Fiyatı</span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Tüketiciye Yansıyan Tarife</span>
                <span className="text-base font-bold text-emerald-400 font-mono">
                  {result.finalConsumerTariffEUR} €/MWh
                </span>
                <span className="text-[10px] text-emerald-500 block font-semibold">
                  %{scenario.subsidyRate} Sübvanse Edildi
                </span>
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800">
                <span className="text-slate-400 block text-[10px]">Saatlik Belediye Maliyeti</span>
                <span className="text-base font-bold text-amber-400 font-mono">
                  {result.totalSubsidyCostMunicipalEUR.toLocaleString('tr-TR')} €
                </span>
                <span className="text-[10px] text-slate-500 block">Belediye Enerji Fonundan</span>
              </div>
            </div>
          </div>

          {/* Suggested Municipal Action Callout */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <h4 className="text-sm font-bold text-white flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-amber-400" />
              <span>Yapay Zeka Destekli Belediye Müdahale Tavsiyesi</span>
            </h4>
            <div className="bg-slate-950/80 p-3.5 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
              {result.suggestedAction}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-3 text-xs">
              <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-900/40">
                <span className="text-slate-400 block text-[10px]">Korunan Kırılgan Hane Sayısı</span>
                <span className="text-sm font-bold text-blue-300 font-mono">
                  ~{result.vulnerableHouseholdsProtected.toLocaleString('tr-TR')} Hane
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-900/40">
                <span className="text-slate-400 block text-[10px]">Tahmini Karbon Salınımı</span>
                <span className="text-sm font-bold text-emerald-300 font-mono">
                  ~{result.carbonEmissionTons} Ton CO₂ / Saat
                </span>
              </div>
            </div>
          </div>

          {/* Citizen Emergency Notification Generator */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <Send className="w-4 h-4 text-cyan-400" />
                <span>Vatandaşlara Otomatik Erken Uyarı & SMS Şablonu</span>
              </h4>
              <button
                onClick={handleCopyNotification}
                className="flex items-center gap-1.5 px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                {copiedNotification ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Metni Kopyala</span>
                  </>
                )}
              </button>
            </div>

            <pre className="bg-slate-950 p-3.5 rounded-lg border border-slate-800 text-slate-300 font-mono text-xs whitespace-pre-wrap leading-relaxed">
              {notificationTemplate}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
