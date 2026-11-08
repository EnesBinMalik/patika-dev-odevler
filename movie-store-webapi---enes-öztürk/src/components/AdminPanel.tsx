/**
 * Admin Panel: Full CRUD for Movies, Actors, Directors, Customers & Relational Integrity Guard
 * Author: Enes Öztürk
 */

import React, { useState, useEffect } from 'react';
import {
  Film,
  Users,
  Clapperboard,
  UserCheck,
  Package,
  Plus,
  Trash2,
  Edit3,
  AlertTriangle,
  CheckCircle2,
  X,
  RefreshCw,
  Search,
  Sliders,
} from 'lucide-react';
import { api } from '../api/client.ts';
import {
  MovieListDto,
  ActorListDto,
  DirectorListDto,
  CustomerListDto,
  OrderListDto,
  GenreDto,
} from '../types.ts';

export const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'movies' | 'actors' | 'directors' | 'customers' | 'orders'>('movies');

  // Data states
  const [movies, setMovies] = useState<MovieListDto[]>([]);
  const [actors, setActors] = useState<ActorListDto[]>([]);
  const [directors, setDirectors] = useState<DirectorListDto[]>([]);
  const [customers, setCustomers] = useState<CustomerListDto[]>([]);
  const [orders, setOrders] = useState<OrderListDto[]>([]);
  const [genres, setGenres] = useState<GenreDto[]>([]);

  const [loading, setLoading] = useState(false);
  const [alertInfo, setAlertInfo] = useState<{ message: string; type: 'success' | 'error' | 'warning' } | null>(null);

  // Modal states
  const [showMovieModal, setShowMovieModal] = useState(false);
  const [editingMovie, setEditingMovie] = useState<any | null>(null);
  const [movieForm, setMovieForm] = useState({
    title: '',
    year: new Date().getFullYear(),
    genreId: 1,
    directorId: 1,
    actorIds: [] as number[],
    price: 49.90,
  });

  const [showActorModal, setShowActorModal] = useState(false);
  const [actorForm, setActorForm] = useState({ firstName: '', lastName: '' });

  const [showDirectorModal, setShowDirectorModal] = useState(false);
  const [directorForm, setDirectorForm] = useState({ firstName: '', lastName: '' });

  const loadAll = async () => {
    try {
      setLoading(true);
      const [m, a, d, c, o, g] = await Promise.all([
        api.getMovies({ includeInactive: true }),
        api.getActors(),
        api.getDirectors(),
        api.getCustomers(),
        api.getAllOrders(),
        api.getGenres(),
      ]);
      setMovies(m);
      setActors(a);
      setDirectors(d);
      setCustomers(c);
      setOrders(o);
      setGenres(g);
    } catch (err: any) {
      setAlertInfo({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  const triggerAlert = (message: string, type: 'success' | 'error' | 'warning') => {
    setAlertInfo({ message, type });
    setTimeout(() => setAlertInfo(null), 6000);
  };

  // Movie actions
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await api.updateMovie(editingMovie.id, movieForm);
        triggerAlert(`"${movieForm.title}" filmi başarıyla güncellendi.`, 'success');
      } else {
        await api.createMovie(movieForm);
        triggerAlert(`"${movieForm.title}" filmi sisteme eklendi.`, 'success');
      }
      setShowMovieModal(false);
      setEditingMovie(null);
      loadAll();
    } catch (err: any) {
      triggerAlert(err.message, 'error');
    }
  };

  const handleDeleteMovie = async (movie: MovieListDto) => {
    if (!confirm(`"${movie.title}" filmini silmek / pasife almak istediğinizden emin misiniz?`)) return;
    try {
      const res = await api.deleteMovie(movie.id);
      triggerAlert(res.message, res.softDeleted ? 'warning' : 'success');
      loadAll();
    } catch (err: any) {
      triggerAlert(err.message, 'error');
    }
  };

  // Actor actions
  const handleSaveActor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createActor(actorForm);
      triggerAlert(`Oyuncu ${actorForm.firstName} ${actorForm.lastName} başarıyla eklendi.`, 'success');
      setShowActorModal(false);
      setActorForm({ firstName: '', lastName: '' });
      loadAll();
    } catch (err: any) {
      triggerAlert(err.message, 'error');
    }
  };

  const handleDeleteActor = async (actor: ActorListDto) => {
    if (!confirm(`"${actor.fullName}" oyuncusunu silmek istediğinizden emin misiniz?`)) return;
    try {
      const res = await api.deleteActor(actor.id);
      triggerAlert(res.message, 'success');
      loadAll();
    } catch (err: any) {
      // Catch BusinessRuleException: İlişkili filmleri bulunan oyuncu silinemez
      triggerAlert(err.message, 'error');
    }
  };

  // Director actions
  const handleSaveDirector = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.createDirector(directorForm);
      triggerAlert(`Yönetmen ${directorForm.firstName} ${directorForm.lastName} başarıyla eklendi.`, 'success');
      setShowDirectorModal(false);
      setDirectorForm({ firstName: '', lastName: '' });
      loadAll();
    } catch (err: any) {
      triggerAlert(err.message, 'error');
    }
  };

  const handleDeleteDirector = async (director: DirectorListDto) => {
    if (!confirm(`"${director.fullName}" yönetmenini silmek istediğinizden emin misiniz?`)) return;
    try {
      const res = await api.deleteDirector(director.id);
      triggerAlert(res.message, 'success');
      loadAll();
    } catch (err: any) {
      // Catch BusinessRuleException: İlişkili filmleri bulunan yönetmen silinemez
      triggerAlert(err.message, 'error');
    }
  };

  // Customer actions
  const handleDeleteCustomer = async (cust: CustomerListDto) => {
    if (!confirm(`"${cust.fullName}" müşterisini silmek istediğinizden emin misiniz?`)) return;
    try {
      const res = await api.deleteCustomer(cust.id);
      triggerAlert(res.message, 'success');
      loadAll();
    } catch (err: any) {
      triggerAlert(err.message, 'error');
    }
  };

  return (
    <div className="space-y-6">
      {/* Alert banner */}
      {alertInfo && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between gap-3 text-xs font-medium animate-in fade-in duration-200 ${
            alertInfo.type === 'success'
              ? 'bg-emerald-950/80 text-emerald-200 border-emerald-500/40'
              : alertInfo.type === 'warning'
              ? 'bg-amber-950/80 text-amber-200 border-amber-500/40'
              : 'bg-rose-950/80 text-rose-200 border-rose-500/40'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertInfo.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />}
            {alertInfo.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />}
            {alertInfo.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />}
            <span>{alertInfo.message}</span>
          </div>
          <button onClick={() => setAlertInfo(null)} className="p-1 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header and Subnav */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-amber-400" />
            Yönetim & Veri Bütünlüğü Paneli
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Gereksinim 9: Silme servislerinde veri tutarlılığı dikkate alınmalıdır. Diğer tablolarda ilişkili datası bulunan kayıtlar silinemez!
          </p>
        </div>

        <button
          onClick={loadAll}
          disabled={loading}
          className="px-3 py-1.5 text-xs rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 self-start md:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Yenile</span>
        </button>
      </div>

      {/* Tab navigation */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
        <button
          onClick={() => setActiveTab('movies')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'movies'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Film className="w-4 h-4" />
          Filmler ({movies.length})
        </button>

        <button
          onClick={() => setActiveTab('actors')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'actors'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          Oyuncular ({actors.length})
        </button>

        <button
          onClick={() => setActiveTab('directors')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'directors'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Clapperboard className="w-4 h-4" />
          Yönetmenler ({directors.length})
        </button>

        <button
          onClick={() => setActiveTab('customers')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'customers'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <UserCheck className="w-4 h-4" />
          Müşteriler ({customers.length})
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            activeTab === 'orders'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Tüm Siparişler ({orders.length})
        </button>
      </div>

      {/* 1. MOVIES TAB */}
      {activeTab === 'movies' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              * Geçmiş sipariş ilişkisi olan filmler soft-delete ile pasife alınır; sipariş verisi etkilenmez.
            </p>
            <button
              onClick={() => {
                setEditingMovie(null);
                setMovieForm({
                  title: '',
                  year: 2024,
                  genreId: genres[0]?.id || 1,
                  directorId: directors[0]?.id || 1,
                  actorIds: [actors[0]?.id || 1],
                  price: 49.90,
                });
                setShowMovieModal(true);
              }}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Film Ekle</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Film Adı</th>
                  <th className="px-4 py-3">Yıl</th>
                  <th className="px-4 py-3">Tür</th>
                  <th className="px-4 py-3">Yönetmen</th>
                  <th className="px-4 py-3">Oyuncular</th>
                  <th className="px-4 py-3">Fiyat</th>
                  <th className="px-4 py-3">Durum</th>
                  <th className="px-4 py-3 text-right">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {movies.map(m => (
                  <tr key={m.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-slate-400">#{m.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{m.title}</td>
                    <td className="px-4 py-3 text-slate-300">{m.year}</td>
                    <td className="px-4 py-3">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-300 text-[11px]">
                        {m.genre}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{m.directorName}</td>
                    <td className="px-4 py-3 text-slate-400 max-w-xs truncate">
                      {m.actors.join(', ')}
                    </td>
                    <td className="px-4 py-3 font-semibold text-rose-400">{m.price.toFixed(2)} TL</td>
                    <td className="px-4 py-3">
                      {m.isActive ? (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Aktif
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Pasif (Soft-Delete)
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right space-x-2">
                      <button
                        onClick={() => {
                          setEditingMovie(m);
                          setMovieForm({
                            title: m.title,
                            year: m.year,
                            genreId: genres.find(g => g.name === m.genre)?.id || 1,
                            directorId: directors.find(d => d.fullName === m.directorName)?.id || 1,
                            actorIds: [actors[0]?.id || 1],
                            price: m.price,
                          });
                          setShowMovieModal(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-white rounded bg-slate-800 hover:bg-slate-700"
                        title="Düzenle"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMovie(m)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800 hover:bg-rose-500/20"
                        title="Pasife Al / Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 2. ACTORS TAB */}
      {activeTab === 'actors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              ⚠️ Veri Tutarlılığı Kuralı: Aktif bir filmde oynayan oyuncular kesinlikle silinemez.
            </p>
            <button
              onClick={() => setShowActorModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Oyuncu Ekle</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Soyad</th>
                  <th className="px-4 py-3">Oynadığı Film Sayısı</th>
                  <th className="px-4 py-3">İlişki Durumu</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {actors.map(a => (
                  <tr key={a.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-slate-400">#{a.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{a.firstName}</td>
                    <td className="px-4 py-3 font-semibold text-white">{a.lastName}</td>
                    <td className="px-4 py-3 text-slate-300">{a.moviesCount} film</td>
                    <td className="px-4 py-3">
                      {a.moviesCount > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          Aktif Filmleri Var (Korumalı)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400">
                          İlişkisiz
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteActor(a)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800 hover:bg-rose-500/20"
                        title="Silmeyi Dene (İlişki varsa hata fırlatır)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 3. DIRECTORS TAB */}
      {activeTab === 'directors' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-xs text-slate-400">
              ⚠️ Veri Tutarlılığı Kuralı: Sistemde yönettiği filmler bulunan yönetmenler kesinlikle silinemez.
            </p>
            <button
              onClick={() => setShowDirectorModal(true)}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center gap-1.5 shadow-md shadow-rose-600/20"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Yönetmen Ekle</span>
            </button>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Ad</th>
                  <th className="px-4 py-3">Soyad</th>
                  <th className="px-4 py-3">Yönettiği Film Sayısı</th>
                  <th className="px-4 py-3">İlişki Durumu</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {directors.map(d => (
                  <tr key={d.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-slate-400">#{d.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{d.firstName}</td>
                    <td className="px-4 py-3 font-semibold text-white">{d.lastName}</td>
                    <td className="px-4 py-3 text-slate-300">{d.directedMoviesCount} film</td>
                    <td className="px-4 py-3">
                      {d.directedMoviesCount > 0 ? (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20">
                          Yönetilen Filmleri Var (Korumalı)
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-slate-800 text-slate-400">
                          İlişkisiz
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteDirector(d)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800 hover:bg-rose-500/20"
                        title="Silmeyi Dene (İlişkili filmi varsa hata fırlatır)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. CUSTOMERS TAB */}
      {activeTab === 'customers' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Müşteri</th>
                  <th className="px-4 py-3">E-Posta</th>
                  <th className="px-4 py-3">Favori Türler</th>
                  <th className="px-4 py-3">Sipariş Adedi</th>
                  <th className="px-4 py-3 text-right">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {customers.map(c => (
                  <tr key={c.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-slate-400">#{c.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{c.fullName}</td>
                    <td className="px-4 py-3 text-slate-300">{c.email}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1">
                        {c.favoriteGenres.map(g => (
                          <span key={g} className="px-2 py-0.5 text-[10px] rounded bg-rose-500/10 text-rose-300">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">{c.totalOrdersCount} sipariş</td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={() => handleDeleteCustomer(c)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded bg-slate-800 hover:bg-rose-500/20"
                        title="Silmeyi Dene (Siparişi varsa hata fırlatır)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. ALL ORDERS REPORT */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Sipariş No</th>
                  <th className="px-4 py-3">Müşteri</th>
                  <th className="px-4 py-3">Satın Alınan Film</th>
                  <th className="px-4 py-3">Snapshot Fiyat</th>
                  <th className="px-4 py-3">Satın Alma Tarihi</th>
                  <th className="px-4 py-3">Film Satış Durumu</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-200">
                {orders.map(o => (
                  <tr key={o.id} className="hover:bg-slate-850/50">
                    <td className="px-4 py-3 font-mono text-slate-400">#{o.id}</td>
                    <td className="px-4 py-3 font-semibold text-white">{o.customerName}</td>
                    <td className="px-4 py-3 font-semibold text-rose-400">{o.movieTitle}</td>
                    <td className="px-4 py-3 text-slate-200 font-bold">{o.price.toFixed(2)} TL</td>
                    <td className="px-4 py-3 text-slate-400">
                      {new Date(o.purchaseDate).toLocaleString('tr-TR')}
                    </td>
                    <td className="px-4 py-3">
                      {o.movieIsCurrentlyActive ? (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-emerald-500/10 text-emerald-400">
                          Aktif Film
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 text-[10px] rounded bg-amber-500/10 text-amber-400">
                          Pasife Alınmış (Veri Korundu)
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Movie Form Modal */}
      {showMovieModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-base font-bold text-white">
                {editingMovie ? 'Film Bilgilerini Güncelle' : 'Yeni Film Ekle (DTO & FluentValidation)'}
              </h3>
              <button onClick={() => setShowMovieModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovie} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Film Adı *</label>
                <input
                  type="text"
                  required
                  value={movieForm.title}
                  onChange={e => setMovieForm({ ...movieForm, title: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Yıl (≥ 1888) *</label>
                  <input
                    type="number"
                    min="1888"
                    required
                    value={movieForm.year}
                    onChange={e => setMovieForm({ ...movieForm, year: parseInt(e.target.value) || 2024 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Fiyat (TL) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.1"
                    required
                    value={movieForm.price}
                    onChange={e => setMovieForm({ ...movieForm, price: parseFloat(e.target.value) || 1 })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Film Türü *</label>
                  <select
                    value={movieForm.genreId}
                    onChange={e => setMovieForm({ ...movieForm, genreId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    {genres.map(g => (
                      <option key={g.id} value={g.id}>{g.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Yönetmen *</label>
                  <select
                    value={movieForm.directorId}
                    onChange={e => setMovieForm({ ...movieForm, directorId: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                  >
                    {directors.map(d => (
                      <option key={d.id} value={d.id}>{d.fullName}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-medium mb-1">Oyuncular (Çoklu Seçim) *</label>
                <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto p-2 bg-slate-950 rounded-lg border border-slate-800">
                  {actors.map(a => {
                    const checked = movieForm.actorIds.includes(a.id);
                    return (
                      <label key={a.id} className="flex items-center gap-2 text-slate-300 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => {
                            const newIds = checked
                              ? movieForm.actorIds.filter(id => id !== a.id)
                              : [...movieForm.actorIds, a.id];
                            setMovieForm({ ...movieForm, actorIds: newIds });
                          }}
                          className="rounded text-rose-600 focus:ring-0"
                        />
                        <span>{a.fullName}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowMovieModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
                >
                  Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Actor Modal */}
      {showActorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Yeni Oyuncu Ekle</h3>
            <form onSubmit={handleSaveActor} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ad *</label>
                <input
                  type="text"
                  required
                  value={actorForm.firstName}
                  onChange={e => setActorForm({ ...actorForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Soyad *</label>
                <input
                  type="text"
                  required
                  value={actorForm.lastName}
                  onChange={e => setActorForm({ ...actorForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowActorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Director Modal */}
      {showDirectorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-sm p-6 space-y-4">
            <h3 className="text-base font-bold text-white">Yeni Yönetmen Ekle</h3>
            <form onSubmit={handleSaveDirector} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-medium mb-1">Ad *</label>
                <input
                  type="text"
                  required
                  value={directorForm.firstName}
                  onChange={e => setDirectorForm({ ...directorForm, firstName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div>
                <label className="block text-slate-300 font-medium mb-1">Soyad *</label>
                <input
                  type="text"
                  required
                  value={directorForm.lastName}
                  onChange={e => setDirectorForm({ ...directorForm, lastName: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white"
                />
              </div>
              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowDirectorModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold"
                >
                  Ekle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
