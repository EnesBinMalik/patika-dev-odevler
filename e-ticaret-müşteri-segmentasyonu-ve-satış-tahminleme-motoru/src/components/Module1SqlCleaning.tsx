import React, { useState, useEffect } from 'react';
import { Play, Copy, Check, Terminal, Filter, AlertTriangle, Layers, Table as TableIcon, Sparkles } from 'lucide-react';
import { SQL_QUERY_TEMPLATES, ECOMMERCE_DATA } from '../data/ecommerceData';
import { executeSQL, SQLQueryResult } from '../services/sqlEngine';
import { detectOutliersTukey } from '../services/statistics';

export const Module1SqlCleaning: React.FC = () => {
  // SQL State
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('rfm_extraction');
  const [sqlQuery, setSqlQuery] = useState<string>(SQL_QUERY_TEMPLATES[0].sql);
  const [queryResult, setQueryResult] = useState<SQLQueryResult | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);
  const [activeSubTab, setActiveSubTab] = useState<'sql_runner' | 'pandas_pipeline' | 'schema_explorer'>('sql_runner');

  // Pandas Pipeline Interactive Parameters
  const [nullStrategy, setNullStrategy] = useState<'fill_mode' | 'drop'>('fill_mode');
  const [iqrMultiplier, setIqrMultiplier] = useState<number>(1.5);
  const [outlierAction, setOutlierAction] = useState<'remove' | 'winsorize'>('remove');
  const [scalingMethod, setScalingMethod] = useState<'log1p' | 'standard' | 'minmax'>('log1p');

  // Execute initial query
  useEffect(() => {
    runQuery(sqlQuery);
  }, []);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = SQL_QUERY_TEMPLATES.find((t) => t.id === templateId);
    if (tmpl) {
      setSqlQuery(tmpl.sql);
      runQuery(tmpl.sql);
    }
  };

  const runQuery = (queryToRun: string) => {
    const res = executeSQL(queryToRun);
    setQueryResult(res);
    setCurrentPage(1);
  };

  // Outlier detection calculation on total_amount
  const orderAmounts = ECOMMERCE_DATA.orders.filter((o) => o.order_status === 'COMPLETED').map((o) => o.total_amount);
  const outlierData = detectOutliersTukey(orderAmounts, iqrMultiplier);

  // Synchronized Python / Pandas Code
  const generatedPythonCode = `# ====================================================================
# MODÜL 1: SQL VERİ ÇEKME VE PANDAS ÖN İŞLEME HATTI (ETL)
# Hazırlayan: Enes Öztürk | Veri Bilimci & Analitik Mühendisi
# ====================================================================

import pandas as pd
import numpy as np
import sqlite3

# 1. İlişkisel Veritabanı Bağlantısı ve SQL ile Çekim
conn = sqlite3.connect('ecommerce_dw.db')

sql_query = """
${sqlQuery}
"""

df = pd.read_sql_query(sql_query, conn)
print(f"Çekilen Ham Satır Sayısı: {df.shape[0]}")

# 2. Eksik Değerlerin (Null/NaN) Yönetimi
${
  nullStrategy === 'fill_mode'
    ? `# Strateji: Kategorik eksikleri 'Bilinmiyor' olarak doldurma
df['city'] = df['city'].fillna('Bilinmiyor')
print(f"Kalan Null Değer: {df.isnull().sum().sum()}")`
    : `# Strateji: Eksik değere sahip satırları veri setinden çıkarma
df = df.dropna(subset=['city'])
print(f"Temizleme Sonrası Satır Sayısı: {df.shape[0]}")`
}

# 3. Tukey IQR Yöntemi ile Aykırı Değer (Outlier) Filtreleme
# Formül: IQR = Q3 - Q1 | Alt = Q1 - k*IQR | Üst = Q3 + k*IQR (k=${iqrMultiplier})
q1 = df['total_monetary'].quantile(0.25)
q3 = df['total_monetary'].quantile(0.75)
iqr = q3 - q1
lower_bound = q1 - (${iqrMultiplier} * iqr)
upper_bound = q3 + (${iqrMultiplier} * iqr)

${
  outlierAction === 'remove'
    ? `# Aykırı uç değerleri eleme
outliers_mask = (df['total_monetary'] < lower_bound) | (df['total_monetary'] > upper_bound)
print(f"Tespit Edilen Aykırı Satır: {outliers_mask.sum()}")
df_clean = df[~outliers_mask].copy()`
    : `# Winsorization: Aşırı uçları üst/alt sınıra baskılama
df_clean = df.copy()
df_clean['total_monetary'] = np.clip(df_clean['total_monetary'], lower_bound, upper_bound)
print("Aykırı değerler sınırlar içine baskılandı.")`
}

# 4. Özellik Mühendisliği (Feature Engineering)
snapshot_date = pd.to_datetime('2026-11-01')
df_clean['last_order_date'] = pd.to_datetime(df_clean['last_order_date'])
df_clean['recency_days'] = (snapshot_date - df_clean['last_order_date']).dt.days
df_clean['aov'] = df_clean['total_monetary'] / df_clean['total_orders']

# 5. Normalizasyon & Dağılım Dönüşümü (${scalingMethod})
${
  scalingMethod === 'log1p'
    ? `# Çarpık parasal dağılım için Logaritma Dönüşümü (log(1 + x))
df_clean['monetary_scaled'] = np.log1p(df_clean['total_monetary'])`
    : scalingMethod === 'standard'
    ? `# Z-Score Standartlaştırma: z = (x - mu) / sigma
from sklearn.preprocessing import StandardScaler
scaler = StandardScaler()
df_clean[['recency_scaled', 'monetary_scaled']] = scaler.fit_transform(df_clean[['recency_days', 'total_monetary']])`
    : `# Min-Max Ölçekleme: [0, 1] aralığına sıkıştırma
from sklearn.preprocessing import MinMaxScaler
scaler = MinMaxScaler()
df_clean[['recency_scaled', 'monetary_scaled']] = scaler.fit_transform(df_clean[['recency_days', 'total_monetary']])`
}

print("✓ Ön işleme tamamlandı. RFM modellemeye hazır!")
`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPythonCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  // Pagination for SQL result
  const pageSize = 8;
  const totalRows = queryResult?.rows.length || 0;
  const totalPages = Math.ceil(totalRows / pageSize);
  const currentRows = queryResult?.rows.slice((currentPage - 1) * pageSize, currentPage * pageSize) || [];

  return (
    <div className="space-y-6">
      {/* Module Banner / Context */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6 backdrop-blur-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <span>MODÜL 01</span>
              <span>·</span>
              <span>VERİ ÇEKME & PANDAS ÖN İŞLEME</span>
              <span>·</span>
              <span>ENES ÖZTÜRK</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              SQL ile Veri Çekme, Eksik Veri & Aykırı Değer (Outlier) Temizliği
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              İlişkisel veritabanı tablolarından (<code className="text-indigo-300">customers</code>,{' '}
              <code className="text-indigo-300">orders</code>, <code className="text-indigo-300">order_items</code>,{' '}
              <code className="text-indigo-300">products</code>) SQL <span className="text-slate-200">JOIN</span>,{' '}
              <span className="text-slate-200">GROUP BY</span> ve <span className="text-slate-200">HAVING</span> kullanarak
              ham müşteri verilerini çekin; ardından Python Pandas hattı ile eksik ve aykırı değerleri ayıklayın.
            </p>
          </div>

          {/* Sub-tab switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveSubTab('sql_runner')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'sql_runner' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              SQL Stüdyosu
            </button>
            <button
              onClick={() => setActiveSubTab('pandas_pipeline')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'pandas_pipeline' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Pandas Temizleme Hattı
            </button>
            <button
              onClick={() => setActiveSubTab('schema_explorer')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'schema_explorer' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Veritabanı Şeması
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: SQL STUDIO */}
      {activeSubTab === 'sql_runner' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Query Templates & Editor (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Template Selector Bar */}
            <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-4">
              <label className="text-xs font-medium text-slate-400 block mb-2">
                Hazır Analitik SQL Sorgu Şablonları:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {SQL_QUERY_TEMPLATES.map((tmpl) => (
                  <button
                    key={tmpl.id}
                    onClick={() => handleTemplateSelect(tmpl.id)}
                    className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                      selectedTemplateId === tmpl.id
                        ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 shadow-sm'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <div className="font-semibold text-slate-200 truncate">{tmpl.title}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{tmpl.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* SQL Code Editor */}
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
              <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-mono text-slate-300">query_editor.sql</span>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => runQuery(sqlQuery)}
                    className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 text-white rounded-md text-xs font-medium transition-colors"
                  >
                    <Play className="w-3 h-3 fill-current" />
                    Sorguyu Çalıştır (F5)
                  </button>
                </div>
              </div>

              <textarea
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full h-64 bg-slate-950/90 text-slate-200 font-mono text-xs p-4 leading-relaxed resize-none focus:outline-none focus:ring-1 focus:ring-indigo-500 selection:bg-indigo-600/30"
                spellCheck={false}
              />

              <div className="bg-slate-950/60 px-4 py-2 border-t border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
                <span>ANSI SQL & AlaSQL Uyumlu Canlı Motor</span>
                <span>Satır: {sqlQuery.split('\n').length}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Execution Metrics & Results (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Query Performance Card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                <span className="font-semibold text-slate-200">Sorgu Yürütme Performansı</span>
                <span className="text-emerald-400 font-mono">STATUS 200 OK</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">Dönen Kayıt Sayısı</div>
                  <div className="text-lg font-bold font-mono text-slate-100 tabular-nums">
                    {queryResult?.rowCount ?? 0} <span className="text-xs font-normal text-slate-400">satır</span>
                  </div>
                </div>
                <div className="bg-slate-950/60 p-3 rounded-lg border border-slate-800/80">
                  <div className="text-[11px] text-slate-400">Yürütme Süresi</div>
                  <div className="text-lg font-bold font-mono text-indigo-400 tabular-nums">
                    {queryResult?.executionTimeMs ?? 0} <span className="text-xs font-normal text-slate-400">ms</span>
                  </div>
                </div>
              </div>
            </div>

            {/* SQL Results Preview Table */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden">
              <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TableIcon className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="text-xs font-medium text-slate-200">Sonuç Tablosu</span>
                </div>
                {totalPages > 1 && (
                  <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-200"
                    >
                      Önceki
                    </button>
                    <span>
                      {currentPage} / {totalPages}
                    </span>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                      className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded text-slate-200"
                    >
                      Sonraki
                    </button>
                  </div>
                )}
              </div>

              {queryResult?.error ? (
                <div className="p-4 bg-rose-950/20 text-rose-300 text-xs font-mono border-t border-rose-900/40">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                    SQL Hatası:
                  </div>
                  {queryResult.error}
                </div>
              ) : (
                <div className="overflow-x-auto max-h-80">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono">
                        {queryResult?.columns.map((col) => (
                          <th key={col} className="py-2 px-3 whitespace-nowrap font-medium">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300 font-mono">
                      {currentRows.length === 0 ? (
                        <tr>
                          <td colSpan={queryResult?.columns.length || 1} className="py-8 text-center text-slate-500">
                            Sonuç bulunamadı veya boş küme.
                          </td>
                        </tr>
                      ) : (
                        currentRows.map((row, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            {queryResult?.columns.map((col) => (
                              <td key={col} className="py-2 px-3 whitespace-nowrap tabular-nums text-slate-300">
                                {typeof row[col] === 'number'
                                  ? Number(row[col]).toLocaleString('tr-TR')
                                  : String(row[col] ?? 'NULL')}
                              </td>
                            ))}
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: PANDAS CLEANING PIPELINE */}
      {activeSubTab === 'pandas_pipeline' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Interactive Pipeline Controls (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            {/* Step 1: Missing Values (Null) */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">1. Eksik Değer (Null) Yönetimi</span>
                <span className="text-[11px] text-amber-400 font-mono">4 Null Şehir Kaydı</span>
              </div>
              <p className="text-xs text-slate-400 mb-3">
                Kayıt formunda şehir seçmeyen veya veri kaybı yaşanan satırların stratejisi:
              </p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setNullStrategy('fill_mode')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    nullStrategy === 'fill_mode'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Mod ile Doldur (İmputasyon)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">df['city'].fillna('Bilinmiyor')</div>
                </button>
                <button
                  onClick={() => setNullStrategy('drop')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    nullStrategy === 'drop'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Satırları Çıkar (dropna)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">df.dropna(subset=['city'])</div>
                </button>
              </div>
            </div>

            {/* Step 2: Outlier Detection via Tukey IQR */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-slate-200">2. Tukey IQR Aykırı Değer (Outlier) Filtresi</span>
                <span className="text-[11px] text-rose-400 font-mono">{outlierData.outliers.length} Aykırı İşlem</span>
              </div>
              <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 mb-3">
                <div>IQR = Q3 ({outlierData.q3.toLocaleString('tr-TR')} ₺) - Q1 ({outlierData.q1.toLocaleString('tr-TR')} ₺) = {outlierData.iqr.toLocaleString('tr-TR')} ₺</div>
                <div className="text-indigo-400 mt-0.5">
                  Üst Sınır = Q3 + {iqrMultiplier} × IQR = {outlierData.upperBound.toLocaleString('tr-TR')} ₺
                </div>
              </div>

              {/* Slider for IQR Multiplier */}
              <div className="space-y-1 mb-3">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>IQR Çarpanı (k):</span>
                  <span className="font-mono text-slate-200 font-bold">{iqrMultiplier.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={iqrMultiplier}
                  onChange={(e) => setIqrMultiplier(parseFloat(e.target.value))}
                  className="w-full accent-indigo-500 cursor-pointer"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <button
                  onClick={() => setOutlierAction('remove')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    outlierAction === 'remove'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Aykırıları Ele (Filter)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">df[total &lt;= üst_sınır]</div>
                </button>
                <button
                  onClick={() => setOutlierAction('winsorize')}
                  className={`p-2 rounded-lg border text-left transition-all ${
                    outlierAction === 'winsorize'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-semibold">Winsorize (Baskıla)</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">np.clip(val, alt, üst)</div>
                </button>
              </div>
            </div>

            {/* Step 3: Normalization & Scaling */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <span className="text-xs font-bold text-slate-200 block mb-2">3. Dağılım Normalizasyonu (Feature Scaling)</span>
              <p className="text-xs text-slate-400 mb-3">
                Parasal harcamalar sağa çarpık (right-skewed) olduğu için kümeleme öncesi dönüştürülür:
              </p>
              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => setScalingMethod('log1p')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    scalingMethod === 'log1p'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  Log1p (Önerilen)
                </button>
                <button
                  onClick={() => setScalingMethod('standard')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    scalingMethod === 'standard'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  StandardScaler
                </button>
                <button
                  onClick={() => setScalingMethod('minmax')}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    scalingMethod === 'minmax'
                      ? 'bg-indigo-950/40 border-indigo-500/50 text-indigo-200 font-medium'
                      : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  MinMaxScaler
                </button>
              </div>
            </div>
          </div>

          {/* Generated Python Script View (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
            <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-emerald-400" />
                <span className="text-xs font-mono text-slate-300">etl_pipeline_cleaner.py</span>
              </div>
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedCode ? 'Kopyalandı' : 'Kodu Kopyala'}
              </button>
            </div>

            <pre className="p-4 bg-slate-950/90 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto flex-1 selection:bg-indigo-600/30">
              {generatedPythonCode}
            </pre>
          </div>
        </div>
      )}

      {/* SUB-TAB 3: DATABASE SCHEMA EXPLORER */}
      {activeSubTab === 'schema_explorer' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Table: customers */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-mono text-xs font-bold text-indigo-400">customers</span>
              <span className="text-[11px] text-slate-500 font-mono">220 satır</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex justify-between text-slate-300">
                <span>customer_id</span> <span className="text-indigo-400">INTEGER (PK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>full_name</span> <span className="text-slate-400">VARCHAR(100)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>email</span> <span className="text-slate-400">VARCHAR(150)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>city</span> <span className="text-slate-400">VARCHAR(50)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>registration_date</span> <span className="text-slate-400">DATE</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>acquisition_channel</span> <span className="text-slate-400">VARCHAR(50)</span>
              </li>
            </ul>
          </div>

          {/* Table: orders */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-mono text-xs font-bold text-indigo-400">orders</span>
              <span className="text-[11px] text-slate-500 font-mono">1,150 satır</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex justify-between text-slate-300">
                <span>order_id</span> <span className="text-indigo-400">INTEGER (PK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>customer_id</span> <span className="text-indigo-400">INTEGER (FK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>order_date</span> <span className="text-slate-400">DATE</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>order_status</span> <span className="text-slate-400">VARCHAR(20)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>payment_method</span> <span className="text-slate-400">VARCHAR(30)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>total_amount</span> <span className="text-slate-400">DECIMAL(10,2)</span>
              </li>
            </ul>
          </div>

          {/* Table: order_items */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-mono text-xs font-bold text-indigo-400">order_items</span>
              <span className="text-[11px] text-slate-500 font-mono">1,840 satır</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex justify-between text-slate-300">
                <span>item_id</span> <span className="text-indigo-400">INTEGER (PK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>order_id</span> <span className="text-indigo-400">INTEGER (FK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>product_id</span> <span className="text-indigo-400">INTEGER (FK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>quantity</span> <span className="text-slate-400">INTEGER</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>unit_price</span> <span className="text-slate-400">DECIMAL(10,2)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>discount</span> <span className="text-slate-400">DECIMAL(4,2)</span>
              </li>
            </ul>
          </div>

          {/* Table: products */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-3">
              <span className="font-mono text-xs font-bold text-indigo-400">products</span>
              <span className="text-[11px] text-slate-500 font-mono">19 satır</span>
            </div>
            <ul className="space-y-1.5 text-xs font-mono">
              <li className="flex justify-between text-slate-300">
                <span>product_id</span> <span className="text-indigo-400">INTEGER (PK)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>product_name</span> <span className="text-slate-400">VARCHAR(120)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>category</span> <span className="text-slate-400">VARCHAR(50)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>base_price</span> <span className="text-slate-400">DECIMAL(10,2)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>cost</span> <span className="text-slate-400">DECIMAL(10,2)</span>
              </li>
              <li className="flex justify-between text-slate-300">
                <span>stock_quantity</span> <span className="text-slate-400">INTEGER</span>
              </li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
