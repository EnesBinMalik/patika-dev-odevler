import React from 'react';
import { useApp } from '../context/AppContext';
import { PageRoute } from '../types';
import { Dumbbell, Github, Heart, Mail, MapPin, Phone, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  const { setActivePage, setIsGithubModalOpen, resetAllData } = useApp();

  const handleLink = (page: PageRoute) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-neutral-950 border-t border-neutral-900 text-neutral-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand & Craftsmanship */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-neutral-950 font-bold">
                <Dumbbell className="w-4 h-4 stroke-[2.5]" />
              </div>
              <span className="font-display text-2xl font-bold tracking-wider text-white uppercase">
                MISFIT
              </span>
            </div>
            
            <p className="text-neutral-400 text-sm leading-relaxed max-w-sm">
              SmartEdu ve PCAT mimarisinden ilham alarak geliştirilmiş, eğitmen ve üye etkileşimini merkezine alan fonksiyonel fitness ve antrenman yönetim platformu.
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs text-amber-400/90 font-medium">
              <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Enes Öztürk İmzasıyla · %100 El Emeği Mimarisi</span>
            </div>
          </div>

          {/* Quick Pages */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-4">Sayfalar</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handleLink('home')} className="hover:text-amber-400 transition-colors">
                  Ana Sayfa
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('about')} className="hover:text-amber-400 transition-colors">
                  Hakkımızda
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('trainers')} className="hover:text-amber-400 transition-colors">
                  Eğitmen Kadromuz
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('workouts')} className="hover:text-amber-400 transition-colors">
                  Antrenman Programları
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('gallery')} className="hover:text-amber-400 transition-colors">
                  Stüdyo Galerisi
                </button>
              </li>
              <li>
                <button onClick={() => handleLink('contact')} className="hover:text-amber-400 transition-colors">
                  İletişim & Konum
                </button>
              </li>
            </ul>
          </div>

          {/* Training Categories */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-4">Branşlar</h4>
            <ul className="space-y-2 text-xs text-neutral-400">
              <li>CrossFit & WOD</li>
              <li>Reformer Pilates</li>
              <li>Boks & Ring Antrenmanı</li>
              <li>Olimpik Halter & Güç</li>
              <li>Fonksiyonel HIIT</li>
              <li>Mobilite & Duruş Sağlığı</li>
            </ul>
          </div>

          {/* Contact & Deployment */}
          <div className="space-y-4">
            <h4 className="text-xs uppercase tracking-wider text-white font-semibold mb-3">İletişim & Dağıtım</h4>
            <div className="space-y-2.5 text-xs text-neutral-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>Levent, Büyükdere Cad. No:142, İstanbul</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>+90 (212) 345 67 89</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>info@misfitproje.com</span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => setIsGithubModalOpen(true)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-lg text-xs font-semibold text-amber-400 transition-colors"
              >
                <Github className="w-3.5 h-3.5" />
                <span>GitHub & Heroku Rehberi</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom hairline bar */}
        <div className="mt-12 pt-8 border-t border-neutral-900/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <span>© 2026 Misfit Fitness & Antrenman Projesi. Tüm hakları saklıdır.</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-neutral-400">
              Tasarım & Kodlama: <span className="text-amber-400 font-semibold">Enes Öztürk</span>
            </span>
            <span>·</span>
            <button
              onClick={resetAllData}
              className="text-neutral-400 hover:text-neutral-300 underline underline-offset-4"
              title="Test verilerini başlangıç durumuna döndür"
            >
              Verileri Sıfırla
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
