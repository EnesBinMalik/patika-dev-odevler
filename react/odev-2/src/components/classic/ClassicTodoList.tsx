import React from 'react';
import { Todo } from '../../types/todo';
import { ClassicTodoItem } from './ClassicTodoItem';

interface ClassicTodoListProps {
  todos: Todo[];
  allCompleted: boolean;
  totalTodosCount: number;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onToggleAll: () => void;
}

export const ClassicTodoList: React.FC<ClassicTodoListProps> = ({
  todos,
  allCompleted,
  totalTodosCount,
  onToggle,
  onDelete,
  onEdit,
  onToggleAll,
}) => {
  if (totalTodosCount === 0) {
    return null;
  }

  return (
    <section className="main">
      <input
        id="toggle-all"
        className="toggle-all"
        type="checkbox"
        checked={allCompleted}
        onChange={onToggleAll}
      />
      <label htmlFor="toggle-all">Mark all as complete</label>
      <ul className="todo-list">
        {todos.map((todo) => (
          <ClassicTodoItem
            key={todo.id}
            todo={todo}
            onToggle={onToggle}
            onDelete={onDelete}
            onEdit={onEdit}
          />
        ))}
      </ul>
    </section>
  );
};
