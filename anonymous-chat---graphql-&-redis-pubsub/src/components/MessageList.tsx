import React, { useEffect, useRef, useState } from 'react';
import {
  Heart,
  Reply,
  Copy,
  Check,
  ArrowDown,
  Sparkles,
  Search,
  X,
  MessageSquare,
} from 'lucide-react';
import { Message, TypingStatus } from '../types';
import { getAvatarEmoji } from '../lib/avatars';

interface MessageListProps {
  messages: Message[];
  currentUserId: string;
  typingUsers: TypingStatus[];
  onLikeMessage: (id: string) => void;
  onReplyMessage: (message: Message) => void;
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({
  messages,
  currentUserId,
  typingUsers,
  onLikeMessage,
  onReplyMessage,
  isLoading,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [showScrollBottom, setShowScrollBottom] = useState(false);

  // Auto-scroll on new message
  useEffect(() => {
    if (!containerRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    const isNearBottom = scrollHeight - scrollTop - clientHeight < 150;

    if (isNearBottom) {
      containerRef.current.scrollTo({
        top: scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages, typingUsers]);

  const handleScroll = () => {
    if (!containerRef.current) return;
    const { scrollHeight, scrollTop, clientHeight } = containerRef.current;
    setShowScrollBottom(scrollHeight - scrollTop - clientHeight > 200);
  };

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({
        top: containerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredMessages = searchQuery.trim()
    ? messages.filter(
        (m) =>
          m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          m.author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : messages;

  const formatTime = (isoString: string) => {
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-slate-950/40 relative">
      {/* Top Search Bar */}
      <div className="px-4 py-2 border-b border-slate-800/60 bg-slate-900/30 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-400">
          <span className="font-mono text-[11px] text-indigo-400">
            {messages.length} mesaj listelendi
          </span>
        </div>

        <div className="flex items-center gap-1">
          {showSearch ? (
            <div className="flex items-center gap-1.5 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <input
                type="text"
                placeholder="Mesajlarda ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-transparent text-xs text-slate-200 outline-none w-32 sm:w-48 placeholder-slate-500"
                autoFocus
              />
              <button
                onClick={() => {
                  setSearchQuery('');
                  setShowSearch(false);
                }}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowSearch(true)}
              className="flex items-center gap-1 px-2.5 py-1 rounded-md text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
              title="Mesaj Ara"
            >
              <Search className="w-3.5 h-3.5" />
              <span className="text-[11px]">Ara</span>
            </button>
          )}
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3.5"
      >
        {isLoading && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-slate-500 space-y-3">
            <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-mono">GraphQL mesajları yükleniyor...</p>
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-14 h-14 rounded-2xl bg-indigo-950/60 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-lg shadow-indigo-500/10">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h3 className="text-sm font-semibold text-slate-300">
              {searchQuery ? 'Eşleşen mesaj bulunamadı' : 'Bu odada henüz mesaj yok'}
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mt-1">
              {searchQuery
                ? 'Farklı bir arama terimi deneyin.'
                : 'Aşağıdaki alandan ilk anonim mesajı göndererek sohbeti başlatın!'}
            </p>
          </div>
        ) : (
          filteredMessages.map((msg) => {
            const isMe = msg.author === currentUserId;

            return (
              <div
                key={msg.id}
                className="group flex items-start gap-3 transition-colors hover:bg-slate-900/30 p-1.5 -mx-1.5 rounded-xl"
              >
                {/* Avatar with Custom Color Glow */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-md"
                  style={{
                    backgroundColor: `${msg.color}25`,
                    borderColor: msg.color,
                    borderWidth: '1.5px',
                  }}
                >
                  {getAvatarEmoji(msg.avatar)}
                </div>

                {/* Message Body */}
                <div className="flex-1 min-w-0">
                  {/* Author & Timestamp Header */}
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="text-xs font-semibold tracking-wide truncate"
                      style={{ color: msg.color }}
                    >
                      {msg.author}
                    </span>

                    {isMe && (
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-mono bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                        Sen
                      </span>
                    )}

                    <span className="text-[10px] text-slate-500 font-mono">
                      {formatTime(msg.createdAt)}
                    </span>
                  </div>

                  {/* Reply Quote Preview if exists */}
                  {msg.replyToContent && (
                    <div className="mb-1.5 pl-2.5 py-1 border-l-2 border-indigo-500/60 bg-indigo-950/20 rounded-r-lg text-[11px] text-slate-400 max-w-lg">
                      <span className="font-semibold text-indigo-300 block text-[10px]">
                        @{msg.replyToAuthor || 'Anonim'} yanıtı:
                      </span>
                      <p className="truncate italic text-slate-300">
                        {msg.replyToContent}
                      </p>
                    </div>
                  )}

                  {/* Content Bubble */}
                  <div className="text-sm text-slate-100 leading-relaxed break-words max-w-2xl bg-slate-900/60 p-3 rounded-2xl rounded-tl-sm border border-slate-800/80 shadow-sm">
                    {msg.content}
                  </div>

                  {/* Actions (Like, Reply, Copy) */}
                  <div className="flex items-center gap-2 mt-1.5 opacity-80 group-hover:opacity-100 transition">
                    {/* Like button */}
                    <button
                      onClick={() => onLikeMessage(msg.id)}
                      className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] transition ${
                        msg.likes > 0
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20'
                          : 'text-slate-500 hover:text-rose-400 hover:bg-slate-800'
                      }`}
                      title="Beğen (Redis PubSub ile senkron)"
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          msg.likes > 0 ? 'fill-rose-500 text-rose-500' : ''
                        }`}
                      />
                      <span>{msg.likes > 0 ? msg.likes : ''}</span>
                    </button>

                    {/* Reply button */}
                    <button
                      onClick={() => onReplyMessage(msg)}
                      className="p-1 text-slate-500 hover:text-indigo-400 hover:bg-slate-800 rounded transition text-[11px] flex items-center gap-1"
                      title="Yanıtla"
                    >
                      <Reply className="w-3.5 h-3.5" />
                      <span className="hidden sm:inline">Yanıtla</span>
                    </button>

                    {/* Copy button */}
                    <button
                      onClick={() => handleCopy(msg.id, msg.content)}
                      className="p-1 text-slate-500 hover:text-slate-300 hover:bg-slate-800 rounded transition"
                      title="Kopyala"
                    >
                      {copiedId === msg.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}

        {/* Real-time Typing Indicator Bubble */}
        {typingUsers.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-indigo-400/90 py-1.5 px-3 rounded-full bg-indigo-950/40 border border-indigo-500/20 w-fit animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-[11px]">
              {typingUsers.map((u) => u.author).join(', ')} yazıyor...
            </span>
            <div className="flex items-center gap-0.5 ml-1">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce" />
              <span
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: '150ms' }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-bounce"
                style={{ animationDelay: '300ms' }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Floating Scroll to Bottom Button */}
      {showScrollBottom && (
        <button
          onClick={scrollToBottom}
          className="absolute bottom-4 right-6 p-2 rounded-full bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/30 transition transform hover:scale-105"
          title="En alta in"
        >
          <ArrowDown className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
