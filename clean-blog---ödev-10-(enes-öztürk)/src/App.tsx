import React, { useState, useEffect } from 'react';
import { BlogPost, ActiveTab } from './types/blog';
import { INITIAL_POSTS } from './data/initialPosts';
import { Navbar } from './components/Navbar';
import { Header } from './components/Header';
import { PostList } from './components/PostList';
import { PostDetail } from './components/PostDetail';
import { AddPost } from './components/AddPost';
import { AboutView } from './components/AboutView';
import { HomeworkViewer } from './components/HomeworkViewer';
import { Footer } from './components/Footer';
import { CheckCircle2, Code2, RotateCcw } from 'lucide-react';

const STORAGE_KEY = 'clean_blog_posts_v1';

// Helper to generate a realistic 24-character hexadecimal MongoDB ObjectId
function generateMongoId(): string {
  const timestamp = Math.floor(Date.now() / 1000).toString(16).padStart(8, '0');
  const randomHex = Array.from({ length: 16 }, () =>
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return (timestamp + randomHex).toLowerCase();
}

export default function App() {
  const [posts, setPosts] = useState<BlogPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch {
      // Fallback
    }
    return INITIAL_POSTS;
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('home');
  const [activePost, setActivePost] = useState<BlogPost | null>(posts[0] || null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  // Handle URL hash changes for simulated clean routing (e.g., #/posts/65b...)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#/posts/')) {
        const id = hash.replace('#/posts/', '');
        const found = posts.find((p) => p._id === id);
        if (found) {
          setActivePost(found);
          setActiveTab('post');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      } else if (hash === '#/about') {
        setActiveTab('about');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/add_post') {
        setActiveTab('add');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/homework') {
        setActiveTab('homework');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#/' || !hash) {
        setActiveTab('home');
      }
    };

    window.addEventListener('hashchange', handleHash);
    handleHash();
    return () => window.removeEventListener('hashchange', handleHash);
  }, [posts]);

  // Navigation action
  const handleNavigate = (tab: ActiveTab, postId?: string) => {
    if (tab === 'post' && postId) {
      const target = posts.find((p) => p._id === postId);
      if (target) {
        setActivePost(target);
        window.location.hash = `#/posts/${postId}`;
      }
    } else if (tab === 'home') {
      window.location.hash = '#/';
    } else if (tab === 'about') {
      window.location.hash = '#/about';
    } else if (tab === 'add') {
      window.location.hash = '#/add_post';
    } else if (tab === 'homework') {
      window.location.hash = '#/homework';
    }
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Select a post from the index list
  const handleSelectPost = (post: BlogPost) => {
    setActivePost(post);
    setActiveTab('post');
    window.location.hash = `#/posts/${post._id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Add new post
  const handleAddPost = (newPostData: Omit<BlogPost, '_id' | 'dateCreated' | 'author'>) => {
    const today = new Intl.DateTimeFormat('tr-TR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(new Date());

    const newPost: BlogPost = {
      _id: generateMongoId(),
      title: newPostData.title,
      subtitle: newPostData.subtitle,
      detail: newPostData.detail,
      dateCreated: today,
      author: 'Enes Öztürk',
    };

    const updated = [newPost, ...posts];
    setPosts(updated);
    setActivePost(newPost);
    setActiveTab('post');
    window.location.hash = `#/posts/${newPost._id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Delete post
  const handleDeletePost = (id: string) => {
    const updated = posts.filter((p) => p._id !== id);
    setPosts(updated);
    handleNavigate('home');
  };

  // Reset to initial mock data
  const handleResetData = () => {
    if (confirm('Varsayılan örnek postlara sıfırlamak istiyor musunuz?')) {
      setPosts(INITIAL_POSTS);
      setActivePost(INITIAL_POSTS[0]);
      handleNavigate('home');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-900 selection:bg-amber-100 selection:text-amber-900 font-sans">
      {/* Üst Bilgilendirme Çubuğu: Ödev 10 Durumu */}
      <aside className="bg-stone-950 text-stone-300 text-xs py-2 px-4 border-b border-stone-800" aria-label="Ödev Bilgilendirme">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 truncate">
            <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0"></span>
            <span className="font-medium text-white truncate">
              Ödev 10: Clean Blog Projesi 4. Bölüm (Tekil Post)
            </span>
            <span className="hidden md:inline text-stone-400">
              · Hazırlayan: <strong className="text-amber-300 font-normal">Enes Öztürk</strong>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => handleNavigate('homework')}
              className="text-stone-300 hover:text-amber-300 text-xs flex items-center gap-1 font-mono cursor-pointer transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-amber-400" />
              <span>app.js / post.ejs Kodları</span>
            </button>
            <span className="text-stone-700 hidden sm:inline">|</span>
            <button
              onClick={handleResetData}
              title="Örnek Gönderileri Sıfırla"
              className="text-stone-400 hover:text-stone-200 text-xs hidden sm:flex items-center gap-1 cursor-pointer transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Veriyi Sıfırla</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Ana Navigasyon */}
      <Navbar
        activeTab={activeTab}
        onNavigate={handleNavigate}
        postCount={posts.length}
      />

      {/* Dinamik Header Hero (Ortak görsel kuralı dahil) */}
      <Header
        type={activeTab}
        post={activeTab === 'post' && activePost ? activePost : undefined}
      />

      {/* Ana İçerik Alanı */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <PostList
            posts={posts}
            onSelectPost={handleSelectPost}
            onOpenHomeworkTab={() => handleNavigate('homework')}
          />
        )}

        {activeTab === 'post' && activePost && (
          <PostDetail
            post={activePost}
            onBack={() => handleNavigate('home')}
            onDelete={handleDeletePost}
            onOpenHomeworkCode={() => handleNavigate('homework')}
          />
        )}

        {activeTab === 'add' && (
          <AddPost
            onAddPost={handleAddPost}
            onCancel={() => handleNavigate('home')}
          />
        )}

        {activeTab === 'about' && (
          <AboutView onGoToHomework={() => handleNavigate('homework')} />
        )}

        {activeTab === 'homework' && (
          <HomeworkViewer
            posts={posts}
            onOpenPost={handleSelectPost}
          />
        )}
      </main>

      {/* Clean Blog Klasik Footer */}
      <Footer />
    </div>
  );
}
