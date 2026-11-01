import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, X, Maximize2 } from 'lucide-react';
import { Book } from '../types/book';

interface TerminalRunnerProps {
  books: Book[];
  isOpenModal?: boolean;
  onCloseModal?: () => void;
}

export const TerminalRunner: React.FC<TerminalRunnerProps> = ({ books, isOpenModal, onCloseModal }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const generateOutput = () => {
    const lines: string[] = [];
    lines.push("$ javac Book.java Main.java");
    lines.push("$ java Main");
    lines.push("================================================================");
    lines.push("   JAVA 102 - STREAM & LAMBDA KİTAP LİSTESİ ÖDEVİ              ");
    lines.push("   Geliştirici: Enes Öztürk                                     ");
    lines.push("================================================================\n");

    // 1. Initial ArrayList
    lines.push(`>>> 1. Başlangıç Kitap Listesi (Toplam: ${books.length} Kitap)`);
    books.forEach((b) => {
      lines.push(`  • ${b.name} (${b.pageCount} sayfa) - ${b.authorName}`);
    });
    lines.push("");

    // 2. Map<String, String>
    lines.push(">>> 2. Stream ile Üretilen Map<String, String> (Kitap İsmi -> Yazar İsmi)");
    lines.push("----------------------------------------------------------------");
    books.forEach((b) => {
      const paddedName = b.name.padEnd(28, ' ');
      lines.push(`  [Kitap]: ${paddedName} --> [Yazar]: ${b.authorName}`);
    });
    lines.push("----------------------------------------------------------------");
    lines.push(`  Map Toplam Eleman Sayısı: ${books.length}\n`);

    // 3. Filtered list (>100 pages)
    const filtered = books.filter(b => b.pageCount > 100);
    lines.push(">>> 3. Sayfa Sayısı 100'den Fazla Olan Kitaplar Listesi");
    lines.push("----------------------------------------------------------------");
    filtered.forEach((b) => {
      const paddedName = b.name.padEnd(28, ' ');
      const paddedPage = String(b.pageCount).padStart(3, ' ');
      lines.push(`  ✓ ${paddedName} | ${paddedPage} Sayfa | ${b.authorName} (${b.publishDate})`);
    });
    lines.push("----------------------------------------------------------------");
    lines.push(`  100 Sayfadan Fazla Kitap Sayısı: ${filtered.length} / ${books.length}\n`);

    lines.push("================================================================");
    lines.push("   Ödev Başarıyla Tamamlandı! | İmzalı: Enes Öztürk            ");
    lines.push("================================================================");
    lines.push("$ Process finished with exit code 0");

    return lines;
  };

  const runSimulation = () => {
    setIsRunning(true);
    setOutputLines(["$ javac Book.java Main.java", "$ java Main"]);

    const fullLines = generateOutput();
    let index = 2;

    const timer = setInterval(() => {
      if (index < fullLines.length) {
        setOutputLines(prev => [...prev, fullLines[index]]);
        index++;
      } else {
        clearInterval(timer);
        setIsRunning(false);
      }
    }, 45);
  };

  useEffect(() => {
    runSimulation();
  }, [books]);

  const handleCopyOutput = () => {
    navigator.clipboard.writeText(outputLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const content = (
    <div className="rounded-xl border border-slate-800 bg-slate-950 shadow-2xl overflow-hidden font-mono flex flex-col h-full">
      {/* Terminal Header */}
      <div className="px-4 py-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold">
            <TerminalIcon className="w-3.5 h-3.5 text-amber-400" />
            <span>OpenJDK Console — java Main (Enes Öztürk)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={runSimulation}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/20 text-xs transition-colors cursor-pointer disabled:opacity-50"
            title="Kodu yeniden derle ve çalıştır"
          >
            <RotateCcw className={`w-3 h-3 ${isRunning ? 'animate-spin' : ''}`} />
            <span>Yeniden Çalıştır</span>
          </button>

          <button
            onClick={handleCopyOutput}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            title="Konsol çıktısını kopyala"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {isOpenModal && onCloseModal && (
            <button
              onClick={onCloseModal}
              className="p-1 rounded text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Terminal Output Area */}
      <div className="p-4 sm:p-5 overflow-x-auto overflow-y-auto max-h-[500px] text-xs sm:text-[13px] leading-relaxed text-slate-300 space-y-0.5 selection:bg-amber-500/20 selection:text-amber-200">
        {outputLines.map((line, idx) => {
          const isCommand = line.startsWith('$');
          const isHeading = line.startsWith('>>>');
          const isDivider = line.startsWith('===') || line.startsWith('---');
          const isSuccess = line.includes('Başarıyla Tamamlandı') || line.includes('exit code 0');
          const isPassedBook = line.trim().startsWith('✓');

          return (
            <div
              key={idx}
              className={`whitespace-pre ${
                isCommand
                  ? 'text-cyan-400 font-bold'
                  : isHeading
                  ? 'text-amber-400 font-bold mt-2'
                  : isDivider
                  ? 'text-slate-600'
                  : isSuccess
                  ? 'text-emerald-400 font-bold'
                  : isPassedBook
                  ? 'text-emerald-300'
                  : 'text-slate-300'
              }`}
            >
              {line}
            </div>
          );
        })}
        {isRunning && (
          <span className="inline-block w-2 h-4 bg-amber-400 animate-pulse ml-0.5 align-middle" />
        )}
      </div>
    </div>
  );

  if (isOpenModal) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
        <div className="w-full max-w-4xl max-h-[90vh]">
          {content}
        </div>
      </div>
    );
  }

  return content;
};
