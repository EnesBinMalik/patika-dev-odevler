/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Automated Test Suite
 */
import React, { useState } from 'react';
import { 
  Play, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  RotateCcw, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  ShieldCheck,
  Code
} from 'lucide-react';
import { runQuery, ExecutionResult } from '../graphql/executor';
import { db } from '../graphql/database';

export interface TestCase {
  id: string;
  name: string;
  entity: 'User' | 'Event' | 'Location' | 'Participant';
  description: string;
  query: string;
  variables: (state: ReturnType<typeof db.getState>) => Record<string, any>;
  validate: (result: ExecutionResult) => boolean;
}

export const testDefinitions: TestCase[] = [
  // --- USER MUTATIONS ---
  {
    id: 'test-add-user',
    name: 'mutation addUser',
    entity: 'User',
    description: 'Yeni bir User (kullanıcı) ekleme testi',
    query: `mutation addUser($data: AddUserInput!) {
  addUser(data: $data) {
    id
    username
    email
  }
}`,
    variables: () => ({
      data: {
        username: `enes_test_${Math.floor(Math.random() * 1000)}`,
        email: `enes.test.${Date.now()}@example.com`
      }
    }),
    validate: (res) => Boolean(res.data?.addUser?.id && res.data?.addUser?.username)
  },
  {
    id: 'test-update-user',
    name: 'mutation updateUser',
    entity: 'User',
    description: 'Mevcut bir User bilgilerini güncelleme testi',
    query: `mutation updateUser($id: ID!, $data: UpdateUserInput!) {
  updateUser(id: $id, data: $data) {
    id
    username
    email
  }
}`,
    variables: (state) => {
      const targetId = state.users[0]?.id || '1';
      return {
        id: targetId,
        data: {
          username: `enes_updated_${Math.floor(Math.random() * 1000)}`
        }
      };
    },
    validate: (res) => Boolean(res.data?.updateUser?.id)
  },
  {
    id: 'test-delete-user',
    name: 'mutation deleteUser',
    entity: 'User',
    description: 'Belirtilen ID\'ye sahip User silme testi',
    query: `mutation deleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    username
  }
}`,
    variables: (state) => {
      const targetId = state.users[state.users.length - 1]?.id || '1';
      return { id: targetId };
    },
    validate: (res) => Boolean(res.data?.deleteUser?.id)
  },
  {
    id: 'test-delete-all-users',
    name: 'mutation deleteAllUsers',
    entity: 'User',
    description: 'Tüm User kayıtlarını silme testi',
    query: `mutation deleteAllUsers {
  deleteAllUsers {
    count
    message
  }
}`,
    variables: () => ({}),
    validate: (res) => typeof res.data?.deleteAllUsers?.count === 'number'
  },

  // --- EVENT MUTATIONS ---
  {
    id: 'test-add-event',
    name: 'mutation addEvent',
    entity: 'Event',
    description: 'Yeni bir Event (etkinlik) oluşturma testi',
    query: `mutation addEvent($data: AddEventInput!) {
  addEvent(data: $data) {
    id
    title
    desc
    date
    from
    to
  }
}`,
    variables: (state) => {
      const locId = state.locations[0]?.id || '1';
      const userId = state.users[0]?.id || '1';
      return {
        data: {
          title: `GraphQL Workshop ${Math.floor(Math.random() * 1000)}`,
          desc: 'Enes Öztürk ile GraphQL mimarisi',
          date: '2026-11-20',
          from: '10:00',
          to: '17:00',
          location_id: locId,
          user_id: userId
        }
      };
    },
    validate: (res) => Boolean(res.data?.addEvent?.id && res.data?.addEvent?.title)
  },
  {
    id: 'test-update-event',
    name: 'mutation updateEvent',
    entity: 'Event',
    description: 'Mevcut bir Event bilgilerini güncelleme testi',
    query: `mutation updateEvent($id: ID!, $data: UpdateEventInput!) {
  updateEvent(id: $id, data: $data) {
    id
    title
    desc
  }
}`,
    variables: (state) => {
      const targetId = state.events[0]?.id || '1';
      return {
        id: targetId,
        data: {
          title: `Güncellenmiş Etkinlik ${Math.floor(Math.random() * 1000)}`
        }
      };
    },
    validate: (res) => Boolean(res.data?.updateEvent?.id)
  },
  {
    id: 'test-delete-event',
    name: 'mutation deleteEvent',
    entity: 'Event',
    description: 'Belirtilen ID\'ye sahip tekil Event silme testi',
    query: `mutation deleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    id
    title
  }
}`,
    variables: (state) => {
      const targetId = state.events[state.events.length - 1]?.id || '1';
      return { id: targetId };
    },
    validate: (res) => Boolean(res.data?.deleteEvent?.id)
  },
  {
    id: 'test-delete-all-events',
    name: 'mutation deleteAllEvents',
    entity: 'Event',
    description: 'Tüm Event kayıtlarını toplu silme testi',
    query: `mutation deleteAllEvents {
  deleteAllEvents {
    count
    message
  }
}`,
    variables: () => ({}),
    validate: (res) => typeof res.data?.deleteAllEvents?.count === 'number'
  },

  // --- LOCATION MUTATIONS ---
  {
    id: 'test-add-location',
    name: 'mutation addLocation',
    entity: 'Location',
    description: 'Yeni bir Location (mekan) ekleme testi',
    query: `mutation addLocation($data: AddLocationInput!) {
  addLocation(data: $data) {
    id
    name
    desc
    lat
    lng
  }
}`,
    variables: () => ({
      data: {
        name: `Test Konferans Salonu ${Math.floor(Math.random() * 100)}`,
        desc: 'Enes Öztürk Etkinlik Alanı',
        lat: 41.0082,
        lng: 28.9784
      }
    }),
    validate: (res) => Boolean(res.data?.addLocation?.id && res.data?.addLocation?.name)
  },
  {
    id: 'test-update-location',
    name: 'mutation updateLocation',
    entity: 'Location',
    description: 'Mevcut bir Location bilgilerini güncelleme testi',
    query: `mutation updateLocation($id: ID!, $data: UpdateLocationInput!) {
  updateLocation(id: $id, data: $data) {
    id
    name
    desc
  }
}`,
    variables: (state) => {
      const targetId = state.locations[0]?.id || '1';
      return {
        id: targetId,
        data: {
          name: `Maslak Kongre [Test Güncelleme ${Math.floor(Math.random() * 100)}]`
        }
      };
    },
    validate: (res) => Boolean(res.data?.updateLocation?.id)
  },
  {
    id: 'test-delete-location',
    name: 'mutation deleteLocation',
    entity: 'Location',
    description: 'Belirtilen ID\'ye sahip tekil Location silme testi',
    query: `mutation deleteLocation($id: ID!) {
  deleteLocation(id: $id) {
    id
    name
  }
}`,
    variables: (state) => {
      const targetId = state.locations[state.locations.length - 1]?.id || '1';
      return { id: targetId };
    },
    validate: (res) => Boolean(res.data?.deleteLocation?.id)
  },
  {
    id: 'test-delete-all-locations',
    name: 'mutation deleteAllLocations',
    entity: 'Location',
    description: 'Tüm Location kayıtlarını toplu silme testi',
    query: `mutation deleteAllLocations {
  deleteAllLocations {
    count
    message
  }
}`,
    variables: () => ({}),
    validate: (res) => typeof res.data?.deleteAllLocations?.count === 'number'
  },

  // --- PARTICIPANT MUTATIONS ---
  {
    id: 'test-add-participant',
    name: 'mutation addParticipant',
    entity: 'Participant',
    description: 'Yeni bir Participant (katılımcı bağlantısı) oluşturma testi',
    query: `mutation addParticipant($data: AddParticipantInput!) {
  addParticipant(data: $data) {
    id
    user_id
    event_id
  }
}`,
    variables: (state) => {
      const userId = state.users[0]?.id || '1';
      const eventId = state.events[0]?.id || '1';
      return {
        data: {
          user_id: userId,
          event_id: eventId
        }
      };
    },
    validate: (res) => Boolean(res.data?.addParticipant?.id)
  },
  {
    id: 'test-update-participant',
    name: 'mutation updateParticipant',
    entity: 'Participant',
    description: 'Mevcut bir Participant kaydını güncelleme testi',
    query: `mutation updateParticipant($id: ID!, $data: UpdateParticipantInput!) {
  updateParticipant(id: $id, data: $data) {
    id
    user_id
    event_id
  }
}`,
    variables: (state) => {
      const targetId = state.participants[0]?.id || '1';
      const eventId = state.events[0]?.id || '1';
      return {
        id: targetId,
        data: {
          event_id: eventId
        }
      };
    },
    validate: (res) => Boolean(res.data?.updateParticipant?.id)
  },
  {
    id: 'test-delete-participant',
    name: 'mutation deleteParticipant',
    entity: 'Participant',
    description: 'Belirtilen ID\'ye sahip tekil Participant silme testi',
    query: `mutation deleteParticipant($id: ID!) {
  deleteParticipant(id: $id) {
    id
    user_id
  }
}`,
    variables: (state) => {
      const targetId = state.participants[state.participants.length - 1]?.id || '1';
      return { id: targetId };
    },
    validate: (res) => Boolean(res.data?.deleteParticipant?.id)
  },
  {
    id: 'test-delete-all-participants',
    name: 'mutation deleteAllParticipants',
    entity: 'Participant',
    description: 'Tüm Participant kayıtlarını toplu silme testi',
    query: `mutation deleteAllParticipants {
  deleteAllParticipants {
    count
    message
  }
}`,
    variables: () => ({}),
    validate: (res) => typeof res.data?.deleteAllParticipants?.count === 'number'
  }
];

interface TestResultState {
  status: 'IDLE' | 'RUNNING' | 'PASSED' | 'FAILED';
  durationMs?: number;
  result?: ExecutionResult;
  variablesSent?: any;
}

export const TestSuite: React.FC = () => {
  const [results, setResults] = useState<Record<string, TestResultState>>({});
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [expandedTest, setExpandedTest] = useState<string | null>(null);

  const runSingleTest = async (test: TestCase) => {
    setResults((prev) => ({
      ...prev,
      [test.id]: { status: 'RUNNING' }
    }));

    // Ensure database has minimal required entities for this specific test
    const currentState = db.getState();
    if (currentState.users.length === 0 && !test.name.includes('deleteAll')) {
      db.resetToDefaults();
    }

    const state = db.getState();
    const vars = test.variables(state);

    const execRes = await runQuery(test.query, vars);
    const passed = test.validate(execRes);

    setResults((prev) => ({
      ...prev,
      [test.id]: {
        status: passed ? 'PASSED' : 'FAILED',
        durationMs: execRes.durationMs,
        result: execRes,
        variablesSent: vars
      }
    }));
  };

  const runAllTests = async () => {
    setIsRunningAll(true);
    // Reset data first to ensure clean state
    db.resetToDefaults();

    // Order of execution to ensure relational integrity before deleteAll:
    // 1. Adds & Updates & Single Deletes
    // 2. DeleteAlls at the end
    const sortedTests = [
      'test-add-user',
      'test-update-user',
      'test-delete-user',
      'test-add-location',
      'test-update-location',
      'test-delete-location',
      'test-add-event',
      'test-update-event',
      'test-delete-event',
      'test-add-participant',
      'test-update-participant',
      'test-delete-participant',
      'test-delete-all-participants',
      'test-delete-all-events',
      'test-delete-all-locations',
      'test-delete-all-users'
    ];

    for (const testId of sortedTests) {
      const test = testDefinitions.find((t) => t.id === testId);
      if (!test) continue;

      setResults((prev) => ({
        ...prev,
        [test.id]: { status: 'RUNNING' }
      }));

      // Small pause for realistic visual execution
      await new Promise((resolve) => setTimeout(resolve, 80));

      const state = db.getState();
      const vars = test.variables(state);
      const execRes = await runQuery(test.query, vars);
      const passed = test.validate(execRes);

      setResults((prev) => ({
        ...prev,
        [test.id]: {
          status: passed ? 'PASSED' : 'FAILED',
          durationMs: execRes.durationMs,
          result: execRes,
          variablesSent: vars
        }
      }));
    }

    // Automatically re-seed initial data so the user can continue exploring the app
    db.resetToDefaults();
    setIsRunningAll(false);
  };

  const passedCount = Object.values(results).filter((r) => r.status === 'PASSED').length;
  const totalTests = testDefinitions.length;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Test Suite Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/60 via-slate-900 to-indigo-950/60 border border-purple-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-xs font-semibold rounded-md bg-purple-500/20 text-purple-300 border border-purple-500/30">
              Enes Öztürk • Otomatik Test Doğrulama
            </span>
            <span className="text-xs text-slate-400">Ödev 2 Tam Kapsam</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">
            16/16 GraphQL Mutation Test Paketi
          </h2>
          <p className="text-xs text-slate-400 max-w-xl">
            Ödev gereksinimlerinde belirtilen tüm User, Event, Location ve Participant CRUD + DeleteAll
            mutation&apos;larını canlı GraphQL motoru üzerinde doğrular.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={runAllTests}
            disabled={isRunningAll}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95 disabled:opacity-50"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isRunningAll ? 'Testler Çalışıyor...' : 'Tüm 16 Testi Başlat'}</span>
          </button>
        </div>
      </div>

      {/* Progress & Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Doğrulanan Mutation</span>
          <div className="text-2xl font-bold text-white mt-1">
            <span className="text-emerald-400">{passedCount}</span> / {totalTests}
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-300"
              style={{ width: `${(passedCount / totalTests) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">User Mutationları</span>
          <div className="text-sm font-semibold text-pink-400 mt-1">
            add, update, delete, deleteAll
          </div>
          <span className="text-[11px] text-slate-500">4 adet hazır</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Event & Location</span>
          <div className="text-sm font-semibold text-purple-400 mt-1">
            add, update, delete, deleteAll
          </div>
          <span className="text-[11px] text-slate-500">8 adet hazır</span>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
          <span className="text-xs text-slate-400">Participant Mutationları</span>
          <div className="text-sm font-semibold text-indigo-400 mt-1">
            add, update, delete, deleteAll
          </div>
          <span className="text-[11px] text-slate-500">4 adet hazır</span>
        </div>
      </div>

      {/* Test List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 px-1">
          <span className="font-semibold uppercase tracking-wider text-slate-300">
            Mutation Testleri ({totalTests})
          </span>
          <span>Her test gerçek GraphQL şeması üzerinde icra edilir</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {testDefinitions.map((test) => {
            const testResult = results[test.id];
            const isExpanded = expandedTest === test.id;

            const badgeColor =
              test.entity === 'User'
                ? 'bg-pink-500/10 text-pink-400 border-pink-500/20'
                : test.entity === 'Event'
                ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                : test.entity === 'Location'
                ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

            return (
              <div
                key={test.id}
                className={`p-4 rounded-xl border transition-all ${
                  testResult?.status === 'PASSED'
                    ? 'bg-slate-900/90 border-emerald-500/30'
                    : testResult?.status === 'FAILED'
                    ? 'bg-slate-900/90 border-rose-500/40'
                    : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 text-[10px] font-semibold rounded border ${badgeColor}`}>
                        {test.entity}
                      </span>
                      <h3 className="text-xs font-mono font-bold text-white">
                        {test.name}
                      </h3>
                    </div>
                    <p className="text-xs text-slate-400">{test.description}</p>
                  </div>

                  {/* Status Indicator */}
                  <div className="flex items-center gap-2 shrink-0">
                    {testResult?.status === 'PASSED' && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Başarılı
                      </span>
                    )}

                    {testResult?.status === 'FAILED' && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        <XCircle className="w-3.5 h-3.5" />
                        Hata
                      </span>
                    )}

                    {testResult?.status === 'RUNNING' && (
                      <span className="flex items-center gap-1 text-[11px] font-semibold text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20 animate-pulse">
                        <Clock className="w-3.5 h-3.5" />
                        Çalışıyor...
                      </span>
                    )}

                    {(!testResult || testResult.status === 'IDLE') && (
                      <span className="text-[11px] text-slate-500">Hazır</span>
                    )}

                    <button
                      onClick={() => runSingleTest(test)}
                      disabled={testResult?.status === 'RUNNING'}
                      title="Sadece bu testi çalıştır"
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                    >
                      <Play className="w-3 h-3 fill-current" />
                    </button>
                  </div>
                </div>

                {/* Duration & Details toggle */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[11px] text-slate-500">
                  <span className="flex items-center gap-1">
                    {testResult?.durationMs !== undefined ? (
                      <>
                        <Clock className="w-3 h-3" />
                        {testResult.durationMs} ms
                      </>
                    ) : (
                      'Henüz çalıştırılmadı'
                    )}
                  </span>

                  <button
                    onClick={() => setExpandedTest(isExpanded ? null : test.id)}
                    className="flex items-center gap-1 text-purple-400 hover:text-purple-300 font-medium"
                  >
                    <Code className="w-3 h-3" />
                    <span>{isExpanded ? 'Detayları Gizle' : 'Payload & Yanıt'}</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>
                </div>

                {/* Expanded Payload & Result details */}
                {isExpanded && (
                  <div className="mt-3 space-y-2 pt-2 border-t border-slate-800 text-[11px]">
                    <div>
                      <span className="text-slate-400 font-semibold">Gönderilen Query:</span>
                      <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-emerald-400 font-mono text-[10px] overflow-x-auto mt-1">
                        {test.query}
                      </pre>
                    </div>

                    {testResult?.variablesSent && (
                      <div>
                        <span className="text-slate-400 font-semibold">Variables:</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-amber-300 font-mono text-[10px] overflow-x-auto mt-1">
                          {JSON.stringify(testResult.variablesSent, null, 2)}
                        </pre>
                      </div>
                    )}

                    {testResult?.result && (
                      <div>
                        <span className="text-slate-400 font-semibold">GraphQL Yanıtı:</span>
                        <pre className="bg-slate-950 p-2 rounded border border-slate-800 text-slate-200 font-mono text-[10px] overflow-x-auto mt-1">
                          {JSON.stringify(testResult.result.data || testResult.result.errors, null, 2)}
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
