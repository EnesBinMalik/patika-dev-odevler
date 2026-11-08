/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * HR Admin Dashboard & Overview
 * Geliştirici: Enes Öztürk
 */

import React from 'react';
import { 
  Users, 
  DollarSign, 
  Calendar, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Unlock, 
  FileSpreadsheet, 
  ArrowUpRight 
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { Department, LeaveStatus, Role } from '../models/types';

interface DashboardViewProps {
  onNavigate: (view: string) => void;
  onRefresh: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigate, onRefresh }) => {
  const hrService = HRService.getInstance();
  const metrics = hrService.getDashboardMetrics();
  const allEmployees = hrService.getEmployeesPaged({ pageNumber: 0, pageSize: 100 }).content;
  const leaves = hrService.getAllLeaves().limit(5).toList();
  const lockedUsers = hrService.getEmployeesPaged({ pageNumber: 0, pageSize: 100 })
    .content
    .filter(e => {
      const user = hrService.getCurrentUser();
      return false; // we'll fetch actual locked users from user repo
    });

  // Handle direct unlock from alert banner
  const handleUnlockCanOzkan = () => {
    hrService.unlockUser('usr-emp-05');
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* 3 Hatalı Giriş Uyarısı / Bloke Alert Banner */}
      {metrics.lockedUsers > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-amber-900">
                Güvenlik Uyarısı: {metrics.lockedUsers} Kullanıcı Hesabı Bloke Edildi!
              </h4>
              <p className="text-xs text-amber-700 mt-0.5">
                Spring Security kuralı gereği 3 defa hatalı şifre giren çalışanların hesapları askıya alındı. İK olarak blokeyi kaldırabilirsiniz.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigate('employees')}
            className="px-3 py-1.5 bg-amber-700 hover:bg-amber-800 text-white rounded-lg text-xs font-semibold whitespace-nowrap transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <Unlock className="w-3.5 h-3.5" />
            <span>Çalışanlarda Blokeyi Yönet</span>
          </button>
        </div>
      )}

      {/* KPI Metrik Kartları (Tabular Numerals) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Toplam Çalışan */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Toplam Personel</span>
            <span className="text-xs text-emerald-600 font-medium">Aktif Kadro</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {metrics.totalEmployees}
            </span>
            <span className="text-xs text-slate-500">kişi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>{metrics.activeEmployees} aktif bordrolu çalışan</span>
          </div>
        </div>

        {/* Aylık Toplam Maaş Bütçesi */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Aylık Brüt Bordro</span>
            <span className="text-xs text-indigo-600 font-medium">Maaş Yönetimi</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              ₺{metrics.totalPayrollGross.toLocaleString('tr-TR')}
            </span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span>Net Ödeme: ₺{metrics.totalPayrollNet.toLocaleString('tr-TR')}</span>
          </div>
        </div>

        {/* Bekleyen İzin Onayları */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bekleyen İzinler</span>
            <span className="text-xs text-amber-600 font-medium">Onay Gerekli</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {metrics.pendingLeaves}
            </span>
            <span className="text-xs text-slate-500">talep</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {metrics.pendingLeaves > 0 ? 'İncelenmesi gereken talepler var' : 'Tüm talepler sonuçlandırıldı'}
          </div>
        </div>

        {/* Şu An İzinli Olanlar */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Bugün İzinli Olanlar</span>
            <span className="text-xs text-slate-400 font-medium">Takvim</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
              {metrics.currentlyOnLeave.length}
            </span>
            <span className="text-xs text-slate-500">kişi sahada değil</span>
          </div>
          <div className="mt-2 text-xs text-slate-500">
            {metrics.currentlyOnLeave.length > 0 
              ? metrics.currentlyOnLeave.map(l => l.employeeName).join(', ')
              : 'Bugün herkes mesaide'}
          </div>
        </div>
      </div>

      {/* İki Kolonlu Detay: Hangi Çalışana Ne Kadar Maaş Veriliyor & Hangi Çalışan Hangi Gün İzin Verildiği */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Kolon 1: Hangi Çalışana Ne Kadar Maaş Veriliyor Bilgisi */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                Personel Maaş & Bordro Dağılımı
              </h3>
              <p className="text-xs text-slate-500">
                Hangi personele ne kadar brüt ve net maaş ödendiği özeti
              </p>
            </div>
            <button
              onClick={() => onNavigate('salaries')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>Detaylı Bordro</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-medium">
                  <th className="pb-2">Çalışan</th>
                  <th className="pb-2">Departman</th>
                  <th className="pb-2 text-right">Brüt Maaş</th>
                  <th className="pb-2 text-right">Net Maaş</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {allEmployees.slice(0, 5).map(emp => (
                  <tr key={emp.id} className="hover:bg-slate-50/50">
                    <td className="py-2.5">
                      <div className="font-semibold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[11px] text-slate-500">{emp.position}</div>
                    </td>
                    <td className="py-2.5 text-slate-600">{emp.department}</td>
                    <td className="py-2.5 text-right font-mono font-medium text-slate-700 tabular-nums">
                      ₺{emp.baseSalary.toLocaleString('tr-TR')}
                    </td>
                    <td className="py-2.5 text-right font-mono font-bold text-emerald-700 tabular-nums">
                      ₺{emp.netSalary.toLocaleString('tr-TR')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kolon 2: Hangi Çalışan Hangi Gün İzin Verildiği Bilgisi */}
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900">
                İzin Takvimi & Onay Durumları
              </h3>
              <p className="text-xs text-slate-500">
                Hangi çalışanın hangi günlerde izinli olduğu bilgisi
              </p>
            </div>
            <button
              onClick={() => onNavigate('leaves')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
            >
              <span>İzin Yönetimi</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {leaves.map(l => (
              <div 
                key={l.id} 
                className="p-3 rounded-lg border border-slate-100 bg-slate-50/50 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{l.employeeName}</span>
                    <span className="text-[11px] text-slate-500">({l.department})</span>
                  </div>
                  <div className="text-[11px] text-slate-600 mt-1 flex items-center gap-1 font-mono">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>{l.startDate}</span>
                    <span>→</span>
                    <span>{l.endDate}</span>
                    <span className="text-slate-400">({l.totalDays} gün · {l.leaveType})</span>
                  </div>
                </div>

                <div>
                  {l.status === LeaveStatus.ONAYLANDI && (
                    <span className="px-2.5 py-1 rounded bg-emerald-50 text-emerald-700 font-semibold text-[11px] border border-emerald-200">
                      Onaylandı
                    </span>
                  )}
                  {l.status === LeaveStatus.BEKLIYOR && (
                    <span className="px-2.5 py-1 rounded bg-amber-50 text-amber-700 font-semibold text-[11px] border border-amber-200">
                      Onay Bekliyor
                    </span>
                  )}
                  {l.status === LeaveStatus.REDDEDILDI && (
                    <span className="px-2.5 py-1 rounded bg-rose-50 text-rose-700 font-semibold text-[11px] border border-rose-200">
                      Reddedildi
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hızlı Aksiyon & Mimari İmzası */}
      <div className="bg-slate-900 text-white rounded-xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="text-xs uppercase font-mono text-indigo-400 tracking-wider">
            Kurumsal Standart & Akademik Mimari
          </span>
          <h3 className="text-lg font-bold mt-1">
            İnsan Kaynakları Yönetim Sistemi — Enes Öztürk
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Spring Data JPA ilişkileri (@OneToMany, @ManyToOne), SHA-256 maskelenmiş şifreler, 3 hatalı denemede bloke olan Spring Security yapısı ve hem veritabanına hem I/O dosyasına kaydetme kabiliyeti aktiftir.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => onNavigate('database-io')}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>I/O Dosya Yedekleme</span>
          </button>
          <button
            onClick={() => onNavigate('architecture')}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            UML ve EER İncele
          </button>
        </div>
      </div>
    </div>
  );
};
