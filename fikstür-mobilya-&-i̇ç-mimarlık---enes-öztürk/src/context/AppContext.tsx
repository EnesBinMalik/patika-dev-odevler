import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Furniture, User, UserRole, Reservation, ReservationStatus, ContactMessage, Category, ActivePage } from '../types';
import { INITIAL_USERS, INITIAL_FURNITURES, INITIAL_RESERVATIONS, INITIAL_MESSAGES } from '../data/initialData';

interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface AppContextType {
  currentUser: User | null;
  users: (User & { passwordHash: string })[];
  furnitures: Furniture[];
  reservations: Reservation[];
  messages: ContactMessage[];
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  selectedFurniture: Furniture | null;
  setSelectedFurniture: (furniture: Furniture | null) => void;
  reservingFurniture: Furniture | null;
  setReservingFurniture: (furniture: Furniture | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: Category;
  setSelectedCategory: (cat: Category) => void;
  notifications: ToastNotification[];
  showNotification: (message: string, type?: 'success' | 'info' | 'error') => void;
  dismissNotification: (id: string) => void;

  // Auth
  login: (email: string, pass: string) => { success: boolean; message: string };
  register: (name: string, email: string, pass: string, phone?: string, city?: string, role?: UserRole) => { success: boolean; message: string };
  logout: () => void;
  quickSwitchRole: (role: UserRole) => void;

  // Furniture CRUD (Admin)
  addFurniture: (item: Omit<Furniture, 'id' | 'createdAt'>) => void;
  updateFurniture: (id: string, item: Partial<Furniture>) => void;
  deleteFurniture: (id: string) => void;

  // Reservation Actions (Member + Admin)
  createReservation: (furnitureId: string, address: string, date: string, notes?: string) => { success: boolean; message: string };
  updateReservationStatus: (id: string, status: ReservationStatus) => void;
  cancelReservation: (id: string) => void;

  // Messages (Contact + Admin)
  sendMessage: (name: string, email: string, phone: string, subject: string, message: string) => void;
  markMessageRead: (id: string) => void;
  deleteMessage: (id: string) => void;

  // Reset
  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Load initial from localStorage or defaults
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem('fikstur_current_user');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    // Default to a friendly guest or member
    return null;
  });

  const [users, setUsers] = useState<(User & { passwordHash: string })[]>(() => {
    try {
      const stored = localStorage.getItem('fikstur_users');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_USERS;
  });

  const [furnitures, setFurnitures] = useState<Furniture[]>(() => {
    try {
      const stored = localStorage.getItem('fikstur_furnitures');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_FURNITURES;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    try {
      const stored = localStorage.getItem('fikstur_reservations');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_RESERVATIONS;
  });

  const [messages, setMessages] = useState<ContactMessage[]>(() => {
    try {
      const stored = localStorage.getItem('fikstur_messages');
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_MESSAGES;
  });

  const [activePage, setActivePage] = useState<ActivePage>('home');
  const [selectedFurniture, setSelectedFurniture] = useState<Furniture | null>(null);
  const [reservingFurniture, setReservingFurniture] = useState<Furniture | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('Tümü');
  const [notifications, setNotifications] = useState<ToastNotification[]>([]);

  // Persist state updates
  useEffect(() => {
    localStorage.setItem('fikstur_current_user', JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('fikstur_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('fikstur_furnitures', JSON.stringify(furnitures));
  }, [furnitures]);

  useEffect(() => {
    localStorage.setItem('fikstur_reservations', JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    localStorage.setItem('fikstur_messages', JSON.stringify(messages));
  }, [messages]);

  const showNotification = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = 'notif-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4);
    setNotifications(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      dismissNotification(id);
    }, 4500);
  };

  const dismissNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const login = (email: string, pass: string): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    const found = users.find(u => u.email.toLowerCase() === trimmedEmail);
    if (!found) {
      return { success: false, message: 'Bu e-posta adresiyle kayıtlı kullanıcı bulunamadı.' };
    }
    if (found.passwordHash !== pass) {
      return { success: false, message: 'Girdiğiniz şifre hatalı. Lütfen tekrar deneyin.' };
    }

    const sessionUser: User = {
      id: found.id,
      name: found.name,
      email: found.email,
      role: found.role,
      phone: found.phone,
      city: found.city
    };

    setCurrentUser(sessionUser);
    showNotification(`Hoş geldiniz, ${sessionUser.name}! (${sessionUser.role === 'admin' ? 'Yönetici' : 'Üye'})`);
    return { success: true, message: 'Giriş başarılı.' };
  };

  const register = (
    name: string,
    email: string,
    pass: string,
    phone?: string,
    city?: string,
    role: UserRole = 'member'
  ): { success: boolean; message: string } => {
    const trimmedEmail = email.trim().toLowerCase();
    if (users.some(u => u.email.toLowerCase() === trimmedEmail)) {
      return { success: false, message: 'Bu e-posta adresi zaten kullanımda.' };
    }
    if (pass.length < 6) {
      return { success: false, message: 'Şifre en az 6 karakter olmalıdır.' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: trimmedEmail,
      phone: phone?.trim() || '+90 (555) 000 00 00',
      city: city?.trim() || 'İstanbul',
      role,
      passwordHash: pass
    };

    setUsers(prev => [...prev, newUser]);
    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      city: newUser.city
    };
    setCurrentUser(sessionUser);
    showNotification(`Hesabınız başarıyla oluşturuldu! Hoş geldiniz, ${sessionUser.name}.`);
    return { success: true, message: 'Kayıt başarılı.' };
  };

  const logout = () => {
    const name = currentUser?.name;
    setCurrentUser(null);
    showNotification(name ? `Görüşmek üzere ${name}, oturum kapatıldı.` : 'Çıkış yapıldı.', 'info');
    if (activePage === 'admin' || activePage === 'my-reservations') {
      setActivePage('home');
    }
  };

  const quickSwitchRole = (targetRole: UserRole) => {
    if (targetRole === 'guest') {
      setCurrentUser(null);
      showNotification('Misafir (ziyaretçi) moduna geçildi.');
      if (activePage === 'admin' || activePage === 'my-reservations') {
        setActivePage('furnitures');
      }
      return;
    }

    const candidate = users.find(u => u.role === targetRole);
    if (candidate) {
      const sessionUser: User = {
        id: candidate.id,
        name: candidate.name,
        email: candidate.email,
        role: candidate.role,
        phone: candidate.phone,
        city: candidate.city
      };
      setCurrentUser(sessionUser);
      showNotification(`${sessionUser.name} (${targetRole === 'admin' ? 'Yönetici' : 'Üye'}) hesabına geçildi.`);
    }
  };

  // Furniture CRUD
  const addFurniture = (item: Omit<Furniture, 'id' | 'createdAt'>) => {
    const newFurniture: Furniture = {
      ...item,
      id: 'f-' + Date.now(),
      createdAt: new Date().toISOString().split('T')[0]
    };
    setFurnitures(prev => [newFurniture, ...prev]);
    showNotification(`"${newFurniture.name}" mobilyası kataloğa eklendi.`);
  };

  const updateFurniture = (id: string, updates: Partial<Furniture>) => {
    setFurnitures(prev =>
      prev.map(f => (f.id === id ? { ...f, ...updates } : f))
    );
    showNotification('Mobilya bilgileri başarıyla güncellendi.');
  };

  const deleteFurniture = (id: string) => {
    const target = furnitures.find(f => f.id === id);
    setFurnitures(prev => prev.filter(f => f.id !== id));
    showNotification(`"${target?.name || 'Mobilya'}" katalogdan silindi.`, 'info');
  };

  // Reservations
  const createReservation = (furnitureId: string, address: string, date: string, notes?: string) => {
    if (!currentUser) {
      return { success: false, message: 'Rezervasyon yapabilmek için lütfen giriş yapın veya üye olun.' };
    }

    const furniture = furnitures.find(f => f.id === furnitureId);
    if (!furniture) {
      return { success: false, message: 'Seçilen mobilya bulunamadı.' };
    }

    if (furniture.stock <= 0) {
      return { success: false, message: 'Bu ürünün şu an için stok mevcudu bulunmamaktadır.' };
    }

    const newRes: Reservation = {
      id: 'res-' + Date.now(),
      furnitureId: furniture.id,
      furnitureName: furniture.name,
      furnitureImage: furniture.image,
      furniturePrice: furniture.price,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userPhone: currentUser.phone || 'Belirtilmedi',
      date,
      deliveryAddress: address,
      notes,
      status: 'Beklemede',
      createdAt: new Date().toISOString().split('T')[0]
    };

    setReservations(prev => [newRes, ...prev]);

    // Decrease stock by 1
    setFurnitures(prev =>
      prev.map(f => (f.id === furnitureId ? { ...f, stock: Math.max(0, f.stock - 1) } : f))
    );

    showNotification(`"${furniture.name}" için rezervasyon talebiniz alındı!`, 'success');
    return { success: true, message: 'Rezervasyon başarıyla oluşturuldu.' };
  };

  const updateReservationStatus = (id: string, status: ReservationStatus) => {
    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status } : r))
    );
    showNotification(`Rezervasyon durumu "${status}" olarak güncellendi.`);
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;

    setReservations(prev =>
      prev.map(r => (r.id === id ? { ...r, status: 'İptal Edildi' as ReservationStatus } : r))
    );

    // restore stock
    setFurnitures(prev =>
      prev.map(f => (f.id === res.furnitureId ? { ...f, stock: f.stock + 1 } : f))
    );

    showNotification(`"${res.furnitureName}" rezervasyonu iptal edildi.`, 'info');
  };

  // Messages
  const sendMessage = (name: string, email: string, phone: string, subject: string, message: string) => {
    const newMsg: ContactMessage = {
      id: 'msg-' + Date.now(),
      name,
      email,
      phone,
      subject,
      message,
      date: new Date().toLocaleString('tr-TR', { dateStyle: 'short', timeStyle: 'short' }),
      isRead: false
    };
    setMessages(prev => [newMsg, ...prev]);
    showNotification('Mesajınız Enes Öztürk ve Fikstür ekibine iletildi. En kısa sürede dönüş yapacağız!');
  };

  const markMessageRead = (id: string) => {
    setMessages(prev =>
      prev.map(m => (m.id === id ? { ...m, isRead: true } : m))
    );
  };

  const deleteMessage = (id: string) => {
    setMessages(prev => prev.filter(m => m.id !== id));
    showNotification('Mesaj silindi.', 'info');
  };

  const resetToDefaults = () => {
    localStorage.removeItem('fikstur_current_user');
    localStorage.removeItem('fikstur_users');
    localStorage.removeItem('fikstur_furnitures');
    localStorage.removeItem('fikstur_reservations');
    localStorage.removeItem('fikstur_messages');
    setCurrentUser(null);
    setUsers(INITIAL_USERS);
    setFurnitures(INITIAL_FURNITURES);
    setReservations(INITIAL_RESERVATIONS);
    setMessages(INITIAL_MESSAGES);
    showNotification('Tüm veriler varsayılan SmartEdu başlangıç durumuna sıfırlandı.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        furnitures,
        reservations,
        messages,
        activePage,
        setActivePage,
        selectedFurniture,
        setSelectedFurniture,
        reservingFurniture,
        setReservingFurniture,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        notifications,
        showNotification,
        dismissNotification,
        login,
        register,
        logout,
        quickSwitchRole,
        addFurniture,
        updateFurniture,
        deleteFurniture,
        createReservation,
        updateReservationStatus,
        cancelReservation,
        sendMessage,
        markMessageRead,
        deleteMessage,
        resetToDefaults
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
