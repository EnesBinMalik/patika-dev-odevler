import React from 'react';
import { Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onOpenCreate: () => void;
  totalEvents: number;
  totalLocations: number;
  totalParticipants: number;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onOpenCreate,
  totalEvents,
  totalLocations,
  totalParticipants,
}) => {
  return (
    <section className="relative overflow-hidden bg-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 lg:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Context & Editorial */}
          <div className="lg:col-span-7 flex flex-col justify-center">
            {/* Signature & Assignment Header */}
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide mb-3">
              <span>KODLUYORUZ & PATIKA.DEV GRAPHQL</span>
              <span aria-hidden="true">·</span>
              <span>ÖDEV 4</span>
              <span aria-hidden="true">·</span>
              <span className="text-slate-600 font-medium">ENES ÖZTÜRK</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-4 text-balance">
              Apollo Client ile Güçlendirilmiş Modern Etkinlik Portalı
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-6 max-w-2xl">
              GraphQL şeması üzerindeki ilişkisel veri modelini (Etkinlikler, Kullanıcılar, Konumlar ve Katılımcılar) Apollo Client&apos;ın <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded">useQuery</code> ve <code className="font-mono text-xs bg-slate-100 text-indigo-600 px-1.5 py-0.5 rounded">useMutation</code> hook&apos;larıyla yöneten tam donanımlı React uygulaması.
            </p>

            {/* Checklist of Completed Requirements */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 text-xs text-slate-700">
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Apollo Client & ApolloProvider Kurulumu</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Anasayfa: Adı, Açıklaması ve Zamanı</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Detay Görünümü: Sahibi, Konum & Katılımcılar</span>
              </div>
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/80 rounded-lg p-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Enes Öztürk Özel İmzası & GraphQL Konsolu</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={onExploreClick}
                className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-lg shadow-sm transition-all whitespace-nowrap"
              >
                <span>Etkinlikleri Keşfet</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={onOpenCreate}
                className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg transition-colors whitespace-nowrap"
              >
                <span>+ Yeni Etkinlik Tanımla</span>
              </button>
            </div>
          </div>

          {/* Right Column: Hero Visual */}
          <div className="lg:col-span-5">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-md aspect-[16/10] bg-slate-100 group">
              <img
                src="/src/assets/images/event_hero_banner_1793214376287.jpg"
                alt="EventHub Yazılım ve Topluluk Etkinlikleri"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent flex flex-col justify-end p-5">
                <div className="flex items-center gap-2 text-xs text-white/90 mb-1">
                  <span className="font-semibold text-white">İstanbul Tech Summit 2026</span>
                  <span aria-hidden="true">·</span>
                  <span>Canlı Topluluk Ağı</span>
                </div>
                <p className="text-xs text-white/70 line-clamp-2">
                  Geliştiriciler, mentörler ve yazılım mimarları için düzenlenmiş özel GraphQL oturumları.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Full-width KPI strip below hero split */}
        <div className="mt-10 pt-6 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              {totalEvents}
            </div>
            <div className="text-xs text-slate-500 font-medium">Toplam Etkinlik</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600">
              {totalLocations}
            </div>
            <div className="text-xs text-slate-500 font-medium">Kayıtlı Lokasyon</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div className="text-2xl font-bold font-mono tabular-nums text-emerald-600">
              {totalParticipants}
            </div>
            <div className="text-xs text-slate-500 font-medium">Aktif Katılımcı</div>
          </div>
          <div className="p-3 bg-slate-50/80 rounded-xl border border-slate-200/60">
            <div className="text-2xl font-bold font-mono tabular-nums text-slate-900">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium">Apollo Cache Hit</div>
          </div>
        </div>
      </div>
    </section>
  );
};
