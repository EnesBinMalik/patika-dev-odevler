import React, { useState } from 'react';
import {
  Users,
  Calendar,
  MapPin,
  UserCheck,
  Plus,
  Trash2,
  RotateCcw,
  Clock,
  Mail,
} from 'lucide-react';
import { EventItem, Location, Participant, User } from '../graphql/types.ts';
import { db } from '../graphql/database.ts';
import { ModalType } from './MutationModal.tsx';

interface DatabaseExplorerProps {
  users: User[];
  events: EventItem[];
  locations: Location[];
  participants: Participant[];
  onOpenModal: (type: ModalType) => void;
  onShowMessage: (msg: string) => void;
}

export const DatabaseExplorer: React.FC<DatabaseExplorerProps> = ({
  users,
  events,
  locations,
  participants,
  onOpenModal,
  onShowMessage,
}) => {
  const [activeTab, setActiveTab] = useState<'events' | 'users' | 'participants' | 'locations'>('events');

  const handleReset = () => {
    if (window.confirm('Tüm verileri başlangıç durumuna döndürmek istiyor musunuz?')) {
      db.reset();
      onShowMessage('Veri tabanı başarıyla başlangıç durumuna sıfırlandı.');
    }
  };

  const handleDeleteUser = (id: string, name: string) => {
    if (window.confirm(`"${name}" kullanıcısını silmek istediğinize emin misiniz?`)) {
      db.deleteUser(id);
      onShowMessage(`Kullanıcı "${name}" silindi.`);
    }
  };

  const handleDeleteEvent = (id: string, title: string) => {
    if (window.confirm(`"${title}" etkinliğini silmek istediğinize emin misiniz?`)) {
      db.deleteEvent(id);
      onShowMessage(`Etkinlik "${title}" silindi.`);
    }
  };

  const handleDeleteParticipant = (id: string) => {
    db.deleteParticipant(id);
    onShowMessage('Katılımcı kaydı kaldırıldı.');
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-white tracking-tight">
            Canlı İlişkisel Veri Modeli
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            GraphQL Resolver'larının beslendiği ilişkisel veri havuzu (User ↔ Event ↔ Participant)
          </p>
        </div>

        <div className="flex items-center flex-wrap gap-2">
          <button
            onClick={() => onOpenModal('createUser')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>Kullanıcı Ekle</span>
          </button>
          <button
            onClick={() => onOpenModal('createEvent')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
          >
            <Plus className="w-3.5 h-3.5 text-amber-400" />
            <span>Etkinlik Ekle</span>
          </button>
          <button
            onClick={() => onOpenModal('addParticipant')}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
          >
            <Plus className="w-3.5 h-3.5 text-purple-400" />
            <span>Katılımcı Ekle</span>
          </button>
          <button
            onClick={handleReset}
            title="Verileri Sıfırla"
            className="p-1.5 text-slate-400 hover:text-white bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs font-medium max-w-fit">
        <button
          onClick={() => setActiveTab('events')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'events' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Etkinlikler ({events.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'users' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>Kullanıcılar ({users.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('participants')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'participants'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <UserCheck className="w-3.5 h-3.5" />
          <span>Katılımcı Kayıtları ({participants.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('locations')}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${
            activeTab === 'locations'
              ? 'bg-indigo-600 text-white'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <MapPin className="w-3.5 h-3.5" />
          <span>Mekanlar ({locations.length})</span>
        </button>
      </div>

      {/* Content for Events */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {events.map((evt) => {
            const creator = users.find((u) => u.id === evt.user_id);
            const loc = locations.find((l) => l.id === evt.location_id);
            const evtParticipants = participants.filter((p) => p.event_id === evt.id);

            return (
              <div
                key={evt.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <span className="text-xs font-mono text-amber-400">ID #{evt.id}</span>
                    <button
                      onClick={() => handleDeleteEvent(evt.id, evt.title)}
                      className="text-slate-500 hover:text-rose-400 transition-colors p-1"
                      title="Etkinliği Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-base font-semibold text-white mb-2 leading-snug">
                    {evt.title}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 leading-relaxed">{evt.desc}</p>

                  <div className="space-y-1.5 text-xs text-slate-300 font-mono">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span>
                        {evt.date} · {evt.from} - {evt.to}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span className="truncate">{loc?.name || `Mekan #${evt.location_id}`}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400">
                      <Users className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span>Oluşturan: {creator?.name || `Kullanıcı #${evt.user_id}`}</span>
                    </div>
                  </div>
                </div>

                {/* Event Participants list */}
                <div className="mt-5 pt-4 border-t border-slate-800/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-slate-400">
                      Kayıtlı Katılımcılar ({evtParticipants.length})
                    </span>
                    <button
                      onClick={() => onOpenModal('addParticipant')}
                      className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      + Katılımcı Ekle
                    </button>
                  </div>

                  {evtParticipants.length > 0 ? (
                    <div className="flex flex-wrap gap-1.5">
                      {evtParticipants.map((p) => {
                        const u = users.find((usr) => usr.id === p.user_id);
                        return (
                          <span
                            key={p.id}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs bg-slate-950 border border-slate-800 rounded-md text-slate-300"
                          >
                            <span>{u?.name || `User #${p.user_id}`}</span>
                            <button
                              onClick={() => handleDeleteParticipant(p.id)}
                              className="text-slate-600 hover:text-rose-400"
                              title="Katılımcıyı Çıkar"
                            >
                              ×
                            </button>
                          </span>
                        );
                      })}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-500 italic">Henüz katılımcı yok.</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for Users */}
      {activeTab === 'users' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {users.map((u) => {
            const userEvents = events.filter((e) => e.user_id === u.id);
            const userPart = participants.filter((p) => p.user_id === u.id);

            return (
              <div
                key={u.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-full bg-cyan-950 border border-cyan-800 flex items-center justify-center font-bold text-xs text-cyan-300">
                      {u.name.substring(0, 2).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono text-slate-500">ID #{u.id}</span>
                      <button
                        onClick={() => handleDeleteUser(u.id, u.name)}
                        className="text-slate-600 hover:text-rose-400 p-1"
                        title="Kullanıcıyı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-semibold text-white mb-1">{u.name}</h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-4 font-mono">
                    <Mail className="w-3 h-3 text-slate-500" />
                    <span>{u.email}</span>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400 flex items-center justify-between">
                  <span>Oluşturduğu: {userEvents.length} Etkinlik</span>
                  <span aria-hidden="true">·</span>
                  <span>Katıldığı: {userPart.length} Etkinlik</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content for Participants */}
      {activeTab === 'participants' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 font-mono">
                <tr>
                  <th className="py-3 px-4">Kayıt ID</th>
                  <th className="py-3 px-4">Katılımcı (User)</th>
                  <th className="py-3 px-4">E-Posta</th>
                  <th className="py-3 px-4">Etkinlik (Event)</th>
                  <th className="py-3 px-4 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-300">
                {participants.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-500 italic">
                      Hiç katılımcı kaydı bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  participants.map((p) => {
                    const u = users.find((usr) => usr.id === p.user_id);
                    const e = events.find((evt) => evt.id === p.event_id);
                    return (
                      <tr key={p.id} className="hover:bg-slate-850/50">
                        <td className="py-3 px-4 font-mono text-purple-400">#{p.id}</td>
                        <td className="py-3 px-4 font-medium text-white">{u?.name || `ID #${p.user_id}`}</td>
                        <td className="py-3 px-4 font-mono text-slate-400">{u?.email || '-'}</td>
                        <td className="py-3 px-4 text-slate-200">
                          #{e?.id}: {e?.title || `Event #${p.event_id}`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteParticipant(p.id)}
                            className="text-slate-500 hover:text-rose-400 p-1 rounded"
                            title="Kaydı Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content for Locations */}
      {activeTab === 'locations' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {locations.map((loc) => {
            const locEvents = events.filter((e) => e.location_id === loc.id);
            return (
              <div
                key={loc.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-colors"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono text-emerald-400">ID #{loc.id}</span>
                    <span className="text-xs text-slate-500 font-mono">
                      {loc.lat}, {loc.lng}
                    </span>
                  </div>
                  <h4 className="text-base font-semibold text-white mb-1.5">{loc.name}</h4>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">{loc.desc}</p>
                </div>
                <div className="pt-3 border-t border-slate-800/80 text-xs text-slate-400">
                  Bu mekanda planlanan: {locEvents.length} Etkinlik
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
