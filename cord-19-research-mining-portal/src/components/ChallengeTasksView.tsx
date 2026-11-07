import React, { useState } from 'react';
import { CORD19_CHALLENGE_TASKS, ChallengeTask, CORD19_PAPERS } from '../data/cord19Dataset';
import { Sparkles, ArrowRight, CheckCircle2, AlertTriangle, Layers, BookOpen, ExternalLink } from 'lucide-react';

interface ChallengeTasksViewProps {
  onSelectPaper: (paperId: string) => void;
  onMineTask: (task: ChallengeTask) => void;
}

export const ChallengeTasksView: React.FC<ChallengeTasksViewProps> = ({
  onSelectPaper,
  onMineTask
}) => {
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-1');

  const activeTask = CORD19_CHALLENGE_TASKS.find(t => t.id === selectedTaskId) || CORD19_CHALLENGE_TASKS[0];
  const relatedPapers = CORD19_PAPERS.filter(p => p.taskId === activeTask.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            BEYAZ SARAY OSTP & KAGGLE ORTAK PROTOKOLÜ
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Yüksek Öncelikli Bilimsel Araştırma Soruları
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-3xl">
            Tıp camiasının acil klinik ve halk sağlığı kararlarında ihtiyaç duyduğu 10 temel araştırma alanı ve CORD-19 veri madenciliği konsensüs bulguları.
          </p>
        </div>
        <div className="text-xs text-slate-400 font-mono text-right">
          <div>TOPLAM ANALİZ EDİLEN YAYIN: <span className="text-white font-semibold tabular-nums">21,800+</span></div>
          <div>KÜRESEL ÖRNEKLEM: <span className="text-white font-semibold tabular-nums">9.8 Milyon</span></div>
        </div>
      </div>

      {/* 2-Column Split: Task Selector on Left, Deep Evidence Matrix on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: 10 Tasks Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <div className="text-xs font-mono uppercase tracking-wider text-slate-400 px-2 pb-1">
            Araştırma Başlıkları (10 Görev)
          </div>
          <div className="space-y-1.5 max-h-[720px] overflow-y-auto pr-1">
            {CORD19_CHALLENGE_TASKS.map((task) => {
              const isSelected = task.id === selectedTaskId;
              return (
                <button
                  key={task.id}
                  onClick={() => setSelectedTaskId(task.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-all text-xs flex flex-col space-y-1.5 ${
                    isSelected
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-md shadow-cyan-950/20'
                      : 'bg-slate-900/50 hover:bg-slate-900 border-slate-800/80 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className={`font-mono font-bold text-[11px] ${isSelected ? 'text-cyan-400' : 'text-slate-400'}`}>
                      GÖREV {task.number.toString().padStart(2, '0')}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      %{task.consensusPercentage} Konsensüs
                    </span>
                  </div>
                  <div className={`font-semibold text-sm leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                    {task.titleTr}
                  </div>
                  <div className="text-slate-400 text-[11px] line-clamp-2 leading-relaxed">
                    {task.shortDesc}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Task Deep Synthesis & Evidence Matrix */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
            
            {/* Task Banner */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
                  <span>GÖREV {activeTask.number.toString().padStart(2, '0')}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span>{activeTask.priorityLevel}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-400">{activeTask.titleEn}</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold text-white leading-snug">
                  {activeTask.titleTr}
                </h3>
                <p className="text-sm text-slate-300 italic pt-1">
                  "{activeTask.fullQuestion}"
                </p>
              </div>

              {/* Action Button: AI Mine This Task */}
              <button
                onClick={() => onMineTask(activeTask)}
                className="self-start px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Yapay Zeka İle Sentezle</span>
              </button>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-slate-400">Literatür Konsensüsü</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 tabular-nums mt-0.5">
                  %{activeTask.consensusPercentage}
                </div>
                <div className="text-[10px] text-slate-500">GRADE Standart Uyum</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-slate-400">İncelenen Çalışma</div>
                <div className="text-2xl font-bold font-mono text-white tabular-nums mt-0.5">
                  {activeTask.totalStudiesAnalyzed.toLocaleString('tr-TR')}
                </div>
                <div className="text-[10px] text-slate-500">CORD-19 Hakemli Yayın</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-[11px] font-mono uppercase text-slate-400">Toplam Hasta Havuzu</div>
                <div className="text-2xl font-bold font-mono text-cyan-400 tabular-nums mt-0.5">
                  {activeTask.totalSampleSizePool.toLocaleString('tr-TR')}
                </div>
                <div className="text-[10px] text-slate-500">Klinik Örneklem (N)</div>
              </div>
            </div>

            {/* Key Conclusions */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Metin Madenciliği İle Çıkarılan Temel Bilimsel Çıkarımlar</span>
              </div>
              <div className="space-y-2">
                {activeTask.keyConclusions.map((conclusion, i) => (
                  <div
                    key={i}
                    className="p-3.5 rounded-xl bg-slate-950/40 border border-slate-800/70 text-xs text-slate-200 leading-relaxed flex items-start gap-2.5"
                  >
                    <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5">
                      {(i + 1).toString().padStart(2, '0')}.
                    </span>
                    <span>{conclusion}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Evidence Summary Table */}
            <div className="space-y-3">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                <Layers className="w-4 h-4 text-cyan-400" />
                <span>Havuzlanmış Kanıt Matrisi (GRADE Standardı)</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-slate-800">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-950/80 border-b border-slate-800 text-[11px] font-mono uppercase text-slate-400">
                    <tr>
                      <th className="py-2.5 px-3 font-semibold">Müdahale / Parametre</th>
                      <th className="py-2.5 px-3 font-semibold">Havuzlanmış Etki</th>
                      <th className="py-2.5 px-3 font-semibold">Kanıt Gücü</th>
                      <th className="py-2.5 px-3 font-semibold">Klinik Karar Çıkarımı</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                    {activeTask.evidenceSummary.map((item, idx) => (
                      <tr key={idx} className="hover:bg-slate-800/30">
                        <td className="py-2.5 px-3 font-medium text-white">{item.interventionOrFactor}</td>
                        <td className="py-2.5 px-3 font-mono text-cyan-300">{item.pooledEffect}</td>
                        <td className="py-2.5 px-3 text-slate-300">{item.evidenceStrength}</td>
                        <td className="py-2.5 px-3 text-slate-400">{item.implication}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Open Contradictions & Scientific Unknowns */}
            {activeTask.openContradictions.length > 0 && (
              <div className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 font-mono">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Açık Kalan Sorular ve Literatürdeki Çelişkiler</span>
                </div>
                <ul className="space-y-1 text-xs text-amber-200/80 list-disc list-inside">
                  {activeTask.openContradictions.map((c, idx) => (
                    <li key={idx} className="leading-relaxed">{c}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Related Landmark Papers */}
            {relatedPapers.length > 0 && (
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                  <span>Bu Alandaki Öncü CORD-19 Makaleleri</span>
                  <span className="text-cyan-400">{relatedPapers.length} Yayın İndekslendi</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedPapers.map(paper => (
                    <div
                      key={paper.id}
                      onClick={() => onSelectPaper(paper.id)}
                      className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-slate-700 cursor-pointer transition-colors space-y-2 group"
                    >
                      <div className="text-[11px] text-slate-400 flex items-center justify-between">
                        <span className="font-semibold text-cyan-400/90">{paper.journal}</span>
                        <span className="font-mono tabular-nums">{paper.publishYear}</span>
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-cyan-300 transition-colors line-clamp-2">
                        {paper.title}
                      </div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        {paper.citations.toLocaleString('tr-TR')} Atıf · {paper.studyDesign}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
};
