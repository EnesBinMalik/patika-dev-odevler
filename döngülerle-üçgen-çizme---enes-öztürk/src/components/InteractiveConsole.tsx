import React, { useState } from 'react';
import { Play, Copy, Check, RotateCcw, Download, Terminal, Settings2, Sliders, ShieldCheck, FileText } from 'lucide-react';
import { generateCustomTriangle } from '../utils/triangleGenerators';
import { TriangleType } from '../types';

interface InteractiveConsoleProps {
  onGoToTrace: () => void;
  onGoToCode: () => void;
}

export const InteractiveConsole: React.FC<InteractiveConsoleProps> = ({ onGoToTrace, onGoToCode }) => {
  const [rowCount, setRowCount] = useState<number>(15);
  const [symbol, setSymbol] = useState<string>('O');
  const [triangleType, setTriangleType] = useState<TriangleType>('left');
  const [includeSignature, setIncludeSignature] = useState<boolean>(true);
  const [studentName, setStudentName] = useState<string>('Enes Öztürk');
  const [copiedConsole, setCopiedConsole] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const { lines, totalChars, executionTimeMs } = generateCustomTriangle(
    rowCount,
    symbol,
    triangleType,
    includeSignature,
    studentName
  );

  const handleCopyConsole = () => {
    navigator.clipboard.writeText(lines.join('\n'));
    setCopiedConsole(true);
    setTimeout(() => setCopiedConsole(false), 2000);
  };

  const handleCopyCode = () => {
    const code = `function ucgen(satirSayisi) {
  let i = 1;
  while (i <= satirSayisi) {
    let satir = "";
    for (let j = 0; j < i; j++) {
      satir += (j === 0 ? "O" : " O");
    }
    console.log(satir);
    i++;
  }
  console.log("Ödev Hazırlayan: ${studentName}");
}

ucgen(${rowCount});`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleDownloadTxt = () => {
    const content = `=====================================================
ÖDEV RAPORU: DÖNGÜLER İLE ÜÇGEN ÇİZME
Öğrenci: ${studentName}
İstenen Fonksiyon: ucgen(${rowCount})
Döngü Şartı: while ve for döngülerinin her ikisi kullanılmıştır.
Tarih: ${new Date().toLocaleDateString('tr-TR')}
=====================================================

--- JAVASCRIPT KODU ---
function ucgen(satirSayisi) {
  let i = 1; // Satır kontrolü için WHILE
  while (i <= satirSayisi) {
    let satir = "";
    for (let j = 0; j < i; j++) { // Karakter basımı için FOR
      satir += (j === 0 ? "${symbol}" : " ${symbol}");
    }
    console.log(satir);
    i++;
  }
  console.log("Ödev Hazırlayan: ${studentName}");
}

ucgen(${rowCount});

--- EKRAN ÇIKTISI (${rowCount} Satır) ---
${lines.join('\n')}
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ucgen_${rowCount}_satir_enes_ozturk.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Editorial Overview Section */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
              <span>Programlama Ödevi Çözümü</span>
              <span aria-hidden="true">·</span>
              <span>Algoritmik Döngü Yapıları</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              ucgen({rowCount}) Fonksiyonu ve Konsol Çıktısı
            </h1>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl text-balance">
              Dış döngüde <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">while</code> ile satırlar kontrol edilmekte, iç döngüde <code className="text-xs bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-300">for</code> ile karakterler yazdırılmaktadır.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedCode ? 'Kod Kopyalandı' : 'JS Fonksiyonunu Kopyala'}</span>
            </button>
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors whitespace-nowrap"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ödev Dosyasını İndir (.txt)</span>
            </button>
          </div>
        </div>

        {/* Student Homework Verification Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-semibold text-slate-900 dark:text-slate-200 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              Öğrenci: <strong className="text-indigo-600 dark:text-indigo-400 font-bold">{studentName}</strong>
            </span>
            <span aria-hidden="true">·</span>
            <span>İster: <strong className="font-medium text-slate-700 dark:text-slate-300">while + for döngüsü zorunlu</strong></span>
            <span aria-hidden="true">·</span>
            <span>Varsayılan Parametre: <strong className="font-medium text-slate-700 dark:text-slate-300">15</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onGoToTrace}
              className="text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"
            >
              Adım adım görsel simülatörü aç →
            </button>
          </div>
        </div>
      </div>

      {/* Main Two-Zone Console Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Zone: Controls & Parameters (4 cols) */}
        <div className="lg:col-span-4 space-y-5">
          <div className="bg-white dark:bg-slate-900 rounded-xl p-5 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Parametre Ayarları
              </span>
              <button
                onClick={() => {
                  setRowCount(15);
                  setSymbol('O');
                  setTriangleType('left');
                  setIncludeSignature(true);
                  setStudentName('Enes Öztürk');
                }}
                title="Varsayılan ödev ayarlarına dön"
                className="text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Sıfırla (15)</span>
              </button>
            </div>

            {/* Row Count Slider */}
            <div>
              <div className="flex justify-between items-center mb-1.5 text-xs">
                <label htmlFor="row-slider" className="font-medium text-slate-700 dark:text-slate-300">
                  Satır Sayısı (n):
                </label>
                <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400 text-sm">
                  {rowCount}
                </span>
              </div>
              <input
                id="row-slider"
                type="range"
                min="1"
                max="30"
                value={rowCount}
                onChange={(e) => setRowCount(Number(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
              />
              <div className="flex justify-between gap-1 mt-2">
                {[5, 10, 15, 20, 25].map((preset) => (
                  <button
                    key={preset}
                    onClick={() => setRowCount(preset)}
                    className={`px-2 py-1 text-xs rounded font-mono transition-colors ${
                      rowCount === preset
                        ? 'bg-indigo-600 text-white font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {preset === 15 ? '15 (Ödev)' : preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Character / Symbol Selector */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Karakter / Sembol:
              </label>
              <div className="grid grid-cols-5 gap-1.5">
                {[
                  { label: 'O', val: 'O' },
                  { label: '*', val: '*' },
                  { label: '#', val: '#' },
                  { label: '▲', val: '▲' },
                  { label: '★', val: '★' },
                ].map((item) => (
                  <button
                    key={item.val}
                    onClick={() => setSymbol(item.val)}
                    className={`h-9 flex items-center justify-center text-sm font-mono font-bold rounded-lg border transition-all ${
                      symbol === item.val
                        ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-300 ring-1 ring-indigo-600'
                        : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Triangle Geometry Variant */}
            <div>
              <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                Hizalama Şekli:
              </label>
              <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                <button
                  onClick={() => setTriangleType('left')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                    triangleType === 'left'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Sol (İstenen)
                </button>
                <button
                  onClick={() => setTriangleType('pyramid')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                    triangleType === 'pyramid'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Piramit
                </button>
                <button
                  onClick={() => setTriangleType('inverted')}
                  className={`py-1.5 text-xs font-medium rounded-md transition-all ${
                    triangleType === 'inverted'
                      ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  Ters
                </button>
              </div>
            </div>

            {/* Signature & Name */}
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="sig-toggle" className="text-xs font-medium text-slate-700 dark:text-slate-300">
                  Ödev İmzasını Göster
                </label>
                <input
                  id="sig-toggle"
                  type="checkbox"
                  checked={includeSignature}
                  onChange={(e) => setIncludeSignature(e.target.checked)}
                  className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-4 h-4"
                />
              </div>

              {includeSignature && (
                <div>
                  <label className="block text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                    İmza Metni:
                  </label>
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Code Logic Quick Card */}
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-xl p-4 border border-slate-200 dark:border-slate-800 text-xs space-y-2.5">
            <h2 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              Fonksiyon Algoritma Mantığı
            </h2>
            <div className="space-y-1.5 text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              <p>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">1. while (i &lt;= {rowCount})</strong>: Satır sayacını <code className="font-mono">1</code>&apos;den <code className="font-mono">{rowCount}</code>&apos;e kadar artırır.
              </p>
              <p>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">2. for (j = 0; j &lt; i; j++)</strong>: Her satıra bulunulan satır numarası kadar <code className="font-mono">&apos;{symbol}&apos;</code> ekler.
              </p>
              <p>
                <strong className="text-indigo-600 dark:text-indigo-400 font-mono">3. Karmaşıklık</strong>: Toplam basılan karakter sayısı <code className="font-mono">n*(n+1)/2 = {(rowCount * (rowCount + 1)) / 2}</code> adet ($O(n^2)$).
              </p>
            </div>
            <button
              onClick={onGoToCode}
              className="mt-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline block font-medium"
            >
              Python, C++, Java kodlarını gör →
            </button>
          </div>
        </div>

        {/* Right Zone: Monospaced Terminal Output (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          {/* Terminal Window */}
          <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 shadow-md">
            {/* Terminal Header */}
            <div className="bg-slate-900/90 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
                <span className="ml-2 text-xs font-mono text-slate-400 font-medium">
                  konsol_ciktisi &gt; ucgen({rowCount})
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyConsole}
                  className="flex items-center gap-1 px-2.5 py-1 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors"
                >
                  {copiedConsole ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedConsole ? 'Kopyalandı' : 'Çıktıyı Kopyala'}</span>
                </button>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-4 sm:p-6 overflow-x-auto max-h-[580px] font-mono text-sm leading-relaxed">
              {/* Call indicator */}
              <div className="text-slate-500 text-xs pb-3 mb-3 border-b border-slate-800/80 flex items-center justify-between">
                <span>&gt; ucgen({rowCount}); // while + for döngüleri çalıştırıldı</span>
                <span className="text-[11px] text-slate-500">
                  {totalChars} karakter · {executionTimeMs} ms
                </span>
              </div>

              {/* Triangle rows with line numbers */}
              <div className="space-y-0.5">
                {lines.map((line, idx) => {
                  const isSignature = line.includes('Ödev Hazırlayan') || line.includes('---');
                  return (
                    <div
                      key={idx}
                      className={`flex items-baseline group ${
                        isSignature
                          ? 'text-amber-400 font-semibold pt-2'
                          : 'text-emerald-400 hover:bg-slate-900/60'
                      }`}
                    >
                      <span className="select-none text-slate-600 text-xs w-8 shrink-0 text-right pr-3 font-mono">
                        {isSignature ? '✦' : idx + 1}
                      </span>
                      <span className="whitespace-pre tracking-widest text-[13px] sm:text-sm font-bold font-mono">
                        {line}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* Cursor indicator */}
              <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center gap-2 text-xs text-slate-500">
                <span className="w-2 h-4 bg-emerald-500 inline-block animate-pulse"></span>
                <span>Program başarıyla tamamlandı. Enes Öztürk imzası doğrulandı.</span>
              </div>
            </div>
          </div>

          {/* Output metrics bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Satır Sayısı</span>
              <span className="text-lg font-bold font-mono text-slate-900 dark:text-white">{rowCount}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Toplam Karakter</span>
              <span className="text-lg font-bold font-mono text-indigo-600 dark:text-indigo-400">{totalChars}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">Döngü Sayıları</span>
              <span className="text-xs font-bold font-mono text-emerald-600 dark:text-emerald-400">
                1 While + {rowCount} For
              </span>
            </div>
            <div className="bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 block">İmza Durumu</span>
              <span className="text-xs font-semibold text-slate-900 dark:text-white truncate block">
                {studentName}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
