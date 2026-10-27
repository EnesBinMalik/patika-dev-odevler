import React, { useState } from 'react';
import { 
  X, 
  HelpCircle, 
  FileText, 
  BookOpen, 
  Sparkles, 
  Check, 
  Copy, 
  ArrowRight,
  ExternalLink,
  Code2,
  ListOrdered,
  Quote,
  Table as TableIcon
} from 'lucide-react';
import { CHEAT_SHEET, SAMPLES, MarkdownSample } from '../data/samples';
import { parseMarkdown } from '../utils/markdownParser';

interface HelpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoadSample: (content: string) => void;
  onInsertSyntax: (syntax: string) => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({
  isOpen,
  onClose,
  onLoadSample,
  onInsertSyntax,
}) => {
  const [activeTab, setActiveTab] = useState<'sample' | 'cheatsheet' | 'templates' | 'about'>('sample');
  const [selectedSample, setSelectedSample] = useState<MarkdownSample>(SAMPLES[0]);
  const [copiedSyntax, setCopiedSyntax] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Tümü');

  if (!isOpen) return null;

  const categories = ['Tümü', ...Array.from(new Set(CHEAT_SHEET.map((item) => item.category)))];

  const filteredCheatSheet = activeCategory === 'Tümü'
    ? CHEAT_SHEET
    : CHEAT_SHEET.filter((item) => item.category === activeCategory);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSyntax(text);
    setTimeout(() => setCopiedSyntax(null), 2000);
  };

  const sampleRenderedHtml = parseMarkdown(selectedSample.content);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="relative w-full max-w-5xl h-[88vh] max-h-[850px] bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-white">Markdown Örnek & Kılavuz</h2>
                <span className="text-[11px] font-medium tracking-wide uppercase px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                  Enes Öztürk Signature
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Örnek markdown verisini ve sağ taraftaki ön izlemesini canlı inceleyin veya editöre aktarın.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            title="Kapat (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs Navigation */}
        <div className="flex items-center gap-1 px-6 py-2.5 border-b border-slate-800/80 bg-slate-950/40 shrink-0 overflow-x-auto">
          <button
            onClick={() => setActiveTab('sample')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'sample'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Canlı Örnek & Ön İzleme</span>
          </button>

          <button
            onClick={() => setActiveTab('cheatsheet')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'cheatsheet'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Sözdizimi Kılavuzu (Cheat Sheet)</span>
          </button>

          <button
            onClick={() => setActiveTab('templates')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'templates'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Hazır Şablonlar ({SAMPLES.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('about')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
              activeTab === 'about'
                ? 'bg-sky-500 text-slate-950 shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>Proje Hakkında & Kısayollar</span>
          </button>
        </div>

        {/* Modal Content Body */}
        <div className="flex-1 overflow-hidden">
          {/* TAB 1: Canlı Örnek & Ön İzleme */}
          {activeTab === 'sample' && (
            <div className="h-full flex flex-col">
              {/* Sample Selector Bar */}
              <div className="flex items-center justify-between px-6 py-2.5 bg-slate-900 border-b border-slate-800 shrink-0 gap-4 flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">Örnek Seçin:</span>
                  <div className="flex items-center gap-1.5">
                    {SAMPLES.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => setSelectedSample(s)}
                        className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                          selectedSample.id === s.id
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/40'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {s.title}
                      </button>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onLoadSample(selectedSample.content);
                    onClose();
                  }}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold rounded-lg shadow-sm transition-colors cursor-pointer"
                >
                  <span>Bu Örneği Editöre Yükle</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Side-by-side: Left Markdown Source / Right Rendered Preview */}
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
                {/* Left: Raw Markdown Format */}
                <div className="h-full flex flex-col overflow-hidden bg-slate-950/60">
                  <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-950/90 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 font-mono text-sky-400">
                      <Code2 className="w-3.5 h-3.5" />
                      Markdown Formatındaki Veri (Girdi)
                    </span>
                    <button
                      onClick={() => handleCopy(selectedSample.content)}
                      className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                    >
                      {copiedSyntax === selectedSample.content ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Kopyalandı</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Metni Kopyala</span>
                        </>
                      )}
                    </button>
                  </div>
                  <pre className="flex-1 p-4 font-mono text-xs leading-relaxed overflow-y-auto text-slate-300 whitespace-pre-wrap select-text">
                    {selectedSample.content}
                  </pre>
                </div>

                {/* Right: Rendered Preview */}
                <div className="h-full flex flex-col overflow-hidden bg-slate-900">
                  <div className="px-4 py-2 border-b border-slate-800/80 bg-slate-900 flex items-center justify-between text-xs font-semibold text-slate-300">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <Sparkles className="w-3.5 h-3.5" />
                      Canlı Ön İzleme (Sağ Taraf Çıktısı)
                    </span>
                    <span className="text-[11px] text-slate-400">HTML Çıktı</span>
                  </div>
                  <div 
                    className="flex-1 p-5 overflow-y-auto markdown-preview text-slate-200"
                    dangerouslySetInnerHTML={{ __html: sampleRenderedHtml }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Sözdizimi Kılavuzu (Cheat Sheet) */}
          {activeTab === 'cheatsheet' && (
            <div className="h-full flex flex-col p-6 overflow-hidden">
              <div className="flex items-center justify-between gap-4 mb-4 pb-3 border-b border-slate-800 flex-wrap">
                <div>
                  <h3 className="text-sm font-semibold text-white">Markdown Biçimlendirme Kuralları</h3>
                  <p className="text-xs text-slate-400">
                    İstediğiniz sözdizimini tek tıkla doğrudan sol taraftaki editörünüze ekleyin.
                  </p>
                </div>

                {/* Category filters */}
                <div className="flex items-center gap-1 flex-wrap">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat)}
                      className={`px-2.5 py-1 text-xs rounded-md font-medium transition-colors ${
                        activeCategory === cat
                          ? 'bg-sky-500 text-slate-950 font-semibold'
                          : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid of Cheat Sheet items */}
              <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-3 pb-4">
                {filteredCheatSheet.map((item, idx) => (
                  <div 
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800/90 hover:border-slate-700 transition-all flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <span className="text-xs font-semibold text-white">{item.name}</span>
                        <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mb-2.5">{item.explanation}</p>

                      <div className="bg-slate-900 border border-slate-800 rounded-lg p-2 mb-2 font-mono text-xs text-sky-300 break-all select-all">
                        {item.syntax}
                      </div>

                      <div className="text-xs p-2 rounded bg-slate-900/50 border border-slate-800/50 text-slate-300">
                        <span className="text-[10px] text-slate-400 block mb-1">Görünüm:</span>
                        <div dangerouslySetInnerHTML={{ __html: item.preview }} />
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-3 pt-2 border-t border-slate-800/60">
                      <button
                        onClick={() => {
                          onInsertSyntax(item.syntax);
                          onClose();
                        }}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-sky-500/10 hover:bg-sky-500 text-sky-300 hover:text-slate-950 text-xs font-medium transition-colors text-center"
                      >
                        Editöre Ekle
                      </button>
                      <button
                        onClick={() => handleCopy(item.syntax)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Kodu Kopyala"
                      >
                        {copiedSyntax === item.syntax ? (
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Hazır Şablonlar */}
          {activeTab === 'templates' && (
            <div className="h-full p-6 overflow-y-auto">
              <div className="mb-6">
                <h3 className="text-sm font-semibold text-white">Hazır Doküman Şablonları</h3>
                <p className="text-xs text-slate-400">
                  Enes Öztürk tarafından özenle hazırlanmış şablonlardan birini seçerek projenize hızlıca başlayın.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {SAMPLES.map((sample) => (
                  <div
                    key={sample.id}
                    className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-sky-500/10 text-sky-400 border border-sky-500/20">
                          {sample.badge}
                        </span>
                        <FileText className="w-4 h-4 text-slate-400" />
                      </div>
                      <h4 className="text-base font-semibold text-white mb-1.5">{sample.title}</h4>
                      <p className="text-xs text-slate-400 leading-relaxed mb-4">
                        {sample.description}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        onLoadSample(sample.content);
                        onClose();
                      }}
                      className="w-full py-2 px-3 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
                    >
                      <span>Şablonu Editöre Yükle</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: Proje Hakkında & Kısayollar */}
          {activeTab === 'about' && (
            <div className="h-full p-6 overflow-y-auto max-w-3xl mx-auto space-y-6">
              <div className="p-5 rounded-2xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 text-center space-y-2">
                <h3 className="text-lg font-bold text-white tracking-tight">Markdown Previewer Pro</h3>
                <p className="text-xs text-sky-400 font-medium">Enes Öztürk Signature Edition</p>
                <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed pt-1">
                  Modern web standartlarında, gerçek zamanlı senkronize kaydırma, sözdizimi vurgulama ve tam özellikli GitHub Markdown desteği sağlayan profesyonel bir web aracıdır.
                </p>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-semibold tracking-wider uppercase text-slate-400">
                  Klavye Kısayolları & Editör Kolaylıkları
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300">İçeride Girintileme (Tab)</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]">Tab (2 Boşluk)</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300">Örnek Kılavuzu Aç</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]">Sağ Üstteki ? Butonu</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300">Yazdır / PDF Olarak Kaydet</span>
                    <kbd className="px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-mono text-[11px]">Ctrl + P</kbd>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 flex items-center justify-between">
                    <span className="text-slate-300">Senkron Kaydırma</span>
                    <span className="text-emerald-400 font-medium">Otomatik Orantılı</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs text-slate-400 space-y-1">
                <p className="font-semibold text-slate-200">Geliştirici & Tasarımcı:</p>
                <p>Enes Öztürk — <span className="text-sky-400">enesbino38@gmail.com</span></p>
                <p className="text-[11px] text-slate-500 pt-1">
                  Gereksinim: Ekranın solundan girilen verinin sağ tarafta anında ön izlenmesi ve sağ üst köşedeki soru işareti ile örnek gösterimi eksiksiz sağlanmıştır.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-800 bg-slate-950/60 shrink-0 text-xs text-slate-400">
          <span>Enes Öztürk İmzalı Markdown Studio</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
