import React, { useState } from 'react';
import { COMPARISONS } from '../data/reportData';
import { XCircle, CheckCircle2, ArrowRight } from 'lucide-react';

export const ComparisonMatrix: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredItems = selectedCategory === 'all' 
    ? COMPARISONS 
    : COMPARISONS.filter(c => c.id === selectedCategory);

  return (
    <section id="karsilastirma" className="pt-12 pb-16 border-t border-stone-200">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
          <span>Sistemik Karşılaştırma Matrisi</span>
          <span aria-hidden="true">·</span>
          <span>Web2 Sınırları vs. Web3 Çözümleri</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Neden Web2 Yetersiz Kalıyor ve Web3 Ne Sağlıyor?
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          Geleneksel kurumsal ERP ve veritabanı sistemlerinin kriz anında tıkandığı noktalar ile blokzincir temelli çözümün sunduğu radikal mimari farklar.
        </p>
      </div>

      {/* Filter Segmented Control (§1.A) */}
      <div className="flex items-center gap-1.5 p-1 bg-stone-100 rounded-lg max-w-full overflow-x-auto mb-8">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-white text-stone-900 shadow-xs font-semibold'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          Tüm Boyutlar
        </button>
        {COMPARISONS.map((comp) => (
          <button
            key={comp.id}
            onClick={() => setSelectedCategory(comp.id)}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap cursor-pointer ${
              selectedCategory === comp.id
                ? 'bg-white text-stone-900 shadow-xs font-semibold'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            {comp.category}
          </button>
        ))}
      </div>

      {/* Comparison Cards Grid */}
      <div className="space-y-6">
        {filteredItems.map((item) => (
          <div key={item.id} className="rounded-xl border border-stone-200 bg-white overflow-hidden shadow-xs">
            <div className="p-4 bg-stone-50 border-b border-stone-200 flex flex-wrap items-center justify-between gap-2">
              <span className="font-serif font-bold text-stone-900 text-base">
                {item.title}
              </span>
              <span className="text-xs font-mono text-stone-500 uppercase tracking-wider">
                {item.category}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-stone-200">
              
              {/* Web2 Limitation Column */}
              <div className="p-6 space-y-3 bg-[#FCFAF7]">
                <div className="flex items-center gap-2 text-stone-600 text-xs font-mono uppercase tracking-wide">
                  <XCircle className="w-4 h-4 text-stone-500" />
                  <span>Web2 Yaklaşımı ve Sınırlamaları</span>
                </div>
                <p className="text-sm text-stone-700">
                  {item.web2Approach}
                </p>
                <div className="p-3 rounded bg-stone-100 text-stone-600 text-xs leading-relaxed border border-stone-200/80">
                  <strong className="text-stone-800 block mb-0.5">Yapısal Tıkanıklık:</strong>
                  {item.web2Limitation}
                </div>
              </div>

              {/* Web3 Innovation Column */}
              <div className="p-6 space-y-3 bg-white">
                <div className="flex items-center gap-2 text-stone-900 text-xs font-mono uppercase tracking-wide">
                  <CheckCircle2 className="w-4 h-4 text-amber-800" />
                  <span>Web3 Çözümü ve Kriptografik Yenilik</span>
                </div>
                <p className="text-sm text-stone-700">
                  {item.web3Approach}
                </p>
                <div className="p-3 rounded bg-amber-50/60 text-stone-800 text-xs leading-relaxed border border-amber-200/60">
                  <strong className="text-amber-950 block mb-0.5">Sağlanan Değer:</strong>
                  {item.web3Innovation}
                </div>
              </div>

            </div>

            <div className="px-6 py-2.5 bg-stone-50/70 border-t border-stone-200 text-xs font-mono text-stone-500 flex items-center gap-2">
              <span className="text-stone-400">Teknoloji Dayanağı:</span>
              <span className="text-stone-700">{item.underlyingTech}</span>
            </div>
          </div>
        ))}
      </div>

    </section>
  );
};
