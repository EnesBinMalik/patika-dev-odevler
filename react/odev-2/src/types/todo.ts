export type FilterType = 'all' | 'active' | 'completed';
export type PriorityType = 'low' | 'medium' | 'high';

export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
  priority?: PriorityType;
  category?: string;
  dueDate?: string;
}

export type ViewMode = 'classic' | 'modern';
