export interface Project {
  id: string;
  title: string;
  category: 'Web Geliştirme' | 'Full Stack' | 'Node.js & Express' | 'Mobil & UI';
  description: string;
  longDescription?: string;
  image: string;
  client: string;
  date: string;
  githubUrl?: string;
  liveUrl?: string;
  technologies: string[];
  featured?: boolean;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}
