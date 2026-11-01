import React, { useState } from 'react';
import { Terminal, Play, RotateCcw, CheckCircle, Code2, Sparkles, HelpCircle } from 'lucide-react';
import { Sekil, Dikdortgen, Kare, Ucgen } from '../models/Sekil';

interface LogItem {
  id: string;
  type: 'info' | 'success' | 'code' | 'result';
  text: string;
  timestamp: string;
}

export const PlaygroundView: React.FC = () => {
  const [logs, setLogs] = useState<LogItem[]>([
    {
      id: 'init-1',
      type: 'info',
      text: '>>> Geometrik Şekiller OOP Canlı Test Konsolu Başlatıldı.',
      timestamp: new Date().toLocaleTimeString()
    },
    {
      id: 'init-2',
      type: 'info',
      text: '>>> Geliştirici & İmza: Enes Öztürk',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);

  const addLog = (type: LogItem['type'], text: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(7),
        type,
        text,
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  const clearLogs = () => {
    setLogs([
      {
        id: 'cleared',
        type: 'info',
        text: 'Konsol temizlendi. Yeni bir test çalıştırabilirsiniz.',
        timestamp: new Date().toLocaleTimeString()
      }
    ]);
  };

  // Test 1: Dikdörtgen
  const runDikdortgenTest = () => {
    addLog('code', 'const d = new Dikdortgen(8, 14);');
    const d = new Dikdortgen(8, 14);
    addLog('result', `» Genişlik: ${d.genislik}, Yükseklik: ${d.yukseklik}`);
    addLog('success', `» d.alanHesapla() => ${d.alanHesapla()} br²`);
    addLog('success', `» d.cevreHesapla() => ${d.cevreHesapla()} br`);
    addLog('result', `» d.bilgiVer() => "${d.bilgiVer()}"`);
    addLog('info', `» d instanceof Sekil => ${d instanceof Sekil}`);
  };

  // Test 2: Kare & Miras Denetimi
  const runKareMirasTest = () => {
    addLog('code', 'const k = new Kare(6); // Dikdortgen kurucusunu çağırır');
    const k = new Kare(6);
    addLog('result', `» k.kenar: ${k.kenar} (genislik=${k.genislik}, yukseklik=${k.yukseklik})`);
    addLog('success', `» k.alanHesapla() => ${k.alanHesapla()} br² [Miras: Dikdortgen]`);
    addLog('success', `» k.cevreHesapla() => ${k.cevreHesapla()} br [Miras: Dikdortgen]`);
    addLog('info', `» k instanceof Kare => ${k instanceof Kare}`);
    addLog('info', `» k instanceof Dikdortgen => ${k instanceof Dikdortgen} (DRY kanıtı!)`);
    addLog('info', `» k instanceof Sekil => ${k instanceof Sekil}`);
  };

  // Test 3: Üçgen & Heron
  const runUcgenTest = () => {
    addLog('code', 'const u = new Ucgen(3, 4, 5); // Pisagor 3-4-5 Dik Üçgeni');
    const u = new Ucgen(3, 4, 5);
    addLog('result', `» Kenarlar: a=${u.a}, b=${u.b}, c=${u.c}`);
    addLog('result', `» Üçgen Türü: ${u.turBelirle()}`);
    addLog('success', `» u.cevreHesapla() => ${u.cevreHesapla()} br (3 + 4 + 5)`);
    addLog('success', `» u.alanHesapla() => ${u.alanHesapla().toFixed(2)} br² (Heron Formülü: u=6, √(6*3*2*1)=6)`);
  };

  // Test 4: Polimorfizm Döngüsü
  const runPolymorphismTest = () => {
    addLog('code', 'const liste: Sekil[] = [new Dikdortgen(4, 5), new Kare(4), new Ucgen(6, 8, 10)];');
    const liste: Sekil[] = [
      new Dikdortgen(4, 5),
      new Kare(4),
      new Ucgen(6, 8, 10)
    ];

    let toplamAlan = 0;
    let toplamCevre = 0;

    liste.forEach((sekil, i) => {
      const a = sekil.alanHesapla();
      const c = sekil.cevreHesapla();
      toplamAlan += a;
      toplamCevre += c;
      addLog('result', `  [${i + 1}] ${sekil.isim}: Alan=${a.toFixed(1)}, Çevre=${c.toFixed(1)}`);
    });

    addLog('success', `» Polimorfik Toplam Alan: ${toplamAlan.toFixed(2)} br²`);
    addLog('success', `» Polimorfik Toplam Çevre: ${toplamCevre.toFixed(2)} br`);
  };

  return (
    <div className="space-y-6">
      {/* Test Scenarios Buttons */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Play className="w-5 h-5 text-indigo-400" />
              <span>Hazır OOP Test Senaryolarını Çalıştır</span>
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Sınıfları gerçek zamanlı derleyip konsola çıktı verir.
            </p>
          </div>
          <button
            onClick={clearLogs}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer self-start sm:self-auto"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Konsolu Temizle</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <button
            onClick={runDikdortgenTest}
            className="p-3 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-indigo-500/50 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-indigo-300 group-hover:text-white flex items-center justify-between">
              <span>Dikdörtgen Testi</span>
              <span className="text-[10px] text-slate-500 font-mono">new Dikdortgen()</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Alan, çevre ve bilgi metotlarını çalıştırır.
            </p>
          </button>

          <button
            onClick={runKareMirasTest}
            className="p-3 rounded-xl bg-emerald-950/20 hover:bg-emerald-950/40 border border-emerald-500/30 hover:border-emerald-500 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-emerald-300 group-hover:text-white flex items-center justify-between">
              <span>Kare & Miras Doğrulama</span>
              <span className="text-[10px] text-emerald-400 font-mono">instanceof</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Kare'nin Dikdörtgen'den türediğini doğrular.
            </p>
          </button>

          <button
            onClick={runUcgenTest}
            className="p-3 rounded-xl bg-amber-950/20 hover:bg-amber-950/40 border border-amber-500/30 hover:border-amber-500 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-amber-300 group-hover:text-white flex items-center justify-between">
              <span>Üçgen & Heron Testi</span>
              <span className="text-[10px] text-amber-400 font-mono">3-4-5</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Heron formülü ile alan ve üçgen türünü hesaplar.
            </p>
          </button>

          <button
            onClick={runPolymorphismTest}
            className="p-3 rounded-xl bg-purple-950/20 hover:bg-purple-950/40 border border-purple-500/30 hover:border-purple-500 text-left transition cursor-pointer group"
          >
            <div className="text-xs font-bold text-purple-300 group-hover:text-white flex items-center justify-between">
              <span>Polimorfizm Dizisi</span>
              <span className="text-[10px] text-purple-400 font-mono">Sekil[]</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Tüm şekilleri tek bir dizide polimorfik olarak toplar.
            </p>
          </button>
        </div>
      </div>

      {/* Terminal Output Window */}
      <div className="rounded-2xl bg-slate-950 border border-slate-800 shadow-2xl overflow-hidden font-code">
        {/* Terminal Title Bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-900 border-b border-slate-800">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/80" />
            <div className="w-3 h-3 rounded-full bg-amber-500/80" />
            <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-400 ml-2 font-mono">
              enes-ozturk-oop-terminal ~ sekil-test-runner
            </span>
          </div>
          <div className="text-[11px] text-indigo-400 font-signature text-base">
            Enes Öztürk
          </div>
        </div>

        {/* Terminal Body */}
        <div className="p-4 max-h-[380px] overflow-y-auto space-y-2 text-xs">
          {logs.map((log) => {
            let color = 'text-slate-300';
            if (log.type === 'code') color = 'text-indigo-400 font-bold';
            if (log.type === 'success') color = 'text-emerald-400 font-semibold';
            if (log.type === 'result') color = 'text-cyan-300';
            if (log.type === 'info') color = 'text-slate-500';

            return (
              <div key={log.id} className="flex items-start gap-2 leading-relaxed">
                <span className="text-slate-600 text-[10px] select-none pt-0.5">[{log.timestamp}]</span>
                <span className={color}>{log.text}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
