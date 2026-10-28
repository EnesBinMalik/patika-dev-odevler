import React, { useState } from 'react';
import { X, Copy, Check, GitBranch, Terminal, Download, Upload, Server } from 'lucide-react';
import { PortfolioItem } from '../types';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  portfolioItems: PortfolioItem[];
  onImportData: (items: PortfolioItem[]) => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({
  isOpen,
  onClose,
  portfolioItems,
  onImportData,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(portfolioItems, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'enes_ozturk_ajans_portfolio.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(reader.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onImportData(parsed);
            alert('Portföy verileri başarıyla içe aktarıldı!');
            onClose();
          } else {
            alert('Geçersiz portföy JSON dosyası.');
          }
        } catch {
          alert('JSON dosyası okunamadı.');
        }
      };
      reader.readAsText(file);
    }
  };

  const gitSnippet = `# 1. Git Deposunu Başlatın
git init
git add .
git commit -m "feat: Enes Öztürk Ajans Projesi - Dinamik Portföy & CRUD Tamamlandı"
git branch -M main
git remote add origin https://github.com/KULLANICI_ADINIZ/ajans-projesi.git
git push -u origin main`;

  const herokuSnippet = `# 2. Heroku Üzerine Canlı Dağıtım (Deploy)
# Heroku CLI ile oturum açın
heroku login

# Yeni bir Heroku uygulaması oluşturun
heroku create enes-ozturk-ajans

# Uygulamanızı Heroku üzerine gönderin
git push heroku main

# Canlı web uygulamasını tarayıcıda açın
heroku open`;

  const procfileSnippet = `web: npm start`;

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-neutral-950/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-3xl my-8 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-neutral-800 flex items-center justify-between bg-neutral-900 sticky top-0 z-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider">
              <span>GitHub & Heroku Rehberi</span>
              <span aria-hidden="true">·</span>
              <span>Enes Öztürk İmzalı</span>
            </div>
            <h3 className="text-xl font-bold text-white">Proje Sürümleme ve Dağıtım Adımları</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          <p className="text-xs text-neutral-300 leading-relaxed">
            PCAT ve SmartEdu projelerimizde olduğu gibi, Ajans projenizin tüm kaynak kodlarını kendi GitHub hesabınızda saklayabilir ve Heroku bulut ortamında canlı yayına alabilirsiniz.
          </p>

          {/* Quick Data Export / Import Tool */}
          <div className="p-4 rounded-xl border border-neutral-800 bg-neutral-950/60 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-white">Portföy CRUD Verilerini Yedekleyin</h4>
              <p className="text-xs text-neutral-400">
                Oluşturduğunuz projeleri JSON olarak indirin veya başka bir ortama yükleyin.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportJson}
                className="px-3 py-1.5 text-xs font-medium text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>JSON İndir</span>
              </button>
              <label className="px-3 py-1.5 text-xs font-medium text-white bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 rounded-lg flex items-center gap-1.5 cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-amber-400" />
                <span>JSON Yükle</span>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportJson}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Step 1: GitHub */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <GitBranch className="w-4 h-4 text-amber-400" />
                <span>1. Adım: GitHub Deposuna Yükleme</span>
              </div>
              <button
                onClick={() => copyToClipboard(gitSnippet, 'git')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 py-1 px-2 rounded hover:bg-neutral-800 cursor-pointer"
              >
                {copiedKey === 'git' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Komutları Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto">
              <code>{gitSnippet}</code>
            </pre>
          </div>

          {/* Step 2: Heroku */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-bold text-white">
                <Server className="w-4 h-4 text-amber-400" />
                <span>2. Adım: Heroku Ortamına Yükleme (Deploy)</span>
              </div>
              <button
                onClick={() => copyToClipboard(herokuSnippet, 'heroku')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 py-1 px-2 rounded hover:bg-neutral-800 cursor-pointer"
              >
                {copiedKey === 'heroku' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Komutları Kopyala</span>
                  </>
                )}
              </button>
            </div>
            <pre className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 text-xs font-mono text-neutral-300 overflow-x-auto">
              <code>{herokuSnippet}</code>
            </pre>
          </div>

          {/* Step 3: Procfile */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-400">
                <Terminal className="w-3.5 h-3.5 text-amber-400" />
                <span>Heroku Procfile Dosyası</span>
              </div>
              <button
                onClick={() => copyToClipboard(procfileSnippet, 'procfile')}
                className="text-xs text-neutral-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {copiedKey === 'procfile' ? (
                  <span className="text-emerald-400">Kopyalandı</span>
                ) : (
                  <span>Kopyala</span>
                )}
              </button>
            </div>
            <pre className="p-3 rounded-lg bg-neutral-950 border border-neutral-800 text-xs font-mono text-amber-300">
              <code>{procfileSnippet}</code>
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-neutral-800 bg-neutral-900 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-neutral-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors cursor-pointer"
          >
            Anladım, Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
