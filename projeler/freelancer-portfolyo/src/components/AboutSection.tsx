import React, { useState } from 'react';
import { StarDivider } from './StarDivider';
import { Download, CheckCircle, Code, Layers, Server, Terminal, X, FileText } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const [showCvModal, setShowCvModal] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  // Generates and downloads a real formatted CV file for Enes Öztürk
  const handleDownloadCv = () => {
    const cvContent = `================================================================
ENES ÖZTÜRK - FULL STACK WEB GELİŞTİRİCİ
E-posta: enesbino38@gmail.com | Konum: Türkiye
GitHub: https://github.com/enesozturk | Portföy: Freelancer Proje
================================================================

ÖZET:
Modern JavaScript ekosistemi, Node.js, Express.js ve React mimarilerinde 
uçtan uca dinamik web uygulamaları geliştiren Full Stack Web Geliştirici.
PCAT (Fotoğraf Kataloğu CRUD) ve SmartEdu (LMS & Nodemailer) projeleriyle 
pekiştirilen sunucu taraflı mimariyi, dinamik Freelancer portföyü ile 
bulut üzerinde yayına almaktadır.

TEMEL YETKİNLİKLER:
- Ön Yüz: React, TypeScript, Tailwind CSS, Bootstrap 5, HTML5/CSS3, EJS
- Arka Yüz: Node.js, Express.js, RESTful API, MVC Mimarisi, JWT Auth, Bcrypt
- Veri Tabanı & Dosya: MongoDB, Mongoose, Multer, Express-FileUpload
- Araçlar & Dağıtım: Git, GitHub, Heroku, Docker, Vite, Nodemailer

ÖNE ÇIKAN PROJELER:
1. Freelancer Dinamik Portföy Projesi:
   - StartBootstrap Freelancer temasının dinamik React/Node.js sürümü
   - Proje ekleme (ADD), düzenleme (EDIT), silme (DELETE) işlemleri
   - SmartEdu tarzı dinamik iletişim formu ve gelen kutusu yönetimi

2. PCAT Fotoğraf Kataloğu:
   - Node.js & Express tabanlı fotoğraf yükleme ve katalog CRUD sistemi
   - Multer ile dosya depolama ve EJS şablon motoru

3. SmartEdu Kurs Platformu:
   - Rol tabanlı yetkilendirme (Öğrenci / Öğretmen / Yönetici)
   - Nodemailer ile gerçek zamanlı SMTP e-posta gönderimi

EĞİTİM & SERTİFİKALAR:
- Modern Web Geliştirme (Node.js, Express, React, MongoDB)
- PCAT & SmartEdu Tamamlama Sertifikaları

Tarih: Ekim 2026
İmza: Enes Öztürk
================================================================`;

    const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Enes_Ozturk_CV.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 4000);
  };

  return (
    <section id="about" className="bg-[#1abc9c] text-white py-20 sm:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight font-heading">
            HAKKIMDA (ABOUT)
          </h2>
          <StarDivider theme="light" />
        </div>

        {/* 2-Column Classic Freelancer Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-base sm:text-lg leading-relaxed text-white/95 mb-12">
          <div className="space-y-4">
            <p>
              Merhaba, ben <strong>Enes Öztürk</strong>. Modern web geliştirme dünyasında kullanıcı deneyimini ve sunucu performansını ön planda tutan, dinamik ve ölçeklenebilir projeler üretiyorum.
            </p>
            <p className="text-sm sm:text-base text-white/90">
              Web geliştirme yolculuğumda <strong>PCAT</strong> (Photo Catalog) projesiyle fotoğraf yükleme, CRUD operasyonları ve dosya akışını; <strong>SmartEdu</strong> projesiyle de rol bazlı kullanıcı yetkilendirmesi ve Nodemailer e-posta sistemlerini hayata geçirdim.
            </p>
          </div>

          <div className="space-y-4">
            <p>
              Bu <strong>Freelancer</strong> projesinde, klasik StartBootstrap şablonunu dinamik hale getirerek kendi çalışmalarımızı ekleyebildiğimiz, düzenleyebildiğimiz ve modal yapısıyla detaylandırabildiğimiz interaktif bir portföy ortaya koyduk.
            </p>
            <p className="text-sm sm:text-base text-white/90">
              Uygulamayı GitHub deponuza yükleyip Heroku veya bulut sunucularda kolayca yayına alabilir, iletişim formundan gelen teklifleri anlık olarak yönetebilirsiniz.
            </p>
          </div>
        </div>

        {/* Key Competencies Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-xs text-center border border-white/20">
            <Code className="w-6 h-6 mx-auto mb-2 text-white" />
            <h4 className="font-bold text-sm">Ön Yüz</h4>
            <p className="text-xs text-white/80 mt-1">React, TS, Tailwind</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-xs text-center border border-white/20">
            <Server className="w-6 h-6 mx-auto mb-2 text-white" />
            <h4 className="font-bold text-sm">Arka Yüz</h4>
            <p className="text-xs text-white/80 mt-1">Node.js, Express, REST</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-xs text-center border border-white/20">
            <Layers className="w-6 h-6 mx-auto mb-2 text-white" />
            <h4 className="font-bold text-sm">Veri & Depo</h4>
            <p className="text-xs text-white/80 mt-1">MongoDB, Multer, EJS</p>
          </div>
          <div className="p-4 bg-white/10 rounded-xl backdrop-blur-xs text-center border border-white/20">
            <Terminal className="w-6 h-6 mx-auto mb-2 text-white" />
            <h4 className="font-bold text-sm">Dağıtım</h4>
            <p className="text-xs text-white/80 mt-1">Git, GitHub, Heroku</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-center">
          <button
            onClick={handleDownloadCv}
            className="px-8 py-3.5 bg-transparent hover:bg-white text-white hover:text-[#2c3e50] border-2 border-white font-bold rounded-lg transition-all shadow-md flex items-center gap-2 text-sm uppercase tracking-wider active:scale-95"
          >
            <Download className="w-4 h-4" />
            <span>Özgeçmişi İndir (CV)</span>
          </button>

          <button
            onClick={() => setShowCvModal(true)}
            className="px-6 py-3.5 bg-[#2c3e50] hover:bg-[#1a252f] text-white font-bold rounded-lg transition-all shadow-md flex items-center gap-2 text-sm uppercase tracking-wider"
          >
            <FileText className="w-4 h-4 text-[#1abc9c]" />
            <span>CV'yi Ekranda İncele</span>
          </button>
        </div>

        {downloadSuccess && (
          <div className="mt-4 p-3 bg-white/20 border border-white/40 rounded-lg text-white text-sm max-w-md mx-auto text-center flex items-center justify-center gap-2 animate-fadeIn">
            <CheckCircle className="w-4 h-4 text-white" />
            <span>Enes Öztürk CV dosyası başarıyla bilgisayarınıza indirildi!</span>
          </div>
        )}
      </div>

      {/* CV Modal Preview */}
      {showCvModal && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white text-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto relative shadow-2xl">
            <button
              onClick={() => setShowCvModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-500 hover:text-slate-800 rounded-full hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="border-b border-slate-200 pb-4 mb-4">
              <span className="text-xs font-bold text-[#1abc9c] uppercase tracking-wider">
                Resmi Özgeçmiş
              </span>
              <h3 className="text-2xl font-black text-[#2c3e50] uppercase font-heading">
                ENES ÖZTÜRK
              </h3>
              <p className="text-sm text-slate-500">
                Full Stack Web Developer · Node.js & React Uzmanı
              </p>
            </div>

            <div className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div>
                <h4 className="font-bold text-[#2c3e50] uppercase text-xs tracking-wider mb-1">
                  Hakkında
                </h4>
                <p>
                  Modern JavaScript ekosisteminde güçlü sunucu ve ön yüz çözümleri geliştiren yazılım geliştirici. PCAT ve SmartEdu projeleriyle kazandığı CRUD ve mimari prensipleri, yüksek kaliteli dinamik web çözümlerine dönüştürmektedir.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-[#2c3e50] uppercase text-xs tracking-wider mb-1">
                  Öne Çıkan Başarılar & Projeler
                </h4>
                <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm">
                  <li><strong>Freelancer Dinamik Projesi:</strong> StartBootstrap temasını dinamik CRUD ve mesajlaşma ile zenginleştirdi.</li>
                  <li><strong>PCAT Fotoğraf Kataloğu:</strong> Express, Multer ve MongoDB ile dosya yükleme ve düzenleme.</li>
                  <li><strong>SmartEdu LMS Platformu:</strong> Nodemailer e-posta gönderimi ve rol bazlı erişim denetimi.</li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-[#2c3e50] uppercase text-xs tracking-wider mb-1">
                  İletişim
                </h4>
                <p className="text-xs sm:text-sm">
                  E-posta: enesbino38@gmail.com · GitHub: github.com/enesozturk
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCvModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Kapat
              </button>
              <button
                onClick={handleDownloadCv}
                className="px-4 py-2 bg-[#1abc9c] hover:bg-[#16a085] text-white text-xs font-bold uppercase rounded-lg flex items-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>İndir</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
