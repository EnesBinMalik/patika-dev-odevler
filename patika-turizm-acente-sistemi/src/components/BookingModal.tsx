/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Rezervasyon Tamamlama Modalı
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { RoomSearchResult, GuestDetail } from '../types/database';
import {
  X,
  CheckCircle2,
  AlertCircle,
  Building2,
  Calendar,
  Users,
  CreditCard,
  BedDouble,
  ShieldCheck,
  User,
  Phone,
  Mail,
  FileCheck,
} from 'lucide-react';

interface BookingModalProps {
  searchResult: RoomSearchResult;
  onClose: () => void;
  onSuccess: (reservationId: string) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  searchResult,
  onClose,
  onSuccess,
}) => {
  const { createReservation, currentUser } = useDatabase();
  const { room, hotel, season, night_count, adult_count, child_count, total_price, check_in_date, check_out_date } = searchResult;

  // Primary customer contact info
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerIdentity, setCustomerIdentity] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Initialize individual guest details
  const [guests, setGuests] = useState<GuestDetail[]>(() => {
    const list: GuestDetail[] = [];
    // Adults
    for (let i = 0; i < adult_count; i++) {
      list.push({
        first_name: '',
        last_name: '',
        identity_no: '',
        is_child: false,
      });
    }
    // Children
    for (let i = 0; i < child_count; i++) {
      list.push({
        first_name: '',
        last_name: '',
        identity_no: '',
        is_child: true,
        age: 6,
      });
    }
    return list;
  });

  const handleGuestChange = (index: number, field: keyof GuestDetail, value: any) => {
    setGuests((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!customerName.trim() || !customerPhone.trim() || !customerIdentity.trim()) {
      setErrorMsg('Lütfen rezervasyon yaptıran müşterinin Ad-Soyad, Telefon ve T.C. Kimlik / Pasaport bilgilerini giriniz.');
      return;
    }

    // Verify first guest auto-fills if empty
    const preparedGuests = guests.map((g, idx) => {
      if (idx === 0 && !g.first_name && !g.last_name) {
        const parts = customerName.trim().split(' ');
        const first = parts.slice(0, -1).join(' ') || parts[0];
        const last = parts.length > 1 ? parts[parts.length - 1] : '';
        return {
          ...g,
          first_name: first,
          last_name: last,
          identity_no: customerIdentity.trim(),
        };
      }
      return g;
    });

    const res = createReservation({
      room_id: room.id,
      otel_id: hotel.id,
      season_id: season.id,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      customer_email: customerEmail.trim() || 'iletisim@musteri.com',
      customer_identity: customerIdentity.trim(),
      check_in_date,
      check_out_date,
      night_count,
      adult_count,
      child_count,
      total_price,
      pension_type: room.pension_type,
      room_type: room.room_type,
      guests: preparedGuests,
      notes,
      created_by: currentUser?.username || 'personel',
    });

    if (!res.success || !res.reservation) {
      setErrorMsg(res.error || 'Rezervasyon oluşturulurken bir hata oluştu.');
      return;
    }

    onSuccess(res.reservation.id);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 my-6 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/70">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-sky-600">
              Telefon / Yüz Yüze Satış İşlemi
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Müşteri Rezervasyonunu Tamamla
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[82vh] overflow-y-auto">
          {errorMsg && (
            <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Booking Summary Box */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white rounded-xl p-4.5 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-700/80 pb-3">
              <div>
                <span className="text-[11px] text-sky-300 font-medium">Seçilen Tesis</span>
                <h3 className="text-base font-bold tracking-tight text-white flex items-center gap-2">
                  <Building2 className="w-4 h-4 text-sky-400" />
                  {hotel.name}
                  <span className="text-xs text-amber-400 font-mono font-normal">
                    ({hotel.star_rating} Yıldız)
                  </span>
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {hotel.city}, {hotel.district}
                </p>
              </div>

              <div className="text-right sm:text-right">
                <span className="text-[11px] text-slate-400">Toplam Konaklama Ücreti</span>
                <div className="text-2xl font-bold font-mono text-emerald-400">
                  {total_price.toLocaleString('tr-TR')} ₺
                </div>
                <span className="text-[10px] text-slate-400">
                  {night_count} Gece · {adult_count} Yetişkin {child_count > 0 ? `, ${child_count} Çocuk` : ''}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-200">
              <div>
                <span className="text-slate-400 text-[10px] block">Oda Tipi</span>
                <span className="font-semibold text-white">{room.room_type}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Pansiyon</span>
                <span className="font-semibold text-sky-300">{room.pension_type}</span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Giriş - Çıkış</span>
                <span className="font-mono text-white font-medium">
                  {new Date(check_in_date).toLocaleDateString('tr-TR')} ~ {new Date(check_out_date).toLocaleDateString('tr-TR')}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block">Mevcut Stok</span>
                <span className="font-mono font-bold text-amber-400">
                  {room.stock} Oda (Onaylandığında -1 azalacak)
                </span>
              </div>
            </div>
          </div>

          {/* Section 1: Customer Contact Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              <User className="w-4 h-4 text-sky-600" />
              1. İletişim & Rezervasyon Sahibi Bilgileri
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Müşteri Adı Soyadı <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Örn: Mehmet Özkan"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 font-medium"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  T.C. Kimlik No / Pasaport No <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={customerIdentity}
                  onChange={(e) => setCustomerIdentity(e.target.value)}
                  placeholder="Örn: 12345678901"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Telefon Numarası <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  required
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  placeholder="0532 111 22 33"
                  className="w-full px-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700">
                  E-Posta Adresi
                </label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  placeholder="musteri@ornek.com"
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Individual Guest Details */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-sky-600" />
                2. Misafir Kimlik Bilgileri ({adult_count} Yetişkin{child_count > 0 ? `, ${child_count} Çocuk` : ''})
              </div>
              <span className="text-[11px] font-normal text-slate-500 lowercase">
                konaklayacak tüm misafirler
              </span>
            </div>

            <div className="space-y-3">
              {guests.map((guest, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-800">
                      {idx + 1}. Misafir ({guest.is_child ? 'Çocuk' : 'Yetişkin'})
                    </span>
                    {idx === 0 && (
                      <span className="text-[10px] text-sky-600 bg-sky-50 px-2 py-0.5 rounded font-medium">
                        Asıl İletişim Sahibi
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <input
                      type="text"
                      placeholder={idx === 0 && customerName ? customerName.split(' ')[0] : 'Adı'}
                      value={guest.first_name}
                      onChange={(e) => handleGuestChange(idx, 'first_name', e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder={idx === 0 && customerName ? customerName.split(' ').slice(1).join(' ') : 'Soyadı'}
                      value={guest.last_name}
                      onChange={(e) => handleGuestChange(idx, 'last_name', e.target.value)}
                      className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-lg"
                    />
                    <input
                      type="text"
                      placeholder={idx === 0 && customerIdentity ? customerIdentity : 'T.C. / Pasaport No'}
                      value={guest.identity_no}
                      onChange={(e) => handleGuestChange(idx, 'identity_no', e.target.value)}
                      className="px-2.5 py-1.5 text-xs font-mono bg-white border border-slate-200 rounded-lg"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Section 3: Notes & Special Requests */}
          <div className="space-y-1.5">
            <label className="block text-xs font-semibold text-slate-700">
              Özel Notlar veya Misafir Talepleri
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: Sessiz oda talebi, bebek yatağı isteniyor, balayı çifti..."
              className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-hidden focus:ring-2 focus:ring-sky-500/20"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
            <div className="text-xs text-slate-500">
              Yetkili Temsilci: <strong>{currentUser?.full_name || 'Personel'}</strong>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-xs font-medium text-slate-600 hover:text-slate-900 rounded-xl hover:bg-slate-100 transition-colors"
              >
                Vazgeç
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors flex items-center gap-2"
              >
                <FileCheck className="w-4 h-4" />
                Rezervasyonu Tamamla ({total_price.toLocaleString('tr-TR')} ₺)
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
