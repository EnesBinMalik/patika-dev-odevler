import React from 'react';
import { Todo, FilterType, PriorityType } from '../../types/todo';
import { ModernHeader } from './ModernHeader';
import { ModernFilterBar } from './ModernFilterBar';
import { ModernTodoList } from './ModernTodoList';
import { ModernFooter } from './ModernFooter';

interface ModernTodoAppProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: FilterType;
  searchQuery: string;
  selectedCategory: string;
  categories: string[];
  totalCount: number;
  activeCount: number;
  completedCount: number;
  percentCompleted: number;
  allCompleted: boolean;
  onAddTodo: (text: string, priority: PriorityType, category: string) => void;
  onToggleTodo: (id: string) => void;
  onToggleAll: () => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onSearchChange: (query: string) => void;
  onCategoryChange: (cat: string) => void;
  onClearCompleted: () => void;
  onResetToSample: () => void;
  onClearAll: () => void;
  onImportTodos: (todos: Todo[]) => void;
  onOpenDevModal: () => void;
}

export const ModernTodoApp: React.FC<ModernTodoAppProps> = ({
  todos,
  filteredTodos,
  filter,
  searchQuery,
  selectedCategory,
  categories,
  totalCount,
  activeCount,
  completedCount,
  percentCompleted,
  allCompleted,
  onAddTodo,
  onToggleTodo,
  onToggleAll,
  onDeleteTodo,
  onEditTodo,
  onFilterChange,
  onSearchChange,
  onCategoryChange,
  onClearCompleted,
  onResetToSample,
  onClearAll,
  onImportTodos,
  onOpenDevModal,
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      {/* Modern Header Banner */}
      <div className="text-center space-y-1">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
          Görev Yöneticisi
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 font-normal">
          Patika.dev React Bootcamp Ödevi · Hazırlayan:{' '}
          <span className="font-semibold text-slate-800">Enes Öztürk</span>
        </p>
      </div>

      {/* Input section */}
      <ModernHeader onAddTodo={onAddTodo} categories={categories} />

      {/* Filter & Search Bar */}
      <ModernFilterBar
        filter={filter}
        onFilterChange={onFilterChange}
        searchQuery={searchQuery}
        onSearchChange={onSearchChange}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        categories={categories}
        totalCount={totalCount}
        activeCount={activeCount}
        completedCount={completedCount}
        percentCompleted={percentCompleted}
      />

      {/* List */}
      <ModernTodoList
        todos={filteredTodos}
        totalTodosCount={totalCount}
        allCompleted={allCompleted}
        onToggle={onToggleTodo}
        onDelete={onDeleteTodo}
        onEdit={onEditTodo}
        onToggleAll={onToggleAll}
        filter={filter}
      />

      {/* Footer */}
      <ModernFooter
        completedCount={completedCount}
        totalCount={totalCount}
        todos={todos}
        onClearCompleted={onClearCompleted}
        onResetToSample={onResetToSample}
        onClearAll={onClearAll}
        onImportTodos={onImportTodos}
        onOpenDevModal={onOpenDevModal}
      />
    </div>
  );
};
