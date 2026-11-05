import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AuthorsTab } from './components/AuthorsTab';
import { BooksTab } from './components/BooksTab';
import { ApiExplorerTab } from './components/ApiExplorerTab';
import { CodeViewerTab } from './components/CodeViewerTab';
import { RubricCheckerTab } from './components/RubricCheckerTab';
import { Footer } from './components/Footer';
import { libraryStore } from './services/libraryStore';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('authors');
  const [, setTick] = useState(0);

  // Subscribe to libraryStore changes
  useEffect(() => {
    const unsubscribe = libraryStore.subscribe(() => {
      setTick((t) => t + 1);
    });
    return unsubscribe;
  }, []);

  const handleResetData = () => {
    if (
      window.confirm(
        'Tüm veriler (yazarlar, kitaplar ve loglar) başlangıç durumuna döndürülecektir. Devam etmek istiyor musunuz?'
      )
    ) {
      libraryStore.resetToDefault();
      libraryStore.clearApiLogs();
    }
  };

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col font-sans antialiased selection:bg-indigo-500 selection:text-white">
      {/* Header with Navigation and Metrics */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onReset={handleResetData}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 py-6 sm:py-8">
        {activeTab === 'authors' && (
          <AuthorsTab onNavigateToBooks={() => setActiveTab('books')} />
        )}

        {activeTab === 'books' && <BooksTab />}

        {activeTab === 'api-explorer' && <ApiExplorerTab />}

        {activeTab === 'csharp-code' && <CodeViewerTab />}

        {activeTab === 'rubric-checker' && <RubricCheckerTab />}
      </main>

      {/* Footer with Developer Signature */}
      <Footer />
    </div>
  );
}
