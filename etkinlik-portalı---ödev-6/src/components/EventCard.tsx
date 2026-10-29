import React from 'react';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Users, 
  ArrowUpRight, 
  Sparkles,
  Trash2,
  CheckCircle,
  Globe,
  Building2
} from 'lucide-react';
import { EventItem } from '../types/event';

interface EventCardProps {
  event: EventItem;
  onSelect: (event: EventItem) => void;
  onToggleJoin: (eventId: string) => void;
  onDelete: (eventId: string) => void;
  isUserJoined: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({
  event,
  onSelect,
  onToggleJoin,
  onDelete,
  isUserJoined,
}) => {
  // Format date nicely in Turkish locale
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        return dateObj.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          weekday: 'short',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  const percentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));
  const isFull = event.registeredCount >= event.capacity;

  return (
    <article className="group bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-slate-300 transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div>
        {/* Card Header Image or Fallback Header Pattern */}
        {event.imageUrl ? (
          <div className="relative h-44 w-full overflow-hidden bg-slate-100">
            <img
              src={event.imageUrl}
              alt={event.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white text-xs">
              <span className="font-semibold tracking-wide drop-shadow-xs">{event.category}</span>
              <span className="bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded text-[11px] font-mono tabular-nums">
                {event.registeredCount}/{event.capacity} Katılımcı
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 bg-gradient-to-r from-slate-100 via-indigo-50/40 to-slate-100 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              {event.locationType === 'online' ? (
                <Globe className="w-3.5 h-3.5 text-indigo-600" />
              ) : (
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
              )}
              <span>{event.category}</span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="text-slate-500">{event.locationType === 'online' ? 'Online' : 'Yüz Yüze'}</span>
            </div>
            {event.isCustomCreated && (
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded-full">
                <Sparkles className="w-3 h-3" /> Yeni Eklendi
              </span>
            )}
          </div>
        )}

        {/* Content Body */}
        <div className="p-5 space-y-3.5">
          {/* Metadata Bar (Zero-pill compliant clean text) */}
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="font-mono tabular-nums font-semibold text-slate-700 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {formatDate(event.date)}
            </span>
            <span aria-hidden="true" className="text-slate-300">·</span>
            <span className="font-mono tabular-nums text-slate-600 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {event.time}
            </span>
          </div>

          {/* Title */}
          <h3 
            onClick={() => onSelect(event)}
            className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors cursor-pointer line-clamp-2 leading-snug"
          >
            {event.title}
          </h3>

          {/* Description */}
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {event.description}
          </p>

          {/* Location */}
          <div className="flex items-start gap-1.5 text-xs text-slate-600 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
            <span className="line-clamp-1">{event.location}</span>
          </div>

          {/* User Input Metadata (Organizer Info) */}
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-[11px] shrink-0">
                {event.userName.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <div className="font-medium text-slate-800 truncate flex items-center gap-1">
                  <User className="w-3 h-3 text-slate-400 inline shrink-0" />
                  <span>{event.userName}</span>
                </div>
                <div className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                  <Mail className="w-3 h-3 text-slate-400 inline shrink-0" />
                  <span>{event.userEmail}</span>
                </div>
              </div>
            </div>
            
            <div className="text-right shrink-0 pl-2">
              <span className="text-[10px] text-slate-400 block">Kapasite</span>
              <span className="font-mono tabular-nums text-xs font-semibold text-slate-700">
                %{percentage}
              </span>
            </div>
          </div>

          {/* Mini Progress Bar for Capacity */}
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div 
              className={`h-full transition-all duration-300 ${
                percentage >= 90 ? 'bg-amber-500' : 'bg-indigo-600'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Card Actions Footer */}
      <div className="p-4 pt-2 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => onSelect(event)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-800 transition-colors py-1.5 px-2 rounded-lg hover:bg-indigo-50"
        >
          <span>İncele</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onToggleJoin(event.id)}
            disabled={isFull && !isUserJoined}
            className={`inline-flex items-center gap-1 text-xs font-medium py-1.5 px-3 rounded-lg border transition-all ${
              isUserJoined
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : isFull
                ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isUserJoined ? (
              <>
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>Katılıyorsun</span>
              </>
            ) : isFull ? (
              <span>Dolu</span>
            ) : (
              <>
                <Users className="w-3.5 h-3.5 text-slate-500" />
                <span>Katıl</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => onDelete(event.id)}
            title="Etkinliği Sil"
            aria-label="Etkinliği Sil"
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </article>
  );
};
