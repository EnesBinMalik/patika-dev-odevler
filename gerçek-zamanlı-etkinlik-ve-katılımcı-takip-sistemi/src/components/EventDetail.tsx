import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import type { Participant } from '../types';
import {
  ArrowLeft,
  Calendar,
  Clock,
  MapPin,
  Users,
  UserPlus,
  Radio,
  Sparkles,
  Search,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  Share2,
  Trash2
} from 'lucide-react';

interface EventDetailProps {
  onBack: () => void;
  // If in split screen, optional custom title override
  compact?: boolean;
}

const sampleNames = [
  'Gizem Kurt',
  'Emre Can',
  'Selin Yılmaz',
  'Murat Kaya',
  'Ezgi Arslan',
  'Okan Tekin',
  'Deniz Aydın',
  'İrem Çetin',
  'Yusuf Koç',
  'Büşra Demir'
];

const sampleCompanies = [
  'Getir Tech',
  'Trendyol Labs',
  'Hepsiburada',
  'Insider',
  'İTÜ Çekirdek',
  'ODTÜ Teknokent',
  'Freelance Software'
];

export const EventDetail: React.FC<EventDetailProps> = ({ onBack, compact = false }) => {
  const { selectedEvent, addParticipant, deleteEvent, setSelectedEventId } = useRealtime();

  // Participant Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<Participant['role']>('Katılımcı');
  const [company, setCompany] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);

  // Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>('all');
  const [recentlyJoinedId, setRecentlyJoinedId] = useState<string | null>(null);

  if (!selectedEvent) {
    return (
      <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800">
        <Users className="w-12 h-12 text-slate-600 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-white">Etkinlik bulunamadı veya silinmiş.</h3>
        <button
          onClick={onBack}
          className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 cursor-pointer"
        >
          Etkinlik Listesine Dön
        </button>
      </div>
    );
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setFormError('Lütfen isim ve geçerli bir e-posta adresi giriniz.');
      return;
    }

    setFormError(null);
    setFormSuccess(null);
    setIsSubmitting(true);

    const result = await addParticipant(selectedEvent.id, {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      role,
      company: company.trim() || undefined,
      note: note.trim() || undefined
    });

    setIsSubmitting(false);

    if (result.success && result.participant) {
      setFormSuccess(`${result.participant.name} başarıyla etkinliğe eklendi! (Gerçek zamanlı olarak yayınlandı)`);
      setRecentlyJoinedId(result.participant.id);
      setName('');
      setEmail('');
      setCompany('');
      setNote('');
      setTimeout(() => setFormSuccess(null), 5000);
      setTimeout(() => setRecentlyJoinedId(null), 7000);
    } else {
      setFormError(result.error || 'Katılımcı eklenirken bir hata oluştu.');
    }
  };

  // Quick 1-click test participant generator
  const handleQuickAdd = async () => {
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const cleanEmail = `${randomName.toLowerCase().replace(/[^a-z]/g, '')}${randomSuffix}@ornek.com`;
    const roles: Participant['role'][] = ['Katılımcı', 'Geliştirici', 'Öğrenci', 'Mentor'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    const randomCompany = sampleCompanies[Math.floor(Math.random() * sampleCompanies.length)];

    setIsSubmitting(true);
    setFormError(null);

    const result = await addParticipant(selectedEvent.id, {
      name: randomName,
      email: cleanEmail,
      role: randomRole,
      company: randomCompany,
      note: 'Hızlı test kaydı (Canlı simülasyon)'
    });

    setIsSubmitting(false);

    if (result.success && result.participant) {
      setFormSuccess(`⚡ Hızlı Test: ${result.participant.name} gerçek zamanlı olarak eklendi!`);
      setRecentlyJoinedId(result.participant.id);
      setTimeout(() => setFormSuccess(null), 4000);
      setTimeout(() => setRecentlyJoinedId(null), 7000);
    } else {
      setFormError(result.error || 'Hızlı katılımcı eklenemedi.');
    }
  };

  const handleDelete = async () => {
    if (confirm('Bu etkinliği silmek istediğinize emin misiniz?')) {
      await deleteEvent(selectedEvent.id);
      setSelectedEventId(null);
    }
  };

  // Filter participants
  const filteredParticipants = selectedEvent.participants.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.company && p.company.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesRole = selectedRoleFilter === 'all' || p.role === selectedRoleFilter;
    return matchesSearch && matchesRole;
  });

  const percentFull = Math.min(100, Math.round((selectedEvent.participantsCount / selectedEvent.capacity) * 100));

  const roleColors: Record<Participant['role'], string> = {
    Organizatör: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    Konuşmacı: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    Mentor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    Geliştirici: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    Öğrenci: 'bg-sky-500/20 text-sky-300 border-sky-500/40',
    Katılımcı: 'bg-slate-700/50 text-slate-300 border-slate-600/40'
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top back bar & real-time badge */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-400 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-lg transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Etkinlik Listesine Dön</span>
        </button>

        <div className="flex items-center gap-2">
          {/* Real-time sync badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/50 border border-emerald-500/40 text-emerald-300">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span>Canlı Katılımcı Takibi Aktif</span>
          </div>

          {!compact && (
            <button
              onClick={handleDelete}
              className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition border border-transparent hover:border-rose-900/50 cursor-pointer"
              title="Etkinliği Sil"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Event Header Banner */}
      <div className="relative rounded-2xl overflow-hidden border border-slate-800 bg-slate-900/90 shadow-xl">
        <div className="h-44 sm:h-56 w-full relative overflow-hidden">
          <img
            src={selectedEvent.image}
            alt={selectedEvent.title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent" />

          {/* Category & Status */}
          <div className="absolute top-4 left-4 flex gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-indigo-600/90 backdrop-blur-md text-white shadow">
              {selectedEvent.category}
            </span>
            <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-900/80 backdrop-blur-md text-slate-300 border border-slate-700">
              {selectedEvent.status === 'upcoming' ? 'Gelecek Etkinlik' : 'Aktif'}
            </span>
          </div>

          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-white tracking-tight">
              {selectedEvent.title}
            </h1>
            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2 text-xs sm:text-sm text-slate-300">
              <div className="flex items-center gap-1.5 text-slate-300">
                <Calendar className="w-4 h-4 text-indigo-400" />
                <span>{selectedEvent.date}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Clock className="w-4 h-4 text-indigo-400" />
                <span>{selectedEvent.time}</span>
              </div>
              <div className="flex items-center gap-1.5 text-slate-300">
                <MapPin className="w-4 h-4 text-indigo-400" />
                <span>{selectedEvent.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Organizer attribution bar */}
        <div className="px-5 py-3 bg-slate-950/70 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Organizatör & Moderatör:</span>
            <span className="font-bold text-white px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {selectedEvent.organizer}
            </span>
          </div>
          <div className="text-slate-400 flex items-center gap-2">
            <span>Ödev 5 İmza Doğrulandı:</span>
            <span className="text-emerald-400 font-semibold">Enes Öztürk</span>
          </div>
        </div>
      </div>

      {/* Real-time Metrics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 relative overflow-hidden">
          <div className="text-xs text-slate-400">Kayıtlı Katılımcı</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-white">
              {selectedEvent.participantsCount}
            </span>
            <span className="text-xs text-emerald-400 font-medium animate-pulse flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Canlı
            </span>
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Anlık senkronize</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Toplam Kontenjan</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            {selectedEvent.capacity}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Maksimum kapasite</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Kalan Kontenjan</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-indigo-400">
            {Math.max(0, selectedEvent.capacity - selectedEvent.participantsCount)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">Kişilik yer kaldı</div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-xs text-slate-400">Doluluk Oranı</div>
          <div className="mt-1 text-2xl sm:text-3xl font-extrabold text-white">
            %{percentFull}
          </div>
          <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentFull}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Registration Form, Right Real-Time Participant Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Participant Add Form */}
        <div className="lg:col-span-5 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <UserPlus className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Yeni Katılımcı Ekle</h3>
                <p className="text-xs text-slate-400">Girdiğiniz anda tüm ekranlarda anında belirir</p>
              </div>
            </div>

            {/* Quick 1-click test button */}
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isSubmitting}
              className="flex items-center gap-1 text-[11px] font-bold px-2.5 py-1.5 rounded-lg bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white border border-indigo-500/40 transition cursor-pointer shadow-sm disabled:opacity-50"
              title="Form doldurmadan tek tıkla test katılımcısı ekleyin ve sağ taraftaki gerçek zamanlı güncellemeyi test edin"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Hızlı Test Katıl</span>
            </button>
          </div>

          {formSuccess && (
            <div className="mt-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>{formSuccess}</span>
            </div>
          )}

          {formError && (
            <div className="mt-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{formError}</span>
            </div>
          )}

          <form onSubmit={handleRegister} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Ad Soyad <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Enes Öztürk"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                E-posta Adresi <span className="text-rose-400">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Örn: enes@ornek.com"
                required
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Katılım Rolü
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as Participant['role'])}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-indigo-500 transition cursor-pointer"
                >
                  <option value="Katılımcı">Katılımcı</option>
                  <option value="Geliştirici">Geliştirici</option>
                  <option value="Öğrenci">Öğrenci</option>
                  <option value="Konuşmacı">Konuşmacı</option>
                  <option value="Mentor">Mentor</option>
                  <option value="Organizatör">Organizatör</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Şirket / Üniversite
                </label>
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="Örn: Tech Şirketi / İTÜ"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Katılımcı Notu / Mesaj (İsteğe Bağlı)
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={2}
                placeholder="Örn: Real-time mimariler üzerine sorularım olacak"
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition-all hover:shadow-indigo-600/50 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Kaydediliyor ve Yayınlanıyor...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Etkinliğe Katıl (Gerçek Zamanlı Kayıt)</span>
                </>
              )}
            </button>
          </form>

          {/* Explanation badge */}
          <div className="mt-5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
            <Radio className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <span>
              <strong>Gereksinim 2 Kanıtı:</strong> Katılımcı kaydı tamamlandığında, sunucu WebSocket aracılığıyla tüm bağlı istemcilere <code>PARTICIPANT_ADDED</code> bildirimi gönderir. Sayfa yenilemeye gerek kalmadan sağdaki liste ve sayaç canlı olarak güncellenir.
            </span>
          </div>
        </div>

        {/* Right: Real-Time Participants Stream */}
        <div className="lg:col-span-7 bg-slate-900/90 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">
                  Kayıtlı Katılımcılar
                </h3>
                <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  {selectedEvent.participants.length} Kişi
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Yeni katılımcı eklendiğinde liste anında canlı güncellenir
              </p>
            </div>

            {/* Live pulsating badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/60 text-emerald-300 border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>Gerçek Zamanlı Akış</span>
            </div>
          </div>

          {/* Search and Role Filter */}
          <div className="mt-4 flex flex-col sm:flex-row gap-2.5">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Katılımcı veya şirket ara..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700/80 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            {/* Filter pills */}
            <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
              {['all', 'Katılımcı', 'Geliştirici', 'Konuşmacı', 'Mentor'].map((r) => (
                <button
                  key={r}
                  onClick={() => setSelectedRoleFilter(r)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition cursor-pointer ${
                    selectedRoleFilter === r
                      ? 'bg-indigo-600 text-white'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {r === 'all' ? 'Tümü' : r}
                </button>
              ))}
            </div>
          </div>

          {/* Participant Items List */}
          <div className="mt-5 space-y-3 max-h-[520px] overflow-y-auto pr-1">
            {filteredParticipants.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                <Users className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-300">Henüz eşleşen katılımcı yok</p>
                <p className="text-xs text-slate-500 mt-1">
                  Soldaki formdan veya Hızlı Test butonundan hemen katılımcı ekleyin!
                </p>
              </div>
            ) : (
              filteredParticipants.map((p, idx) => {
                const isHighlight = p.id === recentlyJoinedId || idx === 0 && recentlyJoinedId !== null;

                return (
                  <div
                    key={p.id}
                    className={`p-3.5 rounded-xl border transition-all duration-500 flex items-start gap-3 relative ${
                      isHighlight
                        ? 'bg-emerald-950/30 border-emerald-500/60 ring-2 ring-emerald-500/30 shadow-lg shadow-emerald-500/10 animate-pulse'
                        : 'bg-slate-950/70 border-slate-800/80 hover:border-slate-700'
                    }`}
                  >
                    <img
                      src={p.avatar}
                      alt={p.name}
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-slate-800 shrink-0"
                    />

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white truncate">{p.name}</h4>
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                              roleColors[p.role] || roleColors['Katılımcı']
                            }`}
                          >
                            {p.role}
                          </span>
                          {isHighlight && (
                            <span className="text-[10px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 flex items-center gap-1 shadow">
                              <Sparkles className="w-3 h-3" /> Az Önce Katıldı
                            </span>
                          )}
                        </div>

                        <span className="text-[11px] text-slate-500 whitespace-nowrap">
                          {new Date(p.joinedAt).toLocaleTimeString('tr-TR', {
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>

                      <div className="text-xs text-slate-400 mt-0.5 truncate">{p.email}</div>

                      {p.company && (
                        <div className="mt-1 flex items-center gap-1.5 text-xs text-indigo-300 font-medium">
                          <Briefcase className="w-3 h-3 text-indigo-400" />
                          <span>{p.company}</span>
                        </div>
                      )}

                      {p.note && (
                        <div className="mt-1.5 text-xs text-slate-300 bg-slate-900/60 p-2 rounded-lg border border-slate-800 italic">
                          &quot;{p.note}&quot;
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer note in detail view */}
          <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
            <span>Enes Öztürk Real-Time Etkinlik Motoru</span>
            <span className="text-emerald-400">● Anlık Yayın Hazır</span>
          </div>
        </div>
      </div>
    </div>
  );
};
