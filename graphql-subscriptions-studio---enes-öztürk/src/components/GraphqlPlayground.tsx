import React, { useState, useEffect, useRef } from 'react';
import { Play, Square, Copy, Check, Sparkles, Terminal } from 'lucide-react';
import { runGraphQLQuery, runGraphQLSubscription, SubscriptionHandle } from '../graphql/executor.ts';

interface Preset {
  name: string;
  type: 'subscription' | 'mutation' | 'query';
  query: string;
  variables?: string;
}

const PRESETS: Preset[] = [
  {
    name: 'subscription userCreated (Ödev 3 Şartı)',
    type: 'subscription',
    query: `subscription OnUserCreated {
  userCreated {
    id
    name
    email
  }
}`,
  },
  {
    name: 'subscription eventCreated (Ödev 3 Şartı)',
    type: 'subscription',
    query: `subscription OnEventCreated {
  eventCreated {
    id
    title
    desc
    date
    from
    to
    user {
      id
      name
      email
    }
    location {
      name
      desc
    }
  }
}`,
  },
  {
    name: 'subscription participantAdded (Tüm Etkinlikler)',
    type: 'subscription',
    query: `subscription OnParticipantAdded {
  participantAdded {
    id
    user_id
    event_id
    user {
      id
      name
      email
    }
    event {
      id
      title
      date
    }
  }
}`,
  },
  {
    name: 'subscription participantAdded (Filtreli: event_id: "1")',
    type: 'subscription',
    query: `subscription OnEvent1ParticipantAdded($eventId: ID) {
  participantAdded(event_id: $eventId) {
    id
    user_id
    event_id
    user {
      name
      email
    }
    event {
      title
    }
  }
}`,
    variables: JSON.stringify({ eventId: '1' }, null, 2),
  },
  {
    name: 'mutation createUser',
    type: 'mutation',
    query: `mutation CreateNewUser($data: CreateUserInput!) {
  createUser(data: $data) {
    id
    name
    email
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          name: 'Barış Manço',
          email: 'baris.manco@example.com',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'mutation createEvent',
    type: 'mutation',
    query: `mutation CreateNewEvent($data: CreateEventInput!) {
  createEvent(data: $data) {
    id
    title
    desc
    date
    user {
      name
    }
    location {
      name
    }
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          title: 'GraphQL Realtime Masterclass',
          desc: 'Apollo Server, PubSub ve WebSocket mimarisi.',
          date: '2026-12-10',
          from: '10:00',
          to: '17:00',
          location_id: '1',
          user_id: '1',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'mutation addParticipant',
    type: 'mutation',
    query: `mutation AddNewParticipant($data: AddParticipantInput!) {
  addParticipant(data: $data) {
    id
    user {
      name
    }
    event {
      title
    }
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          user_id: '1',
          event_id: '1',
        },
      },
      null,
      2
    ),
  },
  {
    name: 'query getAllEventsWithDetails',
    type: 'query',
    query: `query GetAllEvents {
  events {
    id
    title
    date
    from
    to
    user {
      name
      email
    }
    location {
      name
    }
    participants {
      id
      user {
        name
      }
    }
  }
}`,
  },
  {
    name: 'query getAllUsersWithParticipations',
    type: 'query',
    query: `query GetAllUsers {
  users {
    id
    name
    email
    events {
      title
      date
    }
    participations {
      event {
        title
      }
    }
  }
}`,
  },
];

export const GraphqlPlayground: React.FC = () => {
  const [selectedPresetIndex, setSelectedPresetIndex] = useState(0);
  const [queryCode, setQueryCode] = useState(PRESETS[0].query);
  const [variablesCode, setVariablesCode] = useState(PRESETS[0].variables || '');
  const [showVariables, setShowVariables] = useState(false);

  const [isRunning, setIsRunning] = useState(false);
  const [responseLog, setResponseLog] = useState<any[]>([]);
  const [copied, setCopied] = useState(false);

  const activeSubRef = useRef<SubscriptionHandle | null>(null);

  // Switch preset
  const handleSelectPreset = (idx: number) => {
    // stop active subscription if any
    if (activeSubRef.current) {
      activeSubRef.current.unsubscribe();
      activeSubRef.current = null;
      setIsRunning(false);
    }
    setSelectedPresetIndex(idx);
    setQueryCode(PRESETS[idx].query);
    setVariablesCode(PRESETS[idx].variables || '');
    setShowVariables(Boolean(PRESETS[idx].variables));
    setResponseLog([]);
  };

  // Run or Stop
  const handleExecute = async () => {
    // If currently running a subscription, stop it
    if (activeSubRef.current) {
      activeSubRef.current.unsubscribe();
      activeSubRef.current = null;
      setIsRunning(false);
      setResponseLog((prev) => [
        {
          _time: new Date().toLocaleTimeString(),
          _info: 'Abonelik kullanıcı tarafından sonlandırıldı.',
        },
        ...prev,
      ]);
      return;
    }

    let parsedVars: Record<string, any> | undefined = undefined;
    if (variablesCode.trim()) {
      try {
        parsedVars = JSON.parse(variablesCode);
      } catch (e: any) {
        setResponseLog([
          {
            errors: [{ message: `Variables JSON Parse Hatası: ${e.message}` }],
          },
        ]);
        return;
      }
    }

    const trimmed = queryCode.trim();
    const isSubscription = trimmed.startsWith('subscription') || trimmed.includes('subscription ');

    if (isSubscription) {
      setIsRunning(true);
      setResponseLog([
        {
          _time: new Date().toLocaleTimeString(),
          _info: 'Canlı Subscription Dinleyicisi Başlatıldı. Gelen veriler bekleniyor...',
        },
      ]);

      const handle = await runGraphQLSubscription(
        queryCode,
        parsedVars,
        (data) => {
          setResponseLog((prev) => [
            {
              _time: new Date().toLocaleTimeString(),
              ...data,
            },
            ...prev,
          ]);
        },
        (err) => {
          setResponseLog((prev) => [
            {
              _time: new Date().toLocaleTimeString(),
              errors: [{ message: err.message || 'Subscription hatası' }],
            },
            ...prev,
          ]);
        }
      );

      activeSubRef.current = handle;
    } else {
      // Query or Mutation
      setIsRunning(true);
      const res = await runGraphQLQuery(queryCode, parsedVars);
      setIsRunning(false);
      setResponseLog([
        {
          _time: new Date().toLocaleTimeString(),
          ...res,
        },
      ]);
    }
  };

  useEffect(() => {
    return () => {
      if (activeSubRef.current) {
        activeSubRef.current.unsubscribe();
      }
    };
  }, []);

  const handleCopyResponse = () => {
    navigator.clipboard.writeText(JSON.stringify(responseLog, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="space-y-4">
      {/* Top Presets Selector */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-indigo-400 shrink-0" />
          <div>
            <h3 className="text-sm font-semibold text-white">GraphQL Studio & IDE</h3>
            <p className="text-xs text-slate-400">
              Query, Mutation ve Subscriptions sorgularını canlı çalıştırın
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Hazır Şablonlar:</label>
          <select
            value={selectedPresetIndex}
            onChange={(e) => handleSelectPreset(Number(e.target.value))}
            className="text-xs bg-slate-950 border border-slate-700 text-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:border-indigo-500 max-w-[280px] sm:max-w-[340px] truncate"
          >
            {PRESETS.map((p, idx) => (
              <option key={idx} value={idx}>
                [{p.type.toUpperCase()}] {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Split Grid: Editor (Left) & Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Query & Variables Editor */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[560px]">
          {/* Editor Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">Operations</span>
              <span
                className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                  PRESETS[selectedPresetIndex]?.type === 'subscription'
                    ? 'bg-purple-950 text-purple-300 border border-purple-800/60'
                    : PRESETS[selectedPresetIndex]?.type === 'mutation'
                    ? 'bg-amber-950 text-amber-300 border border-amber-800/60'
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800/60'
                }`}
              >
                {PRESETS[selectedPresetIndex]?.type.toUpperCase()}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowVariables(!showVariables)}
                className={`text-xs px-2.5 py-1 rounded transition-colors ${
                  showVariables
                    ? 'bg-slate-800 text-white'
                    : 'text-slate-400 hover:text-white bg-slate-950'
                }`}
              >
                Variables ({variablesCode.trim() ? 'Dolu' : 'Boş'})
              </button>

              <button
                onClick={handleExecute}
                className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded transition-colors ${
                  isRunning && activeSubRef.current
                    ? 'bg-rose-600 hover:bg-rose-500 text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {isRunning && activeSubRef.current ? (
                  <>
                    <Square className="w-3.5 h-3.5 fill-current" />
                    <span>Durdur</span>
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>Çalıştır</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Textarea for Query */}
          <div className="flex-1 p-3 bg-slate-950/90 font-mono text-xs flex flex-col">
            <textarea
              value={queryCode}
              onChange={(e) => setQueryCode(e.target.value)}
              spellCheck={false}
              className="w-full flex-1 bg-transparent text-emerald-300 font-mono resize-none focus:outline-none leading-relaxed placeholder-slate-600"
              placeholder="GraphQL sorgunuzu buraya yazın..."
            />

            {/* Optional Variables Drawer */}
            {showVariables && (
              <div className="pt-2 border-t border-slate-800 mt-2">
                <span className="text-[11px] font-mono text-slate-400 block mb-1">
                  Query Variables (JSON)
                </span>
                <textarea
                  rows={4}
                  value={variablesCode}
                  onChange={(e) => setVariablesCode(e.target.value)}
                  spellCheck={false}
                  placeholder={`{\n  "eventId": "1"\n}`}
                  className="w-full bg-slate-900 border border-slate-800 rounded p-2 text-indigo-300 font-mono text-xs focus:outline-none focus:border-indigo-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right: Response / Live Stream Output */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden flex flex-col h-[560px]">
          {/* Response Header */}
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-300">Response / Canlı Çıktı</span>
              {isRunning && activeSubRef.current && (
                <span className="flex items-center gap-1 text-[11px] text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Dinleniyor...</span>
                </span>
              )}
            </div>

            <div className="flex items-center gap-2">
              {responseLog.length > 0 && (
                <>
                  <button
                    onClick={handleCopyResponse}
                    className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                  >
                    {copied ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                    <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
                  </button>
                  <button
                    onClick={() => setResponseLog([])}
                    className="text-xs text-slate-400 hover:text-rose-400 transition-colors"
                  >
                    Temizle
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Output Screen */}
          <div className="flex-1 p-3 bg-slate-950 font-mono text-xs overflow-y-auto">
            {responseLog.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-500 space-y-2 text-center p-6">
                <Terminal className="w-8 h-8 text-slate-700" />
                <p>Henüz bir sorgu çalıştırılmadı.</p>
                <p className="text-[11px] text-slate-600 max-w-sm">
                  Sol taraftaki "Çalıştır" butonuna tıklayarak seçili GraphQL işlemini
                  yürütebilirsiniz. Subscription başlatırsanız, her yeni mutasyon burada canlı olarak
                  akacaktır.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {responseLog.map((entry, i) => (
                  <div
                    key={i}
                    className="p-3 rounded bg-slate-900 border border-slate-800/90 text-slate-200"
                  >
                    {entry._time && (
                      <div className="text-[11px] text-slate-500 mb-1.5 flex items-center justify-between">
                        <span>Zaman: {entry._time}</span>
                        {i === 0 && <span className="text-emerald-400">Son Güncelleme</span>}
                      </div>
                    )}
                    <pre className="text-indigo-200 leading-relaxed overflow-x-auto">
                      {JSON.stringify(entry, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
