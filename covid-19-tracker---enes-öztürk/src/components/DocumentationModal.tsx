import React, { useState } from 'react';
import { X, BookOpen, Code2, Server, CheckCircle2, ShieldAlert, Cpu, ExternalLink } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'genel' | 'api' | 'formuller'>('genel');
  const [testResponse, setTestResponse] = useState<string | null>(null);
  const [testingApi, setTestingApi] = useState(false);

  if (!isOpen) return null;

  const runApiTest = async () => {
    setTestingApi(true);
    try {
      const res = await fetch('https://disease.sh/v3/covid-19/all');
      const json = await res.json();
      setTestResponse(JSON.stringify({
        status: res.status,
        cases: json.cases,
        deaths: json.deaths,
        recovered: json.recovered,
        active: json.active,
        updated: new Date(json.updated).toISOString(),
      }, null, 2));
    } catch (e: any) {
      setTestResponse(`Hata: ${e.message}`);
    } finally {
      setTestingApi(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900 leading-tight">
                COVID-19 Takip Sistemi Dokümantasyonu
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="font-semibold text-indigo-600">İmzalı Belge: Enes Öztürk</span>
                <span>·</span>
                <span>Versiyon 2.4</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 px-6 gap-6 text-sm font-medium">
          <button
            onClick={() => setActiveTab('genel')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'genel'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Genel Bakış & Mimari
          </button>
          <button
            onClick={() => setActiveTab('api')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'api'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            API Uç Noktaları
          </button>
          <button
            onClick={() => setActiveTab('formuller')}
            className={`py-3 border-b-2 transition-colors cursor-pointer ${
              activeTab === 'formuller'
                ? 'border-indigo-600 text-indigo-600 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Hesaplama Formülleri
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-sm text-slate-600">
          {activeTab === 'genel' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-indigo-50/60 border border-indigo-100 text-indigo-950">
                <h4 className="font-bold text-sm mb-1 text-indigo-900">
                  Proje Özeti & Geliştirici Beyanı
                </h4>
                <p className="text-xs leading-relaxed text-indigo-900/80">
                  Bu uygulama, dünya genelindeki ve tekil ülkelerdeki COVID-19 salgın seyrini; enfekte, iyileşen, vefat ve aktif vaka metrikleriyle anlık takip etmek üzere <strong>Enes Öztürk</strong> tarafından tasarlanmış ve kodlanmıştır.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Mimari Prensipleri</h4>
                <ul className="space-y-2 text-xs text-slate-600">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Canlı Veri Doğrulaması:</strong> Veriler doğrudan açık kaynak <code>disease.sh</code> REST servisi üzerinden her 10 dakikada bir güncellenir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Çift Seviyeli Yedekleme (Fallback):</strong> API bağlantı kesintilerinde UI kilitlenmesini önleyen akıllı yerel snapshot mekanizması devrededir.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    <span><strong>Sıfır Dış Kütüphane Çakışması:</strong> Reaktif SVG grafikleri (sütun ve bezier zaman serisi) harici ağır paketler yerine saf matematiksel projeksiyonlarla çizilmiştir.</span>
                  </li>
                </ul>
              </div>

              {/* Developer Sign-off Box */}
              <div className="p-4 rounded-xl bg-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-indigo-300 font-mono">DOKÜMANTASYON İMZASI</div>
                  <div className="text-base font-bold text-white">Enes Öztürk</div>
                  <div className="text-xs text-slate-400">Yazılım Mühendisi & Sistem Geliştiricisi</div>
                </div>
                <div className="text-xs text-slate-400 font-mono sm:text-right">
                  <div>Doğrulama Kodu: EÖ-COVID19-PROD</div>
                  <div>Tarih: Ekim 2026</div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'api' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-600">
                Uygulama, dünya genelindeki resmi sağlık otoritelerinin verilerini toplayan <strong>Open Disease Data API (disease.sh)</strong> altyapısını kullanmaktadır.
              </p>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-emerald-700 font-bold mb-1">GET /v3/covid-19/all</div>
                  <div className="text-slate-600 font-sans text-xs">
                    Dünya genelindeki toplam enfekte, iyileşen, ölüm, aktif ve kritik vaka sayılarını döner.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-emerald-700 font-bold mb-1">GET /v3/covid-19/countries</div>
                  <div className="text-slate-600 font-sans text-xs">
                    230+ ülkenin detaylı vaka, test ve bayrak bilgilerini liste halinde sunar.
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                  <div className="text-emerald-700 font-bold mb-1">GET /v3/covid-19/historical/:country?lastdays=30</div>
                  <div className="text-slate-600 font-sans text-xs">
                    Seçilen ülkenin veya dünyanın son 30 güne ait günlük vaka ve ölüm seyrini sağlar.
                  </div>
                </div>
              </div>

              {/* Live API Tester */}
              <div className="pt-2">
                <button
                  onClick={runApiTest}
                  disabled={testingApi}
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer flex items-center gap-2"
                >
                  <Server className="w-4 h-4" />
                  <span>{testingApi ? 'API Test Ediliyor...' : 'Canlı API İsteği Gönder & Test Et'}</span>
                </button>

                {testResponse && (
                  <pre className="mt-3 p-3 bg-slate-900 text-emerald-400 font-mono text-[11px] rounded-lg overflow-x-auto max-h-40">
                    {testResponse}
                  </pre>
                )}
              </div>
            </div>
          )}

          {activeTab === 'formuller' && (
            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-slate-900 mb-2">1. Aktif Hasta Sayısı</h4>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800">
                  Aktif Hasta = Toplam Vaka - (İyileşen Hasta + Vefat Edenler)
                </div>
                <p className="mt-1 text-slate-500">
                  Kişinin virüsü hala taşıdığı ve tedavi sürecinin devam ettiğini gösterir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">2. İyileşme Oranı (Recovery Rate)</h4>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800">
                  İyileşme Oranı (%) = (İyileşen Hasta / Toplam Enfekte) × 100
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">3. Vefat / Ölüm Oranı (Mortality Rate)</h4>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800">
                  Ölüm Oranı (%) = (Vefat Sayısı / Toplam Enfekte) × 100
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">4. Milyon Kişi Başına Yoğunluk</h4>
                <div className="p-3 bg-slate-100 rounded-lg font-mono text-slate-800">
                  Vaka / 1M = (Toplam Vaka / Ülke Nüfusu) × 1.000.000
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <span className="text-xs text-slate-500 font-medium">
            Dokümantasyon Hazırlayan: <strong>Enes Öztürk</strong>
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-lg transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
