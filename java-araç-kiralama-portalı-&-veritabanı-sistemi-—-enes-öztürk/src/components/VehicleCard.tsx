import React from 'react';
import { Vehicle, Company } from '../types/rental';
import { ShieldCheck, Users, Fuel, Gauge, Building2, AlertCircle, Check } from 'lucide-react';

interface VehicleCardProps {
  vehicle: Vehicle;
  company: Company | undefined;
  startDate: string;
  endDate: string;
  isAvailable: boolean;
  conflictReason?: string;
  calculatedDailyRate: number;
  ruleLabel?: string;
  onBook: (vehicle: Vehicle) => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({
  vehicle,
  company,
  startDate,
  endDate,
  isAvailable,
  conflictReason,
  calculatedDailyRate,
  ruleLabel,
  onBook,
}) => {
  return (
    <div
      className={`group bg-white dark:bg-slate-900 rounded-xl border transition-all duration-200 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md ${
        isAvailable
          ? 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
          : 'border-amber-200/80 dark:border-amber-900/40 bg-amber-50/20'
      }`}
    >
      <div>
        {/* Vehicle Image Container with Resilient Fallback */}
        <div className="relative aspect-16/9 w-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <img
            src={vehicle.image}
            alt={`${vehicle.brand} ${vehicle.model}`}
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
            onError={(e) => {
              // Graceful fallback to styled neutral image canvas
              (e.target as HTMLElement).style.display = 'none';
            }}
          />

          {/* Top subtle text markers (No pill sandwiches) */}
          <div className="absolute top-3 left-3 bg-slate-900/80 text-white text-[11px] font-medium px-2.5 py-1 rounded backdrop-blur-xs">
            {vehicle.type}
          </div>

          {company && (
            <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-900/90 text-slate-800 dark:text-slate-200 text-[11px] font-medium px-2 py-1 rounded backdrop-blur-xs flex items-center gap-1 shadow-xs">
              <Building2 className="w-3 h-3 text-slate-500" />
              <span>{company.city}</span>
            </div>
          )}
        </div>

        {/* Card Content Area */}
        <div className="p-5">
          {/* Company & City Kicker */}
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span className="font-medium text-slate-700 dark:text-slate-300">
              {company ? company.name : 'Yetkili Firma'}
            </span>
            <span className="font-mono">{vehicle.year} Model</span>
          </div>

          {/* Title */}
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
            {vehicle.brand} {vehicle.model}
          </h3>

          {/* Clean Unboxed Metadata with Typographic Separator */}
          <div className="mt-2.5 flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Gauge className="w-3 h-3 text-slate-400" />
              {vehicle.transmission}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Fuel className="w-3 h-3 text-slate-400" />
              {vehicle.fuelType}
            </span>
            <span aria-hidden="true" className="text-slate-300 dark:text-slate-600">·</span>
            <span className="flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-400" />
              {vehicle.seats} Koltuk
            </span>
          </div>

          {/* Additional Services Briefing */}
          {vehicle.additionalServices && vehicle.additionalServices.length > 0 && (
            <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
              <span className="font-medium text-slate-700 dark:text-slate-300">Tanımlı Ek Hizmetler: </span>
              {vehicle.additionalServices.map((s) => s.name).slice(0, 3).join(', ')}
              {vehicle.additionalServices.length > 3 && ` (+${vehicle.additionalServices.length - 3})`}
            </div>
          )}

          {/* Availability Status Notification */}
          <div className="mt-3.5">
            {isAvailable ? (
              <div className="text-[11px] font-medium text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5" />
                <span>{startDate} — {endDate} tarihleri arasında müsait</span>
              </div>
            ) : (
              <div className="text-[11px] font-medium text-amber-700 dark:text-amber-400 flex items-start gap-1.5 bg-amber-50 dark:bg-amber-950/40 p-2 rounded">
                <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <span>{conflictReason || 'Bu tarihlerde müsait değil (çakışma var).'}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer Strip: Price & Booking Action */}
      <div className="px-5 py-4 bg-slate-50/70 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
        <div>
          <div className="text-[11px] text-slate-500 dark:text-slate-400">
            {ruleLabel ? ruleLabel : 'Günlük Kiralama'}
          </div>
          <div className="text-lg font-bold text-slate-900 dark:text-white font-mono tabular-nums">
            {calculatedDailyRate.toLocaleString('tr-TR')} ₺
            <span className="text-xs font-normal text-slate-500 dark:text-slate-400"> / gün</span>
          </div>
        </div>

        <button
          onClick={() => onBook(vehicle)}
          disabled={!isAvailable}
          className={`px-4 py-2 text-xs font-semibold rounded-md transition whitespace-nowrap ${
            isAvailable
              ? 'bg-slate-900 text-white hover:bg-slate-800 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 shadow-xs cursor-pointer'
              : 'bg-slate-200 text-slate-400 dark:bg-slate-800 dark:text-slate-600 cursor-not-allowed'
          }`}
        >
          {isAvailable ? 'Hemen Rezerve Et' : 'Tarih Çakışması'}
        </button>
      </div>
    </div>
  );
};
