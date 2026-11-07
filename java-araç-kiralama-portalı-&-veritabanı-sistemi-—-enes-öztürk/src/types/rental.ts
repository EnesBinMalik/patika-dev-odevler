export type VehicleType = 'Binek' | 'Arazi' | 'Ticari' | 'Lüks';
export type TransmissionType = 'Otomatik' | 'Manuel';
export type FuelType = 'Benzin' | 'Dizel' | 'Hibrit' | 'Elektrik';
export type ReservationStatus = 'ONAYLANDI' | 'İPTAL EDİLDİ' | 'TAMAMLANDI';

export interface Company {
  id: string;
  name: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  taxNumber: string;
  rating: number;
  logoText: string;
  createdAt: string;
}

export interface PriceRule {
  id: string;
  vehicleId: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  dailyPrice: number;
  label: string;      // e.g. "Yaz Sezonu", "Kurban Bayramı", "Standart"
}

export interface AdditionalService {
  id: string;
  name: string;
  description: string;
  pricePerDay: number;
  isAvailable: boolean;
}

export interface Vehicle {
  id: string;
  companyId: string;
  brand: string;
  model: string;
  year: number;
  plateNumber: string;
  type: VehicleType;
  transmission: TransmissionType;
  fuelType: FuelType;
  seats: number;
  image: string;
  description: string;
  availableFrom: string; // YYYY-MM-DD
  availableTo: string;   // YYYY-MM-DD
  baseDailyPrice: number;
  priceRules: PriceRule[];
  additionalServices: AdditionalService[];
}

export interface User {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  tcNo: string;
  driverLicenseNo: string;
  licenseYear: number;
  city: string;
  registeredAt: string;
}

export interface SelectedService {
  id: string;
  name: string;
  pricePerDay: number;
  totalPrice: number;
}

export interface Reservation {
  id: string;
  reservationCode: string;
  vehicleId: string;
  companyId: string;
  userId: string;
  userFullName: string;
  userEmail: string;
  userPhone: string;
  userTcNo: string;
  userLicenseNo: string;
  pickupCity: string;
  returnCity: string;
  startDate: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endDate: string;   // YYYY-MM-DD
  endTime: string;   // HH:mm
  days: number;
  dailyPrice: number;
  vehicleRentalCost: number;
  selectedServices: SelectedService[];
  servicesTotalCost: number;
  totalCost: number;
  status: ReservationStatus;
  createdAt: string;
  cancellationReason?: string;
  cancelledAt?: string;
}

export interface SearchFilter {
  city: string;
  startDate: string;
  endDate: string;
  type: VehicleType | 'Tümü';
  transmission?: TransmissionType | 'Tümü';
  fuelType?: FuelType | 'Tümü';
  maxPrice?: number;
  companyId?: string | 'Tümü';
}
