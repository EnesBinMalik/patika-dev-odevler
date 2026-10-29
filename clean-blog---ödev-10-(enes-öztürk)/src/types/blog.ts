export interface BlogPost {
  _id: string;
  title: string;
  detail: string;
  dateCreated: string;
  author: string;
  subtitle?: string;
}

export type ActiveTab = 'home' | 'post' | 'add' | 'about' | 'homework';
