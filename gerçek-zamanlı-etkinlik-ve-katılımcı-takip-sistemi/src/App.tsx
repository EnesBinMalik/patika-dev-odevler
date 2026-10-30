/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RealtimeProvider, useRealtime } from './context/RealtimeContext';
import { Navbar } from './components/Navbar';
import { EventList } from './components/EventList';
import { EventDetail } from './components/EventDetail';
import { CreateEventModal } from './components/CreateEventModal';
import { SplitScreenSimulator } from './components/SplitScreenSimulator';
import { LiveActivityDrawer } from './components/LiveActivityDrawer';
import { Footer } from './components/Footer';

const AppContent: React.FC = () => {
  const { selectedEventId, setSelectedEventId, splitScreenMode } = useRealtime();
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Navbar with connection status, signature, and controls */}
      <Navbar onOpenCreateEvent={() => setIsCreateOpen(true)} />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {splitScreenMode ? (
          <SplitScreenSimulator onOpenCreateEvent={() => setIsCreateOpen(true)} />
        ) : selectedEventId ? (
          <EventDetail onBack={() => setSelectedEventId(null)} />
        ) : (
          <EventList
            onSelectEvent={(id) => setSelectedEventId(id)}
            onOpenCreateEvent={() => setIsCreateOpen(true)}
          />
        )}
      </main>

      {/* Floating Realtime Activity Drawer & Notifications */}
      <LiveActivityDrawer />

      {/* Create Event Modal */}
      <CreateEventModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} />

      {/* Footer with Enes Öztürk Signature */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <RealtimeProvider>
      <AppContent />
    </RealtimeProvider>
  );
}
