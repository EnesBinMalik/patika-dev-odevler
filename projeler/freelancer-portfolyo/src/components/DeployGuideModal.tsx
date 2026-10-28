import React, { useState } from 'react';
import { Project } from '../types';
import { X, Copy, Check, Terminal, Github, Cloud, Download, ExternalLink } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  projects,
}) => {
  const [activeTab, setActiveTab] = useState<'github' | 'heroku' | 'backup'>('github');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(projects, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'freelancer_enes_ozturk_projects.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
      <div className="fixed inset-0" onClick={onClose} aria-hidden="true" />

      <div className="relative bg-white rounded-2xl max-w-3xl w-full mx-auto shadow-2xl overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="bg-[#2c3e50] text-white px-6 py-5 flex items-center justify-between border-b border-[#34495e]">
          <div>
            <span className="text-xs font-bold text-[#1abc9c] uppercase tracking-wider block">
              PCAT & SmartEdu Sonrası Canlıya Alma
            </span>
            <h2 className="text-xl sm:text-2xl font-black uppercase tracking-tight font-heading flex items-center gap-2">
              <Terminal className="w-5 h-5 text-[#1abc9c]" />
              <span>GITHUB & HEROKU DAĞITIM REHBERİ</span>
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 px-6 pt-3 gap-2">
          <button
            onClick={() => setActiveTab('github')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'github'
                ? 'border-[#1abc9c] text-[#2c3e50]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Github className="w-4 h-4" />
            <span>1. GitHub Deposu</span>
          </button>
          <button
            onClick={() => setActiveTab('heroku')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'heroku'
                ? 'border-[#1abc9c] text-[#2c3e50]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" />
            <span>2. Heroku Canlı Yayını</span>
          </button>
          <button
            onClick={() => setActiveTab('backup')}
            className={`pb-3 px-4 text-xs sm:text-sm font-bold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'backup'
                ? 'border-[#1abc9c] text-[#2c3e50]'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>3. Veri Yedekleme (JSON)</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="overflow-y-auto p-6 space-y-6 flex-1 text-sm text-slate-700">
          {activeTab === 'github' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                PCAT ve SmartEdu projelerinde olduğu gibi, Freelancer projenizi GitHub hesabınızda depolamak için terminalinizde sırasıyla şu komutları çalıştırabilirsiniz:
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: 'Adım 1: Git Deposunu Başlatın',
                    cmd: 'git init',
                    desc: 'Proje ana dizininde boş bir Git deposu oluşturur.',
                  },
                  {
                    step: 'Adım 2: Dosyaları Ekleyin ve İlk Commit',
                    cmd: 'git add .\ngit commit -m "feat: Freelancer dinamik proje tamamlandı (Enes Öztürk)"',
                    desc: 'Tüm bileşenleri ve şablonları commit haline getirir.',
                  },
                  {
                    step: 'Adım 3: GitHub Deponuzu Bağlayın & Gönderin',
                    cmd: 'git branch -M main\ngit remote add origin https://github.com/KULLANICI_ADINIZ/freelancer-proje.git\ngit push -u origin main',
                    desc: 'GitHub üzerindeki boş deponuza kaynak kodları aktarır.',
                  },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs uppercase tracking-wide text-[#2c3e50]">
                        {item.step}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.cmd, idx)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded flex items-center gap-1 transition-colors text-slate-700"
                      >
                        {copiedIndex === idx ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Kopyalandı!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-[#2c3e50] text-[#1abc9c] p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      {item.cmd}
                    </pre>
                    <p className="text-xs text-slate-500 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'heroku' && (
            <div className="space-y-4">
              <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">
                Heroku platformunda projenizi canlıya almak için Heroku CLI yüklü olduğundan emin olun ve şu adımları izleyin:
              </p>

              <div className="space-y-3">
                {[
                  {
                    step: 'Adım 1: Heroku CLI Girişi',
                    cmd: 'heroku login',
                    desc: 'Tarayıcı üzerinden Heroku hesabınızı doğrular.',
                  },
                  {
                    step: 'Adım 2: Yeni Heroku Uygulaması Oluşturun',
                    cmd: 'heroku create enes-ozturk-freelancer',
                    desc: 'Heroku üzerinde benzersiz bir alan adı tahsis eder.',
                  },
                  {
                    step: 'Adım 3: Procfile Kontrolü',
                    cmd: 'echo "web: node server.js" > Procfile',
                    desc: 'Heroku uygulamasının başlatma komutunu tanımlar.',
                  },
                  {
                    step: 'Adım 4: Herokuya Gönderin ve Açın',
                    cmd: 'git push heroku main\nheroku open',
                    desc: 'Projenizi derler ve tarayıcıda canlı linki açar.',
                  },
                ].map((item, idx) => (
                  <div key={idx + 10} className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-xs uppercase tracking-wide text-[#2c3e50]">
                        {item.step}
                      </span>
                      <button
                        onClick={() => copyToClipboard(item.cmd, idx + 10)}
                        className="px-2.5 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-100 rounded flex items-center gap-1 transition-colors text-slate-700"
                      >
                        {copiedIndex === idx + 10 ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                            <span className="text-emerald-700">Kopyalandı!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Kopyala</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="bg-[#2c3e50] text-[#1abc9c] p-3 rounded-lg text-xs font-mono overflow-x-auto">
                      {item.cmd}
                    </pre>
                    <p className="text-xs text-slate-500 mt-2">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'backup' && (
            <div className="space-y-4">
              <div className="p-4 bg-teal-50 border border-teal-200 rounded-xl">
                <h4 className="font-bold text-sm text-[#2c3e50] mb-1">
                  Dinamik Portföy Verilerini Dışa Aktar
                </h4>
                <p className="text-xs text-slate-600">
                  Uygulamaya eklediğiniz veya düzenlediğiniz tüm projeleri (toplam {projects.length} adet) tek tıkla JSON formatında indirebilir ve dilediğiniz veri tabanına (MongoDB vb.) tohumlayabilirsiniz.
                </p>
              </div>

              <div className="flex justify-center py-4">
                <button
                  onClick={handleExportJson}
                  className="px-6 py-3 bg-[#1abc9c] hover:bg-[#16a085] text-white font-bold uppercase rounded-lg shadow-sm flex items-center gap-2 text-sm tracking-wider"
                >
                  <Download className="w-4 h-4" />
                  <span>Projeleri JSON Olarak İndir ({projects.length} Proje)</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#2c3e50] hover:bg-[#1a252f] text-white text-xs font-bold uppercase rounded-lg"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
