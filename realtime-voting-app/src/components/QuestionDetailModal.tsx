import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  X,
  CheckCircle2,
  Share2,
  Crown,
  Sparkles,
  BarChart3,
  Vote as VoteIcon,
  RotateCcw,
  User,
  Clock,
  Radio,
  Check,
} from 'lucide-react';
import { Question, Option } from '../lib/graphqlQueries.ts';
import { subscribeGraphQL } from '../lib/graphqlClient.ts';
import { QUESTION_UPDATED_SUBSCRIPTION } from '../lib/graphqlQueries.ts';

interface QuestionDetailModalProps {
  question: Question;
  onClose: () => void;
  onVote: (questionId: string, optionId: string) => Promise<Question>;
  userVotedOptionId: string | null;
  onUserVoteChanged: (questionId: string, optionId: string | null) => void;
  onQuestionUpdatedLive: (updated: Question) => void;
}

export const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({
  question: initialQuestion,
  onClose,
  onVote,
  userVotedOptionId,
  onUserVoteChanged,
  onQuestionUpdatedLive,
}) => {
  const [currentQuestion, setCurrentQuestion] = useState<Question>(initialQuestion);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(userVotedOptionId);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showResultsAnyway, setShowResultsAnyway] = useState(Boolean(userVotedOptionId));
  const [copied, setCopied] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [flashOptionId, setFlashOptionId] = useState<string | null>(null);

  // Keep internal state in sync if prop changes
  useEffect(() => {
    setCurrentQuestion(initialQuestion);
  }, [initialQuestion]);

  // Subscribe to real-time updates for THIS specific question via GraphQL Subscription!
  useEffect(() => {
    const unsubscribe = subscribeGraphQL<{ questionUpdated: Question }>(
      QUESTION_UPDATED_SUBSCRIPTION,
      { id: initialQuestion.id },
      (payload) => {
        if (payload?.questionUpdated && payload.questionUpdated.id === initialQuestion.id) {
          const updated = payload.questionUpdated;
          // Find which option got an increased vote to flash it
          const changedOpt = updated.options.find((opt) => {
            const prev = currentQuestion.options.find((p) => p.id === opt.id);
            return prev && opt.votes_count > prev.votes_count;
          });
          if (changedOpt) {
            setFlashOptionId(changedOpt.id);
            setTimeout(() => setFlashOptionId(null), 1200);
          }

          setCurrentQuestion(updated);
          onQuestionUpdatedLive(updated);
        }
      },
      (err) => {
        console.warn('Subscription warning:', err);
      },
      (status) => {
        setIsSubscribed(status === 'connected');
      }
    );

    return () => {
      unsubscribe();
    };
  }, [initialQuestion.id]);

  // Handle vote submission
  const handleVoteSubmit = async () => {
    if (!selectedOptionId) return;
    setIsSubmitting(true);
    try {
      const updated = await onVote(currentQuestion.id, selectedOptionId);
      setCurrentQuestion(updated);
      onUserVoteChanged(currentQuestion.id, selectedOptionId);
      setShowResultsAnyway(true);

      // Trigger celebratory confetti
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.65 },
        colors: ['#6366f1', '#8b5cf6', '#10b981', '#38bdf8', '#f59e0b'],
      });
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Test simulation vote: simulate another voter voting on a random option
  const handleSimulateOtherUserVote = async (targetOptionId?: string) => {
    try {
      let optId = targetOptionId;
      if (!optId) {
        // pick random option
        const randIdx = Math.floor(Math.random() * currentQuestion.options.length);
        optId = currentQuestion.options[randIdx].id;
      }
      await onVote(currentQuestion.id, optId);
    } catch (err) {
      console.error('Simulation vote failed:', err);
    }
  };

  const handleShare = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const handleResetMyVote = () => {
    onUserVoteChanged(currentQuestion.id, null);
    setSelectedOptionId(null);
    setShowResultsAnyway(false);
  };

  // Sort options to identify winner
  const sortedByVotes = [...currentQuestion.options].sort((a, b) => b.votes_count - a.votes_count);
  const leadingOption = currentQuestion.total_votes > 0 ? sortedByVotes[0] : null;

  const isShowingResults = showResultsAnyway || Boolean(userVotedOptionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/70 p-5 sm:p-8 my-6 text-slate-200 max-h-[92vh] overflow-y-auto">
        {/* Top bar */}
        <div className="flex items-center justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              {currentQuestion.category || 'Genel'}
            </span>

            {/* Realtime Subscription status pill */}
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-950/80 border border-slate-800 text-[11px] text-slate-300">
              <span
                className={`w-2 h-2 rounded-full ${
                  isSubscribed ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'
                }`}
              />
              <span className="font-mono text-[10px] text-emerald-400">
                {isSubscribed ? 'Canlı Subscriptions Aktif' : 'Bağlanıyor...'}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleShare}
              title="Bağlantıyı Kopyala"
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              {copied ? (
                <span className="flex items-center gap-1 text-xs text-emerald-400 font-medium">
                  <Check className="w-4 h-4" /> Kopyalandı
                </span>
              ) : (
                <Share2 className="w-4 h-4" />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Question Header */}
        <div className="mt-4">
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
            {currentQuestion.title}
          </h2>

          {currentQuestion.description && (
            <p className="mt-2 text-xs sm:text-sm text-slate-400 leading-relaxed">
              {currentQuestion.description}
            </p>
          )}

          <div className="mt-3 flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-800/60">
            <div className="flex items-center gap-1.5 text-slate-400">
              <User className="w-3.5 h-3.5 text-indigo-400" />
              <span>{currentQuestion.creator || 'Enes Öztürk'}</span>
            </div>
            <div className="flex items-center gap-1.5 font-mono text-slate-300">
              <BarChart3 className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-white">{currentQuestion.total_votes}</span> toplam oy
            </div>
          </div>
        </div>

        {/* Main Content: Voting Mode OR Results Mode */}
        {!isShowingResults ? (
          /* ================= VOTING MODE ================= */
          <div className="mt-6">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Oyunuzu Kullanın:
              </span>
              <button
                type="button"
                onClick={() => setShowResultsAnyway(true)}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-4 cursor-pointer"
              >
                Oy vermeden sonuçları gör →
              </button>
            </div>

            <div className="space-y-3">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelectedOptionId(option.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all duration-200 flex items-center justify-between gap-3 group cursor-pointer ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-950/40 shadow-lg shadow-indigo-600/15 ring-2 ring-indigo-500/30'
                        : 'border-slate-800 bg-slate-950/60 hover:bg-slate-800/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex items-center justify-center w-8 h-8 rounded-xl font-mono text-xs font-bold transition-colors ${
                          isSelected
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-slate-200'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span
                        className={`text-sm sm:text-base font-medium transition-colors ${
                          isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                        }`}
                      >
                        {option.text}
                      </span>
                    </div>

                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600 text-white'
                          : 'border-slate-700 bg-slate-900 group-hover:border-slate-500'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Submit Vote Button */}
            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <span className="text-xs text-slate-500 text-center sm:text-left">
                Seçiminizi yaptıktan sonra sonuçlar anlık olarak görüntülenecektir.
              </span>

              <button
                type="button"
                onClick={handleVoteSubmit}
                disabled={!selectedOptionId || isSubmitting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-95 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <VoteIcon className="w-4 h-4" />
                    <span>Oyu Gönder</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ) : (
          /* ================= REAL-TIME RESULTS MODE ================= */
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                  Canlı Oylama Sonuçları
                </span>
                <span className="flex h-2 w-2 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>

              {userVotedOptionId && (
                <button
                  type="button"
                  onClick={handleResetMyVote}
                  className="inline-flex items-center gap-1 text-xs text-slate-400 hover:text-indigo-400 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Fikrimi Değiştir</span>
                </button>
              )}
            </div>

            {/* Results List */}
            <div className="space-y-3.5">
              {currentQuestion.options.map((option, idx) => {
                const isUserChoice = userVotedOptionId === option.id;
                const isLeader = leadingOption?.id === option.id && currentQuestion.total_votes > 0;
                const isFlashing = flashOptionId === option.id;

                return (
                  <div
                    key={option.id}
                    className={`relative overflow-hidden rounded-2xl border p-4 transition-all duration-500 ${
                      isFlashing
                        ? 'border-indigo-400 ring-2 ring-indigo-400/40 bg-indigo-950/40'
                        : isUserChoice
                        ? 'border-indigo-500/70 bg-indigo-950/20 shadow-md shadow-indigo-600/10'
                        : isLeader
                        ? 'border-emerald-500/40 bg-slate-950/60'
                        : 'border-slate-800/80 bg-slate-950/40'
                    }`}
                  >
                    {/* Progress Bar Background */}
                    <div
                      className={`absolute top-0 bottom-0 left-0 transition-all duration-700 ease-out ${
                        isUserChoice
                          ? 'bg-gradient-to-r from-indigo-600/40 via-violet-600/35 to-fuchsia-600/30'
                          : isLeader
                          ? 'bg-gradient-to-r from-emerald-600/30 via-teal-600/25 to-emerald-500/20'
                          : 'bg-slate-800/50'
                      }`}
                      style={{ width: `${Math.max(option.percentage, 0)}%` }}
                    />

                    {/* Content inside option card */}
                    <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex items-center justify-center w-7 h-7 rounded-lg font-mono text-xs font-bold ${
                            isUserChoice
                              ? 'bg-indigo-600 text-white'
                              : isLeader
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-800 text-slate-300'
                          }`}
                        >
                          {String.fromCharCode(65 + idx)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span
                              className={`text-sm sm:text-base font-semibold ${
                                isUserChoice ? 'text-white' : 'text-slate-200'
                              }`}
                            >
                              {option.text}
                            </span>

                            {isLeader && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                                <Crown className="w-3 h-3 text-amber-300" />
                                Lider
                              </span>
                            )}

                            {isUserChoice && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                                <CheckCircle2 className="w-3 h-3 text-indigo-400" />
                                Sizin Tercihiniz
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Vote Count & Percentage Display */}
                      <div className="flex items-center gap-3 self-end sm:self-auto font-mono">
                        <div className="text-right">
                          <span className="text-xs text-slate-400 font-medium">
                            {option.votes_count} {option.votes_count === 1 ? 'oy' : 'oy'}
                          </span>
                        </div>

                        <div className="min-w-16 text-right">
                          <span
                            className={`text-lg sm:text-xl font-bold tracking-tight ${
                              isLeader
                                ? 'text-emerald-400'
                                : isUserChoice
                                ? 'text-indigo-300'
                                : 'text-slate-100'
                            }`}
                          >
                            %{option.percentage}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Real-time simulation bar */}
            <div className="mt-6 p-4 rounded-2xl bg-slate-950/70 border border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 text-xs text-slate-400">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>
                  Gerçek zamanlı aboneliği test edin: Başka bir kullanıcının oy verdiğini canlı görün.
                </span>
              </div>

              <button
                type="button"
                onClick={() => handleSimulateOtherUserVote()}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all active:scale-95 cursor-pointer shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Canlı Oy Simüle Et</span>
              </button>
            </div>

            {/* Back to Vote button if user hasn't voted yet */}
            {!userVotedOptionId && (
              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => setShowResultsAnyway(false)}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-medium cursor-pointer"
                >
                  ← Seçeneklere dönüp oy kullan
                </button>
              </div>
            )}
          </div>
        )}

        {/* Footer attribution */}
        <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span>Geliştirici:</span>
            <span className="text-slate-300 font-semibold">Enes Öztürk</span>
          </div>
          <span className="font-mono text-[11px] text-slate-500">GraphQL PubSub SSE Engine</span>
        </div>
      </div>
    </div>
  );
};
