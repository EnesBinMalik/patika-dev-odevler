/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Çalışan Portalı (Employee Portal - USER Role)
 * Geliştirici: Enes Öztürk
 * 
 * Personel Kendi Bilgilerini, Maaş Pusulasını Görüntüler ve İzin Talebi Gönderir
 */

import React, { useState } from 'react';
import { 
  User, 
  Calendar, 
  DollarSign, 
  FileText, 
  Send, 
  Printer, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Building,
  CheckCircle2,
  X
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { IEmployee, IUser, LeaveStatus, LeaveType } from '../models/types';
import { PayrollStrategyContext } from '../core/patterns';

interface EmployeePortalProps {
  currentUser: IUser;
  onRefresh: () => void;
}

export const EmployeePortal: React.FC<EmployeePortalProps> = ({ currentUser, onRefresh }) => {
  const hrService = HRService.getInstance();
  const empOpt = hrService.getEmployeeByUserId(currentUser.id);
  const employee: IEmployee | undefined = empOpt.isPresent() ? empOpt.get() : undefined;

  // İzin Talebi Form State
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveType, setLeaveType] = useState<LeaveType>(LeaveType.YILLIK_IZIN);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Bordro Yazdırma Modal State
  const [isPayslipOpen, setIsPayslipOpen] = useState(false);

  if (!employee) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-8 text-center space-y-4">
        <User className="w-12 h-12 text-slate-400 mx-auto" />
        <h3 className="text-base font-bold text-slate-900">Çalışan Profil Kaydı Bulunamadı</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto">
          Hesabınızla eşleşen personel özlük dosyası bulunamadı. Lütfen İK Yöneticisi Enes Öztürk ile iletişime geçiniz.
        </p>
      </div>
    );
  }

  const myLeaves = hrService.getLeavesByEmployee(employee.id).toList();
  const payrollStrategy = PayrollStrategyContext.getStrategy(employee.employmentType);
  const payrollCalc = payrollStrategy.calculate(employee.baseSalary, employee.bonus, employee.deductions);

  const handleCreateLeave = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      hrService.createLeaveRequest({
        employeeId: employee.id,
        leaveType,
        startDate,
        endDate,
        reason,
      });

      setSubmitSuccess(true);
      setTimeout(() => {
        setSubmitSuccess(false);
        setIsLeaveModalOpen(false);
        onRefresh();
      }, 1200);
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Karşılama ve Profil Başlığı */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Çalışan Portalı</span>
            <span>·</span>
            <span>{employee.department}</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Hoş Geldiniz, {employee.firstName} {employee.lastName}
          </h2>
          <p className="text-xs text-slate-600 mt-1">
            {employee.position} · İdari Amir: <strong>Enes Öztürk (İK Direktörü)</strong>
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Yeni İzin Talebi Aç</span>
          </button>
          <button
            onClick={() => setIsPayslipOpen(true)}
            className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Bordromu Görüntüle</span>
          </button>
        </div>
      </div>

      {/* Kartlar: Maaş Özeti & İzin Durumu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Net Maaş Kartı */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Aylık Net Maaşınız</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-emerald-700 tabular-nums">
            ₺{payrollCalc.netSalary.toLocaleString('tr-TR')}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            Brüt Taban: ₺{employee.baseSalary.toLocaleString('tr-TR')} + Prim: ₺{employee.bonus || 0}
          </div>
        </div>

        {/* Kalan İzin Kartı */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Kalan İzin Bakiyeniz</span>
            <Calendar className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-indigo-700 tabular-nums">
            {employee.remainingLeaveDays} <span className="text-sm font-normal text-slate-600">Gün</span>
          </div>
          <div className="text-[11px] text-slate-500">
            Kullanılan İzin: {employee.usedLeaveDays || 0} gün / Toplam Hak: 14 gün
          </div>
        </div>

        {/* Özlük Bilgisi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sözleşme Bilgileri</span>
            <Building className="w-4 h-4 text-slate-500" />
          </div>
          <div className="text-xs text-slate-800 font-medium">
            {employee.employmentType}
          </div>
          <div className="text-[11px] text-slate-500 font-mono">
            İşe Başlama: {employee.hireDate} · TC: {employee.tcNo}
          </div>
        </div>
      </div>

      {/* İzin Taleplerim Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">İzin Geçmişim ve Onay Durumları</h3>
            <p className="text-xs text-slate-500">Açtığınız tüm izin talepleri ve İK yöneticisi onayları</p>
          </div>
          <button
            onClick={() => setIsLeaveModalOpen(true)}
            className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
          >
            + Yeni Talep
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-medium bg-slate-50">
                <th className="py-2.5 px-3">İzin Türü</th>
                <th className="py-2.5 px-3">Başlangıç / Bitiş</th>
                <th className="py-2.5 px-3 text-center">Süre</th>
                <th className="py-2.5 px-3">Gerekçe</th>
                <th className="py-2.5 px-3 text-center">Durum</th>
                <th className="py-2.5 px-3">İK Yönetici Notu</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {myLeaves.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Henüz izin talebi oluşturmadınız.
                  </td>
                </tr>
              ) : (
                myLeaves.map(leave => (
                  <tr key={leave.id} className="hover:bg-slate-50">
                    <td className="py-3 px-3 font-medium text-slate-900">{leave.leaveType}</td>
                    <td className="py-3 px-3 font-mono text-slate-700">{leave.startDate} → {leave.endDate}</td>
                    <td className="py-3 px-3 text-center font-bold font-mono">{leave.totalDays} gün</td>
                    <td className="py-3 px-3 text-slate-600 max-w-xs truncate">{leave.reason}</td>
                    <td className="py-3 px-3 text-center">
                      {leave.status === LeaveStatus.ONAYLANDI && (
                        <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                          Onaylandı
                        </span>
                      )}
                      {leave.status === LeaveStatus.BEKLIYOR && (
                        <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200">
                          Beklemede
                        </span>
                      )}
                      {leave.status === LeaveStatus.REDDEDILDI && (
                        <span className="px-2 py-0.5 rounded bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                          Reddedildi
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-slate-500 italic">
                      {leave.adminNotes || '—'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* YENİ İZİN TALEBİ AÇMA MODALI */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Yeni İzin Talebi Oluştur
              </h3>
              <button onClick={() => setIsLeaveModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {submitSuccess ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-slate-900">İzin Talebiniz Gönderildi!</h4>
                <p className="text-xs text-slate-500">İK Yöneticisi Enes Öztürk onayına iletildi.</p>
              </div>
            ) : (
              <form onSubmit={handleCreateLeave} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">İzin Türü *</label>
                  <select
                    value={leaveType}
                    onChange={e => setLeaveType(e.target.value as LeaveType)}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    {Object.values(LeaveType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Başlangıç Tarihi *</label>
                    <input
                      type="date"
                      required
                      value={startDate}
                      onChange={e => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 mb-1">Bitiş Tarihi *</label>
                    <input
                      type="date"
                      required
                      min={startDate}
                      value={endDate}
                      onChange={e => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Mazeret / Talep Açıklaması *</label>
                  <textarea
                    rows={3}
                    required
                    value={reason}
                    onChange={e => setReason(e.target.value)}
                    placeholder="İzin kullanım gerekçenizi belirtiniz..."
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => setIsLeaveModalOpen(false)}
                    className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                  >
                    İptal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg"
                  >
                    Talebi İK'ya İlet
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BORDRO PUSULASI MODALI */}
      {isPayslipOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto">
            <div className="flex items-center justify-between no-print border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Resmi Ücret Hesap Pusulası
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır / İndir</span>
                </button>
                <button
                  onClick={() => setIsPayslipOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Pusula Gövdesi */}
            <div className="border border-slate-300 rounded-lg p-6 bg-white space-y-5 text-xs text-slate-800">
              <div className="flex justify-between items-start border-b border-slate-300 pb-3">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
                    ÜCRET HESAP PUSULASI
                  </h3>
                  <p className="text-[11px] text-slate-500">İnsan Kaynakları Yönetim Sistemi</p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div>Dönem: {new Date().getMonth() + 1} / {new Date().getFullYear()}</div>
                  <div>Tarih: {new Date().toISOString().slice(0, 10)}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded">
                <div>
                  <div><strong>Adı Soyadı:</strong> {employee.firstName} {employee.lastName}</div>
                  <div><strong>TC Kimlik No:</strong> {employee.tcNo}</div>
                  <div><strong>Departman:</strong> {employee.department}</div>
                </div>
                <div>
                  <div><strong>Pozisyon:</strong> {employee.position}</div>
                  <div><strong>İstihdam Türü:</strong> {employee.employmentType}</div>
                  <div><strong>İşe Giriş:</strong> {employee.hireDate}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded p-3 space-y-1.5">
                  <div className="font-bold border-b border-slate-200 pb-1">KAZANÇLAR</div>
                  <div className="flex justify-between">
                    <span>Brüt Taban Maaş:</span>
                    <span className="font-mono">₺{employee.baseSalary.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prim / İkramiye:</span>
                    <span className="font-mono">₺{(employee.bonus || 0).toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                <div className="border border-slate-200 rounded p-3 space-y-1.5">
                  <div className="font-bold border-b border-slate-200 pb-1">KESİNTİLER</div>
                  <div className="flex justify-between">
                    <span>SGK İşçi (%14):</span>
                    <span className="font-mono">₺{payrollCalc.sgkWorkerShare.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İşsizlik Primi (%1):</span>
                    <span className="font-mono">₺{payrollCalc.unemploymentShare.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gelir & Damga Vergisi:</span>
                    <span className="font-mono">₺{(payrollCalc.incomeTax + payrollCalc.stampTax).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded flex justify-between items-center">
                <span className="font-bold uppercase text-emerald-950">NET ELE GEÇEN TUTAR:</span>
                <span className="text-xl font-bold font-mono text-emerald-800">
                  ₺{payrollCalc.netSalary.toLocaleString('tr-TR')}
                </span>
              </div>

              <div className="text-center pt-4 border-t border-slate-200 text-[11px] text-slate-400">
                Bu bordro İnsan Kaynakları Direktörü Enes Öztürk tarafından onaylanmış dijital belgedir.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
