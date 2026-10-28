import React from 'react';
import { useApp } from '../context/AppContext';
import { Award, Mail, Phone, Calendar, Dumbbell, ArrowRight, CheckCircle2 } from 'lucide-react';

export const TrainersPage: React.FC = () => {
  const { users, workouts, setSelectedTrainerId, setSelectedWorkoutId } = useApp();

  const trainers = users.filter(u => u.role === 'trainer');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Page Header */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Uzman Antrenör Kadrosu</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          ALANININ EN İYİLERİYLE <br />
          <span className="text-amber-400">HEDEFLERİNE ULAŞ</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          SmartEdu modelinde olduğu gibi, her antrenörümüz kendi uzmanlık alanında bağımsız programlar yönetir. Eğitmen profillerini inceleyebilir ve verdikleri seanslara katılabilirsiniz.
        </p>
      </div>

      {/* Trainers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {trainers.map((trainer) => {
          const trainerWorkouts = workouts.filter(w => w.trainerId === trainer.id);

          return (
            <div
              key={trainer.id}
              className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-xl"
            >
              <div>
                {/* Trainer Portrait */}
                <div className="relative h-80 w-full overflow-hidden bg-neutral-950">
                  <img
                    src={trainer.avatar}
                    alt={trainer.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                  
                  <div className="absolute bottom-4 left-5 right-5">
                    <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider block">
                      {trainer.specialty || 'Kıdemli Spor Antrenörü'}
                    </span>
                    <h3 className="font-display text-2xl font-bold text-white mt-0.5">
                      {trainer.name}
                    </h3>
                  </div>
                </div>

                {/* Trainer Bio & Meta */}
                <div className="p-6 space-y-4">
                  <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed line-clamp-3">
                    {trainer.bio || 'Misfit kulübünde sporcularımızın fiziki ve zihinsel gelişimine rehberlik etmektedir.'}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-neutral-800/80 text-xs text-neutral-400">
                    <div className="flex items-center justify-between">
                      <span>Verdiği Antrenmanlar:</span>
                      <strong className="text-amber-400 font-bold">{trainerWorkouts.length} Program</strong>
                    </div>

                    <div className="flex items-center justify-between">
                      <span>İletişim:</span>
                      <span className="text-neutral-300">{trainer.email}</span>
                    </div>

                    {trainer.phone && (
                      <div className="flex items-center justify-between">
                        <span>Telefon:</span>
                        <span className="text-neutral-300">{trainer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* List of 2 preview workouts */}
                  {trainerWorkouts.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[11px] text-neutral-400 uppercase font-semibold block mb-2">
                        Seans Örnekleri:
                      </span>
                      <div className="space-y-1.5">
                        {trainerWorkouts.slice(0, 2).map(w => (
                          <button
                            key={w.id}
                            onClick={() => setSelectedWorkoutId(w.id)}
                            className="w-full text-left p-2 rounded-lg bg-neutral-950 border border-neutral-800 hover:border-amber-500/50 text-[11px] text-neutral-300 hover:text-white flex items-center justify-between transition-colors"
                          >
                            <span className="truncate max-w-[200px]">{w.title}</span>
                            <span className="text-amber-400 shrink-0 font-medium">{w.durationMinutes} dk</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Button */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedTrainerId(trainer.id)}
                  className="w-full py-3 bg-neutral-950 hover:bg-amber-500 hover:text-neutral-950 border border-neutral-800 text-amber-400 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 group/btn"
                >
                  <span>Eğitmenin Özel Sayfasını Aç</span>
                  <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trainer Recruitment Callout */}
      <div className="p-8 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-2 text-center md:text-left">
          <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
            Sen de Misfit Ailesine Eğitmen Olarak Katılmak İster misin?
          </h3>
          <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
            Sistemimize "Eğitmen" rolüyle kaydolarak kendi antrenman seanslarını ekleyebilir, kontenjanlarını ve sporcu kayıtlarını hemen yönetmeye başlayabilirsin.
          </p>
        </div>

        <button
          onClick={() => setSelectedTrainerId(null)}
          className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-colors whitespace-nowrap shadow-md shadow-amber-500/20"
        >
          Eğitmen Olarak Kaydol
        </button>
      </div>
    </div>
  );
};
