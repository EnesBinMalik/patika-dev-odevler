import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Github, Terminal, Server, Check, Copy, Award, BookOpen } from 'lucide-react';

export const GitHubHerokuModal: React.FC = () => {
  const { isGithubModalOpen, setIsGithubModalOpen, showToast } = useApp();
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  if (!isGithubModalOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    showToast('Komutlar panoya kopyalandı!');
    setTimeout(() => setCopiedSection(null), 2500);
  };

  const gitCommands = `# 1. Proje Dizininde Git Başlatma
git init
git add .
git commit -m "feat: Misfit Projesi - Enes Öztürk El Emeği ve SmartEdu Mimarisi"

# 2. Kendi GitHub Deponuzu Bağlama
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/misfit-proje.git
git push -u origin main`;

  const herokuCommands = `# 1. Heroku CLI ile Giriş ve Uygulama Oluşturma
heroku login
heroku create misfit-enes-ozturk

# 2. Buildpack ve Node Ortamı Hazırlığı
heroku buildpacks:set heroku/nodejs

# 3. Heroku'ya Canlıya Alma (Deploy)
git push heroku main
heroku open`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setIsGithubModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6 flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
            <Github className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display text-2xl font-bold text-white tracking-wide uppercase">
              GitHub & Heroku Dağıtım Rehberi
            </h3>
            <p className="text-xs text-neutral-400 mt-1">
              PCAT ve SmartEdu projelerindeki standartlara uygun olarak hazırlanmış kod mimarisi ve canlıya alma adımları.
            </p>
          </div>
        </div>

        {/* Hallmark banner */}
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-neutral-900 to-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Award className="w-6 h-6 text-amber-400 shrink-0" />
          <div className="text-xs">
            <span className="font-bold text-white uppercase tracking-wider block">Enes Öztürk İmzasıyla El Emeği</span>
            <span className="text-neutral-300">
              SmartEdu benzeri çok sayfalı, eğitmen-antrenman ilişkili, rol bazlı yönetim paneline sahip eksiksiz mimari.
            </span>
          </div>
        </div>

        {/* Section 1: GitHub */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Terminal className="w-4 h-4 text-amber-400" />
              <span>1. GitHub Deposuna Yükleme Adımları</span>
            </div>
            <button
              onClick={() => copyToClipboard(gitCommands, 'git')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-md transition-colors"
            >
              {copiedSection === 'git' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'git' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
            {gitCommands}
          </pre>
        </div>

        {/* Section 2: Heroku */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Server className="w-4 h-4 text-amber-400" />
              <span>2. Heroku Ortamına Dağıtım (Deployment)</span>
            </div>
            <button
              onClick={() => copyToClipboard(herokuCommands, 'heroku')}
              className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-semibold bg-neutral-800 hover:bg-neutral-700 text-amber-400 rounded-md transition-colors"
            >
              {copiedSection === 'heroku' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSection === 'heroku' ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          <pre className="p-3.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto leading-relaxed">
            {herokuCommands}
          </pre>
        </div>

        {/* Section 3: SmartEdu & PCAT Architectural Highlights */}
        <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs space-y-2">
          <div className="flex items-center gap-2 text-amber-400 font-bold uppercase tracking-wider text-[11px]">
            <BookOpen className="w-4 h-4" />
            <span>SmartEdu Projesiyle Birebir Karşılıklar</span>
          </div>
          <ul className="space-y-1.5 text-neutral-300 list-disc list-inside">
            <li><strong>Home, About, Trainer, Gallery, Contact:</strong> İstenilen 5 temel çok sayfalı yapı eksiksiz uygulandı.</li>
            <li><strong>Eğitmen - Antrenman İlişkisi:</strong> Her eğitmen yalnızca kendisine ait antrenmanları oluşturur, düzenler ve siler.</li>
            <li><strong>Üye Antrenman Kaydı:</strong> Üyeler diledikleri antrenmanlara tek tıkla kaydolur; panelinde aldıkları antrenmanları yönetir.</li>
            <li><strong>Eğitmen Paneli:</strong> Verdiği dersleri ve bu derslere kaydolan üyelerin tam listesini anlık olarak inceler.</li>
            <li><strong>Admin Alanı:</strong> Rol yönetimi, kullanıcı yetkilendirme, iletişim formundan gelen mesajları okuma ve cevaplama.</li>
            <li><strong>İletişim Formu:</strong> Doğrulamalı gerçek mesajlaşma motoru ve admin mesaj kutusu.</li>
          </ul>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={() => setIsGithubModalOpen(false)}
            className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs rounded-lg transition-colors"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
