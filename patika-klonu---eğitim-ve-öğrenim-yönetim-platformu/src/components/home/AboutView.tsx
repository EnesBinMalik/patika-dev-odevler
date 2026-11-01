import React from 'react';
import { Shield, Sparkles, Code2, CheckCircle2, UserCheck, Terminal, Heart } from 'lucide-react';

export const AboutView: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-semibold text-amber-400">
          <Sparkles className="w-3.5 h-3.5" />
          ENES ÖZTÜRK İmzalı · El Emeği Geliştirme
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Patika Klonu Eğitim & Öğrenim Yönetim Platformu
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
          Bu proje, Türkiye'nin önde gelen yazılım eğitim platformlarından <strong>Patika.dev</strong> mimarisini ve eğitim metodolojisini birebir modelleyerek; rol bazlı yetkilendirme (Öğrenci, Eğitmen, Operatör), ders & içerik yönetimi, çoktan seçmeli quiz sistemi ve öğrenci yorum mekanizmasını eksiksiz sunmak amacıyla tasarlanmıştır.
        </p>

        {/* Handcrafted signature badge */}
        <div className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-400 shrink-0">
            <Terminal className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-white">Geliştirici İmzası: ENES ÖZTÜRK</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              Yazılımcı olarak sistemin operatör hesabı doğrudan Enes Öztürk adına tanımlanmış olup tam yetkiyle donatılmıştır.
            </p>
          </div>
        </div>
      </div>

      {/* Specification Rules breakdown */}
      <div className="space-y-6">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Gereksinimler ve Uygulanan Mimari
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-sky-400 font-semibold text-sm">
              <Code2 className="w-4 h-4" />
              Eğitmen Paneli Kuralları
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Yalnızca Operatörlerin kendilerine atadığı eğitimleri görebilir ve listeleyebilirler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Eğitimleri düzenleme veya silme yetkileri kesinlikle bulunmaz.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Başka eğitmenlere ait eğitimleri ve içerikleri göremezler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Eğitimlere içerik ekleyebilir, kendilerine ait içerikleri düzenleyip silebilirler (Java 102 örneği).</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>İçerik özellikleri: Başlık, Açıklama, YouTube Linki, Quiz Soruları, Ders Bilgisi.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Quiz sorularını eklerken hangi içeriğe ait olduğunu seçerler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>İçerik listeleme ekranında derslere ve başlığa göre filtreleme yapabilirler.</span>
              </li>
            </ul>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold text-sm">
              <UserCheck className="w-4 h-4" />
              Öğrenci Paneli Kuralları
            </div>
            <ul className="space-y-2.5 text-xs text-slate-300">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Patikalar üzerinden derslere erişir ve listelerler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Patikalar üzerinden derslere tek tıkla kayıt olabilirler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Kayıt oldukları derslerin içeriklerine ve YouTube eğitim linkine ulaşabilirler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Ders içeriklerini 1-5 yıldızla puanlayabilir ve yorum yazabilirler.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Derslere ait çoktan seçmeli quizleri çözüp anında puan ve açıklamaları görebilirler.</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-sm">
            <Shield className="w-4 h-4" />
            Operatör & Yetkilendirme Kuralları
          </div>
          <ul className="space-y-2.5 text-xs text-slate-300">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Operatörler:</strong> Sistemdeki tüm patikaları, eğitimleri, içerikleri ve quizleri düzenleme ve silme yetkisine sahiptir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Kayıt Ekranı Kuralı:</strong> Giriş ve Kayıt ekranında sadece <u>Öğrenciler</u> doğrudan kayıt yapabilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Eğitmen Ekleme:</strong> Eğitmenleri <u>sadece Operatörler</u> ekleyebilir.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span><strong>Operatör Ekleme:</strong> Operatörleri yazılımcı (yani geliştirici Enes Öztürk) tanımlar.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
