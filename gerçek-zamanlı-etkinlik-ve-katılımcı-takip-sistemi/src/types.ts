export interface Participant {
  id: string;
  name: string;
  email: string;
  role: 'Katılımcı' | 'Konuşmacı' | 'Mentor' | 'Geliştirici' | 'Öğrenci' | 'Organizatör';
  avatar: string;
  joinedAt: string;
  company?: string;
  note?: string;
}

export interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: 'Yazılım & Teknoloji' | 'Yapay Zeka' | 'Tasarım & UI/UX' | 'Girişimcilik' | 'Açık Kaynak' | 'Kariyer';
  image: string;
  capacity: number;
  participantsCount: number;
  participants: Participant[];
  status: 'active' | 'upcoming' | 'completed';
  organizer: string;
  createdAt: string;
  tags: string[];
}

export type SocketEventType =
  | 'INIT'
  | 'EVENT_ADDED'
  | 'EVENT_DELETED'
  | 'PARTICIPANT_ADDED'
  | 'CLIENTS_COUNT'
  | 'PING'
  | 'PONG';

export interface SocketMessage<T = unknown> {
  type: SocketEventType;
  payload: T;
  timestamp: number;
}
