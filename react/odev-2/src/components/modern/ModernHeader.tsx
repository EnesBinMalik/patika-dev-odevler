import React, { useState } from 'react';
import { Plus, Tag, Flag } from 'lucide-react';
import { PriorityType } from '../../types/todo';

interface ModernHeaderProps {
  onAddTodo: (text: string, priority: PriorityType, category: string) => void;
  categories: string[];
}

export const ModernHeader: React.FC<ModernHeaderProps> = ({ onAddTodo, categories }) => {
  const [text, setText] = useState('');
  const [priority, setPriority] = useState<PriorityType>('medium');
  const [category, setCategory] = useState<string>('Ödev');
  const [isExpanded, setIsExpanded] = useState(false);

  const defaultCategories = ['Ödev', 'Eğitim', 'Proje', 'Kişisel', 'İş'];
  const allCategories = Array.from(new Set([...defaultCategories, ...categories]));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      onAddTodo(text, priority, category);
      setText('');
      setIsExpanded(false);
    }
  };

  return (
    <div className="bg-white border border-slate-200/90 rounded-2xl shadow-sm p-4 transition-all focus-within:shadow-md focus-within:border-slate-300">
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <input
              type="text"
              placeholder="Yeni bir görev ekleyin... (Enter ile kaydet)"
              value={text}
              onChange={(e) => setText(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              className="w-full text-slate-800 placeholder-slate-400 text-base font-normal bg-transparent border-0 outline-none focus:ring-0"
            />
          </div>
          <button
            type="submit"
            disabled={!text.trim()}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 rounded-xl text-xs font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Ekle</span>
          </button>
        </div>

        {/* Priority & Category selectors (shown on focus or when text is typed) */}
        {(isExpanded || text.trim()) && (
          <div className="pt-2.5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600">
            {/* Priority selection */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <Flag className="w-3 h-3" />
                Öncelik:
              </span>
              <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
                <button
                  type="button"
                  onClick={() => setPriority('low')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    priority === 'low'
                      ? 'bg-white text-emerald-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Düşük
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('medium')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    priority === 'medium'
                      ? 'bg-white text-amber-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Orta
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('high')}
                  className={`px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
                    priority === 'high'
                      ? 'bg-white text-rose-700 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Yüksek
                </button>
              </div>
            </div>

            {/* Category selection */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-400 font-medium">
                <Tag className="w-3 h-3" />
                Kategori:
              </span>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="bg-slate-100 text-slate-700 text-xs rounded-lg px-2.5 py-1 border-0 outline-none font-medium cursor-pointer"
              >
                {allCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};
