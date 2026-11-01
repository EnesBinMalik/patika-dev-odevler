import React from 'react';
import {
  Compass,
  ArrowRight,
  Code2,
  BookOpen,
  Sparkles,
  School,
  GraduationCap,
  Shield,
  Clock,
  Play,
  CheckCircle2,
  Terminal,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

interface ExploreViewProps {
  onSelectPath: (patikaId: string) => void;
  onOpenAuth: () => void;
  setActiveView: (view: string) => void;
}

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectPath,
  onOpenAuth,
  setActiveView,
}) => {
  const { patikalar, courses, currentUser, users, loginAsUser } = useApp();

  return (
    <div className="space-y-16 animate-in fade-in duration-300">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 lg:p-16">
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            ENES ÖZTÜRK İmzalı · Patika.dev Klonu
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-[1.15]">
            Yazılım Kariyerine <span className="text-amber-500">Patikalar</span> ile Adım At
          </h1>

          <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
            Sektör standartlarında hazırlanmış kariyer patikaları, uzman eğitmenlerin hazırladığı video dersler (Java 102, React 19, Spring Boot), çoktan seçmeli quizler ve rol bazlı arayüzler.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            {currentUser?.role === 'student' ? (
              <button
                onClick={() => setActiveView('student_panel')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <GraduationCap className="w-4 h-4" />
                Öğrenci Panelime Git
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentUser?.role === 'instructor' ? (
              <button
                onClick={() => setActiveView('instructor_panel')}
                className="px-6 py-3 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <School className="w-4 h-4" />
                Eğitmen Panelime Git
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : currentUser?.role === 'operator' ? (
              <button
                onClick={() => setActiveView('operator_panel')}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                <Shield className="w-4 h-4" />
                Operatör Konsoluna Git
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenAuth}
                className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs sm:text-sm rounded-xl transition-all shadow-lg flex items-center gap-2"
              >
                Giriş Yap / Ücretsiz Kaydol
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              onClick={() => setActiveView('about')}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm rounded-xl transition-all"
            >
              Mimar & İmzalı Detaylar
            </button>
          </div>

          {/* Quick Role Tester Strip */}
          <div className="pt-6 border-t border-slate-800/80">
            <span className="text-[11px] font-semibold text-slate-400 block mb-2">
              Hızlı Rol Değiştirici (Tıklayarak Anında Test Edin):
            </span>
            <div className="flex flex-wrap items-center gap-2">
              {users.map((u) => {
                const isSelected = currentUser?.id === u.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => {
                      loginAsUser(u.id);
                      if (u.role === 'operator') setActiveView('operator_panel');
                      else if (u.role === 'instructor') setActiveView('instructor_panel');
                      else setActiveView('student_panel');
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs transition-colors border ${
                      isSelected
                        ? 'bg-amber-500/20 border-amber-500 text-amber-300 font-semibold'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <span>{u.name}</span>
                    <span className="text-[10px] opacity-70">
                      ({u.role === 'operator' ? 'Operatör' : u.role === 'instructor' ? 'Eğitmen' : 'Öğrenci'})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* SPOTLIGHT: JAVA 102 EĞİTİMİ (SPEC REQUIREMENT) */}
      <section className="bg-gradient-to-r from-amber-950/20 via-slate-900 to-slate-900 border border-amber-500/30 rounded-3xl p-8 sm:p-10 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <Code2 className="w-4 h-4" />
              Patika.dev Referans Eğitimi
            </div>
            <h3 className="text-2xl font-bold text-white tracking-tight">
              Java 102 - Nesne Yönelimli Programlama (OOP)
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Kullanıcı yönergesinde özellikle belirtilen Java 102 eğitimi: Sınıflar, Nesneler, Kalıtım, Polimorfizm, Interface ve İstisna Yönetimi dersleri ile quiz soruları sisteme eksiksiz dahil edilmiştir.
            </p>
          </div>

          <button
            onClick={() => {
              loginAsUser('user_stud_ahmet');
              setActiveView('student_panel');
            }}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors whitespace-nowrap self-start md:self-center shadow-md flex items-center gap-2"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            Java 102 Dersi ve Quizlerini İncele
          </button>
        </div>

        {/* Java 102 Contents preview */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {[
            { num: '01', title: 'Sınıflar & Nesne Mantığı', q: '2 Quiz Sorusu' },
            { num: '02', title: 'Kapsülleme & Belirteçler', q: 'Quizli' },
            { num: '03', title: 'Kalıtım & Polimorfizm', q: '2 Quiz Sorusu' },
            { num: '04', title: 'Abstract & Interface', q: '1 Quiz Sorusu' },
            { num: '05', title: 'Exception Handling', q: 'Quizli' },
          ].map((item) => (
            <div
              key={item.num}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1 text-xs"
            >
              <span className="font-mono text-amber-400 text-[11px] font-bold">{item.num}</span>
              <p className="font-semibold text-slate-200 line-clamp-1">{item.title}</p>
              <span className="text-[10px] text-sky-400 block font-mono">{item.q}</span>
            </div>
          ))}
        </div>
      </section>

      {/* PATİKALAR GRID */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold text-white tracking-tight">Tüm Kariyer Patikaları</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              İlgilendiğiniz alandaki patikayı seçip altındaki eğitimlere kaydolabilirsiniz.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {patikalar.map((patika) => {
            const pCourses = courses.filter((c) => patika.courseIds.includes(c.id));

            return (
              <div
                key={patika.id}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all space-y-5 shadow-lg group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {patika.level} Seviye
                    </span>
                    <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
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

                  <div className="space-y-1.5 pt-2 border-t border-slate-800">
                    <span className="text-xs font-semibold text-slate-300 block">
                      Eğitimler ({pCourses.length}):
                    </span>
                    {pCourses.map((crs) => (
                      <div
                        key={crs.id}
                        className="p-2 rounded-lg bg-slate-950 border border-slate-800/80 text-xs text-slate-300 flex items-center justify-between"
                      >
                        <span className="truncate pr-2 font-medium">{crs.title}</span>
                        <span className="text-[10px] font-mono text-slate-400 shrink-0">
                          {crs.duration}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    loginAsUser('user_stud_ahmet');
                    setActiveView('student_panel');
                  }}
                  className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Compass className="w-3.5 h-3.5" />
                  Patikaya Katıl & Dersleri Aç
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* ARCHITECTURE & SIGNATURE BANNER */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-8 space-y-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
          <Terminal className="w-4 h-4" />
          Proje Mimarisi & Geliştirici İmzası
        </div>
        <h3 className="text-xl font-bold text-white">
          ENES ÖZTÜRK İmzalı El Emeği Geliştirme
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
          Bu proje Patika.dev'in tüm operasyonel dinamiklerini barındırır:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
              <School className="w-4 h-4" />
              Eğitmen Paneli
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yalnızca operatörlerin atadığı dersleri görür. Eğitimleri silemez veya değiştiremez. Ders içerikleri, YouTube linkleri ve quiz soruları ekler ve filtreler.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" />
              Öğrenci Paneli
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Patikaları inceler, derslere kaydolur, video dersleri doğrudan YouTube linkiyle veya oynatıcıda görüntüler, quizleri çözer, yıldız puanı ve yorum yazar.
            </p>
          </div>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
            <h5 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
              <Shield className="w-4 h-4" />
              Operatör Paneli
            </h5>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistemdeki tüm patikaları, eğitimleri, içerikleri ve soruları yönetir. Yeni eğitmenleri sisteme sadece operatör ekleyebilir ve derslere atar.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
