import React from 'react';
import { Github, Twitter, Linkedin, Heart } from 'lucide-react';
import { ActiveTab } from '../types/blog';

interface FooterProps {
  onNavigate: (tab: ActiveTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="w-full bg-slate-900 border-t border-slate-800 text-slate-400 py-12 font-sans">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
        {/* Social Icons */}
        <div className="flex items-center justify-center gap-6 mb-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors flex items-center justify-center"
          >
            <Linkedin className="w-4 h-4" />
          </a>
        </div>

        {/* Signature & Course Attribution */}
        <div className="text-sm text-slate-300 font-medium mb-3">
          Clean Blog Projesi · 6. Bölüm (Ödev 12)
        </div>

        <p className="text-xs text-slate-400 max-w-xl mx-auto leading-relaxed mb-4">
          Bu uygulama <strong>HEROKU</strong> ve <strong>MongoDB Atlas</strong> ücretsiz servisleri kullanılarak başarıyla buluta taşınmıştır.
        </p>

        {/* Mandatory Assignment Note */}
        <div className="inline-block bg-slate-800/80 border border-slate-700/60 rounded-md px-4 py-2 text-xs text-slate-300 mb-6 max-w-2xl">
          <span className="text-slate-400">Ödev Notu:</span> "Uygulamamızda sayfalama ve görsel yükleme işlemlerini yapmadık. Sonraki projemizde de bu özellikleri kullanacağız."
        </div>

        {/* Footer Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-500 mb-6">
          <button onClick={() => onNavigate('home')} className="hover:text-slate-300 cursor-pointer">Anasayfa</button>
          <span>·</span>
          <button onClick={() => onNavigate('about')} className="hover:text-slate-300 cursor-pointer">Hakkımda</button>
          <span>·</span>
          <button onClick={() => onNavigate('new-post')} className="hover:text-slate-300 cursor-pointer">Yeni Yazı</button>
          <span>·</span>
          <button onClick={() => onNavigate('deployment')} className="hover:text-slate-300 cursor-pointer">Heroku & Atlas</button>
          <span>·</span>
          <button onClick={() => onNavigate('contact')} className="hover:text-slate-300 cursor-pointer">İletişim</button>
        </div>

        {/* Copyright and Enes Öztürk Signature */}
        <div className="text-xs text-slate-500 border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div>
            Telif Hakkı &copy; 2026 <strong>Enes Öztürk</strong>. Tüm hakları saklıdır.
          </div>
          <div className="flex items-center gap-1 text-slate-400">
            <span>Hazırlayan & İmzalayan:</span>
            <span className="font-semibold text-white">Enes Öztürk</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
