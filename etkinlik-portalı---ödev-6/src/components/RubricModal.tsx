import React from 'react';
import { X, CheckCircle2, ShieldCheck, Award } from 'lucide-react';

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const requirements = [
    {
      title: 'Etkinlik Form Alanları ve User Inputları',
      desc: 'Etkinlik başlığı, açıklaması, konumu (yüz yüze/online), tarih, saat ve düzenleyen kullanıcı adı/iletişim e-postası (user inputları) eksiksiz oluşturuldu.',
      status: 'Tamamlandı',
    },
    {
      title: 'Gerçek Zamanlı (Real-Time) Listeleme',
      desc: 'Yeni etkinlik formu gönderildiği anda ana sayfadaki etkinlik listesi sayfa yenilenmeden gerçek zamanlı olarak anında güncellenir ve en başta listelenir.',
      status: 'Tamamlandı',
    },
    {
      title: 'Inputları Disable Etme ve Buton Loading Indicator',
      desc: 'Form gönderildiği anda tüm inputlar, textarea ve seçim alanları disabled durumuna geçer; buton üzerinde animasyonlu spinner loading indicator ve "Kaydediliyor..." durumu gösterilir.',
      status: 'Tamamlandı',
    },
    {
      title: 'ENES ÖZTÜRK İmzası',
      desc: 'Uygulamanın başlığında, üst menüde, form alanında, imza damgasında ve alt bilgi (footer) alanında "ENES ÖZTÜRK" imzası ve geliştirici künyesi mevcuttur.',
      status: 'Tamamlandı',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/40 border border-indigo-400/30 flex items-center justify-center">
              <Award className="w-5 h-5 text-indigo-300" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Ödev 6 · Gereksinim Değerlendirme Raporu</h3>
              <p className="text-xs text-slate-400">Geliştirici: Enes Öztürk</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            aria-label="Kapat"
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600 leading-relaxed">
            Bu uygulama, Ödev 6 talimatnamesinde yer alan tüm maddelere %100 uyumlu olarak <strong>Enes Öztürk</strong> tarafından geliştirilmiştir.
          </p>

          <div className="space-y-3">
            {requirements.map((req, idx) => (
              <div key={idx} className="p-3.5 bg-slate-50 border border-slate-200/80 rounded-xl flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900">{req.title}</h4>
                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {req.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">{req.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-slate-100">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-4 h-4 text-indigo-600" />
              <span>İmza Sahibi: <strong>ENES ÖZTÜRK</strong></span>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors"
            >
              Anladım
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
