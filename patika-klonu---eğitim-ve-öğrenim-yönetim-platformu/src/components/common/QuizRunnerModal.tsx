import React, { useState } from 'react';
import { CheckCircle2, XCircle, Award, RotateCcw, ArrowRight } from 'lucide-react';
import { Modal } from './Modal';
import { Content, QuizQuestion } from '../../types';
import { useApp } from '../../context/AppContext';

interface QuizRunnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: Content | null;
  courseId: string;
}

export const QuizRunnerModal: React.FC<QuizRunnerModalProps> = ({
  isOpen,
  onClose,
  content,
  courseId,
}) => {
  const { getContentQuizzes, submitQuizResult, getStudentEnrollment } = useApp();
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [result, setResult] = useState<{ score: number; maxScore: number; passed: boolean } | null>(
    null
  );

  if (!content) return null;

  const questions: QuizQuestion[] = getContentQuizzes(content.id);
  const enrollment = getStudentEnrollment(courseId);
  const previousScore = enrollment?.quizScores?.[content.id];

  const handleOptionSelect = (questionId: string, optionIndex: number) => {
    if (isSubmitted) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleSubmit = () => {
    if (questions.length === 0) return;
    const res = submitQuizResult(courseId, content.id, selectedAnswers);
    setResult(res);
    setIsSubmitted(true);
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setIsSubmitted(false);
    setResult(null);
  };

  const allAnswered = questions.every((q) => selectedAnswers[q.id] !== undefined);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Quiz: ${content.title}`}
      subtitle={`${questions.length} Soru · Geçme Barajı: %60`}
      maxWidth="3xl"
    >
      <div className="space-y-6">
        {questions.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <p className="text-slate-400 text-sm">
              Bu içerik için henüz eğitmen tarafından quiz sorusu eklenmemiş.
            </p>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-lg"
            >
              Kapat
            </button>
          </div>
        ) : (
          <>
            {/* Previous Score Notice if already solved */}
            {!isSubmitted && previousScore && (
              <div className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  Daha önce çözüldü · Puanınız:{' '}
                  <strong className="text-amber-400 font-mono">
                    {previousScore.score} / {previousScore.maxScore}
                  </strong>
                </span>
                <span
                  className={
                    previousScore.passed ? 'text-emerald-400 font-medium' : 'text-rose-400 font-medium'
                  }
                >
                  {previousScore.passed ? 'Geçti (Tamamlandı)' : 'Başarısız (Tekrar Deneyin)'}
                </span>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6">
              {questions.map((q, qIndex) => {
                const selected = selectedAnswers[q.id];
                const isCorrect = selected === q.correctOptionIndex;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <span className="shrink-0 w-6 h-6 rounded-md bg-slate-800 text-slate-300 text-xs font-mono font-bold flex items-center justify-center">
                          {qIndex + 1}
                        </span>
                        <h4 className="text-sm font-medium text-slate-100 leading-snug">
                          {q.questionText}
                        </h4>
                      </div>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        {q.points} Puan
                      </span>
                    </div>

                    {/* Choices */}
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt, optIndex) => {
                        const isThisSelected = selected === optIndex;
                        let optionStyle =
                          'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700';

                        if (isSubmitted) {
                          if (optIndex === q.correctOptionIndex) {
                            optionStyle =
                              'border-emerald-500/50 bg-emerald-500/10 text-emerald-200';
                          } else if (isThisSelected && !isCorrect) {
                            optionStyle = 'border-rose-500/50 bg-rose-500/10 text-rose-300';
                          } else {
                            optionStyle = 'border-slate-800/40 opacity-50 bg-slate-900/20';
                          }
                        } else if (isThisSelected) {
                          optionStyle =
                            'border-amber-500 bg-amber-500/10 text-amber-200 font-medium shadow-sm';
                        }

                        const optionLetters = ['A', 'B', 'C', 'D', 'E'];

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            disabled={isSubmitted}
                            onClick={() => handleOptionSelect(q.id, optIndex)}
                            className={`w-full text-left p-3 rounded-lg border text-xs sm:text-sm flex items-center gap-3 transition-colors ${optionStyle}`}
                          >
                            <span
                              className={`w-5 h-5 rounded flex items-center justify-center text-xs font-mono shrink-0 ${
                                isThisSelected
                                  ? 'bg-amber-500 text-slate-950 font-bold'
                                  : 'bg-slate-800 text-slate-400'
                              }`}
                            >
                              {optionLetters[optIndex] || optIndex + 1}
                            </span>
                            <span className="flex-1 leading-relaxed">{opt}</span>

                            {isSubmitted && optIndex === q.correctOptionIndex && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                            )}
                            {isSubmitted && isThisSelected && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Explanation if submitted */}
                    {isSubmitted && q.explanation && (
                      <div className="mt-3 p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 leading-relaxed">
                        <strong className="text-amber-400 block mb-1">Çözüm Açıklaması:</strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Results Banner if submitted */}
            {isSubmitted && result && (
              <div
                className={`p-5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  result.passed
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`p-2.5 rounded-lg ${
                      result.passed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                    }`}
                  >
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-sm">
                      {result.passed
                        ? 'Tebrikler, Quiz Başarıyla Tamamlandı!'
                        : 'Baraj Puanına Ulaşılamadı'}
                    </h4>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Toplam Puan:{' '}
                      <strong className="font-mono text-white text-sm">
                        {result.score} / {result.maxScore}
                      </strong>{' '}
                      ({Math.round((result.score / result.maxScore) * 100)}%)
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRetake}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium transition-colors"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Tekrar Çöz
                  </button>
                  <button
                    onClick={onClose}
                    className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Tamamla & Çık
                  </button>
                </div>
              </div>
            )}

            {/* Submit Action if not submitted */}
            {!isSubmitted && (
              <div className="flex items-center justify-between pt-2 border-t border-slate-800">
                <span className="text-xs text-slate-400">
                  Cevaplanan:{' '}
                  <strong className="text-slate-200 font-mono">
                    {Object.keys(selectedAnswers).length} / {questions.length}
                  </strong>
                </span>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-lg text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Sınavı Bitir ve Sonucu Gör
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  );
};
