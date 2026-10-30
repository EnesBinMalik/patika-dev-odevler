import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client/react';
import { GET_EVENTS } from '../graphql/queries.ts';
import { EventCard, type EventListItem } from './EventCard.tsx';
import {
  Search,
  Calendar,
  AlertCircle,
  RefreshCw,
  Plus,
  SlidersHorizontal,
} from 'lucide-react';

interface EventListProps {
  onSelectEvent: (id: string) => void;
  onOpenCreate: () => void;
}

export const EventList: React.FC<EventListProps> = ({ onSelectEvent, onOpenCreate }) => {
  const { data, loading, error, refetch } = useQuery<{ events: EventListItem[] }>(
    GET_EVENTS,
    {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: 'cache-and-network',
    }
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState<'all' | 'november' | 'december'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'participants'>('date');

  const filteredEvents = useMemo(() => {
    if (!data?.events) return [];
    let list = [...data.events];

    // Filter by search query (title, desc, location name)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.desc.toLowerCase().includes(q) ||
          e.location?.name.toLowerCase().includes(q) ||
          e.user?.username.toLowerCase().includes(q)
      );
    }

    // Filter by date
    if (dateFilter === 'november') {
      list = list.filter((e) => e.date.includes('-11-'));
    } else if (dateFilter === 'december') {
      list = list.filter((e) => e.date.includes('-12-'));
    }

    // Sort
    if (sortBy === 'participants') {
      list.sort((a, b) => b.participants.length - a.participants.length);
    } else {
      list.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }

    return list;
  }, [data?.events, searchQuery, dateFilter, sortBy]);

  return (
    <section id="events-section" className="py-12 bg-[#fafafa]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-700 tracking-wide mb-1.5">
              <span>APOLLO CLIENT USEQUERY</span>
              <span aria-hidden="true">·</span>
              <span>GET_EVENTS</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Aktif Etkinlikler
            </h2>
            <p className="text-sm text-slate-500 mt-1 max-w-xl">
              GraphQL sunucusundan çekilen etkinliklerin adı, açıklaması ve zamanı anlık olarak listelenmektedir.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => refetch()}
              title="Apollo Client ile Yeniden Sorgula"
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:bg-slate-50 rounded-lg shadow-2xs transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin text-indigo-600' : 'text-slate-500'}`} />
              <span>Yenile</span>
            </button>
            <button
              onClick={onOpenCreate}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-2xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Etkinlik Ekle</span>
            </button>
          </div>
        </div>

        {/* Filter & Search Bar */}
        <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-2xs mb-8">
          <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Etkinlik adı, açıklama veya lokasyon ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Segmented Filter Controls */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/70">
                <button
                  onClick={() => setDateFilter('all')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dateFilter === 'all'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Tüm Aylar
                </button>
                <button
                  onClick={() => setDateFilter('november')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dateFilter === 'november'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Kasım 2026
                </button>
                <button
                  onClick={() => setDateFilter('december')}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                    dateFilter === 'december'
                      ? 'bg-white text-slate-900 shadow-2xs font-semibold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Aralık 2026
                </button>
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-1.5 text-xs text-slate-600 bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg">
                <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                <span>Sırala:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="bg-transparent font-medium text-slate-800 focus:outline-none cursor-pointer"
                >
                  <option value="date">Tarihe Göre (Önce En Yakın)</option>
                  <option value="participants">Katılımcı Sayısına Göre</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && !data && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-slate-200 p-6 animate-pulse"
              >
                <div className="h-4 bg-slate-200 rounded w-1/3 mb-4"></div>
                <div className="h-6 bg-slate-200 rounded w-4/5 mb-3"></div>
                <div className="h-4 bg-slate-100 rounded w-full mb-2"></div>
                <div className="h-4 bg-slate-100 rounded w-2/3 mb-6"></div>
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <div className="h-5 bg-slate-200 rounded w-24"></div>
                  <div className="h-5 bg-slate-200 rounded w-16"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="p-6 bg-rose-50 border border-rose-200 rounded-xl text-center max-w-lg mx-auto">
            <AlertCircle className="w-10 h-10 text-rose-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-rose-900 mb-1">
              GraphQL Verisi Yüklenemedi
            </h3>
            <p className="text-xs text-rose-700 mb-4 font-mono">{error.message}</p>
            <button
              onClick={() => refetch()}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Tekrar Dene</span>
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredEvents.length === 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center max-w-md mx-auto">
            <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 mb-1">
              Etkinlik Bulunamadı
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Arama kriterlerinize uygun etkinlik kaydı bulunamadı veya henüz etkinlik eklenmedi.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setDateFilter('all');
              }}
              className="px-3.5 py-1.5 text-xs font-semibold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors"
            >
              Filtreleri Temizle
            </button>
          </div>
        )}

        {/* Events Grid */}
        {!loading && !error && filteredEvents.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event, index) => (
              <EventCard
                key={event.id}
                event={event}
                index={index}
                onSelect={onSelectEvent}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
