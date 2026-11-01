/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Oda & Fiyat Yönetimi
 * Geliştirici: Enes Öztürk
 */

import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Room,
  RoomType,
  PensionType,
  ROOM_TYPES,
} from '../types/database';
import {
  BedDouble,
  Plus,
  Building2,
  Calendar,
  Tv,
  Wine,
  Gamepad2,
  Lock,
  Projector,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  ArrowUpDown,
  Search,
} from 'lucide-react';

interface RoomManagementProps {
  initialHotelId?: string;
}

export const RoomManagement: React.FC<RoomManagementProps> = ({ initialHotelId }) => {
  const { rooms, hotels, seasons, addRoom, updateRoom, deleteRoom } = useDatabase();

  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>(
    initialHotelId || 'all'
  );
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    otel_id: string;
    season_id: string;
    pension_type: PensionType;
    room_type: RoomType;
    adult_price: number;
    child_price: number;
    stock: number;
    bed_count: number;
    square_meters: number;
    has_tv: boolean;
    has_minibar: boolean;
    has_console: boolean;
    has_safe: boolean;
    has_projector: boolean;
  }>({
    otel_id: hotels[0]?.id || '',
    season_id: '',
    pension_type: 'Oda Kahvaltı',
    room_type: 'Double Room',
    adult_price: 1500,
    child_price: 750,
    stock: 10,
    bed_count: 2,
    square_meters: 30,
    has_tv: true,
    has_minibar: true,
    has_console: false,
    has_safe: true,
    has_projector: false,
  });

  // Filtered rooms
  const filteredRooms = useMemo(() => {
    return rooms.filter((r) => {
      const matchHotel = selectedHotelFilter === 'all' || r.otel_id === selectedHotelFilter;
      const matchType = selectedTypeFilter === 'all' || r.room_type === selectedTypeFilter;
      return matchHotel && matchType;
    });
  }, [rooms, selectedHotelFilter, selectedTypeFilter]);

  // When selected hotel changes in modal, dynamically update available seasons and pensions
  const currentModalHotel = hotels.find((h) => h.id === formData.otel_id) || hotels[0];
  const hotelSeasons = seasons.filter((s) => s.otel_id === currentModalHotel?.id);
  const hotelPensions = currentModalHotel?.pension_types || ['Oda Kahvaltı'];

  const handleOpenAdd = () => {
    const defaultHotel = selectedHotelFilter !== 'all'
      ? hotels.find((h) => h.id === selectedHotelFilter) || hotels[0]
      : hotels[0];

    const availableSeasons = seasons.filter((s) => s.otel_id === defaultHotel?.id);
    const availablePensions = defaultHotel?.pension_types || ['Oda Kahvaltı'];

    setEditingRoom(null);
    setFormData({
      otel_id: defaultHotel?.id || '',
      season_id: availableSeasons[0]?.id || '',
      pension_type: availablePensions[0] || 'Oda Kahvaltı',
      room_type: 'Double Room',
      adult_price: 1500,
      child_price: 750,
      stock: 10,
      bed_count: 2,
      square_meters: 32,
      has_tv: true,
      has_minibar: true,
      has_console: false,
      has_safe: true,
      has_projector: false,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (room: Room) => {
    setEditingRoom(room);
    setFormData({
      otel_id: room.otel_id,
      season_id: room.season_id,
      pension_type: room.pension_type,
      room_type: room.room_type,
      adult_price: room.adult_price,
      child_price: room.child_price,
      stock: room.stock,
      bed_count: room.bed_count,
      square_meters: room.square_meters,
      has_tv: room.has_tv,
      has_minibar: room.has_minibar,
      has_console: room.has_console,
      has_safe: room.has_safe,
      has_projector: room.has_projector,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleHotelChange = (hotelId: string) => {
    const hotel = hotels.find((h) => h.id === hotelId);
    const avSeasons = seasons.filter((s) => s.otel_id === hotelId);
    const avPensions = hotel?.pension_types || ['Oda Kahvaltı'];

    setFormData((prev) => ({
      ...prev,
      otel_id: hotelId,
      season_id: avSeasons[0]?.id || '',
      pension_type: avPensions[0] || 'Oda Kahvaltı',
    }));
  };

  const handleRoomTypeChange = (type: RoomType) => {
    const config = ROOM_TYPES.find((t) => t.id === type);
    setFormData((prev) => ({
      ...prev,
      room_type: type,
      bed_count: config ? config.defaultBeds : prev.bed_count,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.otel_id) {
      setErrorMsg('Lütfen bir otel seçiniz.');
      return;
    }
    if (!formData.season_id) {
      setErrorMsg('Bu otele ait kayıtlı bir dönem bulunamadı. Lütfen önce Dönem Yönetimi ekranından bu otele bir dönem ekleyiniz.');
      return;
    }
    if (formData.adult_price <= 0) {
      setErrorMsg('Gecelik yetişkin fiyatı 0 dan büyük olmalıdır.');
      return;
    }
    if (formData.stock < 0) {
      setErrorMsg('Stok sayısı negatif olamaz.');
      return;
    }

    if (editingRoom) {
      updateRoom(editingRoom.id, formData);
      setSuccessMsg('Oda bilgileri ve fiyatlandırma güncellendi.');
    } else {
      addRoom(formData);
      setSuccessMsg('Yeni oda tipi ve stok kaydı başarıyla oluşturuldu.');
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = (id: string, roomTypeName: string) => {
    if (window.confirm(`${roomTypeName} odasını silmek istediğinize emin misiniz?`)) {
      const res = deleteRoom(id);
      if (!res.success) {
        alert(res.message);
      } else {
        setSuccessMsg('Oda kaydı sistemden silindi.');
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    }
  };

  const handleQuickStockChange = (roomId: string, delta: number) => {
    const room = rooms.find((r) => r.id === roomId);
    if (!room) return;
    const newStock = Math.max(0, room.stock + delta);
    updateRoom(roomId, { stock: newStock });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <BedDouble className="w-4 h-4" />
            Envanter & Fiyatlandırma
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Oda & Fiyat Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Otellerin 4 ana oda tipi (Single, Double, Junior Suite, Suite), dönem fiyatları ve stok adetlerini yönetin.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Oda Ekle
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-slate-400" />
            <select
              value={selectedHotelFilter}
              onChange={(e) => setSelectedHotelFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium text-slate-800"
            >
              <option value="all">Tüm Oteller ({hotels.length})</option>
              {hotels.map((h) => (
                <option key={h.id} value={h.id}>
                  {h.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <BedDouble className="w-4 h-4 text-slate-400" />
            <select
              value={selectedTypeFilter}
              onChange={(e) => setSelectedTypeFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium text-slate-800"
            >
              <option value="all">Tüm Oda Tipleri (4 Tip)</option>
              {ROOM_TYPES.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {filteredRooms.length} oda kaydı
        </div>
      </div>

      {/* Rooms Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50/80 border-b border-slate-200 text-slate-500 uppercase tracking-wider text-[11px] font-semibold">
              <tr>
                <th className="px-5 py-3.5">Otel & Konum</th>
                <th className="px-5 py-3.5">Oda Tipi & Kapasite</th>
                <th className="px-5 py-3.5">Dönem & Pansiyon</th>
                <th className="px-5 py-3.5">Oda Özellikleri</th>
                <th className="px-5 py-3.5 text-right">Gecelik Fiyatlar (₺)</th>
                <th className="px-5 py-3.5 text-center">Stok Durumu</th>
                <th className="px-5 py-3.5 text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRooms.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    <BedDouble className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                    Kayıtlı oda bulunamadı. "Yeni Oda Ekle" butonu ile otellere oda tanımlayabilirsiniz.
                  </td>
                </tr>
              ) : (
                filteredRooms.map((room) => {
                  const hotel = hotels.find((h) => h.id === room.otel_id);
                  const season = seasons.find((s) => s.id === room.season_id);

                  return (
                    <tr key={room.id} className="hover:bg-slate-50/60 transition-colors">
                      {/* Hotel */}
                      <td className="px-5 py-4">
                        <div className="font-bold text-slate-900">{hotel?.name || '—'}</div>
                        <div className="text-[11px] text-slate-500">{hotel?.city}, {hotel?.district}</div>
                      </td>

                      {/* Room Type & Beds */}
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{room.room_type}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>{room.bed_count} Yatak ({room.bed_count} Kişilik)</span>
                          <span aria-hidden="true">·</span>
                          <span>{room.square_meters} m²</span>
                        </div>
                      </td>

                      {/* Season & Pension */}
                      <td className="px-5 py-4">
                        <div className="font-medium text-slate-800">{season?.name || 'Tüm Dönemler'}</div>
                        <div className="text-[11px] text-sky-700 font-semibold mt-0.5">
                          {room.pension_type}
                        </div>
                        {season && (
                          <div className="text-[10px] text-slate-400 font-mono">
                            {season.start_date} ~ {season.end_date}
                          </div>
                        )}
                      </td>

                      {/* Features */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          {room.has_tv && (
                            <span title="Televizyon" className="p-1 bg-slate-100 rounded text-slate-700">
                              <Tv className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {room.has_minibar && (
                            <span title="Minibar" className="p-1 bg-slate-100 rounded text-slate-700">
                              <Wine className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {room.has_console && (
                            <span title="Oyun Konsolu" className="p-1 bg-purple-100 rounded text-purple-700">
                              <Gamepad2 className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {room.has_safe && (
                            <span title="Kasa" className="p-1 bg-slate-100 rounded text-slate-700">
                              <Lock className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {room.has_projector && (
                            <span title="Projeksiyon" className="p-1 bg-blue-100 rounded text-blue-700">
                              <Projector className="w-3.5 h-3.5" />
                            </span>
                          )}
                          {!room.has_tv && !room.has_minibar && !room.has_console && !room.has_safe && !room.has_projector && (
                            <span className="text-[11px] text-slate-400">Standart</span>
                          )}
                        </div>
                      </td>

                      {/* Prices */}
                      <td className="px-5 py-4 text-right font-mono">
                        <div className="text-slate-900 font-bold text-sm">
                          {room.adult_price.toLocaleString('tr-TR')} ₺
                          <span className="text-[10px] font-normal text-slate-500 ml-1">/ Yetişkin</span>
                        </div>
                        <div className="text-slate-500 text-[11px]">
                          {room.child_price.toLocaleString('tr-TR')} ₺
                          <span className="text-[10px] font-normal text-slate-400 ml-1">/ Çocuk</span>
                        </div>
                      </td>

                      {/* Stock with quick buttons */}
                      <td className="px-5 py-4 text-center">
                        <div className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg p-1">
                          <button
                            onClick={() => handleQuickStockChange(room.id, -1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                            title="Stoğu 1 azalt"
                          >
                            -
                          </button>
                          <span
                            className={`font-mono font-bold text-xs px-1 ${
                              room.stock === 0
                                ? 'text-rose-600'
                                : room.stock <= 3
                                ? 'text-amber-600'
                                : 'text-slate-800'
                            }`}
                          >
                            {room.stock}
                          </span>
                          <button
                            onClick={() => handleQuickStockChange(room.id, 1)}
                            className="w-6 h-6 rounded flex items-center justify-center text-slate-600 hover:bg-slate-200 text-xs font-bold"
                            title="Stoğu 1 arttır"
                          >
                            +
                          </button>
                        </div>
                        {room.stock === 0 && (
                          <div className="text-[10px] text-rose-500 font-semibold mt-1">
                            Tükendi
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(room)}
                            className="p-1.5 text-slate-500 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors"
                            title="Düzenle"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(room.id, room.room_type)}
                            className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                            title="Sil"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
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

      {/* Add / Edit Room Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <BedDouble className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingRoom ? 'Oda & Fiyat Bilgilerini Düzenle' : 'Otele Yeni Oda Tanımla'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[82vh] overflow-y-auto">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {/* Step 1: Otel Seçimi */}
              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Otel Seçimi <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.otel_id}
                  onChange={(e) => handleHotelChange(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 font-semibold"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city} - {h.district})
                    </option>
                  ))}
                </select>
              </div>

              {/* Step 2: Otelin Kayıtlı Dönem ve Pansiyon Seçimi */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Otele Ait Dönem (Sezon) <span className="text-rose-500">*</span>
                  </label>
                  {hotelSeasons.length === 0 ? (
                    <div className="text-xs text-rose-600 p-2 bg-rose-50 border border-rose-200 rounded-lg">
                      Bu otele henüz bir dönem tanımlanmamış. Lütfen önce Dönem Yönetimi ekranından dönem ekleyin.
                    </div>
                  ) : (
                    <select
                      required
                      value={formData.season_id}
                      onChange={(e) => setFormData({ ...formData, season_id: e.target.value })}
                      className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium"
                    >
                      {hotelSeasons.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.name} ({s.start_date} ~ {s.end_date})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Otele Ait Pansiyon Tipi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.pension_type}
                    onChange={(e) =>
                      setFormData({ ...formData, pension_type: e.target.value as PensionType })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-medium"
                  >
                    {hotelPensions.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Step 3: 4 Oda Tipinden Biri ve Kapasite */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Oda Tipi (4 Tip) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.room_type}
                    onChange={(e) => handleRoomTypeChange(e.target.value as RoomType)}
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden font-semibold"
                  >
                    {ROOM_TYPES.map((t) => (
                      <option key={t.id} value={t.id}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Yatak Sayısı (Kapasite) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    required
                    value={formData.bed_count}
                    onChange={(e) =>
                      setFormData({ ...formData, bed_count: parseInt(e.target.value) || 1 })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                  <span className="text-[10px] text-slate-400 block">
                    Misafir kapasitesi bu sayıya eşittir.
                  </span>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Metrekare (m²) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={500}
                    required
                    value={formData.square_meters}
                    onChange={(e) =>
                      setFormData({ ...formData, square_meters: parseInt(e.target.value) || 20 })
                    }
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Step 4: Fiyatlandırma & Stok Adedi */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Yetişkin Gecelik (₺) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={1}
                    required
                    value={formData.adult_price}
                    onChange={(e) =>
                      setFormData({ ...formData, adult_price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="1500"
                    className="w-full px-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Çocuk Gecelik (₺) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.child_price}
                    onChange={(e) =>
                      setFormData({ ...formData, child_price: parseFloat(e.target.value) || 0 })
                    }
                    placeholder="750"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg text-slate-900"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Stok Adedi (Adet) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min={0}
                    required
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                    }
                    placeholder="10"
                    className="w-full px-3 py-2 text-xs font-mono font-bold text-sky-800 bg-sky-50 border border-sky-200 rounded-lg"
                  />
                </div>
              </div>

              {/* Step 5: Oda Özellikleri Checkbox ları */}
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800">
                  Oda Özellikleri (Donanım)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.has_tv}
                      onChange={(e) => setFormData({ ...formData, has_tv: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <Tv className="w-3.5 h-3.5 text-slate-500" />
                    <span>Televizyon</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.has_minibar}
                      onChange={(e) => setFormData({ ...formData, has_minibar: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <Wine className="w-3.5 h-3.5 text-slate-500" />
                    <span>Minibar</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.has_console}
                      onChange={(e) => setFormData({ ...formData, has_console: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <Gamepad2 className="w-3.5 h-3.5 text-slate-500" />
                    <span>Oyun Konsolu</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.has_safe}
                      onChange={(e) => setFormData({ ...formData, has_safe: e.target.checked })}
                      className="rounded text-sky-600"
                    />
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    <span>Kasa</span>
                  </label>

                  <label className="flex items-center gap-2 p-2 rounded-lg border border-slate-200 text-xs cursor-pointer hover:bg-slate-50">
                    <input
                      type="checkbox"
                      checked={formData.has_projector}
                      onChange={(e) =>
                        setFormData({ ...formData, has_projector: e.target.checked })
                      }
                      className="rounded text-sky-600"
                    />
                    <Projector className="w-3.5 h-3.5 text-slate-500" />
                    <span>Projeksiyon</span>
                  </label>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
                >
                  {editingRoom ? 'Değişiklikleri Kaydet' : 'Odayı Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
