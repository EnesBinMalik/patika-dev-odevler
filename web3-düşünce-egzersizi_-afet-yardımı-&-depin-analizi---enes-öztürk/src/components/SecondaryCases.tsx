import React, { useState } from 'react';
import { SECONDARY_CASES } from '../data/reportData';
import { BookOpen, Sparkles, Layers } from 'lucide-react';

export const SecondaryCases: React.FC = () => {
  const [activeCase, setActiveCase] = useState(SECONDARY_CASES[0].id);

  const currentCase = SECONDARY_CASES.find(c => c.id === activeCase) || SECONDARY_CASES[0];

  return (
    <section className="pt-12 pb-16 border-t border-stone-200">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs uppercase tracking-widest text-amber-800 font-mono mb-2">
          <span>Ek Düşünce Egzersizleri</span>
          <span aria-hidden="true">·</span>
          <span>Diğer Web3 Kullanım Alanları</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 tracking-tight">
          Web3 Gerçek Dünyayı Başka Hangi Alanlarda Dönüştürebilir?
        </h2>
        <p className="text-stone-600 text-sm mt-2 max-w-2xl leading-relaxed">
          Afet lojistiğine ek olarak, Web2'nin yapısal mülkiyet ve veri tekeli krizlerine çözüm getiren iki tamamlayıcı Web3 kullanım senaryosu.
        </p>
      </div>

      <div className="flex items-center gap-2 mb-6">
        {SECONDARY_CASES.map((c) => (
          <button
            key={c.id}
            onClick={() => setActiveCase(c.id)}
            className={`px-4 py-2 text-xs font-medium rounded-lg border transition-colors cursor-pointer ${
              activeCase === c.id
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-700 border-stone-200 hover:bg-stone-50'
            }`}
          >
            {c.title.split(':')[0]}
          </button>
        ))}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white p-6 sm:p-8 shadow-xs space-y-4">
        <div>
          <span className="text-xs font-mono uppercase tracking-wider text-amber-800 block mb-1">
            {currentCase.tagline}
          </span>
          <h3 className="text-xl sm:text-2xl font-serif font-bold text-stone-900">
            {currentCase.title}
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200">
            <span className="text-xs font-mono uppercase text-stone-500 block mb-1">Mevcut Web2 Tıkanıklığı</span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed">
              {currentCase.problem}
            </p>
          </div>

          <div className="p-4 rounded-lg bg-amber-50/50 border border-amber-200/60">
            <span className="text-xs font-mono uppercase text-amber-900 block mb-1">Web3 Devrimi & Fırsat</span>
            <p className="text-xs sm:text-sm text-stone-800 leading-relaxed">
              {currentCase.solution}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs font-mono text-stone-500">
          <span className="text-stone-400">Anahtar Teknolojiler:</span>
          {currentCase.coreTech.map((tech, idx) => (
            <span key={idx} className="bg-stone-100 px-2 py-0.5 rounded text-stone-700 text-[11px]">
              {tech}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
};
