/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Veritabanı ve I/O Dosya Yönetimi (Database & Input/Output File Engine)
 * Geliştirici: Enes Öztürk
 * 
 * "Sistemdeki kullanıcılar için Hem database kaydetmek ve io(input/output) dosya kaydetmek"
 * H2 / PostgreSQL Konsol Benzetimi & JSON/CSV/TXT Dosya Depolama
 */

import React, { useState, useRef } from 'react';
import { 
  Database, 
  Download, 
  Upload, 
  FileCode, 
  RotateCcw, 
  Play, 
  CheckCircle2, 
  AlertCircle, 
  FileSpreadsheet,
  Terminal,
  Save
} from 'lucide-react';
import { DatabaseEngine } from '../core/database';
import { HRService } from '../services/hrService';

interface DatabaseIOViewProps {
  onRefresh: () => void;
}

export const DatabaseIOView: React.FC<DatabaseIOViewProps> = ({ onRefresh }) => {
  const db = DatabaseEngine.getInstance();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // SQL Query Runner State
  const [sqlQuery, setSqlQuery] = useState('SELECT first_name, last_name, department, base_salary, net_salary FROM EMPLOYEES ORDER BY net_salary DESC;');
  const [sqlResult, setSqlResult] = useState<any[] | null>(null);
  const [sqlMessage, setSqlMessage] = useState<string>('Sorgu çalıştırmaya hazır.');
  const [importStatus, setImportStatus] = useState<{ success: boolean; message: string } | null>(null);

  const users = db.getUsers();
  const employees = db.getEmployees();
  const leaves = db.getLeaves();
  const salaries = db.getSalaries();
  const logs = db.getAuditLogs();

  // JSON Dosyasından Geri Yükle (I/O Import)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      const res = await db.importFullDatabaseFromJson(content);
      setImportStatus(res);
      if (res.success) {
        onRefresh();
      }
    };
    reader.readAsText(file);
    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Basit SQL Sorgu Yorumlayıcı Benzetimi
  const handleExecuteSql = () => {
    const q = sqlQuery.trim().toLowerCase();
    setSqlResult(null);

    try {
      if (q.includes('from employees')) {
        let res = employees.map(e => ({
          ID: e.id,
          Ad_Soyad: `${e.firstName} ${e.lastName}`,
          TC_No: e.tcNo,
          Departman: e.department,
          Pozisyon: e.position,
          Brut_Maas: `₺${e.baseSalary.toLocaleString('tr-TR')}`,
          Net_Maas: `₺${e.netSalary.toLocaleString('tr-TR')}`,
          Kalan_Izin: `${e.remainingLeaveDays} gün`,
          Durum: e.isActive ? 'AKTİF' : 'PASİF',
        }));

        if (q.includes('order by net_salary desc')) {
          res = res.sort((a, b) => b.Net_Maas.localeCompare(a.Net_Maas));
        }
        setSqlResult(res);
        setSqlMessage(`Başarılı: EMPLOYEES tablosundan ${res.length} satır getirildi.`);
      } else if (q.includes('from users')) {
        const res = users.map(u => ({
          ID: u.id,
          Kullanici_Adi: u.username,
          Eposta: u.email,
          Sifre_Hash: u.passwordHash.substring(0, 16) + '... (MASKELİ)',
          Rol: u.role,
          Hatali_Giris_Sayisi: u.failedLoginAttempts,
          Bloke_Mi: u.isLocked ? 'EVET (KİLİTLİ)' : 'HAYIR',
        }));
        setSqlResult(res);
        setSqlMessage(`Başarılı: USERS tablosundan ${res.length} satır getirildi.`);
      } else if (q.includes('from leave_requests') || q.includes('from leaves')) {
        const res = leaves.map(l => ({
          ID: l.id,
          Calisan: l.employeeName,
          Departman: l.department,
          Izin_Turu: l.leaveType,
          Baslangic: l.startDate,
          Bitis: l.endDate,
          Toplam_Gun: l.totalDays,
          Durum: l.status,
        }));
        setSqlResult(res);
        setSqlMessage(`Başarılı: LEAVE_REQUESTS tablosundan ${res.length} satır getirildi.`);
      } else if (q.includes('from salary_records') || q.includes('from salaries')) {
        const res = salaries.map(s => ({
          ID: s.id,
          Calisan: s.employeeName,
          Donem: `${s.periodMonth}/${s.periodYear}`,
          Brut: `₺${s.baseSalary.toLocaleString('tr-TR')}`,
          SGK_Isci: `₺${s.sgkWorkerShare.toLocaleString('tr-TR')}`,
          Gelir_Vergisi: `₺${s.incomeTax.toLocaleString('tr-TR')}`,
          Net_Maas: `₺${s.netSalary.toLocaleString('tr-TR')}`,
        }));
        setSqlResult(res);
        setSqlMessage(`Başarılı: SALARY_RECORDS tablosundan ${res.length} satır getirildi.`);
      } else {
        setSqlMessage('Desteklenen tablolar: EMPLOYEES, USERS, LEAVE_REQUESTS, SALARY_RECORDS.');
      }
    } catch (e: any) {
      setSqlMessage('SQL Hata: ' + e.message);
    }
  };

  const handleResetDefaults = async () => {
    if (confirm('Veritabanını ilk tohum verilerine sıfırlamak istediğinize emin misiniz?')) {
      await db.resetToDefaults();
      onRefresh();
      alert('Veritabanı sıfırlandı ve varsayılan veriler yüklendi.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Başlık ve Kural Vurgusu */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            <span>Kalıcılık Katmanı</span>
            <span>·</span>
            <span>Veritabanı & Dosya I/O Motoru</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
            <Database className="w-6 h-6 text-indigo-600" />
            Veritabanı (H2/Postgres) ve I/O Dosya Kayıt Merkezi
          </h2>
          <p className="text-xs text-slate-600 mt-1 max-w-2xl">
            "Sistemdeki kullanıcılar için hem database kaydetmek ve I/O (input/output) dosya kaydetmek" gereksinimini sağlayan entegre veri yedekleme, dışa aktarma ve SQL sorgulama konsolu.
          </p>
        </div>

        <button
          onClick={handleResetDefaults}
          className="px-3.5 py-2 bg-white border border-slate-200 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 self-start md:self-auto"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Veritabanını Sıfırla</span>
        </button>
      </div>

      {/* I/O (Input/Output) Dosya İşlemleri Bölümü */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. JSON Full Backup (I/O Export) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Save className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Veritabanı JSON Yedeği Al (I/O Export)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tüm tabloları (Users, Employees, Leaves, Salaries, Logs) JSON dosyası olarak diske yazar.
            </p>
          </div>
          <button
            onClick={() => db.exportFullDatabaseToJson()}
            className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>JSON Yedeği İndir</span>
          </button>
        </div>

        {/* 2. JSON Dosyasından Geri Yükle (I/O Import) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Upload className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Dosyadan Veritabanı Geri Yükle (I/O Import)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Önceden indirilmiş JSON yedek dosyasını içeri aktararak veritabanını günceller.
            </p>
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              accept=".json"
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>JSON Dosyası Seç & Yükle</span>
            </button>
          </div>
        </div>

        {/* 3. CSV Tablo Raporları (I/O CSV Export) */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-xs space-y-3">
          <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
            <FileSpreadsheet className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">Excel / CSV Tablosu İndir (I/O Export)</h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Çalışan maaşları ve personel listesini CSV formatında dosya olarak kaydeder.
            </p>
          </div>
          <button
            onClick={() => db.exportEmployeesToCsv()}
            className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Çalışanlar CSV İndir</span>
          </button>
        </div>
      </div>

      {/* İçe Aktarma Durumu Bildirimi */}
      {importStatus && (
        <div className={`p-4 rounded-xl text-xs flex items-center gap-3 border ${
          importStatus.success ? 'bg-emerald-50 text-emerald-900 border-emerald-200' : 'bg-rose-50 text-rose-900 border-rose-200'
        }`}>
          {importStatus.success ? <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" /> : <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />}
          <span>{importStatus.message}</span>
        </div>
      )}

      {/* Canlı SQL Konsolu / H2 Database Query Runner */}
      <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-indigo-600" />
              İnteraktif SQL / H2 Veritabanı Sorgu Konsolu
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Kayıtlı veritabanı tablolarını SQL sorguları ile anlık olarak sorgulayın ve doğrulayın.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500">
            <span>H2 2.2.224 (Embedded)</span>
          </div>
        </div>

        {/* Hızlı SQL Düğmeleri */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="text-slate-400 text-[11px] font-mono">Örnek Sorgular:</span>
          <button
            onClick={() => setSqlQuery('SELECT first_name, last_name, department, base_salary, net_salary FROM EMPLOYEES ORDER BY net_salary DESC;')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[11px]"
          >
            Maaş Sıralı Çalışanlar
          </button>
          <button
            onClick={() => setSqlQuery('SELECT * FROM USERS;')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[11px]"
          >
            Tüm Kullanıcılar (Maskeli Şifreler)
          </button>
          <button
            onClick={() => setSqlQuery('SELECT * FROM LEAVE_REQUESTS;')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[11px]"
          >
            Tüm İzin Talepleri
          </button>
          <button
            onClick={() => setSqlQuery('SELECT * FROM SALARY_RECORDS;')}
            className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 rounded text-slate-700 font-mono text-[11px]"
          >
            Bordro Hesaplamaları
          </button>
        </div>

        {/* SQL Input Alanı */}
        <div className="space-y-2">
          <div className="relative">
            <textarea
              rows={3}
              value={sqlQuery}
              onChange={e => setSqlQuery(e.target.value)}
              className="w-full p-3 font-mono text-xs bg-slate-900 text-emerald-400 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono text-slate-500">{sqlMessage}</span>
            <button
              onClick={handleExecuteSql}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Sorguyu Çalıştır (Execute SQL)</span>
            </button>
          </div>
        </div>

        {/* SQL Sonuç Tablosu */}
        {sqlResult && sqlResult.length > 0 && (
          <div className="border border-slate-200 rounded-lg overflow-x-auto text-xs">
            <table className="w-full text-left font-mono">
              <thead>
                <tr className="bg-slate-100 text-slate-700 border-b border-slate-200">
                  {Object.keys(sqlResult[0]).map(key => (
                    <th key={key} className="py-2 px-3 font-bold">{key}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sqlResult.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    {Object.values(row).map((val: any, colIdx) => (
                      <td key={colIdx} className="py-2 px-3 text-slate-800">
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
