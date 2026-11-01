import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  BookOpen,
  Film,
  HelpCircle,
  Edit2,
  Trash2,
  ExternalLink,
  MessageSquare,
  Clock,
  CheckCircle,
  AlertCircle,
  Layers,
  ChevronRight,
  Eye,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Course, Content, QuizQuestion } from '../../types';
import { Modal } from '../common/Modal';
import { VideoPlayerModal } from '../common/VideoPlayerModal';

export const InstructorDashboard: React.FC = () => {
  const {
    currentUser,
    courses,
    contents,
    quizQuestions,
    comments,
    addContent,
    updateContent,
    deleteContent,
    addQuizQuestion,
    updateQuizQuestion,
    deleteQuizQuestion,
    patikalar,
  } = useApp();

  // Instructors can only see courses assigned to them by operators
  const assignedCourses = courses.filter((c) =>
    currentUser?.role === 'operator' ? true : c.instructorId === currentUser?.id
  );

  // Filters
  const [selectedCourseFilter, setSelectedCourseFilter] = useState<string>('all');
  const [searchTitle, setSearchTitle] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'contents' | 'quizzes' | 'courses'>('contents');

  // Modals
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);

  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [targetContentForQuiz, setTargetContentForQuiz] = useState<string>('');

  const [previewVideoContent, setPreviewVideoContent] = useState<Content | null>(null);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Content Form State
  const [contentForm, setContentForm] = useState({
    courseId: '',
    title: '',
    description: '',
    youtubeUrl: '',
    durationMinutes: 30,
    order: 1,
  });

  // Quiz Form State
  const [quizForm, setQuizForm] = useState({
    contentId: '',
    questionText: '',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correctIndex: 0,
    explanation: '',
    points: 25,
  });

  // Filter contents: only contents belonging to assigned courses (and created by instructor if not operator)
  const instructorContents = contents.filter((cnt) => {
    const isAssignedCourse = assignedCourses.some((c) => c.id === cnt.courseId);
    if (!isAssignedCourse) return false;
    if (currentUser?.role === 'instructor') {
      return cnt.instructorId === currentUser.id;
    }
    return true;
  });

  const filteredContents = instructorContents.filter((cnt) => {
    const matchesCourse =
      selectedCourseFilter === 'all' || cnt.courseId === selectedCourseFilter;
    const matchesSearch = cnt.title.toLowerCase().includes(searchTitle.toLowerCase());
    return matchesCourse && matchesSearch;
  });

  // Open modal to add content
  const handleOpenAddContent = () => {
    setEditingContent(null);
    setContentForm({
      courseId: assignedCourses[0]?.id || '',
      title: '',
      description: '',
      youtubeUrl: 'https://www.youtube.com/watch?v=WPvGqXgk-74',
      durationMinutes: 35,
      order: instructorContents.length + 1,
    });
    setIsContentModalOpen(true);
  };

  // Open modal to edit content
  const handleOpenEditContent = (content: Content) => {
    setEditingContent(content);
    setContentForm({
      courseId: content.courseId,
      title: content.title,
      description: content.description,
      youtubeUrl: content.youtubeUrl,
      durationMinutes: content.durationMinutes,
      order: content.order,
    });
    setIsContentModalOpen(true);
  };

  // Save content (add or edit)
  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contentForm.courseId || !contentForm.title.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Lütfen ders seçimini ve içerik başlığını doldurunuz.' });
      return;
    }

    if (editingContent) {
      const res = updateContent(editingContent.id, {
        courseId: contentForm.courseId,
        title: contentForm.title.trim(),
        description: contentForm.description.trim(),
        youtubeUrl: contentForm.youtubeUrl.trim(),
        durationMinutes: Number(contentForm.durationMinutes) || 30,
        order: Number(contentForm.order) || 1,
      });
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'İçerik başarıyla güncellendi.' });
        setIsContentModalOpen(false);
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    } else {
      const res = addContent({
        courseId: contentForm.courseId,
        title: contentForm.title.trim(),
        description: contentForm.description.trim(),
        youtubeUrl: contentForm.youtubeUrl.trim(),
        durationMinutes: Number(contentForm.durationMinutes) || 30,
        order: Number(contentForm.order) || 1,
      });
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'Yeni içerik başarıyla derse eklendi.' });
        setIsContentModalOpen(false);
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    }
  };

  // Delete content
  const handleDeleteContent = (contentId: string, title: string) => {
    if (window.confirm(`"${title}" içeriğini ve bağlı tüm quiz sorularını silmek istediğinize emin misiniz?`)) {
      const res = deleteContent(contentId);
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'İçerik silindi.' });
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    }
  };

  // Open modal to add quiz question
  const handleOpenAddQuiz = (preselectedContentId?: string) => {
    setEditingQuiz(null);
    const contentId = preselectedContentId || instructorContents[0]?.id || '';
    setQuizForm({
      contentId,
      questionText: '',
      optionA: '',
      optionB: '',
      optionC: '',
      optionD: '',
      correctIndex: 0,
      explanation: '',
      points: 25,
    });
    setIsQuizModalOpen(true);
  };

  // Open modal to edit quiz question
  const handleOpenEditQuiz = (q: QuizQuestion) => {
    setEditingQuiz(q);
    setQuizForm({
      contentId: q.contentId,
      questionText: q.questionText,
      optionA: q.options[0] || '',
      optionB: q.options[1] || '',
      optionC: q.options[2] || '',
      optionD: q.options[3] || '',
      correctIndex: q.correctOptionIndex,
      explanation: q.explanation,
      points: q.points || 25,
    });
    setIsQuizModalOpen(true);
  };

  // Save quiz question
  const handleSaveQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quizForm.contentId) {
      setFeedbackMessage({ type: 'error', text: 'Lütfen sorunun ait olduğu içeriği seçiniz.' });
      return;
    }
    if (!quizForm.questionText.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Lütfen soru metnini yazınız.' });
      return;
    }
    const options = [quizForm.optionA, quizForm.optionB, quizForm.optionC, quizForm.optionD].filter(
      (opt) => opt.trim().length > 0
    );
    if (options.length < 2) {
      setFeedbackMessage({ type: 'error', text: 'En az 2 şık girilmelidir.' });
      return;
    }

    if (editingQuiz) {
      const res = updateQuizQuestion(editingQuiz.id, {
        contentId: quizForm.contentId,
        questionText: quizForm.questionText.trim(),
        options,
        correctOptionIndex: Math.min(quizForm.correctIndex, options.length - 1),
        explanation: quizForm.explanation.trim(),
        points: Number(quizForm.points) || 25,
      });
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'Quiz sorusu güncellendi.' });
        setIsQuizModalOpen(false);
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    } else {
      const res = addQuizQuestion({
        contentId: quizForm.contentId,
        questionText: quizForm.questionText.trim(),
        options,
        correctOptionIndex: Math.min(quizForm.correctIndex, options.length - 1),
        explanation: quizForm.explanation.trim(),
        points: Number(quizForm.points) || 25,
      });
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'Quiz sorusu içeriğe başarıyla eklendi.' });
        setIsQuizModalOpen(false);
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    }
  };

  const handleDeleteQuiz = (quizId: string) => {
    if (window.confirm('Bu quiz sorusunu silmek istediğinize emin misiniz?')) {
      const res = deleteQuizQuestion(quizId);
      if (res.success) {
        setFeedbackMessage({ type: 'success', text: 'Quiz sorusu silindi.' });
      } else {
        setFeedbackMessage({ type: 'error', text: res.message });
      }
    }
  };

  // Instructor's quizzes
  const instructorQuizzes = quizQuestions.filter((q) =>
    instructorContents.some((cnt) => cnt.id === q.contentId)
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner / Welcome */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            Eğitmen Çalışma Masası
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Hoş Geldiniz, {currentUser?.name}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Operatör tarafından yalnızca size atanan eğitimleri görebilir, bu eğitimlere video ders içerikleri ve quiz soruları ekleyip yönetebilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddContent}
            disabled={assignedCourses.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni İçerik Ekle
          </button>
          <button
            onClick={() => handleOpenAddQuiz()}
            disabled={instructorContents.length === 0}
            className="flex items-center gap-2 px-4 py-2.5 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <HelpCircle className="w-4 h-4" />
            Quiz Sorusu Ekle
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            onClick={() => setFeedbackMessage(null)}
            className="text-slate-400 hover:text-white"
          >
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('contents')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'contents'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          İçerikler ({instructorContents.length})
        </button>
        <button
          onClick={() => setActiveTab('quizzes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'quizzes'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <HelpCircle className="w-3.5 h-3.5" />
          Quiz Soruları ({instructorQuizzes.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
            activeTab === 'courses'
              ? 'bg-slate-800 text-white'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Atanan Eğitimler ({assignedCourses.length})
        </button>
      </div>

      {/* TAB 1: CONTENTS VIEW WITH COURSE & TITLE FILTERS */}
      {activeTab === 'contents' && (
        <div className="space-y-6">
          {/* Filters Bar: Course Filter & Search Input */}
          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 flex-1">
              {/* Course Selector Filter */}
              <div className="relative w-full sm:w-64">
                <Filter className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <select
                  value={selectedCourseFilter}
                  onChange={(e) => setSelectedCourseFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                >
                  <option value="all">Tüm Atanan Dersler ({assignedCourses.length})</option>
                  {assignedCourses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title Search Filter */}
              <div className="relative w-full sm:flex-1">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3 pointer-events-none" />
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="İçerik başlığına göre ara..."
                  className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="text-xs text-slate-400 shrink-0 self-center">
              Gösterilen:{' '}
              <strong className="text-white font-mono">{filteredContents.length}</strong> /{' '}
              {instructorContents.length} İçerik
            </div>
          </div>

          {/* Contents List */}
          {filteredContents.length === 0 ? (
            <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800/80 space-y-3">
              <Film className="w-10 h-10 text-slate-600 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-200">Kriterlere Uygun İçerik Bulunamadı</h4>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                {assignedCourses.length === 0
                  ? 'Henüz operatör tarafından size atanmış bir eğitim bulunmamaktadır.'
                  : 'Filtreleri temizleyebilir veya "Yeni İçerik Ekle" butonuyla ilk ders içeriğinizi oluşturabilirsiniz.'}
              </p>
              {assignedCourses.length > 0 && (
                <button
                  onClick={handleOpenAddContent}
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg"
                >
                  Yeni İçerik Ekle
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredContents.map((content) => {
                const course = courses.find((c) => c.id === content.courseId);
                const quizzes = quizQuestions.filter((q) => q.contentId === content.id);
                const contentComments = comments.filter((cm) => cm.contentId === content.id);

                return (
                  <div
                    key={content.id}
                    className="p-5 rounded-xl bg-slate-900 border border-slate-800 hover:border-slate-700/80 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 group"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span className="text-amber-400 font-semibold">{course?.title}</span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {content.durationMinutes} Dakika
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1 font-mono text-slate-300">
                          Sıra: {content.order}
                        </span>
                      </div>

                      <h3 className="text-base font-semibold text-white group-hover:text-amber-300 transition-colors">
                        {content.title}
                      </h3>

                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                        {content.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-4 text-xs pt-1">
                        <button
                          onClick={() => setPreviewVideoContent(content)}
                          className="flex items-center gap-1.5 text-red-400 hover:text-red-300 font-medium"
                        >
                          <Film className="w-3.5 h-3.5" />
                          YouTube Dersi & Önizleme
                        </button>
                        <span aria-hidden="true" className="text-slate-700">·</span>
                        <button
                          onClick={() => handleOpenAddQuiz(content.id)}
                          className="flex items-center gap-1.5 text-sky-400 hover:text-sky-300 font-medium"
                        >
                          <HelpCircle className="w-3.5 h-3.5" />
                          {quizzes.length} Quiz Sorusu (+ Soru Ekle)
                        </button>
                        <span aria-hidden="true" className="text-slate-700">·</span>
                        <span className="flex items-center gap-1.5 text-slate-400">
                          <MessageSquare className="w-3.5 h-3.5" />
                          {contentComments.length} Öğrenci Yorumu
                        </span>
                      </div>
                    </div>

                    {/* Actions: Edit, Delete, Video Preview */}
                    <div className="flex items-center gap-2 shrink-0 border-t md:border-t-0 pt-3 md:pt-0 border-slate-800">
                      <button
                        onClick={() => setPreviewVideoContent(content)}
                        title="Dersi İncele"
                        className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenEditContent(content)}
                        title="İçeriği Düzenle"
                        className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteContent(content.id, content.title)}
                        title="İçeriği Sil"
                        className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: QUIZZES MANAGEMENT */}
      {activeTab === 'quizzes' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">İçeriklere Bağlı Quiz Soruları</h3>
              <p className="text-xs text-slate-400">
                Öğrencilerin dersi tamamlarken çözecekleri çoktan seçmeli soruları yönetin.
              </p>
            </div>
            <button
              onClick={() => handleOpenAddQuiz()}
              disabled={instructorContents.length === 0}
              className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              Soru Ekle
            </button>
          </div>

          {instructorQuizzes.length === 0 ? (
            <div className="p-10 text-center rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
              Henüz soru eklenmemiş. "Soru Ekle" butonu ile sorularınızı tanımlayabilirsiniz.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {instructorQuizzes.map((quiz, idx) => {
                const parentContent = contents.find((c) => c.id === quiz.contentId);
                const parentCourse = courses.find((c) => c.id === parentContent?.courseId);

                return (
                  <div
                    key={quiz.id}
                    className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-slate-400">
                          <span className="text-amber-400 font-semibold">{parentCourse?.title}</span>
                          <span aria-hidden="true">·</span>
                          <span className="text-slate-300">{parentContent?.title}</span>
                          <span aria-hidden="true">·</span>
                          <span className="font-mono text-sky-400">{quiz.points} Puan</span>
                        </div>
                        <h4 className="text-sm font-medium text-white leading-snug">
                          {idx + 1}. {quiz.questionText}
                        </h4>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          onClick={() => handleOpenEditQuiz(quiz)}
                          className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuiz(quiz.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Choices preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {quiz.options.map((opt, oIdx) => {
                        const isCorrect = oIdx === quiz.correctOptionIndex;
                        return (
                          <div
                            key={oIdx}
                            className={`p-2 rounded-lg border flex items-center gap-2 ${
                              isCorrect
                                ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300 font-medium'
                                : 'bg-slate-950 border-slate-800 text-slate-400'
                            }`}
                          >
                            <span className="w-4 h-4 rounded-full bg-slate-800 text-[10px] flex items-center justify-center font-mono">
                              {['A', 'B', 'C', 'D'][oIdx]}
                            </span>
                            <span className="truncate">{opt}</span>
                            {isCorrect && <CheckCircle className="w-3 h-3 text-emerald-400 ml-auto shrink-0" />}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: ASSIGNED COURSES (READ-ONLY FOR INSTRUCTORS AS PER SPEC) */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300">
            <AlertCircle className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
            <div>
              <strong>Kural Uyarınca:</strong> Eğitmenler operatörler tarafından kendilerine atanan eğitimleri görüp listeleyebilirler. Eğitimleri düzenleme veya silme yetkileri bulunmaz ve başka eğitmenlere ait eğitimleri göremezler.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {assignedCourses.map((c) => {
              const patika = patikalar.find((p) => p.id === c.patikaId);
              const courseContents = contents.filter((cnt) => cnt.courseId === c.id);

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-amber-400 font-medium">
                      {patika?.title || 'Patika Eğitimi'}
                    </span>
                    <span className="text-xs font-mono text-slate-400">{c.duration}</span>
                  </div>

                  <h3 className="text-base font-semibold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                    {c.description}
                  </p>

                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      Toplam İçerik:{' '}
                      <strong className="text-white font-mono">{courseContents.length}</strong>
                    </span>
                    <button
                      onClick={() => {
                        setSelectedCourseFilter(c.id);
                        setActiveTab('contents');
                      }}
                      className="text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
                    >
                      İçerikleri Listele
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* CONTENT ADD/EDIT MODAL */}
      <Modal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        title={editingContent ? 'İçeriği Düzenle' : 'Yeni Ders İçeriği Ekle'}
        subtitle="Ders videosu, açıklama ve sıra bilgilerini belirleyin"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveContent} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Ait Olduğu Eğitim (Ders) *
            </label>
            <select
              value={contentForm.courseId}
              onChange={(e) => setContentForm({ ...contentForm, courseId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {assignedCourses.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              İçerik Başlığı *
            </label>
            <input
              type="text"
              required
              value={contentForm.title}
              onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
              placeholder="Örn: 2. Kapsülleme (Encapsulation) ve Erişim Belirteçleri"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              YouTube Video Linki *
            </label>
            <input
              type="url"
              required
              value={contentForm.youtubeUrl}
              onChange={(e) => setContentForm({ ...contentForm, youtubeUrl: e.target.value })}
              placeholder="https://www.youtube.com/watch?v=..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Öğrenciler doğrudan bu video linkine tıklayarak veya arayüz üzerinden videoyu inceleyebilirler.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Tahmini Süre (Dakika)
              </label>
              <input
                type="number"
                min="1"
                max="600"
                value={contentForm.durationMinutes}
                onChange={(e) =>
                  setContentForm({ ...contentForm, durationMinutes: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Ders İçi Sırası (Order)
              </label>
              <input
                type="number"
                min="1"
                value={contentForm.order}
                onChange={(e) =>
                  setContentForm({ ...contentForm, order: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              İçerik Açıklaması & Notlar
            </label>
            <textarea
              rows={4}
              value={contentForm.description}
              onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
              placeholder="Bu derste hangi kavramlar, kod örnekleri ve pratik uygulamalar ele alınacak?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsContentModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg"
            >
              {editingContent ? 'Değişiklikleri Kaydet' : 'İçeriği Oluştur'}
            </button>
          </div>
        </form>
      </Modal>

      {/* QUIZ QUESTION ADD/EDIT MODAL */}
      <Modal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        title={editingQuiz ? 'Quiz Sorusunu Düzenle' : 'Yeni Quiz Sorusu Ekle'}
        subtitle="Sorunun hangi içeriğe ait olduğunu seçip şıkları ve doğru cevabı belirleyin"
        maxWidth="xl"
      >
        <form onSubmit={handleSaveQuiz} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Ait Olduğu İçerik *
            </label>
            <select
              value={quizForm.contentId}
              onChange={(e) => setQuizForm({ ...quizForm, contentId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {instructorContents.map((cnt) => {
                const c = courses.find((crs) => crs.id === cnt.courseId);
                return (
                  <option key={cnt.id} value={cnt.id}>
                    [{c?.title}] {cnt.title}
                  </option>
                );
              })}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Soru Metni *
            </label>
            <textarea
              required
              rows={3}
              value={quizForm.questionText}
              onChange={(e) => setQuizForm({ ...quizForm, questionText: e.target.value })}
              placeholder="Örn: Java'da alt sınıfın üst sınıf metodunu ezmesi hangi terimle ifade edilir?"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-medium text-slate-300">
              Seçenekler & Doğru Cevap Seçimi *
            </label>
            {[
              { key: 'optionA', label: 'A', value: quizForm.optionA },
              { key: 'optionB', label: 'B', value: quizForm.optionB },
              { key: 'optionC', label: 'C', value: quizForm.optionC },
              { key: 'optionD', label: 'D', value: quizForm.optionD },
            ].map((item, idx) => (
              <div key={item.key} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correctOption"
                  checked={quizForm.correctIndex === idx}
                  onChange={() => setQuizForm({ ...quizForm, correctIndex: idx })}
                  className="w-4 h-4 text-amber-500 focus:ring-0 bg-slate-950 border-slate-800 cursor-pointer"
                  title="Doğru cevap olarak işaretle"
                />
                <span className="w-5 text-xs font-mono font-bold text-slate-400">
                  {item.label}:
                </span>
                <input
                  type="text"
                  required
                  value={item.value}
                  onChange={(e) =>
                    setQuizForm({ ...quizForm, [item.key]: e.target.value } as any)
                  }
                  placeholder={`Seçenek ${item.label}`}
                  className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                />
              </div>
            ))}
            <p className="text-[11px] text-amber-400/80">
              * Radyo düğmesine tıklayarak doğru şıkkı seçin.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Soru Puanı
              </label>
              <input
                type="number"
                min="5"
                max="100"
                value={quizForm.points}
                onChange={(e) =>
                  setQuizForm({ ...quizForm, points: Number(e.target.value) })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Çözüm Açıklaması
              </label>
              <input
                type="text"
                value={quizForm.explanation}
                onChange={(e) => setQuizForm({ ...quizForm, explanation: e.target.value })}
                placeholder="Öğrenci sınavı bitirdiğinde göreceği açıklama"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsQuizModalOpen(false)}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
            >
              {editingQuiz ? 'Soruyu Güncelle' : 'Soruyu Kaydet'}
            </button>
          </div>
        </form>
      </Modal>

      {/* Video Preview Modal */}
      <VideoPlayerModal
        isOpen={!!previewVideoContent}
        onClose={() => setPreviewVideoContent(null)}
        content={previewVideoContent}
        courseTitle={
          courses.find((c) => c.id === previewVideoContent?.courseId)?.title
        }
      />
    </div>
  );
};
