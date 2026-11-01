import React, { useState } from 'react';
import { AUTHOR_NAME, REPORT_DATE, REPORT_TITLE, REPORT_SUBTITLE, METRICS } from '../data/reportData';

export const HeroSection: React.FC = () => {
  const [imageError, setImageError] = useState(false);

  return (
    <section id="top" className="pt-10 pb-16 border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Editorial Metadata Kicker - Zero Pill Discipline */}
        <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-widest text-stone-500 mb-6 font-mono">
          <span>Web3 & Dağıtık Sistemler Analizi</span>
          <span aria-hidden="true">·</span>
          <span>Düşünce Egzersizi</span>
          <span aria-hidden="true">·</span>
          <span>{REPORT_DATE}</span>
          <span aria-hidden="true">·</span>
          <span className="text-stone-800 font-semibold">Yazar: {AUTHOR_NAME}</span>
        </div>

        {/* Hero Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-stone-900 tracking-tight leading-[1.15] mb-6 max-w-4xl [text-wrap:balance]">
          {REPORT_TITLE}
        </h1>

        <p className="text-lg lg:text-xl text-stone-600 font-sans leading-relaxed max-w-3xl mb-10">
          {REPORT_SUBTITLE}
        </p>

        {/* Featured Visual Presentation */}
        <div className="relative rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-sm mb-12">
          {!imageError ? (
            <img 
              src="/src/assets/images/web3_humanitarian_relief_hero_1793550669303.jpg" 
              alt="Afet lojistiğinde şeffaf insani yardım dağıtım ağı ve dijital veri akışı"
              referrerPolicy="no-referrer"
              onError={() => setImageError(true)}
              className="w-full h-[340px] md:h-[480px] object-cover"
            />
          ) : (
            <div className="w-full h-[380px] flex flex-col items-center justify-center p-8 text-center bg-stone-200 text-stone-700">
              <span className="font-serif text-2xl font-bold mb-2">OpenRelief Mimarisi</span>
              <p className="text-sm max-w-md text-stone-600">
                Merkeziyetsiz tedarik zinciri, akıllı sözleşme emanet kasaları ve güvenli saha lojistiği.
              </p>
            </div>
          )}
          <div className="p-4 bg-[#FAF8F5]/95 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 font-serif italic gap-2">
            <span>Şekil 1.1 — Afet sahasında doğrudan doğrulanabilir lojistik ve çok paydaşlı konsensüs akışı.</span>
            <span className="not-italic font-mono text-[11px] text-stone-400">Protokol: DePIN + zk-SNARKs + Smart Escrow</span>
          </div>
        </div>

        {/* 4-Column KPI / Metric Strip - Below Hero Split (§4.13) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-4">
          {METRICS.map((metric, idx) => (
            <div key={idx} className="p-5 rounded-lg border border-stone-200 bg-white/70 shadow-xs flex flex-col justify-between">
              <div>
                <span className="text-xs uppercase tracking-wider text-stone-500 font-mono block mb-1">
                  {metric.label}
                </span>
                <span className="text-3xl font-serif font-bold text-stone-900 tabular-nums block mb-2">
                  {metric.value}
                </span>
                <p className="text-xs text-stone-600 leading-relaxed mb-3">
                  {metric.description}
                </p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[11px] font-mono text-stone-400">
                {metric.baselineWeb2}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
