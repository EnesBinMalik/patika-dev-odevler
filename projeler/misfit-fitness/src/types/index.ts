export type UserRole = 'admin' | 'trainer' | 'member';

export type WorkoutLevel = 'Başlangıç' | 'Orta Seviye' | 'İleri Seviye';

export type WorkoutCategory = 
  | 'CrossFit' 
  | 'Pilates & Mobilite' 
  | 'Boks & HIIT' 
  | 'Kondisyon & Güç' 
  | 'Vücut Geliştirme' 
  | 'Yoga & Esneklik';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: UserRole;
  avatar: string;
  bio?: string;
  specialty?: string;
  phone?: string;
  joinedAt: string;
  enrolledWorkouts?: string[]; // IDs of workouts this user has enrolled in
}

export interface Workout {
  id: string;
  title: string;
  description: string;
  category: WorkoutCategory | string;
  trainerId: string;
  trainerName: string;
  trainerAvatar: string;
  durationMinutes: number;
  level: WorkoutLevel;
  schedule: string;
  capacity: number;
  enrolledMemberIds: string[];
  image: string;
  location?: string;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  replyNote?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Tesis' | 'Grup Seansları' | 'Boks & Ring' | 'Ağırlık & Güç' | 'Pilates & Stüdyo';
  imageUrl: string;
  date: string;
  caption: string;
}

export type PageRoute = 'home' | 'about' | 'trainers' | 'workouts' | 'gallery' | 'contact' | 'dashboard';
