/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Post Sıralama ve Post Ekleme
 * İmzalı: Enes Öztürk
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Header } from './components/Header';
import { ConsoleTerminal } from './components/ConsoleTerminal';
import { PostCard } from './components/PostCard';
import { AddPostModal } from './components/AddPostModal';
import { PostDetailModal } from './components/PostDetailModal';
import { CodeViewer } from './components/CodeViewer';
import { GuideView } from './components/GuideView';
import { INITIAL_POSTS, SAMPLE_TEMPLATES } from './data/initialPosts';
import { BlogPost, ConsoleLogEntry, AsyncMode, SortOrder } from './types';
import {
  Terminal,
  Plus,
  Play,
  Search,
  Filter,
  ArrowUpDown,
  BookOpen,
  Sparkles,
  CheckCircle2,
  Code2,
  Layers,
  Info
} from 'lucide-react';

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(INITIAL_POSTS);
  const [logs, setLogs] = useState<ConsoleLogEntry[]>([]);
  const [activeTab, setActiveTab] = useState<'blog' | 'console' | 'code' | 'guide'>('blog');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isRunningSimulation, setIsRunningSimulation] = useState(false);
  const [speed, setSpeed] = useState<'normal' | 'fast'>('normal');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<SortOrder>('id-asc');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Helper to show transient notification
  const showNotification = useCallback((message: string, type: 'success' | 'info' = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  }, []);

  // Formatter for timestamp
  const getTimestamp = () => {
    const now = new Date();
    return now.toTimeString().split(' ')[0] + '.' + String(now.getMilliseconds()).padStart(3, '0');
  };

  // Append log to both state and real browser console
  const appendLog = useCallback((
    type: ConsoleLogEntry['type'],
    message: string,
    details?: string
  ) => {
    const newEntry: ConsoleLogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: getTimestamp(),
      type,
      message,
      details,
    };

    setLogs((prev) => [...prev, newEntry]);

    // Also mirror to actual browser console with nice styling
    if (type === 'step') {
      console.log(`%c[STEP] ${message}`, 'color: #06b6d4; font-weight: bold;');
    } else if (type === 'signature') {
      console.log(`%c✨ ${message}`, 'color: #f59e0b; font-weight: bold; background: #451a03; padding: 2px 6px; border-radius: 4px;');
    } else if (type === 'success') {
      console.log(`%c✔ ${message}`, 'color: #10b981; font-weight: bold;');
    } else if (type === 'error') {
      console.error(message);
    } else {
      console.log(message);
    }
  }, []);

  // Sleep utility with speed parameter
  const delay = useCallback((ms: number) => {
    const factor = speed === 'fast' ? 0.25 : 1;
    return new Promise((resolve) => setTimeout(resolve, ms * factor));
  }, [speed]);

  // listPosts function: canonical listing
  const listPostsInConsole = useCallback((currentPosts: BlogPost[], stepLabel: string) => {
    appendLog('step', stepLabel);
    appendLog('output', '┌────────────────────────────────────────────────────────────────────────┐');
    appendLog('output', `│ 📋 GÜNCEL POST LİSTESİ (${currentPosts.length} Adet Post Bulundu)                     │`);
    appendLog('output', '├────┬──────────────────────────────────────┬─────────────┬──────────────┤');
    appendLog('output', '│ ID │ BAŞLIK                               │ YAZAR       │ TARİH        │');
    appendLog('output', '├────┼──────────────────────────────────────┼─────────────┼──────────────┤');

    currentPosts.forEach((p) => {
      const paddedId = String(p.id).padEnd(2, ' ');
      const paddedTitle = p.title.length > 36 ? p.title.substring(0, 33) + '...' : p.title.padEnd(36, ' ');
      const paddedAuthor = p.author.length > 11 ? p.author.substring(0, 11) : p.author.padEnd(11, ' ');
      const paddedDate = p.date.padEnd(12, ' ');
      appendLog('output', `│ #${paddedId} │ ${paddedTitle} │ ${paddedAuthor} │ ${paddedDate} │`);
    });

    appendLog('output', '└────┴──────────────────────────────────────┴─────────────┴──────────────┘');
  }, [appendLog]);

  // Initial greeting and initial list in console on mount
  useEffect(() => {
    appendLog('info', '===========================================================');
    appendLog('info', '💻 Post Sıralama ve Post Ekleme Konsol Ekranı Başlatıldı');
    appendLog('signature', 'İmzalı: Enes Öztürk');
    appendLog('info', 'Blog oluşturmaya hazır mısınız?');
    appendLog('info', '===========================================================');
    listPostsInConsole(INITIAL_POSTS, '1. ADIM: Başlangıç Postları Sıralandı');
    appendLog('info', 'Yeni bir post ekleyebilir veya yukarıdaki butonla tüm senaryoyu çalıştırabilirsiniz.\n');
  }, [appendLog, listPostsInConsole]);

  // Add post with Promise logic
  const addPostPromise = useCallback((newPost: BlogPost): Promise<string> => {
    return new Promise((resolve) => {
      appendLog('info', `⏳ addPost() fonksiyonu çalışıyor: "${newPost.title}" ekleniyor...`);
      setTimeout(() => {
        resolve(`✅ Post başarıyla eklendi! (ID: #${newPost.id})`);
      }, speed === 'fast' ? 250 : 800);
    });
  }, [appendLog, speed]);

  // Run full homework scenario:
  // 1. Konsol ekranında postlarımızı sıralayalım
  // 2. Yeni bir post oluşturalım
  // 3. Yeni post ile birlikte postlarımızı tekrar sıralayalım
  // 4. Enes Öztürk imzalı olsun
  const handleRunFullScenario = async () => {
    if (isRunningSimulation) return;
    setIsRunningSimulation(true);

    try {
      appendLog('info', '\n=============================================================');
      appendLog('step', '🚀 YENİ SENARYO BAŞLATILDI: POST SIRALAMA VE POST EKLEME');
      appendLog('signature', '✨ Hazırlayan & İmzalı: Enes Öztürk');
      appendLog('info', '=============================================================');

      // 1. ADIM: Mevcut postlarımızı sıralayalım
      appendLog('step', '▶️ 1. ADIM: Mevcut postlarımızı konsol ekranında sıralayalım...');
      listPostsInConsole(posts, 'Mevcut Postlar Listeleniyor');
      await delay(800);

      // 2. ADIM: Yeni bir post oluşturalım
      const newPostId = Math.max(...posts.map(p => p.id), 0) + 1;
      const sample = SAMPLE_TEMPLATES[(newPostId - 1) % SAMPLE_TEMPLATES.length];

      const newPost: BlogPost = {
        id: newPostId,
        title: sample ? sample.title : `Modern Asenkron JavaScript ve Node.js v${newPostId}`,
        summary: sample ? sample.summary : 'Asenkron programlama ile veritabanı ve API işlemlerinin sıralı yürütülmesi.',
        content: sample ? sample.content : 'Async/Await mimarisi sayesinde Node.js kodlarımızı senkron gibi kolay okunabilir ve yönetilebilir hale getiriyoruz.',
        author: 'Enes Öztürk',
        date: new Date().toISOString().split('T')[0],
        category: sample ? sample.category : 'Node.js',
        readTime: sample ? sample.readTime : '4 dk okuma',
        tags: sample ? sample.tags : ['NodeJS', 'Async', 'JavaScript']
      };

      appendLog('step', `▶️ 2. ADIM: Yeni bir post oluşturuluyor: "${newPost.title}"...`);
      const addResult = await addPostPromise(newPost);
      appendLog('success', addResult);

      const updatedPosts = [...posts, newPost];
      setPosts(updatedPosts);
      await delay(800);

      // 3. ADIM: Yeni post ile birlikte postlarımızı tekrar sıralayalım
      appendLog('step', '▶️ 3. ADIM: Yeni post ile birlikte postlarımızı tekrar sıralayalım...');
      listPostsInConsole(updatedPosts, 'Güncellenmiş Post Listesi Sıralanıyor');
      await delay(400);

      // 4. İmzalı bitiş
      appendLog('success', '🎉 Blog post sıralama ve yeni post ekleme adımları başarıyla tamamlandı!');
      appendLog('signature', '✨ Enes Öztürk İmzalı — Node.js & Asenkron Programlama Tamamlandı', 'Tüm çıktılar konsola başarıyla yansıtıldı.');
      appendLog('info', '=============================================================\n');

      showNotification(`Yeni post eklendi ve konsolda tekrar sıralandı: "${newPost.title}"`, 'success');
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // Add post from user modal
  const handleAddNewPost = async (postData: Omit<BlogPost, 'id'>, mode: AsyncMode) => {
    setIsRunningSimulation(true);
    const newId = Math.max(...posts.map(p => p.id), 0) + 1;

    const newPost: BlogPost = {
      ...postData,
      id: newId,
    };

    try {
      appendLog('info', '\n=============================================================');
      appendLog('step', `📝 KULLANICI POST EKLEME İŞLEMİ (${mode.toUpperCase()})`);
      appendLog('signature', '✨ İmzalı: Enes Öztürk');

      // 1. Mevcutları listele
      appendLog('step', '▶️ 1. ADIM: Post ekleme öncesi mevcut postlar sıralanıyor...');
      listPostsInConsole(posts, 'Mevcut Postlar Listesi');
      await delay(500);

      // 2. Yeni post ekle
      appendLog('step', `▶️ 2. ADIM: Yeni post asenkron olarak ekleniyor (${mode})...`);
      const resultMessage = await addPostPromise(newPost);
      appendLog('success', resultMessage);

      const updated = [...posts, newPost];
      setPosts(updated);
      await delay(600);

      // 3. Yeni post ile tekrar sırala
      appendLog('step', '▶️ 3. ADIM: Yeni post ile birlikte tüm postlar tekrar sıralanıyor...');
      listPostsInConsole(updated, 'Yeni Post Dahil Güncel Liste');

      appendLog('signature', '✨ Enes Öztürk İmzası ile Post Başarıyla Kaydedildi!');
      appendLog('info', '=============================================================\n');

      showNotification(`"${newPost.title}" başarıyla eklendi ve konsolda sıralandı!`, 'success');
    } finally {
      setIsRunningSimulation(false);
    }
  };

  // Delete post handler
  const handleDeletePost = (id: number) => {
    const postToDelete = posts.find(p => p.id === id);
    if (!postToDelete) return;

    const filtered = posts.filter(p => p.id !== id);
    setPosts(filtered);
    appendLog('warn', `🗑️ Post silindi: #${id} "${postToDelete.title}"`);
    listPostsInConsole(filtered, 'Silme Sonrası Güncel Post Listesi');
    showNotification(`Post silindi: #${id}`, 'info');
  };

  // Filter and sort posts for UI view
  const categories = useMemo(() => {
    const set = new Set(posts.map(p => p.category));
    return ['all', ...Array.from(set)];
  }, [posts]);

  const filteredAndSortedPosts = useMemo(() => {
    let result = posts.filter(p => {
      const matchesSearch =
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.author.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = selectedCategory === 'all' || p.category === selectedCategory;
      return matchesSearch && matchesCat;
    });

    return result.sort((a, b) => {
      switch (sortOrder) {
        case 'id-asc':
          return a.id - b.id;
        case 'id-desc':
          return b.id - a.id;
        case 'date-desc':
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case 'date-asc':
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case 'title-asc':
          return a.title.localeCompare(b.title, 'tr');
        default:
          return a.id - b.id;
      }
    });
  }, [posts, searchQuery, selectedCategory, sortOrder]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Bar Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewPost={() => setIsAddModalOpen(true)}
        onRunSimulation={handleRunFullScenario}
        isRunningSimulation={isRunningSimulation}
      />

      {/* Floating Notification */}
      {notification && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl border border-slate-800 flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200 text-xs sm:text-sm">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{notification.message}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Banner: Enes Öztürk İmzalı Post Sıralama ve Ekleme */}
        <div className="mb-8 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-slate-800 relative overflow-hidden">
          <div className="relative z-10 max-w-3xl">
            {/* Zero-Pill kicker */}
            <div className="text-xs uppercase tracking-widest text-indigo-300 font-semibold mb-2">
              JavaScript & Node.js Asenkron Programlama
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-3" style={{ textWrap: 'balance' }}>
              Blog Oluşturmaya Hazır mısınız?
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-6">
              Konsol ekranında postlarımızı sıralayalım, sonrasında yeni bir post oluşturalım ve yeni
              post ile birlikte postlarımızı tekrar sıralayalım.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              <button
                onClick={handleRunFullScenario}
                disabled={isRunningSimulation}
                className={`px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-sm ${
                  isRunningSimulation
                    ? 'bg-amber-500 text-slate-950 cursor-wait'
                    : 'bg-indigo-600 hover:bg-indigo-500 text-white'
                }`}
              >
                <Play className={`w-4 h-4 ${isRunningSimulation ? 'animate-spin' : ''}`} />
                <span>{isRunningSimulation ? 'Konsol İşlemi Yürütülüyor...' : 'Konsolda Akışı Çalıştır'}</span>
              </button>

              <button
                onClick={() => setIsAddModalOpen(true)}
                className="px-5 py-2.5 rounded-lg text-xs sm:text-sm font-semibold bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Post Ekle</span>
              </button>

              <button
                onClick={() => setActiveTab('console')}
                className="px-4 py-2.5 rounded-lg text-xs sm:text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Terminal className="w-4 h-4" />
                <span>Konsolu İncele ({logs.length} Log)</span>
              </button>
            </div>
          </div>

          {/* Signature badge in Hero */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>Asenkron Akış: Sırala ➔ Ekle ➔ Tekrar Sırala</span>
            </div>
            <div className="flex items-center gap-2 font-mono text-indigo-300 bg-indigo-950/60 px-3 py-1 rounded-md border border-indigo-800/40">
              <span>İmza:</span>
              <strong className="text-white">Enes Öztürk</strong>
            </div>
          </div>
        </div>

        {/* Dynamic Tab Views */}
        {activeTab === 'blog' && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="bg-white rounded-xl border border-slate-200/90 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Başlık, özet veya yazar ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-200 outline-none transition-colors"
                />
              </div>

              {/* Category Segmented Buttons */}
              <div className="flex items-center gap-1 overflow-x-auto pb-1 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                      selectedCategory === cat
                        ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    {cat === 'all' ? 'Tüm Yazılar' : cat}
                  </button>
                ))}
              </div>

              {/* Sorting */}
              <div className="flex items-center gap-2 shrink-0">
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value as SortOrder)}
                  className="text-xs font-medium text-slate-700 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 outline-none cursor-pointer"
                >
                  <option value="id-asc">ID (1'den Başlayarak)</option>
                  <option value="id-desc">ID (Yeniden Eskiye)</option>
                  <option value="date-desc">Tarih (En Yeni)</option>
                  <option value="date-asc">Tarih (En Eski)</option>
                  <option value="title-asc">Başlık (A-Z)</option>
                </select>
              </div>
            </div>

            {/* Split layout: 2/3 Blog Cards + 1/3 Quick Console Stream on desktop */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Blog Post Cards (2 cols) */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between text-xs text-slate-500 mb-1 px-1">
                  <span>Gösterilen: <strong className="text-slate-800">{filteredAndSortedPosts.length}</strong> post</span>
                  <span>Toplam Kayıtlı: <strong className="text-slate-800">{posts.length}</strong> post</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {filteredAndSortedPosts.map((post, idx) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      index={idx}
                      onSelect={(p) => setSelectedPost(p)}
                      onDelete={handleDeletePost}
                    />
                  ))}
                </div>

                {filteredAndSortedPosts.length === 0 && (
                  <div className="bg-white rounded-xl border border-slate-200 p-12 text-center space-y-3">
                    <BookOpen className="w-10 h-10 text-slate-400 mx-auto" />
                    <h3 className="text-sm font-bold text-slate-800">Aramanıza uygun post bulunamadı</h3>
                    <p className="text-xs text-slate-500">
                      Farklı bir arama terimi deneyebilir veya yeni bir post ekleyebilirsiniz.
                    </p>
                    <button
                      onClick={() => setIsAddModalOpen(true)}
                      className="px-4 py-2 text-xs font-semibold rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer"
                    >
                      Yeni Post Ekle
                    </button>
                  </div>
                )}
              </div>

              {/* Side Panel: Live Mini Console Stream */}
              <div className="space-y-4">
                <div className="bg-slate-950 text-slate-100 rounded-xl border border-slate-800 shadow-sm overflow-hidden flex flex-col h-[520px]">
                  <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs font-mono">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400" />
                      <span className="font-semibold text-slate-200">Canlı Konsol Akışı</span>
                    </div>
                    <button
                      onClick={() => setActiveTab('console')}
                      className="text-[11px] text-indigo-400 hover:text-indigo-300 font-sans cursor-pointer underline"
                    >
                      Tam Ekran Aç
                    </button>
                  </div>

                  {/* Logs list */}
                  <div className="flex-1 p-3 overflow-y-auto font-mono text-[11px] leading-relaxed space-y-1">
                    {logs.slice(-14).map((log) => (
                      <div key={log.id} className="text-slate-300 break-words">
                        <span className="text-slate-600 select-none mr-1.5">{log.timestamp}</span>
                        {log.type === 'step' && <span className="text-cyan-400 font-semibold">{log.message}</span>}
                        {log.type === 'signature' && <span className="text-amber-300 font-bold">{log.message}</span>}
                        {log.type === 'success' && <span className="text-emerald-400">{log.message}</span>}
                        {log.type === 'output' && <span className="text-slate-300">{log.message}</span>}
                        {log.type === 'info' && <span className="text-slate-400">{log.message}</span>}
                        {log.type === 'warn' && <span className="text-amber-400">{log.message}</span>}
                      </div>
                    ))}
                  </div>

                  <div className="p-3 bg-slate-900 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={handleRunFullScenario}
                      disabled={isRunningSimulation}
                      className="w-full py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <Play className="w-3.5 h-3.5" />
                      <span>Postları Sırala & Ekle & Tekrar Sırala</span>
                    </button>
                  </div>
                </div>

                {/* Signature Card */}
                <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
                  <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1">
                    Proje & Ödev Sahibi
                  </div>
                  <div className="text-base font-bold text-slate-900 mb-1">
                    Enes Öztürk
                  </div>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    "Post Sıralama ve Post Ekleme" Node.js modülü ödevi için asenkron yapıları
                    (Promise & Async/Await) tam fonksiyonel ve konsol ekranı entegrasyonuyla
                    hazırlanmıştır.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Full Console Terminal View */}
        {activeTab === 'console' && (
          <div className="space-y-4">
            <ConsoleTerminal
              logs={logs}
              onClear={() => setLogs([])}
              onRunScenario={handleRunFullScenario}
              onListOnly={() => listPostsInConsole(posts, 'Postlar Konsolda Sıralanıyor')}
              isRunning={isRunningSimulation}
              speed={speed}
              setSpeed={setSpeed}
            />
          </div>
        )}

        {/* Tab 3: Node.js Code Viewer */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <CodeViewer
              onRunSimulation={handleRunFullScenario}
              isRunning={isRunningSimulation}
            />
          </div>
        )}

        {/* Tab 4: Guide & Theory */}
        {activeTab === 'guide' && <GuideView />}
      </main>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-slate-200 py-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Enes Öztürk Blog</span>
            <span aria-hidden="true">·</span>
            <span>Post Sıralama ve Post Ekleme Projesi</span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab('console')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Konsol Ekranı
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Kaynak Kod
            </button>
            <button
              onClick={() => setActiveTab('guide')}
              className="hover:text-indigo-600 transition-colors cursor-pointer"
            >
              Asenkron Rehber
            </button>
          </div>
          <div className="font-medium text-slate-700">
            İmzalı: Enes Öztürk
          </div>
        </div>
      </footer>

      {/* Add Post Modal */}
      <AddPostModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddNewPost}
        nextId={Math.max(...posts.map(p => p.id), 0) + 1}
      />

      {/* Post Detail Modal */}
      <PostDetailModal
        post={selectedPost}
        onClose={() => setSelectedPost(null)}
      />
    </div>
  );
}
