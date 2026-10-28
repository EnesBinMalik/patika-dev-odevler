import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowRight, 
  Award, 
  Calendar, 
  Clock, 
  Dumbbell, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Users, 
  Zap,
  CheckCircle2,
  ChevronRight,
  Github
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const { 
    workouts, 
    users, 
    setActivePage, 
    setSelectedWorkoutId, 
    setSelectedTrainerId,
    setIsGithubModalOpen,
    enrollWorkout,
    currentUser
  } = useApp();

  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'Tüm Antrenmanlar' },
    { id: 'CrossFit', label: 'CrossFit' },
    { id: 'Pilates & Mobilite', label: 'Pilates & Mobilite' },
    { id: 'Boks & HIIT', label: 'Boks & HIIT' },
    { id: 'Kondisyon & Güç', label: 'Kondisyon & Güç' }
  ];

  const filteredWorkouts = activeCategory === 'all'
    ? workouts.slice(0, 6)
    : workouts.filter(w => w.category === activeCategory).slice(0, 6);

  const trainers = users.filter(u => u.role === 'trainer');

  return (
    <div className="space-y-24">
      {/* 1. Hero Section */}
      <section className="relative min-h-[580px] sm:min-h-[640px] flex items-center justify-center overflow-hidden border-b border-neutral-900">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="/assets/images/misfit_hero_fitness_1793202969692.jpg"
            alt="Misfit Fitness Training Facility"
            className="w-full h-full object-cover object-center brightness-60 contrast-110"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-neutral-950/60 to-neutral-950/40" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent to-neutral-950/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6 pt-12 pb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900/80 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
            <Award className="w-3.5 h-3.5" />
            <span>SmartEdu Mimarisi · Enes Öztürk İmzasıyla El Emeği</span>
          </div>

          <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white uppercase text-balance max-w-4xl mx-auto leading-none">
            GÜCÜNÜ KEŞFET. <br />
            <span className="text-amber-400">SINIRLARINI YENİDEN TANIMLA.</span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 max-w-2xl mx-auto leading-relaxed font-normal">
            Her antrenörün kendi uzmanlığında seanslar sunduğu, üyelerin gelişimlerini şeffaf şekilde yönettiği butik spor ve kondisyon platformu.
          </p>

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => setActivePage('workouts')}
              className="w-full sm:w-auto px-8 py-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 group"
            >
              <span>Antrenmanları İncele</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => setActivePage('trainers')}
              className="w-full sm:w-auto px-8 py-3.5 bg-neutral-900/90 hover:bg-neutral-800 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-neutral-700/80 transition-all flex items-center justify-center gap-2"
            >
              <span>Eğitmenlerimizle Tanış</span>
            </button>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics Strip (Claim-to-Proof Adjacency) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 bg-neutral-900/90 backdrop-blur-md border border-neutral-800 rounded-2xl shadow-2xl">
          <div className="p-4 border-r border-neutral-800/80 last:border-none">
            <div className="text-xs text-amber-400 font-semibold uppercase mb-1">Eğitmen Kadrosu</div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">{trainers.length} Baş Antrenör</div>
            <div className="text-[11px] text-neutral-400 mt-1">CrossFit, Pilates, Boks & HIIT</div>
          </div>

          <div className="p-4 border-r border-neutral-800/80 last:border-none">
            <div className="text-xs text-amber-400 font-semibold uppercase mb-1">Haftalık Seanslar</div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">{workouts.length} Aktif Program</div>
            <div className="text-[11px] text-neutral-400 mt-1">Butik ve grup antrenmanları</div>
          </div>

          <div className="p-4 border-r border-neutral-800/80 last:border-none">
            <div className="text-xs text-amber-400 font-semibold uppercase mb-1">Maksimum Kontenjan</div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">8 - 14 Kişi</div>
            <div className="text-[11px] text-neutral-400 mt-1">Birebir takip & yüksek verim</div>
          </div>

          <div className="p-4">
            <div className="text-xs text-amber-400 font-semibold uppercase mb-1">Mimari Standart</div>
            <div className="font-display text-3xl font-bold text-white tabular-nums">SmartEdu MVC</div>
            <div className="text-[11px] text-neutral-400 mt-1">Enes Öztürk el emeği kodlama</div>
          </div>
        </div>
      </section>

      {/* 3. Featured Workouts Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-2">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Program Kataloğu
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
              ÖNE ÇIKAN ANTRENMANLAR
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 max-w-xl">
              Farklı disiplinlerde uzman eğitmenlerimiz tarafından hazırlanan ve her seviyeye uygun güncel antrenmanlar.
            </p>
          </div>

          <button
            onClick={() => setActivePage('workouts')}
            className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 transition-colors uppercase tracking-wider"
          >
            <span>Tüm Antrenmanları Gör ({workouts.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 border border-neutral-800 text-neutral-400 hover:text-white hover:border-neutral-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Workouts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkouts.map((workout) => {
            const isEnrolled = currentUser ? workout.enrolledMemberIds.includes(currentUser.id) : false;
            const isFull = workout.enrolledMemberIds.length >= workout.capacity;

            return (
              <div
                key={workout.id}
                className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden hover:border-neutral-700 transition-all flex flex-col justify-between group shadow-lg"
              >
                <div>
                  {/* Card Thumbnail */}
                  <div className="relative h-48 w-full overflow-hidden bg-neutral-950">
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

                  {/* Card Content */}
                  <div className="p-5 space-y-3">
                    <h3 
                      onClick={() => setSelectedWorkoutId(workout.id)}
                      className="font-display text-xl font-bold text-white hover:text-amber-400 cursor-pointer transition-colors line-clamp-1"
                    >
                      {workout.title}
                    </h3>

                    <p className="text-xs text-neutral-400 line-clamp-2 leading-relaxed">
                      {workout.description}
                    </p>

                    {/* Trainer info */}
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

                    {/* Meta stats */}
                    <div className="pt-2 flex items-center justify-between text-[11px] text-neutral-400 border-t border-neutral-800/80">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-amber-400" />
                        <span>{workout.durationMinutes} Dk</span>
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
                  </div>
                </div>

                {/* Card Action */}
                <div className="p-5 pt-0">
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => setSelectedWorkoutId(workout.id)}
                      className="w-full py-2 bg-neutral-950 hover:bg-neutral-800 text-neutral-300 hover:text-white rounded-lg text-xs font-semibold transition-colors border border-neutral-800"
                    >
                      Detayları Gör
                    </button>

                    <button
                      onClick={() => {
                        if (isEnrolled) {
                          setSelectedWorkoutId(workout.id);
                        } else {
                          enrollWorkout(workout.id);
                        }
                      }}
                      disabled={!isEnrolled && isFull}
                      className={`w-full py-2 rounded-lg text-xs font-bold transition-colors ${
                        isEnrolled
                          ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/40'
                          : isFull
                          ? 'bg-neutral-800 text-neutral-500 cursor-not-allowed'
                          : 'bg-amber-500 hover:bg-amber-400 text-neutral-950'
                      }`}
                    >
                      {isEnrolled ? 'Kayıtlısınız' : isFull ? 'Dolu' : 'Hemen Katıl'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Meet the Trainers Section */}
      <section className="bg-neutral-900/40 border-y border-neutral-900 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              Alanında Lider Kadro
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white tracking-wide uppercase">
              UZMAN EĞİTMENLERİMİZ
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400">
              SmartEdu projesinde olduğu gibi, her antrenör kendi uzmanlık seanslarını yönetir ve üyelerinin gelişimini birebir takip eder.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {trainers.map((trainer) => {
              const trainerCourses = workouts.filter(w => w.trainerId === trainer.id);

              return (
                <div
                  key={trainer.id}
                  className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden group hover:border-neutral-700 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="relative h-72 w-full overflow-hidden bg-neutral-950">
                      <img
                        src={trainer.avatar}
                        alt={trainer.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        referrerPolicy="no-referrer"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-neutral-900 via-neutral-900/30 to-transparent" />
                      
                      <div className="absolute bottom-4 left-4 right-4">
                        <div className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
                          {trainer.specialty}
                        </div>
                        <h3 className="font-display text-2xl font-bold text-white">
                          {trainer.name}
                        </h3>
                      </div>
                    </div>

                    <div className="p-6 space-y-3">
                      <p className="text-xs text-neutral-400 leading-relaxed line-clamp-3">
                        {trainer.bio}
                      </p>

                      <div className="pt-2 text-xs text-neutral-400 flex items-center justify-between">
                        <span>Aktif Antrenman Programı:</span>
                        <strong className="text-white">{trainerCourses.length} Program</strong>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <button
                      onClick={() => setSelectedTrainerId(trainer.id)}
                      className="w-full py-2.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 text-amber-400 hover:text-amber-300 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5"
                    >
                      <span>Eğitmen Profilini & Seanslarını Gör</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. SmartEdu & Enes Öztürk Craftsmanship Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 relative overflow-hidden">
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>PCAT & SmartEdu Standartlarında El Emeği Kodlama</span>
              </div>

              <h2 className="font-display text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide leading-tight">
                FONKSİYONEL, ÇOK SAYFALI VE <br />
                <span className="text-amber-400">ROL BAZLI SPOR YÖNETİMİ</span>
              </h2>

              <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
                Misfit projesinin temel felsefesi; admin, eğitmen ve üye rollerinin kusursuz ilişkilerle birbirine bağlandığı, her antrenörün kendi seanslarını CRUD işlemleriyle yönetebildiği ve üyelerin aldıkları dersleri şeffafça listeleyebildiği bir sistem kurmaktır.
              </p>

              <div className="space-y-2 text-xs text-neutral-300">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Eğitmen Seans Özgürlüğü:</strong> Her koç kendi antrenmanlarını oluşturur ve düzenler.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>Üye Takibi & Sıralama:</strong> Verilen ve alınan seanslar anlık olarak filtrelenir ve sıralanır.</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
                  <span><strong>İletişim & Admin Kutusu:</strong> İletişim sayfasından gelen mesajlar yönetici paneline anında düşer.</span>
                </div>
              </div>

              <div className="pt-4 flex items-center gap-3">
                <button
                  onClick={() => setIsGithubModalOpen(true)}
                  className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-xl uppercase tracking-wider transition-colors flex items-center gap-2 shadow-md shadow-amber-500/20"
                >
                  <Github className="w-4 h-4" />
                  <span>GitHub & Heroku Rehberini Aç</span>
                </button>
              </div>
            </div>

            {/* Visual preview card */}
            <div className="bg-neutral-950 border border-neutral-800 rounded-2xl p-6 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                <div className="text-xs font-bold text-white uppercase tracking-wider">
                  Misfit Mimari Katmanları
                </div>
                <span className="text-[11px] text-amber-400 font-mono">v1.0.0 Stable</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80">
                  <div className="text-white font-semibold flex items-center justify-between">
                    <span>1. Sayfa Rotasyonları</span>
                    <span className="text-emerald-400 font-mono">5 Temel Sayfa</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Home, About, Trainer, Gallery, Contact + Dashboard
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80">
                  <div className="text-white font-semibold flex items-center justify-between">
                    <span>2. Rol Tabanlı Yetkilendirme</span>
                    <span className="text-amber-400 font-mono">Admin · Trainer · Member</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    Kullanıcı kontrolü, antrenör oluşturma ve üye kayıt yetkileri
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-neutral-900 border border-neutral-800/80">
                  <div className="text-white font-semibold flex items-center justify-between">
                    <span>3. Geliştirici & El Emeği</span>
                    <span className="text-amber-400 font-mono">Enes Öztürk</span>
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">
                    GitHub reposuna ve Heroku ortamına birebir aktarılabilir kod tabanı
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Testimonials */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
            Üye Deneyimleri
          </span>
          <h2 className="font-display text-3xl font-bold text-white tracking-wide uppercase">
            SPORCULARIMIZ NE DİYOR?
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              "Burak Hoca'nın CrossFit seansları inanılmaz dinamik. Antrenmana kaç kişi geleceğini önceden panelden görmek ve kontenjan dolmadan yer ayırtmak harika bir kolaylık."
            </p>
            <div className="pt-2 border-t border-neutral-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                CY
              </div>
              <div>
                <div className="text-xs font-bold text-white">Caner Yıldız</div>
                <div className="text-[11px] text-neutral-500">Yazılım Mühendisi · Misfit Üyesi</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              "Selin Hanım ile başladığım reformer pilates seansları bel fıtığı ağrılarımı tamamen unutturdu. Stüdyonun sakinliği ve antrenör kalitesi 10 üzerinden 10."
            </p>
            <div className="pt-2 border-t border-neutral-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                ZA
              </div>
              <div>
                <div className="text-xs font-bold text-white">Zeynep Aydın</div>
                <div className="text-[11px] text-neutral-500">Mimar · Pilates Üyesi</div>
              </div>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <p className="text-xs text-neutral-300 leading-relaxed italic">
              "Deniz Koç'un boks ve HIIT dersleri haftanın tüm stresini alıyor. Misfit'in hem antrenör seviyesi hem de el emeği sistem altyapısı piyasadaki birçok zincir salondan çok daha iyi."
            </p>
            <div className="pt-2 border-t border-neutral-800 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 font-bold flex items-center justify-center text-xs">
                EK
              </div>
              <div>
                <div className="text-xs font-bold text-white">Emre Korkmaz</div>
                <div className="text-[11px] text-neutral-500">Girişimci · Boks Sporcusu</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
