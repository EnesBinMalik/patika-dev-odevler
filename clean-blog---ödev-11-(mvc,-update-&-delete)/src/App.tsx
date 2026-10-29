/**
 * @project Clean Blog - Bölüm 5 (Ödev 11)
 * @author Enes Öztürk
 * @description Clean Blog MVC Mimari, post.ejs UPDATE ve DELETE İşlemleri
 * @license Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { BlogPost, ActivePage } from './types';
import { INITIAL_POSTS } from './data/initialPosts';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomeView } from './components/HomeView';
import { PostDetailView } from './components/PostDetailView';
import { EditPostView } from './components/EditPostView';
import { AddPostView } from './components/AddPostView';
import { AboutView } from './components/AboutView';
import { MvcExplorerView } from './components/MvcExplorerView';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { HomeworkChecklistModal } from './components/HomeworkChecklistModal';
import { Toast, ToastMessage } from './components/Toast';

const STORAGE_KEY = 'clean_blog_odev11_posts';

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
      // ignore
    }
    return INITIAL_POSTS;
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(() => posts[0] || null);
  const [deleteModalPost, setDeleteModalPost] = useState<BlogPost | null>(null);
  const [selectedCodeFileId, setSelectedCodeFileId] = useState<string>('post-ejs');
  const [isChecklistOpen, setIsChecklistOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persist posts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    } catch {
      // ignore
    }
  }, [posts]);

  // Toast helper
  const addToast = (type: 'success' | 'danger' | 'info', title: string, description?: string) => {
    const id = Date.now().toString(36) + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, type, title, description }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // View post details (post.ejs)
  const handleSelectPost = (post: BlogPost) => {
    setSelectedPost(post);
    setActivePage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Navigate to edit form (edit.ejs) - Requirement 2
  const handleOpenEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setActivePage('edit-post');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Save updated post (PUT /posts/:id -> postController.updatePost)
  const handleSaveUpdatedPost = (updatedPost: BlogPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((p) => (p._id === updatedPost._id ? updatedPost : p))
    );
    setSelectedPost(updatedPost);
    setActivePage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    addToast(
      'success',
      'Yazı Başarıyla Güncellendi (UPDATE)',
      `PUT /posts/${updatedPost._id} -> postController.updatePost başarıyla çalıştırıldı.`
    );
  };

  // Request deletion (method-override DELETE /posts/:id) - Requirement 3
  const handleRequestDelete = (post: BlogPost) => {
    setDeleteModalPost(post);
  };

  // Confirm delete post
  const handleConfirmDelete = () => {
    if (!deleteModalPost) return;

    const deletedId = deleteModalPost._id;
    const deletedTitle = deleteModalPost.title;

    setPosts((prevPosts) => prevPosts.filter((p) => p._id !== deletedId));
    setDeleteModalPost(null);

    // If currently on deleted post, return to home
    if (selectedPost?._id === deletedId) {
      setSelectedPost(null);
      setActivePage('home');
    }

    addToast(
      'danger',
      'Yazı Veritabanından Silindi (DELETE)',
      `DELETE /posts/${deletedId}?_method=DELETE -> postController.deletePost tamamlandı.`
    );
  };

  // Add new post (POST /posts -> postController.createPost)
  const handleAddPost = (newPost: BlogPost) => {
    setPosts((prev) => [newPost, ...prev]);
    setSelectedPost(newPost);
    setActivePage('post-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    addToast(
      'success',
      'Yeni Yazı Yayınlandı',
      `POST /posts -> "${newPost.title.slice(0, 30)}..." veritabanına eklendi.`
    );
  };

  // Reset to initial seed data
  const handleResetPosts = () => {
    setPosts(INITIAL_POSTS);
    setSelectedPost(INITIAL_POSTS[0]);
    localStorage.removeItem(STORAGE_KEY);
    addToast(
      'info',
      'Varsayılan Postlar Yüklendi',
      'Tüm blog yazıları başlangıç verileriyle yenilendi.'
    );
  };

  // Navigate to MVC code viewer
  const handleGoToCode = (fileId?: string) => {
    if (fileId) setSelectedCodeFileId(fileId);
    setActivePage('mvc-code');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900 selection:bg-emerald-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        activePage={activePage}
        setActivePage={setActivePage}
        onOpenChecklist={() => setIsChecklistOpen(true)}
      />

      {/* Main Content Pages */}
      <div className="flex-1">
        {activePage === 'home' && (
          <HomeView
            posts={posts}
            onSelectPost={handleSelectPost}
            onEditPost={handleOpenEdit}
            onDeletePost={handleRequestDelete}
            onAddNewPost={() => {
              setActivePage('add-post');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToCode={() => handleGoToCode('post-ejs')}
            onOpenChecklist={() => setIsChecklistOpen(true)}
          />
        )}

        {activePage === 'post-detail' && selectedPost && (
          <PostDetailView
            post={selectedPost}
            onBack={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEdit={handleOpenEdit}
            onDelete={handleRequestDelete}
            onGoToCode={(fileId) => handleGoToCode(fileId || 'post-ejs')}
          />
        )}

        {activePage === 'edit-post' && selectedPost && (
          <EditPostView
            post={selectedPost}
            onSave={handleSaveUpdatedPost}
            onCancel={() => {
              setActivePage('post-detail');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToCode={(fileId) => handleGoToCode(fileId || 'edit-ejs')}
          />
        )}

        {activePage === 'add-post' && (
          <AddPostView
            onAdd={handleAddPost}
            onCancel={() => {
              setActivePage('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onGoToCode={(fileId) => handleGoToCode(fileId || 'post-controller')}
          />
        )}

        {activePage === 'about' && (
          <AboutView
            onGoToCode={() => handleGoToCode('app-js')}
            onOpenChecklist={() => setIsChecklistOpen(true)}
          />
        )}

        {activePage === 'mvc-code' && (
          <MvcExplorerView
            initialFileId={selectedCodeFileId}
            onSelectPostAction={() => {
              if (posts.length > 0) handleSelectPost(posts[0]);
            }}
          />
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        post={deleteModalPost}
        isOpen={Boolean(deleteModalPost)}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteModalPost(null)}
      />

      {/* Assignment 11 Checklist Modal */}
      <HomeworkChecklistModal
        isOpen={isChecklistOpen}
        onClose={() => setIsChecklistOpen(false)}
        samplePost={posts[0] || INITIAL_POSTS[0]}
        onTestEdit={(post) => handleOpenEdit(post)}
        onTestDelete={(post) => handleRequestDelete(post)}
        onGoToCode={(fileId) => handleGoToCode(fileId)}
      />

      {/* Toast Notifications */}
      <Toast toasts={toasts} onDismiss={removeToast} />

      {/* Classic Footer */}
      <Footer
        onResetPosts={handleResetPosts}
        onOpenChecklist={() => setIsChecklistOpen(true)}
        onGoToCode={() => handleGoToCode('app-js')}
      />
    </div>
  );
}
