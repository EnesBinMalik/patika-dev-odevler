import React from 'react';
import { FilterType } from '../../types/todo';

interface ClassicFooterProps {
  activeCount: number;
  completedCount: number;
  totalCount: number;
  filter: FilterType;
  onFilterChange: (filter: FilterType) => void;
  onClearCompleted: () => void;
}

export const ClassicFooter: React.FC<ClassicFooterProps> = ({
  activeCount,
  completedCount,
  totalCount,
  filter,
  onFilterChange,
  onClearCompleted,
}) => {
  if (totalCount === 0) {
    return null;
  }

  return (
    <footer className="footer">
      <span className="todo-count">
        <strong>{activeCount}</strong> {activeCount === 1 ? 'item' : 'items'} left
      </span>
      <ul className="filters">
        <li>
          <a
            href="#/"
            className={filter === 'all' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              onFilterChange('all');
            }}
          >
            All
          </a>
        </li>
        <li>
          <a
            href="#/active"
            className={filter === 'active' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              onFilterChange('active');
            }}
          >
            Active
          </a>
        </li>
        <li>
          <a
            href="#/completed"
            className={filter === 'completed' ? 'selected' : ''}
            onClick={(e) => {
              e.preventDefault();
              onFilterChange('completed');
            }}
          >
            Completed
          </a>
        </li>
      </ul>
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          Clear completed
        </button>
      )}
    </footer>
  );
};
