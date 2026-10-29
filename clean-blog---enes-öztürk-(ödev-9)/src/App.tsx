/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Clean Blog Projesi 3. Bölüm (Ödev 9)
 * Geliştirici & İmza: ENES ÖZTÜRK
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar.tsx';
import { HeaderBanner } from './components/HeaderBanner.tsx';
import { PostList } from './components/PostList.tsx';
import { PostDetail } from './components/PostDetail.tsx';
import { AddPost } from './components/AddPost.tsx';
import { AboutPage } from './components/AboutPage.tsx';
import { ContactPage } from './components/ContactPage.tsx';
import { HomeworkModal } from './components/HomeworkModal.tsx';
import { Footer } from './components/Footer.tsx';
import { api } from './services/api.ts';
import { IPost } from './types.ts';

export default function App() {
  const [currentView, setCurrentView] = useState<'home' | 'add_post' | 'about' | 'contact' | 'post_detail'>('home');
  const [posts, setPosts] = useState<IPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<IPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [isHomeworkModalOpen, setIsHomeworkModalOpen] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await api.getPosts();
      setPosts(data);
    } catch (err) {
      console.error('Gönderiler yüklenirken hata:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSelectPost = (post: IPost) => {
    setSelectedPost(post);
    setCurrentView('post_detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePostCreated = (newPost: IPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePost = async (id: string) => {
    await api.deletePost(id);
    setPosts((prev) => prev.filter((p) => p._id !== id));
    setCurrentView('home');
  };

  const handleResetPosts = async () => {
    if (confirm('3 adet varsayılan başlangıç post dökümanı yeniden yüklensin mi?')) {
      setLoading(true);
      const reset = await api.resetPosts();
      setPosts(reset);
      setLoading(false);
    }
  };

  const handleNavChange = (view: 'home' | 'add_post' | 'about' | 'contact') => {
    setCurrentView(view);
    setSelectedPost(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-stone-900 flex flex-col font-sans selection:bg-teal-100 selection:text-teal-900">
      {/* Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={handleNavChange}
        onOpenHomework={() => setIsHomeworkModalOpen(true)}
        postCount={posts.length}
      />

      {/* Hero Header with dynamic backdrop */}
      <HeaderBanner view={currentView} activePost={selectedPost} />

      {/* Main Content Area */}
      <main className="grow">
        {currentView === 'home' && (
          <PostList
            posts={posts}
            loading={loading}
            onSelectPost={handleSelectPost}
            onNavigateAddPost={() => handleNavChange('add_post')}
            onResetPosts={handleResetPosts}
            onOpenHomework={() => setIsHomeworkModalOpen(true)}
          />
        )}

        {currentView === 'add_post' && (
          <AddPost
            onPostCreated={handlePostCreated}
            onCancel={() => handleNavChange('home')}
          />
        )}

        {currentView === 'post_detail' && selectedPost && (
          <PostDetail
            post={selectedPost}
            onBack={() => handleNavChange('home')}
            onDelete={handleDeletePost}
          />
        )}

        {currentView === 'about' && <AboutPage />}

        {currentView === 'contact' && <ContactPage />}
      </main>

      {/* Classic Start Bootstrap Clean Blog Footer */}
      <Footer onOpenHomework={() => setIsHomeworkModalOpen(true)} />

      {/* Ödev 9 Inspection & Code Copy Modal */}
      <HomeworkModal
        isOpen={isHomeworkModalOpen}
        onClose={() => setIsHomeworkModalOpen(false)}
        postCount={posts.length}
      />
    </div>
  );
}
