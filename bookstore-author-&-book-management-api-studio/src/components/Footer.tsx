import React from 'react';
import { Award, BookOpen, CheckCircle, Code, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-16 border-t border-slate-200 bg-white text-slate-600 text-xs py-8">
      <div className="max-w-7xl mx-auto px-4 space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-slate-900 text-sm">BookStore Web API Project</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  Tamamlandı (7/7)
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Author Controller, Servisler, DTO, AutoMapper &amp; FluentValidation Ödevi
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap justify-center">
            <span className="text-[11px] text-slate-500">Geliştirici &amp; Proje Sahibi:</span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 text-indigo-200 font-bold tracking-wide text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Enes Öztürk
            </span>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Entity - DTO İzolasyonu
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              AutoMapper Profili
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              FluentValidation Doğrulama
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
              Anlamlı Hata &amp; İş Kuralları
            </span>
          </div>

          <div>
            <span>&copy; {new Date().getFullYear()} Enes Öztürk | .NET Backend API</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
