import React, { useState, useEffect } from 'react';
import { Terminal as TerminalIcon, Play, RotateCcw, Copy, Check, CheckCircle2 } from 'lucide-react';

export const TerminalTab: React.FC = () => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [outputLines, setOutputLines] = useState<string[]>([]);
  const [copied, setCopied] = useState<boolean>(false);

  const fullTerminalScript = [
    '$ javac -d out src/com/enesozturk/multithreading/Main.java',
    '$ java -cp out com.enesozturk.multithreading.Main',
    '==========================================================',
    'Java Multithreading Ödevi - Hazırlayan: Enes Öztürk',
    '==========================================================',
    '[Adım 1] 1\'den 10000\'e kadar sayılar oluşturuluyor...',
    '       -> Ana liste başarıyla oluşturuldu. Toplam eleman: 10000',
    '[Adım 2] Liste 2500\'er elemanlık 4 eşit alt listeye ayrılıyor...',
    '       -> Parça 1 (1 - 2500)    : 2500 eleman',
    '       -> Parça 2 (2501 - 5000) : 2500 eleman',
    '       -> Parça 3 (5001 - 7500) : 2500 eleman',
    '       -> Parça 4 (7501 - 10000): 2500 eleman',
    '[Adım 3] 4 ayrı Thread oluşturulup çalıştırılıyor...',
    ' > [Thread-1 (1-2500)] Görevini tamamladı. (Tek: 1250, Çift: 1250, Toplam: 2500)',
    ' > [Thread-3 (5001-7500)] Görevini tamamladı. (Tek: 1250, Çift: 1250, Toplam: 2500)',
    ' > [Thread-2 (2501-5000)] Görevini tamamladı. (Tek: 1250, Çift: 1250, Toplam: 2500)',
    ' > [Thread-4 (7501-10000)] Görevini tamamladı. (Tek: 1250, Çift: 1250, Toplam: 2500)',
    '',
    '==========================================================',
    'SONUÇLAR VE RAPORLAMA (Çalışma Süresi: 18 ms)',
    '==========================================================',
    'Tek Sayılar Listesi Boyutu : 5000 adet (Beklenen: 5000)',
    'Çift Sayılar Listesi Boyutu: 5000 adet (Beklenen: 5000)',
    'Toplam Ayrıştırılan Sayı   : 10000 adet (Beklenen: 10000)',
    '[DURUM] MÜKEMMEL! Hiçbir veri kaybı olmadan tüm sayılar ayrıştırıldı.',
    '',
    'Ödev Başarıyla Tamamlandı.',
    'İmza: Enes Öztürk',
    '==========================================================',
    'Process finished with exit code 0',
  ];

  const runSimulation = () => {
    setIsRunning(true);
    setOutputLines([]);

    let current = 0;
    const interval = setInterval(() => {
      if (current < fullTerminalScript.length) {
        const nextLine = fullTerminalScript[current];
        setOutputLines((prev) => [...prev, nextLine]);
        current++;
      } else {
        clearInterval(interval);
        setIsRunning(false);
      }
    }, 70);
  };

  useEffect(() => {
    // Initial run on mount
    runSimulation();
  }, []);

  const handleCopy = () => {
    navigator.clipboard.writeText(fullTerminalScript.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-emerald-400">
              <TerminalIcon className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Java Konsol ve Terminal Çıktısı Simülasyonu
              </h2>
              <p className="text-xs text-slate-400">
                Java programı terminalde çalıştırıldığında üretilen standart konsol çıktısı.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={runSimulation}
              disabled={isRunning}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
            >
              {isRunning ? (
                <>
                  <RotateCcw className="w-4 h-4 animate-spin" />
                  <span>Çalıştırılıyor...</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4" />
                  <span>Yeniden Çalıştır (Run)</span>
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Çıktıyı Kopyala</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Terminal Window */}
      <div className="rounded-2xl border border-slate-800 bg-[#0d1117] shadow-2xl overflow-hidden font-mono">
        {/* Terminal Header */}
        <div className="bg-[#161b22] px-4 py-3 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="flex space-x-1.5">
              <div className="w-3 h-3 rounded-full bg-rose-500" />
              <div className="w-3 h-3 rounded-full bg-amber-500" />
              <div className="w-3 h-3 rounded-full bg-emerald-500" />
            </div>
            <span className="ml-2 font-medium text-slate-300">
              enes@ozturk-dev: ~/multithreading-odev (openjdk 21)
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-medium">Terminal Canlı</span>
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 text-xs sm:text-[13px] leading-relaxed max-h-[550px] overflow-y-auto space-y-1">
          {outputLines.map((line, idx) => {
            let textColor = 'text-slate-300';
            if (line.startsWith('$')) {
              textColor = 'text-amber-400 font-bold';
            } else if (line.includes('Enes Öztürk')) {
              textColor = 'text-amber-300 font-bold';
            } else if (line.includes('[BAŞARILI]') || line.includes('[DURUM] MÜKEMMEL')) {
              textColor = 'text-emerald-400 font-bold';
            } else if (line.includes('Thread-')) {
              textColor = 'text-cyan-300';
            } else if (line.startsWith('=')) {
              textColor = 'text-slate-600';
            } else if (line.includes('exit code 0')) {
              textColor = 'text-slate-500 italic';
            }

            return (
              <div key={idx} className={`${textColor} whitespace-pre-wrap`}>
                {line}
              </div>
            );
          })}

          {isRunning && (
            <div className="flex items-center gap-2 text-indigo-400 text-xs pt-1">
              <span className="animate-pulse">_</span>
            </div>
          )}
        </div>
      </div>

      {/* Terminal Commands Guide */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-300">
        <h4 className="font-bold text-white mb-2 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Kendi Bilgisayarınızda (Terminalde) Çalıştırma Adımları:
        </h4>
        <div className="space-y-1.5 font-mono text-[11px] text-slate-400">
          <p>
            1. İndirdiğiniz <strong className="text-amber-400">Main.java</strong> dosyasının bulunduğu dizine gidin.
          </p>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
            javac Main.java
          </div>
          <p>2. Derlenen sınıfı çalıştırın:</p>
          <div className="p-2 rounded bg-slate-950 border border-slate-800 text-emerald-400">
            java com.enesozturk.multithreading.Main
          </div>
        </div>
      </div>
    </div>
  );
};
