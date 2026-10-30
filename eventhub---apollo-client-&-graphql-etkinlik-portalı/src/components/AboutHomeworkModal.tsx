import React from 'react';
import {
  X,
  CheckCircle2,
  Layers,
  Code2,
  Database,
  UserCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface AboutHomeworkModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutHomeworkModal: React.FC<AboutHomeworkModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between border-b border-slate-800">
          <div>
            <div className="text-[11px] font-semibold text-indigo-400 tracking-wider">
              PROJE RAPORU & DEĞERLENDİRME
            </div>
            <h2 className="text-sm font-bold text-white">
              Ödev 4 — Apollo Client & React Entegrasyonu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-sm text-slate-700 leading-relaxed">
          {/* Signature badge */}
          <div className="bg-indigo-50/70 border border-indigo-100 rounded-xl p-4 flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center shrink-0">
              EÖ
            </div>
            <div>
              <div className="text-xs font-bold text-indigo-900">
                Geliştirici & Proje Sahibi
              </div>
              <div className="text-base font-extrabold text-slate-900">
                Enes Öztürk
              </div>
              <div className="text-xs text-slate-500">
                Patika.dev / Kodluyoruz Fullstack GraphQL Eğitimi
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Gereksinimlerin Karşılanma Durumu</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>1. React & Apollo Client Kurulumu</span>
                  <span className="text-emerald-700 font-semibold font-mono">TAMAMLANDI</span>
                </div>
                <p className="text-slate-600">
                  <code className="text-indigo-600 font-mono">@apollo/client</code> ve <code className="text-indigo-600 font-mono">graphql</code> kütüphaneleri kuruldu. <code className="text-indigo-600 font-mono">ApolloProvider</code> bileşeni ve <code className="text-indigo-600 font-mono">InMemoryCache</code> ile tüm uygulama seviyesinde aktif hale getirildi.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>2. Anasayfada Etkinlik Listesi (Adı, Açıklaması ve Zamanı)</span>
                  <span className="text-emerald-700 font-semibold font-mono">TAMAMLANDI</span>
                </div>
                <p className="text-slate-600">
                  <code className="text-indigo-600 font-mono">useQuery(GET_EVENTS)</code> hook&apos;u ile etkinliklerin adı (<code className="font-mono">title</code>), açıklaması (<code className="font-mono">desc</code>) ve zamanı (<code className="font-mono">date</code>, <code className="font-mono">from</code>, <code className="font-mono">to</code>) anasayfa kartlarında listelenmiştir.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>3. Etkinlik Detayı (Sahibi, Konum ve Katılımcılar)</span>
                  <span className="text-emerald-700 font-semibold font-mono">TAMAMLANDI</span>
                </div>
                <p className="text-slate-600">
                  Herhangi bir etkinliğin detayına gidildiğinde <code className="text-indigo-600 font-mono">useQuery(GET_EVENT, &#123; variables: &#123; id &#125; &#125;)</code> çalıştırılır. Etkinlik sahibi kullanıcı (<code className="font-mono">user</code>: username, email, role), konumu (<code className="font-mono">location</code>: name, desc, lat, lng) ve katılımcılar (<code className="font-mono">participants</code>) eksiksiz olarak sunulur.
                </p>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <div className="font-bold text-slate-900 mb-1 flex items-center justify-between">
                  <span>4. Etkileşimli Ekstra Özellikler & Konsol</span>
                  <span className="text-emerald-700 font-semibold font-mono">TAMAMLANDI</span>
                </div>
                <p className="text-slate-600">
                  Yeni etkinlik oluşturma mutasyonu (<code className="font-mono">addEvent</code>), etkinliğe katılma mutasyonu (<code className="font-mono">addParticipant</code>), Apollo Cache denetleyici ve GraphQL sorgu geçmişini canlı izleme paneli eklenmiştir.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t border-slate-200 pt-4 text-xs text-slate-500">
            <p>
              Bu uygulama <span className="font-semibold text-slate-700">Enes Öztürk</span> tarafından Patika.dev & Kodluyoruz GraphQL eğitimi 4. ödevi için titizlikle kodlanmıştır.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
          >
            Anladım, Uygulamayı İncele
          </button>
        </div>
      </div>
    </div>
  );
};
