/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Dönem Yönetimi
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Season } from '../types/database';
import {
  CalendarDays,
  Plus,
  Building2,
  Calendar,
  Clock,
  Edit2,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  BedDouble,
  ArrowRight,
} from 'lucide-react';

interface SeasonManagementProps {
  initialHotelId?: string;
  onNavigateToRooms?: (hotelId: string) => void;
}

export const SeasonManagement: React.FC<SeasonManagementProps> = ({
  initialHotelId,
  onNavigateToRooms,
}) => {
  const { seasons, hotels, rooms, addSeason, updateSeason, deleteSeason } = useDatabase();

  const [selectedHotelFilter, setSelectedHotelFilter] = useState<string>(
    initialHotelId || 'all'
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState({
    otel_id: hotels[0]?.id || '',
    name: '',
    start_date: '',
    end_date: '',
  });

  const filteredSeasons = seasons.filter((s) => {
    return selectedHotelFilter === 'all' || s.otel_id === selectedHotelFilter;
  });

  const handleOpenAdd = () => {
    setEditingSeason(null);
    setFormData({
      otel_id: selectedHotelFilter !== 'all' ? selectedHotelFilter : hotels[0]?.id || '',
      name: '',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 180 * 86400000).toISOString().split('T')[0],
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (season: Season) => {
    setEditingSeason(season);
    setFormData({
      otel_id: season.otel_id,
      name: season.name,
      start_date: season.start_date,
      end_date: season.end_date,
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.start_date || !formData.end_date || !formData.otel_id) {
      setErrorMsg('Lütfen otel, dönem adı ve geçerli başlangıç-bitiş tarihlerini giriniz.');
      return;
    }

    if (new Date(formData.end_date) <= new Date(formData.start_date)) {
      setErrorMsg('Bitiş tarihi, başlangıç tarihinden sonraki bir tarih olmalıdır.');
      return;
    }

    if (editingSeason) {
      updateSeason(editingSeason.id, formData);
      setSuccessMsg(`"${formData.name}" dönemi güncellendi.`);
    } else {
      addSeason(formData);
      setSuccessMsg(`"${formData.name}" dönemi başarıyla oluşturuldu.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`"${name}" dönemini silmek istediğinize emin misiniz?`)) {
      const res = deleteSeason(id);
      if (!res.success) {
        alert(res.message);
      } else {
        setSuccessMsg(`"${name}" dönemi silindi.`);
        setTimeout(() => setSuccessMsg(null), 3500);
      }
    }
  };

  // Helper to calculate days between dates
  const calculateDays = (start: string, end: string) => {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <CalendarDays className="w-4 h-4" />
            Fiyatlandırma & Takvim
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dönem (Sezon) Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Otellere ait tarihsel dönemleri (Yaz, Kış, Yüksek Sezon vb.) tanımlayın. Oda fiyatlandırmaları ve müşteri rezervasyon aramaları bu dönemlere göre kontrol edilir.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Dönem Ekle
        </button>
      </div>

      {successMsg && (
        <div className="flex items-center gap-2 p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs font-medium">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* Hotel Filter Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between bg-white p-4 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          <Building2 className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-medium text-slate-600">Otel Filtresi:</span>
          <select
            value={selectedHotelFilter}
            onChange={(e) => setSelectedHotelFilter(e.target.value)}
            className="px-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 font-medium text-slate-800"
          >
            <option value="all">Tüm Oteller ({hotels.length} Otel, {seasons.length} Dönem)</option>
            {hotels.map((h) => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.city})
              </option>
            ))}
          </select>
        </div>

        <div className="text-xs text-slate-500">
          Toplam <strong>{filteredSeasons.length}</strong> dönem listeleniyor
        </div>
      </div>

      {/* Seasons Grid / List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredSeasons.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <Calendar className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            Seçilen kritere uygun dönem kaydı bulunamadı.
          </div>
        ) : (
          filteredSeasons.map((season) => {
            const hotel = hotels.find((h) => h.id === season.otel_id);
            const linkedRooms = rooms.filter((r) => r.season_id === season.id);
            const dayCount = calculateDays(season.start_date, season.end_date);

            return (
              <div
                key={season.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  {/* Hotel Reference */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-md">
                      <Building2 className="w-3.5 h-3.5" />
                      {hotel ? hotel.name : 'Bilinmeyen Otel'}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEdit(season)}
                        className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Dönemi Düzenle"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(season.id, season.name)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-50 rounded-lg transition-colors"
                        title="Dönemi Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Season Title */}
                  <h3 className="text-base font-bold text-slate-900 tracking-tight">
                    {season.name}
                  </h3>
                  <div className="text-[11px] text-slate-400 font-mono mt-0.5">
                    Dönem ID: {season.id}
                  </div>

                  {/* Date Range Box */}
                  <div className="mt-4 p-3.5 bg-slate-50 rounded-xl border border-slate-100 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Başlangıç:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {new Date(season.start_date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500 font-medium">Bitiş:</span>
                      <span className="font-mono font-semibold text-slate-800">
                        {new Date(season.end_date).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px] text-slate-600">
                      <span className="flex items-center gap-1 text-slate-500">
                        <Clock className="w-3 h-3 text-slate-400" />
                        Süre
                      </span>
                      <span className="font-bold text-indigo-700 font-mono">
                        {dayCount} Gün ({Math.round(dayCount / 30)} Ay)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Bottom stats and action */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                    <BedDouble className="w-3.5 h-3.5 text-slate-400" />
                    <span>{linkedRooms.length} Tanımlı Oda</span>
                  </div>

                  {hotel && (
                    <button
                      onClick={() => onNavigateToRooms?.(hotel.id)}
                      className="text-xs font-semibold text-sky-600 hover:text-sky-800 flex items-center gap-1 hover:underline"
                    >
                      Oda Ekle
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Season Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingSeason ? 'Dönem Bilgilerini Düzenle' : 'Yeni Sezon / Dönem Tanımla'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  İlgili Otel <span className="text-rose-500">*</span>
                </label>
                <select
                  required
                  value={formData.otel_id}
                  onChange={(e) => setFormData({ ...formData, otel_id: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 font-medium"
                >
                  {hotels.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name} ({h.city} - {h.district})
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Dönem Adı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Örn: 2026 Yaz & Yüksek Sezon, Bahar Kampanyası"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 font-semibold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Başlangıç Tarihi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Bitiş Tarihi <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/60 text-[11px] text-amber-800">
                <strong>Bilgi:</strong> Acente çalışanları oda araması yaparken, girilen giriş ve çıkış tarihleri otele ait bir dönemin sınırları içerisindeyse odalar listelenecektir.
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
                  {editingSeason ? 'Değişiklikleri Kaydet' : 'Dönemi Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
