import React, { useState } from 'react';
import { Reservation, User } from '../types/rental';
import { dbService } from '../services/storage';
import { Calendar, Clock, MapPin, AlertCircle, CheckCircle, XCircle, ShieldAlert, FileText } from 'lucide-react';

interface UserReservationsProps {
  currentUser: User;
  onRefreshData: () => void;
  onExploreVehicles: () => void;
}

export const UserReservations: React.FC<UserReservationsProps> = ({
  currentUser,
  onRefreshData,
  onExploreVehicles,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'cancelled'>('all');
  const [cancelModalReservation, setCancelModalReservation] = useState<Reservation | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [feedback, setFeedback] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const reservations = dbService.getReservationsByUser(currentUser.id);

  const filteredReservations = reservations.filter((r) => {
    if (filterMode === 'active') return r.status === 'ONAYLANDI';
    if (filterMode === 'cancelled') return r.status === 'İPTAL EDİLDİ';
    return true;
  });

  const handleConfirmCancel = () => {
    if (!cancelModalReservation) return;

    const res = dbService.cancelReservation(cancelModalReservation.id, cancelReason);
    if (res.success) {
      setFeedback({ text: res.message, type: 'success' });
      setCancelModalReservation(null);
      setCancelReason('');
      onRefreshData();
    } else {
      setFeedback({ text: res.message, type: 'error' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header & Rule Callout */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-1">
            Müşteri Rezervasyon Yönetimi
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Rezervasyonlarım ({reservations.length})
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Giriş Yapan Kullanıcı: <strong>{currentUser.fullName}</strong> ({currentUser.email})
          </p>
        </div>

        {/* 1 Day Early Cancellation Rule Banner */}
        <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/80 rounded-xl p-3.5 max-w-md text-xs text-amber-900 dark:text-amber-200 flex items-start gap-2.5">
          <ShieldAlert className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <strong>İptal Politikası Kuralı:</strong> Rezervasyon başlangıç tarihine ve saatine en az{' '}
            <strong>24 saat (1 tam gün)</strong> kala iptal işlemi yapılabilir. Kalan süre 24 saatten az ise iptal kabul edilmez.
          </div>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`mb-6 p-4 rounded-xl border flex items-center justify-between text-xs font-medium ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800'
              : 'bg-red-50 text-red-800 border-red-200 dark:bg-red-950/40 dark:text-red-300 dark:border-red-800'
          }`}
        >
          <span>{feedback.text}</span>
          <button onClick={() => setFeedback(null)} className="text-slate-500 hover:text-slate-900">
            Kapat
          </button>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 mb-6">
        <button
          onClick={() => setFilterMode('all')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
            filterMode === 'all'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Tüm Rezervasyonlar ({reservations.length})
        </button>
        <button
          onClick={() => setFilterMode('active')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
            filterMode === 'active'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          Aktif Onaylılar ({reservations.filter((r) => r.status === 'ONAYLANDI').length})
        </button>
        <button
          onClick={() => setFilterMode('cancelled')}
          className={`px-3 py-1.5 text-xs font-medium rounded-lg transition ${
            filterMode === 'cancelled'
              ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
              : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
          }`}
        >
          İptal Edilenler ({reservations.filter((r) => r.status === 'İPTAL EDİLDİ').length})
        </button>
      </div>

      {/* Reservations List */}
      {filteredReservations.length === 0 ? (
        <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
          <Calendar className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">Kayıtlı Rezervasyon Bulunamadı</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
            Seçtiğiniz filtreye uygun rezervasyon bulunmuyor. Şehir ve tarihlerinize göre hemen uygun bir araç kiralayabilirsiniz.
          </p>
          <button
            onClick={onExploreVehicles}
            className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-md"
          >
            Araçları İncele
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredReservations.map((rez) => {
            const vehicle = dbService.getVehicleById(rez.vehicleId);
            const company = dbService.getCompanyById(rez.companyId);
            const cancelEligibility = dbService.canCancelReservation(rez);

            return (
              <div
                key={rez.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-5 shadow-xs transition hover:border-slate-300 dark:hover:border-slate-700"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left: Vehicle & Company info */}
                  <div className="flex items-start gap-4">
                    {vehicle && (
                      <div className="w-24 h-20 rounded-lg overflow-hidden bg-slate-100 shrink-0 hidden sm:block">
                        <img
                          src={vehicle.image}
                          alt={vehicle.model}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-mono font-bold text-sm text-slate-900 dark:text-white">
                          {rez.reservationCode}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            rez.status === 'ONAYLANDI'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-red-50 text-red-700 dark:bg-red-950/60 dark:text-red-300'
                          }`}
                        >
                          {rez.status}
                        </span>
                        <span className="text-[11px] text-slate-400">· {rez.createdAt}</span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        {vehicle ? `${vehicle.brand} ${vehicle.model} (${vehicle.year})` : 'Araç Bilgisi'}
                      </h4>

                      <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                        <span>Firma: {company?.name || 'Yetkili Firma'}</span>
                        <span>·</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {rez.pickupCity} → {rez.returnCity}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: Dates & Service Details */}
                  <div className="text-xs text-slate-600 dark:text-slate-300 space-y-1">
                    <div className="font-semibold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span className="font-mono">
                        {rez.startDate} ({rez.startTime}) — {rez.endDate} ({rez.endTime})
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">
                      Süre: <strong className="font-mono">{rez.days} Gün</strong> · Günlük:{' '}
                      <strong className="font-mono">{rez.dailyPrice.toLocaleString('tr-TR')} ₺</strong>
                    </div>

                    {rez.selectedServices.length > 0 && (
                      <div className="text-[11px] text-slate-500">
                        Ek Hizmetler:{' '}
                        {rez.selectedServices.map((s) => `${s.name} (+${s.totalPrice} ₺)`).join(', ')}
                      </div>
                    )}
                  </div>

                  {/* Right: Price & Cancellation Action */}
                  <div className="flex lg:flex-col items-center lg:items-end justify-between gap-3 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 dark:border-slate-800">
                    <div className="text-right">
                      <div className="text-[11px] text-slate-400">Toplam Tutar</div>
                      <div className="text-base font-bold text-slate-900 dark:text-white font-mono tabular-nums">
                        {rez.totalCost.toLocaleString('tr-TR')} ₺
                      </div>
                    </div>

                    {/* Cancellation Button & Status */}
                    {rez.status === 'ONAYLANDI' ? (
                      <div>
                        {cancelEligibility.canCancel ? (
                          <button
                            onClick={() => setCancelModalReservation(rez)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/60 rounded-md transition"
                          >
                            Rezervasyonu İptal Et
                          </button>
                        ) : (
                          <div className="text-right">
                            <button
                              disabled
                              className="px-3 py-1.5 text-xs font-semibold text-slate-400 bg-slate-100 dark:bg-slate-800 rounded-md cursor-not-allowed"
                              title={cancelEligibility.reason}
                            >
                              İptal Edilemez
                            </button>
                            <div className="text-[10px] text-red-500 max-w-[190px] mt-1 leading-tight">
                              24 saatten az süre kaldı (Kural engeli)
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-xs text-slate-400">
                        İptal edildi {rez.cancelledAt && `(${rez.cancelledAt})`}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cancellation Confirmation Modal */}
      {cancelModalReservation && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 border border-slate-200 dark:border-slate-800 shadow-2xl">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2">
              Rezervasyonu İptal Etmek İstiyor Musunuz?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              <strong>{cancelModalReservation.reservationCode}</strong> numaralı rezervasyonunuz iptal edilecek ve araç takvimi yeniden diğer müşteriler için açılacaktır.
            </p>

            <div className="mb-4">
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                İptal Nedeni (Opsiyonel)
              </label>
              <textarea
                rows={2}
                placeholder="Örn: Seyahat planı değişikliği..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
              />
            </div>

            <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-lg text-[11px] text-emerald-800 dark:text-emerald-300 mb-4">
              ✓ Kural Doğrulandı: Teslimat tarihine 24 saatten fazla süre olduğu için iptal hakkınız bulunmaktadır.
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setCancelModalReservation(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400"
              >
                Vazgeç
              </button>
              <button
                type="button"
                onClick={handleConfirmCancel}
                className="px-4 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
              >
                İptali Onayla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
