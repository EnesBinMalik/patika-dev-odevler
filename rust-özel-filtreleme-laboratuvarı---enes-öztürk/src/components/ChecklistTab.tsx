import React, { useState } from 'react';
import { CheckCircle2, Circle, Award, ShieldCheck, Copy, Check, Sparkles, ChevronRight, BookOpen } from 'lucide-react';
import { ChecklistItem } from '../types';

interface ChecklistTabProps {
  items: ChecklistItem[];
  onToggleItem: (id: number) => void;
  onSetAll: (completed: boolean) => void;
  onJumpToEditorWithCode: (codeSnippet: string) => void;
}

export const ChecklistTab: React.FC<ChecklistTabProps> = ({
  items,
  onToggleItem,
  onSetAll,
  onJumpToEditorWithCode,
}) => {
  const [copiedSnippetId, setCopiedSnippetId] = useState<number | null>(null);

  const completedCount = items.filter((item) => item.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  const handleCopySnippet = (id: number, snippet: string) => {
    navigator.clipboard.writeText(snippet);
    setCopiedSnippetId(id);
    setTimeout(() => setCopiedSnippetId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Overview & Progress Card */}
      <div className="bg-gradient-to-br from-[#121622] to-[#0d1017] border border-zinc-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div>
            <span className="text-xs font-semibold text-orange-400 uppercase tracking-wider block mb-1">
              Öğrenci Ödevi Kontrol ve Doğrulama
            </span>
            <h2 className="text-xl sm:text-2xl font-bold text-white">
              Rust Özel Filtreleme Kontrol Listesi
            </h2>
          </div>

          {/* Enes Öztürk verified badge */}
          <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300">
            <ShieldCheck className="w-5 h-5 text-amber-400" />
            <div>
              <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-semibold">
                Ödev Koordinatörü
              </div>
              <div className="text-sm font-bold tracking-wide">
                Enes Öztürk
              </div>
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-zinc-400 max-w-3xl mb-6">
          Aşağıdaki 8 aşamalı kontrol listesi, kapanış (closure) kullanmadan nesne yönelimli struct yaklaşımıyla Rust koleksiyon filtreleme fonksiyonunun eksiksiz tamamlanmasını sağlar.
        </p>

        {/* Progress Bar */}
        <div>
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-zinc-300">
              Tamamlanma Durumu: <strong className="text-orange-400">{completedCount} / {items.length} Adım</strong>
            </span>
            <span className={`font-mono font-bold ${progressPercent === 100 ? 'text-emerald-400' : 'text-orange-400'}`}>
              %{progressPercent}
            </span>
          </div>

          <div className="w-full bg-zinc-800 h-3 rounded-full overflow-hidden p-0.5 border border-zinc-700/60">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                progressPercent === 100
                  ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500'
              }`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Quick Batch Actions */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-zinc-800/80">
          <div className="text-xs text-zinc-500">
            {progressPercent === 100 ? (
              <span className="text-emerald-400 font-semibold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4" /> Tüm isterler eksiksiz tamamlandı!
              </span>
            ) : (
              <span>Lütfen tüm adımları gözden geçirip işaretleyin.</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onSetAll(true)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors"
            >
              Tümünü Tamamla
            </button>
            <button
              onClick={() => onSetAll(false)}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Sıfırla
            </button>
          </div>
        </div>
      </div>

      {/* Completion Certificate Banner if 100% */}
      {progressPercent === 100 && (
        <div className="bg-gradient-to-r from-emerald-950/40 via-teal-950/30 to-zinc-900 border border-emerald-500/40 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-wrap items-center justify-between gap-4 animate-fadeIn">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shadow-lg">
              <Award className="w-7 h-7" />
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-emerald-400">
                Başarı Belgesi & Onay
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                Rust Özel Filtreleme Görevi Başarıyla Tamamlandı
              </h3>
              <p className="text-xs text-zinc-400">
                Ödev isterleri: FilterCondition struct'ı, is_match metodu, custom_filter fonksiyonu ve main çağrısı başarıyla doğrulandı.
              </p>
            </div>
          </div>

          <div className="px-4 py-2 rounded-xl bg-zinc-900/90 border border-amber-500/40 text-right">
            <div className="text-[10px] text-zinc-400 uppercase tracking-wider">İmza & Onay</div>
            <div className="text-sm font-bold text-amber-300">Enes Öztürk</div>
            <div className="text-[10px] text-zinc-500 font-mono">Doğrulandı • Rust 2021</div>
          </div>
        </div>
      )}

      {/* 8 Detailed Step Cards */}
      <div className="space-y-3">
        {items.map((item) => (
          <div
            key={item.id}
            className={`border rounded-xl p-4 sm:p-5 transition-all duration-200 ${
              item.completed
                ? 'bg-[#0f131d]/90 border-zinc-700/80 shadow-md'
                : 'bg-[#0b0e14]/60 border-zinc-800/80 opacity-80 hover:opacity-100'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              {/* Checkbox and Title */}
              <div className="flex items-start gap-3.5 flex-1">
                <button
                  onClick={() => onToggleItem(item.id)}
                  className="mt-0.5 text-zinc-400 hover:text-white transition-colors focus:outline-none"
                >
                  {item.completed ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 fill-emerald-500/10" />
                  ) : (
                    <Circle className="w-5 h-5 text-zinc-600" />
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-orange-500/10 text-orange-400 border border-orange-500/20 font-bold">
                      Adım {item.stepNumber}
                    </span>
                    <h4 className={`text-sm sm:text-base font-semibold ${item.completed ? 'text-zinc-100' : 'text-zinc-400'}`}>
                      {item.title}
                    </h4>
                  </div>

                  <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Code Snippet Preview */}
                  <div className="mt-3 bg-[#08090e] border border-zinc-800 rounded-lg p-3 font-mono text-xs text-zinc-300 relative group">
                    <pre className="overflow-x-auto whitespace-pre leading-relaxed pr-8">
                      {item.codeSnippet}
                    </pre>

                    <button
                      onClick={() => handleCopySnippet(item.id, item.codeSnippet)}
                      className="absolute top-2 right-2 p-1.5 rounded bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition-colors"
                      title="Kodu Kopyala"
                    >
                      {copiedSnippetId === item.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>

                  {/* Pedagogical Explanation note */}
                  <div className="mt-2.5 flex items-center gap-2 text-[11px] text-zinc-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    <span><strong className="text-zinc-300">Öğretici Not:</strong> {item.explanation}</span>
                  </div>
                </div>
              </div>

              {/* Jump to code button */}
              <button
                onClick={() => onJumpToEditorWithCode(item.codeSnippet)}
                className="hidden sm:flex items-center gap-1 px-3 py-1.5 rounded-lg bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 hover:text-white text-xs font-medium transition-colors"
              >
                <span>Editörde Gör</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
