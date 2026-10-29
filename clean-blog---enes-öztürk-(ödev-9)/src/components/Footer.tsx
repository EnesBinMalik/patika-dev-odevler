import React from 'react';
import { Github, Twitter, Linkedin, Mail, Heart, Database, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onOpenHomework: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenHomework }) => {
  return (
    <footer className="bg-stone-950 text-stone-300 border-t border-stone-800 pt-16 pb-12 mt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
        {/* Social Icons (Classic Clean Blog Circular Icons) */}
        <div className="flex items-center justify-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-teal-500 hover:bg-stone-800 transition"
          >
            <Github className="w-5 h-5" />
          </a>

          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter"
            className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-teal-500 hover:bg-stone-800 transition"
          >
            <Twitter className="w-5 h-5" />
          </a>

          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-teal-500 hover:bg-stone-800 transition"
          >
            <Linkedin className="w-5 h-5" />
          </a>

          <a
            href="mailto:enesbino38@gmail.com"
            aria-label="Email"
            className="w-12 h-12 rounded-full bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-400 hover:text-white hover:border-teal-500 hover:bg-stone-800 transition"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Database & Spec Pill */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-stone-400">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800">
            <Database className="w-3.5 h-3.5 text-teal-400" />
            cleanblog-test-db
          </span>
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900 border border-stone-800">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            req.body & urlencoded
          </span>
          <button
            onClick={onOpenHomework}
            className="px-3 py-1 rounded-full bg-amber-950/60 text-amber-300 border border-amber-800/80 hover:bg-amber-900/60 transition"
          >
            Ödev 9 Raporu & Kodları
          </button>
        </div>

        {/* Signature & Copyright */}
        <div className="space-y-2 pt-4 border-t border-stone-900">
          <p className="font-serif text-base text-stone-200">
            Clean Blog • Enes Öztürk
          </p>
          <p className="text-xs text-stone-500 font-sans tracking-wide">
            Copyright © 2026{' '}
            <strong className="text-stone-300 font-semibold uppercase tracking-wider">
              ENES ÖZTÜRK
            </strong>{' '}
            • Tüm Hakları Saklıdır.
          </p>
          <p className="text-[11px] text-stone-600">
            Patika.dev Node.js Eğitimi Clean Blog Projesi 3. Bölüm (Ödev 9)
          </p>
        </div>
      </div>
    </footer>
  );
};
