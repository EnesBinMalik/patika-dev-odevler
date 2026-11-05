import React, { useState } from 'react';
import { QUIZ_QUESTIONS } from '../data/homeworkData';
import { CheckCircle2, XCircle, Award, RotateCcw, HelpCircle, ArrowRight } from 'lucide-react';

export const HomeworkQuiz: React.FC = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizCompleted, setQuizCompleted] = useState<boolean>(false);

  const currentQ = QUIZ_QUESTIONS[currentQuestionIndex];
  const selectedOptionId = selectedAnswers[currentQ.id];
  const selectedOption = currentQ.options.find((o) => o.id === selectedOptionId);

  const handleSelectOption = (optionId: string) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [currentQ.id]: optionId,
    }));
  };

  const handleSubmitAnswer = () => {
    if (!selectedOptionId) return;
    setIsAnswerSubmitted(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < QUIZ_QUESTIONS.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setIsAnswerSubmitted(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const handleRestartQuiz = () => {
    setSelectedAnswers({});
    setCurrentQuestionIndex(0);
    setIsAnswerSubmitted(false);
    setQuizCompleted(false);
  };

  // Calculate score
  const correctCount = QUIZ_QUESTIONS.filter((q) => {
    const chosen = selectedAnswers[q.id];
    const correctOpt = q.options.find((o) => o.isCorrect);
    return chosen === correctOpt?.id;
  }).length;

  const scorePercentage = Math.round((correctCount / QUIZ_QUESTIONS.length) * 100);

  return (
    <section id="quiz" className="py-12 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="mb-8">
          <div className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
            06. İnteraktif Ödev Değerlendirme & Test
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Model Mimarisi Bilgi Sınavı (6 Kritik Senaryo)
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 mt-2 max-w-3xl">
            Vize, final ve mülakatlarda en sık sorulan mimari senaryoları test edin. Her soru sonrası detaylı akademik açıklamayı inceleyip karnenizi oluşturun.
          </p>
        </div>

        {!quizCompleted ? (
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-6 lg:p-8 max-w-4xl shadow-sm">
            {/* Progress Bar */}
            <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400 mb-3">
              <span>Soru {currentQuestionIndex + 1} / {QUIZ_QUESTIONS.length}</span>
              <span>Başarı: %{scorePercentage}</span>
            </div>
            <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-6">
              <div
                className="bg-indigo-600 h-full transition-all duration-300"
                style={{
                  width: `${((currentQuestionIndex + 1) / QUIZ_QUESTIONS.length) * 100}%`,
                }}
              />
            </div>

            {/* Scenario Box */}
            <div className="p-4 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/50 mb-4">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-700 dark:text-indigo-400 uppercase tracking-wide mb-1">
                <HelpCircle className="w-3.5 h-3.5" />
                <span>Senaryo</span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-medium">
                {currentQ.scenario}
              </p>
            </div>

            {/* Question Text */}
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-5">
              {currentQ.question}
            </h3>

            {/* Options List */}
            <div className="space-y-3 mb-6">
              {currentQ.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                let optionStyle =
                  'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600';

                if (isAnswerSubmitted) {
                  if (option.isCorrect) {
                    optionStyle =
                      'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-500 text-emerald-900 dark:text-emerald-200 ring-2 ring-emerald-500/20';
                  } else if (isSelected && !option.isCorrect) {
                    optionStyle =
                      'bg-rose-50 dark:bg-rose-950/30 border-rose-500 text-rose-900 dark:text-rose-200 ring-2 ring-rose-500/20';
                  }
                } else if (isSelected) {
                  optionStyle =
                    'bg-indigo-50/50 dark:bg-indigo-950/30 border-indigo-500 text-slate-900 dark:text-white ring-2 ring-indigo-500/20';
                }

                return (
                  <button
                    key={option.id}
                    onClick={() => handleSelectOption(option.id)}
                    disabled={isAnswerSubmitted}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all cursor-pointer ${optionStyle}`}
                  >
                    <span
                      className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 mt-0.5 ${
                        isSelected
                          ? 'bg-indigo-600 text-white'
                          : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span className="text-xs sm:text-sm font-medium leading-relaxed">
                      {option.text}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Explanation box after submission */}
            {isAnswerSubmitted && selectedOption && (
              <div
                className={`p-4 rounded-xl border mb-6 flex items-start gap-3 ${
                  selectedOption.isCorrect
                    ? 'bg-emerald-50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                    : 'bg-rose-50 dark:bg-rose-950/20 border-rose-300 dark:border-rose-800 text-rose-900 dark:text-rose-200'
                }`}
              >
                {selectedOption.isCorrect ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
                )}
                <div className="text-xs sm:text-sm">
                  <div className="font-bold mb-1">
                    {selectedOption.isCorrect ? 'Tebrikler, Doğru Cevap!' : 'Cevabınız Hatalı!'}
                  </div>
                  <p className="leading-relaxed opacity-95">
                    {selectedOption.explanation}
                  </p>
                </div>
              </div>
            )}

            {/* Bottom Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
              <span className="text-xs text-slate-500">
                Lütfen cevabınızı işaretleyip onaylayın
              </span>

              {!isAnswerSubmitted ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={!selectedOptionId}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  Cevabı Onayla
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 dark:bg-indigo-600 hover:bg-slate-800 dark:hover:bg-indigo-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>
                    {currentQuestionIndex < QUIZ_QUESTIONS.length - 1
                      ? 'Sonraki Soru'
                      : 'Sonuçları Gör'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Completion Certificate Card */
          <div className="bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-700 p-8 max-w-2xl mx-auto text-center shadow-lg">
            <div className="w-16 h-16 rounded-full bg-indigo-600 text-white flex items-center justify-center mx-auto mb-4 shadow-md">
              <Award className="w-8 h-8" />
            </div>

            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-2">
              Ödev Sınavı Tamamlandı!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 mb-6">
              Model Mimarisi: Entity, DTO ve ViewModel testindeki performansınız:
            </p>

            <div className="inline-flex items-center justify-center gap-6 p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 mb-6">
              <div>
                <div className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400">
                  {correctCount} / {QUIZ_QUESTIONS.length}
                </div>
                <div className="text-xs text-slate-500 font-semibold">Doğru Sayısı</div>
              </div>
              <div className="w-px h-10 bg-slate-200 dark:bg-slate-700" />
              <div>
                <div className="text-3xl font-extrabold text-slate-900 dark:text-white">
                  %{scorePercentage}
                </div>
                <div className="text-xs text-slate-500 font-semibold">Başarı Oranı</div>
              </div>
            </div>

            {/* Official Signature Note */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto mb-6 text-left">
              <div className="font-bold text-slate-900 dark:text-white mb-1">
                Ödev Çözüm Onayı:
              </div>
              <p>
                Bu çalışma, yazılım mimarisi ilkelerine ve model izolasyonu standartlarına tam uyumlu olarak <strong className="text-slate-900 dark:text-white">Enes Öztürk</strong> tarafından başarıyla hazırlanmış ve doğrulanmıştır.
              </p>
            </div>

            <button
              onClick={handleRestartQuiz}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Sınavı Yeniden Başlat</span>
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
