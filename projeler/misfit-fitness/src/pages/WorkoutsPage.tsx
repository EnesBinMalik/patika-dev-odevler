import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Clock, 
  Calendar, 
  Users, 
  CheckCircle, 
  X, 
  Award,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const WorkoutsPage: React.FC = () => {
  const { 
    workouts, 
    users, 
    currentUser, 
    setSelectedWorkoutId, 
    setSelectedTrainerId,
    enrollWorkout,
    leaveWorkout
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedTrainer, setSelectedTrainer] = useState<string>('all');
  const [enrollFilter, setEnrollFilter] = useState<'all' | 'enrolled' | 'available'>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'duration-asc' | 'duration-desc' | 'capacity' | 'title'>('newest');

  const trainers = users.filter(u => u.role === 'trainer');

  const categories = [
    'all',
    'CrossFit',
    'Pilates & Mobilite',
    'Boks & HIIT',
    'Kondisyon & Güç',
    'Yoga & Esneklik'
  ];

  const levels = ['all', 'Başlangıç', 'Orta Seviye', 'İleri Seviye'];

  const filteredAndSortedWorkouts = useMemo(() => {
    let list = [...workouts];

    // Search filter
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      list = list.filter(w => 
        w.title.toLowerCase().includes(q) ||
        w.description.toLowerCase().includes(q) ||
        w.trainerName.toLowerCase().includes(q) ||
        (w.location && w.location.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      list = list.filter(w => w.category === selectedCategory);
    }

    // Level filter
    if (selectedLevel !== 'all') {
      list = list.filter(w => w.level === selectedLevel);
    }

    // Trainer filter
    if (selectedTrainer !== 'all') {
      list = list.filter(w => w.trainerId === selectedTrainer);
    }

    // Enrolled / Available filter
    if (enrollFilter === 'enrolled' && currentUser) {
      list = list.filter(w => w.enrolledMemberIds.includes(currentUser.id));
    } else if (enrollFilter === 'available') {
      list = list.filter(w => w.enrolledMemberIds.length < w.capacity);
    }

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'newest') {
        return b.id.localeCompare(a.id);
      }
      if (sortBy === 'duration-asc') {
        return a.durationMinutes - b.durationMinutes;
      }
      if (sortBy === 'duration-desc') {
        return b.durationMinutes - a.durationMinutes;
      }
      if (sortBy === 'capacity') {
        // En yüksek doluluk oranına göre
        const ratioA = a.enrolledMemberIds.length / a.capacity;
        const ratioB = b.enrolledMemberIds.length / b.capacity;
        return ratioB - ratioA;
      }
      if (sortBy === 'title') {
        return a.title.localeCompare(b.title, 'tr');
      }
      return 0;
    });

    return list;
  }, [workouts, searchTerm, selectedCategory, selectedLevel, selectedTrainer, enrollFilter, sortBy, currentUser]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>SmartEdu Antrenman Kataloğu</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          ANTRENMANLAR VE <br />
          <span className="text-amber-400">SEANS PROGRAMLARI</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          Eğitmenlerimizin hazırladığı tüm programları inceleyin, süresine veya kontenjanına göre sıralayın ve üyeliğinizle tek tıkla seanslara kaydolun.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="p-6 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-xl space-y-4">
        {/* Top row: Search and Sort */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Antrenman, koç veya anahtar kelime ara..."
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort selector */}
          <div className="flex items-center gap-3 w-full md:w-auto justify-end">
            <div className="flex items-center gap-2 text-xs text-neutral-400">
              <ArrowUpDown className="w-4 h-4 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">Sıralama:</span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-neutral-950 border border-neutral-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="newest">En Yeni Eklenenler</option>
              <option value="duration-asc">Süreye Göre (Kısa → Uzun)</option>
              <option value="duration-desc">Süreye Göre (Uzun → Kısa)</option>
              <option value="capacity">Doluluk Oranına Göre</option>
              <option value="title">İsme Göre (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Second row: Category pills and trainer filter */}
        <div className="pt-2 border-t border-neutral-800 flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-500 text-neutral-950 font-bold'
                    : 'bg-neutral-950 border border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                {cat === 'all' ? 'Tüm Kategoriler' : cat}
              </button>
            ))}
          </div>

          {/* Secondary Dropdown Filters */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {/* Trainer filter */}
            <select
              value={selectedTrainer}
              onChange={(e) => setSelectedTrainer(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Tüm Eğitmenler</option>
              {trainers.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>

            {/* Level filter */}
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="bg-neutral-950 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-neutral-300 focus:outline-none focus:border-amber-400"
            >
              <option value="all">Tüm Seviyeler</option>
              <option value="Başlangıç">Başlangıç</option>
              <option value="Orta Seviye">Orta Seviye</option>
              <option value="İleri Seviye">İleri Seviye</option>
            </select>

            {/* Enrolled filter if logged in */}
            {currentUser && (
              <button
                onClick={() => setEnrollFilter(enrollFilter === 'enrolled' ? 'all' : 'enrolled')}
                className={`px-3 py-1.5 rounded-lg border transition-colors ${
                  enrollFilter === 'enrolled'
                    ? 'bg-amber-500/20 border-amber-400 text-amber-400 font-semibold'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400 hover:text-white'
                }`}
              >
                Aldığım Antrenmanlar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="flex items-center justify-between text-xs text-neutral-400">
        <span>
          Toplam <strong className="text-white font-semibold">{filteredAndSortedWorkouts.length}</strong> antrenman listeleniyor.
        </span>

        {(selectedCategory !== 'all' || selectedLevel !== 'all' || selectedTrainer !== 'all' || searchTerm || enrollFilter !== 'all') && (
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedTrainer('all');
              setSearchTerm('');
              setEnrollFilter('all');
            }}
            className="text-amber-400 hover:text-amber-300 underline underline-offset-4"
          >
            Filtreleri Temizle
          </button>
        )}
      </div>

      {/* Workouts Grid */}
      {filteredAndSortedWorkouts.length === 0 ? (
        <div className="text-center py-20 bg-neutral-900 border border-neutral-800 rounded-2xl p-8 space-y-3">
          <p className="text-neutral-400 text-sm">Seçilen kriterlere uygun antrenman bulunamadı.</p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedLevel('all');
              setSelectedTrainer('all');
              setSearchTerm('');
              setEnrollFilter('all');
            }}
            className="px-4 py-2 bg-amber-500 text-neutral-950 text-xs font-bold rounded-lg"
          >
            Tüm Antrenmanları Göster
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedWorkouts.map((workout) => {
            const isEnrolled = currentUser ? workout.enrolledMemberIds.includes(currentUser.id) : false;
            const isFull = workout.enrolledMemberIds.length >= workout.capacity;
            const isMyCourse = currentUser && currentUser.id === workout.trainerId;

            return (
              <div
                key={workout.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-xl"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-52 w-full overflow-hidden bg-neutral-950">
                    <img
                      src={workout.image}
                      alt={workout.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-transparent to-transparent" />
                    
                    <div className="absolute top-3 left-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2.5 py-1 rounded-md text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                      {workout.category}
                    </div>

                    <div className="absolute top-3 right-3 bg-neutral-950/80 backdrop-blur-md border border-neutral-800 px-2 py-0.5 rounded text-[11px] text-neutral-300">
                      {workout.level}
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-6 space-y-3">
                    <h3 
                      onClick={() => setSelectedWorkoutId(workout.id)}
                      className="font-display text-xl font-bold text-white hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {workout.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>

                    {/* Trainer badge */}
                    <div 
                      onClick={() => setSelectedTrainerId(workout.trainerId)}
                      className="flex items-center gap-2.5 pt-2 cursor-pointer group/tr"
                    >
                      <img
                        src={workout.trainerAvatar}
                        alt={workout.trainerName}
                        className="w-7 h-7 rounded-full object-cover border border-neutral-700"
                      />
                      <span className="text-xs font-medium text-neutral-300 group-hover/tr:text-amber-400 transition-colors">
                        {workout.trainerName}
                      </span>
                    </div>

                    {/* Key stats */}
                    <div className="pt-3 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{workout.durationMinutes} dk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-amber-400" />
                        <span className="truncate max-w-[130px]">{workout.schedule}</span>
                      </div>
                      <div className="flex items-center gap-1 tabular-nums">
                        <Users className="w-3.5 h-3.5 text-amber-400" />
                        <span>{workout.enrolledMemberIds.length}/{workout.capacity}</span>
                      </div>
                    </div>

                    {/* Progress bar */}
                    <div className="w-full h-1.5 rounded-full bg-neutral-800 overflow-hidden">
                      <div 
                        className="h-full bg-amber-500 rounded-full"
                        style={{ width: `${Math.min(100, (workout.enrolledMemberIds.length / workout.capacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-6 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedWorkoutId(workout.id)}
                      className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-neutral-800"
                    >
                      Detayları Gör
                    </button>

                    {isMyCourse ? (
                      <div className="w-full py-2.5 rounded-lg bg-neutral-950 border border-neutral-800 text-amber-400 text-[11px] font-semibold flex items-center justify-center">
                        Sizin Seansınız
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          if (isEnrolled) {
                            leaveWorkout(workout.id);
                          } else {
                            enrollWorkout(workout.id);
                          }
                        }}
                        disabled={!isEnrolled && isFull}
                        className={`w-full py-2.5 rounded-lg text-xs font-bold transition-colors ${
                          isEnrolled
                            ? 'bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800'
                            : isFull
                            ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                            : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                        }`}
                      >
                        {isEnrolled ? 'Kaydı İptal Et' : isFull ? 'Dolu' : 'Kaydol'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
