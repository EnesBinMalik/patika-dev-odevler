/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Veritabanı ve Durum Yönetimi
 * Geliştirici: Enes Öztürk
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Otel,
  Season,
  Room,
  Reservation,
  SearchFilterParams,
  RoomSearchResult,
} from '../types/database';
import {
  SEED_USERS,
  SEED_HOTELS,
  SEED_SEASONS,
  SEED_ROOMS,
  SEED_RESERVATIONS,
} from '../data/seedData';

interface DatabaseContextType {
  // Auth
  users: User[];
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (username: string, password: string) => { success: boolean; message?: string };
  logout: () => void;
  addUser: (data: Omit<User, 'id' | 'created_at'>) => User;
  updateUser: (id: string, data: Partial<User>) => void;
  deleteUser: (id: string) => { success: boolean; message?: string };

  // Hotels
  hotels: Otel[];
  addHotel: (data: Omit<Otel, 'id' | 'created_at'>) => Otel;
  updateHotel: (id: string, data: Partial<Otel>) => void;
  deleteHotel: (id: string) => { success: boolean; message?: string };

  // Seasons
  seasons: Season[];
  addSeason: (data: Omit<Season, 'id' | 'created_at'>) => Season;
  updateSeason: (id: string, data: Partial<Season>) => void;
  deleteSeason: (id: string) => { success: boolean; message?: string };
  getSeasonsByHotel: (hotelId: string) => Season[];

  // Rooms
  rooms: Room[];
  addRoom: (data: Omit<Room, 'id' | 'created_at'>) => Room;
  updateRoom: (id: string, data: Partial<Room>) => void;
  deleteRoom: (id: string) => { success: boolean; message?: string };
  getRoomsByHotel: (hotelId: string) => Room[];

  // Reservations
  reservations: Reservation[];
  createReservation: (
    data: Omit<Reservation, 'id' | 'created_at' | 'status'>
  ) => { success: boolean; reservation?: Reservation; error?: string };
  updateReservation: (id: string, data: Partial<Reservation>) => void;
  cancelReservation: (id: string) => { success: boolean; error?: string };
  deleteReservation: (id: string) => { success: boolean; error?: string };

  // Dynamic Search Engine
  searchRooms: (params: SearchFilterParams) => RoomSearchResult[];

  // Database Utilities & SQL Console
  resetDatabase: () => void;
  exportDatabaseJson: () => string;
  executeSql: (query: string) => { columns: string[]; rows: any[]; error?: string; message?: string };
}

const STORAGE_KEY = 'patika_turizm_db_v2';

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

// Helper for Turkish case-insensitive comparison
function turkishNormalize(text: string): string {
  return text
    .toLocaleLowerCase('tr-TR')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
}

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load state from localStorage or seed
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_users`);
    return saved ? JSON.parse(saved) : SEED_USERS;
  });

  const [hotels, setHotels] = useState<Otel[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_hotels`);
    return saved ? JSON.parse(saved) : SEED_HOTELS;
  });

  const [seasons, setSeasons] = useState<Season[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_seasons`);
    return saved ? JSON.parse(saved) : SEED_SEASONS;
  });

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_rooms`);
    return saved ? JSON.parse(saved) : SEED_ROOMS;
  });

  const [reservations, setReservations] = useState<Reservation[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_KEY}_reservations`);
    return saved ? JSON.parse(saved) : SEED_RESERVATIONS;
  });

  // Current active user (defaults to initial admin Enes Öztürk)
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedId = localStorage.getItem(`${STORAGE_KEY}_current_user_id`);
    if (savedId) {
      const found = users.find((u) => u.id === savedId);
      if (found) return found;
    }
    return users[0] || null;
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_users`, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_hotels`, JSON.stringify(hotels));
  }, [hotels]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_seasons`, JSON.stringify(seasons));
  }, [seasons]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_rooms`, JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_reservations`, JSON.stringify(reservations));
  }, [reservations]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`${STORAGE_KEY}_current_user_id`, currentUser.id);
    } else {
      localStorage.removeItem(`${STORAGE_KEY}_current_user_id`);
    }
  }, [currentUser]);

  // Auth operations
  const login = (username: string, password: string) => {
    const user = users.find(
      (u) =>
        u.username.toLowerCase() === username.trim().toLowerCase() &&
        u.password === password.trim()
    );
    if (user) {
      setCurrentUser(user);
      return { success: true };
    }
    return { success: false, message: 'Kullanıcı adı veya şifre hatalı!' };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // User Management (Admin)
  const addUser = (data: Omit<User, 'id' | 'created_at'>) => {
    const newUser: User = {
      ...data,
      id: `usr-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setUsers((prev) => [newUser, ...prev]);
    return newUser;
  };

  const updateUser = (id: string, data: Partial<User>) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...data } : u))
    );
    if (currentUser && currentUser.id === id) {
      setCurrentUser((prev) => (prev ? { ...prev, ...data } : null));
    }
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      return { success: false, message: 'Sistemde en az bir yönetici bulunmalıdır!' };
    }
    if (currentUser && currentUser.id === id) {
      return { success: false, message: 'Oturum açmış olduğunuz kullanıcıyı silemezsiniz!' };
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    return { success: true };
  };

  // Hotel Management
  const addHotel = (data: Omit<Otel, 'id' | 'created_at'>) => {
    const newHotel: Otel = {
      ...data,
      id: `htl-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setHotels((prev) => [newHotel, ...prev]);
    return newHotel;
  };

  const updateHotel = (id: string, data: Partial<Otel>) => {
    setHotels((prev) =>
      prev.map((h) => (h.id === id ? { ...h, ...data } : h))
    );
  };

  const deleteHotel = (id: string) => {
    const hasReservations = reservations.some((r) => r.otel_id === id && r.status === 'confirmed');
    if (hasReservations) {
      return {
        success: false,
        message: 'Bu otele ait aktif onaylı rezervasyonlar bulunmaktadır. Önce rezervasyonları iptal ediniz.',
      };
    }
    setHotels((prev) => prev.filter((h) => h.id !== id));
    // Cascade cleanup: remove linked seasons and rooms
    setSeasons((prev) => prev.filter((s) => s.otel_id !== id));
    setRooms((prev) => prev.filter((r) => r.otel_id !== id));
    return { success: true };
  };

  // Season Management
  const addSeason = (data: Omit<Season, 'id' | 'created_at'>) => {
    const newSeason: Season = {
      ...data,
      id: `sea-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setSeasons((prev) => [...prev, newSeason]);
    return newSeason;
  };

  const updateSeason = (id: string, data: Partial<Season>) => {
    setSeasons((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...data } : s))
    );
  };

  const deleteSeason = (id: string) => {
    const hasRooms = rooms.some((r) => r.season_id === id);
    if (hasRooms) {
      return {
        success: false,
        message: 'Bu döneme bağlı kayıtlı odalar bulunmaktadır. Önce ilgili odaları kaldırınız.',
      };
    }
    setSeasons((prev) => prev.filter((s) => s.id !== id));
    return { success: true };
  };

  const getSeasonsByHotel = (hotelId: string) => {
    return seasons.filter((s) => s.otel_id === hotelId);
  };

  // Room Management
  const addRoom = (data: Omit<Room, 'id' | 'created_at'>) => {
    const newRoom: Room = {
      ...data,
      id: `rm-${Date.now()}`,
      created_at: new Date().toISOString(),
    };
    setRooms((prev) => [newRoom, ...prev]);
    return newRoom;
  };

  const updateRoom = (id: string, data: Partial<Room>) => {
    setRooms((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const deleteRoom = (id: string) => {
    const hasReservations = reservations.some((res) => res.room_id === id && res.status === 'confirmed');
    if (hasReservations) {
      return {
        success: false,
        message: 'Bu odaya ait aktif onaylı rezervasyon bulunmaktadır. Önce rezervasyonu iptal ediniz.',
      };
    }
    setRooms((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  const getRoomsByHotel = (hotelId: string) => {
    return rooms.filter((r) => r.otel_id === hotelId);
  };

  // Dynamic Room Search Algorithm
  const searchRooms = (params: SearchFilterParams): RoomSearchResult[] => {
    const { city, hotel_name, check_in_date, check_out_date, adult_count, child_count } = params;
    const totalGuests = adult_count + child_count;

    let nightCount = 1;
    if (check_in_date && check_out_date) {
      const checkInTime = new Date(check_in_date).getTime();
      const checkOutTime = new Date(check_out_date).getTime();
      const diffMs = checkOutTime - checkInTime;
      nightCount = Math.max(1, Math.round(diffMs / (1000 * 60 * 60 * 24)));
    }

    const results: RoomSearchResult[] = [];

    // Filter hotels first based on criteria (1, 2, or 3 parameters)
    const filteredHotels = hotels.filter((hotel) => {
      // 1. City check (if provided)
      if (city && city.trim() !== '') {
        const normCity = turkishNormalize(city);
        const normHotelCity = turkishNormalize(hotel.city);
        const normDistrict = turkishNormalize(hotel.district);
        if (!normHotelCity.includes(normCity) && !normDistrict.includes(normCity)) {
          return false;
        }
      }

      // 2. Hotel name check (if provided)
      if (hotel_name && hotel_name.trim() !== '') {
        const normSearchName = turkishNormalize(hotel_name);
        const normHotelName = turkishNormalize(hotel.name);
        if (!normHotelName.includes(normSearchName)) {
          return false;
        }
      }

      // 3. Date range check (if provided): Hotel must have an active season covering this date range
      if (check_in_date && check_out_date) {
        const hotelSeasons = seasons.filter((s) => s.otel_id === hotel.id);
        const hasMatchingSeason = hotelSeasons.some((season) => {
          return season.start_date <= check_in_date && season.end_date >= check_out_date;
        });
        if (!hasMatchingSeason) {
          return false;
        }
      }

      return true;
    });

    // Now inspect rooms of matching hotels
    for (const hotel of filteredHotels) {
      const hotelRooms = rooms.filter((r) => r.otel_id === hotel.id);

      for (const room of hotelRooms) {
        // Stock check: must be > 0
        if (room.stock <= 0) continue;

        // Capacity check: bed_count must accommodate guests
        if (room.bed_count < totalGuests && room.bed_count < adult_count) continue;

        // Find linked season
        const season = seasons.find((s) => s.id === room.season_id);
        if (!season) continue;

        // If specific dates were provided, ensure this specific room's season covers the dates
        if (check_in_date && check_out_date) {
          if (season.start_date > check_in_date || season.end_date < check_out_date) {
            continue;
          }
        }

        // Automatic Price Calculation
        // total = (adult_count * adult_price + child_count * child_price) * nights
        const totalPrice = (adult_count * room.adult_price + child_count * room.child_price) * nightCount;

        results.push({
          room,
          hotel,
          season,
          night_count: nightCount,
          adult_count,
          child_count,
          total_price: totalPrice,
          check_in_date: check_in_date || new Date().toISOString().split('T')[0],
          check_out_date:
            check_out_date ||
            new Date(Date.now() + 86400000).toISOString().split('T')[0],
        });
      }
    }

    return results;
  };

  // Reservation Operations
  const createReservation = (
    data: Omit<Reservation, 'id' | 'created_at' | 'status'>
  ) => {
    // Find room and check stock
    const room = rooms.find((r) => r.id === data.room_id);
    if (!room) {
      return { success: false, error: 'Oda bilgisi bulunamadı.' };
    }
    if (room.stock <= 0) {
      return { success: false, error: 'Seçilen odada stok tükenmiştir.' };
    }

    const newReservation: Reservation = {
      ...data,
      id: `res-${Date.now().toString().slice(-6)}`,
      status: 'confirmed',
      created_at: new Date().toISOString(),
    };

    // Decrement stock by 1
    setRooms((prev) =>
      prev.map((r) => (r.id === data.room_id ? { ...r, stock: r.stock - 1 } : r))
    );

    // Add reservation
    setReservations((prev) => [newReservation, ...prev]);

    return { success: true, reservation: newReservation };
  };

  const updateReservation = (id: string, data: Partial<Reservation>) => {
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, ...data } : r))
    );
  };

  const cancelReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) {
      return { success: false, error: 'Rezervasyon bulunamadı.' };
    }
    if (res.status === 'cancelled') {
      return { success: false, error: 'Rezervasyon zaten iptal edilmiş.' };
    }

    // Restore stock (+1)
    setRooms((prev) =>
      prev.map((r) => (r.id === res.room_id ? { ...r, stock: r.stock + 1 } : r))
    );

    // Set status to cancelled
    setReservations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'cancelled' } : r))
    );

    return { success: true };
  };

  const deleteReservation = (id: string) => {
    const res = reservations.find((r) => r.id === id);
    if (!res) {
      return { success: false, error: 'Rezervasyon bulunamadı.' };
    }

    // If reservation was active (confirmed), restore stock (+1)
    if (res.status === 'confirmed') {
      setRooms((prev) =>
        prev.map((r) => (r.id === res.room_id ? { ...r, stock: r.stock + 1 } : r))
      );
    }

    setReservations((prev) => prev.filter((r) => r.id !== id));
    return { success: true };
  };

  // Reset database to seed
  const resetDatabase = () => {
    setUsers(SEED_USERS);
    setHotels(SEED_HOTELS);
    setSeasons(SEED_SEASONS);
    setRooms(SEED_ROOMS);
    setReservations(SEED_RESERVATIONS);
    setCurrentUser(SEED_USERS[0]);
    localStorage.clear();
  };

  // Export JSON
  const exportDatabaseJson = () => {
    return JSON.stringify(
      {
        user: users,
        otel: hotels,
        season: seasons,
        room: rooms,
        reservation: reservations,
        exported_at: new Date().toISOString(),
        author: 'Enes Öztürk - Patika Turizm Acente Sistemi',
      },
      null,
      2
    );
  };

  // SQL Query Runner (Simulated in-memory query engine for student / evaluation review)
  const executeSql = (query: string) => {
    const q = query.trim().toLowerCase();
    try {
      if (q.includes('from user')) {
        return {
          columns: ['id', 'username', 'role', 'full_name', 'email', 'phone', 'created_at'],
          rows: users.map(({ password, ...u }) => u),
          message: `${users.length} satır getirildi (user tablosu).`,
        };
      } else if (q.includes('from otel') || q.includes('from hotel')) {
        return {
          columns: ['id', 'name', 'city', 'district', 'star_rating', 'phone', 'email'],
          rows: hotels.map((h) => ({
            id: h.id,
            name: h.name,
            city: h.city,
            district: h.district,
            star_rating: `${h.star_rating} Yıldız`,
            phone: h.phone,
            email: h.email,
          })),
          message: `${hotels.length} satır getirildi (otel tablosu).`,
        };
      } else if (q.includes('from season')) {
        return {
          columns: ['id', 'otel_id', 'name', 'start_date', 'end_date'],
          rows: seasons,
          message: `${seasons.length} satır getirildi (season tablosu).`,
        };
      } else if (q.includes('from room')) {
        let filtered = rooms;
        if (q.includes('stock > 0')) {
          filtered = rooms.filter((r) => r.stock > 0);
        }
        return {
          columns: ['id', 'otel_id', 'room_type', 'pension_type', 'stock', 'adult_price', 'child_price', 'bed_count'],
          rows: filtered,
          message: `${filtered.length} satır getirildi (room tablosu).`,
        };
      } else if (q.includes('from reservation')) {
        return {
          columns: ['id', 'customer_name', 'customer_phone', 'room_type', 'check_in_date', 'check_out_date', 'total_price', 'status'],
          rows: reservations,
          message: `${reservations.length} satır getirildi (reservation tablosu).`,
        };
      }
      return {
        columns: ['Tablo Adı', 'Kayıt Sayısı', 'Açıklama'],
        rows: [
          { 'Tablo Adı': 'user', 'Kayıt Sayısı': users.length, Açıklama: 'Admin ve Personel Kullanıcıları' },
          { 'Tablo Adı': 'otel', 'Kayıt Sayısı': hotels.length, Açıklama: 'Anlaşmalı Oteller' },
          { 'Tablo Adı': 'season', 'Kayıt Sayısı': seasons.length, Açıklama: 'Otellere Ait Dönem Aralıkları' },
          { 'Tablo Adı': 'room', 'Kayıt Sayısı': rooms.length, Açıklama: 'Oda Tipleri, Fiyat ve Stok' },
          { 'Tablo Adı': 'reservation', 'Kayıt Sayısı': reservations.length, Açıklama: 'Müşteri Rezervasyon Kayıtları' },
        ],
        message: 'Kullanılabilir tablolar: SELECT * FROM user | otel | season | room | reservation',
      };
    } catch (err: any) {
      return { columns: [], rows: [], error: err.message || 'Sorgu çalıştırılamadı' };
    }
  };

  return (
    <DatabaseContext.Provider
      value={{
        users,
        currentUser,
        setCurrentUser,
        login,
        logout,
        addUser,
        updateUser,
        deleteUser,
        hotels,
        addHotel,
        updateHotel,
        deleteHotel,
        seasons,
        addSeason,
        updateSeason,
        deleteSeason,
        getSeasonsByHotel,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        getRoomsByHotel,
        reservations,
        createReservation,
        updateReservation,
        cancelReservation,
        deleteReservation,
        searchRooms,
        resetDatabase,
        exportDatabaseJson,
        executeSql,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = () => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
