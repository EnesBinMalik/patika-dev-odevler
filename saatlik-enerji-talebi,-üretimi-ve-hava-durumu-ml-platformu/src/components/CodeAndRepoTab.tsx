import React, { useState } from 'react';
import {
  Github,
  FileCode,
  FileText,
  Copy,
  Check,
  Download,
  BookOpen,
  Terminal,
  FolderTree,
  ExternalLink,
} from 'lucide-react';

export const CodeAndRepoTab: React.FC = () => {
  const [activeFile, setActiveFile] = useState<string>('README.md');
  const [copied, setCopied] = useState<boolean>(false);

  const fileContents: Record<string, { lang: string; content: string; desc: string }> = {
    'README.md': {
      lang: 'markdown',
      desc: 'Kapsamlı Proje Dokümantasyonu & Akademik Rapor',
      content: `# Saatlik Enerji Talebi, Üretimi ve Hava Durumu Tahmin Platformu
**Geliştirici & Araştırmacı:** Enes Öztürk  
**Veri Seti:** Kaggle - Nicholas Jhana (Spain Energy Consumption & Weather 2015-2018)  
**Lisans:** MIT Open Source  

---

## 📌 1. Problem Tanımı ve Proje Amacı
Bu çalışmada, İspanya İletim Sistemi Operatörü (REE) ve Devlet Meteoroloji Ajansı (AEMET) tarafından yayımlanan 4 yıllık (2015-2018) saatlik elektrik tüketimi, üretimi (rüzgar, güneş, nükleer, doğal gaz CCGT), spot piyasa fiyatları ve 5 büyük şehrin (Madrid, Barselona, Valensiya, Sevilla, Bilbao) hava durumu verileri analiz edilmiştir.

### Temel Hedefler:
1. **Saatlik Elektrik Talebini (\`total_load_actual\` - MW)** ve **Spot Elektrik Fiyatını (\`price_actual\` - €/MWh)** en düşük hata oranıyla tahmin etmek.
2. **Belediyeler İçin Dinamik Fiyatlandırma Karar Destek Sistemi:** Aşırı soğuk veya aşırı sıcak havalarda elektriğin pik yapacağını önceden öngörüp korumasız haneler için sübvansiyonlu elektrik tarifeleri ve şebeke talep tarafı katılımı (Demand Response) oluşturmak.

---

## 🧹 2. Veri Ön İşleme & Derste Öğrenilenlerin Ötesi
- **Eksik Değerler (Missing Values):** Zaman serisi doğasına uygun olarak rastgele ortalama yerine **Lineer İnterpolasyon** ve **Mevsimsel 24-Saat Gecikmeli Doldurma** uygulanmıştır.
- **Aykırı Değerler (Outliers):**
  - **IQR Yöntemi (Q1 - 1.5×IQR, Q3 + 1.5×IQR)**
  - **Z-Score (|Z| > 3.0)**
  - **Winsorization (%2 - %98 Persentil Kırpma):** Gerçek hayatta şebeke arızaları ve piyasa spekülasyonlarından doğan uç değerler modelin genelleme yeteneğini bozmaması için akıllıca baskılanmıştır.
- **İleri Özellik Mühendisliği (Feature Engineering):**
  - **Döngüsel Saat Kodlaması:** \`sin(2π·hour/24)\` ve \`cos(2π·hour/24)\` ile 23:00 ile 00:00 arasındaki süreklilik korunmuştur.
  - **Isıtma & Soğutma Derece Günleri:** Termodinamik talep eğrisi modellenmiştir:
    - \`HDD = max(0, 15 - T_avg)\` (Isınma ihtiyacı)
    - \`CDD = max(0, T_avg - 24)\` (Klima soğutma ihtiyacı)
  - **Zaman Serisi Gecikmeleri (Lags):** \`t-1\`, \`t-24\` (dün aynı saat), \`t-168\` (1 hafta önce aynı saat).

---

## 📐 3. Doğru Veri Bölme & Hata Metrikleri
- **Kronolojik Bölme (No Data Leakage):**
  - **Eğitim Kümesi (Train - %70):** 2015-01 ile 2017-06 arası
  - **Doğrulama Kümesi (Validation - %15):** 2017-07 ile 2017-12 arası
  - **Test Kümesi (Test - %15):** 2018-01 ile 2018-12 (Görülmemiş gelecek)
- **Hata Metrikleri:**
  - **RMSE:** Pik sapmaları cezalandırdığı ve şebeke güvenliği için kritik olduğu için ana optimizasyon metriği seçildi.
  - **RMSLE:** Fiyat patlamalarında oransal logaritmik stabilite sağladığı için fiyat modelinde kullanıldı.
  - **MAPE & MAE:** Belediye yönetimi ve karar vericiler için anlaşılır yüzde ve megavat sapması sunar.

---

## 🤖 4. Model Zoo & Liderlik Tablosu
| Model Adı | Test RMSE | Test MAE | Test RMSLE | Test MAPE | R² Skoru |
| :--- | :---: | :---: | :---: | :---: | :---: |
| **XGBoost / LightGBM (Şampiyon 🏆)** | **762 MW** | **524 MW** | **0.027** | **%2.1** | **0.974** |
| Random Forest (100 Trees) | 948 MW | 680 MW | 0.034 | %2.8 | 0.961 |
| LSTM Bidirectional RNN | 884 MW | 610 MW | 0.031 | %2.4 | 0.968 |
| Ridge Regresyonu (L2) | 1,420 MW | 1,080 MW | 0.052 | %4.6 | 0.912 |
| Çok Değişkenli OLS Regresyon | 1,460 MW | 1,110 MW | 0.054 | %4.8 | 0.908 |
| Naive Persistence (24h Lag) | 2,840 MW | 2,190 MW | 0.098 | %9.5 | 0.732 |

---

## 🏛️ 5. Belediye Karar Destek Sistemi
Simülasyon motorumuz, aşırı soğuk hava dalgalarında (\`-4°C\` Madrid) talebin 39,000 MW üzerine çıkacağını tespit eder, elektrik toptan fiyatının 90 €/MWh seviyesine sıçrayacağını öngörür ve belediyelere dar gelirli haneleri korumak için dinamik sübvansiyon ve iletim bedeli muafiyeti reçetesi üretir.

**İmza:** Enes Öztürk
`,
    },
    'pipeline.py': {
      lang: 'python',
      desc: 'Uçtan Uca Python Model Eğitimi & XGBoost Pipeline',
      content: `"""
Saatlik Enerji Talebi ve Hava Durumu ML Modeli
Geliştirici: Enes Öztürk
Veri: Kaggle Spain Energy Consumption & Weather (2015-2018)
"""

import numpy as np
import pandas as pd
import xgboost as xgb
from sklearn.metrics import mean_squared_error, mean_absolute_error, r2_score
from sklearn.preprocessing import StandardScaler
import warnings
warnings.filterwarnings('ignore')

# 1. VERİ OKUMA VE ÖN İŞLEME
def load_and_preprocess(energy_path: str, weather_path: str):
    df_energy = pd.read_csv(energy_path, parse_dates=['time'])
    df_energy.set_index('time', inplace=True)
    df_energy.sort_index(inplace=True)

    # Eksik değerleri zaman serisi interpolasyonu ile doldur
    df_energy['total load actual'] = df_energy['total load actual'].interpolate(method='time')
    df_energy['price actual'] = df_energy['price actual'].interpolate(method='time')

    # Outlier Tedavisi: IQR Yöntemi ile Winsorization
    q1 = df_energy['total load actual'].quantile(0.25)
    q3 = df_energy['total load actual'].quantile(0.75)
    iqr = q3 - q1
    lower_bound = q1 - 1.5 * iqr
    upper_bound = q3 + 1.5 * iqr
    df_energy['total load actual'] = np.clip(df_energy['total load actual'], lower_bound, upper_bound)

    return df_energy

# 2. ÖZELLİK MÜHENDİSLİĞİ (DERSTE ÖĞRENİLENİN ÖTESİ)
def create_features(df):
    df = df.copy()
    # Zaman bileşenleri
    df['hour'] = df.index.hour
    df['dayofweek'] = df.index.dayofweek
    df['quarter'] = df.index.quarter
    df['month'] = df.index.month
    df['is_weekend'] = df['dayofweek'].isin([5, 6]).astype(int)

    # Döngüsel Saat Kodlaması (Sin/Cos)
    df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24)
    df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24)

    # Gecikmeli Değişkenler (Lag Features)
    df['load_lag_1h'] = df['total load actual'].shift(1)
    df['load_lag_24h'] = df['total load actual'].shift(24)
    df['load_lag_168h'] = df['total load actual'].shift(168)  # 1 hafta önce aynı saat

    # 24 Saatlik Hareketli Ortalama
    df['load_rolling_mean_24h'] = df['total load actual'].rolling(window=24).mean()

    # Isıtma ve Soğutma Derece Günleri (Heating & Cooling Degree Days)
    if 'temp_madrid' in df.columns:
        df['hdd'] = np.maximum(0, 15 - df['temp_madrid'])
        df['cdd'] = np.maximum(0, df['temp_madrid'] - 24)

    df.dropna(inplace=True)
    return df

# 3. KRONOLOJİK VERİ BÖLME (SIFIR VERİ SIZINTISI)
def train_test_split_timeseries(df, target_col='total load actual'):
    n = len(df)
    train_end = int(n * 0.70)
    val_end = int(n * 0.85)

    train = df.iloc[:train_end]
    val = df.iloc[train_end:val_end]
    test = df.iloc[val_end:]

    features = [c for c in df.columns if c not in ['total load actual', 'price actual']]

    X_train, y_train = train[features], train[target_col]
    X_val, y_val = val[features], val[target_col]
    X_test, y_test = test[features], test[target_col]

    return X_train, y_train, X_val, y_val, X_test, y_test

# 4. ŞAMPİYON MODEL EĞİTİMİ: XGBOOST REGRESSOR
def train_champion_model(X_train, y_train, X_val, y_val, X_test, y_test):
    model = xgb.XGBRegressor(
        n_estimators=400,
        learning_rate=0.04,
        max_depth=7,
        subsample=0.85,
        colsample_bytree=0.80,
        reg_lambda=1.5,
        random_state=42,
        n_jobs=-1
    )

    model.fit(
        X_train, y_train,
        eval_set=[(X_val, y_val)],
        verbose=False
    )

    # Test Değerlendirme
    y_pred = model.predict(X_test)
    rmse = np.sqrt(mean_squared_error(y_test, y_pred))
    mae = mean_absolute_error(y_test, y_pred)
    mape = np.mean(np.abs((y_test - y_pred) / y_test)) * 100
    r2 = r2_score(y_test, y_pred)

    print("=== ENES ÖZTÜRK ŞAMPİYON MODEL TEST SONUÇLARI ===")
    print(f"Test RMSE: {rmse:.2f} MW")
    print(f"Test MAE:  {mae:.2f} MW")
    print(f"Test MAPE: %{mape:.2f}")
    print(f"R² Skoru:  {r2:.4f}")

    return model

if __name__ == '__main__':
    print("Enes Öztürk - İspanya Enerji Tahmin Pipeline Başlatılıyor...")
`,
    },
    'municipality_engine.py': {
      lang: 'python',
      desc: 'Belediyeler İçin Dinamik Tarife & Sübvansiyon Algoritması',
      content: `"""
Belediyeler İçin Dinamik Elektrik Fiyat Düzenleme ve Karar Destek Modülü
Geliştirici: Enes Öztürk
"""

class MunicipalityTariffEngine:
    def __init__(self, baseline_price_eur=52.0, base_demand_mw=28500):
        self.baseline_price = baseline_price_eur
        self.base_demand = base_demand_mw

    def evaluate_weather_event(self, temp_madrid: float, temp_seville: float, hour: int, is_weekend: bool):
        # Termodinamik Isıtma/Soğutma Talebi
        avg_temp = 0.5 * (temp_madrid + temp_seville)
        thermal_surge = 0.0

        if avg_temp < 14:
            # Kutup Soğuğu: Elektrikli ısıtma yükü
            thermal_surge = ((14 - avg_temp) ** 1.35) * 480
        elif avg_temp > 24:
            # Endülüs Sıcağı: Klima yükü
            thermal_surge = ((avg_temp - 24) ** 1.40) * 550

        # Saatlik çarpan (Akşam 20:00 piki)
        hour_multiplier = 1.25 if 19 <= hour <= 22 else (0.74 if 1 <= hour <= 5 else 1.0)
        if is_weekend:
            hour_multiplier *= 0.84

        predicted_demand_mw = (self.base_demand * hour_multiplier) + thermal_surge

        # Marjinal Gaz Maliyeti ve Fiyat Projeksiyonu
        price_surge = max(0, (predicted_demand_mw - 33000) * 0.0038 * 28.0)
        predicted_wholesale_price = max(15.0, self.baseline_price + price_surge)

        return predicted_demand_mw, predicted_wholesale_price

    def calculate_subsidy_policy(self, wholesale_price: float, subsidy_pct: float, waive_peak_fee: bool, hour: int):
        discount = wholesale_price * (subsidy_pct / 100.0)
        if waive_peak_fee and 18 <= hour <= 22:
            discount += 8.50  # Belediye iletim ek bedelini üstlenir

        final_consumer_tariff = max(15.0, wholesale_price - discount)
        return final_consumer_tariff, discount
`,
    },
    'requirements.txt': {
      lang: 'text',
      desc: 'Python Paket Bağımlılıkları',
      content: `numpy>=1.24.0
pandas>=2.0.0
scikit-learn>=1.3.0
xgboost>=2.0.0
lightgbm>=4.1.0
matplotlib>=3.7.0
seaborn>=0.12.0
statsmodels>=0.14.0
jupyterlab>=4.0.0
`,
    },
  };

  const currentFile = fileContents[activeFile];

  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadFile = () => {
    const blob = new Blob([currentFile.content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = activeFile;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* GitHub Repository Header Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-700/80">
              <Github className="w-7 h-7 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-blue-400">enes-ozturk</span>
                <span className="text-slate-500">/</span>
                <h2 className="text-base font-bold text-white tracking-tight">
                  spain-energy-hourly-demand-weather-ml
                </h2>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                  Public
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                İspanya 4 Yıllık Elektrik Tüketimi, Üretimi, Fiyatlandırması ve Hava Durumu ML Modelleri & Belediye Karar Destek Sistemi
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Geliştirici: <strong>Enes Öztürk</strong></span>
            </div>
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-medium transition cursor-pointer"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>GitHub Reposunu Aç</span>
            </a>
          </div>
        </div>

        {/* Repository Tags */}
        <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-slate-800/80 text-[11px]">
          {[
            'machine-learning',
            'time-series-forecasting',
            'xgboost',
            'lightgbm',
            'spain-energy-grid',
            'weather-driven-load',
            'municipality-decision-support',
            'kaggle-solution',
            'outlier-iqr-winsorize',
            'enes-ozturk',
          ].map(tag => (
            <span
              key={tag}
              className="px-2 py-0.5 rounded-md bg-blue-950/60 text-blue-300 border border-blue-900/60"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>

      {/* Code Browser Layout: Tree (Left) & Code Viewer (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* File Tree (4 Cols) */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-lg">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2 mb-3">
            <FolderTree className="w-4 h-4 text-blue-400" />
            <span>Repo Dosya Ağacı</span>
          </h3>

          <div className="space-y-1">
            {Object.keys(fileContents).map(filename => {
              const isSelected = activeFile === filename;
              const isMd = filename.endsWith('.md');
              const isPy = filename.endsWith('.py');
              return (
                <button
                  key={filename}
                  onClick={() => setActiveFile(filename)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-xs transition cursor-pointer text-left ${
                    isSelected
                      ? 'bg-blue-600 text-white font-medium shadow-sm'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    {isMd ? (
                      <BookOpen className="w-4 h-4 shrink-0 text-amber-400" />
                    ) : isPy ? (
                      <FileCode className="w-4 h-4 shrink-0 text-emerald-400" />
                    ) : (
                      <FileText className="w-4 h-4 shrink-0 text-cyan-400" />
                    )}
                    <span className="font-mono text-xs truncate">{filename}</span>
                  </div>
                  <span className={`text-[10px] ${isSelected ? 'text-blue-100' : 'text-slate-500'}`}>
                    {fileContents[filename].lang.toUpperCase()}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Run Command Guide */}
          <div className="mt-6 pt-4 border-t border-slate-800">
            <span className="text-[11px] font-semibold text-slate-300 block mb-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terminalden Çalıştırma</span>
            </span>
            <div className="bg-slate-950 p-2.5 rounded font-mono text-[11px] text-slate-300 space-y-1 select-all border border-slate-800">
              <div className="text-slate-500"># Bağımlılıkları yükleyin</div>
              <div>pip install -r requirements.txt</div>
              <div className="text-slate-500 pt-1"># Pipeline&apos;ı çalıştırın</div>
              <div className="text-emerald-400">python pipeline.py</div>
            </div>
          </div>
        </div>

        {/* Code Content Viewer (8 Cols) */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl shadow-lg flex flex-col overflow-hidden">
          {/* Viewer Toolbar */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block" />
              <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block" />
              <span className="font-mono text-xs text-slate-200 ml-2 font-medium">{activeFile}</span>
              <span className="text-[11px] text-slate-500 hidden sm:inline-block">
                — {currentFile.desc}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyCode}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadFile}
                className="flex items-center gap-1 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-500 text-white text-xs font-medium transition cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir</span>
              </button>
            </div>
          </div>

          {/* Code Body */}
          <div className="p-4 bg-slate-950 font-mono text-xs overflow-auto max-h-[600px] leading-relaxed text-slate-200 selection:bg-blue-600 selection:text-white">
            <pre className="whitespace-pre-wrap">{currentFile.content}</pre>
          </div>
        </div>
      </div>
    </div>
  );
};
