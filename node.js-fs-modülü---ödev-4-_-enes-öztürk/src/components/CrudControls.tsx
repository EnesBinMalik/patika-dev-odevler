import React, { useState } from 'react';
import { PlusCircle, FileSearch, RefreshCw, Trash2, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { FileStatus } from '../types';

interface CrudControlsProps {
  fileStatus: FileStatus | null;
  onCreate: (payload: { name: string; salary: number }) => void;
  onRead: () => void;
  onUpdate: (payload: { name: string; salary: number; updatedBy: string }) => void;
  onDelete: () => void;
  isProcessing: boolean;
  lastExecutedStep: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | null;
}

export const CrudControls: React.FC<CrudControlsProps> = ({
  fileStatus,
  onCreate,
  onRead,
  onUpdate,
  onDelete,
  isProcessing,
  lastExecutedStep,
}) => {
  // Update state fields
  const [updateSalary, setUpdateSalary] = useState<number>(2500);
  const [updateName, setUpdateName] = useState<string>('Employee 1 Name (Güncellendi)');
  const [showUpdateConfig, setShowUpdateConfig] = useState<boolean>(false);

  const fileExists = fileStatus?.exists ?? false;

  return (
    <div className="space-y-4">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <span>FS CRUD Operasyonları</span>
            <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400 font-normal">
              Adım Adım
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Ödev gereksinimlerini tek tek veya sırayla tetikleyin.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-slate-400">Dosya Durumu:</span>
          {fileExists ? (
            <span className="inline-flex items-center gap-1 text-emerald-400 font-medium bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              <CheckCircle2 className="w-3 h-3" />
              Mevcut ({fileStatus?.size ?? 0} B)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 text-rose-400 font-medium bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
              <AlertCircle className="w-3 h-3" />
              Henüz Yok
            </span>
          )}
        </div>
      </div>

      {/* 4 CRUD Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        {/* 1. CREATE CARD */}
        <div className={`p-4 rounded-xl border transition-all ${
          lastExecutedStep === 'CREATE'
            ? 'border-emerald-500/60 bg-emerald-950/20 ring-1 ring-emerald-500/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 font-bold text-xs">
                1
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Yarat (Create)
                </h3>
                <span className="text-[11px] text-emerald-400 font-mono">
                  fs.writeFile()
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              employees.json
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded text-[11px]">
              &#123;&quot;name&quot;: &quot;Employee 1 Name&quot;, &quot;salary&quot;: 2000&#125;
            </code>{' '}
            verisi ile dosya oluşturulur.
          </p>

          <button
            onClick={() => onCreate({ name: 'Employee 1 Name', salary: 2000 })}
            disabled={isProcessing}
            className="mt-3.5 w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <PlusCircle className="w-4 h-4" />
            <span>1. Dosyayı Oluştur (YARAT)</span>
          </button>
        </div>

        {/* 2. READ CARD */}
        <div className={`p-4 rounded-xl border transition-all ${
          lastExecutedStep === 'READ'
            ? 'border-blue-500/60 bg-blue-950/20 ring-1 ring-blue-500/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 font-bold text-xs">
                2
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Oku (Read)
                </h3>
                <span className="text-[11px] text-blue-400 font-mono">
                  fs.readFile()
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              UTF-8 Encoding
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            <code className="text-amber-300 font-mono bg-slate-950 px-1 py-0.5 rounded text-[11px]">
              employees.json
            </code>{' '}
            okunur ve JSON objesine dönüştürülüp konsola yazdırılır.
          </p>

          <button
            onClick={onRead}
            disabled={isProcessing}
            className="mt-3.5 w-full py-2 px-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <FileSearch className="w-4 h-4" />
            <span>2. Veriyi Oku (OKUYUN)</span>
          </button>
        </div>

        {/* 3. UPDATE CARD */}
        <div className={`p-4 rounded-xl border transition-all ${
          lastExecutedStep === 'UPDATE'
            ? 'border-amber-500/60 bg-amber-950/20 ring-1 ring-amber-500/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 font-bold text-xs">
                3
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Güncelle (Update)
                </h3>
                <span className="text-[11px] text-amber-400 font-mono">
                  fs.writeFile()
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowUpdateConfig(!showUpdateConfig)}
              className="text-[10px] text-amber-400 hover:underline cursor-pointer"
            >
              {showUpdateConfig ? 'Gizle' : 'Değerleri Düzenle'}
            </button>
          </div>

          {showUpdateConfig ? (
            <div className="mt-2.5 space-y-2 bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400 w-16">İsim:</label>
                <input
                  type="text"
                  value={updateName}
                  onChange={(e) => setUpdateName(e.target.value)}
                  className="flex-1 bg-slate-900 border border-slate-750 text-xs px-2 py-1 rounded text-white focus:outline-none focus:border-amber-400"
                />
              </div>
              <div className="flex items-center gap-2">
                <label className="text-[11px] text-slate-400 w-16">Maaş (TL):</label>
                <input
                  type="number"
                  value={updateSalary}
                  onChange={(e) => setUpdateSalary(Number(e.target.value))}
                  className="flex-1 bg-slate-900 border border-slate-750 text-xs px-2 py-1 rounded text-white focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>
          ) : (
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              Maaş <strong>2000 TL</strong> ➔{' '}
              <span className="text-amber-300 font-semibold">{updateSalary} TL</span> olarak
              güncellenir ve Enes Öztürk imzası eklenir.
            </p>
          )}

          <button
            onClick={() =>
              onUpdate({
                name: updateName,
                salary: updateSalary,
                updatedBy: 'ENES ÖZTÜRK',
              })
            }
            disabled={isProcessing}
            className="mt-3.5 w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>3. Veriyi Güncelle (GÜNCELLE)</span>
          </button>
        </div>

        {/* 4. DELETE CARD */}
        <div className={`p-4 rounded-xl border transition-all ${
          lastExecutedStep === 'DELETE'
            ? 'border-rose-500/60 bg-rose-950/20 ring-1 ring-rose-500/30'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 font-bold text-xs">
                4
              </div>
              <div>
                <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                  Sil (Delete)
                </h3>
                <span className="text-[11px] text-rose-400 font-mono">
                  fs.unlink()
                </span>
              </div>
            </div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">
              Kalıcı Silme
            </span>
          </div>

          <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
            <code className="text-rose-300 font-mono bg-slate-950 px-1 py-0.5 rounded text-[11px]">
              fs.unlink('employees.json')
            </code>{' '}
            çağrılarak dosya dosya sisteminden tamamen silinir.
          </p>

          <button
            onClick={onDelete}
            disabled={isProcessing}
            className="mt-3.5 w-full py-2 px-3 bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>4. Dosyayı Sil (SİL)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
