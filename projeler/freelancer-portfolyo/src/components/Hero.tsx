import React from 'react';
import { StarDivider } from './StarDivider';
import { PlusCircle, Send, Terminal, ArrowDown } from 'lucide-react';

interface HeroProps {
  onOpenAddProject: () => void;
  onOpenDeployGuide: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOpenAddProject, onOpenDeployGuide }) => {
  return (
    <section id="page-top" className="bg-[#1abc9c] text-white py-16 sm:py-24 text-center">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        {/* Masthead Avatar */}
        <div className="relative inline-block mb-6">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto rounded-full p-2 bg-white/20 backdrop-blur-xs shadow-lg transition-transform hover:scale-105 duration-300">
            <img
              src="/assets/images/avatar_enes_ozturk_1793202355136.jpg"
              alt="Enes Öztürk - Full Stack Developer Avatar"
              className="w-full h-full object-cover rounded-full shadow-inner bg-slate-100"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Subtle online marker */}
          <div className="absolute bottom-2 right-4 bg-[#2c3e50] text-[#1abc9c] p-1.5 rounded-full border-2 border-white shadow">
            <span className="sr-only">Aktif Freelancer</span>
            <div className="w-3 h-3 bg-[#1abc9c] rounded-full" />
          </div>
        </div>

        {/* Masthead Heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight uppercase mb-3 font-heading drop-shadow-xs">
          ENES ÖZTÜRK
        </h1>

        {/* Iconic Star Divider */}
        <StarDivider theme="light" className="mb-5" />

        {/* Masthead Subheading */}
        <p className="text-lg sm:text-2xl font-light tracking-wide uppercase text-white/95 mb-8 max-w-2xl mx-auto">
          Graphic Artist · Web Designer · Full Stack Developer
        </p>

        {/* Capstone Project Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs sm:text-sm font-medium text-white/90 mb-10">
          <span className="px-3 py-1 bg-[#2c3e50]/40 rounded-full border border-white/20">
            PCAT Fotoğraf Kataloğu
          </span>
          <span className="text-white/60">·</span>
          <span className="px-3 py-1 bg-[#2c3e50]/40 rounded-full border border-white/20">
            SmartEdu LMS Platformu
          </span>
          <span className="text-white/60">·</span>
          <span className="px-3 py-1 bg-[#2c3e50]/40 rounded-full border border-white/20">
            Freelancer Dinamik Proje
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          <a
            href="#portfolio"
            className="px-6 py-3 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <span>Portföyü Keşfet</span>
            <ArrowDown className="w-4 h-4" />
          </a>

          <button
            onClick={onOpenAddProject}
            className="px-6 py-3 bg-white hover:bg-slate-100 text-[#2c3e50] font-bold rounded-lg transition-all shadow-md hover:shadow-lg flex items-center gap-2 text-sm uppercase tracking-wider active:scale-95"
          >
            <PlusCircle className="w-4 h-4 text-[#1abc9c]" />
            <span>Proje Ekle (ADD)</span>
          </button>

          <button
            onClick={onOpenDeployGuide}
            className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white font-bold rounded-lg transition-all border border-white/30 flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <Terminal className="w-4 h-4" />
            <span>GitHub & Heroku</span>
          </button>
        </div>
      </div>
    </section>
  );
};
