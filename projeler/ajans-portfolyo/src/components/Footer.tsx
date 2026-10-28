import React from 'react';
import { Github, Linkedin, Twitter, ArrowUp, RefreshCw } from 'lucide-react';

interface FooterProps {
  onOpenDeployModal: () => void;
  onResetDefaults: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenDeployModal, onResetDefaults }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-neutral-800 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Signature info */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex items-center gap-2.5">
              <span className="w-7 h-7 rounded-lg bg-amber-400 text-neutral-950 font-black flex items-center justify-center text-xs">
                EÖ
              </span>
              <span className="text-sm font-bold text-white tracking-wider">
                ENES ÖZTÜRK <span className="text-amber-400 font-normal">AJANS</span>
              </span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed max-w-sm">
              PCAT ve SmartEdu projelerimizden devraldığımız dinamik CRUD ve mesajlaşma mimarisiyle, markanızı dijital dünyada zirveye taşıyan full-stack ajans ekosistemi.
            </p>
            <div className="text-[11px] text-neutral-400">
              <span>Enes Öztürk İmzalı Profesyonel Tasarım & Kod Mimarisi</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">Hızlı Erişim</h4>
            <ul className="space-y-2">
              <li>
                <a href="#services" className="hover:text-amber-400 transition-colors">
                  Hizmetler
                </a>
              </li>
              <li>
                <a href="#portfolio" className="hover:text-amber-400 transition-colors">
                  Dinamik Portföy (CRUD)
                </a>
              </li>
              <li>
                <a href="#about" className="hover:text-amber-400 transition-colors">
                  Hakkımızda & PCAT / SmartEdu
                </a>
              </li>
              <li>
                <a href="#team" className="hover:text-amber-400 transition-colors">
                  Çekirdek Ekip
                </a>
              </li>
              <li>
                <a href="#contact" className="hover:text-amber-400 transition-colors">
                  İletişim Formu
                </a>
              </li>
            </ul>
          </div>

          {/* DevOps & Tools */}
          <div className="md:col-span-4 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Yayınlama & Araçlar
            </h4>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Bu projeyi kendi GitHub hesabınıza klonlayabilir veya doğrudan Heroku / bulut ortamına yükleyebilirsiniz.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={onOpenDeployModal}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-white border border-neutral-800 text-xs cursor-pointer"
              >
                GitHub & Heroku Rehberi
              </button>
              <button
                onClick={onResetDefaults}
                className="px-3 py-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-800 text-xs flex items-center gap-1 cursor-pointer"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Örnek Verileri Sıfırla</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-neutral-400 text-xs">
            © 2026 Enes Öztürk Ajans. Tüm Hakları Saklıdır.
          </p>

          <div className="flex items-center gap-4 text-neutral-400">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition-colors"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-sky-400 transition-colors"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4" />
            </a>

            <button
              onClick={scrollToTop}
              title="Yukarı Çık"
              className="ml-2 p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 hover:text-white border border-neutral-800 transition-colors cursor-pointer"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
