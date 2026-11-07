import React, { useState } from 'react';
import { Vehicle, Company, User, Reservation } from '../types/rental';
import { dbService } from '../services/storage';
import { X, Calendar, MapPin, User as UserIcon, Shield, Check, AlertTriangle, FileText } from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingModalProps {
  vehicle: Vehicle | null;
  company: Company | undefined;
  initialStartDate: string;
  initialEndDate: string;
  currentUser: User;
  onClose: () => void;
  onSuccess: (reservation: Reservation) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  vehicle,
  company,
  initialStartDate,
  initialEndDate,
  currentUser,
  onClose,
  onSuccess,
}) => {
  if (!vehicle) return null;

  const [startDate, setStartDate] = useState(initialStartDate);
  const [startTime, setStartTime] = useState('10:00');
  const [endDate, setEndDate] = useState(initialEndDate);
  const [endTime, setEndTime] = useState('10:00');
  const [pickupCity, setPickupCity] = useState(company?.city || 'İstanbul');
  const [returnCity, setReturnCity] = useState(company?.city || 'İstanbul');
  const [selectedServiceIds, setSelectedServiceIds] = useState<string[]>([]);
  const [fullName, setFullName] = useState(currentUser.fullName);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [tcNo, setTcNo] = useState(currentUser.tcNo);
  const [licenseNo, setLicenseNo] = useState(currentUser.driverLicenseNo);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Toggle extra services
  const toggleService = (srvId: string) => {
    setSelectedServiceIds((prev) =>
      prev.includes(srvId) ? prev.filter((id) => id !== srvId) : [...prev, srvId]
    );
  };

  // Live Pricing Breakdown
  const pricing = dbService.calculatePricingDetails(
    vehicle,
    startDate,
    endDate,
    selectedServiceIds
  );

  // Live Conflict Check
  const conflictCheck = dbService.checkVehicleAvailability(vehicle.id, startDate, endDate);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!startDate || !endDate) {
      setErrorMessage('Lütfen geçerli kiralama başlangıç ve bitiş tarihlerini seçiniz.');
      return;
    }

    if (startDate > endDate) {
      setErrorMessage('Bitiş tarihi başlangıç tarihinden önce olamaz.');
      return;
    }

    if (!fullName || !phone || !tcNo) {
      setErrorMessage('Lütfen kiralayan ad-soyad, telefon ve T.C. kimlik bilgilerini eksiksiz doldurunuz.');
      return;
    }

    // Final conflict check
    if (!conflictCheck.isAvailable) {
      setErrorMessage(conflictCheck.reason || 'Seçili tarihlerde araç maalesef başka kiralama ile çakışmaktadır.');
      return;
    }

    setIsSubmitting(true);

    try {
      const result = dbService.createReservation({
        vehicleId: vehicle.id,
        userId: currentUser.id,
        pickupCity,
        returnCity,
        startDate,
        startTime,
        endDate,
        endTime,
        selectedServiceIds,
        userOverrides: {
          fullName,
          email,
          phone,
          tcNo,
          licenseNo,
        },
      });

      if (!result.success || !result.reservation) {
        setErrorMessage(result.error || 'Rezervasyon oluşturulurken bir hata meydana geldi.');
        setIsSubmitting(false);
        return;
      }

      // Celebrate success with confetti
      try {
        confetti({
          particleCount: 80,
          spread: 60,
          origin: { y: 0.6 },
        });
      } catch {
        // ignore
      }

      onSuccess(result.reservation);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen sistem hatası';
      setErrorMessage(msg);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-slate-200 dark:border-slate-800 shadow-2xl">
        {/* Modal Header */}
        <div className="sticky top-0 z-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {company?.name || 'Yetkili Kiralama Firması'} · {company?.city}
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {vehicle.brand} {vehicle.model} ({vehicle.year}) Rezervasyonu
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Conflict Alert if any */}
          {!conflictCheck.isAvailable && (
            <div className="p-3.5 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 rounded-lg flex items-start gap-3 text-xs text-amber-800 dark:text-amber-300">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <strong>Tarih Çakışması Uyarısı:</strong> {conflictCheck.reason}
                <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-400">
                  Rezervasyon yapabilmek için lütfen farklı bir tarih aralığı seçiniz.
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 rounded-lg text-xs text-red-700 dark:text-red-300">
              {errorMessage}
            </div>
          )}

          {/* Section 1: Dates & Cities */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              01. Tarih ve Teslimat Noktaları
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Alış Tarihi & Saati
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={startDate}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="col-span-2 h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="h-10 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  İade Tarihi & Saati
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="col-span-2 h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                  <input
                    type="time"
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="h-10 px-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Alış Şehri
                </label>
                <input
                  type="text"
                  value={pickupCity}
                  onChange={(e) => setPickupCity(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  İade Şehri
                </label>
                <input
                  type="text"
                  value={returnCity}
                  onChange={(e) => setReturnCity(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Additional Services Defined by Company */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                02. Firmanın Tanımladığı Ek Hizmetler
              </h3>
              <span className="text-[11px] text-slate-500">Opsiyonel Seçim</span>
            </div>

            {vehicle.additionalServices && vehicle.additionalServices.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {vehicle.additionalServices.map((service) => {
                  const isChecked = selectedServiceIds.includes(service.id);
                  return (
                    <div
                      key={service.id}
                      onClick={() => toggleService(service.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition flex items-start gap-3 ${
                        isChecked
                          ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 mt-0.5 rounded flex items-center justify-center shrink-0 border ${
                          isChecked
                            ? 'bg-slate-900 border-slate-900 text-white dark:bg-white dark:text-slate-900'
                            : 'border-slate-300 dark:border-slate-600'
                        }`}
                      >
                        {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between text-xs font-semibold text-slate-900 dark:text-white">
                          <span className="truncate">{service.name}</span>
                          <span className="font-mono tabular-nums text-slate-800 dark:text-slate-200">
                            +{service.pricePerDay} ₺/gün
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-2">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-xs text-slate-500 dark:text-slate-400 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                Bu araç için firma tarafından tanımlanmış ek hizmet bulunmuyor.
              </div>
            )}
          </div>

          {/* Section 3: Customer / Driver Information */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              03. Sürücü ve İletişim Bilgileri
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  T.C. Kimlik No
                </label>
                <input
                  type="text"
                  required
                  maxLength={11}
                  value={tcNo}
                  onChange={(e) => setTcNo(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Telefon
                </label>
                <input
                  type="text"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ehliyet Belge No
                </label>
                <input
                  type="text"
                  required
                  value={licenseNo}
                  onChange={(e) => setLicenseNo(e.target.value)}
                  className="w-full h-10 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Price Breakdown & Cancellation Policy Notice */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700/80">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white mb-2">
              Fiyat Kırılımı ({pricing.days} Günlük Kiralama)
            </h4>

            <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 font-mono">
              <div className="flex justify-between">
                <span>Araç Kiralama Bedeli ({pricing.days} gün):</span>
                <span className="font-semibold text-slate-900 dark:text-white">
                  {pricing.vehicleRentalCost.toLocaleString('tr-TR')} ₺
                </span>
              </div>

              {pricing.selectedServices.map((srv) => (
                <div key={srv.id} className="flex justify-between text-slate-500">
                  <span>+ {srv.name} ({pricing.days} gün × {srv.pricePerDay} ₺):</span>
                  <span>{srv.totalPrice.toLocaleString('tr-TR')} ₺</span>
                </div>
              ))}

              <div className="pt-2 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center text-sm font-bold text-slate-900 dark:text-white">
                <span>Genel Toplam:</span>
                <span className="text-base text-slate-900 dark:text-white font-mono tabular-nums">
                  {pricing.totalCost.toLocaleString('tr-TR')} ₺
                </span>
              </div>
            </div>

            {/* Mandatory Cancellation Rule Warning */}
            <div className="mt-3 pt-3 border-t border-slate-200/80 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-1.5">
              <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
              <span>
                <strong>İptal Kuralı:</strong> Sistem politikası gereğince rezervasyonlar teslim saatine <strong>en geç 24 saat (1 gün)</strong> kalana kadar ücretsiz iptal edilebilir. Son 24 saat içinde sistem iptale izin vermez.
              </span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!conflictCheck.isAvailable || isSubmitting}
              className={`px-5 py-2.5 text-xs font-bold text-white rounded-lg transition shadow-xs ${
                conflictCheck.isAvailable && !isSubmitting
                  ? 'bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200 cursor-pointer'
                  : 'bg-slate-300 dark:bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              {isSubmitting ? 'Kaydediliyor...' : 'Rezervasyonu Onayla ve Tamamla'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
