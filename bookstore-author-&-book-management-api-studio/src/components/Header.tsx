import React from 'react';
import { BookOpen, Users, BookmarkCheck, Layers, RotateCcw, Award } from 'lucide-react';
import { libraryStore } from '../services/libraryStore';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab, onReset }) => {
  const authors = libraryStore.getRawAuthors();
  const books = libraryStore.getBooks();
  const genres = libraryStore.getGenres();
  const publishedBooks = books.filter((b) => b.isPublished);

  const navItems = [
    { id: 'authors', label: 'Yazarlar (Author)', count: authors.length, icon: Users },
    { id: 'books', label: 'Kitaplar & İlişkiler', count: books.length, icon: BookOpen },
    { id: 'api-explorer', label: 'API Stüdyosu (Swagger)', count: 5, icon: Layers },
    { id: 'csharp-code', label: 'C# .NET Mimari Kodları', count: 7, icon: BookmarkCheck },
    { id: 'rubric-checker', label: 'Ödev Test Senaryoları', badge: '7/7', icon: Award },
  ];

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-xs">
      {/* Top Banner / Signature Line */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white px-4 py-2 text-xs">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              .NET 8 Web API Ödevi
            </span>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-200 font-medium hidden sm:inline">
              Author Controller, Servisler, DTO, AutoMapper &amp; FluentValidation
            </span>
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <span className="text-slate-400">Geliştirici &amp; İmza:</span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-200 font-bold tracking-wide border border-indigo-400/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Enes Öztürk
            </span>
          </div>
        </div>
      </div>

      {/* Main Header Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-500 text-white flex items-center justify-center shadow-md shadow-indigo-500/20">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
                  BookStore API &amp; Author Studio
                  <span className="text-xs px-2 py-0.5 rounded font-mono font-medium bg-indigo-50 text-indigo-700 border border-indigo-100">
                    v1.0
                  </span>
                </h1>
                <p className="text-xs sm:text-sm text-slate-500">
                  Kitap - Yazar - Tür ilişkileri &amp; İş Kuralı Doğrulama Paneli
                </p>
              </div>
            </div>
          </div>

          {/* Quick Metrics & Reset */}
          <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
            <div className="hidden lg:flex items-center gap-3 px-3 py-1.5 rounded-lg bg-slate-50 border border-slate-200 text-xs">
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Yazarlar</span>
                <span className="font-bold text-slate-800">{authors.length}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Kitaplar</span>
                <span className="font-bold text-slate-800">{books.length}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Yayında</span>
                <span className="font-bold text-emerald-600">{publishedBooks.length}</span>
              </div>
              <div className="w-px h-6 bg-slate-200" />
              <div className="text-center">
                <span className="text-slate-400 block text-[10px] uppercase font-semibold">Türler</span>
                <span className="font-bold text-slate-800">{genres.length}</span>
              </div>
            </div>

            <button
              onClick={onReset}
              title="İlk başlangıç verilerine dön"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 bg-white hover:bg-slate-100 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Verileri Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <nav className="flex items-center gap-1 mt-4 sm:mt-5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-xs shadow-indigo-600/30 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{item.label}</span>
                {item.count !== undefined && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-indigo-700/80 text-white' : 'bg-slate-200/80 text-slate-600'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
                {item.badge && (
                  <span
                    className={`text-[11px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-800'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
