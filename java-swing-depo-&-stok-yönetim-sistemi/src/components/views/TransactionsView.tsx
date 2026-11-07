import React, { useState } from 'react';
import { StockMovement, SwingTheme } from '../../types/warehouse';
import {
  FileText,
  Search,
  Filter,
  Plus,
  Minus,
  Printer,
  Calendar,
  User,
  CheckCircle2,
  Download,
} from 'lucide-react';

interface TransactionsViewProps {
  movements: StockMovement[];
  theme: SwingTheme;
  onOpenStockIn: () => void;
  onOpenStockOut: () => void;
}

export const TransactionsView: React.FC<TransactionsViewProps> = ({
  movements,
  theme,
  onOpenStockIn,
  onOpenStockOut,
}) => {
  const [filterType, setFilterType] = useState<'ALL' | 'STOCK_IN' | 'STOCK_OUT'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedMovement, setSelectedMovement] = useState<StockMovement | null>(movements[0] || null);
  const [showWaybillModal, setShowWaybillModal] = useState<boolean>(false);

  const isDark = theme === 'darcula';
  const isNimbus = theme === 'nimbus';

  const filteredMovements = movements.filter((m) => {
    if (filterType !== 'ALL' && m.movementType !== filterType) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchDoc = m.documentNo.toLowerCase().includes(q);
      const matchSku = m.sku.toLowerCase().includes(q);
      const matchName = m.productName.toLowerCase().includes(q);
      const matchOperator = m.operatorName.toLowerCase().includes(q);
      if (!matchDoc && !matchSku && !matchName && !matchOperator) return false;
    }
    return true;
  });

  const totalIn = movements
    .filter((m) => m.movementType === 'STOCK_IN')
    .reduce((acc, m) => acc + m.quantity, 0);

  const totalOut = movements
    .filter((m) => m.movementType === 'STOCK_OUT')
    .reduce((acc, m) => acc + m.quantity, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Top Controls */}
      <div
        className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2 border-b text-xs ${
          isDark
            ? 'bg-[#3c3f41] border-[#313335] text-slate-300'
            : isNimbus
            ? 'bg-[#edf0f5] border-[#b8c0cc] text-slate-800'
            : 'bg-[#d4d0c8] border-[#808080] text-black'
        }`}
      >
        <div className="flex items-center gap-2 flex-1 max-w-sm">
          <div className="relative w-full">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="İrsaliye no, SKU veya ürün adı ara..."
              className={`w-full pl-8 pr-3 py-1 rounded-xs text-xs font-mono outline-hidden border ${
                isDark
                  ? 'bg-[#2b2b2b] border-[#4a4a4a] text-slate-100'
                  : 'bg-white border-[#888] text-black'
              }`}
            />
          </div>
        </div>

        {/* Filter Segment */}
        <div
          className={`flex items-center p-0.5 rounded-xs border ${
            isDark ? 'bg-[#2b2b2b] border-[#4a4a4a]' : 'bg-[#e0e4eb] border-[#b0b8c5]'
          }`}
        >
          <button
            onClick={() => setFilterType('ALL')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filterType === 'ALL'
                ? isDark
                  ? 'bg-[#3c3f41] text-white shadow-xs'
                  : 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tüm Hareketler ({movements.length})
          </button>
          <button
            onClick={() => setFilterType('STOCK_IN')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filterType === 'STOCK_IN'
                ? isDark
                  ? 'bg-[#3c3f41] text-emerald-300 shadow-xs'
                  : 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Depo Girişleri (+)
          </button>
          <button
            onClick={() => setFilterType('STOCK_OUT')}
            className={`px-3 py-1 text-xs font-medium rounded-xs transition-colors ${
              filterType === 'STOCK_OUT'
                ? isDark
                  ? 'bg-[#3c3f41] text-red-300 shadow-xs'
                  : 'bg-white text-red-700 shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Depo Çıkışları (-)
          </button>
        </div>

        {/* Quick action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenStockIn}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-emerald-700 hover:bg-emerald-600 text-white font-medium shadow-xs text-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Giriş Kaydet
          </button>
          <button
            onClick={onOpenStockOut}
            className="flex items-center gap-1.5 px-3 py-1 rounded-xs bg-red-700 hover:bg-red-600 text-white font-medium shadow-xs text-xs"
          >
            <Minus className="w-3.5 h-3.5" /> Çıkış Kaydet
          </button>
        </div>
      </div>

      {/* Summary KPI Strip */}
      <div
        className={`px-4 py-2 border-b flex items-center justify-between text-xs font-mono select-none ${
          isDark ? 'bg-[#313335] border-[#383a3c] text-slate-300' : 'bg-[#e9edf3] border-[#ccd] text-slate-700'
        }`}
      >
        <div className="flex items-center gap-6">
          <span>
            Toplam Giriş Kaydı: <strong className="text-emerald-400 font-bold tabular-nums">+{totalIn} Adet</strong>
          </span>
          <span>
            Toplam Çıkış Kaydı: <strong className="text-red-400 font-bold tabular-nums">-{totalOut} Adet</strong>
          </span>
          <span>
            Net Depo Değişimi: <strong className={totalIn >= totalOut ? 'text-emerald-400 font-bold' : 'text-red-400 font-bold'}>
              {totalIn - totalOut > 0 ? `+${totalIn - totalOut}` : totalIn - totalOut} Adet
            </strong>
          </span>
        </div>
        <div className="text-[11px] opacity-70">
          En son hareket: {movements[0] ? new Date(movements[0].timestamp).toLocaleString('tr-TR') : 'Yok'}
        </div>
      </div>

      {/* Movements Table */}
      <div className="flex-1 overflow-auto bg-[#2b2b2b]">
        <table className="w-full border-collapse text-left text-xs font-sans">
          <thead
            className={`sticky top-0 z-10 select-none border-b text-[11px] font-semibold ${
              isDark ? 'bg-[#313335] text-[#bbb] border-[#444]' : 'bg-[#dce1e9] text-[#2c3e50] border-[#b0b8c5]'
            }`}
          >
            <tr>
              <th className="py-2 px-3 border-r border-slate-700/50">Tarih & Saat</th>
              <th className="py-2 px-3 border-r border-slate-700/50">İşlem Türü</th>
              <th className="py-2 px-3 border-r border-slate-700/50">Belge / İrsaliye No</th>
              <th className="py-2 px-3 border-r border-slate-700/50">SKU Kodu</th>
              <th className="py-2 px-3 border-r border-slate-700/50">Ürün Adı</th>
              <th className="py-2 px-3 border-r border-slate-700/50 text-right">İşlem Miktarı</th>
              <th className="py-2 px-3 border-r border-slate-700/50 text-right">Önceki Stok</th>
              <th className="py-2 px-3 border-r border-slate-700/50 text-right">Yeni Stok</th>
              <th className="py-2 px-3 border-r border-slate-700/50">İşlem Nedeni / Gerekçe</th>
              <th className="py-2 px-3 border-r border-slate-700/50">Operatör</th>
              <th className="py-2 px-3 text-center">İrsaliye</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 font-mono text-xs">
            {filteredMovements.length === 0 ? (
              <tr>
                <td colSpan={11} className="py-12 text-center text-slate-500 font-sans">
                  Kayıtlı hareket bulunamadı.
                </td>
              </tr>
            ) : (
              filteredMovements.map((m) => {
                const isIn = m.movementType === 'STOCK_IN';
                return (
                  <tr
                    key={m.id}
                    onClick={() => setSelectedMovement(m)}
                    className={`cursor-pointer transition-colors ${
                      selectedMovement?.id === m.id
                        ? isDark
                          ? 'bg-[#1e3b6d] text-white'
                          : 'bg-[#2f5597] text-white'
                        : isDark
                        ? 'hover:bg-[#34383a] text-slate-200'
                        : 'hover:bg-slate-100 text-slate-900'
                    }`}
                  >
                    <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap text-slate-400">
                      {new Date(m.timestamp).toLocaleString('tr-TR')}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 whitespace-nowrap">
                      {isIn ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800 text-[11px]">
                          <Plus className="w-3 h-3" /> GİRİŞ (Stock In)
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-red-400 font-bold bg-red-950/40 px-2 py-0.5 rounded border border-red-800 text-[11px]">
                          <Minus className="w-3 h-3" /> ÇIKIŞ (Stock Out)
                        </span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 font-bold text-amber-300">
                      {m.documentNo}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 font-bold text-slate-300">
                      {m.sku}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 font-sans max-w-xs truncate">
                      {m.productName}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold tabular-nums">
                      {isIn ? (
                        <span className="text-emerald-400">+{m.quantity}</span>
                      ) : (
                        <span className="text-red-400">-{m.quantity}</span>
                      )}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 text-right opacity-70 tabular-nums">
                      {m.previousQuantity}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 text-right font-bold tabular-nums text-slate-200">
                      {m.newQuantity}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 font-sans text-xs">
                      {m.reason}
                    </td>

                    <td className="py-2.5 px-3 border-r border-slate-800 font-sans text-xs text-slate-300">
                      {m.operatorName}
                    </td>

                    <td className="py-2.5 px-3 text-center" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => {
                          setSelectedMovement(m);
                          setShowWaybillModal(true);
                        }}
                        className="px-2 py-1 rounded bg-slate-700 hover:bg-slate-600 text-slate-200 text-[11px] font-sans inline-flex items-center gap-1"
                        title="İrsaliye Belgesini Görüntüle & Yazdır"
                      >
                        <Printer className="w-3 h-3" /> Yazdır
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Printable Delivery Note / Sevk İrsaliyesi Modal */}
      {showWaybillModal && selectedMovement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-2xl bg-white text-slate-900 shadow-2xl rounded p-6 font-sans border border-slate-300 text-xs">
            <div className="flex items-center justify-between border-b pb-4 mb-4">
              <div>
                <h2 className="text-lg font-bold tracking-tight text-slate-950">
                  T.C. RESMİ SEVK İRSALİYESİ
                </h2>
                <div className="text-xs text-slate-500 font-mono">
                  Belge No: <strong>{selectedMovement.documentNo}</strong> · Tarih:{' '}
                  {new Date(selectedMovement.timestamp).toLocaleString('tr-TR')}
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-slate-800">DEPO & LOJİSTİK OTOMASYONU</div>
                <div className="text-[11px] text-slate-500">Sorumlu: Enes Öztürk</div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 p-3 bg-slate-50 rounded border border-slate-200 mb-4 font-mono text-[11px]">
              <div>
                <span className="text-slate-500 block">Düzenleyen Firma / Depo:</span>
                <strong className="text-slate-900">Merkez Lojistik & Depolama A.Ş.</strong>
                <div>Vergi No: 9810451201</div>
                <div>Konum: Organize Sanayi Bölgesi 4. Cadde No: 12</div>
              </div>
              <div>
                <span className="text-slate-500 block">İşlem & Yetkili Detayı:</span>
                <div>Operatör: <strong>{selectedMovement.operatorName}</strong></div>
                <div>İşlem Türü: <strong>{selectedMovement.movementType === 'STOCK_IN' ? 'Giriş İrsaliyesi' : 'Çıkış Sevkiyatı'}</strong></div>
                <div>Gerekçe: <strong>{selectedMovement.reason}</strong></div>
              </div>
            </div>

            <table className="w-full border border-slate-300 text-left mb-4">
              <thead className="bg-slate-100 text-[11px] font-bold border-b border-slate-300">
                <tr>
                  <th className="p-2 border-r border-slate-300">SKU</th>
                  <th className="p-2 border-r border-slate-300">Malzeme / Ürün Adı</th>
                  <th className="p-2 border-r border-slate-300 text-right">Miktar</th>
                  <th className="p-2 border-r border-slate-300 text-right">Önceki Stok</th>
                  <th className="p-2 text-right">Kalan Stok</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 font-mono">
                <tr>
                  <td className="p-2 border-r border-slate-300 font-bold">{selectedMovement.sku}</td>
                  <td className="p-2 border-r border-slate-300 font-sans">{selectedMovement.productName}</td>
                  <td className="p-2 border-r border-slate-300 text-right font-bold text-slate-950">
                    {selectedMovement.quantity} Adet
                  </td>
                  <td className="p-2 border-r border-slate-300 text-right">{selectedMovement.previousQuantity}</td>
                  <td className="p-2 text-right font-bold">{selectedMovement.newQuantity}</td>
                </tr>
              </tbody>
            </table>

            {selectedMovement.notes && (
              <div className="p-2 bg-amber-50 border border-amber-200 rounded text-amber-900 text-[11px] mb-4">
                <strong>Notlar:</strong> {selectedMovement.notes}
              </div>
            )}

            <div className="grid grid-cols-2 gap-8 pt-4 border-t text-center text-xs mt-6">
              <div>
                <div className="text-slate-500 mb-8">Teslim Eden (Operatör / Depo Mimarı)</div>
                <div className="font-bold border-t border-slate-300 pt-1 inline-block px-6">
                  Enes Öztürk
                </div>
              </div>
              <div>
                <div className="text-slate-500 mb-8">Teslim Alan (Nakliyeci / Şube Temsilcisi)</div>
                <div className="font-bold border-t border-slate-300 pt-1 inline-block px-6">
                  İmza / Kaşe
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 mt-6 pt-3 border-t">
              <button
                onClick={() => setShowWaybillModal(false)}
                className="px-4 py-1.5 rounded bg-slate-200 hover:bg-slate-300 text-slate-800 font-medium"
              >
                Kapat
              </button>
              <button
                onClick={() => {
                  window.print();
                }}
                className="px-4 py-1.5 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium flex items-center gap-1.5"
              >
                <Printer className="w-3.5 h-3.5" /> Yazdır (Print)
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
