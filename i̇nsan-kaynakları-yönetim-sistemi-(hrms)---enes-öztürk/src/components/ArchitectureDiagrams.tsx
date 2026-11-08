/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * UML & Database EER Diyagramları, S.O.L.I.D ve Katmanlı Mimari Rehberi
 * Hazırlayan: Enes Öztürk
 */

import React, { useState } from 'react';
import { 
  Layers, 
  Database, 
  GitBranch, 
  CheckCircle, 
  BookOpen, 
  Code2, 
  FileText, 
  ExternalLink,
  Shield,
  Server
} from 'lucide-react';

export const ArchitectureDiagrams: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'uml' | 'eer' | 'layered' | 'solid' | 'swagger'>('uml');

  return (
    <div className="space-y-6">
      {/* Üst Başlık & İmzası */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Sistem Mimarisi & Akademik Rapor</span>
            <span>·</span>
            <span>Enes Öztürk İmzalı</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            UML, EER Veritabanı Modeli & S.O.L.I.D Katmanlı Mimari
          </h2>
          <p className="text-sm text-slate-600 mt-1 max-w-2xl">
            Spring Boot 3.x kurallarına ve Clean Code prensiplerine uygun olarak tasarlanan İnsan Kaynakları Yönetim Sistemi mimari diyagramları ve tasarım desenleri.
          </p>
        </div>

        {/* Tab Geçiş Düğmeleri */}
        <div className="flex flex-wrap items-center gap-1.5 p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setActiveTab('uml')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'uml' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            UML Sınıf Diyagramı
          </button>
          <button
            onClick={() => setActiveTab('eer')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'eer' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Database EER Modeli
          </button>
          <button
            onClick={() => setActiveTab('layered')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'layered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Katmanlı Mimari Akışı
          </button>
          <button
            onClick={() => setActiveTab('solid')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'solid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            S.O.L.I.D & Tasarım Desenleri
          </button>
          <button
            onClick={() => setActiveTab('swagger')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
              activeTab === 'swagger' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Swagger API Dokümanı
          </button>
        </div>
      </div>

      {/* 1. TAB: UML SINIF DİYAGRAMI */}
      {activeTab === 'uml' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-600" />
                UML Sınıf Diyagramı (Class Diagram - OOP & Inheritance)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Interface, Abstract Class, Concrete Entities, Strategy Pattern ve Repository hiyerarşisi
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              UML 2.5 Specification
            </span>
          </div>

          {/* Görsel UML Tablosu / Blokları */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Interface & Abstract */}
            <div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4 space-y-3">
              <div className="text-center border-b border-indigo-200 pb-2">
                <span className="text-[11px] font-mono text-indigo-600 block">&lt;&lt;interface&gt;&gt;</span>
                <span className="font-bold text-slate-900 text-sm">IBaseEntity</span>
              </div>
              <div className="text-xs font-mono text-slate-700 space-y-1">
                <div>+ id: String</div>
                <div>+ createdAt: DateTime</div>
                <div>+ updatedAt: DateTime</div>
              </div>
            </div>

            <div className="border border-indigo-200 bg-indigo-50/30 rounded-lg p-4 space-y-3">
              <div className="text-center border-b border-indigo-200 pb-2">
                <span className="text-[11px] font-mono text-indigo-600 block">&lt;&lt;abstract&gt;&gt;</span>
                <span className="font-bold text-slate-900 text-sm">AbstractAuditableEntity</span>
              </div>
              <div className="text-xs font-mono text-slate-700 space-y-1">
                <div># id: String</div>
                <div># createdAt: DateTime</div>
                <div># updatedAt: DateTime</div>
                <div className="pt-1 border-t border-indigo-100 text-indigo-800">+ touch(): void</div>
              </div>
            </div>

            <div className="border border-emerald-200 bg-emerald-50/30 rounded-lg p-4 space-y-3">
              <div className="text-center border-b border-emerald-200 pb-2">
                <span className="text-[11px] font-mono text-emerald-700 block">&lt;&lt;interface&gt;&gt;</span>
                <span className="font-bold text-slate-900 text-sm">IPayrollStrategy</span>
              </div>
              <div className="text-xs font-mono text-slate-700 space-y-1">
                <div>+ calculate(base, bonus, ded): Result</div>
                <div>+ getStrategyName(): String</div>
              </div>
            </div>
          </div>

          {/* Somut Sınıflar (Concrete Classes) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {/* User */}
            <div className="border border-slate-300 bg-white rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="text-center border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-mono block">&lt;&lt;Entity&gt;&gt; extends AbstractAuditableEntity</span>
                <span className="font-bold text-slate-900 text-sm">User (Kullanıcı)</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>- username: String</div>
                <div>- email: String</div>
                <div>- passwordHash: String <span className="text-slate-400">// Maskelenmiş</span></div>
                <div>- role: Role <span className="text-indigo-600">(ADMIN | USER)</span></div>
                <div>- failedLoginAttempts: int <span className="text-rose-600">(Max 3)</span></div>
                <div>- isLocked: boolean</div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-indigo-700">
                + resetLockout(): void<br/>
                + recordFailedAttempt(): void
              </div>
            </div>

            {/* Employee */}
            <div className="border border-slate-300 bg-white rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="text-center border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-mono block">&lt;&lt;Entity&gt;&gt; extends AbstractAuditableEntity</span>
                <span className="font-bold text-slate-900 text-sm">Employee (Çalışan)</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>- managerId: String <span className="text-amber-600 font-bold">@ManyToOne Admin</span></div>
                <div>- tcNo: String</div>
                <div>- firstName: String</div>
                <div>- lastName: String</div>
                <div>- department: Department</div>
                <div>- baseSalary: Double</div>
                <div>- netSalary: Double</div>
                <div>- remainingLeaveDays: int</div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-indigo-700">
                + calculatePayroll(): void<br/>
                + deductLeave(days: int): void
              </div>
            </div>

            {/* LeaveRequest */}
            <div className="border border-slate-300 bg-white rounded-lg p-4 space-y-3 shadow-2xs">
              <div className="text-center border-b border-slate-200 pb-2">
                <span className="text-[10px] text-slate-400 font-mono block">&lt;&lt;Entity&gt;&gt; extends AbstractAuditableEntity</span>
                <span className="font-bold text-slate-900 text-sm">LeaveRequest (İzin)</span>
              </div>
              <div className="text-xs font-mono text-slate-600 space-y-1">
                <div>- employeeId: String <span className="text-amber-600 font-bold">@ManyToOne Emp</span></div>
                <div>- leaveType: LeaveType</div>
                <div>- startDate: LocalDate</div>
                <div>- endDate: LocalDate</div>
                <div>- totalDays: int</div>
                <div>- status: LeaveStatus</div>
              </div>
              <div className="pt-2 border-t border-slate-100 text-[11px] font-mono text-indigo-700">
                + approve(adminId): void<br/>
                + reject(reason): void
              </div>
            </div>
          </div>

          {/* Tasarım Deseni Hiyerarşisi */}
          <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              UML İlişki Notasyonu & Design Pattern Entegrasyonu
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs text-slate-600">
              <div className="bg-white p-3 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1">1. Strategy Pattern:</strong>
                <code className="text-indigo-600 font-mono">FullTimePayrollStrategy</code>, <code className="text-indigo-600 font-mono">PartTimePayrollStrategy</code> ve <code className="text-indigo-600 font-mono">ContractorPayrollStrategy</code> sınıfları <code className="font-mono">IPayrollStrategy</code> arayüzünü uygular.
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1">2. Builder Pattern:</strong>
                <code className="text-indigo-600 font-mono">EmployeeBuilder</code> ve <code className="text-indigo-600 font-mono">LeaveRequestBuilder</code> karmaşık nesne inşasını ve veri tutarlılığını garanti eder.
              </div>
              <div className="bg-white p-3 rounded border border-slate-200">
                <strong className="text-slate-900 block mb-1">3. Observer Pattern:</strong>
                <code className="text-indigo-600 font-mono">AuditEventPublisher</code> yapılan her mutasyonu dinleyici AOP servisine bildirerek asenkron audit log kaydı oluşturur.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB: DATABASE EER DİYAGRAMI */}
      {activeTab === 'eer' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Database className="w-5 h-5 text-indigo-600" />
                Veritabanı EER (Enhanced Entity-Relationship) Modeli
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Spring Data JPA (@OneToMany, @ManyToOne), İlişkisel Tablolar, PK/FK Kısıtları
              </p>
            </div>
            <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200">
              Relational Integrity · 3NF
            </span>
          </div>

          {/* EER Tablo Şemaları */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Table: USERS */}
            <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between">
                <span className="font-mono font-bold text-xs">TABLE: USERS</span>
                <span className="text-[10px] bg-slate-700 px-1.5 py-0.5 rounded">Core Security</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                <div className="p-2.5 bg-indigo-50/50 flex justify-between font-semibold text-indigo-900">
                  <span>PK id (VARCHAR 36)</span>
                  <span className="text-slate-400">NOT NULL</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>username (VARCHAR 50)</span>
                  <span className="text-emerald-600">UNIQUE</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>email (VARCHAR 100)</span>
                  <span className="text-emerald-600">UNIQUE</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>password_hash (VARCHAR 64)</span>
                  <span className="text-rose-600">SHA-256 MASKED</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>role (VARCHAR 20)</span>
                  <span className="text-slate-500">ENUM (ADMIN, USER)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>failed_login_attempts (INT)</span>
                  <span className="text-amber-600">DEFAULT 0 (Max 3)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>is_locked (BOOLEAN)</span>
                  <span className="text-slate-500">DEFAULT FALSE</span>
                </div>
                <div className="p-2.5 flex justify-between bg-amber-50/50">
                  <span>FK employee_id (VARCHAR 36)</span>
                  <span className="text-amber-700">1:1 REL WITH EMPLOYEES</span>
                </div>
              </div>
            </div>

            {/* Table: EMPLOYEES */}
            <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-indigo-900 text-white px-4 py-2 flex items-center justify-between">
                <span className="font-mono font-bold text-xs">TABLE: EMPLOYEES</span>
                <span className="text-[10px] bg-indigo-700 px-1.5 py-0.5 rounded">HR Master</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                <div className="p-2.5 bg-indigo-50/50 flex justify-between font-semibold text-indigo-900">
                  <span>PK id (VARCHAR 36)</span>
                  <span className="text-slate-400">NOT NULL</span>
                </div>
                <div className="p-2.5 flex justify-between bg-amber-50/50">
                  <span>FK manager_id (VARCHAR 36)</span>
                  <span className="text-amber-800 font-bold">@ManyToOne ADMIN (1:N)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>tc_no (CHAR 11)</span>
                  <span className="text-emerald-600">UNIQUE</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>first_name, last_name</span>
                  <span className="text-slate-400">VARCHAR 50</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>department, position</span>
                  <span className="text-slate-400">VARCHAR 80</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>base_salary, net_salary</span>
                  <span className="text-slate-500">DECIMAL (12, 2)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>remaining_leave_days</span>
                  <span className="text-slate-500">INT (DEFAULT 14)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>is_active (BOOLEAN)</span>
                  <span className="text-slate-500">DEFAULT TRUE</span>
                </div>
              </div>
            </div>

            {/* Table: LEAVE_REQUESTS */}
            <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-emerald-900 text-white px-4 py-2 flex items-center justify-between">
                <span className="font-mono font-bold text-xs">TABLE: LEAVE_REQUESTS</span>
                <span className="text-[10px] bg-emerald-700 px-1.5 py-0.5 rounded">Workflow</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                <div className="p-2.5 bg-indigo-50/50 flex justify-between font-semibold text-indigo-900">
                  <span>PK id (VARCHAR 36)</span>
                  <span className="text-slate-400">NOT NULL</span>
                </div>
                <div className="p-2.5 flex justify-between bg-amber-50/50">
                  <span>FK employee_id (VARCHAR 36)</span>
                  <span className="text-amber-800 font-bold">@ManyToOne EMPLOYEE</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>leave_type</span>
                  <span className="text-slate-500">ENUM (YILLIK, RAPOR...)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>start_date, end_date</span>
                  <span className="text-slate-500">DATE (YYYY-MM-DD)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>total_days (INT)</span>
                  <span className="text-slate-500">CALCULATED</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>status</span>
                  <span className="text-indigo-600 font-bold">BEKLIYOR | ONAYLANDI | RED</span>
                </div>
                <div className="p-2.5 flex justify-between bg-amber-50/50">
                  <span>FK approved_by_admin_id</span>
                  <span className="text-amber-700">OPTIONAL FK TO USERS</span>
                </div>
              </div>
            </div>

            {/* Table: SALARY_RECORDS & AUDIT_LOGS */}
            <div className="border border-slate-300 rounded-lg overflow-hidden shadow-2xs">
              <div className="bg-slate-800 text-white px-4 py-2 flex items-center justify-between">
                <span className="font-mono font-bold text-xs">TABLE: SALARY_RECORDS & AUDIT_LOGS</span>
                <span className="text-[10px] bg-slate-600 px-1.5 py-0.5 rounded">Audit & Payroll</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs font-mono">
                <div className="p-2.5 bg-indigo-50/50 flex justify-between font-semibold text-indigo-900">
                  <span>PK id (VARCHAR 36)</span>
                  <span className="text-slate-400">NOT NULL</span>
                </div>
                <div className="p-2.5 flex justify-between bg-amber-50/50">
                  <span>FK employee_id (VARCHAR 36)</span>
                  <span className="text-amber-800 font-bold">@ManyToOne EMPLOYEE</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>period_month, period_year</span>
                  <span className="text-slate-500">INT (1-12, 2026)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>sgk_worker_share (14%), unemp (1%)</span>
                  <span className="text-slate-500">DECIMAL (10, 2)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>income_tax (15%), stamp_tax</span>
                  <span className="text-slate-500">DECIMAL (10, 2)</span>
                </div>
                <div className="p-2.5 flex justify-between font-bold text-emerald-700">
                  <span>net_salary</span>
                  <span>DECIMAL (12, 2)</span>
                </div>
                <div className="p-2.5 flex justify-between">
                  <span>AUDIT: action, performed_by, ip</span>
                  <span className="text-slate-400">AOP LOG STORE</span>
                </div>
              </div>
            </div>
          </div>

          {/* İlişki Açıklaması */}
          <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-lg text-xs text-amber-900 space-y-1">
            <div className="font-bold">EER İlişkisel Kardinalite Özeti:</div>
            <div>• <strong className="font-mono">ADMIN (1) - USER/EMPLOYEE (N)</strong>: İnsan Kaynakları yöneticisi birden çok personelin idari amiridir (<code className="font-mono">@OneToMany</code> ve <code className="font-mono">@ManyToOne</code>).</div>
            <div>• <strong className="font-mono">EMPLOYEE (1) - LEAVE_REQUEST (N)</strong>: Her çalışan zaman içinde birden fazla izin talebi açabilir.</div>
            <div>• <strong className="font-mono">EMPLOYEE (1) - SALARY_RECORD (N)</strong>: Her ay için çalışan adına tekil bordro kaydı üretilir.</div>
            <div>• <strong className="font-mono">USER (1) - AUDIT_LOG (N)</strong>: Yapılan her işlem güvenlik ve denetim log tablosuna eklenir.</div>
          </div>
        </div>
      )}

      {/* 3. TAB: KATMANLI MİMARİ AKIŞI */}
      {activeTab === 'layered' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Layers className="w-5 h-5 text-indigo-600" />
                Spring Boot Katmanlı Mimari Yapısı (Layered Architecture)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Controller Katmanı → Service Katmanı → Repository Katmanı → Database & I/O Dosya Sistemi
              </p>
            </div>
            <span className="text-xs font-mono text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded border border-indigo-200">
              Separation of Concerns
            </span>
          </div>

          <div className="space-y-4">
            {/* Katman 1: Sunum / Controller */}
            <div className="border border-slate-200 rounded-lg p-4 bg-slate-50 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm shrink-0">
                L1
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Sunum & Controller Katmanı (@RestController)</h4>
                  <span className="text-xs font-mono text-blue-600">DTO Validation & Endpoint Handling</span>
                </div>
                <p className="text-xs text-slate-600">
                  İstemciden (React UI) gelen HTTP REST isteklerini karşılar, DTO nesneleri ile veri doğrulaması yapar ve uygun Service metodunu çağırır.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-slate-200 mt-2">
                  EmployeeController, SalaryController, LeaveController, AuthController
                </div>
              </div>
            </div>

            {/* Katman 2: Servis Katmanı */}
            <div className="border border-indigo-200 rounded-lg p-4 bg-indigo-50/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-sm shrink-0">
                L2
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">İş Mantığı / Servis Katmanı (@Service)</h4>
                  <span className="text-xs font-mono text-indigo-600">Stream API & Optional</span>
                </div>
                <p className="text-xs text-slate-600">
                  Tüm iş kuralları (Business Logic), 3 hatalı girişte hesap kilitleme, Strategy deseni ile net maaş hesaplama, izin onaylama/hak düşme ve AOP loglama bu katmanda gerçekleşir.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-indigo-200 mt-2">
                  HRService (implements IEmployeeService, ILeaveService, ISalaryService, IAuthService)
                </div>
              </div>
            </div>

            {/* Katman 3: Veri Erişim / Repository Katmanı */}
            <div className="border border-emerald-200 rounded-lg p-4 bg-emerald-50/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-sm shrink-0">
                L3
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Veri Erişim / Repository Katmanı (@Repository)</h4>
                  <span className="text-xs font-mono text-emerald-600">Spring Data JPA Interface</span>
                </div>
                <p className="text-xs text-slate-600">
                  İlişkisel veritabanı sorguları, CRUD işlemleri ve Stream nesnelerinin derlenmesi burada yönetilir. Generic <code className="font-mono">IBaseRepository&lt;T, ID&gt;</code> arayüzünü uygular.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-emerald-200 mt-2">
                  EmployeeRepository, UserRepository, LeaveRepository, SalaryRepository
                </div>
              </div>
            </div>

            {/* Katman 4: Kalıcılık & I/O Dosya Sistemi */}
            <div className="border border-purple-200 rounded-lg p-4 bg-purple-50/40 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-sm shrink-0">
                L4
              </div>
              <div className="space-y-1 flex-1">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 text-sm">Veritabanı Motoru & I/O Dosya Sistemi</h4>
                  <span className="text-xs font-mono text-purple-600">H2 / PostgreSQL & Local Storage / JSON Export</span>
                </div>
                <p className="text-xs text-slate-600">
                  Kullanıcının talimatı doğrultusunda hem veritabanında saklama hem de I/O (Input/Output) dosya kaydetme (JSON Veritabanı Yedeği, CSV Çalışan Tablosu, TXT Audit Log) motoru.
                </p>
                <div className="text-[11px] font-mono text-slate-500 bg-white p-2 rounded border border-purple-200 mt-2">
                  DatabaseEngine (exportFullDatabaseToJson, importFullDatabaseFromJson, exportEmployeesToCsv)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB: S.O.L.I.D PRENSİPLERİ VE TASARIM DESENLERİ */}
      {activeTab === 'solid' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                S.O.L.I.D Prensipleri ve Projedeki Somut Karşılıkları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Temiz Kod (Clean Code) standartları ve Nesne Yönelimli Programlama (OOP) ilkeleri
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Clean Architecture
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* S */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">S</span>
                <h4 className="font-bold text-slate-900 text-sm">Single Responsibility Principle (SRP)</h4>
              </div>
              <p className="text-xs text-slate-600">
                Her sınıf tek bir sorumluluğa sahiptir. Örneğin <code className="font-mono text-indigo-600">PayrollStrategyContext</code> sadece bordro hesaplama algoritmasını seçerken, <code className="font-mono text-indigo-600">LeaveRepository</code> yalnızca izin veri erişiminden sorumludur.
              </p>
            </div>

            {/* O */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">O</span>
                <h4 className="font-bold text-slate-900 text-sm">Open/Closed Principle (OCP)</h4>
              </div>
              <p className="text-xs text-slate-600">
                Sınıflar genişletmeye açık, değişikliğe kapalıdır. Yeni bir istihdam veya bordro türü (örn: Stajyer) eklemek için mevcut hesaplama kodu değiştirilmez; <code className="font-mono text-indigo-600">AbstractPayrollCalculator</code> sınıfından türeyen yeni bir strateji sınıfı eklenir.
              </p>
            </div>

            {/* L */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">L</span>
                <h4 className="font-bold text-slate-900 text-sm">Liskov Substitution Principle (LSP)</h4>
              </div>
              <p className="text-xs text-slate-600">
                Alt sınıflar, üst sınıfların yerine hatasız geçebilmelidir. <code className="font-mono text-indigo-600">FullTimePayrollStrategy</code> ve <code className="font-mono text-indigo-600">ContractorPayrollStrategy</code> sınıfları, <code className="font-mono text-indigo-600">IPayrollStrategy</code> bekleyen her yerde sorunsuz çalışır.
              </p>
            </div>

            {/* I */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">I</span>
                <h4 className="font-bold text-slate-900 text-sm">Interface Segregation Principle (ISP)</h4>
              </div>
              <p className="text-xs text-slate-600">
                İstemciler kullanmadıkları metodlara bağımlı olmaya zorlanmamalıdır. <code className="font-mono text-indigo-600">IBaseEntity</code>, <code className="font-mono text-indigo-600">IBaseRepository</code> ve <code className="font-mono text-indigo-600">IPayrollStrategy</code> modüler küçük arayüzlere bölünmüştür.
              </p>
            </div>

            {/* D */}
            <div className="border border-slate-200 rounded-lg p-4 space-y-2 md:col-span-2">
              <div className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-full bg-slate-900 text-white font-bold text-xs flex items-center justify-center">D</span>
                <h4 className="font-bold text-slate-900 text-sm">Dependency Inversion Principle (DIP)</h4>
              </div>
              <p className="text-xs text-slate-600">
                Yüksek seviyeli modüller, düşük seviyeli modüllere doğrudan bağlı olmamalı, soyutlamalara (interfaces) dayanmalıdır. Servis katmanımız doğrudan somut depolama motoruna değil, <code className="font-mono text-indigo-600">IBaseRepository&lt;T, ID&gt;</code> arayüzüne bağımlıdır.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB: SWAGGER REST API SİMÜLASYONU */}
      {activeTab === 'swagger' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[11px] font-mono font-bold rounded">OAS 3.0</span>
                <h3 className="text-base font-semibold text-slate-900">
                  Swagger UI / SpringDoc REST API Dokümantasyonu
                </h3>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">
                Base URL: <code className="font-mono text-indigo-600">/api/v1</code> · Yetkilendirme: Bearer JWT (Spring Security)
              </p>
            </div>
            <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2.5 py-1 rounded border border-slate-200">
              Generated by Spring Boot
            </span>
          </div>

          <div className="space-y-3">
            {/* Endpoint 1 */}
            <div className="border border-emerald-200 bg-emerald-50/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold text-xs rounded">POST</span>
                  <span className="font-mono text-xs font-bold text-slate-900">/api/v1/auth/login</span>
                  <span className="text-xs text-slate-600">Kullanıcı Girişi (3 deneme limiti denetimli)</span>
                </div>
                <span className="text-[11px] text-slate-500 font-mono">Public</span>
              </div>
            </div>

            {/* Endpoint 2 */}
            <div className="border border-blue-200 bg-blue-50/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-blue-600 text-white font-mono font-bold text-xs rounded">GET</span>
                  <span className="font-mono text-xs font-bold text-slate-900">/api/v1/employees?page=0&size=10</span>
                  <span className="text-xs text-slate-600">Sayfalı Çalışan Listesi (Admin Yetkisi)</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-mono">ROLE_ADMIN</span>
              </div>
            </div>

            {/* Endpoint 3 */}
            <div className="border border-emerald-200 bg-emerald-50/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-emerald-600 text-white font-mono font-bold text-xs rounded">POST</span>
                  <span className="font-mono text-xs font-bold text-slate-900">/api/v1/leaves/request</span>
                  <span className="text-xs text-slate-600">Yeni İzin Talebi Oluştur</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-mono">ROLE_USER</span>
              </div>
            </div>

            {/* Endpoint 4 */}
            <div className="border border-amber-200 bg-amber-50/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-amber-600 text-white font-mono font-bold text-xs rounded">PUT</span>
                  <span className="font-mono text-xs font-bold text-slate-900">/api/v1/leaves/&#123;id&#125;/approve</span>
                  <span className="text-xs text-slate-600">İzin Talebini Onayla & İzin Bakiyesinden Düş</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-mono">ROLE_ADMIN</span>
              </div>
            </div>

            {/* Endpoint 5 */}
            <div className="border border-purple-200 bg-purple-50/20 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-1 bg-purple-600 text-white font-mono font-bold text-xs rounded">GET</span>
                  <span className="font-mono text-xs font-bold text-slate-900">/api/v1/io/export-json</span>
                  <span className="text-xs text-slate-600">Veritabanını JSON Dosyası Olarak İndir (I/O Export)</span>
                </div>
                <span className="text-[11px] text-indigo-600 font-mono">ROLE_ADMIN</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Alt İmza Şeridi */}
      <div className="bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400"></div>
          <span>Proje İmzası: <strong>Enes Öztürk</strong> — İnsan Kaynakları Yönetim Sistemi & Spring Boot Katmanlı Mimari</span>
        </div>
        <div className="text-slate-400 font-mono text-[11px]">
          Java Stream API · Optional · Spring Data JPA · S.O.L.I.D
        </div>
      </div>
    </div>
  );
};
