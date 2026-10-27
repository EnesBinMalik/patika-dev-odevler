import React from 'react';
import { AnimatePresence } from 'motion/react';
import { CheckCircle2, ListTodo } from 'lucide-react';
import { Todo } from '../../types/todo';
import { ModernTodoItem } from './ModernTodoItem';

interface ModernTodoListProps {
  todos: Todo[];
  totalTodosCount: number;
  allCompleted: boolean;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onToggleAll: () => void;
  filter: string;
}

export const ModernTodoList: React.FC<ModernTodoListProps> = ({
  todos,
  totalTodosCount,
  allCompleted,
  onToggle,
  onDelete,
  onEdit,
  onToggleAll,
  filter,
}) => {
  if (totalTodosCount === 0) {
    return (
      <div className="text-center py-12 px-4 bg-white border border-dashed border-slate-200 rounded-2xl">
        <ListTodo className="w-10 h-10 text-slate-300 mx-auto mb-2" />
        <h3 className="text-sm font-semibold text-slate-700">Henüz hiç görev yok</h3>
        <p className="text-xs text-slate-400 mt-1">
          Yukarıdaki kutudan ilk görevinizi ekleyebilir veya örnek listeyi yükleyebilirsiniz.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {/* Quick toggle all header */}
      <div className="flex items-center justify-between px-1 py-0.5 text-xs text-slate-500 font-medium">
        <button
          type="button"
          onClick={onToggleAll}
          className="flex items-center gap-1.5 hover:text-slate-800 transition-colors cursor-pointer"
        >
          <CheckCircle2
            className={`w-4 h-4 ${allCompleted ? 'text-emerald-500' : 'text-slate-400'}`}
          />
          <span>{allCompleted ? 'Tümünün İşaretini Kaldır' : 'Tümünü Tamamlandı İşaretle'}</span>
        </button>
        <span>
          {todos.length} görev listeleniyor
        </span>
      </div>

      {/* Todo items */}
      {todos.length === 0 ? (
        <div className="text-center py-8 px-4 bg-slate-50/50 rounded-xl border border-slate-100">
          <p className="text-xs text-slate-500">
            {filter === 'active'
              ? 'Harika! Aktif bekleyen hiçbir görev bulunmuyor.'
              : filter === 'completed'
              ? 'Henüz tamamlanmış görev yok.'
              : 'Arama kriterlerine uygun görev bulunamadı.'}
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          <AnimatePresence mode="popLayout">
            {todos.map((todo) => (
              <ModernTodoItem
                key={todo.id}
                todo={todo}
                onToggle={onToggle}
                onDelete={onDelete}
                onEdit={onEdit}
              />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};
