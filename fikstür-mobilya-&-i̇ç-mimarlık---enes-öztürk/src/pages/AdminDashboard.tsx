import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Furniture, Category, ReservationStatus } from '../types';
import {
  Shield,
  Plus,
  Edit3,
  Trash2,
  CalendarCheck,
  Mail,
  Box,
  Layers,
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  X,
  ExternalLink
} from 'lucide-react';

interface AdminDashboardProps {
  onOpenAddModal: () => void;
  onEditFurniture: (f: Furniture) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onOpenAddModal, onEditFurniture }) => {
  const {
    furnitures,
    reservations,
    messages,
    currentUser,
    setActivePage,
    deleteFurniture,
    updateReservationStatus,
    markMessageRead,
    deleteMessage
  } = useApp();

  const [activeTab, setActiveTab] = useState<'furnitures' | 'reservations' | 'messages'>('furnitures');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('all');

  // Verify Admin Access
  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <Shield className="w-12 h-12 text-amber-700 mx-auto" />
        <h2 className="text-xl font-bold font-display text-stone-900">
          Yetkisiz Erişim / Yönetici Paneli
        </h2>
        <p className="text-xs text-stone-500">
          Bu alanı görüntülemek için Yönetici (Admin) yetkisine sahip olmalısınız.
        </p>
        <button
          onClick={() => setActivePage('login')}
          className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Yönetici Girişi Yap
        </button>
      </div>
    );
  }

  // Metrics
  const totalFurnitures = furnitures.length;
  const pendingReservations = reservations.filter(r => r.status === 'Beklemede').length;
  const totalReservations = reservations.length;
  const unreadMessages = messages.filter(m => !m.isRead).length;

  // Filtered furnitures
  const filteredFurnitures = furnitures.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    f.material.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtered reservations
  const filteredReservations = reservations.filter(r => {
    if (selectedStatusFilter === 'all') return true;
    return r.status === selectedStatusFilter;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <Shield className="w-4 h-4 text-amber-700" />
            <span>Yönetici Kontrol Masası</span>
            <span aria-hidden="true">·</span>
            <span>Enes Öztürk</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 font-display mt-1">
            Fikstür Atölye ve Sipariş Yönetimi
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            SmartEdu mimarisinde tam yetkili CRUD (Ekle/Düzenle/Sil), rezervasyon onayı ve gelen talepler
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onOpenAddModal}
            className="px-4 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors shadow-xs cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Mobilya Ekle</span>
          </button>
        </div>
      </div>

      {/* KPI Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase text-stone-400">Katalogdaki Mobilya</span>
          <p className="text-2xl font-bold text-stone-900 font-mono tabular-nums">{totalFurnitures}</p>
          <span className="text-[11px] text-stone-500">CRUD aktif</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase text-stone-400">Onay Bekleyen Rezervasyon</span>
          <p className={`text-2xl font-bold font-mono tabular-nums ${pendingReservations > 0 ? 'text-amber-700' : 'text-stone-900'}`}>
            {pendingReservations}
          </p>
          <span className="text-[11px] text-stone-500">Toplam {totalReservations} rezervasyon</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase text-stone-400">Gelen Mesajlar</span>
          <p className={`text-2xl font-bold font-mono tabular-nums ${unreadMessages > 0 ? 'text-blue-700' : 'text-stone-900'}`}>
            {messages.length}
          </p>
          <span className="text-[11px] text-stone-500">{unreadMessages} okunmamış talep</span>
        </div>

        <div className="p-4 bg-white rounded-xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-semibold uppercase text-stone-400">Atölye Durumu</span>
          <p className="text-sm font-bold text-emerald-800 font-display pt-1">Aktif & Siparişe Açık</p>
          <span className="text-[11px] text-stone-500">Moda, Kadıköy Stüdyo</span>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200">
        <button
          onClick={() => setActiveTab('furnitures')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'furnitures'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Box className="w-4 h-4" />
          <span>Mobilya CRUD Masası ({furnitures.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('reservations')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'reservations'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Rezervasyon Talepleri ({reservations.length})</span>
          {pendingReservations > 0 && (
            <span className="bg-amber-100 text-amber-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {pendingReservations}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('messages')}
          className={`px-4 py-2.5 text-xs font-semibold flex items-center gap-2 border-b-2 transition-colors cursor-pointer ${
            activeTab === 'messages'
              ? 'border-stone-900 text-stone-900'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Mail className="w-4 h-4" />
          <span>Gelen İletişim Mesajları ({messages.length})</span>
          {unreadMessages > 0 && (
            <span className="bg-blue-100 text-blue-900 text-[10px] font-bold px-1.5 py-0.2 rounded-full font-mono">
              {unreadMessages}
            </span>
          )}
        </button>
      </div>

      {/* TAB 1: FURNITURES CRUD */}
      {activeTab === 'furnitures' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Mobilya adı, malzeme veya kategori ara..."
                className="w-full pl-9 pr-3 py-1.5 text-xs rounded-lg border border-stone-300 focus:outline-none focus:ring-1 focus:ring-stone-900"
              />
            </div>
            <button
              onClick={onOpenAddModal}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-stone-900 hover:bg-stone-800 rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Ürün Ekle</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Ürün</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Fiyat</th>
                    <th className="px-4 py-3">Malzeme & Ölçü</th>
                    <th className="px-4 py-3">Stok</th>
                    <th className="px-4 py-3 text-right">İşlemler (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredFurnitures.map((f) => (
                    <tr key={f.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={f.image}
                          alt={f.name}
                          className="w-12 h-12 rounded-lg object-cover border border-stone-200 shrink-0"
                          onError={(e) => {
                            e.currentTarget.src = '/src/assets/images/hero_furniture_showcase_1793204897342.jpg';
                          }}
                        />
                        <div>
                          <p className="font-bold text-stone-900 font-display">{f.name}</p>
                          <p className="text-[11px] text-stone-400">ID: {f.id}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-stone-700 font-medium">{f.category}</span>
                      </td>
                      <td className="px-4 py-3 font-bold font-mono tabular-nums text-stone-900">
                        {f.price.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="px-4 py-3 text-stone-500">
                        <p>{f.material}</p>
                        <p className="text-[11px] text-stone-400">{f.dimensions}</p>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`font-mono font-semibold ${f.stock > 0 ? 'text-stone-800' : 'text-rose-600'}`}>
                          {f.stock} Adet
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => onEditFurniture(f)}
                            className="p-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-md transition-colors cursor-pointer"
                            title="Düzenle"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => {
                              if (window.confirm(`"${f.name}" mobilyasını katalogdan silmek istediğinize emin misiniz?`)) {
                                deleteFurniture(f.id);
                              }
                            }}
                            className="p-1.5 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-md transition-colors cursor-pointer"
                            title="Sil"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESERVATIONS MANAGER */}
      {activeTab === 'reservations' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500 font-semibold">Durum Filtresi:</span>
              <select
                value={selectedStatusFilter}
                onChange={(e) => setSelectedStatusFilter(e.target.value)}
                className="bg-stone-50 border border-stone-300 rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="Beklemede">Beklemede</option>
                <option value="Onaylandı">Onaylandı</option>
                <option value="Hazırlanıyor">Hazırlanıyor</option>
                <option value="Tamamlandı">Tamamlandı</option>
                <option value="İptal Edildi">İptal Edildi</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="px-4 py-3">Rezervasyon No & Tarih</th>
                    <th className="px-4 py-3">Mobilya</th>
                    <th className="px-4 py-3">Üye / Müşteri Bilgisi</th>
                    <th className="px-4 py-3">Adres & Not</th>
                    <th className="px-4 py-3">Durum</th>
                    <th className="px-4 py-3 text-right">Durum Güncelle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredReservations.map((res) => (
                    <tr key={res.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-mono font-semibold text-stone-900 block">{res.id}</span>
                        <span className="text-[11px] text-stone-400">Kayıt: {res.createdAt}</span>
                        <span className="text-[11px] text-amber-800 block font-medium">Hedef: {res.date}</span>
                      </td>
                      <td className="px-4 py-3 flex items-center gap-2.5">
                        <img
                          src={res.furnitureImage}
                          alt={res.furnitureName}
                          className="w-10 h-10 rounded-md object-cover border border-stone-200 shrink-0"
                        />
                        <div>
                          <p className="font-bold text-stone-900 font-display">{res.furnitureName}</p>
                          <p className="font-mono text-[11px] text-stone-600 tabular-nums">
                            {res.furniturePrice.toLocaleString('tr-TR')} ₺
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-semibold text-stone-900">{res.userName}</p>
                        <p className="text-[11px] text-stone-500">{res.userEmail}</p>
                        <p className="text-[11px] text-stone-500">{res.userPhone}</p>
                      </td>
                      <td className="px-4 py-3 max-w-xs text-stone-600">
                        <p className="line-clamp-2">{res.deliveryAddress}</p>
                        {res.notes && (
                          <p className="text-[11px] text-stone-400 italic mt-0.5">
                            Not: "{res.notes}"
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 text-[11px] font-semibold rounded-md ${
                            res.status === 'Onaylandı'
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : res.status === 'Hazırlanıyor'
                              ? 'bg-blue-50 text-blue-800 border border-blue-200'
                              : res.status === 'Tamamlandı'
                              ? 'bg-stone-100 text-stone-800 border border-stone-300'
                              : res.status === 'İptal Edildi'
                              ? 'bg-rose-50 text-rose-800 border border-rose-200'
                              : 'bg-amber-50 text-amber-900 border border-amber-200'
                          }`}
                        >
                          {res.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <select
                          value={res.status}
                          onChange={(e) => updateReservationStatus(res.id, e.target.value as ReservationStatus)}
                          className="bg-stone-50 border border-stone-300 rounded-md px-2 py-1 text-xs text-stone-800 focus:outline-none cursor-pointer"
                        >
                          <option value="Beklemede">Beklemede</option>
                          <option value="Onaylandı">Onayla</option>
                          <option value="Hazırlanıyor">Hazırlanıyor</option>
                          <option value="Tamamlandı">Tamamlandı</option>
                          <option value="İptal Edildi">İptal Et</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CONTACT INBOX */}
      {activeTab === 'messages' && (
        <div className="space-y-4">
          {messages.length > 0 ? (
            <div className="space-y-3">
              {messages.map((m) => (
                <div
                  key={m.id}
                  className={`p-5 rounded-xl border transition-all ${
                    m.isRead ? 'bg-white border-stone-200' : 'bg-amber-50/40 border-amber-200 shadow-2xs'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-stone-900">{m.name}</span>
                      <span className="text-xs text-stone-500">({m.email})</span>
                      {m.phone && <span className="text-xs text-stone-400">· {m.phone}</span>}
                    </div>

                    <div className="flex items-center gap-3 text-xs text-stone-400">
                      <span>{m.date}</span>
                      {!m.isRead && (
                        <button
                          onClick={() => markMessageRead(m.id)}
                          className="text-amber-800 hover:underline font-semibold cursor-pointer"
                        >
                          Okundu Olarak İşaretle
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(m.id)}
                        className="text-rose-500 hover:text-rose-700 cursor-pointer"
                        title="Mesajı Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-stone-900 font-display mb-1">
                      {m.subject}
                    </h3>
                    <p className="text-xs text-stone-600 leading-relaxed whitespace-pre-line">
                      {m.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-xs text-stone-500">
              Henüz gelen iletişim mesajı bulunmamaktadır.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
