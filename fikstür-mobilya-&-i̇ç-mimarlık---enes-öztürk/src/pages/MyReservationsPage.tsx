import React from 'react';
import { useApp } from '../context/AppContext';
import { CalendarCheck, Clock, MapPin, Ban, ArrowRight, Package } from 'lucide-react';

export const MyReservationsPage: React.FC = () => {
  const { currentUser, reservations, cancelReservation, setActivePage, setSelectedFurniture, furnitures } = useApp();

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-display text-stone-900">
          Giriş Yapmanız Gerekiyor
        </h2>
        <p className="text-xs text-stone-500">
          Rezervasyonlarınızı görüntülemek ve takip etmek için lütfen üye girişi yapınız.
        </p>
        <button
          onClick={() => setActivePage('login')}
          className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
        >
          Giriş Sayfasına Git
        </button>
      </div>
    );
  }

  const myReservations = reservations.filter(r => r.userId === currentUser.id);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-amber-800">
            <span>Üye Alanı</span>
            <span aria-hidden="true">·</span>
            <span>{currentUser.name}</span>
          </div>
          <h1 className="text-3xl font-bold text-stone-900 font-display mt-1">
            Mobilya Rezervasyonlarım
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            Atölye ve showroom için oluşturduğunuz tüm rezervasyon ve teslimat talepleri
          </p>
        </div>

        <button
          onClick={() => setActivePage('furnitures')}
          className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors flex items-center gap-1.5 cursor-pointer"
        >
          <span>Yeni Mobilya Rezerve Et</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* List */}
      {myReservations.length > 0 ? (
        <div className="space-y-4">
          {myReservations.map((res) => {
            const furnitureItem = furnitures.find(f => f.id === res.furnitureId);

            return (
              <div
                key={res.id}
                className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-stone-300 transition-all"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={res.furnitureImage}
                    alt={res.furnitureName}
                    className="w-20 h-20 rounded-lg object-cover border border-stone-200 shrink-0"
                    onError={(e) => {
                      e.currentTarget.src = '/src/assets/images/hero_furniture_showcase_1793204897342.jpg';
                    }}
                  />
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono text-stone-400">#{res.id}</span>
                      <span aria-hidden="true" className="text-stone-300">·</span>
                      <span className="text-xs font-semibold text-stone-500">{res.createdAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-stone-900 font-display">
                      {res.furnitureName}
                    </h3>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
                      <span className="font-bold text-stone-900 font-mono tabular-nums">
                        {res.furniturePrice.toLocaleString('tr-TR')} ₺
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-stone-400" />
                        <span>Hedef Tarih: {res.date}</span>
                      </span>
                    </div>

                    <p className="text-xs text-stone-500 flex items-center gap-1 line-clamp-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{res.deliveryAddress}</span>
                    </p>

                    {res.notes && (
                      <p className="text-[11px] text-stone-400 italic">
                        Not: "{res.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex flex-row md:flex-col items-center md:items-end justify-between w-full md:w-auto gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-stone-100">
                  {/* Status Indicator */}
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-stone-400 block mb-0.5">
                      Rezervasyon Durumu
                    </span>
                    <span
                      className={`inline-block px-2.5 py-1 text-xs font-semibold rounded-md ${
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
                  </div>

                  <div className="flex items-center gap-2">
                    {furnitureItem && (
                      <button
                        onClick={() => setSelectedFurniture(furnitureItem)}
                        className="px-3 py-1.5 text-xs font-medium text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 rounded-lg transition-colors cursor-pointer"
                      >
                        Ürünü Gör
                      </button>
                    )}

                    {res.status === 'Beklemede' && (
                      <button
                        onClick={() => cancelReservation(res.id)}
                        className="px-3 py-1.5 text-xs font-medium text-rose-600 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                        title="Rezervasyonu İptal Et"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        <span>İptal Et</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-4">
          <Package className="w-10 h-10 text-stone-400 mx-auto" />
          <h2 className="text-lg font-bold text-stone-900 font-display">
            Henüz Bir Mobilya Rezerve Etmediniz
          </h2>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Kataloğumuzdaki el yapımı mimari mobilyaları inceleyebilir ve beğendiğiniz ürün için anında teslimat rezervasyonu oluşturabilirsiniz.
          </p>
          <button
            onClick={() => setActivePage('furnitures')}
            className="px-5 py-2.5 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Mobilya Koleksiyonunu Gez
          </button>
        </div>
      )}
    </div>
  );
};
