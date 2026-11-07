/**
 * Hero Section with Generated Traffic Analytics Visual & 4 Core Research Pillars
 * Research Signature: Enes Öztürk
 */
import React from 'react';
import { ArrowDown, CheckCircle2, TrendingDown, Gauge, Shield, AlertTriangle, UserCheck } from 'lucide-react';
import { DATASET_OVERVIEW } from '../data/accidentData.ts';

interface HeroSectionProps {
  onScrollTo: (id: string) => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onScrollTo }) => {
  return (
    <section id="top" className="relative w-full pt-6 pb-12 border-b border-slate-800/80 overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-96 bg-amber-500/5 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        
        {/* Author & Research Kicker (No pills, clean unboxed typography) */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4 font-mono">
          <span className="text-amber-400 flex items-center gap-1.5 font-medium">
            <UserCheck className="w-3.5 h-3.5" />
            Hazırlayan: Enes Öztürk
          </span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span>Birleşik Krallık DfT STATS19 Veri Tabanı</span>
          <span aria-hidden="true" className="text-slate-600">/</span>
          <span className="text-slate-300">2000 – 2016 (17 Yıllık Kapsam)</span>
        </div>

        {/* Hero Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mb-10">
          
          {/* Left Column: Title, Problem Definition, Questions */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white text-balance leading-tight">
              1.6 Milyon UK Trafik Kazası
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-200 to-amber-500 mt-1">
                Büyük Veri Analizi & Tahmin Platformu
              </span>
            </h1>

            <div className="space-y-3 text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              <p className="border-l-2 border-amber-400/70 pl-4 py-1 text-slate-200 bg-slate-900/40 rounded-r-lg">
                <strong className="text-amber-300 font-semibold">Problem Tanımı ve Amaç:</strong> Bu veri seti, Birleşik Krallık’ta 2000–2016 yıllarına ait 1.6 milyondan fazla resmi trafik kazası kaydını içermektedir. Bu platform, karayolu güvenliğindeki temel dinamikleri aydınlatmak ve politika simülasyonları üretmek amacıyla geliştirilmiştir.
              </p>
            </div>

            {/* The 4 Core Questions Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-2">
              <button
                onClick={() => onScrollTo('traffic-flow')}
                className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-400/10 flex items-center justify-center font-bold text-[10px]">1</span>
                  Trafik Akışı Dinamiği
                </div>
                <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                  Trafik akışının değişmesi kaza sıklığını ve şiddetini nasıl etkiler?
                </div>
              </button>

              <button
                onClick={() => onScrollTo('risk-factors')}
                className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-400/10 flex items-center justify-center font-bold text-[10px]">2</span>
                  Kaza Oranlarını Ne Artırır?
                </div>
                <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                  Hava, aydınlatma, hız limiti ve yol tipi riskleri nasıl katlar?
                </div>
              </button>

              <button
                onClick={() => onScrollTo('forecasting')}
                className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-400/10 flex items-center justify-center font-bold text-[10px]">3</span>
                  Zaman Serisi Tahmini
                </div>
                <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                  2030 yılına kadar kaza ve can kaybı eğilimlerini öngörebilir miyiz?
                </div>
              </button>

              <button
                onClick={() => onScrollTo('rural-urban')}
                className="text-left p-3 rounded-lg bg-slate-900/80 border border-slate-800 hover:border-amber-500/40 hover:bg-slate-850 transition-all group"
              >
                <div className="text-xs font-mono text-amber-400 mb-1 flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded bg-amber-400/10 flex items-center justify-center font-bold text-[10px]">4</span>
                  Kırsal vs Kentsel Ayrışması
                </div>
                <div className="text-xs font-medium text-slate-200 group-hover:text-white">
                  Kazaların %68'i şehirlerdeyken neden ölümlerin %58'i kırsalda?
                </div>
              </button>
            </div>

            {/* Author Credit Badge */}
            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
              <span className="font-semibold text-amber-400">Araştırmacı: Enes Öztürk</span>
              <span aria-hidden="true">·</span>
              <span>1,640,598 Temizlenmiş Veri Satırı</span>
              <span aria-hidden="true">·</span>
              <span>32 Parametrik Değişken</span>
            </div>

          </div>

          {/* Right Column: High Fidelity Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl group">
              <img
                src="/src/assets/images/uk_traffic_safety_analysis_1794041314001.jpg"
                alt="UK Otoyol ve Trafik Akışı Veri Analitiği Görseli"
                referrerPolicy="no-referrer"
                className="w-full h-[320px] sm:h-[380px] lg:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent pointer-events-none" />

              {/* In-Image Overlay Caption */}
              <div className="absolute bottom-4 left-4 right-4 p-3.5 bg-slate-950/80 backdrop-blur-md border border-slate-800/80 rounded-xl">
                <div className="flex items-center justify-between text-xs text-slate-300 mb-1">
                  <span className="font-semibold text-amber-400">İngiltere Otoyol Ağı & M25 Koridoru</span>
                  <span className="font-mono text-slate-400">17 Yıllık Veri Tabanı</span>
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">
                  Trafik hacmi %12.3 artarken teknolojik denetim ve araç güvenliği sayesinde kaza oranları %42.1 gerilemiştir.
                </p>
                <div className="mt-2 text-[10px] text-amber-400/90 font-mono flex items-center justify-between border-t border-slate-800 pt-1.5">
                  <span>Hazırlayan: Enes Öztürk</span>
                  <span>STATS19 / DfT UK</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* 4 Primary KPI Summary Metrics Strip */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 p-5 rounded-xl bg-slate-900/60 border border-slate-800/80">
          
          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              İncelenen Toplam Kaza
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              1,640,598
            </div>
            <div className="text-xs text-slate-500">
              2000–2016 Birleşik Krallık kayıtları
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <TrendingDown className="w-3.5 h-3.5 text-emerald-400" />
              Kaza Sıklığı Değişimi
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-emerald-400 tabular-nums">
              -42.1%
            </div>
            <div className="text-xs text-slate-500">
              235K'den 136K'ya gerileme
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              Kırsal Ölümcüllük Riski
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-rose-400 tabular-nums">
              3.3x Kat
            </div>
            <div className="text-xs text-slate-500">
              Kentsel kazalara göre ölüm oranı
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-xs text-slate-400 flex items-center gap-1.5 font-medium">
              <Gauge className="w-3.5 h-3.5 text-blue-400" />
              Yıllık Trafik Hacmi (2016)
            </div>
            <div className="text-2xl sm:text-3xl font-bold font-mono text-white tabular-nums">
              524.1 <span className="text-sm font-normal text-slate-400">Milyar Mil</span>
            </div>
            <div className="text-xs text-slate-500">
              Hacim artışına rağmen kaza azalışı
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
