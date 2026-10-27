import React, { useState, useRef, useEffect } from 'react';
import { Todo } from '../../types/todo';

interface ClassicTodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
}

export const ClassicTodoItem: React.FC<ClassicTodoItemProps> = ({
  todo,
  onToggle,
  onDelete,
  onEdit,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing && editInputRef.current) {
      editInputRef.current.focus();
      editInputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = () => {
    setEditText(todo.text);
    setIsEditing(true);
  };

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

  const liClasses = [
    todo.completed ? 'completed' : '',
    isEditing ? 'editing' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <li className={liClasses}>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={todo.completed}
          onChange={() => onToggle(todo.id)}
        />
        <label onDoubleClick={handleDoubleClick}>{todo.text}</label>
        <button
          className="destroy"
          onClick={() => onDelete(todo.id)}
          aria-label="Delete todo"
        />
      </div>
      {isEditing && (
        <input
          ref={editInputRef}
          className="edit"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={handleKeyDown}
        />
      )}
    </li>
  );
};
