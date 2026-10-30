import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2, BookOpen, Layers } from 'lucide-react';
import { typeDefs } from '../graphql/schema.ts';

const SAMPLE_RESOLVER_CODE = `import { pubsub } from './pubsub';
import { withFilter } from 'graphql-subscriptions';

const EVENTS = {
  USER_CREATED: 'USER_CREATED',
  EVENT_CREATED: 'EVENT_CREATED',
  PARTICIPANT_ADDED: 'PARTICIPANT_ADDED',
};

export const resolvers = {
  Query: {
    users: () => users,
    user: (parent, args) => users.find(u => u.id === args.id),
    events: () => events,
    event: (parent, args) => events.find(e => e.id === args.id),
    locations: () => locations,
    location: (parent, args) => locations.find(l => l.id === args.id),
    participants: () => participants,
    participant: (parent, args) => participants.find(p => p.id === args.id),
  },

  User: {
    events: (parent) => events.filter(e => e.user_id === parent.id),
    participations: (parent) => participants.filter(p => p.user_id === parent.id),
  },

  Event: {
    user: (parent) => users.find(u => u.id === parent.user_id),
    location: (parent) => locations.find(l => l.id === parent.location_id),
    participants: (parent) => participants.filter(p => p.event_id === parent.id),
  },

  Participant: {
    user: (parent) => users.find(u => u.id === parent.user_id),
    event: (parent) => events.find(e => e.id === parent.event_id),
  },

  Mutation: {
    // 1. Yeni User oluşturma ve Subscription tetikleme
    createUser: (parent, { data }) => {
      const newUser = { id: String(Date.now()), ...data };
      users.push(newUser);
      pubsub.publish(EVENTS.USER_CREATED, { userCreated: newUser });
      return newUser;
    },

    // 2. Yeni Event oluşturma ve Subscription tetikleme
    createEvent: (parent, { data }) => {
      const newEvent = { id: String(Date.now()), ...data };
      events.push(newEvent);
      pubsub.publish(EVENTS.EVENT_CREATED, { eventCreated: newEvent });
      return newEvent;
    },

    // 3. Bir Event'e Participant ekleme ve Subscription tetikleme
    addParticipant: (parent, { data }) => {
      const newParticipant = { id: String(Date.now()), ...data };
      participants.push(newParticipant);
      pubsub.publish(EVENTS.PARTICIPANT_ADDED, { participantAdded: newParticipant });
      return newParticipant;
    },
  },

  Subscription: {
    // Ödev 3 Gereksinimi: subscription userCreated
    userCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.USER_CREATED),
    },

    // Ödev 3 Gereksinimi: subscription eventCreated
    eventCreated: {
      subscribe: () => pubsub.asyncIterator(EVENTS.EVENT_CREATED),
    },

    // Ödev 3 Gereksinimi: subscription participantAdded
    // Opsiyonel event_id parametresi ile belirli bir etkinliğe filtreleme yapılabilir
    participantAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(EVENTS.PARTICIPANT_ADDED),
        (payload, variables) => {
          if (!variables || !variables.event_id) {
            return true;
          }
          return String(payload.participantAdded.event_id) === String(variables.event_id);
        }
      ),
    },
  },
};`;

export const SchemaAndDocs: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'schema' | 'resolvers' | 'docs'>('schema');
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [copiedResolvers, setCopiedResolvers] = useState(false);

  const copySchema = () => {
    navigator.clipboard.writeText(typeDefs.trim());
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 1500);
  };

  const copyResolvers = () => {
    navigator.clipboard.writeText(SAMPLE_RESOLVER_CODE);
    setCopiedResolvers(true);
    setTimeout(() => setCopiedResolvers(false), 1500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Signature */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
                Ödev 3 Proje Belgeleri & Kaynak Kod
              </span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-xs text-slate-400 font-mono">Enes Öztürk İmzalı</span>
            </div>
            <h3 className="text-lg font-semibold text-white tracking-tight">
              GraphQL Subscriptions Mimari Raporu
            </h3>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Bu projede GraphQL Subscriptions mimarisi, In-Memory PubSub kanalları ve AsyncIterator
              yapısı kurularak <code className="text-indigo-300">userCreated</code>,{' '}
              <code className="text-indigo-300">eventCreated</code> ve{' '}
              <code className="text-indigo-300">participantAdded</code> operasyonları eksiksiz
              çalışır duruma getirilmiştir.
            </p>
          </div>

          <div className="flex items-center gap-2 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
            <button
              onClick={() => setActiveSubTab('schema')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'schema'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              schema.graphql
            </button>
            <button
              onClick={() => setActiveSubTab('resolvers')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'resolvers'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              resolvers.js
            </button>
            <button
              onClick={() => setActiveSubTab('docs')}
              className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                activeSubTab === 'docs'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Gereksinim Kontrolü
            </button>
          </div>
        </div>
      </div>

      {/* Schema View */}
      {activeSubTab === 'schema' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span>schema.graphql (Type Definitions)</span>
            </div>
            <button
              onClick={copySchema}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {copiedSchema ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Şemayı Kopyala</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono text-emerald-300 overflow-x-auto leading-relaxed bg-slate-950/70">
            {typeDefs.trim()}
          </pre>
        </div>
      )}

      {/* Resolvers View */}
      {activeSubTab === 'resolvers' && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
          <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-300 font-mono">
              <FileCode className="w-4 h-4 text-purple-400" />
              <span>resolvers.js (Query, Mutation & Subscription Resolvers)</span>
            </div>
            <button
              onClick={copyResolvers}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              {copiedResolvers ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Çözücü Kodunu Kopyala</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-5 text-xs font-mono text-indigo-300 overflow-x-auto leading-relaxed bg-slate-950/70">
            {SAMPLE_RESOLVER_CODE}
          </pre>
        </div>
      )}

      {/* Docs & Requirements Breakdown */}
      {activeSubTab === 'docs' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-semibold text-white">subscription userCreated</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-cyan-300">createUser</code> mutasyonu çağrıldığında yeni
                kullanıcı nesnesi In-Memory veritabanına eklenir ve anında{' '}
                <code className="text-cyan-300">USER_CREATED</code> kanalına yayınlanır.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-semibold text-white">subscription eventCreated</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-amber-300">createEvent</code> mutasyonu çağrıldığında yeni
                etkinlik kaydı oluşturulur ve bağlı olduğu lokasyon/kullanıcı ilişkileriyle birlikte{' '}
                <code className="text-amber-300">EVENT_CREATED</code> kanalına iletilir.
              </p>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
              <div className="flex items-center gap-2 mb-2 text-emerald-400">
                <CheckCircle2 className="w-5 h-5 shrink-0" />
                <h4 className="text-sm font-semibold text-white">subscription participantAdded</h4>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                <code className="text-purple-300">addParticipant</code> mutasyonu çağrıldığında hem
                genel dinleyicilere hem de <code className="text-purple-300">withFilter</code>{' '}
                sayesinde belirli bir <code className="text-purple-300">event_id</code> dinleyen
                özel abonelere iletilir.
              </p>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
            <h4 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              <span>PubSub & Subscription Akış Prensibi</span>
            </h4>
            <div className="space-y-3 text-xs text-slate-300 leading-relaxed font-mono">
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-indigo-400 font-bold">1. Abonelik Başlatma:</span> İstemci{' '}
                <span className="text-emerald-300">subscription &#123; userCreated &#125;</span>{' '}
                sorgusunu açar. Resolver katmanında{' '}
                <span className="text-indigo-300">pubsub.asyncIterator('USER_CREATED')</span>{' '}
                döndürülür.
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-amber-400 font-bold">2. Mutasyon Yürütme:</span> İstemci{' '}
                <span className="text-emerald-300">mutation &#123; createUser(...) &#125;</span>{' '}
                gönderir. Resolver yeni kaydı kaydeder ve{' '}
                <span className="text-amber-300">pubsub.publish('USER_CREATED', ...)</span> çağrısı
                yapar.
              </div>
              <div className="p-3 bg-slate-950 rounded border border-slate-800">
                <span className="text-purple-400 font-bold">3. Gerçek Zamanlı Dağıtım:</span> In-Memory
                PubSub, bekleyen AsyncIterator kuyruğuna paketi iter ve GraphQL Engine sorgudaki alt
                alanları (id, name, email) resolve ederek istemciye anında iletir.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
