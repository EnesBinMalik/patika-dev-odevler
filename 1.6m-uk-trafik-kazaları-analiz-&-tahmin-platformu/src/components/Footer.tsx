/**
 * Research Platform Footer
 * Author & Signature: Enes Öztürk
 */
import React from 'react';
import { ShieldCheck, UserCheck, Heart, FileText, Database, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-slate-950 border-t border-slate-800/80 pt-12 pb-8 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Main Footer Row */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Brand & Author Info (5 cols) */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2 text-white font-bold text-base">
              <div className="w-6 h-6 rounded bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span>1.6M UK Trafik Kazaları Araştırma Platformu</span>
            </div>

            <p className="text-slate-400 leading-relaxed max-w-md text-xs">
              Birleşik Krallık Ulaştırma Bakanlığı (Department for Transport) 2000–2016 resmi STATS19 veri seti üzerinden trafik akışı, risk faktörleri, zaman tahminleri ve kırsal-kentsel asimetrisi üzerine geliştirilmiş büyük veri analitik çalışması.
            </p>

            {/* Signature Box */}
            <div className="p-3 bg-slate-900 rounded-xl border border-amber-500/30 inline-flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center text-amber-400 font-bold text-xs">
                EÖ
              </div>
              <div>
                <div className="text-[10px] font-mono text-amber-400 uppercase tracking-wider">
                  ARAŞTIRMA VE VERİ BİLİMİ
                </div>
                <div className="text-sm font-bold text-white">
                  Enes Öztürk
                </div>
              </div>
            </div>
          </div>

          {/* Quick Nav Links (3 cols) */}
          <div className="md:col-span-3 space-y-2">
            <div className="text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold">
              Araştırma Sütunları
            </div>
            <ul className="space-y-1.5 text-slate-400">
              <li>
                <a href="#traffic-flow" className="hover:text-amber-400 transition-colors">
                  1. Trafik Akışının Kazalara Etkisi
                </a>
              </li>
              <li>
                <a href="#risk-factors" className="hover:text-amber-400 transition-colors">
                  2. Kaza Oranlarını Ne Artırır?
                </a>
              </li>
              <li>
                <a href="#forecasting" className="hover:text-amber-400 transition-colors">
                  3. Zaman İçinde Kaza Tahmini
                </a>
              </li>
              <li>
                <a href="#rural-urban" className="hover:text-amber-400 transition-colors">
                  4. Kırsal ve Kentsel Ayrışması
                </a>
              </li>
              <li>
                <a href="#regional-map" className="hover:text-amber-400 transition-colors">
                  5. Bölgesel Kara Noktalar
                </a>
              </li>
            </ul>
          </div>

          {/* Data Sources & Citation (4 cols) */}
          <div className="md:col-span-4 space-y-2">
            <div className="text-xs font-mono text-slate-200 uppercase tracking-wider font-semibold flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-amber-400" />
              Veri Kaynağı & Lisans
            </div>
            <p className="text-slate-400 leading-relaxed text-xs">
              Veriler Birleşik Krallık Karayolu Güvenliği İstatistikleri (Road Safety Data / DfT STATS19) veritabanından derlenmiş olup <strong className="text-slate-300">Open Government Licence v3.0</strong> kapsamındadır.
            </p>
            <div className="text-[11px] font-mono text-slate-500 pt-1">
              Citation: Öztürk, E. (2024). Econometric Modeling & Predictive Analytics of 1.6 Million UK Traffic Accidents (2000–2016).
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800/80 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 font-mono">
          <div>
            © {new Date().getFullYear()} Enes Öztürk. Tüm hakları saklıdır.
          </div>

          <div className="flex items-center gap-3">
            <span>1,640,598 Kayıt İncelendi</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={scrollToTop}
              className="text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
            >
              <span>Başa Dön</span>
              <ArrowUp className="w-3 h-3" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
