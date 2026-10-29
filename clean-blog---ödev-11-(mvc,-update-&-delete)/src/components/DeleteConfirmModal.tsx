import React from 'react';
import { Trash2, AlertTriangle, X } from 'lucide-react';
import { BlogPost } from '../types';

interface DeleteConfirmModalProps {
  post: BlogPost | null;
  isOpen: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  post,
  isOpen,
  onConfirm,
  onCancel
}) => {
  if (!isOpen || !post) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
        <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <AlertTriangle className="w-4 h-4" />
            <span>Yazıyı Silme Onayı (DELETE)</span>
          </div>
          <button
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 mb-6">
          <p className="text-sm text-gray-700">
            Aşağıdaki blog yazısını veritabanından kalıcı olarak silmek istediğinizden emin misiniz?
          </p>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg">
            <h4 className="font-serif font-bold text-gray-900 text-sm line-clamp-2">
              "{post.title}"
            </h4>
            <div className="mt-1 text-[11px] text-gray-500 font-mono">
              ID: {post._id}
            </div>
          </div>

          <div className="text-[11px] text-gray-500 bg-gray-50 p-2.5 rounded border border-gray-200 font-mono">
            <strong>HTTP İsteği:</strong> <span className="text-rose-600">DELETE</span> /posts/{post._id}?_method=DELETE
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-lg transition-colors"
          >
            İptal
          </button>
          <button
            onClick={onConfirm}
            className="flex items-center gap-1.5 px-5 py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Evet, Postu Sil
          </button>
        </div>
      </div>
    </div>
  );
};
