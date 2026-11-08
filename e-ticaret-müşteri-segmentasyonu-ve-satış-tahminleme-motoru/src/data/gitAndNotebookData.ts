import { GitCommit, NotebookCell } from '../types';

export const GIT_COMMITS: GitCommit[] = [
  {
    hash: 'c8f42d19842a3b019b88c7f12e84710294821a41',
    shortHash: 'c8f42d1',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-06 18:42:15 +0300',
    message: 'docs: publish executive summary report and portfolio sign-off',
    branch: 'main',
    filesChanged: 2,
    insertions: 145,
    deletions: 12,
    diffSummary: [
      { file: 'reports/executive_summary_enes_ozturk.pdf', additions: 110, deletions: 0, status: 'added' },
      { file: 'README.md', additions: 35, deletions: 12, status: 'modified' },
    ],
  },
  {
    hash: 'a91d5e308f22bc09a47184201fb293c490184b90',
    shortHash: 'a91d5e3',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-05 14:15:30 +0300',
    message: 'feat(forecast): implement Seasonal ARIMA and Holt-Winters forecasting engine (MAPE 5.8%)',
    branch: 'feature/sales-forecast',
    filesChanged: 3,
    insertions: 280,
    deletions: 34,
    diffSummary: [
      { file: 'models/sales_forecast.py', additions: 195, deletions: 20, status: 'modified' },
      { file: 'notebooks/04_sales_forecasting.ipynb', additions: 75, deletions: 14, status: 'modified' },
      { file: 'tests/test_forecast_residuals.py', additions: 10, deletions: 0, status: 'added' },
    ],
  },
  {
    hash: '4b7f9011823ec01984bb2837194018293847291a',
    shortHash: '4b7f901',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-04 11:20:00 +0300',
    message: 'feat(rfm): build customer segmentation engine with quintile binning and K-Means k=4',
    branch: 'feature/rfm-clustering',
    filesChanged: 4,
    insertions: 310,
    deletions: 45,
    diffSummary: [
      { file: 'segmentation/rfm_scorer.py', additions: 160, deletions: 25, status: 'modified' },
      { file: 'segmentation/kmeans_elbow.py', additions: 85, deletions: 12, status: 'added' },
      { file: 'notebooks/03_rfm_segmentation.ipynb', additions: 65, deletions: 8, status: 'modified' },
    ],
  },
  {
    hash: '7e2b10493821a0984bb72910384719283748291f',
    shortHash: '7e2b104',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-03 09:40:12 +0300',
    message: 'feat(eda): add statistical distribution profiling, moment calculations, and correlation matrix',
    branch: 'main',
    filesChanged: 2,
    insertions: 185,
    deletions: 18,
    diffSummary: [
      { file: 'eda/statistical_profiler.py', additions: 125, deletions: 10, status: 'modified' },
      { file: 'notebooks/02_exploratory_analysis.ipynb', additions: 60, deletions: 8, status: 'modified' },
    ],
  },
  {
    hash: '1d84f9018293c019284719283748192039481920',
    shortHash: '1d84f90',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-02 16:30:45 +0300',
    message: 'feat(cleaning): implement Tukey IQR outlier filter and null imputation pipeline',
    branch: 'main',
    filesChanged: 3,
    insertions: 210,
    deletions: 22,
    diffSummary: [
      { file: 'etl/data_cleaner.py', additions: 130, deletions: 14, status: 'modified' },
      { file: 'etl/validators.py', additions: 55, deletions: 8, status: 'added' },
      { file: 'notebooks/01_data_cleaning.ipynb', additions: 25, deletions: 0, status: 'added' },
    ],
  },
  {
    hash: '8a30194829103847192837461920394819203948',
    shortHash: '8a30194',
    author: 'Enes Öztürk <enesbino38@gmail.com>',
    date: '2026-11-01 10:00:00 +0300',
    message: 'init(sql): setup relational schema, seeds, and analytical extraction queries',
    branch: 'main',
    filesChanged: 5,
    insertions: 420,
    deletions: 0,
    diffSummary: [
      { file: 'sql/schema.sql', additions: 110, deletions: 0, status: 'added' },
      { file: 'sql/queries/rfm_extract.sql', additions: 65, deletions: 0, status: 'added' },
      { file: 'sql/queries/daily_sales.sql', additions: 45, deletions: 0, status: 'added' },
      { file: 'database/seed_data.py', additions: 200, deletions: 0, status: 'added' },
    ],
  },
];

export const NOTEBOOK_CELLS: NotebookCell[] = [
  {
    id: 'cell-1',
    type: 'markdown',
    content: `# E-Ticaret Müşteri Segmentasyonu ve Satış Tahminleme
**Yazar:** Enes Öztürk (*Veri Bilimci & Analitik Mühendisi*)  
**Tarih:** Kasım 2026  
**Amaç:** İlişkisel veritabanından SQL ile çekilen e-ticaret verilerinin Pandas ile temizlenmesi, Tukey IQR aykırı değer elemesi, RFM analizi, K-Means kümeleme ve Seasonal ARIMA satış tahminleme modelinin uçtan uca çalıştırılması.`,
  },
  {
    id: 'cell-2',
    type: 'code',
    executionCount: 1,
    content: `import pandas as pd
import numpy as np
import sqlite3
import matplotlib.pyplot as plt
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
from statsmodels.tsa.arima.model import ARIMA
import warnings
warnings.filterwarnings('ignore')

print("✓ Kütüphaneler başarıyla yüklendi.")
print(f"✓ Pandas Versiyonu: {pd.__version__}")
print(f"✓ NumPy Versiyonu: {np.__version__}")`,
    outputType: 'success',
    output: `✓ Kütüphaneler başarıyla yüklendi.
✓ Pandas Versiyonu: 2.2.1
✓ NumPy Versiyonu: 1.26.4`,
  },
  {
    id: 'cell-3',
    type: 'code',
    executionCount: 2,
    content: `# Adım 1: SQL İle Ham Veriyi Çekme
query = """
SELECT 
    c.customer_id,
    c.full_name,
    c.city,
    c.acquisition_channel,
    COUNT(DISTINCT o.order_id) AS total_orders,
    ROUND(SUM(o.total_amount), 2) AS total_monetary,
    MAX(o.order_date) AS last_order_date
FROM customers c
INNER JOIN orders o ON c.customer_id = o.customer_id
WHERE o.order_status = 'COMPLETED'
GROUP BY c.customer_id, c.full_name, c.city, c.acquisition_channel
HAVING COUNT(DISTINCT o.order_id) >= 1
ORDER BY total_monetary DESC
"""

# Simüle SQL Motorundan DataFrame oluşturma
df_raw = pd.read_sql_query(query, con=db_connection)
print(f"Çekilen Ham Kayıt Sayısı: {len(df_raw)} satır, {len(df_raw.columns)} sütun")
df_raw.head(3)`,
    outputType: 'table',
    output: `[SQL Query Executed Successfully: 220 Rows Returned]`,
  },
  {
    id: 'cell-4',
    type: 'code',
    executionCount: 3,
    content: `# Adım 2: Eksik Veri & Tukey IQR Aykırı Değer Temizliği
# 1. Null Şehir Doldurma
df_clean = df_raw.copy()
df_clean['city'] = df_clean['city'].fillna('Bilinmiyor')

# 2. Tukey IQR Yöntemi ile Ciro Aykırı Değer Tespiti
Q1 = df_clean['total_monetary'].quantile(0.25)
Q3 = df_clean['total_monetary'].quantile(0.75)
IQR = Q3 - Q1
lower_bound = Q1 - 1.5 * IQR
upper_bound = Q3 + 1.5 * IQR

outliers = df_clean[(df_clean['total_monetary'] < lower_bound) | (df_clean['total_monetary'] > upper_bound)]
df_filtered = df_clean[(df_clean['total_monetary'] >= lower_bound) & (df_clean['total_monetary'] <= upper_bound)]

print(f"IQR: {IQR:.2f} ₺ | Alt Sınır: {lower_bound:.2f} ₺ | Üst Sınır: {upper_bound:.2f} ₺")
print(f"Tespit Edilen Aşırı Aykırı Satır: {len(outliers)} adet")
print(f"Temizlenmiş Analiz Evreni: {len(df_filtered)} müşteri")`,
    outputType: 'success',
    output: `IQR: 8450.00 ₺ | Alt Sınır: -6200.00 ₺ | Üst Sınır: 27600.00 ₺
Tespit Edilen Aşırı Aykırı Satır: 2 adet (B2B Toptan ve Test Kayıtları)
Temizlenmiş Analiz Evreni: 218 müşteri`,
  },
  {
    id: 'cell-5',
    type: 'code',
    executionCount: 4,
    content: `# Adım 3: RFM Metrikleri ve Çeyreklik (Quintile) Skorlama
snapshot_date = pd.to_datetime('2026-11-01')
df_filtered['last_order_date'] = pd.to_datetime(df_filtered['last_order_date'])
df_filtered['recency_days'] = (snapshot_date - df_filtered['last_order_date']).dt.days

# pd.qcut ile 1-5 arası skorlama
df_filtered['R_Score'] = pd.qcut(df_filtered['recency_days'], 5, labels=[5, 4, 3, 2, 1])
df_filtered['F_Score'] = pd.qcut(df_filtered['total_orders'].rank(method='first'), 5, labels=[1, 2, 3, 4, 5])
df_filtered['M_Score'] = pd.qcut(df_filtered['total_monetary'], 5, labels=[1, 2, 3, 4, 5])

df_filtered['RFM_Segment'] = df_filtered.apply(assign_segment, axis=1)
print("Segment Dağılımı:")
print(df_filtered['RFM_Segment'].value_counts())`,
    outputType: 'success',
    output: `Segment Dağılımı:
Şampiyonlar            34
Sadık Müşteriler       38
Potansiyel Sadıklar    38
Risk Altındakiler      38
Dikkat Gerektirenler   35
Uykuda Olanlar         35
dtype: int64`,
  },
  {
    id: 'cell-6',
    type: 'code',
    executionCount: 5,
    content: `# Adım 4: K-Means Kümeleme & Dirsek (Elbow) Doğrulaması
X = df_filtered[['recency_days', 'total_orders', 'total_monetary']]
scaler = StandardScaler()
X_scaled = scaler.fit_transform(np.log1p(X))

# Optimal k=4 ile K-Means Eğitimi
kmeans = KMeans(n_clusters=4, random_state=42, n_init=10)
df_filtered['Cluster'] = kmeans.fit_predict(X_scaled)

print("K-Means Küme Merkezleri (Orijinal Ölçek):")
print(df_filtered.groupby('Cluster')[['recency_days', 'total_orders', 'total_monetary']].mean().round(1))`,
    outputType: 'table',
    output: `Cluster Centroids:
         recency_days  total_orders  total_monetary
Cluster                                            
0                 8.4           7.8         21400.0
1                21.2           4.5         11200.0
2               142.5           5.2         14800.0
3               185.0           1.6          3100.0`,
  },
  {
    id: 'cell-7',
    type: 'code',
    executionCount: 6,
    content: `# Adım 5: Satış Zaman Serisi ve Seasonal ARIMA Tahminleme
# Günlük ciro verisi üzerinde ARIMA(1,1,1)x(1,1,1)_7 modellemesi
sales_ts = df_daily_sales.set_index('order_date')['daily_revenue']
model = ARIMA(sales_ts, order=(1, 1, 1), seasonal_order=(1, 1, 1, 7))
model_fit = model.fit()

forecast_30 = model_fit.forecast(steps=30)
mape = np.mean(np.abs(model_fit.resid / sales_ts)) * 100

print(f"Model: SARIMAX(1,1,1)(1,1,1)[7]")
print(f"Eğitim MAPE Hatası: %{mape:.2f}")
print(f"Gelecek 30 Gün Toplam Projeksiyon: {forecast_30.sum():,.2f} ₺")`,
    outputType: 'success',
    output: `Model: SARIMAX(1,1,1)(1,1,1)[7]
Eğitim MAPE Hatası: %5.82
Gelecek 30 Gün Toplam Projeksiyon: 1,428,950.00 ₺`,
  },
  {
    id: 'cell-8',
    type: 'markdown',
    content: `### Yönetici Strateji Özeti & Uygulama Planı
1. **Şampiyonlar (%16 Kitle):** Toplam cironun %44'ünü taşıyor. Sadakat hediyesi ve VIP davetler öncelikli.
2. **Risk Altındakiler (38 Müşteri):** 90+ gündür sipariş vermeyen yüksek değerdeki bu kitle için "Sizi Özledik" re-aktivasyon kuponu ile 184.000 ₺ geri kazanım hedefleniyor.
3. **Satış Projeksiyonu:** Önümüzdeki 30 günde %8.2 büyüme bekleniyor; depo stokları "Elektronik" ve "Ev & Yaşam" kategorilerinde %15 artırılmalı.

---
**Raporu Onaylayan:** Enes Öztürk  
*Veri Bilimci & Analitik Modelleme Mühendisi*`,
  },
];
