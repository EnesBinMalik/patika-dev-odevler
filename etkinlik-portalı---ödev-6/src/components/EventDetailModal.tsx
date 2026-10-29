import React from 'react';
import { 
  X, 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  Mail, 
  Users, 
  Share2, 
  Globe, 
  Building2,
  CalendarPlus,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';
import { EventItem } from '../types/event';

interface EventDetailModalProps {
  event: EventItem | null;
  isOpen: boolean;
  onClose: () => void;
  onToggleJoin: (eventId: string) => void;
  isUserJoined: boolean;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({
  event,
  isOpen,
  onClose,
  onToggleJoin,
  isUserJoined,
}) => {
  if (!isOpen || !event) return null;

  const formatDate = (dateStr: string) => {
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const year = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const day = parseInt(parts[2], 10);
        const dateObj = new Date(year, month, day);
        return dateObj.toLocaleDateString('tr-TR', {
          weekday: 'long',
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        });
      }
      return dateStr;
    } catch {
      return dateStr;
    }
  };

  // Google Calendar URL generator
  const createGoogleCalendarUrl = () => {
    const cleanDate = event.date.replace(/-/g, '');
    const cleanTime = event.time.replace(/:/g, '') + '00';
    const startIso = `${cleanDate}T${cleanTime}`;
    // End time 2 hours later
    const endHour = (parseInt(event.time.split(':')[0], 10) + 2).toString().padStart(2, '0');
    const endIso = `${cleanDate}T${endHour}${event.time.split(':')[1]}00`;
    
    const params = new URLSearchParams({
      action: 'TEMPLATE',
      text: event.title,
      details: `${event.description}\n\nDüzenleyen: ${event.userName} (${event.userEmail})`,
      location: event.location,
      dates: `${startIso}/${endIso}`,
    });
    return `https://calendar.google.com/calendar/render?${params.toString()}`;
  };

  const isFull = event.registeredCount >= event.capacity;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="relative">
          {event.imageUrl ? (
            <div className="h-52 w-full overflow-hidden bg-slate-900">
              <img
                src={event.imageUrl}
                alt={event.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
            </div>
          ) : (
            <div className="h-28 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900" />
          )}

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Kapat"
            className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-sm transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Category & Badge */}
          <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white text-xs">
            <span className="font-semibold bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
              {event.category}
            </span>
            <span className="font-mono tabular-nums text-slate-200">
              {event.locationType === 'online' ? 'Çevrimiçi Etkinlik' : 'Yüz Yüze Etkinlik'}
            </span>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 md:p-8 overflow-y-auto space-y-6">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
              {event.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-slate-600">
              <span className="flex items-center gap-1.5 font-semibold text-slate-800">
                <Calendar className="w-4 h-4 text-indigo-600" />
                {formatDate(event.date)}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5 font-mono tabular-nums">
                <Clock className="w-4 h-4 text-indigo-600" />
                {event.time}
              </span>
              <span aria-hidden="true" className="text-slate-300">·</span>
              <span className="flex items-center gap-1.5">
                <Users className="w-4 h-4 text-indigo-600" />
                <span className="font-mono tabular-nums">{event.registeredCount}/{event.capacity}</span> Katılımcı
              </span>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Etkinlik Detayları
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {event.description}
            </p>
          </div>

          {/* Location details */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
              {event.locationType === 'online' ? (
                <Globe className="w-4 h-4 text-indigo-600" />
              ) : (
                <Building2 className="w-4 h-4 text-indigo-600" />
              )}
              <span>Konum Bilgisi</span>
            </div>
            <div className="flex items-start gap-2 text-sm text-slate-800 font-medium">
              <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <span>{event.location}</span>
            </div>
          </div>

          {/* Organizer / User Inputs Display */}
          <div className="p-4 bg-indigo-50/60 rounded-xl border border-indigo-100 space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-950 flex items-center gap-2">
              <User className="w-4 h-4 text-indigo-600" />
              <span>Düzenleyen Kullanıcı (User Inputs)</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs pt-1">
              <div>
                <span className="text-slate-500 block">Yetkili / Organizatör:</span>
                <span className="text-sm font-semibold text-slate-900">{event.userName}</span>
              </div>
              <div>
                <span className="text-slate-500 block">İletişim E-Postası:</span>
                <span className="text-sm font-mono text-slate-900">{event.userEmail}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Controls */}
        <div className="p-4 md:p-6 border-t border-slate-200 bg-slate-50 flex flex-wrap items-center justify-between gap-3">
          <a
            href={createGoogleCalendarUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <CalendarPlus className="w-4 h-4 text-indigo-600" />
            <span>Google Takvime Ekle</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleJoin(event.id)}
              disabled={isFull && !isUserJoined}
              className={`inline-flex items-center gap-2 px-5 py-2.5 text-xs font-semibold rounded-xl transition-all ${
                isUserJoined
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : isFull
                  ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm'
              }`}
            >
              {isUserJoined ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kayıtlısınız (İptal Et)</span>
                </>
              ) : isFull ? (
                <span>Kontenjan Dolu</span>
              ) : (
                <>
                  <Users className="w-4 h-4" />
                  <span>Etkinliğe Kayıt Ol</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
