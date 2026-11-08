/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * İzin Yönetimi & Takvim Takibi (Leave Management)
 * Geliştirici: Enes Öztürk
 * 
 * "Hangi çalışanının hangi gün izin verildiği bilgisine erişim sağlaması gerekiyor"
 * İzin Onay/Red İşlemleri, Bakiye Takibi ve Zaman Çizelgesi
 */

import React, { useState } from 'react';
import { 
  Calendar, 
  Check, 
  X, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  Filter, 
  UserCheck,
  Send,
  CalendarDays
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { ILeaveRequest, LeaveStatus, LeaveType } from '../models/types';

interface LeaveManagementProps {
  onRefresh: () => void;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({ onRefresh }) => {
  const hrService = HRService.getInstance();
  const allLeaves = hrService.getAllLeaves().toList();
  const employees = hrService.getEmployeesPaged({ pageNumber: 0, pageSize: 100 }).content;

  const [statusFilter, setStatusFilter] = useState<'ALL' | LeaveStatus>('ALL');
  const [selectedLeaveForAction, setSelectedLeaveForAction] = useState<ILeaveRequest | null>(null);
  const [actionType, setActionType] = useState<'APPROVE' | 'REJECT'>('APPROVE');
  const [adminNotes, setAdminNotes] = useState('');

  const filteredLeaves = allLeaves.filter(l => {
    if (statusFilter === 'ALL') return true;
    return l.status === statusFilter;
  });

  const handleOpenActionModal = (leave: ILeaveRequest, type: 'APPROVE' | 'REJECT') => {
    setSelectedLeaveForAction(leave);
    setActionType(type);
    setAdminNotes(type === 'APPROVE' ? 'İzin talebi İK tarafından onaylanmıştır.' : 'Operasyonel yoğunluk nedeniyle izin onaylanamamıştır.');
  };

  const handleSubmitAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLeaveForAction) return;

    if (actionType === 'APPROVE') {
      hrService.approveLeave(selectedLeaveForAction.id, adminNotes);
    } else {
      hrService.rejectLeave(selectedLeaveForAction.id, adminNotes);
    }

    setSelectedLeaveForAction(null);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Başlık */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Calendar className="w-6 h-6 text-indigo-600" />
            İzin Yönetimi & Personel İzin Takvimi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            "Hangi çalışanın hangi gün izin verildiği" bilgisi, onay mekanizmaları ve hak ediş takibi.
          </p>
        </div>

        {/* Filtreleme */}
        <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setStatusFilter('ALL')}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({allLeaves.length})
          </button>
          <button
            onClick={() => setStatusFilter(LeaveStatus.BEKLIYOR)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === LeaveStatus.BEKLIYOR ? 'bg-white text-amber-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Bekleyenler ({allLeaves.filter(l => l.status === LeaveStatus.BEKLIYOR).length})
          </button>
          <button
            onClick={() => setStatusFilter(LeaveStatus.ONAYLANDI)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === LeaveStatus.ONAYLANDI ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Onaylananlar ({allLeaves.filter(l => l.status === LeaveStatus.ONAYLANDI).length})
          </button>
          <button
            onClick={() => setStatusFilter(LeaveStatus.REDDEDILDI)}
            className={`px-3 py-1.5 font-medium rounded-md transition-colors ${
              statusFilter === LeaveStatus.REDDEDILDI ? 'bg-white text-rose-700 shadow-xs font-bold' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Reddedilenler
          </button>
        </div>
      </div>

      {/* İzin Listesi Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Personel</th>
                <th className="py-3 px-4">İzin Türü</th>
                <th className="py-3 px-4">İzin Tarihleri (Hangi Günler)</th>
                <th className="py-3 px-4 text-center">Süre</th>
                <th className="py-3 px-4">Gerekçe / Talep Nedeni</th>
                <th className="py-3 px-4 text-center">Durum</th>
                <th className="py-3 px-4 text-right">İK Kararı</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLeaves.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Seçilen kriterde izin kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                filteredLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Personel */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{leave.employeeName}</div>
                      <div className="text-[11px] text-slate-500">{leave.department}</div>
                    </td>

                    {/* İzin Türü */}
                    <td className="py-3 px-4 text-slate-700 font-medium">
                      {leave.leaveType}
                    </td>

                    {/* İzin Tarihleri (Hangi Günler) */}
                    <td className="py-3 px-4 font-mono">
                      <div className="flex items-center gap-1.5 text-slate-800 font-medium">
                        <CalendarDays className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
                        <span>{leave.startDate}</span>
                        <span>→</span>
                        <span>{leave.endDate}</span>
                      </div>
                    </td>

                    {/* Süre */}
                    <td className="py-3 px-4 text-center tabular-nums font-bold text-slate-900">
                      {leave.totalDays} gün
                    </td>

                    {/* Gerekçe */}
                    <td className="py-3 px-4 text-slate-600 max-w-xs truncate" title={leave.reason}>
                      {leave.reason}
                    </td>

                    {/* Durum */}
                    <td className="py-3 px-4 text-center">
                      {leave.status === LeaveStatus.ONAYLANDI && (
                        <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          Onaylandı
                        </span>
                      )}
                      {leave.status === LeaveStatus.BEKLIYOR && (
                        <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200">
                          Onay Bekliyor
                        </span>
                      )}
                      {leave.status === LeaveStatus.REDDEDILDI && (
                        <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                          Reddedildi
                        </span>
                      )}
                    </td>

                    {/* Karar Eylemleri */}
                    <td className="py-3 px-4 text-right">
                      {leave.status === LeaveStatus.BEKLIYOR ? (
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenActionModal(leave, 'APPROVE')}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            <span>Onayla</span>
                          </button>
                          <button
                            onClick={() => handleOpenActionModal(leave, 'REJECT')}
                            className="px-2.5 py-1 bg-rose-600 hover:bg-rose-700 text-white rounded text-[11px] font-semibold flex items-center gap-1"
                          >
                            <X className="w-3 h-3" />
                            <span>Reddet</span>
                          </button>
                        </div>
                      ) : (
                        <div className="text-[11px] text-slate-500 italic">
                          {leave.adminNotes || 'İşlem tamamlandı'}
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Personel İzin Hak Ediş ve Kalan Bakiye Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <h3 className="text-base font-bold text-slate-900">
          Personel İzin Hak Ediş ve Kalan Bakiye Cetveli
        </h3>
        <p className="text-xs text-slate-500">
          Her çalışanın yıllık hak edişi, kullanılan gün sayısı ve kalan izin bakiyesi
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
          {employees.map(emp => (
            <div key={emp.id} className="p-3 border border-slate-200 rounded-lg bg-slate-50/50 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</span>
                <span className="text-[11px] text-slate-500">{emp.department}</span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Kalan Yıllık İzin:</span>
                <span className="font-bold text-indigo-700 font-mono text-sm">{emp.remainingLeaveDays} Gün</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="bg-indigo-600 h-1.5 rounded-full" 
                  style={{ width: `${Math.min(100, ((emp.usedLeaveDays || 0) / 14) * 100)}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400">
                <span>Kullanılan: {emp.usedLeaveDays || 0} gün</span>
                <span>Standart Hak: 14 gün</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ONAY / RET KARAR MODALI */}
      {selectedLeaveForAction && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                İzin Talebi {actionType === 'APPROVE' ? 'Onaylama' : 'Reddetme'}
              </h3>
              <button onClick={() => setSelectedLeaveForAction(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg text-xs space-y-1">
              <div><strong>Personel:</strong> {selectedLeaveForAction.employeeName}</div>
              <div><strong>Tarihler:</strong> {selectedLeaveForAction.startDate} → {selectedLeaveForAction.endDate} ({selectedLeaveForAction.totalDays} gün)</div>
              <div><strong>İzin Türü:</strong> {selectedLeaveForAction.leaveType}</div>
              <div><strong>Talep Gerekçesi:</strong> {selectedLeaveForAction.reason}</div>
            </div>

            <form onSubmit={handleSubmitAction} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  İK Yöneticisi Notu / Karar Açıklaması:
                </label>
                <textarea
                  rows={3}
                  required
                  value={adminNotes}
                  onChange={e => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              {actionType === 'APPROVE' && (
                <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded border border-emerald-200">
                  Onaylandığında çalışanın kalan izin gününden {selectedLeaveForAction.totalDays} gün otomatik olarak düşülecektir.
                </div>
              )}

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedLeaveForAction(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className={`px-4 py-2 text-white font-semibold rounded-lg ${
                    actionType === 'APPROVE' ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  Kararı Uygula
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
