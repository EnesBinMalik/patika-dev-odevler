import React, { useState } from 'react';
import { 
  FileText, 
  Copy, 
  Download, 
  Printer, 
  Check, 
  BarChart3, 
  AlertTriangle, 
  TrendingUp, 
  DollarSign, 
  Database, 
  RotateCcw,
  Upload
} from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const ReportsView: React.FC = () => {
  const { 
    products, 
    sales, 
    purchases, 
    financials, 
    generateInventoryTextReport, 
    generateFinancialTextReport, 
    generateSalesTextReport, 
    generateLowStockTextReport,
    resetToDefaultData,
    exportDatabaseJson,
    importDatabaseJson
  } = useStore();

  const [activeReportTab, setActiveReportTab] = useState<'text' | 'financial' | 'lowstock' | 'database'>('text');
  const [textReportType, setTextReportType] = useState<'inventory' | 'financial' | 'sales' | 'lowstock'>('financial');
  const [copied, setCopied] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const getCurrentTextReport = () => {
    switch (textReportType) {
      case 'inventory': return generateInventoryTextReport();
      case 'financial': return generateFinancialTextReport();
      case 'sales': return generateSalesTextReport();
      case 'lowstock': return generateLowStockTextReport();
    }
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(getCurrentTextReport());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadTxt = () => {
    const text = getCurrentTextReport();
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pasli_magaza_${textReportType}_raporu_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJsonBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `pasli_magaza_yedek_${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importDatabaseJson(content);
      if (success) {
        setImportStatus('✓ Veritabanı başarıyla içe aktarıldı ve güncellendi.');
      } else {
        setImportStatus('❌ Hatalı veya geçersiz JSON formatı.');
      }
      setTimeout(() => setImportStatus(null), 4000);
    };
    reader.readAsText(file);
  };

  // En çok satan ürünler (Kâra göre sıralı)
  const topProfitableProducts = products.map(p => {
    const productSales = sales.filter(s => s.productId === p.id);
    const totalSoldQty = productSales.reduce((a, b) => a + b.quantity, 0);
    const totalSalesAmount = productSales.reduce((a, b) => a + b.totalAmount, 0);
    const totalProfitEarned = productSales.reduce((a, b) => a + b.profit, 0);
    return {
      product: p,
      soldQty: totalSoldQty,
      salesAmount: totalSalesAmount,
      profitEarned: totalProfitEarned,
    };
  }).filter(item => item.soldQty > 0).sort((a, b) => b.profitEarned - a.profitEarned);

  return (
    <div className="space-y-6">
      
      {/* Üst Başlık & Sekme Butonları */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-orange-400" />
            <span>Raporlama ve Analiz Merkezi</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            İyi yapılandırılmış metin formatında envanter, satış ve satın alma dökümleri (Enes Öztürk Onaylı)
          </p>
        </div>

        {/* Rapor Görünüm Sekmeleri */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveReportTab('text')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeReportTab === 'text'
                ? 'bg-slate-800 text-orange-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Metin / Konsol Formatı
          </button>
          <button
            onClick={() => setActiveReportTab('financial')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeReportTab === 'financial'
                ? 'bg-slate-800 text-emerald-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Finansal Kâr / Zarar
          </button>
          <button
            onClick={() => setActiveReportTab('lowstock')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeReportTab === 'lowstock'
                ? 'bg-slate-800 text-amber-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Kritik Stok Uyarısı
          </button>
          <button
            onClick={() => setActiveReportTab('database')}
            className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
              activeReportTab === 'database'
                ? 'bg-slate-800 text-sky-400 font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Yedekleme & JSON
          </button>
        </div>
      </div>

      {/* SEKME 1: METİN / TABLO FORMATLI KONSOL RAPORU (TAM İSTENEN FORMAT) */}
      {activeReportTab === 'text' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900/60 p-3 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-medium">Rapor Türü:</span>
              <div className="flex gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
                <button
                  onClick={() => setTextReportType('financial')}
                  className={`px-2.5 py-1 rounded ${textReportType === 'financial' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Kâr & Gelir Tablosu
                </button>
                <button
                  onClick={() => setTextReportType('inventory')}
                  className={`px-2.5 py-1 rounded ${textReportType === 'inventory' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Envanter Tablosu
                </button>
                <button
                  onClick={() => setTextReportType('sales')}
                  className={`px-2.5 py-1 rounded ${textReportType === 'sales' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Satış Geçmişi
                </button>
                <button
                  onClick={() => setTextReportType('lowstock')}
                  className={`px-2.5 py-1 rounded ${textReportType === 'lowstock' ? 'bg-slate-800 text-white font-medium' : 'text-slate-400'}`}
                >
                  Kritik Stok
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyText}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'Metni Kopyala'}</span>
              </button>
              <button
                onClick={handleDownloadTxt}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-orange-600 hover:bg-orange-500 rounded-lg transition-colors shadow-xs"
              >
                <Download className="w-3.5 h-3.5" />
                <span>.TXT İndir</span>
              </button>
              <button
                onClick={() => window.print()}
                className="p-1.5 text-slate-300 hover:text-white bg-slate-800 rounded-lg border border-slate-700"
                title="Yazdır"
              >
                <Printer className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Biçimlendirilmiş ASCII Metin Kutusu */}
          <div className="bg-slate-950 border border-slate-800 rounded-xl p-5 overflow-x-auto shadow-inner">
            <pre className="font-mono text-xs sm:text-sm text-slate-200 leading-relaxed whitespace-pre select-all">
              {getCurrentTextReport()}
            </pre>
          </div>
        </div>
      )}

      {/* SEKME 2: FİNANSAL KÂR / ZARAR GRAFİK VE MATRİKS */}
      {activeReportTab === 'financial' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Brüt Satış Geliri (Hasılat)
              </span>
              <div className="text-3xl font-extrabold text-white font-mono tabular-nums">
                {financials.totalRevenue.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </div>
              <p className="text-xs text-slate-400">
                Tamamlanan {sales.length} perakende satış işlemi toplamı
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
              <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">
                Satılan Malların Maliyeti (SMM)
              </span>
              <div className="text-3xl font-extrabold text-slate-300 font-mono tabular-nums">
                {financials.totalCostOfGoodsSold.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </div>
              <p className="text-xs text-slate-400">
                Satılan stokların depodaki birim alış maliyetleri
              </p>
            </div>

            <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-2 bg-emerald-950/10">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Net Brüt Ticari Kâr
              </span>
              <div className="text-3xl font-extrabold text-emerald-400 font-mono tabular-nums">
                +{financials.grossProfit.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </div>
              <p className="text-xs text-emerald-400/80">
                Brüt Kâr Marjı: %{financials.profitMarginPercent.toFixed(1)}
              </p>
            </div>
          </div>

          {/* En Çok Kâr Sağlayan Ürünler */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 shadow-xs">
            <h3 className="text-sm font-bold text-white mb-1">
              En Yüksek Kâr Sağlayan Ürünler Sıralaması
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Gerçekleşen satışlar üzerinden mağazaya en çok katma değer sağlayan kalemler
            </p>

            <div className="space-y-3">
              {topProfitableProducts.map((item, idx) => {
                const profitPctOfTotal = financials.grossProfit > 0 
                  ? (item.profitEarned / financials.grossProfit) * 100 
                  : 0;

                return (
                  <div key={item.product.id} className="bg-slate-950 border border-slate-800/80 rounded-lg p-3">
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-slate-400 font-bold">#{idx + 1}</span>
                        <span className="font-semibold text-slate-100">{item.product.name}</span>
                        <span className="text-slate-400 font-mono text-[11px]">({item.soldQty} Adet Satıldı)</span>
                      </div>
                      <div className="font-mono text-right font-bold text-emerald-400">
                        +{item.profitEarned.toFixed(2)} ₺ Kâr
                      </div>
                    </div>
                    {/* Progress Bar */}
                    <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="bg-emerald-500 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, Math.max(5, profitPctOfTotal))}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-slate-400 mt-1 font-mono">
                      <span>Toplam Satış Hasılatı: {item.salesAmount.toFixed(2)} ₺</span>
                      <span>Mağaza Kâr Katkı Payı: %{profitPctOfTotal.toFixed(1)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* SEKME 3: KRİTİK STOK UYARISI */}
      {activeReportTab === 'lowstock' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Kritik Stok Eşiği ve Acil Tedarik Sipariş Listesi</span>
              </h3>
              <p className="text-xs text-slate-400">
                Stoku minimum eşik değerine düşen veya tükenen ürünler için sipariş önerileri
              </p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {financials.lowStockCount + financials.outOfStockCount} Riskli Ürün
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {products.filter(p => p.quantity <= p.minStock).map(p => {
              const diff = p.minStock - p.quantity;
              const suggestedOrder = Math.max(10, diff + 15);
              const estCost = suggestedOrder * p.costPrice;

              return (
                <div key={p.id} className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="font-mono text-xs text-orange-400 font-semibold">{p.sku}</span>
                      <h4 className="text-sm font-bold text-white mt-0.5">{p.name}</h4>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${p.quantity === 0 ? 'text-rose-400 bg-rose-500/10 border-rose-500/30' : 'text-amber-400 bg-amber-500/10 border-amber-500/30'}`}>
                      {p.quantity === 0 ? 'STOKTA YOK' : 'KRİTİK EŞİK'}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 font-mono text-xs pt-1">
                    <div className="bg-slate-900 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block">Kalan Stok</span>
                      <span className="font-bold text-slate-100">{p.quantity} {p.unit}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block">Eşik Limit</span>
                      <span className="font-bold text-slate-100">{p.minStock} {p.unit}</span>
                    </div>
                    <div className="bg-slate-900 p-2 rounded">
                      <span className="text-[10px] text-slate-400 block">Öneri Sipariş</span>
                      <span className="font-bold text-emerald-400">+{suggestedOrder} {p.unit}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-400 flex justify-between pt-1 font-mono">
                    <span>Tahmini Tedarik Bütçesi:</span>
                    <span className="text-slate-200 font-semibold">{estCost.toFixed(2)} ₺</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SEKME 4: YEDEKLEME & VERİTABANI YÖNETİMİ */}
      {activeReportTab === 'database' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 space-y-6">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-5 h-5 text-sky-400" />
              <span>Veritabanı Kalıcılığı & Yedekleme Merkezi</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Tüm envanter, satış ve satın alma kayıtlarınızı JSON formatında güvenle dışa aktarabilir veya yedekten geri yükleyebilirsiniz.
            </p>
          </div>

          {importStatus && (
            <div className="p-3 rounded-lg bg-sky-500/10 border border-sky-500/30 text-xs text-sky-300">
              {importStatus}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Dışa Aktar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Veritabanını Dışa Aktar (JSON)</h4>
                <p className="text-xs text-slate-400">
                  Mevcut tüm ürünleri, satış fişlerini ve alım faturalarını içeren tam yedeği indirir.
                </p>
              </div>
              <button
                onClick={handleDownloadJsonBackup}
                className="w-full py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-500 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Yedek JSON İndir</span>
              </button>
            </div>

            {/* İçe Aktar */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-white mb-1">Yedekten Geri Yükle (JSON)</h4>
                <p className="text-xs text-slate-400">
                  Daha önce kaydedilmiş Paslı Mağaza JSON yedeğini sisteme yükler.
                </p>
              </div>
              <label className="w-full py-2 px-3 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors flex items-center justify-center gap-2 cursor-pointer border border-slate-700">
                <Upload className="w-4 h-4" />
                <span>Dosya Seç & Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Sıfırla */}
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-4">
              <div>
                <h4 className="text-sm font-semibold text-rose-400 mb-1">Örnek Verileri Sıfırla</h4>
                <p className="text-xs text-slate-400">
                  Tüm verileri silip orijinal başlangıç envanter ve satış örneklerini tekrar yükler.
                </p>
              </div>
              <button
                onClick={() => {
                  if (window.confirm('Tüm veritabanı sıfırlanıp varsayılan Paslı Mağaza örnek verileri yüklenecek. Emin misiniz?')) {
                    resetToDefaultData();
                  }
                }}
                className="w-full py-2 px-3 text-xs font-semibold text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white border border-rose-500/20 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Fabrika Ayarlarına Dön</span>
              </button>
            </div>

          </div>

          <div className="pt-4 border-t border-slate-800 text-xs text-slate-400 font-mono">
            Sistem Sürümü: Paslı Mağaza v1.0.0 (Rust Engine Integration) · Telif Hakkı: Enes Öztürk
          </div>
        </div>
      )}

    </div>
  );
};
