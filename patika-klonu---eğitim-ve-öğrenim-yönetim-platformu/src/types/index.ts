export type UserRole = 'operator' | 'instructor' | 'student';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
  title: string;
  bio?: string;
  createdAt: string;
}

export interface Patika {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  level: 'Başlangıç' | 'Orta' | 'İleri';
  duration: string;
  courseIds: string[];
  createdAt: string;
}

export interface Course {
  id: string;
  patikaId: string;
  title: string;
  description: string;
  instructorId: string; // Operatör tarafından atanan eğitmen ID
  duration: string;
  order: number;
  createdAt: string;
}

export interface QuizQuestion {
  id: string;
  contentId: string;
  instructorId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  points: number;
}

export interface Content {
  id: string;
  courseId: string;
  instructorId: string; // İçeriği oluşturan / sahibi eğitmen
  title: string;
  description: string;
  youtubeUrl: string;
  order: number;
  durationMinutes: number;
  createdAt: string;
}

export interface ContentComment {
  id: string;
  contentId: string;
  userId: string;
  userName: string;
  userAvatar: string;
  userRole: UserRole;
  comment: string;
  rating: number; // 1 to 5 stars
  createdAt: string;
  likes: number;
}

export interface Enrollment {
  id: string;
  studentId: string;
  courseId: string;
  enrolledAt: string;
  completedContentIds: string[];
  quizScores: Record<
    string,
    {
      score: number;
      maxScore: number;
      passed: boolean;
      submittedAt: string;
      selectedAnswers: Record<string, number>;
    }
  >;
}
