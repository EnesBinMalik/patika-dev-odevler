import React from 'react';
import type { EventItem } from '../types';
import { Calendar, Clock, MapPin, Users, ArrowRight, UserCheck } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelect: (id: string) => void;
  isRecentlyAdded?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, isRecentlyAdded = false }) => {
  const percentFull = Math.min(100, Math.round((event.participantsCount / event.capacity) * 100));

  return (
    <div
      onClick={() => onSelect(event.id)}
      className={`group relative flex flex-col bg-slate-900/90 rounded-2xl border transition-all duration-300 overflow-hidden cursor-pointer hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1 ${
        isRecentlyAdded
          ? 'border-indigo-500 ring-2 ring-indigo-500/40 bg-indigo-950/20'
          : 'border-slate-800 hover:border-slate-700'
      }`}
    >
      {/* Thumbnail */}
      <div className="relative h-48 w-full overflow-hidden bg-slate-950">
        <img
          src={event.image}
          alt={event.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

        {/* Category Badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-indigo-300 border border-slate-700/60 shadow-sm">
            {event.category}
          </span>
        </div>

        {/* Real-time participant counter chip */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold bg-slate-950/90 backdrop-blur-md text-emerald-400 border border-emerald-500/30 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>{event.participantsCount} Katılımcı</span>
        </div>

        {/* Organizer watermark */}
        <div className="absolute bottom-2 left-3 text-[11px] font-medium text-slate-300 flex items-center gap-1">
          <span className="text-slate-400">Organizatör:</span>
          <span className="text-white font-semibold">{event.organizer}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
            {event.title}
          </h3>
          <p className="mt-1.5 text-xs text-slate-400 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Details */}
          <div className="mt-4 space-y-2 text-xs text-slate-300">
            <div className="flex items-center gap-2 text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{event.date}</span>
              <span className="text-slate-600">•</span>
              <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>{event.time}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-400 line-clamp-1">
              <MapPin className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span className="truncate">{event.location}</span>
            </div>
          </div>
        </div>

        {/* Capacity bar & attendees preview */}
        <div className="mt-5 pt-4 border-t border-slate-800/80">
          <div className="flex items-center justify-between text-xs mb-1.5">
            <div className="flex items-center gap-1.5 text-slate-400 font-medium">
              <Users className="w-3.5 h-3.5 text-slate-400" />
              <span>Kontenjan: {event.participantsCount} / {event.capacity}</span>
            </div>
            <span className="text-[11px] font-semibold text-slate-400">
              %{percentFull}
            </span>
          </div>

          {/* Progress track */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 rounded-full ${
                percentFull > 85 ? 'bg-amber-500' : 'bg-indigo-500'
              }`}
              style={{ width: `${percentFull}%` }}
            />
          </div>

          {/* Avatar stack + View Detail CTA */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center -space-x-2 overflow-hidden">
              {event.participants.slice(0, 4).map((p) => (
                <img
                  key={p.id}
                  src={p.avatar}
                  alt={p.name}
                  title={`${p.name} (${p.role})`}
                  className="inline-block h-6 w-6 rounded-full ring-2 ring-slate-900 object-cover"
                />
              ))}
              {event.participants.length > 4 && (
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 ring-2 ring-slate-900">
                  +{event.participants.length - 4}
                </div>
              )}
              {event.participants.length === 0 && (
                <span className="text-[11px] text-slate-500 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> İlk sen katıl!
                </span>
              )}
            </div>

            <div className="flex items-center gap-1 text-xs font-semibold text-indigo-400 group-hover:text-indigo-300 group-hover:translate-x-0.5 transition-all">
              <span>Detaylar & Katıl</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
