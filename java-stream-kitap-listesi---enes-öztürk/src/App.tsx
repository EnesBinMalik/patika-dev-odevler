import React, { useState } from 'react';
import { Header } from './components/Header';
import { HeroSignature } from './components/HeroSignature';
import { InitialBookList } from './components/InitialBookList';
import { MapTransformationView } from './components/MapTransformationView';
import { PageFilterView } from './components/PageFilterView';
import { StreamPipelineVisualizer } from './components/StreamPipelineVisualizer';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { TerminalRunner } from './components/TerminalRunner';
import { AddBookModal } from './components/AddBookModal';
import { Footer } from './components/Footer';
import { INITIAL_BOOKS, Book } from './types/book';
import { BookMarked, MapPin, Filter, Cpu, Code2, Terminal } from 'lucide-react';

export default function App() {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isTerminalModalOpen, setIsTerminalModalOpen] = useState<boolean>(false);
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState<boolean>(false);

  const handleAddBook = (newBook: Book) => {
    setBooks(prev => [...prev, newBook]);
  };

  const handleResetBooks = () => {
    setBooks(INITIAL_BOOKS);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenTerminal={() => setIsTerminalModalOpen(true)}
      />

      {/* Hero with Enes Öztürk Signature */}
      <HeroSignature
        books={books}
        onOpenTerminal={() => setIsTerminalModalOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Navigation Tabs (Mobile & Desktop View Switcher) */}
        <div className="border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'overview'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <BookMarked className="w-3.5 h-3.5" />
              <span>1. Koleksiyon (ArrayList)</span>
            </button>

            <button
              onClick={() => setActiveTab('map')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'map'
                  ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <span>2. Map&lt;String, String&gt; Eşleşmesi</span>
            </button>

            <button
              onClick={() => setActiveTab('filter')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'filter'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Filter className="w-3.5 h-3.5" />
              <span>3. Sayfa Filtresi (&gt;100)</span>
            </button>

            <button
              onClick={() => setActiveTab('pipeline')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'pipeline'
                  ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>4. Stream Görselleştirici</span>
            </button>

            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'code'
                  ? 'bg-indigo-500 text-white shadow-md shadow-indigo-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Code2 className="w-3.5 h-3.5" />
              <span>5. Java Kodları (Main &amp; Book)</span>
            </button>

            <button
              onClick={() => setActiveTab('terminal')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                activeTab === 'terminal'
                  ? 'bg-orange-500 text-slate-950 shadow-md shadow-orange-500/20'
                  : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>6. Canlı Konsol (Terminal)</span>
            </button>
          </div>
        </div>

        {/* Tab 1: Overview & Initial Book List */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            <InitialBookList
              books={books}
              onOpenAddModal={() => setIsAddBookModalOpen(true)}
              onResetBooks={handleResetBooks}
              onSelectBookForMap={() => setActiveTab('map')}
            />

            {/* Live Terminal Preview */}
            <div className="space-y-3 pt-6 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Canlı Terminal Önizlemesi (javac &amp; java Main)
                  </h3>
                  <p className="text-xs text-slate-400">
                    JVM üzerinde çalıştırılan kodun tam konsol çıktısı.
                  </p>
                </div>
                <button
                  onClick={() => setIsTerminalModalOpen(true)}
                  className="text-xs font-medium text-amber-400 hover:text-amber-300 transition-colors"
                >
                  Tam Ekranda Aç &rarr;
                </button>
              </div>

              <TerminalRunner books={books} />
            </div>
          </div>
        )}

        {/* Tab 2: Map<String, String> Transformation */}
        {activeTab === 'map' && (
          <MapTransformationView books={books} />
        )}

        {/* Tab 3: Page Filter (> 100) */}
        {activeTab === 'filter' && (
          <PageFilterView books={books} />
        )}

        {/* Tab 4: Step-by-Step Stream Pipeline Simulation */}
        {activeTab === 'pipeline' && (
          <StreamPipelineVisualizer books={books} />
        )}

        {/* Tab 5: Complete Java Source Code */}
        {activeTab === 'code' && (
          <JavaCodeViewer />
        )}

        {/* Tab 6: Live Console Runner */}
        {activeTab === 'terminal' && (
          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-bold text-white tracking-tight">
                6. Java Main Konsol Simülatörü
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Aşağıdaki terminal; kodun derlenip (<code className="text-amber-300 font-mono">javac Book.java Main.java</code>) ve çalıştırılmasını (<code className="text-amber-300 font-mono">java Main</code>) simüle eder.
              </p>
            </div>
            <TerminalRunner books={books} />
          </div>
        )}

      </main>

      {/* Terminal Modal (if triggered via header or button) */}
      <TerminalRunner
        books={books}
        isOpenModal={isTerminalModalOpen}
        onCloseModal={() => setIsTerminalModalOpen(false)}
      />

      {/* Add Custom Book Modal */}
      <AddBookModal
        isOpen={isAddBookModalOpen}
        onClose={() => setIsAddBookModalOpen(false)}
        onAddBook={handleAddBook}
      />

      {/* Professional Footer */}
      <Footer />
    </div>
  );
}
