import React from 'react';
import { Sparkles, Code2, Server, Database, Globe, CheckCircle2 } from 'lucide-react';

interface AboutViewProps {
  avatarUrl: string;
}

export const AboutView: React.FC<AboutViewProps> = ({ avatarUrl }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 font-sans">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 mb-12 pb-10 border-b border-slate-200">
        <div className="relative shrink-0">
          <img
            src={avatarUrl}
            alt="Enes Öztürk"
            referrerPolicy="no-referrer"
            className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-md border-4 border-white"
          />
          <div className="absolute -bottom-2 -right-2 bg-slate-900 text-white p-2 rounded-lg shadow-xs">
            <Code2 className="w-5 h-5 text-emerald-400" />
          </div>
        </div>

        <div className="flex-1 text-center md:text-left">
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-2">
            Geliştirici & Yazar
          </div>
          <h1 className="font-serif-heading text-3xl sm:text-4xl font-bold text-slate-900 mb-3">
            Enes Öztürk
          </h1>
          <p className="text-base sm:text-lg text-slate-600 font-light leading-relaxed mb-4">
            Node.js ve modern web teknolojileri üzerine geliştirmeler yapan bir yazılımcıyım. Clean Blog serimizin 6. bölümünde bu projeyi Heroku ve MongoDB Atlas ücretsiz servisleri üzerinden başarıyla yayına aldım.
          </p>

          <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-slate-500">
            <span className="font-semibold text-slate-700">Ödev 12: Clean Blog Bölüm 6</span>
            <span aria-hidden="true">·</span>
            <span>Node.js / Express</span>
            <span aria-hidden="true">·</span>
            <span>MongoDB Atlas</span>
            <span aria-hidden="true">·</span>
            <span>Heroku Deployment</span>
          </div>
        </div>
      </div>

      {/* Course Roadmap Sections */}
      <div className="mb-12">
        <h2 className="font-serif-heading text-2xl font-bold text-slate-900 mb-6">
          Clean Blog Projesi Gelişim Aşamaları
        </h2>

        <div className="space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              1
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bölüm 1: Node.js & Express Sunucu Temelleri</h3>
              <p className="text-sm text-slate-600 mt-1">
                Express framework'ü ile ilk HTTP sunucumuzu kurduk, statik dosya sunumunu (public) ve temel middleware yapısını yapılandırdık.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              2
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bölüm 2: Start Bootstrap Clean Blog & EJS Şablon Motoru</h3>
              <p className="text-sm text-slate-600 mt-1">
                Clean Blog temasını EJS şablon motoruna entegre ettik. Navigation, Header ve Footer partials yapılarıyla kod tekrarını önledik.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              3
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bölüm 3: MongoDB ve Mongoose ile Veritabanı Modelleme</h3>
              <p className="text-sm text-slate-600 mt-1">
                Post şemasını oluşturduk: title, detail, author ve dateCreated alanlarıyla NoSQL döküman modelini oluşturduk.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              4
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bölüm 4: MVC Mimarisi (Model-View-Controller)</h3>
              <p className="text-sm text-slate-600 mt-1">
                Kod karmaşasını bitirip postController ve pageController dosyalarını oluşturarak profesyonel mimariye geçtik.
              </p>
            </div>
          </div>

          <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 font-bold flex items-center justify-center shrink-0 text-sm">
              5
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-base">Bölüm 5: Tam CRUD ve Method-Override</h3>
              <p className="text-sm text-slate-600 mt-1">
                Yazı ekleme, detay görüntüleme, güncelleme (PUT) ve silme (DELETE) operasyonlarını RESTful standartlarda tamamladık.
              </p>
            </div>
          </div>

          <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-lg flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-bold flex items-center justify-center shrink-0 text-sm">
              6
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-base">Bölüm 6 (Ödev 12): Heroku ve MongoDB Atlas Dağıtımı</h3>
                <span className="text-xs text-emerald-700 font-semibold bg-emerald-100 px-2 py-0.5 rounded">Tamamlandı</span>
              </div>
              <p className="text-sm text-slate-700 mt-1">
                Uygulama yerel makineden buluta taşındı. MongoDB Atlas M0 Sandbox kümesi açıldı, Heroku Procfile tanımlandı ve dinamik PORT ayarlandı.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Official Project Note Box */}
      <div className="bg-slate-900 text-slate-100 rounded-xl p-6 sm:p-8 mb-12">
        <h3 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <span>Ödev 12 Resmi Taahhüt ve Not</span>
        </h3>
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed italic font-serif mb-4">
          "Uygulamamızda sayfalama ve görsel yükleme işlemlerini yapmadık. Sonraki projemizde de bu özellikleri kullanacağız."
        </p>
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 font-sans">
          <span>İmzalayan: <strong className="text-white">Enes Öztürk</strong></span>
          <span>Clean Blog Projesi · Bölüm 6</span>
        </div>
      </div>
    </div>
  );
};
