import React, { useState } from 'react';
import { MVCFile } from '../types';
import { MVC_FILES } from '../data/mvcCodeFiles';
import { Folder, FileCode, CheckCircle, Copy, Check, ArrowRight, Layers, Database, Monitor, GitBranch, Cpu, Sparkles } from 'lucide-react';

interface MvcExplorerViewProps {
  initialFileId?: string;
  onSelectPostAction?: () => void;
}

export const MvcExplorerView: React.FC<MvcExplorerViewProps> = ({
  initialFileId = 'post-ejs',
  onSelectPostAction
}) => {
  const [selectedFileId, setSelectedFileId] = useState<string>(initialFileId);
  const [copied, setCopied] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const selectedFile = MVC_FILES.find((f) => f.id === selectedFileId) || MVC_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const filteredFiles = filterCategory === 'all' 
    ? MVC_FILES 
    : MVC_FILES.filter(f => f.category === filterCategory);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Top Banner */}
      <header className="bg-[#1f2428] text-white py-12 px-4 border-b border-gray-800">
        <div className="max-w-6xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 px-3.5 py-1.5 rounded-full text-xs font-semibold mb-3">
            <Layers className="w-3.5 h-3.5" />
            Ödev 11 &bull; 4. Madde: MVC Mimarisi ve Kod Yapısı
          </div>
          <h1 className="text-3xl sm:text-4xl font-serif font-bold tracking-tight mb-3">
            MVC Proje Mimarisi & Kod İnceleyici
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-300 max-w-3xl">
            Clean Blog projesinde Controllers, Models ve Views (EJS) ayrımı yapılmış, post.ejs üzerinde UPDATE ve DELETE butonları eklenmiştir. Proje mimarisini ve kodlarını dosya dosya inceleyin.
          </p>
          <div className="mt-4 flex items-center gap-3 text-xs text-gray-400">
            <span>İmzalı: <strong className="text-white">Enes Öztürk</strong></span>
            <span>&bull;</span>
            <span className="text-emerald-400">Patika.dev Node.js Projesi</span>
          </div>
        </div>
      </header>

      {/* Visual MVC Architecture Diagram */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h2 className="text-sm font-bold uppercase tracking-wider text-gray-700 flex items-center gap-2 mb-4">
            <Cpu className="w-4 h-4 text-emerald-600" />
            Clean Blog MVC Veri ve İstek Akışı (Request-Response Flow)
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Box 1: Browser Request */}
            <div className="p-4 rounded-lg bg-gray-50 border border-gray-200 relative group hover:border-emerald-500 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-gray-500 uppercase">1. İstek (Request)</span>
                <Monitor className="w-4 h-4 text-gray-600" />
              </div>
              <h3 className="font-bold text-gray-800 text-sm mb-1">Tarayıcı & Form</h3>
              <p className="text-xs text-gray-500 mb-2">
                Kullanıcı <code className="bg-gray-200 px-1 rounded text-[11px]">/posts/edit/:id</code> veya <code className="bg-gray-200 px-1 rounded text-[11px]">?_method=DELETE</code> tıklar.
              </p>
              <span className="inline-block text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                GET / PUT / DELETE
              </span>
            </div>

            {/* Box 2: Routes & Controller */}
            <div className="p-4 rounded-lg bg-emerald-50/60 border border-emerald-200 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-emerald-800 uppercase">2. Controller</span>
                <GitBranch className="w-4 h-4 text-emerald-700" />
              </div>
              <h3 className="font-bold text-emerald-950 text-sm mb-1">postController.js</h3>
              <p className="text-xs text-emerald-900/80 mb-2">
                <code className="bg-white/80 px-1 rounded text-[11px]">updatePost()</code> & <code className="bg-white/80 px-1 rounded text-[11px]">deletePost()</code> metodları isteği karşılar.
              </p>
              <span className="inline-block text-[10px] font-semibold text-emerald-800 bg-white px-2 py-0.5 rounded border border-emerald-200">
                controllers/
              </span>
            </div>

            {/* Box 3: Model */}
            <div className="p-4 rounded-lg bg-blue-50/60 border border-blue-200 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-blue-800 uppercase">3. Model</span>
                <Database className="w-4 h-4 text-blue-700" />
              </div>
              <h3 className="font-bold text-blue-950 text-sm mb-1">models/Post.js</h3>
              <p className="text-xs text-blue-900/80 mb-2">
                Mongoose ODM aracılığıyla MongoDB veritabanında CRUD işlemi uygulanır.
              </p>
              <span className="inline-block text-[10px] font-semibold text-blue-800 bg-white px-2 py-0.5 rounded border border-blue-200">
                findByIdAndUpdate/Delete
              </span>
            </div>

            {/* Box 4: View */}
            <div className="p-4 rounded-lg bg-amber-50/60 border border-amber-200 relative group">
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold text-amber-800 uppercase">4. View (EJS)</span>
                <Layers className="w-4 h-4 text-amber-700" />
              </div>
              <h3 className="font-bold text-amber-950 text-sm mb-1">views/post.ejs</h3>
              <p className="text-xs text-amber-900/80 mb-2">
                Render edilen HTML yanıtı kullanıcıya iletilir veya yönlendirme yapılır.
              </p>
              <span className="inline-block text-[10px] font-semibold text-amber-800 bg-white px-2 py-0.5 rounded border border-amber-200">
                UPDATE / DELETE Butonları
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Code Explorer Workspace */}
      <main className="max-w-6xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: File Tree & Category Selector */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-700 flex items-center gap-1.5">
                <Folder className="w-4 h-4 text-amber-500" />
                MVC Proje Dosyaları
              </h3>
              <span className="text-[11px] text-gray-500 font-mono">
                {MVC_FILES.length} dosya
              </span>
            </div>

            {/* Category tabs */}
            <div className="flex flex-wrap gap-1 mb-3 text-[11px]">
              <button
                onClick={() => setFilterCategory('all')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'all'
                    ? 'bg-gray-800 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Hepsi
              </button>
              <button
                onClick={() => setFilterCategory('controller')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'controller'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Controllers
              </button>
              <button
                onClick={() => setFilterCategory('view')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'view'
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Views (EJS)
              </button>
              <button
                onClick={() => setFilterCategory('model')}
                className={`px-2 py-1 rounded font-medium transition-colors ${
                  filterCategory === 'model'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                Model
              </button>
            </div>

            {/* File List */}
            <div className="space-y-1.5">
              {filteredFiles.map((file) => {
                const isSelected = file.id === selectedFileId;
                const isOdev11Highlight = file.id === 'post-ejs' || file.id === 'post-controller' || file.id === 'edit-ejs';

                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-3 rounded-lg text-xs transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? 'bg-emerald-50 border border-emerald-400 text-emerald-950 font-semibold shadow-xs'
                        : 'hover:bg-gray-50 border border-transparent text-gray-700'
                    }`}
                  >
                    <FileCode className={`w-4 h-4 shrink-0 mt-0.5 ${
                      file.category === 'controller'
                        ? 'text-emerald-600'
                        : file.category === 'model'
                        ? 'text-blue-600'
                        : file.category === 'view'
                        ? 'text-amber-500'
                        : 'text-purple-600'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-mono truncate">{file.name}</span>
                        {isOdev11Highlight && (
                          <span className="shrink-0 text-[10px] bg-emerald-600 text-white font-bold px-1.5 py-0.2 rounded ml-1">
                            ÖDEV 11
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-500 truncate mt-0.5">
                        {file.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Info Box */}
          <div className="bg-emerald-950 text-white rounded-xl p-5 border border-emerald-800 text-xs">
            <div className="flex items-center gap-2 text-emerald-400 font-bold mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Ödev 11 Özeti</span>
            </div>
            <ul className="space-y-1.5 text-gray-300">
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>post.ejs:</strong> UPDATE & DELETE butonları</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>edit.ejs:</strong> PUT ile veri güncelleme</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>postController:</strong> update & delete metodları</span>
              </li>
              <li className="flex items-center gap-1.5">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span><strong>İmza:</strong> Enes Öztürk imzası ve künyesi</span>
              </li>
            </ul>
          </div>
        </aside>

        {/* Right: Code Viewer */}
        <div className="lg:col-span-8 space-y-4">
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
            {/* Header of Code block */}
            <div className="bg-[#212529] text-gray-200 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3 border-b border-gray-700">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-emerald-400" />
                <span className="font-mono text-xs font-bold text-white tracking-wide">
                  {selectedFile.path}
                </span>
                <span className="text-[10px] text-gray-400 bg-white/10 px-2 py-0.5 rounded uppercase">
                  {selectedFile.category}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-xs font-medium text-gray-200 transition-colors"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Kopyalandı!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Kodu Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Note about assignment fulfillment */}
            {selectedFile.odevNote && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-5 py-2.5 text-xs text-emerald-900 flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">{selectedFile.odevNote}</span>
                </div>
              </div>
            )}

            {/* Code lines */}
            <div className="bg-[#1e1e1e] p-4 text-xs font-mono text-gray-200 overflow-x-auto max-h-[600px] leading-relaxed">
              <pre className="table w-full">
                {selectedFile.code.split('\n').map((line, index) => {
                  const lineNumber = index + 1;
                  const isHighlighted = selectedFile.highlightLines?.includes(lineNumber);

                  return (
                    <div
                      key={index}
                      className={`table-row transition-colors ${
                        isHighlighted
                          ? 'bg-emerald-950/70 border-l-2 border-emerald-400 text-emerald-200'
                          : 'hover:bg-white/5'
                      }`}
                    >
                      <span className="table-cell select-none text-right pr-4 text-gray-600 text-[11px] w-10">
                        {lineNumber}
                      </span>
                      <span className="table-cell whitespace-pre">{line}</span>
                    </div>
                  );
                })}
              </pre>
            </div>

            {/* Footer info */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-500">
              <span>{selectedFile.description}</span>
              <span className="font-mono text-[11px] text-gray-400">
                {selectedFile.code.split('\n').length} satır &bull; Enes Öztürk
              </span>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};
