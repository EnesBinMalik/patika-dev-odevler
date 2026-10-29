import React from 'react';
import {
  Hash,
  MessageSquare,
  Code2,
  Moon,
  Flame,
  Plus,
  RefreshCw,
  Edit3,
  Server,
  Zap,
  Shield,
  Activity,
  X,
} from 'lucide-react';
import { Room, ServerStats } from '../types';
import { getAvatarEmoji } from '../lib/avatars';

interface SidebarProps {
  rooms: Room[];
  currentRoomId: string;
  onSelectRoom: (roomId: string) => void;
  onOpenCreateRoom: () => void;
  onOpenProfile: () => void;
  onRerollIdentity: () => void;
  userProfile: {
    nickname: string;
    avatar: string;
    color: string;
  };
  serverStats: ServerStats | null;
  isOpen: boolean;
  onClose: () => void;
}

const ROOM_ICONS: Record<string, React.ReactNode> = {
  MessageSquare: <MessageSquare className="w-4 h-4" />,
  Code2: <Code2 className="w-4 h-4" />,
  Moon: <Moon className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
  Hash: <Hash className="w-4 h-4" />,
};

export const Sidebar: React.FC<SidebarProps> = ({
  rooms,
  currentRoomId,
  onSelectRoom,
  onOpenCreateRoom,
  onOpenProfile,
  onRerollIdentity,
  userProfile,
  serverStats,
  isOpen,
  onClose,
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static inset-y-0 left-0 w-72 bg-slate-950 border-r border-slate-800 flex flex-col z-40 transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* App Title & Signature Header */}
        <div className="p-4 border-b border-slate-800/80">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/30">
                <Shield className="w-4 h-4" />
              </div>
              <div>
                <span className="font-extrabold text-sm tracking-wide bg-gradient-to-r from-white via-slate-200 to-indigo-300 bg-clip-text text-transparent">
                  ANON CHAT
                </span>
                <span className="block text-[10px] text-indigo-400 font-mono tracking-tight font-medium">
                  GraphQL &amp; Redis PubSub
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Author Badge */}
          <div className="mt-3 px-2.5 py-1.5 rounded-lg bg-indigo-950/50 border border-indigo-500/20 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Geliştirici</span>
            <span className="text-xs font-semibold text-indigo-300">Enes Öztürk</span>
          </div>
        </div>

        {/* User Identity Card */}
        <div className="p-3 border-b border-slate-800/60 bg-slate-900/40">
          <div className="text-[10px] font-semibold tracking-wider uppercase text-slate-500 mb-2 px-1 flex items-center justify-between">
            <span>Anonim Kimliğiniz</span>
            <span className="text-emerald-400 flex items-center gap-1 text-[9px] font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              GİZLİ
            </span>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between group">
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-inner shrink-0"
                style={{
                  backgroundColor: `${userProfile.color}20`,
                  borderColor: userProfile.color,
                  borderWidth: '1.5px',
                }}
              >
                {getAvatarEmoji(userProfile.avatar)}
              </div>
              <div className="min-w-0">
                <div className="text-xs font-semibold text-slate-200 truncate">
                  {userProfile.nickname}
                </div>
                <div className="text-[10px] text-slate-500 flex items-center gap-1">
                  <span
                    className="w-2 h-2 rounded-full inline-block"
                    style={{ backgroundColor: userProfile.color }}
                  />
                  <span>Anonim Kimlik</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={onRerollIdentity}
                title="Rastgele Yeni Kimlik Üret"
                className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-800 rounded-lg transition"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={onOpenProfile}
                title="Kimliği Düzenle"
                className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition"
              >
                <Edit3 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Rooms List */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              Sohbet Odaları ({rooms.length})
            </span>
            <button
              onClick={onOpenCreateRoom}
              className="text-xs text-indigo-400 hover:text-indigo-300 p-1 hover:bg-indigo-950/40 rounded flex items-center gap-1 transition"
              title="Yeni Oda Aç"
            >
              <Plus className="w-3.5 h-3.5" />
              <span className="text-[11px]">Yeni</span>
            </button>
          </div>

          <div className="space-y-1">
            {rooms.map((room) => {
              const isActive = room.id === currentRoomId;
              const iconComponent = ROOM_ICONS[room.icon] || <Hash className="w-4 h-4" />;

              return (
                <button
                  key={room.id}
                  onClick={() => {
                    onSelectRoom(room.id);
                    onClose();
                  }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left transition-all ${
                    isActive
                      ? 'bg-gradient-to-r from-indigo-600/30 to-purple-600/20 text-white border border-indigo-500/40 shadow-sm shadow-indigo-500/10'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={isActive ? 'text-indigo-400' : 'text-slate-500'}>
                      {iconComponent}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{room.name}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {room.description}
                      </div>
                    </div>
                  </div>

                  {room.messageCount > 0 && (
                    <span
                      className={`text-[10px] font-mono px-2 py-0.5 rounded-full ${
                        isActive
                          ? 'bg-indigo-500/30 text-indigo-200 border border-indigo-400/30'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {room.messageCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Server & Engine Status Card */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-900/60 space-y-2">
          <div className="p-2.5 rounded-xl bg-slate-950/70 border border-slate-800 text-[11px] space-y-1.5">
            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Redis PubSub
              </span>
              <span className="font-mono text-emerald-400 font-medium">Aktif</span>
            </div>

            <div className="flex items-center justify-between text-slate-400">
              <span className="flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-indigo-400" />
                GraphQL Sub
              </span>
              <span className="font-mono text-slate-300">WebSocket</span>
            </div>

            {serverStats && (
              <div className="flex items-center justify-between text-slate-400 pt-1 border-t border-slate-800/60">
                <span className="flex items-center gap-1.5">
                  <Server className="w-3.5 h-3.5 text-slate-500" />
                  Toplam Mesaj
                </span>
                <span className="font-mono text-slate-200 font-bold">
                  {serverStats.totalMessages}
                </span>
              </div>
            )}
          </div>

          {/* Footer Signature */}
          <div className="text-center pt-1">
            <p className="text-[10px] text-slate-500">
              Proje 3 - Anonymous Chat
            </p>
            <p className="text-[11px] font-semibold text-slate-400 hover:text-indigo-300 transition">
              Enes Öztürk
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};
