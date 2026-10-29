import React from 'react';
import { BookOpen, CheckCircle, Code2, Database, Github, Layers, Mail, Terminal } from 'lucide-react';

interface AboutViewProps {
  onGoToHomework: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({ onGoToHomework }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <div className="space-y-10">
        {/* Giriş & Profil */}
        <div className="border-b border-stone-200 pb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 rounded-full bg-stone-900 text-amber-400 font-serif font-bold text-3xl flex items-center justify-center border-4 border-amber-400/80 shadow-md shrink-0">
              EÖ
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-3xl font-serif font-bold text-stone-900">
                Enes Öztürk
              </h2>
              <p className="mt-1 text-base text-stone-600 font-light">
                Full-Stack Node.js Geliştiricisi & Clean Blog Proje Sahibi
              </p>
              <p className="mt-3 text-stone-700 text-sm leading-relaxed max-w-2xl font-serif">
                Bu web uygulaması, Node.js ve Express.js eğitimi kapsamında hazırlanan Clean Blog projesinin 4. bölümü olan <strong>Ödev 10: Tekil Post Sayfası (/posts/:id)</strong> geliştirmesini içermektedir.
              </p>
            </div>
          </div>
        </div>

        {/* Proje Hedefleri & Ödev Özeti */}
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">
            Ödev 10 - Gerçekleştirilen İşlemler
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>1. Dinamik Link Yapısı (index.ejs)</span>
              </div>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-mono">
                /posts/&lt;%= posts[i]._id %&gt; ile her postun benzersiz ID'si yönlendirildi.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>2. Express Rota Yakalama (app.js)</span>
              </div>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-mono">
                app.get('/posts/:id') ile req.params.id yakalanıp Post.findById ile sorgulandı.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>3. Şablona Veri İletimi</span>
              </div>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-mono">
                res.render('post', &#123; post &#125;) ile tekil post bilgisi post.ejs'e gönderildi.
              </p>
            </div>

            <div className="p-4 bg-stone-50 border border-stone-200 rounded-lg">
              <div className="flex items-center gap-2 text-stone-900 font-semibold text-sm">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>4. Şablonda Değişken Basımı</span>
              </div>
              <p className="mt-2 text-xs text-stone-600 leading-relaxed font-mono">
                post.title, post.detail, post.dateCreated basıldı, ortak header kullanıldı, Enes Öztürk imzalandı.
              </p>
            </div>
          </div>
        </div>

        {/* Teknoloji Yığını */}
        <div>
          <h3 className="text-xl font-serif font-bold text-stone-900 mb-4">
            Kullanılan Teknolojiler
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <Terminal className="w-6 h-6 mx-auto text-emerald-700 mb-2" />
              <div className="text-xs font-bold text-stone-900">Node.js</div>
              <div className="text-[11px] text-stone-500">Çalışma Ortamı</div>
            </div>
            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <Layers className="w-6 h-6 mx-auto text-stone-800 mb-2" />
              <div className="text-xs font-bold text-stone-900">Express.js</div>
              <div className="text-[11px] text-stone-500">Web Çatısı & Routing</div>
            </div>
            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <Code2 className="w-6 h-6 mx-auto text-amber-600 mb-2" />
              <div className="text-xs font-bold text-stone-900">EJS</div>
              <div className="text-[11px] text-stone-500">Şablon Motoru</div>
            </div>
            <div className="p-4 bg-white border border-stone-200 rounded-lg">
              <Database className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
              <div className="text-xs font-bold text-stone-900">Mongoose / MongoDB</div>
              <div className="text-[11px] text-stone-500">Veri Tabanı & ODM</div>
            </div>
          </div>
        </div>

        {/* Ödev Kodu Çağrısı */}
        <div className="p-6 bg-stone-900 text-stone-100 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h4 className="text-lg font-serif font-bold text-amber-300">
              Ödev Kodlarını ve Şablonları İncelemek İster misiniz?
            </h4>
            <p className="mt-1 text-xs text-stone-300">
              app.js, index.ejs, post.ejs ve Post.js dosyalarının ham kodlarına ve interaktif rota test aracına tek tıkla ulaşın.
            </p>
          </div>
          <button
            onClick={onGoToHomework}
            className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold rounded transition-colors whitespace-nowrap cursor-pointer"
          >
            Ödev 10 Kodlarına Git &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};
