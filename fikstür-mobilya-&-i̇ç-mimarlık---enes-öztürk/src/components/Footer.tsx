import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Github, ExternalLink, Compass, ShieldCheck, Heart, RotateCcw } from 'lucide-react';

interface FooterProps {
  onOpenDeployGuide: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDeployGuide }) => {
  const { setActivePage, resetToDefaults } = useApp();

  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand & Signature Column */}
          <div className="md:col-span-1">
            <span className="font-display text-2xl font-bold tracking-tight text-white block mb-2">
              Fikstür
            </span>
            <p className="text-xs text-stone-400 leading-relaxed mb-4">
              Modern mimarlık pratikleri ve zanaat geleneğini buluşturan fonksiyonel mobilya ve fikstür koleksiyonu.
            </p>
            <div className="pt-2 border-t border-stone-800">
              <p className="text-xs text-amber-400 font-medium">Tasarım ve Mimari Konsept:</p>
              <p className="text-sm font-semibold text-white tracking-wide">Enes Öztürk</p>
            </div>
          </div>

          {/* Page Links */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Sayfalar
            </h3>
            <ul className="space-y-2.5 text-xs text-stone-400">
              <li>
                <button
                  onClick={() => setActivePage('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Ana Sayfa (Home)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('about')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Hakkımızda (About)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('furnitures')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Mobilyalar (Furnitures)
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActivePage('contact')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  İletişim (Contact)
                </button>
              </li>
            </ul>
          </div>

          {/* SmartEdu & Proje Bilgisi */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Proje Mimarisi
            </h3>
            <p className="text-xs text-stone-400 leading-relaxed mb-3">
              Bu çalışma, <span className="text-stone-200 font-medium">SmartEdu</span> ve <span className="text-stone-200 font-medium">PCAT</span> proje standartlarına uygun olarak çok sayfalı mimari, kullanıcı yetkilendirme (Misafir, Üye, Admin) ve mobilya rezervasyon sistemi olarak geliştirilmiştir.
            </p>
            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5" />
              <span>GitHub & Heroku Rehberi</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>

          {/* İletişim & Lokasyon */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-stone-200 mb-4">
              Atölye & Showroom
            </h3>
            <address className="not-italic text-xs text-stone-400 space-y-1.5 leading-relaxed">
              <p className="text-stone-300 font-medium">Fikstür Mimarlık Stüdyosu</p>
              <p>Caferağa Mah. Şair Nefi Sok. No: 18/A</p>
              <p>Moda, Kadıköy / İstanbul</p>
              <p className="pt-2 text-stone-300">İletişim: +90 (216) 418 20 40</p>
              <p>E-posta: info@fikstur.com</p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <span>&copy; {new Date().getFullYear()} Fikstür Proje</span>
            <span aria-hidden="true">·</span>
            <span>Tüm hakları saklıdır</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400 font-medium">Enes Öztürk İmzasıyla</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={resetToDefaults}
              className="flex items-center gap-1 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
              title="Varsayılan verilere dön"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Verileri Sıfırla</span>
            </button>
            <button
              onClick={onOpenDeployGuide}
              className="text-stone-400 hover:text-amber-400 transition-colors cursor-pointer"
            >
              Git & Dağıtım Dokümantasyonu
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
