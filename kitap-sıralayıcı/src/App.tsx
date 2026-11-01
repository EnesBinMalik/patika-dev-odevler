import React, { useState, useEffect } from 'react';
import { BookItem } from './types/book';
import { INITIAL_BOOKS } from './data/defaultBooks';
import { Header } from './components/Header';
import { HeroSection } from './components/HeroSection';
import { BookCollectionSection } from './components/BookCollectionSection';
import { TreeSetVisualizer } from './components/TreeSetVisualizer';
import { ComparePlayground } from './components/ComparePlayground';
import { CodeViewer } from './components/CodeViewer';
import { ConceptGuide } from './components/ConceptGuide';
import { BookModal } from './components/BookModal';
import { Footer } from './components/Footer';

export default function App() {
  const [books, setBooks] = useState<BookItem[]>(() => {
    const saved = localStorage.getItem('kitap_siralayici_books');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch {
        // fallback
      }
    }
    return INITIAL_BOOKS;
  });

  const [activeTab, setActiveTab] = useState<string>('collection');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [editingBook, setEditingBook] = useState<BookItem | null>(null);

  // Dark Mode state initialized from user system preference or localStorage
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('kitap_siralayici_books', JSON.stringify(books));
  }, [books]);

  const handleAddBook = () => {
    setEditingBook(null);
    setIsModalOpen(true);
  };

  const handleEditBook = (book: BookItem) => {
    setEditingBook(book);
    setIsModalOpen(true);
  };

  const handleDeleteBook = (id: string) => {
    setBooks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleResetBooks = () => {
    setBooks(INITIAL_BOOKS);
  };

  const handleSaveBook = (bookData: Omit<BookItem, 'id'>, editId?: string) => {
    if (editId) {
      setBooks((prev) =>
        prev.map((b) => (b.id === editId ? { ...b, ...bookData } : b))
      );
    } else {
      const newBook: BookItem = {
        ...bookData,
        id: `book-${Date.now()}`,
      };
      setBooks((prev) => [...prev, newBook]);
    }
  };

  const handleSelectForCompare = (bookA: BookItem, bookB: BookItem) => {
    setActiveTab('compare');
    const el = document.getElementById('compare');
    el?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100 flex flex-col font-sans transition-colors duration-200">
      <Header
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          const el = document.getElementById(tab);
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onOpenAddModal={handleAddBook}
        darkMode={darkMode}
        onToggleDarkMode={() => setDarkMode((prev) => !prev)}
      />

      <main className="grow">
        <HeroSection
          totalBooks={books.length}
          onExploreCode={() => {
            setActiveTab('code');
            document.getElementById('code')?.scrollIntoView({ behavior: 'smooth' });
          }}
          onExploreTree={() => {
            setActiveTab('tree');
            document.getElementById('tree')?.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        <BookCollectionSection
          books={books}
          onAddBook={handleAddBook}
          onEditBook={handleEditBook}
          onDeleteBook={handleDeleteBook}
          onResetBooks={handleResetBooks}
          onSelectForCompare={handleSelectForCompare}
        />

        <TreeSetVisualizer books={books} />

        <ComparePlayground books={books} />

        <CodeViewer books={books} />

        <ConceptGuide />
      </main>

      <Footer />

      <BookModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveBook}
        editingBook={editingBook}
      />
    </div>
  );
}
