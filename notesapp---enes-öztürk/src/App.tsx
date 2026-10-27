import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { SearchFilter } from './components/SearchFilter';
import { NoteForm } from './components/NoteForm';
import { NoteCard } from './components/NoteCard';
import { NoteEditModal } from './components/NoteEditModal';
import { SignatureFooter } from './components/SignatureFooter';
import { INITIAL_NOTES, NOTE_COLORS } from './constants/colors';
import { Note, SortOption } from './types/note';
import {
  FileText,
  Trash,
  RotateCcw,
  Sparkles,
  CheckCircle,
  FilterX,
} from 'lucide-react';

const LOCAL_STORAGE_KEY = 'notesapp_enes_ozturk_notes_v1';

export default function App() {
  const [notes, setNotes] = useState<Note[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('LocalStorage okuma hatası:', e);
    }
    return INITIAL_NOTES;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFilter, setSelectedColorFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Sync with LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(notes));
    } catch (e) {
      console.error('LocalStorage yazma hatası:', e);
    }
  }, [notes]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Add new note
  const handleAddNote = (content: string, colorId: string) => {
    const newNote: Note = {
      id: `note-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      content,
      colorId,
      createdAt: Date.now(),
      pinned: false,
    };
    setNotes((prev) => [newNote, ...prev]);
    showToast('Yeni not başarıyla eklendi!');
  };

  // Delete note
  const handleDeleteNote = (id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
    showToast('Not silindi.');
  };

  // Edit existing note
  const handleSaveEdit = (id: string, newContent: string, newColorId: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              content: newContent,
              colorId: newColorId,
              updatedAt: Date.now(),
            }
          : note
      )
    );
    showToast('Not güncellendi!');
  };

  // Toggle pin
  const handleTogglePin = (id: string) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned } : note
      )
    );
  };

  // Reset to initial sample notes
  const handleResetNotes = () => {
    setNotes(INITIAL_NOTES);
    setSearchQuery('');
    setSelectedColorFilter(null);
    showToast('Örnek notlar geri yüklendi.');
  };

  // Clear all notes
  const handleClearAll = () => {
    if (window.confirm('Tüm notları silmek istediğinize emin misiniz?')) {
      setNotes([]);
      showToast('Tüm notlar temizlendi.');
    }
  };

  // Filtered and Sorted notes calculation
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Text search filter
        const matchesQuery =
          !searchQuery.trim() ||
          note.content.toLowerCase().includes(searchQuery.trim().toLowerCase());

        // Color filter
        const matchesColor =
          !selectedColorFilter || note.colorId === selectedColorFilter;

        return matchesQuery && matchesColor;
      })
      .sort((a, b) => {
        // Pinned notes always come first
        if (a.pinned && !b.pinned) return -1;
        if (!a.pinned && b.pinned) return 1;

        if (sortBy === 'newest') {
          return b.createdAt - a.createdAt;
        }
        if (sortBy === 'oldest') {
          return a.createdAt - b.createdAt;
        }
        if (sortBy === 'alphabetical') {
          return a.content.localeCompare(b.content, 'tr');
        }
        return 0;
      });
  }, [notes, searchQuery, selectedColorFilter, sortBy]);

  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col justify-between selection:bg-amber-200 selection:text-amber-900">
      <div>
        {/* Header */}
        <Header totalNotes={notes.length} />

        <main className="max-w-5xl mx-auto px-4 pb-12">
          {/* Note input form with color picker and dynamic preview */}
          <NoteForm onAddNote={handleAddNote} />

          {/* Search and filter bar */}
          <SearchFilter
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            selectedColorFilter={selectedColorFilter}
            onColorFilterChange={setSelectedColorFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
            totalNotesCount={notes.length}
            filteredNotesCount={filteredNotes.length}
          />

          {/* Action Bar when notes exist */}
          {notes.length > 0 && (
            <div className="flex items-center justify-between px-2 mb-4 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-slate-700">
                  {searchQuery || selectedColorFilter
                    ? `Filtrelenen Notlar (${filteredNotes.length})`
                    : `Tüm Notlar (${notes.length})`}
                </span>
                {selectedColorFilter && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] bg-slate-200 text-slate-700 font-medium">
                    Filtre aktif
                    <button
                      onClick={() => setSelectedColorFilter(null)}
                      className="hover:text-slate-900"
                    >
                      &times;
                    </button>
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleResetNotes}
                  className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
                  title="Örnek notları tekrar yükle"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Örnekleri Yükle</span>
                </button>
                <button
                  onClick={handleClearAll}
                  className="inline-flex items-center gap-1 text-rose-500 hover:text-rose-700 transition-colors cursor-pointer"
                  title="Tüm notları sil"
                >
                  <Trash className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Hepsini Sil</span>
                </button>
              </div>
            </div>
          )}

          {/* Notes Grid */}
          {filteredNotes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {filteredNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  searchQuery={searchQuery}
                  onDelete={handleDeleteNote}
                  onEdit={setEditingNote}
                  onTogglePin={handleTogglePin}
                />
              ))}
            </div>
          ) : (
            /* Empty state */
            <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 sm:p-12 text-center max-w-md mx-auto my-8 space-y-3">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-50 text-amber-500 flex items-center justify-center">
                {searchQuery || selectedColorFilter ? (
                  <FilterX className="w-7 h-7" />
                ) : (
                  <FileText className="w-7 h-7" />
                )}
              </div>
              <h3 className="font-bold text-slate-800 text-lg">
                {searchQuery || selectedColorFilter
                  ? 'Eşleşen not bulunamadı'
                  : 'Henüz not eklenmedi'}
              </h3>
              <p className="text-sm text-slate-500 max-w-xs mx-auto">
                {searchQuery || selectedColorFilter
                  ? `"${searchQuery}" araması veya seçilen filtre için hiçbir sonuç çıkmadı.`
                  : 'Yukarıdaki alana bir not yazıp istediğiniz rengi seçerek ilk notunuzu ekleyin!'}
              </p>
              {(searchQuery || selectedColorFilter) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedColorFilter(null);
                  }}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Filtreleri Temizle
                </button>
              )}
              {notes.length === 0 && (
                <button
                  onClick={handleResetNotes}
                  className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Örnek Notları Yükle
                </button>
              )}
            </div>
          )}
        </main>
      </div>

      {/* Edit Modal */}
      <NoteEditModal
        note={editingNote}
        isOpen={Boolean(editingNote)}
        onClose={() => setEditingNote(null)}
        onSave={handleSaveEdit}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold shadow-xl border border-slate-700 animate-in slide-in-from-bottom-2 fade-in duration-200">
          <CheckCircle className="w-4 h-4 text-emerald-400" />
          <span>{toast}</span>
        </div>
      )}

      {/* Signature Footer */}
      <SignatureFooter />
    </div>
  );
}
