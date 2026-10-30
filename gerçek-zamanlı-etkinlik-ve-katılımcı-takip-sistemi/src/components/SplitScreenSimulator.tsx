import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { EventList } from './EventList';
import { EventDetail } from './EventDetail';
import {
  Columns2,
  X,
  Radio,
  Sparkles,
  UserPlus,
  Calendar,
  CheckCircle2,
  Monitor
} from 'lucide-react';

interface SplitScreenSimulatorProps {
  onOpenCreateEvent: () => void;
}

export const SplitScreenSimulator: React.FC<SplitScreenSimulatorProps> = ({ onOpenCreateEvent }) => {
  const { events, setSplitScreenMode } = useRealtime();

  // Screen 1 local selected event (defaults to first event)
  const [client1EventId, setClient1EventId] = useState<string | null>(events[0]?.id || null);

  // Screen 2 local selected event
  const [client2EventId, setClient2EventId] = useState<string | null>(events[0]?.id || null);

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      {/* Top Banner explaining the simulation */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-slate-900 to-violet-950/70 border border-indigo-500/40 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            <Columns2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                Canlı İki Kullanıcı Simülatörü
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-medium">
                Aktif Senkronizasyon
              </span>
            </div>
            <h2 className="text-sm sm:text-base font-bold text-white">
              Tek Ekranda Gerçek Zamanlı Eşzamanlılığı Test Edin
            </h2>
            <p className="text-xs text-slate-300">
              Sol ekranda bir etkinliğin detayını açın, sağ ekrandan veya hızlı test butonundan katılımcı ekleyin; sol tarafta anında listelendiğini görün!
            </p>
          </div>
        </div>

        <button
          onClick={() => setSplitScreenMode(false)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white border border-slate-700 text-xs font-semibold transition cursor-pointer"
        >
          <X className="w-4 h-4" />
          <span>Tek Ekran Moduna Dön</span>
        </button>
      </div>

      {/* Two Panes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Pane 1: User A */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Pane Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500" />
              <span className="text-xs font-bold text-white">İstemci A (Kullanıcı 1 - İzleyici)</span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> Canlı Dinlemede
            </span>
          </div>

          <div className="p-4 sm:p-5 max-h-[820px] overflow-y-auto">
            {client1EventId ? (
              <EventDetail
                onBack={() => setClient1EventId(null)}
                compact={true}
              />
            ) : (
              <EventList
                onSelectEvent={(id) => setClient1EventId(id)}
                onOpenCreateEvent={onOpenCreateEvent}
              />
            )}
          </div>
        </div>

        {/* Pane 2: User B */}
        <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col">
          {/* Pane Header */}
          <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-violet-500" />
              <span className="text-xs font-bold text-white">İstemci B (Kullanıcı 2 - Katılımcı)</span>
            </div>
            <span className="text-[11px] text-emerald-400 flex items-center gap-1">
              <Radio className="w-3 h-3 animate-ping" /> Canlı Dinlemede
            </span>
          </div>

          <div className="p-4 sm:p-5 max-h-[820px] overflow-y-auto">
            {client2EventId ? (
              <EventDetail
                onBack={() => setClient2EventId(null)}
                compact={true}
              />
            ) : (
              <EventList
                onSelectEvent={(id) => setClient2EventId(id)}
                onOpenCreateEvent={onOpenCreateEvent}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
