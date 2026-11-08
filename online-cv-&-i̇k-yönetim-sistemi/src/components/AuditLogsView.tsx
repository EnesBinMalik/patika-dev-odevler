/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Sistem Denetim ve İşlem Günlükleri (Audit Log View)
 * Gereksinim: "Yapılan her bir işlem için mutlaka loglama tutmak gerekiyor"
 */

import React, { useState, useEffect } from 'react';
import { AuditLogService } from '../services/AuditLogService';
import { FileStorageManager } from '../database/FileStorageManager';
import { AuditLogEntity } from '../types/models';
import { LogLevel } from '../types/enums';
import { Activity, Download, Trash2, Search, Filter, ShieldAlert, AlertTriangle, Info, CheckCircle, RefreshCw } from 'lucide-react';

export const AuditLogsView: React.FC = () => {
  const auditService = AuditLogService.getInstance();
  const fileStorage = FileStorageManager.getInstance();

  const [logs, setLogs] = useState<AuditLogEntity[]>([]);
  const [levelFilter, setLevelFilter] = useState<LogLevel | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const refreshLogs = () => {
    setLogs(auditService.getAllLogs());
  };

  useEffect(() => {
    refreshLogs();
  }, []);

  const handleClear = () => {
    if (confirm('Tüm log kayıtlarını temizlemek istediğinize emin misiniz?')) {
      auditService.clearLogs();
      refreshLogs();
    }
  };

  const filteredLogs = logs.filter((log) => {
    if (levelFilter !== 'ALL' && log.level !== levelFilter) {
      return false;
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const match =
        log.action.toLowerCase().includes(q) ||
        log.details.toLowerCase().includes(q) ||
        log.username.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold mb-2">
            <Activity className="w-3.5 h-3.5" />
            İşlem Denetim Sistemi (Audit Trail)
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">
            Sistem ve Güvenlik Log Kayıtları
          </h2>
          <p className="text-sm text-slate-400">
            Giriş denemeleri, şifre maskeleme, CV güncellemeleri ve filtreleme hareketleri (Geliştirici: <span className="text-indigo-300 font-semibold">Enes Öztürk</span>)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => fileStorage.exportAuditLogsToFile()}
            className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
            title="Log kayıtlarını .log dosyası olarak dışa aktar (I/O File)"
          >
            <Download className="w-3.5 h-3.5 text-indigo-400" />
            <span>.log İndir (I/O)</span>
          </button>

          <button
            onClick={refreshLogs}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Logları Yenile"
          >
            <RefreshCw className="w-4 h-4" />
          </button>

          <button
            onClick={handleClear}
            className="p-2 rounded-lg bg-slate-900 border border-slate-800 hover:border-red-500/30 text-slate-400 hover:text-red-400 transition-colors"
            title="Logları Temizle"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Log ara (kullanıcı, aksiyon, detay)..."
            className="w-full sm:w-64 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-slate-400">Seviye:</span>
          <select
            value={levelFilter}
            onChange={(e) => setLevelFilter(e.target.value as any)}
            className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white"
          >
            <option value="ALL">Tüm Seviyeler</option>
            <option value={LogLevel.INFO}>INFO (Bilgi)</option>
            <option value={LogLevel.WARN}>WARN (Uyarı)</option>
            <option value={LogLevel.ERROR}>ERROR (Hata)</option>
            <option value={LogLevel.SECURITY}>SECURITY_AUDIT (Güvenlik)</option>
          </select>

          <span className="text-slate-500 font-mono text-[11px] ml-2">
            Toplam: <strong>{filteredLogs.length}</strong> log
          </span>
        </div>
      </div>

      {/* Logs Table */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900 overflow-hidden shadow-xl">
        <div className="overflow-x-auto max-h-[600px]">
          <table className="w-full text-left text-xs font-mono">
            <thead className="sticky top-0 bg-slate-950 text-slate-400 uppercase tracking-wider text-[11px] border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">Zaman</th>
                <th className="px-4 py-3">Seviye</th>
                <th className="px-4 py-3">Aksiyon</th>
                <th className="px-4 py-3">Kullanıcı (Rol)</th>
                <th className="px-4 py-3">Detaylar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-2.5 text-slate-400 text-[11px] whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleTimeString('tr-TR')}
                    </td>
                    <td className="px-4 py-2.5 whitespace-nowrap">
                      {log.level === LogLevel.INFO && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-blue-500/10 text-blue-400 border border-blue-500/20">
                          <Info className="w-3 h-3" />
                          INFO
                        </span>
                      )}
                      {log.level === LogLevel.WARN && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          <AlertTriangle className="w-3 h-3" />
                          WARN
                        </span>
                      )}
                      {log.level === LogLevel.ERROR && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-red-500/10 text-red-400 border border-red-500/20">
                          <ShieldAlert className="w-3 h-3" />
                          ERROR
                        </span>
                      )}
                      {log.level === LogLevel.SECURITY && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-300 border border-purple-500/30">
                          <ShieldAlert className="w-3 h-3" />
                          SECURITY
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 font-bold text-white whitespace-nowrap">
                      {log.action}
                    </td>
                    <td className="px-4 py-2.5 text-slate-300 whitespace-nowrap">
                      <span className="font-semibold text-indigo-300">{log.username}</span>
                      <span className="text-slate-500 text-[10px] ml-1">({log.role})</span>
                    </td>
                    <td className="px-4 py-2.5 text-slate-300">
                      {log.details}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                    Kayıtlı log bulunamadı.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
