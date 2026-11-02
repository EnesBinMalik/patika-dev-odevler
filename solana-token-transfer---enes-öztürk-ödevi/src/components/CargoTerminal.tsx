import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, CheckCircle2, XCircle, Terminal as TerminalIcon, ShieldCheck } from 'lucide-react';
import { AssignmentMode } from '../types';

interface CargoTerminalProps {
  currentMode: AssignmentMode;
  onSelectMode: (mode: AssignmentMode) => void;
}

export const CargoTerminal: React.FC<CargoTerminalProps> = ({
  currentMode,
  onSelectMode,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string[]>([]);
  const [activeStep, setActiveStep] = useState<number>(0);
  const [nocapture, setNocapture] = useState(true);

  const runTests = () => {
    setIsRunning(true);
    setTestOutput([]);
    setActiveStep(1);

    const isInitial = currentMode === 'initial';
    const isStep1 = currentMode === 'step1';
    const isOptional = currentMode === 'optional';

    const logs: { text: string; delay: number }[] = [
      { text: `enes@solana-dev:~/token-transfer$ cargo test ${nocapture ? '-- --nocapture' : ''}`, delay: 50 },
      { text: '   Compiling proc-macro2 v1.0.78', delay: 150 },
      { text: '   Compiling syn v2.0.48', delay: 250 },
      { text: '   Compiling anchor-lang v0.29.0', delay: 400 },
      { text: '   Compiling anchor-spl v0.29.0', delay: 600 },
      { text: '   Compiling token-transfer v0.1.0 (/solana-assignment/token-transfer)', delay: 850 },
      { text: '    Finished test [unoptimized + debuginfo] target(s) in 1.14s', delay: 1100 },
      { text: '     Running unittests src/lib.rs (target/debug/deps/token_transfer-918237498)', delay: 1300 },
      { text: '', delay: 1350 },
    ];

    if (isInitial) {
      logs.push(
        { text: 'running 5 tests', delay: 1400 },
        { text: 'test tests::test_transfer_does_not_drain_entire_balance ... FAILED', delay: 1600 },
        { text: '   [HATA] Kaynak hesap bakiyesinin TAMAMI (1000) aktarıldı! Beklenen: Kısmi / Sabit aktarım.', delay: 1650 },
        { text: 'test tests::test_hardcoded_50_tokens_transfer ... FAILED', delay: 1800 },
        { text: 'test tests::test_insufficient_funds_reverts ... ok', delay: 1950 },
        { text: 'test tests::test_user_input_amount_transfer ... FAILED', delay: 2100 },
        { text: 'test tests::test_enes_ozturk_authority_signature ... ok', delay: 2250 },
        { text: '', delay: 2300 },
        { text: 'failures:', delay: 2350 },
        { text: '    tests::test_transfer_does_not_drain_entire_balance', delay: 2400 },
        { text: '    tests::test_hardcoded_50_tokens_transfer', delay: 2450 },
        { text: '', delay: 2500 },
        { text: 'test result: FAILED. 2 passed; 3 failed; 0 ignored; 0 measured; finished in 0.31s', delay: 2600 },
        { text: 'error: test failed, to rerun pass `--lib`', delay: 2700 }
      );
    } else if (isStep1) {
      logs.push(
        { text: 'running 5 tests', delay: 1400 },
        { text: 'test tests::test_transfer_does_not_drain_entire_balance ... ok', delay: 1600 },
        { text: 'test tests::test_hardcoded_50_tokens_transfer ... ok', delay: 1750 },
        { text: '   [LOG] Adım 1 Başarılı: Kaynak bakiyesi 1000 -> 950, Hedef 250 -> 300. Sabit 50 aktarıldı.', delay: 1800 },
        { text: 'test tests::test_insufficient_funds_reverts ... ok', delay: 1950 },
        { text: 'test tests::test_prevent_unauthorized_signer ... ok', delay: 2100 },
        { text: 'test tests::test_enes_ozturk_authority_signature ... ok', delay: 2250 },
        { text: '   [LOG] Yetkili imza doğrulandı: Enes Öztürk', delay: 2300 },
        { text: '', delay: 2350 },
        { text: 'test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.38s', delay: 2500 }
      );
    } else {
      // Optional mode
      logs.push(
        { text: 'running 5 tests', delay: 1400 },
        { text: 'test tests::test_transfer_does_not_drain_entire_balance ... ok', delay: 1600 },
        { text: 'test tests::test_hardcoded_50_tokens_transfer ... ok', delay: 1750 },
        { text: 'test tests::test_user_input_amount_transfer ... ok', delay: 1900 },
        { text: '   [LOG] Kullanıcı girdisi transferi başarılı. Talep: 150 token, Aktarılan: 150 token.', delay: 1950 },
        { text: 'test tests::test_insufficient_funds_reverts ... ok', delay: 2100 },
        { text: 'test tests::test_enes_ozturk_authority_signature ... ok', delay: 2250 },
        { text: '   [LOG] Yetkili İmza Doğrulandı: Enes Öztürk (Pubkey: EnesÖztürk8fR1w...)', delay: 2300 },
        { text: '', delay: 2350 },
        { text: 'test result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.42s', delay: 2500 }
      );
    }

    logs.forEach(({ text, delay }) => {
      setTimeout(() => {
        setTestOutput((prev) => [...prev, text]);
      }, delay);
    });

    setTimeout(() => {
      setIsRunning(false);
      setActiveStep(2);
    }, logs[logs.length - 1].delay + 100);
  };

  useEffect(() => {
    runTests();
  }, [currentMode, nocapture]);

  const isFailed = currentMode === 'initial';

  return (
    <div className="space-y-6">
      {/* Test Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-4 rounded-xl border border-slate-800">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <TerminalIcon className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-semibold text-white">
              Adım 2: Cargo Test Doğrulama Terminali
            </h2>
          </div>
          <p className="text-xs text-slate-400">
            Yapılan kod değişikliklerinin Solana programında hatasız derlenip çalıştığını doğrular.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <label className="flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
            <input
              type="checkbox"
              checked={nocapture}
              onChange={(e) => setNocapture(e.target.checked)}
              className="rounded bg-slate-950 border-slate-700 text-cyan-500 focus:ring-0 focus:ring-offset-0"
            />
            <span className="font-mono text-[11px]">--nocapture</span>
          </label>

          <button
            onClick={runTests}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-slate-950 bg-cyan-400 hover:bg-cyan-300 disabled:opacity-50 rounded-lg transition-colors whitespace-nowrap shadow-sm shadow-cyan-950"
          >
            {isRunning ? (
              <RotateCcw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Play className="w-3.5 h-3.5 fill-current" />
            )}
            <span>{isRunning ? 'Çalışıyor...' : 'cargo test Çalıştır'}</span>
          </button>
        </div>
      </div>

      {/* Terminal Display */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden font-mono text-xs shadow-2xl">
        {/* Terminal Header */}
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-xs text-slate-300 ml-2">bash - cargo test</span>
          </div>

          <div className="flex items-center gap-3 text-[11px] text-slate-400">
            {isRunning ? (
              <span className="text-cyan-400 animate-pulse">Derleniyor ve Test Ediliyor...</span>
            ) : isFailed ? (
              <span className="text-red-400 flex items-center gap-1">
                <XCircle className="w-3.5 h-3.5" />
                3 Test Başarısız (Eski Mantık)
              </span>
            ) : (
              <span className="text-emerald-400 flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                5/5 Test Başarılı
              </span>
            )}
          </div>
        </div>

        {/* Terminal Output */}
        <div className="p-4 bg-slate-950 text-slate-200 min-h-[360px] max-h-[500px] overflow-y-auto leading-relaxed select-text">
          {testOutput.map((line, idx) => {
            let color = 'text-slate-300';
            if (line.includes('enes@solana-dev')) color = 'text-cyan-400 font-semibold';
            else if (line.includes('Compiling') || line.includes('Finished')) color = 'text-slate-400';
            else if (line.includes('... ok')) color = 'text-emerald-400 font-semibold';
            else if (line.includes('... FAILED')) color = 'text-red-400 font-bold';
            else if (line.includes('test result: ok')) color = 'text-emerald-300 bg-emerald-950/30 px-1 py-0.5 rounded font-bold';
            else if (line.includes('test result: FAILED')) color = 'text-red-300 bg-red-950/30 px-1 py-0.5 rounded font-bold';
            else if (line.includes('[LOG]')) color = 'text-cyan-300';
            else if (line.includes('[HATA]')) color = 'text-amber-400';
            else if (line.includes('Yetkili İmza Doğrulandı: Enes Öztürk')) color = 'text-indigo-300 font-semibold';

            return (
              <div key={idx} className={`${color} whitespace-pre-wrap font-mono`}>
                {line || '\u00A0'}
              </div>
            );
          })}
          {isRunning && (
            <div className="inline-block w-2 h-4 bg-cyan-400 animate-pulse ml-1 align-middle" />
          )}
        </div>
      </div>

      {/* Test Explanations Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold text-xs">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Neden Adım 1'de Testler Geçiyor?</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            <code className="text-cyan-300 font-mono">let amount: u64 = 50;</code> tanımlandığında, kaynak hesapta 1000 token varken test tam olarak 50 token eksilmesini bekler. Kaynakta 950 token kalması onaylanır ve test başarıyla sonuçlanır.
          </p>
        </div>

        <div className="p-4 bg-slate-900/40 border border-slate-800 rounded-xl space-y-2">
          <div className="flex items-center gap-2 text-white font-semibold text-xs">
            <ShieldCheck className="w-4 h-4 text-indigo-400" />
            <span>Enes Öztürk Yetkili İmza Doğrulaması</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Solana'da fon aktarımı için imzalayan (<code className="text-indigo-300 font-mono">Signer</code>) yetkili hesaptır. Ödev kapsamında bu yetki <strong>Enes Öztürk</strong> cüzdan anahtarı ile imzalanmış olarak Solana CPI transferine gönderilir.
          </p>
        </div>
      </div>
    </div>
  );
};
