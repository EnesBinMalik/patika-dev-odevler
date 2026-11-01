/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Veri Modelleri
 * Geliştirici: Enes Öztürk
 */

export type UserRole = 'admin' | 'personel';

export interface User {
  id: string;
  username: string;
  password: string;
  role: UserRole;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
}

export type PensionType =
  | 'Ultra Her şey Dahil'
  | 'Her şey Dahil'
  | 'Oda Kahvaltı'
  | 'Tam Pansiyon'
  | 'Yarım Pansiyon'
  | 'Sadece Yatak'
  | 'Alkol Hariç Full credit';

export const PENSION_TYPES: PensionType[] = [
  'Ultra Her şey Dahil',
  'Her şey Dahil',
  'Oda Kahvaltı',
  'Tam Pansiyon',
  'Yarım Pansiyon',
  'Sadece Yatak',
  'Alkol Hariç Full credit',
];

export type FacilityType =
  | 'Ücretsiz Otopark'
  | 'Ücretsiz WiFi'
  | 'Yüzme Havuzu'
  | 'Fitness Center'
  | 'Hotel Concierge'
  | 'SPA'
  | '7/24 Oda Servisi';

export const FACILITY_TYPES: FacilityType[] = [
  'Ücretsiz Otopark',
  'Ücretsiz WiFi',
  'Yüzme Havuzu',
  'Fitness Center',
  'Hotel Concierge',
  'SPA',
  '7/24 Oda Servisi',
];

export type RoomType = 'Single Room' | 'Double Room' | 'Junior Suite' | 'Suite';

export const ROOM_TYPES: { id: RoomType; label: string; defaultBeds: number }[] = [
  { id: 'Single Room', label: 'Tek Kişilik Oda (Single Room)', defaultBeds: 1 },
  { id: 'Double Room', label: 'Çift Kişilik Oda (Double Room)', defaultBeds: 2 },
  { id: 'Junior Suite', label: 'Junior Suite Oda', defaultBeds: 3 },
  { id: 'Suite', label: 'Suite Oda', defaultBeds: 4 },
];

export interface Otel {
  id: string;
  name: string;
  city: string;
  district: string;
  address: string;
  email: string;
  phone: string;
  star_rating: number; // 1-5
  facilities: FacilityType[];
  pension_types: PensionType[];
  image_url?: string;
  created_at: string;
}

export interface Season {
  id: string;
  otel_id: string;
  name: string;
  start_date: string; // YYYY-MM-DD
  end_date: string;   // YYYY-MM-DD
  created_at?: string;
}

export interface Room {
  id: string;
  otel_id: string;
  season_id: string;
  pension_type: PensionType;
  room_type: RoomType;
  adult_price: number; // gecelik yetişkin ücreti ₺
  child_price: number; // gecelik çocuk ücreti ₺
  stock: number;       // kalan oda stok adedi
  bed_count: number;   // yatak sayısı / misafir kapasitesi
  square_meters: number;
  has_tv: boolean;
  has_minibar: boolean;
  has_console: boolean;
  has_safe: boolean;
  has_projector: boolean;
  created_at: string;
}

export interface GuestDetail {
  first_name: string;
  last_name: string;
  identity_no: string; // TC Kimlik No veya Pasaport
  is_child: boolean;
  age?: number;
}

export interface Reservation {
  id: string;
  room_id: string;
  otel_id: string;
  season_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_identity: string; // Rezervasyon yaptıran TC/Pasaport
  check_in_date: string;     // YYYY-MM-DD
  check_out_date: string;    // YYYY-MM-DD
  night_count: number;
  adult_count: number;
  child_count: number;
  total_price: number;
  pension_type: PensionType;
  room_type: RoomType;
  guests: GuestDetail[];
  status: 'confirmed' | 'cancelled';
  notes?: string;
  created_by: string; // acente çalışanı username
  created_at: string;
}

export interface RoomSearchResult {
  room: Room;
  hotel: Otel;
  season: Season;
  night_count: number;
  adult_count: number;
  child_count: number;
  total_price: number;
  check_in_date: string;
  check_out_date: string;
}

export interface SearchFilterParams {
  city?: string;
  hotel_name?: string;
  check_in_date?: string;
  check_out_date?: string;
  adult_count: number;
  child_count: number;
}
