import { Company, Vehicle, User, Reservation, SelectedService } from '../types/rental';
import { INITIAL_COMPANIES, INITIAL_VEHICLES, INITIAL_USERS, INITIAL_RESERVATIONS } from '../data/initialData';

const STORAGE_KEYS = {
  COMPANIES: 'car_rental_companies_v1',
  VEHICLES: 'car_rental_vehicles_v1',
  USERS: 'car_rental_users_v1',
  RESERVATIONS: 'car_rental_reservations_v1',
  CURRENT_USER: 'car_rental_current_user_v1',
};

// Safe localStorage access
function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return defaultValue;
    return JSON.parse(raw);
  } catch (err) {
    console.warn(`Error reading ${key} from localStorage`, err);
    return defaultValue;
  }
}

function saveToStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Error saving ${key} to localStorage`, err);
  }
}

export class RentalDatabaseService {
  private companies: Company[];
  private vehicles: Vehicle[];
  private users: User[];
  private reservations: Reservation[];
  private currentUserId: string;

  constructor() {
    this.companies = loadFromStorage(STORAGE_KEYS.COMPANIES, INITIAL_COMPANIES);
    this.vehicles = loadFromStorage(STORAGE_KEYS.VEHICLES, INITIAL_VEHICLES);
    this.users = loadFromStorage(STORAGE_KEYS.USERS, INITIAL_USERS);
    this.reservations = loadFromStorage(STORAGE_KEYS.RESERVATIONS, INITIAL_RESERVATIONS);
    this.currentUserId = loadFromStorage(STORAGE_KEYS.CURRENT_USER, this.users[0]?.id || 'usr_1');
  }

  // --- Companies ---
  getCompanies(): Company[] {
    return [...this.companies];
  }

  getCompanyById(id: string): Company | undefined {
    return this.companies.find((c) => c.id === id);
  }

  addCompany(company: Omit<Company, 'id' | 'createdAt' | 'rating' | 'logoText'>): Company {
    const newCompany: Company = {
      ...company,
      id: `comp_${Date.now()}`,
      rating: 5.0,
      logoText: company.name.substring(0, 2).toUpperCase(),
      createdAt: new Date().toISOString().split('T')[0],
    };
    this.companies.push(newCompany);
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    return newCompany;
  }

  // --- Vehicles ---
  getVehicles(): Vehicle[] {
    return [...this.vehicles];
  }

  getVehicleById(id: string): Vehicle | undefined {
    return this.vehicles.find((v) => v.id === id);
  }

  getVehiclesByCompany(companyId: string): Vehicle[] {
    return this.vehicles.filter((v) => v.companyId === companyId);
  }

  addVehicle(vehicle: Omit<Vehicle, 'id'>): Vehicle {
    const newVehicle: Vehicle = {
      ...vehicle,
      id: `veh_${Date.now()}`,
    };
    this.vehicles.push(newVehicle);
    saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    return newVehicle;
  }

  updateVehicle(id: string, updates: Partial<Vehicle>): Vehicle | null {
    const idx = this.vehicles.findIndex((v) => v.id === id);
    if (idx === -1) return null;
    this.vehicles[idx] = { ...this.vehicles[idx], ...updates };
    saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    return this.vehicles[idx];
  }

  deleteVehicle(id: string): boolean {
    const initialLen = this.vehicles.length;
    this.vehicles = this.vehicles.filter((v) => v.id !== id);
    if (this.vehicles.length !== initialLen) {
      saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
      return true;
    }
    return false;
  }

  // --- Users ---
  getUsers(): User[] {
    return [...this.users];
  }

  getCurrentUser(): User {
    const user = this.users.find((u) => u.id === this.currentUserId);
    if (user) return user;
    return this.users[0];
  }

  setCurrentUser(userId: string): void {
    this.currentUserId = userId;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, userId);
  }

  registerUser(userData: Omit<User, 'id' | 'registeredAt'>): User {
    const existing = this.users.find((u) => u.email.toLowerCase() === userData.email.toLowerCase());
    if (existing) {
      this.currentUserId = existing.id;
      saveToStorage(STORAGE_KEYS.CURRENT_USER, existing.id);
      return existing;
    }
    const newUser: User = {
      ...userData,
      id: `usr_${Date.now()}`,
      registeredAt: new Date().toISOString().split('T')[0],
    };
    this.users.push(newUser);
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    this.currentUserId = newUser.id;
    saveToStorage(STORAGE_KEYS.CURRENT_USER, newUser.id);
    return newUser;
  }

  // --- Dynamic Pricing & Availability Calculations ---
  calculateDailyRateForDate(vehicle: Vehicle, dateStr: string): { price: number; ruleLabel?: string } {
    if (vehicle.priceRules && vehicle.priceRules.length > 0) {
      for (const rule of vehicle.priceRules) {
        if (dateStr >= rule.startDate && dateStr <= rule.endDate) {
          return { price: rule.dailyPrice, ruleLabel: rule.label };
        }
      }
    }
    return { price: vehicle.baseDailyPrice, ruleLabel: 'Standart Fiyat' };
  }

  calculatePricingDetails(
    vehicle: Vehicle,
    startDateStr: string,
    endDateStr: string,
    selectedServiceIds: string[]
  ): {
    days: number;
    averageDailyRate: number;
    vehicleRentalCost: number;
    selectedServices: SelectedService[];
    servicesTotalCost: number;
    totalCost: number;
    dailyBreakdown: { date: string; price: number; ruleLabel: string }[];
  } {
    const start = new Date(startDateStr);
    const end = new Date(endDateStr);
    const diffTime = Math.max(end.getTime() - start.getTime(), 0);
    const dayCount = Math.max(Math.ceil(diffTime / (1000 * 60 * 60 * 24)), 1);

    const dailyBreakdown: { date: string; price: number; ruleLabel: string }[] = [];
    let vehicleRentalCost = 0;

    const curr = new Date(start);
    for (let i = 0; i < dayCount; i++) {
      const curDateStr = curr.toISOString().split('T')[0];
      const rateInfo = this.calculateDailyRateForDate(vehicle, curDateStr);
      dailyBreakdown.push({
        date: curDateStr,
        price: rateInfo.price,
        ruleLabel: rateInfo.ruleLabel || 'Standart',
      });
      vehicleRentalCost += rateInfo.price;
      curr.setDate(curr.getDate() + 1);
    }

    const averageDailyRate = Math.round(vehicleRentalCost / dayCount);

    const selectedServices: SelectedService[] = [];
    let servicesDailySum = 0;

    if (vehicle.additionalServices) {
      for (const srv of vehicle.additionalServices) {
        if (selectedServiceIds.includes(srv.id)) {
          const serviceTotal = srv.pricePerDay * dayCount;
          selectedServices.push({
            id: srv.id,
            name: srv.name,
            pricePerDay: srv.pricePerDay,
            totalPrice: serviceTotal,
          });
          servicesDailySum += srv.pricePerDay;
        }
      }
    }

    const servicesTotalCost = servicesDailySum * dayCount;
    const totalCost = vehicleRentalCost + servicesTotalCost;

    return {
      days: dayCount,
      averageDailyRate,
      vehicleRentalCost,
      selectedServices,
      servicesTotalCost,
      totalCost,
      dailyBreakdown,
    };
  }

  // --- Conflict Detection ---
  checkVehicleAvailability(
    vehicleId: string,
    requestedStartStr: string,
    requestedEndStr: string,
    excludeReservationId?: string
  ): {
    isAvailable: boolean;
    reason?: string;
    conflictingReservation?: Reservation;
  } {
    const vehicle = this.getVehicleById(vehicleId);
    if (!vehicle) {
      return { isAvailable: false, reason: 'Araç sistemde bulunamadı.' };
    }

    // 1. Check if dates fall within company's general availability window
    if (requestedStartStr < vehicle.availableFrom || requestedEndStr > vehicle.availableTo) {
      return {
        isAvailable: false,
        reason: `Araç yalnızca ${vehicle.availableFrom} ile ${vehicle.availableTo} tarihleri arasında kiralanabilir.`,
      };
    }

    // 2. Check conflict with existing confirmed reservations
    // Overlap condition: startA < endB && endA > startB
    const conflicts = this.reservations.filter((r) => {
      if (r.vehicleId !== vehicleId) return false;
      if (r.status !== 'ONAYLANDI') return false;
      if (excludeReservationId && r.id === excludeReservationId) return false;

      const overlap = requestedStartStr < r.endDate && requestedEndStr > r.startDate;
      return overlap;
    });

    if (conflicts.length > 0) {
      const conf = conflicts[0];
      return {
        isAvailable: false,
        reason: `Bu araç ${conf.startDate} — ${conf.endDate} tarihleri arasında başka bir kullanıcı tarafından rezerve edilmiştir (${conf.reservationCode}).`,
        conflictingReservation: conf,
      };
    }

    return { isAvailable: true };
  }

  // --- Reservations ---
  getReservations(): Reservation[] {
    return [...this.reservations].sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }

  getReservationsByUser(userId: string): Reservation[] {
    return this.reservations
      .filter((r) => r.userId === userId)
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }

  getReservationsByCompany(companyId: string): Reservation[] {
    return this.reservations
      .filter((r) => r.companyId === companyId)
      .sort((a, b) => (b.createdAt > a.createdAt ? 1 : -1));
  }

  createReservation(params: {
    vehicleId: string;
    userId: string;
    pickupCity: string;
    returnCity: string;
    startDate: string;
    startTime: string;
    endDate: string;
    endTime: string;
    selectedServiceIds: string[];
    userOverrides?: {
      fullName: string;
      email: string;
      phone: string;
      tcNo: string;
      licenseNo: string;
    };
  }): { success: boolean; reservation?: Reservation; error?: string } {
    const vehicle = this.getVehicleById(params.vehicleId);
    if (!vehicle) return { success: false, error: 'Araç bulunamadı.' };

    const company = this.getCompanyById(vehicle.companyId);
    if (!company) return { success: false, error: 'İlgili araç kiralama firması bulunamadı.' };

    const user = this.users.find((u) => u.id === params.userId) || this.getCurrentUser();

    // Conflict Check
    const availabilityCheck = this.checkVehicleAvailability(params.vehicleId, params.startDate, params.endDate);
    if (!availabilityCheck.isAvailable) {
      return { success: false, error: availabilityCheck.reason };
    }

    // Calculate Pricing
    const pricing = this.calculatePricingDetails(
      vehicle,
      params.startDate,
      params.endDate,
      params.selectedServiceIds
    );

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reservationCode = `REZ-${new Date().getFullYear()}-${randomSuffix}`;

    const newReservation: Reservation = {
      id: `rez_${Date.now()}`,
      reservationCode,
      vehicleId: vehicle.id,
      companyId: company.id,
      userId: user.id,
      userFullName: params.userOverrides?.fullName || user.fullName,
      userEmail: params.userOverrides?.email || user.email,
      userPhone: params.userOverrides?.phone || user.phone,
      userTcNo: params.userOverrides?.tcNo || user.tcNo,
      userLicenseNo: params.userOverrides?.licenseNo || user.driverLicenseNo,
      pickupCity: params.pickupCity,
      returnCity: params.returnCity,
      startDate: params.startDate,
      startTime: params.startTime || '10:00',
      endDate: params.endDate,
      endTime: params.endTime || '10:00',
      days: pricing.days,
      dailyPrice: pricing.averageDailyRate,
      vehicleRentalCost: pricing.vehicleRentalCost,
      selectedServices: pricing.selectedServices,
      servicesTotalCost: pricing.servicesTotalCost,
      totalCost: pricing.totalCost,
      status: 'ONAYLANDI',
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    this.reservations.unshift(newReservation);
    saveToStorage(STORAGE_KEYS.RESERVATIONS, this.reservations);
    return { success: true, reservation: newReservation };
  }

  // --- Cancellation Rule: "Rezervasyonlar en erken 1 gün öncesinden iptal edilebilir" ---
  canCancelReservation(reservation: Reservation): {
    canCancel: boolean;
    hoursRemaining: number;
    reason: string;
  } {
    if (reservation.status === 'İPTAL EDİLDİ') {
      return { canCancel: false, hoursRemaining: 0, reason: 'Rezervasyon zaten iptal edilmiş.' };
    }
    if (reservation.status === 'TAMAMLANDI') {
      return { canCancel: false, hoursRemaining: 0, reason: 'Sona ermiş rezervasyonlar iptal edilemez.' };
    }

    const pickupDateTime = new Date(`${reservation.startDate}T${reservation.startTime || '10:00'}:00`);
    const now = new Date();

    const diffMs = pickupDateTime.getTime() - now.getTime();
    const hoursRemaining = Math.round((diffMs / (1000 * 60 * 60)) * 10) / 10;

    // Rule: At least 24 hours (1 day) before pickup
    if (hoursRemaining >= 24) {
      return {
        canCancel: true,
        hoursRemaining,
        reason: `Rezervasyon başlangıcına ${hoursRemaining} saat var. İptal hakkı geçerlidir (en az 24 saat önceden).`,
      };
    } else if (hoursRemaining > 0) {
      return {
        canCancel: false,
        hoursRemaining,
        reason: `Rezervasyon başlangıcına yalnızca ${hoursRemaining} saat kaldığından sistem kuralı gereği (en erken 1 gün öncesi) iptal edilemez.`,
      };
    } else {
      return {
        canCancel: false,
        hoursRemaining: 0,
        reason: 'Rezervasyon tarihi başlamış veya geçmiş olduğu için iptal edilemez.',
      };
    }
  }

  cancelReservation(reservationId: string, reason?: string): { success: boolean; message: string } {
    const idx = this.reservations.findIndex((r) => r.id === reservationId);
    if (idx === -1) return { success: false, message: 'Rezervasyon kaydı bulunamadı.' };

    const reservation = this.reservations[idx];
    const cancelCheck = this.canCancelReservation(reservation);

    if (!cancelCheck.canCancel) {
      return { success: false, message: cancelCheck.reason };
    }

    this.reservations[idx] = {
      ...reservation,
      status: 'İPTAL EDİLDİ',
      cancellationReason: reason || 'Müşteri talebiyle iptal edildi (1 gün öncesi kuralına uygun).',
      cancelledAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    };

    saveToStorage(STORAGE_KEYS.RESERVATIONS, this.reservations);
    return { success: true, message: 'Rezervasyon başarıyla iptal edildi. Araç takvimi serbest bırakıldı.' };
  }

  // Reset database to initial sample data
  resetDatabase(): void {
    localStorage.removeItem(STORAGE_KEYS.COMPANIES);
    localStorage.removeItem(STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(STORAGE_KEYS.USERS);
    localStorage.removeItem(STORAGE_KEYS.RESERVATIONS);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
    this.companies = [...INITIAL_COMPANIES];
    this.vehicles = [...INITIAL_VEHICLES];
    this.users = [...INITIAL_USERS];
    this.reservations = [...INITIAL_RESERVATIONS];
    this.currentUserId = this.users[0].id;
    saveToStorage(STORAGE_KEYS.COMPANIES, this.companies);
    saveToStorage(STORAGE_KEYS.VEHICLES, this.vehicles);
    saveToStorage(STORAGE_KEYS.USERS, this.users);
    saveToStorage(STORAGE_KEYS.RESERVATIONS, this.reservations);
    saveToStorage(STORAGE_KEYS.CURRENT_USER, this.currentUserId);
  }
}

export const dbService = new RentalDatabaseService();
