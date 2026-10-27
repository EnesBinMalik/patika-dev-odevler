import { useState, useEffect } from 'react';
import { useTodos } from './hooks/useTodos';
import { ViewMode } from './types/todo';
import { loadSoundPref, saveSoundPref, loadViewModePref, saveViewModePref } from './utils/storage';
import { sound } from './utils/sound';
import { TopNav } from './components/TopNav';
import { ClassicTodoApp } from './components/classic/ClassicTodoApp';
import { ModernTodoApp } from './components/modern/ModernTodoApp';
import { DeveloperModal } from './components/DeveloperModal';
import { ShortcutsModal } from './components/ShortcutsModal';
import { Toast } from './components/Toast';

export default function App() {
  const {
    todos,
    filteredTodos,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    categories,
    activeCount,
    completedCount,
    totalCount,
    allCompleted,
    percentCompleted,
    addTodo,
    toggleTodo,
    toggleAll,
    editTodo,
    deleteTodo,
    undoDelete,
    clearCompleted,
    resetToSample,
    clearAll,
    importTodos,
    toastMessage,
    setToastMessage,
  } = useTodos();

  const [viewMode, setViewMode] = useState<ViewMode>(() => loadViewModePref());
  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => loadSoundPref());
  const [isDevModalOpen, setIsDevModalOpen] = useState(false);
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

  // Sync sound setting with SoundFX singleton
  useEffect(() => {
    sound.enabled = soundEnabled;
    saveSoundPref(soundEnabled);
  }, [soundEnabled]);

  // Sync viewMode preference
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    saveViewModePref(mode);
  };

  // Sound toggle handler
  const handleToggleSound = () => {
    setSoundEnabled(prev => !prev);
  };

  // Global key listener for shortcuts and escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '?' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 'Escape') {
        setIsDevModalOpen(false);
        setIsShortcutsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 selection:bg-slate-900 selection:text-white">
      {/* Top Application Bar */}
      <TopNav
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onOpenDevModal={() => setIsDevModalOpen(true)}
        activeCount={activeCount}
        totalCount={totalCount}
      />

      {/* Main View: Classic TodoMVC or Modern Studio */}
      <main className="flex-1">
        {viewMode === 'classic' ? (
          <div className="classic-container">
            <ClassicTodoApp
              todos={todos}
              filteredTodos={filteredTodos}
              filter={filter}
              allCompleted={allCompleted}
              totalCount={totalCount}
              activeCount={activeCount}
              completedCount={completedCount}
              onAddTodo={(text) => addTodo(text)}
              onToggleTodo={toggleTodo}
              onToggleAll={toggleAll}
              onDeleteTodo={deleteTodo}
              onEditTodo={editTodo}
              onFilterChange={setFilter}
              onClearCompleted={clearCompleted}
              onOpenDevModal={() => setIsDevModalOpen(true)}
            />
          </div>
        ) : (
          <ModernTodoApp
            todos={todos}
            filteredTodos={filteredTodos}
            filter={filter}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            categories={categories}
            totalCount={totalCount}
            activeCount={activeCount}
            completedCount={completedCount}
            percentCompleted={percentCompleted}
            allCompleted={allCompleted}
            onAddTodo={addTodo}
            onToggleTodo={toggleTodo}
            onToggleAll={toggleAll}
            onDeleteTodo={deleteTodo}
            onEditTodo={editTodo}
            onFilterChange={setFilter}
            onSearchChange={setSearchQuery}
            onCategoryChange={setSelectedCategory}
            onClearCompleted={clearCompleted}
            onResetToSample={resetToSample}
            onClearAll={clearAll}
            onImportTodos={importTodos}
            onOpenDevModal={() => setIsDevModalOpen(true)}
          />
        )}
      </main>

      {/* Modals & Toast */}
      <DeveloperModal
        isOpen={isDevModalOpen}
        onClose={() => setIsDevModalOpen(false)}
      />

      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
        onUndo={undoDelete}
      />
    </div>
  );
}
