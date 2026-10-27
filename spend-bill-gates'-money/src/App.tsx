/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { StickyBalance } from './components/StickyBalance';
import { FilterBar, SortOption } from './components/FilterBar';
import { ItemCard } from './components/ItemCard';
import { Receipt } from './components/Receipt';
import { Footer } from './components/Footer';
import { ITEMS, INITIAL_BALANCE } from './data/items';
import { Item, CartState, ItemCategory, Language } from './types';
import {
  playBuySound,
  playSellSound,
  playCashRegisterSound,
  playResetSound,
  setSoundEnabled,
  isSoundEnabled,
} from './utils/audio';

const STORAGE_KEY = 'spend_bill_gates_cart_v1';
const LANG_STORAGE_KEY = 'spend_bill_gates_lang';

export default function App() {
  // Language state (default to Turkish as requested in homework 'Ödev 2', with English toggle)
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem(LANG_STORAGE_KEY);
      if (savedLang === 'en' || savedLang === 'tr') return savedLang;
    }
    return 'tr';
  });

  // Sound state
  const [soundOn, setSoundOn] = useState<boolean>(true);

  // Cart state: itemId -> quantity
  const [cart, setCart] = useState<CartState>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) return JSON.parse(saved);
      } catch {
        // ignore parse error
      }
    }
    return {};
  });

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory>('all');
  const [sortBy, setSortBy] = useState<SortOption>('default');

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  // Sync language to localStorage
  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, lang);
    } catch {
      // ignore
    }
  };

  // Toggle sound
  const handleToggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    setSoundEnabled(next);
  };

  // Calculate Total Spent
  const totalSpent = useMemo(() => {
    return Object.entries(cart).reduce((total, [itemId, quantity]) => {
      const item = ITEMS.find((i) => i.id === itemId);
      if (!item || quantity <= 0) return total;
      return total + item.price * quantity;
    }, 0);
  }, [cart]);

  // Current Remaining Balance
  const balance = Math.max(0, INITIAL_BALANCE - totalSpent);

  // Total distinct items in cart
  const purchasedCount = useMemo(() => {
    return Object.values(cart).filter((q) => q > 0).length;
  }, [cart]);

  // Buy handler
  const handleBuy = (item: Item, amount: number = 1) => {
    if (amount <= 0) return;
    const currentQty = cart[item.id] || 0;
    const cost = item.price * amount;

    if (cost > balance) {
      // If requested amount exceeds balance, buy maximum affordable
      const maxPossible = Math.floor(balance / item.price);
      if (maxPossible <= 0) return;
      setCart((prev) => ({
        ...prev,
        [item.id]: currentQty + maxPossible,
      }));
    } else {
      setCart((prev) => ({
        ...prev,
        [item.id]: currentQty + amount,
      }));
    }

    if (item.price >= 1_000_000 || amount * item.price >= 50_000_000) {
      playCashRegisterSound();
    } else {
      playBuySound();
    }

    // Check celebration milestone (e.g. 100B reached)
    if (balance - cost <= 0) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.6 },
      });
    }
  };

  // Sell handler
  const handleSell = (item: Item, amount: number = 1) => {
    const currentQty = cart[item.id] || 0;
    if (currentQty <= 0) return;

    const newQty = Math.max(0, currentQty - amount);
    setCart((prev) => {
      const next = { ...prev };
      if (newQty === 0) {
        delete next[item.id];
      } else {
        next[item.id] = newQty;
      }
      return next;
    });

    playSellSound();
  };

  // Direct quantity input change
  const handleQuantityChange = (item: Item, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCart((prev) => {
        const next = { ...prev };
        delete next[item.id];
        return next;
      });
      playSellSound();
      return;
    }

    const currentQty = cart[item.id] || 0;
    const diff = newQuantity - currentQty;
    const cost = diff * item.price;

    if (diff > 0 && cost > balance) {
      // Clamped to affordable
      const maxPossible = currentQty + Math.floor(balance / item.price);
      setCart((prev) => ({
        ...prev,
        [item.id]: maxPossible,
      }));
      playBuySound();
    } else {
      setCart((prev) => ({
        ...prev,
        [item.id]: newQuantity,
      }));
      if (diff > 0) playBuySound();
      else playSellSound();
    }
  };

  // Reset cart
  const handleReset = () => {
    if (Object.keys(cart).length === 0) return;
    const confirmed = window.confirm(
      language === 'tr'
        ? "Tüm satın aldığınız ürünleri sıfırlamak ve Bill Gates'in parasını baştan başlatmak istiyor musunuz?"
        : "Are you sure you want to reset all purchases and restore Bill Gates' fortune?"
    );
    if (confirmed) {
      setCart({});
      playResetSound();
    }
  };

  // Scroll smoothly to receipt
  const handleScrollToReceipt = () => {
    const el = document.getElementById('receipt');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Filtered & Sorted items
  const filteredItems = useMemo(() => {
    let list = [...ITEMS];

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter((i) => i.category === selectedCategory);
    }

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (i) =>
          i.name.toLowerCase().includes(q) ||
          i.nameTr.toLowerCase().includes(q) ||
          i.descriptionTr.toLowerCase().includes(q) ||
          i.descriptionEn.toLowerCase().includes(q)
      );
    }

    // Sorting
    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price);
        break;
      case 'price-desc':
        list.sort((a, b) => b.price - a.price);
        break;
      case 'purchased-first':
        list.sort((a, b) => (cart[b.id] || 0) - (cart[a.id] || 0));
        break;
      default:
        // default catalog order
        break;
    }

    return list;
  }, [selectedCategory, searchQuery, sortBy, cart]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Navigation */}
      <Header
        language={language}
        onLanguageChange={handleLanguageChange}
        soundEnabled={soundOn}
        onToggleSound={handleToggleSound}
        onReset={handleReset}
        onScrollToReceipt={handleScrollToReceipt}
        purchasedCount={purchasedCount}
      />

      {/* Hero with Gates portrait and description */}
      <Hero language={language} />

      {/* Sticky Balance Counter Bar */}
      <StickyBalance
        balance={balance}
        totalSpent={totalSpent}
        language={language}
        onScrollToReceipt={handleScrollToReceipt}
        purchasedCount={purchasedCount}
      />

      {/* Main Catalog Section */}
      <main id="catalog" className="flex-1 pb-16">
        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onSelectCategory={setSelectedCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          language={language}
          totalFilteredCount={filteredItems.length}
        />

        {/* Product Cards Grid */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 text-slate-500 my-8">
              <p className="text-base font-semibold">
                {language === 'tr' ? 'Aramanıza uygun ürün bulunamadı.' : 'No items match your search.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                }}
                className="mt-3 text-sm text-emerald-600 hover:underline font-semibold cursor-pointer"
              >
                {language === 'tr' ? 'Filtreleri Temizle' : 'Clear Filters'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <ItemCard
                  key={item.id}
                  item={item}
                  quantity={cart[item.id] || 0}
                  balance={balance}
                  language={language}
                  onBuy={handleBuy}
                  onSell={handleSell}
                  onQuantityChange={handleQuantityChange}
                />
              ))}
            </div>
          )}
        </div>

        {/* Receipt / Basket Section at bottom */}
        <div className="mt-16">
          <Receipt
            cart={cart}
            items={ITEMS}
            totalSpent={totalSpent}
            balance={balance}
            language={language}
            onReset={handleReset}
          />
        </div>
      </main>

      {/* Footer with Enes Öztürk Signature */}
      <Footer language={language} />
    </div>
  );
}
