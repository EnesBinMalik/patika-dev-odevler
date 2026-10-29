export type EventCategory = 
  | 'Teknoloji'
  | 'Tasarım & Sanat'
  | 'Eğitim & Kariyer'
  | 'Girişimcilik'
  | 'Müzik & Kültür'
  | 'Spor & Sağlık';

export type LocationType = 'physical' | 'online';

export interface EventItem {
  id: string;
  title: string;
  description: string;
  location: string;
  locationType: LocationType;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  userName: string; // User Input: Düzenleyen Kişi / Kurum
  userEmail: string; // User Input: İletişim E-posta
  capacity: number; // Kontenjan
  registeredCount: number;
  category: EventCategory;
  imageUrl?: string;
  createdAt: string;
  isCustomCreated?: boolean;
}

export interface EventFormData {
  title: string;
  description: string;
  location: string;
  locationType: LocationType;
  date: string;
  time: string;
  userName: string;
  userEmail: string;
  capacity: number;
  category: EventCategory;
}
