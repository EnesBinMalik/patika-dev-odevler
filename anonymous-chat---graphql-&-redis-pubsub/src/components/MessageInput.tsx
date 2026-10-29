import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Send, X, Smile, CornerDownLeft } from 'lucide-react';
import { Message } from '../types';

interface MessageInputProps {
  onSendMessage: (content: string, replyTo?: Message | null) => Promise<void>;
  onTyping: (isTyping: boolean) => void;
  replyTo: Message | null;
  onCancelReply: () => void;
  disabled?: boolean;
}

const QUICK_EMOJIS = ['🔥', '🚀', '💬', '⚡', '👀', '💯', '👻', '✨', '👏', '🤖'];

export const MessageInput: React.FC<MessageInputProps> = ({
  onSendMessage,
  onTyping,
  replyTo,
  onCancelReply,
  disabled = false,
}) => {
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const typingTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Focus textarea when replying
  useEffect(() => {
    if (replyTo && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [replyTo]);

  // Handle typing event debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const val = e.target.value;
    setContent(val);

    // Broadcast typing state
    if (val.trim()) {
      onTyping(true);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      typingTimerRef.current = setTimeout(() => {
        onTyping(false);
      }, 2000);
    } else {
      onTyping(false);
    }
  };

  const handleSend = async () => {
    const text = content.trim();
    if (!text || isSubmitting || disabled) return;

    try {
      setIsSubmitting(true);
      onTyping(false);
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);

      await onSendMessage(text, replyTo);
      setContent('');
      setShowEmojiPicker(false);
      if (replyTo) onCancelReply();

      // Refocus input
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    } catch (err) {
      console.error('Mesaj gönderilemedi:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const addEmoji = (emoji: string) => {
    setContent((prev) => prev + emoji);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <div className="border-t border-slate-800 bg-slate-900/90 backdrop-blur-md p-3 relative z-10">
      {/* Replying-to Preview Bar */}
      {replyTo && (
        <div className="flex items-center justify-between px-3 py-1.5 mb-2 bg-indigo-950/40 border border-indigo-500/30 rounded-lg text-xs">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-semibold text-indigo-400 shrink-0">
              @{replyTo.author}
            </span>
            <span className="text-slate-400 truncate italic">
              &quot;{replyTo.content}&quot;
            </span>
          </div>
          <button
            onClick={onCancelReply}
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-slate-800 shrink-0"
            title="Yanıtı İptal Et"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Quick Emoji Bar */}
      {showEmojiPicker && (
        <div className="flex items-center gap-1.5 pb-2 overflow-x-auto border-b border-slate-800/80 mb-2">
          {QUICK_EMOJIS.map((emoji) => (
            <button
              key={emoji}
              onClick={() => addEmoji(emoji)}
              className="p-1.5 hover:bg-slate-800 rounded-lg text-base transition transform hover:scale-125"
            >
              {emoji}
            </button>
          ))}
        </div>
      )}

      {/* Input Row */}
      <div className="flex items-end gap-2 bg-slate-950 border border-slate-800 rounded-xl p-2 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/30 transition">
        <button
          type="button"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-slate-900 transition ${
            showEmojiPicker ? 'text-indigo-400 bg-slate-900' : ''
          }`}
          title="Emojiler"
        >
          <Smile className="w-4 h-4" />
        </button>

        <textarea
          ref={textareaRef}
          value={content}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Anonim bir mesaj yazın... (Enter ile gönder, Shift+Enter yeni satır)"
          rows={1}
          disabled={disabled || isSubmitting}
          className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 resize-none outline-none max-h-32 min-h-[38px] py-2"
        />

        <button
          type="button"
          onClick={handleSend}
          disabled={!content.trim() || isSubmitting || disabled}
          className={`p-2.5 rounded-lg font-medium text-white transition flex items-center justify-center shrink-0 ${
            content.trim() && !isSubmitting
              ? 'bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
          title="Gönder (GraphQL Mutation)"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

      {/* Footer Info */}
      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 px-1">
        <span className="flex items-center gap-1">
          <CornerDownLeft className="w-3 h-3 text-slate-500" />
          <span>Enter: Gönder • Shift+Enter: Satır</span>
        </span>
        <span className="font-mono text-indigo-400/80">
          GraphQL Mutation: sendMessage
        </span>
      </div>
    </div>
  );
};
