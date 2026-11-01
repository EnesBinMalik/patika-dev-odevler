import React, { useState, useEffect } from 'react';

const SECTIONS = [
  { id: 'giris', label: '01. Giriş & Amaç' },
  { id: 'problem', label: '02. Problem & Web2 Sınırları' },
  { id: 'cozum', label: '03. Web3 Çözümü & Mimari' },
  { id: 'etki-deger', label: '04. Etki, Metrikler & Riskler' },
  { id: 'simulasyon', label: 'İnteraktif Simülatör' },
  { id: 'karsilastirma', label: 'Karşılaştırma Matrisi' }
];

export const TableOfContents: React.FC = () => {
  const [activeSection, setActiveSection] = useState('giris');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + 200;
      for (const sec of SECTIONS) {
        const el = document.getElementById(sec.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveSection(sec.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav aria-label="İçindekiler" className="hidden xl:block sticky top-28 self-start w-64 space-y-3">
      <div className="text-[11px] uppercase tracking-widest font-mono text-stone-400 font-semibold mb-2">
        Rapor Bölümleri
      </div>
      <div className="space-y-1 border-l border-stone-200 pl-3">
        {SECTIONS.map((s) => {
          const isActive = activeSection === s.id;
          return (
            <a
              key={s.id}
              href={`#${s.id}`}
              className={`block text-xs py-1.5 transition-colors ${
                isActive
                  ? 'text-stone-900 font-bold border-l-2 border-stone-900 -ml-[13px] pl-2.5'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
            >
              {s.label}
            </a>
          );
        })}
      </div>
    </nav>
  );
};
