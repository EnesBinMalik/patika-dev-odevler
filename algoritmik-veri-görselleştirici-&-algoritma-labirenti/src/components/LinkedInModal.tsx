import React, { useState } from 'react';
import { X, Copy, Check, Linkedin, Share2, Layers, Cpu, Award } from 'lucide-react';

interface LinkedInModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LinkedInModal: React.FC<LinkedInModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const postText = `🚀 JavaScript ve Veri Yapıları algoritmalarımı pratikleştirmek adına sıfırdan kodladığım interaktif algoritmik simülatör: "Algoritmik Veri Görselleştirici & Algoritma Labirenti" 🎯

Yazılım geliştirme yolculuğumda teorik bilgileri kalıcı hale getirmenin en etkili yolunun interaktif görselleştirme olduğuna inanıyorum. Bu motivasyonla geliştirdiğim projede;

🔹 Dizi (Array): Bellek adresleri (0x1000..), indeks erişim formülü (O(1)), doğrusal ve ikili arama adımları
🔹 Yığıt (Stack - LIFO): Push/Pop simülasyonu, Parantez dengesi algoritması ve JavaScript Call Stack yürütme bağlamı
🔹 Kuyruk (Queue - FIFO): Kuyruk yönetimi, Dairesel kuyruk ve JavaScript Event Loop (Call Stack, Web APIs, Microtask & Task Queue)
🔹 Sıralama Algoritmaları: Bubble, Quick, Selection, Insertion ve Merge Sort için adım adım karşılaştırma & swap sayacı
🔹 Algoritma Labirenti (Maze Solver): BFS (Kuyruk ile en kısa yol) vs DFS (Yığıt ile derinlemesine arama) ve A* algoritmalarıyla canlı labirent çözümü

Tüm animasyonlar ve durum motorları saf JavaScript mantığıyla kurgulandı. Kodları ve zaman karmaşıklıklarını (Big-O) canlı incelemek mümkün!

Geliştirici: Enes Öztürk
Projeyi deneyimlemek ve geri bildirimde bulunmak isterseniz bağlantıdan göz atabilirsiniz 👇

#JavaScript #DataStructures #Algorithms #Frontend #WebDevelopment #SoftwareEngineering #React #CleanCode #ComputerScience`;

  const handleCopy = () => {
    navigator.clipboard.writeText(postText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0A66C2] flex items-center justify-center text-white">
              <Linkedin className="w-4 h-4 fill-white" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">LinkedIn Sunum & Paylaşım Kartı</h2>
              <p className="text-xs text-slate-400">Enes Öztürk · Portfolyo ve Ağ Paylaşımı</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-sm">
          {/* Quote Card */}
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-indigo-200">
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 mb-1">
              <Award className="w-4 h-4" />
              <span>Proje Manifestosu</span>
            </div>
            <p className="italic text-slate-200 text-sm">
              “JavaScript ve Veri Yapıları algoritmalarımı pratikleştirmek adına sıfırdan kodladığım interaktif algoritmik simülatör.”
            </p>
            <div className="mt-2 text-xs text-indigo-400 font-mono">— Enes Öztürk</div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <Layers className="w-4 h-4 text-indigo-400 mx-auto mb-1" />
              <div className="text-base font-bold text-white font-mono">5 Temel</div>
              <div className="text-[11px] text-slate-400">Veri Yapısı & Motor</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <Cpu className="w-4 h-4 text-emerald-400 mx-auto mb-1" />
              <div className="text-base font-bold text-white font-mono">9 Algoritma</div>
              <div className="text-[11px] text-slate-400">Sıralama + Labirent</div>
            </div>
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-center">
              <Share2 className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              <div className="text-base font-bold text-white font-mono">JS Core</div>
              <div className="text-[11px] text-slate-400">Call Stack & Loop</div>
            </div>
          </div>

          {/* Text Box */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-medium text-slate-300">
                Hazır LinkedIn Gönderi Metni:
              </label>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
            </div>
            <textarea
              readOnly
              value={postText}
              rows={8}
              className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-300 font-sans focus:outline-none focus:border-indigo-500/50 resize-none select-all"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/50 flex items-center justify-between">
          <span className="text-xs text-slate-400 font-mono">
            Hazır metni kopyalayıp profilinizde paylaşabilirsiniz.
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-750 rounded-lg transition-colors cursor-pointer"
            >
              Kapat
            </button>
            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-[#0A66C2] hover:bg-[#004182] rounded-lg transition-colors shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Panoya Kopyalandı' : 'LinkedIn İçin Kopyala'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
