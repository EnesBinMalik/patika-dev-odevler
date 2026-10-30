/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Live Data Explorer with Real GraphQL Mutations
 */
import React, { useState } from 'react';
import { 
  Users, 
  Calendar, 
  MapPin, 
  UserCheck, 
  Plus, 
  Edit3, 
  Trash2, 
  AlertTriangle,
  X,
  Check,
  Code2
} from 'lucide-react';
import { db } from '../graphql/database';
import { runQuery } from '../graphql/executor';
import { User, Location, Event, Participant } from '../graphql/types';

export const DataExplorer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'events' | 'locations' | 'participants'>('users');
  const [modalMode, setModalMode] = useState<'add' | 'edit' | 'deleteAll' | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);

  // Form states
  const [userForm, setUserForm] = useState({ username: '', email: '' });
  const [locationForm, setLocationForm] = useState({ name: '', desc: '', lat: 41.0082, lng: 28.9784 });
  const [eventForm, setEventForm] = useState({
    title: '',
    desc: '',
    date: '2026-11-20',
    from: '10:00',
    to: '17:00',
    location_id: '1',
    user_id: '1'
  });
  const [participantForm, setParticipantForm] = useState({ user_id: '1', event_id: '1' });

  // Execution toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const state = db.getState();

  // --- ACTIONS EXECUTING GRAPHQL MUTATIONS ---
  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const query = `mutation addUser($data: AddUserInput!) {
        addUser(data: $data) { id username email }
      }`;
      const res = await runQuery(query, { data: userForm });
      if (res.data?.addUser) {
        showToast(`mutation addUser çalıştırıldı: ${res.data.addUser.username}`);
      }
    } else if (modalMode === 'edit' && selectedItem) {
      const query = `mutation updateUser($id: ID!, $data: UpdateUserInput!) {
        updateUser(id: $id, data: $data) { id username email }
      }`;
      const res = await runQuery(query, { id: selectedItem.id, data: userForm });
      if (res.data?.updateUser) {
        showToast(`mutation updateUser çalıştırıldı ID: ${selectedItem.id}`);
      }
    }
    setModalMode(null);
  };

  const handleDeleteUser = async (id: string) => {
    const query = `mutation deleteUser($id: ID!) {
      deleteUser(id: $id) { id username }
    }`;
    const res = await runQuery(query, { id });
    if (res.data?.deleteUser) {
      showToast(`mutation deleteUser çalıştırıldı: ${res.data.deleteUser.username}`);
    }
  };

  const handleDeleteAllUsers = async () => {
    const query = `mutation deleteAllUsers {
      deleteAllUsers { count message }
    }`;
    const res = await runQuery(query);
    showToast(`mutation deleteAllUsers: ${res.data?.deleteAllUsers?.count} kullanıcı silindi`);
    setModalMode(null);
  };

  // --- LOCATION ACTIONS ---
  const handleSaveLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const query = `mutation addLocation($data: AddLocationInput!) {
        addLocation(data: $data) { id name desc }
      }`;
      const res = await runQuery(query, {
        data: {
          name: locationForm.name,
          desc: locationForm.desc,
          lat: Number(locationForm.lat),
          lng: Number(locationForm.lng)
        }
      });
      if (res.data?.addLocation) {
        showToast(`mutation addLocation çalıştırıldı: ${res.data.addLocation.name}`);
      }
    } else if (modalMode === 'edit' && selectedItem) {
      const query = `mutation updateLocation($id: ID!, $data: UpdateLocationInput!) {
        updateLocation(id: $id, data: $data) { id name desc }
      }`;
      const res = await runQuery(query, {
        id: selectedItem.id,
        data: {
          name: locationForm.name,
          desc: locationForm.desc,
          lat: Number(locationForm.lat),
          lng: Number(locationForm.lng)
        }
      });
      if (res.data?.updateLocation) {
        showToast(`mutation updateLocation çalıştırıldı ID: ${selectedItem.id}`);
      }
    }
    setModalMode(null);
  };

  const handleDeleteLocation = async (id: string) => {
    const query = `mutation deleteLocation($id: ID!) {
      deleteLocation(id: $id) { id name }
    }`;
    const res = await runQuery(query, { id });
    if (res.data?.deleteLocation) {
      showToast(`mutation deleteLocation: ${res.data.deleteLocation.name} silindi`);
    }
  };

  const handleDeleteAllLocations = async () => {
    const query = `mutation deleteAllLocations {
      deleteAllLocations { count message }
    }`;
    const res = await runQuery(query);
    showToast(`mutation deleteAllLocations: ${res.data?.deleteAllLocations?.count} mekan silindi`);
    setModalMode(null);
  };

  // --- EVENT ACTIONS ---
  const handleSaveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const query = `mutation addEvent($data: AddEventInput!) {
        addEvent(data: $data) { id title desc }
      }`;
      const res = await runQuery(query, { data: eventForm });
      if (res.data?.addEvent) {
        showToast(`mutation addEvent çalıştırıldı: ${res.data.addEvent.title}`);
      }
    } else if (modalMode === 'edit' && selectedItem) {
      const query = `mutation updateEvent($id: ID!, $data: UpdateEventInput!) {
        updateEvent(id: $id, data: $data) { id title desc }
      }`;
      const res = await runQuery(query, { id: selectedItem.id, data: eventForm });
      if (res.data?.updateEvent) {
        showToast(`mutation updateEvent çalıştırıldı ID: ${selectedItem.id}`);
      }
    }
    setModalMode(null);
  };

  const handleDeleteEvent = async (id: string) => {
    const query = `mutation deleteEvent($id: ID!) {
      deleteEvent(id: $id) { id title }
    }`;
    const res = await runQuery(query, { id });
    if (res.data?.deleteEvent) {
      showToast(`mutation deleteEvent: ${res.data.deleteEvent.title} silindi`);
    }
  };

  const handleDeleteAllEvents = async () => {
    const query = `mutation deleteAllEvents {
      deleteAllEvents { count message }
    }`;
    const res = await runQuery(query);
    showToast(`mutation deleteAllEvents: ${res.data?.deleteAllEvents?.count} etkinlik silindi`);
    setModalMode(null);
  };

  // --- PARTICIPANT ACTIONS ---
  const handleSaveParticipant = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalMode === 'add') {
      const query = `mutation addParticipant($data: AddParticipantInput!) {
        addParticipant(data: $data) { id user_id event_id }
      }`;
      const res = await runQuery(query, { data: participantForm });
      if (res.data?.addParticipant) {
        showToast(`mutation addParticipant çalıştırıldı ID: ${res.data.addParticipant.id}`);
      }
    } else if (modalMode === 'edit' && selectedItem) {
      const query = `mutation updateParticipant($id: ID!, $data: UpdateParticipantInput!) {
        updateParticipant(id: $id, data: $data) { id user_id event_id }
      }`;
      const res = await runQuery(query, { id: selectedItem.id, data: participantForm });
      if (res.data?.updateParticipant) {
        showToast(`mutation updateParticipant çalıştırıldı ID: ${selectedItem.id}`);
      }
    }
    setModalMode(null);
  };

  const handleDeleteParticipant = async (id: string) => {
    const query = `mutation deleteParticipant($id: ID!) {
      deleteParticipant(id: $id) { id }
    }`;
    const res = await runQuery(query, { id });
    if (res.data?.deleteParticipant) {
      showToast(`mutation deleteParticipant çalıştırıldı ID: ${id}`);
    }
  };

  const handleDeleteAllParticipants = async () => {
    const query = `mutation deleteAllParticipants {
      deleteAllParticipants { count message }
    }`;
    const res = await runQuery(query);
    showToast(`mutation deleteAllParticipants: ${res.data?.deleteAllParticipants?.count} katılım silindi`);
    setModalMode(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-purple-500/40 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce">
          <Code2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono">{toastMessage}</span>
        </div>
      )}

      {/* Explorer Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight">Canlı Veri Gezgini</h2>
          <p className="text-xs text-slate-400">
            Aşağıdaki butonlarla yapılan ekleme, düzenleme ve silme işlemleri doğrudan ilgili{' '}
            <span className="text-purple-400 font-semibold font-mono">GraphQL Mutation</span>{' '}
            ile çalışır.
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'users' ? 'bg-pink-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            Users ({state.users.length})
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'events' ? 'bg-purple-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Calendar className="w-3.5 h-3.5" />
            Events ({state.events.length})
          </button>
          <button
            onClick={() => setActiveTab('locations')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'locations' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            Locations ({state.locations.length})
          </button>
          <button
            onClick={() => setActiveTab('participants')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              activeTab === 'participants' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Participants ({state.participants.length})
          </button>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between p-4 bg-slate-900 rounded-xl border border-slate-800">
        <div className="text-xs text-slate-300">
          Aktif Varlık:{' '}
          <span className="font-bold text-white capitalize">{activeTab}</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (activeTab === 'users') setUserForm({ username: '', email: '' });
              if (activeTab === 'locations') setLocationForm({ name: '', desc: '', lat: 41.0082, lng: 28.9784 });
              if (activeTab === 'events') setEventForm({
                title: '',
                desc: '',
                date: '2026-11-20',
                from: '10:00',
                to: '17:00',
                location_id: state.locations[0]?.id || '1',
                user_id: state.users[0]?.id || '1'
              });
              if (activeTab === 'participants') setParticipantForm({
                user_id: state.users[0]?.id || '1',
                event_id: state.events[0]?.id || '1'
              });
              setModalMode('add');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white text-xs font-medium rounded-lg transition"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Ekle (add{activeTab.slice(0, -1).replace(/^./, (c) => c.toUpperCase())})</span>
          </button>

          <button
            onClick={() => setModalMode('deleteAll')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-medium rounded-lg border border-rose-800/40 transition"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Tümünü Sil (deleteAll{activeTab.replace(/^./, (c) => c.toUpperCase())})</span>
          </button>
        </div>
      </div>

      {/* TABLE CONTENT */}
      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-sm">
        {activeTab === 'users' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3.5 font-mono">ID</th>
                <th className="p-3.5">Kullanıcı Adı</th>
                <th className="p-3.5">E-posta</th>
                <th className="p-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {state.users.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Kullanıcı bulunamadı. &quot;Yeni Ekle&quot; veya &quot;Verileri Sıfırla&quot; butonuna basabilirsiniz.
                  </td>
                </tr>
              ) : (
                state.users.map((u) => (
                  <tr key={u.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-purple-400">{u.id}</td>
                    <td className="p-3.5 font-medium text-white">{u.username}</td>
                    <td className="p-3.5 text-slate-400">{u.email}</td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(u);
                          setUserForm({ username: u.username, email: u.email });
                          setModalMode('edit');
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'locations' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3.5 font-mono">ID</th>
                <th className="p-3.5">Mekan Adı</th>
                <th className="p-3.5">Açıklama</th>
                <th className="p-3.5 font-mono">Koordinat</th>
                <th className="p-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {state.locations.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Mekan bulunamadı.
                  </td>
                </tr>
              ) : (
                state.locations.map((loc) => (
                  <tr key={loc.id} className="hover:bg-slate-800/40">
                    <td className="p-3.5 font-mono text-indigo-400">{loc.id}</td>
                    <td className="p-3.5 font-medium text-white">{loc.name}</td>
                    <td className="p-3.5 text-slate-400 truncate max-w-xs">{loc.desc}</td>
                    <td className="p-3.5 font-mono text-[11px] text-slate-400">
                      {loc.lat}, {loc.lng}
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <button
                        onClick={() => {
                          setSelectedItem(loc);
                          setLocationForm({
                            name: loc.name,
                            desc: loc.desc,
                            lat: loc.lat,
                            lng: loc.lng
                          });
                          setModalMode('edit');
                        }}
                        className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                      >
                        Düzenle
                      </button>
                      <button
                        onClick={() => handleDeleteLocation(loc.id)}
                        className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                      >
                        Sil
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'events' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3.5 font-mono">ID</th>
                <th className="p-3.5">Etkinlik Başlığı</th>
                <th className="p-3.5">Tarih / Saat</th>
                <th className="p-3.5">Düzenleyen</th>
                <th className="p-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {state.events.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    Etkinlik bulunamadı.
                  </td>
                </tr>
              ) : (
                state.events.map((ev) => {
                  const author = state.users.find((u) => u.id === ev.user_id);
                  return (
                    <tr key={ev.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-purple-400">{ev.id}</td>
                      <td className="p-3.5 font-medium text-white max-w-xs">{ev.title}</td>
                      <td className="p-3.5 text-slate-400">
                        {ev.date} ({ev.from} - {ev.to})
                      </td>
                      <td className="p-3.5 text-pink-300 font-mono">
                        {author ? author.username : `User #${ev.user_id}`}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(ev);
                            setEventForm({
                              title: ev.title,
                              desc: ev.desc,
                              date: ev.date,
                              from: ev.from,
                              to: ev.to,
                              location_id: ev.location_id,
                              user_id: ev.user_id
                            });
                            setModalMode('edit');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteEvent(ev.id)}
                          className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}

        {activeTab === 'participants' && (
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 border-b border-slate-800 text-slate-400">
              <tr>
                <th className="p-3.5 font-mono">ID</th>
                <th className="p-3.5">Katılımcı (User)</th>
                <th className="p-3.5">Etkinlik (Event)</th>
                <th className="p-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 text-slate-300">
              {state.participants.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-8 text-center text-slate-500">
                    Katılımcı bulunamadı.
                  </td>
                </tr>
              ) : (
                state.participants.map((p) => {
                  const user = state.users.find((u) => u.id === p.user_id);
                  const ev = state.events.find((e) => e.id === p.event_id);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/40">
                      <td className="p-3.5 font-mono text-emerald-400">{p.id}</td>
                      <td className="p-3.5 text-pink-300 font-mono">
                        {user ? `${user.username} (${user.email})` : `User #${p.user_id}`}
                      </td>
                      <td className="p-3.5 text-white font-medium">
                        {ev ? ev.title : `Event #${p.event_id}`}
                      </td>
                      <td className="p-3.5 text-right space-x-2">
                        <button
                          onClick={() => {
                            setSelectedItem(p);
                            setParticipantForm({
                              user_id: p.user_id,
                              event_id: p.event_id
                            });
                            setModalMode('edit');
                          }}
                          className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-[11px]"
                        >
                          Düzenle
                        </button>
                        <button
                          onClick={() => handleDeleteParticipant(p.id)}
                          className="px-2 py-1 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded text-[11px]"
                        >
                          Sil
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* CRUD MODAL */}
      {modalMode && modalMode !== 'deleteAll' && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-sm font-bold text-white capitalize">
                {modalMode === 'add' ? 'Yeni Ekle' : 'Düzenle'}: {activeTab}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* User Form */}
            {activeTab === 'users' && (
              <form onSubmit={handleSaveUser} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Kullanıcı Adı (username)</label>
                  <input
                    type="text"
                    required
                    value={userForm.username}
                    onChange={(e) => setUserForm({ ...userForm, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="ornek_kullanici"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">E-posta (email)</label>
                  <input
                    type="email"
                    required
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="ornek@example.com"
                  />
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                  >
                    Mutation Gönder
                  </button>
                </div>
              </form>
            )}

            {/* Location Form */}
            {activeTab === 'locations' && (
              <form onSubmit={handleSaveLocation} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Mekan Adı (name)</label>
                  <input
                    type="text"
                    required
                    value={locationForm.name}
                    onChange={(e) => setLocationForm({ ...locationForm, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Mekan İsmi"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Açıklama (desc)</label>
                  <input
                    type="text"
                    required
                    value={locationForm.desc}
                    onChange={(e) => setLocationForm({ ...locationForm, desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                    placeholder="Detaylı mekan açıklaması"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Enlem (lat)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={locationForm.lat}
                      onChange={(e) => setLocationForm({ ...locationForm, lat: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Boylam (lng)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={locationForm.lng}
                      onChange={(e) => setLocationForm({ ...locationForm, lng: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                    />
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                  >
                    Mutation Gönder
                  </button>
                </div>
              </form>
            )}

            {/* Event Form */}
            {activeTab === 'events' && (
              <form onSubmit={handleSaveEvent} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Etkinlik Başlığı (title)</label>
                  <input
                    type="text"
                    required
                    value={eventForm.title}
                    onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Açıklama (desc)</label>
                  <textarea
                    required
                    value={eventForm.desc}
                    onChange={(e) => setEventForm({ ...eventForm, desc: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white h-16"
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Tarih</label>
                    <input
                      type="date"
                      value={eventForm.date}
                      onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white text-[11px]"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Başlangıç</label>
                    <input
                      type="text"
                      value={eventForm.from}
                      onChange={(e) => setEventForm({ ...eventForm, from: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Bitiş</label>
                    <input
                      type="text"
                      value={eventForm.to}
                      onChange={(e) => setEventForm({ ...eventForm, to: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white font-mono"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-400 mb-1">Düzenleyen (user_id)</label>
                    <select
                      value={eventForm.user_id}
                      onChange={(e) => setEventForm({ ...eventForm, user_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      {state.users.map((u) => (
                        <option key={u.id} value={u.id}>
                          {u.username} (#{u.id})
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">Mekan (location_id)</label>
                    <select
                      value={eventForm.location_id}
                      onChange={(e) => setEventForm({ ...eventForm, location_id: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-white"
                    >
                      {state.locations.map((loc) => (
                        <option key={loc.id} value={loc.id}>
                          {loc.name} (#{loc.id})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                  >
                    Mutation Gönder
                  </button>
                </div>
              </form>
            )}

            {/* Participant Form */}
            {activeTab === 'participants' && (
              <form onSubmit={handleSaveParticipant} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-400 mb-1">Katılımcı Seç (user_id)</label>
                  <select
                    value={participantForm.user_id}
                    onChange={(e) => setParticipantForm({ ...participantForm, user_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {state.users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.username} ({u.email})
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Etkinlik Seç (event_id)</label>
                  <select
                    value={participantForm.event_id}
                    onChange={(e) => setParticipantForm({ ...participantForm, event_id: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-white"
                  >
                    {state.events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.title} (#{e.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setModalMode(null)}
                    className="px-3 py-1.5 bg-slate-800 text-slate-300 rounded-lg"
                  >
                    Vazgeç
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg"
                  >
                    Mutation Gönder
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* DELETE ALL CONFIRM MODAL */}
      {modalMode === 'deleteAll' && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-rose-500/30 rounded-2xl w-full max-w-sm p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="text-sm font-bold text-white">
                deleteAll{activeTab.replace(/^./, (c) => c.toUpperCase())} Çalıştırılsın mı?
              </h3>
              <p className="text-xs text-slate-400">
                Bu işlem <span className="text-rose-400 font-mono">mutation deleteAll{activeTab.replace(/^./, (c) => c.toUpperCase())}</span> sorgusunu tetikleyecek ve ilgili tüm kayıtları silecektir.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setModalMode(null)}
                className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs font-medium"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  if (activeTab === 'users') handleDeleteAllUsers();
                  if (activeTab === 'events') handleDeleteAllEvents();
                  if (activeTab === 'locations') handleDeleteAllLocations();
                  if (activeTab === 'participants') handleDeleteAllParticipants();
                }}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-bold"
              >
                Evet, Tümünü Sil
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
