import React from 'react';
import { X, CheckCircle, Code2, Award, Sparkles, FolderTree } from 'lucide-react';

interface DeveloperModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const features = [
    {
      title: 'Bileşen Mimarisi (Component-Based)',
      desc: 'Header, TodoList, TodoItem, Footer ve Info bileşenlerine temiz şekilde ayrıştırıldı.',
    },
    {
      title: 'Çift Tıklama ile Düzenleme (Inline Edit)',
      desc: 'Görevin üzerine çift tıklayarak metin düzenlenebilir, Enter ile kaydedilir, Esc ile iptal edilir.',
    },
    {
      title: 'URL Hash & Filtreleme Senkronizasyonu',
      desc: 'TodoMVC standardına uygun olarak #/, #/active ve #/completed hash rotaları ile birebir uyumludur.',
    },
    {
      title: 'Toplu İşlemler & Durum Yönetimi',
      desc: 'Tümünü Tamamla (Toggle All) ve Tamamlananları Temizle (Clear Completed) eksiksiz çalışmaktadır.',
    },
    {
      title: 'Kalıcı Hafıza (localStorage)',
      desc: 'Tüm görevler, tercihler ve durumlar sayfa yenilense dahi tarayıcıda güvenle saklanır.',
    },
    {
      title: 'İki Farklı Arayüz Modu',
      desc: 'Hem 100% orijinal TodoMVC ödev tasarımı hem de Enes Öztürk Özel Modern Pro Stüdyo modu mevcuttur.',
    },
    {
      title: 'Web Audio Sesleri & Kutlama',
      desc: 'Tüm görevler tamamlandığında konfeti patlar, işlemlerde saf Web Audio API tık sesleri çalar.',
    },
    {
      title: 'Veri Dışa/İçe Aktarma (JSON)',
      desc: 'Görev listesi tek tıkla JSON olarak indirilebilir veya başka bir cihazdan geri yüklenebilir.',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header with Developer signature banner */}
        <div className="bg-slate-900 text-white px-6 py-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 font-black text-lg flex items-center justify-center shadow-md">
              EÖ
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Enes Öztürk</h2>
                <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-md text-[11px] font-medium flex items-center gap-1">
                  <Award className="w-3 h-3" />
                  Geliştirici İmzası
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Patika.dev React Bootcamp · Ödev 2 Projesi
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700">
          {/* Project Summary */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 space-y-2 text-xs leading-relaxed">
            <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Proje Amacı ve Değerlendirme Kriterleri</span>
            </div>
            <p className="text-slate-600">
              Bu proje, Patika.dev React Bootcamp kapsamında verilen <strong>Ödev 2</strong> gereksinimlerini
              en üst düzeyde karşılamak üzere hazırlanmıştır. Orijinal HTML ve CSS şablonu, React 19 ve TypeScript
              standartlarına uygun olarak modüler bileşenlere ayrılmış ve gelişmiş kullanıcı deneyimi özellikleri ile zenginleştirilmiştir.
            </p>
          </div>

          {/* Checklist of Features */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Geliştirilen Özellikler ve Ödev Uyumluluğu
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-white border border-slate-200/90 rounded-xl hover:border-slate-300 transition-colors shadow-2xs"
                >
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-xs font-semibold text-slate-900">
                        {feat.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Architecture Details */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5" />
              Dosya ve Dizin Mimarisi
            </h3>
            <div className="bg-slate-900 text-slate-300 p-3.5 rounded-xl font-mono text-[11px] leading-relaxed overflow-x-auto">
              <div>src/</div>
              <div>├── components/</div>
              <div>│   ├── classic/      <span className="text-slate-500"># Orijinal TodoMVC (Patika Ödev Standardı)</span></div>
              <div>│   │   ├── ClassicHeader.tsx</div>
              <div>│   │   ├── ClassicTodoList.tsx</div>
              <div>│   │   ├── ClassicTodoItem.tsx</div>
              <div>│   │   ├── ClassicFooter.tsx</div>
              <div>│   │   └── ClassicInfo.tsx</div>
              <div>│   ├── modern/       <span className="text-slate-500"># Enes Öztürk Özel Tasarımı</span></div>
              <div>│   └── TopNav.tsx, DeveloperModal.tsx, ShortcutsModal.tsx...</div>
              <div>├── hooks/useTodos.ts <span className="text-slate-500"># Özel Hook ve Durum Yönetimi</span></div>
              <div>└── utils/            <span className="text-slate-500"># Ses (Web Audio) ve localStorage</span></div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs">
          <span className="text-slate-500 font-medium">
            Tasarım & Kodlama: <strong>Enes Öztürk</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
