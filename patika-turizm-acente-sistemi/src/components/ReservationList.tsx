/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Rezervasyon Yönetimi & Kupon Görüntüleme
 * Geliştirici: Enes Öztürk
 */

import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Reservation } from '../types/database';
import {
  FileText,
  Search,
  CheckCircle2,
  XCircle,
  Building2,
  Calendar,
  Phone,
  Mail,
  User,
  Trash2,
  Edit2,
  Printer,
  X,
  AlertTriangle,
  Receipt,
  Sparkles,
} from 'lucide-react';

interface ReservationListProps {
  highlightedReservationId?: string;
}

export const ReservationList: React.FC<ReservationListProps> = ({
  highlightedReservationId,
}) => {
  const { reservations, hotels, rooms, cancelReservation, deleteReservation, updateReservation } = useDatabase();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'confirmed' | 'cancelled'>('all');
  const [selectedVoucher, setSelectedVoucher] = useState<Reservation | null>(() => {
    if (highlightedReservationId) {
      return reservations.find((r) => r.id === highlightedReservationId) || null;
    }
    return null;
  });
  const [editingReservation, setEditingReservation] = useState<Reservation | null>(null);
  const [editFormData, setEditFormData] = useState({
    customer_name: '',
    customer_phone: '',
    customer_email: '',
    notes: '',
  });
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Filter reservations
  const filteredReservations = useMemo(() => {
    return reservations.filter((res) => {
      const hotel = hotels.find((h) => h.id === res.otel_id);
      const matchesStatus = statusFilter === 'all' || res.status === statusFilter;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        res.customer_name.toLowerCase().includes(q) ||
        res.customer_phone.includes(q) ||
        res.customer_identity.includes(q) ||
        res.id.toLowerCase().includes(q) ||
        (hotel?.name.toLowerCase().includes(q) ?? false);
      return matchesStatus && matchesSearch;
    });
  }, [reservations, hotels, statusFilter, searchQuery]);

  const handleOpenEdit = (res: Reservation) => {
    setEditingReservation(res);
    setEditFormData({
      customer_name: res.customer_name,
      customer_phone: res.customer_phone,
      customer_email: res.customer_email,
      notes: res.notes || '',
    });
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingReservation) return;

    updateReservation(editingReservation.id, editFormData);
    setSuccessMsg('Rezervasyon bilgileri güncellendi.');
    setEditingReservation(null);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleCancel = (res: Reservation) => {
    if (window.confirm(`${res.customer_name} adına kayıtlı rezervasyonu iptal etmek istediğinize emin misiniz? (Oda stoğu otomatik olarak +1 artırılacaktır)`)) {
      const result = cancelReservation(res.id);
      if (!result.success) {
        alert(result.error);
      } else {
        setSuccessMsg(`Rezervasyon iptal edildi ve ilgili oda stoğu 1 arttırıldı.`);
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    }
  };

  const handleDelete = (res: Reservation) => {
    if (window.confirm(`${res.customer_name} adına kayıtlı rezervasyon kaydını sistemden tamamen silmek istiyor musunuz?`)) {
      const result = deleteReservation(res.id);
      if (!result.success) {
        alert(result.error);
      } else {
        setSuccessMsg('Rezervasyon kaydı silindi (stok güncellendi).');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <FileText className="w-4 h-4" />
            Rezervasyon & Satış Kayıtları
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Rezervasyon Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Müşterilere yapılan rezervasyonları listeleyin, misafir ve iletişim detaylarını güncelleyin. İptal veya silme işlemlerinde oda stoğu otomatik olarak 1 arttırılır.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-semibold">
            Onaylı: {reservations.filter((r) => r.status === 'confirmed').length} Rezervasyon
          </div>
        </div>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Müşteri adı, TC kimlik, telefon veya otel ara..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-800"
          />
        </div>

        {/* Status Segmented Buttons */}
        <div className="flex items-center p-1 bg-slate-100 rounded-lg gap-1 shrink-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              statusFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tümü ({reservations.length})
          </button>
          <button
            onClick={() => setStatusFilter('confirmed')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              statusFilter === 'confirmed'
                ? 'bg-white text-emerald-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Aktif Onaylı ({reservations.filter((r) => r.status === 'confirmed').length})
          </button>
          <button
            onClick={() => setStatusFilter('cancelled')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
              statusFilter === 'cancelled'
                ? 'bg-white text-rose-700 shadow-xs font-semibold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            İptal Edilenler ({reservations.filter((r) => r.status === 'cancelled').length})
          </button>
        </div>
      </div>

      {/* Reservations Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-5 py-3.5">Rez. Kodu & Müşteri</th>
                <th className="px-5 py-3.5">Otel & Konum</th>
                <th className="px-5 py-3.5">Oda & Pansiyon</th>
                <th className="px-5 py-3.5">Tarih & Süre</th>
                <th className="px-5 py-3.5">Misafirler</th>
                <th className="px-5 py-3.5 text-right">Toplam Tutar</th>
                <th className="px-5 py-3.5 text-center">Durum</th>
                <th className="px-5 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredReservations.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Kayıtlı rezervasyon bulunamadı. "Oda Arama & Fiyat" sekmesinden yeni satış yapabilirsiniz.
                  </td>
                </tr>
              ) : (
                filteredReservations.map((res) => {
                  const hotel = hotels.find((h) => h.id === res.otel_id);
                  const isHighlighted = highlightedReservationId === res.id;

                  return (
                    <tr
                      key={res.id}
                      className={`hover:bg-slate-50/60 transition-colors ${
                        isHighlighted ? 'bg-amber-50/40' : ''
                      }`}
                    >
                      {/* Code & Customer */}
                      <td className="px-5 py-4">
                        <div className="font-mono font-bold text-sky-700 text-xs">
                          #{res.id}
                        </div>
                        <div className="font-bold text-slate-900 mt-0.5">{res.customer_name}</div>
                        <div className="text-[11px] text-slate-500 font-mono flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {res.customer_phone}
                        </div>
                      </td>

                      {/* Hotel */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{hotel?.name || '—'}</div>
                        <div className="text-[11px] text-slate-500">{hotel?.city}, {hotel?.district}</div>
                      </td>

                      {/* Room & Pension */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-900">{res.room_type}</div>
                        <div className="text-[11px] text-sky-700 font-semibold">{res.pension_type}</div>
                      </td>

                      {/* Dates */}
                      <td className="px-5 py-4 font-mono text-slate-700">
                        <div className="font-medium text-xs">
                          {new Date(res.check_in_date).toLocaleDateString('tr-TR')}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {new Date(res.check_out_date).toLocaleDateString('tr-TR')} ({res.night_count} Gece)
                        </div>
                      </td>

                      {/* Guests */}
                      <td className="px-5 py-4">
                        <div className="text-slate-800 font-medium">
                          {res.adult_count} Yetişkin{res.child_count > 0 ? `, ${res.child_count} Çocuk` : ''}
                        </div>
                        <div className="text-[10px] text-slate-400">
                          TC: {res.customer_identity}
                        </div>
                      </td>

                      {/* Total Price */}
                      <td className="px-5 py-4 text-right font-mono font-bold text-slate-900 text-sm">
                        {res.total_price.toLocaleString('tr-TR')} ₺
                      </td>

                      {/* Status */}
                      <td className="px-5 py-4 text-center">
                        {res.status === 'confirmed' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Onaylandı
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-semibold bg-rose-50 text-rose-700 border border-rose-200/60">
                            <XCircle className="w-3.5 h-3.5" />
                            İptal Edildi
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {/* Voucher Button */}
                          <button
                            onClick={() => setSelectedVoucher(res)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Rezervasyon Belgesi / Kuponu Yazdır"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>

                          {/* Edit Button */}
                          <button
                            onClick={() => handleOpenEdit(res)}
                            className="p-1.5 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                            title="İletişim Bilgilerini Düzenle"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          {/* Cancel Button (restores stock) */}
                          {res.status === 'confirmed' && (
                            <button
                              onClick={() => handleCancel(res)}
                              className="p-1.5 text-slate-500 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-colors"
                              title="Rezervasyonu İptal Et (Stoğu Geri Yükle)"
                            >
                              <AlertTriangle className="w-4 h-4" />
                            </button>
                          )}

                          {/* Delete Button */}
                          <button
                            onClick={() => handleDelete(res)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Kaydı Tamamen Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Voucher Detail Modal */}
      {selectedVoucher && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            {/* Voucher Header */}
            <div className="p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 text-xs text-sky-400 font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  Patika Turizm Acentesi
                </div>
                <h3 className="text-xl font-bold tracking-tight text-white mt-1">
                  Resmi Rezervasyon Kuponu (Voucher)
                </h3>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Rezervasyon No: #{selectedVoucher.id}
                </p>
              </div>
              <button
                onClick={() => setSelectedVoucher(null)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Voucher Body */}
            <div className="p-6 space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] block">Müşteri Adı Soyadı</span>
                  <div className="text-sm font-bold text-slate-900">{selectedVoucher.customer_name}</div>
                  <div className="text-slate-500 font-mono">TC: {selectedVoucher.customer_identity}</div>
                  <div className="text-slate-500 font-mono">{selectedVoucher.customer_phone}</div>
                </div>

                <div className="text-right">
                  <span className="text-slate-400 text-[11px] block">Toplam Tahsil Edilen Tutar</span>
                  <div className="text-2xl font-bold font-mono text-emerald-600">
                    {selectedVoucher.total_price.toLocaleString('tr-TR')} ₺
                  </div>
                  <div className="text-slate-500">
                    {selectedVoucher.night_count} Gece Konaklama
                  </div>
                </div>
              </div>

              {/* Hotel and Room info */}
              <div className="space-y-2">
                <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                  Konaklama Detayları
                </span>
                <div className="p-3 bg-slate-50 rounded-xl space-y-1.5">
                  <div className="flex justify-between font-bold text-slate-900 text-sm">
                    <span>{hotels.find((h) => h.id === selectedVoucher.otel_id)?.name}</span>
                    <span className="text-sky-700">{selectedVoucher.room_type}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Pansiyon Türü:</span>
                    <span className="font-semibold">{selectedVoucher.pension_type}</span>
                  </div>
                  <div className="flex justify-between text-slate-600 font-mono">
                    <span>Giriş / Çıkış:</span>
                    <span>
                      {new Date(selectedVoucher.check_in_date).toLocaleDateString('tr-TR')} ~ {new Date(selectedVoucher.check_out_date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Guests List */}
              {selectedVoucher.guests && selectedVoucher.guests.length > 0 && (
                <div className="space-y-2">
                  <span className="text-slate-400 text-[11px] uppercase font-bold tracking-wider">
                    Kayıtlı Misafirler
                  </span>
                  <div className="divide-y divide-slate-100 border border-slate-100 rounded-xl overflow-hidden">
                    {selectedVoucher.guests.map((g, idx) => (
                      <div key={idx} className="p-2.5 flex items-center justify-between bg-white text-xs">
                        <span className="font-medium text-slate-800">
                          {idx + 1}. {g.first_name || 'Misafir'} {g.last_name || ''}
                        </span>
                        <span className="font-mono text-slate-500">
                          {g.identity_no || '—'} ({g.is_child ? 'Çocuk' : 'Yetişkin'})
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {selectedVoucher.notes && (
                <div className="p-2.5 bg-amber-50 rounded-lg text-amber-800 border border-amber-200/60">
                  <strong>Özel Not:</strong> {selectedVoucher.notes}
                </div>
              )}

              {/* Footer info */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                <span>İşlemi Yapan Temsilci: @{selectedVoucher.created_by}</span>
                <span>Tarih: {new Date(selectedVoucher.created_at).toLocaleString('tr-TR')}</span>
              </div>
            </div>

            {/* Modal actions */}
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-medium">
                Geliştirici: Enes Öztürk
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs flex items-center gap-2"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Yazdır / PDF
                </button>
                <button
                  onClick={() => setSelectedVoucher(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg font-medium text-xs"
                >
                  Kapat
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Reservation Details Modal */}
      {editingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-slate-900 text-sm">
                Rezervasyon Bilgilerini Güncelle (#{editingReservation.id})
              </h3>
              <button
                onClick={() => setEditingReservation(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Müşteri Adı</label>
                <input
                  type="text"
                  required
                  value={editFormData.customer_name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, customer_name: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Telefon</label>
                <input
                  type="text"
                  required
                  value={editFormData.customer_phone}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, customer_phone: e.target.value })
                  }
                  className="w-full px-3 py-2 font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">E-Posta</label>
                <input
                  type="email"
                  value={editFormData.customer_email}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, customer_email: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Özel Notlar</label>
                <textarea
                  rows={2}
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-800"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingReservation(null)}
                  className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-xs"
                >
                  Değişiklikleri Kaydet
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
