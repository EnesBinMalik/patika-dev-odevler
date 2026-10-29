export type Category = 'Tümü' | 'Salon' | 'Yemek Odası' | 'Yatak Odası' | 'Aydınlatma' | 'Çalışma & Ofis';

export type UserRole = 'guest' | 'member' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  city?: string;
}

export interface Furniture {
  id: string;
  name: string;
  category: Exclude<Category, 'Tümü'>;
  price: number;
  image: string;
  description: string;
  dimensions: string;
  material: string;
  color: string;
  stock: number;
  featured?: boolean;
  designerNote?: string;
  createdAt: string;
}

export type ReservationStatus = 'Beklemede' | 'Onaylandı' | 'Hazırlanıyor' | 'Tamamlandı' | 'İptal Edildi';

export interface Reservation {
  id: string;
  furnitureId: string;
  furnitureName: string;
  furnitureImage: string;
  furniturePrice: number;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  date: string;
  deliveryAddress: string;
  notes?: string;
  status: ReservationStatus;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  date: string;
  isRead: boolean;
}

export type ActivePage = 'home' | 'about' | 'furnitures' | 'contact' | 'login' | 'register' | 'admin' | 'my-reservations';
