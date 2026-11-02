/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { CodeViewer } from './components/CodeViewer';
import { Terminal } from './components/Terminal';
import { InteractiveTestbench } from './components/InteractiveTestbench';
import { Checklist } from './components/Checklist';
import { SignatureCard } from './components/SignatureCard';
import { TheoryGuide } from './components/TheoryGuide';
import { SimulatedRustAccount } from './utils/rustBankingSimulator';
import { BankAccountState, TerminalLog, ResultType } from './types/banking';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'checklist' | 'guide'>('simulator');
  const [activeStepId, setActiveStepId] = useState<number | null>(null);

  // Accounts state
  const [account1, setAccount1] = useState<BankAccountState>({
    accountNumber: 'TR34-0010-8801',
    holderName: 'Enes Öztürk',
    balance: 1500.0,
  });

  const [account2, setAccount2] = useState<BankAccountState>({
    accountNumber: 'TR34-0020-9902',
    holderName: 'Ahmet Yılmaz',
    balance: 750.0,
  });

  const [logs, setLogs] = useState<TerminalLog[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  const [lastResult, setLastResult] = useState<{
    accountNumber: string;
    holderName: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    result: ResultType<void, string>;
  } | null>(null);

  const addLog = useCallback((type: TerminalLog['type'], message: string) => {
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toLocaleTimeString('tr-TR'),
        type,
        message,
      },
    ]);
  }, []);

  // Standard assignment execution (Cargo Run)
  const runStandardAssignment = useCallback(() => {
    setIsRunning(true);
    setLogs([]);

    // Step 0: Cargo compiling output
    addLog('system', '$ cargo run --bin banking_system');
    addLog('compile', '   Compiling banking_system v0.1.0 (/rust/projects/banking_system)');
    addLog('compile', '    Finished `dev` profile [unoptimized + debuginfo] target(s) in 0.38s');
    addLog('system', '     Running `target/debug/banking_system`');
    addLog('divider', '============================================================');
    addLog('info', '🦀 Rust Bankacılık Sistemi & Hata Yönetimi Demo');
    addLog('info', '👤 Geliştirici & İmza: Enes Öztürk');
    addLog('divider', '============================================================\n');

    setTimeout(() => {
      // Create local simulated account instances initialized with fresh values
      const rustAcc1 = new SimulatedRustAccount('TR34-0010-8801', 'Enes Öztürk', 1500.0);
      const rustAcc2 = new SimulatedRustAccount('TR34-0020-9902', 'Ahmet Yılmaz', 750.0);

      addLog('system', '--- Başlangıç Hesap Durumları ---');
      addLog('info', `Hesap 1: ${rustAcc1.accountNumber} (${rustAcc1.holderName}) | Bakiye: ${rustAcc1.balance().toFixed(2)} TL`);
      addLog('info', `Hesap 2: ${rustAcc2.accountNumber} (${rustAcc2.holderName}) | Bakiye: ${rustAcc2.balance().toFixed(2)} TL\n`);

      // [Adım 6] Deposit into account 1 with match
      const depositAmount = 500.0;
      addLog('system', ` [İşlem 1] ${rustAcc1.holderName} hesabına ${depositAmount.toFixed(2)} TL yatırılıyor...`);
      const depositResult = rustAcc1.deposit(depositAmount);

      // match depositResult
      if (depositResult.ok) {
        addLog(
          'success',
          `✅ [BAŞARILI] ${depositAmount.toFixed(2)} TL başarıyla yatırıldı! Güncel Bakiye: ${rustAcc1.balance().toFixed(2)} TL`
        );
      } else {
        addLog('error', `❌ [HATA] Para yatırma başarısız: ${depositResult.error}`);
      }

      addLog('system', '');

      // [Adım 7] Withdraw from account 2 with match
      const withdrawAmount = 300.0;
      addLog('system', ` [İşlem 2] ${rustAcc2.holderName} hesabından ${withdrawAmount.toFixed(2)} TL çekiliyor...`);
      const withdrawResult = rustAcc2.withdraw(withdrawAmount);

      // match withdrawResult
      if (withdrawResult.ok) {
        addLog(
          'success',
          `✅ [BAŞARILI] ${withdrawAmount.toFixed(2)} TL başarıyla çekildi! Güncel Bakiye: ${rustAcc2.balance().toFixed(2)} TL`
        );
      } else {
        addLog('error', `❌ [HATA] Para çekme başarısız: ${withdrawResult.error}`);
      }

      addLog('system', '');

      // [Adım 8] Balance report
      addLog('divider', '============================================================');
      addLog('info', '                  NİHAİ HESAP BAKİYE RAPORU                 ');
      addLog('divider', '============================================================');
      addLog(
        'info',
        `Hesap No: ${rustAcc1.accountNumber} | Sahip: ${rustAcc1.holderName.padEnd(14, ' ')} | Bakiye: ${rustAcc1.balance().toFixed(2)} TL`
      );
      addLog(
        'info',
        `Hesap No: ${rustAcc2.accountNumber} | Sahip: ${rustAcc2.holderName.padEnd(14, ' ')} | Bakiye: ${rustAcc2.balance().toFixed(2)} TL`
      );
      addLog('divider', '============================================================');
      addLog('compile', '✨ İmza: Enes Öztürk | Program başarıyla tamamlandı (exit code: 0).');

      // Update state
      setAccount1(rustAcc1.getState());
      setAccount2(rustAcc2.getState());
      setLastResult({
        accountNumber: rustAcc1.accountNumber,
        holderName: rustAcc1.holderName,
        type: 'deposit',
        amount: depositAmount,
        result: depositResult,
      });
      setIsRunning(false);
    }, 450);
  }, [addLog]);

  // Initial run on mount
  useEffect(() => {
    runStandardAssignment();
  }, [runStandardAssignment]);

  // Negative deposit test
  const handleRunNegativeDepositTest = () => {
    setIsRunning(true);
    addLog('divider', '------------------------------------------------------------');
    addLog('system', '$ test::error_negative_deposit()');
    addLog('info', `🧪 [TEST SENARYOSU] ${account1.holderName} hesabına -100.00 TL yatırılmaya çalışılıyor...`);

    const rustAcc = new SimulatedRustAccount(account1.accountNumber, account1.holderName, account1.balance);
    const result = rustAcc.deposit(-100.0);

    // match result
    if (result.ok) {
      addLog('success', `✅ [BAŞARILI] Tutar yatırıldı.`);
    } else {
      addLog('error', `❌ [MATCH HATA KOLU: Err(e)] Para yatırma reddedildi: "${result.error}"`);
      addLog('system', `ℹ️  Hesap bakiyesi korundu: ${rustAcc.balance().toFixed(2)} TL`);
    }

    setLastResult({
      accountNumber: account1.accountNumber,
      holderName: account1.holderName,
      type: 'deposit',
      amount: -100.0,
      result,
    });

    setIsRunning(false);
  };

  // Insufficient withdrawal test
  const handleRunInsufficientWithdrawTest = () => {
    setIsRunning(true);
    addLog('divider', '------------------------------------------------------------');
    addLog('system', '$ test::error_insufficient_funds()');
    addLog('info', `🧪 [TEST SENARYOSU] ${account2.holderName} hesabından (${account2.balance.toFixed(2)} TL varken) 2500.00 TL çekilmeye çalışılıyor...`);

    const rustAcc = new SimulatedRustAccount(account2.accountNumber, account2.holderName, account2.balance);
    const result = rustAcc.withdraw(2500.0);

    // match result
    if (result.ok) {
      addLog('success', `✅ [BAŞARILI] Tutar çekildi.`);
    } else {
      addLog('error', `❌ [MATCH HATA KOLU: Err(e)] Para çekme reddedildi: "${result.error}"`);
      addLog('system', `ℹ️  Hesap bakiyesi korundu: ${rustAcc.balance().toFixed(2)} TL`);
    }

    setLastResult({
      accountNumber: account2.accountNumber,
      holderName: account2.holderName,
      type: 'withdraw',
      amount: 2500.0,
      result,
    });

    setIsRunning(false);
  };

  // Custom interactive transaction
  const handleExecuteTransaction = (
    accountIndex: 1 | 2,
    type: 'deposit' | 'withdraw',
    amount: number
  ) => {
    const currentAcc = accountIndex === 1 ? account1 : account2;
    const rustAcc = new SimulatedRustAccount(currentAcc.accountNumber, currentAcc.holderName, currentAcc.balance);

    addLog('divider', '------------------------------------------------------------');
    addLog(
      'system',
      `$ account.${type}(${amount.toFixed(2)}) // ${currentAcc.holderName}`
    );

    const result = type === 'deposit' ? rustAcc.deposit(amount) : rustAcc.withdraw(amount);

    if (result.ok) {
      addLog(
        'success',
        `✅ [BAŞARILI / Ok(())] ${currentAcc.holderName} için ${amount.toFixed(2)} TL ${
          type === 'deposit' ? 'yatırıldı' : 'çekildi'
        }. Yeni Bakiye: ${rustAcc.balance().toFixed(2)} TL`
      );
    } else {
      addLog(
        'error',
        `❌ [HATA / Err(String)] ${type === 'deposit' ? 'Para yatırma' : 'Para çekme'} başarısız: ${result.error}`
      );
    }

    if (accountIndex === 1) {
      setAccount1(rustAcc.getState());
    } else {
      setAccount2(rustAcc.getState());
    }

    setLastResult({
      accountNumber: currentAcc.accountNumber,
      holderName: currentAcc.holderName,
      type,
      amount,
      result,
    });
  };

  const handleResetAccounts = () => {
    setAccount1({
      accountNumber: 'TR34-0010-8801',
      holderName: 'Enes Öztürk',
      balance: 1500.0,
    });
    setAccount2({
      accountNumber: 'TR34-0020-9902',
      holderName: 'Ahmet Yılmaz',
      balance: 750.0,
    });
    addLog('info', '🔄 Hesap bakiyeleri başlangıç değerlerine sıfırlandı (1500.00 TL ve 750.00 TL).');
  };

  const handleSelectStepFromChecklist = (stepId: number) => {
    setActiveStepId(stepId);
    setActiveTab('code');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isRunning={isRunning}
        onRunCargo={runStandardAssignment}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Signature & Verification Hero Banner */}
        <SignatureCard />

        {/* Tab 1: Simulator & Terminal Console */}
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            <InteractiveTestbench
              account1={account1}
              account2={account2}
              onExecuteTransaction={handleExecuteTransaction}
              onRunStandardAssignment={runStandardAssignment}
              onRunNegativeDepositTest={handleRunNegativeDepositTest}
              onRunInsufficientWithdrawTest={handleRunInsufficientWithdrawTest}
              onResetAccounts={handleResetAccounts}
              lastResult={lastResult}
            />

            {/* Terminal Screen */}
            <div className="h-[420px]">
              <Terminal
                logs={logs}
                isRunning={isRunning}
                onRunCargo={runStandardAssignment}
                onClearLogs={() => setLogs([])}
              />
            </div>
          </div>
        )}

        {/* Tab 2: Rust Source Code Viewer */}
        {activeTab === 'code' && (
          <div className="space-y-4">
            <div className="h-[680px]">
              <CodeViewer
                activeStepId={activeStepId}
                onSelectStep={setActiveStepId}
              />
            </div>
          </div>
        )}

        {/* Tab 3: Interactive Checklist */}
        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <Checklist
              activeStepId={activeStepId}
              onSelectStep={handleSelectStepFromChecklist}
            />
          </div>
        )}

        {/* Tab 4: Theory & Architecture Guide */}
        {activeTab === 'guide' && (
          <div className="space-y-6">
            <TheoryGuide />
            <div className="h-[450px]">
              <CodeViewer
                activeStepId={activeStepId}
                onSelectStep={setActiveStepId}
              />
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span>🦀 Rust Bankacılık Sistemi &amp; Hata Yönetimi Projesi</span>
            <span>•</span>
            <span className="text-orange-400 font-semibold">Enes Öztürk</span>
          </div>
          <div className="text-[11px] text-slate-600 font-mono">
            Result&lt;(), String&gt; • Ok(()) • Err(String) • match pattern
          </div>
        </div>
      </footer>
    </div>
  );
}
