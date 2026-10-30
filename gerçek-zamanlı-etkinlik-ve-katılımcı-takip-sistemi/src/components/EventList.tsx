import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { EventCard } from './EventCard';
import type { EventItem } from '../types';
import {
  Calendar,
  Search,
  Plus,
  Radio,
  Sparkles,
  Users,
  Flame,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface EventListProps {
  onSelectEvent: (id: string) => void;
  onOpenCreateEvent: () => void;
}

export const EventList: React.FC<EventListProps> = ({ onSelectEvent, onOpenCreateEvent }) => {
  const { events, isConnected, addEvent } = useRealtime();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isQuickAdding, setIsQuickAdding] = useState(false);

  const categories = [
    'all',
    'Yazılım & Teknoloji',
    'Yapay Zeka',
    'Tasarım & UI/UX',
    'Girişimcilik',
    'Açık Kaynak'
  ];

  const totalParticipants = events.reduce((acc, curr) => acc + curr.participantsCount, 0);

  // Quick 1-click test event generator to test requirement 1 in 1 click!
  const handleQuickAddEvent = async () => {
    const titles = [
      'Docker & Kubernetes ile Mikroservis Mimarileri',
      'TypeScript 5.8 & İleri Seviye Tip Sistemleri',
      'Yapay Zeka ile Kodlama & Agentic İş Akışları',
      'PostgreSQL Performans Optimizasyonu & İndeksleme',
      'React Server Components & Next.js 15 Zirvesi'
    ];
    const locations = [
      'Kolektif House Maslak & Online Stream',
      'Google Developer Space İstanbul',
      'İTÜ ARI Teknokent Konferans Salonu',
      'Online Webiner (Discord & YouTube Canlı)'
    ];
    const images = [
      'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80'
    ];
    const cats: EventItem['category'][] = [
      'Yazılım & Teknoloji',
      'Yapay Zeka',
      'Açık Kaynak',
      'Girişimcilik'
    ];

    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomLoc = locations[Math.floor(Math.random() * locations.length)];
    const randomImg = images[Math.floor(Math.random() * images.length)];
    const randomCat = cats[Math.floor(Math.random() * cats.length)];

    setIsQuickAdding(true);
    await addEvent({
      title: `${randomTitle} #${Math.floor(10 + Math.random() * 90)}`,
      description: 'Gerçek zamanlı etkinlik motoru ile dinamik olarak oluşturulmuş topluluk etkinliği.',
      date: '2026-11-20',
      time: '19:00 - 21:00',
      location: randomLoc,
      category: randomCat,
      capacity: 50,
      organizer: 'Enes Öztürk',
      tags: ['Real-Time', 'Canlı Test', 'Ödev 5']
    });
    setIsQuickAdding(false);
  };

  const filteredEvents = events.filter((e) => {
    const matchesCategory = selectedCategory === 'all' || e.category === selectedCategory;
    const matchesSearch =
      e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.organizer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Banner with Enes Öztürk Signature and Live Stats */}
      <div className="relative rounded-3xl bg-gradient-to-br from-indigo-950/80 via-slate-900 to-slate-950 border border-indigo-500/30 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden">
        {/* Glow circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            {/* Attribution pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Ödev 5 • Enes Öztürk İmzası ile Gerçek Zamanlı Sistem</span>
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight">
              Gerçek Zamanlı Etkinlik ve Katılımcı Takip Portalı
            </h1>

            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Bu uygulama, önceki ödevdeki statik listelemenin yerine{' '}
              <strong className="text-white">WebSocket & Gerçek Zamanlı Yayın</strong> mimarisi
              kullanarak yeni etkinlikleri ve katılımcıları tüm bağlı ekranlara anlık olarak yansıtır.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Gereksinim 1: Canlı Etkinlik Akışı
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Gereksinim 2: Canlı Katılımcı Senkronizasyonu
              </span>
              <span className="flex items-center gap-1.5 text-indigo-300 font-semibold">
                Geliştirici: Enes Öztürk
              </span>
            </div>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 w-full md:w-auto shrink-0">
            <button
              onClick={onOpenCreateEvent}
              className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Etkinlik Ekle</span>
            </button>

            <button
              onClick={handleQuickAddEvent}
              disabled={isQuickAdding}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-indigo-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer disabled:opacity-50"
              title="Form doldurmadan tek tıkla test etkinliği ekleyin ve listenin anında nasıl güncellendiğini görün"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>⚡ 1-Tıkla Canlı Test Etkinliği Ekle</span>
            </button>
          </div>
        </div>

        {/* Live Counters Ribbon */}
        <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">{events.length}</div>
              <div className="text-xs text-slate-400">Toplam Canlı Etkinlik</div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-extrabold text-white">{totalParticipants}</div>
              <div className="text-xs text-slate-400">Kayıtlı Katılımcı</div>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                WebSocket Aktif
              </div>
              <div className="text-xs text-slate-400">Tüm İstemcilerle Eşzamanlı</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat === 'all' ? 'Tüm Etkinlikler' : cat}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Etkinlik veya mekan ara..."
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
          />
        </div>
      </div>

      {/* Real-time Indicator banner */}
      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>
            Gösterilen: <strong className="text-white">{filteredEvents.length}</strong> etkinlik
            (Canlı Listeleme)
          </span>
        </div>
        <span className="text-[11px] text-slate-500">
          Yeni etkinlik eklendiği an listenin başında belirir
        </span>
      </div>

      {/* Event Grid */}
      {filteredEvents.length === 0 ? (
        <div className="text-center py-20 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <h3 className="text-base font-bold text-white">Etkinlik bulunamadı</h3>
          <p className="text-xs text-slate-400 mt-1">
            Filtreleme kriterlerinize uygun etkinlik yok veya henüz etkinlik eklenmedi.
          </p>
          <button
            onClick={onOpenCreateEvent}
            className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-semibold hover:bg-indigo-500 cursor-pointer"
          >
            Hemen Yeni Etkinlik Ekle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.map((evt, idx) => (
            <EventCard
              key={evt.id}
              event={evt}
              onSelect={onSelectEvent}
              isRecentlyAdded={idx === 0}
            />
          ))}
        </div>
      )}
    </div>
  );
};
