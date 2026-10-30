import React, { useState } from 'react';
import { X, UserPlus, CalendarPlus, UserCheck, AlertCircle } from 'lucide-react';
import { EventItem, Location, User } from '../graphql/types.ts';
import { runGraphQLQuery } from '../graphql/executor.ts';

export type ModalType = 'createUser' | 'createEvent' | 'addParticipant' | null;

interface MutationModalProps {
  type: ModalType;
  onClose: () => void;
  users: User[];
  events: EventItem[];
  locations: Location[];
  onSuccess: (message: string) => void;
}

export const MutationModal: React.FC<MutationModalProps> = ({
  type,
  onClose,
  users,
  events,
  locations,
  onSuccess,
}) => {
  if (!type) return null;

  // Form states
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');

  const [eventTitle, setEventTitle] = useState('');
  const [eventDesc, setEventDesc] = useState('');
  const [eventDate, setEventDate] = useState('2026-11-25');
  const [eventFrom, setEventFrom] = useState('14:00');
  const [eventTo, setEventTo] = useState('18:00');
  const [eventLocId, setEventLocId] = useState(locations[0]?.id || '1');
  const [eventUserId, setEventUserId] = useState(users[0]?.id || '1');

  const [partUserId, setPartUserId] = useState(users[0]?.id || '');
  const [partEventId, setPartEventId] = useState(events[0]?.id || '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick preset fills
  const fillSampleUser = () => {
    const randomNum = Math.floor(Math.random() * 900) + 100;
    const names = ['Caner Akın', 'Deniz Yıldız', 'Büşra Şahin', 'Tolga Karaca', 'Selin Aydın'];
    const chosen = names[Math.floor(Math.random() * names.length)];
    setUserName(chosen);
    setUserEmail(`${chosen.toLowerCase().replace(/\s+/g, '.')}.${randomNum}@example.com`);
  };

  const fillSampleEvent = () => {
    const samples = [
      {
        title: 'Apollo GraphQL 2026 Workshop',
        desc: 'İleri seviye Subscriptions, Federation ve PubSub optimizasyonları.',
      },
      {
        title: 'Modern TypeScript & Real-Time Mimari',
        desc: 'Tip güvenli async iterator ve event-driven backend geliştirme.',
      },
      {
        title: 'Full-Stack GraphQL Masterclass',
        desc: 'Pratik mutasyonlar, cache yönetimi ve canlı veri akışları.',
      },
    ];
    const item = samples[Math.floor(Math.random() * samples.length)];
    setEventTitle(item.title);
    setEventDesc(item.desc);
    setEventDate('2026-12-05');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (type === 'createUser') {
        if (!userName.trim() || !userEmail.trim()) {
          throw new Error('Lütfen ad ve e-posta alanlarını doldurunuz.');
        }

        const query = /* GraphQL */ `
          mutation CreateUser($data: CreateUserInput!) {
            createUser(data: $data) {
              id
              name
              email
            }
          }
        `;
        const res = await runGraphQLQuery(query, {
          data: { name: userName.trim(), email: userEmail.trim() },
        });

        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message);
        }

        onSuccess(`Kullanıcı "${userName}" oluşturuldu ve userCreated kanalına yayınlandı!`);
        onClose();
      } else if (type === 'createEvent') {
        if (!eventTitle.trim()) {
          throw new Error('Lütfen etkinlik başlığını giriniz.');
        }

        const query = /* GraphQL */ `
          mutation CreateEvent($data: CreateEventInput!) {
            createEvent(data: $data) {
              id
              title
              desc
              date
              user {
                name
              }
            }
          }
        `;
        const res = await runGraphQLQuery(query, {
          data: {
            title: eventTitle.trim(),
            desc: eventDesc.trim() || 'Açıklama belirtilmedi.',
            date: eventDate,
            from: eventFrom,
            to: eventTo,
            location_id: eventLocId,
            user_id: eventUserId,
          },
        });

        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message);
        }

        onSuccess(`Etkinlik "${eventTitle}" oluşturuldu ve eventCreated kanalına yayınlandı!`);
        onClose();
      } else if (type === 'addParticipant') {
        if (!partUserId || !partEventId) {
          throw new Error('Lütfen katılımcı kullanıcı ve hedef etkinliği seçiniz.');
        }

        const query = /* GraphQL */ `
          mutation AddParticipant($data: AddParticipantInput!) {
            addParticipant(data: $data) {
              id
              user_id
              event_id
              user {
                name
              }
              event {
                title
              }
            }
          }
        `;
        const res = await runGraphQLQuery(query, {
          data: {
            user_id: partUserId,
            event_id: partEventId,
          },
        });

        if (res.errors && res.errors.length > 0) {
          throw new Error(res.errors[0].message);
        }

        onSuccess('Katılımcı eklendi ve participantAdded abonelerine başarıyla iletildi!');
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'İşlem başarısız oldu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
      <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            {type === 'createUser' && <UserPlus className="w-5 h-5 text-cyan-400" />}
            {type === 'createEvent' && <CalendarPlus className="w-5 h-5 text-amber-400" />}
            {type === 'addParticipant' && <UserCheck className="w-5 h-5 text-purple-400" />}
            <h3 className="text-base font-semibold text-white">
              {type === 'createUser' && 'Yeni Kullanıcı Oluştur (createUser)'}
              {type === 'createEvent' && 'Yeni Etkinlik Oluştur (createEvent)'}
              {type === 'addParticipant' && 'Etkinliğe Katılımcı Ekle (addParticipant)'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-rose-950/60 border border-rose-800/80 rounded-lg text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Type: Create User */}
          {type === 'createUser' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Kullanıcı Ad Soyad
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Örn: Enes Öztürk"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Örn: enes@ozturk.dev"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <button
                type="button"
                onClick={fillSampleUser}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Rastgele örnek veri doldur
              </button>
            </>
          )}

          {/* Type: Create Event */}
          {type === 'createEvent' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Etkinlik Başlığı
                </label>
                <input
                  type="text"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  placeholder="Örn: GraphQL & Node.js Zirvesi"
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
                <textarea
                  rows={2}
                  value={eventDesc}
                  onChange={(e) => setEventDesc(e.target.value)}
                  placeholder="Etkinlik detayları..."
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Tarih</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Başlangıç</label>
                  <input
                    type="text"
                    value={eventFrom}
                    onChange={(e) => setEventFrom(e.target.value)}
                    placeholder="10:00"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Bitiş</label>
                  <input
                    type="text"
                    value={eventTo}
                    onChange={(e) => setEventTo(e.target.value)}
                    placeholder="18:00"
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-white focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Mekan</label>
                  <select
                    value={eventLocId}
                    onChange={(e) => setEventLocId(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {locations.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">Oluşturan</label>
                  <select
                    value={eventUserId}
                    onChange={(e) => setEventUserId(e.target.value)}
                    className="w-full text-xs bg-slate-950 border border-slate-800 rounded px-2 py-2 text-white focus:outline-none focus:border-indigo-500"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <button
                type="button"
                onClick={fillSampleEvent}
                className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                Rastgele etkinlik taslağı doldur
              </button>
            </>
          )}

          {/* Type: Add Participant */}
          {type === 'addParticipant' && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Katılımcı Kullanıcı
                </label>
                <select
                  value={partUserId}
                  onChange={(e) => setPartUserId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Katılınacak Etkinlik
                </label>
                <select
                  value={partEventId}
                  onChange={(e) => setPartEventId(e.target.value)}
                  className="w-full text-xs bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-indigo-500"
                >
                  {events.map((e) => (
                    <option key={e.id} value={e.id}>
                      #{e.id}: {e.title} ({e.date})
                    </option>
                  ))}
                </select>
              </div>

              <p className="text-[11px] text-slate-400">
                Bu mutasyon çalıştığında hem genel dinleyicilere hem de ilgili{' '}
                <code className="text-purple-300">event_id</code> için filtrelenmiş abonelere anında
                veri iletilir.
              </p>
            </>
          )}

          {/* Buttons */}
          <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-400 hover:text-white transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {loading ? 'İşleniyor...' : 'Mutasyonu Çalıştır & Yayınla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
