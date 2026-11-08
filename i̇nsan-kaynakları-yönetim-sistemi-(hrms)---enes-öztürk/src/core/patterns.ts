/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Design Patterns & OOP Architecture (Clean Code & S.O.L.I.D)
 * Geliştirici: Enes Öztürk
 * 
 * 1. Strategy Pattern: Maaş / Bordro Hesaplama Stratejisi
 * 2. Builder Pattern: Employee & LeaveRequest nesnelerinin inşası
 * 3. Observer Pattern: AOP / Denetim İzi (Audit Log) Olay Yayımı
 * 4. Factory Pattern: Bordro & Kullanıcı Üretimi
 */

import { Department, EmploymentType, IEmployee, ILeaveRequest, LeaveStatus, LeaveType, Role } from '../models/types';

// =========================================================================
// 1. ABSTRACT ENTITY & INHERITANCE (OOP Temelleri)
// =========================================================================

export abstract class AbstractAuditableEntity {
  public id: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(id?: string) {
    this.id = id || ('entity-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now());
    const now = new Date().toISOString();
    this.createdAt = now;
    this.updatedAt = now;
  }

  public touch(): void {
    this.updatedAt = new Date().toISOString();
  }
}

// =========================================================================
// 2. STRATEGY PATTERN: MAAŞ HESAPLAMA MOTORU (Open/Closed Principle)
// =========================================================================

export interface PayrollCalculationResult {
  baseSalary: number;
  grossSalary: number;
  sgkWorkerShare: number;      // %14 SGK İşçi Payı
  unemploymentShare: number;   // %1 İşsizlik Primi
  incomeTax: number;           // Kümülatif dilim ortalaması (%15 - %20)
  stampTax: number;            // %0.759 Damga Vergisi
  bonus: number;
  deductions: number;
  netSalary: number;
}

export interface IPayrollStrategy {
  calculate(baseSalary: number, bonus?: number, deductions?: number): PayrollCalculationResult;
  getStrategyName(): string;
}

export abstract class AbstractPayrollCalculator implements IPayrollStrategy {
  abstract calculate(baseSalary: number, bonus?: number, deductions?: number): PayrollCalculationResult;
  abstract getStrategyName(): string;

  protected round(num: number): number {
    return Math.round((num + Number.EPSILON) * 100) / 100;
  }
}

/**
 * Tam Zamanlı Bordrolu Çalışan Maaş Stratejisi
 * SGK, İşsizlik, Gelir ve Damga Vergisi kesintileri standart mevzuata göre uygulanır.
 */
export class FullTimePayrollStrategy extends AbstractPayrollCalculator {
  getStrategyName(): string {
    return 'Standart 4A Bordrolu Tam Zamanlı Strateji';
  }

  calculate(baseSalary: number, bonus: number = 0, deductions: number = 0): PayrollCalculationResult {
    const grossSalary = baseSalary + bonus;
    const sgkWorkerShare = this.round(grossSalary * 0.14);
    const unemploymentShare = this.round(grossSalary * 0.01);
    
    // Gelir vergisi matrahı
    const taxBase = grossSalary - (sgkWorkerShare + unemploymentShare);
    const incomeTax = this.round(taxBase * 0.15); // %15 başlangıç dilimi
    const stampTax = this.round(grossSalary * 0.00759); // Damga vergisi

    const totalTaxes = sgkWorkerShare + unemploymentShare + incomeTax + stampTax;
    const netSalary = this.round(grossSalary - totalTaxes - deductions);

    return {
      baseSalary,
      grossSalary,
      sgkWorkerShare,
      unemploymentShare,
      incomeTax,
      stampTax,
      bonus,
      deductions,
      netSalary: Math.max(0, netSalary),
    };
  }
}

/**
 * Yarı Zamanlı Çalışan Maaş Stratejisi
 */
export class PartTimePayrollStrategy extends AbstractPayrollCalculator {
  getStrategyName(): string {
    return 'Yarı Zamanlı (Kısmi Süreli) Strateji';
  }

  calculate(baseSalary: number, bonus: number = 0, deductions: number = 0): PayrollCalculationResult {
    // Yarı zamanlıda oransal SGK ve vergi
    const grossSalary = (baseSalary * 0.6) + bonus;
    const sgkWorkerShare = this.round(grossSalary * 0.14);
    const unemploymentShare = this.round(grossSalary * 0.01);
    const taxBase = grossSalary - (sgkWorkerShare + unemploymentShare);
    const incomeTax = this.round(taxBase * 0.15);
    const stampTax = this.round(grossSalary * 0.00759);
    const netSalary = this.round(grossSalary - (sgkWorkerShare + unemploymentShare + incomeTax + stampTax) - deductions);

    return {
      baseSalary,
      grossSalary,
      sgkWorkerShare,
      unemploymentShare,
      incomeTax,
      stampTax,
      bonus,
      deductions,
      netSalary: Math.max(0, netSalary),
    };
  }
}

/**
 * Sözleşmeli / Danışman Maaş Stratejisi (Stopaj Stratejisi)
 */
export class ContractorPayrollStrategy extends AbstractPayrollCalculator {
  getStrategyName(): string {
    return 'Sözleşmeli / Danışman Stopaj Stratejisi';
  }

  calculate(baseSalary: number, bonus: number = 0, deductions: number = 0): PayrollCalculationResult {
    const grossSalary = baseSalary + bonus;
    const sgkWorkerShare = 0; // Sözleşmeli kendi BAĞ-KUR veya faturası
    const unemploymentShare = 0;
    const incomeTax = this.round(grossSalary * 0.20); // Stopaj %20
    const stampTax = this.round(grossSalary * 0.00948);
    const netSalary = this.round(grossSalary - incomeTax - stampTax - deductions);

    return {
      baseSalary,
      grossSalary,
      sgkWorkerShare,
      unemploymentShare,
      incomeTax,
      stampTax,
      bonus,
      deductions,
      netSalary: Math.max(0, netSalary),
    };
  }
}

/**
 * Strategy Context (Strateji Fabrikası & Seçici)
 */
export class PayrollStrategyContext {
  public static getStrategy(employmentType: EmploymentType): IPayrollStrategy {
    switch (employmentType) {
      case EmploymentType.FULL_TIME:
        return new FullTimePayrollStrategy();
      case EmploymentType.PART_TIME:
        return new PartTimePayrollStrategy();
      case EmploymentType.CONTRACT:
        return new ContractorPayrollStrategy();
      default:
        return new FullTimePayrollStrategy();
    }
  }
}

// =========================================================================
// 3. BUILDER PATTERN: NESNE OLUŞTURMA PATTERNLERİ
// =========================================================================

export class EmployeeBuilder {
  private employee: Partial<IEmployee> = {
    id: 'emp-' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    bonus: 0,
    deductions: 0,
    remainingLeaveDays: 14,
    usedLeaveDays: 0,
    isActive: true,
    employmentType: EmploymentType.FULL_TIME,
    avatarUrl: '',
  };

  public setId(id: string): EmployeeBuilder {
    this.employee.id = id;
    return this;
  }

  public setManagerId(managerId: string): EmployeeBuilder {
    this.employee.managerId = managerId;
    return this;
  }

  public setUserId(userId: string): EmployeeBuilder {
    this.employee.userId = userId;
    return this;
  }

  public setTcNo(tcNo: string): EmployeeBuilder {
    this.employee.tcNo = tcNo;
    return this;
  }

  public setName(firstName: string, lastName: string): EmployeeBuilder {
    this.employee.firstName = firstName;
    this.employee.lastName = lastName;
    return this;
  }

  public setEmail(email: string): EmployeeBuilder {
    this.employee.email = email;
    return this;
  }

  public setPhone(phone: string): EmployeeBuilder {
    this.employee.phone = phone;
    return this;
  }

  public setDepartment(department: Department): EmployeeBuilder {
    this.employee.department = department;
    return this;
  }

  public setPosition(position: string): EmployeeBuilder {
    this.employee.position = position;
    return this;
  }

  public setEmploymentType(type: EmploymentType): EmployeeBuilder {
    this.employee.employmentType = type;
    return this;
  }

  public setDates(hireDate: string, birthDate: string): EmployeeBuilder {
    this.employee.hireDate = hireDate;
    this.employee.birthDate = birthDate;
    return this;
  }

  public setAddress(address: string): EmployeeBuilder {
    this.employee.address = address;
    return this;
  }

  public setSalary(baseSalary: number, bonus: number = 0, deductions: number = 0): EmployeeBuilder {
    this.employee.baseSalary = baseSalary;
    this.employee.bonus = bonus;
    this.employee.deductions = deductions;
    
    // Net maaşı strateji ile anında hesapla
    const strategy = PayrollStrategyContext.getStrategy(this.employee.employmentType || EmploymentType.FULL_TIME);
    const calc = strategy.calculate(baseSalary, bonus, deductions);
    this.employee.netSalary = calc.netSalary;
    return this;
  }

  public setLeaveDays(remaining: number, used: number = 0): EmployeeBuilder {
    this.employee.remainingLeaveDays = remaining;
    this.employee.usedLeaveDays = used;
    return this;
  }

  public setAvatar(avatarUrl: string): EmployeeBuilder {
    this.employee.avatarUrl = avatarUrl;
    return this;
  }

  public build(): IEmployee {
    if (!this.employee.firstName || !this.employee.lastName || !this.employee.email) {
      throw new Error('EmployeeBuilder Hatası: Ad, Soyad ve E-posta zorunludur!');
    }
    return this.employee as IEmployee;
  }
}

export class LeaveRequestBuilder {
  private leave: Partial<ILeaveRequest> = {
    id: 'leave-' + Math.random().toString(36).substr(2, 9),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: LeaveStatus.BEKLIYOR,
  };

  public setEmployee(employeeId: string, employeeName: string, department: Department): LeaveRequestBuilder {
    this.leave.employeeId = employeeId;
    this.leave.employeeName = employeeName;
    this.leave.department = department;
    return this;
  }

  public setLeaveDetails(type: LeaveType, startDate: string, endDate: string, reason: string): LeaveRequestBuilder {
    this.leave.leaveType = type;
    this.leave.startDate = startDate;
    this.leave.endDate = endDate;
    this.leave.reason = reason;

    // Gün farkını hesapla
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    this.leave.totalDays = Math.max(1, diffDays);

    return this;
  }

  public build(): ILeaveRequest {
    if (!this.leave.employeeId || !this.leave.startDate || !this.leave.endDate) {
      throw new Error('LeaveRequestBuilder Hatası: Çalışan ve Tarih aralığı zorunludur!');
    }
    return this.leave as ILeaveRequest;
  }
}

// =========================================================================
// 4. OBSERVER PATTERN: AOP AUDIT LOG EVENT PUBLISHER
// =========================================================================

export type AuditEventListener = (event: any) => void;

export class AuditEventPublisher {
  private static instance: AuditEventPublisher;
  private listeners: AuditEventListener[] = [];

  private constructor() {}

  public static getInstance(): AuditEventPublisher {
    if (!AuditEventPublisher.instance) {
      AuditEventPublisher.instance = new AuditEventPublisher();
    }
    return AuditEventPublisher.instance;
  }

  public subscribe(listener: AuditEventListener): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  public publish(event: any): void {
    this.listeners.forEach(listener => {
      try {
        listener(event);
      } catch (err) {
        console.error('AuditLog listener error:', err);
      }
    });
  }
}
