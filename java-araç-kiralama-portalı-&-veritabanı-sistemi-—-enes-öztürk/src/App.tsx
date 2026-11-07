/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { dbService } from './services/storage';
import { Vehicle, Company, User, Reservation, SearchFilter } from './types/rental';
import { Header } from './components/Header';
import { HeroSearch } from './components/HeroSearch';
import { VehicleCard } from './components/VehicleCard';
import { BookingModal } from './components/BookingModal';
import { CompanyDashboard } from './components/CompanyDashboard';
import { UserReservations } from './components/UserReservations';
import { DatabaseViewer } from './components/DatabaseViewer';
import { JavaCodeViewer } from './components/JavaCodeViewer';
import { UserAuthModal } from './components/UserAuthModal';
import { Footer } from './components/Footer';
import { CheckCircle2, ArrowRight, Car, Sparkles, AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'search' | 'company' | 'reservations' | 'database' | 'java'>('search');
  const [companies, setCompanies] = useState<Company[]>([]);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [currentUser, setCurrentUser] = useState<User>(dbService.getCurrentUser());
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [activeCompanyId, setActiveCompanyId] = useState<string>('comp_1');

  // Search filter state
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const nextWeek = new Date();
  nextWeek.setDate(nextWeek.getDate() + 5);

  const [filter, setFilter] = useState<SearchFilter>({
    city: 'Tümü',
    startDate: tomorrow.toISOString().split('T')[0],
    endDate: nextWeek.toISOString().split('T')[0],
    type: 'Tümü',
  });

  // Modal states
  const [bookingVehicle, setBookingVehicle] = useState<Vehicle | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [recentBooking, setRecentBooking] = useState<Reservation | null>(null);

  // Sync state from dbService
  const refreshData = () => {
    setCompanies(dbService.getCompanies());
    setVehicles(dbService.getVehicles());
    setReservations(dbService.getReservations());
    setCurrentUser(dbService.getCurrentUser());
  };

  useEffect(() => {
    refreshData();
  }, []);

  const handleResetFilter = () => {
    setFilter({
      city: 'Tümü',
      startDate: tomorrow.toISOString().split('T')[0],
      endDate: nextWeek.toISOString().split('T')[0],
      type: 'Tümü',
    });
  };

  // Filter vehicles matching search criteria
  const filteredVehicles = vehicles.filter((v) => {
    // City filter
    if (filter.city !== 'Tümü') {
      const comp = companies.find((c) => c.id === v.companyId);
      if (!comp || comp.city !== filter.city) return false;
    }

    // Vehicle Type filter
    if (filter.type !== 'Tümü' && v.type !== filter.type) {
      return false;
    }

    return true;
  });

  // Calculate availability for each vehicle
  const vehiclesWithAvailability = filteredVehicles.map((v) => {
    const comp = companies.find((c) => c.id === v.companyId);
    const availability = dbService.checkVehicleAvailability(v.id, filter.startDate, filter.endDate);
    const rateInfo = dbService.calculateDailyRateForDate(v, filter.startDate);

    return {
      vehicle: v,
      company: comp,
      isAvailable: availability.isAvailable,
      conflictReason: availability.reason,
      calculatedDailyRate: rateInfo.price,
      ruleLabel: rateInfo.ruleLabel,
    };
  });

  const availableVehiclesCount = vehiclesWithAvailability.filter((item) => item.isAvailable).length;
  const userReservationsCount = reservations.filter((r) => r.userId === currentUser.id).length;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans">
      {/* Top Navigation */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        reservationsCount={userReservationsCount}
      />

      {/* Main Content Areas */}
      <main className="flex-1">
        {/* VIEW 1: VEHICLE SEARCH & BOOKING */}
        {activeTab === 'search' && (
          <div>
            <HeroSearch
              filter={filter}
              setFilter={setFilter}
              totalVehiclesCount={vehicles.length}
              availableVehiclesCount={availableVehiclesCount}
              onReset={handleResetFilter}
            />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              {/* Recent booking success notification banner */}
              {recentBooking && (
                <div className="mb-8 p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                    <div>
                      <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                        Rezervasyon Başarıyla Oluşturuldu ({recentBooking.reservationCode})
                      </h4>
                      <p className="text-xs text-emerald-700 dark:text-emerald-400">
                        {recentBooking.startDate} — {recentBooking.endDate} tarihleri arası araç rezerve edildi ve takvim kilitlendi.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setActiveTab('reservations')}
                      className="px-3 py-1.5 text-xs font-bold text-emerald-900 dark:text-emerald-100 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-md hover:bg-emerald-300/60 flex items-center gap-1 transition"
                    >
                      <span>Rezervasyonları Gör</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setRecentBooking(null)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 px-2 py-1"
                    >
                      Kapat
                    </button>
                  </div>
                </div>
              )}

              {/* Section Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 dark:text-white">
                    {filter.city === 'Tümü' ? 'Tüm Şehirlerdeki' : `${filter.city} Şehrindeki`} Araçlar
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Seçilen Tarih Aralığı: <strong>{filter.startDate}</strong> ile <strong>{filter.endDate}</strong> arası
                  </p>
                </div>

                <div className="text-xs font-mono text-slate-500">
                  {vehiclesWithAvailability.length} Araç Listeleniyor
                </div>
              </div>

              {/* Vehicle Cards Grid */}
              {vehiclesWithAvailability.length === 0 ? (
                <div className="bg-white dark:bg-slate-900 rounded-xl p-12 text-center border border-slate-200 dark:border-slate-800">
                  <Car className="w-10 h-10 text-slate-400 mx-auto mb-3" />
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Seçilen kriterlere uygun araç bulunamadı
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                    Farklı bir şehir veya araç tipi seçebilir ya da tarih aralığınızı güncelleyebilirsiniz.
                  </p>
                  <button
                    onClick={handleResetFilter}
                    className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 dark:bg-white dark:text-slate-900 rounded-md"
                  >
                    Filtreleri Temizle
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vehiclesWithAvailability.map((item) => (
                    <VehicleCard
                      key={item.vehicle.id}
                      vehicle={item.vehicle}
                      company={item.company}
                      startDate={filter.startDate}
                      endDate={filter.endDate}
                      isAvailable={item.isAvailable}
                      conflictReason={item.conflictReason}
                      calculatedDailyRate={item.calculatedDailyRate}
                      ruleLabel={item.ruleLabel}
                      onBook={(v) => setBookingVehicle(v)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: COMPANY FLEET & FLEET MANAGEMENT */}
        {activeTab === 'company' && (
          <CompanyDashboard
            companies={companies}
            activeCompanyId={activeCompanyId}
            setActiveCompanyId={setActiveCompanyId}
            onRefreshData={refreshData}
          />
        )}

        {/* VIEW 3: USER RESERVATIONS & CANCELLATION ENGINE */}
        {activeTab === 'reservations' && (
          <UserReservations
            currentUser={currentUser}
            onRefreshData={refreshData}
            onExploreVehicles={() => setActiveTab('search')}
          />
        )}

        {/* VIEW 4: DATABASE & LIVE SQL CONSOLE */}
        {activeTab === 'database' && <DatabaseViewer />}

        {/* VIEW 5: JAVA SOURCE CODE VIEWER (Enes Öztürk) */}
        {activeTab === 'java' && <JavaCodeViewer />}
      </main>

      {/* Booking Drawer / Modal */}
      {bookingVehicle && (
        <BookingModal
          vehicle={bookingVehicle}
          company={companies.find((c) => c.id === bookingVehicle.companyId)}
          initialStartDate={filter.startDate}
          initialEndDate={filter.endDate}
          currentUser={currentUser}
          onClose={() => setBookingVehicle(null)}
          onSuccess={(newRez) => {
            setBookingVehicle(null);
            setRecentBooking(newRez);
            refreshData();
          }}
        />
      )}

      {/* User Switch / Registration Modal */}
      {isAuthModalOpen && (
        <UserAuthModal
          currentUser={currentUser}
          onClose={() => setIsAuthModalOpen(false)}
          onUserChanged={(user) => {
            setCurrentUser(user);
            refreshData();
          }}
        />
      )}

      {/* Footer with Enes Öztürk Signature */}
      <Footer />
    </div>
  );
}
