import React, { useState } from 'react';
import { useRealtime } from '../context/RealtimeContext';
import { Radio, Bell, ChevronUp, ChevronDown, Sparkles, UserPlus, Calendar, X } from 'lucide-react';

export const LiveActivityDrawer: React.FC = () => {
  const { activityFeed, setSelectedEventId } = useRealtime();
  const [isOpen, setIsOpen] = useState(false);
  const [dismissedId, setDismissedId] = useState<string | null>(null);

  const latest = activityFeed.length > 0 ? activityFeed[0] : null;
  const isLatestVisible = latest && latest.id !== dismissedId;

  return (
    <aside aria-label="Canlı Bildirimler" className="fixed bottom-4 right-4 z-40 flex flex-col items-end gap-2 max-w-sm pointer-events-none">
      {/* Latest Flash Toast Notification */}
      {isLatestVisible && !isOpen && (
        <div
          role="status"
          aria-live="polite"
          className="pointer-events-auto flex items-start gap-3 p-3.5 bg-slate-900/95 border border-emerald-500/50 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 ring-1 ring-emerald-500/20 text-white"
        >
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
            {latest.type === 'participant_added' ? (
              <UserPlus className="w-4 h-4" />
            ) : (
              <Calendar className="w-4 h-4" />
            )}
          </div>
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <h4 className="text-xs font-bold text-emerald-300 truncate">{latest.title}</h4>
            </div>
            <p className="text-xs text-slate-300 mt-0.5 line-clamp-2">{latest.subtitle}</p>
            {latest.eventId && (
              <button
                onClick={() => setSelectedEventId(latest.eventId!)}
                className="mt-1 text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 underline cursor-pointer"
              >
                Etkinliği İncele →
              </button>
            )}
          </div>
          <button
            onClick={() => setDismissedId(latest.id)}
            className="p-1 text-slate-400 hover:text-white rounded transition cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Expanded Activity Drawer */}
      {isOpen && (
        <div className="pointer-events-auto w-80 sm:w-96 bg-slate-900/95 border border-slate-700/80 rounded-2xl shadow-2xl backdrop-blur-md p-4 text-white animate-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400">
                <Radio className="w-4 h-4 animate-pulse" />
              </div>
              <h3 className="text-xs font-bold text-white">Canlı Aktivite Akışı</h3>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded cursor-pointer"
            >
              <ChevronDown className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {activityFeed.length === 0 ? (
              <div className="py-6 text-center text-xs text-slate-500">
                Henüz canlı aktivite gerçekleşmedi.
              </div>
            ) : (
              activityFeed.map((act) => (
                <div
                  key={act.id}
                  onClick={() => act.eventId && setSelectedEventId(act.eventId)}
                  className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80 hover:border-slate-700 transition cursor-pointer flex items-start gap-2.5 text-xs"
                >
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 shrink-0 mt-0.5">
                    {act.type === 'participant_added' ? (
                      <UserPlus className="w-3.5 h-3.5" />
                    ) : (
                      <Calendar className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white truncate">{act.title}</div>
                    <div className="text-[11px] text-slate-400 truncate">{act.subtitle}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">
                      {act.timestamp.toLocaleTimeString('tr-TR', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit'
                      })}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Ticker Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pointer-events-auto flex items-center gap-2 px-3.5 py-2 rounded-full bg-slate-900 border border-slate-700/80 hover:border-indigo-500/50 text-slate-200 hover:text-white shadow-xl backdrop-blur-md transition cursor-pointer text-xs font-semibold group"
      >
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
        </span>
        <span>Canlı Akış ({activityFeed.length})</span>
        {isOpen ? (
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        ) : (
          <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
        )}
      </button>
    </aside>
  );
};
