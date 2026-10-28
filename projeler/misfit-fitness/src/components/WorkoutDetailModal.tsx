import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Clock, Calendar, MapPin, Users, Award, CheckCircle, Flame, ArrowRight } from 'lucide-react';

export const WorkoutDetailModal: React.FC = () => {
  const { 
    selectedWorkoutId, 
    setSelectedWorkoutId, 
    workouts, 
    currentUser, 
    enrollWorkout, 
    leaveWorkout, 
    setSelectedTrainerId, 
    setActivePage,
    users
  } = useApp();

  if (!selectedWorkoutId) return null;

  const workout = workouts.find(w => w.id === selectedWorkoutId);
  if (!workout) return null;

  const isEnrolled = currentUser ? workout.enrolledMemberIds.includes(currentUser.id) : false;
  const isFull = workout.enrolledMemberIds.length >= workout.capacity;
  const isMyCourse = currentUser && currentUser.id === workout.trainerId;

  // Enrolled members objects
  const enrolledMembers = users.filter(u => workout.enrolledMemberIds.includes(u.id));

  const handleEnrollToggle = () => {
    if (isEnrolled) {
      leaveWorkout(workout.id);
    } else {
      enrollWorkout(workout.id);
    }
  };

  const handleViewTrainer = () => {
    setSelectedWorkoutId(null);
    setSelectedTrainerId(workout.trainerId);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedWorkoutId(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/70 text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero image with overlay */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden">
          <img
            src={workout.image}
            alt={workout.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/40 to-transparent" />
          
          <div className="absolute bottom-4 left-6 right-6">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-semibold uppercase tracking-wider mb-1">
              <span>{workout.category}</span>
              <span className="text-neutral-400">·</span>
              <span>{workout.level}</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide leading-tight">
              {workout.title}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          {/* Key metadata grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>Süre</span>
              </div>
              <div className="text-sm font-bold text-white tabular-nums">{workout.durationMinutes} Dakika</div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Program</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{workout.schedule}</div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                <Users className="w-3.5 h-3.5 text-amber-400" />
                <span>Kontenjan</span>
              </div>
              <div className="text-sm font-bold text-white tabular-nums">
                {workout.enrolledMemberIds.length} / {workout.capacity} Kişi
              </div>
            </div>

            <div className="p-3 bg-neutral-950 rounded-xl border border-neutral-800">
              <div className="flex items-center gap-1.5 text-neutral-400 text-[11px] mb-1">
                <MapPin className="w-3.5 h-3.5 text-amber-400" />
                <span>Lokasyon</span>
              </div>
              <div className="text-xs font-bold text-white truncate">{workout.location || 'Misfit Ana Salon'}</div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
              Antrenman Detayı ve Hedefleri
            </h4>
            <p className="text-sm text-neutral-300 leading-relaxed">
              {workout.description}
            </p>
          </div>

          {/* Trainer mini card */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <img
                src={workout.trainerAvatar}
                alt={workout.trainerName}
                className="w-12 h-12 rounded-xl object-cover border border-neutral-700"
              />
              <div>
                <div className="text-xs text-amber-400 font-medium">Baş Antrenör</div>
                <div className="text-sm font-bold text-white">{workout.trainerName}</div>
              </div>
            </div>

            <button
              onClick={handleViewTrainer}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white bg-neutral-900 hover:bg-neutral-800 border border-neutral-700 rounded-lg transition-colors"
            >
              <span>Eğitmen Profilini Gör</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Capacity Progress Bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-400 mb-1.5">
              <span>Doluluk Oranı</span>
              <span className="font-semibold text-white">
                %{Math.round((workout.enrolledMemberIds.length / workout.capacity) * 100)} ({workout.capacity - workout.enrolledMemberIds.length} yer kaldı)
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-neutral-800 overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(100, (workout.enrolledMemberIds.length / workout.capacity) * 100)}%` }}
              />
            </div>
          </div>

          {/* Enrolled members list (Visible to all, showing community) */}
          {enrolledMembers.length > 0 && (
            <div>
              <h4 className="text-xs uppercase tracking-wider text-neutral-400 font-semibold mb-2">
                Kayıtlı Üyeler ({enrolledMembers.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {enrolledMembers.map(m => (
                  <div key={m.id} className="flex items-center gap-1.5 px-2.5 py-1 bg-neutral-950 border border-neutral-800 rounded-lg text-xs text-neutral-300">
                    <img src={m.avatar} alt={m.name} className="w-4 h-4 rounded-full object-cover" />
                    <span>{m.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="pt-2 flex items-center justify-between gap-4 border-t border-neutral-800">
            {isMyCourse ? (
              <div className="w-full py-2.5 px-4 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-amber-400 font-medium text-center">
                Bu antrenman sizin tarafınızdan verilmektedir. Düzenlemek için panelinize gidin.
              </div>
            ) : (
              <button
                onClick={handleEnrollToggle}
                disabled={!isEnrolled && isFull}
                className={`w-full py-3 px-6 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${
                  isEnrolled
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md shadow-rose-900/30'
                    : isFull
                    ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                    : 'bg-amber-500 hover:bg-amber-400 text-neutral-950 shadow-md shadow-amber-500/20'
                }`}
              >
                {isEnrolled ? (
                  <>
                    <X className="w-4 h-4" />
                    <span>Antrenmandan Kaydımı İptal Et</span>
                  </>
                ) : isFull ? (
                  <span>Kontenjan Dolu</span>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span>Bu Antrenmana Kaydol (Hemen Başla)</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
