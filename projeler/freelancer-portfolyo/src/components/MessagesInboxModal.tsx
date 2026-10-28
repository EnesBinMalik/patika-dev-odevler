import React from 'react';
import { ContactMessage } from '../types';
import { X, Mail, Phone, Calendar, Trash2, CheckCircle, Clock } from 'lucide-react';

interface MessagesInboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ContactMessage[];
  onToggleRead: (id: string) => void;
  onDeleteMessage: (id: string) => void;
}

export const MessagesInboxModal: React.FC<MessagesInboxModalProps> = ({
  isOpen,
  onClose,
  messages,
  onToggleRead,
  onDeleteMessage,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full mx-auto shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white px-6 py-5 flex items-center justify-between border-b border-[#34495e]">
          <div>
            <span className="text-xs font-bold text-[#1abc9c] uppercase tracking-wider block">
              SmartEdu Nodemailer Gelen Kutusu
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading">
              GELEN MESAJLAR ({messages.length})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Message List */}
        <div className="overflow-y-auto p-6 space-y-4 flex-1">
          {messages.length === 0 ? (
            <div className="text-center py-16 text-slate-500">
              <Mail className="w-12 h-12 mx-auto text-slate-300 mb-3" />
              <p className="font-semibold text-slate-700">Henüz hiç mesajınız yok</p>
              <p className="text-xs text-slate-400 mt-1">
                İletişim formundan gönderilen mesajlar anında burada listelenir.
              </p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-5 rounded-xl border transition-all ${
                  msg.isRead
                    ? 'bg-slate-50 border-slate-200 text-slate-700'
                    : 'bg-teal-50/40 border-[#1abc9c]/40 text-slate-900 shadow-xs'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-base text-[#2c3e50]">{msg.name}</h4>
                      {!msg.isRead && (
                        <span className="px-2 py-0.5 bg-[#1abc9c] text-white text-[10px] font-bold rounded-full">
                          YENİ
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-semibold text-[#1abc9c]">{msg.subject}</p>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-slate-400">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{msg.createdAt}</span>
                  </div>
                </div>

                <div className="bg-white p-3 rounded-lg border border-slate-200/80 text-xs sm:text-sm text-slate-700 mb-3 leading-relaxed whitespace-pre-wrap">
                  {msg.message}
                </div>

                {/* Metadata & Actions */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-2 border-t border-slate-200/60">
                  <div className="flex flex-wrap items-center gap-4 text-slate-600">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[#1abc9c]" />
                      <a href={`mailto:${msg.email}`} className="hover:underline text-slate-800 font-medium">
                        {msg.email}
                      </a>
                    </span>
                    {msg.phone && (
                      <span className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5 text-[#1abc9c]" />
                        <span>{msg.phone}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onToggleRead(msg.id)}
                      className="px-2.5 py-1 text-slate-600 hover:text-slate-900 bg-white border border-slate-200 rounded text-xs font-medium hover:bg-slate-50 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="w-3 h-3 text-[#1abc9c]" />
                      <span>{msg.isRead ? 'Okunmadı İşaretle' : 'Okundu'}</span>
                    </button>
                    <button
                      onClick={() => onDeleteMessage(msg.id)}
                      className="p-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors"
                      title="Mesajı Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs font-bold uppercase rounded-lg"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
