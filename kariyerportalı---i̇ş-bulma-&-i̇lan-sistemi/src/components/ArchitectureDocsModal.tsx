/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: ArchitectureDocsModal
 * Detailed architectural review of S.O.L.I.D principles, OOP pillars, Clean Code & Enes Öztürk Signature
 */

import React from 'react';
import { X, Award, ShieldCheck, CheckCircle2, Layers, GitBranch, Cpu, Code2, Sparkles } from 'lucide-react';

interface ArchitectureDocsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ArchitectureDocsModal: React.FC<ArchitectureDocsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                Sistem Mimarisi, OOP ve S.O.L.I.D. Uyumluluk Raporu
              </h2>
              <p className="text-xs text-slate-500">
                Geliştirici & Sistem Mimarı: <strong className="text-slate-800 dark:text-slate-200">Enes Öztürk</strong>
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 1. S.O.L.I.D. Principles Grid */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. S.O.L.I.D Prensipleri Nasıl Uygulandı?
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-indigo-600 dark:text-indigo-400">
                <span className="w-5 h-5 rounded-md bg-indigo-100 dark:bg-indigo-950 flex items-center justify-center text-[11px]">S</span>
                <span>Single Responsibility (Tek Sorumluluk)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Her sınıf tek bir sorumluluğa sahiptir. <code>AuthService</code> yalnızca kimlik doğrulama ve 3-denemeli kilitlemeyi; <code>CandidateService</code> aday filtreleme ve özgeçmiş yönetimini; <code>JobService</code> iş ilanı eşleştirmesini yürütür.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-emerald-600 dark:text-emerald-400">
                <span className="w-5 h-5 rounded-md bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-[11px]">O</span>
                <span>Open / Closed Principle (Açık / Kapalı)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                <code>ICandidateFilterStrategy</code> arayüzü sayesinde mevcut kodu değiştirmeden yeni filtre kriterleri (ör. Ehliyet, Yabancı Dil) eklenebilir.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-blue-600 dark:text-blue-400">
                <span className="w-5 h-5 rounded-md bg-blue-100 dark:bg-blue-950 flex items-center justify-center text-[11px]">L</span>
                <span>Liskov Substitution (İkame Edilebilirlik)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Tüm varlıklar (<code>User</code>, <code>CandidateProfile</code>, <code>JobPosting</code>) <code>BaseEntity</code> soyut sınıfından türer ve polimorfik olarak <code>IRepository&lt;T&gt;</code> içinde sorunsuz çalışır.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1">
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <span className="w-5 h-5 rounded-md bg-amber-100 dark:bg-amber-950 flex items-center justify-center text-[11px]">I</span>
                <span>Interface Segregation (Arayüz Ayrımı)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Büyük monolitik arayüzler yerine ince ve odaklanmış arayüzler tanımlandı: <code>IEntity</code>, <code>IRepository&lt;T&gt;</code>, <code>ICandidateFilterStrategy</code>, <code>ILoggerService</code>.
              </p>
            </div>

            <div className="p-3.5 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750 space-y-1 md:col-span-2">
              <div className="flex items-center gap-2 font-bold text-purple-600 dark:text-purple-400">
                <span className="w-5 h-5 rounded-md bg-purple-100 dark:bg-purple-950 flex items-center justify-center text-[11px]">D</span>
                <span>Dependency Inversion (Bağımlılıkların Tersine Çevrilmesi)</span>
              </div>
              <p className="text-slate-600 dark:text-slate-400 leading-relaxed text-[11px]">
                Üst seviye iş mantığı modülleri somut sınıflara değil, soyutlama arayüzlerine güvenir. Repository ve Service katmanı bu sözleşmelere göre haberleşir.
              </p>
            </div>
          </div>
        </div>

        {/* 2. OOP Pillars */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            2. Zorunlu OOP Bileşenleri (Java & Spring Boot Eşdeğeri)
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Interface & Abstract Class
              </span>
              <p className="text-[11px] text-slate-500">
                <code>IEntity</code>, <code>IRepository&lt;T&gt;</code>, <code>BaseEntity</code> abstract superclass ile JPA kalıtımı simüle edildi.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Stream API & Optional&lt;T&gt;
              </span>
              <p className="text-[11px] text-slate-500">
                <code>Stream.of().filter().map().findFirst()</code> zinciri ve null-safe <code>Optional&lt;T&gt;</code> monadı eksiksiz uygulandı.
              </p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-850 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="font-bold text-slate-800 dark:text-slate-200 block mb-1">
                Tip Güvenli Enum'lar
              </span>
              <p className="text-[11px] text-slate-500">
                <code>Role</code>, <code>MilitaryStatus</code>, <code>WorkType</code>, <code>ExperienceLevel</code>, <code>ApplicationStatus</code>, <code>LogLevel</code>.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Design Patterns */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            3. Uygulanan Tasarım Desenleri (Design Patterns)
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-750 rounded-xl overflow-hidden text-xs">
            <div className="p-3 flex items-start gap-3">
              <span className="font-mono font-bold text-indigo-600 shrink-0">Repository Pattern:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                Spring Data JpaRepository mantığıyla veri erişim katmanını iş mantığından izole eder.
              </span>
            </div>
            <div className="p-3 flex items-start gap-3">
              <span className="font-mono font-bold text-emerald-600 shrink-0">Strategy Pattern:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                Aday ve ilan filtreleme kriterlerini (askerlik, 5+ yıl deneyim) dinamik strateji sınıflarıyla birleştirir.
              </span>
            </div>
            <div className="p-3 flex items-start gap-3">
              <span className="font-mono font-bold text-amber-600 shrink-0">Builder Pattern:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                Karmaşık <code>JobPosting</code> nesnelerini akıcı (fluent) API ile güvenli şekilde inşa eder.
              </span>
            </div>
            <div className="p-3 flex items-start gap-3">
              <span className="font-mono font-bold text-purple-600 shrink-0">Factory Pattern:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                <code>UserFactory</code> ile Aday ve Şirket Yetkilisi nesnelerini şifre hashleme ve profil ilişkileriyle tek noktadan üretir.
              </span>
            </div>
            <div className="p-3 flex items-start gap-3">
              <span className="font-mono font-bold text-blue-600 shrink-0">Singleton Pattern:</span>
              <span className="text-slate-600 dark:text-slate-400 text-[11px]">
                <code>DatabaseService</code>, <code>LoggerService</code> ve <code>AuthService</code> uygulamada tekil durum yönetimi sağlar.
              </span>
            </div>
          </div>
        </div>

        {/* Footer Signature */}
        <div className="p-4 bg-slate-900 text-white rounded-xl flex items-center justify-between text-xs">
          <div>
            <span className="text-amber-400 font-bold block">Enes Öztürk İmzalı Kurumsal Proje</span>
            <span className="text-slate-400 text-[11px]">Senior Software Engineer / System Architect</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
