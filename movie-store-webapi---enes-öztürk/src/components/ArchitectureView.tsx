/**
 * Architecture & ER Diagram View
 * Author: Enes Öztürk
 * Explains Clean Architecture, DI Container, AutoMapper, FluentValidation, and Relational Data Consistency.
 */

import React from 'react';
import {
  Layers,
  Database,
  ShieldCheck,
  Cpu,
  GitBranch,
  ArrowRight,
  Boxes,
  FileCode,
  CheckCircle2,
} from 'lucide-react';

export const ArchitectureView: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 text-xs font-semibold mb-2">
          <Layers className="w-3.5 h-3.5" />
          <span>Kurumsal Tasarım Prensipleri</span>
        </div>
        <h2 className="text-xl font-bold text-white">Movie Store WebApi - Mimari ve Tasarım Belgesi</h2>
        <p className="text-xs text-slate-400 mt-1 max-w-3xl">
          Bu uygulama Clean Architecture prensiplerine uygun olarak; katmanlar arası tam gevşek bağlılık (loose-coupling),
          bağımlılık enjeksiyonu (DI Container), FluentValidation, AutoMapper DTO izolasyonu ve ilişkisel veri tutarlılığı kuralları ile inşa edilmiştir.
        </p>
      </div>

      {/* Layer Flow Visualizer */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-sm font-bold text-white flex items-center gap-2">
          <GitBranch className="w-4 h-4 text-cyan-400" />
          Katmanlı İstek Akışı (Request Lifecycle)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <span className="text-[10px] uppercase font-bold text-slate-500 block">1. Katman</span>
            <div className="text-xs font-bold text-white mt-1">Middleware & HTTP</div>
            <p className="text-[11px] text-slate-400 mt-1">
              `requestResponseLogger`, `customerAuthGuard` ve merkezi `errorHandlingMiddleware`
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <span className="text-[10px] uppercase font-bold text-indigo-400 block">2. Katman</span>
            <div className="text-xs font-bold text-white mt-1">Controller</div>
            <p className="text-[11px] text-slate-400 mt-1">
              İş kuralı içermez. Sadece girdi alır ve DI ile enjekte edilen servise devreder.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <span className="text-[10px] uppercase font-bold text-amber-400 block">3. Katman</span>
            <div className="text-xs font-bold text-white mt-1">FluentValidation</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Her DTO için katı doğrulama kuralları. Başarısızlık anında `ValidationException` fırlatır.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <span className="text-[10px] uppercase font-bold text-emerald-400 block">4. Katman</span>
            <div className="text-xs font-bold text-white mt-1">Domain Service</div>
            <p className="text-[11px] text-slate-400 mt-1">
              İş kuralları, veri tutarlılığı kontrolleri, soft-delete ve sipariş snapshot yönetimi.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 relative">
            <span className="text-[10px] uppercase font-bold text-rose-400 block">5. Katman</span>
            <div className="text-xs font-bold text-white mt-1">AutoMapper & Data</div>
            <p className="text-[11px] text-slate-400 mt-1">
              Entity nesneleri dışarı sızdırılmaz. DTO nesnelerine güvenli çift yönlü dönüşüm.
            </p>
          </div>
        </div>
      </div>

      {/* Relational Entity Diagrams */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Entities and Schema */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Database className="w-4 h-4 text-rose-400" />
            Varlık İlişki Yapısı (Entity-Relationship)
          </h3>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-rose-300">🎬 Movie (Film)</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                • <strong>N:1</strong> Director (Yönetmen) ile ilişkilidir.<br />
                • <strong>M:N</strong> Actor (Oyuncular) ile çoktan-çoğa ilişkilidir.<br />
                • <strong>N:1</strong> Genre (Film Türü) ile ilişkilidir.<br />
                • <strong>isActive</strong> bayrağı ile Soft-Delete destekler.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-indigo-300">🎭 Actor & Director (Oyuncu ve Yönetmen)</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                • İki ayrı bağımsız yapıdır (Bir kişi her ikisi de olabilir fakat veri modelleri ayrıdır).<br />
                • <strong>Gereksinim 9:</strong> Aktif filmde rol alan oyuncu veya yönettiği filmi olan yönetmen silinemez.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
              <div className="font-semibold text-emerald-300">👤 Customer (Müşteri) & Order (Siparişlerim)</div>
              <p className="text-slate-400 text-[11px] mt-0.5">
                • Müşteri birden fazla favori film türüne sahip olabilir.<br />
                • Sipariş oluşturulduğu an film fiyatı ve başlığı <strong>snapshot</strong> olarak kilitlenir.<br />
                • Film silinse veya pasife alınsa dahi müşteri sipariş verisi bozulmaz.
              </p>
            </div>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            Teknik ve Güvenlik Güvenceleri
          </h3>

          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Merkezi Loglama:</strong> Loglama altyapısı `ILoggerService` arkasında soyutlanmıştır. Kod içerisine yayılmamıştır; konsola istek/yanıt/hata logları yazar.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Katı Yetkilendirme:</strong> `customerAuthGuard` ile satın alma (`POST /api/orders`) ve müşteri siparişleri sadece aktif Customer rolüne sahip kullanıcılara açıktır.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>DI Container:</strong> Bağımlılıklar `DIContainer` ile tek merkezden yönetilir; mock servisler ile test edilebilir.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>
                <strong>Birim Testleri (100%):</strong> Test suite, validatorlar, automapper, veri tutarlılığı ve soft-delete senaryolarını hatasız doğrular.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
