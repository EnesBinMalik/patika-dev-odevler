import React, { useState } from 'react';
import {
  Shield,
  Layers,
  BookOpen,
  Film,
  UserPlus,
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle,
  AlertCircle,
  HelpCircle,
  RotateCcw,
  Sparkles,
  School,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { Patika, Course, Content, QuizQuestion } from '../../types';
import { Modal } from '../common/Modal';

export const OperatorDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    patikalar,
    courses,
    contents,
    quizQuestions,
    enrollments,
    addInstructor,
    addPatika,
    updatePatika,
    deletePatika,
    addCourse,
    updateCourse,
    deleteCourse,
    updateContent,
    deleteContent,
    deleteQuizQuestion,
    resetAllData,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'patikalar' | 'courses' | 'instructors' | 'contents' | 'system'>('patikalar');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Patika Modal State
  const [isPatikaModalOpen, setIsPatikaModalOpen] = useState(false);
  const [editingPatika, setEditingPatika] = useState<Patika | null>(null);
  const [patikaForm, setPatikaForm] = useState({
    title: '',
    description: '',
    level: 'Başlangıç' as 'Başlangıç' | 'Orta' | 'İleri',
    duration: '60 Saat',
    color: '#FF6B00',
  });

  // Course Modal State
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState({
    patikaId: '',
    title: '',
    description: '',
    instructorId: '',
    duration: '30 Saat',
    order: 1,
  });

  // Instructor Add Modal State (Strictly Operator Privilege)
  const [isInstructorModalOpen, setIsInstructorModalOpen] = useState(false);
  const [instructorForm, setInstructorForm] = useState({
    name: '',
    email: '',
    title: '',
    bio: '',
  });

  // Content Edit Modal State (Operator can edit/delete any content)
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<Content | null>(null);
  const [contentForm, setContentForm] = useState({
    title: '',
    description: '',
    youtubeUrl: '',
    durationMinutes: 30,
    order: 1,
  });

  const instructors = users.filter((u) => u.role === 'instructor');
  const students = users.filter((u) => u.role === 'student');

  // Patika Handlers
  const handleOpenAddPatika = () => {
    setEditingPatika(null);
    setPatikaForm({
      title: '',
      description: '',
      level: 'Başlangıç',
      duration: '60 Saat',
      color: '#FF6B00',
    });
    setIsPatikaModalOpen(true);
  };

  const handleOpenEditPatika = (p: Patika) => {
    setEditingPatika(p);
    setPatikaForm({
      title: p.title,
      description: p.description,
      level: p.level,
      duration: p.duration,
      color: p.color,
    });
    setIsPatikaModalOpen(true);
  };

  const handleSavePatika = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patikaForm.title.trim()) return;

    if (editingPatika) {
      updatePatika(editingPatika.id, {
        title: patikaForm.title.trim(),
        description: patikaForm.description.trim(),
        level: patikaForm.level,
        duration: patikaForm.duration.trim(),
        color: patikaForm.color,
      });
      setFeedback({ type: 'success', text: 'Patika güncellendi.' });
    } else {
      addPatika({
        title: patikaForm.title.trim(),
        description: patikaForm.description.trim(),
        level: patikaForm.level,
        duration: patikaForm.duration.trim(),
        color: patikaForm.color,
        icon: 'Compass',
        courseIds: [],
      });
      setFeedback({ type: 'success', text: 'Yeni patika oluşturuldu.' });
    }
    setIsPatikaModalOpen(false);
  };

  const handleDeletePatika = (id: string, title: string) => {
    if (window.confirm(`"${title}" patikasını silmek istediğinize emin misiniz?`)) {
      deletePatika(id);
      setFeedback({ type: 'success', text: 'Patika silindi.' });
    }
  };

  // Course Handlers
  const handleOpenAddCourse = () => {
    setEditingCourse(null);
    setCourseForm({
      patikaId: patikalar[0]?.id || '',
      title: '',
      description: '',
      instructorId: instructors[0]?.id || '',
      duration: '30 Saat',
      order: courses.length + 1,
    });
    setIsCourseModalOpen(true);
  };

  const handleOpenEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseForm({
      patikaId: c.patikaId,
      title: c.title,
      description: c.description,
      instructorId: c.instructorId,
      duration: c.duration,
      order: c.order,
    });
    setIsCourseModalOpen(true);
  };

  const handleSaveCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!courseForm.title.trim() || !courseForm.patikaId || !courseForm.instructorId) {
      setFeedback({ type: 'error', text: 'Lütfen patika, ders başlığı ve atanacak eğitmeni seçiniz.' });
      return;
    }

    if (editingCourse) {
      updateCourse(editingCourse.id, {
        patikaId: courseForm.patikaId,
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        instructorId: courseForm.instructorId,
        duration: courseForm.duration.trim(),
        order: Number(courseForm.order) || 1,
      });
      setFeedback({ type: 'success', text: 'Eğitim (Ders) başarıyla güncellendi.' });
    } else {
      addCourse({
        patikaId: courseForm.patikaId,
        title: courseForm.title.trim(),
        description: courseForm.description.trim(),
        instructorId: courseForm.instructorId,
        duration: courseForm.duration.trim(),
        order: Number(courseForm.order) || 1,
      });
      setFeedback({ type: 'success', text: 'Yeni eğitim oluşturuldu ve eğitmene atandı.' });
    }
    setIsCourseModalOpen(false);
  };

  const handleDeleteCourse = (id: string, title: string) => {
    if (window.confirm(`"${title}" eğitimini silmek istediğinize emin misiniz? Altındaki tüm içerikler silinecektir.`)) {
      deleteCourse(id);
      setFeedback({ type: 'success', text: 'Eğitim ve içerikleri silindi.' });
    }
  };

  // Instructor Addition Handler (ONLY OPERATORS CAN ADD INSTRUCTORS)
  const handleSaveInstructor = (e: React.FormEvent) => {
    e.preventDefault();
    const res = addInstructor({
      name: instructorForm.name,
      email: instructorForm.email,
      title: instructorForm.title,
      bio: instructorForm.bio,
    });
    if (res.success) {
      setFeedback({ type: 'success', text: res.message });
      setInstructorForm({ name: '', email: '', title: '', bio: '' });
      setIsInstructorModalOpen(false);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  // Content edit handler for operator
  const handleOpenEditContent = (cnt: Content) => {
    setEditingContent(cnt);
    setContentForm({
      title: cnt.title,
      description: cnt.description,
      youtubeUrl: cnt.youtubeUrl,
      durationMinutes: cnt.durationMinutes,
      order: cnt.order,
    });
    setIsContentModalOpen(true);
  };

  const handleSaveContent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent || !contentForm.title.trim()) return;
    const res = updateContent(editingContent.id, {
      title: contentForm.title.trim(),
      description: contentForm.description.trim(),
      youtubeUrl: contentForm.youtubeUrl.trim(),
      durationMinutes: Number(contentForm.durationMinutes) || 30,
      order: Number(contentForm.order) || 1,
    });
    if (res.success) {
      setFeedback({ type: 'success', text: 'İçerik başarıyla güncellendi.' });
      setIsContentModalOpen(false);
    } else {
      setFeedback({ type: 'error', text: res.message });
    }
  };

  const handleDeleteContent = (id: string, title: string) => {
    if (window.confirm(`"${title}" içeriğini ve sorularını silmek istediğinize emin misiniz?`)) {
      const res = deleteContent(id);
      if (res.success) setFeedback({ type: 'success', text: 'İçerik silindi.' });
    }
  };

  const handleDeleteQuiz = (id: string) => {
    if (window.confirm('Bu quiz sorusunu silmek istediğinize emin misiniz?')) {
      const res = deleteQuizQuestion(id);
      if (res.success) setFeedback({ type: 'success', text: 'Quiz sorusu silindi.' });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs text-amber-400 font-medium">
            <Shield className="w-3.5 h-3.5" />
            <span>Sistem Operatörü Yönetim Paneli</span>
            <span aria-hidden="true">·</span>
            <span className="font-mono text-slate-400">Enes Öztürk İmzalı</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Merkezi Operatör Konsolu
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Sistemdeki tüm patikaları, eğitimleri, içerikleri ve quizleri düzenleme ve silme yetkiniz bulunmaktadır. Eğitmen hesaplarını yalnızca siz tanımlayabilir ve derslere atayabilirsiniz.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleOpenAddPatika}
            className="flex items-center gap-2 px-3.5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Patika
          </button>
          <button
            onClick={handleOpenAddCourse}
            className="flex items-center gap-2 px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Yeni Eğitim (Ders)
          </button>
          <button
            onClick={() => setIsInstructorModalOpen(true)}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-lg transition-colors whitespace-nowrap shadow-sm"
          >
            <UserPlus className="w-4 h-4" />
            Eğitmen Ekle
          </button>
        </div>
      </div>

      {/* Feedback Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-xl border flex items-center justify-between text-xs ${
            feedback.type === 'success'
              ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-200'
              : 'bg-rose-950/40 border-rose-800/60 text-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{feedback.text}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-slate-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('patikalar')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'patikalar' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          Patikalar ({patikalar.length})
        </button>
        <button
          onClick={() => setActiveTab('courses')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'courses' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <BookOpen className="w-3.5 h-3.5" />
          Eğitimler ({courses.length})
        </button>
        <button
          onClick={() => setActiveTab('instructors')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'instructors' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <School className="w-3.5 h-3.5" />
          Eğitmenler ({instructors.length})
        </button>
        <button
          onClick={() => setActiveTab('contents')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'contents' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Film className="w-3.5 h-3.5" />
          Tüm İçerikler & Quizler ({contents.length})
        </button>
        <button
          onClick={() => setActiveTab('system')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0 ${
            activeTab === 'system' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          Sistem Durumu & İmzalı Mimar
        </button>
      </div>

      {/* TAB 1: PATİKALAR */}
      {activeTab === 'patikalar' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sistemdeki Tüm Patikalar</h3>
            <button
              onClick={handleOpenAddPatika}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-semibold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Patika
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {patikalar.map((p) => {
              const pCourses = courses.filter((c) => p.courseIds.includes(c.id));
              return (
                <div
                  key={p.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-amber-400 font-semibold">{p.level} Seviye</span>
                      <span className="text-xs font-mono text-slate-400">{p.duration}</span>
                    </div>
                    <h4 className="text-base font-bold text-white">{p.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed">
                      {p.description}
                    </p>
                    <div className="text-xs text-slate-300 font-medium pt-2 border-t border-slate-800">
                      {pCourses.length} Bağlı Eğitim (Ders)
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenEditPatika(p)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePatika(p.id, p.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: COURSES & INSTRUCTOR ASSIGNMENT */}
      {activeTab === 'courses' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Eğitimler (Dersler) & Eğitmen Atamaları</h3>
            <button
              onClick={handleOpenAddCourse}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
            >
              <Plus className="w-3.5 h-3.5" />
              Yeni Eğitim
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((c) => {
              const patika = patikalar.find((p) => p.id === c.patikaId);
              const instructor = instructors.find((i) => i.id === c.instructorId);
              const courseContents = contents.filter((cnt) => cnt.courseId === c.id);

              return (
                <div
                  key={c.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-amber-400 font-medium">{patika?.title}</span>
                      <span className="font-mono text-slate-400">{c.duration}</span>
                    </div>

                    <h4 className="text-base font-bold text-white">{c.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {c.description}
                    </p>

                    <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs mt-3">
                      <div className="flex items-center gap-2">
                        <img
                          src={instructor?.avatar}
                          alt={instructor?.name}
                          className="w-6 h-6 rounded-full object-cover shrink-0"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-[10px] text-slate-400 block">Atanan Eğitmen:</span>
                          <span className="text-slate-200 font-semibold">{instructor?.name || 'Atanmadı'}</span>
                        </div>
                      </div>
                      <span className="text-slate-400 font-mono text-[11px]">
                        {courseContents.length} İçerik
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800/80">
                    <button
                      onClick={() => handleOpenEditCourse(c)}
                      className="p-1.5 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Eğitimi ve Atanan Eğitmeni Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteCourse(c.id, c.title)}
                      className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: INSTRUCTOR MANAGEMENT (OPERATOR EXCLUSIVE) */}
      {activeTab === 'instructors' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 flex items-start gap-3">
            <Shield className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <strong>Kural:</strong> Eğitmenleri sadece Operatörler sisteme ekleyebilir. Giriş/Kayıt ekranından eğitmen kaydı yapılamaz. Operatör eğitmeni oluşturduktan sonra yukarıdaki "Eğitimler" sekmesinden eğitmeni derslere atar.
            </div>
          </div>

          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Sistemdeki Eğitmenler ({instructors.length})</h3>
            <button
              onClick={() => setIsInstructorModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
            >
              <UserPlus className="w-3.5 h-3.5" />
              Yeni Eğitmen Ekle
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {instructors.map((inst) => {
              const assigned = courses.filter((c) => c.instructorId === inst.id);

              return (
                <div
                  key={inst.id}
                  className="p-5 rounded-xl bg-slate-900 border border-slate-800 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={inst.avatar}
                        alt={inst.name}
                        className="w-10 h-10 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                        referrerPolicy="no-referrer"
                      />
                      <div className="truncate">
                        <h4 className="text-sm font-bold text-white truncate">{inst.name}</h4>
                        <p className="text-xs text-sky-400 truncate">{inst.title}</p>
                        <p className="text-[11px] text-slate-400 font-mono truncate">{inst.email}</p>
                      </div>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">
                      {inst.bio}
                    </p>

                    <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80 space-y-1 text-xs">
                      <span className="text-[11px] font-semibold text-slate-300 block">
                        Atanan Dersler ({assigned.length}):
                      </span>
                      {assigned.length === 0 ? (
                        <span className="text-slate-500 text-[11px]">Henüz ders atanmadı</span>
                      ) : (
                        assigned.map((crs) => (
                          <div key={crs.id} className="text-amber-400 font-medium truncate">
                            • {crs.title}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: CONTENTS & QUIZZES OVERVIEW (OPERATOR CAN EDIT/DELETE ANY) */}
      {activeTab === 'contents' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold text-white">Platformdaki Tüm İçerikler ve Quizler</h3>
            <p className="text-xs text-slate-400">
              Operatör olarak herhangi bir eğitmene ait içeriği veya soruyu düzenleyebilir veya silebilirsiniz.
            </p>
          </div>

          <div className="space-y-3">
            {contents.map((cnt) => {
              const course = courses.find((c) => c.id === cnt.courseId);
              const instructor = users.find((u) => u.id === cnt.instructorId);
              const quizzes = quizQuestions.filter((q) => q.contentId === cnt.id);

              return (
                <div
                  key={cnt.id}
                  className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span className="text-amber-400 font-medium">{course?.title}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-300">Eğitmen: {instructor?.name}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-400">{cnt.durationMinutes} dk</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-sky-400 font-mono">{quizzes.length} Soru</span>
                    </div>
                    <h4 className="text-sm font-semibold text-white">{cnt.title}</h4>
                    <p className="text-xs text-slate-400 line-clamp-1">{cnt.description}</p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      onClick={() => handleOpenEditContent(cnt)}
                      className="p-2 text-slate-400 hover:text-amber-300 hover:bg-slate-800 rounded-lg transition-colors"
                      title="İçeriği Düzenle"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteContent(cnt.id, cnt.title)}
                      className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors"
                      title="İçeriği Sil"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: SYSTEM & SIGNATURE */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          {/* Handcrafted Signature Card */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-amber-500/30 space-y-4">
            <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              Sistem Mimarisi & Geliştirici İmzası
            </div>
            <h3 className="text-xl font-bold text-white">
              ENES ÖZTÜRK İmzalı Patika.dev Klonu
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
              Bu uygulama; Operatörler, Eğitmenler ve Öğrenciler için ayrıştırılmış rol bazlı arayüzler, YouTube video entegrasyonu, Java 102 seviyesinde ders içerik yönetimi, çoktan seçmeli quiz değerlendirme sistemi ve öğrenci yorumlama altyapısı ile özel el emeği olarak tasarlanmıştır.
            </p>
            <div className="flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400 pt-2">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Terminal className="w-3.5 h-3.5" />
                Baş Operatör: Enes Öztürk
              </span>
              <span aria-hidden="true">·</span>
              <span>Kayıtlı Öğrenci: {students.length}</span>
              <span aria-hidden="true">·</span>
              <span>Aktif Eğitmen: {instructors.length}</span>
              <span aria-hidden="true">·</span>
              <span>Toplam Ders: {courses.length}</span>
              <span aria-hidden="true">·</span>
              <span>Toplam İçerik: {contents.length}</span>
              <span aria-hidden="true">·</span>
              <span>Kayıt / Katılım: {enrollments.length}</span>
            </div>
          </div>

          {/* Students List */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold text-white">Sisteme Kayıtlı Öğrenciler ({students.length})</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {students.map((s) => (
                <div
                  key={s.id}
                  className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center gap-3 text-xs"
                >
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <p className="font-semibold text-white truncate">{s.name}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{s.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Data Reset Helper */}
          <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
            <div>
              <h5 className="text-xs font-semibold text-slate-200">Verileri Varsayılana Sıfırla</h5>
              <p className="text-[11px] text-slate-400">
                Tüm test kayıtlarını ve değişiklikleri başlangıç durumuna döndürür.
              </p>
            </div>
            <button
              onClick={() => {
                if (window.confirm('Tüm platform verilerini sıfırlamak istediğinize emin misiniz?')) {
                  resetAllData();
                  setFeedback({ type: 'success', text: 'Tüm sistem verileri sıfırlandı.' });
                }
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Sıfırla
            </button>
          </div>
        </div>
      )}

      {/* PATIKA MODAL */}
      <Modal
        isOpen={isPatikaModalOpen}
        onClose={() => setIsPatikaModalOpen(false)}
        title={editingPatika ? 'Patikayı Düzenle' : 'Yeni Patika Oluştur'}
        subtitle="Kariyer yolunun adını, açıklamasını ve seviyesini belirleyin"
      >
        <form onSubmit={handleSavePatika} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Patika Başlığı *</label>
            <input
              type="text"
              required
              value={patikaForm.title}
              onChange={(e) => setPatikaForm({ ...patikaForm, title: e.target.value })}
              placeholder="Örn: Go ile Bulut & Mikroservis Patikası"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Seviye</label>
              <select
                value={patikaForm.level}
                onChange={(e) =>
                  setPatikaForm({
                    ...patikaForm,
                    level: e.target.value as 'Başlangıç' | 'Orta' | 'İleri',
                  })
                }
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              >
                <option value="Başlangıç">Başlangıç</option>
                <option value="Orta">Orta</option>
                <option value="İleri">İleri</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tahmini Süre</label>
              <input
                type="text"
                value={patikaForm.duration}
                onChange={(e) => setPatikaForm({ ...patikaForm, duration: e.target.value })}
                placeholder="Örn: 90 Saat"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
            <textarea
              rows={3}
              value={patikaForm.description}
              onChange={(e) => setPatikaForm({ ...patikaForm, description: e.target.value })}
              placeholder="Bu patikanın hedefleri ve kazanımları..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsPatikaModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-semibold rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {/* COURSE MODAL */}
      <Modal
        isOpen={isCourseModalOpen}
        onClose={() => setIsCourseModalOpen(false)}
        title={editingCourse ? 'Eğitimi Düzenle' : 'Yeni Eğitim (Ders) Ekle'}
        subtitle="Eğitimi bir patikaya ve sorumlu bir eğitmene bağlayın"
      >
        <form onSubmit={handleSaveCourse} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Ait Olduğu Patika *</label>
            <select
              value={courseForm.patikaId}
              onChange={(e) => setCourseForm({ ...courseForm, patikaId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {patikalar.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Eğitim Başlığı *</label>
            <input
              type="text"
              required
              value={courseForm.title}
              onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
              placeholder="Örn: Java 102 - Nesne Yönelimli Programlama"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Atanacak Eğitmen * (Yalnızca Operatör Yetkisinde)
            </label>
            <select
              value={courseForm.instructorId}
              onChange={(e) => setCourseForm({ ...courseForm, instructorId: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              required
            >
              {instructors.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.name} ({inst.title})
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Tahmini Süre</label>
              <input
                type="text"
                value={courseForm.duration}
                onChange={(e) => setCourseForm({ ...courseForm, duration: e.target.value })}
                placeholder="Örn: 32 Saat"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Sıra</label>
              <input
                type="number"
                min="1"
                value={courseForm.order}
                onChange={(e) => setCourseForm({ ...courseForm, order: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
            <textarea
              rows={3}
              value={courseForm.description}
              onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
              placeholder="Dersin kapsamı ve gereksinimleri..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsCourseModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold rounded-lg"
            >
              Kaydet
            </button>
          </div>
        </form>
      </Modal>

      {/* INSTRUCTOR ADD MODAL (OPERATOR ONLY) */}
      <Modal
        isOpen={isInstructorModalOpen}
        onClose={() => setIsInstructorModalOpen(false)}
        title="Yeni Eğitmen Tanımla"
        subtitle="Sadece Operatörler yeni eğitmen ekleyebilir"
      >
        <form onSubmit={handleSaveInstructor} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Ad Soyad *</label>
            <input
              type="text"
              required
              value={instructorForm.name}
              onChange={(e) => setInstructorForm({ ...instructorForm, name: e.target.value })}
              placeholder="Örn: Kemal Akın"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-posta Adresi *</label>
            <input
              type="email"
              required
              value={instructorForm.email}
              onChange={(e) => setInstructorForm({ ...instructorForm, email: e.target.value })}
              placeholder="kemal@patika.dev"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Uzmanlık / Unvan</label>
            <input
              type="text"
              value={instructorForm.title}
              onChange={(e) => setInstructorForm({ ...instructorForm, title: e.target.value })}
              placeholder="Örn: Docker & Kubernetes DevOps Eğitmeni"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Hakkında / Biyografi</label>
            <textarea
              rows={3}
              value={instructorForm.bio}
              onChange={(e) => setInstructorForm({ ...instructorForm, bio: e.target.value })}
              placeholder="Eğitmenin tecrübesi ve özgeçmişi..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsInstructorModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg"
            >
              Eğitmeni Sisteme Ekle
            </button>
          </div>
        </form>
      </Modal>

      {/* CONTENT EDIT MODAL */}
      <Modal
        isOpen={isContentModalOpen}
        onClose={() => setIsContentModalOpen(false)}
        title="İçeriği Düzenle (Operatör Yetkisi)"
        subtitle="Platform üzerindeki herhangi bir içeriği güncelleyin"
      >
        <form onSubmit={handleSaveContent} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">İçerik Başlığı *</label>
            <input
              type="text"
              required
              value={contentForm.title}
              onChange={(e) => setContentForm({ ...contentForm, title: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">YouTube Video Linki</label>
            <input
              type="url"
              required
              value={contentForm.youtubeUrl}
              onChange={(e) => setContentForm({ ...contentForm, youtubeUrl: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Açıklama</label>
            <textarea
              rows={3}
              value={contentForm.description}
              onChange={(e) => setContentForm({ ...contentForm, description: e.target.value })}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={() => setIsContentModalOpen(false)}
              className="px-4 py-2 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 text-slate-950 text-xs font-semibold rounded-lg"
            >
              Güncelle
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
