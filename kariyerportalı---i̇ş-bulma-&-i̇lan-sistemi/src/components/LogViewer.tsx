/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: LogViewer
 * Implements full audit logging dashboard, Logback formatting, level filtering and .log file export
 */

import React, { useState, useMemo } from 'react';
import { ScrollText, Search, Download, ShieldAlert, AlertTriangle, Info, CheckCircle2, RefreshCw } from 'lucide-react';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { FileIOService } from '../core/services/FileIOService.ts';
import { LogLevel } from '../core/types/enums.ts';
import { Pagination } from './Pagination.tsx';

export const LogViewer: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<LogLevel | 'ALL'>('ALL');
  const [searchKeyword, setSearchKeyword] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const db = DatabaseService.getInstance();
  const fileIOService = FileIOService.getInstance();

  const allLogs = useMemo(() => {
    return db.logs.findAll().sorted(
      (a, b) => new Date(b.getCreatedAt()).getTime() - new Date(a.getCreatedAt()).getTime()
    ).toList();
  }, [db]);

  const filteredLogs = useMemo(() => {
    return allLogs.filter(log => {
      if (selectedLevel !== 'ALL' && log.getLevel() !== selectedLevel) {
        return false;
      }
      if (searchKeyword.trim() !== '') {
        const q = searchKeyword.toLowerCase().trim();
        const matches =
          log.getAction().toLowerCase().includes(q) ||
          log.getDetails().toLowerCase().includes(q) ||
          (log.getUserEmail() && log.getUserEmail()!.toLowerCase().includes(q)) ||
          log.getIpAddress().toLowerCase().includes(q);
        if (!matches) return false;
      }
      return true;
    });
  }, [allLogs, selectedLevel, searchKeyword]);

  const paginatedLogs = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredLogs.slice(start, start + pageSize);
  }, [filteredLogs, page, pageSize]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <ScrollText className="w-5 h-5 text-indigo-600" />
            <span>Sistem ve Güvenlik Denetim Logları (Spring Boot Logback)</span>
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Giriş denemeleri, hesap kilitlenmeleri, profil güncellemeleri ve iş başvuruları anlık olarak loglanır.
          </p>
        </div>

        <button
          onClick={() => fileIOService.exportLogFile()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold shadow-xs transition-colors shrink-0"
        >
          <Download className="w-4 h-4" />
          <span>Log Dosyası İndir (.log)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchKeyword}
            onChange={e => {
              setSearchKeyword(e.target.value);
              setPage(1);
            }}
            placeholder="Aksiyon, e-posta veya detay ara..."
            className="w-full pl-9 pr-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100"
          />
        </div>

        {/* Level Badges Selector */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {(['ALL', LogLevel.INFO, LogLevel.SECURITY, LogLevel.AUDIT, LogLevel.WARN, LogLevel.ERROR] as const).map(
            lvl => (
              <button
                key={lvl}
                onClick={() => {
                  setSelectedLevel(lvl);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-colors ${
                  selectedLevel === lvl
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 font-bold shadow-xs'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {lvl}
              </button>
            )
          )}
        </div>
      </div>

      {/* Log Feed */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xs overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs font-semibold">
          <span>Toplam {filteredLogs.length} Log Kaydı Bulundu</span>
          <span className="text-[11px] text-slate-400 font-mono">Format: [TIMESTAMP] [THREAD] [LEVEL] [ROLE]</span>
        </div>

        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-500">
            Kriterlere uygun log kaydı bulunamadı.
          </div>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800 font-mono text-xs">
            {paginatedLogs.map(log => {
              const isSecurity = log.getLevel() === LogLevel.SECURITY;
              const isAudit = log.getLevel() === LogLevel.AUDIT;
              const isWarn = log.getLevel() === LogLevel.WARN;
              const isError = log.getLevel() === LogLevel.ERROR;

              return (
                <div
                  key={log.getId()}
                  className={`p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-3 ${
                    isSecurity
                      ? 'bg-rose-50/30 dark:bg-rose-950/20'
                      : isAudit
                      ? 'bg-indigo-50/20 dark:bg-indigo-950/10'
                      : ''
                  }`}
                >
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-slate-400 text-[11px]">
                        {new Date(log.getCreatedAt()).toLocaleDateString('tr-TR')}{' '}
                        {new Date(log.getCreatedAt()).toLocaleTimeString('tr-TR')}
                      </span>

                      <span
                        className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                          isSecurity
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : isWarn
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : isError
                            ? 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
                            : isAudit
                            ? 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {log.getLevel()}
                      </span>

                      <span className="font-bold text-slate-800 dark:text-slate-200">
                        {log.getAction()}
                      </span>

                      {log.getUserEmail() && (
                        <span className="text-slate-500 text-[11px]">
                          [{log.getUserEmail()}]
                        </span>
                      )}
                    </div>

                    <p className="text-slate-700 dark:text-slate-300 text-xs font-sans">
                      {log.getDetails()}
                    </p>
                  </div>

                  <div className="text-[11px] text-slate-400 shrink-0">
                    <span>{log.getIpAddress()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Pagination */}
        {filteredLogs.length > 0 && (
          <Pagination
            currentPage={page}
            totalItems={filteredLogs.length}
            pageSize={pageSize}
            onPageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSizeOptions={[10, 20, 50]}
          />
        )}
      </div>
    </div>
  );
};
