import { useState, useEffect, useCallback, useMemo } from 'react';
import confetti from 'canvas-confetti';
import { Todo, FilterType, PriorityType } from '../types/todo';
import { loadTodosFromStorage, saveTodosToStorage, INITIAL_TODOS } from '../utils/storage';
import { sound } from '../utils/sound';

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>(() => loadTodosFromStorage());
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lastDeletedTodo, setLastDeletedTodo] = useState<Todo | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync with localStorage
  useEffect(() => {
    saveTodosToStorage(todos);
  }, [todos]);

  // Sync filter with URL hash (Standard TodoMVC specification: #/, #/active, #/completed)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash === 'active') {
        setFilter('active');
      } else if (hash === 'completed') {
        setFilter('completed');
      } else {
        setFilter('all');
      }
    };

    handleHashChange();
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Update hash when filter changes
  const setFilterWithHash = useCallback((newFilter: FilterType) => {
    setFilter(newFilter);
    if (newFilter === 'all') {
      window.location.hash = '#/';
    } else {
      window.location.hash = `#/${newFilter}`;
    }
  }, []);

  // Trigger confetti if all completed and length > 0
  const triggerCelebration = useCallback(() => {
    sound.playCelebrate();
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#b83f45', '#10b981', '#3b82f6', '#f59e0b', '#8b5cf6'],
      });
    } catch {
      // Ignore
    }
  }, []);

  const addTodo = useCallback((text: string, priority: PriorityType = 'medium', category: string = 'Genel') => {
    const trimmed = text.trim();
    if (!trimmed) return false;

    const newTodo: Todo = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      text: trimmed,
      completed: false,
      createdAt: Date.now(),
      priority,
      category,
    };

    setTodos(prev => [newTodo, ...prev]);
    sound.playAdd();
    return true;
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setTodos(prev => {
      let isNowComplete = false;
      const updated = prev.map(todo => {
        if (todo.id === id) {
          isNowComplete = !todo.completed;
          return { ...todo, completed: !todo.completed };
        }
        return todo;
      });

      if (isNowComplete) {
        sound.playCheck();
        // Check if all are now completed
        const allDone = updated.length > 0 && updated.every(t => t.completed);
        if (allDone) {
          triggerCelebration();
        }
      } else {
        sound.playUncheck();
      }

      return updated;
    });
  }, [triggerCelebration]);

  const toggleAll = useCallback(() => {
    setTodos(prev => {
      const areAllCompleted = prev.length > 0 && prev.every(t => t.completed);
      const targetState = !areAllCompleted;

      const updated = prev.map(todo => ({
        ...todo,
        completed: targetState,
      }));

      if (targetState && updated.length > 0) {
        triggerCelebration();
      } else {
        sound.playUncheck();
      }

      return updated;
    });
  }, [triggerCelebration]);

  const editTodo = useCallback((id: string, newText: string) => {
    const trimmed = newText.trim();
    if (!trimmed) {
      // If text is emptied, delete the todo as per TodoMVC standard
      setTodos(prev => prev.filter(t => t.id !== id));
      sound.playDelete();
      return;
    }

    setTodos(prev =>
      prev.map(todo => (todo.id === id ? { ...todo, text: trimmed } : todo))
    );
    sound.playAdd();
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setTodos(prev => {
      const target = prev.find(t => t.id === id);
      if (target) {
        setLastDeletedTodo(target);
        setToastMessage(`"${target.text.slice(0, 20)}..." silindi`);
      }
      return prev.filter(t => t.id !== id);
    });
    sound.playDelete();
  }, []);

  const undoDelete = useCallback(() => {
    if (lastDeletedTodo) {
      setTodos(prev => [lastDeletedTodo, ...prev]);
      setLastDeletedTodo(null);
      setToastMessage(null);
      sound.playAdd();
    }
  }, [lastDeletedTodo]);

  const clearCompleted = useCallback(() => {
    setTodos(prev => {
      const remaining = prev.filter(t => !t.completed);
      const removedCount = prev.length - remaining.length;
      if (removedCount > 0) {
        setToastMessage(`${removedCount} tamamlanmış görev temizlendi`);
      }
      return remaining;
    });
    sound.playDelete();
  }, []);

  const resetToSample = useCallback(() => {
    setTodos(INITIAL_TODOS);
    sound.playAdd();
    setToastMessage('Örnek ödev görevleri yüklendi');
  }, []);

  const clearAll = useCallback(() => {
    setTodos([]);
    sound.playDelete();
    setToastMessage('Tüm görevler temizlendi');
  }, []);

  const importTodos = useCallback((imported: Todo[]) => {
    if (Array.isArray(imported)) {
      setTodos(imported);
      sound.playCheck();
      setToastMessage(`${imported.length} görev başarıyla içe aktarıldı`);
    }
  }, []);

  // Filtered todos based on filter, search query, and category
  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      // Filter tab
      if (filter === 'active' && todo.completed) return false;
      if (filter === 'completed' && !todo.completed) return false;

      // Search query
      if (searchQuery.trim() && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && todo.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [todos, filter, searchQuery, selectedCategory]);

  const activeCount = useMemo(() => todos.filter(t => !t.completed).length, [todos]);
  const completedCount = useMemo(() => todos.filter(t => t.completed).length, [todos]);
  const totalCount = todos.length;
  const allCompleted = totalCount > 0 && activeCount === 0;
  const percentCompleted = totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  const categories = useMemo(() => {
    const set = new Set<string>();
    todos.forEach(t => {
      if (t.category) set.add(t.category);
    });
    return Array.from(set);
  }, [todos]);

  return {
    todos,
    filteredTodos,
    filter,
    setFilter: setFilterWithHash,
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
  };
}
