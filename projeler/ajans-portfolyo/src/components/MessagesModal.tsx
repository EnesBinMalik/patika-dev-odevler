import React from 'react';
import { X, Mail, Phone, Calendar, Trash2, CheckCircle } from 'lucide-react';
import { ContactMessage } from '../types';

interface MessagesModalProps {
  isOpen: boolean;
  messages: ContactMessage[];
  onClose: () => void;
  onMarkAsRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
}

export const MessagesModal: React.FC<MessagesModalProps> = ({
  isOpen,
  messages,
  onClose,
  onMarkAsRead,
  onDeleteMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>SmartEdu Mesajlaşma Mimarisi</span>
              <span aria-hidden="true">·</span>
              <span>Gelen Kutusu</span>
            </div>
            <h3 className="text-xl font-bold text-white">İletişim Formu Talepleri</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message List */}
        <div className="overflow-y-auto p-6 space-y-4">
          {messages.length === 0 ? (
            <div className="py-12 text-center text-neutral-400 text-sm">
              Henüz kayıtlı bir iletişim mesajı bulunmuyor.
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-xl border transition-all ${
                  msg.status === 'new'
                    ? 'border-amber-500/40 bg-neutral-900/90'
                    : 'border-neutral-800 bg-neutral-950/60'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-sm">{msg.name}</span>
                    {msg.status === 'new' && (
                      <span className="text-[10px] font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded border border-amber-400/20">
                        YENİ
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3 text-xs text-neutral-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      {new Date(msg.createdAt).toLocaleDateString('tr-TR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                <div className="mb-2">
                  <h4 className="text-sm font-semibold text-amber-300">{msg.subject}</h4>
                </div>

                <p className="text-xs text-neutral-300 leading-relaxed whitespace-pre-line mb-4">
                  {msg.message}
                </p>

                <div className="pt-3 border-t border-neutral-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-neutral-400">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Mail className="w-3.5 h-3.5 text-neutral-500" />
                      <a href={`mailto:${msg.email}`} className="hover:text-white transition-colors">
                        {msg.email}
                      </a>
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="w-3.5 h-3.5 text-neutral-500" />
                        <span>{msg.phone}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {msg.status === 'new' && (
                      <button
                        onClick={() => onMarkAsRead(msg.id)}
                        className="px-2.5 py-1 text-[11px] font-medium text-neutral-300 hover:text-white bg-neutral-800 rounded flex items-center gap-1 cursor-pointer"
                      >
                        <CheckCircle className="w-3 h-3 text-amber-400" />
                        <span>Okundu Olarak İşaretle</span>
                      </button>
                    )}
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 text-neutral-500 hover:text-red-400 transition-colors cursor-pointer"
                      title="Mesajı Sil"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-neutral-800 bg-neutral-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Pencereyi Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
