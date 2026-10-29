import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CalendarCheck, CheckCircle2 } from 'lucide-react';

export const ReservationModal: React.FC = () => {
  const { reservingFurniture, setReservingFurniture, currentUser, createReservation, setActivePage } = useApp();

  const [address, setAddress] = useState(currentUser?.city || '');
  const [date, setDate] = useState(() => {
    const nextWeek = new Date();
    nextWeek.setDate(nextWeek.getDate() + 7);
    return nextWeek.toISOString().split('T')[0];
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!reservingFurniture) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!address.trim()) {
      setError('Lütfen teslimat veya irtibat adresini belirtiniz.');
      return;
    }
    if (!date) {
      setError('Lütfen tercih edilen rezervasyon / teslim tarihini seçiniz.');
      return;
    }

    setIsSubmitting(true);
    const res = createReservation(reservingFurniture.id, address, date, notes);
    setIsSubmitting(false);

    if (res.success) {
      setReservingFurniture(null);
      if (currentUser?.role === 'member') {
        setActivePage('my-reservations');
      }
    } else {
      setError(res.message);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-2">
            <CalendarCheck className="w-5 h-5 text-stone-900" />
            <h2 className="text-base font-bold text-stone-900 font-display">
              Mobilya Rezervasyonu
            </h2>
          </div>
          <button
            onClick={() => setReservingFurniture(null)}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Selected Product Banner */}
        <div className="p-4 bg-stone-100/70 border-b border-stone-200 flex items-center gap-3">
          <img
            src={reservingFurniture.image}
            alt={reservingFurniture.name}
            className="w-14 h-14 rounded-lg object-cover border border-stone-200 shrink-0"
          />
          <div className="min-w-0 flex-1">
            <span className="block text-[10px] font-semibold uppercase tracking-wider text-stone-500">
              {reservingFurniture.category}
            </span>
            <h3 className="text-sm font-bold text-stone-900 truncate">
              {reservingFurniture.name}
            </h3>
            <span className="text-xs font-semibold text-stone-800 font-mono tabular-nums">
              {reservingFurniture.price.toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
              {error}
            </div>
          )}

          <div>
            <label className="block font-semibold text-stone-700 mb-1">
              Rezervasyon Sahibi
            </label>
            <div className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 text-stone-800 flex justify-between">
              <span>{currentUser?.name}</span>
              <span className="text-stone-500">{currentUser?.email}</span>
            </div>
          </div>

          <div>
            <label htmlFor="res-date" className="block font-semibold text-stone-700 mb-1">
              Tercih Edilen Teslim / Rezervasyon Tarihi *
            </label>
            <input
              id="res-date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            />
            <p className="text-[11px] text-stone-400 mt-1">
              Atölye üretim ve kalite kontrol hazırlığı için en erken 3 iş günü sonrası seçilebilir.
            </p>
          </div>

          <div>
            <label htmlFor="res-address" className="block font-semibold text-stone-700 mb-1">
              Teslimat / Sevkiyat Adresi *
            </label>
            <textarea
              id="res-address"
              rows={3}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Mahalle, sokak, bina ve daire no, ilçe/şehir..."
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
              required
            />
          </div>

          <div>
            <label htmlFor="res-notes" className="block font-semibold text-stone-700 mb-1">
              Özel Notlar veya İç Mimari Talepler (Opsiyonel)
            </label>
            <input
              id="res-notes"
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Örn: 3. kat asansör mevcut, kumaş tonu açık krem olsun..."
              className="w-full p-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
          </div>

          <div className="p-3 rounded-lg bg-stone-50 border border-stone-200/80 text-[11px] text-stone-500 space-y-1">
            <p className="font-semibold text-stone-700">Rezervasyon Prosedürü (SmartEdu Mantığı):</p>
            <p>1. Talebiniz anında sisteme kaydedilir ve yönetici onayına sunulur.</p>
            <p>2. "Rezervasyonlarım" sekmesinden sipariş durumunuzu dilediğiniz an takip edebilirsiniz.</p>
          </div>

          <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-100">
            <button
              type="button"
              onClick={() => setReservingFurniture(null)}
              className="px-4 py-2 font-medium text-stone-600 hover:text-stone-900 cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2.5 font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs cursor-pointer flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Kaydediliyor...' : 'Rezervasyonu Tamamla'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
