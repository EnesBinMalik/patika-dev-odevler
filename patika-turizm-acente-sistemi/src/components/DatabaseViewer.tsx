/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - İlişkisel Veritabanı ve SQL Konsolu
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Database,
  Table,
  Terminal,
  Play,
  RotateCcw,
  Download,
  CheckCircle2,
  AlertCircle,
  Copy,
  Layers,
  Sparkles,
} from 'lucide-react';

export const DatabaseViewer: React.FC = () => {
  const {
    users,
    hotels,
    seasons,
    rooms,
    reservations,
    resetDatabase,
    exportDatabaseJson,
    executeSql,
  } = useDatabase();

  const [activeTable, setActiveTable] = useState<
    'user' | 'otel' | 'season' | 'room' | 'reservation' | 'schema'
  >('otel');

  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM room WHERE stock > 0;');
  const [sqlResult, setSqlResult] = useState<{
    columns: string[];
    rows: any[];
    error?: string;
    message?: string;
  } | null>(null);

  const [copied, setCopied] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const handleRunSql = () => {
    const result = executeSql(sqlQuery);
    setSqlResult(result);
  };

  const handleExport = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `patika_turizm_db_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setNotification('Tüm ilişkisel veritabanı JSON olarak indirildi.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleReset = () => {
    if (window.confirm('Veritabanını başlangıç tohum verilerine (Seed Data) sıfırlamak istiyor musunuz?')) {
      resetDatabase();
      setNotification('Veritabanı başarıyla ilk haline sıfırlandı.');
      setSqlResult(null);
      setTimeout(() => setNotification(null), 3500);
    }
  };

  const schemaSqlText = `-- ==========================================
-- PATİKA TURİZM ACENTE SİSTEMİ
-- PostgreSQL / MySQL İlişkisel Veritabanı Şeması
-- Geliştirici: Enes Öztürk
-- ==========================================

CREATE TABLE user (
    id VARCHAR(36) PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'personel')),
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE otel (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    city VARCHAR(50) NOT NULL,
    district VARCHAR(50) NOT NULL,
    address TEXT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(30),
    star_rating INT NOT NULL CHECK (star_rating BETWEEN 1 AND 5),
    facilities JSON,
    pension_types JSON,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE season (
    id VARCHAR(36) PRIMARY KEY,
    otel_id VARCHAR(36) NOT NULL,
    name VARCHAR(100) NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

CREATE TABLE pension_type (
    id VARCHAR(36) PRIMARY KEY,
    otel_id VARCHAR(36) NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE
);

CREATE TABLE room (
    id VARCHAR(36) PRIMARY KEY,
    otel_id VARCHAR(36) NOT NULL,
    season_id VARCHAR(36) NOT NULL,
    pension_type VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL CHECK (room_type IN ('Single Room', 'Double Room', 'Junior Suite', 'Suite')),
    adult_price NUMERIC(10, 2) NOT NULL,
    child_price NUMERIC(10, 2) NOT NULL,
    stock INT NOT NULL DEFAULT 0,
    bed_count INT NOT NULL DEFAULT 1,
    square_meters INT NOT NULL,
    has_tv BOOLEAN DEFAULT TRUE,
    has_minibar BOOLEAN DEFAULT TRUE,
    has_console BOOLEAN DEFAULT FALSE,
    has_safe BOOLEAN DEFAULT TRUE,
    has_projector BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (otel_id) REFERENCES otel(id) ON DELETE CASCADE,
    FOREIGN KEY (season_id) REFERENCES season(id) ON DELETE CASCADE
);

CREATE TABLE reservation (
    id VARCHAR(36) PRIMARY KEY,
    room_id VARCHAR(36) NOT NULL,
    otel_id VARCHAR(36) NOT NULL,
    season_id VARCHAR(36) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100),
    customer_phone VARCHAR(30) NOT NULL,
    customer_identity VARCHAR(20) NOT NULL,
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    night_count INT NOT NULL,
    adult_count INT NOT NULL,
    child_count INT NOT NULL DEFAULT 0,
    total_price NUMERIC(12, 2) NOT NULL,
    pension_type VARCHAR(50) NOT NULL,
    room_type VARCHAR(50) NOT NULL,
    guests JSON,
    status VARCHAR(20) DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
    notes TEXT,
    created_by VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (room_id) REFERENCES room(id),
    FOREIGN KEY (otel_id) REFERENCES otel(id)
);`;

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <Database className="w-4 h-4" />
            İlişkisel Veritabanı Modeli & SQL Konsolu
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Veritabanı Tabloları & SQL Denetçisi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sistemde yer alan <code>user</code>, <code>otel</code>, <code>season</code>, <code>room</code> ve <code>reservation</code> tablolarını canlı olarak inceleyebilir, SQL sorguları çalıştırabilirsiniz.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            JSON Dışa Aktar
          </button>
          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-3 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 text-xs font-semibold rounded-xl transition-colors border border-rose-200/60"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Veritabanını Sıfırla
          </button>
        </div>
      </div>

      {notification && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* SQL Query Console Box */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white space-y-3 shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-mono font-bold">
            <Terminal className="w-4 h-4" />
            SQL SORGUSU ÇALIŞTIRICI (CONSOLE)
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            Hızlı: SELECT * FROM [otel | room | user | season | reservation]
          </div>
        </div>

        <div className="relative">
          <textarea
            rows={2}
            value={sqlQuery}
            onChange={(e) => setSqlQuery(e.target.value)}
            className="w-full bg-slate-950 text-sky-300 font-mono text-xs p-3.5 rounded-xl border border-slate-800 focus:outline-hidden focus:ring-1 focus:ring-sky-500"
          />
        </div>

        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {[
              'SELECT * FROM otel;',
              'SELECT * FROM room WHERE stock > 0;',
              'SELECT * FROM season;',
              'SELECT * FROM reservation;',
            ].map((q) => (
              <button
                key={q}
                onClick={() => setSqlQuery(q)}
                className="hidden md:inline-block text-[11px] font-mono text-slate-400 hover:text-white bg-slate-800 px-2.5 py-1 rounded-md transition-colors"
              >
                {q}
              </button>
            ))}
          </div>

          <button
            onClick={handleRunSql}
            className="flex items-center gap-1.5 px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 fill-white" />
            Sorguyu Çalıştır
          </button>
        </div>

        {/* SQL Output Table */}
        {sqlResult && (
          <div className="mt-4 pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span className="text-emerald-400 font-mono">
                {sqlResult.message || 'Sorgu tamamlandı'}
              </span>
              <span className="font-mono">{sqlResult.rows?.length || 0} satır</span>
            </div>

            {sqlResult.error ? (
              <div className="p-3 bg-rose-950/60 border border-rose-800 text-rose-300 rounded-lg text-xs font-mono">
                Hata: {sqlResult.error}
              </div>
            ) : (
              <div className="overflow-x-auto max-h-56 overflow-y-auto border border-slate-800 rounded-xl bg-slate-950">
                <table className="w-full text-left text-xs font-mono">
                  <thead className="bg-slate-900 border-b border-slate-800 text-slate-400">
                    <tr>
                      {sqlResult.columns.map((col) => (
                        <th key={col} className="px-3 py-2 text-[11px]">
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900 text-slate-300">
                    {sqlResult.rows.map((row, i) => (
                      <tr key={i} className="hover:bg-slate-900/40">
                        {sqlResult.columns.map((col) => (
                          <td key={col} className="px-3 py-2 text-[11px]">
                            {typeof row[col] === 'object'
                              ? JSON.stringify(row[col])
                              : String(row[col] ?? '')}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Relational Table Selector Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-xl">
        <button
          onClick={() => setActiveTable('otel')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTable === 'otel'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          otel ({hotels.length})
        </button>

        <button
          onClick={() => setActiveTable('season')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTable === 'season'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          season ({seasons.length})
        </button>

        <button
          onClick={() => setActiveTable('room')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTable === 'room'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          room ({rooms.length})
        </button>

        <button
          onClick={() => setActiveTable('reservation')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTable === 'reservation'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          reservation ({reservations.length})
        </button>

        <button
          onClick={() => setActiveTable('user')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ${
            activeTable === 'user'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Table className="w-3.5 h-3.5" />
          user ({users.length})
        </button>

        <button
          onClick={() => setActiveTable('schema')}
          className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all ml-auto ${
            activeTable === 'schema'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-indigo-600 hover:bg-indigo-50'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          SQL Şema Tanımı (DDL)
        </button>
      </div>

      {/* Table Data View */}
      {activeTable === 'schema' ? (
        <div className="bg-slate-900 text-slate-200 p-6 rounded-2xl border border-slate-800 font-mono text-xs overflow-x-auto space-y-4">
          <div className="flex items-center justify-between text-slate-400">
            <span>PATIKA TURİZM - DDL VERİTABANI ŞEMASI (SQL SCRIPT)</span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(schemaSqlText);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-[11px]"
            >
              <Copy className="w-3 h-3" />
              {copied ? 'Kopyalandı!' : 'SQL Kopyala'}
            </button>
          </div>
          <pre className="text-emerald-400 leading-relaxed overflow-x-auto">
            {schemaSqlText}
          </pre>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            {activeTable === 'otel' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">name</th>
                    <th className="px-4 py-3">city</th>
                    <th className="px-4 py-3">district</th>
                    <th className="px-4 py-3">star_rating</th>
                    <th className="px-4 py-3">pension_types (Array)</th>
                    <th className="px-4 py-3">phone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {hotels.map((h) => (
                    <tr key={h.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sky-700 font-bold">{h.id}</td>
                      <td className="px-4 py-3 font-sans font-bold text-slate-900">{h.name}</td>
                      <td className="px-4 py-3">{h.city}</td>
                      <td className="px-4 py-3">{h.district}</td>
                      <td className="px-4 py-3 font-bold text-amber-600">{h.star_rating} Yıldız</td>
                      <td className="px-4 py-3 text-slate-500">{h.pension_types.join(', ')}</td>
                      <td className="px-4 py-3">{h.phone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'season' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">otel_id (FK)</th>
                    <th className="px-4 py-3">name</th>
                    <th className="px-4 py-3">start_date</th>
                    <th className="px-4 py-3">end_date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {seasons.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sky-700 font-bold">{s.id}</td>
                      <td className="px-4 py-3 text-indigo-700">{s.otel_id}</td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-900">{s.name}</td>
                      <td className="px-4 py-3">{s.start_date}</td>
                      <td className="px-4 py-3">{s.end_date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'room' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">otel_id (FK)</th>
                    <th className="px-4 py-3">season_id (FK)</th>
                    <th className="px-4 py-3">room_type</th>
                    <th className="px-4 py-3">pension_type</th>
                    <th className="px-4 py-3 text-right">adult_price</th>
                    <th className="px-4 py-3 text-right">child_price</th>
                    <th className="px-4 py-3 text-center">stock</th>
                    <th className="px-4 py-3 text-center">bed_count</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {rooms.map((r) => (
                    <tr key={r.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sky-700 font-bold">{r.id}</td>
                      <td className="px-4 py-3 text-indigo-700">{r.otel_id}</td>
                      <td className="px-4 py-3 text-purple-700">{r.season_id}</td>
                      <td className="px-4 py-3 font-sans font-semibold text-slate-900">{r.room_type}</td>
                      <td className="px-4 py-3 text-sky-800">{r.pension_type}</td>
                      <td className="px-4 py-3 text-right font-bold text-slate-900">{r.adult_price} ₺</td>
                      <td className="px-4 py-3 text-right text-slate-500">{r.child_price} ₺</td>
                      <td className="px-4 py-3 text-center font-bold text-emerald-700">{r.stock}</td>
                      <td className="px-4 py-3 text-center">{r.bed_count}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'reservation' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">customer_name</th>
                    <th className="px-4 py-3">customer_identity</th>
                    <th className="px-4 py-3">room_id (FK)</th>
                    <th className="px-4 py-3">dates</th>
                    <th className="px-4 py-3">night_count</th>
                    <th className="px-4 py-3 text-right">total_price</th>
                    <th className="px-4 py-3 text-center">status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {reservations.map((res) => (
                    <tr key={res.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sky-700 font-bold">{res.id}</td>
                      <td className="px-4 py-3 font-sans font-bold text-slate-900">{res.customer_name}</td>
                      <td className="px-4 py-3">{res.customer_identity}</td>
                      <td className="px-4 py-3 text-purple-700">{res.room_id}</td>
                      <td className="px-4 py-3">{res.check_in_date} ~ {res.check_out_date}</td>
                      <td className="px-4 py-3 text-center">{res.night_count} Gece</td>
                      <td className="px-4 py-3 text-right font-bold text-emerald-700">{res.total_price.toLocaleString('tr-TR')} ₺</td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          res.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                        }`}>
                          {res.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}

            {activeTable === 'user' && (
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-mono text-[11px]">
                  <tr>
                    <th className="px-4 py-3">id</th>
                    <th className="px-4 py-3">username</th>
                    <th className="px-4 py-3">role</th>
                    <th className="px-4 py-3">full_name</th>
                    <th className="px-4 py-3">email</th>
                    <th className="px-4 py-3">created_at</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono text-[11px]">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-slate-50/60">
                      <td className="px-4 py-3 text-sky-700 font-bold">{u.id}</td>
                      <td className="px-4 py-3 font-bold text-slate-900">@{u.username}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          u.role === 'admin' ? 'bg-indigo-100 text-indigo-800' : 'bg-emerald-100 text-emerald-800'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-sans font-medium">{u.full_name}</td>
                      <td className="px-4 py-3 text-slate-500">{u.email}</td>
                      <td className="px-4 py-3 text-slate-400">{new Date(u.created_at).toLocaleDateString('tr-TR')}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
