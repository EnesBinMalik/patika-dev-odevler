/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Maaş & Bordro Yönetimi (Salary & Payroll Management)
 * Geliştirici: Enes Öztürk
 * 
 * "Hangi çalışana ne kadar maaş veriliyor bilgisine v.b erişim sağlamalıdır"
 * Strategy Pattern ile net maaş, SGK, vergi kesintileri ve bordro yazdırma
 */

import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Printer, 
  Edit2, 
  Download, 
  Search, 
  Calculator, 
  CheckCircle,
  X
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { IEmployee, ISalaryRecord } from '../models/types';
import { PayrollStrategyContext } from '../core/patterns';

interface SalaryManagementProps {
  onRefresh: () => void;
}

export const SalaryManagement: React.FC<SalaryManagementProps> = ({ onRefresh }) => {
  const hrService = HRService.getInstance();
  const employees = hrService.getEmployeesPaged({ pageNumber: 0, pageSize: 100 }).content;

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEmployeeForEdit, setSelectedEmployeeForEdit] = useState<IEmployee | null>(null);
  const [selectedSalaryForSlip, setSelectedSalaryForSlip] = useState<{ emp: IEmployee; record: ISalaryRecord } | null>(null);

  // Düzenleme Formu
  const [editBaseSalary, setEditBaseSalary] = useState(0);
  const [editBonus, setEditBonus] = useState(0);
  const [editDeductions, setEditDeductions] = useState(0);

  const filteredEmployees = employees.filter(e =>
    `${e.firstName} ${e.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.department.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenEdit = (emp: IEmployee) => {
    setSelectedEmployeeForEdit(emp);
    setEditBaseSalary(emp.baseSalary);
    setEditBonus(emp.bonus || 0);
    setEditDeductions(emp.deductions || 0);
  };

  const handleSaveSalary = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmployeeForEdit) return;

    hrService.updateEmployeeSalary(
      selectedEmployeeForEdit.id,
      editBaseSalary,
      editBonus,
      editDeductions
    );

    setSelectedEmployeeForEdit(null);
    onRefresh();
  };

  const handleOpenPayslip = (emp: IEmployee) => {
    const strategy = PayrollStrategyContext.getStrategy(emp.employmentType);
    const calc = strategy.calculate(emp.baseSalary, emp.bonus, emp.deductions);

    const record: ISalaryRecord = {
      id: 'payslip-' + emp.id,
      employeeId: emp.id,
      employeeName: `${emp.firstName} ${emp.lastName}`,
      tcNo: emp.tcNo,
      department: emp.department,
      periodMonth: new Date().getMonth() + 1,
      periodYear: new Date().getFullYear(),
      baseSalary: calc.baseSalary,
      sgkWorkerShare: calc.sgkWorkerShare,
      unemploymentShare: calc.unemploymentShare,
      incomeTax: calc.incomeTax,
      stampTax: calc.stampTax,
      bonus: calc.bonus,
      deductions: calc.deductions,
      netSalary: calc.netSalary,
      paymentStatus: 'ODENDI',
      paymentDate: new Date().toISOString().slice(0, 10),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    setSelectedSalaryForSlip({ emp, record });
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Bilgilendirme */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-600" />
            Maaş, Bordro ve Yan Haklar Yönetimi
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            İnsan Kaynakları Uzmanı personelin güncel brüt, net, prim ve yasal SGK kesintilerini yönetir.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs">
          <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-900 font-medium">
            Maaş Hesaplama Motoru: <strong>Strategy Pattern (4A SGK Mevzuatı)</strong>
          </div>
        </div>
      </div>

      {/* Arama */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-xs flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Maaş listesinde isim veya departman ile ara..."
            className="w-full pl-9 pr-4 py-2 text-xs border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Maaş Tablosu */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <th className="py-3 px-4">Personel</th>
                <th className="py-3 px-4">Departman & Unvan</th>
                <th className="py-3 px-4 text-right">Brüt Taban</th>
                <th className="py-3 px-4 text-right">SGK & İşsizlik (%15)</th>
                <th className="py-3 px-4 text-right">Gelir & Damga Vergisi</th>
                <th className="py-3 px-4 text-right">Prim / Kesinti</th>
                <th className="py-3 px-4 text-right font-bold text-slate-900">Net Ele Geçen</th>
                <th className="py-3 px-4 text-center">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredEmployees.map(emp => {
                const strategy = PayrollStrategyContext.getStrategy(emp.employmentType);
                const calc = strategy.calculate(emp.baseSalary, emp.bonus, emp.deductions);

                return (
                  <tr key={emp.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Personel */}
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{emp.firstName} {emp.lastName}</div>
                      <div className="text-[11px] text-slate-500 font-mono">TC: {emp.tcNo}</div>
                    </td>

                    {/* Departman */}
                    <td className="py-3 px-4">
                      <div className="text-slate-800 font-medium">{emp.department}</div>
                      <div className="text-[11px] text-slate-500">{emp.position}</div>
                    </td>

                    {/* Brüt Taban */}
                    <td className="py-3 px-4 text-right font-mono font-medium text-slate-700 tabular-nums">
                      ₺{emp.baseSalary.toLocaleString('tr-TR')}
                    </td>

                    {/* SGK & İşsizlik */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      -₺{(calc.sgkWorkerShare + calc.unemploymentShare).toLocaleString('tr-TR')}
                    </td>

                    {/* Vergi */}
                    <td className="py-3 px-4 text-right font-mono text-slate-600 tabular-nums">
                      -₺{(calc.incomeTax + calc.stampTax).toLocaleString('tr-TR')}
                    </td>

                    {/* Prim / Kesinti */}
                    <td className="py-3 px-4 text-right font-mono tabular-nums">
                      <span className="text-emerald-600">+{emp.bonus || 0}</span>
                      <span className="text-slate-300 mx-1">/</span>
                      <span className="text-rose-600">-{emp.deductions || 0}</span>
                    </td>

                    {/* Net Maaş */}
                    <td className="py-3 px-4 text-right font-mono font-bold text-emerald-700 text-sm tabular-nums">
                      ₺{calc.netSalary.toLocaleString('tr-TR')}
                    </td>

                    {/* Eylemler */}
                    <td className="py-3 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(emp)}
                          title="Maaşı Güncelle"
                          className="p-1.5 text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-colors"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleOpenPayslip(emp)}
                          title="Bordro / Maaş Pusulası Görüntüle & Yazdır"
                          className="p-1.5 text-slate-600 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                        >
                          <FileText className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* MAAŞ GÜNCELLEME MODALI */}
      {selectedEmployeeForEdit && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Maaş & Yan Hakları Düzenle
              </h3>
              <button onClick={() => setSelectedEmployeeForEdit(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-500">
              <strong>{selectedEmployeeForEdit.firstName} {selectedEmployeeForEdit.lastName}</strong> ({selectedEmployeeForEdit.position})
            </div>

            <form onSubmit={handleSaveSalary} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Brüt Taban Maaş (₺)</label>
                <input
                  type="number"
                  required
                  min={20000}
                  step={500}
                  value={editBaseSalary}
                  onChange={e => setEditBaseSalary(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Aylık Prim / İkramiye (₺)</label>
                <input
                  type="number"
                  min={0}
                  step={250}
                  value={editBonus}
                  onChange={e => setEditBonus(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kesintiler (BES, Avans vb.) (₺)</label>
                <input
                  type="number"
                  min={0}
                  step={250}
                  value={editDeductions}
                  onChange={e => setEditDeductions(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg font-mono text-xs"
                />
              </div>

              {/* Anlık Net Hesaplama Önizlemesi */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg text-xs space-y-1">
                <div className="font-semibold text-emerald-900">Hesaplanan Tahmini Net Maaş:</div>
                <div className="text-lg font-bold font-mono text-emerald-800 tabular-nums">
                  ₺{PayrollStrategyContext.getStrategy(selectedEmployeeForEdit.employmentType).calculate(editBaseSalary, editBonus, editDeductions).netSalary.toLocaleString('tr-TR')}
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedEmployeeForEdit(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Vazgeç
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg"
                >
                  Maaşı Onayla & Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BORDRO / MAAŞ PUSULASI MODALI (YAZDIRILABİLİR) */}
      {selectedSalaryForSlip && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 space-y-6 max-h-[95vh] overflow-y-auto">
            {/* Yazdırma ve Kapatma Çubuğu */}
            <div className="flex items-center justify-between no-print border-b border-slate-100 pb-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Resmi Bordro Belgesi Önizleme
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Yazdır / PDF Olarak Kaydet</span>
                </button>
                <button
                  onClick={() => setSelectedSalaryForSlip(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Bordro Kağıt Tasarımı */}
            <div className="border border-slate-300 rounded-lg p-6 bg-white space-y-6 text-xs text-slate-800">
              {/* Başlık ve Şirket Bilgisi */}
              <div className="flex justify-between items-start border-b border-slate-300 pb-4">
                <div>
                  <h3 className="text-base font-bold uppercase tracking-wider text-slate-900">
                    ÜCRET HESAP PUSULASI (BORDRO)
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    İnsan Kaynakları Yönetim Sistemi · Enes Öztürk
                  </p>
                </div>
                <div className="text-right font-mono text-[11px]">
                  <div>Dönem: {selectedSalaryForSlip.record.periodMonth} / {selectedSalaryForSlip.record.periodYear}</div>
                  <div>Düzenleme Tarihi: {selectedSalaryForSlip.record.paymentDate}</div>
                </div>
              </div>

              {/* Personel Bilgisi */}
              <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded border border-slate-200">
                <div>
                  <div><strong>Personel Adı Soyadı:</strong> {selectedSalaryForSlip.record.employeeName}</div>
                  <div><strong>TC Kimlik No:</strong> {selectedSalaryForSlip.record.tcNo}</div>
                  <div><strong>Departman:</strong> {selectedSalaryForSlip.record.department}</div>
                </div>
                <div>
                  <div><strong>Görevi:</strong> {selectedSalaryForSlip.emp.position}</div>
                  <div><strong>İşe Başlama:</strong> {selectedSalaryForSlip.emp.hireDate}</div>
                  <div><strong>İstihdam Türü:</strong> {selectedSalaryForSlip.emp.employmentType}</div>
                </div>
              </div>

              {/* Kazançlar ve Kesintiler Tablosu */}
              <div className="grid grid-cols-2 gap-4">
                {/* Kazançlar */}
                <div className="border border-slate-200 rounded p-3 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                    KAZANÇLAR (HAK EDİŞLER)
                  </div>
                  <div className="flex justify-between">
                    <span>Brüt Taban Ücret:</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.baseSalary.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Prim / İkramiye:</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.bonus.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between font-bold pt-2 border-t border-slate-200 text-slate-900">
                    <span>TOPLAM BRÜT:</span>
                    <span className="font-mono tabular-nums">₺{(selectedSalaryForSlip.record.baseSalary + selectedSalaryForSlip.record.bonus).toLocaleString('tr-TR')}</span>
                  </div>
                </div>

                {/* Yasal Kesintiler */}
                <div className="border border-slate-200 rounded p-3 space-y-2">
                  <div className="font-bold text-slate-900 border-b border-slate-200 pb-1">
                    YASAL KESİNTİLER
                  </div>
                  <div className="flex justify-between">
                    <span>SGK İşçi Primi (%14):</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.sgkWorkerShare.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>İşsizlik Sigortası Primi (%1):</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.unemploymentShare.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Gelir Vergisi Matrahı:</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.incomeTax.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Damga Vergisi:</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.stampTax.toLocaleString('tr-TR')}</span>
                  </div>
                  <div className="flex justify-between text-rose-700">
                    <span>Özel Kesintiler / Avans:</span>
                    <span className="font-mono tabular-nums">₺{selectedSalaryForSlip.record.deductions.toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              </div>

              {/* Net Ödenecek */}
              <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-lg flex justify-between items-center text-sm">
                <span className="font-bold text-emerald-950 uppercase">NET ÖDENECEK TUTAR:</span>
                <span className="text-xl font-bold font-mono text-emerald-800 tabular-nums">
                  ₺{selectedSalaryForSlip.record.netSalary.toLocaleString('tr-TR')}
                </span>
              </div>

              {/* İmzalar */}
              <div className="grid grid-cols-2 gap-12 pt-6 text-center text-[11px] text-slate-500">
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold text-slate-800">İşveren / İK Yetkilisi</div>
                  <div>Enes Öztürk</div>
                  <div className="text-[10px] text-slate-400">İnsan Kaynakları Direktörü (Kaşe & İmza)</div>
                </div>
                <div className="border-t border-slate-300 pt-2">
                  <div className="font-bold text-slate-800">Personel İmzası</div>
                  <div>{selectedSalaryForSlip.record.employeeName}</div>
                  <div className="text-[10px] text-slate-400">Pusulayı eksiksiz teslim aldım</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
