/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: DatabaseAndIOViewer
 * Implements:
 * 1. Live Relational Database Table Explorer with password masking and lockout management
 * 2. File I/O control center: JSON dump, SQL DDL/DML script export, Logback .log export, and JSON file import
 */

import React, { useState, useMemo } from 'react';
import {
  Database,
  Download,
  Upload,
  RotateCcw,
  Eye,
  EyeOff,
  ShieldCheck,
  ShieldAlert,
  FileCode,
  ScrollText,
  Key,
  Layers,
  Check,
} from 'lucide-react';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { FileIOService } from '../core/services/FileIOService.ts';
import { AuthService } from '../core/services/AuthService.ts';
import { PasswordService } from '../core/security/PasswordService.ts';
import { Pagination } from './Pagination.tsx';

type TableKey = 'users' | 'candidate_profiles' | 'companies' | 'job_postings' | 'job_applications';

export const DatabaseAndIOViewer: React.FC = () => {
  const [selectedTable, setSelectedTable] = useState<TableKey>('users');
  const [showRawHashes, setShowRawHashes] = useState(false);
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  // Pagination per table
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const db = DatabaseService.getInstance();
  const fileIOService = FileIOService.getInstance();
  const authService = AuthService.getInstance();

  const rawDump = useMemo(() => db.exportDatabaseToJSON(), [db]);

  const currentTableData = useMemo(() => {
    switch (selectedTable) {
      case 'users':
        return rawDump.tables.users;
      case 'candidate_profiles':
        return rawDump.tables.candidate_profiles;
      case 'companies':
        return rawDump.tables.companies;
      case 'job_postings':
        return rawDump.tables.job_postings;
      case 'job_applications':
        return rawDump.tables.job_applications;
      default:
        return [];
    }
  }, [selectedTable, rawDump]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * pageSize;
    return currentTableData.slice(start, start + pageSize);
  }, [currentTableData, page, pageSize]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = evt => {
      const content = evt.target?.result as string;
      if (content) {
        const result = fileIOService.importDatabaseJSON(content);
        setImportStatus(result);
        if (result.success) {
          setTimeout(() => setImportStatus(null), 5000);
        }
      }
    };
    reader.readAsText(file);
    e.target.value = ''; // Reset input
  };

  const handleUnlockUser = (userId: string) => {
    authService.unlockUser(userId);
  };

  return (
    <div className="space-y-6">
      {/* File I/O Action Center Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-indigo-600" />
              <span>Veritabanı ve Dosya I/O Yönetim Merkezi</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Verileri kalıcı olarak veritabanında saklayın, JSON veya ANSI SQL şeması olarak dışa aktarın, dosya yükleyin.
            </p>
          </div>

          {/* I/O Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => fileIOService.exportDatabaseJSON()}
              className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="Tüm veritabanı tablolarını JSON dosyası olarak indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON DB İndir</span>
            </button>

            <button
              onClick={() => fileIOService.exportDatabaseSQL()}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 rounded-lg text-xs font-semibold shadow-xs transition-colors"
              title="PostgreSQL / MySQL / H2 için DDL ve DML SQL scripti indir"
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>SQL Scripti İndir (.sql)</span>
            </button>

            <button
              onClick={() => fileIOService.exportLogFile()}
              className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors"
              title="Spring Boot formatında audit log dosyasını indir"
            >
              <ScrollText className="w-3.5 h-3.5" />
              <span>Log Dosyası (.log)</span>
            </button>

            {/* File Upload Button */}
            <label className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg text-xs font-medium text-slate-700 dark:text-slate-300 transition-colors cursor-pointer">
              <Upload className="w-3.5 h-3.5" />
              <span>JSON DB Yükle</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>

            <button
              onClick={() => {
                if (confirm('Veritabanını ilk tohumlama (seed) verilerine sıfırlamak istediğinize emin misiniz?')) {
                  db.seedDefaultData();
                }
              }}
              className="flex items-center gap-1.5 px-3 py-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg text-xs font-semibold transition-colors"
              title="Veritabanını fabrika ayarlarına sıfırla"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>

        {/* Import Status Alert */}
        {importStatus && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-center justify-between ${
              importStatus.success
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
            }`}
          >
            <span>{importStatus.message}</span>
            <button onClick={() => setImportStatus(null)} className="font-bold ml-2">
              ✕
            </button>
          </div>
        )}
      </div>

      {/* Relational Tables Explorer */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        {/* Table Selector Tabs */}
        <div className="px-6 py-3 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-xs font-semibold text-slate-400 mr-2 uppercase tracking-wider text-[10px]">
              Tablolar:
            </span>
            {(['users', 'candidate_profiles', 'companies', 'job_postings', 'job_applications'] as TableKey[]).map(
              tKey => (
                <button
                  key={tKey}
                  onClick={() => {
                    setSelectedTable(tKey);
                    setPage(1);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-colors ${
                    selectedTable === tKey
                      ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {tKey} ({rawDump.tables[tKey]?.length || 0})
                </button>
              )
            )}
          </div>

          {selectedTable === 'users' && (
            <button
              onClick={() => setShowRawHashes(!showRawHashes)}
              className="flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
            >
              {showRawHashes ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showRawHashes ? 'Şifreleri Maskele' : 'BCrypt Hash Göster'}</span>
            </button>
          )}
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {selectedTable === 'users' && (
            <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">id (PK)</th>
                  <th className="py-2.5 px-4">email (UQ)</th>
                  <th className="py-2.5 px-4">password_hash (Maskeli)</th>
                  <th className="py-2.5 px-4">role</th>
                  <th className="py-2.5 px-4">full_name</th>
                  <th className="py-2.5 px-4">failed_attempts</th>
                  <th className="py-2.5 px-4">is_locked</th>
                  <th className="py-2.5 px-4">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map((u: any) => (
                  <tr key={u.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{u.id}</td>
                    <td className="py-2.5 px-4">{u.email}</td>
                    <td className="py-2.5 px-4 text-slate-500">
                      {showRawHashes ? u.passwordHash : PasswordService.maskDisplay(8)}
                    </td>
                    <td className="py-2.5 px-4">
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'ADMIN'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>
                    <td className="py-2.5 px-4">{u.fullName}</td>
                    <td className="py-2.5 px-4 tabular-nums">
                      <span className={u.failedLoginAttempts > 0 ? 'text-amber-600 font-bold' : ''}>
                        {u.failedLoginAttempts} / 3
                      </span>
                    </td>
                    <td className="py-2.5 px-4">
                      {u.isLocked ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300">
                          BLOKE EDİLDİ
                        </span>
                      ) : (
                        <span className="text-emerald-600 font-semibold text-[10px]">AKTİF</span>
                      )}
                    </td>
                    <td className="py-2.5 px-4">
                      {u.isLocked && (
                        <button
                          onClick={() => handleUnlockUser(u.id)}
                          className="px-2 py-1 bg-rose-600 text-white rounded text-[10px] font-sans font-semibold hover:bg-rose-700"
                        >
                          Kilidi Aç
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'candidate_profiles' && (
            <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">id (PK)</th>
                  <th className="py-2.5 px-4">user_id (FK)</th>
                  <th className="py-2.5 px-4">ad_soyad</th>
                  <th className="py-2.5 px-4">military_status</th>
                  <th className="py-2.5 px-4">experience_years</th>
                  <th className="py-2.5 px-4">current_title</th>
                  <th className="py-2.5 px-4">city</th>
                  <th className="py-2.5 px-4">skills</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map((c: any) => (
                  <tr key={c.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{c.id}</td>
                    <td className="py-2.5 px-4 text-indigo-600">{c.userId}</td>
                    <td className="py-2.5 px-4 font-bold">{c.fullName}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-semibold text-slate-700 dark:text-slate-300">
                        {c.militaryStatus}
                      </span>
                    </td>
                    <td className="py-2.5 px-4 tabular-nums font-bold text-emerald-600">
                      {c.experienceYears} Yıl
                    </td>
                    <td className="py-2.5 px-4">{c.currentTitle}</td>
                    <td className="py-2.5 px-4">{c.city}</td>
                    <td className="py-2.5 px-4 text-slate-500 text-[11px]">
                      {c.skills?.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'companies' && (
            <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">id (PK)</th>
                  <th className="py-2.5 px-4">name</th>
                  <th className="py-2.5 px-4">industry</th>
                  <th className="py-2.5 px-4">tax_number (UQ)</th>
                  <th className="py-2.5 px-4">city</th>
                  <th className="py-2.5 px-4">admin_user_id (FK)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map((cmp: any) => (
                  <tr key={cmp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{cmp.id}</td>
                    <td className="py-2.5 px-4 font-bold">{cmp.name}</td>
                    <td className="py-2.5 px-4">{cmp.industry}</td>
                    <td className="py-2.5 px-4">{cmp.taxNumber}</td>
                    <td className="py-2.5 px-4">{cmp.city}</td>
                    <td className="py-2.5 px-4 text-indigo-600">{cmp.adminUserId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'job_postings' && (
            <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">id (PK)</th>
                  <th className="py-2.5 px-4">company_id (FK)</th>
                  <th className="py-2.5 px-4">title</th>
                  <th className="py-2.5 px-4">work_type</th>
                  <th className="py-2.5 px-4">min_exp</th>
                  <th className="py-2.5 px-4">military_requirement</th>
                  <th className="py-2.5 px-4">salary_range</th>
                  <th className="py-2.5 px-4">is_active</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map((j: any) => (
                  <tr key={j.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{j.id}</td>
                    <td className="py-2.5 px-4 text-indigo-600">{j.companyId}</td>
                    <td className="py-2.5 px-4 font-bold">{j.title}</td>
                    <td className="py-2.5 px-4">{j.workType}</td>
                    <td className="py-2.5 px-4 tabular-nums font-bold">{j.minExperienceYears} Yıl</td>
                    <td className="py-2.5 px-4">{j.militaryRequirement}</td>
                    <td className="py-2.5 px-4 tabular-nums">
                      {j.salaryMin?.toLocaleString('tr-TR')} - {j.salaryMax?.toLocaleString('tr-TR')} {j.currency}
                    </td>
                    <td className="py-2.5 px-4">
                      {j.isActive ? (
                        <span className="text-emerald-600 font-bold">TRUE</span>
                      ) : (
                        <span className="text-slate-400 font-bold">FALSE</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedTable === 'job_applications' && (
            <table className="w-full text-left text-xs divide-y divide-slate-100 dark:divide-slate-800 font-mono">
              <thead className="bg-slate-50 dark:bg-slate-850 text-slate-500 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-2.5 px-4">id (PK)</th>
                  <th className="py-2.5 px-4">job_id (FK)</th>
                  <th className="py-2.5 px-4">candidate_user_id (FK)</th>
                  <th className="py-2.5 px-4">candidate_name</th>
                  <th className="py-2.5 px-4">status</th>
                  <th className="py-2.5 px-4">applied_at</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {paginatedData.map((a: any) => (
                  <tr key={a.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                    <td className="py-2.5 px-4 font-semibold text-slate-800 dark:text-slate-200">{a.id}</td>
                    <td className="py-2.5 px-4 text-indigo-600">{a.jobId}</td>
                    <td className="py-2.5 px-4 text-indigo-600">{a.candidateUserId}</td>
                    <td className="py-2.5 px-4 font-bold">{a.candidateFullName}</td>
                    <td className="py-2.5 px-4">
                      <span className="font-bold text-indigo-600">{a.status}</span>
                    </td>
                    <td className="py-2.5 px-4 text-slate-500">{new Date(a.appliedAt).toLocaleString('tr-TR')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Pagination */}
        {currentTableData.length > 0 && (
          <Pagination
            currentPage={page}
            totalItems={currentTableData.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>
    </div>
  );
};
