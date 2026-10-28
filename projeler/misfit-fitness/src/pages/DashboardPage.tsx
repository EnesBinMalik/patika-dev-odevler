import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Workout, UserRole, WorkoutCategory, WorkoutLevel } from '../types';
import { 
  Shield, 
  Award, 
  User as UserIcon, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  Calendar, 
  Clock, 
  Users, 
  Mail, 
  Phone, 
  MessageSquare, 
  Camera, 
  X, 
  AlertCircle,
  Eye,
  LogOut,
  Sparkles
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const { 
    currentUser, 
    users, 
    workouts, 
    messages, 
    gallery,
    logout,
    updateUserRole,
    deleteUser,
    updateProfile,
    createWorkout,
    updateWorkout,
    deleteWorkout,
    leaveWorkout,
    setSelectedWorkoutId,
    setSelectedTrainerId,
    markMessageRead,
    deleteMessage,
    replyToMessage,
    deleteGalleryItem,
    setIsAuthModalOpen,
    setAuthModalMode,
    showToast
  } = useApp();

  // Admin active tab
  const [adminTab, setAdminTab] = useState<'overview' | 'users' | 'workouts' | 'messages' | 'gallery'>('overview');

  // Workout create/edit modal state
  const [isWorkoutModalOpen, setIsWorkoutModalOpen] = useState(false);
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

  // Form states for workout
  const [workoutTitle, setWorkoutTitle] = useState('');
  const [workoutDesc, setWorkoutDesc] = useState('');
  const [workoutCategory, setWorkoutCategory] = useState<WorkoutCategory>('CrossFit');
  const [workoutLevel, setWorkoutLevel] = useState<WorkoutLevel>('Orta Seviye');
  const [workoutDuration, setWorkoutDuration] = useState(60);
  const [workoutSchedule, setWorkoutSchedule] = useState('Salı & Perşembe 19:00');
  const [workoutCapacity, setWorkoutCapacity] = useState(12);
  const [workoutLocation, setWorkoutLocation] = useState('Misfit Ana Salon');
  const [workoutImage, setWorkoutImage] = useState('/assets/images/misfit_hero_fitness_1793202969692.jpg');

  // Reply note state for messages
  const [replyNotes, setReplyNotes] = useState<Record<string, string>>({});

  // Profile edit state
  const [profileName, setProfileName] = useState(currentUser?.name || '');
  const [profileBio, setProfileBio] = useState(currentUser?.bio || '');
  const [profilePhone, setProfilePhone] = useState(currentUser?.phone || '');
  const [profileSpecialty, setProfileSpecialty] = useState(currentUser?.specialty || '');

  if (!currentUser) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-amber-400">
          <UserIcon className="w-8 h-8" />
        </div>
        <h2 className="font-display text-3xl font-bold text-white uppercase">
          Yönetim Paneline Erişmek İçin Giriş Yapın
        </h2>
        <p className="text-sm text-neutral-400">
          Antrenmanlarınızı yönetmek, aldığınız seansları görüntülemek veya admin işlemlerini gerçekleştirmek için lütfen hesabınıza giriş yapın.
        </p>
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase rounded-xl transition-colors"
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-3 bg-neutral-900 hover:bg-neutral-800 text-white font-semibold text-xs uppercase rounded-xl border border-neutral-800 transition-colors"
          >
            Yeni Hesap Oluştur
          </button>
        </div>
      </div>
    );
  }

  // Helper open workout modal
  const openNewWorkoutModal = () => {
    setEditingWorkout(null);
    setWorkoutTitle('');
    setWorkoutDesc('');
    setWorkoutCategory('CrossFit');
    setWorkoutLevel('Orta Seviye');
    setWorkoutDuration(60);
    setWorkoutSchedule('Pazartesi & Çarşamba 19:00');
    setWorkoutCapacity(12);
    setWorkoutLocation('Misfit Ana Salon');
    setWorkoutImage('/assets/images/misfit_hero_fitness_1793202969692.jpg');
    setIsWorkoutModalOpen(true);
  };

  const openEditWorkoutModal = (workout: Workout) => {
    setEditingWorkout(workout);
    setWorkoutTitle(workout.title);
    setWorkoutDesc(workout.description);
    setWorkoutCategory(workout.category as WorkoutCategory);
    setWorkoutLevel(workout.level);
    setWorkoutDuration(workout.durationMinutes);
    setWorkoutSchedule(workout.schedule);
    setWorkoutCapacity(workout.capacity);
    setWorkoutLocation(workout.location || 'Misfit Ana Salon');
    setWorkoutImage(workout.image);
    setIsWorkoutModalOpen(true);
  };

  const handleWorkoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!workoutTitle.trim()) return;

    if (editingWorkout) {
      updateWorkout({
        ...editingWorkout,
        title: workoutTitle.trim(),
        description: workoutDesc.trim(),
        category: workoutCategory,
        level: workoutLevel,
        durationMinutes: Number(workoutDuration),
        schedule: workoutSchedule.trim(),
        capacity: Number(workoutCapacity),
        location: workoutLocation.trim(),
        image: workoutImage
      });
    } else {
      createWorkout({
        title: workoutTitle.trim(),
        description: workoutDesc.trim(),
        category: workoutCategory,
        level: workoutLevel,
        durationMinutes: Number(workoutDuration),
        schedule: workoutSchedule.trim(),
        capacity: Number(workoutCapacity),
        location: workoutLocation.trim(),
        image: workoutImage,
        trainerId: currentUser.id,
        trainerName: currentUser.name,
        trainerAvatar: currentUser.avatar
      });
    }

    setIsWorkoutModalOpen(false);
  };

  // Handlers for profile update
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: profileName,
      bio: profileBio,
      phone: profilePhone,
      specialty: profileSpecialty
    });
  };

  // ==========================================
  // RENDER: MEMBER DASHBOARD (ÜYE ALANI)
  // ==========================================
  const renderMemberDashboard = () => {
    // Workouts enrolled by this member
    const enrolledWorkouts = workouts.filter(w => w.enrolledMemberIds.includes(currentUser.id));
    // Other available workouts
    const recommendedWorkouts = workouts.filter(w => !w.enrolledMemberIds.includes(currentUser.id)).slice(0, 3);

    return (
      <div className="space-y-10">
        {/* Profile Card Header */}
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-20 h-20 rounded-2xl object-cover border border-neutral-700 shadow-md"
            />
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase mb-1">
                <UserIcon className="w-3.5 h-3.5" />
                <span>Misfit Kulüp Üyesi</span>
              </div>
              <h2 className="font-display text-2xl font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-neutral-400">{currentUser.email} · Katılım: {currentUser.joinedAt}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block uppercase font-medium">Kayıtlı Ders</span>
              <span className="font-display text-2xl font-bold text-amber-400 tabular-nums">{enrolledWorkouts.length}</span>
            </div>
          </div>
        </div>

        {/* Aldığım Antrenmanlar (Enrolled Workouts) */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                Aldığım Antrenmanlar ({enrolledWorkouts.length})
              </h3>
              <p className="text-xs text-neutral-400">
                Kayıt olduğunuz tüm aktif seanslar ve ders saatleri.
              </p>
            </div>
          </div>

          {enrolledWorkouts.length === 0 ? (
            <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-3">
              <p className="text-xs sm:text-sm text-neutral-400">
                Henüz kayıt olduğunuz bir antrenman bulunmamaktadır.
              </p>
              <button
                onClick={() => setSelectedWorkoutId(workouts[0]?.id || null)}
                className="px-4 py-2 bg-amber-500 text-neutral-950 text-xs font-bold rounded-lg uppercase"
              >
                Antrenman Kataloğuna Göz At
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden flex flex-col justify-between shadow-lg"
                >
                  <div>
                    <div className="relative h-44 w-full bg-neutral-950">
                      <img
                        src={workout.image}
                        alt={workout.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 to-transparent" />
                      <div className="absolute top-3 left-3 px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-700 text-emerald-300 text-[11px] font-semibold">
                        Aktif Kayıt
                      </div>
                    </div>

                    <div className="p-5 space-y-2.5">
                      <div className="text-[11px] text-amber-400 font-semibold uppercase">
                        {workout.category}
                      </div>

                      <h4 className="font-display text-lg font-bold text-white line-clamp-1">
                        {workout.title}
                      </h4>

                      <div className="text-xs text-neutral-400 flex items-center gap-2">
                        <span>Eğitmen:</span>
                        <strong className="text-neutral-200">{workout.trainerName}</strong>
                      </div>

                      <div className="space-y-1 text-xs text-neutral-400 pt-2 border-t border-neutral-800">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-amber-400" />
                          <span>{workout.durationMinutes} dakika</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-amber-400" />
                          <span>{workout.schedule}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-5 pt-0 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedWorkoutId(workout.id)}
                      className="py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 text-xs font-semibold rounded-lg border border-neutral-800"
                    >
                      Detay
                    </button>
                    <button
                      onClick={() => leaveWorkout(workout.id)}
                      className="py-2 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800 text-xs font-semibold rounded-lg transition-colors"
                    >
                      Kaydı İptal Et
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recommended Workouts */}
        {recommendedWorkouts.length > 0 && (
          <div className="space-y-4 pt-6 border-t border-neutral-800">
            <h3 className="font-display text-xl font-bold text-white uppercase tracking-wide">
              İlginizi Çekebilecek Diğer Seanslar
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {recommendedWorkouts.map(w => (
                <div key={w.id} className="p-4 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center justify-between gap-3">
                  <div>
                    <div className="text-[10px] text-amber-400 font-semibold uppercase">{w.category}</div>
                    <div className="text-xs font-bold text-white truncate max-w-[170px]">{w.title}</div>
                    <div className="text-[11px] text-neutral-400">{w.schedule}</div>
                  </div>
                  <button
                    onClick={() => setSelectedWorkoutId(w.id)}
                    className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg shrink-0"
                  >
                    Katıl
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER: TRAINER DASHBOARD (EĞİTMEN ALANI)
  // ==========================================
  const renderTrainerDashboard = () => {
    // Workouts created by this trainer
    const myWorkouts = workouts.filter(w => w.trainerId === currentUser.id);
    const totalEnrolledStudents = myWorkouts.reduce((acc, w) => acc + w.enrolledMemberIds.length, 0);

    return (
      <div className="space-y-10">
        {/* Trainer Profile Card */}
        <div className="p-6 sm:p-8 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 shadow-xl">
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-24 h-24 rounded-2xl object-cover border-2 border-amber-500/30 shadow-md"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase">
                <Award className="w-3.5 h-3.5" />
                <span>{currentUser.specialty || 'Misfit Koçu'}</span>
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">{currentUser.name}</h2>
              <p className="text-xs text-neutral-400 max-w-md">{currentUser.bio || 'Misfit bünyesinde üyeler için özel antrenmanlar hazırlıyor.'}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-center px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block uppercase font-medium">Verdiğim Ders</span>
              <span className="font-display text-2xl font-bold text-amber-400 tabular-nums">{myWorkouts.length}</span>
            </div>
            <div className="text-center px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800">
              <span className="text-[11px] text-neutral-400 block uppercase font-medium">Toplam Kayıtlı Üye</span>
              <span className="font-display text-2xl font-bold text-white tabular-nums">{totalEnrolledStudents}</span>
            </div>
          </div>
        </div>

        {/* Verdiğim Antrenmanlar Header + New Button */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-neutral-800 pb-4">
          <div>
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
              Verdiğim Antrenmanlar ({myWorkouts.length})
            </h3>
            <p className="text-xs text-neutral-400">
              SmartEdu mimarisinde olduğu gibi kendi seanslarınızı oluşturabilir, düzenleyebilir ve kaydolan üyeleri görebilirsiniz.
            </p>
          </div>

          <button
            onClick={openNewWorkoutModal}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors shadow-md shadow-amber-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Yeni Antrenman Oluştur</span>
          </button>
        </div>

        {/* Workouts List for Trainer */}
        {myWorkouts.length === 0 ? (
          <div className="p-12 text-center bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
            <p className="text-neutral-400 text-xs sm:text-sm">
              Henüz oluşturduğunuz bir antrenman programı bulunmuyor.
            </p>
            <button
              onClick={openNewWorkoutModal}
              className="px-5 py-2.5 bg-amber-500 text-neutral-950 text-xs font-bold rounded-xl uppercase"
            >
              İlk Seansını Şimdi Başlat
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {myWorkouts.map((workout) => {
              // Get enrolled member user details
              const enrolledMembers = users.filter(u => workout.enrolledMemberIds.includes(u.id));

              return (
                <div
                  key={workout.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 space-y-6 shadow-xl"
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                    <div className="flex items-start gap-4">
                      <img
                        src={workout.image}
                        alt={workout.title}
                        className="w-20 h-20 rounded-xl object-cover border border-neutral-800 shrink-0"
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-[11px] text-amber-400 font-semibold uppercase">
                          <span>{workout.category}</span>
                          <span className="text-neutral-600">·</span>
                          <span>{workout.level}</span>
                          <span className="text-neutral-600">·</span>
                          <span>{workout.durationMinutes} Dk</span>
                        </div>
                        <h4 className="font-display text-xl font-bold text-white">{workout.title}</h4>
                        <p className="text-xs text-neutral-400 line-clamp-1">{workout.description}</p>
                        <div className="text-xs text-neutral-300 flex items-center gap-4 pt-1">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-amber-400" />
                            {workout.schedule}
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3.5 h-3.5 text-amber-400" />
                            Doluluk: <strong className="text-white">{workout.enrolledMemberIds.length}/{workout.capacity}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end lg:self-center">
                      <button
                        onClick={() => openEditWorkoutModal(workout)}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-amber-400" />
                        <span>Düzenle</span>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`"${workout.title}" antrenmanını silmek istediğinize emin misiniz?`)) {
                            deleteWorkout(workout.id);
                          }
                        }}
                        className="flex items-center gap-1.5 px-3.5 py-2 bg-rose-950/60 hover:bg-rose-900 border border-rose-800 text-rose-300 text-xs font-semibold rounded-lg transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Sil</span>
                      </button>
                    </div>
                  </div>

                  {/* Registered Students Section (Eğitmenin üyeleri) */}
                  <div className="pt-4 border-t border-neutral-800/80 bg-neutral-950/60 -mx-6 -mb-6 p-6 rounded-b-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs uppercase tracking-wider text-neutral-300 font-bold flex items-center gap-2">
                        <Users className="w-4 h-4 text-amber-400" />
                        <span>Bu Antrenmana Kaydolan Üyeler ({enrolledMembers.length})</span>
                      </span>
                    </div>

                    {enrolledMembers.length === 0 ? (
                      <p className="text-xs text-neutral-500 italic">
                        Henüz bu antrenmana kaydolan bir üye bulunmuyor.
                      </p>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {enrolledMembers.map(member => (
                          <div
                            key={member.id}
                            className="p-3 bg-neutral-900 border border-neutral-800 rounded-xl flex items-center gap-3"
                          >
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-full object-cover border border-neutral-700"
                            />
                            <div className="truncate">
                              <div className="text-xs font-bold text-white truncate">{member.name}</div>
                              <div className="text-[11px] text-neutral-400 truncate">{member.email}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  // ==========================================
  // RENDER: ADMIN DASHBOARD (YÖNETİCİ ALANI)
  // ==========================================
  const renderAdminDashboard = () => {
    const unreadMessagesCount = messages.filter(m => !m.isRead).length;

    return (
      <div className="space-y-8">
        {/* Admin Navigation Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-neutral-800 scrollbar-none">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              adminTab === 'overview'
                ? 'bg-amber-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Genel Bakış
          </button>
          <button
            onClick={() => setAdminTab('users')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              adminTab === 'users'
                ? 'bg-amber-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Kullanıcı Yönetimi ({users.length})
          </button>
          <button
            onClick={() => setAdminTab('workouts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              adminTab === 'workouts'
                ? 'bg-amber-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Tüm Antrenmanlar ({workouts.length})
          </button>
          <button
            onClick={() => setAdminTab('messages')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap flex items-center gap-2 ${
              adminTab === 'messages'
                ? 'bg-amber-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            <span>Gelen Mesajlar</span>
            {unreadMessagesCount > 0 && (
              <span className="w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] flex items-center justify-center font-bold">
                {unreadMessagesCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setAdminTab('gallery')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${
              adminTab === 'gallery'
                ? 'bg-amber-500 text-neutral-950'
                : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
            }`}
          >
            Galeri Yönetimi ({gallery.length})
          </button>
        </div>

        {/* Tab 1: Overview */}
        {adminTab === 'overview' && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Toplam Kullanıcı</span>
                <span className="font-display text-4xl font-bold text-white tabular-nums">{users.length}</span>
                <div className="text-[11px] text-neutral-400 mt-2">
                  {users.filter(u => u.role === 'member').length} Üye · {users.filter(u => u.role === 'trainer').length} Eğitmen
                </div>
              </div>

              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Aktif Antrenman</span>
                <span className="font-display text-4xl font-bold text-white tabular-nums">{workouts.length}</span>
                <div className="text-[11px] text-neutral-400 mt-2">
                  Tüm kategorilerde yayınlanan seanslar
                </div>
              </div>

              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Gelen Mesajlar</span>
                <span className="font-display text-4xl font-bold text-white tabular-nums">{messages.length}</span>
                <div className="text-[11px] text-amber-400 font-medium mt-2">
                  {unreadMessagesCount} okunmamış mesaj
                </div>
              </div>

              <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl">
                <span className="text-xs text-amber-400 font-semibold uppercase block mb-1">Galeri Fotoğrafları</span>
                <span className="font-display text-4xl font-bold text-white tabular-nums">{gallery.length}</span>
                <div className="text-[11px] text-neutral-400 mt-2">
                  Stüdyo ve antrenman kareleri
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl space-y-4">
              <h4 className="font-display text-xl font-bold text-white uppercase tracking-wide">
                Hızlı Yönetici İşlemleri
              </h4>
              <div className="flex flex-wrap gap-3">
                <button
                  onClick={openNewWorkoutModal}
                  className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase rounded-xl transition-colors flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Yeni Antrenman Ekle</span>
                </button>
                <button
                  onClick={() => setAdminTab('messages')}
                  className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  <MessageSquare className="w-4 h-4 text-amber-400" />
                  <span>İletişim Kutusu ({unreadMessagesCount} Yeni)</span>
                </button>
                <button
                  onClick={() => setAdminTab('users')}
                  className="px-4 py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-neutral-200 font-semibold text-xs rounded-xl transition-colors flex items-center gap-2"
                >
                  <Users className="w-4 h-4 text-amber-400" />
                  <span>Kullanıcı Rollerını Yönet</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Users Management */}
        {adminTab === 'users' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                Kullanıcı ve Rol Yönetimi
              </h3>
              <span className="text-xs text-neutral-400">
                Giriş ve kayıt kontrolleri, rol değiştirme ve silme işlemleri
              </span>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Kullanıcı</th>
                      <th className="py-3.5 px-4 font-semibold">E-posta</th>
                      <th className="py-3.5 px-4 font-semibold">Mevcut Rol</th>
                      <th className="py-3.5 px-4 font-semibold">Katılım</th>
                      <th className="py-3.5 px-4 font-semibold text-right">Rol Değiştir / İşlem</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {users.map(u => (
                      <tr key={u.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2.5">
                            <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-full object-cover" />
                            <span className="font-bold text-white">{u.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-neutral-400">{u.email}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                            u.role === 'admin'
                              ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                              : u.role === 'trainer'
                              ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/40'
                              : 'bg-neutral-800 text-neutral-300'
                          }`}>
                            {u.role === 'admin' ? 'Yönetici' : u.role === 'trainer' ? 'Eğitmen' : 'Üye'}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-neutral-400">{u.joinedAt}</td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <select
                              value={u.role}
                              onChange={(e) => updateUserRole(u.id, e.target.value as UserRole)}
                              className="bg-neutral-950 border border-neutral-700 rounded-md px-2 py-1 text-[11px] text-white focus:outline-none"
                            >
                              <option value="member">Üye Yap</option>
                              <option value="trainer">Eğitmen Yap</option>
                              <option value="admin">Admin Yap</option>
                            </select>

                            {u.id !== currentUser.id && (
                              <button
                                onClick={() => {
                                  if (confirm(`"${u.name}" kullanıcısını silmek istediğinize emin misiniz?`)) {
                                    deleteUser(u.id);
                                  }
                                }}
                                className="p-1 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                                title="Kullanıcıyı Sil"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Workouts Management */}
        {adminTab === 'workouts' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                  Tüm Antrenman Programları
                </h3>
                <p className="text-xs text-neutral-400">
                  Tüm eğitmenlerin seanslarını denetleyebilir, düzenleyebilir veya silebilirsiniz.
                </p>
              </div>

              <button
                onClick={openNewWorkoutModal}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase rounded-xl transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Yeni Antrenman Ekle</span>
              </button>
            </div>

            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-neutral-950 border-b border-neutral-800 text-neutral-400 uppercase tracking-wider">
                    <tr>
                      <th className="py-3.5 px-4 font-semibold">Antrenman</th>
                      <th className="py-3.5 px-4 font-semibold">Kategori</th>
                      <th className="py-3.5 px-4 font-semibold">Eğitmen</th>
                      <th className="py-3.5 px-4 font-semibold">Program</th>
                      <th className="py-3.5 px-4 font-semibold">Kontenjan</th>
                      <th className="py-3.5 px-4 font-semibold text-right">İşlemler</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800">
                    {workouts.map(w => (
                      <tr key={w.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="py-3 px-4 font-bold text-white max-w-[200px] truncate">{w.title}</td>
                        <td className="py-3 px-4 text-amber-400 font-medium">{w.category}</td>
                        <td className="py-3 px-4 text-neutral-300">{w.trainerName}</td>
                        <td className="py-3 px-4 text-neutral-400">{w.schedule}</td>
                        <td className="py-3 px-4 tabular-nums">
                          {w.enrolledMemberIds.length} / {w.capacity}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditWorkoutModal(w)}
                              className="p-1.5 rounded bg-neutral-950 hover:bg-neutral-800 text-neutral-300"
                              title="Düzenle"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`"${w.title}" antrenmanını silmek istediğinize emin misiniz?`)) {
                                  deleteWorkout(w.id);
                                }
                              }}
                              className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                              title="Sil"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 4: Contact Messages Inbox */}
        {adminTab === 'messages' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
                  İletişim Formu Gelen Kutusu
                </h3>
                <p className="text-xs text-neutral-400">
                  Web sitesinin İletişim sayfasından üyelerin ve ziyaretçilerin ilettiği mesajlar.
                </p>
              </div>
            </div>

            {messages.length === 0 ? (
              <div className="p-8 text-center bg-neutral-900 border border-neutral-800 rounded-2xl text-xs text-neutral-400">
                Gelen kutunuzda henüz bir mesaj bulunmuyor.
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-6 rounded-2xl border transition-colors space-y-4 ${
                      msg.isRead
                        ? 'bg-neutral-900 border-neutral-800'
                        : 'bg-neutral-900/90 border-amber-500/40 shadow-lg'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        {!msg.isRead && (
                          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 shrink-0" />
                        )}
                        <div>
                          <h4 className="font-bold text-white text-sm">{msg.subject}</h4>
                          <div className="text-xs text-neutral-400 mt-0.5">
                            Gönderen: <strong className="text-neutral-200">{msg.name}</strong> ({msg.email}) {msg.phone && `· ${msg.phone}`}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-center">
                        <span className="text-[11px] text-neutral-500">{msg.createdAt}</span>
                        {!msg.isRead && (
                          <button
                            onClick={() => markMessageRead(msg.id)}
                            className="px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 text-xs font-semibold hover:bg-amber-500/20"
                          >
                            Okundu İşaretle
                          </button>
                        )}
                        <button
                          onClick={() => deleteMessage(msg.id)}
                          className="p-1.5 rounded bg-rose-950/60 hover:bg-rose-900 text-rose-300"
                          title="Mesajı Sil"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-300 bg-neutral-950 p-4 rounded-xl border border-neutral-800 leading-relaxed">
                      "{msg.message}"
                    </p>

                    {/* Reply Note section */}
                    <div className="pt-2 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center gap-2">
                      {msg.replyNote ? (
                        <div className="text-xs text-emerald-400 flex items-center gap-1.5 w-full">
                          <CheckCircle className="w-3.5 h-3.5 shrink-0" />
                          <span>Yönetici Notu: {msg.replyNote}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 w-full">
                          <input
                            type="text"
                            placeholder="Cevap notu ekle (Örn: Arayarak bilgi verildi)..."
                            value={replyNotes[msg.id] || ''}
                            onChange={(e) => setReplyNotes({ ...replyNotes, [msg.id]: e.target.value })}
                            className="flex-1 bg-neutral-950 border border-neutral-800 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-amber-400"
                          />
                          <button
                            onClick={() => {
                              if (replyNotes[msg.id]?.trim()) {
                                replyToMessage(msg.id, replyNotes[msg.id].trim());
                              }
                            }}
                            className="px-3 py-1.5 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white rounded-lg text-xs font-semibold transition-colors shrink-0"
                          >
                            Notu Kaydet
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Tab 5: Gallery Management */}
        {adminTab === 'gallery' && (
          <div className="space-y-4">
            <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
              Galeri Görselleri
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="relative rounded-xl overflow-hidden bg-neutral-900 border border-neutral-800 group">
                  <img src={item.imageUrl} alt={item.title} className="w-full h-36 object-cover" />
                  <div className="p-2.5">
                    <div className="text-[10px] text-amber-400 uppercase font-semibold">{item.category}</div>
                    <div className="text-xs font-bold text-white truncate">{item.title}</div>
                  </div>
                  <button
                    onClick={() => {
                      if (confirm(`"${item.title}" görselini silmek istediğinize emin misiniz?`)) {
                        deleteGalleryItem(item.id);
                      }
                    }}
                    className="absolute top-2 right-2 p-1.5 rounded bg-rose-950/80 hover:bg-rose-900 text-rose-300"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      {/* Top Banner with Logout & Role info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-amber-400" />
          <div className="text-xs text-neutral-300">
            Aktif Oturum: <strong className="text-white font-semibold">{currentUser.name}</strong> 
            <span className="text-amber-400 font-bold ml-1 uppercase">({currentUser.role})</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold border border-neutral-800 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Oturumu Kapat</span>
          </button>
        </div>
      </div>

      {/* Role-Specific Content */}
      {currentUser.role === 'admin' ? (
        renderAdminDashboard()
      ) : currentUser.role === 'trainer' ? (
        renderTrainerDashboard()
      ) : (
        renderMemberDashboard()
      )}

      {/* Workout Create / Edit Modal */}
      {isWorkoutModalOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in"
          onClick={() => setIsWorkoutModalOpen(false)}
        >
          <div 
            className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsWorkoutModalOpen(false)}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="mb-6">
              <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
                {editingWorkout ? 'Antrenman Düzenleme' : 'Yeni Antrenman Seansı'}
              </span>
              <h3 className="font-display text-2xl font-bold text-white uppercase mt-1">
                {editingWorkout ? editingWorkout.title : 'Antrenman Detaylarını Girin'}
              </h3>
            </div>

            <form onSubmit={handleWorkoutSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Antrenman Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={workoutTitle}
                  onChange={(e) => setWorkoutTitle(e.target.value)}
                  placeholder="Örn: CrossFit Güç & Dayanıklılık WOD"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Açıklama *
                </label>
                <textarea
                  rows={3}
                  required
                  value={workoutDesc}
                  onChange={(e) => setWorkoutDesc(e.target.value)}
                  placeholder="Antrenmanın içeriği, hedef kas grupları ve kazanımları..."
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Kategori
                  </label>
                  <select
                    value={workoutCategory}
                    onChange={(e) => setWorkoutCategory(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="CrossFit">CrossFit</option>
                    <option value="Pilates & Mobilite">Pilates & Mobilite</option>
                    <option value="Boks & HIIT">Boks & HIIT</option>
                    <option value="Kondisyon & Güç">Kondisyon & Güç</option>
                    <option value="Vücut Geliştirme">Vücut Geliştirme</option>
                    <option value="Yoga & Esneklik">Yoga & Esneklik</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Zorluk Seviyesi
                  </label>
                  <select
                    value={workoutLevel}
                    onChange={(e) => setWorkoutLevel(e.target.value as any)}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  >
                    <option value="Başlangıç">Başlangıç</option>
                    <option value="Orta Seviye">Orta Seviye</option>
                    <option value="İleri Seviye">İleri Seviye</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Süre (Dakika)
                  </label>
                  <input
                    type="number"
                    min={20}
                    max={180}
                    required
                    value={workoutDuration}
                    onChange={(e) => setWorkoutDuration(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Kontenjan (Kişi)
                  </label>
                  <input
                    type="number"
                    min={2}
                    max={50}
                    required
                    value={workoutCapacity}
                    onChange={(e) => setWorkoutCapacity(Number(e.target.value))}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Lokasyon / Salon
                  </label>
                  <input
                    type="text"
                    value={workoutLocation}
                    onChange={(e) => setWorkoutLocation(e.target.value)}
                    placeholder="Ana Salon A"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Ders Gün ve Saati
                </label>
                <input
                  type="text"
                  required
                  value={workoutSchedule}
                  onChange={(e) => setWorkoutSchedule(e.target.value)}
                  placeholder="Örn: Pazartesi & Çarşamba 19:30"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Kapak Görseli URL
                </label>
                <input
                  type="text"
                  value={workoutImage}
                  onChange={(e) => setWorkoutImage(e.target.value)}
                  placeholder="/assets/images/... veya görsel bağlantısı"
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-lg transition-colors shadow-md shadow-amber-500/20"
                >
                  {editingWorkout ? 'Değişiklikleri Kaydet' : 'Antrenmanı Yayınla'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
