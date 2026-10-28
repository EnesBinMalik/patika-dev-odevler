export type PortfolioCategory =
  | 'Tümü'
  | 'Web Tasarım'
  | 'Branding'
  | 'Mobil Uygulama'
  | 'Grafik Tasarım'
  | 'Yazılım & API';

export interface PortfolioItem {
  id: string;
  title: string;
  subtitle: string;
  category: 'Web Tasarım' | 'Branding' | 'Mobil Uygulama' | 'Grafik Tasarım' | 'Yazılım & API';
  imageUrl: string;
  client: string;
  date: string;
  projectUrl?: string;
  description: string;
  technologies: string[];
  featured?: boolean;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'new' | 'read';
}
