import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Patika,
  Course,
  Content,
  QuizQuestion,
  ContentComment,
  Enrollment,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_PATIKALAR,
  INITIAL_COURSES,
  INITIAL_CONTENTS,
  INITIAL_QUIZ_QUESTIONS,
  INITIAL_COMMENTS,
  INITIAL_ENROLLMENTS,
} from '../data/initialData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  patikalar: Patika[];
  courses: Course[];
  contents: Content[];
  quizQuestions: QuizQuestion[];
  comments: ContentComment[];
  enrollments: Enrollment[];

  // Auth
  setCurrentUser: (user: User | null) => void;
  loginAsUser: (userId: string) => void;
  loginWithEmail: (email: string) => boolean;
  logout: () => void;
  registerStudent: (name: string, email: string) => { success: boolean; message: string };

  // Operator Actions
  addInstructor: (instructorData: { name: string; email: string; title: string; bio: string }) => { success: boolean; message: string };
  addPatika: (data: Omit<Patika, 'id' | 'createdAt'>) => void;
  updatePatika: (id: string, data: Partial<Patika>) => void;
  deletePatika: (id: string) => void;
  addCourse: (data: Omit<Course, 'id' | 'createdAt'>) => void;
  updateCourse: (id: string, data: Partial<Course>) => void;
  deleteCourse: (id: string) => void;

  // Instructor / Operator Content Actions
  addContent: (data: Omit<Content, 'id' | 'createdAt' | 'instructorId'>) => { success: boolean; message: string };
  updateContent: (id: string, data: Partial<Content>) => { success: boolean; message: string };
  deleteContent: (id: string) => { success: boolean; message: string };

  // Quiz Question Actions
  addQuizQuestion: (data: Omit<QuizQuestion, 'id' | 'instructorId'>) => { success: boolean; message: string };
  updateQuizQuestion: (id: string, data: Partial<QuizQuestion>) => { success: boolean; message: string };
  deleteQuizQuestion: (id: string) => { success: boolean; message: string };

  // Student Actions
  enrollInCourse: (courseId: string) => void;
  markContentCompleted: (courseId: string, contentId: string) => void;
  submitQuizResult: (
    courseId: string,
    contentId: string,
    answers: Record<string, number>
  ) => { score: number; maxScore: number; passed: boolean };
  addComment: (contentId: string, commentText: string, rating: number) => void;
  likeComment: (commentId: string) => void;

  // Helpers
  getCourseContents: (courseId: string) => Content[];
  getContentQuizzes: (contentId: string) => QuizQuestion[];
  getContentComments: (contentId: string) => ContentComment[];
  getContentAverageRating: (contentId: string) => { average: number; count: number };
  isStudentEnrolled: (courseId: string) => boolean;
  getStudentEnrollment: (courseId: string) => Enrollment | undefined;
  getCourseProgress: (courseId: string) => number;
  resetAllData: () => void;
}

const STORAGE_KEYS = {
  CURRENT_USER: 'patika_current_user_v2',
  USERS: 'patika_users_v2',
  PATIKALAR: 'patika_patikalar_v2',
  COURSES: 'patika_courses_v2',
  CONTENTS: 'patika_contents_v2',
  QUIZZES: 'patika_quizzes_v2',
  COMMENTS: 'patika_comments_v2',
  ENROLLMENTS: 'patika_enrollments_v2',
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage or fallback to initial seeded data
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      if (saved) return JSON.parse(saved);
      // Default to the developer operator Enes Öztürk for first load demo
      return INITIAL_USERS[0];
    } catch {
      return INITIAL_USERS[0];
    }
  });

  const [patikalar, setPatikalar] = useState<Patika[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PATIKALAR);
      return saved ? JSON.parse(saved) : INITIAL_PATIKALAR;
    } catch {
      return INITIAL_PATIKALAR;
    }
  });

  const [courses, setCourses] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COURSES);
      return saved ? JSON.parse(saved) : INITIAL_COURSES;
    } catch {
      return INITIAL_COURSES;
    }
  });

  const [contents, setContents] = useState<Content[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CONTENTS);
      return saved ? JSON.parse(saved) : INITIAL_CONTENTS;
    } catch {
      return INITIAL_CONTENTS;
    }
  });

  const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.QUIZZES);
      return saved ? JSON.parse(saved) : INITIAL_QUIZ_QUESTIONS;
    } catch {
      return INITIAL_QUIZ_QUESTIONS;
    }
  });

  const [comments, setComments] = useState<ContentComment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.COMMENTS);
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  const [enrollments, setEnrollments] = useState<Enrollment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ENROLLMENTS);
      return saved ? JSON.parse(saved) : INITIAL_ENROLLMENTS;
    } catch {
      return INITIAL_ENROLLMENTS;
    }
  });

  // Sync state changes to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PATIKALAR, JSON.stringify(patikalar));
  }, [patikalar]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COURSES, JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CONTENTS, JSON.stringify(contents));
  }, [contents]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.QUIZZES, JSON.stringify(quizQuestions));
  }, [quizQuestions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMMENTS, JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ENROLLMENTS, JSON.stringify(enrollments));
  }, [enrollments]);

  // Auth Functions
  const loginAsUser = (userId: string) => {
    const found = users.find((u) => u.id === userId);
    if (found) {
      setCurrentUser(found);
    }
  };

  const loginWithEmail = (email: string): boolean => {
    const trimmed = email.trim().toLowerCase();
    const found = users.find((u) => u.email.toLowerCase() === trimmed);
    if (found) {
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Student self-registration (ONLY students can register)
  const registerStudent = (name: string, email: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!name.trim()) {
      return { success: false, message: 'Lütfen adınızı ve soyadınızı giriniz.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, message: 'Geçerli bir e-posta adresi giriniz.' };
    }
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Bu e-posta adresi ile kayıtlı bir kullanıcı zaten mevcut.' };
    }

    const newStudent: User = {
      id: `user_stud_${Date.now()}`,
      name: name.trim(),
      email: trimmedEmail,
      role: 'student', // strictly student
      avatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80`,
      title: 'Öğrenci',
      bio: 'Patika.dev platformu öğrencisi.',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newStudent]);
    setCurrentUser(newStudent);
    return { success: true, message: 'Kayıt başarıyla tamamlandı! Hoş geldiniz.' };
  };

  // Instructor creation (ONLY Operators can create instructors)
  const addInstructor = (data: {
    name: string;
    email: string;
    title: string;
    bio: string;
  }): { success: boolean; message: string } => {
    if (currentUser?.role !== 'operator') {
      return { success: false, message: 'Yalnızca operatörler yeni eğitmen ekleyebilir.' };
    }

    const trimmedEmail = data.email.trim().toLowerCase();
    if (!data.name.trim() || !trimmedEmail) {
      return { success: false, message: 'Eğitmen adı ve e-posta adresi zorunludur.' };
    }
    if (users.some((u) => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Bu e-posta adresi zaten kullanımda.' };
    }

    const newInstructor: User = {
      id: `user_inst_${Date.now()}`,
      name: data.name.trim(),
      email: trimmedEmail,
      role: 'instructor',
      avatar: `https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80`,
      title: data.title.trim() || 'Eğitmen',
      bio: data.bio.trim() || 'Patika.dev platformu eğitmeni.',
      createdAt: new Date().toISOString(),
    };

    setUsers((prev) => [...prev, newInstructor]);
    return { success: true, message: `${data.name} adlı eğitmen başarıyla sisteme eklendi.` };
  };

  // Operator: Patika CRUD
  const addPatika = (data: Omit<Patika, 'id' | 'createdAt'>) => {
    const newPatika: Patika = {
      ...data,
      id: `patika_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setPatikalar((prev) => [...prev, newPatika]);
  };

  const updatePatika = (id: string, data: Partial<Patika>) => {
    setPatikalar((prev) => prev.map((p) => (p.id === id ? { ...p, ...data } : p)));
  };

  const deletePatika = (id: string) => {
    setPatikalar((prev) => prev.filter((p) => p.id !== id));
  };

  // Operator: Course CRUD (and assigning instructor)
  const addCourse = (data: Omit<Course, 'id' | 'createdAt'>) => {
    const newCourse: Course = {
      ...data,
      id: `course_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    setCourses((prev) => [...prev, newCourse]);

    // Also link to patika courseIds list
    setPatikalar((prev) =>
      prev.map((patika) => {
        if (patika.id === data.patikaId && !patika.courseIds.includes(newCourse.id)) {
          return { ...patika, courseIds: [...patika.courseIds, newCourse.id] };
        }
        return patika;
      })
    );
  };

  const updateCourse = (id: string, data: Partial<Course>) => {
    setCourses((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
  };

  const deleteCourse = (id: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== id));
    // also remove from patikalar
    setPatikalar((prev) =>
      prev.map((p) => ({
        ...p,
        courseIds: p.courseIds.filter((cid) => cid !== id),
      }))
    );
    // remove contents under this course
    setContents((prev) => prev.filter((cnt) => cnt.courseId !== id));
  };

  // Content Actions (Instructors manage their own content; Operator can manage any)
  const addContent = (
    data: Omit<Content, 'id' | 'createdAt' | 'instructorId'>
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };

    const targetCourse = courses.find((c) => c.id === data.courseId);
    if (!targetCourse) return { success: false, message: 'Belirtilen ders bulunamadı.' };

    if (currentUser.role === 'instructor' && targetCourse.instructorId !== currentUser.id) {
      return {
        success: false,
        message: 'Bu derse içerik ekleme yetkiniz bulunmuyor. Yalnızca size atanan derslere içerik ekleyebilirsiniz.',
      };
    }

    const newContent: Content = {
      ...data,
      id: `content_${Date.now()}`,
      instructorId: currentUser.role === 'instructor' ? currentUser.id : targetCourse.instructorId,
      createdAt: new Date().toISOString(),
    };

    setContents((prev) => [...prev, newContent]);
    return { success: true, message: 'İçerik başarıyla eklendi.' };
  };

  const updateContent = (
    id: string,
    data: Partial<Content>
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const content = contents.find((c) => c.id === id);
    if (!content) return { success: false, message: 'İçerik bulunamadı.' };

    if (currentUser.role === 'instructor' && content.instructorId !== currentUser.id) {
      return { success: false, message: 'Bu içeriği düzenleme yetkiniz bulunmamaktadır.' };
    }

    setContents((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    return { success: true, message: 'İçerik güncellendi.' };
  };

  const deleteContent = (id: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const content = contents.find((c) => c.id === id);
    if (!content) return { success: false, message: 'İçerik bulunamadı.' };

    if (currentUser.role === 'instructor' && content.instructorId !== currentUser.id) {
      return { success: false, message: 'Bu içeriği silme yetkiniz bulunmamaktadır.' };
    }

    setContents((prev) => prev.filter((c) => c.id !== id));
    // also clean up quiz questions linked to this content
    setQuizQuestions((prev) => prev.filter((q) => q.contentId !== id));
    return { success: true, message: 'İçerik ve bağlı quiz soruları silindi.' };
  };

  // Quiz Question Actions (Instructors add quiz to their own content; Operator can manage any)
  const addQuizQuestion = (
    data: Omit<QuizQuestion, 'id' | 'instructorId'>
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const content = contents.find((c) => c.id === data.contentId);
    if (!content) return { success: false, message: 'Quiz sorusunun ekleneceği içerik bulunamadı.' };

    if (currentUser.role === 'instructor' && content.instructorId !== currentUser.id) {
      return {
        success: false,
        message: 'Bu içeriğe quiz sorusu ekleme yetkiniz yok. Yalnızca kendi içeriklerinize soru ekleyebilirsiniz.',
      };
    }

    const newQuestion: QuizQuestion = {
      ...data,
      id: `quiz_q_${Date.now()}`,
      instructorId: currentUser.id,
    };

    setQuizQuestions((prev) => [...prev, newQuestion]);
    return { success: true, message: 'Quiz sorusu başarıyla eklendi.' };
  };

  const updateQuizQuestion = (
    id: string,
    data: Partial<QuizQuestion>
  ): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const question = quizQuestions.find((q) => q.id === id);
    if (!question) return { success: false, message: 'Quiz sorusu bulunamadı.' };

    if (currentUser.role === 'instructor' && question.instructorId !== currentUser.id) {
      return { success: false, message: 'Bu soruyu düzenleme yetkiniz yok.' };
    }

    setQuizQuestions((prev) => prev.map((q) => (q.id === id ? { ...q, ...data } : q)));
    return { success: true, message: 'Quiz sorusu güncellendi.' };
  };

  const deleteQuizQuestion = (id: string): { success: boolean; message: string } => {
    if (!currentUser) return { success: false, message: 'Oturum açmanız gerekiyor.' };
    const question = quizQuestions.find((q) => q.id === id);
    if (!question) return { success: false, message: 'Quiz sorusu bulunamadı.' };

    if (currentUser.role === 'instructor' && question.instructorId !== currentUser.id) {
      return { success: false, message: 'Bu soruyu silme yetkiniz yok.' };
    }

    setQuizQuestions((prev) => prev.filter((q) => q.id !== id));
    return { success: true, message: 'Quiz sorusu silindi.' };
  };

  // Student Actions
  const enrollInCourse = (courseId: string) => {
    if (!currentUser) return;
    const existing = enrollments.find(
      (e) => e.studentId === currentUser.id && e.courseId === courseId
    );
    if (existing) return;

    const newEnrollment: Enrollment = {
      id: `enrollment_${Date.now()}`,
      studentId: currentUser.id,
      courseId,
      enrolledAt: new Date().toISOString(),
      completedContentIds: [],
      quizScores: {},
    };

    setEnrollments((prev) => [...prev, newEnrollment]);
  };

  const markContentCompleted = (courseId: string, contentId: string) => {
    if (!currentUser) return;
    setEnrollments((prev) =>
      prev.map((enrollment) => {
        if (enrollment.studentId === currentUser.id && enrollment.courseId === courseId) {
          const isDone = enrollment.completedContentIds.includes(contentId);
          const nextCompleted = isDone
            ? enrollment.completedContentIds.filter((cid) => cid !== contentId)
            : [...enrollment.completedContentIds, contentId];
          return {
            ...enrollment,
            completedContentIds: nextCompleted,
          };
        }
        return enrollment;
      })
    );
  };

  const submitQuizResult = (
    courseId: string,
    contentId: string,
    answers: Record<string, number>
  ) => {
    const questions = quizQuestions.filter((q) => q.contentId === contentId);
    let totalScore = 0;
    let maxScore = 0;

    questions.forEach((q) => {
      maxScore += q.points || 25;
      if (answers[q.id] === q.correctOptionIndex) {
        totalScore += q.points || 25;
      }
    });

    const passed = maxScore > 0 ? totalScore / maxScore >= 0.6 : true;

    if (currentUser) {
      setEnrollments((prev) =>
        prev.map((enrollment) => {
          if (enrollment.studentId === currentUser.id && enrollment.courseId === courseId) {
            const nextCompleted = !enrollment.completedContentIds.includes(contentId) && passed
              ? [...enrollment.completedContentIds, contentId]
              : enrollment.completedContentIds;

            return {
              ...enrollment,
              completedContentIds: nextCompleted,
              quizScores: {
                ...enrollment.quizScores,
                [contentId]: {
                  score: totalScore,
                  maxScore,
                  passed,
                  submittedAt: new Date().toISOString(),
                  selectedAnswers: answers,
                },
              },
            };
          }
          return enrollment;
        })
      );
    }

    return { score: totalScore, maxScore, passed };
  };

  const addComment = (contentId: string, commentText: string, rating: number) => {
    if (!currentUser || !commentText.trim()) return;

    const newComment: ContentComment = {
      id: `comment_${Date.now()}`,
      contentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar,
      userRole: currentUser.role,
      comment: commentText.trim(),
      rating: Math.max(1, Math.min(5, rating)),
      createdAt: new Date().toISOString(),
      likes: 0,
    };

    setComments((prev) => [newComment, ...prev]);
  };

  const likeComment = (commentId: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, likes: c.likes + 1 } : c))
    );
  };

  // Helper getters
  const getCourseContents = (courseId: string) => {
    return contents
      .filter((c) => c.courseId === courseId)
      .sort((a, b) => a.order - b.order);
  };

  const getContentQuizzes = (contentId: string) => {
    return quizQuestions.filter((q) => q.contentId === contentId);
  };

  const getContentComments = (contentId: string) => {
    return comments
      .filter((c) => c.contentId === contentId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  };

  const getContentAverageRating = (contentId: string) => {
    const list = comments.filter((c) => c.contentId === contentId);
    if (list.length === 0) return { average: 5, count: 0 };
    const sum = list.reduce((acc, curr) => acc + curr.rating, 0);
    return { average: parseFloat((sum / list.length).toFixed(1)), count: list.length };
  };

  const isStudentEnrolled = (courseId: string) => {
    if (!currentUser) return false;
    return enrollments.some(
      (e) => e.studentId === currentUser.id && e.courseId === courseId
    );
  };

  const getStudentEnrollment = (courseId: string) => {
    if (!currentUser) return undefined;
    return enrollments.find(
      (e) => e.studentId === currentUser.id && e.courseId === courseId
    );
  };

  const getCourseProgress = (courseId: string) => {
    if (!currentUser) return 0;
    const enrollment = getStudentEnrollment(courseId);
    if (!enrollment) return 0;
    const courseContents = getCourseContents(courseId);
    if (courseContents.length === 0) return 0;
    const completedCount = enrollment.completedContentIds.length;
    return Math.min(100, Math.round((completedCount / courseContents.length) * 100));
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setPatikalar(INITIAL_PATIKALAR);
    setCourses(INITIAL_COURSES);
    setContents(INITIAL_CONTENTS);
    setQuizQuestions(INITIAL_QUIZ_QUESTIONS);
    setComments(INITIAL_COMMENTS);
    setEnrollments(INITIAL_ENROLLMENTS);
    Object.values(STORAGE_KEYS).forEach((k) => localStorage.removeItem(k));
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        patikalar,
        courses,
        contents,
        quizQuestions,
        comments,
        enrollments,
        setCurrentUser,
        loginAsUser,
        loginWithEmail,
        logout,
        registerStudent,
        addInstructor,
        addPatika,
        updatePatika,
        deletePatika,
        addCourse,
        updateCourse,
        deleteCourse,
        addContent,
        updateContent,
        deleteContent,
        addQuizQuestion,
        updateQuizQuestion,
        deleteQuizQuestion,
        enrollInCourse,
        markContentCompleted,
        submitQuizResult,
        addComment,
        likeComment,
        getCourseContents,
        getContentQuizzes,
        getContentComments,
        getContentAverageRating,
        isStudentEnrolled,
        getStudentEnrollment,
        getCourseProgress,
        resetAllData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
