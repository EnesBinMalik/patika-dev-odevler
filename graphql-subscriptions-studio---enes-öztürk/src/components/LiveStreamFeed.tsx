import React, { useState } from 'react';
import { Trash2, Copy, Check, Radio, Search } from 'lucide-react';
import { BroadcastLogItem } from '../graphql/pubsub.ts';

interface LiveStreamFeedProps {
  logs: BroadcastLogItem[];
  onClearLogs: () => void;
}

export const LiveStreamFeed: React.FC<LiveStreamFeedProps> = ({ logs, onClearLogs }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [search, setSearch] = useState<string>('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredLogs = logs.filter((item) => {
    if (filter !== 'ALL' && item.trigger !== filter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const stringified = JSON.stringify(item.payload).toLowerCase();
      return item.trigger.toLowerCase().includes(q) || stringified.includes(q);
    }
    return true;
  });

  const handleCopy = (id: string, payload: any) => {
    navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
      {/* Header bar */}
      <div className="p-4 sm:p-5 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
            <h3 className="text-base font-semibold text-white tracking-tight">
              Canlı WebSocket & PubSub Akış Günlüğü
            </h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Sunucudan istemcilere gerçek zamanlı iletilen GraphQL subscription paketleri
          </p>
        </div>

        {/* Filter tabs & actions */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setFilter('ALL')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'ALL' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              Tümü ({logs.length})
            </button>
            <button
              onClick={() => setFilter('USER_CREATED')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'USER_CREATED'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              userCreated
            </button>
            <button
              onClick={() => setFilter('EVENT_CREATED')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'EVENT_CREATED'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              eventCreated
            </button>
            <button
              onClick={() => setFilter('PARTICIPANT_ADDED')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                filter === 'PARTICIPANT_ADDED'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              participantAdded
            </button>
          </div>

          {logs.length > 0 && (
            <button
              onClick={onClearLogs}
              title="Günlüğü Temizle"
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-4 py-2.5 bg-slate-950/60 border-b border-slate-800/80 flex items-center gap-2">
        <Search className="w-3.5 h-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Akış paketlerinde ara (isim, başlık, id, e-posta...)"
          className="w-full text-xs bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="text-xs text-slate-400 hover:text-white"
          >
            Temizle
          </button>
        )}
      </div>

      {/* Log Feed List */}
      <div className="divide-y divide-slate-800/60 max-h-[420px] overflow-y-auto">
        {filteredLogs.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-500">
            {logs.length === 0
              ? 'Henüz hiçbir subscription verisi iletilmedi. Yukarıdaki butonlarla kullanıcı, etkinlik veya katılımcı oluşturarak akışı başlatın.'
              : 'Seçili filtre veya aramaya uygun akış kaydı bulunamadı.'}
          </div>
        ) : (
          filteredLogs.map((item) => {
            const timeStr = new Date(item.timestamp).toLocaleTimeString();
            return (
              <div
                key={item.id}
                className="p-4 hover:bg-slate-850/60 transition-colors flex flex-col gap-2 font-mono"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-semibold ${
                        item.trigger === 'USER_CREATED'
                          ? 'text-cyan-400'
                          : item.trigger === 'EVENT_CREATED'
                          ? 'text-amber-400'
                          : 'text-purple-400'
                      }`}
                    >
                      {item.trigger}
                    </span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-slate-400 tabular-nums">{timeStr}</span>
                    <span aria-hidden="true" className="text-slate-600">
                      ·
                    </span>
                    <span className="text-[11px] text-slate-500">paket #{item.id}</span>
                  </div>

                  <button
                    onClick={() => handleCopy(item.id, item.payload)}
                    className="text-slate-400 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
                  >
                    {copiedId === item.id ? (
                      <>
                        <Check className="w-3 h-3 text-emerald-400" />
                        <span className="text-emerald-400">Kopyalandı</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3" />
                        <span>JSON</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="bg-slate-950 p-2.5 rounded border border-slate-800/80 text-xs overflow-x-auto">
                  <pre className="text-slate-300 leading-relaxed">
                    {JSON.stringify(item.payload, null, 2)}
                  </pre>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
