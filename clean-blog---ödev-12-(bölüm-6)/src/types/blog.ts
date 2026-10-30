export interface BlogPost {
  id: string;
  title: string;
  subtitle: string;
  detail: string;
  author: string;
  authorEmail?: string;
  dateCreated: string;
  readTime: string;
  category: string;
}

export interface PostComment {
  id: string;
  postId: string;
  name: string;
  comment: string;
  date: string;
}

export type ActiveTab = 'home' | 'post-detail' | 'new-post' | 'edit-post' | 'about' | 'deployment' | 'contact';
