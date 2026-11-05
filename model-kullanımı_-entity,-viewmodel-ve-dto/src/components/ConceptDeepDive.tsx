import React, { useState } from 'react';
import { CONCEPTS_DATA, COMPARISON_MATRIX } from '../data/homeworkData';
import { ModelType } from '../types/modelTypes';
import { Check, X, AlertTriangle, Copy, CheckCheck } from 'lucide-react';

export const ConceptDeepDive: React.FC = () => {
  const [selectedConcept, setSelectedConcept] = useState<ModelType>('entity');
  const [copied, setCopied] = useState(false);

  const activeData = CONCEPTS_DATA.find((c) => c.id === selectedConcept)!;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(activeData.codeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="concepts" className="py-12 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            01. Temel Teori & Sorumluluk Dağılımı
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Entity, DTO ve ViewModel: Derinlemesine İnceleme
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
            Her model türü, katmanlı mimarinin farklı bir seviyesinde özgül bir amaca hizmet eder. Bir modelin görevini diğerine yüklemek mimari çürümeye (architectural decay) ve güvenlik zafiyetlerine yol açar.
          </p>
        </div>

        {/* Concept Selector Tabs (Segmented Button Controls) */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-200/70 dark:bg-slate-800 rounded-xl max-w-md mb-8">
          <button
            onClick={() => setSelectedConcept('entity')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedConcept === 'entity'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            1. Entity (Varlık)
          </button>
          <button
            onClick={() => setSelectedConcept('dto')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedConcept === 'dto'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            2. DTO (Data Transfer)
          </button>
          <button
            onClick={() => setSelectedConcept('viewmodel')}
            className={`flex-1 min-w-[120px] py-2 px-3 text-xs sm:text-sm font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
              selectedConcept === 'viewmodel'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            3. ViewModel (Görünüm)
          </button>
        </div>

        {/* Selected Concept Deep Dive Container */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 shadow-sm mb-12">
          {/* Header Row */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-slate-700">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">
                <span>{activeData.badge}</span>
                <span aria-hidden="true">·</span>
                <span>{activeData.layer}</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {activeData.title}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 mt-1 italic">
                "{activeData.tagline}"
              </p>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors whitespace-nowrap shrink-0 self-start md:self-auto cursor-pointer"
            >
              {copied ? (
                <>
                  <CheckCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>C# Kodunu Kopyala</span>
                </>
              )}
            </button>
          </div>

          {/* Grid Layout: Responsibilities & Code */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-6">
            {/* Left Column: Responsibilities & Rules */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                  Temel Amaç ve Rolü
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-lg border border-slate-200 dark:border-slate-800">
                  {activeData.purpose}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                  Temel Sorumlulukları
                </h4>
                <ul className="space-y-2">
                  {activeData.keyResponsibilities.map((resp, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                      <span>{resp}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Must Include vs Must NEVER Include */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-400 mb-2">
                    <Check className="w-4 h-4" />
                    <span>Neleri İçermelidir?</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeData.mustInclude.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-emerald-600 font-bold shrink-0">✓</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-rose-500/5 border border-rose-500/20">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-rose-700 dark:text-rose-400 mb-2">
                    <X className="w-4 h-4" />
                    <span>Neleri ASLA İçermemelidir?</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                    {activeData.mustNeverInclude.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-rose-600 font-bold shrink-0">✕</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Common Mistakes */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Ödevlerde ve Projelerde Sık Yapılan Hatalar</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {activeData.commonMistakes.map((mistake, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <span className="text-amber-600 font-bold shrink-0">!</span>
                      <span>{mistake}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Right Column: Code Snippet */}
            <div className="lg:col-span-6 flex flex-col">
              <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Örnek C# / .NET Uygulaması</span>
                <span className="text-slate-500 dark:text-slate-400 font-normal">Sözdizimi</span>
              </div>
              <div className="bg-slate-950 text-slate-100 rounded-xl p-4 font-mono text-xs overflow-x-auto leading-relaxed border border-slate-800 flex-1">
                <pre>{activeData.codeSnippet}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Comprehensive Comparison Matrix */}
        <div className="mt-12">
          <div className="mb-6">
            <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
              Hızlı Başvuru Tablosu
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
              7 Temel Kriterde Karşılaştırma Matrisi
            </h3>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1">
              Sınavlarda, mülakatlarda ve ödev savunmalarında modeller arasındaki farkları tek bakışta açıklayan özet matris:
            </p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-100/70 dark:bg-slate-800/90 text-slate-900 dark:text-white">
                    <th className="py-3.5 px-4 font-bold w-1/4">Kriter</th>
                    <th className="py-3.5 px-4 font-bold text-emerald-700 dark:text-emerald-400 w-1/4">
                      Entity (Varlık)
                    </th>
                    <th className="py-3.5 px-4 font-bold text-blue-700 dark:text-blue-400 w-1/4">
                      DTO (Data Transfer Object)
                    </th>
                    <th className="py-3.5 px-4 font-bold text-amber-700 dark:text-amber-400 w-1/4">
                      ViewModel (Görünüm Modeli)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {COMPARISON_MATRIX.map((row, idx) => (
                    <tr
                      key={idx}
                      className={idx % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/50 dark:bg-slate-800/50'}
                    >
                      <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">
                        {row.feature}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 leading-snug">
                        {row.entity}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 leading-snug">
                        {row.dto}
                      </td>
                      <td className="py-3 px-4 text-slate-700 dark:text-slate-300 leading-snug">
                        {row.viewModel}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
