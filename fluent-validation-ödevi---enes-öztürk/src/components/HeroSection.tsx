import React from 'react';
import { Shield, CheckCircle, Code, ArrowRight, Sparkles, Layers, Terminal } from 'lucide-react';

interface HeroSectionProps {
  onExplorePlayground: () => void;
  onExploreCode: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExplorePlayground,
  onExploreCode,
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-slate-50 via-white to-slate-50 dark:from-slate-900/40 dark:via-slate-900/20 dark:to-slate-950 border-b border-slate-200/80 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Column: Context & Overview */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Context Meta Kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 dark:text-indigo-400">
              <span className="uppercase tracking-wider">.NET Core Web API</span>
              <span aria-hidden="true">·</span>
              <span>FluentValidation v11+</span>
              <span aria-hidden="true">·</span>
              <span>Ödev Teslim Projesi</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]" style={{ textWrap: 'balance' }}>
              Update, Delete ve GetById Doğrulama Sınıfları ve Controller Entegrasyonu
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
              Bu ödev projesinde, <strong>FluentValidation</strong> kütüphanesi kullanılarak <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Update</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Delete</code> ve <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded text-indigo-600 dark:text-indigo-400">GetById</code> metotları için doğrulama sınıfları tasarlanmış; Controller içerisinde servis ve iş mantığı metot çağrımlarından <strong>önce</strong> validasyon kuralları çalıştırılarak güvenlik ve veri bütünlüğü garanti altına alınmıştır.
            </p>

            {/* Key Assignment Requirements Checklist */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">01. Update Sınıfı</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">UpdateProductDtoValidator</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Id, Ad, Fiyat, Stok, Kategori</div>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">02. Delete Sınıfı</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">DeleteProductValidator</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Id, Gerekçe, Kullanıcı & Onay</div>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 shadow-xs">
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">03. GetById Sınıfı</div>
                <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">GetProductByIdValidator</div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Id pozitif tamsayı denetimi</div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={onExplorePlayground}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm transition-all flex items-center gap-2 group"
              >
                <span>Canlı Doğrulama Simülatörü</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onExploreCode}
                className="px-5 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/80 border border-slate-300 dark:border-slate-700 rounded-lg transition-colors flex items-center gap-2"
              >
                <Code className="w-4 h-4 text-indigo-500" />
                <span>C# Kodlarını İncele</span>
              </button>
            </div>

          </div>

          {/* Right Column: Signed Homework Dossier Card */}
          <div className="lg:col-span-5">
            <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 dark:bg-indigo-500/15 rounded-full blur-2xl pointer-events-none" />
              
              {/* Card Header with Formal Signature */}
              <div className="flex items-start justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                    Ödev Teslim Belgesi
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
                    Fluent Validation Raporu
                  </div>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 text-emerald-700 dark:text-emerald-400 text-xs font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Tamamlandı</span>
                </div>
              </div>

              {/* Student Identification & Author Signature */}
              <div className="py-4 space-y-3">
                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Hazırlayan Öğrenci:</span>
                  <span className="font-bold text-slate-900 dark:text-white text-base">Enes Öztürk</span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">İmza Doğrulama:</span>
                  <span className="font-mono text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                    <Shield className="w-3.5 h-3.5" />
                    <span>enes-ozturk-verified</span>
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Hedef Çatı:</span>
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    .NET 8.0 / 9.0 Web API
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Kütüphane:</span>
                  <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded text-slate-700 dark:text-slate-300">
                    FluentValidation 11.9+
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs sm:text-sm">
                  <span className="text-slate-500 dark:text-slate-400">Çalışma Prensibi:</span>
                  <span className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">
                    Pre-Execution (Önceden Çalıştırma)
                  </span>
                </div>
              </div>

              {/* Mini Code Snippet Preview */}
              <div className="mt-2 p-3 rounded-lg bg-slate-950 text-slate-200 font-mono text-[11px] leading-relaxed border border-slate-800">
                <div className="text-slate-500 text-[10px] mb-1">// Controller İçi Ön Kontrol:</div>
                <div className="text-emerald-400">var result = await _validator.ValidateAsync(dto);</div>
                <div className="text-amber-300">if (!result.IsValid)</div>
                <div className="text-rose-400 pl-3">return BadRequest(result.Errors);</div>
                <div className="text-sky-300 pl-0">// Validasyon geçtiyse servis çağrılır:</div>
                <div className="text-indigo-300">await _productService.UpdateAsync(dto);</div>
              </div>

              {/* Signature Stamp */}
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
                <span>Resmi Ödev Teslimi</span>
                <span className="font-serif italic text-slate-700 dark:text-slate-300 font-medium">İmza: Enes Öztürk</span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
