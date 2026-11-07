import React, { useState, useEffect } from 'react';
import { ActiveModule } from './types';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LinkedInModal } from './components/LinkedInModal';
import { ArrayVisualizer } from './modules/ArrayVisualizer/ArrayVisualizer';
import { StackVisualizer } from './modules/StackVisualizer/StackVisualizer';
import { QueueVisualizer } from './modules/QueueVisualizer/QueueVisualizer';
import { SortingVisualizer } from './modules/SortingVisualizer/SortingVisualizer';
import { MazeVisualizer } from './modules/MazeVisualizer/MazeVisualizer';
import { Code, Terminal, Layers, PlayCircle, GitFork } from 'lucide-react';

export default function App() {
  const [activeModule, setActiveModule] = useState<ActiveModule>('array');
  const [isLinkedInModalOpen, setIsLinkedInModalOpen] = useState<boolean>(false);

  // Keyboard shortcut listener for quick navigation (1-5)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }
      if (e.key === '1') setActiveModule('array');
      if (e.key === '2') setActiveModule('stack');
      if (e.key === '3') setActiveModule('queue');
      if (e.key === '4') setActiveModule('sorting');
      if (e.key === '5') setActiveModule('maze');
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* 3-Zone Header Contract */}
      <Header
        activeModule={activeModule}
        onSelectModule={setActiveModule}
        onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Module Switcher Rendering */}
        {activeModule === 'array' && <ArrayVisualizer />}
        {activeModule === 'stack' && <StackVisualizer />}
        {activeModule === 'queue' && <QueueVisualizer />}
        {activeModule === 'sorting' && <SortingVisualizer />}
        {activeModule === 'maze' && <MazeVisualizer />}
      </main>

      {/* Footer with Enes Öztürk Signature and LinkedIn Quote */}
      <Footer onOpenLinkedInModal={() => setIsLinkedInModalOpen(true)} />

      {/* LinkedIn Presentation Modal */}
      <LinkedInModal
        isOpen={isLinkedInModalOpen}
        onClose={() => setIsLinkedInModalOpen(false)}
      />
    </div>
  );
}
