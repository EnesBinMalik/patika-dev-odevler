import React, { useState } from 'react';
import {
  Layers,
  FileCode,
  Copy,
  Check,
  ArrowRight,
  Database,
  ExternalLink,
  Code2,
  Share2,
} from 'lucide-react';
import { schemaSDL } from '../graphql/schema';

export const SchemaViewer: React.FC = () => {
  const [viewMode, setViewMode] = useState<'visual' | 'sdl'>('visual');
  const [copied, setCopied] = useState(false);

  const copySdl = () => {
    navigator.clipboard.writeText(schemaSDL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900/90 border border-zinc-800 p-6 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-400" />
            <h1 className="text-xl font-bold text-white">GraphQL Şema & Tip Mimarisi</h1>
          </div>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            User, Event, Location ve Participant tipleri arasındaki 1-N ve N-1 ilişkisel mimari.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-zinc-950 p-1 rounded-xl border border-zinc-800 self-start sm:self-auto">
          <button
            onClick={() => setViewMode('visual')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === 'visual'
                ? 'bg-purple-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            İlişkisel Görsel Şema
          </button>
          <button
            onClick={() => setViewMode('sdl')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              viewMode === 'sdl'
                ? 'bg-purple-600 text-white shadow'
                : 'text-zinc-400 hover:text-white'
            }`}
          >
            Ham SDL Kodu
          </button>
        </div>
      </div>

      {viewMode === 'visual' ? (
        <div className="flex flex-col gap-8">
          {/* Relationship Flow diagram */}
          <div className="bg-zinc-900/60 rounded-3xl border border-zinc-800 p-6">
            <h3 className="text-sm font-semibold text-zinc-300 mb-4 flex items-center gap-2">
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>İlişki Akış Şeması (Entity-Relationship Flow)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              {/* User box */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-purple-500/30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs mb-2">
                  U
                </div>
                <div className="font-bold text-sm text-purple-300">User</div>
                <div className="text-[11px] text-zinc-400 mt-1">Etkinlik Oluşturan / Katılımcı</div>
                <div className="mt-3 text-[10px] font-mono text-purple-400 bg-purple-950/40 px-2 py-1 rounded">
                  events: [Event!]!
                </div>
              </div>

              {/* Arrow 1 */}
              <div className="hidden md:flex flex-col items-center justify-center text-zinc-500">
                <div className="text-xs font-mono mb-1">1 - N (Sahibi)</div>
                <div className="w-full h-0.5 bg-gradient-to-r from-purple-500 to-indigo-500 relative">
                  <span className="absolute right-0 -top-1 border-solid border-l-purple-500 border-l-4 border-y-transparent border-y-4 border-r-0"></span>
                </div>
              </div>

              {/* Event box */}
              <div className="bg-zinc-950 p-4 rounded-2xl border border-indigo-500/30 flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold text-xs mb-2">
                  E
                </div>
                <div className="font-bold text-sm text-indigo-300">Event</div>
                <div className="text-[11px] text-zinc-400 mt-1">Merkezi Etkinlik Modeli</div>
                <div className="mt-3 flex flex-col gap-1 w-full text-[10px] font-mono">
                  <span className="text-purple-400 bg-purple-950/40 px-2 py-0.5 rounded">
                    user: User!
                  </span>
                  <span className="text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded">
                    location: Location!
                  </span>
                  <span className="text-amber-400 bg-amber-950/40 px-2 py-0.5 rounded">
                    participants: [Participant!]!
                  </span>
                </div>
              </div>

              {/* Location & Participants */}
              <div className="flex flex-col gap-3">
                <div className="bg-zinc-950 p-3 rounded-2xl border border-emerald-500/30 text-left">
                  <div className="font-bold text-xs text-emerald-300 flex items-center justify-between">
                    <span>Location</span>
                    <span className="text-[10px] font-mono text-zinc-500">N - 1</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Etkinliğin Yapılacağı Yer</div>
                  <div className="text-[10px] font-mono text-emerald-400 mt-1">
                    events: [Event!]!
                  </div>
                </div>

                <div className="bg-zinc-950 p-3 rounded-2xl border border-amber-500/30 text-left">
                  <div className="font-bold text-xs text-amber-300 flex items-center justify-between">
                    <span>Participant</span>
                    <span className="text-[10px] font-mono text-zinc-500">1 - N</span>
                  </div>
                  <div className="text-[10px] text-zinc-400 mt-0.5">Etkinlik Katılım Kayıtları</div>
                  <div className="text-[10px] font-mono text-amber-400 mt-1">
                    user: User!, event: Event!
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Model Detail Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Card */}
            <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                  <h3 className="font-bold text-lg text-white font-mono">type User</h3>
                </div>
                <span className="text-xs font-mono text-purple-400 bg-purple-950/60 px-2.5 py-0.5 rounded-full border border-purple-800/50">
                  Model
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60 mt-2 font-mono text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">id</span>
                  <span className="text-purple-400 font-semibold">ID!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">username</span>
                  <span className="text-purple-400 font-semibold">String!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">email</span>
                  <span className="text-purple-400 font-semibold">String!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">fullName</span>
                  <span className="text-zinc-500">String</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-purple-950/20 px-2 rounded-lg my-1">
                  <span className="text-purple-300 font-semibold">events</span>
                  <span className="text-indigo-400 font-bold">[Event!]! (1 - N İlişki)</span>
                </div>
                <div className="py-2 flex justify-between items-center text-zinc-500 text-[11px]">
                  <span>Türkçe Takma Adlar</span>
                  <span>kullanici_adi, eposta, etkinlikler</span>
                </div>
              </div>
            </div>

            {/* Event Card */}
            <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
                  <h3 className="font-bold text-lg text-white font-mono">type Event</h3>
                </div>
                <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-0.5 rounded-full border border-indigo-800/50">
                  Model
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60 mt-2 font-mono text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">id</span>
                  <span className="text-indigo-400 font-semibold">ID!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">title</span>
                  <span className="text-indigo-400 font-semibold">String!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">date, from, to</span>
                  <span className="text-zinc-400">String</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-purple-950/20 px-2 rounded-lg my-1">
                  <span className="text-purple-300 font-semibold">user</span>
                  <span className="text-purple-400 font-bold">User! (Sahibi)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-emerald-950/20 px-2 rounded-lg my-1">
                  <span className="text-emerald-300 font-semibold">location</span>
                  <span className="text-emerald-400 font-bold">Location! (Konum)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-amber-950/20 px-2 rounded-lg my-1">
                  <span className="text-amber-300 font-semibold">participants</span>
                  <span className="text-amber-400 font-bold">[Participant!]! (Katılımcılar)</span>
                </div>
              </div>
            </div>

            {/* Location Card */}
            <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <h3 className="font-bold text-lg text-white font-mono">type Location</h3>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-800/50">
                  Model
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60 mt-2 font-mono text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">id</span>
                  <span className="text-emerald-400 font-semibold">ID!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">name</span>
                  <span className="text-emerald-400 font-semibold">String!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">address, desc</span>
                  <span className="text-zinc-400">String</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">lat, lng</span>
                  <span className="text-zinc-400">Float</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-emerald-950/20 px-2 rounded-lg my-1">
                  <span className="text-emerald-300 font-semibold">events</span>
                  <span className="text-indigo-400 font-bold">[Event!]! (Konumdaki Etkinlikler)</span>
                </div>
              </div>
            </div>

            {/* Participant Card */}
            <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 p-6 flex flex-col shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                  <h3 className="font-bold text-lg text-white font-mono">type Participant</h3>
                </div>
                <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/50">
                  Model
                </span>
              </div>

              <div className="divide-y divide-zinc-800/60 mt-2 font-mono text-xs">
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">id</span>
                  <span className="text-amber-400 font-semibold">ID!</span>
                </div>
                <div className="py-2.5 flex justify-between items-center">
                  <span className="text-zinc-200">username</span>
                  <span className="text-emerald-400 font-semibold">String! (Doğrudan Alan)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-purple-950/20 px-2 rounded-lg my-1">
                  <span className="text-purple-300 font-semibold">user</span>
                  <span className="text-purple-400 font-bold">User! (İlişkili Kullanıcı)</span>
                </div>
                <div className="py-2.5 flex justify-between items-center bg-indigo-950/20 px-2 rounded-lg my-1">
                  <span className="text-indigo-300 font-semibold">event</span>
                  <span className="text-indigo-400 font-bold">Event! (Katılınan Etkinlik)</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Raw SDL Code */
        <div className="bg-zinc-900/90 rounded-3xl border border-zinc-800 overflow-hidden shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800">
            <span className="font-mono text-xs font-semibold text-zinc-300 flex items-center gap-2">
              <FileCode className="w-4 h-4 text-purple-400" />
              schema.graphql (Schema Definition Language)
            </span>
            <button
              onClick={copySdl}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>SDL'i Kopyala</span>
                </>
              )}
            </button>
          </div>
          <pre className="p-6 overflow-auto font-mono text-xs text-zinc-300 leading-relaxed bg-zinc-950">
            {schemaSDL}
          </pre>
        </div>
      )}
    </div>
  );
};
