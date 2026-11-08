/**
 * Movie Storefront & Customer Orders (Siparişlerim) View
 * Author: Enes Öztürk
 */

import React, { useState, useEffect } from 'react';
import {
  Film,
  ShoppingBag,
  Search,
  CheckCircle2,
  Calendar,
  User,
  Clapperboard,
  Users,
  Tag,
  AlertCircle,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PackageCheck,
} from 'lucide-react';
import { api } from '../api/client.ts';
import { MovieListDto, GenreDto, OrderListDto, CustomerAuthSession } from '../types.ts';

interface StorefrontProps {
  customerSession: CustomerAuthSession | null;
  genres: GenreDto[];
  onOpenAuth: () => void;
  onNavigateToApi: () => void;
}

export const Storefront: React.FC<StorefrontProps> = ({
  customerSession,
  genres,
  onOpenAuth,
  onNavigateToApi,
}) => {
  const [movies, setMovies] = useState<MovieListDto[]>([]);
  const [myOrders, setMyOrders] = useState<OrderListDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [purchasingId, setPurchasingId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error'>('success');
  const [activeSubTab, setActiveSubTab] = useState<'catalog' | 'orders'>('catalog');

  const loadData = async () => {
    try {
      setLoading(true);
      const fetchedMovies = await api.getMovies();
      setMovies(fetchedMovies);

      if (customerSession) {
        const fetchedOrders = await api.getMyOrders();
        setMyOrders(fetchedOrders);
      } else {
        setMyOrders([]);
      }
    } catch (err: any) {
      console.error('Veri yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [customerSession]);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToastMessage(msg);
    setToastType(type);
    setTimeout(() => setToastMessage(null), 5000);
  };

  const handlePurchase = async (movie: MovieListDto) => {
    if (!customerSession) {
      showToast('Yetkisiz işlem! Film satın almak için lütfen Müşteri (Customer) girişi yapınız.', 'error');
      onOpenAuth();
      return;
    }

    try {
      setPurchasingId(movie.id);
      const newOrder = await api.purchaseMovie(movie.id);
      showToast(`🎉 "${movie.title}" filmi başarıyla satın alındı! Siparişlerinize eklendi.`, 'success');
      // Refresh orders
      const orders = await api.getMyOrders();
      setMyOrders(orders);
    } catch (err: any) {
      showToast(err.message || 'Satın alma işlemi başarısız oldu.', 'error');
    } finally {
      setPurchasingId(null);
    }
  };

  const filteredMovies = movies.filter(m => {
    const matchesSearch =
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.directorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.actors.some(a => a.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesGenre = selectedGenre === 'all' || m.genre.toLowerCase() === selectedGenre.toLowerCase();

    return matchesSearch && matchesGenre;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed bottom-6 right-6 z-50 p-4 rounded-xl shadow-2xl border flex items-center gap-3 max-w-md animate-in slide-in-from-bottom duration-300 ${
            toastType === 'success'
              ? 'bg-emerald-950/90 text-emerald-200 border-emerald-500/40'
              : 'bg-rose-950/90 text-rose-200 border-rose-500/40'
          }`}
        >
          {toastType === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          )}
          <div className="text-xs font-medium leading-relaxed">{toastMessage}</div>
        </div>
      )}

      {/* Hero Banner with Clean Architecture Badge & Enes Öztürk Signature */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/40 border border-slate-800 p-6 sm:p-8">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Movie Store WebApi - Enes Öztürk İmzalı</span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
            Sinemanın Seçkin Eserleri & Güvenli Satın Alma
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-5">
            Clean Architecture, AutoMapper, FluentValidation ve JWT korumalı REST servisleri.
            Müşteriler diledikleri filmi satın alabilir, geçmiş siparişler filmler pasife alınsa dahi bozulmadan korunur.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setActiveSubTab('catalog')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeSubTab === 'catalog'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Film className="w-4 h-4" />
              Film Kataloğu ({movies.length})
            </button>

            <button
              onClick={() => {
                if (!customerSession) {
                  onOpenAuth();
                } else {
                  setActiveSubTab('orders');
                }
              }}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all flex items-center gap-2 ${
                activeSubTab === 'orders'
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <PackageCheck className="w-4 h-4" />
              Siparişlerim {customerSession ? `(${myOrders.length})` : '(Giriş Gerekli)'}
            </button>

            <button
              onClick={onNavigateToApi}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-850 hover:bg-slate-800 text-slate-300 border border-slate-700/80 transition-colors flex items-center gap-1.5"
            >
              <span>Swagger API'de Test Et</span>
              <ArrowRight className="w-3.5 h-3.5 text-rose-400" />
            </button>
          </div>
        </div>

        {/* Decorative background glow */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-rose-600/10 blur-3xl pointer-events-none" />
      </div>

      {/* Customer Quick Profile bar if logged in */}
      {customerSession && (
        <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-semibold text-white">
                Aktif Oturum: {customerSession.customer.fullName} ({customerSession.customer.email})
              </div>
              <div className="text-[11px] text-slate-400 flex items-center gap-2 mt-0.5">
                <span>Rol: <strong className="text-emerald-400">Customer</strong></span>
                <span>•</span>
                <span>Toplam Satın Alma: <strong className="text-white">{myOrders.length} film</strong></span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 mr-1">Favori Türleriniz:</span>
            {customerSession.customer.favoriteGenres && customerSession.customer.favoriteGenres.length > 0 ? (
              customerSession.customer.favoriteGenres.map(g => (
                <span
                  key={g}
                  className="px-2 py-0.5 text-[10px] font-medium rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20"
                >
                  {g}
                </span>
              ))
            ) : (
              <span className="text-[11px] text-slate-500 italic">Belirtilmedi</span>
            )}
          </div>
        </div>
      )}

      {/* MAIN VIEW: CATALOG */}
      {activeSubTab === 'catalog' && (
        <div className="space-y-6">
          {/* Filters & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            {/* Search */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Film adı, yönetmen veya oyuncu ara..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>

            {/* Genre filter buttons */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
              <button
                onClick={() => setSelectedGenre('all')}
                className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                  selectedGenre === 'all'
                    ? 'bg-rose-600 text-white'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Tümü
              </button>
              {genres.map(g => (
                <button
                  key={g.id}
                  onClick={() => setSelectedGenre(g.name)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium whitespace-nowrap transition-colors ${
                    selectedGenre.toLowerCase() === g.name.toLowerCase()
                      ? 'bg-rose-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {g.name}
                </button>
              ))}
            </div>
          </div>

          {/* Film Grid */}
          {loading ? (
            <div className="py-20 text-center text-slate-400 text-sm">
              Filmler yükleniyor...
            </div>
          ) : filteredMovies.length === 0 ? (
            <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800">
              <Film className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <h3 className="text-slate-300 font-semibold text-sm">Kriterlere uygun film bulunamadı</h3>
              <p className="text-xs text-slate-500 mt-1">Arama filtrenizi temizleyip tekrar deneyiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredMovies.map(movie => {
                const isPurchasing = purchasingId === movie.id;
                const customerOwns = myOrders.some(o => o.movieId === movie.id);

                return (
                  <div
                    key={movie.id}
                    className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 flex flex-col justify-between transition-all hover:shadow-xl hover:shadow-rose-950/20 group"
                  >
                    <div>
                      {/* Top badges */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-2.5 py-1 text-[11px] font-semibold rounded-full bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 flex items-center gap-1">
                          <Tag className="w-3 h-3" />
                          {movie.genre}
                        </span>

                        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {movie.year}
                        </span>
                      </div>

                      {/* Film Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-rose-400 transition-colors mb-2">
                        {movie.title}
                      </h3>

                      {/* Director (Yönetmen) */}
                      <div className="mb-3 text-xs text-slate-300 flex items-center gap-2">
                        <Clapperboard className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <div>
                          <span className="text-slate-400">Yönetmen: </span>
                          <span className="font-semibold text-slate-200">{movie.directorName}</span>
                        </div>
                      </div>

                      {/* Actors (Oyuncular) */}
                      <div className="mb-4 text-xs text-slate-300">
                        <div className="flex items-center gap-1.5 text-slate-400 mb-1.5">
                          <Users className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                          <span>Oyuncular:</span>
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {movie.actors && movie.actors.length > 0 ? (
                            movie.actors.map((actor, idx) => (
                              <span
                                key={idx}
                                className="px-2 py-0.5 rounded text-[11px] bg-slate-800 text-slate-300 border border-slate-700/60"
                              >
                                {actor}
                              </span>
                            ))
                          ) : (
                            <span className="text-slate-500 text-[11px] italic">Oyuncu atanmadı</span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Bottom: Price & Purchase Action */}
                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase font-medium">Satış Fiyatı</span>
                        <div className="text-lg font-black text-white">
                          {movie.price.toFixed(2)} <span className="text-xs font-semibold text-rose-400">TL</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {customerOwns && (
                          <span
                            title="Bu filmi daha önce satın aldınız. Tekrar satın alabilirsiniz."
                            className="px-2 py-1 text-[10px] rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center gap-1"
                          >
                            <CheckCircle2 className="w-3 h-3" />
                            Kütüphanenizde
                          </span>
                        )}

                        <button
                          onClick={() => handlePurchase(movie)}
                          disabled={isPurchasing}
                          className="px-4 py-2 text-xs font-semibold rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white transition-all shadow-md shadow-rose-600/20 flex items-center gap-1.5 disabled:opacity-50"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>{isPurchasing ? 'Alınıyor...' : 'Satın Al'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* ORDERS VIEW (SİPARİŞLERİM) */}
      {activeSubTab === 'orders' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-indigo-400" />
                Siparişlerim (Satın Alma Geçmişi)
              </h2>
              <p className="text-xs text-slate-400">
                Satın alınan filmler sonradan silinse veya pasife alınsa dahi sipariş geçmişiniz (anlık fiyat ve başlık) eksiksiz korunur.
              </p>
            </div>
            <button
              onClick={loadData}
              className="px-3 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            >
              Yenile
            </button>
          </div>

          {!customerSession ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
              <ShoppingBag className="w-10 h-10 text-slate-500 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-sm">Giriş Yapılmadı</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Siparişlerinizi görüntülemek için lütfen müşteri hesabınız ile giriş yapınız.
              </p>
              <button
                onClick={onOpenAuth}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Giriş Yap
              </button>
            </div>
          ) : myOrders.length === 0 ? (
            <div className="p-8 text-center rounded-2xl bg-slate-900 border border-slate-800">
              <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
              <h3 className="text-white font-semibold text-sm">Henüz Siparişiniz Bulunmuyor</h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                Film kataloğundan dilediğiniz filmi anında satın alabilirsiniz.
              </p>
              <button
                onClick={() => setActiveSubTab('catalog')}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold"
              >
                Kataloğa Git
              </button>
            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 text-slate-400 uppercase font-semibold border-b border-slate-800">
                    <tr>
                      <th className="px-5 py-3.5">Sipariş No</th>
                      <th className="px-5 py-3.5">Satın Alınan Film</th>
                      <th className="px-5 py-3.5">Fiyat (Snapshot)</th>
                      <th className="px-5 py-3.5">Satın Alma Tarihi</th>
                      <th className="px-5 py-3.5">Film Durumu</th>
                      <th className="px-5 py-3.5 text-right">İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-200">
                    {myOrders.map(order => (
                      <tr key={order.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="px-5 py-4 font-mono text-slate-400">#{order.id}</td>
                        <td className="px-5 py-4 font-semibold text-white">
                          {order.movieTitle}
                        </td>
                        <td className="px-5 py-4 font-semibold text-rose-400">
                          {order.price.toFixed(2)} TL
                        </td>
                        <td className="px-5 py-4 text-slate-400 flex items-center gap-1.5 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(order.purchaseDate).toLocaleString('tr-TR')}
                        </td>
                        <td className="px-5 py-4">
                          {order.movieIsCurrentlyActive ? (
                            <span className="px-2 py-0.5 text-[10px] rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
                              Aktif Satışta
                            </span>
                          ) : (
                            <span
                              title="Bu film mağazadan pasife alınmıştır ancak sipariş kaydınız korunmaktadır."
                              className="px-2 py-0.5 text-[10px] rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium"
                            >
                              Pasife Alındı (Soft-Delete)
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4 text-right">
                          <button
                            onClick={() => {
                              const movie = movies.find(m => m.id === order.movieId);
                              if (movie) handlePurchase(movie);
                              else showToast('Bu film pasif durumda olduğundan tekrar satın alınamaz.', 'error');
                            }}
                            className="px-3 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                          >
                            Tekrar Al
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
