/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Veritabanı EER (Enhanced Entity-Relationship) Diyagramı
 * İlişkiler: Admin (1) - User (N) [@OneToMany / @ManyToOne], Customer (1) - Account (N), Account (1) - Transaction (N)
 * SQL INNER JOIN Simülasyonu
 */

import React, { useState } from 'react';
import { X, Database, Key, ArrowRight, Table, Code2, Link } from 'lucide-react';

interface EerDiagramModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EerDiagramModal: React.FC<EerDiagramModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'EER' | 'SQL_JOIN' | 'SPRING_DATA'>('EER');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                Veritabanı EER Diyagramı &amp; İlişkisel Şema
                <span className="text-xs font-normal text-emerald-400 px-2 py-0.5 bg-emerald-500/10 rounded border border-emerald-500/20">
                  Enes Öztürk İmzalı
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                1:N (@OneToMany / @ManyToOne), İkincil Anahtarlar (FK), Birincil Anahtarlar (PK) ve SQL INNER JOIN Sorguları
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Controls */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-1 p-1 bg-slate-900 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab('EER')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'EER' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              EER Tablo &amp; İlişki Görünümü
            </button>
            <button
              onClick={() => setActiveTab('SQL_JOIN')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'SQL_JOIN' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQL INNER JOIN Sorgu Analizi
            </button>
            <button
              onClick={() => setActiveTab('SPRING_DATA')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                activeTab === 'SPRING_DATA' ? 'bg-emerald-500 text-slate-950 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Spring Data JPA (@OneToMany / @ManyToOne)
            </button>
          </div>

          <div className="text-xs text-slate-400 flex items-center gap-3">
            <span className="flex items-center gap-1 text-amber-400">
              <Key className="w-3.5 h-3.5" /> PK: Primary Key
            </span>
            <span className="flex items-center gap-1 text-sky-400">
              <Link className="w-3.5 h-3.5" /> FK: Foreign Key
            </span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6">
          {activeTab === 'EER' && (
            <div className="space-y-6">
              {/* Relationship Banner */}
              <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs font-mono text-slate-300 flex-wrap gap-2">
                <span className="text-emerald-400 font-bold">1:N İLİŞKİ ZİNCİRİ:</span>
                <span className="flex items-center gap-1">
                  BankAdmin / Branch <strong className="text-amber-400">(1)</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Customer <strong className="text-emerald-400">(N)</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Account <strong className="text-emerald-400">(N)</strong>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500" />
                  Transaction <strong className="text-emerald-400">(N)</strong>
                </span>
              </div>

              {/* Grid of Tables */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 font-mono text-xs">
                {/* Table: bank_branches (Admin) */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-emerald-400" /> bank_branches
                    </span>
                    <span className="text-[10px] text-amber-400 font-normal">1 Tarafı</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>branch_code</span>
                      <span className="text-slate-500">VARCHAR(10)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>branch_name</span>
                      <span className="text-slate-500">VARCHAR(100)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>vault_liquidity</span>
                      <span className="text-slate-500">DECIMAL(18,2)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400">
                      <span>admin_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                  </div>
                </div>

                {/* Table: users (Customers) */}
                <div className="bg-slate-950 border border-emerald-500/40 rounded-xl overflow-hidden shadow-lg shadow-emerald-950/20">
                  <div className="bg-emerald-950/40 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-emerald-800/50">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-emerald-400" /> users (Müşteriler)
                    </span>
                    <span className="text-[10px] text-emerald-400 font-normal">N Tarafı</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>tc_no [UNIQUE]</span>
                      <span className="text-slate-500">VARCHAR(11)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>full_name</span>
                      <span className="text-slate-500">VARCHAR(120)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>password_hash</span>
                      <span className="text-slate-500">VARCHAR(256)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>failed_attempts</span>
                      <span className="text-slate-500">INT DEFAULT 0</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>status</span>
                      <span className="text-slate-500">ENUM(ACTIVE, BLOCKED)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400 font-semibold">
                      <span>🔗 branch_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                  </div>
                </div>

                {/* Table: accounts */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-sky-400" /> accounts
                    </span>
                    <span className="text-[10px] text-sky-400 font-normal">N Tarafı</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>account_number</span>
                      <span className="text-slate-500">VARCHAR(10)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>iban [UNIQUE]</span>
                      <span className="text-slate-500">VARCHAR(34)</span>
                    </div>
                    <div className="flex items-center justify-between text-emerald-400 font-semibold">
                      <span>balance</span>
                      <span className="text-slate-500">DECIMAL(18,2)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>daily_limit</span>
                      <span className="text-slate-500">DECIMAL(18,2)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400 font-semibold">
                      <span>🔗 customer_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                  </div>
                </div>

                {/* Table: transactions */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-violet-400" /> transactions
                    </span>
                    <span className="text-[10px] text-violet-400 font-normal">N Tarafı</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>txn_number</span>
                      <span className="text-slate-500">VARCHAR(32)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>type</span>
                      <span className="text-slate-500">ENUM(DEPOSIT, ...)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>amount</span>
                      <span className="text-slate-500">DECIMAL(18,2)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400 font-semibold">
                      <span>🔗 account_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                  </div>
                </div>

                {/* Table: audit_logs */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-amber-400" /> audit_logs
                    </span>
                    <span className="text-[10px] text-amber-400 font-normal">Loglama</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>action</span>
                      <span className="text-slate-500">ENUM(LOGIN, ...)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400">
                      <span>🔗 user_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>ip_address</span>
                      <span className="text-slate-500">VARCHAR(45)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>status</span>
                      <span className="text-slate-500">VARCHAR(16)</span>
                    </div>
                  </div>
                </div>

                {/* Table: daily_logins */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  <div className="bg-slate-800/80 px-3 py-2 font-bold text-slate-100 flex items-center justify-between border-b border-slate-700">
                    <span className="flex items-center gap-1.5">
                      <Table className="w-3.5 h-3.5 text-cyan-400" /> daily_logins
                    </span>
                    <span className="text-[10px] text-cyan-400 font-normal">Giriş Takip</span>
                  </div>
                  <div className="p-3 space-y-1.5">
                    <div className="flex items-center justify-between text-amber-300 font-semibold">
                      <span>🔑 id [PK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-sky-400">
                      <span>🔗 customer_id [FK]</span>
                      <span className="text-slate-500">VARCHAR(64)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>channel</span>
                      <span className="text-slate-500">VARCHAR(10)</span>
                    </div>
                    <div className="flex items-center justify-between text-slate-300">
                      <span>login_time</span>
                      <span className="text-slate-500">TIMESTAMP</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SQL_JOIN' && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Admin Paneli İçin SQL INNER JOIN Sorgusu (Hangi müşterinin ne kadar parası var)
              </div>

              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 font-mono text-xs text-emerald-300 leading-relaxed overflow-x-auto">
                <span className="text-violet-400">SELECT</span>
                <br />
                &nbsp;&nbsp;c.id <span className="text-violet-400">AS</span> customer_id,
                <br />
                &nbsp;&nbsp;c.tc_no,
                <br />
                &nbsp;&nbsp;c.full_name,
                <br />
                &nbsp;&nbsp;c.email,
                <br />
                &nbsp;&nbsp;c.status,
                <br />
                &nbsp;&nbsp;a.account_number,
                <br />
                &nbsp;&nbsp;a.iban,
                <br />
                &nbsp;&nbsp;a.balance,
                <br />
                &nbsp;&nbsp;a.card_number,
                <br />
                &nbsp;&nbsp;b.branch_name
                <br />
                <span className="text-violet-400">FROM</span> users c
                <br />
                <span className="text-amber-400 font-bold">INNER JOIN</span> accounts a <span className="text-violet-400">ON</span> c.id = a.customer_id
                <br />
                <span className="text-amber-400 font-bold">INNER JOIN</span> bank_branches b <span className="text-violet-400">ON</span> c.registered_branch_id = b.id
                <br />
                <span className="text-violet-400">WHERE</span> c.role = <span className="text-emerald-400">'USER'</span>
                <br />
                <span className="text-violet-400">ORDER BY</span> a.balance <span className="text-violet-400">DESC</span>;
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                Bu SQL sorgusu, <strong>LocalStorageBankRepository.findCustomerAccountProjections()</strong> metodu ile nesne yönelimli olarak simüle edilmektedir. Admin, şubeye bağlı tüm müşterilerin güncel bakiyelerini, IBAN ve kart numaralarını tek bir birleşik projeksiyonda görüntüleyebilmektedir.
              </p>
            </div>
          )}

          {activeTab === 'SPRING_DATA' && (
            <div className="space-y-4">
              <div className="text-sm font-semibold text-slate-200 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-emerald-400" />
                Spring Data JPA İlişki Tanımlamaları (@OneToMany &amp; @ManyToOne)
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 font-mono text-xs">
                {/* Admin/Branch -> Customer */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-amber-400 font-bold">BankBranch.java (1 Tarafı)</div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto">
{`@Entity
@Table(name = "bank_branches")
public class BankBranch {
    @Id
    private String id;
    
    @OneToMany(mappedBy = "branch", 
               cascade = CascadeType.ALL, 
               fetch = FetchType.LAZY)
    private List<User> customers;
}`}
                  </pre>
                </div>

                {/* Customer -> Branch */}
                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="text-emerald-400 font-bold">User.java (N Tarafı)</div>
                  <pre className="text-slate-300 text-[11px] overflow-x-auto">
{`@Entity
@Table(name = "users")
public class User {
    @Id
    private String id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "branch_id", nullable = false)
    private BankBranch branch;

    @OneToMany(mappedBy = "customer")
    private List<Account> accounts;
}`}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer with Enes Öztürk Signature */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Relational Schema &amp; EER Architecture · <strong>Enes Öztürk</strong></span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
