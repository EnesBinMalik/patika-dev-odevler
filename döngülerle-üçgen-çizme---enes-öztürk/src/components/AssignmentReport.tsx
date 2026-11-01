import React from 'react';
import { Printer, Download, CheckCircle, ShieldCheck, Award } from 'lucide-react';
import { ucgen } from '../utils/triangleGenerators';

export const AssignmentReport: React.FC = () => {
  const output15 = ucgen(15, 'O', true);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Editorial Header & Print Action */}
      <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 mb-1">
            <span>Akademik Doküman</span>
            <span aria-hidden="true">·</span>
            <span>Ödev Teslim Raporu</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Ödev Analiz ve Sunum Raporu
          </h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400 max-w-2xl text-balance">
            Enes Öztürk imzalı resmi ödev teslim formu. Algoritma açıklaması, karmaşıklık analizi ve test çıktılarını içerir.
          </p>
        </div>

        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-xs transition-colors shrink-0"
        >
          <Printer className="w-4 h-4" />
          <span>Yazdır / PDF Olarak Kaydet</span>
        </button>
      </div>

      {/* Formal Paper / Assignment Document */}
      <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-sm space-y-8 text-slate-900 dark:text-slate-100 print:shadow-none print:border-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
          <div>
            <span className="text-xs font-bold tracking-widest uppercase text-slate-500 dark:text-slate-400 block mb-1">
              BİLGİSAYAR MÜHENDİSLİĞİ / YAZILIM PROGRAMLAMA ÖDEVİ
            </span>
            <h2 className="text-2xl font-bold tracking-tight">
              Döngüler İle Parametrik Üçgen Çizimi
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
              While ve For Döngülerinin Birlikte Kullanımı Algoritması
            </p>
          </div>

          <div className="text-left sm:text-right text-xs space-y-1 font-mono text-slate-600 dark:text-slate-400">
            <div>Öğrenci: <strong className="text-slate-900 dark:text-white text-sm">Enes Öztürk</strong></div>
            <div>Fonksiyon: <code className="font-bold text-indigo-600 dark:text-indigo-400">ucgen(15)</code></div>
            <div>Tarih: {new Date().toLocaleDateString('tr-TR')}</div>
          </div>
        </div>

        {/* 1. Problem Statement */}
        <div className="space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span>1. Ödev İsterleri ve Problem Tanımı</span>
          </h3>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 text-sm leading-relaxed space-y-2">
            <p>
              <strong>Amaç:</strong> Parametre olarak aldığı değer kadar satırı olan bir üçgen çizen bir fonksiyon yazılması istenmiştir.
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-600 dark:text-slate-300">
              <li>Fonksiyon içerisinde <strong>while</strong> ve <strong>for</strong> döngülerinin her ikisi de kullanılmalıdır.</li>
              <li>Örnek fonksiyon çağrısı: <code className="font-mono text-xs bg-slate-200 dark:bg-slate-700 px-1 py-0.5 rounded">ucgen(15);</code></li>
              <li>Çıktı her satırda satır numarası kadar &apos;O&apos; karakteri içermelidir.</li>
              <li>Ödev <strong className="text-indigo-600 dark:text-indigo-300">Enes Öztürk</strong> adına imzalanmalıdır.</li>
            </ul>
          </div>
        </div>

        {/* 2. Algorithm Architecture & Approach */}
        <div className="space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span>2. Algoritmik Yaklaşım ve Döngülerin Rolü</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                Dış Döngü: WHILE (Satır Kontrolü)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <code className="font-mono text-indigo-600 dark:text-indigo-300">while (i &lt;= satirSayisi)</code> döngüsü 1. satırdan başlayıp istenen satır sayısına (örneğin 15) kadar devam eder. Her turda satır sayacı <code className="font-mono">i</code> birer birer artırılır.
              </p>
            </div>

            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 space-y-2">
              <h4 className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                İç Döngü: FOR (Karakter Basımı)
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <code className="font-mono text-emerald-600 dark:text-emerald-300">for (let j = 0; j &lt; i; j++)</code> döngüsü, bulunulan <code className="font-mono">i</code>. satırda tam olarak <code className="font-mono">i</code> adet &apos;O&apos; karakterini aralarına boşluk koyarak yan yana dizmektedir.
              </p>
            </div>
          </div>
        </div>

        {/* 3. Mathematical & Complexity Analysis */}
        <div className="space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span>3. Matematiksel Analiz ve Karmaşıklık</span>
          </h3>
          <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-800 text-sm space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center font-mono text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <span className="text-slate-500 font-sans block mb-1">Toplam Karakter Sayısı</span>
                <span className="text-base font-bold text-slate-900 dark:text-white">120 Karakter</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">15*(15+1)/2</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <span className="text-slate-500 font-sans block mb-1">Zaman Karmaşıklığı (Time)</span>
                <span className="text-base font-bold text-indigo-600 dark:text-indigo-400">O(n²)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">İç içe döngü çarpımı</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-lg">
                <span className="text-slate-500 font-sans block mb-1">Bellek Karmaşıklığı (Space)</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">O(n)</span>
                <span className="text-[10px] text-slate-400 block mt-0.5">Satır tampon belleği</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. Verified Output for ucgen(15) */}
        <div className="space-y-3">
          <h3 className="text-base font-bold flex items-center gap-2 text-indigo-600 dark:text-indigo-400">
            <span>4. Test Çıktısı: ucgen(15) Ekran Görüntüsü</span>
          </h3>
          <div className="p-5 rounded-xl bg-slate-950 font-mono text-xs sm:text-sm text-emerald-400 border border-slate-800 overflow-x-auto leading-relaxed">
            {output15.map((row, idx) => (
              <div key={idx} className="flex items-baseline">
                <span className="w-8 text-slate-600 text-right pr-3 select-none text-xs">
                  {idx + 1 <= 15 ? idx + 1 : '✦'}
                </span>
                <span className={idx >= 15 ? 'text-amber-400 font-bold' : 'tracking-widest'}>
                  {row}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 5. Formal Signature Section */}
        <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs text-slate-500 uppercase tracking-wider block">ÖDEV SAHİBİ VE İMZA</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">Enes Öztürk</span>
            </div>
          </div>

          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200 dark:border-slate-800 text-xs font-mono text-slate-600 dark:text-slate-400">
            <div>İmza Kodu: <strong className="text-slate-800 dark:text-slate-200">ENES-OZTURK-UCGEN-2026</strong></div>
            <div>Onay: <strong className="text-emerald-600 dark:text-emerald-400">WHILE + FOR DOĞRULANDI</strong></div>
          </div>
        </div>
      </div>
    </div>
  );
};
