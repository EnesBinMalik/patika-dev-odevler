import React, { useRef, useEffect, useState } from 'react';
import { 
  Sparkles, 
  Code2, 
  Copy, 
  Check, 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  HelpCircle,
  Eye,
  FileCheck2
} from 'lucide-react';
import { highlightCodeInElement } from '../utils/markdownParser';

interface PreviewPanelProps {
  html: string;
  rawMarkdown: string;
  onUpdateMarkdown: (newMarkdown: string) => void;
  onScroll?: (percentage: number) => void;
  scrollRef?: React.RefObject<HTMLDivElement | null>;
  onOpenHelp: () => void;
  theme: 'dark' | 'light' | 'sepia';
}

export const PreviewPanel: React.FC<PreviewPanelProps> = ({
  html,
  rawMarkdown,
  onUpdateMarkdown,
  onScroll,
  scrollRef,
  onOpenHelp,
  theme,
}) => {
  const localPreviewRef = useRef<HTMLDivElement>(null);
  const containerRef = scrollRef || localPreviewRef;
  const [copiedHtml, setCopiedHtml] = useState(false);
  const [showRawHtml, setShowRawHtml] = useState(false);
  const [fontSize, setFontSize] = useState<number>(15);

  // Re-run syntax highlighting and code button attachments whenever HTML changes
  useEffect(() => {
    if (containerRef.current && !showRawHtml) {
      highlightCodeInElement(containerRef.current);
    }
  }, [html, showRawHtml]);

  // Synchronized scroll event
  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    if (!onScroll) return;
    const target = e.currentTarget;
    const maxScroll = target.scrollHeight - target.clientHeight;
    if (maxScroll <= 0) {
      onScroll(0);
      return;
    }
    const percentage = target.scrollTop / maxScroll;
    onScroll(percentage);
  };

  const handleCopyHtml = () => {
    navigator.clipboard.writeText(html);
    setCopiedHtml(true);
    setTimeout(() => setCopiedHtml(false), 2000);
  };

  // Interactive Task List checkbox click handler
  const handleContainerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const target = e.target as HTMLElement;
    if (target && target.tagName === 'INPUT' && (target as HTMLInputElement).type === 'checkbox') {
      const allCheckboxes = containerRef.current?.querySelectorAll('input[type="checkbox"]');
      if (!allCheckboxes) return;

      const checkboxIndex = Array.from(allCheckboxes).indexOf(target as HTMLInputElement);
      if (checkboxIndex === -1) return;

      // Find the n-th task item in markdown
      let count = 0;
      const regex = /- \[( |x|X)\]/g;
      const newMarkdown = rawMarkdown.replace(regex, (match) => {
        if (count === checkboxIndex) {
          count++;
          return match.includes('x') || match.includes('X') ? '- [ ]' : '- [x]';
        }
        count++;
        return match;
      });

      onUpdateMarkdown(newMarkdown);
    }
  };

  return (
    <div className="h-full flex flex-col bg-slate-900 overflow-hidden">
      {/* Preview Sub-Header */}
      <div className="px-4 py-2 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between gap-2 select-none shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5 shrink-0">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Canlı Ön İzleme
          </span>
          <span className="hidden sm:inline text-[11px] text-slate-500">
            (Sağ Panel Çıktısı)
          </span>
        </div>

        {/* Preview Tools */}
        <div className="flex items-center gap-1.5 shrink-0">
          {/* Zoom controls */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700/60">
            <button
              onClick={() => setFontSize((f) => Math.max(12, f - 1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Yazı Boyutunu Küçült"
            >
              <ZoomOut className="w-3 h-3" />
            </button>
            <span className="px-1.5 text-[10px] font-mono text-slate-300 tabular-nums">
              {fontSize}px
            </span>
            <button
              onClick={() => setFontSize((f) => Math.min(22, f + 1))}
              className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-700 transition-colors cursor-pointer"
              title="Yazı Boyutunu Büyüt"
            >
              <ZoomIn className="w-3 h-3" />
            </button>
          </div>

          {/* Toggle Raw HTML vs Rendered */}
          <button
            onClick={() => setShowRawHtml(!showRawHtml)}
            className={`px-2.5 py-1 rounded-lg text-xs font-medium border flex items-center gap-1.5 transition-colors cursor-pointer ${
              showRawHtml
                ? 'bg-sky-500/20 text-sky-300 border-sky-500/40'
                : 'bg-slate-800/80 text-slate-300 hover:text-white border-slate-700/60'
            }`}
            title="HTML Kaynak Kodu ile Render Arasında Geçiş Yap"
          >
            {showRawHtml ? <Eye className="w-3 h-3" /> : <Code2 className="w-3 h-3" />}
            <span className="hidden md:inline">{showRawHtml ? 'Ön İzleme' : 'HTML Kodu'}</span>
          </button>

          {/* Copy HTML */}
          <button
            onClick={handleCopyHtml}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
            title="Oluşturulan HTML Kodunu Kopyala"
          >
            {copiedHtml ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Preview Content Area */}
      <div
        ref={containerRef}
        onScroll={handleScroll}
        onClick={handleContainerClick}
        style={{ fontSize: `${fontSize}px` }}
        className={`flex-1 overflow-y-auto p-6 md:p-8 select-text transition-colors duration-150 ${
          theme === 'light'
            ? 'bg-slate-50 text-slate-900'
            : theme === 'sepia'
            ? 'bg-[#f7f0e1] text-[#2b251d]'
            : 'bg-slate-900 text-slate-100'
        }`}
      >
        {rawMarkdown.trim().length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-8 text-slate-400 space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400">
              <Sparkles className="w-7 h-7" />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="text-base font-semibold text-white">Ön İzleme Alanı Boş</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Sol tarafa markdown yazın veya sağ üstteki <strong>?</strong> butonuna tıklayarak örnek dokümanı hemen görüntüleyin.
              </p>
            </div>
            <button
              onClick={onOpenHelp}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-400 text-slate-950 text-xs font-semibold shadow-md transition-colors cursor-pointer"
            >
              <HelpCircle className="w-4 h-4" />
              <span>Örnek Dokümanı Yükle</span>
            </button>
          </div>
        ) : showRawHtml ? (
          <div className="h-full">
            <pre className="font-mono text-xs leading-relaxed text-sky-300 whitespace-pre-wrap select-all">
              {html}
            </pre>
          </div>
        ) : (
          <div 
            className="markdown-preview max-w-4xl mx-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>

      {/* Preview Bottom Status Bar */}
      <div className="h-7 px-4 border-t border-slate-800 bg-slate-900/90 flex items-center justify-between text-[11px] text-slate-400 select-none shrink-0">
        <div className="flex items-center gap-2">
          <FileCheck2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Canlı Derleme: Aktif</span>
        </div>
        <div className="flex items-center gap-2">
          <span>Tasarım: <strong className="text-slate-300 font-semibold">Enes Öztürk</strong></span>
        </div>
      </div>
    </div>
  );
};
