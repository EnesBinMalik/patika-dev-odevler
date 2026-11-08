/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Banka Yetkilisi (Admin) Yönetim Portali
 * - Gün içinde giren müşterilerin takibi
 * - SQL INNER JOIN ile müşteri bakiyeleri ve hesapları
 * - Bloke kaldırma (Unblock)
 * - Bakiye düzeltme (Admin Adjust)
 * - Dosya I/O (CSV / JSON Dışa Aktarma)
 * - Paging (Sayfalama) & Denetim Logları
 */

import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  Unlock,
  PlusCircle,
  MinusCircle,
  FileSpreadsheet,
  FileJson,
  Download,
  Search,
  Filter,
  Activity,
  Vault,
  AlertTriangle,
  RotateCcw,
  Clock,
  Eye,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Database,
  Building2,
} from 'lucide-react';
import { CustomerAccountProjection, DailyLoginRecord, AuditLog, User } from '../../types/models';
import { AccountStatus, Role, AuditAction } from '../../types/enums';
import { LocalStorageBankRepository } from '../../core/repositories/LocalStorageBankRepository';
import { AdminService } from '../../core/services/AdminService';
import { FileIoService } from '../../core/services/FileIoService';
import { soundEffects } from '../../utils/soundEffects';

interface AdminDashboardProps {
  adminUser: User;
  onRefreshData: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ adminUser, onRefreshData }) => {
  const repository = LocalStorageBankRepository.getInstance();
  const adminService = new AdminService();

  // Active View Tab
  const [activeTab, setActiveTab] = useState<'CUSTOMERS_SQL' | 'DAILY_LOGINS' | 'AUDIT_LOGS' | 'DATABASE_IO'>('CUSTOMERS_SQL');

  // Customer Table Search & Paging
  const [customerSearch, setCustomerSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | AccountStatus>('ALL');
  const [customerPage, setCustomerPage] = useState(1);
  const customersPerPage = 5;

  // Audit Logs Search & Paging
  const [auditSearch, setAuditSearch] = useState('');
  const [auditActionFilter, setAuditActionFilter] = useState<'ALL' | AuditAction>('ALL');
  const [auditPage, setAuditPage] = useState(1);
  const auditPerPage = 8;

  // Balance Adjustment Modal State
  const [adjustTargetCustomer, setAdjustTargetCustomer] = useState<CustomerAccountProjection | null>(null);
  const [adjustAmount, setAdjustAmount] = useState('');
  const [adjustIsCredit, setAdjustIsCredit] = useState(true);
  const [adjustReason, setAdjustReason] = useState('Yetkili Düzeltme');

  // Feedback Messages
  const [feedback, setFeedback] = useState<{ type: 'SUCCESS' | 'ERROR'; msg: string } | null>(null);

  // Data fetching
  const analytics = adminService.getBankAnalytics();
  const customerProjections = adminService.getCustomerAccountProjections();
  const dailyLogins = adminService.getDailyLogins();
  const auditLogs = repository.findAllAuditLogs({ page: 1, size: 200 }).content;

  // Unblock Customer Action
  const handleUnblock = (customer: CustomerAccountProjection) => {
    soundEffects.playKeypadBeep();
    try {
      adminService.unblockCustomer(customer.customerId, adminUser.fullName);
      soundEffects.playSuccessChime();
      setFeedback({
        type: 'SUCCESS',
        msg: `${customer.fullName} isimli müşterinin blokesi başarıyla kaldırıldı ve deneme hakları sıfırlandı.`,
      });
      onRefreshData();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setFeedback({ type: 'ERROR', msg: err.message || 'Bloke kaldırılamadı.' });
    }
  };

  // Balance Adjustment Action
  const handleAdjustSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adjustTargetCustomer) return;
    const amt = Number(adjustAmount);

    try {
      soundEffects.playKeypadBeep();
      adminService.adjustCustomerBalance(
        adjustTargetCustomer.customerId,
        amt,
        adjustIsCredit,
        adjustReason,
        adminUser.fullName
      );
      soundEffects.playSuccessChime();
      setFeedback({
        type: 'SUCCESS',
        msg: `${adjustTargetCustomer.fullName} hesabına ${adjustIsCredit ? '+' : '-'}${amt.toLocaleString('tr-TR')} ₺ düzeltme uygulandı.`,
      });
      setAdjustTargetCustomer(null);
      setAdjustAmount('');
      onRefreshData();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setFeedback({ type: 'ERROR', msg: err.message || 'Bakiye düzeltilemedi.' });
    }
  };

  // Filtered Customers
  const filteredCustomers = customerProjections.filter((c) => {
    const matchesSearch =
      c.fullName.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.tcNo.includes(customerSearch) ||
      c.iban.toLowerCase().includes(customerSearch.toLowerCase()) ||
      c.accountNumber.includes(customerSearch);
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalCustomerPages = Math.ceil(filteredCustomers.length / customersPerPage) || 1;
  const paginatedCustomers = filteredCustomers.slice(
    (customerPage - 1) * customersPerPage,
    customerPage * customersPerPage
  );

  // Filtered Audit Logs
  const filteredAuditLogs = auditLogs.filter((log) => {
    const matchesSearch =
      (log.userFullName && log.userFullName.toLowerCase().includes(auditSearch.toLowerCase())) ||
      (log.details && log.details.toLowerCase().includes(auditSearch.toLowerCase())) ||
      log.action.toLowerCase().includes(auditSearch.toLowerCase());
    const matchesAction = auditActionFilter === 'ALL' || log.action === auditActionFilter;
    return matchesSearch && matchesAction;
  });

  const totalAuditPages = Math.ceil(filteredAuditLogs.length / auditPerPage) || 1;
  const paginatedAuditLogs = filteredAuditLogs.slice(
    (auditPage - 1) * auditPerPage,
    auditPage * auditPerPage
  );

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Admin Header with Enes Öztürk Signature Tag */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex items-center justify-between flex-wrap gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Banka Yönetim &amp; Denetim Portali
            </span>
            <span className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/30 text-amber-300 rounded font-mono">
              YÖNETİCİ KONSOLU
            </span>
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Kadıköy Merkez Şube Yönetimi
          </h1>
          <p className="text-xs text-slate-400">
            Yetkili: <strong className="text-slate-200">{adminUser.fullName}</strong> ({adminUser.email}) · Şube Kodu: 3401
          </p>
        </div>

        {/* Quick I/O Export Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              soundEffects.playKeypadBeep();
              FileIoService.exportCustomersToCsv(customerProjections);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Müşteri ve Hesap Tablosunu İndir"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            Müşterileri İndir (.CSV)
          </button>
          <button
            onClick={() => {
              soundEffects.playKeypadBeep();
              FileIoService.exportLogsToCsv(auditLogs);
            }}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors"
            title="Sistem Loglarını CSV Olarak İndir"
          >
            <Download className="w-4 h-4 text-amber-400" />
            Logları İndir (.CSV)
          </button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Vault Liquidity */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Şube Kasa Rezervi</span>
            <Vault className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono tabular-nums">
            {analytics.vaultLiquidity.toLocaleString('tr-TR')} <span className="text-amber-400">₺</span>
          </div>
          <div className="text-[11px] text-emerald-400 font-mono">Merkez Bankası Likidite Uyumlu</div>
        </div>

        {/* KPI 2: Total Customer Deposits */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Müşteri Mevduat Toplamı</span>
            <Building2 className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-extrabold text-emerald-400 font-mono tabular-nums">
            {analytics.totalCustomerDeposits.toLocaleString('tr-TR')} ₺
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {analytics.totalCustomers} Müşteri Hesabı
          </div>
        </div>

        {/* KPI 3: Daily Active Logins */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bugün Giriş Yapanlar</span>
            <Activity className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-extrabold text-slate-100 font-mono tabular-nums">
            {dailyLogins.length} <span className="text-xs text-slate-400 font-normal">müşteri</span>
          </div>
          <div className="text-[11px] text-slate-400 font-mono">ATM &amp; Web Ortak Takip</div>
        </div>

        {/* KPI 4: Blocked Accounts Alert */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs">
            <span>Bloke Olan Müşteriler</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-extrabold text-rose-400 font-mono tabular-nums">
            {analytics.blockedCustomers}
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            3 Hatalı Giriş Nedeniyle Kilitli
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border text-xs flex items-center justify-between ${
            feedback.type === 'SUCCESS'
              ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/15 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{feedback.msg}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Tab Navigation Controls */}
      <div className="flex items-center gap-2 p-1.5 bg-slate-900 border border-slate-800 rounded-xl flex-wrap">
        <button
          onClick={() => setActiveTab('CUSTOMERS_SQL')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'CUSTOMERS_SQL'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Müşteri &amp; Bakiye Bilgileri (SQL INNER JOIN)
        </button>

        <button
          onClick={() => setActiveTab('DAILY_LOGINS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'DAILY_LOGINS'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Clock className="w-4 h-4" />
          Günlük Giriş Yapan Müşteriler ({dailyLogins.length})
        </button>

        <button
          onClick={() => setActiveTab('AUDIT_LOGS')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'AUDIT_LOGS'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Güvenlik &amp; Denetim Logları ({auditLogs.length})
        </button>

        <button
          onClick={() => setActiveTab('DATABASE_IO')}
          className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 ${
            activeTab === 'DATABASE_IO'
              ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Database className="w-4 h-4" />
          Veritabanı Dosya I/O &amp; Yedekleme
        </button>
      </div>

      {/* TAB 1: Customers with SQL Inner Join Projection & Balances */}
      {activeTab === 'CUSTOMERS_SQL' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                Müşteri Hesap Bakiyeleri &amp; Durum Listesi
              </h2>
              <p className="text-xs text-slate-400">
                SQL Sorgusu: <code>SELECT * FROM customers c INNER JOIN accounts a ON c.id = a.customerId</code>
              </p>
            </div>

            {/* Filter and Search */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setCustomerPage(1);
                  }}
                  placeholder="İsim, TC veya IBAN ara..."
                  className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => {
                    setStatusFilter('ALL');
                    setCustomerPage(1);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    statusFilter === 'ALL' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400'
                  }`}
                >
                  Tümü
                </button>
                <button
                  onClick={() => {
                    setStatusFilter(AccountStatus.ACTIVE);
                    setCustomerPage(1);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    statusFilter === AccountStatus.ACTIVE ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  Aktif
                </button>
                <button
                  onClick={() => {
                    setStatusFilter(AccountStatus.BLOCKED);
                    setCustomerPage(1);
                  }}
                  className={`px-2.5 py-1 rounded transition-colors ${
                    statusFilter === AccountStatus.BLOCKED ? 'bg-slate-800 text-rose-400 font-bold' : 'text-slate-400'
                  }`}
                >
                  Bloke
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Müşteri Adı Soyadı</th>
                  <th className="py-3 px-4">TC Kimlik No</th>
                  <th className="py-3 px-4">Hesap No</th>
                  <th className="py-3 px-4">IBAN</th>
                  <th className="py-3 px-4 text-right">Mevcut Bakiye</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                  <th className="py-3 px-4 text-center">İşlemler</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {paginatedCustomers.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                      Kriterlere uygun müşteri kaydı bulunamadı.
                    </td>
                  </tr>
                ) : (
                  paginatedCustomers.map((c) => (
                    <tr key={c.customerId} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 font-sans font-bold text-slate-200">
                        {c.fullName}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{c.tcNo}</td>
                      <td className="py-3 px-4 text-slate-300">{c.accountNumber}</td>
                      <td className="py-3 px-4 text-slate-400 text-[11px] truncate max-w-[160px]">
                        {c.iban}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-emerald-400 tabular-nums text-sm">
                        {c.balance.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            c.status === AccountStatus.ACTIVE
                              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {c.status === AccountStatus.ACTIVE ? 'AKTİF' : 'BLOKE (KİLİTLİ)'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        <div className="flex items-center justify-center gap-1.5 font-sans">
                          {c.status === AccountStatus.BLOCKED ? (
                            <button
                              onClick={() => handleUnblock(c)}
                              className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 rounded text-xs font-semibold flex items-center gap-1 transition-colors"
                              title="3 hatalı giriş kilidini kaldır"
                            >
                              <Unlock className="w-3.5 h-3.5" /> Bloke Aç
                            </button>
                          ) : (
                            <button
                              onClick={() => {
                                soundEffects.playKeypadBeep();
                                setAdjustTargetCustomer(c);
                                setAdjustAmount('5000');
                                setAdjustIsCredit(true);
                              }}
                              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs font-medium transition-colors"
                              title="Bakiye Düzeltmesi Yap"
                            >
                              Bakiye Düzenle
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Sayfalama (Paging) */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 flex-wrap gap-3">
            <div>
              Toplam <strong>{filteredCustomers.length}</strong> müşteri · Sayfa <strong>{customerPage}</strong> / {totalCustomerPages}
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setCustomerPage((p) => Math.max(1, p - 1))}
                disabled={customerPage <= 1}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              {Array.from({ length: totalCustomerPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  onClick={() => setCustomerPage(n)}
                  className={`w-7 h-7 rounded-lg text-xs font-mono font-bold ${
                    customerPage === n
                      ? 'bg-amber-500 text-slate-950'
                      : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCustomerPage((p) => Math.min(totalCustomerPages, p + 1))}
                disabled={customerPage >= totalCustomerPages}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Daily Logins Tracker */}
      {activeTab === 'DAILY_LOGINS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-400" />
              Gün İçinde Sisteme Giren Müşteriler (Canlı Takip)
            </h2>
            <p className="text-xs text-slate-400">
              Admin yetkilisi, gün içerisinde ATM veya Web kanalı üzerinden sisteme oturum açan müşterileri izler.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Giriş Saati</th>
                  <th className="py-3 px-4">Müşteri Adı Soyadı</th>
                  <th className="py-3 px-4">T.C. Kimlik No</th>
                  <th className="py-3 px-4">Kanal</th>
                  <th className="py-3 px-4">IP / Terminal Adresi</th>
                  <th className="py-3 px-4">Oturum Süresi</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {dailyLogins.map((rec) => (
                  <tr key={rec.id} className="hover:bg-slate-950/40">
                    <td className="py-3 px-4 text-slate-300 font-bold">
                      {new Date(rec.loginTime).toLocaleTimeString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 font-sans font-semibold text-slate-100">
                      {rec.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-400">{rec.tcNo}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          rec.channel === 'ATM'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                        }`}
                      >
                        {rec.channel === 'ATM' ? 'ATM Terminali' : 'İnternet Şubesi'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400">{rec.ipAddress}</td>
                    <td className="py-3 px-4 text-slate-300">
                      {rec.sessionDurationMinutes ? `${rec.sessionDurationMinutes} dk` : 'Aktif'}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="text-emerald-400 font-bold">BAŞARILI GİRİŞ</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: Audit Logs with Sayfalama */}
      {activeTab === 'AUDIT_LOGS' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Sistem ve Güvenlik Denetim Logları
              </h2>
              <p className="text-xs text-slate-400">
                Yapılan her bir para, giriş veya kilit işlemi anlık olarak denetim tablosuna kaydedilir.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => FileIoService.exportLogsToCsv(auditLogs)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5 text-amber-400" /> CSV
              </button>
              <button
                onClick={() => FileIoService.exportLogsToJson(auditLogs)}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold flex items-center gap-1.5"
              >
                <FileJson className="w-3.5 h-3.5 text-sky-400" /> JSON
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-slate-950/70 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Tarih / Saat</th>
                  <th className="py-3 px-4">Eylem</th>
                  <th className="py-3 px-4">Kullanıcı</th>
                  <th className="py-3 px-4">IP / Terminal</th>
                  <th className="py-3 px-4">Detaylı Açıklama</th>
                  <th className="py-3 px-4 text-center">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {paginatedAuditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-950/40">
                    <td className="py-2.5 px-4 text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                    </td>
                    <td className="py-2.5 px-4 font-bold text-slate-200">{log.action}</td>
                    <td className="py-2.5 px-4 text-slate-300 font-sans">
                      {log.userFullName || 'Sistem'}
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{log.ipAddress}</td>
                    <td className="py-2.5 px-4 text-slate-300 font-sans max-w-sm truncate">
                      {log.details}
                    </td>
                    <td className="py-2.5 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-500/15 text-emerald-400'
                            : log.status === 'WARNING'
                            ? 'bg-amber-500/15 text-amber-400'
                            : 'bg-rose-500/15 text-rose-400'
                        }`}
                      >
                        {log.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sayfalama */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400">
            <div>
              Toplam <strong>{auditLogs.length}</strong> log kaydı · Sayfa <strong>{auditPage}</strong> / {totalAuditPages}
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setAuditPage((p) => Math.max(1, p - 1))}
                disabled={auditPage <= 1}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => setAuditPage((p) => Math.min(totalAuditPages, p + 1))}
                disabled={auditPage >= totalAuditPages}
                className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: Database File I/O Management */}
      {activeTab === 'DATABASE_IO' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
          <div className="border-b border-slate-800 pb-3">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Database className="w-4 h-4 text-emerald-400" />
              Veritabanı ve Dosya Girdi / Çıktı (I/O) Merkezi
            </h2>
            <p className="text-xs text-slate-400">
              Kural: Sistemdeki kullanıcılar ve loglar için hem database kaydetmek hem de dosya (I/O) olarak dışa aktarabilmek.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <FileSpreadsheet className="w-5 h-5 text-emerald-400" />
                Müşteri Veritabanı (.CSV)
              </div>
              <p className="text-xs text-slate-400">
                SQL INNER JOIN görünümündeki tüm müşteri, hesap, IBAN ve bakiye bilgilerini Excel uyumlu CSV formatında indirir.
              </p>
              <button
                onClick={() => {
                  soundEffects.playKeypadBeep();
                  FileIoService.exportCustomersToCsv(customerProjections);
                }}
                className="w-full py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" /> CSV İndir
              </button>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <FileJson className="w-5 h-5 text-amber-400" />
                Denetim Logları (.JSON &amp; .CSV)
              </div>
              <p className="text-xs text-slate-400">
                Sistemde gerçekleşen tüm para transferleri, ATM çekimleri ve güvenlik uyarılarını yapılandırılmış formatta dışa aktarır.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playKeypadBeep();
                    FileIoService.exportLogsToCsv(auditLogs);
                  }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-colors"
                >
                  CSV İndir
                </button>
                <button
                  onClick={() => {
                    soundEffects.playKeypadBeep();
                    FileIoService.exportLogsToJson(auditLogs);
                  }}
                  className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold rounded-lg text-xs transition-colors"
                >
                  JSON İndir
                </button>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center gap-2 text-slate-100 font-bold text-sm">
                <Vault className="w-5 h-5 text-sky-400" />
                Tam Sistem Yedeği (Full Dump)
              </div>
              <p className="text-xs text-slate-400">
                Tüm şubeler, kullanıcılar, hesaplar ve dekontları tek bir JSON dosyasında arşivler veya fabrika ayarlarına sıfırlar.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    soundEffects.playKeypadBeep();
                    FileIoService.exportFullDatabaseBackup();
                  }}
                  className="flex-1 py-2 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
                >
                  Yedekle (Dump)
                </button>
                <button
                  onClick={() => {
                    if (window.confirm('Tüm veritabanı varsayılan test verilerine sıfırlansın mı?')) {
                      repository.resetToDefault();
                      onRefreshData();
                      setFeedback({ type: 'SUCCESS', msg: 'Veritabanı sıfırlandı.' });
                    }
                  }}
                  className="px-3 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 rounded-lg text-xs font-semibold"
                  title="Sıfırla"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Balance Adjustment Modal */}
      {adjustTargetCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100">Yetkili Bakiye Düzeltmesi</h3>
              <button
                onClick={() => setAdjustTargetCustomer(null)}
                className="text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-1">
              <div>
                Müşteri: <strong>{adjustTargetCustomer.fullName}</strong>
              </div>
              <div>
                Hesap No: <strong>{adjustTargetCustomer.accountNumber}</strong>
              </div>
              <div>
                Mevcut Bakiye: <strong className="text-emerald-400">{adjustTargetCustomer.balance.toLocaleString('tr-TR')} ₺</strong>
              </div>
            </div>

            <form onSubmit={handleAdjustSubmit} className="space-y-4">
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setAdjustIsCredit(true)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    adjustIsCredit ? 'bg-emerald-500 text-slate-950' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  + Para Ekle (Kredi)
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustIsCredit(false)}
                  className={`flex-1 py-2 rounded-lg text-xs font-bold transition-colors ${
                    !adjustIsCredit ? 'bg-rose-500 text-white' : 'bg-slate-950 text-slate-400 border border-slate-800'
                  }`}
                >
                  - Para Düş (Borç)
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Düzeltme Tutarı (TL)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={adjustAmount}
                  onChange={(e) => setAdjustAmount(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 font-mono text-base font-bold"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Düzeltme Gerekçesi</label>
                <input
                  type="text"
                  required
                  value={adjustReason}
                  onChange={(e) => setAdjustReason(e.target.value)}
                  placeholder="Örn: Hatalı ATM işlemi telafisi"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Yetkili Düzeltmeyi Kaydet (Audit Loglu)
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
