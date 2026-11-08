/**
 * AdminDashboard - Banka Yöneticisi & Şube Müdürü Paneli
 * Kurallar:
 * 1. Gün içinde sisteme giren müşterileri takip edebilme (Login Sessions)
 * 2. Her bir müşterinin ne kadar parası olduğunu görme (SQL INNER JOIN)
 * 3. 3 Hatalı Giriş Blokesini kaldırma (Unblock)
 * 4. Paging (Sayfalama)
 * 5. I/O Dosya Kaydetme (JSON/CSV) ve Denetim Logları
 * Mimar: Enes Öztürk
 */

import React, { useState, useMemo } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Database, 
  FileText, 
  Download, 
  Upload, 
  Unlock, 
  Lock, 
  TrendingUp, 
  Clock, 
  Search, 
  ChevronLeft, 
  ChevronRight, 
  Code, 
  FileSpreadsheet, 
  RefreshCw,
  PlusCircle,
  AlertCircle
} from 'lucide-react';
import { User } from '../core/models/User';
import { DatabaseManager, CustomerAccountJoinRecord } from '../core/database/DatabaseManager';
import { AuthService } from '../core/services/AuthService';
import { FileIOService } from '../core/services/FileIOService';
import { PasswordService } from '../core/security/PasswordService';

interface AdminDashboardProps {
  currentUser: User;
  onRefreshAll: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  currentUser,
  onRefreshAll
}) => {
  const db = DatabaseManager.getInstance();
  const authService = new AuthService();

  const [activeTab, setActiveTab] = useState<'joins' | 'sessions' | 'logs' | 'io'>('joins');
  const [searchTerm, setSearchTerm] = useState<string>('');

  // Sayfalama (Paging) State'leri
  const [page, setPage] = useState<number>(0);
  const pageSize = 5;

  // Veritabanı verilerini dinamik çek
  const joinRecords = useMemo(() => {
    return db.executeCustomerAccountsInnerJoin();
  }, [db]);

  const todaySessions = useMemo(() => {
    return db.loginSessions.findTodaySessions();
  }, [db]);

  const auditLogs = useMemo(() => {
    return db.auditLogs.findLatestLogs(100);
  }, [db]);

  // Toplam Banka İstatistikleri
  const totalBankDeposit = useMemo(() => {
    return db.accounts.getTotalDeposits();
  }, [db]);

  const customerCount = useMemo(() => {
    return db.users.findCustomers().length;
  }, [db]);

  const blockedUsers = useMemo(() => {
    return db.users.findBlockedUsers();
  }, [db]);

  // Arama filtreli Müşteri-Hesap (INNER JOIN) Listesi
  const filteredJoinRecords = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return joinRecords;
    return joinRecords.filter(r => 
      r.fullName.toLowerCase().includes(q) ||
      r.tcNo.includes(q) ||
      r.accountNumber.includes(q) ||
      r.iban.toLowerCase().includes(q)
    );
  }, [joinRecords, searchTerm]);

  // Paging Hesabı
  const totalJoinPages = Math.ceil(filteredJoinRecords.length / pageSize) || 1;
  const pagedJoinRecords = useMemo(() => {
    const start = page * pageSize;
    return filteredJoinRecords.slice(start, start + pageSize);
  }, [filteredJoinRecords, page, pageSize]);

  // Bloke Kaldırma
  const handleUnblock = (userId: string) => {
    const success = authService.unblockCustomer(currentUser.id, userId);
    if (success) {
      alert('Müşteri hesabı ve kartı üzerindeki bloke başarıyla kaldırıldı.');
      onRefreshAll();
    }
  };

  // Yedek Yükleme (JSON File Input)
  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const ok = db.importDatabaseFromJson(text);
        if (ok) {
          alert('Veritabanı yedeği başarıyla sisteme aktarıldı!');
          onRefreshAll();
        } else {
          alert('Yedek dosyası formatı geçersiz!');
        }
      };
      reader.readAsText(file);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Yönetici Karşılama ve Sistem İstatistikleri */}
      <div className="bg-slate-900 rounded-2xl p-6 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              <span className="text-xs uppercase tracking-wider text-amber-400 font-mono font-bold">
                Yönetim Konsolu & Baş Mimarlık
              </span>
            </div>
            <h1 className="text-2xl font-bold text-white mt-1">
              Hoş Geldiniz, Sayın {currentUser.fullName}
            </h1>
            <p className="text-xs text-slate-400 font-mono">
              Rol: BANKA YÖNETİCİSİ (ADMIN) | Şube Kodu: 1001 (Merkez) | Mimar: Enes Öztürk
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => FileIOService.exportCustomersCsv()}
              className="flex items-center space-x-1.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-3 py-2 rounded-xl shadow transition-colors"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>CSV Müşteri Raporu</span>
            </button>
            <button
              onClick={() => FileIOService.exportDatabaseBackup()}
              className="flex items-center space-x-1.5 text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold px-3 py-2 rounded-xl shadow transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Veritabanı Yedeği (.JSON)</span>
            </button>
          </div>
        </div>

        {/* 4 Önemli Metrik Kartı */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Toplam Banka Mevduatı</span>
            <div className="text-xl font-black text-amber-400 mt-1">
              {totalBankDeposit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </div>
            <span className="text-[10px] text-emerald-400 font-mono">Tüm Hesaplar Toplamı</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Kayıtlı Müşteri Sayısı</span>
            <div className="text-xl font-black text-white mt-1">
              {customerCount} Müşteri
            </div>
            <span className="text-[10px] text-slate-400 font-mono">Admin (1) - User (N)</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Bugün Sisteme Girenler</span>
            <div className="text-xl font-black text-sky-400 mt-1">
              {todaySessions.length} Oturum
            </div>
            <span className="text-[10px] text-sky-400 font-mono">Gün İçi Müşteri Takibi</span>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400 block font-mono">Bloke Edilmiş Hesaplar</span>
            <div className={`text-xl font-black mt-1 ${blockedUsers.length > 0 ? 'text-rose-400' : 'text-slate-400'}`}>
              {blockedUsers.length} Hesap
            </div>
            <span className="text-[10px] text-rose-400 font-mono">3 Hatalı Giriş Koruması</span>
          </div>
        </div>
      </div>

      {/* Admin Sekme Navigasyonu */}
      <div className="flex border-b border-slate-800 gap-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => { setActiveTab('joins'); setPage(0); }}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'joins'
              ? 'border-amber-500 text-amber-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Database className="w-4 h-4" />
          <span>Müşteri & Bakiye Takibi (SQL INNER JOIN)</span>
        </button>

        <button
          onClick={() => setActiveTab('sessions')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'sessions'
              ? 'border-sky-500 text-sky-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Gün İçi Sisteme Girenler ({todaySessions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('logs')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'logs'
              ? 'border-purple-500 text-purple-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Sistem & Güvenlik Logları</span>
        </button>

        <button
          onClick={() => setActiveTab('io')}
          className={`pb-3 px-4 flex items-center gap-2 border-b-2 transition-all ${
            activeTab === 'io'
              ? 'border-emerald-500 text-emerald-400 font-bold'
              : 'border-transparent text-slate-400 hover:text-white'
          }`}
        >
          <Download className="w-4 h-4" />
          <span>I/O Dosya & Yedek Yönetimi</span>
        </button>
      </div>

      {/* ================= SEKME 1: SQL INNER JOIN TABLOSU & PAGING ================= */}
      {activeTab === 'joins' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          {/* SQL Query Bilgilendirme Kutusu (İpucu: SQL INNER JOIN) */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs space-y-2">
            <div className="flex items-center justify-between text-amber-400">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span className="font-bold">Çalıştırılan İlişkisel Sorgu (SQL INNER JOIN):</span>
              </div>
              <span className="text-[11px] text-slate-500">Spring Data JPA / Relational Engine</span>
            </div>
            <pre className="text-slate-300 overflow-x-auto text-[11px] bg-black/40 p-2.5 rounded-lg border border-slate-800">
{`SELECT 
    u.id AS user_id, u.tc_no, u.full_name, u.email, u.phone, u.is_blocked,
    a.account_number, a.iban, a.balance, a.account_type, a.card_number
FROM users u
INNER JOIN accounts a ON u.id = a.user_id
WHERE u.role = 'CUSTOMER'
ORDER BY a.balance DESC;`}
            </pre>
            <p className="text-[11px] text-slate-400">
              ✓ Bu sorgu sayesinde Admin, her bir müşterinin hangi hesapta ne kadar parası olduğunu ve bloke durumunu anlık olarak listeler.
            </p>
          </div>

          {/* Arama Çubuğu */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                placeholder="Müşteri Adı, TC veya IBAN ara..."
                value={searchTerm}
                onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:border-amber-500"
              />
            </div>

            <div className="text-xs text-slate-400 font-mono">
              Toplam {filteredJoinRecords.length} hesap kaydı (Sayfa: {page + 1} / {totalJoinPages})
            </div>
          </div>

          {/* Tablo */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Müşteri Ad Soyad</th>
                  <th className="py-3 px-4">TC Kimlik No</th>
                  <th className="py-3 px-4">Hesap No</th>
                  <th className="py-3 px-4">IBAN</th>
                  <th className="py-3 px-4 text-right">Bakiye (TL)</th>
                  <th className="py-3 px-4">Durum / Bloke</th>
                  <th className="py-3 px-4 text-center">Yönetim</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {pagedJoinRecords.map(r => (
                  <tr key={r.accountId} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4">
                      <div className="font-semibold text-white">{r.fullName}</div>
                      <div className="text-[10px] text-slate-400">{r.email}</div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {PasswordService.maskTcNo(r.tcNo)}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {r.accountNumber}
                    </td>
                    <td className="py-3 px-4 font-mono text-amber-300 text-[11px]">
                      {PasswordService.maskIban(r.iban)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-400 text-sm">
                      {r.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-3 px-4">
                      {r.isBlocked ? (
                        <span className="inline-flex items-center gap-1 bg-rose-500/20 text-rose-400 border border-rose-500/30 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          <Lock className="w-3 h-3" />
                          <span>BLOKE (3 Hata)</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          <ShieldCheck className="w-3 h-3" />
                          <span>NORMAL</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {r.isBlocked ? (
                        <button
                          onClick={() => handleUnblock(r.userId)}
                          className="bg-amber-600 hover:bg-amber-500 text-white px-2.5 py-1 rounded-lg text-[11px] font-bold shadow flex items-center gap-1 mx-auto transition-colors"
                          title="Müşteri kartı ve hesabındaki 3 hatalı giriş blokesini kaldır"
                        >
                          <Unlock className="w-3.5 h-3.5" />
                          <span>Blokeyi Kaldır</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">İşlem Gerekmez</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* SAYFALAMA KONTROLLERİ (PAGING) */}
          {totalJoinPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
              <span className="text-slate-400">
                Sayfa {page + 1} / {totalJoinPages}
              </span>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setPage(prev => Math.max(0, prev - 1))}
                  disabled={page === 0}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                {Array.from({ length: totalJoinPages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={`w-8 h-8 rounded-lg font-mono text-xs font-bold ${
                      page === i ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {i + 1}
                  </button>
                ))}

                <button
                  onClick={() => setPage(prev => Math.min(totalJoinPages - 1, prev + 1))}
                  disabled={page >= totalJoinPages - 1}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================= SEKME 2: GÜN İÇİNDE SİSTEME GİREN MÜŞTERİLER ================= */}
      {activeTab === 'sessions' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <Clock className="w-5 h-5 text-sky-400" />
                <span>Gün İçinde Sisteme Giren Müşteriler & Oturum Hareketleri</span>
              </h3>
              <p className="text-xs text-slate-400">
                Banka yönetmeliği uyarınca gün içinde gerçekleşen tüm başarılı ve başarısız giriş denemeleri anlık izlenir.
              </p>
            </div>
            <span className="text-xs bg-sky-500/20 text-sky-300 border border-sky-500/30 px-3 py-1 rounded-lg font-mono font-bold">
              Bugün: {todaySessions.length} Oturum
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-3 px-4">Giriş Saati</th>
                  <th className="py-3 px-4">Müşteri Adı</th>
                  <th className="py-3 px-4">Rol</th>
                  <th className="py-3 px-4">IP / Terminal Adresi</th>
                  <th className="py-3 px-4">Kanal / Cihaz</th>
                  <th className="py-3 px-4">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-sans">
                {todaySessions.map(sess => (
                  <tr key={sess.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {new Date(sess.loginTime).toLocaleTimeString('tr-TR')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-white">
                      {sess.fullName}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-400">
                      {sess.role}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-300">
                      {sess.ipAddress}
                    </td>
                    <td className="py-3 px-4 text-slate-400 truncate max-w-xs">
                      {sess.userAgent}
                    </td>
                    <td className="py-3 px-4">
                      {sess.success ? (
                        <span className="bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded font-mono font-bold text-[10px]">
                          BAŞARILI
                        </span>
                      ) : (
                        <span className="bg-rose-500/20 text-rose-400 px-2 py-0.5 rounded font-mono font-bold text-[10px]" title={sess.failureReason}>
                          {sess.failureReason || 'BAŞARISIZ'}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ================= SEKME 3: SİSTEM & DENETİM LOGLARI ================= */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-white text-base flex items-center gap-2">
                <FileText className="w-5 h-5 text-purple-400" />
                <span>Banka Denetim ve Güvenlik Logları (Audit Logs)</span>
              </h3>
              <p className="text-xs text-slate-400">
                Para yatırma, para çekme, havale, şifre denemeleri ve bloke kaldırma işlemlerinin değiştirilemez log kaydı.
              </p>
            </div>
            <button
              onClick={() => FileIOService.exportAuditLogsTxt()}
              className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-1.5 rounded-lg font-medium transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5 text-purple-400" />
              <span>Logları .TXT Olarak İndir</span>
            </button>
          </div>

          <div className="space-y-2 max-h-[500px] overflow-y-auto font-mono text-xs pr-2">
            {auditLogs.map(log => (
              <div
                key={log.id}
                className="bg-slate-950 p-3 rounded-xl border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:border-slate-700"
              >
                <div className="flex items-start sm:items-center space-x-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    log.level === 'SECURITY' ? 'bg-amber-500/20 text-amber-300' :
                    log.level === 'ERROR' ? 'bg-rose-500/20 text-rose-300' :
                    log.level === 'WARN' ? 'bg-yellow-500/20 text-yellow-300' :
                    'bg-sky-500/20 text-sky-300'
                  }`}>
                    {log.level}
                  </span>
                  <span className="text-slate-400 text-[11px]">[{log.action}]</span>
                  <span className="text-slate-200 font-sans text-xs">{log.details}</span>
                </div>

                <div className="text-[11px] text-slate-500 shrink-0">
                  {new Date(log.timestamp).toLocaleString('tr-TR')} | IP: {log.ipAddress}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================= SEKME 4: I/O DOSYA & YEDEK YÖNETİMİ ================= */}
      {activeTab === 'io' && (
        <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-6">
          <div>
            <h3 className="font-bold text-white text-base flex items-center gap-2">
              <Download className="w-5 h-5 text-emerald-400" />
              <span>Sistem Giriş/Çıkış (I/O) ve Dosya Kayıt Merkezi</span>
            </h3>
            <p className="text-xs text-slate-400">
              Kural gereği: Sistemdeki kullanıcılar ve hesap verileri hem veritabanına kaydedilir, hem de disk I/O dosya yedeği olarak indirilebilir ve yüklenebilir.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* JSON Veritabanı Yedeği */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
                <Database className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">JSON Veritabanı Dışa Aktar</h4>
              <p className="text-xs text-slate-400">
                Kullanıcılar, hesaplar, işlemler, loglar ve oturum kayıtlarının eksiksiz JSON formatında I/O dosya yedeğini alır.
              </p>
              <button
                onClick={() => FileIOService.exportDatabaseBackup()}
                className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                JSON Yedeğini İndir
              </button>
            </div>

            {/* CSV Raporlama */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">CSV Müşteri & Bakiye Raporu</h4>
              <p className="text-xs text-slate-400">
                SQL INNER JOIN ile birleştirilmiş tüm müşteri ve bakiye tablosunu Excel / Calc uyumlu CSV dosyası olarak dışa aktarır.
              </p>
              <button
                onClick={() => FileIOService.exportCustomersCsv()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 rounded-xl transition-all"
              >
                CSV Dosyasını İndir
              </button>
            </div>

            {/* Geri Yükleme (Import) */}
            <div className="bg-slate-950 p-5 rounded-xl border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-lg bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="font-bold text-white text-sm">Yedekten Geri Yükle (Import)</h4>
              <p className="text-xs text-slate-400">
                Önceden indirilmiş bir Öztürk Bank JSON yedeğini seçerek tüm veritabanını geri yükleyin.
              </p>
              <label className="block w-full bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs py-2.5 rounded-xl text-center cursor-pointer transition-all">
                <span>JSON Dosyası Seç</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileImport}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
