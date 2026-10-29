import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight, CheckCircle, Clock, Sparkles, User, BarChart3, Crown } from 'lucide-react';
import { Question } from '../lib/graphqlQueries.ts';

interface QuestionCardProps {
  question: Question;
  userVotedOptionId: string | null;
  onSelect: (question: Question) => void;
  isNew?: boolean;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  userVotedOptionId,
  onSelect,
  isNew = false,
}) => {
  // Find highest voted option
  const sortedOptions = [...question.options].sort((a, b) => b.votes_count - a.votes_count);
  const leadingOption = question.total_votes > 0 ? sortedOptions[0] : null;

  const formatDate = (iso: string) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString('tr-TR', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <motion.div
      layout
      initial={isNew ? { opacity: 0, y: -20, scale: 0.96 } : { opacity: 1, y: 0 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className={`group relative flex flex-col justify-between rounded-2xl bg-slate-900/80 hover:bg-slate-900 border transition-all duration-300 p-5 sm:p-6 shadow-xl ${
        isNew
          ? 'border-indigo-500/80 ring-2 ring-indigo-500/20 shadow-indigo-500/10'
          : userVotedOptionId
          ? 'border-slate-800 hover:border-indigo-500/40'
          : 'border-slate-800/90 hover:border-slate-700'
      }`}
    >
      {/* Top Banner / Tags */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {question.category || 'Genel'}
            </span>

            {isNew && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse">
                <Sparkles className="w-3 h-3" />
                Yeni Eklendi
              </span>
            )}

            {userVotedOptionId && (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle className="w-3.5 h-3.5" />
                Oyladınız
              </span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
            <BarChart3 className="w-3.5 h-3.5 text-slate-500" />
            <span className="font-semibold text-slate-200">{question.total_votes}</span> oy
          </div>
        </div>

        {/* Question Title */}
        <h3
          onClick={() => onSelect(question)}
          className="text-lg sm:text-xl font-bold text-white group-hover:text-indigo-300 transition-colors cursor-pointer line-clamp-2 leading-snug"
        >
          {question.title}
        </h3>

        {question.description && (
          <p className="mt-2 text-xs sm:text-sm text-slate-400 line-clamp-2 leading-relaxed">
            {question.description}
          </p>
        )}

        {/* Options Mini Live Preview */}
        <div className="mt-4 space-y-2">
          {question.options.slice(0, 3).map((option) => {
            const isUserChoice = userVotedOptionId === option.id;
            const isLeader = leadingOption?.id === option.id && question.total_votes > 0;

            return (
              <div
                key={option.id}
                className={`relative overflow-hidden rounded-xl border p-2.5 text-xs transition-all ${
                  isUserChoice
                    ? 'border-indigo-500/60 bg-indigo-950/20'
                    : 'border-slate-800/80 bg-slate-950/50'
                }`}
              >
                {/* Real-time Percentage Bar */}
                <div
                  className={`absolute top-0 bottom-0 left-0 transition-all duration-500 ease-out ${
                    isUserChoice
                      ? 'bg-gradient-to-r from-indigo-600/30 to-violet-600/30'
                      : isLeader
                      ? 'bg-gradient-to-r from-emerald-600/20 to-teal-600/15'
                      : 'bg-slate-800/40'
                  }`}
                  style={{ width: `${Math.max(option.percentage, 0)}%` }}
                />

                <div className="relative flex items-center justify-between gap-2 z-10">
                  <div className="flex items-center gap-1.5 truncate">
                    {isLeader && <Crown className="w-3.5 h-3.5 text-amber-400 shrink-0" />}
                    <span
                      className={`truncate font-medium ${
                        isUserChoice ? 'text-indigo-200 font-semibold' : 'text-slate-300'
                      }`}
                    >
                      {option.text}
                    </span>
                    {isUserChoice && (
                      <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-medium">
                        Oyunuz
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[11px] shrink-0">
                    <span className="text-slate-400">{option.votes_count} oy</span>
                    <span
                      className={`font-semibold ${
                        isLeader ? 'text-emerald-400' : 'text-slate-200'
                      }`}
                    >
                      %{option.percentage}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {question.options.length > 3 && (
            <div className="text-[11px] text-slate-500 italic text-center pt-0.5">
              +{question.options.length - 3} seçenek daha var
            </div>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between gap-2">
        <div className="flex items-center gap-3 text-xs text-slate-400 truncate">
          <div className="flex items-center gap-1.5 truncate">
            <User className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="truncate">{question.creator || 'Enes Öztürk'}</span>
          </div>
          <span className="text-slate-700">•</span>
          <div className="flex items-center gap-1 text-[11px] text-slate-500 shrink-0">
            <Clock className="w-3 h-3" />
            <span>{formatDate(question.created_at)}</span>
          </div>
        </div>

        <button
          onClick={() => onSelect(question)}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600/90 hover:bg-indigo-500 transition-all cursor-pointer shadow-md shadow-indigo-600/20 active:scale-95 shrink-0"
        >
          <span>{userVotedOptionId ? 'Sonuçlar' : 'Oyla'}</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
};
