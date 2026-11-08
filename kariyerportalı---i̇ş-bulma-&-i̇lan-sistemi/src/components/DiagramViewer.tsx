/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: DiagramViewer
 * Implements interactive visual Database EER Diagram, UML Class Diagram, and UML Sequence Diagram
 */

import React, { useState } from 'react';
import { Database, Workflow, GitBranch, Key, Link2, ShieldAlert, ArrowRight, Layers, FileCode, CheckCircle2 } from 'lucide-react';

export const DiagramViewer: React.FC = () => {
  const [diagramMode, setDiagramMode] = useState<'eer' | 'uml-class' | 'uml-sequence'>('eer');

  return (
    <div className="space-y-6">
      {/* Header & Mode Switcher */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Workflow className="w-5 h-5 text-indigo-600" />
              <span>Veritabanı EER & UML Mimari Diyagramları</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Spring Data ilişkileri (@OneToMany, @ManyToOne), Katmanlı Mimari ve OOP Sınıf Yapısı
            </p>
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setDiagramMode('eer')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                diagramMode === 'eer'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Veritabanı EER Diyagramı</span>
            </button>

            <button
              onClick={() => setDiagramMode('uml-class')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                diagramMode === 'uml-class'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>UML Sınıf Diyagramı</span>
            </button>

            <button
              onClick={() => setDiagramMode('uml-sequence')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
                diagramMode === 'uml-sequence'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              <GitBranch className="w-3.5 h-3.5" />
              <span>UML Sekans (3 Yanlış Deneme)</span>
            </button>
          </div>
        </div>
      </div>

      {/* 1. DATABASE EER DIAGRAM */}
      {diagramMode === 'eer' && (
        <div className="space-y-4">
          {/* Legend Banner */}
          <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-4">
              <span className="font-semibold text-slate-800 dark:text-slate-200">EER Göstergeleri:</span>
              <span className="flex items-center gap-1 text-amber-600 font-mono">
                <Key className="w-3.5 h-3.5" /> PK (Primary Key)
              </span>
              <span className="flex items-center gap-1 text-indigo-600 font-mono">
                <Link2 className="w-3.5 h-3.5" /> FK (Foreign Key)
              </span>
              <span className="text-emerald-600 font-medium font-mono">
                UQ (Unique Constraint)
              </span>
            </div>
            <div className="text-slate-500 font-mono text-[11px]">
              İlişki: <strong>Admin / Şirket (1) ──────────&lt; (N) İlanlar / Başvurular</strong>
            </div>
          </div>

          {/* Interactive Entity Relationship Canvas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Table 1: USERS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-indigo-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">USERS</span>
                <span className="text-[10px] bg-indigo-700 px-2 py-0.5 rounded">Entity</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>email</span>
                  <span className="text-emerald-600">VARCHAR(120) [UQ]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>password_hash</span>
                  <span>VARCHAR(255)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>role</span>
                  <span className="text-indigo-500">ENUM('ADMIN','USER')</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>full_name</span>
                  <span>VARCHAR(100)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>phone</span>
                  <span>VARCHAR(30)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-rose-600">
                  <span>failed_login_attempts</span>
                  <span>INT [DEFAULT 0]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-rose-600">
                  <span>is_locked</span>
                  <span>BOOLEAN</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3 text-indigo-500" /> company_id</span>
                  <span>VARCHAR(64) [FK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3 text-indigo-500" /> candidate_profile_id</span>
                  <span>VARCHAR(64) [FK]</span>
                </div>
              </div>
            </div>

            {/* Table 2: COMPANIES */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-amber-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">COMPANIES</span>
                <span className="text-[10px] bg-amber-700 px-2 py-0.5 rounded">Admin (1)</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>name</span>
                  <span>VARCHAR(150)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>industry</span>
                  <span>VARCHAR(100)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>tax_number</span>
                  <span className="text-emerald-600">VARCHAR(30) [UQ]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>city</span>
                  <span>VARCHAR(50)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-indigo-600"><Link2 className="w-3 h-3" /> admin_user_id</span>
                  <span>VARCHAR(64) [FK ➔ users.id]</span>
                </div>
                <div className="py-1 text-[10px] text-amber-700 font-semibold pt-1">
                  @OneToMany(mappedBy="company") List&lt;JobPosting&gt;
                </div>
              </div>
            </div>

            {/* Table 3: CANDIDATE_PROFILES */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-emerald-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">CANDIDATE_PROFILES</span>
                <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded">User (1)</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span className="flex items-center gap-1 text-indigo-600"><Link2 className="w-3 h-3" /> user_id</span>
                  <span>VARCHAR(64) [FK ➔ users.id]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>first_name, last_name</span>
                  <span>VARCHAR(50)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>military_status</span>
                  <span className="text-indigo-500 font-bold">ENUM('DONE','EXEMPT'..)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>experience_years</span>
                  <span className="text-emerald-600 font-bold">INT (Filtreleme)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>skills, experiences</span>
                  <span>JSONB</span>
                </div>
                <div className="py-1 text-[10px] text-emerald-700 font-semibold pt-1">
                  @OneToMany(mappedBy="candidate") List&lt;Application&gt;
                </div>
              </div>
            </div>

            {/* Table 4: JOB_POSTINGS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-blue-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">JOB_POSTINGS</span>
                <span className="text-[10px] bg-blue-700 px-2 py-0.5 rounded">İlan (N)</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-indigo-600 font-semibold">
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> company_id</span>
                  <span>VARCHAR(64) [FK ➔ companies]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>title, department</span>
                  <span>VARCHAR(150)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>work_type</span>
                  <span>ENUM('REMOTE','HYBRID'..)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>min_experience_years</span>
                  <span>INT</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>military_requirement</span>
                  <span>VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>salary_min, salary_max</span>
                  <span>NUMERIC(12,2)</span>
                </div>
                <div className="py-1 text-[10px] text-blue-700 font-semibold pt-1">
                  @ManyToOne Company company
                </div>
              </div>
            </div>

            {/* Table 5: JOB_APPLICATIONS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-purple-600 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">JOB_APPLICATIONS</span>
                <span className="text-[10px] bg-purple-700 px-2 py-0.5 rounded">Başvuru (N)</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-indigo-600 font-semibold">
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> job_id</span>
                  <span>VARCHAR(64) [FK ➔ job_postings]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-indigo-600 font-semibold">
                  <span className="flex items-center gap-1"><Link2 className="w-3 h-3" /> candidate_user_id</span>
                  <span>VARCHAR(64) [FK ➔ users]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>status</span>
                  <span className="text-purple-600 font-bold">ENUM('APPLIED','INTERVIEW'..)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>cover_letter, notes</span>
                  <span>TEXT</span>
                </div>
                <div className="py-1 text-[10px] text-purple-700 font-semibold pt-1">
                  @ManyToOne JobPosting, @ManyToOne User
                </div>
              </div>
            </div>

            {/* Table 6: AUDIT_LOGS */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xs overflow-hidden">
              <div className="bg-slate-800 text-white px-4 py-2.5 flex items-center justify-between">
                <span className="font-bold text-xs tracking-wider font-mono">AUDIT_LOGS</span>
                <span className="text-[10px] bg-slate-700 px-2 py-0.5 rounded">Loglama (IO)</span>
              </div>
              <div className="p-3 divide-y divide-slate-100 dark:divide-slate-800 text-[11px] font-mono">
                <div className="py-1 flex items-center justify-between font-bold text-amber-600">
                  <span className="flex items-center gap-1"><Key className="w-3 h-3" /> id</span>
                  <span>VARCHAR(64) [PK]</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>level</span>
                  <span>ENUM('INFO','SECURITY'..)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>action</span>
                  <span>VARCHAR(80)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>details</span>
                  <span>TEXT</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>ip_address</span>
                  <span>VARCHAR(45)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-700 dark:text-slate-300">
                  <span>created_at</span>
                  <span>TIMESTAMP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. UML CLASS DIAGRAM */}
      {diagramMode === 'uml-class' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                OOP Katmanlı Mimari Sınıf Diyagramı (Class Diagram)
              </h2>
              <p className="text-xs text-slate-500">
                Interface, Abstract Class, Inheritance, Strategy ve Repository Desenleri
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs font-mono">
              {/* Box 1: Abstract BaseEntity */}
              <div className="border-2 border-indigo-500 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-indigo-50 dark:bg-indigo-950 p-3 text-center border-b border-indigo-200 dark:border-indigo-800">
                  <span className="text-[10px] text-indigo-500 uppercase block">&lt;&lt;Abstract Class&gt;&gt;</span>
                  <strong className="text-sm text-indigo-900 dark:text-indigo-200">BaseEntity</strong>
                </div>
                <div className="p-3 space-y-1 bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 text-[11px]">
                  <div># id: string</div>
                  <div># createdAt: string</div>
                  <div># updatedAt: string</div>
                  <div># version: number</div>
                </div>
                <div className="p-3 space-y-1 bg-slate-50 dark:bg-slate-850 text-[11px] text-slate-600 dark:text-slate-400">
                  <div>+ getId(): string</div>
                  <div>+ getCreatedAt(): string</div>
                  <div>+ updateTimestamp(): void</div>
                </div>
              </div>

              {/* Box 2: Repository Pattern */}
              <div className="border-2 border-emerald-500 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-emerald-50 dark:bg-emerald-950 p-3 text-center border-b border-emerald-200 dark:border-emerald-800">
                  <span className="text-[10px] text-emerald-500 uppercase block">&lt;&lt;Interface&gt;&gt;</span>
                  <strong className="text-sm text-emerald-900 dark:text-emerald-200">IRepository&lt;T&gt;</strong>
                </div>
                <div className="p-3 space-y-1 bg-white dark:bg-slate-900 text-[11px]">
                  <div>+ save(entity: T): T</div>
                  <div>+ findById(id: string): Optional&lt;T&gt;</div>
                  <div>+ findAll(): Stream&lt;T&gt;</div>
                  <div>+ deleteById(id: string): boolean</div>
                  <div>+ count(): number</div>
                </div>
                <div className="p-2.5 bg-emerald-100/50 dark:bg-emerald-950/40 text-[10px] text-emerald-800 dark:text-emerald-300 border-t border-emerald-200 dark:border-emerald-800">
                  Implements: GenericInMemoryRepository&lt;T&gt;
                </div>
              </div>

              {/* Box 3: Filter Strategy Pattern */}
              <div className="border-2 border-amber-500 rounded-xl overflow-hidden shadow-xs">
                <div className="bg-amber-50 dark:bg-amber-950 p-3 text-center border-b border-amber-200 dark:border-amber-800">
                  <span className="text-[10px] text-amber-500 uppercase block">&lt;&lt;Strategy Interface&gt;&gt;</span>
                  <strong className="text-sm text-amber-900 dark:text-amber-200">ICandidateFilterStrategy</strong>
                </div>
                <div className="p-3 space-y-1 bg-white dark:bg-slate-900 text-[11px]">
                  <div>+ meetsCriteria(candidate): boolean</div>
                  <div>+ getDescription(): string</div>
                </div>
                <div className="p-2.5 bg-amber-50 dark:bg-amber-950/40 text-[10px] text-amber-800 dark:text-amber-300 border-t border-amber-200 dark:border-amber-800 space-y-0.5">
                  <div>• MilitaryStatusFilterStrategy</div>
                  <div>• MinExperienceYearsFilterStrategy</div>
                  <div>• CompositeCandidateFilter (AND/OR)</div>
                </div>
              </div>
            </div>

            {/* Architecture Flow Banner */}
            <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-750">
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-2">
                Katmanlı Mimari İstek Akışı (Layered Flow):
              </span>
              <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
                <span className="px-2.5 py-1 bg-indigo-600 text-white rounded">Controller / UI Layer</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-2.5 py-1 bg-blue-600 text-white rounded">Service Layer (Auth, Job, Candidate)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-2.5 py-1 bg-emerald-600 text-white rounded">Repository Layer (Stream & Optional)</span>
                <ArrowRight className="w-4 h-4 text-slate-400" />
                <span className="px-2.5 py-1 bg-amber-600 text-white rounded">Entity Model & Database / File I/O</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. UML SEQUENCE DIAGRAM */}
      {diagramMode === 'uml-sequence' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-600" />
              <span>UML Sekans Diyagramı: 3 Hatalı Girişte Hesap Bloke Akışı</span>
            </h2>
            <p className="text-xs text-slate-500">
              Kullanıcının 3 kez ardışık hatalı şifre girmesi ve Spring Security lockout mekanizması
            </p>
          </div>

          <div className="space-y-4 max-w-3xl mx-auto">
            {/* Step 1 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                1
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  Kullanıcı Giriş Ekranına Şifre Girer (1. Hatalı Deneme)
                </div>
                <p className="text-slate-500 font-mono">
                  Client ➔ AuthService.login(email, "yanlis123") ➔ PasswordService.matches() ➔ FALSE
                </p>
                <span className="text-amber-600 font-semibold block text-[11px]">
                  Sonuç: failedLoginAttempts = 1. Kalan hak: 2/3. (Uyarı logu atıldı)
                </span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                2
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  2. Hatalı Şifre Denemesi
                </div>
                <p className="text-slate-500 font-mono">
                  Client ➔ AuthService.login(email, "yanlis456") ➔ registerFailedAttempt()
                </p>
                <span className="text-amber-600 font-semibold block text-[11px]">
                  Sonuç: failedLoginAttempts = 2. Kalan hak: 1/3. (Security uyarısı verildi)
                </span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/30">
              <span className="w-6 h-6 rounded-full bg-rose-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                3
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-rose-900 dark:text-rose-200">
                  3. Hatalı Şifre Denemesi & HESAP KİLİTLEME (ACCOUNT_LOCKED)
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  user.registerFailedAttempt() ➔ attempts &gt;= 3 ➔ user.isLocked = true ➔ Database.save()
                </p>
                <span className="text-rose-700 dark:text-rose-300 font-semibold block text-[11px]">
                  Kritik Güvenlik Logu: [SECURITY] [ACCOUNT_LOCKED] Hesaba kilit konuldu!
                </span>
              </div>
            </div>

            {/* Step 4 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-850">
              <span className="w-6 h-6 rounded-full bg-slate-900 text-white flex items-center justify-center text-xs font-bold shrink-0">
                4
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-slate-900 dark:text-white">
                  4. Denemede Sistem Doğru Şifre Girilse Bile Girişi Reddeder
                </div>
                <p className="text-slate-500 font-mono">
                  if (user.getIsLocked()) return LoginResult.failed("Hesabınız bloke edilmiştir!")
                </p>
              </div>
            </div>

            {/* Step 5 */}
            <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/30">
              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0">
                5
              </span>
              <div className="text-xs space-y-1">
                <div className="font-bold text-emerald-900 dark:text-emerald-200">
                  Şirket / Sistem Yöneticisi Bloke Kaldırma
                </div>
                <p className="text-slate-600 dark:text-slate-400 font-mono">
                  Admin ➔ AuthService.unlockUser(id) ➔ user.isLocked = false, attempts = 0
                </p>
                <span className="text-emerald-700 dark:text-emerald-300 font-semibold block text-[11px]">
                  Hesap tekrar aktifleşir ve kullanıcı giriş yapabilir.
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
