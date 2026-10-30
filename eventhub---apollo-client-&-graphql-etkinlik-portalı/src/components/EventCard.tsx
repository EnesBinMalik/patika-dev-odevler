import React from 'react';
import {
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Users,
  ArrowUpRight,
} from 'lucide-react';

export interface EventListItem {
  id: string;
  title: string;
  desc: string;
  date: string;
  from: string;
  to: string;
  user: {
    id: string;
    username: string;
    email: string;
    role?: string;
    avatarColor?: string;
  };
  location: {
    id: string;
    name: string;
    desc?: string;
  };
  participants: Array<{
    id: string;
    user: {
      id: string;
      username: string;
      avatarColor?: string;
    };
  }>;
}

interface EventCardProps {
  event: EventListItem;
  onSelect: (id: string) => void;
  index: number;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelect, index }) => {
  // Format Turkish date
  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('tr-TR', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
    } catch {
      // fallback
    }
    return dateStr;
  };

  return (
    <article className="group bg-white rounded-xl border border-slate-200/90 hover:border-indigo-400 hover:shadow-lg transition-all duration-200 flex flex-col justify-between overflow-hidden">
      <div className="p-5 sm:p-6">
        {/* Top unboxed metadata: Date & Time as clean text with separators */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
          <span className="flex items-center gap-1 font-medium text-indigo-700">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>{formatDate(event.date)}</span>
          </span>
          <span aria-hidden="true" className="text-slate-300">·</span>
          <span className="flex items-center gap-1 font-mono text-slate-600">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{event.from} – {event.to}</span>
          </span>
        </div>

        {/* Etkinlik Adı (Title) */}
        <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-2 leading-snug mb-2.5">
          {event.title}
        </h3>

        {/* Açıklaması (Description) */}
        <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed mb-5">
          {event.desc}
        </p>

        {/* Secondary context: Konum & Düzenleyici */}
        <div className="space-y-1.5 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate font-medium text-slate-700">
              {event.location?.name || 'Belirtilmemiş'}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <UserIcon className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              Düzenleyen: <span className="font-medium text-slate-800">@{event.user?.username}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Card Footer with participant count and CTA */}
      <div className="px-5 sm:px-6 py-3.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="flex -space-x-1.5 overflow-hidden">
            {event.participants.slice(0, 3).map((p, i) => (
              <div
                key={p.id || i}
                title={`@${p.user?.username}`}
                className={`inline-block h-6 w-6 rounded-full ring-2 ring-white text-[10px] font-bold text-white flex items-center justify-center ${
                  p.user?.avatarColor || 'bg-indigo-600'
                }`}
              >
                {p.user?.username?.[0]?.toUpperCase() || 'U'}
              </div>
            ))}
          </div>
          <span className="text-xs font-medium text-slate-600 font-mono tabular-nums">
            {event.participants.length} Katılımcı
          </span>
        </div>

        <button
          onClick={() => onSelect(event.id)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline transition-all whitespace-nowrap focus:outline-none"
        >
          <span>Detayları İncele</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
};
