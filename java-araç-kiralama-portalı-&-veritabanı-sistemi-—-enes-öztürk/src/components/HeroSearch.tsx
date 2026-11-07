import React from 'react';
import { SearchFilter, VehicleType } from '../types/rental';
import { CITIES } from '../data/initialData';
import { Search, Calendar, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react';

interface HeroSearchProps {
  filter: SearchFilter;
  setFilter: React.Dispatch<React.SetStateAction<SearchFilter>>;
  totalVehiclesCount: number;
  availableVehiclesCount: number;
  onReset: () => void;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filter,
  setFilter,
  totalVehiclesCount,
  availableVehiclesCount,
  onReset,
}) => {
  const vehicleTypes: (VehicleType | 'Tümü')[] = ['Tümü', 'Binek', 'Arazi', 'Ticari', 'Lüks'];

  return (
    <section className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-10">
        {/* Header Kicker & Title */}
        <div className="max-w-3xl mb-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
            Java & İlişkisel Veritabanı Destekli Rezervasyon Sistemi
          </div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white" style={{ textWrap: 'balance' }}>
            Şehir ve Tarihe Göre Çakışmasız Araç Kiralama
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            Firmalar bulundukları şehirde araç ve ek hizmetlerini tanımlar; akıllı takvim motoru tarih çakışmalarını engelleyerek anlık rezervasyon sağlar.
          </p>
        </div>

        {/* Search & Filter Form Container */}
        <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-xl border border-slate-200 dark:border-slate-700/80 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Şehir Seçimi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>Kiralama Şehri</span>
              </label>
              <select
                value={filter.city}
                onChange={(e) => setFilter((prev) => ({ ...prev, city: e.target.value }))}
                className="w-full h-11 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              >
                <option value="Tümü">Tüm Şehirler ({CITIES.length} Şehir)</option>
                {CITIES.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>

            {/* Alış Tarihi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>Alış Tarihi</span>
              </label>
              <input
                type="date"
                value={filter.startDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilter((prev) => ({
                    ...prev,
                    startDate: val,
                    endDate: val > prev.endDate ? val : prev.endDate,
                  }));
                }}
                className="w-full h-11 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              />
            </div>

            {/* İade Tarihi */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-500" />
                <span>İade Tarihi</span>
              </label>
              <input
                type="date"
                value={filter.endDate}
                min={filter.startDate}
                onChange={(e) => setFilter((prev) => ({ ...prev, endDate: e.target.value }))}
                className="w-full h-11 px-3 text-sm bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900 dark:focus:ring-white transition"
              />
            </div>

            {/* Araç Tipi & Arama Butonu */}
            <div className="flex flex-col justify-end">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Kriterleri Yenile
              </label>
              <button
                onClick={onReset}
                className="w-full h-11 px-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg inline-flex items-center justify-center gap-2 transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Filtreleri Sıfırla</span>
              </button>
            </div>
          </div>

          {/* Segmented Vehicle Type Controls */}
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-xs font-medium text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" />
                <span>Araç Tipi:</span>
              </span>
              {vehicleTypes.map((type) => {
                const isActive = filter.type === type;
                return (
                  <button
                    key={type}
                    onClick={() => setFilter((prev) => ({ ...prev, type }))}
                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition cursor-pointer whitespace-nowrap ${
                      isActive
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                        : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
                    }`}
                  >
                    {type === 'Tümü' ? 'Tüm Tipler' : type}
                  </button>
                );
              })}
            </div>

            {/* Availability Indicator & Statistics */}
            <div className="text-xs text-slate-500 dark:text-slate-400 font-mono tabular-nums flex items-center gap-2">
              <span>Müsait Araçlar:</span>
              <strong className="text-slate-900 dark:text-white font-bold text-sm">
                {availableVehiclesCount}
              </strong>
              <span>/</span>
              <span>Toplam: {totalVehiclesCount}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
