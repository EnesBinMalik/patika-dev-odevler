import React from 'react';
import { Heart, Globe2, ShieldCheck, Download } from 'lucide-react';

interface FooterProps {
  onExportCSV: () => void;
  onSelectTab: (tabId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onExportCSV, onSelectTab }) => {
  return (
    <footer className="bg-[#1C1917] text-stone-300 py-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pb-10 border-b border-stone-800">
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-stone-800 border border-stone-700 flex items-center justify-center font-serif text-amber-200 text-xs font-bold">
                WH
              </span>
              <span className="text-base font-serif font-bold text-white">
                World Happiness Report Analizi
              </span>
            </div>
            <p className="text-xs text-stone-400 max-w-md leading-relaxed">
              Bu platform, 2012 yılında yayınlanmaya başlayan Dünya Mutluluk Raporu verilerini 6 temel faktör üzerinden 
              inceleyerek daha mutlu toplumların nasıl inşa edilebileceğine dair ampirik cevaplar sunmak amacıyla geliştirilmiştir.
            </p>
            <div className="text-xs font-medium text-amber-300">
              Araştırma & Analitik Modelleme: <span className="font-bold text-white">Enes Öztürk</span>
            </div>
          </div>

          {/* Quick Nav Links */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Rapor Bölümleri
            </div>
            <ul className="text-xs space-y-1.5 text-stone-400">
              <li>
                <button
                  onClick={() => onSelectTab('overview')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Yönetici Özeti & Bulgular
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('factors')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  6 Temel Faktör Atlası
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('evolution')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  2015-2017 Değişim Tablosu
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('casestudies')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Vaka İncelemeleri (Venezuela, Togo...)
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('compare')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ülke Kıyaslayıcı & Simülatör
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('signature')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Enes Öztürk Özel Notu
                </button>
              </li>
            </ul>
          </div>

          {/* Data Export & Reference */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-xs font-mono uppercase tracking-widest text-stone-400 font-semibold">
              Veri Kaynağı & Araçlar
            </div>
            <p className="text-xs text-stone-400 leading-relaxed">
              Tüm göstergeler UN SDSN, Gallup World Poll ve Dünya Sağlık Örgütü açık veri tabanları ile uyumludur.
            </p>
            <button
              onClick={onExportCSV}
              className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-stone-900 bg-amber-100 hover:bg-amber-200 rounded-md transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5 text-stone-900" />
              <span>Veri Setini CSV Olarak İndir</span>
            </button>
          </div>
        </div>

        {/* Quiet institutional copyright bar */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-stone-500 font-mono">
          <div>
            © 2012–2026 World Happiness Analytics · Hazırlayan ve İmzalayan: 
            <span className="text-stone-300 font-semibold ml-1">Enes Öztürk</span>
          </div>
          <div className="flex items-center gap-2 text-stone-400">
            <span>Barış, Refah ve İnsani Kalkınma İçin</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
