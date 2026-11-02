/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { ActiveTab, RestaurantReview, WalletState } from './types/review';
import { INITIAL_REVIEWS } from './data/initialReviews';
import { Navbar } from './components/Navbar';
import { ReviewCard } from './components/ReviewCard';
import { AddReviewModal } from './components/AddReviewModal';
import { EditReviewModal } from './components/EditReviewModal';
import { BorshInspectModal } from './components/BorshInspectModal';
import { RustCodeViewer } from './components/RustCodeViewer';
import { BorshExplorer } from './components/BorshExplorer';
import { ReadmeViewer } from './components/ReadmeViewer';
import {
  Search,
  MapPin,
  Plus,
  SlidersHorizontal,
  Flame,
  CheckCircle,
  ExternalLink,
  Code2,
  Sparkles,
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reviews');
  const [reviews, setReviews] = useState<RestaurantReview[]>(INITIAL_REVIEWS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [selectedRating, setSelectedRating] = useState<number | 'all'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'rating' | 'likes'>('newest');

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<RestaurantReview | null>(null);
  const [inspectingReview, setInspectingReview] = useState<RestaurantReview | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Wallet simulation state
  const [wallet, setWallet] = useState<WalletState>({
    connected: true,
    publicKey: 'EnesOzTurk9999999999999999999999999999999999',
    balanceSol: 4.85,
    network: 'devnet',
  });

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleConnectWallet = () => {
    setWallet((prev) => ({ ...prev, connected: true }));
    showToast('Phantom Cüzdanı Başarıyla Bağlandı!');
  };

  const handleAirdrop = () => {
    setWallet((prev) => ({ ...prev, balanceSol: prev.balanceSol + 1 }));
    showToast('+1.00 Devnet SOL Cüzdana Eklendi!');
    try {
      confetti({ particleCount: 30, spread: 50, origin: { y: 0.2 } });
    } catch {
      // ignore
    }
  };

  // Review Operations
  const handleAddReview = (newReview: RestaurantReview) => {
    setReviews([newReview, ...reviews]);
    showToast(`"${newReview.title}" incelemesi başarıyla eklendi! (Konum: ${newReview.location})`);
  };

  const handleUpdateReview = (updatedReview: RestaurantReview) => {
    setReviews(reviews.map((r) => (r.id === updatedReview.id ? updatedReview : r)));
    showToast(`"${updatedReview.title}" incelemesi ve konumu başarıyla güncellendi!`);
  };

  const handleLike = (id: string) => {
    setReviews(
      reviews.map((r) => (r.id === id ? { ...r, likes: r.likes + 1 } : r))
    );
  };

  // Unique cities extracted from reviews for filtering
  const availableCities = useMemo(() => {
    const cities = new Set<string>();
    reviews.forEach((r) => {
      const city = r.location.split(',')[0].trim();
      if (city) cities.add(city);
    });
    return Array.from(cities);
  }, [reviews]);

  // Filter & Sort reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter((r) => {
        // Search query matches title, location, or description
        const q = searchQuery.toLowerCase().trim();
        const matchesQuery =
          !q ||
          r.title.toLowerCase().includes(q) ||
          r.location.toLowerCase().includes(q) ||
          r.description.toLowerCase().includes(q);

        // City filter
        const matchesCity =
          selectedCity === 'all' ||
          r.location.toLowerCase().includes(selectedCity.toLowerCase());

        // Rating filter
        const matchesRating =
          selectedRating === 'all' || r.rating >= selectedRating;

        return matchesQuery && matchesCity && matchesRating;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') return b.createdAt - a.createdAt;
        if (sortBy === 'rating') return b.rating - a.rating;
        if (sortBy === 'likes') return b.likes - a.likes;
        return 0;
      });
  }, [reviews, searchQuery, selectedCity, selectedRating, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'add') {
            setIsAddModalOpen(true);
          } else {
            setActiveTab(tab);
          }
        }}
        wallet={wallet}
        onConnectWallet={handleConnectWallet}
        onAirdrop={handleAirdrop}
      />

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-amber-400 text-slate-950 px-4 py-2.5 rounded-lg shadow-xl text-xs font-semibold flex items-center gap-2 animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        
        {/* VIEW 1: REVIEWS FEED */}
        {activeTab === 'reviews' && (
          <div className="space-y-8">
            
            {/* Hero / Graduation Headline Split */}
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-slate-900 to-amber-950/40 border border-slate-800 p-6 sm:p-8">
              <div className="max-w-3xl space-y-4">
                
                {/* Clean unboxed kicker (Anti-slop §1.A & §1.B) */}
                <div className="flex items-center gap-2 text-xs font-medium text-amber-400">
                  <Flame className="w-4 h-4" />
                  <span>Solana Developer Graduation Project</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">Geliştirici: Enes Öztürk</span>
                </div>

                <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight text-balance leading-tight">
                  Merkeziyetsiz Restoran İnceleme Protokolü
                </h1>

                <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                  Solana üzerinde çalışan akıllı sözleşme mimarisine <strong className="text-amber-400 font-semibold">`location` (konum)</strong> parametresi eklenerek genişletildi.
                  Her restoran için PDA hesabı üzerinden şeffaf, değiştirilemez ve sansürlenemez değerlendirmeler tutulur.
                </p>

                {/* Steps checklist badge strip */}
                <div className="pt-2 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Adım 1: AccountState.location</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Adım 2: ReviewInstruction & Payload</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Adım 3: unpack() Konum Çözümleme</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950/80 px-2.5 py-1 rounded-md border border-slate-800">
                    <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Adım 4: account_data Kaydı</span>
                  </div>
                  <div className="flex items-center gap-1.5 bg-amber-500/10 px-2.5 py-1 rounded-md border border-amber-500/30 text-amber-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Bonus: Ön Yüz Konum Filtresi</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="flex items-center gap-2 px-4 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-semibold rounded-lg transition-colors cursor-pointer shadow-md shadow-amber-500/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Yeni İnceleme Ekle</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('code')}
                    className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors cursor-pointer border border-slate-700"
                  >
                    <Code2 className="w-4 h-4 text-amber-400" />
                    <span>Rust Sözleşmesini Görüntüle</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                {/* Search Input */}
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Restoran adı, konum veya semt ile arayın (örn: Kadıköy, Alsancak)..."
                    className="w-full pl-9 pr-4 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
                    >
                      Temizle
                    </button>
                  )}
                </div>

                {/* Sort selector */}
                <div className="flex items-center gap-2 shrink-0">
                  <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="bg-slate-950 border border-slate-800 rounded-lg px-2.5 py-2 text-xs text-slate-300 focus:outline-none focus:border-amber-400 cursor-pointer"
                  >
                    <option value="newest">En Yeni İncelemeler</option>
                    <option value="rating">En Yüksek Puan (5-1)</option>
                    <option value="likes">En Çok Beğenilenler</option>
                  </select>
                </div>
              </div>

              {/* Location Quick Filter (Functional Interactive Buttons per §1.A) */}
              <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-800/80">
                <span className="text-xs text-slate-400 flex items-center gap-1 mr-1">
                  <MapPin className="w-3 h-3 text-amber-400" />
                  <span>Konum Filtresi:</span>
                </span>

                <button
                  onClick={() => setSelectedCity('all')}
                  className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                    selectedCity === 'all'
                      ? 'bg-amber-400 text-slate-950 font-semibold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  Tüm Şehirler ({reviews.length})
                </button>

                {availableCities.map((city) => {
                  const count = reviews.filter((r) =>
                    r.location.toLowerCase().includes(city.toLowerCase())
                  ).length;
                  return (
                    <button
                      key={city}
                      onClick={() => setSelectedCity(city)}
                      className={`px-3 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                        selectedCity === city
                          ? 'bg-amber-400 text-slate-950 font-semibold'
                          : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      {city} ({count})
                    </button>
                  );
                })}

                {/* Rating filter */}
                <div className="ml-auto flex items-center gap-1">
                  <button
                    onClick={() => setSelectedRating(selectedRating === 5 ? 'all' : 5)}
                    className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                      selectedRating === 5
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    ★ Yalnızca 5 Yıldız
                  </button>
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            {filteredReviews.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {filteredReviews.map((review) => (
                  <ReviewCard
                    key={review.id}
                    review={review}
                    onEdit={(rev) => setEditingReview(rev)}
                    onInspectBorsh={(rev) => setInspectingReview(rev)}
                    onLike={handleLike}
                  />
                ))}
              </div>
            ) : (
              <div className="p-12 text-center bg-slate-900/40 border border-slate-800/80 rounded-xl space-y-3">
                <MapPin className="w-8 h-8 text-slate-600 mx-auto" />
                <h3 className="text-base font-semibold text-white">
                  Aramanıza uygun restoran incelemesi bulunamadı
                </h3>
                <p className="text-xs text-slate-400 max-w-sm mx-auto">
                  "{searchQuery}" aramasını veya seçilen şehir filtresini temizleyebilir ya da bu konuma ilk incelemeyi siz ekleyebilirsiniz.
                </p>
                <div className="pt-2 flex items-center justify-center gap-3">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCity('all');
                      setSelectedRating('all');
                    }}
                    className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded-lg transition-colors cursor-pointer"
                  >
                    Filtreleri Temizle
                  </button>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-3 py-1.5 text-xs text-slate-950 bg-amber-400 hover:bg-amber-300 font-semibold rounded-lg transition-colors cursor-pointer"
                  >
                    + Bu Restoranı Ekle
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SMART CONTRACT CODE INSPECTOR */}
        {activeTab === 'code' && <RustCodeViewer />}

        {/* VIEW 3: BORSH & PDA EXPLORER */}
        {activeTab === 'borsh' && <BorshExplorer />}

        {/* VIEW 4: README & GRADUATION REPORT */}
        {activeTab === 'readme' && <ReadmeViewer />}
      </main>

      {/* Modals */}
      <AddReviewModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddReview}
        userPubkey={wallet.publicKey}
      />

      <EditReviewModal
        review={editingReview}
        isOpen={!!editingReview}
        onClose={() => setEditingReview(null)}
        onSubmit={handleUpdateReview}
      />

      <BorshInspectModal
        review={inspectingReview}
        isOpen={!!inspectingReview}
        onClose={() => setInspectingReview(null)}
      />

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-800/80 bg-slate-950 py-8 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-white">Solana Restaurant Review</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Mezuniyet Bitirme Projesi</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span className="text-amber-400 font-semibold">Enes Öztürk 🔥</span>
          </div>

          <div className="flex items-center gap-6">
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              Rust Kaynak Kodları
            </button>
            <button
              onClick={() => setActiveTab('readme')}
              className="hover:text-amber-400 transition-colors cursor-pointer"
            >
              README.md Raporu
            </button>
            <a
              href="https://solana.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Solana Ekosistemi</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
