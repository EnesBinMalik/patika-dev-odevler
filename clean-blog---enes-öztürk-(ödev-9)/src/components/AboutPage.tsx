import React from 'react';
import { User, Award, BookOpen, Terminal, CheckCircle2, Heart } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-10 shadow-xs space-y-8">
        {/* Profile Card Header */}
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 pb-8 border-b border-stone-200">
          <div className="w-24 h-24 rounded-2xl bg-stone-900 border-2 border-teal-500 text-teal-300 font-serif text-3xl font-extrabold flex items-center justify-center shrink-0 shadow-sm">
            EÖ
          </div>
          <div className="text-center sm:text-left space-y-2">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2.5">
              <h2 className="font-serif text-3xl font-bold text-stone-900">
                ENES ÖZTÜRK
              </h2>
              <span className="text-xs font-mono uppercase tracking-wider text-teal-800 bg-teal-100 px-2.5 py-0.5 rounded-full border border-teal-200 font-semibold">
                Ödev 9 Sahibi & Geliştirici
              </span>
            </div>
            <p className="text-sm text-stone-600 font-sans max-w-xl">
              Node.js, Express ve MongoDB teknolojilerini kullanarak modern web uygulamaları ve backend sistemleri geliştiren yazılım tutkunu.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="space-y-6 text-stone-700 font-sans leading-relaxed text-base">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-teal-700" />
              Clean Blog Projesi Nedir?
            </h3>
            <p>
              Clean Blog, Start Bootstrap'in efsanevi açık kaynak blog tasarım şablonunun Node.js ve Express ortamına taşınmış dinamik versiyonudur. 
              Patika.dev platformu üzerindeki Node.js kursunun 3. bölümünde verilerin kalıcı hale getirilmesi, NoSQL veri tabanı olan MongoDB entegrasyonu ve MVC mimarisinin temelleri atılmıştır.
            </p>
          </div>

          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900 mb-2 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-teal-700" />
              3. Bölümde Neler Yapıldı? (Ödev 9 Kapsamı)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>cleanblog-test-db Bağlantısı</span>
                </div>
                <p className="text-stone-600">
                  Mongoose kullanılarak yerel MongoDB üzerinde cleanblog-test-db veritabanına bağlantı kodu hazırlandı.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>req.body & Middlewares</span>
                </div>
                <p className="text-stone-600">
                  Add New Post sayfasındaki form verilerini yakalamak için {"express.urlencoded({ extended: true })"} ve express.json() eklendi.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>Post Mongoose Modeli</span>
                </div>
                <p className="text-stone-600">
                  title: String, detail: String ve dateCreated: Date (default: Date.now) özelliklerine sahip şema oluşturuldu.
                </p>
              </div>

              <div className="p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 font-bold text-stone-900">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>3 Adet Post & Enes Öztürk İmzası</span>
                </div>
                <p className="text-stone-600">
                  Veritabanında 3 post dökümanı üretildi ve ana sayfada Enes Öztürk imzasıyla sunuldu.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quote / Footer Banner */}
        <div className="pt-6 border-t border-stone-200 text-center">
          <p className="italic font-serif text-stone-500 text-sm">
            "Öğrenmek durmaksızın devam eden bir yolculuktur. Clean Blog projemizin 3. bölümü bu yolculuğun en heyecan verici adımlarından biri oldu."
          </p>
          <span className="block mt-2 font-bold text-stone-800 text-xs font-mono uppercase tracking-wider">
            — ENES ÖZTÜRK
          </span>
        </div>
      </div>
    </div>
  );
};
