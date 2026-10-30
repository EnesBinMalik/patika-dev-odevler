import React from 'react';
import { Calendar, Code2, Database } from 'lucide-react';

interface FooterProps {
  onOpenConsole: () => void;
  onOpenAbout: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenConsole, onOpenAbout }) => {
  return (
    <footer className="bg-white border-t border-slate-200 mt-16 text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left: Brand & Enes Öztürk Signature */}
          <div className="flex items-center gap-3 text-center md:text-left">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shrink-0">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-sm font-bold text-slate-900">
                EventHub · Apollo Client & GraphQL
              </div>
              <div className="text-xs text-slate-500">
                Ödev 4 — Hazırlayan: <span className="font-semibold text-slate-800">Enes Öztürk</span>
              </div>
            </div>
          </div>

          {/* Center: Metadata details with clean dot separators */}
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-slate-500">
            <span>React 19</span>
            <span aria-hidden="true">·</span>
            <span>Apollo Client 3</span>
            <span aria-hidden="true">·</span>
            <span>GraphQL Schema & Resolvers</span>
            <span aria-hidden="true">·</span>
            <span>Patika.dev / Kodluyoruz</span>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={onOpenConsole}
              className="hover:text-indigo-600 transition-colors flex items-center gap-1.5"
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>GraphQL Konsolu</span>
            </button>
            <button
              onClick={onOpenAbout}
              className="hover:text-indigo-600 transition-colors"
            >
              Ödev Kriterleri
            </button>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div>
            © 2026 EventHub. Enes Öztürk imzasıyla hazırlanmıştır. Tüm hakları saklıdır.
          </div>
          <div className="font-mono">
            Apollo InMemoryCache · Normalized Entity Storage
          </div>
        </div>
      </div>
    </footer>
  );
};
