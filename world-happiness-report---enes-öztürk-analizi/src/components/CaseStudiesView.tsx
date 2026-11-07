import React, { useState } from 'react';
import { TrendingDown, TrendingUp, AlertCircle, CheckCircle2, BookOpen, Lightbulb, ShieldAlert } from 'lucide-react';
import { CASE_STUDIES, CaseStudy } from '../data/happinessData';

export const CaseStudiesView: React.FC = () => {
  const [selectedCountry, setSelectedCountry] = useState<string>(CASE_STUDIES[0].country);

  const activeCase = CASE_STUDIES.find((c) => c.country === selectedCountry) || CASE_STUDIES[0];

  return (
    <section className="py-12 bg-[#FBF9F5] border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs uppercase tracking-widest text-amber-900 font-semibold mb-1">
              Araştırma Sorusu 03: Derinlemesine Vaka Analizleri
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900">
              Mutlulukta Büyük Kırılmalar: Yükselişler ve Çöküşler
            </h2>
          </div>
          <p className="text-sm text-stone-600 max-w-md">
            Enes Öztürk tarafından hazırlanan bu vaka çalışmaları, bir toplumun mutluluğunu neyin hızla yıktığını veya inşa ettiğini açıklar.
          </p>
        </div>

        {/* Case Study Selection Pills / Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CASE_STUDIES.map((cs) => {
            const isSelected = cs.country === selectedCountry;
            const isDropper = cs.type === 'dropper';
            return (
              <button
                key={cs.country}
                onClick={() => setSelectedCountry(cs.country)}
                className={`p-4 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                  isSelected
                    ? isDropper
                      ? 'bg-rose-950 text-white border-rose-900 shadow-sm'
                      : 'bg-emerald-950 text-white border-emerald-900 shadow-sm'
                    : 'bg-white text-stone-800 border-stone-200 hover:bg-stone-50'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{cs.flag}</span>
                    <span
                      className={`text-xs font-mono font-bold px-2 py-0.5 rounded ${
                        isSelected
                          ? 'bg-white/20 text-white'
                          : isDropper
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {cs.scoreDelta > 0 ? `+${cs.scoreDelta.toFixed(3)}` : cs.scoreDelta.toFixed(3)} Puan
                    </span>
                  </div>
                  <h3 className={`font-serif font-bold text-base ${isSelected ? 'text-white' : 'text-stone-900'}`}>
                    {cs.country}
                  </h3>
                  <div className={`text-xs font-mono mt-0.5 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                    Sıra Değişimi: {cs.rankDelta > 0 ? `+${cs.rankDelta}` : cs.rankDelta} Basamak
                  </div>
                </div>

                <div className={`text-[11px] mt-3 line-clamp-1 ${isSelected ? 'text-stone-300' : 'text-stone-500'}`}>
                  {isDropper ? 'Dramatik Gerileme' : 'Tarihi Sıçrayış'}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Deep Dive Case Container */}
        <div className="bg-white border border-stone-300 rounded-2xl p-6 sm:p-8 lg:p-10 shadow-xs space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-6">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{activeCase.flag}</span>
              <div>
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span
                    className={`px-2 py-0.5 rounded font-semibold uppercase ${
                      activeCase.type === 'dropper'
                        ? 'bg-rose-100 text-rose-800'
                        : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {activeCase.type === 'dropper' ? 'Kriz & Düşüş Vakası' : 'Toparlanma & İlerleme Vakası'}
                  </span>
                  <span className="text-stone-400">·</span>
                  <span className="text-stone-600">2015 – 2017 Karşılaştırmalı İncelemesi</span>
                </div>
                <h3 className="text-2xl font-serif font-bold text-stone-950 mt-1">
                  {activeCase.country}: {activeCase.headline}
                </h3>
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm font-mono shrink-0">
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-right">
                <span className="text-[11px] text-stone-500 block">Puan Farkı:</span>
                <span
                  className={`text-base font-bold tabular-nums ${
                    activeCase.scoreDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {activeCase.scoreDelta > 0 ? `+${activeCase.scoreDelta.toFixed(3)}` : activeCase.scoreDelta.toFixed(3)}
                </span>
              </div>
              <div className="p-3 bg-stone-50 border border-stone-200 rounded-lg text-right">
                <span className="text-[11px] text-stone-500 block">Sıra Kayması:</span>
                <span
                  className={`text-base font-bold tabular-nums ${
                    activeCase.rankDelta > 0 ? 'text-emerald-700' : 'text-rose-700'
                  }`}
                >
                  {activeCase.rankDelta > 0 ? `+${activeCase.rankDelta}` : activeCase.rankDelta}
                </span>
              </div>
            </div>
          </div>

          {/* Narrative Summary */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold font-mono">
              Olayın Arka Planı ve Dinamikleri
            </h4>
            <p className="text-base text-stone-700 leading-relaxed font-serif">
              {activeCase.summaryTr}
            </p>
          </div>

          {/* Factor Impact Grid */}
          <div>
            <h4 className="text-xs uppercase tracking-widest text-stone-500 font-semibold font-mono mb-3">
              Kırılmanın 6 Faktör Üzerindeki Yansımaları
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {activeCase.factorsBehindShift.map((item, idx) => (
                <div key={idx} className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
                  <div className="text-xs font-serif font-bold text-stone-900 mb-1">
                    {item.factor}
                  </div>
                  <p className="text-xs text-stone-600 leading-normal">
                    {item.impact}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Policy Takeaways Box */}
          <div className="p-5 bg-[#F6F2EA] border border-amber-900/20 rounded-xl flex items-start gap-3.5">
            <Lightbulb className="w-5 h-5 text-amber-900 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="text-xs font-serif font-bold text-amber-950 uppercase tracking-wide">
                Kamu Politikaları ve Toplum Refahı İçin Temel Ders (Enes Öztürk Değerlendirmesi)
              </span>
              <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
                {activeCase.lessonsForPolicy}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
