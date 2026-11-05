import React, { useState } from 'react';
import { ArrowRight, Check, X, ShieldAlert, ShieldCheck, Database, Globe, Key, AlertTriangle, Layers } from 'lucide-react';

export const ArchitectureFlow: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'correct' | 'wrong'>('correct');

  return (
    <section id="modeller" className="py-14 bg-slate-50 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200 mb-3">
            <Layers className="w-3.5 h-3.5" />
            Mimari Tasarım Deseni (Separation of Concerns)
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Neden Entity Input/Output Olarak Kullanılamaz?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600">
            Entity sınıfları veritabanı tablolarının doğrudan C# karşılığıdır. Dış dünyaya açıldıklarında
            ciddi güvenlik zafiyetlerine, over-posting saldırılarına ve mimari kırılganlıklara yol açarlar.
          </p>
        </div>

        {/* Tab Selector */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-slate-200/80 rounded-xl">
            <button
              onClick={() => setActiveTab('correct')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'correct'
                  ? 'bg-white text-emerald-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Check className="w-4 h-4 text-emerald-600" />
              Doğru Mimari: Model / DTO & AutoMapper (Ödev Çözümü)
            </button>
            <button
              onClick={() => setActiveTab('wrong')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-all ${
                activeTab === 'wrong'
                  ? 'bg-white text-rose-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <X className="w-4 h-4 text-rose-600" />
              Yasaklı Mimari: Doğrudan Entity Kullanımı (Anti-Pattern)
            </button>
          </div>
        </div>

        {/* Dynamic Architecture Display */}
        {activeTab === 'correct' ? (
          <div className="bg-white rounded-2xl border border-emerald-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-emerald-100 pb-4 mb-6">
              <div className="flex items-center gap-2 text-emerald-800 font-semibold text-sm">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
                Güvenli & Temiz Akış (Enes Öztürk Uygulaması)
              </div>
              <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                Encapsulation: %100 Sağlandı
              </span>
            </div>

            {/* Visual Step-by-Step Pipeline */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
              {/* Step 1: Client */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-center">
                <Globe className="w-6 h-6 text-slate-700 mx-auto mb-2" />
                <div className="text-xs font-bold text-slate-900 uppercase">1. İstemci (Client)</div>
                <div className="text-[11px] text-slate-500 mt-1">HTTP PUT / GET</div>
                <div className="mt-2 text-[10px] font-mono bg-white p-1 rounded border border-slate-200 text-slate-700">
                  UpdateBookModel JSON
                </div>
              </div>

              <div className="hidden md:flex justify-center text-emerald-500">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Step 2: Controller & Validator */}
              <div className="p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 text-center">
                <Layers className="w-6 h-6 text-indigo-600 mx-auto mb-2" />
                <div className="text-xs font-bold text-indigo-900 uppercase">2. Model & Validator</div>
                <div className="text-[11px] text-indigo-700 mt-1">FluentValidation</div>
                <div className="mt-2 text-[10px] font-mono bg-white p-1 rounded border border-indigo-200 text-indigo-900">
                  Sadece izinli alanlar!
                </div>
              </div>

              <div className="hidden md:flex justify-center text-emerald-500">
                <ArrowRight className="w-6 h-6 animate-pulse" />
              </div>

              {/* Step 3: Entity in DbContext */}
              <div className="p-4 rounded-xl border border-emerald-300 bg-emerald-50/50 text-center relative">
                <Database className="w-6 h-6 text-emerald-700 mx-auto mb-2" />
                <div className="text-xs font-bold text-emerald-950 uppercase">3. Entity (Veritabanı)</div>
                <div className="text-[11px] text-emerald-800 mt-1">Book.cs (Korumalı)</div>
                <div className="mt-2 text-[10px] font-mono bg-emerald-100/80 p-1 rounded border border-emerald-300 text-emerald-900 font-semibold">
                  Dışarı ASLA sızmaz
                </div>
              </div>
            </div>

            {/* Return Step */}
            <div className="mt-6 pt-6 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-50/60 p-4 rounded-xl">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                  ✓
                </span>
                <div>
                  <div className="text-xs font-bold text-slate-900">
                    Dönüş Katmanı (Output): BookDetailViewModel & UpdateBookViewModel
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    AutoMapper vasıtasıyla veritabanı Entity'sinden sadece gerekli ve formatlanmış alanlar süzülerek istemciye yansıtılır.
                  </p>
                </div>
              </div>
              <div className="text-xs font-mono text-slate-700 bg-white px-3 py-1.5 rounded-lg border border-slate-200">
                Response: <span className="text-emerald-600 font-bold">ViewModel</span> (Entity = 0%)
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-rose-200 p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between border-b border-rose-100 pb-4 mb-6">
              <div className="flex items-center gap-2 text-rose-800 font-semibold text-sm">
                <ShieldAlert className="w-5 h-5 text-rose-600" />
                Güvensiz ve Hatalı Akış (Yasaklanan Yöntem)
              </div>
              <span className="text-xs font-mono text-rose-700 bg-rose-50 px-2.5 py-1 rounded-md border border-rose-200">
                Kritik Güvenlik Açığı: Over-Posting!
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  1. Over-Posting (Mass Assignment)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  İstemci doğrudan <code className="text-rose-700 font-mono">Book</code> entity'sini gönderirse,
                  kötü niyetli bir kullanıcı JSON içine <code className="text-rose-700 font-mono">"Id": 999</code> veya{' '}
                  <code className="text-rose-700 font-mono">"IsDeleted": true</code> ekleyerek yetkisiz verileri ezebilir.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  2. Veri Sızıntısı (Data Exposure)
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  GetById metodu <code className="text-rose-700 font-mono">Book</code> entity'sini döndüğünde;
                  <code className="text-rose-700 font-mono">RowVersion</code>, <code className="text-rose-700 font-mono">InternalBarcode</code>,
                  <code className="text-rose-700 font-mono">CreatedDate</code> gibi DB'ye özel iç dinamikler halka açık hale gelir.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40">
                <div className="flex items-center gap-2 text-rose-900 font-bold text-xs uppercase mb-2">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  3. JSON Circular Reference Hatası
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Entity'ler arasındaki Navigation Property'ler (Örn: <code className="text-rose-700 font-mono">Book.Genre.Books...</code>)
                  JSON serileştiricinin sonsuz döngüye girip uygulamanın çökmesine yol açar.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
