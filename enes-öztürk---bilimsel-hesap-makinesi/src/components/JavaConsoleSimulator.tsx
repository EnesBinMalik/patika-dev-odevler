import React, { useState, useRef, useEffect } from 'react';
import { TemelMatematikMotoru, IleriMatematikMotoru, Polinom, PolinomIslemleri } from '../math/scratchMath';
import { Terminal, Send, RotateCcw, Play, Check } from 'lucide-react';

type TerminalStep =
  | 'MENU'
  | 'TEMEL_S1' | 'TEMEL_OP' | 'TEMEL_S2'
  | 'US_TABAN' | 'US_KUVVET'
  | 'KOK_SAYI'
  | 'TUREV_DERECE' | 'TUREV_KATSAYI' | 'TUREV_SORU' | 'TUREV_X'
  | 'INTEGRAL_DERECE' | 'INTEGRAL_KATSAYI' | 'INTEGRAL_SORU' | 'INTEGRAL_A' | 'INTEGRAL_B'
  | 'FAKT_N'
  | 'MOD_A' | 'MOD_B'
  | 'MUTLAK_SAYI';

interface LogEntry {
  type: 'output' | 'input' | 'system' | 'header';
  text: string;
}

export const JavaConsoleSimulator: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [inputVal, setInputVal] = useState<string>('');
  const [currentStep, setCurrentStep] = useState<TerminalStep>('MENU');
  const [promptText, setPromptText] = useState<string>('Lütfen bir işlem seçiniz (0-8): ');

  // Geçici durum değişkenleri (Scanner döngüsü)
  const tempState = useRef<{
    s1?: number;
    op?: string;
    s2?: number;
    taban?: number;
    us?: number;
    derece?: number;
    katsayilar?: number[];
    katsayiIndex?: number;
    polinom?: Polinom;
    altLimit?: number;
  }>({});

  const terminalEndRef = useRef<HTMLDivElement>(null);

  const initConsole = () => {
    tempState.current = {};
    setCurrentStep('MENU');
    setPromptText('Lütfen bir işlem seçiniz (0-8): ');
    setLogs([
      {
        type: 'header',
        text: '==================================================================\n       ENES ÖZTÜRK - BİLİMSEL HESAP MAKİNESİ (JAVA OOP)\n       Hazır Sınıflar (Math vb.) Kullanılmadan Geliştirilmiştir\n=================================================================='
      },
      {
        type: 'output',
        text: '------------------------- İŞLEM MENÜSÜ ---------------------------\n1 - Dört Temel İşlem (+, -, *, /)\n2 - Üs Alma (x^y)\n3 - Karekök Alma (√x)\n4 - Türev Alma (Polinom)\n5 - İntegral Alma (Belirsiz ve Belirli)\n6 - Faktöriyel Hesaplama (n!)\n7 - Mod Alma (a % b)\n8 - Mutlak Değer Hesaplama (|x|)\n0 - Çıkış\n------------------------------------------------------------------'
      }
    ]);
  };

  useEffect(() => {
    initConsole();
  }, []);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  const addLog = (type: LogEntry['type'], text: string) => {
    setLogs((prev) => [...prev, { type, text }]);
  };

  const handleCommand = (rawInput: string) => {
    const input = rawInput.trim();
    if (!input && currentStep !== 'TUREV_SORU' && currentStep !== 'INTEGRAL_SORU') return;

    addLog('input', `> ${input}`);
    setInputVal('');

    try {
      switch (currentStep) {
        case 'MENU': {
          const choice = parseInt(input);
          if (isNaN(choice) || choice < 0 || choice > 8) {
            addLog('output', 'Hatalı seçim! Lütfen 0 ile 8 arasında bir değer giriniz.\n');
            break;
          }

          if (choice === 1) {
            setCurrentStep('TEMEL_S1');
            setPromptText('İlk sayıyı giriniz: ');
          } else if (choice === 2) {
            setCurrentStep('US_TABAN');
            setPromptText('Taban sayısını giriniz: ');
          } else if (choice === 3) {
            setCurrentStep('KOK_SAYI');
            setPromptText('Karekökü alınacak pozitif sayıyı giriniz: ');
          } else if (choice === 4) {
            setCurrentStep('TUREV_DERECE');
            setPromptText('Denklemin derecesini giriniz (n): ');
          } else if (choice === 5) {
            setCurrentStep('INTEGRAL_DERECE');
            setPromptText('Denklemin derecesini giriniz (n): ');
          } else if (choice === 6) {
            setCurrentStep('FAKT_N');
            setPromptText('Faktöriyeli hesaplanacak tam sayıyı giriniz (0-20): ');
          } else if (choice === 7) {
            setCurrentStep('MOD_A');
            setPromptText('Bölünen sayıyı (a) giriniz: ');
          } else if (choice === 8) {
            setCurrentStep('MUTLAK_SAYI');
            setPromptText('Mutlak değeri alınacak sayıyı giriniz: ');
          } else if (choice === 0) {
            addLog('output', 'Bilimsel Hesap Makinesi kapatılıyor. İyi günler dileriz!\nProje Sahibi: ENES ÖZTÜRK');
            setCurrentStep('MENU');
            setPromptText('Yeniden başlatmak için 1 yazınız: ');
          }
          break;
        }

        // --- 4 Temel İşlem Akışı ---
        case 'TEMEL_S1': {
          const s1 = parseFloat(input);
          if (isNaN(s1)) throw new Error('Geçersiz sayı formatı!');
          tempState.current.s1 = s1;
          setCurrentStep('TEMEL_OP');
          setPromptText('İşlem seçiniz (+, -, *, /): ');
          break;
        }
        case 'TEMEL_OP': {
          if (!['+', '-', '*', '/'].includes(input)) throw new Error('Yalnızca +, -, * veya / giriniz!');
          tempState.current.op = input;
          setCurrentStep('TEMEL_S2');
          setPromptText('İkinci sayıyı giriniz: ');
          break;
        }
        case 'TEMEL_S2': {
          const s2 = parseFloat(input);
          if (isNaN(s2)) throw new Error('Geçersiz sayı formatı!');
          const s1 = tempState.current.s1!;
          const op = tempState.current.op!;

          let res = 0;
          if (op === '+') res = TemelMatematikMotoru.topla(s1, s2);
          else if (op === '-') res = TemelMatematikMotoru.cikar(s1, s2);
          else if (op === '*') res = TemelMatematikMotoru.carp(s1, s2);
          else if (op === '/') res = TemelMatematikMotoru.bol(s1, s2);

          addLog('output', `[Java TemelMatematik]: ${s1} ${op} ${s2} = ${res}\n`);
          showMenuAgain();
          break;
        }

        // --- Üs Alma Akışı ---
        case 'US_TABAN': {
          const t = parseFloat(input);
          if (isNaN(t)) throw new Error('Geçersiz taban sayısı!');
          tempState.current.taban = t;
          setCurrentStep('US_KUVVET');
          setPromptText('Üs (kuvvet) değerini giriniz: ');
          break;
        }
        case 'US_KUVVET': {
          const u = parseFloat(input);
          if (isNaN(u)) throw new Error('Geçersiz üs değeri!');
          const t = tempState.current.taban!;
          const { sonuc, yontem } = IleriMatematikMotoru.usAl(t, u);
          addLog('output', `[Java IleriMatematik]: ${t}^${u} = ${sonuc}\nYöntem: ${yontem}\n`);
          showMenuAgain();
          break;
        }

        // --- Karekök Akışı ---
        case 'KOK_SAYI': {
          const s = parseFloat(input);
          if (isNaN(s)) throw new Error('Geçersiz sayı!');
          const { sonuc, adimlar } = IleriMatematikMotoru.karekok(s);
          addLog('output', `[Java IleriMatematik]: √${s} = ${sonuc}`);
          addLog('output', `Newton-Raphson Yakınsama Adımları (${adimlar.length} adım):\n` +
            adimlar.map(a => `  #${a.iteration}: x = ${a.guess.toFixed(8)} -> ${a.nextGuess.toFixed(8)} (fark: ${a.difference.toExponential(2)})`).join('\n') + '\n');
          showMenuAgain();
          break;
        }

        // --- Türev Akışı ---
        case 'TUREV_DERECE': {
          const deg = parseInt(input);
          if (isNaN(deg) || deg < 0 || deg > 10) throw new Error('Derece 0 ile 10 arasında bir tam sayı olmalıdır!');
          tempState.current.derece = deg;
          tempState.current.katsayilar = [];
          tempState.current.katsayiIndex = deg;
          setCurrentStep('TUREV_KATSAYI');
          setPromptText(`x^${deg} teriminin katsayısı: `);
          break;
        }
        case 'TUREV_KATSAYI': {
          const c = parseFloat(input);
          if (isNaN(c)) throw new Error('Geçersiz katsayı!');
          tempState.current.katsayilar!.push(c);
          tempState.current.katsayiIndex!--;

          if (tempState.current.katsayiIndex! >= 0) {
            setPromptText(`x^${tempState.current.katsayiIndex} teriminin katsayısı: `);
          } else {
            // Polinom tamamlandı
            const pol = Polinom.azalanDerecedenUret(tempState.current.katsayilar!);
            const turevRes = PolinomIslemleri.turevAl(pol);
            tempState.current.polinom = turevRes.turevPolinom;

            addLog('output', `\nGirilen Fonksiyon : f(x)  = ${pol.formataDonustur()}`);
            addLog('output', `Türev Fonksiyonu  : f'(x) = ${turevRes.turevMetni}`);
            addLog('output', 'Uygulanan Türev Adımları:\n' + turevRes.adimlar.map(a => '  • ' + a).join('\n'));

            setCurrentStep('TUREV_SORU');
            setPromptText('Türevi belirli bir x noktasında hesaplamak ister misiniz? (E/H): ');
          }
          break;
        }
        case 'TUREV_SORU': {
          if (input.toUpperCase() === 'E') {
            setCurrentStep('TUREV_X');
            setPromptText('x değerini giriniz: ');
          } else {
            showMenuAgain();
          }
          break;
        }
        case 'TUREV_X': {
          const xVal = parseFloat(input);
          if (isNaN(xVal)) throw new Error('Geçersiz x değeri!');
          const res = tempState.current.polinom!.degerHesapla(xVal);
          addLog('output', `Sonuç: f'(${xVal}) = ${res}\n`);
          showMenuAgain();
          break;
        }

        // --- İntegral Akışı ---
        case 'INTEGRAL_DERECE': {
          const deg = parseInt(input);
          if (isNaN(deg) || deg < 0 || deg > 10) throw new Error('Derece 0 ile 10 arasında bir tam sayı olmalıdır!');
          tempState.current.derece = deg;
          tempState.current.katsayilar = [];
          tempState.current.katsayiIndex = deg;
          setCurrentStep('INTEGRAL_KATSAYI');
          setPromptText(`x^${deg} teriminin katsayısı: `);
          break;
        }
        case 'INTEGRAL_KATSAYI': {
          const c = parseFloat(input);
          if (isNaN(c)) throw new Error('Geçersiz katsayı!');
          tempState.current.katsayilar!.push(c);
          tempState.current.katsayiIndex!--;

          if (tempState.current.katsayiIndex! >= 0) {
            setPromptText(`x^${tempState.current.katsayiIndex} teriminin katsayısı: `);
          } else {
            const pol = Polinom.azalanDerecedenUret(tempState.current.katsayilar!);
            const intRes = PolinomIslemleri.belirsizIntegralAl(pol);
            tempState.current.polinom = pol;

            addLog('output', `\nGirilen Fonksiyon  : f(x) = ${pol.formataDonustur()}`);
            addLog('output', `Belirsiz İntegral  : ∫ f(x) dx = ${intRes.integralMetni}`);
            addLog('output', 'İntegrasyon Adımları:\n' + intRes.adimlar.map(a => '  • ' + a).join('\n'));

            setCurrentStep('INTEGRAL_SORU');
            setPromptText('Belirli integral (alan hesabı) yapmak ister misiniz? (E/H): ');
          }
          break;
        }
        case 'INTEGRAL_SORU': {
          if (input.toUpperCase() === 'E') {
            setCurrentStep('INTEGRAL_A');
            setPromptText('Alt sınır (a): ');
          } else {
            showMenuAgain();
          }
          break;
        }
        case 'INTEGRAL_A': {
          const a = parseFloat(input);
          if (isNaN(a)) throw new Error('Geçersiz alt sınır!');
          tempState.current.altLimit = a;
          setCurrentStep('INTEGRAL_B');
          setPromptText('Üst sınır (b): ');
          break;
        }
        case 'INTEGRAL_B': {
          const b = parseFloat(input);
          if (isNaN(b)) throw new Error('Geçersiz üst sınır!');
          const a = tempState.current.altLimit!;
          const pol = tempState.current.polinom!;
          const belirli = PolinomIslemleri.belirliIntegralAl(pol, a, b);

          addLog('output', `Belirli İntegral: ∫_{${a}}^{${b}} f(x) dx = ${belirli.sonuc}`);
          addLog('output', 'Hesaplama Aşamaları:\n' + belirli.adimlar.map(ad => '  • ' + ad).join('\n') + '\n');
          showMenuAgain();
          break;
        }

        // --- Faktöriyel Akışı ---
        case 'FAKT_N': {
          const n = parseInt(input);
          if (isNaN(n)) throw new Error('Geçersiz tam sayı!');
          const { sonuc, adimlar } = IleriMatematikMotoru.faktoriyel(n);
          addLog('output', `[Java IleriMatematik]: ${n}! = ${sonuc}`);
          addLog('output', adimlar.join('\n') + '\n');
          showMenuAgain();
          break;
        }

        // --- Mod Akışı ---
        case 'MOD_A': {
          const a = parseFloat(input);
          if (isNaN(a)) throw new Error('Geçersiz sayı!');
          tempState.current.s1 = a;
          setCurrentStep('MOD_B');
          setPromptText('Bölen sayıyı (b) giriniz: ');
          break;
        }
        case 'MOD_B': {
          const b = parseFloat(input);
          if (isNaN(b)) throw new Error('Geçersiz bölen!');
          const a = tempState.current.s1!;
          const m = TemelMatematikMotoru.modAl(a, b);
          addLog('output', `[Java TemelMatematik]: ${a} mod ${b} = ${m}\n`);
          showMenuAgain();
          break;
        }

        // --- Mutlak Değer Akışı ---
        case 'MUTLAK_SAYI': {
          const s = parseFloat(input);
          if (isNaN(s)) throw new Error('Geçersiz sayı!');
          const res = TemelMatematikMotoru.mutlakDeger(s);
          addLog('output', `[Java TemelMatematik]: |${s}| = ${res}\n`);
          showMenuAgain();
          break;
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Bilinmeyen Hata';
      addLog('output', `[Java Exception]: ${msg}\n`);
      showMenuAgain();
    }
  };

  const showMenuAgain = () => {
    tempState.current = {};
    setCurrentStep('MENU');
    setPromptText('Lütfen bir işlem seçiniz (0-8): ');
    addLog(
      'output',
      '------------------------------------------------------------------\n1-Dört İşlem, 2-Üs Alma, 3-Karekök, 4-Türev, 5-İntegral, 6-Faktöriyel, 7-Mod, 8-Mutlak, 0-Çıkış\n------------------------------------------------------------------'
    );
  };

  const handleQuickKey = (num: string) => {
    handleCommand(num);
  };

  return (
    <div className="space-y-4">
      {/* Header bar */}
      <div className="p-4 rounded bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-semibold text-white font-mono">
            Sanal Java Konsolu (Main.java CLI)
          </h2>
          <span className="text-xs font-mono text-slate-500">· Enes Öztürk</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={initConsole}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded border border-slate-700 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Konsolu Sıfırla</span>
          </button>
        </div>
      </div>

      {/* Terminal Screen */}
      <div className="bg-slate-950 border border-slate-800 rounded-lg shadow-2xl overflow-hidden font-mono text-xs">
        {/* Terminal Title Bar */}
        <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
            <span className="ml-2 text-slate-400 text-[11px]">java -cp . Main (JVM Simulator)</span>
          </div>
          <span className="text-cyan-400 text-[11px]">Enes Öztürk Sürümü</span>
        </div>

        {/* Output Area */}
        <div className="p-4 max-h-[460px] min-h-[340px] overflow-y-auto space-y-2 select-text leading-relaxed">
          {logs.map((log, i) => (
            <div key={i} className="whitespace-pre-wrap">
              {log.type === 'header' && (
                <div className="text-cyan-300 font-bold bg-cyan-950/20 p-2.5 rounded border border-cyan-500/20">
                  {log.text}
                </div>
              )}
              {log.type === 'input' && (
                <div className="text-amber-300 font-bold">{log.text}</div>
              )}
              {log.type === 'output' && (
                <div className="text-slate-300">{log.text}</div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Terminal Input Line */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCommand(inputVal);
          }}
          className="p-3 bg-slate-900/90 border-t border-slate-800 flex items-center gap-2"
        >
          <span className="text-cyan-400 font-bold shrink-0">{promptText}</span>
          <input
            type="text"
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent border-none text-white focus:outline-none font-mono text-xs"
            placeholder="Değeri yazıp Enter'a basınız..."
          />
          <button
            type="submit"
            className="px-3 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded text-xs transition-colors flex items-center gap-1"
          >
            <span>Gönder</span>
            <Send className="w-3 h-3" />
          </button>
        </form>
      </div>

      {/* Quick Option Buttons for Easy Mobile/Click Access */}
      <div className="p-3 bg-slate-900 border border-slate-800 rounded space-y-2">
        <div className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Hızlı Menü Tuşları:
        </div>
        <div className="flex items-center gap-1.5 flex-wrap">
          {[
            { label: '1 - Temel İşlemler', val: '1' },
            { label: '2 - Üs Alma', val: '2' },
            { label: '3 - Karekök', val: '3' },
            { label: '4 - Türev', val: '4' },
            { label: '5 - İntegral', val: '5' },
            { label: '6 - Faktöriyel', val: '6' },
            { label: '7 - Mod', val: '7' },
            { label: '8 - Mutlak', val: '8' },
            { label: '0 - Çıkış', val: '0' },
          ].map((btn) => (
            <button
              key={btn.val}
              onClick={() => handleQuickKey(btn.val)}
              className="px-2.5 py-1 text-xs font-mono bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition-colors"
            >
              {btn.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
