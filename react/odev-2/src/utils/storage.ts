import { Todo } from '../types/todo';

const STORAGE_KEY = 'patika_enes_ozturk_todos_v2';
const SOUND_KEY = 'patika_sound_enabled';
const VIEW_KEY = 'patika_view_mode';

export const INITIAL_TODOS: Todo[] = [
  {
    id: '1',
    text: 'Patika.dev React Bootcamp derslerini izle',
    completed: true,
    createdAt: Date.now() - 3600000 * 24 * 2,
    priority: 'high',
    category: 'Eğitim',
  },
  {
    id: '2',
    text: 'Ödev 1: Axios ile veri çekme fonksiyonunu yaz',
    completed: true,
    createdAt: Date.now() - 3600000 * 24,
    priority: 'medium',
    category: 'Ödev',
  },
  {
    id: '3',
    text: 'Ödev 2: HTML & CSS çalışmasını React uygulamasına dönüştür',
    completed: true,
    createdAt: Date.now() - 3600000 * 5,
    priority: 'high',
    category: 'Ödev',
  },
  {
    id: '4',
    text: 'Enes Öztürk imzası ve geliştirici bilgilerini ekle',
    completed: true,
    createdAt: Date.now() - 3600000 * 2,
    priority: 'high',
    category: 'Proje',
  },
  {
    id: '5',
    text: 'Tüm gereksinimleri (filtreleme, düzenleme, sayaç, toplu işlem) test et',
    completed: false,
    createdAt: Date.now() - 3600000,
    priority: 'medium',
    category: 'Test',
  },
  {
    id: '6',
    text: 'GitHub reposuna push et ve Patika üzerinden teslim et',
    completed: false,
    createdAt: Date.now(),
    priority: 'high',
    category: 'Teslim',
  },
];

export const loadTodosFromStorage = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_TODOS;
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length >= 0) {
      return parsed;
    }
    return INITIAL_TODOS;
  } catch (err) {
    console.error('Failed to load todos from localStorage', err);
    return INITIAL_TODOS;
  }
};

export const saveTodosToStorage = (todos: Todo[]): void => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch (err) {
    console.error('Failed to save todos to localStorage', err);
  }
};

export const loadSoundPref = (): boolean => {
  try {
    const val = localStorage.getItem(SOUND_KEY);
    return val !== 'false';
  } catch {
    return true;
  }
};

export const saveSoundPref = (enabled: boolean): void => {
  try {
    localStorage.setItem(SOUND_KEY, String(enabled));
  } catch {
    // Ignore
  }
};

export const loadViewModePref = (): 'classic' | 'modern' => {
  try {
    const val = localStorage.getItem(VIEW_KEY);
    if (val === 'classic' || val === 'modern') return val;
    return 'classic'; // Default to classic TodoMVC as requested by the assignment!
  } catch {
    return 'classic';
  }
};

export const saveViewModePref = (mode: 'classic' | 'modern'): void => {
  try {
    localStorage.setItem(VIEW_KEY, mode);
  } catch {
    // Ignore
  }
};
