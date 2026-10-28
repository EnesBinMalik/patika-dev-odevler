import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Workout, ContactMessage, GalleryItem, PageRoute, UserRole } from '../types';
import { INITIAL_USERS, INITIAL_WORKOUTS, INITIAL_MESSAGES, INITIAL_GALLERY } from '../data/seedData';

interface AppContextType {
  currentUser: User | null;
  users: User[];
  workouts: Workout[];
  messages: ContactMessage[];
  gallery: GalleryItem[];
  activePage: PageRoute;
  setActivePage: (page: PageRoute) => void;
  selectedTrainerId: string | null;
  setSelectedTrainerId: (id: string | null) => void;
  selectedWorkoutId: string | null;
  setSelectedWorkoutId: (id: string | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  isGithubModalOpen: boolean;
  setIsGithubModalOpen: (open: boolean) => void;
  toast: { message: string; type: 'success' | 'error' | 'info' } | null;
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;

  // Auth & User
  login: (email: string, password?: string) => { success: boolean; error?: string };
  register: (data: { name: string; email: string; password?: string; role: UserRole; specialty?: string }) => { success: boolean; error?: string };
  logout: () => void;
  switchUser: (userId: string) => void;
  updateUserRole: (userId: string, newRole: UserRole) => void;
  deleteUser: (userId: string) => void;
  updateProfile: (data: Partial<User>) => void;

  // Workouts
  createWorkout: (workout: Omit<Workout, 'id' | 'createdAt' | 'enrolledMemberIds'>) => void;
  updateWorkout: (workout: Workout) => void;
  deleteWorkout: (id: string) => void;
  enrollWorkout: (workoutId: string) => { success: boolean; message: string };
  leaveWorkout: (workoutId: string) => { success: boolean; message: string };

  // Messages
  sendMessage: (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;
  replyToMessage: (id: string, note: string) => void;

  // Gallery
  addGalleryItem: (item: Omit<GalleryItem, 'id' | 'date'>) => void;
  deleteGalleryItem: (id: string) => void;

  // Reset
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('misfit_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem('misfit_current_user_id');
    if (savedId) {
      const found = users.find(u => u.id === savedId);
      if (found) return found;
    }
    return INITIAL_USERS[0]; // Default to Enes Öztürk (Admin) for immediate full preview
  });

  const [workouts, setWorkouts] = useState<Workout[]>(() => {
    const saved = localStorage.getItem('misfit_workouts');
    return saved ? JSON.parse(saved) : INITIAL_WORKOUTS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    const saved = localStorage.getItem('misfit_messages');
    return saved ? JSON.parse(saved) : INITIAL_MESSAGES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem('misfit_gallery');
    return saved ? JSON.parse(saved) : INITIAL_GALLERY;
  });

  const [activePage, setActivePage] = useState<PageRoute>('home');
  const [selectedTrainerId, setSelectedTrainerId] = useState<string | null>(null);
  const [selectedWorkoutId, setSelectedWorkoutId] = useState<string | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isGithubModalOpen, setIsGithubModalOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('misfit_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('misfit_workouts', JSON.stringify(workouts));
  }, [workouts]);

  useEffect(() => {
    localStorage.setItem('misfit_messages', JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    localStorage.setItem('misfit_gallery', JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('misfit_current_user_id', currentUser.id);
    } else {
      localStorage.removeItem('misfit_current_user_id');
    }
  }, [currentUser]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Auth implementations
  const login = (email: string, password?: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const user = users.find(u => u.email.toLowerCase() === cleanEmail);
    if (!user) {
      return { success: false, error: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.' };
    }
    if (password && user.password && user.password !== password) {
      return { success: false, error: 'Girilen şifre hatalı, lütfen tekrar deneyin.' };
    }
    setCurrentUser(user);
    showToast(`Hoş geldiniz, ${user.name}! (${user.role.toUpperCase()})`);
    return { success: true };
  };

  const register = (data: { name: string; email: string; password?: string; role: UserRole; specialty?: string }) => {
    const cleanEmail = data.email.trim().toLowerCase();
    if (!data.name.trim()) {
      return { success: false, error: 'İsim alanı boş bırakılamaz.' };
    }
    if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
      return { success: false, error: 'Bu e-posta adresi zaten kullanımda.' };
    }

    const newUser: User = {
      id: `u-${Date.now()}`,
      name: data.name.trim(),
      email: cleanEmail,
      password: data.password || '123',
      role: data.role,
      specialty: data.specialty || (data.role === 'trainer' ? 'Genel Fitness Koçu' : undefined),
      avatar: data.role === 'trainer' 
        ? '/assets/images/trainer_burak_crossfit_1793202971371.jpg'
        : `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(data.name)}`,
      joinedAt: new Date().toISOString().split('T')[0],
      enrolledWorkouts: []
    };

    setUsers(prev => [newUser, ...prev]);
    setCurrentUser(newUser);
    showToast(`Hesabınız başarıyla oluşturuldu! Hoş geldiniz, ${newUser.name}.`);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Oturum kapatıldı.', 'info');
  };

  const switchUser = (userId: string) => {
    const found = users.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      showToast(`Aktif profil değiştirildi: ${found.name} (${found.role})`, 'info');
    }
  };

  const updateUserRole = (userId: string, newRole: UserRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    if (currentUser?.id === userId) {
      setCurrentUser(prev => prev ? { ...prev, role: newRole } : null);
    }
    showToast(`Kullanıcı rolü "${newRole}" olarak güncellendi.`);
  };

  const deleteUser = (userId: string) => {
    if (currentUser?.id === userId) {
      showToast('Kendi aktif hesabınızı silemezsiniz.', 'error');
      return;
    }
    setUsers(prev => prev.filter(u => u.id !== userId));
    // Also remove from workouts
    setWorkouts(prev => prev.map(w => ({
      ...w,
      enrolledMemberIds: w.enrolledMemberIds.filter(id => id !== userId)
    })));
    showToast('Kullanıcı sistemden kaldırıldı.');
  };

  const updateProfile = (data: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updated : u));
    showToast('Profiliniz güncellendi.');
  };

  // Workouts
  const createWorkout = (data: Omit<Workout, 'id' | 'createdAt' | 'enrolledMemberIds'>) => {
    const newWorkout: Workout = {
      ...data,
      id: `w-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      enrolledMemberIds: []
    };
    setWorkouts(prev => [newWorkout, ...prev]);
    showToast(`"${newWorkout.title}" antrenmanı başarıyla eklendi!`);
  };

  const updateWorkout = (updated: Workout) => {
    setWorkouts(prev => prev.map(w => w.id === updated.id ? updated : w));
    showToast(`"${updated.title}" güncellendi.`);
  };

  const deleteWorkout = (id: string) => {
    const target = workouts.find(w => w.id === id);
    setWorkouts(prev => prev.filter(w => w.id !== id));
    // Remove from enrolled users
    setUsers(prev => prev.map(u => ({
      ...u,
      enrolledWorkouts: u.enrolledWorkouts?.filter(wId => wId !== id)
    })));
    showToast(`"${target?.title || 'Antrenman'}" silindi.`);
  };

  const enrollWorkout = (workoutId: string) => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return { success: false, message: 'Antrenmana katılmak için lütfen giriş yapın.' };
    }

    const target = workouts.find(w => w.id === workoutId);
    if (!target) return { success: false, message: 'Antrenman bulunamadı.' };

    if (target.enrolledMemberIds.includes(currentUser.id)) {
      return { success: false, message: 'Bu antrenmana zaten kayıtlısınız.' };
    }

    if (target.enrolledMemberIds.length >= target.capacity) {
      return { success: false, message: 'Üzgünüz, kontenjan tamamen dolmuştur.' };
    }

    // Update workout
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        return {
          ...w,
          enrolledMemberIds: [...w.enrolledMemberIds, currentUser.id]
        };
      }
      return w;
    }));

    // Update user
    const updatedUser: User = {
      ...currentUser,
      enrolledWorkouts: [...(currentUser.enrolledWorkouts || []), workoutId]
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    showToast(`Tebrikler! "${target.title}" antrenmanına başarıyla kaydoldunuz.`);
    return { success: true, message: 'Kayıt başarılı!' };
  };

  const leaveWorkout = (workoutId: string) => {
    if (!currentUser) return { success: false, message: 'Giriş yapılmadı.' };

    const target = workouts.find(w => w.id === workoutId);
    setWorkouts(prev => prev.map(w => {
      if (w.id === workoutId) {
        return {
          ...w,
          enrolledMemberIds: w.enrolledMemberIds.filter(id => id !== currentUser.id)
        };
      }
      return w;
    }));

    const updatedUser: User = {
      ...currentUser,
      enrolledWorkouts: (currentUser.enrolledWorkouts || []).filter(id => id !== workoutId)
    };
    setCurrentUser(updatedUser);
    setUsers(prev => prev.map(u => u.id === currentUser.id ? updatedUser : u));

    showToast(`"${target?.title || 'Antrenman'}" kaydınız iptal edildi.`, 'info');
    return { success: true, message: 'Kaydınız iptal edildi.' };
  };

  // Messages
  const sendMessage = (msg: Omit<ContactMessage, 'id' | 'createdAt' | 'isRead'>) => {
    const newMsg: ContactMessage = {
      ...msg,
      id: `msg-${Date.now()}`,
      createdAt: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      isRead: false
    };
    setMessages(prev => [newMsg, ...prev]);
    showToast('Mesajınız başarıyla iletildi. En kısa sürede dönüş yapacağız!');
  };

  const markMessageRead = (id: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, isRead: true } : m));
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    showToast('Mesaj silindi.', 'info');
  };

  const replyToMessage = (id: string, note: string) => {
    setMessages(prev => prev.map(m => m.id === id ? { ...m, replyNote: note, isRead: true } : m));
    showToast('Cevap / not kaydedildi.');
  };

  // Gallery
  const addGalleryItem = (item: Omit<GalleryItem, 'id' | 'date'>) => {
    const newItem: GalleryItem = {
      ...item,
      id: `gal-${Date.now()}`,
      date: new Date().toISOString().split('T')[0]
    };
    setGallery(prev => [newItem, ...prev]);
    showToast('Galeriye yeni fotoğraf eklendi.');
  };

  const deleteGalleryItem = (id: string) => {
    setGallery(prev => prev.filter(g => g.id !== id));
    showToast('Galeri öğesi silindi.', 'info');
  };

  const resetAllData = () => {
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setWorkouts(INITIAL_WORKOUTS);
    setMessages(INITIAL_MESSAGES);
    setGallery(INITIAL_GALLERY);
    localStorage.clear();
    showToast('Sistem fabrika verilerine sıfırlandı.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        workouts,
        messages,
        gallery,
        activePage,
        setActivePage,
        selectedTrainerId,
        setSelectedTrainerId,
        selectedWorkoutId,
        setSelectedWorkoutId,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authModalMode,
        setAuthModalMode,
        isGithubModalOpen,
        setIsGithubModalOpen,
        toast,
        showToast,
        login,
        register,
        logout,
        switchUser,
        updateUserRole,
        deleteUser,
        updateProfile,
        createWorkout,
        updateWorkout,
        deleteWorkout,
        enrollWorkout,
        leaveWorkout,
        sendMessage,
        markMessageRead,
        deleteMessage,
        replyToMessage,
        addGalleryItem,
        deleteGalleryItem,
        resetAllData
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
