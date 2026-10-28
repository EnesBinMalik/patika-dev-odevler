import React from 'react';
import { useApp } from '../context/AppContext';
import { ShieldCheck, Dumbbell, Target, HeartHandshake, Award, Github, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  const { setActivePage, setIsGithubModalOpen } = useApp();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-20">
      {/* 1. Header Hero */}
      <div className="max-w-3xl mx-auto text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          <Award className="w-3.5 h-3.5" />
          <span>Misfit Felsefesi · Enes Öztürk İmzasıyla</span>
        </div>

        <h1 className="font-display text-4xl sm:text-5xl font-bold text-white tracking-wide uppercase">
          SIRADANLIĞI REDDEDENLERİN <br />
          <span className="text-amber-400">ANTRENMAN KULÜBÜ</span>
        </h1>

        <p className="text-sm sm:text-base text-neutral-300 leading-relaxed font-normal">
          Misfit, geleneksel kalabalık spor salonu anlayışını yıkarak antrenör ve sporcu arasındaki bağı güçlendiren, SmartEdu eğitim mimarisinden ilham almış butik bir performans platformudur.
        </p>
      </div>

      {/* 2. Visual Storytelling Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="relative rounded-3xl overflow-hidden border border-neutral-800 shadow-2xl">
          <img
            src="/assets/images/gallery_gym_community_1793202972765.jpg"
            alt="Misfit Community Training"
            className="w-full h-[420px] object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent" />
          <div className="absolute bottom-6 left-6 right-6">
            <span className="text-xs text-amber-400 font-semibold uppercase">Topluluk & Dayanışma</span>
            <p className="text-sm text-white font-medium mt-1">
              "Birlikte ter döken sporcular asla pes etmez."
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Vizyon & Yaklaşım</span>
            <h2 className="font-display text-3xl font-bold text-white uppercase tracking-wide">
              SMARTEDU VE PCAT DİSİPLİNİYLE YÜKSELEN MİMARİ
            </h2>
          </div>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            SmartEdu projesindeki eğitmen-kurs yapısı Misfit projesinde antrenör ve antrenman seanslarına uyarlandı. Sistemdeki her eğitmen bağımsız olarak kendi seanslarını planlayabilir, kontenjanını belirleyebilir ve üyelerinin ilerleyişini birebir takip edebilir.
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">Eğitmen Odaklı Antrenman Mimarisi:</strong>
                <span className="text-neutral-400 text-xs">Her antrenör kendi uzmanlık seanslarını üretir, günceller veya gerektiğinde yayından kaldırır.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">Şeffaf Üye Katılımı:</strong>
                <span className="text-neutral-400 text-xs">Üyeler aldıkları antrenmanları profillerinde tek bir ekranda sıralayabilir ve yönetebilir.</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong className="text-white text-xs block">İletişim ve Geri Bildirim Entegrasyonu:</strong>
                <span className="text-neutral-400 text-xs">Web sitesinden iletilen her mesaj anında yönetici gelen kutusuna düşer.</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Core Pillars / Pillars of Excellence */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto">
          <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">Standartlarımız</span>
          <h3 className="font-display text-3xl font-bold text-white uppercase tracking-wide mt-1">
            MİSFİT'İ FARKLI KILAN ÜÇ TEMEL İLKE
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Target className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">
              01. Butik ve Odaklı Seanslar
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Asla 14 kişiyi aşmayan grup seansları sayesinde eğitmen her sporcunun formunu, duruşunu ve ağırlık güvenliğini tek tek kontrol eder.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Dumbbell className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">
              02. Dünya Standartlarında Ekipman
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Eleiko olimpik halter setleri, Concept2 kürek ve bisiklet ergometreleri, el yapımı reformer yatakları ve profesyonel boks ringi.
            </p>
          </div>

          <div className="p-8 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-display text-xl font-bold text-white uppercase">
              03. Topluluk ve Motivasyon
            </h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Yargısız, enerjik ve birbirini yücelten bir sporcu topluluğu. İlk günden itibaren bir takımın parçası gibi hissedeceksiniz.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Craftsmanship Note from Enes Öztürk */}
      <div className="p-8 sm:p-10 rounded-3xl bg-neutral-900 border border-amber-500/30 flex flex-col sm:flex-row items-center gap-8 shadow-2xl">
        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden shrink-0 border-2 border-amber-500/40">
          <img
            src="/assets/images/trainer_burak_crossfit_1793202971371.jpg"
            alt="Enes Öztürk"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="space-y-3 flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2">
            <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
              Geliştirici İmzası & Taahhüt
            </span>
          </div>

          <h3 className="font-display text-2xl font-bold text-white uppercase tracking-wide">
            ENES ÖZTÜRK İMZASIYLA · %100 EL EMEĞİ
          </h3>

          <p className="text-xs sm:text-sm text-neutral-300 leading-relaxed">
            "Bu proje, web geliştirme tutkum ile spor disiplinini bir araya getiren bir el emeği çalışmasıdır. SmartEdu ve PCAT projelerinde öğrendiğim çok katmanlı mimari, kullanıcı yetkilendirme ve veri ilişkilerini modern bir arayüzle harmanlayarak Misfit'e hayat verdim. Kodları dilediğiniz gibi GitHub'a aktarabilir ve Heroku'da yayına alabilirsiniz."
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
            <button
              onClick={() => setIsGithubModalOpen(true)}
              className="px-4 py-2 bg-neutral-950 hover:bg-neutral-800 border border-neutral-700 text-amber-400 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <Github className="w-4 h-4" />
              <span>GitHub & Heroku Rehberini Görüntüle</span>
            </button>
            <button
              onClick={() => setActivePage('contact')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors"
            >
              Bizimle İletişime Geçin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
