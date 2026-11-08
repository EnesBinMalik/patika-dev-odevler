/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Veritabanı Motoru & I/O Dosya Yönetimi (Database & File System I/O)
 * Geliştirici: Enes Öztürk
 * 
 * Spring Data JPA & H2 / PostgreSQL Benzetimi
 * @OneToMany / @ManyToOne İlişkileri: Admin(1) - User(N)
 * Şifre Hashleme & Maskeleme (SHA-256)
 * 3 Hatalı Giriş Bloke Mekanizması
 * I/O Dosya Kaydetme & Geri Yükleme (JSON / CSV / TXT)
 */

import { Department, EmploymentType, IAuditLog, IEmployee, ILeaveRequest, ISalaryRecord, IUser, LeaveStatus, LeaveType, LogAction, Role } from '../models/types';
import { AuditEventPublisher, PayrollStrategyContext } from './patterns';

const STORAGE_KEY_USERS = 'hrms_db_users_v1';
const STORAGE_KEY_EMPLOYEES = 'hrms_db_employees_v1';
const STORAGE_KEY_LEAVES = 'hrms_db_leaves_v1';
const STORAGE_KEY_SALARIES = 'hrms_db_salaries_v1';
const STORAGE_KEY_LOGS = 'hrms_db_logs_v1';

// Basit SHA-256 benzetimli güvenli hash algoritması
export async function hashPassword(plainText: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode('SALT_ENES_OZTURK_' + plainText);
  try {
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  } catch (e) {
    // Fallback deterministic hash
    let hash = 0;
    for (let i = 0; i < plainText.length; i++) {
      hash = ((hash << 5) - hash) + plainText.charCodeAt(i);
      hash |= 0;
    }
    return 'sha256_' + Math.abs(hash).toString(16) + 'e89cbf41';
  }
}

// Şifre maskeleme yardımcısı
export function maskPassword(length: number = 8): string {
  return '•'.repeat(length);
}

export class DatabaseEngine {
  private static instance: DatabaseEngine;

  private users: IUser[] = [];
  private employees: IEmployee[] = [];
  private leaves: ILeaveRequest[] = [];
  private salaries: ISalaryRecord[] = [];
  private auditLogs: IAuditLog[] = [];

  private isInitialized = false;

  private constructor() {}

  public static getInstance(): DatabaseEngine {
    if (!DatabaseEngine.instance) {
      DatabaseEngine.instance = new DatabaseEngine();
      DatabaseEngine.instance.initialize();
    }
    return DatabaseEngine.instance;
  }

  public async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      const storedUsers = localStorage.getItem(STORAGE_KEY_USERS);
      const storedEmployees = localStorage.getItem(STORAGE_KEY_EMPLOYEES);
      const storedLeaves = localStorage.getItem(STORAGE_KEY_LEAVES);
      const storedSalaries = localStorage.getItem(STORAGE_KEY_SALARIES);
      const storedLogs = localStorage.getItem(STORAGE_KEY_LOGS);

      if (storedUsers && storedEmployees) {
        this.users = JSON.parse(storedUsers);
        this.employees = JSON.parse(storedEmployees);
        this.leaves = storedLeaves ? JSON.parse(storedLeaves) : [];
        this.salaries = storedSalaries ? JSON.parse(storedSalaries) : [];
        this.auditLogs = storedLogs ? JSON.parse(storedLogs) : [];
      } else {
        await this.seedInitialDatabase();
      }
    } catch (e) {
      console.warn('Veritabanı yüklenirken hata oluştu, varsayılan veriler yükleniyor:', e);
      await this.seedInitialDatabase();
    }

    this.isInitialized = true;
  }

  private async seedInitialDatabase(): Promise<void> {
    const adminPasswordHash = await hashPassword('Admin123!');
    const userPasswordHash = await hashPassword('User123!');

    // 1. Admin (İnsan Kaynakları Uzmanı / Yönetici - Enes Öztürk)
    const adminUser: IUser = {
      id: 'usr-admin-01',
      username: 'enes.ozturk',
      email: 'enes.ozturk@sirket.com',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      failedLoginAttempts: 0,
      isLocked: false,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T08:00:00Z',
      employeeId: 'emp-admin-01',
    };

    const adminEmployee: IEmployee = {
      id: 'emp-admin-01',
      userId: 'usr-admin-01',
      managerId: 'usr-admin-01', // Admin self-managed
      tcNo: '11223344556',
      firstName: 'Enes',
      lastName: 'Öztürk',
      email: 'enes.ozturk@sirket.com',
      phone: '+90 532 100 2030',
      department: Department.IK,
      position: 'İnsan Kaynakları Direktörü & Yazılım Mimarı',
      employmentType: EmploymentType.FULL_TIME,
      hireDate: '2024-01-15',
      birthDate: '1995-04-12',
      address: 'Kadıköy, İstanbul',
      baseSalary: 110000,
      bonus: 15000,
      deductions: 2500,
      netSalary: 86500,
      remainingLeaveDays: 20,
      usedLeaveDays: 4,
      avatarUrl: '',
      isActive: true,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T08:00:00Z',
    };

    // 2. Normal Kullanıcılar / Çalışanlar (User Role)
    const usersData: Array<{ user: IUser; emp: IEmployee }> = [
      {
        user: {
          id: 'usr-emp-01',
          username: 'ahmet.yilmaz',
          email: 'ahmet.yilmaz@sirket.com',
          passwordHash: userPasswordHash,
          role: Role.USER,
          failedLoginAttempts: 0,
          isLocked: false,
          employeeId: 'emp-01',
          createdAt: '2025-02-01T09:00:00Z',
          updatedAt: '2025-02-01T09:00:00Z',
        },
        emp: {
          id: 'emp-01',
          userId: 'usr-emp-01',
          managerId: 'usr-admin-01', // @ManyToOne -> Enes Öztürk
          tcNo: '23456789012',
          firstName: 'Ahmet',
          lastName: 'Yılmaz',
          email: 'ahmet.yilmaz@sirket.com',
          phone: '+90 541 234 5678',
          department: Department.IT,
          position: 'Kıdemli Backend Geliştirici (Java/Spring)',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: '2024-03-01',
          birthDate: '1996-08-20',
          address: 'Beşiktaş, İstanbul',
          baseSalary: 85000,
          bonus: 5000,
          deductions: 1000,
          netSalary: 62450,
          remainingLeaveDays: 12,
          usedLeaveDays: 6,
          avatarUrl: '',
          isActive: true,
          createdAt: '2025-02-01T09:00:00Z',
          updatedAt: '2025-02-01T09:00:00Z',
        },
      },
      {
        user: {
          id: 'usr-emp-02',
          username: 'ayse.kaya',
          email: 'ayse.kaya@sirket.com',
          passwordHash: userPasswordHash,
          role: Role.USER,
          failedLoginAttempts: 0,
          isLocked: false,
          employeeId: 'emp-02',
          createdAt: '2025-02-15T09:00:00Z',
          updatedAt: '2025-02-15T09:00:00Z',
        },
        emp: {
          id: 'emp-02',
          userId: 'usr-emp-02',
          managerId: 'usr-admin-01',
          tcNo: '34567890123',
          firstName: 'Ayşe',
          lastName: 'Kaya',
          email: 'ayse.kaya@sirket.com',
          phone: '+90 533 987 6543',
          department: Department.IT,
          position: 'Frontend Takım Lideri (React/TS)',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: '2024-04-10',
          birthDate: '1997-11-15',
          address: 'Üsküdar, İstanbul',
          baseSalary: 78000,
          bonus: 4000,
          deductions: 800,
          netSalary: 57200,
          remainingLeaveDays: 9,
          usedLeaveDays: 5,
          avatarUrl: '',
          isActive: true,
          createdAt: '2025-02-15T09:00:00Z',
          updatedAt: '2025-02-15T09:00:00Z',
        },
      },
      {
        user: {
          id: 'usr-emp-03',
          username: 'mehmet.demir',
          email: 'mehmet.demir@sirket.com',
          passwordHash: userPasswordHash,
          role: Role.USER,
          failedLoginAttempts: 0,
          isLocked: false,
          employeeId: 'emp-03',
          createdAt: '2025-03-01T09:00:00Z',
          updatedAt: '2025-03-01T09:00:00Z',
        },
        emp: {
          id: 'emp-03',
          userId: 'usr-emp-03',
          managerId: 'usr-admin-01',
          tcNo: '45678901234',
          firstName: 'Mehmet',
          lastName: 'Demir',
          email: 'mehmet.demir@sirket.com',
          phone: '+90 555 444 3322',
          department: Department.FINANS,
          position: 'Kıdemli Bütçe & Raporlama Uzmanı',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: '2023-09-01',
          birthDate: '1993-02-14',
          address: 'Şişli, İstanbul',
          baseSalary: 68000,
          bonus: 3500,
          deductions: 750,
          netSalary: 49800,
          remainingLeaveDays: 14,
          usedLeaveDays: 8,
          avatarUrl: '',
          isActive: true,
          createdAt: '2025-03-01T09:00:00Z',
          updatedAt: '2025-03-01T09:00:00Z',
        },
      },
      {
        user: {
          id: 'usr-emp-04',
          username: 'zeynep.celik',
          email: 'zeynep.celik@sirket.com',
          passwordHash: userPasswordHash,
          role: Role.USER,
          failedLoginAttempts: 0,
          isLocked: false,
          employeeId: 'emp-04',
          createdAt: '2025-03-15T09:00:00Z',
          updatedAt: '2025-03-15T09:00:00Z',
        },
        emp: {
          id: 'emp-04',
          userId: 'usr-emp-04',
          managerId: 'usr-admin-01',
          tcNo: '56789012345',
          firstName: 'Zeynep',
          lastName: 'Çelik',
          email: 'zeynep.celik@sirket.com',
          phone: '+90 530 111 2233',
          department: Department.ARGE,
          position: 'Yapay Zeka & Veri Bilimcisi',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: '2024-06-01',
          birthDate: '1998-05-30',
          address: 'Çankaya, Ankara',
          baseSalary: 82000,
          bonus: 6000,
          deductions: 1200,
          netSalary: 60500,
          remainingLeaveDays: 15,
          usedLeaveDays: 2,
          avatarUrl: '',
          isActive: true,
          createdAt: '2025-03-15T09:00:00Z',
          updatedAt: '2025-03-15T09:00:00Z',
        },
      },
      {
        user: {
          id: 'usr-emp-05',
          username: 'can.ozkan',
          email: 'can.ozkan@sirket.com',
          passwordHash: userPasswordHash,
          role: Role.USER,
          failedLoginAttempts: 3, // Test için bloke edilmiş çalışan örneği
          isLocked: true,
          lockoutTime: '2026-11-06T04:30:00Z',
          employeeId: 'emp-05',
          createdAt: '2025-04-01T09:00:00Z',
          updatedAt: '2026-11-06T04:30:00Z',
        },
        emp: {
          id: 'emp-05',
          userId: 'usr-emp-05',
          managerId: 'usr-admin-01',
          tcNo: '67890123456',
          firstName: 'Can',
          lastName: 'Özkan',
          email: 'can.ozkan@sirket.com',
          phone: '+90 535 777 8899',
          department: Department.PAZARLAMA,
          position: 'Dijital Pazarlama & Büyüme Uzmanı',
          employmentType: EmploymentType.FULL_TIME,
          hireDate: '2024-08-15',
          birthDate: '1994-09-05',
          address: 'Karşıyaka, İzmir',
          baseSalary: 62000,
          bonus: 2000,
          deductions: 500,
          netSalary: 45700,
          remainingLeaveDays: 8,
          usedLeaveDays: 6,
          avatarUrl: '',
          isActive: true,
          createdAt: '2025-04-01T09:00:00Z',
          updatedAt: '2025-04-01T09:00:00Z',
        },
      },
    ];

    this.users = [adminUser, ...usersData.map(u => u.user)];
    this.employees = [adminEmployee, ...usersData.map(u => u.emp)];

    // 3. İzin Talepleri Tohum Verisi
    this.leaves = [
      {
        id: 'leave-01',
        employeeId: 'emp-01',
        employeeName: 'Ahmet Yılmaz',
        department: Department.IT,
        leaveType: LeaveType.YILLIK_IZIN,
        startDate: '2026-11-10',
        endDate: '2026-11-14',
        totalDays: 5,
        reason: 'Aile ziyareti ve dinlenme amaçlı yıllık izin kullanımı.',
        status: LeaveStatus.BEKLIYOR,
        createdAt: '2026-11-04T10:00:00Z',
        updatedAt: '2026-11-04T10:00:00Z',
      },
      {
        id: 'leave-02',
        employeeId: 'emp-02',
        employeeName: 'Ayşe Kaya',
        department: Department.IT,
        leaveType: LeaveType.HASTALIK_RAPORU,
        startDate: '2026-11-02',
        endDate: '2026-11-03',
        totalDays: 2,
        reason: 'Grip teşhisi nedeniyle doktor istirahat raporu.',
        status: LeaveStatus.ONAYLANDI,
        approvedByAdminId: 'usr-admin-01',
        adminNotes: 'Rapor ektedir. Geçmiş olsun.',
        decisionDate: '2026-11-02T11:30:00Z',
        createdAt: '2026-11-02T09:15:00Z',
        updatedAt: '2026-11-02T11:30:00Z',
      },
      {
        id: 'leave-03',
        employeeId: 'emp-04',
        employeeName: 'Zeynep Çelik',
        department: Department.ARGE,
        leaveType: LeaveType.MAZERET_IZNI,
        startDate: '2026-11-18',
        endDate: '2026-11-19',
        totalDays: 2,
        reason: 'Resmi daire işlemleri mazeret izni.',
        status: LeaveStatus.BEKLIYOR,
        createdAt: '2026-11-05T14:20:00Z',
        updatedAt: '2026-11-05T14:20:00Z',
      },
      {
        id: 'leave-04',
        employeeId: 'emp-03',
        employeeName: 'Mehmet Demir',
        department: Department.FINANS,
        leaveType: LeaveType.YILLIK_IZIN,
        startDate: '2026-10-12',
        endDate: '2026-10-16',
        totalDays: 5,
        reason: 'Sonbahar yıllık tatili.',
        status: LeaveStatus.ONAYLANDI,
        approvedByAdminId: 'usr-admin-01',
        adminNotes: 'İyi tatiller dileriz.',
        decisionDate: '2026-10-10T16:00:00Z',
        createdAt: '2026-10-09T10:00:00Z',
        updatedAt: '2026-10-10T16:00:00Z',
      },
    ];

    // 4. Bordro / Maaş Kayıtları Tohum Verisi
    this.salaries = this.employees.map(emp => {
      const strategy = PayrollStrategyContext.getStrategy(emp.employmentType);
      const calc = strategy.calculate(emp.baseSalary, emp.bonus, emp.deductions);
      return {
        id: 'sal-' + emp.id + '-2026-10',
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        tcNo: emp.tcNo,
        department: emp.department,
        periodMonth: 10,
        periodYear: 2026,
        baseSalary: calc.baseSalary,
        sgkWorkerShare: calc.sgkWorkerShare,
        unemploymentShare: calc.unemploymentShare,
        incomeTax: calc.incomeTax,
        stampTax: calc.stampTax,
        bonus: calc.bonus,
        deductions: calc.deductions,
        netSalary: calc.netSalary,
        paymentStatus: 'ODENDI',
        paymentDate: '2026-10-31',
        createdAt: '2026-10-31T09:00:00Z',
        updatedAt: '2026-10-31T09:00:00Z',
      };
    });

    // 5. Başlangıç Denetim İzi (Audit Log) Tohum Verisi
    this.auditLogs = [
      {
        id: 'log-01',
        action: LogAction.LOGIN_SUCCESS,
        performedByUsername: 'enes.ozturk',
        performedByRole: Role.ADMIN,
        targetEntity: 'System',
        details: 'İnsan Kaynakları Direktörü Enes Öztürk sisteme giriş yaptı.',
        ipAddress: '192.168.1.10',
        status: 'SUCCESS',
        createdAt: '2026-11-06T04:00:00Z',
        updatedAt: '2026-11-06T04:00:00Z',
      },
      {
        id: 'log-02',
        action: LogAction.ACCOUNT_LOCKED,
        performedByUsername: 'can.ozkan',
        performedByRole: Role.USER,
        targetEntity: 'IUser',
        entityId: 'usr-emp-05',
        details: '3 defa hatalı şifre girildi. Hesap güvenlik protokolü gereği kilitlendi.',
        ipAddress: '192.168.1.45',
        status: 'WARNING',
        createdAt: '2026-11-06T04:30:00Z',
        updatedAt: '2026-11-06T04:30:00Z',
      },
      {
        id: 'log-03',
        action: LogAction.APPROVE_LEAVE,
        performedByUsername: 'enes.ozturk',
        performedByRole: Role.ADMIN,
        targetEntity: 'ILeaveRequest',
        entityId: 'leave-02',
        details: 'Ayşe Kaya için 2 günlük hastalık raporu izni onaylandı.',
        ipAddress: '192.168.1.10',
        status: 'SUCCESS',
        createdAt: '2026-11-02T11:30:00Z',
        updatedAt: '2026-11-02T11:30:00Z',
      },
    ];

    this.persistToLocalStorage();
  }

  public persistToLocalStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(this.users));
      localStorage.setItem(STORAGE_KEY_EMPLOYEES, JSON.stringify(this.employees));
      localStorage.setItem(STORAGE_KEY_LEAVES, JSON.stringify(this.leaves));
      localStorage.setItem(STORAGE_KEY_SALARIES, JSON.stringify(this.salaries));
      localStorage.setItem(STORAGE_KEY_LOGS, JSON.stringify(this.auditLogs));
    } catch (e) {
      console.error('LocalStorage persist hatası:', e);
    }
  }

  // ==========================================
  // GETTERS (Collections)
  // ==========================================
  public getUsers(): IUser[] {
    return this.users;
  }

  public getEmployees(): IEmployee[] {
    return this.employees;
  }

  public getLeaves(): ILeaveRequest[] {
    return this.leaves;
  }

  public getSalaries(): ISalaryRecord[] {
    return this.salaries;
  }

  public getAuditLogs(): IAuditLog[] {
    return this.auditLogs;
  }

  // ==========================================
  // MUTATIONS (CRUD)
  // ==========================================
  public saveUser(user: IUser): void {
    const idx = this.users.findIndex(u => u.id === user.id);
    if (idx >= 0) {
      this.users[idx] = { ...user, updatedAt: new Date().toISOString() };
    } else {
      this.users.push(user);
    }
    this.persistToLocalStorage();
  }

  public saveEmployee(employee: IEmployee): void {
    const idx = this.employees.findIndex(e => e.id === employee.id);
    if (idx >= 0) {
      this.employees[idx] = { ...employee, updatedAt: new Date().toISOString() };
    } else {
      this.employees.push(employee);
    }
    this.persistToLocalStorage();
  }

  public deleteEmployee(id: string): void {
    this.employees = this.employees.filter(e => e.id !== id);
    this.persistToLocalStorage();
  }

  public saveLeave(leave: ILeaveRequest): void {
    const idx = this.leaves.findIndex(l => l.id === leave.id);
    if (idx >= 0) {
      this.leaves[idx] = { ...leave, updatedAt: new Date().toISOString() };
    } else {
      this.leaves.unshift(leave);
    }
    this.persistToLocalStorage();
  }

  public saveSalaryRecord(record: ISalaryRecord): void {
    const idx = this.salaries.findIndex(s => s.id === record.id);
    if (idx >= 0) {
      this.salaries[idx] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      this.salaries.unshift(record);
    }
    this.persistToLocalStorage();
  }

  public logAudit(log: Omit<IAuditLog, 'id' | 'createdAt' | 'updatedAt'>): IAuditLog {
    const newLog: IAuditLog = {
      id: 'log-' + Math.random().toString(36).substr(2, 9),
      ...log,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.auditLogs.unshift(newLog);
    this.persistToLocalStorage();

    // Observer pattern ile yayınla
    AuditEventPublisher.getInstance().publish(newLog);

    return newLog;
  }

  // ==========================================
  // I/O (INPUT/OUTPUT) FILE OPERATIONS
  // ==========================================

  /**
   * 1. Tüm Veritabanını JSON dosyası olarak bilgisayara indir (I/O Export)
   */
  public exportFullDatabaseToJson(): void {
    const fullBackup = {
      metadata: {
        appName: 'İnsan Kaynakları Yönetim Sistemi (HRMS)',
        creator: 'Enes Öztürk',
        version: '1.0.0-SPRING-BOOT-LAYERED',
        exportedAt: new Date().toISOString(),
        tablesCount: 5,
        totalRecords: this.users.length + this.employees.length + this.leaves.length + this.salaries.length + this.auditLogs.length,
      },
      tables: {
        users: this.users,
        employees: this.employees,
        leaves: this.leaves,
        salaries: this.salaries,
        auditLogs: this.auditLogs,
      },
    };

    const jsonStr = JSON.stringify(fullBackup, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrms_database_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    this.logAudit({
      action: LogAction.IO_BACKUP_EXPORT,
      performedByUsername: 'Sistem',
      performedByRole: Role.ADMIN,
      targetEntity: 'DatabaseEngine',
      details: 'Tüm veritabanı JSON I/O dosyasına dışa aktarıldı.',
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
    });
  }

  /**
   * 2. JSON Dosyasından Veritabanını Geri Yükle (I/O Import)
   */
  public async importFullDatabaseFromJson(jsonContent: string): Promise<{ success: boolean; message: string }> {
    try {
      const data = JSON.parse(jsonContent);
      if (!data.tables || !Array.isArray(data.tables.users) || !Array.isArray(data.tables.employees)) {
        return { success: false, message: 'Geçersiz yedek dosyası formatı!' };
      }

      this.users = data.tables.users;
      this.employees = data.tables.employees;
      this.leaves = data.tables.leaves || [];
      this.salaries = data.tables.salaries || [];
      this.auditLogs = data.tables.auditLogs || [];

      this.persistToLocalStorage();

      this.logAudit({
        action: LogAction.IO_BACKUP_IMPORT,
        performedByUsername: 'Sistem',
        performedByRole: Role.ADMIN,
        targetEntity: 'DatabaseEngine',
        details: 'JSON I/O dosyasından veritabanı başarıyla geri yüklendi.',
        ipAddress: '127.0.0.1',
        status: 'SUCCESS',
      });

      return { success: true, message: 'Veritabanı başarıyla geri yüklendi.' };
    } catch (e: any) {
      return { success: false, message: 'Dosya okunurken hata oluştu: ' + e.message };
    }
  }

  /**
   * 3. Çalışan Listesini CSV Olarak Dışa Aktar (I/O CSV Export)
   */
  public exportEmployeesToCsv(): void {
    const headers = ['ID', 'TC No', 'Ad', 'Soyad', 'E-posta', 'Telefon', 'Departman', 'Pozisyon', 'İstihdam Türü', 'İşe Giriş', 'Brüt Maaş', 'Net Maaş', 'Kalan İzin', 'Aktif Mi'];
    const rows = this.employees.map(e => [
      e.id,
      e.tcNo,
      `"${e.firstName}"`,
      `"${e.lastName}"`,
      e.email,
      e.phone,
      `"${e.department}"`,
      `"${e.position}"`,
      `"${e.employmentType}"`,
      e.hireDate,
      e.baseSalary,
      e.netSalary,
      e.remainingLeaveDays,
      e.isActive ? 'Aktif' : 'Pasif',
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrms_calisanlar_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 4. Audit Loglarını TXT Dosyası Olarak İndir (I/O TXT Export)
   */
  public exportAuditLogsToTxt(): void {
    let txt = `================================================================================\n`;
    txt += `İNSAN KAYNAKLARI YÖNETİM SİSTEMİ (HRMS) - GÜVENLİK VE DENETİM İZİ RAPORU\n`;
    txt += `Geliştirici: Enes Öztürk | Tarih: ${new Date().toLocaleString('tr-TR')}\n`;
    txt += `================================================================================\n\n`;

    this.auditLogs.forEach((log, index) => {
      txt += `[${index + 1}] ZAMAN: ${new Date(log.createdAt).toLocaleString('tr-TR')} | DURUM: ${log.status}\n`;
      txt += `    EYLEM    : ${log.action}\n`;
      txt += `    KULLANICI: ${log.performedByUsername} (${log.performedByRole})\n`;
      txt += `    IP ADRESİ: ${log.ipAddress}\n`;
      txt += `    DETAY    : ${log.details}\n`;
      txt += `--------------------------------------------------------------------------------\n`;
    });

    const blob = new Blob([txt], { type: 'text/plain;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `hrms_audit_logs_${new Date().toISOString().slice(0, 10)}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  /**
   * 5. Sıfırla ve Varsayılan Verileri Geri Getir
   */
  public async resetToDefaults(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY_USERS);
    localStorage.removeItem(STORAGE_KEY_EMPLOYEES);
    localStorage.removeItem(STORAGE_KEY_LEAVES);
    localStorage.removeItem(STORAGE_KEY_SALARIES);
    localStorage.removeItem(STORAGE_KEY_LOGS);
    this.isInitialized = false;
    await this.initialize();
  }
}
