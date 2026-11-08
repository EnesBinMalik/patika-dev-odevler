/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * İnsan Kaynakları Yönetim Sistemi (HRMS)
 * Domain Models, Enums ve Interfaces
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D Prensipleri & Katmanlı Mimari
 */

// ==========================================
// 1. ENUMS
// ==========================================

export enum Role {
  ADMIN = 'ADMIN',   // İnsan Kaynakları Uzmanı / Yönetici
  USER = 'USER',     // Çalışan / Personel
}

export enum Department {
  IT = 'Bilgi Teknolojileri',
  IK = 'İnsan Kaynakları',
  FINANS = 'Finans & Muhasebe',
  PAZARLAMA = 'Pazarlama & Satış',
  ARGE = 'Ar-Ge & İnovasyon',
  OPERASYON = 'Operasyon & Lojistik',
}

export enum EmploymentType {
  FULL_TIME = 'Tam Zamanlı (Bordrolu)',
  PART_TIME = 'Yarı Zamanlı',
  CONTRACT = 'Sözleşmeli / Danışman',
}

export enum LeaveType {
  YILLIK_IZIN = 'Yıllık Ücretli İzin',
  MAZERET_IZNI = 'Mazeret İzni',
  HASTALIK_RAPORU = 'Hastalık / Sağlık Raporu',
  DOGUM_IZNI = 'Doğum / Babalık İzni',
  UCRETSIZ_IZIN = 'Ücretsiz İzin',
}

export enum LeaveStatus {
  BEKLIYOR = 'BEKLIYOR',
  ONAYLANDI = 'ONAYLANDI',
  REDDEDILDI = 'REDDEDILDI',
}

export enum LogAction {
  LOGIN_SUCCESS = 'Sisteme Giriş Başarılı',
  LOGIN_FAILED = 'Hatalı Giriş Denemesi',
  ACCOUNT_LOCKED = 'Hesap 3 Hatalı Giriş Nedeniyle Bloke Edildi',
  ACCOUNT_UNLOCKED = 'Hesap Blokesi İK Tarafından Kaldırıldı',
  REGISTER_USER = 'Yeni Kullanıcı Kaydı',
  CREATE_EMPLOYEE = 'Yeni Çalışan Eklendi',
  UPDATE_EMPLOYEE = 'Çalışan Bilgileri Güncellendi',
  DELETE_EMPLOYEE = 'Çalışan Sistemden Çıkarıldı',
  UPDATE_SALARY = 'Maaş ve Yan Haklar Güncellendi',
  CREATE_LEAVE_REQUEST = 'İzin Talebi Oluşturuldu',
  APPROVE_LEAVE = 'İzin Talebi Onaylandı',
  REJECT_LEAVE = 'İzin Talebi Reddedildi',
  IO_BACKUP_EXPORT = 'Veritabanı Dosyaya Yedeklendi (I/O Export)',
  IO_BACKUP_IMPORT = 'Dosyadan Veritabanı Geri Yüklendi (I/O Import)',
}

// ==========================================
// 2. OOP INTERFACES (Interface Segregation)
// ==========================================

export interface IBaseEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface IUser extends IBaseEntity {
  username: string;
  email: string;
  passwordHash: string; // Maskeli ve SHA-256 hashli saklanır
  role: Role;
  failedLoginAttempts: number; // 3 deneme hakkı
  isLocked: boolean;           // Bloke durumu
  lockoutTime?: string;
  employeeId?: string;         // İlişkili çalışan kaydı
}

export interface IEmployee extends IBaseEntity {
  // Spring Data: @ManyToOne ilişkisi ile Admin (Yönetici İK Uzmanı)
  managerId: string;           // Admin(1) - User(N) ilişkisi
  userId: string;
  tcNo: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  employmentType: EmploymentType;
  hireDate: string;
  birthDate: string;
  address: string;
  baseSalary: number;          // Brüt Taban Maaş
  bonus: number;               // Prim / İkramiye
  deductions: number;          // Kesintiler (BES, Avans vb.)
  netSalary: number;           // Net Ele Geçen Maaş
  remainingLeaveDays: number;  // Kalan İzin Hakkı (Gün)
  usedLeaveDays: number;       // Kullanılan İzin Hakkı (Gün)
  avatarUrl: string;
  isActive: boolean;
}

export interface ILeaveRequest extends IBaseEntity {
  // Spring Data: @ManyToOne Employee ilişkisi
  employeeId: string;
  employeeName: string;
  department: Department;
  leaveType: LeaveType;
  startDate: string;           // YYYY-MM-DD
  endDate: string;             // YYYY-MM-DD
  totalDays: number;
  reason: string;
  status: LeaveStatus;
  approvedByAdminId?: string;
  adminNotes?: string;
  decisionDate?: string;
}

export interface ISalaryRecord extends IBaseEntity {
  employeeId: string;
  employeeName: string;
  tcNo: string;
  department: Department;
  periodMonth: number;         // 1 - 12
  periodYear: number;          // 2026
  baseSalary: number;          // Brüt
  sgkWorkerShare: number;      // SGK İşçi Payı %14
  unemploymentShare: number;   // İşsizlik Sigortası %1
  incomeTax: number;           // Gelir Vergisi %15
  stampTax: number;            // Damga Vergisi %0.759
  bonus: number;
  deductions: number;
  netSalary: number;
  paymentStatus: 'ODENDI' | 'BEKLEMEDE';
  paymentDate: string;
}

export interface IAuditLog extends IBaseEntity {
  action: LogAction;
  performedByUsername: string;
  performedByRole: Role;
  targetEntity: string;
  entityId?: string;
  details: string;
  ipAddress: string;
  status: 'SUCCESS' | 'FAILURE' | 'WARNING';
}

// ==========================================
// 3. PAGINATION INTERFACES (Paging yapılabilmeli)
// ==========================================

export interface Pageable {
  pageNumber: number; // 0-indexed
  pageSize: number;
}

export interface Page<T> {
  content: T[];
  pageNumber: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  isFirst: boolean;
  isLast: boolean;
  hasNext: boolean;
  hasPrevious: boolean;
}

// ==========================================
// 4. DTOs (Data Transfer Objects)
// ==========================================

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  tcNo: string;
  email: string;
  phone: string;
  department: Department;
  position: string;
  employmentType: EmploymentType;
  hireDate: string;
  birthDate: string;
  address: string;
  baseSalary: number;
  bonus?: number;
  deductions?: number;
  remainingLeaveDays?: number;
  managerId: string;
}

export interface CreateLeaveRequestDto {
  employeeId: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  reason: string;
}

export interface LoginDto {
  usernameOrEmail: string;
  password: string;
}

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  tcNo: string;
  department: Department;
  position: string;
  phone: string;
}
