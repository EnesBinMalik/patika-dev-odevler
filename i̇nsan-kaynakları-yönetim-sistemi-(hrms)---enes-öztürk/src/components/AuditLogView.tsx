/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Güvenlik ve Denetim İzi (Audit Logging)
 * Geliştirici: Enes Öztürk
 * 
 * "Yapılan her bir işlem için mutlaka loglama tutmak gerekiyor"
 * Observer Pattern & AOP ile otomatik denetim günlüğü ve TXT dosya indirme
 */

import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Search, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock 
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { DatabaseEngine } from '../core/database';
import { IAuditLog, LogAction, Role } from '../models/types';

export const AuditLogView: React.FC = () => {
  const hrService = HRService.getInstance();
  const db = DatabaseEngine.getInstance();
  const logs = hrService.getAuditLogs().toList();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAction, setSelectedAction] = useState('ALL');

  const filteredLogs = logs.filter(l => {
    const matchesSearch = 
      l.details.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.performedByUsername.toLowerCase().includes(searchTerm.toLowerCase()) ||
      l.ipAddress.includes(searchTerm);

    const matchesAction = selectedAction === 'ALL' || l.action === selectedAction;
    return matchesSearch && matchesAction;
  });

  return (
    <div className="space-y-6">
      {/* Başlık ve İndirme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <FileText className="w-6 h-6 text-indigo-600" />
            Sistem Denetim İzi & Güvenlik Logları (Audit Log)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            "Yapılan her bir işlem için mutlaka loglama tutulması" kuralı gereğince kaydedilen tüm sistem hareketleri.
          </p>
        </div>

        <button
          onClick={() => db.exportAuditLogsToTxt()}
          className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-2 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>TXT Log Dosyası Olarak İndir (I/O)</span>
        </button>
      </div>

      {/* Arama ve Filtre */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Kullanıcı, eylem veya detaylarda ara..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedAction}
            onChange={e => setSelectedAction(e.target.value)}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Tüm Eylemler</option>
            {Object.values(LogAction).map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Log Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Zaman Damgası</th>
                <th className="py-3 px-4">Kullanıcı & Rol</th>
                <th className="py-3 px-4">Eylem / Operasyon</th>
                <th className="py-3 px-4">İşlem Detayları</th>
                <th className="py-3 px-4 font-mono">IP Adresi</th>
                <th className="py-3 px-4 text-center">Durum</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Kayıtlı log bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Zaman */}
                    <td className="py-3 px-4 font-mono text-slate-500 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString('tr-TR')}
                    </td>

                    {/* Kullanıcı & Rol */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{log.performedByUsername}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{log.performedByRole}</div>
                    </td>

                    {/* Eylem */}
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {log.action}
                    </td>

                    {/* Detay */}
                    <td className="py-3 px-4 text-slate-600 max-w-sm">
                      {log.details}
                    </td>

                    {/* IP */}
                    <td className="py-3 px-4 font-mono text-slate-400 text-[11px]">
                      {log.ipAddress}
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4 text-center">
                      {log.status === 'SUCCESS' && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px] border border-emerald-200">
                          BAŞARILI
                        </span>
                      )}
                      {log.status === 'WARNING' && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[10px] border border-amber-200">
                          UYARI
                        </span>
                      )}
                      {log.status === 'FAILURE' && (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[10px] border border-rose-200">
                          BAŞARISIZ
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
