import React, { useState } from 'react';
import { BookItem } from '../types/book';
import { getBookJavaCode, getMainJavaCode, generateConsoleOutput } from '../utils/javaCode';
import { Copy, Check, Terminal, FileCode, Play, RefreshCw } from 'lucide-react';

interface CodeViewerProps {
  books: BookItem[];
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ books }) => {
  const [activeFile, setActiveFile] = useState<'book' | 'main' | 'console'>('book');
  const [copied, setCopied] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  const bookCode = getBookJavaCode();
  const mainCode = getMainJavaCode(books);
  const consoleOutput = generateConsoleOutput(books);

  const currentContent =
    activeFile === 'book' ? bookCode : activeFile === 'main' ? mainCode : consoleOutput;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunSimulator = () => {
    setIsExecuting(true);
    setActiveFile('console');
    setTimeout(() => {
      setIsExecuting(false);
    }, 400);
  };

  return (
    <section id="code" className="py-8 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              <span>Bölüm 04</span>
              <span aria-hidden="true">·</span>
              <span>Eksiksiz Java Kaynak Kodu</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              Java Sınıf Tasarımı ve Konsol Çıktısı
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Ödev gereksinimlerine birebir uygun, derlenmeye ve teslim edilmeye hazır <code className="font-mono">Book.java</code> ve <code className="font-mono">Main.java</code> kodları.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={handleRunSimulator}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-xs transition-colors"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Simülasyonu Çalıştır</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-stone-700 dark:text-stone-300 bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 rounded-lg border border-stone-200 dark:border-stone-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Kopyalandı</span>
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

        {/* Code IDE Window */}
        <div className="rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 bg-stone-950 shadow-xl">
          {/* Top Bar / Tabs */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-stone-900/90 border-b border-stone-800">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveFile('book')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeFile === 'book'
                    ? 'bg-stone-800 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span>Book.java</span>
              </button>
              <button
                onClick={() => setActiveFile('main')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeFile === 'main'
                    ? 'bg-stone-800 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <FileCode className="w-3.5 h-3.5 text-sky-400" />
                <span>Main.java</span>
              </button>
              <button
                onClick={() => setActiveFile('console')}
                className={`inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-colors ${
                  activeFile === 'console'
                    ? 'bg-stone-800 text-stone-100 shadow-xs'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                <Terminal className="w-3.5 h-3.5 text-emerald-400" />
                <span>Konsol Çıktısı (Terminal)</span>
              </button>
            </div>

            <div className="text-[11px] font-mono text-stone-500 hidden sm:block">
              {activeFile === 'console' ? 'Standard Output' : 'Java 17+ / UTF-8'}
            </div>
          </div>

          {/* Code/Terminal Content */}
          <div className="p-4 sm:p-6 overflow-x-auto max-h-[520px]">
            {isExecuting ? (
              <div className="flex items-center justify-center py-20 text-stone-400 gap-3">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span className="font-mono text-xs">Java programı derleniyor ve yürütülüyor...</span>
              </div>
            ) : (
              <pre className="font-mono text-xs sm:text-sm text-stone-300 leading-relaxed whitespace-pre selection:bg-stone-700">
                {currentContent}
              </pre>
            )}
          </div>

          {/* IDE Status Footer */}
          <div className="px-4 py-2 bg-stone-900 border-t border-stone-800 flex items-center justify-between text-[11px] font-mono text-stone-400">
            <span>Yazar: Enes Öztürk</span>
            <span>TreeSet&lt;Book&gt; · Comparable vs Comparator</span>
          </div>
        </div>
      </div>
    </section>
  );
};
