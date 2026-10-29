import React, { useState } from 'react';
import { X, Terminal, ExternalLink, Copy, Check, Code2 } from 'lucide-react';

interface GraphiQLModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GraphiQLModal: React.FC<GraphiQLModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyCode = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(id);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const sampleSubscription = `subscription OnQuestionAdded {
  questionAdded {
    id
    title
    total_votes
    options {
      id
      text
      votes_count
      percentage
    }
  }
}`;

  const sampleVoteMutation = `mutation Vote($questionId: ID!, $optionId: ID!) {
  vote(questionId: $questionId, optionId: $optionId) {
    id
    total_votes
    options {
      id
      text
      votes_count
      percentage
    }
  }
}`;

  const sampleCreateMutation = `mutation CreateQuestion($input: CreateQuestionInput!) {
  createQuestion(input: $input) {
    id
    title
    total_votes
    options {
      id
      text
    }
  }
}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl shadow-black/70 p-6 sm:p-8 my-8 text-slate-200 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">GraphQL API & Subscriptions Explorer</h2>
              <p className="text-xs text-slate-400">
                Geliştirici: <span className="text-slate-200 font-medium">Enes Öztürk</span> • GraphQL Yoga + Express
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/graphql"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 transition-colors"
            >
              <span>GraphiQL'i Yeni Sekmede Aç</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 space-y-5">
          <div className="p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/30 text-xs sm:text-sm text-indigo-200 flex items-start gap-3">
            <Code2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-white">Nasıl Çalışır?</span>
              <p className="mt-1 text-slate-300 text-xs leading-relaxed">
                Bu uygulamada backend tarafında <strong>GraphQL Yoga</strong> çalışmaktadır.
                İstemciler HTTP üzerinden <code className="text-indigo-300 font-mono">/graphql</code> uç noktasına
                sorgu ve mutasyon gönderirken, gerçek zamanlı güncellemeler için W3C SSE tabanlı
                GraphQL Subscriptions mekanizması kullanılır.
              </p>
            </div>
          </div>

          {/* Subscriptions */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider">
                1. Gerçek Zamanlı Subscription (Anasayfa & Soru Dinleme)
              </span>
              <button
                onClick={() => copyCode(sampleSubscription, 'sub')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'sub' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-emerald-300 overflow-x-auto">
              {sampleSubscription}
            </pre>
          </div>

          {/* Vote Mutation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-violet-400 uppercase tracking-wider">
                2. Oy Verme Mutation
              </span>
              <button
                onClick={() => copyCode(sampleVoteMutation, 'vote')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'vote' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-violet-300 overflow-x-auto">
              {sampleVoteMutation}
            </pre>
          </div>

          {/* Create Question Mutation */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                3. Dinamik Seçenekli Soru Ekleme Mutation
              </span>
              <button
                onClick={() => copyCode(sampleCreateMutation, 'create')}
                className="text-xs text-slate-400 hover:text-white flex items-center gap-1"
              >
                {copiedSection === 'create' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>Kopyala</span>
              </button>
            </div>
            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs font-mono text-cyan-300 overflow-x-auto">
              {sampleCreateMutation}
            </pre>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-500">
          <span>Enes Öztürk • Realtime Voting App Architecture</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
