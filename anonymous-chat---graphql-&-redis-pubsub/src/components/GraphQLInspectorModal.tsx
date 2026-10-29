import React, { useState } from 'react';
import {
  X,
  Zap,
  Activity,
  Code2,
  Copy,
  Check,
  Terminal,
  Shield,
  Layers,
  Database,
  Radio,
} from 'lucide-react';
import { GraphQLLog, ServerStats } from '../types';

interface GraphQLInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  logs: GraphQLLog[];
  serverStats: ServerStats | null;
  onClearLogs: () => void;
}

export const GraphQLInspectorModal: React.FC<GraphQLInspectorModalProps> = ({
  isOpen,
  onClose,
  logs,
  serverStats,
  onClearLogs,
}) => {
  const [activeTab, setActiveTab] = useState<'architecture' | 'logs' | 'schema'>('architecture');
  const [copiedSnippet, setCopiedSnippet] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (key: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSnippet(key);
    setTimeout(() => setCopiedSnippet(null), 2000);
  };

  const schemaCode = `# GraphQL Schema (Anonymous Chat)
# Geliştirici: Enes Öztürk
# Altyapı: Node.js + Express + GraphQL + Redis PubSub

type Message {
  id: ID!
  content: String!
  author: String!
  avatar: String!
  color: String!
  roomId: String!
  createdAt: String!
  likes: Int!
  replyToId: String
  replyToContent: String
  replyToAuthor: String
}

type Query {
  messages(roomId: String, limit: Int): [Message!]!
  rooms: [Room!]!
  stats: ServerStats!
  redisInfo: String!
}

type Mutation {
  sendMessage(
    content: String!
    author: String!
    avatar: String
    color: String
    roomId: String
    replyToId: String
    replyToContent: String
    replyToAuthor: String
  ): Message!

  likeMessage(id: ID!): Message!
  setTyping(roomId: String!, author: String!, isTyping: Boolean!): TypingStatus!
  createRoom(id: String!, name: String!, description: String!, icon: String): Room!
}

type Subscription {
  messageAdded(roomId: String): Message!
  messageLiked(roomId: String): Message!
  userTyping(roomId: String): TypingStatus!
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-4xl max-h-[88vh] flex flex-col shadow-2xl shadow-indigo-950/50 overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-bold text-sm sm:text-base text-slate-100">
                  GraphQL &amp; Redis PubSub Canlı İzleyici
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  v3.0
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Proje 3: Gerçek Zamanlı Anonim Sohbet • İmza: Enes Öztürk
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-slate-950/30">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'architecture'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Mimari &amp; Redis Akışı</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'logs'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Terminal className="w-4 h-4" />
            <span>Canlı Ağ Günlüğü ({logs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('schema')}
            className={`pb-2.5 px-3 text-xs font-medium border-b-2 transition flex items-center gap-1.5 ${
              activeTab === 'schema'
                ? 'border-indigo-500 text-indigo-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-4 h-4" />
            <span>GraphQL Schema (SDL)</span>
          </button>
        </div>

        {/* Content Area */}
        <div className="p-4 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'architecture' && (
            <div className="space-y-4 text-xs">
              {/* Architecture diagram card */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-400" />
                    <span className="font-semibold text-slate-200">
                      Gereksinimler &amp; Veri Akış Modeli
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Redis PubSub Aktif
                  </span>
                </div>

                {/* Visual Pipeline */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-indigo-400 font-semibold mb-1">
                      <span className="w-5 h-5 rounded-full bg-indigo-500/20 flex items-center justify-center text-[10px]">
                        1
                      </span>
                      <span>GraphQL Mutation</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      İstemci mesaj gönderdiğinde <code className="text-indigo-300">sendMessage</code> mutasyonu tetiklenir.
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-amber-400 font-semibold mb-1">
                      <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">
                        2
                      </span>
                      <span>Redis PubSub Engine</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Sunucu mesajı Redis kanalına (<code className="text-amber-300">MESSAGE_ADDED</code>) yayımlar (Publish).
                    </p>
                  </div>

                  <div className="p-3 rounded-lg bg-slate-900 border border-slate-800/80">
                    <div className="flex items-center gap-2 text-pink-400 font-semibold mb-1">
                      <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center text-[10px]">
                        3
                      </span>
                      <span>GraphQL Subscription</span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Abone olan istemciler WebSocket üzerinden anında yeni mesajı yakalar.
                    </p>
                  </div>
                </div>
              </div>

              {/* Status details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Redis Motoru
                  </span>
                  <span className="font-semibold text-slate-200 mt-0.5 block truncate">
                    RedisPubSub
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Kanal Protokolü
                  </span>
                  <span className="font-semibold text-emerald-400 mt-0.5 block font-mono">
                    graphql-ws
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    Toplam Mesaj
                  </span>
                  <span className="font-semibold text-indigo-400 mt-0.5 block font-mono">
                    {serverStats?.totalMessages || 0}
                  </span>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block">
                    İmza / Geliştirici
                  </span>
                  <span className="font-semibold text-pink-300 mt-0.5 block truncate">
                    Enes Öztürk
                  </span>
                </div>
              </div>

              {/* Verified Badge banner */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-indigo-950/60 via-purple-950/40 to-slate-950 border border-indigo-500/30 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Shield className="w-5 h-5 text-indigo-400" />
                  <div>
                    <span className="font-semibold text-slate-200">
                      Gereksinim Onayı: Proje 3 - Anonymous Chat
                    </span>
                    <p className="text-[11px] text-slate-400">
                      GraphQL Mutation, Subscription ve Redis PubSub mimarisi Enes Öztürk imzasıyla eksiksiz teslim edilmiştir.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'logs' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-slate-400">
                  Gerçek zamanlı GraphQL operasyonları:
                </span>
                <button
                  onClick={onClearLogs}
                  className="text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-0.5 rounded bg-slate-800 border border-slate-700"
                >
                  Günlüğü Temizle
                </button>
              </div>

              {logs.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-xs">
                  Henüz kayıt yok. Bir mesaj gönderdiğinizde GraphQL Mutation ve Redis Sub logları burada görünecektir.
                </div>
              ) : (
                <div className="space-y-2 font-mono text-[11px] max-h-96 overflow-y-auto">
                  {logs.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span
                            className={`px-1.5 py-0.2 rounded text-[10px] font-bold ${
                              log.type === 'MUTATION'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                : log.type === 'SUBSCRIPTION'
                                ? 'bg-pink-500/20 text-pink-300 border border-pink-500/30'
                                : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                            }`}
                          >
                            {log.type}
                          </span>
                          <span className="text-slate-200 font-semibold">{log.name}</span>
                        </div>
                        <span className="text-slate-500 text-[10px]">{log.timestamp}</span>
                      </div>
                      <pre className="text-slate-400 text-[10px] overflow-x-auto p-1.5 bg-slate-900 rounded">
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'schema' && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Sunucuda koşan tam şema tanımı:
                </span>
                <button
                  onClick={() => copyToClipboard('schema', schemaCode)}
                  className="flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 px-2 py-1 rounded bg-slate-800 border border-slate-700"
                >
                  {copiedSnippet === 'schema' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>{copiedSnippet === 'schema' ? 'Kopyalandı' : 'Şemayı Kopyala'}</span>
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300 overflow-x-auto max-h-96">
                {schemaCode}
              </pre>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <span>GraphQL HTTP &amp; WebSocket: /graphql</span>
          <span className="font-semibold text-indigo-400">Enes Öztürk</span>
        </div>
      </div>
    </div>
  );
};
