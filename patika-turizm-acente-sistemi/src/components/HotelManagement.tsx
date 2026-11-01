/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Otel Yönetimi
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import {
  Otel,
  FACILITY_TYPES,
  PENSION_TYPES,
  FacilityType,
  PensionType,
} from '../types/database';
import {
  Building2,
  Plus,
  Search,
  Star,
  MapPin,
  Phone,
  Mail,
  Calendar,
  BedDouble,
  Edit2,
  Trash2,
  X,
  Check,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

interface HotelManagementProps {
  onNavigateToSeasons?: (hotelId: string) => void;
  onNavigateToRooms?: (hotelId: string) => void;
}

export const HotelManagement: React.FC<HotelManagementProps> = ({
  onNavigateToSeasons,
  onNavigateToRooms,
}) => {
  const { hotels, addHotel, updateHotel, deleteHotel, seasons, rooms, reservations } = useDatabase();

  const [searchQuery, setSearchQuery] = useState('');
  const [cityFilter, setCityFilter] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingHotel, setEditingHotel] = useState<Otel | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Form state
  const [formData, setFormData] = useState<{
    name: string;
    city: string;
    district: string;
    address: string;
    email: string;
    phone: string;
    star_rating: number;
    facilities: FacilityType[];
    pension_types: PensionType[];
    image_url: string;
  }>({
    name: '',
    city: 'İstanbul',
    district: '',
    address: '',
    email: '',
    phone: '',
    star_rating: 5,
    facilities: ['Ücretsiz Otopark', 'Ücretsiz WiFi'],
    pension_types: ['Oda Kahvaltı', 'Yarım Pansiyon'],
    image_url: '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg',
  });

  // Unique cities for filter
  const uniqueCities = Array.from(new Set(hotels.map((h) => h.city)));

  // Filtered list
  const filteredHotels = hotels.filter((h) => {
    const matchesCity = cityFilter === 'all' || h.city === cityFilter;
    const matchesSearch =
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.district.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCity && matchesSearch;
  });

  const handleOpenAdd = () => {
    setEditingHotel(null);
    setFormData({
      name: '',
      city: 'İstanbul',
      district: '',
      address: '',
      email: '',
      phone: '',
      star_rating: 5,
      facilities: ['Ücretsiz Otopark', 'Ücretsiz WiFi', 'SPA'],
      pension_types: ['Oda Kahvaltı', 'Yarım Pansiyon'],
      image_url: '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (hotel: Otel) => {
    setEditingHotel(hotel);
    setFormData({
      name: hotel.name,
      city: hotel.city,
      district: hotel.district,
      address: hotel.address,
      email: hotel.email,
      phone: hotel.phone,
      star_rating: hotel.star_rating,
      facilities: hotel.facilities,
      pension_types: hotel.pension_types,
      image_url: hotel.image_url || '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg',
    });
    setErrorMsg(null);
    setIsModalOpen(true);
  };

  const toggleFacility = (facility: FacilityType) => {
    setFormData((prev) => {
      const exists = prev.facilities.includes(facility);
      return {
        ...prev,
        facilities: exists
          ? prev.facilities.filter((f) => f !== facility)
          : [...prev.facilities, facility],
      };
    });
  };

  const togglePension = (pension: PensionType) => {
    setFormData((prev) => {
      const exists = prev.pension_types.includes(pension);
      if (exists && prev.pension_types.length === 1) {
        return prev; // keep at least one
      }
      return {
        ...prev,
        pension_types: exists
          ? prev.pension_types.filter((p) => p !== pension)
          : [...prev.pension_types, pension],
      };
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!formData.name.trim() || !formData.city.trim() || !formData.address.trim()) {
      setErrorMsg('Lütfen otel adı, şehir ve adres alanlarını doldurunuz.');
      return;
    }

    if (formData.pension_types.length === 0) {
      setErrorMsg('Otele en az bir pansiyon tipi tanımlamalısınız.');
      return;
    }

    if (editingHotel) {
      updateHotel(editingHotel.id, formData);
      setSuccessMsg(`${formData.name} otel bilgileri güncellendi.`);
    } else {
      addHotel(formData);
      setSuccessMsg(`${formData.name} yeni otel olarak sisteme eklendi.`);
    }

    setIsModalOpen(false);
    setTimeout(() => setSuccessMsg(null), 3500);
  };

  const handleDelete = (id: string, name: string) => {
    if (window.confirm(`${name} otelini sistemden silmek istediğinize emin misiniz? Otele ait dönemler ve odalar da temizlenecektir.`)) {
      const res = deleteHotel(id);
      if (!res.success) {
        alert(res.message);
      } else {
        setSuccessMsg(`${name} oteli silindi.`);
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
            <Building2 className="w-4 h-4" />
            Acente Operasyonu
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Otel Yönetimi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Anlaşmalı otellerin konumları, yıldız derecelendirmeleri, tesis özellikleri ve pansiyon tiplerini yönetin.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-all whitespace-nowrap shrink-0"
        >
          <Plus className="w-4 h-4" />
          Yeni Otel Ekle
        </button>
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
            placeholder="Otel adı, şehir veya bölge ile filtrele..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800"
          />
        </div>

        {/* City Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto p-1 bg-slate-100 rounded-lg shrink-0">
          <button
            onClick={() => setCityFilter('all')}
            className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
              cityFilter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Tüm Şehirler ({hotels.length})
          </button>
          {uniqueCities.map((city) => (
            <button
              key={city}
              onClick={() => setCityFilter(city)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md whitespace-nowrap transition-all ${
                cityFilter === city
                  ? 'bg-white text-sky-700 shadow-xs font-semibold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {city} ({hotels.filter((h) => h.city === city).length})
            </button>
          ))}
        </div>
      </div>

      {/* Hotel Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHotels.length === 0 ? (
          <div className="col-span-full bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400">
            <Building2 className="w-10 h-10 mx-auto mb-2 text-slate-300" />
            Arama kriterine uygun otel bulunamadı.
          </div>
        ) : (
          filteredHotels.map((hotel) => {
            const hotelSeasons = seasons.filter((s) => s.otel_id === hotel.id);
            const hotelRooms = rooms.filter((r) => r.otel_id === hotel.id);
            const activeResCount = reservations.filter(
              (r) => r.otel_id === hotel.id && r.status === 'confirmed'
            ).length;

            return (
              <div
                key={hotel.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col"
              >
                {/* Image & Stars */}
                <div className="relative h-44 bg-slate-100 overflow-hidden">
                  <img
                    src={hotel.image_url || '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-black/20" />

                  {/* Stars Badge */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md px-2.5 py-1 rounded-md flex items-center gap-1 text-amber-400 text-xs font-bold">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-white ml-1 text-[11px] font-mono">
                      {hotel.star_rating} Yıldız
                    </span>
                  </div>

                  {/* City Badge */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <div className="flex items-center gap-1.5 text-xs text-sky-200 font-medium">
                      <MapPin className="w-3.5 h-3.5" />
                      <span>{hotel.city}, {hotel.district}</span>
                    </div>
                    <h3 className="text-base font-bold text-white truncate drop-shadow-sm">
                      {hotel.name}
                    </h3>
                  </div>

                  {/* Edit/Delete actions in image corner */}
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    <button
                      onClick={() => handleOpenEdit(hotel)}
                      className="p-1.5 bg-white/90 hover:bg-white text-slate-700 rounded-md backdrop-blur-md transition-all shadow-xs"
                      title="Düzenle"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(hotel.id, hotel.name)}
                      className="p-1.5 bg-white/90 hover:bg-white text-rose-600 rounded-md backdrop-blur-md transition-all shadow-xs"
                      title="Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  {/* Address and Contact */}
                  <div className="space-y-1.5 text-xs text-slate-600">
                    <p className="text-[11px] text-slate-500 line-clamp-1">{hotel.address}</p>
                    <div className="flex items-center gap-4 text-[11px] text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <Phone className="w-3 h-3 text-slate-400" />
                        {hotel.phone}
                      </span>
                      <span className="flex items-center gap-1 truncate">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {hotel.email}
                      </span>
                    </div>
                  </div>

                  {/* Pansiyon Tipleri - Clean unboxed text list */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Pansiyon Tipleri
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-xs text-slate-700">
                      {hotel.pension_types.map((p, idx) => (
                        <span key={p} className="text-slate-700 font-medium">
                          {p}
                          {idx < hotel.pension_types.length - 1 && (
                            <span className="text-slate-300 ml-2" aria-hidden="true">·</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Tesis Özellikleri */}
                  <div>
                    <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                      Tesis Özellikleri
                    </div>
                    <div className="flex flex-wrap gap-x-2 gap-y-1 text-[11px] text-slate-600">
                      {hotel.facilities.slice(0, 4).map((f, idx) => (
                        <span key={f} className="text-slate-600">
                          {f}
                          {idx < Math.min(hotel.facilities.length, 4) - 1 && (
                            <span className="text-slate-300 ml-2">·</span>
                          )}
                        </span>
                      ))}
                      {hotel.facilities.length > 4 && (
                        <span className="text-slate-400 text-[10px]">
                          +{hotel.facilities.length - 4} diğer
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Stats Counter Strip */}
                  <div className="pt-3 border-t border-slate-100 grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Dönem</div>
                      <div className="font-bold text-slate-800 font-mono text-sm">
                        {hotelSeasons.length}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Oda Tipi</div>
                      <div className="font-bold text-slate-800 font-mono text-sm">
                        {hotelRooms.length}
                      </div>
                    </div>
                    <div className="bg-slate-50 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500">Aktif Rez.</div>
                      <div className="font-bold text-emerald-700 font-mono text-sm">
                        {activeResCount}
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons to Navigate to Seasons or Rooms */}
                  <div className="pt-2 flex items-center gap-2">
                    <button
                      onClick={() => onNavigateToSeasons?.(hotel.id)}
                      className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      Dönemleri Gör
                    </button>
                    <button
                      onClick={() => onNavigateToRooms?.(hotel.id)}
                      className="flex-1 py-1.5 px-2 bg-sky-50 hover:bg-sky-100 text-sky-800 font-medium text-xs rounded-lg transition-colors flex items-center justify-center gap-1.5"
                    >
                      <BedDouble className="w-3.5 h-3.5" />
                      Odaları Yönet
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Add / Edit Hotel Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-sky-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  {editingHotel ? 'Otel Bilgilerini Düzenle' : 'Yeni Otel Tanımla'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {errorMsg && (
                <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Otel Adı <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Örn: Kodluyoruz Life İstanbul"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-semibold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Yıldız Derecesi <span className="text-rose-500">*</span>
                  </label>
                  <select
                    value={formData.star_rating}
                    onChange={(e) =>
                      setFormData({ ...formData, star_rating: parseInt(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 font-medium"
                  >
                    <option value={5}>5 Yıldızlı Otel</option>
                    <option value={4}>4 Yıldızlı Otel</option>
                    <option value={3}>3 Yıldızlı Otel</option>
                    <option value={2}>2 Yıldızlı Otel</option>
                    <option value={1}>1 Yıldızlı Butik</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Şehir <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Örn: İstanbul"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">
                    Bölge / İlçe <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.district}
                    onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    placeholder="Örn: Beyoğlu"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-semibold text-slate-700">
                  Tam Adres <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={2}
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Örn: Şahkulu, Şişhane Metro Durağı, Meşrutiyet Cd. No:125, 34421"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">E-Posta</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="info@kodluyoruz.org"
                    className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-slate-700">Telefon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0212 555 01 23"
                    className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                  />
                </div>
              </div>

              {/* Pansiyon Tipleri Seçimi */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800">
                  Pansiyon Tipleri (En az bir adet seçiniz) <span className="text-rose-500">*</span>
                </label>
                <p className="text-[11px] text-slate-500">
                  Bu otele bağlı odalar sadece burada seçilen pansiyon tiplerinde tanımlanabilir.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {PENSION_TYPES.map((pension) => {
                    const isChecked = formData.pension_types.includes(pension);
                    return (
                      <label
                        key={pension}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-sky-50 border-sky-300 text-sky-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => togglePension(pension)}
                          className="rounded text-sky-600 focus:ring-sky-500"
                        />
                        <span>{pension}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Tesis Özellikleri Seçimi */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800">
                  Tesis Özellikleri
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {FACILITY_TYPES.map((facility) => {
                    const isChecked = formData.facilities.includes(facility);
                    return (
                      <label
                        key={facility}
                        className={`flex items-center gap-2 p-2 rounded-lg border text-xs cursor-pointer transition-colors ${
                          isChecked
                            ? 'bg-emerald-50 border-emerald-300 text-emerald-900 font-medium'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => toggleFacility(facility)}
                          className="rounded text-emerald-600 focus:ring-emerald-500"
                        />
                        <span>{facility}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Image URL selection */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <label className="block text-xs font-semibold text-slate-800">
                  Otel Görseli
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'İstanbul Butik', url: '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg' },
                    { label: 'Antalya Resort', url: '/src/assets/images/hotel_antalya_resort_1793535301701.jpg' },
                    { label: 'Lüks Suite', url: '/src/assets/images/hotel_suite_interior_1793535302042.jpg' },
                  ].map((preset) => (
                    <button
                      type="button"
                      key={preset.url}
                      onClick={() => setFormData({ ...formData, image_url: preset.url })}
                      className={`relative rounded-lg overflow-hidden border-2 text-left h-20 transition-all ${
                        formData.image_url === preset.url
                          ? 'border-sky-600 ring-2 ring-sky-600/30'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                      <div className="absolute inset-x-0 bottom-0 bg-black/60 text-white text-[10px] p-1 truncate text-center">
                        {preset.label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
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
                  {editingHotel ? 'Değişiklikleri Kaydet' : 'Oteli Kaydet'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
