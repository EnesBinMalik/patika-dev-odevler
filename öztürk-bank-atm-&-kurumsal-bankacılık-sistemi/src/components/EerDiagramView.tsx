/**
 * EerDiagramView - Veritabanı EER (Entity-Relationship) Şema Diyagramı
 * Kurallar:
 * 1. Admin (1) - User (N) İlişkisi (Spring Data @OneToMany & @ManyToOne)
 * 2. User (1) - Account (N) İlişkisi
 * 3. Account (1) - Transaction (N) İlişkisi
 * 4. DDL SQL Kodları (PostgreSQL / MySQL / H2)
 * Mimar: Enes Öztürk
 */

import React, { useState } from 'react';
import { Database, Key, ArrowRight, Code, Table, CheckCircle2, ShieldCheck } from 'lucide-react';

export const EerDiagramView: React.FC = () => {
  const [viewMode, setViewMode] = useState<'diagram' | 'sql'>('diagram');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Üst Bilgi */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-purple-400"></span>
            <span className="text-xs uppercase tracking-wider text-purple-400 font-mono font-bold">
              İlişkisel Veritabanı Modeli & EER Şeması
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white mt-1">
            Öztürk Bank EER (Entity-Relationship) Diyagramı
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Spring Data JPA @OneToMany & @ManyToOne İlişkileri | MySQL / PostgreSQL / H2 | Mimar: Enes Öztürk
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setViewMode('diagram')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'diagram' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Table className="w-3.5 h-3.5 inline mr-1" />
            Görsel EER Şeması
          </button>
          <button
            onClick={() => setViewMode('sql')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              viewMode === 'sql' ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-300'
            }`}
          >
            <Code className="w-3.5 h-3.5 inline mr-1" />
            SQL DDL Scripti
          </button>
        </div>
      </div>

      {viewMode === 'diagram' ? (
        <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-800 shadow-2xl space-y-8 overflow-x-auto">
          
          {/* İlişki Açıklaması */}
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono text-slate-300">
            <div className="flex items-center gap-2">
              <span className="font-bold text-amber-400">admin (1)</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-emerald-400">user (N)</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-sky-400">accounts (N)</span>
              <ArrowRight className="w-4 h-4 text-slate-500" />
              <span className="font-bold text-purple-400">transactions (N)</span>
            </div>
            <span className="text-[11px] text-slate-500 hidden sm:inline">
              Spring Data: @OneToMany & @ManyToOne
            </span>
          </div>

          {/* Tablolar Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* 1. ADMINS TABLOSU */}
            <div className="bg-slate-900 border-2 border-amber-500/50 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-amber-600/20 border-b border-amber-500/30 px-4 py-2.5 flex items-center justify-between font-mono">
                <span className="font-bold text-sm text-white">admins</span>
                <span className="text-[10px] text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded font-bold">1 (ONE)</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>staff_code</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>department</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(50)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>full_name</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(100)</span>
                </div>
              </div>
            </div>

            {/* 2. USERS TABLOSU (Admin (1) - User (N)) */}
            <div className="bg-slate-900 border-2 border-emerald-500/50 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-emerald-600/20 border-b border-emerald-500/30 px-4 py-2.5 flex items-center justify-between font-mono">
                <span className="font-bold text-sm text-white">users</span>
                <span className="text-[10px] text-emerald-300 bg-emerald-500/20 px-2 py-0.5 rounded font-bold">N (MANY)</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-sky-400 font-semibold bg-sky-950/20 px-1 rounded">
                  <span>admin_id (FK 1:N)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>tc_no (UNIQUE)</span>
                  <span className="text-slate-500 text-[10px]">CHAR(11)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>full_name</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(100)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>email</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(100)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-rose-300 font-semibold">
                  <span>password_hash</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(255)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>role</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-amber-300">
                  <span>is_blocked</span>
                  <span className="text-slate-500 text-[10px]">BOOLEAN</span>
                </div>
                <div className="py-1 flex items-center justify-between text-amber-300">
                  <span>failed_attempts</span>
                  <span className="text-slate-500 text-[10px]">INT (Max 3)</span>
                </div>
              </div>
            </div>

            {/* 3. ACCOUNTS TABLOSU */}
            <div className="bg-slate-900 border-2 border-sky-500/50 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-sky-600/20 border-b border-sky-500/30 px-4 py-2.5 flex items-center justify-between font-mono">
                <span className="font-bold text-sm text-white">accounts</span>
                <span className="text-[10px] text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded font-bold">N (MANY)</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-emerald-400 font-semibold bg-emerald-950/20 px-1 rounded">
                  <span>user_id (FK 1:N)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>account_number</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-amber-200">
                  <span>iban (UNIQUE)</span>
                  <span className="text-slate-500 text-[10px]">CHAR(26)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-emerald-400 font-bold">
                  <span>balance</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL(18,2)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>account_type</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>card_number</span>
                  <span className="text-slate-500 text-[10px]">CHAR(16)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>daily_withdraw_limit</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL(12,2)</span>
                </div>
              </div>
            </div>

            {/* 4. TRANSACTIONS TABLOSU */}
            <div className="bg-slate-900 border-2 border-purple-500/50 rounded-xl overflow-hidden shadow-lg">
              <div className="bg-purple-600/20 border-b border-purple-500/30 px-4 py-2.5 flex items-center justify-between font-mono">
                <span className="font-bold text-sm text-white">transactions</span>
                <span className="text-[10px] text-purple-300 bg-purple-500/20 px-2 py-0.5 rounded font-bold">N (MANY)</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300 font-bold">
                  <span className="flex items-center gap-1.5"><Key className="w-3.5 h-3.5 text-amber-400" /> id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-sky-400 font-semibold bg-sky-950/20 px-1 rounded">
                  <span>source_account_id (FK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-sky-400">
                  <span>target_account_id (FK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-white font-bold">
                  <span>amount</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL(18,2)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>fee</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL(10,2)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>transaction_type</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>balance_after</span>
                  <span className="text-slate-500 text-[10px]">DECIMAL(18,2)</span>
                </div>
              </div>
            </div>

            {/* 5. AUDIT_LOGS TABLOSU */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow">
              <div className="bg-slate-800 px-4 py-2 font-mono flex items-center justify-between">
                <span className="font-bold text-sm text-white">audit_logs</span>
                <span className="text-[10px] text-slate-400">LOG ENGINE</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300">
                  <span>id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>user_id (FK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>action</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(50)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>level</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(20)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>details</span>
                  <span className="text-slate-500 text-[10px]">TEXT</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>timestamp</span>
                  <span className="text-slate-500 text-[10px]">TIMESTAMP</span>
                </div>
              </div>
            </div>

            {/* 6. LOGIN_SESSIONS TABLOSU */}
            <div className="bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow">
              <div className="bg-slate-800 px-4 py-2 font-mono flex items-center justify-between">
                <span className="font-bold text-sm text-white">login_sessions</span>
                <span className="text-[10px] text-slate-400">SESSION TRACKING</span>
              </div>
              <div className="p-3 font-mono text-xs divide-y divide-slate-800">
                <div className="py-1 flex items-center justify-between text-amber-300">
                  <span>id (PK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>user_id (FK)</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(36)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>login_time</span>
                  <span className="text-slate-500 text-[10px]">TIMESTAMP</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>ip_address</span>
                  <span className="text-slate-500 text-[10px]">VARCHAR(45)</span>
                </div>
                <div className="py-1 flex items-center justify-between text-slate-300">
                  <span>success</span>
                  <span className="text-slate-500 text-[10px]">BOOLEAN</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      ) : (
        /* SQL DDL Scripti */
        <div className="bg-slate-950 rounded-2xl p-6 border-2 border-slate-800 font-mono text-xs shadow-2xl space-y-4">
          <div className="flex items-center justify-between text-amber-400">
            <span className="font-bold">Öztürk Bank DDL Script (PostgreSQL / MySQL / H2):</span>
            <span className="text-[11px] text-slate-500">Mimar: Enes Öztürk</span>
          </div>

          <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-slate-300 overflow-x-auto text-[11px] leading-relaxed">
{`-- Öztürk Bank - Veritabanı Şeması ve İlişkileri
-- Proje Mimarı: Enes Öztürk
-- Spring Data JPA (@OneToMany / @ManyToOne) Uyumlu

CREATE TABLE admins (
    id VARCHAR(36) PRIMARY KEY,
    staff_code VARCHAR(20) NOT NULL UNIQUE,
    department VARCHAR(50) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    admin_id VARCHAR(36) REFERENCES admins(id) ON DELETE SET NULL, -- 1-N İlişki
    tc_no CHAR(11) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    password_hash VARCHAR(255) NOT NULL, -- Maskelenmiş / BCrypt
    role VARCHAR(20) NOT NULL DEFAULT 'CUSTOMER',
    is_blocked BOOLEAN DEFAULT FALSE,
    failed_login_attempts INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE accounts (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL REFERENCES users(id) ON DELETE CASCADE, -- User (1) - Account (N)
    account_number VARCHAR(20) NOT NULL UNIQUE,
    iban CHAR(26) NOT NULL UNIQUE,
    balance DECIMAL(18,2) NOT NULL DEFAULT 0.00,
    account_type VARCHAR(20) NOT NULL,
    currency VARCHAR(5) DEFAULT 'TRY',
    card_number CHAR(16) NOT NULL,
    card_pin_hash VARCHAR(255) NOT NULL,
    daily_withdraw_limit DECIMAL(12,2) DEFAULT 10000.00,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE transactions (
    id VARCHAR(36) PRIMARY KEY,
    transaction_number VARCHAR(30) NOT NULL UNIQUE,
    source_account_id VARCHAR(36) NOT NULL REFERENCES accounts(id),
    target_account_id VARCHAR(36) REFERENCES accounts(id),
    amount DECIMAL(18,2) NOT NULL,
    fee DECIMAL(10,2) DEFAULT 0.00,
    transaction_type VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'SUCCESS',
    description VARCHAR(255),
    balance_after DECIMAL(18,2) NOT NULL,
    executed_by_user_id VARCHAR(36) NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin için SQL INNER JOIN Sorgusu (Hangi müşterinin ne kadar parası var):
-- SELECT u.full_name, u.tc_no, a.account_number, a.iban, a.balance 
-- FROM users u INNER JOIN accounts a ON u.id = a.user_id;
`}
          </pre>
        </div>
      )}
    </div>
  );
};
