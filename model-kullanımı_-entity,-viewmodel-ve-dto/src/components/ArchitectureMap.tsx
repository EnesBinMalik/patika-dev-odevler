import React, { useState } from 'react';
import { Layers, ArrowDown, ArrowUp, Shield, Cpu, Monitor, Database } from 'lucide-react';

export const ArchitectureMap: React.FC = () => {
  const [activeHighlight, setActiveHighlight] = useState<'all' | 'entity' | 'dto' | 'viewmodel'>('all');

  return (
    <section id="architecture" className="py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            02. Mimari Katmanlar & Veri Yolları
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Katmanlı Mimaride Model Sınırları ve Veri Akışı
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
            Clean Architecture ve N-Tier mimarilerinde bağımlılık kuralı (Dependency Rule) gereği dış katmanlar iç katmanları bilebilir ancak iç katmanlar dış katmanları asla bilmemelidir. Modeller bu sınırları koruyan pasaportlardır.
          </p>
        </div>

        {/* Filter Controls (Segmented Buttons) */}
        <div className="flex flex-wrap items-center gap-2 mb-8 p-1 bg-slate-100 dark:bg-slate-800 rounded-lg max-w-xl">
          <button
            onClick={() => setActiveHighlight('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeHighlight === 'all'
                ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Tüm Katmanları Göster
          </button>
          <button
            onClick={() => setActiveHighlight('viewmodel')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeHighlight === 'viewmodel'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            ViewModel Nerede Yaşar?
          </button>
          <button
            onClick={() => setActiveHighlight('dto')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeHighlight === 'dto'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            DTO Nerede Yaşar?
          </button>
          <button
            onClick={() => setActiveHighlight('entity')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
              activeHighlight === 'entity'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Entity Nerede Yaşar?
          </button>
        </div>

        {/* Interactive Architecture Flow Diagram */}
        <div className="space-y-4">
          {/* Layer 1: Presentation Layer */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              activeHighlight === 'viewmodel' || activeHighlight === 'all'
                ? 'bg-amber-50/50 dark:bg-amber-950/20 border-amber-300 dark:border-amber-700 ring-2 ring-amber-400/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Monitor className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wide">
                    <span>Katman 1</span>
                    <span aria-hidden="true">·</span>
                    <span>Presentation / UI Layer</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Kullanıcı Arayüzü & Ekranlar (Views, Razor, React, Mobile)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                    Kullanıcı formu doldurur, butonlara tıklar. Sayfa verilerini biçimlendirmek ve doğrulamak için doğrudan <strong className="text-amber-800 dark:text-amber-300">ViewModel</strong> ile çalışır.
                  </p>
                </div>
              </div>

              {/* Model Tag */}
              <div className="bg-white dark:bg-slate-800 border border-amber-300 dark:border-amber-600/50 px-4 py-2 rounded-xl text-left md:text-right shrink-0">
                <div className="text-xs text-slate-500 dark:text-slate-400">Bu Katmandaki Model:</div>
                <div className="text-sm font-bold text-amber-700 dark:text-amber-300 font-mono">
                  RegisterViewModel / UserProfileVM
                </div>
              </div>
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex items-center justify-center gap-2 py-1 text-xs text-slate-400 dark:text-slate-500">
            <ArrowDown className="w-4 h-4 text-slate-400" />
            <span>HTTP POST / JSON Body (Request DTO)</span>
            <ArrowUp className="w-4 h-4 text-slate-400" />
          </div>

          {/* Layer 2: API & Application Service Layer */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              activeHighlight === 'dto' || activeHighlight === 'all'
                ? 'bg-blue-50/50 dark:bg-blue-950/20 border-blue-300 dark:border-blue-700 ring-2 ring-blue-400/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-blue-700 dark:text-blue-400 uppercase tracking-wide">
                    <span>Katman 2</span>
                    <span aria-hidden="true">·</span>
                    <span>Application / API & Service Layer</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    API Denetleyicileri & Uygulama Servisleri (Controllers, Handlers)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                    İstemciden gelen payload <strong className="text-blue-800 dark:text-blue-300">Request DTO</strong> ile karşılanır. Validasyondan geçirilir. AutoMapper / Mapster vasıtasıyla Entity’ye dönüştürülür. Yanıt dönerken de <strong className="text-blue-800 dark:text-blue-300">Response DTO</strong> kullanılır.
                  </p>
                </div>
              </div>

              {/* Model Tag */}
              <div className="bg-white dark:bg-slate-800 border border-blue-300 dark:border-blue-600/50 px-4 py-2 rounded-xl text-left md:text-right shrink-0">
                <div className="text-xs text-slate-500 dark:text-slate-400">Bu Katmandaki Model:</div>
                <div className="text-sm font-bold text-blue-700 dark:text-blue-300 font-mono">
                  CreateUserDto / UserResponseDto
                </div>
              </div>
            </div>
          </div>

          {/* Flow Connector Arrow */}
          <div className="flex items-center justify-center gap-2 py-1 text-xs text-slate-400 dark:text-slate-500">
            <ArrowDown className="w-4 h-4 text-slate-400" />
            <span>Mapping (DTO ➔ Entity) & Şifre Hashleme</span>
            <ArrowUp className="w-4 h-4 text-slate-400" />
          </div>

          {/* Layer 3: Domain & Data Access Layer */}
          <div
            className={`p-6 rounded-2xl border transition-all ${
              activeHighlight === 'entity' || activeHighlight === 'all'
                ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-700 ring-2 ring-emerald-400/20'
                : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 opacity-60'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wide">
                    <span>Katman 3</span>
                    <span aria-hidden="true">·</span>
                    <span>Domain & Persistence (Veritabanı)</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    İş Kuralları & Veritabanı Tabloları (EF Core, PostgreSQL, SQL Server)
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-1 max-w-2xl">
                    Veritabanı tablolarının, yabancı anahtarların (Foreign Key), şifre hashlerinin ve domain kurallarının yaşadığı çekirdektir. Bu katmandaki <strong className="text-emerald-800 dark:text-emerald-300">Entity</strong> nesnesi dış dünyaya hiçbir zaman doğrudan sergilenemez!
                  </p>
                </div>
              </div>

              {/* Model Tag */}
              <div className="bg-white dark:bg-slate-800 border border-emerald-300 dark:border-emerald-600/50 px-4 py-2 rounded-xl text-left md:text-right shrink-0">
                <div className="text-xs text-slate-500 dark:text-slate-400">Bu Katmandaki Model:</div>
                <div className="text-sm font-bold text-emerald-700 dark:text-emerald-300 font-mono">
                  User (Domain Entity)
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
