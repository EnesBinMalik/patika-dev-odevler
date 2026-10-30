import React from 'react';
import { X, CheckCircle2, Radio, Users, Sparkles, Code2, ShieldCheck } from 'lucide-react';

interface AssignmentInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentInfoModal: React.FC<AssignmentInfoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl p-6 md:p-8 max-h-[90vh] overflow-y-auto text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                Ödev 5 Teslim Projesi
              </span>
              <span className="text-xs font-medium text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Tüm Gereksinimler Tamamlandı
              </span>
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mt-1">
              Gerçek Zamanlı Etkinlik ve Katılımcı Takip Sistemi
            </h2>
          </div>
        </div>

        {/* Creator signature highlight */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-indigo-950/70 via-slate-800/60 to-purple-950/50 border border-indigo-500/30 flex items-center justify-between">
          <div>
            <div className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">Geliştirici & İmza</div>
            <div className="text-lg font-bold text-white flex items-center gap-2">
              Enes Öztürk
              <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Ödev 5 Sahibi
              </span>
            </div>
            <div className="text-xs text-slate-400 mt-0.5">E-posta: enesbino38@gmail.com</div>
          </div>
          <div className="w-12 h-12 rounded-full bg-indigo-600/30 border border-indigo-400/30 flex items-center justify-center text-indigo-300 font-bold text-lg">
            EÖ
          </div>
        </div>

        {/* Requirements status */}
        <div className="space-y-4 mb-6">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400">
            Ödev Gereksinimleri ve Gerçekleştirim
          </h3>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  1. Etkinlik listesini gerçek zamanlı çalışacak şekilde görüntüleyiniz
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Herhangi bir kullanıcı ya da açık sekme yeni bir etkinlik eklediğinde, sayfa yenilenmesine gerek kalmadan WebSocket ve BroadcastChannel üzerinden tüm istemcilerde anında listeye düşer ve sayaç güncellenir.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  2. Etkinliğe yeni bir katılımcı eklendiğinde, detay ekranında gerçek zamanlı görüntüleme
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Herhangi bir katılımcı kaydolduğunda veya eklendiğinde, etkinliğin detay sayfasında olan tüm kullanıcılar anında yeni katılımcıyı yeşil vurgulama animasyonu ve sesli bildirim eşliğinde liste başında görür.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">
                  3. Enes Öztürk İmzası ile Teslim
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  Uygulamanın başlığında, üst çubuğunda, organizatör alanlarında, alt bilgisinde (footer) ve aktivite akışında &quot;Enes Öztürk&quot; imzası belirgin biçimde yer almaktadır.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs mb-6">
          <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex items-center gap-2">
            <Code2 className="w-4 h-4 text-indigo-400" />
            <span className="text-slate-300">Node.js + Express WebSocket Engine</span>
          </div>
          <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400" />
            <span className="text-slate-300">Bi-directional WS + BroadcastChannel</span>
          </div>
          <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-slate-300">Çift Ekran Simülatörü (Canlı Test)</span>
          </div>
          <div className="p-3 bg-slate-800/40 border border-slate-700/50 rounded-lg flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-slate-300">Web Audio API Gerçek Zamanlı Chime</span>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition cursor-pointer"
          >
            Anladım, Uygulamayı İncele
          </button>
        </div>
      </div>
    </div>
  );
};
