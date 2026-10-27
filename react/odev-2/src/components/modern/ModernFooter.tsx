import React, { useRef } from 'react';
import { RotateCcw, Trash2, Download, Upload, Award } from 'lucide-react';
import { Todo } from '../../types/todo';

interface ModernFooterProps {
  completedCount: number;
  totalCount: number;
  todos: Todo[];
  onClearCompleted: () => void;
  onResetToSample: () => void;
  onClearAll: () => void;
  onImportTodos: (todos: Todo[]) => void;
  onOpenDevModal: () => void;
}

export const ModernFooter: React.FC<ModernFooterProps> = ({
  completedCount,
  totalCount,
  todos,
  onClearCompleted,
  onResetToSample,
  onClearAll,
  onImportTodos,
  onOpenDevModal,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(todos, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `todos_enes_ozturk_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (Array.isArray(parsed)) {
          onImportTodos(parsed);
        } else {
          alert('Geçersiz JSON formatı!');
        }
      } catch {
        alert('Dosya okunurken bir hata oluştu!');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <div className="pt-4 border-t border-slate-200/80 space-y-4 text-xs text-slate-500">
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Action tool buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          {completedCount > 0 && (
            <button
              type="button"
              onClick={onClearCompleted}
              className="px-2.5 py-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
            >
              Tamamlananları Sil ({completedCount})
            </button>
          )}

          <button
            type="button"
            onClick={onResetToSample}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="Patika ödev örnek görevlerini geri yükler"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Örnekleri Yükle</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleExport}
            disabled={totalCount === 0}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            title="JSON olarak dışa aktar"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Dışa Aktar</span>
          </button>

          <button
            type="button"
            onClick={handleImportClick}
            className="flex items-center gap-1 px-2.5 py-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
            title="JSON dosyasından içe aktar"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>İçe Aktar</span>
          </button>

          {totalCount > 0 && (
            <button
              type="button"
              onClick={onClearAll}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              title="Tüm görevleri temizle"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Signature Banner */}
      <div className="bg-slate-900 text-white rounded-xl p-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs border border-emerald-500/30">
            EÖ
          </div>
          <div>
            <div className="font-semibold text-slate-100 text-xs flex items-center gap-1.5">
              <span>Enes Öztürk İmzasıyla</span>
              <Award className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <p className="text-[11px] text-slate-400">
              Patika.dev React Bootcamp · Ödev 2 (En Üst Düzey Uygulama)
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onOpenDevModal}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-medium transition-colors cursor-pointer border border-slate-700"
        >
          Ödev Detayları
        </button>
      </div>
    </div>
  );
};
