import React from 'react';
import { Search, Sparkles, ShieldCheck, ArrowRight, Activity, FileText, Cpu, Award } from 'lucide-react';

interface HeroSectionProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onExecuteSearch: (query: string) => void;
  onSelectTask: (taskId: string) => void;
  onOpenProvenance: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  searchQuery,
  setSearchQuery,
  onExecuteSearch,
  onSelectTask,
  onOpenProvenance
}) => {
  const quickSearches = [
    { label: 'ACE2 Reseptörü & Furin', query: 'Spike ACE2 reseptörü furin yarılma' },
    { label: 'Deksametazon RECOVERY', query: 'Dexamethasone RECOVERY mekanik ventilasyon' },
    { label: 'D-Dimer & Tromboz', query: 'D-Dimer mikrovasküler tromboz mortalite' },
    { label: 'Paxlovid EPIC-HR', query: 'Nirmatrelvir ritonavir Paxlovid 3CLpro' },
    { label: 'Kuluçka & Aerosol', query: 'Kuluçka süresi aerosol dayanıklılığı' }
  ];

  return (
    <section className="relative border-b border-slate-800 bg-slate-950 overflow-hidden">
      {/* Background Subtle Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b0f_1px,transparent_1px),linear-gradient(to_bottom,#1e293b0f_1px,transparent_1px)] bg-[size:4rem_4rem] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Problem Definition & Search */}
          <div className="lg:col-span-7 flex flex-col space-y-6">
            
            {/* Signature & Provenance Kicker */}
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span className="text-cyan-400 font-semibold tracking-wide">
                BEYAZ SARAY OSTP · ALLEN AI · KAGGLE
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300 font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-cyan-400 inline" />
                Enes Öztürk İmzalı
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 font-mono">CORD-19 v2.4</span>
            </div>

            {/* Main Headline */}
            <div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight" style={{ textWrap: 'balance' }}>
                COVID-19 Open Research Dataset Challenge
              </h1>
              <p className="mt-2 text-lg font-medium text-cyan-400">
                Biyomedikal Metin ve Veri Madenciliği Keşif Platformu
              </p>
            </div>

            {/* Problem Definition Block */}
            <div className="p-4 sm:p-5 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-mono text-cyan-400 font-semibold">
                  Problem Tanımı ve Amaç
                </span>
                <span className="text-[11px] font-mono text-slate-400">
                  Resmi Araştırma Çağrısı
                </span>
              </div>
              <p className="text-sm text-slate-300 leading-relaxed">
                Veri seti Beyaz Saray ve önde gelen araştırma grupları tarafından oluşturulan Covid-19 açık kaynak veri setidir. 
                <strong className="text-white font-medium"> CORD-19 veri seti</strong>, mevcut olan en kapsamlı koronavirüs literatür koleksiyonunu temsil ediyor. 
                Koronavirüs literatüründeki hızlı değişimlere bilim insanlarının ayak uydurmaları zorluklara neden olmaktadır. 
                Bu nedenle tıp camiasının yüksek öncelikli bilimsel sorulara kanıta dayalı yanıtlar geliştirmesine yardımcı olabilecek metin ve veri madenciliği araçları geliştirmesi amaçlanmaktadır.
              </p>
              <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <span>Baş Araştırmacı & Sistem Mimarı: <strong className="text-slate-200">Enes Öztürk</strong></span>
                <button
                  onClick={onOpenProvenance}
                  className="text-cyan-400 hover:text-cyan-300 font-medium inline-flex items-center gap-1"
                >
                  Detaylı İncele <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Global Search Bar */}
            <div className="space-y-2.5">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  onExecuteSearch(searchQuery);
                }}
                className="relative flex items-center"
              >
                <div className="absolute left-4 text-slate-400 pointer-events-none">
                  <Search className="w-5 h-5 text-cyan-400" />
                </div>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Klinik soru veya biyomedikal kavram arayın (örn. ACE2 afinitesi, Deksametazon sağkalım)..."
                  className="w-full pl-12 pr-28 py-3.5 bg-slate-900 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-2 px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-semibold rounded-lg text-xs transition-colors flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Madenle</span>
                </button>
              </form>

              {/* Quick Search Badges */}
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 text-[11px] font-mono mr-1">Önerilenler:</span>
                {quickSearches.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSearchQuery(item.query);
                      onExecuteSearch(item.query);
                    }}
                    className="px-2.5 py-1 rounded bg-slate-900/90 hover:bg-slate-800 text-slate-300 border border-slate-800 hover:border-slate-700 transition-colors text-xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Right Column: High-Fidelity Scientific Molecular Visual & Telemetry */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl">
              <img
                src="/src/assets/images/cord19_scientific_research_banner_1794040621604.jpg"
                alt="SARS-CoV-2 Spike Glycoprotein Cryo-EM 3D Model and CORD-19 Genomic Telemetry Matrix"
                className="w-full h-72 sm:h-80 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              
              {/* Image Floating Annotation */}
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[11px] text-cyan-300 bg-slate-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                    PDB: 6VSB · Cryo-EM 3.5Å
                  </span>
                  <span className="text-slate-300 text-xs hidden sm:inline">
                    Prefusion Spike Glikoproteini
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-400">
                  Enes Öztürk Analiz Modeli
                </span>
              </div>
            </div>

            {/* Telemetry Strip with Tabular Figures */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  İndekslenen Makale
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  200,000+
                </div>
                <div className="text-[10px] text-slate-500">Tam Metin JSON</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Öncelikli Görev
                </div>
                <div className="text-xl font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
                  10
                </div>
                <div className="text-[10px] text-slate-500">Kaggle Challenge</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Hasta Havuzu N
                </div>
                <div className="text-xl font-bold font-mono text-white tabular-nums mt-0.5">
                  1.2M+
                </div>
                <div className="text-[10px] text-slate-500">Klinik Kohortlar</div>
              </div>

              <div className="p-3 rounded-lg bg-slate-900/60 border border-slate-800/80">
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                  Kanıt Tutarlılığı
                </div>
                <div className="text-xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  94.8%
                </div>
                <div className="text-[10px] text-slate-500">GRADE Standart</div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};
