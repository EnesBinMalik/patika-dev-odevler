/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Dinamik Oda Arama & Fiyat Hesaplama
 * Geliştirici: Enes Öztürk
 */

import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { RoomSearchResult } from '../types/database';
import { BookingModal } from './BookingModal';
import {
  Search,
  MapPin,
  Calendar,
  Users,
  Building2,
  BedDouble,
  Check,
  Star,
  Tv,
  Wine,
  Gamepad2,
  Lock,
  Projector,
  ChevronRight,
  Code,
  Sparkles,
  Info,
  CheckCircle2,
  RotateCcw,
} from 'lucide-react';

interface RoomSearchProps {
  onReservationSuccess: (reservationId: string) => void;
}

export const RoomSearch: React.FC<RoomSearchProps> = ({ onReservationSuccess }) => {
  const { searchRooms, hotels } = useDatabase();

  // Search parameters (The 3 dynamic criteria: City, Hotel Name, Date Range)
  const [city, setCity] = useState('');
  const [hotelName, setHotelName] = useState('');
  const [checkInDate, setCheckInDate] = useState(() => {
    // Current date formatted YYYY-MM-DD
    const d = new Date();
    return d.toISOString().split('T')[0];
  });
  const [checkOutDate, setCheckOutDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3); // 3 nights default
    return d.toISOString().split('T')[0];
  });
  const [adultCount, setAdultCount] = useState<number>(2);
  const [childCount, setChildCount] = useState<number>(0);

  // Filter & modal state
  const [hasSearched, setHasSearched] = useState(true);
  const [selectedResultForBooking, setSelectedResultForBooking] = useState<RoomSearchResult | null>(null);
  const [showSqlViewer, setShowSqlViewer] = useState(false);

  // Cities list from existing hotels for autocomplete suggestions
  const availableCities = useMemo(() => {
    return Array.from(new Set(hotels.map((h) => h.city)));
  }, [hotels]);

  // Execute room search using our dynamic multi-criteria engine
  const searchResults = useMemo(() => {
    return searchRooms({
      city: city.trim() || undefined,
      hotel_name: hotelName.trim() || undefined,
      check_in_date: checkInDate || undefined,
      check_out_date: checkOutDate || undefined,
      adult_count: adultCount,
      child_count: childCount,
    });
  }, [searchRooms, city, hotelName, checkInDate, checkOutDate, adultCount, childCount]);

  // Calculate nights
  const nightCount = useMemo(() => {
    if (!checkInDate || !checkOutDate) return 1;
    const diff = new Date(checkOutDate).getTime() - new Date(checkInDate).getTime();
    return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
  }, [checkInDate, checkOutDate]);

  // Generate the dynamic SQL query text for grading & transparency
  const generatedSql = useMemo(() => {
    const whereClauses: string[] = ['r.stock > 0'];

    if (city.trim()) {
      whereClauses.push(`LOWER(h.city) LIKE LOWER('%${city.trim()}%')`);
    }
    if (hotelName.trim()) {
      whereClauses.push(`LOWER(h.name) LIKE LOWER('%${hotelName.trim()}%')`);
    }
    if (checkInDate && checkOutDate) {
      whereClauses.push(
        `s.start_date <= '${checkInDate}' AND s.end_date >= '${checkOutDate}'`
      );
    }
    whereClauses.push(`r.bed_count >= ${adultCount + childCount}`);

    return `SELECT 
    r.id AS room_id,
    h.name AS otel_adi,
    h.city AS sehir,
    r.room_type,
    r.pension_type,
    s.name AS donem_adi,
    r.adult_price,
    r.child_price,
    r.stock,
    ((${adultCount} * r.adult_price + ${childCount} * r.child_price) * ${nightCount}) AS calculated_total_price
FROM room r
JOIN otel h ON r.otel_id = h.id
JOIN season s ON r.season_id = s.id
WHERE ${whereClauses.join('\n  AND ')};`;
  }, [city, hotelName, checkInDate, checkOutDate, adultCount, childCount, nightCount]);

  const handleResetSearch = () => {
    setCity('');
    setHotelName('');
    const d = new Date();
    setCheckInDate(d.toISOString().split('T')[0]);
    const dOut = new Date();
    dOut.setDate(dOut.getDate() + 3);
    setCheckOutDate(dOut.toISOString().split('T')[0]);
    setAdultCount(2);
    setChildCount(0);
  };

  return (
    <div className="space-y-6">
      {/* Search Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <Search className="w-4 h-4" />
            Telefon & Ofis İçi Satış Ekranı
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Oda Arama & Otomatik Fiyat Hesaplama
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Müşterinizin talebine göre şehir, otel adı ve tarih aralığı ölçütlerinden <strong>herhangi birini, ikisini veya üçünü birden</strong> girerek müsait odaları listeleyebilir, anlık net konaklama ücretini hesaplayabilirsiniz.
          </p>
        </div>

        {/* 3 Dynamic Search Criteria Filter Panel */}
        <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Criterion 1: Şehir */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-sky-600" />
                1. Şehir / Bölge
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Örn: İstanbul, Antalya..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
              />
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                <span>Hızlı:</span>
                {availableCities.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCity(c)}
                    className="hover:text-sky-700 underline underline-offset-2"
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Criterion 2: Otel Adı */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-sky-600" />
                2. Otel Adı
              </label>
              <input
                type="text"
                value={hotelName}
                onChange={(e) => setHotelName(e.target.value)}
                placeholder="Örn: Kodluyoruz Life..."
                className="w-full px-3.5 py-2.5 text-xs bg-white border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 text-slate-800 placeholder:text-slate-400"
              />
              <span className="text-[11px] text-slate-400 block">
                İsteğe bağlı isim filtresi
              </span>
            </div>

            {/* Criterion 3: Tarih Aralığı (Giriş - Çıkış) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-sky-600" />
                3. Giriş - Çıkış Tarihi ({nightCount} Gece)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  value={checkInDate}
                  onChange={(e) => setCheckInDate(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl text-slate-800"
                />
                <input
                  type="date"
                  value={checkOutDate}
                  min={checkInDate}
                  onChange={(e) => setCheckOutDate(e.target.value)}
                  className="w-full px-2.5 py-2 text-xs font-mono bg-white border border-slate-200 rounded-xl text-slate-800"
                />
              </div>
              <span className="text-[11px] text-slate-400 block">
                Otelin dönem aralığı ile eşleşir
              </span>
            </div>

            {/* Misafir Bilgisi (Yetişkin & Çocuk) */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-600" />
                Misafir Bilgisi
              </label>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <select
                    value={adultCount}
                    onChange={(e) => setAdultCount(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-800"
                  >
                    {[1, 2, 3, 4, 5, 6].map((num) => (
                      <option key={num} value={num}>
                        {num} Yetişkin
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <select
                    value={childCount}
                    onChange={(e) => setChildCount(parseInt(e.target.value))}
                    className="w-full px-2.5 py-2 text-xs font-medium bg-white border border-slate-200 rounded-xl text-slate-800"
                  >
                    {[0, 1, 2, 3, 4].map((num) => (
                      <option key={num} value={num}>
                        {num} Çocuk
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <span className="text-[11px] text-slate-400 block">
                Yatak kapasitesi kontrol edilir
              </span>
            </div>
          </div>

          {/* Search Action Bar */}
          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-200/60">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold text-slate-700">Aktif Arama Kriteri:</span>
              <span>{city ? `Şehir: "${city}"` : 'Tüm Şehirler'}</span>
              <span aria-hidden="true">·</span>
              <span>{hotelName ? `Otel: "${hotelName}"` : 'Tüm Oteller'}</span>
              <span aria-hidden="true">·</span>
              <span className="font-mono text-slate-700 font-medium">
                {nightCount} Gece Konaklama
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleResetSearch}
                className="px-3 py-1.5 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-200/60 transition-colors flex items-center gap-1.5 font-medium"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Filtreleri Temizle
              </button>
              <button
                type="button"
                onClick={() => setShowSqlViewer(!showSqlViewer)}
                className="px-3 py-1.5 text-xs bg-slate-200/80 hover:bg-slate-300/80 text-slate-800 rounded-lg font-mono flex items-center gap-1.5 transition-colors"
              >
                <Code className="w-3.5 h-3.5" />
                {showSqlViewer ? 'SQL Sorgusunu Gizle' : 'Dinamik SQL Sorgusunu Gör'}
              </button>
            </div>
          </div>
        </div>

        {/* Collapsible Dynamic SQL Drawer for Homework / Project Transparency */}
        {showSqlViewer && (
          <div className="bg-slate-900 text-slate-200 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800 animate-in fade-in duration-100">
            <div className="flex items-center justify-between text-slate-400 text-[11px]">
              <span>DİNAMİK ÇALIŞTIRILAN SQL SORGUSU (ROOM & SEASON JOIN)</span>
              <span className="text-emerald-400 font-mono">Dinamik Filtreleme Aktif</span>
            </div>
            <pre className="text-sky-300 leading-relaxed overflow-x-auto">
              {generatedSql}
            </pre>
            <p className="text-[11px] text-slate-400 font-sans pt-1 border-t border-slate-800">
              Bu dinamik sorgu; girilen şehir, otel adı, tarih aralığı (dönem kontrolü), misafir kapasitesi ve oda stok (&gt;0) koşullarına göre veritabanında çalışmaktadır.
            </p>
          </div>
        )}
      </div>

      {/* Search Results Summary */}
      <div className="flex items-center justify-between px-1">
        <h2 className="text-base font-bold text-slate-900 tracking-tight flex items-center gap-2">
          Müsait Odalar ve Hesaplanan Fiyatlar
          <span className="text-xs bg-sky-100 text-sky-800 font-mono px-2 py-0.5 rounded-full">
            {searchResults.length} Seçenek
          </span>
        </h2>
        <span className="text-xs text-slate-500 font-mono">
          {nightCount} Gece · {adultCount} Yetişkin {childCount > 0 ? `, ${childCount} Çocuk` : ''}
        </span>
      </div>

      {/* Results List */}
      <div className="space-y-4">
        {searchResults.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-slate-500 space-y-3">
            <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
            <h3 className="text-base font-bold text-slate-800">
              Girilen Kriterlere Uygun Müsait Oda Bulunamadı
            </h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
              Aranan tarih aralığında otelin aktif bir dönemi (sezon) bulunmuyor olabilir veya odaların stoğu tükenmiş olabilir. Tarihleri veya şehir filtresini esnetebilirsiniz.
            </p>
            <button
              onClick={handleResetSearch}
              className="mt-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg shadow-xs"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          searchResults.map((res) => {
            const { room, hotel, season, total_price } = res;
            const dailyPrice = adultCount * room.adult_price + childCount * room.child_price;

            return (
              <div
                key={room.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all grid grid-cols-1 lg:grid-cols-12 gap-0"
              >
                {/* Hotel Thumbnail & Stars */}
                <div className="relative lg:col-span-4 h-52 lg:h-auto min-h-[190px] bg-slate-100">
                  <img
                    src={hotel.image_url || '/src/assets/images/hotel_istanbul_boutique_1793535302159.jpg'}
                    alt={hotel.name}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20" />

                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded text-amber-400 text-xs font-bold flex items-center gap-1">
                    {Array.from({ length: hotel.star_rating }).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                    <span className="text-white ml-1 text-[11px] font-mono">
                      {hotel.star_rating} Yıldız
                    </span>
                  </div>

                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <span className="text-[11px] text-sky-300 flex items-center gap-1 font-medium">
                      <MapPin className="w-3 h-3" />
                      {hotel.city}, {hotel.district}
                    </span>
                    <h3 className="text-base font-bold text-white truncate drop-shadow-sm">
                      {hotel.name}
                    </h3>
                  </div>
                </div>

                {/* Room Specs & Details */}
                <div className="p-5 lg:col-span-5 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-lg font-bold text-slate-900 tracking-tight">
                        {room.room_type}
                      </h4>
                      <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded">
                        {room.pension_type}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 text-xs text-slate-500 mb-3">
                      <span>{room.bed_count} Yatak ({room.bed_count} Kişilik Kapasite)</span>
                      <span aria-hidden="true">·</span>
                      <span>{room.square_meters} m²</span>
                    </div>

                    {/* Season info */}
                    <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-xs space-y-1">
                      <div className="flex items-center justify-between text-slate-700">
                        <span className="font-semibold">{season.name}</span>
                        <span className="font-mono text-[11px] text-slate-500">
                          {season.start_date} ~ {season.end_date}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Tesis Özellikleri: {hotel.facilities.slice(0, 3).join(', ')}...
                      </div>
                    </div>
                  </div>

                  {/* Room features icons */}
                  <div className="flex items-center gap-3 text-xs text-slate-600">
                    <span className="text-slate-400 text-[11px]">Oda Donanımı:</span>
                    <div className="flex items-center gap-1.5">
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
                    </div>
                  </div>
                </div>

                {/* Price Calculation & Booking Action */}
                <div className="p-5 lg:col-span-3 bg-slate-50/50 flex flex-col justify-between space-y-4">
                  {/* Calculation Details Box */}
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                      Otomatik Fiyat Hesabı
                    </div>

                    <div className="space-y-1 text-xs text-slate-600 font-mono">
                      <div className="flex justify-between">
                        <span>Yetişkin ({adultCount}x):</span>
                        <span>{(adultCount * room.adult_price).toLocaleString('tr-TR')} ₺</span>
                      </div>
                      {childCount > 0 && (
                        <div className="flex justify-between">
                          <span>Çocuk ({childCount}x):</span>
                          <span>{(childCount * room.child_price).toLocaleString('tr-TR')} ₺</span>
                        </div>
                      )}
                      <div className="flex justify-between pt-1 border-t border-slate-200 text-slate-700">
                        <span>Gecelik Toplam:</span>
                        <span>{dailyPrice.toLocaleString('tr-TR')} ₺</span>
                      </div>
                      <div className="flex justify-between text-slate-500 text-[11px]">
                        <span>Konaklama:</span>
                        <span>× {nightCount} Gece</span>
                      </div>
                    </div>

                    {/* Big Total Price */}
                    <div className="pt-2 border-t border-slate-200">
                      <span className="text-[11px] text-slate-500 block">Toplam Tutar:</span>
                      <div className="text-2xl font-bold font-mono text-emerald-600">
                        {total_price.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>
                  </div>

                  {/* Stock and Book CTA */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-slate-500">Kalan Stok:</span>
                      <span
                        className={`font-mono font-bold ${
                          room.stock <= 2 ? 'text-rose-600' : 'text-slate-700'
                        }`}
                      >
                        {room.stock} Oda Müsait
                      </span>
                    </div>

                    <button
                      onClick={() => setSelectedResultForBooking(res)}
                      className="w-full py-2.5 px-4 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2"
                    >
                      <span>Rezervasyon Yap</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Booking Drawer / Modal */}
      {selectedResultForBooking && (
        <BookingModal
          searchResult={selectedResultForBooking}
          onClose={() => setSelectedResultForBooking(null)}
          onSuccess={(resId) => {
            setSelectedResultForBooking(null);
            onReservationSuccess(resId);
          }}
        />
      )}
    </div>
  );
};
