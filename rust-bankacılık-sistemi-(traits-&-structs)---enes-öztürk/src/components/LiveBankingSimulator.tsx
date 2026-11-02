import React, { useState } from 'react';
import { BankAccountModel, Transaction } from '../types';
import { ArrowDownRight, ArrowUpRight, Plus, RefreshCw, AlertCircle, CheckCircle2, CreditCard, User, Wallet, Code2, Sparkles, Send } from 'lucide-react';

interface LiveBankingSimulatorProps {
  accounts: BankAccountModel[];
  transactions: Transaction[];
  onDeposit: (accountNumber: string, amount: number) => { success: boolean; message: string };
  onWithdraw: (accountNumber: string, amount: number) => { success: boolean; message: string };
  onCreateAccount: (accountNumber: string, holderName: string, initialBalance: number) => boolean;
  onReset: () => void;
  onRunSteps: () => void;
  lastExecutedStep: number | null;
}

export const LiveBankingSimulator: React.FC<LiveBankingSimulatorProps> = ({
  accounts,
  transactions,
  onDeposit,
  onWithdraw,
  onCreateAccount,
  onReset,
  onRunSteps,
  lastExecutedStep,
}) => {
  const [selectedAccNumber, setSelectedAccNumber] = useState<string>(accounts[0]?.account_number || 'TR-1001');
  const [txType, setTxType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountInput, setAmountInput] = useState<string>('500');
  const [errorFeedback, setErrorFeedback] = useState<string | null>(null);
  const [successFeedback, setSuccessFeedback] = useState<string | null>(null);

  // New account modal state
  const [showNewAccountModal, setShowNewAccountModal] = useState(false);
  const [newAccNum, setNewAccNum] = useState(`TR-${1000 + accounts.length + 1}`);
  const [newHolderName, setNewHolderName] = useState('');
  const [newInitialBalance, setNewInitialBalance] = useState('1000');

  const selectedAccount = accounts.find((a) => a.account_number === selectedAccNumber) || accounts[0];

  const handleExecuteTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorFeedback(null);
    setSuccessFeedback(null);

    const amount = parseFloat(amountInput);
    if (isNaN(amount) || amount <= 0) {
      setErrorFeedback('Lütfen geçerli ve 0\'dan büyük bir tutar girin.');
      return;
    }

    if (txType === 'deposit') {
      const res = onDeposit(selectedAccNumber, amount);
      if (res.success) {
        setSuccessFeedback(`✓ [Ok(())] ${selectedAccount.holder_name} hesabına ${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ yatırıldı.`);
      } else {
        setErrorFeedback(`✗ [Err] ${res.message}`);
      }
    } else {
      const res = onWithdraw(selectedAccNumber, amount);
      if (res.success) {
        setSuccessFeedback(`✓ [Ok(())] ${selectedAccount.holder_name} hesabından ${amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺ çekildi.`);
      } else {
        setErrorFeedback(`✗ [Err] ${res.message}`);
      }
    }
  };

  const handleCreateNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAccNum.trim() || !newHolderName.trim()) {
      alert('Lütfen tüm alanları doldurun.');
      return;
    }
    const bal = parseFloat(newInitialBalance) || 0;
    const ok = onCreateAccount(newAccNum.trim(), newHolderName.trim(), bal);
    if (ok) {
      setShowNewAccountModal(false);
      setSelectedAccNumber(newAccNum.trim());
      setNewHolderName('');
      setNewAccNum(`TR-${1000 + accounts.length + 2}`);
    } else {
      alert('Bu hesap numarası zaten mevcut.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Mission Actions (Adım 6, 7, 8, 9) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
              <h2 className="text-sm font-semibold text-white tracking-wide uppercase font-mono">
                Ödev Görev Akışı (Adım 7, 8 & 9)
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Görevdeki senaryoyu tek tıkla çalıştırın veya butonlarla her adımı izole test edin:
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onDeposit('TR-1001', 750)}
              className="px-3 py-1.5 rounded-lg bg-emerald-950/80 hover:bg-emerald-900 text-emerald-300 border border-emerald-500/30 text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Adım 7: hesap1.para_yatir(750.0)"
            >
              <ArrowDownRight className="w-3.5 h-3.5 text-emerald-400" />
              <span>Adım 7: Hesap 1'e 750 ₺ Yatır</span>
            </button>

            <button
              onClick={() => onWithdraw('TR-1002', 400)}
              className="px-3 py-1.5 rounded-lg bg-rose-950/80 hover:bg-rose-900 text-rose-300 border border-rose-500/30 text-xs font-mono flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-sm"
              title="Adım 8: hesap2.para_cek(400.0)"
            >
              <ArrowUpRight className="w-3.5 h-3.5 text-rose-400" />
              <span>Adım 8: Hesap 2'den 400 ₺ Çek</span>
            </button>

            <button
              onClick={onRunSteps}
              className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-95 cursor-pointer shadow-lg shadow-orange-600/20"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tüm Akışı Otomatik Çalıştır</span>
            </button>

            <button
              onClick={onReset}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs flex items-center gap-1 border border-slate-700 cursor-pointer transition-colors"
              title="Başlangıç Durumuna Sıfırla"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Sıfırla</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Accounts Display & Interactive Trait Operations */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Accounts Cards (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-400" />
              <span>Oluşturulan Banka Hesapları (BankAccount Örnekleri)</span>
            </h3>
            <button
              onClick={() => setShowNewAccountModal(true)}
              className="px-2.5 py-1 text-xs rounded-md bg-slate-800 hover:bg-slate-700 text-orange-400 border border-orange-500/30 flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Hesap Oluştur</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {accounts.map((acc, idx) => {
              const isSelected = selectedAccNumber === acc.account_number;
              const isStep7 = acc.account_number === 'TR-1001';
              const isStep8 = acc.account_number === 'TR-1002';

              return (
                <div
                  key={acc.account_number}
                  onClick={() => setSelectedAccNumber(acc.account_number)}
                  className={`relative overflow-hidden rounded-2xl p-5 cursor-pointer transition-all duration-300 border shadow-lg ${
                    isSelected
                      ? 'border-orange-500/80 ring-2 ring-orange-500/30 shadow-orange-500/10'
                      : 'border-slate-800 hover:border-slate-700 hover:shadow-xl'
                  } bg-gradient-to-br ${acc.color_gradient}`}
                >
                  {/* Subtle Badge */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-5 rounded bg-amber-400/80 border border-amber-300/60 shadow-inner flex items-center justify-center">
                        <div className="w-4 h-3 border border-amber-600/40 rounded-sm grid grid-cols-2 gap-0.5 p-0.5">
                          <div className="bg-amber-600/30"></div>
                          <div className="bg-amber-600/30"></div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-slate-300 tracking-wider">
                        {acc.account_number}
                      </span>
                    </div>

                    <span className="text-[10px] px-2 py-0.5 rounded-full font-mono bg-black/40 text-slate-300 border border-white/10">
                      {isStep7 ? 'Adım 6 (hesap1)' : isStep8 ? 'Adım 6 (hesap2)' : `Hesap #${idx + 1}`}
                    </span>
                  </div>

                  {/* Holder Name */}
                  <div className="mb-4">
                    <p className="text-[11px] uppercase tracking-wider text-slate-400 font-mono">
                      Hesap Sahibi (holder_name)
                    </p>
                    <p className="text-base font-bold text-white tracking-wide mt-0.5">
                      {acc.holder_name}
                    </p>
                  </div>

                  {/* Balance / Bakiye */}
                  <div className="pt-2 border-t border-white/10 flex items-end justify-between">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-slate-400 font-mono flex items-center gap-1">
                        <Wallet className="w-3 h-3 text-orange-400" />
                        <span>Mevcut Bakiye (hesap.bakiye())</span>
                      </p>
                      <p className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight mt-0.5">
                        {acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                        <span className="text-orange-400 text-sm font-sans font-bold">₺</span>
                      </p>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block font-mono">
                        Başlangıç: {acc.initial_balance.toLocaleString('tr-TR')} ₺
                      </span>
                      <span
                        className={`text-xs font-mono font-medium ${
                          acc.balance >= acc.initial_balance ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {acc.balance >= acc.initial_balance ? '+' : ''}
                        {(acc.balance - acc.initial_balance).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}{' '}
                        ₺
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Struct Breakdown / Rust Code Mapping Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-xs font-mono">
            <div className="flex items-center justify-between text-slate-400 mb-2 border-b border-slate-800 pb-2">
              <span className="flex items-center gap-1.5 text-orange-400 font-medium">
                <Code2 className="w-4 h-4" />
                <span>Seçili Hesap Bellek Durumu: BankAccount</span>
              </span>
              <span className="text-slate-500">struct BankAccount &#123; ... &#125;</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-slate-300">
              <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">account_number: String</span>
                <span className="text-orange-300 font-semibold">"{selectedAccount.account_number}"</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">holder_name: String</span>
                <span className="text-amber-300 font-semibold">"{selectedAccount.holder_name}"</span>
              </div>
              <div className="bg-slate-950/80 p-2 rounded border border-slate-800/80">
                <span className="text-slate-500 block text-[10px]">balance: f64</span>
                <span className="text-emerald-400 font-bold">{selectedAccount.balance.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Interactive Trait Invocation Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>Hesap Özelliği (Trait) Çağrısı</span>
              </h3>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">
                &mut self
              </span>
            </div>

            <form onSubmit={handleExecuteTransaction} className="space-y-4">
              {/* Target Account Select */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  İşlem Yapılacak Hesap:
                </label>
                <select
                  value={selectedAccNumber}
                  onChange={(e) => setSelectedAccNumber(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-100 focus:outline-none focus:border-orange-500 font-mono"
                >
                  {accounts.map((acc) => (
                    <option key={acc.account_number} value={acc.account_number}>
                      {acc.account_number} - {acc.holder_name} (Bakiye: {acc.balance.toFixed(2)} ₺)
                    </option>
                  ))}
                </select>
              </div>

              {/* Action Type Toggle (deposit vs withdraw) */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Trait Metodu Seçimi:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxType('deposit')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      txType === 'deposit'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>fn para_yatir</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTxType('withdraw')}
                    className={`py-2 px-3 rounded-lg text-xs font-mono font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      txType === 'withdraw'
                        ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-750 border border-slate-700'
                    }`}
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    <span>fn para_cek</span>
                  </button>
                </div>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1">
                  Miktar (f64):
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="any"
                    min="1"
                    value={amountInput}
                    onChange={(e) => setAmountInput(e.target.value)}
                    placeholder="Miktar giriniz (örn: 500)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-orange-500 pl-7"
                  />
                  <span className="absolute left-3 top-2.5 text-xs text-slate-500 font-bold">₺</span>
                </div>

                {/* Quick amount presets */}
                <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                  {[100, 250, 400, 750, 1000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmountInput(preset.toString())}
                      className="text-[11px] font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 cursor-pointer"
                    >
                      +{preset} ₺
                    </button>
                  ))}
                </div>
              </div>

              {/* Live Rust Code Preview */}
              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800/80 font-mono text-[11px] text-slate-300">
                <span className="text-slate-500 block text-[10px] uppercase">// Çalıştırılacak Rust İfadesi:</span>
                <span className="text-orange-400">
                  {selectedAccount.account_number === 'TR-1001' ? 'hesap1' : 'hesap'}.
                  {txType === 'deposit' ? 'para_yatir' : 'para_cek'}({parseFloat(amountInput) || 0}.0);
                </span>
              </div>

              {/* Feedback messages */}
              {successFeedback && (
                <div className="p-2.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{successFeedback}</span>
                </div>
              )}

              {errorFeedback && (
                <div className="p-2.5 rounded-lg bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                  <span>{errorFeedback}</span>
                </div>
              )}

              {/* Submit button */}
              <button
                type="submit"
                className={`w-full py-2.5 px-4 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg active:scale-98 ${
                  txType === 'deposit'
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/20'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/20'
                }`}
              >
                <Send className="w-4 h-4" />
                <span>Metodu Çağır (Metodu Uygula)</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Transaction History / Ledger */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-white">İşlem Günlüğü (Rust Trait Çağrıları)</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {transactions.length} işlem
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">En son işlemler en üstte</span>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-slate-500 text-xs font-mono border border-dashed border-slate-800 rounded-xl">
            Henüz işlem yapılmadı. Yukarıdaki butonlarla para yatırabilir veya çekebilirsiniz.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                <tr>
                  <th className="py-2.5 px-3">Zaman</th>
                  <th className="py-2.5 px-3">Hesap No</th>
                  <th className="py-2.5 px-3">Hesap Sahibi</th>
                  <th className="py-2.5 px-3">İşlem Türü</th>
                  <th className="py-2.5 px-3">Tutar</th>
                  <th className="py-2.5 px-3">Sonuç Bakiye</th>
                  <th className="py-2.5 px-3">Rust Kod Çağrısı</th>
                  <th className="py-2.5 px-3">Durum</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-2 px-3 text-slate-500">{tx.timestamp}</td>
                    <td className="py-2 px-3 text-slate-300 font-semibold">{tx.account_number}</td>
                    <td className="py-2 px-3 text-slate-300">{tx.holder_name}</td>
                    <td className="py-2 px-3">
                      {tx.type === 'deposit' ? (
                        <span className="inline-flex items-center gap-1 text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                          <ArrowDownRight className="w-3 h-3" />
                          <span>Yatırma</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                          <ArrowUpRight className="w-3 h-3" />
                          <span>Çekme</span>
                        </span>
                      )}
                    </td>
                    <td className="py-2 px-3 font-semibold text-slate-100">
                      {tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-2 px-3 text-slate-200">
                      {tx.balance_after.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                    </td>
                    <td className="py-2 px-3 text-orange-400 text-[11px]">
                      <code>{tx.rust_call_expr}</code>
                    </td>
                    <td className="py-2 px-3">
                      {tx.status === 'ok' ? (
                        <span className="text-emerald-400 text-[11px] font-bold">Ok(())</span>
                      ) : (
                        <span className="text-rose-400 text-[11px] font-bold">Err</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Yeni BankAccount Oluştur */}
      {showNewAccountModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-orange-400" />
                <span>Yeni BankAccount Yapısı Oluştur</span>
              </h3>
              <button
                onClick={() => setShowNewAccountModal(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateNewAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  account_number: String
                </label>
                <input
                  type="text"
                  value={newAccNum}
                  onChange={(e) => setNewAccNum(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  holder_name: String
                </label>
                <input
                  type="text"
                  placeholder="Örn: Mehmet Demir"
                  value={newHolderName}
                  onChange={(e) => setNewHolderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">
                  balance: f64 (Başlangıç Bakiyesi)
                </label>
                <input
                  type="number"
                  step="any"
                  value={newInitialBalance}
                  onChange={(e) => setNewInitialBalance(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-sm text-slate-100 font-mono focus:outline-none focus:border-orange-500"
                  required
                />
              </div>

              <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-orange-300">
                // Rust Constructor:<br />
                let mut yeni = BankAccount::new("{newAccNum}", "{newHolderName || '... '}", {newInitialBalance || '0'}.0);
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewAccountModal(false)}
                  className="px-3 py-2 rounded-lg text-xs text-slate-400 hover:text-slate-200 cursor-pointer"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-600 hover:bg-orange-500 text-white text-xs font-semibold shadow-md shadow-orange-600/30 cursor-pointer"
                >
                  Hesabı Oluştur (Örneği Başlat)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
