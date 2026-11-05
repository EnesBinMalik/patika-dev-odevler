import React from 'react';
import { Database, ArrowLeftRight, LayoutTemplate, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface HeroBannerProps {
  onStartSimulation: () => void;
  onExploreConcepts: () => void;
  onOpenReport: () => void;
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  onStartSimulation,
  onExploreConcepts,
  onOpenReport,
}) => {
  return (
    <section id="hero" className="pt-8 pb-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Unboxed Metadata Header (Zero-Pill Discipline) */}
        <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400 mb-4">
          <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Ödev Çözümü</span>
          <span aria-hidden="true">·</span>
          <span>Yazılım Mimarisi & Model Kullanımı</span>
          <span aria-hidden="true">·</span>
          <span className="text-slate-900 dark:text-slate-200 font-semibold">Hazırlayan: Enes Öztürk</span>
          <span aria-hidden="true">·</span>
          <span>Kasım 2026</span>
        </div>

        {/* Main Title & Lead */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
          <div className="lg:col-span-8">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-tight mb-4 [text-wrap:balance]">
              Model Kullanımı: Entity, ViewModel ve DTO Kavramları
            </h1>
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-3xl">
              Modern kurumsal yazılımlarda veritabanı bütünlüğünü korumak, güvenlik açıklarını önlemek (Mass Assignment) ve temiz kullanıcı deneyimi sunmak için modellerin doğru katmanlarda ayrıştırılması gerekir. Bu ödev çalışmasında üç model türünün rolleri, dönüşüm mekanizmaları ve kod örnekleri eksiksiz incelenmiştir.
            </p>
          </div>

          {/* Author Badge Card */}
          <div className="lg:col-span-4 bg-slate-50 dark:bg-slate-800/80 rounded-xl p-5 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
                EÖ
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">Enes Öztürk</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Yazılım Geliştirici & Sistem Mimarı</div>
              </div>
            </div>
            <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Ödev Niteliği:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Kapsamlı Çözüm Raporu</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Mimari Kapsam:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-200">Clean / Tiered Architecture</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Desteklenen Diller:</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">C# .NET, TS/Nest, Java</span>
              </div>
            </div>
          </div>
        </div>

        {/* 3 Core Conceptual Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {/* Entity Pillar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-emerald-500/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-2 text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase tracking-wider">
                <Database className="w-4 h-4" />
                <span>Domain & Veritabanı</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                Entity (Varlık)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Veritabanı tablosunun doğrudan yansımasıdır. Kimlik (Id), ilişkiler ve veri bütünlüğü kurallarını yönetir. Doğrudan dış dünyaya <strong className="text-slate-900 dark:text-white">asla açılmaz</strong>.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Veritabanı Tablosu · Primary Key · Navigation</span>
            </div>
          </div>

          {/* DTO Pillar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-blue-500/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-2 text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase tracking-wider">
                <ArrowLeftRight className="w-4 h-4" />
                <span>İletişim & API</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                DTO (Veri Taşıyıcı)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Katmanlar ve istemci-sunucu arasında yalnızca gerekli alanları taşıyan hafif (anemic) nesnedir. Ağ trafiğini optimize eder ve güvenlik kalkanı sağlar.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>JSON Serileştirme · Request/Response · Ağ Yükü</span>
            </div>
          </div>

          {/* ViewModel Pillar */}
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-xl p-5 border border-slate-200 dark:border-slate-700/80 flex flex-col justify-between hover:border-amber-500/50 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-2 text-amber-600 dark:text-amber-400 text-xs font-semibold uppercase tracking-wider">
                <LayoutTemplate className="w-4 h-4" />
                <span>Arayüz & Sunum</span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1.5">
                ViewModel (Sunum Modeli)
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
                Kullanıcı arayüzünün (View) render edilmesi için biçimlendirilmiş, dropdown listeleri, şifre teyidi ve form hata mesajlarını barındıran ekrana özel modeldir.
              </p>
            </div>
            <div className="pt-3 border-t border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              <span>UI Formatlama · Dropdownlar · Form Doğrulama</span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={onStartSimulation}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-lg shadow-sm transition-colors whitespace-nowrap shrink-0 cursor-pointer flex items-center gap-2"
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Canlı Veri Akış Simülatörünü Aç</span>
          </button>

          <button
            onClick={onExploreConcepts}
            className="px-5 py-2.5 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-600 text-sm font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            Kavramları & Karşılaştırmayı İncele
          </button>

          <button
            onClick={onOpenReport}
            className="px-5 py-2.5 bg-slate-100 dark:bg-slate-800/80 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
          >
            İmzalı Ödev Çıktısını Görüntüle
          </button>
        </div>
      </div>
    </section>
  );
};
