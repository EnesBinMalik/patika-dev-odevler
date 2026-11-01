/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { DatabaseProvider, useDatabase } from './context/DatabaseContext';
import { Header, ActiveTab } from './components/Header';
import { RoomSearch } from './components/RoomSearch';
import { HotelManagement } from './components/HotelManagement';
import { SeasonManagement } from './components/SeasonManagement';
import { RoomManagement } from './components/RoomManagement';
import { ReservationList } from './components/ReservationList';
import { UserManagement } from './components/UserManagement';
import { DatabaseViewer } from './components/DatabaseViewer';
import { LoginModal } from './components/LoginModal';
import {
  Building2,
  CalendarDays,
  BedDouble,
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  ShieldAlert,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentUser, hotels, rooms, reservations } = useDatabase();
  const [activeTab, setActiveTab] = useState<ActiveTab>('search');

  // Cross-navigation states
  const [selectedHotelForSeasons, setSelectedHotelForSeasons] = useState<string | undefined>();
  const [selectedHotelForRooms, setSelectedHotelForRooms] = useState<string | undefined>();
  const [newlyCreatedResId, setNewlyCreatedResId] = useState<string | undefined>();

  const handleNavigateToSeasons = (hotelId: string) => {
    setSelectedHotelForSeasons(hotelId);
    setActiveTab('seasons');
  };

  const handleNavigateToRooms = (hotelId: string) => {
    setSelectedHotelForRooms(hotelId);
    setActiveTab('rooms');
  };

  const handleReservationSuccess = (reservationId: string) => {
    setNewlyCreatedResId(reservationId);
    setActiveTab('reservations');
  };

  const isAdmin = currentUser?.role === 'admin';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* Login Gate if user logged out */}
      <LoginModal isOpen={!currentUser} />

      <div>
        {/* Navigation Header */}
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Content Viewport */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Active Tab View */}
          {activeTab === 'search' && (
            <RoomSearch onReservationSuccess={handleReservationSuccess} />
          )}

          {activeTab === 'hotels' && (
            <HotelManagement
              onNavigateToSeasons={handleNavigateToSeasons}
              onNavigateToRooms={handleNavigateToRooms}
            />
          )}

          {activeTab === 'seasons' && (
            <SeasonManagement
              initialHotelId={selectedHotelForSeasons}
              onNavigateToRooms={handleNavigateToRooms}
            />
          )}

          {activeTab === 'rooms' && (
            <RoomManagement initialHotelId={selectedHotelForRooms} />
          )}

          {activeTab === 'reservations' && (
            <ReservationList highlightedReservationId={newlyCreatedResId} />
          )}

          {activeTab === 'users' && (
            isAdmin ? (
              <UserManagement />
            ) : (
              <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 space-y-3">
                <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">
                  Yetkisiz Erişim (403 Forbidden)
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  Kullanıcı Yönetimi ekranına yalnızca "Admin" yetkisine sahip kullanıcılar erişebilir. Sağ üst köşeden admin kullanıcısına geçiş yapabilirsiniz.
                </p>
                <button
                  onClick={() => setActiveTab('search')}
                  className="px-4 py-2 bg-sky-600 text-white font-medium text-xs rounded-lg"
                >
                  Oda Aramaya Dön
                </button>
              </div>
            )
          )}

          {activeTab === 'database' && <DatabaseViewer />}
        </main>
      </div>

      {/* Footer with Enes Öztürk Signature and Requirements Summary */}
      <footer className="bg-white border-t border-slate-200 mt-12 py-8 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-sky-600 text-white flex items-center justify-center font-bold text-xs">
              P
            </div>
            <div>
              <span className="font-bold text-slate-800">
                Patika Turizm Acente Sistemi
              </span>
              <span className="mx-2 text-slate-300">|</span>
              <span className="text-slate-500">
                Otel, Dönem, Fiyat ve Rezervasyon Yönetimi
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Enes Öztürk İmzalı</span>
            </div>
            <span className="text-slate-300">·</span>
            <span className="font-mono text-slate-400">
              {hotels.length} Otel · {rooms.length} Oda · {reservations.length} Rezervasyon
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <DatabaseProvider>
      <AppContent />
    </DatabaseProvider>
  );
}
