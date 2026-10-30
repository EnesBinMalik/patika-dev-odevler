import React, { useState, useEffect } from 'react';
import {
  CheckCircle2,
  XCircle,
  Play,
  Award,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  RotateCcw,
  Sparkles,
  Layers,
  ArrowRight,
} from 'lucide-react';

interface TestItem {
  id: string;
  title: string;
  category: 'Sorgu' | 'İlişki' | 'İmza';
  requirement: string;
  query: string;
  validator: (data: any) => { pass: boolean; reason: string; snippet?: string };
}

const HOMEWORK_TESTS: TestItem[] = [
  {
    id: 'test-users',
    title: '1. query users {}',
    category: 'Sorgu',
    requirement: 'Tüm kullanıcıları listeleme sorgusu çalışmalıdır.',
    query: `query {
  users {
    id
    username
    email
  }
}`,
    validator: (data) => {
      const users = data?.users;
      if (Array.isArray(users) && users.length > 0 && users[0].username) {
        return {
          pass: true,
          reason: `${users.length} kullanıcı başarıyla getirildi (örn: ${users[0].username})`,
          snippet: JSON.stringify(users.slice(0, 2), null, 2),
        };
      }
      return { pass: false, reason: 'Kullanıcı listesi boş veya geçersiz formatta döndü.' };
    },
  },
  {
    id: 'test-user-id',
    title: '2. query user(id: 1) {}',
    category: 'Sorgu',
    requirement: 'ID bazlı tekil kullanıcı kaydı getirme sorgusu çalışmalıdır.',
    query: `query {
  user(id: 1) {
    id
    username
    email
    fullName
  }
}`,
    validator: (data) => {
      const u = data?.user;
      if (u && String(u.id) === '1' && u.username) {
        return {
          pass: true,
          reason: `ID 1 kullanıcısı bulundu: ${u.username} (${u.email})`,
          snippet: JSON.stringify(u, null, 2),
        };
      }
      return { pass: false, reason: 'ID 1 kullanıcısı bulunamadı.' };
    },
  },
  {
    id: 'test-events',
    title: '3. query events {}',
    category: 'Sorgu',
    requirement: 'Tüm etkinlikleri listeleme sorgusu çalışmalıdır.',
    query: `query {
  events {
    id
    title
    date
  }
}`,
    validator: (data) => {
      const events = data?.events;
      if (Array.isArray(events) && events.length > 0 && events[0].title) {
        return {
          pass: true,
          reason: `${events.length} etkinlik listelendi (örn: ${events[0].title})`,
          snippet: JSON.stringify(events.slice(0, 2), null, 2),
        };
      }
      return { pass: false, reason: 'Etkinlikler getirilemedi.' };
    },
  },
  {
    id: 'test-event-id',
    title: '4. query event(id: 1) {}',
    category: 'Sorgu',
    requirement: 'ID bazlı tekil etkinlik kaydı getirme sorgusu çalışmalıdır.',
    query: `query {
  event(id: 1) {
    id
    title
    date
    from
    to
  }
}`,
    validator: (data) => {
      const ev = data?.event;
      if (ev && String(ev.id) === '1' && ev.title) {
        return {
          pass: true,
          reason: `ID 1 etkinliği bulundu: ${ev.title} (${ev.date})`,
          snippet: JSON.stringify(ev, null, 2),
        };
      }
      return { pass: false, reason: 'ID 1 etkinliği bulunamadı.' };
    },
  },
  {
    id: 'test-special-events-query',
    title: '5. 🎯 Ödev Özel Sorgusu (events with relations)',
    category: 'İlişki',
    requirement:
      'Ödev metninde özellikle istenen "sorgu olayları { id Başlık user { id kullanıcı adı } pariticipants { id kullanıcı adı } konum { id İsim } }" çalışmalıdır.',
    query: `query SpecialHomeworkQuery {
  events {
    id
    title
    user {
      id
      username
    }
    participants {
      id
      username
    }
    location {
      id
      name
    }
  }
}`,
    validator: (data) => {
      const events = data?.events;
      if (Array.isArray(events) && events.length > 0) {
        const first = events[0];
        const hasUser = first?.user?.id && first?.user?.username;
        const hasLocation = first?.location?.id && first?.location?.name;
        const hasParticipants = Array.isArray(first?.participants);

        if (hasUser && hasLocation && hasParticipants) {
          return {
            pass: true,
            reason: `Özel sorgu tüm ilişkilerle (User: ${first.user.username}, Location: ${first.location.name}, ${first.participants.length} Katılımcı) eksiksiz çözümlendi!`,
            snippet: JSON.stringify(first, null, 2),
          };
        }
      }
      return { pass: false, reason: 'Özel sorguda ilişkisel alanlar tam çözümlenemedi.' };
    },
  },
  {
    id: 'test-locations',
    title: '6. query locations {}',
    category: 'Sorgu',
    requirement: 'Tüm lokasyonları listeleme sorgusu çalışmalıdır.',
    query: `query {
  locations {
    id
    name
    address
  }
}`,
    validator: (data) => {
      const locs = data?.locations;
      if (Array.isArray(locs) && locs.length > 0 && locs[0].name) {
        return {
          pass: true,
          reason: `${locs.length} lokasyon listelendi (örn: ${locs[0].name})`,
          snippet: JSON.stringify(locs.slice(0, 2), null, 2),
        };
      }
      return { pass: false, reason: 'Lokasyonlar getirilemedi.' };
    },
  },
  {
    id: 'test-location-id',
    title: '7. query location(id: 1) {}',
    category: 'Sorgu',
    requirement: 'ID bazlı tekil konum getirme sorgusu çalışmalıdır.',
    query: `query {
  location(id: 1) {
    id
    name
    address
    lat
    lng
  }
}`,
    validator: (data) => {
      const loc = data?.location;
      if (loc && String(loc.id) === '1' && loc.name) {
        return {
          pass: true,
          reason: `ID 1 konumu bulundu: ${loc.name}`,
          snippet: JSON.stringify(loc, null, 2),
        };
      }
      return { pass: false, reason: 'ID 1 konumu bulunamadı.' };
    },
  },
  {
    id: 'test-participants',
    title: '8. query participants {}',
    category: 'Sorgu',
    requirement: 'Tüm katılımcıları listeleme sorgusu çalışmalıdır.',
    query: `query {
  participants {
    id
    user_id
    event_id
    username
  }
}`,
    validator: (data) => {
      const parts = data?.participants;
      if (Array.isArray(parts) && parts.length > 0) {
        return {
          pass: true,
          reason: `${parts.length} katılımcı kaydı listelendi.`,
          snippet: JSON.stringify(parts.slice(0, 2), null, 2),
        };
      }
      return { pass: false, reason: 'Katılımcılar getirilemedi.' };
    },
  },
  {
    id: 'test-participant-id',
    title: '9. query participant(id: 1) {}',
    category: 'Sorgu',
    requirement: 'ID bazlı tekil katılımcı getirme sorgusu çalışmalıdır.',
    query: `query {
  participant(id: 1) {
    id
    user_id
    event_id
    username
    user {
      username
    }
    event {
      title
    }
  }
}`,
    validator: (data) => {
      const p = data?.participant;
      if (p && String(p.id) === '1') {
        return {
          pass: true,
          reason: `ID 1 katılımcısı bulundu (User: ${p.username}, Etkinlik: ${p.event?.title})`,
          snippet: JSON.stringify(p, null, 2),
        };
      }
      return { pass: false, reason: 'ID 1 katılımcısı bulunamadı.' };
    },
  },
  {
    id: 'test-relation-user-events',
    title: '10. İlişki: Bir User → Bir/Birden Fazla Event',
    category: 'İlişki',
    requirement: "Bir User'a ait bir veya birden fazla Event olabilir kuralı doğrulanmalıdır.",
    query: `query {
  user(id: 1) {
    username
    events {
      id
      title
    }
  }
}`,
    validator: (data) => {
      const events = data?.user?.events;
      if (Array.isArray(events) && events.length >= 1) {
        return {
          pass: true,
          reason: `User 1 (${data.user.username}) kullanıcısının ${events.length} adet etkinliği ilişkili bulundu.`,
          snippet: JSON.stringify(events, null, 2),
        };
      }
      return { pass: false, reason: 'User -> Events ilişkisi boş döndü.' };
    },
  },
  {
    id: 'test-signature',
    title: '11. ✍️ Enes Öztürk İmzası',
    category: 'İmza',
    requirement: '"ENES öztürk imzalı olsun" şartı şemada ve veri setinde doğrulanmalıdır.',
    query: `query {
  signature {
    author
    assignment
    version
  }
  user(id: 1) {
    username
    fullName
  }
}`,
    validator: (data) => {
      const author = data?.signature?.author;
      if (author && author.toLowerCase().includes('enes') && author.toLowerCase().includes('öztürk')) {
        return {
          pass: true,
          reason: `İmza doğrulandı: "${author}" - ${data.signature.assignment}`,
          snippet: JSON.stringify(data.signature, null, 2),
        };
      }
      return { pass: false, reason: 'Enes Öztürk imzası bulunamadı.' };
    },
  },
];

interface HomeworkVerifierProps {
  onExecute: (query: string) => Promise<{ result: any; duration: number }>;
  onOpenInPlayground: (query: string) => void;
}

export const HomeworkVerifier: React.FC<HomeworkVerifierProps> = ({
  onExecute,
  onOpenInPlayground,
}) => {
  const [results, setResults] = useState<
    Record<
      string,
      {
        status: 'idle' | 'running' | 'pass' | 'fail';
        reason?: string;
        snippet?: string;
        duration?: number;
      }
    >
  >({});
  const [runningAll, setRunningAll] = useState(false);
  const [selectedSnippet, setSelectedSnippet] = useState<{ title: string; json: string } | null>(
    null
  );

  // Auto-run verification on load
  useEffect(() => {
    runAllTests();
  }, []);

  const runSingleTest = async (test: TestItem) => {
    setResults((prev) => ({
      ...prev,
      [test.id]: { status: 'running' },
    }));

    try {
      const { result, duration } = await onExecute(test.query);
      if (result.errors && !result.data) {
        setResults((prev) => ({
          ...prev,
          [test.id]: {
            status: 'fail',
            reason: result.errors[0]?.message || 'GraphQL hata döndürdü.',
            duration,
          },
        }));
        return;
      }

      const check = test.validator(result.data);
      setResults((prev) => ({
        ...prev,
        [test.id]: {
          status: check.pass ? 'pass' : 'fail',
          reason: check.reason,
          snippet: check.snippet,
          duration,
        },
      }));
    } catch (err: any) {
      setResults((prev) => ({
        ...prev,
        [test.id]: {
          status: 'fail',
          reason: err.message || 'Ağ hatası oluştu.',
          duration: 0,
        },
      }));
    }
  };

  const runAllTests = async () => {
    setRunningAll(true);
    for (const test of HOMEWORK_TESTS) {
      await runSingleTest(test);
    }
    setRunningAll(false);
  };

  const passedCount = Object.values(results).filter((r) => r.status === 'pass').length;
  const totalCount = HOMEWORK_TESTS.length;
  const scorePercent = Math.round((passedCount / totalCount) * 100);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Top Banner & Grade Card */}
      <div className="relative overflow-hidden bg-gradient-to-br from-zinc-900 via-zinc-900 to-purple-950/40 rounded-3xl border border-zinc-800 p-6 sm:p-8 shadow-2xl">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-xl shadow-purple-600/30 shrink-0">
              <Award className="w-9 h-9 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-bold text-white">
                  Ödev 1 Doğrulama Robotu
                </h1>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  Otomatik Test
                </span>
              </div>
              <p className="text-sm text-zinc-400 mt-1 max-w-2xl">
                Tüm zorunlu GraphQL sorgularını (users, user(id), events, event(id), locations,
                location(id), participants, participant(id), ilişkisel ödev sorgusu ve Enes Öztürk
                imzası) test eder.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            {/* Score pill */}
            <div className="bg-zinc-950/80 border border-zinc-800 px-5 py-3 rounded-2xl flex items-center gap-4 w-full sm:w-auto justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
                  Ödev Puanı
                </div>
                <div className="text-2xl font-extrabold text-white">
                  <span className={scorePercent === 100 ? 'text-emerald-400' : 'text-purple-400'}>
                    {passedCount}
                  </span>
                  <span className="text-zinc-600"> / {totalCount}</span>
                </div>
              </div>
              <div className="text-right">
                <div className="text-[11px] uppercase tracking-wider text-zinc-500 font-mono">
                  Başarı
                </div>
                <div className="text-lg font-bold text-emerald-400">{scorePercent}%</div>
              </div>
            </div>

            <button
              onClick={runAllTests}
              disabled={runningAll}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-semibold text-sm px-5 py-3 rounded-2xl shadow-xl shadow-purple-600/25 transition disabled:opacity-50"
            >
              <RotateCcw className={`w-4 h-4 ${runningAll ? 'animate-spin' : ''}`} />
              <span>{runningAll ? 'Testler Koşuluyor...' : 'Tümünü Tekrar Test Et'}</span>
            </button>
          </div>
        </div>

        {/* Author watermark */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-zinc-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Hazırlayan & İmza:</span>
            <span className="font-semibold text-emerald-300">Enes Öztürk</span>
          </div>
          <span className="font-mono text-zinc-500">
            GraphQL Server Spec v1.0 • Express + graphql.js
          </span>
        </div>
      </div>

      {/* Tests Grid */}
      <div className="grid grid-cols-1 gap-3">
        {HOMEWORK_TESTS.map((test, index) => {
          const res = results[test.id] || { status: 'idle' };
          return (
            <div
              key={test.id}
              className="bg-zinc-900/80 hover:bg-zinc-900 transition rounded-2xl border border-zinc-800 p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start gap-3.5 flex-1">
                {/* Status Icon */}
                <div className="mt-0.5 shrink-0">
                  {res.status === 'pass' && (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                  )}
                  {res.status === 'fail' && <XCircle className="w-5 h-5 text-rose-400" />}
                  {res.status === 'running' && (
                    <div className="w-5 h-5 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
                  )}
                  {res.status === 'idle' && (
                    <div className="w-5 h-5 rounded-full border border-zinc-700 bg-zinc-800" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono font-semibold text-sm text-zinc-200">
                      {test.title}
                    </span>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-zinc-800 text-zinc-400 border border-zinc-700/60">
                      {test.category}
                    </span>
                    {res.duration !== undefined && (
                      <span className="text-[11px] font-mono text-zinc-500">
                        ({res.duration}ms)
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-zinc-400 mt-1">{test.requirement}</p>

                  {res.reason && (
                    <div
                      className={`text-xs mt-2 font-mono flex items-center gap-1.5 ${
                        res.status === 'pass' ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      <span>↳ {res.reason}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                {res.snippet && (
                  <button
                    onClick={() => setSelectedSnippet({ title: test.title, json: res.snippet! })}
                    className="px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-mono transition"
                  >
                    JSON Çıktısı
                  </button>
                )}
                <button
                  onClick={() => onOpenInPlayground(test.query)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-purple-950/60 hover:bg-purple-900/60 text-purple-300 border border-purple-800/40 font-medium transition"
                  title="Playground IDE'sinde Aç"
                >
                  <Play className="w-3 h-3" />
                  <span>IDE'de Aç</span>
                </button>
                <button
                  onClick={() => runSingleTest(test)}
                  disabled={res.status === 'running'}
                  className="p-1.5 rounded-lg text-xs text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
                  title="Bu Testi Yeniden Çalıştır"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* JSON Snippet Modal */}
      {selectedSnippet && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl max-w-2xl w-full max-h-[80vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950">
              <span className="font-mono text-sm font-semibold text-zinc-200">
                {selectedSnippet.title} - Test Yanıtı
              </span>
              <button
                onClick={() => setSelectedSnippet(null)}
                className="text-zinc-400 hover:text-white text-sm px-2 py-1 rounded"
              >
                ✕ Kapat
              </button>
            </div>
            <pre className="p-4 overflow-auto font-mono text-xs text-emerald-400 bg-zinc-950 flex-1">
              {selectedSnippet.json}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};
