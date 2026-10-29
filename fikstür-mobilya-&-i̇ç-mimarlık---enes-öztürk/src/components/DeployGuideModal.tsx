import React, { useState } from 'react';
import { X, Github, Cloud, Terminal, Check, Copy } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, index: number) => {
    navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Git Başlatma ve GitHub Deposuna Gönderme',
      desc: 'PCAT ve SmartEdu projelerindeki gibi terminal üzerinden yerel deponuzu oluşturup GitHub hesabınıza aktarın:',
      code: `git init
git add .
git commit -m "feat: Fikstur Mobilya & Rezervasyon Projesi - Enes Ozturk"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/fikstur-projesi.git
git push -u origin main`
    },
    {
      title: '2. Heroku Ortamına Yükleme (Procfile & Build)',
      desc: 'Heroku CLI aracılığıyla projeyi canlı ortama aktarma adımları:',
      code: `# Heroku CLI oturumu acin
heroku login

# Yeni bir Heroku uygulamasi olusturun
heroku create fikstur-enes-ozturk

# Node.js veya static buildpack tanimlayin
heroku buildpacks:set heroku/nodejs

# Kodu Heroku master/main dalina gonderin
git push heroku main

# Uygulamanizi web tarayicisinda acin
heroku open`
    },
    {
      title: '3. Proje Mimarisi & Rol Tabanlı Yetkilendirme Notları',
      desc: 'SmartEdu eğitim modeline göre uygulanan temel bileşenler:',
      code: `• Çok Sayfalı Mimari: Home, About, Furnitures, Contact, Login, Register, Admin, Rezervasyonlar
• Rol Hiyerarşisi: 
  - Müşteri/Ziyaretçi: Yalnızca vitrin inceleme ve arama/filtreleme
  - Üye: Mobilyaları rezerve edebilme ve kendi rezervasyonlarını takip etme
  - Admin: Tam CRUD yetkisi (mobilya ekle/düzenle/sil), onay mekanizması, gelen mesajlar
• İmza: Enes Öztürk`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-stone-200 bg-stone-50">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-stone-900 text-white flex items-center justify-center">
              <Terminal className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-stone-900 font-display">
                GitHub & Heroku Dağıtım Rehberi
              </h2>
              <p className="text-xs text-stone-500">SmartEdu / PCAT Kurs Projesi Standartları — Enes Öztürk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-200/50 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm text-stone-700">
          <p className="text-xs text-stone-600 leading-relaxed bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/60">
            Tıpkı eğitim serisindeki <strong>SmartEdu</strong> ve <strong>PCAT</strong> projelerinde olduğu gibi, hazırladığımız bu projeyi kendi GitHub hesabınızda depolayabilir ve tek komutla Heroku, Render veya Vercel ortamlarına canlıya alabilirsiniz.
          </p>

          {steps.map((s, idx) => (
            <div key={idx} className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                {idx === 0 && <Github className="w-4 h-4 text-stone-700" />}
                {idx === 1 && <Cloud className="w-4 h-4 text-purple-600" />}
                {s.title}
              </h3>
              <p className="text-xs text-stone-600">{s.desc}</p>
              <div className="relative group">
                <pre className="bg-stone-950 text-stone-200 p-3.5 rounded-xl text-xs font-mono overflow-x-auto leading-relaxed border border-stone-800">
                  {s.code}
                </pre>
                <button
                  onClick={() => copyCode(s.code, idx)}
                  className="absolute top-2.5 right-2.5 px-2.5 py-1 text-[11px] font-medium bg-stone-800 hover:bg-stone-700 text-stone-200 rounded-md transition-colors flex items-center gap-1 opacity-90 group-hover:opacity-100 cursor-pointer"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span>Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
            <span>Hazırlayan: <strong className="text-stone-900">Enes Öztürk</strong></span>
            <span>Mühendislik & İç Mimarlık Çözümleri</span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800 transition-colors cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
