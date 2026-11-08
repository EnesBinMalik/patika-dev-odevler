/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Proje Gereksinimi: "Projede UML diyagram yapmalıyız. Database EER diyagram yapmalıyız."
 */

import React, { useState } from 'react';
import { Database, GitBranch, Layers, ArrowRight, Code, Table, Key, ShieldCheck, CheckCircle2, Copy } from 'lucide-react';

export const DiagramViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'UML' | 'EER' | 'SQL_SCHEMA'>('UML');
  const [copiedSql, setCopiedSql] = useState(false);

  const sampleSqlDdl = `-- =============================================================
-- ONLİNE CV PROJESİ - DATABASE EER ŞEMASI (PostgreSQL / MySQL)
-- Geliştirici: Enes Öztürk | S.O.L.I.D & Clean Code
-- Spring Data @OneToMany & @ManyToOne İlişkileri
-- =============================================================

CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    department VARCHAR(50) DEFAULT 'İnsan Kaynakları',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL, -- Maskelenmiş BCrypt hash
    role VARCHAR(20) NOT NULL,           -- ROLE_ADMIN, ROLE_USER
    is_blocked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0, -- 3 denemede bloke olur
    admin_id VARCHAR(36) REFERENCES admins(id) ON DELETE SET NULL, -- @ManyToOne (N:1)
    last_login_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE candidate_cvs (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE REFERENCES users(id) ON DELETE CASCADE, -- (1:1)
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    title VARCHAR(100),
    summary TEXT,
    total_experience_years INT DEFAULT 0,
    military_status VARCHAR(30) NOT NULL, -- YAPILDI, TECİLLİ, MUAF, KADIN_ADAY
    kvkk_consent_given BOOLEAN DEFAULT TRUE,
    kvkk_expiry_date DATE NOT NULL,      -- CV saklama süresi sınırı
    application_status VARCHAR(30) DEFAULT 'YENİ_BAŞVURU',
    hr_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE experiences (
    id VARCHAR(36) PRIMARY KEY,
    cv_id VARCHAR(36) NOT NULL REFERENCES candidate_cvs(id) ON DELETE CASCADE, -- @ManyToOne
    company_name VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    start_date VARCHAR(20) NOT NULL,
    end_date VARCHAR(20) NOT NULL,
    years INT DEFAULT 1,
    description TEXT
);

CREATE TABLE audit_logs (
    id VARCHAR(36) PRIMARY KEY,
    action VARCHAR(100) NOT NULL,
    user_id VARCHAR(36) REFERENCES users(id) ON DELETE SET NULL,
    username VARCHAR(50) NOT NULL,
    role VARCHAR(20) NOT NULL,
    level VARCHAR(20) NOT NULL,          -- INFO, WARN, ERROR, SECURITY_AUDIT
    details TEXT,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);`;

  const copySql = () => {
    navigator.clipboard.writeText(sampleSqlDdl);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-2">
            <Layers className="w-3.5 h-3.5" />
            Yazılım Mimarisi & Modelleme
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
            Sistem UML & Database EER Diyagramları
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Geliştirici: <span className="text-indigo-300 font-semibold">Enes Öztürk</span> — S.O.L.I.D, Clean Code ve Katmanlı Mimari Şemaları
          </p>
        </div>

        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setActiveTab('UML')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'UML'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <GitBranch className="w-4 h-4" />
            UML Sınıf Diyagramı
          </button>
          <button
            onClick={() => setActiveTab('EER')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'EER'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Database className="w-4 h-4" />
            Database EER Diyagramı
          </button>
          <button
            onClick={() => setActiveTab('SQL_SCHEMA')}
            className={`px-4 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-2 ${
              activeTab === 'SQL_SCHEMA'
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Code className="w-4 h-4" />
            SQL DDL Şeması
          </button>
        </div>
      </div>

      {/* UML CLASS DIAGRAM */}
      {activeTab === 'UML' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-indigo-950/30 border border-indigo-500/20 text-xs text-indigo-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>
                <strong>S.O.L.I.D Prensipleri:</strong> OOP Kalıtım (Abstract BaseEntity), Dependency Inversion (Repository & Service Interfaces), Builder Pattern (CVBuilder), Factory Pattern (CVExportFactory), Stream API & Optional.
              </span>
            </div>
            <span className="hidden md:inline-block px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-200 font-mono text-[11px]">
              Spring Boot Katmanlı Mimari
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* BaseEntity (Abstract Class) */}
            <div className="rounded-xl border border-amber-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-amber-950/40 border-b border-amber-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-amber-400 uppercase tracking-widest block">&laquo;Abstract Class&raquo;</span>
                  <span className="font-bold text-sm text-white">BaseEntity</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-amber-500/20 text-amber-300 font-mono">OOP Kalıtım</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="border-b border-slate-800 pb-2.5 space-y-1 text-slate-300">
                  <div className="text-amber-300">+ id: string (UUID)</div>
                  <div className="text-slate-400">+ createdAt: ISOString</div>
                  <div className="text-slate-400">+ updatedAt: ISOString</div>
                </div>
                <div className="text-indigo-300 space-y-1">
                  <div>+ touch(): void</div>
                </div>
              </div>
            </div>

            {/* UserEntity */}
            <div className="rounded-xl border border-indigo-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-indigo-950/40 border-b border-indigo-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-indigo-400 uppercase tracking-widest block">&laquo;Entity extends BaseEntity&raquo;</span>
                  <span className="font-bold text-sm text-white">UserEntity</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">@ManyToOne Admin</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="border-b border-slate-800 pb-2.5 space-y-1 text-slate-300">
                  <div className="text-white">+ username: string</div>
                  <div className="text-slate-400">+ email: string</div>
                  <div className="text-red-300">- passwordHash: string (Maskeli)</div>
                  <div className="text-emerald-300">+ role: Role (ADMIN/USER)</div>
                  <div className="text-amber-300">+ isBlocked: boolean</div>
                  <div className="text-amber-300">+ failedLoginAttempts: number (Max 3)</div>
                  <div className="text-indigo-400">+ adminId: string | null</div>
                </div>
                <div className="text-indigo-300 space-y-1">
                  <div>+ touch(): void</div>
                </div>
              </div>
            </div>

            {/* CandidateCVEntity */}
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-emerald-950/40 border-b border-emerald-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-widest block">&laquo;Entity extends BaseEntity&raquo;</span>
                  <span className="font-bold text-sm text-white">CandidateCVEntity</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">@OneToOne User</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="border-b border-slate-800 pb-2.5 space-y-1 text-slate-300">
                  <div className="text-emerald-300">+ userId: string (FK)</div>
                  <div className="text-white">+ firstName: string</div>
                  <div className="text-white">+ lastName: string</div>
                  <div className="text-slate-400">+ phone: string</div>
                  <div className="text-blue-300">+ totalExperienceYears: number</div>
                  <div className="text-amber-300">+ militaryStatus: MilitaryStatus</div>
                  <div className="text-purple-300">+ kvkkConsentGiven: boolean</div>
                  <div className="text-purple-300">+ kvkkExpiryDate: string</div>
                  <div className="text-cyan-300">+ experiences: IExperience[]</div>
                </div>
                <div className="text-indigo-300 space-y-1">
                  <div>+ touch(): void</div>
                </div>
              </div>
            </div>

            {/* Repository Interfaces & DIP */}
            <div className="rounded-xl border border-blue-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-blue-950/40 border-b border-blue-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase tracking-widest block">&laquo;Interface (DIP)&raquo;</span>
                  <span className="font-bold text-sm text-white">ICVRepository</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-mono">Stream & Optional</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="text-blue-300 space-y-1">
                  <div>+ findById(id): Optional&lt;CV&gt;</div>
                  <div>+ findByUserId(uid): Optional&lt;CV&gt;</div>
                  <div>+ findByCriteria(criteria): CV[]</div>
                  <div>+ findPage(crit, pageable): Page&lt;CV&gt;</div>
                  <div>+ save(cv: CV): CV</div>
                  <div>+ update(cv: CV): CV</div>
                </div>
              </div>
            </div>

            {/* Service Layer */}
            <div className="rounded-xl border border-purple-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-purple-950/40 border-b border-purple-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block">&laquo;Service Layer&raquo;</span>
                  <span className="font-bold text-sm text-white">AdminHRService</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/20 text-purple-300 font-mono">Business Logic</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="text-purple-300 space-y-1">
                  <div>+ searchCandidates(crit, pageable)</div>
                  <div>+ updateCandidateStatus(id, st, notes)</div>
                  <div>+ getBlockedUsers(): User[]</div>
                  <div>+ unblockUserAccount(id): boolean</div>
                  <div>+ getHRDashboardStats()</div>
                </div>
              </div>
            </div>

            {/* Patterns: Builder & Factory */}
            <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 shadow-xl overflow-hidden">
              <div className="bg-cyan-950/40 border-b border-cyan-500/20 px-4 py-2.5 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest block">&laquo;Design Patterns&raquo;</span>
                  <span className="font-bold text-sm text-white">CVBuilder & Factory</span>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-500/20 text-cyan-300 font-mono">GoF Patterns</span>
              </div>
              <div className="p-4 space-y-3 font-mono text-xs">
                <div className="text-cyan-300 space-y-1">
                  <div className="font-bold text-white mb-1">CVBuilder (Fluent API):</div>
                  <div>+ setPersonalDetails(...)</div>
                  <div>+ setMilitaryStatus(status)</div>
                  <div>+ setKvkkConsent(bool, date)</div>
                  <div>+ build(): CandidateCVEntity</div>
                  <div className="font-bold text-white mt-2 mb-1">CVExportFactory:</div>
                  <div>+ createExport(cv, 'JSON'|'TXT')</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DATABASE EER DIAGRAM */}
      {activeTab === 'EER' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Table className="w-5 h-5 text-indigo-400 shrink-0" />
              <span>
                <strong>Gelişmiş Varlık-İlişki (EER) Modeli:</strong> Admin (1) ──[1:N]──&gt; Users | Users (1) ──[1:1]──&gt; Candidate_CVs | Candidate_CVs (1) ──[1:N]──&gt; Experiences & Educations
              </span>
            </div>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
              PostgreSQL / MySQL Schema
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Table: Admins */}
            <div className="rounded-xl border border-slate-800 bg-slate-900 overflow-hidden shadow-lg">
              <div className="bg-slate-800/80 px-4 py-3 border-b border-slate-700/80 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Table className="w-4 h-4 text-indigo-400" />
                  admins
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">1 (Primary)</span>
              </div>
              <div className="p-3 text-xs font-mono divide-y divide-slate-800/60">
                <div className="py-1.5 flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(36) [PK]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>username</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(50) [UQ]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>email</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(100) [UQ]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>department</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(50)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-400">
                  <span>created_at</span>
                  <span className="text-slate-500 text-[11px]">TIMESTAMP</span>
                </div>
              </div>
              <div className="bg-indigo-950/20 border-t border-indigo-500/20 px-3 py-2 text-[11px] text-indigo-300 flex items-center gap-1.5">
                <ArrowRight className="w-3.5 h-3.5" />
                <span>1:N ilişki ile birden fazla User/Aday denetler</span>
              </div>
            </div>

            {/* Table: Users */}
            <div className="rounded-xl border border-indigo-500/30 bg-slate-900 overflow-hidden shadow-lg">
              <div className="bg-indigo-950/50 px-4 py-3 border-b border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Table className="w-4 h-4 text-indigo-400" />
                  users
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-300 font-mono">N (Adaylar)</span>
              </div>
              <div className="p-3 text-xs font-mono divide-y divide-slate-800/60">
                <div className="py-1.5 flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(36) [PK]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>username</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(50) [UQ]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>email</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(100) [UQ]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-red-400 font-medium">
                  <span>password_hash</span>
                  <span className="text-red-400/80 text-[11px]">VARCHAR(255) [Maskeli]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>role</span>
                  <span className="text-slate-400 text-[11px]">ENUM(ADMIN, USER)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-amber-300">
                  <span>is_blocked</span>
                  <span className="text-slate-400 text-[11px]">BOOLEAN</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-amber-300">
                  <span>failed_login_attempts</span>
                  <span className="text-slate-400 text-[11px]">INT (Max 3)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-cyan-400">
                  <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> admin_id</span>
                  <span className="text-cyan-400/80 text-[11px]">FK -&gt; admins(id)</span>
                </div>
              </div>
            </div>

            {/* Table: Candidate_CVs */}
            <div className="rounded-xl border border-emerald-500/30 bg-slate-900 overflow-hidden shadow-lg">
              <div className="bg-emerald-950/50 px-4 py-3 border-b border-emerald-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2 font-mono text-sm font-bold text-white">
                  <Table className="w-4 h-4 text-emerald-400" />
                  candidate_cvs
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-500/20 text-emerald-300 font-mono">1:1 User</span>
              </div>
              <div className="p-3 text-xs font-mono divide-y divide-slate-800/60">
                <div className="py-1.5 flex items-center justify-between text-amber-400 font-semibold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(36) [PK]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-cyan-400">
                  <span className="flex items-center gap-1"><ArrowRight className="w-3 h-3" /> user_id</span>
                  <span className="text-cyan-400/80 text-[11px]">FK -&gt; users(id) [1:1]</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>first_name, last_name</span>
                  <span className="text-slate-400 text-[11px]">VARCHAR(50)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>total_experience_years</span>
                  <span className="text-blue-300 text-[11px]">INT (Örn: 5 yıl)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>military_status</span>
                  <span className="text-amber-300 text-[11px]">ENUM (YAPILDI...)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-purple-300">
                  <span>kvkk_expiry_date</span>
                  <span className="text-purple-400 text-[11px]">DATE (Saklama Sınırı)</span>
                </div>
                <div className="py-1.5 flex items-center justify-between text-slate-200">
                  <span>application_status</span>
                  <span className="text-emerald-300 text-[11px]">ENUM (Mülakat, Teklif..)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL DDL SCHEMA */}
      {activeTab === 'SQL_SCHEMA' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-slate-900 px-4 py-2 rounded-t-xl border border-slate-800">
            <span className="text-xs font-mono text-slate-300">schema_definition.sql (PostgreSQL / MySQL DDL)</span>
            <button
              onClick={copySql}
              className="px-3 py-1 text-xs rounded bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center gap-1.5 transition-colors"
            >
              {copiedSql ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  Kopyalandı!
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  SQL Kopyala
                </>
              )}
            </button>
          </div>
          <pre className="p-4 rounded-b-xl bg-slate-950 border border-t-0 border-slate-800 font-mono text-xs text-indigo-200 overflow-x-auto leading-relaxed">
            {sampleSqlDdl}
          </pre>
        </div>
      )}
    </div>
  );
};
