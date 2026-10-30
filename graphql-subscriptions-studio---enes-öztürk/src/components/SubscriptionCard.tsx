import React, { useState } from 'react';
import { Radio, Plus, Check, Copy, ArrowUpRight, Filter } from 'lucide-react';
import { EventItem } from '../graphql/types.ts';

interface SubscriptionCardProps {
  id: string;
  title: string;
  subscriptionDoc: string;
  triggerName: string;
  isActive: boolean;
  onToggleActive: () => void;
  messageCount: number;
  lastPayload: any;
  lastTimestamp?: number;
  onQuickTrigger: () => void;
  quickTriggerLabel: string;
  isPulsing: boolean;
  // Specific for participantAdded filter testing
  availableEvents?: EventItem[];
  selectedEventFilter?: string;
  onFilterChange?: (eventId: string) => void;
}

export const SubscriptionCard: React.FC<SubscriptionCardProps> = ({
  title,
  subscriptionDoc,
  triggerName,
  isActive,
  onToggleActive,
  messageCount,
  lastPayload,
  lastTimestamp,
  onQuickTrigger,
  quickTriggerLabel,
  isPulsing,
  availableEvents,
  selectedEventFilter,
  onFilterChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [showFullJson, setShowFullJson] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(subscriptionDoc.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`relative rounded-xl border transition-all duration-300 flex flex-col justify-between ${
        isPulsing
          ? 'bg-slate-900 border-indigo-400 ring-2 ring-indigo-500/20 shadow-lg shadow-indigo-500/10'
          : 'bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-sm'
      }`}
    >
      {/* Card Header */}
      <div className="p-5 border-b border-slate-800/80">
        <div className="flex items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2">
            <span
              className={`inline-block w-2.5 h-2.5 rounded-full ${
                isActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'
              }`}
              title={isActive ? 'Abonelik Aktif' : 'Abonelik Duraklatıldı'}
            />
            <h3 className="text-base font-semibold text-white tracking-tight">{title}</h3>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleActive}
              className={`px-2.5 py-1 text-xs font-medium rounded-md transition-colors ${
                isActive
                  ? 'bg-emerald-950/60 text-emerald-300 hover:bg-emerald-900/60 border border-emerald-800/40'
                  : 'bg-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {isActive ? 'Canlı Akışta' : 'Durduruldu'}
            </button>
          </div>
        </div>

        {/* Channel info & metadata without pill clutter */}
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span className="font-mono text-indigo-300">{triggerName}</span>
          <span aria-hidden="true">·</span>
          <span className="font-mono tabular-nums text-slate-300">{messageCount} event iletildi</span>
          {lastTimestamp && (
            <>
              <span aria-hidden="true">·</span>
              <span className="font-mono tabular-nums text-slate-400">
                {new Date(lastTimestamp).toLocaleTimeString()}
              </span>
            </>
          )}
        </div>

        {/* Optional Filter for participantAdded */}
        {availableEvents && onFilterChange && (
          <div className="mt-3 pt-3 border-t border-slate-800/60 flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>Filtre (event_id):</span>
            </div>
            <select
              value={selectedEventFilter || ''}
              onChange={(e) => onFilterChange(e.target.value)}
              className="text-xs bg-slate-950 border border-slate-700 text-slate-200 rounded px-2 py-1 max-w-[200px] truncate focus:outline-none focus:border-indigo-500"
            >
              <option value="">Tümü (Filtresiz)</option>
              {availableEvents.map((evt) => (
                <option key={evt.id} value={evt.id}>
                  #{evt.id}: {evt.title}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Code Snippet Box */}
      <div className="p-4 bg-slate-950/70 border-b border-slate-800/80">
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-[11px] font-mono uppercase tracking-wider text-slate-400">
            GraphQL Subscription
          </span>
          <button
            onClick={handleCopy}
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
            title="Sorguyu Kopyala"
          >
            {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
            <span className="text-[11px]">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
          </button>
        </div>
        <pre className="text-xs font-mono text-emerald-300 overflow-x-auto p-2.5 bg-slate-900 rounded border border-slate-800/90 leading-relaxed">
          {subscriptionDoc.trim()}
        </pre>
      </div>

      {/* Latest Received Payload Stream View */}
      <div className="p-4 flex-1">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-slate-300">Son Alınan Canlı Veri</span>
          {lastPayload && (
            <button
              onClick={() => setShowFullJson(!showFullJson)}
              className="text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              {showFullJson ? 'Daralt' : 'JSON Detayı'}
            </button>
          )}
        </div>

        {lastPayload ? (
          <div className="bg-slate-950 rounded border border-slate-800 p-3 text-xs font-mono text-slate-300 overflow-x-auto">
            {showFullJson ? (
              <pre className="text-indigo-200 leading-relaxed">
                {JSON.stringify(lastPayload, null, 2)}
              </pre>
            ) : (
              <div className="space-y-1">
                {Object.entries(lastPayload).map(([key, val]) => (
                  <div key={key} className="flex items-start gap-2">
                    <span className="text-slate-500 shrink-0">{key}:</span>
                    <span className="text-indigo-300 truncate">
                      {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="rounded border border-dashed border-slate-800 p-4 text-center text-xs text-slate-400">
            Henüz bir veri akışı olmadı. Tetiklemek için aşağıdaki butonu kullanabilirsiniz.
          </div>
        )}
      </div>

      {/* Card Footer with Quick Mutation Trigger */}
      <div className="p-4 pt-2 border-t border-slate-800/60 bg-slate-900/50">
        <button
          onClick={onQuickTrigger}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 hover:text-white rounded-lg transition-colors border border-slate-700/60 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 text-indigo-400" />
          <span>{quickTriggerLabel}</span>
        </button>
      </div>
    </div>
  );
};
