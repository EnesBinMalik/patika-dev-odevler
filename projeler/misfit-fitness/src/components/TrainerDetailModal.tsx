import React from 'react';
import { useApp } from '../context/AppContext';
import { X, Award, Phone, Mail, Calendar, ArrowRight, Dumbbell, Clock } from 'lucide-react';

export const TrainerDetailModal: React.FC = () => {
  const { 
    selectedTrainerId, 
    setSelectedTrainerId, 
    users, 
    workouts, 
    setSelectedWorkoutId 
  } = useApp();

  if (!selectedTrainerId) return null;

  const trainer = users.find(u => u.id === selectedTrainerId);
  if (!trainer) return null;

  // Filter workouts belonging to this trainer
  const trainerWorkouts = workouts.filter(w => w.trainerId === trainer.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setSelectedTrainerId(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-950/70 text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Profile Section */}
        <div className="p-6 sm:p-8 bg-gradient-to-b from-neutral-950 to-neutral-900 border-b border-neutral-800 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={trainer.avatar}
            alt={trainer.name}
            className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl object-cover border-2 border-amber-500/30 shadow-xl shrink-0"
            referrerPolicy="no-referrer"
          />

          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Award className="w-3.5 h-3.5" />
              <span>{trainer.specialty || 'Kıdemli Eğitmen'}</span>
            </div>

            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white tracking-wide">
              {trainer.name}
            </h2>

            <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed max-w-xl">
              {trainer.bio || 'Misfit bünyesinde üyelerimizin hedeflerine ulaşması için profesyonel antrenörlük desteği sunmaktadır.'}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-neutral-400">
              <div className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-amber-400" />
                <span>{trainer.email}</span>
              </div>
              {trainer.phone && (
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{trainer.phone}</span>
                </div>
              )}
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-amber-400" />
                <span>Misfit Eğitmeni (2025'ten beri)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Workouts Taught by this Trainer */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-lg font-bold text-white uppercase tracking-wide">
                Bu Eğitmenin Verdiği Antrenmanlar ({trainerWorkouts.length})
              </h3>
              <p className="text-xs text-neutral-400">
                {trainer.name} tarafından yönetilen haftalık grup ve stüdyo programları.
              </p>
            </div>
          </div>

          {trainerWorkouts.length === 0 ? (
            <div className="text-center py-10 bg-neutral-950 rounded-xl border border-neutral-800 text-neutral-400 text-xs">
              Bu eğitmene ait henüz yayınlanmış antrenman bulunmamaktadır.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {trainerWorkouts.map((workout) => (
                <div
                  key={workout.id}
                  className="bg-neutral-950 border border-neutral-800 rounded-xl p-4 flex flex-col justify-between hover:border-neutral-700 transition-colors group"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-amber-400 font-semibold uppercase">
                      <span>{workout.category}</span>
                      <span className="text-neutral-500">{workout.level}</span>
                    </div>

                    <h4 className="font-display text-base font-bold text-white group-hover:text-amber-400 transition-colors">
                      {workout.title}
                    </h4>

                    <p className="text-xs text-neutral-400 line-clamp-2">
                      {workout.description}
                    </p>

                    <div className="pt-2 flex items-center gap-3 text-[11px] text-neutral-400">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-amber-400" />
                        <span>{workout.durationMinutes} dk</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-amber-400" />
                        <span className="truncate">{workout.schedule}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-4 mt-3 border-t border-neutral-800/80 flex items-center justify-between">
                    <span className="text-xs text-neutral-400">
                      Kontenjan: <strong className="text-white">{workout.enrolledMemberIds.length}/{workout.capacity}</strong>
                    </span>

                    <button
                      onClick={() => {
                        setSelectedTrainerId(null);
                        setSelectedWorkoutId(workout.id);
                      }}
                      className="px-3 py-1.5 bg-neutral-900 hover:bg-amber-500 hover:text-neutral-950 text-neutral-200 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1"
                    >
                      <span>İncele & Katıl</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
