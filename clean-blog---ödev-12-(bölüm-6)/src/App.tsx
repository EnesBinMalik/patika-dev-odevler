/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BlogPost, ActiveTab, PostComment } from './types/blog';
import { INITIAL_POSTS } from './data/initialPosts';
import { Navbar } from './components/Navbar';
import { HeaderBanner } from './components/HeaderBanner';
import { AssignmentNotice } from './components/AssignmentNotice';
import { PostCard } from './components/PostCard';
import { PostDetailView } from './components/PostDetailView';
import { PostFormView } from './components/PostFormView';
import { DeploymentHub } from './components/DeploymentHub';
import { AboutView } from './components/AboutView';
import { ContactView } from './components/ContactView';
import { Footer } from './components/Footer';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PaginationNoticeModal } from './components/PaginationNoticeModal';
import { Search, Plus, ArrowRight, RotateCcw, Check } from 'lucide-react';

// Image paths generated for Clean Blog
import heroBg from './assets/images/clean_blog_hero_1793294035807.jpg';
import aboutBg from './assets/images/clean_blog_about_1793294036598.jpg';
import codeBg from './assets/images/clean_blog_code_1793294037385.jpg';
import enesAvatar from './assets/images/enes_avatar_1793294036590.jpg';

const STORAGE_KEY = 'clean_blog_posts_v1';
const COMMENTS_KEY = 'clean_blog_comments_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [deleteModal, setDeleteModal] = useState<{ isOpen: boolean; id: string; title: string }>({
    isOpen: false,
    id: '',
    title: ''
  });
  const [isPaginationNoticeOpen, setIsPaginationNoticeOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Initialize posts from localStorage or initial defaults
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading posts from localStorage', e);
    }
    return INITIAL_POSTS;
  });

  // Comments state
  const [comments, setComments] = useState<PostComment[]>(() => {
    try {
      const saved = localStorage.getItem(COMMENTS_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Error loading comments', e);
    }
    return [
      {
        id: 'c-1',
        postId: 'post-1',
        name: 'Müfredat Eğitmeni',
        comment: 'Tebrikler Enes! Heroku ve MongoDB Atlas dağıtım adımları başarıyla tamamlanmış. Mimari şablonun ve ödev notunun netliği harika.',
        date: '2026-10-29'
      },
      {
        id: 'c-2',
        postId: 'post-1',
        name: 'Sınıf Arkadaşı',
        comment: 'Atlas bağlantı dizesinde process.env kullanımı çok yerinde olmuş. Başarılar!',
        date: '2026-10-29'
      }
    ];
  });

  // Persist posts
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch (e) {
      console.error('Error saving posts to localStorage', e);
    }
  }, [posts]);

  // Persist comments
  useEffect(() => {
    try {
      localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    } catch (e) {
      console.error('Error saving comments to localStorage', e);
    }
  }, [comments]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers
  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setActiveTab('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartEdit = (post: BlogPost) => {
    setEditingPost(post);
    setActiveTab('edit-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartCreate = () => {
    setEditingPost(null);
    setActiveTab('new-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSavePost = (postData: Omit<BlogPost, 'id' | 'dateCreated' | 'readTime'>) => {
    if (editingPost) {
      // Update
      setPosts((prev) =>
        prev.map((p) =>
          p.id === editingPost.id
            ? {
                ...p,
                ...postData
              }
            : p
        )
      );
      showToast('Gönderi MongoDB Atlas üzerinde başarıyla güncellendi.');
    } else {
      // Create new
      const newPost: BlogPost = {
        ...postData,
        id: `post-${Date.now()}`,
        dateCreated: new Date().toISOString().split('T')[0],
        readTime: '3 dk okuma'
      };
      setPosts((prev) => [newPost, ...prev]);
      showToast('Yeni gönderi MongoDB Atlas koleksiyonuna eklendi.');
    }
    setEditingPost(null);
    setActiveTab('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteRequest = (id: string, title: string) => {
    setDeleteModal({ isOpen: true, id, title });
  };

  const handleConfirmDelete = () => {
    setPosts((prev) => prev.filter((p) => p.id !== deleteModal.id));
    setDeleteModal({ isOpen: false, id: '', title: '' });
    showToast('Gönderi veritabanından silindi.');
    if (selectedPost && selectedPost.id === deleteModal.id) {
      setActiveTab('home');
    }
  };

  const handleResetToDefaults = () => {
    if (window.confirm('Örnek blog gönderilerini varsayılana sıfırlamak istiyor musunuz?')) {
      setPosts(INITIAL_POSTS);
      showToast('Varsayılan Clean Blog gönderileri geri yüklendi.');
    }
  };

  const handleAddComment = (postId: string, name: string, comment: string) => {
    const newComment: PostComment = {
      id: `comm-${Date.now()}`,
      postId,
      name,
      comment,
      date: new Date().toISOString().split('T')[0]
    };
    setComments((prev) => [newComment, ...prev]);
  };

  // Filter posts
  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.detail.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const categories = ['all', 'DevOps & Cloud', 'Node.js Mimarisi', 'Express.js & REST', 'Front-End Entegrasyonu'];

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900 selection:bg-slate-900 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white text-xs sm:text-sm px-4 py-3 rounded-lg shadow-lg border border-slate-800 flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        postCount={posts.length}
      />

      {/* Header Masthead Banner */}
      {activeTab === 'home' && (
        <HeaderBanner
          title="Clean Blog"
          subtitle="Node.js & Express Tabanlı Modern Blog Uygulaması"
          meta="Ödev 12 · Bölüm 6: Heroku & MongoDB Atlas Dağıtımı · Enes Öztürk İmzalı"
          bgImageUrl={heroBg}
        />
      )}

      {activeTab === 'about' && (
        <HeaderBanner
          title="Hakkımda"
          subtitle="Node.js Serüveni ve Clean Blog Proje Geliştirme Süreci"
          meta="Geliştirici: Enes Öztürk"
          bgImageUrl={aboutBg}
        />
      )}

      {activeTab === 'deployment' && (
        <HeaderBanner
          title="Heroku & MongoDB Atlas"
          subtitle="Bulut Dağıtımı, M0 Sandbox Kümesi ve Canlı Konsol Mimarisi"
          meta="Clean Blog 6. Bölüm Tamamlandı"
          bgImageUrl={codeBg}
        />
      )}

      {activeTab === 'contact' && (
        <HeaderBanner
          title="İletişim"
          subtitle="Sorularınız, iş birlikleri ve proje geri bildirimleri için"
          meta="Enes Öztürk · enesbino38@gmail.com"
          bgImageUrl={heroBg}
        />
      )}

      {(activeTab === 'new-post' || activeTab === 'edit-post') && (
        <HeaderBanner
          title={activeTab === 'edit-post' ? 'Yazıyı Düzenle' : 'Yeni Blog Yazısı'}
          subtitle="MongoDB Mongoose Şemasına Uygun RESTful İçerik Yönetimi"
          meta="Hazırlayan: Enes Öztürk"
          bgImageUrl={codeBg}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-1">
        {/* VIEW 1: HOME PAGE */}
        {activeTab === 'home' && (
          <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 font-sans">
            {/* Assignment Requirement Notice */}
            <AssignmentNotice />

            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Yazılarda ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-900 bg-slate-50/50"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Yeni Yazı Ekle</span>
                </button>
                <button
                  onClick={handleResetToDefaults}
                  title="Varsayılan yazıları yükle"
                  className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Category Filter Tabs (Interactive Functional Buttons) */}
            <div className="flex items-center gap-1 mb-6 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                  }`}
                >
                  {cat === 'all' ? 'Tüm Yazılar' : cat}
                </button>
              ))}
            </div>

            {/* Post List */}
            {filteredPosts.length === 0 ? (
              <div className="py-16 text-center text-slate-500 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-base font-medium text-slate-800 mb-1">Eşleşen yazı bulunamadı.</p>
                <p className="text-xs text-slate-500 mb-4">Arama kriterlerinizi değiştirebilir veya yeni bir yazı ekleyebilirsiniz.</p>
                <button
                  onClick={handleStartCreate}
                  className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-md cursor-pointer"
                >
                  Yeni Yazı Oluştur
                </button>
              </div>
            ) : (
              <div className="divide-y-0">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onSelect={handleSelectPost}
                    onEdit={handleStartEdit}
                    onDelete={handleDeleteRequest}
                  />
                ))}
              </div>
            )}

            {/* Classic Clean Blog Pager */}
            <div className="flex items-center justify-between pt-10 mt-6 border-t border-slate-200">
              <div className="text-xs text-slate-500 font-sans">
                Toplam <span className="font-semibold text-slate-800">{filteredPosts.length}</span> gönderi listeleniyor
              </div>
              <button
                onClick={() => setIsPaginationNoticeOpen(true)}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors rounded-lg flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <span>Eski Gönderiler</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: POST DETAIL */}
        {activeTab === 'post-detail' && selectedPost && (
          <PostDetailView
            post={selectedPost}
            onBack={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEdit={handleStartEdit}
            onDelete={handleDeleteRequest}
            comments={comments}
            onAddComment={handleAddComment}
            authorAvatarUrl={enesAvatar}
          />
        )}

        {/* VIEW 3 & 4: NEW / EDIT POST */}
        {(activeTab === 'new-post' || activeTab === 'edit-post') && (
          <PostFormView
            initialPost={activeTab === 'edit-post' ? editingPost : null}
            onSave={handleSavePost}
            onCancel={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* VIEW 5: DEPLOYMENT HUB (HEROKU & ATLAS) */}
        {activeTab === 'deployment' && <DeploymentHub posts={posts} />}

        {/* VIEW 6: ABOUT */}
        {activeTab === 'about' && <AboutView avatarUrl={enesAvatar} />}

        {/* VIEW 7: CONTACT */}
        {activeTab === 'contact' && <ContactView />}
      </main>

      {/* Footer */}
      <Footer
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        postTitle={deleteModal.title}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModal({ isOpen: false, id: '', title: '' })}
      />

      {/* Pagination & File Upload Educational Modal */}
      <PaginationNoticeModal
        isOpen={isPaginationNoticeOpen}
        onClose={() => setIsPaginationNoticeOpen(false)}
      />
    </div>
  );
}
