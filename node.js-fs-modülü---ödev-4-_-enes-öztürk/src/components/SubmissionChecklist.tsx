import React from 'react';
import { CheckCircle2, Circle, Award, ShieldCheck } from 'lucide-react';
import { AUTHOR_NAME } from '../data/codeSnippets';

interface SubmissionChecklistProps {
  completedSteps: {
    create: boolean;
    read: boolean;
    update: boolean;
    delete: boolean;
    signed: boolean;
  };
}

export const SubmissionChecklist: React.FC<SubmissionChecklistProps> = ({ completedSteps }) => {
  const items = [
    {
      id: 'create',
      title: '1. Dosyayı Oluştur (YARAT)',
      desc: 'employees.json oluşturuldu ve {"name": "Employee 1 Name", "salary": 2000} eklendi.',
      done: completedSteps.create,
    },
    {
      id: 'read',
      title: '2. Veriyi Oku (OKUYUN)',
      desc: 'employees.json fs.readFile ile okundu ve JSON verisi konsola yazdırıldı.',
      done: completedSteps.read,
    },
    {
      id: 'update',
      title: '3. Veriyi Güncelle (GÜNCELLE)',
      desc: 'employees.json içeriği güncellenip tekrar dosyaya yazıldı.',
      done: completedSteps.update,
    },
    {
      id: 'delete',
      title: '4. Dosyayı Sil (SİL)',
      desc: 'fs.unlink ile employees.json dosyası sistemden kaldırıldı.',
      done: completedSteps.delete,
    },
    {
      id: 'signed',
      title: '5. ENES Öztürk İmzası',
      desc: `Çıktılarda ve kodda '${AUTHOR_NAME}' imzası doğrulandı.`,
      done: completedSteps.signed,
    },
  ];

  const completedCount = Object.values(completedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4.5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm font-bold text-white tracking-wide">
            Ödev 4 Kabul Kriterleri & Doğrulama
          </h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Tamamlanan:</span>
          <span className="text-emerald-400 font-bold">{completedCount} / {items.length}</span>
          <span className="text-slate-500">({progressPercent}%)</span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
        <div
          className="bg-emerald-500 h-full transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Checklist items */}
      <div className="space-y-2.5">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-2.5 rounded-lg border transition-all ${
              item.done
                ? 'bg-emerald-950/20 border-emerald-500/30'
                : 'bg-slate-950/40 border-slate-800/80'
            }`}
          >
            <div className="mt-0.5 shrink-0">
              {item.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ) : (
                <Circle className="w-4 h-4 text-slate-600" />
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-semibold ${item.done ? 'text-emerald-300' : 'text-slate-300'}`}>
                  {item.title}
                </span>
                {item.id === 'signed' && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20 flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    {AUTHOR_NAME}
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {item.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
