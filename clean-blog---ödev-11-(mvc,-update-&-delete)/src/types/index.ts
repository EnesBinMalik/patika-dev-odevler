export interface BlogPost {
  _id: string;
  title: string;
  subtitle: string;
  detail: string;
  author: string;
  authorAvatar?: string;
  category: string;
  imageUrl: string;
  dateCreated: string; // ISO string or formatted date
  readTimeMinutes: number;
  likes: number;
}

export type ActivePage = 'home' | 'post-detail' | 'edit-post' | 'add-post' | 'about' | 'mvc-code';

export interface MVCFile {
  id: string;
  name: string;
  path: string;
  category: 'controller' | 'model' | 'view' | 'route' | 'config';
  language: 'javascript' | 'html' | 'json';
  description: string;
  code: string;
  highlightLines?: number[];
  odevNote?: string;
}
