import React from 'react';
import { Heart, ShieldCheck, Code2, Sparkles, Terminal } from 'lucide-react';

export const SignatureFooter: React.FC = () => {
  return (
    <footer className="bg-slate-950 border-t border-slate-900 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-10 border-b border-slate-900">
          {/* Handcrafted Signature */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-amber-500 font-bold text-sm tracking-wide uppercase">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>El Emeği & Özel Tasarım</span>
            </div>
            <h4 className="text-base font-semibold text-white tracking-tight">
              ENES ÖZTÜRK İmzalı Patika Klonu
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bu platform Patika.dev mimarisi ve eğitim süreçleri referans alınarak, rol bazlı erişim kontrolü (Öğrenci, Eğitmen, Operatör), interaktif quiz ve ders içerik yönetimi ile titizlikle geliştirilmiştir.
            </p>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-md text-[11px] text-amber-300 font-mono">
              <Terminal className="w-3.5 h-3.5 text-amber-400" />
              Geliştirici & Operatör: Enes Öztürk
            </div>
          </div>

          {/* System Rules & Security */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Yetkilendirme Mimarisi
            </h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-emerald-400 font-bold">✓</span>
                <span><strong>Operatörler:</strong> Sistem geliştiricisi (Enes Öztürk) tarafından eklenir. Tüm patika, ders, içerik ve eğitmenleri yönetir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-sky-400 font-bold">✓</span>
                <span><strong>Eğitmenler:</strong> Yalnızca Operatörler tarafından sisteme eklenir ve derslere atanır. Sadece kendi ders içeriklerini yönetebilir.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">✓</span>
                <span><strong>Öğrenciler:</strong> Giriş ekranından doğrudan kayıt olabilir, patikalara erişip derslere kaydolabilir.</span>
              </li>
            </ul>
          </div>

          {/* Technology & Framework */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Code2 className="w-4 h-4 text-amber-400" />
              Teknoloji Altyapısı
            </h4>
            <div className="text-xs text-slate-400 space-y-1.5">
              <p>React 19 · TypeScript · Tailwind CSS v4 · Motion</p>
              <p>İçerik filtreleme, YouTube video linki ve quiz değerlendirme motoru.</p>
              <p className="text-[11px] text-slate-400 pt-2">
                Referans: Patika.dev Java 102 ve Modern Web Mimarisi
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span>© 2026 Patika Klonu. Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-current inline" />
            <span>by <strong>Enes Öztürk</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[11px] text-slate-400">
            <span>Veri Güvenliği & RBAC</span>
            <span aria-hidden="true">·</span>
            <span>Öğrenci & Eğitmen Paneli</span>
            <span aria-hidden="true">·</span>
            <span>Quiz & İçerik Yönetimi</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
