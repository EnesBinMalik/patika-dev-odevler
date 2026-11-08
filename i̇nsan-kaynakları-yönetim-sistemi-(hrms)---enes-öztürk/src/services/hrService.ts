/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Spring Boot Katmanlı Mimari - Servis Katmanı (Service Layer)
 * Geliştirici: Enes Öztürk
 * 
 * OOP (Interface, Abstract, Inheritance), Stream API ve Optional kullanımı
 * S.O.L.I.D Prensipleri: Single Responsibility, Dependency Inversion
 */

import { DatabaseEngine, hashPassword } from '../core/database';
import { EmployeeBuilder, LeaveRequestBuilder, PayrollStrategyContext } from '../core/patterns';
import { Optional, Stream } from '../core/stream';
import {
    CreateEmployeeDto,
    CreateLeaveRequestDto,
    Department,
    EmploymentType,
    IAuditLog,
    IEmployee,
    ILeaveRequest,
    ISalaryRecord,
    IUser,
    LeaveStatus,
    LeaveType,
    LogAction,
    LoginDto,
    Page,
    Pageable,
    RegisterDto,
    Role
} from '../models/types';

// =========================================================================
// 1. REPOSITORY INTERFACES & IMPLEMENTATIONS (Data Access Layer)
// =========================================================================

export interface IBaseRepository<T, ID> {
  findById(id: ID): Optional<T>;
  findAll(): Stream<T>;
  save(entity: T): T;
  deleteById(id: ID): void;
}

export class EmployeeRepository implements IBaseRepository<IEmployee, string> {
  private db = DatabaseEngine.getInstance();

  findById(id: string): Optional<IEmployee> {
    const list = this.db.getEmployees();
    const found = list.find(e => e.id === id);
    return Optional.ofNullable(found);
  }

  findByUserId(userId: string): Optional<IEmployee> {
    const list = this.db.getEmployees();
    const found = list.find(e => e.userId === userId);
    return Optional.ofNullable(found);
  }

  findAll(): Stream<IEmployee> {
    return Stream.of(this.db.getEmployees());
  }

  save(entity: IEmployee): IEmployee {
    this.db.saveEmployee(entity);
    return entity;
  }

  deleteById(id: string): void {
    this.db.deleteEmployee(id);
  }
}

export class UserRepository implements IBaseRepository<IUser, string> {
  private db = DatabaseEngine.getInstance();

  findById(id: string): Optional<IUser> {
    const list = this.db.getUsers();
    return Optional.ofNullable(list.find(u => u.id === id));
  }

  findByUsernameOrEmail(identifier: string): Optional<IUser> {
    const clean = identifier.trim().toLowerCase();
    const list = this.db.getUsers();
    const found = list.find(u => u.username.toLowerCase() === clean || u.email.toLowerCase() === clean);
    return Optional.ofNullable(found);
  }

  findAll(): Stream<IUser> {
    return Stream.of(this.db.getUsers());
  }

  save(entity: IUser): IUser {
    this.db.saveUser(entity);
    return entity;
  }

  deleteById(id: string): void {
    // Soft delete or no-op
  }
}

export class LeaveRepository implements IBaseRepository<ILeaveRequest, string> {
  private db = DatabaseEngine.getInstance();

  findById(id: string): Optional<ILeaveRequest> {
    return Optional.ofNullable(this.db.getLeaves().find(l => l.id === id));
  }

  findAll(): Stream<ILeaveRequest> {
    return Stream.of(this.db.getLeaves());
  }

  findByEmployeeId(empId: string): Stream<ILeaveRequest> {
    return Stream.of(this.db.getLeaves()).filter(l => l.employeeId === empId);
  }

  save(entity: ILeaveRequest): ILeaveRequest {
    this.db.saveLeave(entity);
    return entity;
  }

  deleteById(id: string): void {}
}

export class SalaryRepository implements IBaseRepository<ISalaryRecord, string> {
  private db = DatabaseEngine.getInstance();

  findById(id: string): Optional<ISalaryRecord> {
    return Optional.ofNullable(this.db.getSalaries().find(s => s.id === id));
  }

  findAll(): Stream<ISalaryRecord> {
    return Stream.of(this.db.getSalaries());
  }

  findByEmployeeId(empId: string): Stream<ISalaryRecord> {
    return Stream.of(this.db.getSalaries()).filter(s => s.employeeId === empId);
  }

  save(entity: ISalaryRecord): ISalaryRecord {
    this.db.saveSalaryRecord(entity);
    return entity;
  }

  deleteById(id: string): void {}
}

// =========================================================================
// 2. SERVICE LAYER (Business Logic with Stream API & Optional)
// =========================================================================

export class HRService {
  private static instance: HRService;

  private employeeRepo = new EmployeeRepository();
  private userRepo = new UserRepository();
  private leaveRepo = new LeaveRepository();
  private salaryRepo = new SalaryRepository();
  private db = DatabaseEngine.getInstance();

  // Aktif oturum (Spring Security SecurityContext simulation)
  private currentUser: IUser | null = null;

  private constructor() {}

  public static getInstance(): HRService {
    if (!HRService.instance) {
      HRService.instance = new HRService();
    }
    return HRService.instance;
  }

  // ==========================================
  // AUTHENTICATION & SPRING SECURITY LOGIC
  // ==========================================

  public getCurrentUser(): IUser | null {
    return this.currentUser;
  }

  public setCurrentUser(user: IUser | null): void {
    this.currentUser = user;
  }

  /**
   * Spring Security Login Metodu
   * 3 hatalı girişte hesap bloke edilir.
   */
  public async login(dto: LoginDto): Promise<{ success: boolean; message: string; user?: IUser }> {
    const userOpt = this.userRepo.findByUsernameOrEmail(dto.usernameOrEmail);

    if (userOpt.isEmpty()) {
      this.db.logAudit({
        action: LogAction.LOGIN_FAILED,
        performedByUsername: dto.usernameOrEmail,
        performedByRole: Role.USER,
        targetEntity: 'AuthService',
        details: `Var olmayan kullanıcı ile giriş denemesi: ${dto.usernameOrEmail}`,
        ipAddress: '192.168.1.100',
        status: 'FAILURE',
      });
      return { success: false, message: 'Kullanıcı adı veya şifre hatalı!' };
    }

    const user = userOpt.get();

    // 1. Hesap bloke kontrolü
    if (user.isLocked) {
      this.db.logAudit({
        action: LogAction.ACCOUNT_LOCKED,
        performedByUsername: user.username,
        performedByRole: user.role,
        targetEntity: 'AuthService',
        details: 'Bloke edilmiş hesap ile giriş denemesi engellendi.',
        ipAddress: '192.168.1.100',
        status: 'WARNING',
      });
      return {
        success: false,
        message: 'Hesabınız 3 defa hatalı şifre girildiği için bloke edilmiştir! Lütfen İnsan Kaynakları yöneticisi ile iletişime geçiniz.',
      };
    }

    // 2. Şifre hash kontrolü
    const enteredHash = await hashPassword(dto.password);
    if (enteredHash !== user.passwordHash) {
      user.failedLoginAttempts += 1;

      if (user.failedLoginAttempts >= 3) {
        user.isLocked = true;
        user.lockoutTime = new Date().toISOString();
        this.userRepo.save(user);

        this.db.logAudit({
          action: LogAction.ACCOUNT_LOCKED,
          performedByUsername: user.username,
          performedByRole: user.role,
          targetEntity: 'IUser',
          entityId: user.id,
          details: `3 hatalı giriş denemesi yapıldı. Hesap bloke edildi.`,
          ipAddress: '192.168.1.100',
          status: 'WARNING',
        });

        return {
          success: false,
          message: '3 kez hatalı şifre girdiniz! Hesabınız güvenlik nedeniyle bloke edildi. İK yöneticiniz kilidi açmalıdır.',
        };
      } else {
        this.userRepo.save(user);

        this.db.logAudit({
          action: LogAction.LOGIN_FAILED,
          performedByUsername: user.username,
          performedByRole: user.role,
          targetEntity: 'IUser',
          entityId: user.id,
          details: `Hatalı şifre denemesi. (${user.failedLoginAttempts}/3 deneme)`,
          ipAddress: '192.168.1.100',
          status: 'FAILURE',
        });

        const remainingAttempts = 3 - user.failedLoginAttempts;
        return {
          success: false,
          message: `Hatalı şifre! Kalan deneme hakkınız: ${remainingAttempts}`,
        };
      }
    }

    // Başarılı giriş
    user.failedLoginAttempts = 0;
    this.userRepo.save(user);
    this.currentUser = user;

    this.db.logAudit({
      action: LogAction.LOGIN_SUCCESS,
      performedByUsername: user.username,
      performedByRole: user.role,
      targetEntity: 'AuthService',
      details: `${user.role} yetkisi ile sisteme başarılı oturum açıldı.`,
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
    });

    return { success: true, message: 'Giriş başarılı!', user };
  }

  /**
   * Yeni Kullanıcı ve Çalışan Kaydı (Register)
   */
  public async register(dto: RegisterDto): Promise<{ success: boolean; message: string; user?: IUser }> {
    const existingOpt = this.userRepo.findByUsernameOrEmail(dto.username);
    if (existingOpt.isPresent()) {
      return { success: false, message: 'Bu kullanıcı adı veya e-posta zaten kullanımda!' };
    }

    const passwordHash = await hashPassword(dto.password);
    const userId = 'usr-' + Math.random().toString(36).substr(2, 9);
    const empId = 'emp-' + Math.random().toString(36).substr(2, 9);

    const newUser: IUser = {
      id: userId,
      username: dto.username.toLowerCase().trim(),
      email: dto.email.toLowerCase().trim(),
      passwordHash,
      role: Role.USER, // Yeni kayıtlar varsayılan USER (çalışan)
      failedLoginAttempts: 0,
      isLocked: false,
      employeeId: empId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const newEmployee = new EmployeeBuilder()
      .setId(empId)
      .setUserId(userId)
      .setManagerId('usr-admin-01') // Varsayılan İK Yöneticisi Enes Öztürk
      .setName(dto.firstName, dto.lastName)
      .setTcNo(dto.tcNo || '11111111111')
      .setEmail(dto.email)
      .setPhone(dto.phone || '+90 500 000 0000')
      .setDepartment(dto.department || Department.IT)
      .setPosition(dto.position || 'Yazılım Uzmanı')
      .setEmploymentType(EmploymentType.FULL_TIME)
      .setDates(new Date().toISOString().slice(0, 10), '1998-01-01')
      .setAddress('İstanbul, Türkiye')
      .setSalary(65000, 2000, 0)
      .setLeaveDays(14, 0)
      .build();

    this.userRepo.save(newUser);
    this.employeeRepo.save(newEmployee);

    this.db.logAudit({
      action: LogAction.REGISTER_USER,
      performedByUsername: newUser.username,
      performedByRole: Role.USER,
      targetEntity: 'IUser',
      entityId: userId,
      details: `Yeni çalışan kayıt oldu: ${newEmployee.firstName} ${newEmployee.lastName} (${newEmployee.department})`,
      ipAddress: '192.168.1.100',
      status: 'SUCCESS',
    });

    return { success: true, message: 'Kayıt başarılı! Şimdi giriş yapabilirsiniz.', user: newUser };
  }

  /**
   * Bloke Olmuş Kullanıcının Kilidini Açma (Sadece İK Admin Yetkisi)
   */
  public unlockUser(userId: string): { success: boolean; message: string } {
    const userOpt = this.userRepo.findById(userId);
    if (userOpt.isEmpty()) {
      return { success: false, message: 'Kullanıcı bulunamadı.' };
    }

    const user = userOpt.get();
    user.isLocked = false;
    user.failedLoginAttempts = 0;
    user.lockoutTime = undefined;
    this.userRepo.save(user);

    this.db.logAudit({
      action: LogAction.ACCOUNT_UNLOCKED,
      performedByUsername: this.currentUser?.username || 'Admin',
      performedByRole: Role.ADMIN,
      targetEntity: 'IUser',
      entityId: user.id,
      details: `${user.username} kullanıcısının hesap blokesi İK tarafından kaldırıldı.`,
      ipAddress: '192.168.1.10',
      status: 'SUCCESS',
    });

    return { success: true, message: `${user.username} kullanıcısının blokesi başarıyla kaldırıldı.` };
  }

  // ==========================================
  // EMPLOYEE MANAGEMENT (Stream API & Pagination)
  // ==========================================

  /**
   * Paging & Filter desteği ile çalışan listeleme
   */
  public getEmployeesPaged(
    pageable: Pageable,
    search?: string,
    departmentFilter?: string,
    statusFilter?: string
  ): Page<IEmployee> {
    let stream = this.employeeRepo.findAll();

    // 1. Search filtresi (Stream API .filter())
    if (search && search.trim() !== '') {
      const q = search.toLowerCase().trim();
      stream = stream.filter(e =>
        `${e.firstName} ${e.lastName}`.toLowerCase().includes(q) ||
        e.email.toLowerCase().includes(q) ||
        e.position.toLowerCase().includes(q) ||
        e.tcNo.includes(q)
      );
    }

    // 2. Departman filtresi
    if (departmentFilter && departmentFilter !== 'ALL') {
      stream = stream.filter(e => e.department === departmentFilter);
    }

    // 3. Durum filtresi (Aktif / Pasif)
    if (statusFilter && statusFilter !== 'ALL') {
      const isAct = statusFilter === 'ACTIVE';
      stream = stream.filter(e => e.isActive === isAct);
    }

    const allFiltered = stream.sorted((a, b) => b.createdAt.localeCompare(a.createdAt)).toList();
    const totalElements = allFiltered.length;
    const totalPages = Math.ceil(totalElements / pageable.pageSize) || 1;

    // Sayfalama (Stream API .skip() & .limit())
    const pagedContent = Stream.of(allFiltered)
      .skip(pageable.pageNumber * pageable.pageSize)
      .limit(pageable.pageSize)
      .toList();

    return {
      content: pagedContent,
      pageNumber: pageable.pageNumber,
      pageSize: pageable.pageSize,
      totalElements,
      totalPages,
      isFirst: pageable.pageNumber === 0,
      isLast: pageable.pageNumber >= totalPages - 1,
      hasNext: pageable.pageNumber < totalPages - 1,
      hasPrevious: pageable.pageNumber > 0,
    };
  }

  public getEmployeeById(id: string): Optional<IEmployee> {
    return this.employeeRepo.findById(id);
  }

  public getEmployeeByUserId(userId: string): Optional<IEmployee> {
    return this.employeeRepo.findByUserId(userId);
  }

  /**
   * Yeni Çalışan Ekleme (Builder Pattern Kullanımı)
   */
  public createEmployee(dto: CreateEmployeeDto): IEmployee {
    const emp = new EmployeeBuilder()
      .setManagerId(dto.managerId || 'usr-admin-01')
      .setUserId('usr-' + Math.random().toString(36).substr(2, 9))
      .setTcNo(dto.tcNo)
      .setName(dto.firstName, dto.lastName)
      .setEmail(dto.email)
      .setPhone(dto.phone)
      .setDepartment(dto.department)
      .setPosition(dto.position)
      .setEmploymentType(dto.employmentType)
      .setDates(dto.hireDate, dto.birthDate)
      .setAddress(dto.address)
      .setSalary(dto.baseSalary, dto.bonus || 0, dto.deductions || 0)
      .setLeaveDays(dto.remainingLeaveDays || 14, 0)
      .build();

    this.employeeRepo.save(emp);

    this.db.logAudit({
      action: LogAction.CREATE_EMPLOYEE,
      performedByUsername: this.currentUser?.username || 'Admin',
      performedByRole: Role.ADMIN,
      targetEntity: 'IEmployee',
      entityId: emp.id,
      details: `${emp.firstName} ${emp.lastName} sisteme eklendi. (Maaş: ${emp.baseSalary} TL)`,
      ipAddress: '192.168.1.10',
      status: 'SUCCESS',
    });

    return emp;
  }

  /**
   * Çalışan Bilgilerini Güncelleme
   */
  public updateEmployee(employee: IEmployee): IEmployee {
    // Net maaşı yeniden hesapla
    const strategy = PayrollStrategyContext.getStrategy(employee.employmentType);
    const calc = strategy.calculate(employee.baseSalary, employee.bonus, employee.deductions);
    employee.netSalary = calc.netSalary;

    this.employeeRepo.save(employee);

    this.db.logAudit({
      action: LogAction.UPDATE_EMPLOYEE,
      performedByUsername: this.currentUser?.username || 'Admin',
      performedByRole: Role.ADMIN,
      targetEntity: 'IEmployee',
      entityId: employee.id,
      details: `${employee.firstName} ${employee.lastName} bilgileri güncellendi.`,
      ipAddress: '192.168.1.10',
      status: 'SUCCESS',
    });

    return employee;
  }

  /**
   * Çalışan Durumunu Değiştir (Aktif / Pasif)
   */
  public toggleEmployeeActive(id: string): Optional<IEmployee> {
    const opt = this.employeeRepo.findById(id);
    opt.ifPresent(e => {
      e.isActive = !e.isActive;
      this.employeeRepo.save(e);

      this.db.logAudit({
        action: LogAction.UPDATE_EMPLOYEE,
        performedByUsername: this.currentUser?.username || 'Admin',
        performedByRole: Role.ADMIN,
        targetEntity: 'IEmployee',
        entityId: e.id,
        details: `${e.firstName} ${e.lastName} durumu ${e.isActive ? 'AKTİF' : 'PASİF'} olarak güncellendi.`,
        ipAddress: '192.168.1.10',
        status: 'SUCCESS',
      });
    });
    return opt;
  }

  // ==========================================
  // SALARY & PAYROLL MANAGEMENT (Hangi çalışana ne kadar maaş veriliyor)
  // ==========================================

  public getAllSalaries(): Stream<ISalaryRecord> {
    return this.salaryRepo.findAll().sorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public getSalariesByEmployee(employeeId: string): Stream<ISalaryRecord> {
    return this.salaryRepo.findByEmployeeId(employeeId).sorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public updateEmployeeSalary(
    employeeId: string,
    baseSalary: number,
    bonus: number = 0,
    deductions: number = 0
  ): Optional<IEmployee> {
    const opt = this.employeeRepo.findById(employeeId);
    opt.ifPresent(emp => {
      emp.baseSalary = baseSalary;
      emp.bonus = bonus;
      emp.deductions = deductions;

      const strategy = PayrollStrategyContext.getStrategy(emp.employmentType);
      const calc = strategy.calculate(baseSalary, bonus, deductions);
      emp.netSalary = calc.netSalary;

      this.employeeRepo.save(emp);

      // Yeni bordro kaydı ekle
      const newSalaryRecord: ISalaryRecord = {
        id: 'sal-' + emp.id + '-' + Date.now(),
        employeeId: emp.id,
        employeeName: `${emp.firstName} ${emp.lastName}`,
        tcNo: emp.tcNo,
        department: emp.department,
        periodMonth: new Date().getMonth() + 1,
        periodYear: new Date().getFullYear(),
        baseSalary: calc.baseSalary,
        sgkWorkerShare: calc.sgkWorkerShare,
        unemploymentShare: calc.unemploymentShare,
        incomeTax: calc.incomeTax,
        stampTax: calc.stampTax,
        bonus: calc.bonus,
        deductions: calc.deductions,
        netSalary: calc.netSalary,
        paymentStatus: 'ODENDI',
        paymentDate: new Date().toISOString().slice(0, 10),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.salaryRepo.save(newSalaryRecord);

      this.db.logAudit({
        action: LogAction.UPDATE_SALARY,
        performedByUsername: this.currentUser?.username || 'Admin',
        performedByRole: Role.ADMIN,
        targetEntity: 'ISalaryRecord',
        entityId: emp.id,
        details: `${emp.firstName} ${emp.lastName} maaşı güncellendi: Brüt ${baseSalary} TL -> Net ${calc.netSalary} TL.`,
        ipAddress: '192.168.1.10',
        status: 'SUCCESS',
      });
    });

    return opt;
  }

  // ==========================================
  // LEAVE MANAGEMENT (Hangi çalışanın hangi gün izin verildiği)
  // ==========================================

  public getAllLeaves(): Stream<ILeaveRequest> {
    return this.leaveRepo.findAll().sorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  public getLeavesByEmployee(empId: string): Stream<ILeaveRequest> {
    return this.leaveRepo.findByEmployeeId(empId).sorted((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  /**
   * İzin Talebi Oluşturma (Çalışan Tarafı)
   */
  public createLeaveRequest(dto: CreateLeaveRequestDto): ILeaveRequest {
    const empOpt = this.employeeRepo.findById(dto.employeeId);
    const emp = empOpt.orElseThrow(() => new Error('Çalışan bulunamadı.'));

    const leave = new LeaveRequestBuilder()
      .setEmployee(emp.id, `${emp.firstName} ${emp.lastName}`, emp.department)
      .setLeaveDetails(dto.leaveType, dto.startDate, dto.endDate, dto.reason)
      .build();

    this.leaveRepo.save(leave);

    this.db.logAudit({
      action: LogAction.CREATE_LEAVE_REQUEST,
      performedByUsername: this.currentUser?.username || emp.firstName,
      performedByRole: Role.USER,
      targetEntity: 'ILeaveRequest',
      entityId: leave.id,
      details: `${emp.firstName} ${emp.lastName} (${dto.startDate} - ${dto.endDate}) için ${leave.totalDays} gün ${dto.leaveType} talebinde bulundu.`,
      ipAddress: '192.168.1.50',
      status: 'SUCCESS',
    });

    return leave;
  }

  /**
   * İzin Talebini Onaylama (İnsan Kaynakları Uzmanı)
   */
  public approveLeave(leaveId: string, adminNotes?: string): Optional<ILeaveRequest> {
    const leaveOpt = this.leaveRepo.findById(leaveId);
    leaveOpt.ifPresent(leave => {
      leave.status = LeaveStatus.ONAYLANDI;
      leave.approvedByAdminId = this.currentUser?.id || 'usr-admin-01';
      leave.adminNotes = adminNotes || 'İzin talebi İK tarafından onaylanmıştır.';
      leave.decisionDate = new Date().toISOString();
      this.leaveRepo.save(leave);

      // Çalışanın kalan izin hakkından düş
      const empOpt = this.employeeRepo.findById(leave.employeeId);
      empOpt.ifPresent(emp => {
        emp.remainingLeaveDays = Math.max(0, emp.remainingLeaveDays - leave.totalDays);
        emp.usedLeaveDays += leave.totalDays;
        this.employeeRepo.save(emp);
      });

      this.db.logAudit({
        action: LogAction.APPROVE_LEAVE,
        performedByUsername: this.currentUser?.username || 'Admin',
        performedByRole: Role.ADMIN,
        targetEntity: 'ILeaveRequest',
        entityId: leave.id,
        details: `${leave.employeeName} için ${leave.totalDays} günlük izin onaylandı (${leave.startDate} - ${leave.endDate}).`,
        ipAddress: '192.168.1.10',
        status: 'SUCCESS',
      });
    });

    return leaveOpt;
  }

  /**
   * İzin Talebini Reddetme
   */
  public rejectLeave(leaveId: string, reason: string): Optional<ILeaveRequest> {
    const leaveOpt = this.leaveRepo.findById(leaveId);
    leaveOpt.ifPresent(leave => {
      leave.status = LeaveStatus.REDDEDILDI;
      leave.approvedByAdminId = this.currentUser?.id || 'usr-admin-01';
      leave.adminNotes = reason || 'Operasyonel yoğunluk nedeniyle reddedildi.';
      leave.decisionDate = new Date().toISOString();
      this.leaveRepo.save(leave);

      this.db.logAudit({
        action: LogAction.REJECT_LEAVE,
        performedByUsername: this.currentUser?.username || 'Admin',
        performedByRole: Role.ADMIN,
        targetEntity: 'ILeaveRequest',
        entityId: leave.id,
        details: `${leave.employeeName} için izin talebi reddedildi. Gerekçe: ${reason}`,
        ipAddress: '192.168.1.10',
        status: 'WARNING',
      });
    });

    return leaveOpt;
  }

  // ==========================================
  // AUDIT LOGGING & SYSTEM STATS
  // ==========================================

  public getAuditLogs(): Stream<IAuditLog> {
    return Stream.of(this.db.getAuditLogs());
  }

  public getDashboardMetrics() {
    const employees = this.employeeRepo.findAll().toList();
    const activeEmployees = employees.filter(e => e.isActive);
    const totalPayrollGross = Stream.of(employees).sum(e => e.baseSalary + (e.bonus || 0));
    const totalPayrollNet = Stream.of(employees).sum(e => e.netSalary);
    const pendingLeaves = this.leaveRepo.findAll().filter(l => l.status === LeaveStatus.BEKLIYOR).count();
    const lockedUsers = this.userRepo.findAll().filter(u => u.isLocked).count();

    // Bugün veya aktif dönemde kimler izinli?
    const today = new Date().toISOString().slice(0, 10);
    const currentlyOnLeave = this.leaveRepo.findAll()
      .filter(l => l.status === LeaveStatus.ONAYLANDI && l.startDate <= today && l.endDate >= today)
      .toList();

    return {
      totalEmployees: employees.length,
      activeEmployees: activeEmployees.length,
      totalPayrollGross,
      totalPayrollNet,
      pendingLeaves,
      lockedUsers,
      currentlyOnLeave,
    };
  }
}
