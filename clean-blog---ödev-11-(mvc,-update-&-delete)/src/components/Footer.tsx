import React from 'react';
import { Github, Linkedin, Mail, Heart, RefreshCw, CheckCircle, Code } from 'lucide-react';

interface FooterProps {
  onResetPosts: () => void;
  onOpenChecklist: () => void;
  onGoToCode: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onResetPosts,
  onOpenChecklist,
  onGoToCode
}) => {
  return (
    <footer className="bg-[#212529] text-gray-400 pt-14 pb-10 border-t border-gray-800">
      <div className="max-w-4xl mx-auto px-4 text-center">
        {/* Social Icons (Clean Blog Classic Style) */}
        <div className="flex justify-center items-center gap-4 mb-6">
          <a
            href="https://github.com/enesbino38"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-600 transition-all transform hover:-translate-y-1 shadow-md"
            title="Enes Öztürk GitHub Profili"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noreferrer"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-blue-600 transition-all transform hover:-translate-y-1 shadow-md"
            title="LinkedIn Profili"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:enesbino38@gmail.com"
            className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-gray-300 hover:text-white hover:bg-emerald-600 transition-all transform hover:-translate-y-1 shadow-md"
            title="İletişim: enesbino38@gmail.com"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Signature & Project Credentials */}
        <div className="space-y-2 mb-6">
          <p className="text-white text-base font-serif italic">
            "Kodumuzu MVC yapısına göre tekrar düzenleyelim."
          </p>
          <div className="inline-flex items-center gap-2 bg-emerald-950/70 text-emerald-400 border border-emerald-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
            Ödev 11 Başarıyla Tamamlandı &bull; Enes Öztürk İmzalı
          </div>
          <p className="text-xs text-gray-400 mt-2">
            Patika.dev / Kodluyoruz Node.js Eğitimi &bull; Clean Blog Projesi 5. Bölüm
          </p>
        </div>

        {/* Quick evaluation actions */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4 border-t border-gray-800 text-xs">
          <button
            onClick={onResetPosts}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Varsayılan Yazıları Sıfırla (Seed Data)
          </button>
          <button
            onClick={onGoToCode}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-emerald-400 hover:text-emerald-300 transition-colors"
          >
            <Code className="w-3.5 h-3.5" />
            MVC Dosyalarını İncele
          </button>
          <button
            onClick={onOpenChecklist}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white transition-colors"
          >
            <CheckCircle className="w-3.5 h-3.5" />
            Ödev Kriterleri Kontrol Listesi
          </button>
        </div>

        <p className="text-[11px] text-gray-400 mt-6">
          Copyright &copy; {new Date().getFullYear()} Enes Öztürk &bull; Tüm Hakları Saklıdır
        </p>
      </div>
    </footer>
  );
};
