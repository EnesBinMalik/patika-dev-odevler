/**
 * Proje 4 - Realtime Voting App
 * GraphQL Backend & Client with Real-time Subscriptions
 * Geliştirici: Enes Öztürk
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  Filter,
  Plus,
  Radio,
  Sparkles,
  TrendingUp,
  Clock,
  Layers,
  ArrowUpDown,
  CheckCircle2,
} from 'lucide-react';
import { Header } from './components/Header.tsx';
import { StatsCards } from './components/StatsCards.tsx';
import { QuestionCard } from './components/QuestionCard.tsx';
import { CreateQuestionModal } from './components/CreateQuestionModal.tsx';
import { QuestionDetailModal } from './components/QuestionDetailModal.tsx';
import { GraphiQLModal } from './components/GraphiQLModal.tsx';
import { Footer } from './components/Footer.tsx';
import {
  Question,
  AppStats,
  GET_QUESTIONS_QUERY,
  CREATE_QUESTION_MUTATION,
  VOTE_MUTATION,
  RESET_DATA_MUTATION,
  QUESTION_ADDED_SUBSCRIPTION,
  QUESTION_UPDATED_SUBSCRIPTION,
} from './lib/graphqlQueries.ts';
import { requestGraphQL, subscribeGraphQL } from './lib/graphqlClient.ts';
import { getStoredVotes, saveUserVote, removeUserVote } from './lib/userVotes.ts';

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [stats, setStats] = useState<AppStats>({
    totalQuestions: 0,
    totalVotes: 0,
    activeUsers: 14,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Active question modal / detail
  const [activeQuestion, setActiveQuestion] = useState<Question | null>(null);

  // Modal controls
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isGraphiQLOpen, setIsGraphiQLOpen] = useState(false);
  const [isSubmittingQuestion, setIsSubmittingQuestion] = useState(false);
  const [isVoting, setIsVoting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);

  // Realtime connection status
  const [connectionStatus, setConnectionStatus] = useState<
    'connecting' | 'connected' | 'disconnected'
  >('connecting');

  // Track user's votes from localStorage: { [questionId]: optionId }
  const [userVotes, setUserVotes] = useState<Record<string, string>>({});

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tümü');
  const [sortBy, setSortBy] = useState<'newest' | 'most_votes'>('newest');

  // Set of recently added question IDs for highlighted badge animation
  const [recentlyAddedIds, setRecentlyAddedIds] = useState<Set<string>>(new Set());

  // Load user votes from localStorage on mount
  useEffect(() => {
    setUserVotes(getStoredVotes());
  }, []);

  // Fetch initial questions and stats
  const fetchQuestions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await requestGraphQL<{ questions: Question[]; stats: AppStats }>(
        GET_QUESTIONS_QUERY
      );
      setQuestions(data.questions);
      setStats(data.stats);
    } catch (err: unknown) {
      console.error('Failed to fetch questions:', err);
      setError(err instanceof Error ? err.message : 'Sorular yüklenirken hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  // Real-time Subscriptions:
  // 1. questionAdded: When a new question is created, immediately prepend to top of list!
  // 2. questionUpdated: When anyone votes on any question, update option counts and percentages live!
  useEffect(() => {
    // 1. Subscribe to newly added questions
    const unsubAdded = subscribeGraphQL<{ questionAdded: Question }>(
      QUESTION_ADDED_SUBSCRIPTION,
      {},
      (payload) => {
        if (payload?.questionAdded) {
          const newQ = payload.questionAdded;
          setQuestions((prev) => {
            // Guard against duplicate id
            if (prev.some((q) => q.id === newQ.id)) {
              return prev;
            }
            return [newQ, ...prev];
          });

          // Highlight new question
          setRecentlyAddedIds((prev) => new Set(prev).add(newQ.id));
          setTimeout(() => {
            setRecentlyAddedIds((prev) => {
              const next = new Set(prev);
              next.delete(newQ.id);
              return next;
            });
          }, 8000);

          // Update stats
          setStats((prev) => ({
            ...prev,
            totalQuestions: prev.totalQuestions + 1,
            totalVotes: prev.totalVotes + newQ.total_votes,
          }));
        }
      },
      (err) => console.warn('Add sub warning:', err),
      (status) => setConnectionStatus(status)
    );

    // 2. Subscribe to question updates (votes cast)
    const unsubUpdated = subscribeGraphQL<{ questionUpdated: Question }>(
      QUESTION_UPDATED_SUBSCRIPTION,
      {},
      (payload) => {
        if (payload?.questionUpdated) {
          const updatedQ = payload.questionUpdated;
          setQuestions((prev) =>
            prev.map((q) => (q.id === updatedQ.id ? updatedQ : q))
          );

          // If current modal is viewing this question, update it too
          setActiveQuestion((current) => (current?.id === updatedQ.id ? updatedQ : current));

          // Recalculate total votes in stats
          setStats((prev) => {
            let total = 0;
            // update existing list with updatedQ
            setQuestions((curr) => {
              total = curr.reduce((sum, item) => sum + (item.id === updatedQ.id ? updatedQ.total_votes : item.total_votes), 0);
              return curr;
            });
            return {
              ...prev,
              totalVotes: Math.max(prev.totalVotes, total),
            };
          });
        }
      },
      (err) => console.warn('Update sub warning:', err)
    );

    return () => {
      unsubAdded();
      unsubUpdated();
    };
  }, []);

  // Handle URL hash routing (e.g. #question/q-react-2026)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#question/')) {
        const qId = hash.replace('#question/', '');
        const found = questions.find((q) => q.id === qId);
        if (found) {
          setActiveQuestion(found);
        }
      }
    };

    if (questions.length > 0) {
      handleHashChange();
    }

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [questions]);

  // Handle Open Question
  const handleSelectQuestion = (q: Question) => {
    setActiveQuestion(q);
    window.location.hash = `#question/${q.id}`;
  };

  const handleCloseQuestion = () => {
    setActiveQuestion(null);
    if (window.location.hash.startsWith('#question/')) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  };

  // Create Question Mutation
  const handleCreateQuestion = async (inputData: {
    title: string;
    description?: string;
    category: string;
    creator: string;
    options: { text: string }[];
  }) => {
    setIsSubmittingQuestion(true);
    try {
      const result = await requestGraphQL<{ createQuestion: Question }>(
        CREATE_QUESTION_MUTATION,
        { input: inputData }
      );
      // The subscription will handle adding it, but we can also ensure local state has it
      setQuestions((prev) => {
        if (prev.some((q) => q.id === result.createQuestion.id)) return prev;
        return [result.createQuestion, ...prev];
      });
      setRecentlyAddedIds((prev) => new Set(prev).add(result.createQuestion.id));
    } finally {
      setIsSubmittingQuestion(false);
    }
  };

  // Vote Mutation
  const handleVote = async (questionId: string, optionId: string): Promise<Question> => {
    setIsVoting(true);
    try {
      const result = await requestGraphQL<{ vote: Question }>(VOTE_MUTATION, {
        questionId,
        optionId,
      });

      const updated = result.vote;
      // Update local question list
      setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
      return updated;
    } finally {
      setIsVoting(false);
    }
  };

  // Update user vote in localStorage & state
  const handleUserVoteChanged = (questionId: string, optionId: string | null) => {
    if (optionId) {
      saveUserVote(questionId, optionId);
      setUserVotes((prev) => ({ ...prev, [questionId]: optionId }));
    } else {
      removeUserVote(questionId);
      setUserVotes((prev) => {
        const copy = { ...prev };
        delete copy[questionId];
        return copy;
      });
    }
  };

  // Random Test Vote for Demo: selects a random question and votes
  const handleRandomTestVote = async () => {
    if (questions.length === 0) return;
    try {
      setIsVoting(true);
      // Pick random question
      const randomQ = questions[Math.floor(Math.random() * questions.length)];
      if (!randomQ || randomQ.options.length === 0) return;
      // Pick random option
      const randomOpt =
        randomQ.options[Math.floor(Math.random() * randomQ.options.length)];

      await handleVote(randomQ.id, randomOpt.id);
    } catch (err) {
      console.error('Random test vote failed:', err);
    } finally {
      setIsVoting(false);
    }
  };

  // Reset to sample data
  const handleResetData = async () => {
    if (!window.confirm('Örnek soruları ve oy verilerini sıfırlamak istediğinize emin misiniz?')) {
      return;
    }
    setIsResetting(true);
    try {
      await requestGraphQL(RESET_DATA_MUTATION);
      localStorage.removeItem('realtime_voting_user_votes_v1');
      setUserVotes({});
      await fetchQuestions();
    } catch (err) {
      console.error('Reset failed:', err);
    } finally {
      setIsResetting(false);
    }
  };

  // Categories list derived from questions
  const categories = useMemo(() => {
    const set = new Set<string>();
    questions.forEach((q) => {
      if (q.category) set.add(q.category);
    });
    return ['Tümü', ...Array.from(set)];
  }, [questions]);

  // Filtered & Sorted Questions
  const filteredQuestions = useMemo(() => {
    return questions
      .filter((q) => {
        const matchesCategory =
          selectedCategory === 'Tümü' || q.category === selectedCategory;
        const matchesSearch =
          q.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          q.options.some((o) => o.text.toLowerCase().includes(searchQuery.toLowerCase())) ||
          (q.description && q.description.toLowerCase().includes(searchQuery.toLowerCase()));
        return matchesCategory && matchesSearch;
      })
      .sort((a, b) => {
        if (sortBy === 'most_votes') {
          return b.total_votes - a.total_votes;
        }
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
  }, [questions, selectedCategory, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background radial ambient lights */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px]" />
        <div className="absolute top-[40%] right-[-100px] w-[500px] h-[500px] bg-violet-600/10 rounded-full blur-[160px]" />
        <div className="absolute bottom-10 left-[-100px] w-[500px] h-[500px] bg-emerald-600/10 rounded-full blur-[160px]" />
      </div>

      {/* Navigation Header */}
      <Header
        onOpenCreate={() => setIsCreateOpen(true)}
        onOpenGraphiQL={() => setIsGraphiQLOpen(true)}
        onRandomTestVote={handleRandomTestVote}
        connectionStatus={connectionStatus}
        isVoting={isVoting}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Hero Banner with Enes Öztürk Signature */}
        <section className="mb-10 text-center sm:text-left relative overflow-hidden p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900/90 via-indigo-950/30 to-slate-900/90 border border-slate-800 shadow-2xl">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-semibold mb-3">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                <span>Enes Öztürk • Realtime Voting App</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight">
                Gerçek Zamanlı GraphQL Oylama Sistemi
              </h1>
              <p className="mt-2.5 text-sm sm:text-base text-slate-300 leading-relaxed">
                GraphQL Subscriptions ve Yoga mimarisiyle çalışan anlık oylama platformu.
                Yeni bir soru eklendiğinde anasayfada en üstte belirir, verilen her oy anlık
                olarak oranlar ve grafiklerle güncellenir.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
              <button
                onClick={() => setIsCreateOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/30 transition-all active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Yeni Oylama Başlat</span>
              </button>

              <button
                onClick={handleRandomTestVote}
                disabled={isVoting}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl text-sm font-semibold text-slate-200 bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 shadow-md transition-all active:scale-95 cursor-pointer disabled:opacity-50"
              >
                <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                <span>Canlı Senkronizasyon Testi</span>
              </button>
            </div>
          </div>
        </section>

        {/* Real-time Statistics Cards */}
        <StatsCards stats={stats} onRefresh={fetchQuestions} isLoading={isLoading} />

        {/* Search, Filter, and Controls Bar */}
        <div className="mb-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/70 border border-slate-800/80 backdrop-blur-md">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Sorularda veya seçeneklerde ara..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-950/80 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30 text-white placeholder-slate-500 text-sm outline-none transition-all"
            />
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800/80'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-2 shrink-0">
            <ArrowUpDown className="w-4 h-4 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'most_votes')}
              className="px-3 py-2 rounded-xl bg-slate-950/80 border border-slate-800 text-slate-300 text-xs font-medium outline-none focus:border-indigo-500"
            >
              <option value="newest">En Yeni Sorular</option>
              <option value="most_votes">En Çok Oy Alanlar</option>
            </select>
          </div>
        </div>

        {/* Realtime Status Indicator Bar */}
        <div className="mb-6 flex items-center justify-between text-xs text-slate-400 px-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-300">
              {filteredQuestions.length} soru listeleniyor
            </span>
            {selectedCategory !== 'Tümü' && (
              <span className="text-slate-500 font-mono">({selectedCategory} kategorisinde)</span>
            )}
          </div>

          <div className="flex items-center gap-1.5 text-emerald-400 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Yeni sorular doğrudan listenin en üstüne eklenir</span>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-sm">
            {error}
          </div>
        )}

        {/* Questions Grid */}
        {isLoading && questions.length === 0 ? (
          <div className="py-20 text-center">
            <div className="w-10 h-10 border-3 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin mx-auto mb-4" />
            <p className="text-sm text-slate-400">Sorular ve gerçek zamanlı akış yükleniyor...</p>
          </div>
        ) : filteredQuestions.length === 0 ? (
          <div className="py-20 text-center rounded-3xl bg-slate-900/40 border border-slate-800 p-8">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-3 text-slate-400">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Eşleşen soru bulunamadı</h3>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Arama filtrenizi temizleyebilir veya hemen yeni bir soru ekleyerek ilk oylamayı siz başlatabilirsiniz.
            </p>
            <button
              onClick={() => setIsCreateOpen(true)}
              className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Soru Ekle</span>
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredQuestions.map((question) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  userVotedOptionId={userVotes[question.id] || null}
                  onSelect={handleSelectQuestion}
                  isNew={recentlyAddedIds.has(question.id)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>

      {/* Question Detail & Voting Modal */}
      {activeQuestion && (
        <QuestionDetailModal
          question={activeQuestion}
          onClose={handleCloseQuestion}
          onVote={handleVote}
          userVotedOptionId={userVotes[activeQuestion.id] || null}
          onUserVoteChanged={handleUserVoteChanged}
          onQuestionUpdatedLive={(updated) => {
            setQuestions((prev) => prev.map((q) => (q.id === updated.id ? updated : q)));
          }}
        />
      )}

      {/* Create Question Modal */}
      <CreateQuestionModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onSubmit={handleCreateQuestion}
        isSubmitting={isSubmittingQuestion}
      />

      {/* GraphiQL Modal */}
      <GraphiQLModal isOpen={isGraphiQLOpen} onClose={() => setIsGraphiQLOpen(false)} />

      {/* Footer */}
      <Footer onResetData={handleResetData} isResetting={isResetting} />
    </div>
  );
}
