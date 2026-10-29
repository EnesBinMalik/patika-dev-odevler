import React from 'react';
import { HelpCircle, CheckCircle2, Users, Zap, RefreshCw } from 'lucide-react';
import { AppStats } from '../lib/graphqlQueries.ts';

interface StatsCardsProps {
  stats: AppStats;
  onRefresh: () => void;
  isLoading: boolean;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats, onRefresh, isLoading }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Total Questions Card */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg shadow-black/20 group hover:border-slate-700/80 transition-all">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:bg-indigo-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Toplam Soru</span>
          <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <HelpCircle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {stats.totalQuestions}
          </span>
          <span className="text-xs text-indigo-400 font-medium">aktif oylama</span>
        </div>
      </div>

      {/* Total Votes Card */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg shadow-black/20 group hover:border-slate-700/80 transition-all">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-violet-500/10 rounded-full blur-2xl group-hover:bg-violet-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Kullanılan Toplam Oy</span>
          <div className="p-2 rounded-xl bg-violet-500/10 text-violet-400 border border-violet-500/20">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {stats.totalVotes}
          </span>
          <span className="text-xs text-violet-400 font-medium">canlı kaydedildi</span>
        </div>
      </div>

      {/* Active Users */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg shadow-black/20 group hover:border-slate-700/80 transition-all">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Tahmini Katılımcı</span>
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <Users className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
            {stats.activeUsers}
          </span>
          <span className="text-xs text-emerald-400 font-medium">çevrimiçi</span>
        </div>
      </div>

      {/* Realtime Subscription Status */}
      <div className="relative overflow-hidden p-4 sm:p-5 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-900/40 border border-slate-800/80 shadow-lg shadow-black/20 group hover:border-slate-700/80 transition-all">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-medium text-slate-400">Protokol & Motor</span>
          <button
            onClick={onRefresh}
            disabled={isLoading}
            title="Manuel Yenile"
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-sm font-semibold text-slate-200">GraphQL PubSub</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-1 font-mono">
          Yoga SSE • Instant Sync
        </div>
      </div>
    </div>
  );
};
