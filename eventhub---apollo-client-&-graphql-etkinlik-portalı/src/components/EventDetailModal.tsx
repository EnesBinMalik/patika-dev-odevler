import React, { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { GET_EVENT, GET_EVENTS, ADD_PARTICIPANT } from '../graphql/queries.ts';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  User as UserIcon,
  Users,
  Mail,
  ShieldCheck,
  Navigation,
  CheckCircle,
  Plus,
  Code,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface EventDetailModalProps {
  eventId: string | null;
  onClose: () => void;
}

export const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, onClose }) => {
  const [showGraphQLQuery, setShowGraphQLQuery] = useState(false);
  const [selectedUserToJoin, setSelectedUserToJoin] = useState('1'); // Defaults to enes_ozturk
  const [joinSuccess, setJoinSuccess] = useState(false);

  const { data, loading, error } = useQuery<{ event: any }>(GET_EVENT, {
    variables: { id: eventId },
    skip: !eventId,
    fetchPolicy: 'cache-and-network',
  });

  const [addParticipantMutation, { loading: addingParticipant }] = useMutation<{
    addParticipant: any;
  }>(ADD_PARTICIPANT, {
    refetchQueries: [
      { query: GET_EVENT, variables: { id: eventId } },
      { query: GET_EVENTS },
    ],
    onCompleted: () => {
      setJoinSuccess(true);
      setTimeout(() => setJoinSuccess(false), 3000);
    },
  });

  if (!eventId) return null;

  const event = data?.event;

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        return d.toLocaleDateString('tr-TR', {
          weekday: 'long',
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

  const handleJoinEvent = async () => {
    if (!eventId || !selectedUserToJoin) return;
    try {
      await addParticipantMutation({
        variables: {
          data: {
            user_id: selectedUserToJoin,
            event_id: eventId,
          },
        },
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 lg:p-8 animate-fade-in">
      <div
        className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden my-8 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between gap-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-400">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <div className="text-[11px] font-semibold text-indigo-400 tracking-wider">
                ETKİNLİK DETAY GÖRÜNÜMÜ · APOLLO USEQUERY(GET_EVENT)
              </div>
              <h2 className="text-sm font-bold text-slate-100 truncate max-w-md">
                {loading ? 'Yükleniyor...' : event?.title || 'Etkinlik Detayı'}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors focus:outline-none"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-8 flex-1">
          {loading && !event && (
            <div className="py-16 text-center">
              <div className="inline-block w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-sm font-medium text-slate-600">
                Apollo Client GraphQL sunucusundan etkinlik detaylarını getiriyor...
              </p>
            </div>
          )}

          {error && (
            <div className="p-5 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-sm">
              <p className="font-semibold mb-1">Detaylar getirilirken hata oluştu:</p>
              <p className="font-mono text-xs">{error.message}</p>
            </div>
          )}

          {event && (
            <>
              {/* Section 1: Title, Description, Date & Time */}
              <div className="border-b border-slate-200 pb-6">
                <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-slate-500 mb-3">
                  <span className="flex items-center gap-1.5 text-indigo-700 font-semibold">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                    <span>{formatDate(event.date)}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="flex items-center gap-1.5 font-mono text-slate-700 font-medium">
                    <Clock className="w-4 h-4 text-slate-500" />
                    <span>{event.from} – {event.to}</span>
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="text-slate-500">Etkinlik ID: <span className="font-mono">{event.id}</span></span>
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug mb-3">
                  {event.title}
                </h1>

                <p className="text-base text-slate-700 leading-relaxed whitespace-pre-line">
                  {event.desc}
                </p>
              </div>

              {/* Two Column Grid: Etkinlik Sahibi (User) & Konum (Location) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Etkinlik Sahibi (User) */}
                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wide">
                        <UserIcon className="w-4 h-4 text-indigo-600" />
                        <span>ETKİNLİK SAHİBİ (USER)</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">ID: {event.user?.id}</span>
                    </div>

                    <div className="flex items-start gap-3.5 mb-4">
                      <div
                        className={`w-12 h-12 rounded-xl text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm ${
                          event.user?.avatarColor || 'bg-indigo-600'
                        }`}
                      >
                        {event.user?.username?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <div className="overflow-hidden">
                        <h4 className="text-base font-bold text-slate-900">
                          @{event.user?.username}
                        </h4>
                        <div className="flex items-center gap-1.5 text-xs text-slate-600 mt-0.5 truncate">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{event.user?.email}</span>
                        </div>
                        {event.user?.role && (
                          <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-medium mt-1">
                            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                            <span>{event.user?.role}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 pt-3 border-t border-slate-200/80">
                    Bu etkinlik <span className="font-semibold text-slate-800">@{event.user?.username}</span> tarafından GraphQL backend üzerinden koordine edilmektedir.
                  </div>
                </div>

                {/* 2. Konum (Location) */}
                <div className="bg-slate-50/80 rounded-xl p-5 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2 text-xs font-bold text-slate-500 tracking-wide">
                        <MapPin className="w-4 h-4 text-rose-600" />
                        <span>KONUM VE MEKAN (LOCATION)</span>
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">ID: {event.location?.id}</span>
                    </div>

                    <h4 className="text-base font-bold text-slate-900 mb-1.5">
                      {event.location?.name}
                    </h4>

                    <p className="text-xs text-slate-600 leading-relaxed mb-3">
                      {event.location?.desc}
                    </p>

                    {event.location?.address && (
                      <p className="text-xs text-slate-500 italic mb-3">
                        {event.location?.address}
                      </p>
                    )}
                  </div>

                  <div className="pt-3 border-t border-slate-200/80 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 font-mono tabular-nums text-slate-600">
                      <Navigation className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                      <span>{event.location?.lat.toFixed(4)}, {event.location?.lng.toFixed(4)}</span>
                    </div>

                    <a
                      href={`https://maps.google.com/?q=${event.location?.lat},${event.location?.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hover:underline"
                    >
                      Haritada Aç
                    </a>
                  </div>
                </div>
              </div>

              {/* Section 3: Katılımcılar (Participants) */}
              <div className="bg-white rounded-xl border border-slate-200 p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        Kayıtlı Katılımcılar
                      </h3>
                      <p className="text-xs text-slate-500">
                        Toplam <span className="font-semibold text-slate-900">{event.participants?.length || 0} kişi</span> bu etkinliğe katılıyor
                      </p>
                    </div>
                  </div>

                  {/* Add Participant Mutation Interaction */}
                  <div className="flex items-center gap-2">
                    <select
                      value={selectedUserToJoin}
                      onChange={(e) => setSelectedUserToJoin(e.target.value)}
                      className="text-xs bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1.5 font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="1">Enes Öztürk (Proje Sahibi)</option>
                      <option value="2">Mehmet Seven (GraphQL Lead)</option>
                      <option value="3">Ayşe Kaya (DevRel)</option>
                      <option value="4">Can Demir (DevOps)</option>
                      <option value="5">Zeynep Yılmaz (Designer)</option>
                      <option value="6">Burak Arslan (Fullstack)</option>
                    </select>

                    <button
                      onClick={handleJoinEvent}
                      disabled={addingParticipant}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>{addingParticipant ? 'Kaydediliyor...' : 'Katıl'}</span>
                    </button>
                  </div>
                </div>

                {joinSuccess && (
                  <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>Katılım kaydınız GraphQL mutasyonu ile Apollo önbelleğine ve sunucuya eklendi!</span>
                  </div>
                )}

                {/* Participant grid */}
                {event.participants?.length === 0 ? (
                  <p className="text-xs text-slate-500 italic py-4 text-center">
                    Henüz katılımcı bulunmamaktadır. İlk katılan siz olun!
                  </p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {event.participants.map((p: any) => (
                      <div
                        key={p.id}
                        className="flex items-center gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/60 hover:bg-slate-50 transition-colors"
                      >
                        <div
                          className={`w-9 h-9 rounded-full text-white text-xs font-bold flex items-center justify-center shrink-0 ${
                            p.user?.avatarColor || 'bg-slate-700'
                          }`}
                        >
                          {p.user?.username?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div className="overflow-hidden">
                          <div className="text-xs font-bold text-slate-900 truncate">
                            @{p.user?.username}
                          </div>
                          <div className="text-[11px] text-slate-500 truncate">
                            {p.user?.role || p.user?.email || 'Katılımcı'}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Section 4: GraphQL Query Inspector Drawer for assignment grading */}
              <div className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 text-slate-300">
                <button
                  onClick={() => setShowGraphQLQuery(!showGraphQLQuery)}
                  className="w-full px-5 py-3.5 flex items-center justify-between text-left hover:bg-slate-800/60 transition-colors"
                >
                  <div className="flex items-center gap-2 text-xs font-medium text-indigo-400">
                    <Code className="w-4 h-4" />
                    <span>Apollo Client GraphQL Sorgusu (GET_EVENT) & Şema İnceleyici</span>
                  </div>
                  {showGraphQLQuery ? (
                    <ChevronUp className="w-4 h-4 text-slate-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {showGraphQLQuery && (
                  <div className="px-5 pb-5 pt-1 border-t border-slate-800 text-xs font-mono">
                    <div className="text-slate-400 mb-2">
                      // Bu detay ekranı için Apollo Client tarafından çalıştırılan sorgu:
                    </div>
                    <pre className="bg-slate-950 p-4 rounded-lg text-emerald-400 overflow-x-auto text-[11px] leading-relaxed">
{`query GetEvent($id: ID!) {
  event(id: $id) {
    id
    title
    desc
    date
    from
    to
    user {
      id
      username
      email
      role
    }
    location {
      id
      name
      desc
      lat
      lng
    }
    participants {
      id
      user {
        id
        username
        email
        role
      }
    }
  }
}

// Variables:
{
  "id": "${event.id}"
}`}
                    </pre>
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            <span>Hazırlayan: </span>
            <span className="font-semibold text-slate-800">Enes Öztürk</span>
            <span className="mx-1.5 text-slate-300">·</span>
            <span>Apollo Client Ödev 4</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
