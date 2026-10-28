import React from 'react';
import { Github, Linkedin, Twitter, Dribbble, Mail, ChevronUp, MapPin, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#2c3e50] text-white">
      {/* Main 3-Column Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
          {/* Column 1: Location */}
          <div className="space-y-3">
            <h4 className="text-lg font-black uppercase tracking-wider font-heading flex items-center justify-center gap-2">
              <MapPin className="w-5 h-5 text-[#1abc9c]" />
              <span>KONUM</span>
            </h4>
            <p className="text-sm text-slate-300 leading-relaxed max-w-xs mx-auto">
              İstanbul & Kayseri, Türkiye<br />
              Uzaktan (Remote) / Freelance Çalışma
            </p>
          </div>

          {/* Column 2: Around the Web (Socials) */}
          <div className="space-y-4">
            <h4 className="text-lg font-black uppercase tracking-wider font-heading flex items-center justify-center gap-2">
              <Globe className="w-5 h-5 text-[#1abc9c]" />
              <span>SOSYAL MEDYA</span>
            </h4>
            <div className="flex items-center justify-center gap-3">
              <a
                href="https://github.com/enesozturk"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-[#1abc9c] hover:border-[#1abc9c] transition-colors"
                aria-label="GitHub Hesabı"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com/in/enesozturk"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-[#1abc9c] hover:border-[#1abc9c] transition-colors"
                aria-label="LinkedIn Profili"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com/enesozturk"
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-[#1abc9c] hover:border-[#1abc9c] transition-colors"
                aria-label="Twitter Profili"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="mailto:enesbino38@gmail.com"
                className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center hover:bg-[#1abc9c] hover:border-[#1abc9c] transition-colors"
                aria-label="E-posta Gönder"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 3: About Freelancer / Signature */}
          <div className="space-y-3">
            <h4 className="text-lg font-black uppercase tracking-wider font-heading">
              FREELANCER HAKKINDA
            </h4>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-sm mx-auto">
              Freelancer şablonu, <strong>Enes Öztürk</strong> tarafından PCAT ve SmartEdu projelerinden ilham alınarak tam dinamik React & Node.js CRUD sistemine dönüştürülmüştür.
            </p>
          </div>
        </div>
      </div>

      {/* Sub-Footer Copyright & Signature Bar */}
      <div className="bg-[#1a252f] py-6 border-t border-slate-700/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <p className="text-center sm:text-left">
            Telif Hakkı © <strong>Enes Öztürk</strong> 2026. Tüm Hakları Saklıdır.
          </p>

          <div className="flex items-center gap-6">
            <span className="text-slate-500">
              İmza: <span className="text-[#1abc9c] font-semibold">Enes Öztürk</span>
            </span>

            <button
              onClick={scrollToTop}
              className="p-2 bg-[#2c3e50] hover:bg-[#1abc9c] text-white rounded-md transition-colors flex items-center gap-1 text-xs"
              title="Sayfa Başına Dön"
            >
              <ChevronUp className="w-4 h-4" />
              <span>Yukarı</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
