import React, { useState } from 'react';
import {
  Compass,
  BookOpen,
  CheckCircle2,
  Clock,
  Play,
  ExternalLink,
  Award,
  Star,
  MessageSquare,
  ThumbsUp,
  Send,
  ChevronRight,
  Sparkles,
  School,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Content, Patika } from '../../types';
import { VideoPlayerModal } from '../common/VideoPlayerModal';
import { QuizRunnerModal } from '../common/QuizRunnerModal';

export const StudentDashboard: React.FC = () => {
  const {
    currentUser,
    patikalar,
    courses,
    users,
    enrollInCourse,
    isStudentEnrolled,
    getStudentEnrollment,
    getCourseContents,
    getContentQuizzes,
    getContentComments,
    getContentAverageRating,
    markContentCompleted,
    addComment,
    likeComment,
    getCourseProgress,
  } = useApp();

  // Tab: 'patikalar' | 'enrolled' | 'classroom'
  const [activeTab, setActiveTab] = useState<'patikalar' | 'enrolled' | 'classroom'>('patikalar');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('course_java_102');
  const [selectedContentId, setSelectedContentId] = useState<string>('');

  // Modals
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);

  // New Comment Form
  const [newRating, setNewRating] = useState<number>(5);
  const [newCommentText, setNewCommentText] = useState<string>('');
  const [commentSuccess, setCommentSuccess] = useState(false);

  // Selected Course & Contents
  const selectedCourse = courses.find((c) => c.id === selectedCourseId) || courses[0];
  const courseContents = selectedCourse ? getCourseContents(selectedCourse.id) : [];

  // Active content being viewed
  const activeContent: Content | undefined =
    courseContents.find((c) => c.id === selectedContentId) || courseContents[0];

  const currentInstructor = users.find((u) => u.id === selectedCourse?.instructorId);
  const isEnrolled = selectedCourse ? isStudentEnrolled(selectedCourse.id) : false;
  const enrollment = selectedCourse ? getStudentEnrollment(selectedCourse.id) : undefined;

  // Active content quizzes & comments
  const activeQuizzes = activeContent ? getContentQuizzes(activeContent.id) : [];
  const activeComments = activeContent ? getContentComments(activeContent.id) : [];
  const activeRating = activeContent ? getContentAverageRating(activeContent.id) : { average: 5, count: 0 };
  const quizResult = enrollment && activeContent ? enrollment.quizScores[activeContent.id] : undefined;
  const isContentDone = enrollment && activeContent
    ? enrollment.completedContentIds.includes(activeContent.id)
    : false;

  const handleEnroll = (courseId: string) => {
    enrollInCourse(courseId);
    setSelectedCourseId(courseId);
    const contents = getCourseContents(courseId);
    if (contents.length > 0) setSelectedContentId(contents[0].id);
    setActiveTab('classroom');
  };

  const handleGoToCourse = (courseId: string) => {
    setSelectedCourseId(courseId);
    const contents = getCourseContents(courseId);
    if (contents.length > 0) setSelectedContentId(contents[0].id);
    setActiveTab('classroom');
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeContent || !newCommentText.trim()) return;
    addComment(activeContent.id, newCommentText, newRating);
    setNewCommentText('');
    setCommentSuccess(true);
    setTimeout(() => setCommentSuccess(false), 2500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            Öğrenci Öğrenim Alanı
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Merhaba, {currentUser?.name || 'Öğrenci'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Patikalar üzerinden dilediğin eğitime kaydol, video dersleri izle, quiz sorularını çözerek öğrendiklerini pekiştir ve yorum yaparak toplulukla etkileşime geç.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-950 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('patikalar')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'patikalar'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Patikalar
          </button>
          <button
            onClick={() => setActiveTab('enrolled')}
            className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
              activeTab === 'enrolled'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Kayıtlı Derslerim
          </button>
          {selectedCourse && (
            <button
              onClick={() => setActiveTab('classroom')}
              className={`px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeTab === 'classroom'
                  ? 'bg-amber-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <School className="w-3.5 h-3.5" />
              Ders Sınıfı
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: PATİKALAR LİSTESİ */}
      {activeTab === 'patikalar' && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Kariyer Patikaları</h3>
            <p className="text-xs text-slate-400 mt-1">
              Sektör beklentilerine göre tasarlanmış kariyer yollarını inceleyin ve derslere kaydolun.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {patikalar.map((patika) => {
              const patikaCourses = courses.filter((c) => patika.courseIds.includes(c.id));

              return (
                <div
                  key={patika.id}
                  className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-md group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        {patika.level} Seviye
                      </span>
                      <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {patika.duration}
                      </span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {patika.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed">
                      {patika.description}
                    </p>

                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <span className="text-xs font-medium text-slate-300 block">
                        Patika İçerisindeki Eğitimler ({patikaCourses.length}):
                      </span>
                      <div className="space-y-1.5">
                        {patikaCourses.map((crs) => {
                          const enrolled = isStudentEnrolled(crs.id);
                          const progress = enrolled ? getCourseProgress(crs.id) : 0;

                          return (
                            <div
                              key={crs.id}
                              className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 flex items-center justify-between text-xs"
                            >
                              <div className="truncate pr-2">
                                <span className="font-medium text-slate-200 block truncate">
                                  {crs.title}
                                </span>
                                <span className="text-[11px] text-slate-400 font-mono">
                                  {crs.duration}
                                </span>
                              </div>

                              {enrolled ? (
                                <button
                                  onClick={() => handleGoToCourse(crs.id)}
                                  className="px-2.5 py-1 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/30 rounded text-[11px] font-semibold shrink-0"
                                >
                                  %{progress} Devam Et
                                </button>
                              ) : (
                                <button
                                  onClick={() => handleEnroll(crs.id)}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[11px] font-semibold shrink-0"
                                >
                                  Kayıt Ol
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: ENROLLED COURSES */}
      {activeTab === 'enrolled' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">Kayıtlı Olduğum Eğitimler</h3>
            <p className="text-xs text-slate-400 mt-1">
              Kayıt olduğunuz dersleri inceleyin, içerikleri izleyin ve quizleri tamamlayarak ilerleme sağlayın.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses
              .filter((c) => isStudentEnrolled(c.id))
              .map((c) => {
                const progress = getCourseProgress(c.id);
                const instructor = users.find((u) => u.id === c.instructorId);
                const cContents = getCourseContents(c.id);

                return (
                  <div
                    key={c.id}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-4 shadow-lg"
                  >
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-amber-400 font-medium">Aktif Eğitim</span>
                        <span className="text-xs font-mono text-slate-400">{c.duration}</span>
                      </div>

                      <h4 className="text-base font-bold text-white">{c.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {c.description}
                      </p>

                      {/* Instructor info */}
                      {instructor && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-800 text-xs">
                          <img
                            src={instructor.avatar}
                            alt={instructor.name}
                            className="w-5 h-5 rounded-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <span className="text-slate-300 font-medium">{instructor.name}</span>
                          <span className="text-slate-400 text-[10px]">({instructor.title})</span>
                        </div>
                      )}

                      {/* Progress Bar */}
                      <div className="space-y-1.5 pt-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-400">İlerleme Durumu</span>
                          <span className="font-mono text-emerald-400 font-bold">%{progress}</span>
                        </div>
                        <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
                          <div
                            className="h-full bg-gradient-to-r from-emerald-500 to-amber-500 rounded-full transition-all duration-300"
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {cContents.length} Ders İçeriği
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleGoToCourse(c.id)}
                      className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Eğitime Git & İzle
                    </button>
                  </div>
                );
              })}

            {courses.filter((c) => isStudentEnrolled(c.id)).length === 0 && (
              <div className="col-span-full p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
                <BookOpen className="w-12 h-12 text-slate-600 mx-auto" />
                <h4 className="text-base font-semibold text-white">Henüz Bir Derse Kayıtlı Değilsiniz</h4>
                <p className="text-xs text-slate-400 max-w-md mx-auto">
                  Patika listesinden dilediğiniz kariyer yolunu ve dersi seçip "Kayıt Ol" butonu ile hemen öğrenmeye başlayabilirsiniz.
                </p>
                <button
                  onClick={() => setActiveTab('patikalar')}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors"
                >
                  Patikaları Keşfet
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: CLASSROOM VIEW (WATCH CONTENT, QUIZ, RATINGS & COMMENTS) */}
      {activeTab === 'classroom' && selectedCourse && (
        <div className="space-y-6">
          {/* Header of the Course */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-amber-400 mb-1">
                <span>Ders Sınıfı</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-400">{selectedCourse.duration}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{selectedCourse.title}</h2>
              {currentInstructor && (
                <p className="text-xs text-slate-400 mt-1">
                  Eğitmen: <strong className="text-slate-200">{currentInstructor.name}</strong> ({currentInstructor.title})
                </p>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isEnrolled ? (
                <button
                  onClick={() => handleEnroll(selectedCourse.id)}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-xl shadow-md transition-colors"
                >
                  Derse Kayıt Ol
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium">
                  <Check className="w-4 h-4" />
                  Derse Kayıtlısınız (%{getCourseProgress(selectedCourse.id)} Tamamlandı)
                </div>
              )}
            </div>
          </div>

          {!isEnrolled ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
              <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
              <h3 className="text-lg font-bold text-white">Ders İçeriklerine Erişmek İçin Kaydolun</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                Kayıt olduktan sonra video dersleri görüntüleyebilir, quizleri çözebilir ve yorum yazabilirsiniz.
              </p>
              <button
                onClick={() => handleEnroll(selectedCourse.id)}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg"
              >
                Hemen Ücretsiz Kayıt Ol
              </button>
            </div>
          ) : (
            /* Classroom Split Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Syllabus / Contents list (4 cols) */}
              <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-4 space-y-3">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 px-2">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                    Ders İçerikleri ({courseContents.length})
                  </h4>
                  <span className="text-xs font-mono text-emerald-400 font-semibold">
                    %{getCourseProgress(selectedCourse.id)}
                  </span>
                </div>

                <div className="space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
                  {courseContents.map((cnt, idx) => {
                    const isCurrent = activeContent?.id === cnt.id;
                    const isCompleted = enrollment?.completedContentIds.includes(cnt.id);
                    const qCount = getContentQuizzes(cnt.id).length;

                    return (
                      <button
                        key={cnt.id}
                        onClick={() => setSelectedContentId(cnt.id)}
                        className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-start gap-3 ${
                          isCurrent
                            ? 'bg-amber-500/10 border-amber-500 text-white font-medium shadow-sm'
                            : 'bg-slate-950 border-slate-800/80 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 text-[10px] font-mono mt-0.5 ${
                            isCompleted
                              ? 'bg-emerald-500 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-400'
                          }`}
                        >
                          {isCompleted ? '✓' : idx + 1}
                        </span>

                        <div className="flex-1 truncate">
                          <p className="truncate text-slate-200">{cnt.title}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {cnt.durationMinutes} dk
                            </span>
                            {qCount > 0 && (
                              <>
                                <span aria-hidden="true">·</span>
                                <span className="text-sky-400">{qCount} Quiz</span>
                              </>
                            )}
                          </div>
                        </div>

                        {isCurrent && <ChevronRight className="w-4 h-4 text-amber-400 shrink-0 self-center" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right Column: Active Content Details, Video, Quiz, Ratings & Comments (8 cols) */}
              {activeContent ? (
                <div className="lg:col-span-8 space-y-6">
                  {/* Content Header & Actions */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-amber-400 font-semibold">{selectedCourse.title}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-slate-300">Sıra: {activeContent.order}</span>
                          <span aria-hidden="true">·</span>
                          <span>{activeContent.durationMinutes} Dakika</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-1">{activeContent.title}</h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() =>
                            markContentCompleted(selectedCourse.id, activeContent.id)
                          }
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                            isContentDone
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                          }`}
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          {isContentDone ? 'Tamamlandı' : 'Tamamlandı İşaretle'}
                        </button>
                      </div>
                    </div>

                    {/* YouTube Video Link Banner & Viewer as per spec */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-red-400">
                          <Play className="w-4 h-4 fill-current" />
                          YouTube Video Dersi
                        </div>
                        <p className="text-xs text-slate-400 truncate max-w-md font-mono">
                          {activeContent.youtubeUrl}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => setIsVideoModalOpen(true)}
                          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Play className="w-3.5 h-3.5" />
                          Önizle
                        </button>

                        <a
                          href={activeContent.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 shadow-sm whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          YouTube'da Aç (Doğrudan Link)
                        </a>
                      </div>
                    </div>

                    {/* Content Description */}
                    <div className="space-y-2">
                      <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
                        İçerik Açıklaması & Konu Notları
                      </h4>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
                        {activeContent.description}
                      </p>
                    </div>

                    {/* Quiz Section Trigger */}
                    <div className="p-4 rounded-xl bg-gradient-to-r from-sky-950/30 to-indigo-950/30 border border-sky-800/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs font-semibold text-sky-400">
                          <Award className="w-4 h-4" />
                          İçerik Quiz Değerlendirmesi
                        </div>
                        <p className="text-xs text-slate-300">
                          {activeQuizzes.length > 0
                            ? `Bu içeriğe ait ${activeQuizzes.length} soru bulunmaktadır. Çözerek puanınızı artırın.`
                            : 'Bu içerik için henüz soru eklenmemiş.'}
                        </p>
                        {quizResult && (
                          <div className="text-xs text-amber-300 font-mono mt-1">
                            Önceki Sonuç: {quizResult.score} / {quizResult.maxScore} Puan (
                            {quizResult.passed ? 'Geçti' : 'Kaldı'})
                          </div>
                        )}
                      </div>

                      {activeQuizzes.length > 0 && (
                        <button
                          onClick={() => setIsQuizModalOpen(true)}
                          className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 shadow-sm"
                        >
                          <Award className="w-4 h-4" />
                          {quizResult ? 'Quiz\'i Tekrar Çöz' : 'Quiz\'i Çöz'}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Rating & Review / Comment Section */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                      <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                          <MessageSquare className="w-4 h-4 text-amber-400" />
                          Öğrenci Yorumları ve Değerlendirmeleri
                        </h4>
                        <p className="text-xs text-slate-400 mt-0.5">
                          Ders içeriği hakkındaki görüşlerinizi paylaşın, sorularınızı sorun.
                        </p>
                      </div>

                      {/* Average Rating Score */}
                      <div className="flex items-center gap-2 bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 shrink-0">
                        <div className="flex items-center text-amber-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-3.5 h-3.5 ${
                                star <= Math.round(activeRating.average)
                                  ? 'fill-current'
                                  : 'text-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-white font-mono">
                          {activeRating.average}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          ({activeRating.count} değerlendirme)
                        </span>
                      </div>
                    </div>

                    {/* Write a comment form */}
                    <form onSubmit={handleCommentSubmit} className="space-y-3 bg-slate-950 p-4 rounded-xl border border-slate-800">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-300">
                          Puanınız:
                        </span>
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setNewRating(star)}
                              className="p-1 text-slate-600 hover:text-amber-400 transition-colors"
                            >
                              <Star
                                className={`w-4 h-4 ${
                                  star <= newRating ? 'text-amber-400 fill-current' : ''
                                }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>

                      <textarea
                        rows={3}
                        required
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Bu içerik hakkında ne düşünüyorsunuz? (Örn: Mustafa Hoca konuyu çok akıcı anlatmış...)"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                      />

                      <div className="flex items-center justify-between">
                        {commentSuccess && (
                          <span className="text-xs text-emerald-400 font-medium">
                            ✓ Yorumunuz başarıyla yayınlandı!
                          </span>
                        )}
                        <button
                          type="submit"
                          className="ml-auto px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          Yorum Yap
                        </button>
                      </div>
                    </form>

                    {/* Comments List */}
                    <div className="space-y-3">
                      {activeComments.length === 0 ? (
                        <p className="text-xs text-slate-500 text-center py-6">
                          Bu içerik için henüz yorum yapılmamış. İlk yorumu siz yazın!
                        </p>
                      ) : (
                        activeComments.map((cm) => (
                          <div
                            key={cm.id}
                            className="p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 space-y-2.5"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2.5">
                                <img
                                  src={cm.userAvatar}
                                  alt={cm.userName}
                                  className="w-6 h-6 rounded-full object-cover shrink-0"
                                  referrerPolicy="no-referrer"
                                />
                                <span className="text-xs font-semibold text-slate-200">
                                  {cm.userName}
                                </span>
                                <span className="text-[10px] text-slate-500 font-mono">
                                  {new Date(cm.createdAt).toLocaleDateString('tr-TR')}
                                </span>
                              </div>

                              <div className="flex items-center text-amber-400">
                                {[1, 2, 3, 4, 5].map((s) => (
                                  <Star
                                    key={s}
                                    className={`w-3 h-3 ${
                                      s <= cm.rating ? 'fill-current' : 'text-slate-800'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>

                            <p className="text-xs text-slate-300 leading-relaxed pl-8">
                              {cm.comment}
                            </p>

                            <div className="flex items-center justify-end pl-8">
                              <button
                                onClick={() => likeComment(cm.id)}
                                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-400 transition-colors"
                              >
                                <ThumbsUp className="w-3 h-3" />
                                <span>{cm.likes}</span>
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="lg:col-span-8 p-12 text-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
                  Bu derse henüz içerik eklenmemiş.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Video Modal */}
      <VideoPlayerModal
        isOpen={isVideoModalOpen}
        onClose={() => setIsVideoModalOpen(false)}
        content={activeContent || null}
        courseTitle={selectedCourse?.title}
      />

      {/* Quiz Runner Modal */}
      <QuizRunnerModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        content={activeContent || null}
        courseId={selectedCourse?.id || ''}
      />
    </div>
  );
};
