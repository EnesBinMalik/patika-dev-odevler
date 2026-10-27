/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Header, ViewMode, ThemeMode } from './components/Header';
import { EditorPanel } from './components/EditorPanel';
import { PreviewPanel } from './components/PreviewPanel';
import { HelpModal } from './components/HelpModal';
import { SAMPLES } from './data/samples';
import { parseMarkdown, calculateStats, MarkdownStats } from './utils/markdownParser';
import './styles/highlight-theme.css';

export default function App() {
  // Initialize with the comprehensive sample so user immediately sees full markdown power
  const [markdown, setMarkdown] = useState<string>(() => {
    const saved = localStorage.getItem('markdown_studio_content');
    return saved !== null ? saved : SAMPLES[0].content;
  });

  const [viewMode, setViewMode] = useState<ViewMode>('split');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('markdown_studio_theme') as ThemeMode;
    return saved || 'dark';
  });
  const [syncScroll, setSyncScroll] = useState<boolean>(true);
  const [helpOpen, setHelpOpen] = useState<boolean>(false);
  const [splitRatio, setSplitRatio] = useState<number>(50); // percentage 20 to 80
  const isDraggingSplitter = useRef(false);

  // References for synchronized scrolling
  const editorScrollRef = useRef<HTMLTextAreaElement | null>(null);
  const previewScrollRef = useRef<HTMLDivElement | null>(null);
  const isScrollingEditor = useRef(false);
  const isScrollingPreview = useRef(false);

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('markdown_studio_content', markdown);
  }, [markdown]);

  useEffect(() => {
    localStorage.setItem('markdown_studio_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Computed parsed HTML and document statistics
  const parsedHtml = parseMarkdown(markdown);
  const stats: MarkdownStats = calculateStats(markdown);

  // Synchronized scroll handlers
  const handleEditorScroll = useCallback(
    (percentage: number) => {
      if (!syncScroll || isScrollingPreview.current) return;
      isScrollingEditor.current = true;
      const previewEl = previewScrollRef.current;
      if (previewEl) {
        const maxScroll = previewEl.scrollHeight - previewEl.clientHeight;
        previewEl.scrollTop = percentage * maxScroll;
      }
      setTimeout(() => {
        isScrollingEditor.current = false;
      }, 50);
    },
    [syncScroll]
  );

  const handlePreviewScroll = useCallback(
    (percentage: number) => {
      if (!syncScroll || isScrollingEditor.current) return;
      isScrollingPreview.current = true;
      const editorEl = editorScrollRef.current;
      if (editorEl) {
        const maxScroll = editorEl.scrollHeight - editorEl.clientHeight;
        editorEl.scrollTop = percentage * maxScroll;
      }
      setTimeout(() => {
        isScrollingPreview.current = false;
      }, 50);
    },
    [syncScroll]
  );

  // Export as .md
  const handleExportMd = () => {
    const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `belge-${new Date().toISOString().slice(0, 10)}.md`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Export as .html
  const handleExportHtml = () => {
    const fullHtmlDoc = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Markdown Belgesi — Enes Öztürk Signature</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; max-width: 850px; margin: 40px auto; padding: 0 20px; color: #1e293b; }
    h1, h2, h3 { border-bottom: 1px solid #e2e8f0; padding-bottom: 0.3em; }
    code { background: #f1f5f9; padding: 2px 6px; border-radius: 4px; font-family: monospace; color: #e11d48; }
    pre { background: #0f172a; color: #f8fafc; padding: 16px; border-radius: 8px; overflow-x: auto; }
    pre code { background: transparent; color: inherit; }
    blockquote { border-left: 4px solid #38bdf8; margin: 0; padding-left: 16px; color: #64748b; font-style: italic; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 8px 12px; text-align: left; }
    th { background: #f8fafc; }
    img { max-width: 100%; border-radius: 6px; }
  </style>
</head>
<body>
  ${parsedHtml}
</body>
</html>`;

    const blob = new Blob([fullHtmlDoc], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `belge-${new Date().toISOString().slice(0, 10)}.html`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Print view
  const handlePrint = () => {
    window.print();
  };

  // Clear document
  const handleClear = () => {
    if (markdown.trim().length > 0 && window.confirm('Tüm metni temizlemek istediğinize emin misiniz?')) {
      setMarkdown('');
    }
  };

  // Insert syntax helper
  const handleInsertSyntax = (syntax: string) => {
    setMarkdown((prev) => {
      return prev ? `${prev}\n\n${syntax}` : syntax;
    });
  };

  // Load sample content
  const handleLoadSample = (content: string) => {
    setMarkdown(content);
  };

  // Splitter drag resize logic
  const handleMouseDownSplitter = () => {
    isDraggingSplitter.current = true;
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingSplitter.current) return;
      const newRatio = (e.clientX / window.innerWidth) * 100;
      if (newRatio >= 20 && newRatio <= 80) {
        setSplitRatio(newRatio);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingSplitter.current) {
        isDraggingSplitter.current = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div 
      className={`h-screen w-screen flex flex-col overflow-hidden select-none transition-colors duration-150 ${
        theme === 'light'
          ? 'bg-slate-100 text-slate-900'
          : theme === 'sepia'
          ? 'bg-[#efe5d5] text-[#332a1f]'
          : 'bg-slate-950 text-slate-100'
      }`}
    >
      {/* Top Bar Header */}
      <Header
        viewMode={viewMode}
        setViewMode={setViewMode}
        theme={theme}
        setTheme={setTheme}
        syncScroll={syncScroll}
        setSyncScroll={setSyncScroll}
        onOpenHelp={() => setHelpOpen(true)}
        onLoadSample={handleLoadSample}
        onClear={handleClear}
        onExportMd={handleExportMd}
        onExportHtml={handleExportHtml}
        onPrint={handlePrint}
      />

      {/* Main Workspace Area (Left: Editor, Right: Preview) */}
      <main className="flex-1 flex overflow-hidden relative">
        {/* Mobile View Switcher Tab Bar */}
        <div className="lg:hidden absolute top-2 right-2 z-10 flex items-center bg-slate-900/90 backdrop-blur rounded-lg border border-slate-700/80 p-0.5 shadow-lg">
          <button
            onClick={() => setViewMode('editor')}
            className={`px-2.5 py-1 text-xs rounded font-medium cursor-pointer ${
              viewMode === 'editor' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
          >
            Editör
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`px-2.5 py-1 text-xs rounded font-medium cursor-pointer ${
              viewMode === 'split' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
          >
            İkili
          </button>
          <button
            onClick={() => setViewMode('preview')}
            className={`px-2.5 py-1 text-xs rounded font-medium cursor-pointer ${
              viewMode === 'preview' ? 'bg-sky-500 text-slate-950 font-semibold' : 'text-slate-300'
            }`}
          >
            Ön İzleme
          </button>
        </div>

        {/* Left Side: Markdown Editor */}
        <div
          style={{
            width:
              viewMode === 'split'
                ? `${splitRatio}%`
                : viewMode === 'editor'
                ? '100%'
                : '0%',
            display: viewMode === 'preview' ? 'none' : 'flex',
          }}
          className="h-full flex-col overflow-hidden transition-all duration-75"
        >
          <EditorPanel
            value={markdown}
            onChange={setMarkdown}
            stats={stats}
            onScroll={handleEditorScroll}
            scrollRef={editorScrollRef}
            theme={theme}
          />
        </div>

        {/* Resizable Divider (Only when split view is active) */}
        {viewMode === 'split' && (
          <div
            onMouseDown={handleMouseDownSplitter}
            className="w-1.5 hover:w-2 bg-slate-800 hover:bg-sky-500 transition-all cursor-col-resize shrink-0 z-10 hidden lg:flex items-center justify-center group"
            title="Sürükleyerek panellerin genişliğini ayarlayın"
          >
            <div className="w-0.5 h-8 bg-slate-600 group-hover:bg-slate-950 rounded-full"></div>
          </div>
        )}

        {/* Right Side: Markdown Preview */}
        <div
          style={{
            width:
              viewMode === 'split'
                ? `${100 - splitRatio}%`
                : viewMode === 'preview'
                ? '100%'
                : '0%',
            display: viewMode === 'editor' ? 'none' : 'flex',
          }}
          className="h-full flex-col overflow-hidden transition-all duration-75"
        >
          <PreviewPanel
            html={parsedHtml}
            rawMarkdown={markdown}
            onUpdateMarkdown={setMarkdown}
            onScroll={handlePreviewScroll}
            scrollRef={previewScrollRef}
            onOpenHelp={() => setHelpOpen(true)}
            theme={theme}
          />
        </div>
      </main>

      {/* Question Mark (?) Modal with Sample Markdown, Live Preview, and Cheat Sheet */}
      <HelpModal
        isOpen={helpOpen}
        onClose={() => setHelpOpen(false)}
        onLoadSample={handleLoadSample}
        onInsertSyntax={handleInsertSyntax}
      />
    </div>
  );
}
