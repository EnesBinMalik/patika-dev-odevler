import React from 'react';
import { Product, SwingTheme } from '../../types/warehouse';
import {
  PieChart,
  BarChart3,
  TrendingUp,
  AlertTriangle,
  Building,
  ShieldCheck,
  Layers,
  ThermometerSnowflake,
  ShieldAlert,
  Cpu,
} from 'lucide-react';

interface AnalyticsViewProps {
  products: Product[];
  theme: SwingTheme;
  calculateStorageCost: (p: Product) => number;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  products,
  theme,
  calculateStorageCost,
}) => {
  const isDark = theme === 'darcula';

  const totalUnits = products.reduce((acc, p) => acc + p.stockQuantity, 0);
  const totalValuation = products.reduce((acc, p) => acc + p.stockQuantity * p.unitPrice, 0);
  const totalMonthlyStorageCost = products.reduce((acc, p) => acc + calculateStorageCost(p), 0);
  const criticalItems = products.filter((p) => p.stockQuantity > 0 && p.stockQuantity <= p.reorderThreshold);
  const depletedItems = products.filter((p) => p.stockQuantity === 0);

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.category)));
  const categoryStats = categories.map((cat) => {
    const items = products.filter((p) => p.category === cat);
    const units = items.reduce((acc, p) => acc + p.stockQuantity, 0);
    const value = items.reduce((acc, p) => acc + p.stockQuantity * p.unitPrice, 0);
    return { category: cat, count: items.length, units, value };
  });

  return (
    <div className="flex-1 overflow-auto p-6 bg-[#2b2b2b] text-slate-100 space-y-6 text-xs">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header Title */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
              <span>Depo İstatistikleri, Kapasite ve Finansal Rapor</span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              OOP tabanlı nesne verilerinden canlı olarak hesaplanan finansal değerleme ve depo alan kullanım metrikleri.
            </p>
          </div>
          <div className="text-right font-mono text-[11px] text-slate-400">
            Sistem Sorumlusu: <strong className="text-amber-400">Enes Öztürk</strong>
          </div>
        </div>

        {/* Top 4 KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono">
          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335]">
            <div className="text-slate-400 text-[11px] mb-1 font-sans">Toplam Depo Envanter Değeri</div>
            <div className="text-xl font-bold text-emerald-400 tabular-nums">
              {totalValuation.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺
            </div>
            <div className="text-[10px] text-slate-500 mt-1">Aktif stoktaki tüm malların toplamı</div>
          </div>

          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335]">
            <div className="text-slate-400 text-[11px] mb-1 font-sans">Toplam Fiziksel Miktar</div>
            <div className="text-xl font-bold text-blue-400 tabular-nums">
              {totalUnits.toLocaleString('tr-TR')} Adet
            </div>
            <div className="text-[10px] text-slate-500 mt-1">{products.length} farklı SKU kalemi</div>
          </div>

          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335]">
            <div className="text-slate-400 text-[11px] mb-1 font-sans">Aylık Çok Biçimli Depolama Gideri</div>
            <div className="text-xl font-bold text-cyan-400 tabular-nums">
              {totalMonthlyStorageCost.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ₺/ay
            </div>
            <div className="text-[10px] text-cyan-500 mt-1">Soğutma, ADR ve ESD katsayıları dahil</div>
          </div>

          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335]">
            <div className="text-slate-400 text-[11px] mb-1 font-sans">Kritik / Tükenen Ürün Sayısı</div>
            <div className={`text-xl font-bold tabular-nums ${criticalItems.length + depletedItems.length > 0 ? 'text-amber-400' : 'text-emerald-400'}`}>
              {criticalItems.length + depletedItems.length} Kalem
            </div>
            <div className="text-[10px] text-slate-500 mt-1">
              {depletedItems.length} tükenen · {criticalItems.length} kritik seviyede
            </div>
          </div>
        </div>

        {/* Category Breakdown & Storage Zones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Category distribution */}
          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335]">
            <h3 className="font-bold text-slate-200 text-sm mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Kategoriye Göre Değer Dağılımı</span>
            </h3>
            <div className="space-y-3 font-mono text-xs">
              {categoryStats.map((cs) => {
                const percent = totalValuation > 0 ? (cs.value / totalValuation) * 100 : 0;
                return (
                  <div key={cs.category} className="space-y-1">
                    <div className="flex justify-between items-center text-[11px]">
                      <span className="font-semibold text-slate-200 font-sans">{cs.category}</span>
                      <span className="text-slate-400 tabular-nums">
                        {cs.value.toLocaleString('tr-TR')} ₺ (%{percent.toFixed(1)})
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-black/40 overflow-hidden">
                      <div
                        className="h-full bg-blue-500 rounded-full transition-all duration-300"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500">
                      <span>{cs.count} Çeşit Ürün</span>
                      <span>{cs.units} Adet Depoda</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Special Zones & Warehouse Sections */}
          <div className="p-4 rounded-xs border border-slate-700 bg-[#313335] space-y-3">
            <h3 className="font-bold text-slate-200 text-sm mb-2 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-400" />
              <span>Depo Özel Bölgeleri & Güvenlik Protokolleri</span>
            </h3>

            <div className="p-3 rounded bg-black/30 border border-slate-700/60 space-y-1 font-mono text-[11px]">
              <div className="flex items-center justify-between text-cyan-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ThermometerSnowflake className="w-3.5 h-3.5" /> Soğuk Hava Deposu (A-Blok)
                </span>
                <span>2°C ile -20°C</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Biyoteknolojik solüsyonlar ve aşılar için kesintisiz jeneratör destekli iklimlendirme odası. SKT takibi otomatiktir.
              </p>
            </div>

            <div className="p-3 rounded bg-black/30 border border-slate-700/60 space-y-1 font-mono text-[11px]">
              <div className="flex items-center justify-between text-amber-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <ShieldAlert className="w-3.5 h-3.5" /> Kimyasal & Tehlikeli Madde Sahası (KIM-Özel)
                </span>
                <span>ADR Sınıf 3 & Sınıf 8</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Epoksi çözücüler ve konsantre asitler için statik topraklı, otomatik köpüklü yangın söndürmeli havalandırmalı depo.
              </p>
            </div>

            <div className="p-3 rounded bg-black/30 border border-slate-700/60 space-y-1 font-mono text-[11px]">
              <div className="flex items-center justify-between text-blue-400 font-bold">
                <span className="flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5" /> Hassas Elektronik Rafı (A-01 / A-02)
                </span>
                <span>ESD Korumalı</span>
              </div>
              <p className="text-slate-400 font-sans text-xs">
                Mikrodenetleyici ve optik sensörler için nem kontrollü elektrostatik deşarj korumalı raflar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
