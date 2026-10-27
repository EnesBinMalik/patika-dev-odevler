import React from 'react';
import { Todo, FilterType } from '../../types/todo';
import { ClassicHeader } from './ClassicHeader';
import { ClassicTodoList } from './ClassicTodoList';
import { ClassicFooter } from './ClassicFooter';
import { ClassicInfo } from './ClassicInfo';

interface ClassicTodoAppProps {
  todos: Todo[];
  filteredTodos: Todo[];
  filter: FilterType;
  allCompleted: boolean;
  totalCount: number;
  activeCount: number;
  completedCount: number;
  onAddTodo: (text: string) => void;
  onToggleTodo: (id: string) => void;
  onToggleAll: () => void;
  onDeleteTodo: (id: string) => void;
  onEditTodo: (id: string, newText: string) => void;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
  onOpenDevModal: () => void;
}

export const ClassicTodoApp: React.FC<ClassicTodoAppProps> = ({
  filteredTodos,
  filter,
  allCompleted,
  totalCount,
  activeCount,
  completedCount,
  onAddTodo,
  onToggleTodo,
  onToggleAll,
  onDeleteTodo,
  onEditTodo,
  onFilterChange,
  onClearCompleted,
  onOpenDevModal,
}) => {
  return (
    <div className="w-full max-w-[550px] mx-auto pt-6 pb-12 px-4">
      <section className="todoapp">
        <ClassicHeader onAddTodo={onAddTodo} />
        <ClassicTodoList
          todos={filteredTodos}
          allCompleted={allCompleted}
          totalTodosCount={totalCount}
          onToggle={onToggleTodo}
          onDelete={onDeleteTodo}
          onEdit={onEditTodo}
          onToggleAll={onToggleAll}
        />
        <ClassicFooter
          activeCount={activeCount}
          completedCount={completedCount}
          totalCount={totalCount}
          filter={filter}
          onFilterChange={onFilterChange}
          onClearCompleted={onClearCompleted}
        />
      </section>
      <ClassicInfo onOpenDevModal={onOpenDevModal} />
    </div>
  );
};
