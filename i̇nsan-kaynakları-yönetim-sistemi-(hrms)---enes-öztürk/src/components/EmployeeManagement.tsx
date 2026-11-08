/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Çalışan Yönetimi (Employee Management) & Sayfalama (Paging)
 * Geliştirici: Enes Öztürk
 * 
 * Spring Data @OneToMany / @ManyToOne Yönetici-Çalışan İlişkisi
 * 3 Hatalı Girişte Bloke Olan Hesapların Kilidini Açma
 */

import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  Unlock, 
  Eye, 
  Edit3, 
  Check, 
  X, 
  Download,
  Building,
  UserCheck
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { Department, EmploymentType, IEmployee, Role } from '../models/types';
import { DatabaseEngine } from '../core/database';

interface EmployeeManagementProps {
  onRefresh: () => void;
}

export const EmployeeManagement: React.FC<EmployeeManagementProps> = ({ onRefresh }) => {
  const hrService = HRService.getInstance();
  const db = DatabaseEngine.getInstance();

  // Sayfalama (Paging) State'leri
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(5); // 5, 10, 20
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // Modal State'leri
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    tcNo: '',
    email: '',
    phone: '',
    department: Department.IT,
    position: '',
    employmentType: EmploymentType.FULL_TIME,
    baseSalary: 65000,
    hireDate: new Date().toISOString().slice(0, 10),
    birthDate: '1995-01-01',
    address: 'İstanbul, Türkiye',
    remainingLeaveDays: 14,
  });

  // Sayfalanmış Veriyi Çek
  const page = hrService.getEmployeesPaged(
    { pageNumber, pageSize },
    searchTerm,
    selectedDept,
    selectedStatus
  );

  // Tüm kullanıcılar listesi (Bloke durumunu kontrol etmek için)
  const usersList = db.getUsers();

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setPageNumber(0); // İlk sayfaya sıfırla
  };

  const handleDeptChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDept(e.target.value);
    setPageNumber(0);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setPageSize(Number(e.target.value));
    setPageNumber(0);
  };

  const handleCreateEmployee = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      hrService.createEmployee({
        ...formData,
        managerId: 'usr-admin-01', // Enes Öztürk @ManyToOne
      });
      setIsAddModalOpen(false);
      onRefresh();
    } catch (err: any) {
      alert('Hata: ' + err.message);
    }
  };

  const handleUnlockUser = (userId: string) => {
    const res = hrService.unlockUser(userId);
    alert(res.message);
    onRefresh();
  };

  const handleToggleStatus = (empId: string) => {
    hrService.toggleEmployeeActive(empId);
    onRefresh();
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Eylemler */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Çalışan Bilgi & Personel Yönetimi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            İnsan Kaynakları Uzmanı tüm çalışanların sözleşme, maaş, izin ve güvenlik verilerine tam erişim sağlar.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => db.exportEmployeesToCsv()}
            className="px-3 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>CSV Dışa Aktar</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Çalışan Ekle</span>
          </button>
        </div>
      </div>

      {/* Arama ve Filtreleme Çubuğu */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex flex-col md:flex-row items-center gap-3">
        {/* Arama Girişi */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            placeholder="İsim, e-posta, unvan veya TC No ile ara..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Departman Filtresi */}
        <div className="w-full md:w-56">
          <select
            value={selectedDept}
            onChange={handleDeptChange}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Tüm Departmanlar</option>
            {Object.values(Department).map(d => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
        </div>

        {/* Durum Filtresi */}
        <div className="w-full md:w-36">
          <select
            value={selectedStatus}
            onChange={(e) => { setSelectedStatus(e.target.value); setPageNumber(0); }}
            className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="ALL">Tüm Durumlar</option>
            <option value="ACTIVE">Yalnızca Aktif</option>
            <option value="INACTIVE">Yalnızca Pasif</option>
          </select>
        </div>
      </div>

      {/* Sayfalanmış Çalışan Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Çalışan Bilgisi</th>
                <th className="py-3 px-4">Departman & Pozisyon</th>
                <th className="py-3 px-4">İstihdam & Yönetici</th>
                <th className="py-3 px-4 text-right">Maaş Bilgisi</th>
                <th className="py-3 px-4 text-center">İzin Hakkı</th>
                <th className="py-3 px-4 text-center">Güvenlik / Bloke</th>
                <th className="py-3 px-4 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {page.content.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Kriterlere uygun çalışan kaydı bulunamadı.
                  </td>
                </tr>
              ) : (
                page.content.map(emp => {
                  const userAccount = usersList.find(u => u.id === emp.userId || u.employeeId === emp.id);
                  const isLocked = userAccount?.isLocked ?? false;

                  return (
                    <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Çalışan Adı & TC */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-slate-900">
                          {emp.firstName} {emp.lastName}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          TC: {emp.tcNo} · {emp.email}
                        </div>
                      </td>

                      {/* Departman */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">{emp.department}</div>
                        <div className="text-[11px] text-slate-500">{emp.position}</div>
                      </td>

                      {/* İstihdam & Yönetici İK (@ManyToOne) */}
                      <td className="py-3 px-4">
                        <div className="text-slate-700">{emp.employmentType}</div>
                        <div className="text-[11px] text-indigo-600 font-medium">
                          Amir: Enes Öztürk (İK Direktörü)
                        </div>
                      </td>

                      {/* Maaş */}
                      <td className="py-3 px-4 text-right tabular-nums">
                        <div className="font-bold text-emerald-700">
                          Net: ₺{emp.netSalary.toLocaleString('tr-TR')}
                        </div>
                        <div className="text-[11px] text-slate-500 font-mono">
                          Brüt: ₺{emp.baseSalary.toLocaleString('tr-TR')}
                        </div>
                      </td>

                      {/* İzin */}
                      <td className="py-3 px-4 text-center tabular-nums">
                        <span className="font-bold text-slate-900">{emp.remainingLeaveDays}</span>
                        <span className="text-slate-400 text-[11px]"> / 14 gün</span>
                      </td>

                      {/* Bloke Durumu (3 Hatalı Giriş) */}
                      <td className="py-3 px-4 text-center">
                        {isLocked ? (
                          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-rose-50 text-rose-700 border border-rose-200 text-[11px] font-bold">
                            <ShieldAlert className="w-3 h-3" />
                            <span>Bloke Edildi</span>
                          </div>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600">
                            <UserCheck className="w-3 h-3" />
                            <span>Normal</span>
                          </span>
                        )}
                      </td>

                      {/* Eylemler */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isLocked && userAccount && (
                            <button
                              onClick={() => handleUnlockUser(userAccount.id)}
                              title="3 hatalı şifre kilidini kaldır"
                              className="p-1.5 text-amber-700 hover:bg-amber-100 rounded transition-colors"
                            >
                              <Unlock className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => {
                              setSelectedEmployee(emp);
                              setIsDetailModalOpen(true);
                            }}
                            title="Dosyayı İncele"
                            className="p-1.5 text-slate-600 hover:bg-slate-100 rounded transition-colors"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Sayfalama (Paging) Çubuğu */}
        <div className="bg-slate-50 px-4 py-3 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-slate-500">
            <span>
              Toplam <strong>{page.totalElements}</strong> çalışan · Sayfa <strong>{page.pageNumber + 1}</strong> / {page.totalPages}
            </span>
            <div className="flex items-center gap-1">
              <span>Sayfa boyutu:</span>
              <select
                value={pageSize}
                onChange={handlePageSizeChange}
                className="px-2 py-1 border border-slate-200 rounded bg-white text-xs"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              disabled={page.isFirst}
              onClick={() => setPageNumber(prev => Math.max(0, prev - 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: page.totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setPageNumber(idx)}
                className={`w-7 h-7 rounded text-xs font-semibold transition-colors ${
                  page.pageNumber === idx
                    ? 'bg-slate-900 text-white'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={page.isLast}
              onClick={() => setPageNumber(prev => Math.min(page.totalPages - 1, prev + 1))}
              className="p-1.5 rounded border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* YENİ ÇALIŞAN EKLEME MODALI */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 shadow-xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Yeni Çalışan Tanımlama (EmployeeBuilder)
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployee} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Ad *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={e => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="Örn: Burak"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Soyad *</label>
                  <input
                    type="text"
                    required
                    value={formData.lastName}
                    onChange={e => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="Örn: Yurt"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">TC Kimlik No *</label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    value={formData.tcNo}
                    onChange={e => setFormData({ ...formData, tcNo: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                    placeholder="11 haneli TC no"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">E-posta Adresi *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="burak.yurt@sirket.com"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="+90 532 000 0000"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Departman *</label>
                  <select
                    value={formData.department}
                    onChange={e => setFormData({ ...formData, department: e.target.value as Department })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    {Object.values(Department).map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pozisyon / Unvan *</label>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={e => setFormData({ ...formData, position: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                    placeholder="Örn: DevOps Mühendisi"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">İstihdam Türü *</label>
                  <select
                    value={formData.employmentType}
                    onChange={e => setFormData({ ...formData, employmentType: e.target.value as EmploymentType })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs bg-white"
                  >
                    {Object.values(EmploymentType).map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Brüt Taban Maaş (₺) *</label>
                  <input
                    type="number"
                    required
                    min={20000}
                    step={1000}
                    value={formData.baseSalary}
                    onChange={e => setFormData({ ...formData, baseSalary: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Yıllık İzin Hakkı (Gün)</label>
                  <input
                    type="number"
                    value={formData.remainingLeaveDays}
                    onChange={e => setFormData({ ...formData, remainingLeaveDays: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">İkamet Adresi</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={e => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="p-3 bg-indigo-50/60 border border-indigo-100 rounded-lg text-[11px] text-indigo-900">
                <strong>Spring Data İlişkisi:</strong> Yeni eklenen çalışan, otomatik olarak İK Yöneticisi Enes Öztürk amirliğine (<code className="font-mono">@ManyToOne</code>) bağlanır ve maaşı Strategy Pattern ile hesaplanır.
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg"
                >
                  Kaydet & Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ÇALIŞAN DETAY / DOSYA MODALI */}
      {isDetailModalOpen && selectedEmployee && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {selectedEmployee.firstName} {selectedEmployee.lastName}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Personel ID: {selectedEmployee.id}
                </p>
              </div>
              <button onClick={() => setIsDetailModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 p-3 bg-slate-50 rounded-lg">
                <div>
                  <span className="text-slate-400 block">Departman</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.department}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Pozisyon</span>
                  <span className="font-semibold text-slate-800">{selectedEmployee.position}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">İşe Başlama</span>
                  <span className="font-mono text-slate-700">{selectedEmployee.hireDate}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">İstihdam Tipi</span>
                  <span className="text-slate-700">{selectedEmployee.employmentType}</span>
                </div>
              </div>

              <div className="p-3 border border-emerald-100 bg-emerald-50/40 rounded-lg space-y-1">
                <div className="flex justify-between font-bold text-emerald-900">
                  <span>Net Maaş (Aylık):</span>
                  <span className="tabular-nums">₺{selectedEmployee.netSalary.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Brüt Taban:</span>
                  <span className="tabular-nums">₺{selectedEmployee.baseSalary.toLocaleString('tr-TR')}</span>
                </div>
                <div className="flex justify-between text-slate-600 text-[11px]">
                  <span>Kalan Yıllık İzin:</span>
                  <span className="font-bold text-slate-900">{selectedEmployee.remainingLeaveDays} Gün</span>
                </div>
              </div>

              <div className="text-[11px] text-slate-500 space-y-1">
                <div><strong>İletişim:</strong> {selectedEmployee.email} · {selectedEmployee.phone}</div>
                <div><strong>Adres:</strong> {selectedEmployee.address}</div>
                <div><strong>İdari Amir:</strong> Enes Öztürk (İnsan Kaynakları Direktörü)</div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-900 text-white rounded-lg text-xs font-semibold"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
