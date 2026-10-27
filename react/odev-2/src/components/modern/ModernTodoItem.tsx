import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { Check, Trash2, Edit3, X, CheckSquare } from 'lucide-react';
import { Todo } from '../../types/todo';

interface ModernTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const ModernTodoItem: React.FC<ModernTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (!isEditing) return;
    setIsEditing(false);
    onEdit(todo.id, editText);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      setIsEditing(false);
      setEditText(todo.text);
    }
  };

  const priorityColors = {
    low: 'text-emerald-600 bg-emerald-50 border-emerald-200/60',
    medium: 'text-amber-600 bg-amber-50 border-amber-200/60',
    high: 'text-rose-600 bg-rose-50 border-rose-200/60',
  };

  const priorityLabels = {
    low: 'Düşük',
    medium: 'Orta',
    high: 'Yüksek',
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.18 }}
      className={`group relative flex items-center justify-between p-3.5 rounded-xl border transition-all ${
        todo.completed
          ? 'bg-slate-50/70 border-slate-200/60'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs hover:shadow-xs'
      }`}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0 pr-2">
        {/* Checkbox */}
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          className={`flex-shrink-0 w-5 h-5 rounded-md border flex items-center justify-center transition-all cursor-pointer ${
            todo.completed
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-2xs'
              : 'border-slate-300 hover:border-slate-400 bg-white'
          }`}
          aria-label={todo.completed ? 'Tamamlanmadı olarak işaretle' : 'Tamamlandı olarak işaretle'}
        >
          {todo.completed && <Check className="w-3.5 h-3.5 stroke-[3]" />}
        </button>

        {/* Text content or edit input */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                ref={inputRef}
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleSave}
                className="w-full text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg px-2.5 py-1 outline-none focus:border-slate-800 focus:ring-1 focus:ring-slate-800"
              />
              <button
                type="button"
                onClick={handleSave}
                className="p-1 text-emerald-600 hover:text-emerald-700"
                title="Kaydet"
              >
                <CheckSquare className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setEditText(todo.text);
                }}
                className="p-1 text-slate-400 hover:text-slate-600"
                title="İptal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col">
              <span
                onDoubleClick={() => setIsEditing(true)}
                className={`text-sm select-none break-words leading-snug cursor-pointer transition-colors ${
                  todo.completed
                    ? 'line-through text-slate-400'
                    : 'text-slate-800 font-medium'
                }`}
                title="Düzenlemek için çift tıklayın"
              >
                {todo.text}
              </span>

              {/* Metadata tags */}
              <div className="flex items-center gap-2 mt-1 text-[11px] text-slate-400">
                {todo.category && (
                  <span className="text-slate-500 font-medium">
                    {todo.category}
                  </span>
                )}
                {todo.category && todo.priority && (
                  <span aria-hidden="true">·</span>
                )}
                {todo.priority && (
                  <span
                    className={`font-medium ${
                      todo.priority === 'high'
                        ? 'text-rose-600'
                        : todo.priority === 'medium'
                        ? 'text-amber-600'
                        : 'text-emerald-600'
                    }`}
                  >
                    {priorityLabels[todo.priority]}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action buttons */}
      {!isEditing && (
        <div className="flex items-center gap-1 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Düzenle"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onDelete(todo.id)}
            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
            title="Görevi Sil"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </motion.div>
  );
};
