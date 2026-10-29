import React from 'react';
import { User, Code2, Server, Database, Layers, CheckCircle2, ArrowRight, Github, Mail } from 'lucide-react';

interface AboutViewProps {
  onGoToCode: () => void;
  onOpenChecklist: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onGoToCode,
  onOpenChecklist
}) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Masthead Header */}
      <header
        className="relative py-24 md:py-32 bg-cover bg-center text-white"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80')`
        }}
      >
        <div className="absolute inset-0 bg-[#212529]/80 backdrop-blur-[2px]"></div>
        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-emerald-600 border-4 border-white/30 flex items-center justify-center font-serif font-bold text-3xl mx-auto mb-4 shadow-lg">
            EÖ
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-extrabold tracking-tight mb-3">
            Hakkımda
          </h1>
          <p className="text-lg font-light text-gray-200">
            Enes Öztürk &bull; Node.js & Full-Stack Web Geliştirici
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Left Column: Bio */}
          <div className="md:col-span-2 space-y-6 text-gray-700 leading-relaxed font-sans">
            <h2 className="text-2xl font-serif font-bold text-[#212529]">
              Merhaba, Ben Enes Öztürk! 👋
            </h2>

            <p>
              Patika.dev / Kodluyoruz Node.js eğitim serüveninde Clean Blog projesinin 5. bölümü olan <strong>Ödev 11</strong>'i başarıyla tamamladım. Bu aşamada blog uygulamamızın tam fonksiyonel bir MVC yapısına kavuşmasını ve RESTful prensiplere uygun olarak <strong>UPDATE</strong> ve <strong>DELETE</strong> mekanizmalarının entegre edilmesini sağladık.
            </p>

            <h3 className="text-lg font-serif font-bold text-gray-900 pt-2">
              Clean Blog 5. Bölümde Neler Yaptık?
            </h3>

            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  1
                </div>
                <div className="text-sm">
                  <strong className="text-gray-900">post.ejs'e UPDATE ve DELETE Butonları:</strong>
                  <p className="text-gray-600 mt-0.5">
                    Kullanıcı bir yazının detayını incelerken tek tıkla düzenleme sayfasına (<code className="font-mono text-emerald-700">/posts/edit/:id</code>) gidebilir veya onay penceresiyle silme isteği gönderebilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  2
                </div>
                <div className="text-sm">
                  <strong className="text-gray-900">Post Güncelleme (UPDATE):</strong>
                  <p className="text-gray-600 mt-0.5">
                    <code className="font-mono text-emerald-700">edit.ejs</code> şablonunda mevcut veriler form kontrollerine doldurulur. Form submit edildiğinde <code className="font-mono text-emerald-700">_method=PUT</code> ile <code className="font-mono text-emerald-700">postController.updatePost</code> metodu çağrılır ve MongoDB güncellenir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  3
                </div>
                <div className="text-sm">
                  <strong className="text-gray-900">Post Silme (DELETE):</strong>
                  <p className="text-gray-600 mt-0.5">
                    <code className="font-mono text-emerald-700">method-override</code> ara yazılımı sayesinde gelen DELETE isteği yakalanır, <code className="font-mono text-emerald-700">Post.findByIdAndDelete</code> ile silinir ve kullanıcı anasayfaya yönlendirilir.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                <div className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                  4
                </div>
                <div className="text-sm">
                  <strong className="text-gray-900">MVC Mimarisine Göre Yeniden Düzenleme:</strong>
                  <p className="text-gray-600 mt-0.5">
                    Tüm kodlar <code className="font-mono text-emerald-700">controllers/</code>, <code className="font-mono text-emerald-700">models/</code>, <code className="font-mono text-emerald-700">views/</code> ve <code className="font-mono text-emerald-700">app.js</code> şeklinde temiz ve modüler bir mimariye kavuşturuldu.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 flex gap-3">
              <button
                onClick={onGoToCode}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-sm transition-colors"
              >
                <Code2 className="w-4 h-4" />
                MVC Dosyalarını İncele
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={onOpenChecklist}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-bold rounded-lg transition-colors"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Ödev Kontrol Listesi
              </button>
            </div>
          </div>

          {/* Right Column: Profile Card */}
          <div className="space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-4 pb-2 border-b border-gray-200">
                Geliştirici Künyesi
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-gray-400 block">Ad Soyad</span>
                  <span className="font-bold text-gray-800 text-sm">Enes Öztürk</span>
                </div>

                <div>
                  <span className="text-gray-400 block">Kurs / Platform</span>
                  <span className="font-medium text-gray-800">Patika.dev / Kodluyoruz Node.js</span>
                </div>

                <div>
                  <span className="text-gray-400 block">Ödev Numarası</span>
                  <span className="inline-block bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                    Ödev 11 (Clean Blog 5. Bölüm)
                  </span>
                </div>

                <div>
                  <span className="text-gray-400 block">E-posta</span>
                  <a href="mailto:enesbino38@gmail.com" className="text-emerald-700 hover:underline">
                    enesbino38@gmail.com
                  </a>
                </div>

                <div>
                  <span className="text-gray-400 block">GitHub</span>
                  <a href="https://github.com/enesbino38" target="_blank" rel="noreferrer" className="text-emerald-700 hover:underline flex items-center gap-1">
                    <Github className="w-3 h-3" /> github.com/enesbino38
                  </a>
                </div>
              </div>
            </div>

            {/* Tech Stack */}
            <div className="bg-gray-50 rounded-xl p-6 border border-gray-200 shadow-xs">
              <h3 className="font-serif font-bold text-lg text-gray-900 mb-3 pb-2 border-b border-gray-200">
                Kullanılan Teknolojiler
              </h3>

              <div className="flex flex-wrap gap-1.5 text-xs">
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium">Node.js</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium">Express.js</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium">EJS Template</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium">MongoDB</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-gray-700 font-medium">Mongoose ODM</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-emerald-800 bg-emerald-50 border-emerald-300 font-bold">method-override</span>
                <span className="px-2.5 py-1 bg-white border border-gray-200 rounded text-emerald-800 bg-emerald-50 border-emerald-300 font-bold">MVC Pattern</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
