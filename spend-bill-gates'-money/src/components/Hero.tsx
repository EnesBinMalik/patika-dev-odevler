import React, { useState } from 'react';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import { Language } from '../types';

interface HeroProps {
  language: Language;
}

export const Hero: React.FC<HeroProps> = ({ language }) => {
  const [imageLoaded, setImageLoaded] = useState(true);
  const isTr = language === 'tr';

  return (
    <section className="bg-white border-b border-slate-200 pt-8 pb-10 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
        {/* Bill Gates Portrait */}
        <div className="relative mb-5 group">
          <div className="w-32 h-32 sm:w-36 sm:h-36 rounded-full overflow-hidden border-4 border-white shadow-xl ring-4 ring-emerald-500/20 bg-slate-100 flex items-center justify-center">
            {imageLoaded ? (
              <img
                src="/src/assets/images/bill_gates_portrait_1793122694209.jpg"
                alt="Bill Gates"
                referrerPolicy="no-referrer"
                onError={() => setImageLoaded(false)}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white text-3xl font-bold">
                BG
              </div>
            )}
          </div>
          <span className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-2 border-white rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm" title="Net Worth: $100 Billion">
            $
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight mb-3">
          {isTr ? "Bill Gates'in Parasını Harca" : "Spend Bill Gates' Money"}
        </h1>

        {/* Subtitle / Signature Credit */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm text-slate-600 mb-4">
          <span className="font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-md border border-emerald-200/60 inline-flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            {isTr ? 'Ödev 2 Klon Uygulaması' : 'Homework 2 Clone'}
          </span>
          <span className="text-slate-400">·</span>
          <span className="font-bold text-slate-900 bg-slate-100 px-3 py-1 rounded-md">
            {isTr ? 'Geliştirici: Enes Öztürk' : 'Created by: Enes Öztürk'}
          </span>
        </div>

        {/* Context description */}
        <p className="max-w-2xl text-slate-600 text-sm sm:text-base leading-relaxed">
          {isTr
            ? "Bill Gates'in $100,000,000,000 (100 Milyar Dolar) servetini tüketmeye çalışın! Bir Big Mac'ten Formula 1 aracına ve roketlere kadar her şeyi sepetinize ekleyin."
            : "Try spending Bill Gates' $100,000,000,000 fortune! Add everything from Big Macs to Formula 1 race cars and orbital space stations to your basket."}
        </p>
      </div>
    </section>
  );
};
