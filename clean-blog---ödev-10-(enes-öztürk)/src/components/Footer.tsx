import React from 'react';
import { Github, Globe, Linkedin, Mail, Twitter } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-100 border-t border-stone-200 py-12 mt-16 text-center text-stone-600">
      <div className="max-w-4xl mx-auto px-4">
        {/* Sosyal İkonlar (Start Bootstrap Clean Blog Klasik Stili) */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Profili"
            className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 hover:bg-amber-500 hover:text-stone-950 flex items-center justify-center transition-all shadow-xs"
          >
            <Github className="w-4 h-4" />
          </a>
          <a
            href="https://linkedin.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn Profili"
            className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 hover:bg-amber-500 hover:text-stone-950 flex items-center justify-center transition-all shadow-xs"
          >
            <Linkedin className="w-4 h-4" />
          </a>
          <a
            href="mailto:enesbino38@gmail.com"
            aria-label="E-posta İletişim"
            className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 hover:bg-amber-500 hover:text-stone-950 flex items-center justify-center transition-all shadow-xs"
          >
            <Mail className="w-4 h-4" />
          </a>
          <a
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Twitter Profili"
            className="w-10 h-10 rounded-full bg-stone-900 text-stone-100 hover:bg-amber-500 hover:text-stone-950 flex items-center justify-center transition-all shadow-xs"
          >
            <Twitter className="w-4 h-4" />
          </a>
        </div>

        {/* Telif & Enes Öztürk İmzası */}
        <p className="text-xs sm:text-sm text-stone-500 italic font-serif">
          Copyright &copy; Enes Öztürk 2026 &middot; Clean Blog Projesi 4. Bölüm (Ödev 10)
        </p>
        <p className="text-xs text-stone-400 font-mono mt-1">
          Node.js &middot; Express.js &middot; EJS &middot; Mongoose &middot; MongoDB
        </p>
      </div>
    </footer>
  );
};
