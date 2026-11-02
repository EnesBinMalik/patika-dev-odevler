import React, { useState, useEffect } from 'react';
import { BankAccountModel, Transaction, ExecutionLog } from './types';
import { Header } from './components/Header';
import { LiveBankingSimulator } from './components/LiveBankingSimulator';
import { RustCodePlayground } from './components/RustCodePlayground';
import { TraitMemoryVisualizer } from './components/TraitMemoryVisualizer';
import { AssignmentChecklist } from './components/AssignmentChecklist';
import { ExportModal } from './components/ExportModal';
import { ShieldCheck, Terminal, Award, Heart, CheckCircle2, Github, BookOpen } from 'lucide-react';

const INITIAL_ACCOUNTS: BankAccountModel[] = [
  {
    account_number: 'TR-1001',
    holder_name: 'Ahmet Yılmaz',
    balance: 1500.0,
    initial_balance: 1500.0,
    color_gradient: 'from-orange-950/80 via-slate-900 to-amber-950/80',
    avatar_bg: 'bg-orange-600',
    currency: '₺',
  },
  {
    account_number: 'TR-1002',
    holder_name: 'Ayşe Kaya',
    balance: 2500.0,
    initial_balance: 2500.0,
    color_gradient: 'from-slate-900 via-emerald-950/80 to-slate-950',
    avatar_bg: 'bg-emerald-600',
    currency: '₺',
  },
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'memory' | 'checklist'>('simulator');
  const [accounts, setAccounts] = useState<BankAccountModel[]>(INITIAL_ACCOUNTS);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [logs, setLogs] = useState<ExecutionLog[]>([]);
  const [isRunningCargo, setIsRunningCargo] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [lastExecutedStep, setLastExecutedStep] = useState<number | null>(null);

  // Initial welcome log
  useEffect(() => {
    const initLogs: ExecutionLog[] = [
      {
        id: '1',
        timestamp: new Date().toLocaleTimeString(),
        type: 'cargo',
        content: '$ cargo build --release\n   Compiling rust_banking v0.1.0 (/rust/bank_app)\n    Finished `release` profile [optimized] in 0.42s',
      },
      {
        id: '2',
        timestamp: new Date().toLocaleTimeString(),
        type: 'stdout',
        content: '============================================================\n    RUST BANKACILIK SİSTEMİ | İMZA: ENES ÖZTÜRK             \n    Rust Traits (Özellikler) & Structs Uygulaması            \n============================================================',
      },
      {
        id: '3',
        timestamp: new Date().toLocaleTimeString(),
        type: 'stdout',
        content: '-> [BAŞLANGIÇ DURUMU]\n   Hesap 1: Ahmet Yılmaz (TR-1001) | Başlangıç Bakiye: 1500.00 ₺\n   Hesap 2: Ayşe Kaya (TR-1002) | Başlangıç Bakiye: 2500.00 ₺',
      },
    ];
    setLogs(initLogs);
  }, []);

  // Deposit logic (Adım 3 & Adım 7)
  const handleDeposit = (accountNumber: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, message: 'Yatırılacak tutar 0\'dan büyük olmalıdır.' };
    }

    const target = accounts.find((a) => a.account_number === accountNumber);
    if (!target) {
      return { success: false, message: 'Hesap bulunamadı.' };
    }

    const before = target.balance;
    const after = before + amount;

    setAccounts((prev) =>
      prev.map((a) => (a.account_number === accountNumber ? { ...a, balance: after } : a))
    );

    const now = new Date().toLocaleTimeString();
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      account_number: accountNumber,
      holder_name: target.holder_name,
      type: 'deposit',
      amount,
      balance_before: before,
      balance_after: after,
      timestamp: now,
      rust_call_expr: `${target.account_number === 'TR-1001' ? 'hesap1' : 'hesap'}.para_yatir(${amount.toFixed(1)})`,
      status: 'ok',
    };

    setTransactions((prev) => [newTx, ...prev]);

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: now,
        type: 'success',
        content: `✓ [Ok(())] [${accountNumber}] ${target.holder_name} hesabına ${amount.toFixed(2)} ₺ yatırıldı. (Güncel Bakiye: ${after.toFixed(2)} ₺)`,
      },
    ]);

    setLastExecutedStep(7);
    return { success: true, message: 'İşlem başarılı.' };
  };

  // Withdraw logic with insufficient funds guard (Adım 4 & Adım 8)
  const handleWithdraw = (accountNumber: string, amount: number) => {
    if (amount <= 0) {
      return { success: false, message: 'Çekilecek tutar 0\'dan büyük olmalıdır.' };
    }

    const target = accounts.find((a) => a.account_number === accountNumber);
    if (!target) {
      return { success: false, message: 'Hesap bulunamadı.' };
    }

    if (amount > target.balance) {
      const errMessage = `Yetersiz bakiye! Mevcut bakiye: ${target.balance.toFixed(2)} ₺, İstenen: ${amount.toFixed(2)} ₺`;

      const now = new Date().toLocaleTimeString();
      const failTx: Transaction = {
        id: Math.random().toString(36).substring(2, 9),
        account_number: accountNumber,
        holder_name: target.holder_name,
        type: 'withdraw',
        amount,
        balance_before: target.balance,
        balance_after: target.balance,
        timestamp: now,
        rust_call_expr: `${target.account_number === 'TR-1002' ? 'hesap2' : 'hesap'}.para_cek(${amount.toFixed(1)})`,
        status: 'err',
        error_message: errMessage,
      };

      setTransactions((prev) => [failTx, ...prev]);

      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          timestamp: now,
          type: 'stderr',
          content: `✗ [Err] ${errMessage}`,
        },
      ]);

      return { success: false, message: errMessage };
    }

    const before = target.balance;
    const after = before - amount;

    setAccounts((prev) =>
      prev.map((a) => (a.account_number === accountNumber ? { ...a, balance: after } : a))
    );

    const now = new Date().toLocaleTimeString();
    const newTx: Transaction = {
      id: Math.random().toString(36).substring(2, 9),
      account_number: accountNumber,
      holder_name: target.holder_name,
      type: 'withdraw',
      amount,
      balance_before: before,
      balance_after: after,
      timestamp: now,
      rust_call_expr: `${target.account_number === 'TR-1002' ? 'hesap2' : 'hesap'}.para_cek(${amount.toFixed(1)})`,
      status: 'ok',
    };

    setTransactions((prev) => [newTx, ...prev]);

    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: now,
        type: 'success',
        content: `✓ [Ok(())] [${accountNumber}] ${target.holder_name} hesabından ${amount.toFixed(2)} ₺ çekildi. (Kalan Bakiye: ${after.toFixed(2)} ₺)`,
      },
    ]);

    setLastExecutedStep(8);
    return { success: true, message: 'İşlem başarılı.' };
  };

  // Create new account
  const handleCreateAccount = (accountNumber: string, holderName: string, initialBalance: number) => {
    if (accounts.some((a) => a.account_number.toLowerCase() === accountNumber.toLowerCase())) {
      return false;
    }

    const newAcc: BankAccountModel = {
      account_number: accountNumber,
      holder_name: holderName,
      balance: initialBalance,
      initial_balance: initialBalance,
      color_gradient: 'from-slate-900 via-indigo-950/80 to-slate-950',
      avatar_bg: 'bg-indigo-600',
      currency: '₺',
    };

    setAccounts((prev) => [...prev, newAcc]);

    const now = new Date().toLocaleTimeString();
    setLogs((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        timestamp: now,
        type: 'memory',
        content: `[ALLOC] let mut yeni = BankAccount::new("${accountNumber}", "${holderName}", ${initialBalance.toFixed(2)}); // Stack & Heap ayrıldı`,
      },
    ]);

    return true;
  };

  // Reset to initial assignment state
  const handleReset = () => {
    setAccounts(INITIAL_ACCOUNTS);
    setTransactions([]);
    setLastExecutedStep(null);
    setLogs([
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'cargo',
        content: '$ cargo clean && cargo build\n   Compiling rust_banking v0.1.0\n    Finished dev profile in 0.38s',
      },
      {
        id: Math.random().toString(),
        timestamp: new Date().toLocaleTimeString(),
        type: 'stdout',
        content: '-> Sistem fabrika ayarlarına döndürüldü.\nHesap 1 (Ahmet Yılmaz): 1500.00 ₺\nHesap 2 (Ayşe Kaya): 2500.00 ₺',
      },
    ]);
  };

  // Run full assignment sequence (Step 6 -> Step 7 -> Step 8 -> Step 9)
  const handleRunFullAssignment = () => {
    handleReset();
    setIsRunningCargo(true);

    setTimeout(() => {
      // Step 7: Deposit 750 to account 1
      handleDeposit('TR-1001', 750);

      setTimeout(() => {
        // Step 8: Withdraw 400 from account 2
        handleWithdraw('TR-1002', 400);

        setTimeout(() => {
          // Step 9: Print balances
          setLogs((prev) => [
            ...prev,
            {
              id: Math.random().toString(),
              timestamp: new Date().toLocaleTimeString(),
              type: 'stdout',
              content: '------------------------------------------------------------\n[Adım 9 Sonucu: Güncel Bakiyeler]\nHesap 1 Sahibi: Ahmet Yılmaz    | No: TR-1001 | Güncel Bakiye: 2250.00 ₺\nHesap 2 Sahibi: Ayşe Kaya       | No: TR-1002 | Güncel Bakiye: 2100.00 ₺\n============================================================\n✓ [Adım 10]: Program başarıyla derlendi ve çalıştırıldı.\n✓ Geliştirici & Yazar: Enes Öztürk',
            },
          ]);
          setIsRunningCargo(false);
          setLastExecutedStep(9);
        }, 500);
      }, 500);
    }, 400);
  };

  // Run cargo commands (run, check, test)
  const handleRunCargo = (mode: 'run' | 'check' | 'test') => {
    setIsRunningCargo(true);

    setTimeout(() => {
      setIsRunningCargo(false);
      const time = new Date().toLocaleTimeString();

      if (mode === 'check') {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: time,
            type: 'cargo',
            content: '$ cargo check\n    Checking rust_banking v0.1.0 (/rust/bank_app)\n    Finished dev [unoptimized + debuginfo] target(s) in 0.12s\n✓ Sıfır hata, sıfır uyarı. Borrow checker kuralları geçerli.',
          },
        ]);
      } else if (mode === 'test') {
        setLogs((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            timestamp: time,
            type: 'cargo',
            content: '$ cargo test\n   Compiling rust_banking v0.1.0\n    Finished test [unoptimized + debuginfo] target(s) in 0.45s\n     Running unittests src/main.rs\n\nrunning 5 tests\ntest tests::test_deposit_increases_balance ... ok\ntest tests::test_withdraw_decreases_balance ... ok\ntest tests::test_withdraw_insufficient_funds_fails ... ok\ntest tests::test_balance_getter ... ok\ntest tests::test_trait_contract_impl ... ok\n\ntest result: ok. 5 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.02s',
          },
        ]);
      } else {
        // cargo run
        handleRunFullAssignment();
      }
    }, 600);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRunSteps={handleRunFullAssignment}
        onOpenExport={() => setIsExportOpen(true)}
        completedStepsCount={10}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {activeTab === 'simulator' && (
          <LiveBankingSimulator
            accounts={accounts}
            transactions={transactions}
            onDeposit={handleDeposit}
            onWithdraw={handleWithdraw}
            onCreateAccount={handleCreateAccount}
            onReset={handleReset}
            onRunSteps={handleRunFullAssignment}
            lastExecutedStep={lastExecutedStep}
          />
        )}

        {activeTab === 'code' && (
          <RustCodePlayground
            logs={logs}
            onRunCargo={handleRunCargo}
            isRunning={isRunningCargo}
            onClearLogs={() => setLogs([])}
          />
        )}

        {activeTab === 'memory' && <TraitMemoryVisualizer />}

        {activeTab === 'checklist' && (
          <AssignmentChecklist onRunAllTests={() => handleRunCargo('test')} />
        )}
      </main>

      {/* Export / Download Modal */}
      <ExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} />

      {/* Global Footer with Enes Öztürk Signature */}
      <footer className="bg-slate-900 border-t border-slate-800 text-slate-400 py-6 px-4 sm:px-6 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-xl">🦀</span>
            <div>
              <span className="text-white font-semibold">Rust Bankacılık Sistemi</span>
              <span className="text-slate-500 mx-2">•</span>
              <span className="text-slate-400">Traits (Özellikler) & Structs Uygulaması</span>
            </div>
          </div>

          {/* Signature Tag */}
          <div className="flex items-center gap-2 bg-slate-950 px-3.5 py-1.5 rounded-full border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-orange-400" />
            <span className="text-slate-400">Proje Sahibi & Geliştirici:</span>
            <span className="text-orange-300 font-bold tracking-wide">Enes Öztürk</span>
            <span className="text-[10px] bg-orange-500/20 text-orange-400 px-1.5 py-0.2 rounded font-mono">
              Resmi İmza
            </span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            Rust 2021 Edition • Açık Kaynak Eğitim Projesi
          </div>
        </div>
      </footer>
    </div>
  );
}
