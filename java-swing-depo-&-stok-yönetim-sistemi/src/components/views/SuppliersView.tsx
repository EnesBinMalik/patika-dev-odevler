import React, { useState } from 'react';
import { Supplier, PurchaseOrder, SwingTheme, Product } from '../../types/warehouse';
import {
  Truck,
  Building,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
  PackageCheck,
  Calendar,
  ExternalLink,
} from 'lucide-react';

interface SuppliersViewProps {
  suppliers: Supplier[];
  purchaseOrders: PurchaseOrder[];
  products: Product[];
  theme: SwingTheme;
  onOpenNewSupplier: () => void;
  onAutoReorderAll: () => void;
  onUpdateOrderStatus: (orderId: string, status: PurchaseOrder['status']) => void;
}

export const SuppliersView: React.FC<SuppliersViewProps> = ({
  suppliers,
  purchaseOrders,
  products,
  theme,
  onOpenNewSupplier,
  onAutoReorderAll,
  onUpdateOrderStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'ORDERS' | 'SUPPLIERS'>('ORDERS');
  const [selectedSupplierId, setSelectedSupplierId] = useState<string>(suppliers[0]?.id || '');

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const criticalProductsCount = products.filter((p) => p.stockQuantity <= p.reorderThreshold).length;

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Sub-bar / Segment selector */}
      <div
        className={`flex items-center justify-between px-4 py-2 border-b text-xs ${
          isDark
            ? 'bg-[#3c3f41] border-[#313335] text-slate-300'
            : isNimbus
            ? 'bg-[#edf0f5] border-[#b8c0cc] text-slate-800'
            : 'bg-[#d4d0c8] border-[#808080] text-black'
        }`}
      >
        <div className="flex items-center gap-2">
          <div
            className={`flex items-center p-0.5 rounded-xs border ${
              isDark ? 'bg-[#2b2b2b] border-[#4a4a4a]' : 'bg-[#e0e4eb] border-[#b0b8c5]'
            }`}
          >
            <button
              onClick={() => setActiveTab('ORDERS')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'ORDERS'
                  ? isDark
                    ? 'bg-[#3c3f41] text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <PackageCheck className="w-3.5 h-3.5 text-blue-400" />
              <span>Satın Alma Siparişleri ({purchaseOrders.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('SUPPLIERS')}
              className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors flex items-center gap-1.5 ${
                activeTab === 'SUPPLIERS'
                  ? isDark
                    ? 'bg-[#3c3f41] text-white shadow-xs'
                    : 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Building className="w-3.5 h-3.5 text-amber-400" />
              <span>Anlaşmalı Tedarikçi Portföyü ({suppliers.length})</span>
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {criticalProductsCount > 0 && (
            <button
              onClick={onAutoReorderAll}
              className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs shadow-xs"
              title="Kritik seviyedeki tüm ürünler için otomatik satın alma emri üretir"
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>Tüm Kritik Ürünleri Tedarik Et ({criticalProductsCount})</span>
            </button>
          )}

          <button
            onClick={onOpenNewSupplier}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Yeni Tedarikçi Ekle</span>
          </button>
        </div>
      </div>

      {/* Main Content Pane */}
      {activeTab === 'ORDERS' ? (
        <div className="flex-1 flex flex-col min-h-0 bg-[#2b2b2b] overflow-hidden">
          <div className="flex-1 overflow-auto">
            <table className="w-full border-collapse text-left text-xs font-sans">
              <thead
                className={`sticky top-0 z-10 select-none border-b text-[11px] font-semibold ${
                  isDark ? 'bg-[#313335] text-[#bbb] border-[#444]' : 'bg-[#dce1e9] text-[#2c3e50] border-[#b0b8c5]'
                }`}
              >
                <tr>
                  <th className="py-2 px-3 border-r border-slate-700/50">Sipariş No</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">Tarih</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">Tedarikçi Firma</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">Ürün & SKU</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Sipariş Adedi</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Birim Fiyat</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-right">Toplam Tutar</th>
                  <th className="py-2 px-3 border-r border-slate-700/50">Tahmini Varış</th>
                  <th className="py-2 px-3 border-r border-slate-700/50 text-center">Durum</th>
                  <th className="py-2 px-3 text-center">İşlem</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 font-mono text-xs">
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="py-12 text-center text-slate-500 font-sans">
                      Kayıtlı satın alma siparişi bulunmuyor.
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((o) => {
                    const isReceived = o.status === 'RECEIVED';
                    const isInTransit = o.status === 'IN_TRANSIT';
                    const isOrdered = o.status === 'ORDERED';

                    return (
                      <tr
                        key={o.id}
                        className={`transition-colors ${
                          isReceived
                            ? 'opacity-65 hover:opacity-100 bg-slate-900/30'
                            : 'hover:bg-[#34383a] text-slate-200'
                        }`}
                      >
                        <td className="py-2.5 px-3 border-r border-slate-800 font-bold text-amber-300">
                          {o.orderNumber}
                          {o.isAutoGenerated && (
                            <span className="block text-[10px] text-amber-400 font-sans">
                              (Otomatik Kritik Tetikleme)
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-slate-400 whitespace-nowrap">
                          {new Date(o.orderDate).toLocaleDateString('tr-TR')}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 font-sans font-semibold text-slate-200">
                          {o.supplierName}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 font-sans">
                          <div className="font-semibold text-slate-100">{o.productName}</div>
                          <div className="text-[11px] font-mono text-slate-400">{o.sku}</div>
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold tabular-nums text-emerald-400">
                          {o.quantity} Adet
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-right tabular-nums">
                          {o.unitPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold tabular-nums text-slate-100">
                          {o.totalAmount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-slate-400 whitespace-nowrap">
                          {new Date(o.expectedDate).toLocaleDateString('tr-TR')}
                        </td>

                        <td className="py-2.5 px-3 border-r border-slate-800 text-center whitespace-nowrap font-sans text-xs">
                          {isReceived && (
                            <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800">
                              <CheckCircle2 className="w-3 h-3" /> Depoya Ulaştı (Kabul Edildi)
                            </span>
                          )}
                          {isInTransit && (
                            <span className="inline-flex items-center gap-1 text-blue-400 bg-blue-950/40 px-2 py-0.5 rounded border border-blue-800">
                              <Truck className="w-3 h-3 animate-pulse" /> Sevk Halinde (Yolda)
                            </span>
                          )}
                          {isOrdered && (
                            <span className="inline-flex items-center gap-1 text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-800">
                              <Clock className="w-3 h-3" /> Tedarikçiye İletildi
                            </span>
                          )}
                        </td>

                        <td className="py-2.5 px-3 text-center whitespace-nowrap font-sans">
                          {!isReceived ? (
                            <button
                              onClick={() => onUpdateOrderStatus(o.id, 'RECEIVED')}
                              className="px-2.5 py-1 rounded bg-emerald-700 hover:bg-emerald-600 text-white font-medium text-xs transition-colors inline-flex items-center gap-1"
                              title="Tedarikçiden gelen ürünleri teslim al ve stoğa ekle"
                            >
                              <CheckCircle2 className="w-3 h-3" /> Depo Kabulü Yap (+)
                            </button>
                          ) : (
                            <span className="text-slate-500 text-xs">Tamamlandı</span>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Suppliers Registry Tab */
        <div className="flex-1 overflow-auto p-4 bg-[#2b2b2b]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((s) => {
              const supplierOrders = purchaseOrders.filter((po) => po.supplierId === s.id);
              const totalPurchased = supplierOrders.reduce((acc, po) => acc + po.totalAmount, 0);

              return (
                <div
                  key={s.id}
                  className={`p-4 rounded-xs border text-xs ${
                    isDark ? 'bg-[#313335] border-[#444] text-slate-300' : 'bg-white border-slate-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <div className="font-bold text-sm text-slate-100 flex items-center gap-2">
                        <Building className="w-4 h-4 text-amber-400" />
                        <span>{s.name}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                        Kod: {s.code} · Kategori: {s.category}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800">
                        Güvenilirlik: %{s.reliabilityScore}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 my-3 text-[11px] font-mono bg-black/20 p-2.5 rounded border border-slate-700/40">
                    <div>
                      <span className="text-slate-500 block">Yetkili Kişi:</span>
                      <strong className="text-slate-200">{s.contactPerson}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Şehir / Lokasyon:</span>
                      <strong className="text-slate-200">{s.city}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Telefon:</span>
                      <strong className="text-slate-200">{s.phone}</strong>
                    </div>
                    <div>
                      <span className="text-slate-500 block">Ortalama Termin:</span>
                      <strong className="text-amber-300">{s.leadTimeDays} İş Günü</strong>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px]">
                    <span className="text-slate-400">
                      Toplam Sipariş Hacmi: <strong className="text-emerald-400 font-mono">{totalPurchased.toLocaleString('tr-TR')} ₺</strong> ({supplierOrders.length} Sipariş)
                    </span>
                    <span className="font-mono text-slate-500">Vergi No: {s.taxNumber}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
