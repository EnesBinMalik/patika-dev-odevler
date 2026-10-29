import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Terminal, Zap, BookOpen, Layers } from 'lucide-react';

export const GuideView: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Intro Header */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs">
        <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-2">
          Eğitim & Mantık Rehberi
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">
          Post Sıralama ve Post Ekleme Mantığı (Node.js & JavaScript)
        </h2>
        <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
          Bu uygulama, Node.js ve modern JavaScript'te en sık karşılaşılan asenkron veri akışını
          örnekler: Önce mevcut veri tabanındaki ya da hafızadaki postları konsola sıralar, ardından
          asenkron (gecikmeli) bir ekleme işlemi simüle eder ve yeni veri geldikten sonra listeyi
          güncel haliyle konsola tekrar sıralar.
        </p>

        <div className="mt-6 pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span>Geliştirici & Yazar: <strong className="text-slate-800">Enes Öztürk</strong></span>
          <span>Hedef: Node.js Asenkron Süreç Yönetimi</span>
        </div>
      </div>

      {/* 3 Steps breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
            01
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            1. Mevcut Postları Sıralama
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed flex-1">
            <code className="text-indigo-600 font-mono">listPosts()</code> fonksiyonu mevcut
            dizideki (<code className="text-slate-800 font-mono">posts</code>) tüm elemanları gezer
            ve başlık, yazar ve tarih bilgileriyle konsola düzenli bir şekilde yazdırır.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
            02
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            2. Asenkron Post Ekleme
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed flex-1">
            <code className="text-indigo-600 font-mono">addPost(newPost)</code> fonksiyonu bir
            Promise döner. Gerçek dünyada veritabanına ya da API'ye yazma işlemi zaman alacağından
            (simüle edilmiş gecikme), işlem bitmeden sonraki adıma geçilmemelidir.
          </p>
        </div>

        <div className="bg-white rounded-xl p-6 border border-slate-200/80 shadow-xs flex flex-col">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center text-sm mb-4">
            03
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-2">
            3. Güncel Listeyi Tekrar Sıralama
          </h3>
          <p className="text-xs text-slate-600 leading-relaxed flex-1">
            <code className="text-indigo-600 font-mono">await</code> anahtar kelimesi ile ekleme
            işleminin tamamlandığı garanti altına alınır. Hemen ardından <code className="text-indigo-600 font-mono">listPosts()</code>
            tekrar çağrılarak yeni eklenen postla birlikte liste konsola yeniden basılır.
          </p>
        </div>
      </div>

      {/* Comparison: Async/Await vs Promise */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-slate-900">
          Neden Async / Await veya Promise Kullanırız?
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs sm:text-sm">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80 space-y-2">
            <div className="font-bold text-slate-900 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
              <span>Senkron Yanılgısı (Neden Çalışmaz?)</span>
            </div>
            <p className="text-slate-600 leading-relaxed text-xs">
              Eğer <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded">addPost()</code> fonksiyonunu asenkron olarak beklemeden doğrudan <code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded">listPosts()</code> çağırırsanız, JavaScript sıralamayı yeni post daha diziye eklenmeden önce yapacaktır. Bu yüzden yeni post listede görünmez!
            </p>
          </div>

          <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100 space-y-2">
            <div className="font-bold text-emerald-950 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              <span>Çözüm: await ile Sıralı Yürütme</span>
            </div>
            <p className="text-emerald-900/80 leading-relaxed text-xs">
              <code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded text-emerald-950">await addPost(yeniPost)</code> diyerek JavaScript'e: "Yeni post ekleme işlemi bitene kadar bir alt satıra geçme" talimatı vermiş oluruz. İşlem bittiğinde çağrılan <code className="font-mono bg-emerald-100/70 px-1 py-0.5 rounded text-emerald-950">listPosts()</code> yeni postu da kapsayarak listeyi eksiksiz ekrana basar.
            </p>
          </div>
        </div>

        {/* Signature Box */}
        <div className="p-4 rounded-xl bg-slate-900 text-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div>
            <div className="font-semibold text-white">Hazırlayan & Geliştiren</div>
            <div className="text-slate-400">Enes Öztürk — Node.js & JavaScript Blog Engine</div>
          </div>
          <div className="text-indigo-300 font-mono text-[11px]">
            Konsol çıktısı & F12 Console desteklidir
          </div>
        </div>
      </div>
    </div>
  );
};
