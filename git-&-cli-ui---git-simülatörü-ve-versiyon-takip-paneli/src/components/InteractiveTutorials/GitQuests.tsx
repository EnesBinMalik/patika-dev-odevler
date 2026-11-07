import React, { useState } from 'react';
import { GitState, Quest } from '../../types/git';
import confetti from 'canvas-confetti';
import { Award, CheckCircle2, ChevronRight, Play, RefreshCw, Sparkles, BookOpen, ExternalLink, Lightbulb } from 'lucide-react';

interface GitQuestsProps {
  gitState: GitState;
  onExecuteCommand: (command: string) => void;
  onResetPreset: (preset: 'starter' | 'branching' | 'conflict') => void;
}

export const QUESTS: Quest[] = [
  {
    id: 'quest-basics',
    title: '1. Temel Git Yaşam Döngüsü',
    difficulty: 'Başlangıç',
    description: 'Bir dosyayı değiştirin, hazırlık alanına (stage) ekleyin ve commit ile depoya kaydedin.',
    steps: [
      {
        title: 'Depo Durumunu İncele',
        description: 'Mevcut çalışma ağacının ve hazırlık alanının durumunu kontrol edin.',
        targetCommand: 'git status',
        hint: 'Terminalde "git status" komutunu çalıştırın.',
        actionSummary: 'Çalışma ağacının temiz veya kirli olduğunu listeler.',
      },
      {
        title: 'Dosyaları Hazırlık Alanına Al',
        description: 'Yapılan değişiklikleri commit edilmeye hazır hale getirmek için stage alanına ekleyin.',
        targetCommand: 'git add .',
        hint: 'Tüm değişiklikleri eklemek için "git add ." yazın.',
        actionSummary: 'Değişiklikleri Working Directory\'den Staging Area\'ya taşır.',
      },
      {
        title: 'İlk Özellik Commitini Oluştur',
        description: 'Staged alanındaki dosyaları kalıcı bir versiyon olarak kaydedin.',
        targetCommand: 'git commit -m "feat: ilk ozellik eklendi"',
        hint: 'Açıklayıcı bir mesaj ile "git commit -m ..." komutunu verin.',
        actionSummary: 'Yeni bir commit hash üretir ve HEAD göstergesini ileri taşır.',
      },
    ],
  },
  {
    id: 'quest-branching',
    title: '2. Branching & İzole Geliştirme',
    difficulty: 'Orta',
    description: 'Ana daldan (main) kopmadan yeni bir özellik dalı oluşturup üzerinde bağımsız çalışın.',
    steps: [
      {
        title: 'Yeni Dal Aç ve Geçiş Yap',
        description: 'Özellik geliştirmek için "feature/auth" adında yeni bir dal açıp bu dala geçin.',
        targetCommand: 'git checkout -b feature/auth',
        hint: 'Hem dal açıp hem geçmek için "git checkout -b feature/auth" kullanın.',
        actionSummary: 'Yeni bir branch pointer oluşturur ve HEAD\'i bu dala bağlar.',
      },
      {
        title: 'Özellik Dalında Commit At',
        description: 'Kimlik doğrulama özelliği için commit kaydedin.',
        targetCommand: 'git commit -am "feat(auth): giris ekrani tamamlandi"',
        hint: '"git commit -am ..." komutuyla hızlıca commit atın.',
        actionSummary: 'Yalnızca feature/auth dalında yeni bir commit düğümü oluşturur.',
      },
      {
        title: 'Ana Dala Geri Dön',
        description: 'Birleştirme öncesi güvenli şekilde main dalına geçiş yapın.',
        targetCommand: 'git checkout main',
        hint: 'Dalı değiştirmek için "git checkout main" yazın.',
        actionSummary: 'HEAD göstergesini tekrar main dalının commitine taşır.',
      },
      {
        title: 'Özellik Dalını Birleştir (Merge)',
        description: 'feature/auth dalındaki yenilikleri main dalına entegre edin.',
        targetCommand: 'git merge feature/auth',
        hint: '"git merge feature/auth" yazarak dalları birleştirin.',
        actionSummary: 'Fast-Forward veya 3-Way merge ile geçmişleri birleştirir.',
      },
    ],
  },
  {
    id: 'quest-conflict',
    title: '3. Merge Çakışması ve Çözümü',
    difficulty: 'İleri',
    description: 'Aynı dosyanın aynı satırları iki farklı dalda değiştirildiğinde ortaya çıkan çakışmayı yönetin.',
    steps: [
      {
        title: 'Çakışma Senaryosunu Başlat',
        description: 'İki farklı dalın index.html dosyasını değiştirdiği çakışma reposunu yükleyin.',
        targetCommand: 'git merge feature/header-redesign',
        hint: 'Çakışmayı tetiklemek için "git merge feature/header-redesign" komutunu çalıştırın.',
        actionSummary: 'Git çakışmayı tespit eder ve dosyaya conflict markers yerleştirir.',
      },
      {
        title: 'Çözülen Dosyayı Stage Et',
        description: 'Çakışma çözüldükten sonra dosyayı hazırlık alanına ekleyin.',
        targetCommand: 'git add index.html',
        hint: '"git add index.html" yazarak çakışmanın çözüldüğünü Git\'e bildirin.',
        actionSummary: 'Çakışma durumunu giderilmiş olarak işaretler.',
      },
      {
        title: 'Merge Commitini Tamamla',
        description: 'Çözülen merge işlemini sonlandırın.',
        targetCommand: 'git commit -m "merge: baslik cakismasi cozuldu"',
        hint: '"git commit -m ..." ile birleşimi onaylayın.',
        actionSummary: 'İki ebeveyne sahip özel bir merge commit üretir.',
      },
    ],
  },
  {
    id: 'quest-remote',
    title: '4. Uzak Depo Senkronizasyonu (Push & Pull)',
    difficulty: 'Orta',
    description: 'Yerel commitleri GitHub uzak deposuyla (origin) eşitleyin.',
    steps: [
      {
        title: 'Commitleri Gönder (Push)',
        description: 'Yerel main dalındaki yenilikleri uzak depodaki origin/main dalına gönderin.',
        targetCommand: 'git push origin main',
        hint: '"git push origin main" yazın.',
        actionSummary: 'origin/main referansını yerel HEAD ile aynı seviyeye çeker.',
      },
      {
        title: 'Geçmişi İncele',
        description: 'Commit grafiğinde origin/main etiketinin HEAD ile eşleştiğini görün.',
        targetCommand: 'git log --oneline',
        hint: '"git log --oneline" yazarak HEAD -> main, origin/main kontrolü yapın.',
        actionSummary: 'Commit zincirini ve referansları terminale basar.',
      },
    ],
  },
];

export const GitQuests: React.FC<GitQuestsProps> = ({
  gitState,
  onExecuteCommand,
  onResetPreset,
}) => {
  const [activeQuestId, setActiveQuestId] = useState<string>('quest-basics');
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());

  const activeQuest = QUESTS.find((q) => q.id === activeQuestId) || QUESTS[0];
  const currentStep = activeQuest.steps[currentStepIndex];

  const handleStepComplete = () => {
    if (currentStepIndex < activeQuest.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      // Quest Completed! Trigger Confetti
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
      setCompletedQuests((prev) => new Set([...prev, activeQuest.id]));
    }
  };

  const handleRunCommand = (cmd: string) => {
    onExecuteCommand(cmd);
    handleStepComplete();
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Top Header */}
      <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            İnteraktif Git Senaryoları & Görevler
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400">
            Tamamlanan: {completedQuests.size} / {QUESTS.length}
          </span>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* Quest Selector List */}
        <div className="w-full md:w-64 bg-slate-950/60 border-r border-slate-800 p-2 space-y-1 overflow-y-auto">
          {QUESTS.map((quest) => {
            const isCompleted = completedQuests.has(quest.id);
            const isActive = activeQuestId === quest.id;

            return (
              <button
                key={quest.id}
                onClick={() => {
                  setActiveQuestId(quest.id);
                  setCurrentStepIndex(0);
                  if (quest.id === 'quest-conflict') {
                    onResetPreset('conflict');
                  } else if (quest.id === 'quest-branching') {
                    onResetPreset('starter');
                  }
                }}
                className={`w-full text-left p-2.5 rounded-lg transition-colors flex items-start gap-2.5 ${
                  isActive
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <div className="mt-0.5">
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <div className="w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center text-[10px]">
                      ●
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate text-slate-200">{quest.title}</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                    <span>{quest.difficulty}</span>
                    <span>·</span>
                    <span>{quest.steps.length} adım</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Quest Details & Interactive Step Card */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  {activeQuest.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{activeQuest.description}</p>
              </div>

              {completedQuests.has(activeQuest.id) && (
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-emerald-950/60 border border-emerald-800 text-emerald-400 text-xs font-medium">
                  <Award className="w-4 h-4" />
                  <span>Tamamlandı!</span>
                </div>
              )}
            </div>

            {/* Step Progress indicators */}
            <div className="flex items-center gap-1.5 my-4">
              {activeQuest.steps.map((s, idx) => (
                <div
                  key={idx}
                  className={`flex-1 h-1.5 rounded-full transition-all ${
                    idx < currentStepIndex
                      ? 'bg-emerald-500'
                      : idx === currentStepIndex
                      ? 'bg-amber-400'
                      : 'bg-slate-800'
                  }`}
                />
              ))}
            </div>

            {/* Current Step Content */}
            {currentStep && (
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-mono text-amber-400 font-semibold uppercase">
                    Adım {currentStepIndex + 1} / {activeQuest.steps.length}
                  </span>
                  <span className="text-xs text-slate-500">{currentStep.actionSummary}</span>
                </div>

                <h4 className="text-sm font-semibold text-white">{currentStep.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>

                {/* Command Action Box */}
                <div className="bg-slate-900 border border-slate-800/80 rounded-lg p-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2 font-mono text-xs text-emerald-400 truncate">
                    <span className="text-slate-500 select-none">$</span>
                    <span className="font-semibold">{currentStep.targetCommand}</span>
                  </div>

                  <button
                    onClick={() => handleRunCommand(currentStep.targetCommand)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors shadow-sm whitespace-nowrap"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>Komutu Çalıştır</span>
                  </button>
                </div>

                {/* Hint */}
                <div className="flex items-start gap-2 text-slate-400 text-[11px] bg-slate-900/40 p-2 rounded">
                  <Lightbulb className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                  <span>{currentStep.hint}</span>
                </div>
              </div>
            )}
          </div>

          {/* Reset / Preset helpers */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
            <span>İpucu: Komutu elle terminale yazarak veya butona basarak çalıştırabilirsiniz.</span>
            <button
              onClick={() => {
                onResetPreset('starter');
                setCurrentStepIndex(0);
              }}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Senaryoyu Başa Sar</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
