import React, { useState } from 'react';
import {
  Database,
  Users,
  Calendar,
  MapPin,
  UserCheck,
  Search,
  RotateCcw,
  Plus,
  ShieldCheck,
} from 'lucide-react';

interface DatasetViewerProps {
  data: any;
  onReset: () => void;
  onRefresh: () => void;
}

export const DatasetViewer: React.FC<DatasetViewerProps> = ({ data, onReset, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'users' | 'events' | 'locations' | 'participants'>('events');
  const [search, setSearch] = useState('');

  const users = data?.users || [];
  const events = data?.events || [];
  const locations = data?.locations || [];
  const participants = data?.participants || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Database className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">İlişkisel Veri Seti (Mock Database)</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            GraphQL resolver'ları tarafından sorgulanan ilişkisel veri tablosu kayıtları.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-zinc-700 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Veriyi Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Table selector buttons */}
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveSubTab('users')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'users'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Kullanıcılar ({users.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('events')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'events'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Etkinlikler ({events.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('locations')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'locations'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Konumlar ({locations.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('participants')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium transition ${
              activeSubTab === 'participants'
                ? 'bg-purple-600 text-white shadow'
                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>Katılımcılar ({participants.length})</span>
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Kayıtlarda ara..."
            className="w-full sm:w-64 bg-zinc-900 text-zinc-200 text-xs pl-9 pr-3 py-2 rounded-xl border border-zinc-800 focus:outline-none focus:border-purple-600"
          />
        </div>
      </div>

      {/* Tables Display */}
      <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
        {activeSubTab === 'users' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Kullanıcı Adı</th>
                  <th className="py-3 px-4">E-posta</th>
                  <th className="py-3 px-4">Ad Soyad</th>
                  <th className="py-3 px-4 text-right">Düzenlediği Etkinlik</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {users
                  .filter(
                    (u: any) =>
                      u.username.toLowerCase().includes(search.toLowerCase()) ||
                      u.email.toLowerCase().includes(search.toLowerCase()) ||
                      (u.fullName && u.fullName.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((u: any) => {
                    const userEvents = events.filter((e: any) => String(e.user_id) === String(u.id));
                    const isEnes = u.username === 'enes_ozturk';
                    return (
                      <tr key={u.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3 px-4 font-bold text-purple-400">#{u.id}</td>
                        <td className="py-3 px-4 font-semibold text-white flex items-center gap-2">
                          <span>{u.username}</span>
                          {isEnes && (
                            <span className="text-[10px] font-sans bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-1.5 py-0.2 rounded flex items-center gap-1">
                              <ShieldCheck className="w-2.5 h-2.5" /> İmza Sahibi
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">{u.email}</td>
                        <td className="py-3 px-4">{u.fullName || '-'}</td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-purple-950/60 text-purple-300 px-2 py-0.5 rounded border border-purple-800/40">
                            {userEvents.length} Etkinlik
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'events' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Başlık</th>
                  <th className="py-3 px-4">Tarih & Saat</th>
                  <th className="py-3 px-4">Sahibi (User)</th>
                  <th className="py-3 px-4">Konum (Location)</th>
                  <th className="py-3 px-4 text-right">Katılımcı Sayısı</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {events
                  .filter(
                    (e: any) =>
                      e.title.toLowerCase().includes(search.toLowerCase()) ||
                      (e.desc && e.desc.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((e: any) => {
                    const owner = users.find((u: any) => String(u.id) === String(e.user_id));
                    const loc = locations.find((l: any) => String(l.id) === String(e.location_id));
                    const eventParts = participants.filter((p: any) => String(p.event_id) === String(e.id));

                    return (
                      <tr key={e.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3 px-4 font-bold text-indigo-400">#{e.id}</td>
                        <td className="py-3 px-4 font-semibold text-white max-w-xs truncate">
                          {e.title}
                        </td>
                        <td className="py-3 px-4 text-zinc-400">
                          {e.date} {e.from ? `(${e.from}-${e.to})` : ''}
                        </td>
                        <td className="py-3 px-4 text-purple-300">
                          @{owner ? owner.username : `User #${e.user_id}`}
                        </td>
                        <td className="py-3 px-4 text-emerald-300">
                          {loc ? loc.name : `Location #${e.location_id}`}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-amber-950/60 text-amber-300 px-2 py-0.5 rounded border border-amber-800/40">
                            {eventParts.length} Katılımcı
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'locations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">ID</th>
                  <th className="py-3 px-4">Konum Adı</th>
                  <th className="py-3 px-4">Adres</th>
                  <th className="py-3 px-4">Koordinatlar</th>
                  <th className="py-3 px-4 text-right">Etkinlikler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {locations
                  .filter(
                    (l: any) =>
                      l.name.toLowerCase().includes(search.toLowerCase()) ||
                      (l.address && l.address.toLowerCase().includes(search.toLowerCase()))
                  )
                  .map((l: any) => {
                    const locEvents = events.filter((e: any) => String(e.location_id) === String(l.id));

                    return (
                      <tr key={l.id} className="hover:bg-zinc-800/40 transition">
                        <td className="py-3 px-4 font-bold text-emerald-400">#{l.id}</td>
                        <td className="py-3 px-4 font-semibold text-white">{l.name}</td>
                        <td className="py-3 px-4 text-zinc-400 max-w-sm truncate">{l.address || l.desc}</td>
                        <td className="py-3 px-4 text-zinc-500">
                          {l.lat && l.lng ? `${l.lat}, ${l.lng}` : '-'}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <span className="bg-indigo-950/60 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/40">
                            {locEvents.length} Etkinlik
                          </span>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'participants' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-zinc-950 text-zinc-400 border-b border-zinc-800 uppercase tracking-wider text-[11px]">
                <tr>
                  <th className="py-3 px-4">Kayıt ID</th>
                  <th className="py-3 px-4">Katılımcı (User)</th>
                  <th className="py-3 px-4">Katıldığı Etkinlik (Event)</th>
                  <th className="py-3 px-4 text-right">Etkinlik Tarihi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-300">
                {participants.map((p: any) => {
                  const user = users.find((u: any) => String(u.id) === String(p.user_id));
                  const event = events.find((e: any) => String(e.id) === String(p.event_id));

                  return (
                    <tr key={p.id} className="hover:bg-zinc-800/40 transition">
                      <td className="py-3 px-4 font-bold text-amber-400">#{p.id}</td>
                      <td className="py-3 px-4 text-purple-300 font-semibold">
                        @{user?.username || `User #${p.user_id}`} ({user?.fullName || ''})
                      </td>
                      <td className="py-3 px-4 text-indigo-300 font-semibold">
                        {event?.title || `Event #${p.event_id}`}
                      </td>
                      <td className="py-3 px-4 text-right text-zinc-400">
                        {event?.date || '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
