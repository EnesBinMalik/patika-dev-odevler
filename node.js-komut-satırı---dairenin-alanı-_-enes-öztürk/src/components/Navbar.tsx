import React from 'react';
import { Terminal, Code2, Shapes, Sparkles, Download, Check, Copy } from 'lucide-react';
import { NODE_SCRIPT_CODE } from '../data/codeSnippet';

interface NavbarProps {
  activeTab: 'terminal' | 'visualizer' | 'code' | 'guide' | 'tests';
  setActiveTab: (tab: 'terminal' | 'visualizer' | 'code' | 'guide' | 'tests') => void;
  onOpenArtisanModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenArtisanModal,
}) => {
  const [copied, setCopied] = React.useState(false);

  const handleCopyCode = () => {
    navigator.clipboard.writeText(NODE_SCRIPT_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([NODE_SCRIPT_CODE], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'daireAlani.js';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const navItems = [
    { id: 'terminal' as const, label: 'Node.JS Terminali', icon: Terminal },
    { id: 'visualizer' as const, label: 'Geometri Simülatörü', icon: Shapes },
    { id: 'code' as const, label: 'Kaynak Kod (daireAlani.js)', icon: Code2 },
    { id: 'guide' as const, label: 'process.argv Rehberi', icon: Sparkles },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo & Assignment Title */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500/20 via-teal-500/10 to-amber-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-mono-code font-bold text-lg shadow-inner shadow-emerald-500/10">
              JS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Ödev 1
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  Node.JS Komut Satırı Kullanımı
                </span>
              </div>
              <h1 className="text-base sm:text-lg font-bold text-slate-100 flex items-center gap-1.5">
                <span>Dairenin Alanı = π × r²</span>
              </h1>
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    isActive
                      ? 'bg-amber-500/10 text-amber-300 border border-amber-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Artisan Signature Badge & Actions */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleCopyCode}
              title="daireAlani.js kodunu kopyala"
              className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownload}
              title="daireAlani.js dosyasını indir"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-slate-400" />
              <span>.js İndir</span>
            </button>

            {/* Handcrafted signature stamp */}
            <button
              onClick={onOpenArtisanModal}
              className="group relative flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-slate-900 border border-amber-500/40 hover:border-amber-400/70 transition-all shadow-sm hover:shadow-amber-500/10 cursor-pointer text-left"
              title="Enes Öztürk El Emeği Sertifikasını Görüntüle"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 text-xs font-bold font-handwriting">
                EÖ
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] text-amber-400/90 font-medium uppercase tracking-wider flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  El Emeği
                </span>
                <span className="text-xs font-bold text-amber-200 group-hover:text-amber-100 font-handwriting text-sm leading-tight">
                  Enes Öztürk
                </span>
              </div>
            </button>
          </div>

        </div>

        {/* Mobile Subnav */}
        <div className="flex md:hidden items-center justify-between gap-1 py-2 border-t border-slate-800/60 overflow-x-auto no-scrollbar">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-2.5 py-1.2 rounded-lg text-xs font-medium whitespace-nowrap ${
                  isActive
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                    : 'text-slate-400'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
