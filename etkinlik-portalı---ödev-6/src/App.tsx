import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Calendar, 
  Sparkles, 
  ArrowUpDown, 
  RotateCcw, 
  CheckCircle2, 
  Radio, 
  ShieldCheck, 
  Layers,
  Users,
  Compass
} from 'lucide-react';
import { EventItem, EventCategory } from './types/event';
import { INITIAL_EVENTS } from './data/initialEvents';
import { AddEventForm } from './components/AddEventForm';
import { EventCard } from './components/EventCard';
import { EventDetailModal } from './components/EventDetailModal';
import { RubricModal } from './components/RubricModal';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';

const STORAGE_KEY = 'odev6_events_enes_ozturk_v1';
const JOINED_STORAGE_KEY = 'odev6_joined_events_enes';

export default function App() {
  // Load events from LocalStorage or Fallback to Initial Seed
  const [events, setEvents] = useState<EventItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Ignore storage error
    }
    return INITIAL_EVENTS;
  });

  // Track events that the current user has joined
  const [joinedEventIds, setJoinedEventIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(JOINED_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'newest' | 'upcoming' | 'popular'>('newest');
  const [activeModalEvent, setActiveModalEvent] = useState<EventItem | null>(null);
  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [recentlyAddedId, setRecentlyAddedId] = useState<string | null>(null);

  const formSectionRef = useRef<HTMLDivElement>(null);
  const eventsSectionRef = useRef<HTMLDivElement>(null);

  // Sync to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(JOINED_STORAGE_KEY, JSON.stringify(joinedEventIds));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [joinedEventIds]);

  // Handle Event Creation (Real-Time update on homepage)
  const handleEventCreated = (newEvent: EventItem) => {
    // Prepend new event so it instantly shows at the very top of the list in real-time
    setEvents((prev) => [newEvent, ...prev]);
    setRecentlyAddedId(newEvent.id);

    // Scroll smoothly to the events listing to show the real-time addition
    setTimeout(() => {
      eventsSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 200);

    // Clear highlight indicator after 4 seconds
    setTimeout(() => {
      setRecentlyAddedId(null);
    }, 4000);
  };

  // Toggle user RSVP
  const handleToggleJoin = (eventId: string) => {
    const isJoined = joinedEventIds.includes(eventId);

    if (isJoined) {
      setJoinedEventIds((prev) => prev.filter((id) => id !== eventId));
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === eventId
            ? { ...evt, registeredCount: Math.max(0, evt.registeredCount - 1) }
            : evt
        )
      );
    } else {
      setJoinedEventIds((prev) => [...prev, eventId]);
      setEvents((prev) =>
        prev.map((evt) =>
          evt.id === eventId
            ? { ...evt, registeredCount: Math.min(evt.capacity, evt.registeredCount + 1) }
            : evt
        )
      );
    }

    // Keep active modal in sync
    if (activeModalEvent && activeModalEvent.id === eventId) {
      setActiveModalEvent((prev) =>
        prev
          ? {
              ...prev,
              registeredCount: isJoined
                ? Math.max(0, prev.registeredCount - 1)
                : Math.min(prev.capacity, prev.registeredCount + 1),
            }
          : null
      );
    }
  };

  // Delete event
  const handleDeleteEvent = (eventId: string) => {
    const confirmed = window.confirm('Bu etkinliği kaldırmak istediğinize emin misiniz?');
    if (confirmed) {
      setEvents((prev) => prev.filter((evt) => evt.id !== eventId));
      setJoinedEventIds((prev) => prev.filter((id) => id !== eventId));
      if (activeModalEvent?.id === eventId) {
        setActiveModalEvent(null);
      }
    }
  };

  // Reset to default sample events
  const handleResetDefaults = () => {
    const confirmed = window.confirm('Tüm etkinlikleri varsayılan başlangıç verilerine sıfırlamak istiyor musunuz?');
    if (confirmed) {
      setEvents(INITIAL_EVENTS);
      setJoinedEventIds([]);
      setSelectedCategory('all');
      setSearchQuery('');
    }
  };

  // Filtered and Sorted Events
  const filteredEvents = useMemo(() => {
    return events
      .filter((evt) => {
        // Category filter
        if (selectedCategory !== 'all' && evt.category !== selectedCategory) {
          return false;
        }
        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase().trim();
          const matchTitle = evt.title.toLowerCase().includes(q);
          const matchDesc = evt.description.toLowerCase().includes(q);
          const matchLoc = evt.location.toLowerCase().includes(q);
          const matchUser = evt.userName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchLoc && !matchUser) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'upcoming') {
          const dateA = new Date(`${a.date}T${a.time || '00:00'}`).getTime();
          const dateB = new Date(`${b.date}T${b.time || '00:00'}`).getTime();
          return dateA - dateB;
        }
        if (sortBy === 'popular') {
          return b.registeredCount - a.registeredCount;
        }
        return 0;
      });
  }, [events, selectedCategory, searchQuery, sortBy]);

  // Total statistics for hero banner
  const stats = useMemo(() => {
    const totalAttendees = events.reduce((sum, e) => sum + e.registeredCount, 0);
    const totalCapacity = events.reduce((sum, e) => sum + e.capacity, 0);
    return {
      totalEvents: events.length,
      totalAttendees,
      totalCapacity,
      totalJoined: joinedEventIds.length,
    };
  }, [events, joinedEventIds]);

  const scrollToForm = () => {
    formSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 selection:bg-indigo-500 selection:text-white">
      {/* Top Navbar Contract */}
      <Navbar onOpenRubric={() => setIsRubricOpen(true)} onScrollToForm={scrollToForm} />

      {/* Hero & Requirements Header */}
      <section className="bg-white border-b border-slate-200/90 py-10 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            {/* Top Rubric Flag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold mb-3 border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>Ödev 6 · Yeni Etkinlik Ekleme & Gerçek Zamanlı Listeleme</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Etkinlik Portalı
            </h1>

            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed text-balance">
              Form üzerinden yeni etkinliklerinizi ekleyin; inputların kilitlenme ve loading indicator süreçlerini inceleyin. Eklenen tüm kayıtlar ana sayfadaki canlı listeye <strong>gerçek zamanlı (real-time)</strong> olarak yansır.
            </p>

            {/* Author Signature Line */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs text-slate-600">
              <span className="font-semibold text-slate-900 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                İmza: ENES ÖZTÜRK
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span>Öğrenci / Geliştirici İmzasıyla Teslim Edilmiştir</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <button
                type="button"
                onClick={() => setIsRubricOpen(true)}
                className="text-indigo-600 font-semibold hover:underline"
              >
                Gereksinim Değerlendirme Raporu &rarr;
              </button>
            </div>
          </div>

          {/* Quick Metrics Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-100">
            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Canlı Etkinlik Sayısı
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {stats.totalEvents}
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Toplam Kayıtlı Katılımcı
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-slate-900 mt-0.5">
                {stats.totalAttendees}
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Katıldığın Etkinlikler
              </div>
              <div className="text-2xl font-bold font-mono tabular-nums text-indigo-600 mt-0.5">
                {stats.totalJoined}
              </div>
            </div>

            <div className="p-4 bg-slate-50/80 rounded-xl border border-slate-100 flex flex-col justify-between">
              <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                Listeleme Durumu
              </div>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                <span className="text-xs font-semibold text-emerald-700">Gerçek Zamanlı Aktif</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Workspace Layout */}
      <main className="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full space-y-12">
        {/* Section 1: Event Form Section (Requirement #1 & #3) */}
        <section ref={formSectionRef} id="form-section" className="scroll-mt-20">
          <AddEventForm onEventCreated={handleEventCreated} />
        </section>

        {/* Section 2: Real-time Event Feed (Requirement #2) */}
        <section ref={eventsSectionRef} id="events-section" className="scroll-mt-20 space-y-6">
          {/* Feed Controls Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                  Canlı Etkinlik Akışı
                </h2>
                <span className="text-xs font-mono tabular-nums bg-indigo-50 text-indigo-700 font-semibold px-2 py-0.5 rounded-md">
                  {filteredEvents.length} Kayıt
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Yeni eklenen etkinlikler anında listenin en başında gerçek zamanlı olarak görüntülenir.
              </p>
            </div>

            {/* Actions: Sort & Reset Defaults */}
            <div className="flex flex-wrap items-center gap-2.5">
              <div className="flex items-center gap-1.5 bg-white border border-slate-200 rounded-xl px-3 py-1.5 shadow-2xs">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-xs text-slate-500">Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="text-xs font-medium text-slate-700 bg-transparent outline-none cursor-pointer"
                >
                  <option value="newest">En Yeni Eklenenler</option>
                  <option value="upcoming">Tarihe Göre (Yaklaşan)</option>
                  <option value="popular">En Çok Katılımcı</option>
                </select>
              </div>

              <button
                type="button"
                onClick={handleResetDefaults}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-2xs"
                title="Başlangıç örnek verilerini geri yükler"
              >
                <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
                <span>Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Search and Category Filters Bar */}
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Etkinlik adı, mekan veya düzenleyen ara..."
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-white border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Temizle
                </button>
              )}
            </div>

            {/* Category Segmented Controls (Interactive filter buttons) */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 max-w-full no-scrollbar">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                  selectedCategory === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                }`}
              >
                Tümü ({events.length})
              </button>
              {(['Teknoloji', 'Tasarım & Sanat', 'Eğitim & Kariyer', 'Girişimcilik'] as EventCategory[]).map((cat) => {
                const count = events.filter((e) => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-slate-900 text-white shadow-2xs'
                        : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>
          </div>

          {/* Events Grid */}
          {filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((evt) => (
                <div 
                  key={evt.id} 
                  className={recentlyAddedId === evt.id ? 'ring-2 ring-emerald-500 rounded-2xl transition-all duration-500' : ''}
                >
                  <EventCard
                    event={evt}
                    onSelect={(e) => setActiveModalEvent(e)}
                    onToggleJoin={handleToggleJoin}
                    onDelete={handleDeleteEvent}
                    isUserJoined={joinedEventIds.includes(evt.id)}
                  />
                </div>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="p-12 text-center bg-white rounded-2xl border border-slate-200/90 shadow-2xs space-y-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 mx-auto flex items-center justify-center">
                <Calendar className="w-6 h-6" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="text-base font-bold text-slate-900">Aradığınız Kriterlere Uygun Etkinlik Bulunamadı</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Arama filtrenizi temizleyebilir ya da yukarıdaki formu kullanarak yeni bir etkinlik oluşturabilirsiniz.
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('all');
                    setSearchQuery('');
                  }}
                  className="px-4 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Filtreleri Temizle
                </button>
                <button
                  type="button"
                  onClick={scrollToForm}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-colors shadow-2xs"
                >
                  Yeni Etkinlik Ekle
                </button>
              </div>
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      <EventDetailModal
        event={activeModalEvent}
        isOpen={!!activeModalEvent}
        onClose={() => setActiveModalEvent(null)}
        onToggleJoin={handleToggleJoin}
        isUserJoined={activeModalEvent ? joinedEventIds.includes(activeModalEvent.id) : false}
      />

      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
      />

      {/* Footer with Signature */}
      <Footer onOpenRubric={() => setIsRubricOpen(true)} />
    </div>
  );
}
