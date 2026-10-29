import React, { useState } from 'react';
import { SCHEMA_SDL } from '../graphql/schema.ts';
import { Copy, Check, Download, BookOpen, Layers, ShieldCheck, GitBranch } from 'lucide-react';

export const SchemaDocs: React.FC = () => {
  const [copiedSDL, setCopiedSDL] = useState(false);
  const [selectedType, setSelectedType] = useState<'Query' | 'Country' | 'Continent' | 'Language' | 'Inputs'>('Country');

  const handleCopySDL = () => {
    navigator.clipboard.writeText(SCHEMA_SDL);
    setCopiedSDL(true);
    setTimeout(() => setCopiedSDL(false), 2000);
  };

  const handleDownloadSDL = () => {
    const blob = new Blob([SCHEMA_SDL], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'schema.graphql';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header Info */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-pink-400" />
              GraphQL Schema & Tip Referansı
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              Gereksinimlere uygun olarak tasarlanan ilişkisel şema ve tip tanımlamaları. Geliştirici: <span className="text-pink-400 font-medium">Enes Öztürk</span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySDL}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors"
            >
              {copiedSDL ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSDL ? 'Kopyalandı' : 'SDL Kopyala'}</span>
            </button>

            <button
              onClick={handleDownloadSDL}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-pink-600 hover:bg-pink-500 rounded-lg shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>schema.graphql İndir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Relational Graph Diagram Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-pink-400" />
          İlişkisel Varlık Mimarisi (Relational Graph)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg">
            <div className="font-bold text-pink-400 mb-1 flex items-center justify-between">
              <span>Continent (Kıta)</span>
              <span className="font-mono text-[10px] text-slate-500">1 : N</span>
            </div>
            <p className="text-slate-400 mb-2">Her kıta bünyesinde birden fazla ülkeyi barındırır.</p>
            <div className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
              Continent.countries → [Country!]!
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-pink-500/30 rounded-lg ring-1 ring-pink-500/20">
            <div className="font-bold text-white mb-1 flex items-center justify-between">
              <span>Country (Ülke) - Merkez Düğüm</span>
              <span className="font-mono text-[10px] text-pink-400">Merkez</span>
            </div>
            <p className="text-slate-400 mb-2">Kıtaya bağlıdır ve birden çok dili içerir.</p>
            <div className="font-mono text-[11px] text-pink-200 bg-slate-900 p-2 rounded border border-slate-800 space-y-1">
              <div>Country.continent → Continent!</div>
              <div>Country.languages → [Language!]!</div>
            </div>
          </div>

          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-lg">
            <div className="font-bold text-pink-400 mb-1 flex items-center justify-between">
              <span>Language (Dil)</span>
              <span className="font-mono text-[10px] text-slate-500">N : M</span>
            </div>
            <p className="text-slate-400 mb-2">Bir dil birden çok ülkede resmi/yaygın konuşulabilir.</p>
            <div className="font-mono text-[11px] text-slate-300 bg-slate-900 p-2 rounded border border-slate-800">
              Language.countries → [Country!]!
            </div>
          </div>
        </div>
      </div>

      {/* Type Inspector and SDL Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Type Explorer (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-1.5 mb-4 p-1 bg-slate-950/80 rounded-lg border border-slate-800 text-xs font-medium overflow-x-auto">
            {(['Query', 'Country', 'Continent', 'Language', 'Inputs'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setSelectedType(tab)}
                className={`px-3 py-1.5 rounded-md transition-colors whitespace-nowrap ${
                  selectedType === tab
                    ? 'bg-pink-600 text-white font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {selectedType === 'Query' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">Query Root</h4>
              <p className="text-slate-400">API tarafından sunulan kök sorgular:</p>

              <div className="space-y-2 font-mono">
                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">countries</span>(filter: CountryFilterInput): <span className="text-emerald-400">[Country!]!</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">Tüm ülkeleri veya filtrelenmiş ülkeleri döner.</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">country</span>(code: <span className="text-amber-300">ID!</span>): <span className="text-emerald-400">Country</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">ISO 2-letter kod bazlı tek bir ülkeyi döner (Örn: "TR").</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">continents</span>(filter: ContinentFilterInput): <span className="text-emerald-400">[Continent!]!</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">Tüm kıtaları döner.</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">continent</span>(code: <span className="text-amber-300">ID!</span>): <span className="text-emerald-400">Continent</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">Kod bazlı tek bir kıtayı döner (Örn: "EU").</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">languages</span>(filter: LanguageFilterInput): <span className="text-emerald-400">[Language!]!</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">Tüm dilleri döner.</p>
                </div>

                <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                  <span className="text-pink-400">language</span>(code: <span className="text-amber-300">ID!</span>): <span className="text-emerald-400">Language</span>
                  <p className="text-slate-400 font-sans text-[11px] mt-1">Kod bazlı tek bir dili döner (Örn: "tr").</p>
                </div>
              </div>
            </div>
          )}

          {selectedType === 'Country' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">type Country</h4>
              <p className="text-slate-400">Ülke varlığı alanları ve ilişkileri:</p>

              <div className="space-y-1.5 font-mono">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">code</span>
                  <span className="text-amber-300">ID! (Örn: "TR")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">name</span>
                  <span className="text-cyan-300">String! (Örn: "Turkey")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">native</span>
                  <span className="text-cyan-300">String! (Örn: "Türkiye")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">emoji</span>
                  <span className="text-cyan-300">String! (Örn: "🇹🇷")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">capital</span>
                  <span className="text-cyan-300">String</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">currency</span>
                  <span className="text-cyan-300">String</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-pink-500/40 flex justify-between bg-pink-950/20">
                  <span className="text-pink-300 font-semibold">continent</span>
                  <span className="text-pink-400">Continent! (İlişki)</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-pink-500/40 flex justify-between bg-pink-950/20">
                  <span className="text-pink-300 font-semibold">languages</span>
                  <span className="text-pink-400">[Language!]! (İlişki)</span>
                </div>
              </div>
            </div>
          )}

          {selectedType === 'Continent' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">type Continent</h4>
              <p className="text-slate-400">Kıta varlığı alanları ve ilişkileri:</p>

              <div className="space-y-1.5 font-mono">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">code</span>
                  <span className="text-amber-300">ID! (Örn: "EU", "AS")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">name</span>
                  <span className="text-cyan-300">String! (Örn: "Europe")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-pink-500/40 flex justify-between bg-pink-950/20">
                  <span className="text-pink-300 font-semibold">countries</span>
                  <span className="text-pink-400">[Country!]! (İlişki)</span>
                </div>
              </div>
            </div>
          )}

          {selectedType === 'Language' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">type Language</h4>
              <p className="text-slate-400">Dil varlığı alanları ve ilişkileri:</p>

              <div className="space-y-1.5 font-mono">
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">code</span>
                  <span className="text-amber-300">ID! (Örn: "tr", "en")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">name</span>
                  <span className="text-cyan-300">String! (Örn: "Turkish")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">native</span>
                  <span className="text-cyan-300">String! (Örn: "Türkçe")</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-slate-800 flex justify-between">
                  <span className="text-slate-200">rtl</span>
                  <span className="text-purple-300">Boolean! (Sağdan sola)</span>
                </div>
                <div className="p-2 bg-slate-950 rounded border border-pink-500/40 flex justify-between bg-pink-950/20">
                  <span className="text-pink-300 font-semibold">countries</span>
                  <span className="text-pink-400">[Country!]! (İlişki)</span>
                </div>
              </div>
            </div>
          )}

          {selectedType === 'Inputs' && (
            <div className="space-y-3 text-xs">
              <h4 className="font-bold text-white text-sm">Filtre Girdi Tipleri</h4>
              <p className="text-slate-400">GraphQL sorgularında kullanılan filtre operatörleri:</p>

              <div className="space-y-2 font-mono text-[11px]">
                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-pink-400 font-bold mb-1">input CountryFilterInput</div>
                  <div className="text-slate-300">code: StringQueryOperatorInput</div>
                  <div className="text-slate-300">continent: StringQueryOperatorInput</div>
                  <div className="text-slate-300">currency: StringQueryOperatorInput</div>
                </div>

                <div className="p-2 bg-slate-950 rounded border border-slate-800">
                  <div className="text-pink-400 font-bold mb-1">input StringQueryOperatorInput</div>
                  <div className="text-slate-300">eq: String (Tam eşleşme)</div>
                  <div className="text-slate-300">ne: String (Eşit değil)</div>
                  <div className="text-slate-300">in: [String!] (Liste içinde)</div>
                  <div className="text-slate-300">regex: String (Düzenli ifade)</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Full Schema SDL Viewer (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Layers className="w-3.5 h-3.5 text-pink-400" />
              <span className="text-xs font-semibold text-slate-200">Schema Definition Language (SDL)</span>
            </div>
            <span className="text-[11px] font-mono text-slate-400">schema.graphql</span>
          </div>

          <pre className="p-4 bg-slate-950/70 font-mono text-xs leading-relaxed text-slate-300 overflow-auto max-h-[580px] selection:bg-pink-500/30">
            {SCHEMA_SDL}
          </pre>
        </div>
      </div>
    </div>
  );
};
