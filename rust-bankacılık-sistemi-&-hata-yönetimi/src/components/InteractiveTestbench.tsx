import React, { useState } from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  PlayCircle,
  RotateCcw,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { BankAccountState, ResultType } from '../types/banking';

interface InteractiveTestbenchProps {
  account1: BankAccountState;
  account2: BankAccountState;
  onExecuteTransaction: (
    accountIndex: 1 | 2,
    type: 'deposit' | 'withdraw',
    amount: number
  ) => void;
  onRunStandardAssignment: () => void;
  onRunNegativeDepositTest: () => void;
  onRunInsufficientWithdrawTest: () => void;
  onResetAccounts: () => void;
  lastResult: {
    accountNumber: string;
    holderName: string;
    type: 'deposit' | 'withdraw';
    amount: number;
    result: ResultType<void, string>;
  } | null;
}

export const InteractiveTestbench: React.FC<InteractiveTestbenchProps> = ({
  account1,
  account2,
  onExecuteTransaction,
  onRunStandardAssignment,
  onRunNegativeDepositTest,
  onRunInsufficientWithdrawTest,
  onResetAccounts,
  lastResult,
}) => {
  const [selectedAccount, setSelectedAccount] = useState<1 | 2>(1);
  const [actionType, setActionType] = useState<'deposit' | 'withdraw'>('deposit');
  const [amountInput, setAmountInput] = useState<string>('250');

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amountInput);
    if (isNaN(parsedAmount)) return;
    onExecuteTransaction(selectedAccount, actionType, parsedAmount);
  };

  return (
    <div className="space-y-6">
      {/* Account Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Account 1: Enes Öztürk */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-orange-950/40 p-5 border border-orange-500/30 shadow-lg group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-orange-500/20 flex items-center justify-center text-orange-400 border border-orange-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-wider text-orange-400/90 font-semibold uppercase">Hesap 1 (Adım 5)</span>
                <h3 className="text-base font-bold text-white flex items-center gap-1.5">
                  {account1.holderName}
                  <UserCheck className="w-4 h-4 text-emerald-400" />
                </h3>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-orange-500/10 text-orange-300 border border-orange-500/20 font-mono">
              {account1.accountNumber}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Güncel Bakiye (balance())</p>
              <div className="text-2xl font-mono font-bold text-emerald-400 tracking-tight">
                {account1.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-sans text-emerald-500/80">TL</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAccount(1);
                setActionType('deposit');
                setAmountInput('500');
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              İşlem Seç
            </button>
          </div>
        </div>

        {/* Account 2: Ahmet Yılmaz */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-950/40 p-5 border border-cyan-500/30 shadow-lg group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all"></div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/20 flex items-center justify-center text-cyan-400 border border-cyan-500/30">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <span className="text-[11px] font-mono tracking-wider text-cyan-400/90 font-semibold uppercase">Hesap 2 (Adım 5)</span>
                <h3 className="text-base font-bold text-white">{account2.holderName}</h3>
              </div>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
              {account2.accountNumber}
            </span>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-700/60 flex items-end justify-between">
            <div>
              <p className="text-xs text-slate-400 font-medium">Güncel Bakiye (balance())</p>
              <div className="text-2xl font-mono font-bold text-cyan-300 tracking-tight">
                {account2.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} <span className="text-sm font-sans text-cyan-500/80">TL</span>
              </div>
            </div>
            <button
              onClick={() => {
                setSelectedAccount(2);
                setActionType('withdraw');
                setAmountInput('300');
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              İşlem Seç
            </button>
          </div>
        </div>
      </div>

      {/* Preset Scenarios Buttons */}
      <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-5 shadow-xl">
        <div className="flex items-center justify-between mb-3.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-orange-400" />
            <h4 className="text-sm font-bold text-white tracking-wide">Hazır Test &amp; Doğrulama Senaryoları</h4>
          </div>
          <button
            onClick={onResetAccounts}
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors px-2 py-1 rounded-md hover:bg-slate-800"
            title="Bakiyeleri başlangıç durumuna sıfırla"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Sıfırla</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {/* Scenario 1: Standard Assignment Run */}
          <button
            onClick={onRunStandardAssignment}
            className="flex flex-col text-left p-3.5 rounded-xl bg-gradient-to-br from-emerald-950/40 to-slate-900 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-950/60 transition-all group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                Senaryo 1
              </span>
              <PlayCircle className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-emerald-300">
              Görev Akışı (Başarılı)
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Hesap 1'e <strong className="text-emerald-300">+500 TL</strong> yatır, Hesap 2'den <strong className="text-cyan-300">-300 TL</strong> çek. Her iki <code className="text-orange-300 font-mono">match</code> dalı da <code className="text-emerald-400 font-mono">Ok(())</code> alır.
            </p>
          </button>

          {/* Scenario 2: Error 1 (Negative deposit) */}
          <button
            onClick={onRunNegativeDepositTest}
            className="flex flex-col text-left p-3.5 rounded-xl bg-gradient-to-br from-rose-950/30 to-slate-900 border border-rose-500/30 hover:border-rose-400 hover:bg-rose-950/50 transition-all group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">
                Senaryo 2
              </span>
              <AlertTriangle className="w-4 h-4 text-rose-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-rose-300">
              Negatif Yatırma Hatası
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Hesap 1'e <strong className="text-rose-300">-100 TL</strong> yatırma denemesi. Rust <code className="text-rose-400 font-mono">Err(String)</code> fırlatır ve <code className="font-mono text-orange-300">match</code> hata koluna yönlenir.
            </p>
          </button>

          {/* Scenario 3: Error 2 (Insufficient balance) */}
          <button
            onClick={onRunInsufficientWithdrawTest}
            className="flex flex-col text-left p-3.5 rounded-xl bg-gradient-to-br from-amber-950/30 to-slate-900 border border-amber-500/30 hover:border-amber-400 hover:bg-amber-950/50 transition-all group"
          >
            <div className="flex items-center justify-between w-full mb-1">
              <span className="text-[10px] font-mono uppercase font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">
                Senaryo 3
              </span>
              <AlertTriangle className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
            </div>
            <span className="text-xs font-bold text-white group-hover:text-amber-300">
              Yetersiz Bakiye Hatası
            </span>
            <p className="text-[11px] text-slate-400 mt-1 leading-relaxed">
              Hesap 2'den <strong className="text-amber-300">2.500 TL</strong> çekme denemesi. Bakiye yetmediği için <code className="text-rose-400 font-mono">Err(String)</code> fırlatılır.
            </p>
          </button>
        </div>
      </div>

      {/* Interactive Custom Form & Live Match Visualizer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Custom Transaction Form */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl">
          <h4 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            <span>Özel İşlem Simülasyonu</span>
          </h4>

          <form onSubmit={handleCustomSubmit} className="space-y-4">
            {/* Account Selector */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Hedef Banka Hesabı (BankAccount)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAccount(1)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    selectedAccount === 1
                      ? 'bg-orange-500/20 border-orange-500/80 text-orange-200'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-white">Hesap 1</div>
                  <div className="text-[11px] truncate">{account1.holderName}</div>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAccount(2)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium border text-left transition-all ${
                    selectedAccount === 2
                      ? 'bg-cyan-500/20 border-cyan-500/80 text-cyan-200'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="font-bold text-white">Hesap 2</div>
                  <div className="text-[11px] truncate">{account2.holderName}</div>
                </button>
              </div>
            </div>

            {/* Action Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                İşlem Türü (Account Trait Yöntemi)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setActionType('deposit')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    actionType === 'deposit'
                      ? 'bg-emerald-500/20 border-emerald-500/80 text-emerald-300'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowDownLeft className="w-3.5 h-3.5 text-emerald-400" />
                  <span>deposit(&mut self, amount)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActionType('withdraw')}
                  className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    actionType === 'withdraw'
                      ? 'bg-amber-500/20 border-amber-500/80 text-amber-300'
                      : 'bg-slate-800/80 border-slate-700/60 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <ArrowUpRight className="w-3.5 h-3.5 text-amber-400" />
                  <span>withdraw(&mut self, amount)</span>
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-semibold text-slate-300">
                  Tutar (amount: f64)
                </label>
                <span className="text-[10px] text-slate-500">
                  (Test için negatif veya yüksek tutar girebilirsiniz)
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  step="any"
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono text-sm focus:outline-none focus:border-orange-500/80 transition-colors"
                />
                <span className="absolute right-3.5 top-2.5 text-xs font-semibold text-slate-500">
                  TL
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 px-4 rounded-xl font-bold text-xs bg-gradient-to-r from-orange-500 to-amber-600 hover:from-orange-400 hover:to-amber-500 text-slate-950 shadow-md shadow-orange-900/30 transition-all active:scale-[0.99] flex items-center justify-center gap-2"
            >
              <span>Rust ile İşlemi Gerçekle &amp; match ile İncele</span>
            </button>
          </form>
        </div>

        {/* Live Match Pattern Branch Visualizer */}
        <div className="lg:col-span-6 rounded-2xl bg-slate-900 border border-slate-800 p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-orange-400"></span>
                <span>Rust `match` Deseni Canlı Akışı</span>
              </h4>
              <span className="text-[10px] font-mono text-slate-400 bg-slate-800 px-2 py-0.5 rounded">
                Result&lt;(), String&gt;
              </span>
            </div>

            {lastResult ? (
              <div className="space-y-3">
                {/* Code Box simulating match statement */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 font-mono text-xs leading-relaxed">
                  <div className="text-slate-400">
                    <span className="text-violet-400 font-semibold">match</span> account.{lastResult.type}({lastResult.amount.toFixed(2)}) &#123;
                  </div>

                  {/* Branch Ok */}
                  <div
                    className={`ml-4 my-1.5 p-2 rounded-lg transition-all ${
                      lastResult.result.ok
                        ? 'bg-emerald-950/60 border border-emerald-500/80 text-emerald-300'
                        : 'text-slate-600 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {lastResult.result.ok && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
                      <span className="text-emerald-400 font-semibold">Ok(())</span> =&gt; &#123;
                    </div>
                    <div className="text-[11px] ml-5 text-slate-300">
                      println!(&quot;✅ [BAŞARILI] İşlem tamamlandı.&quot;);
                    </div>
                    <div className="text-[11px] ml-2">&#125;</div>
                  </div>

                  {/* Branch Err */}
                  <div
                    className={`ml-4 my-1.5 p-2 rounded-lg transition-all ${
                      !lastResult.result.ok
                        ? 'bg-rose-950/60 border border-rose-500/80 text-rose-300'
                        : 'text-slate-600 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 font-bold">
                      {!lastResult.result.ok && <XCircle className="w-3.5 h-3.5 text-rose-400" />}
                      <span className="text-rose-400 font-semibold">Err(hata_mesaji)</span> =&gt; &#123;
                    </div>
                    <div className="text-[11px] ml-5 text-slate-300">
                      println!(&quot;❌ [HATA] &#123;&#125;&quot;, hata_mesaji);
                    </div>
                    <div className="text-[11px] ml-2">&#125;</div>
                  </div>

                  <div className="text-slate-400">&#125;</div>
                </div>

                {/* Status Box */}
                <div
                  className={`p-3 rounded-xl border flex items-start gap-3 ${
                    lastResult.result.ok
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/30 border-rose-500/40 text-rose-200'
                  }`}
                >
                  {lastResult.result.ok ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="text-xs font-bold">
                      {lastResult.result.ok
                        ? 'Başarılı Varyant: Ok(())'
                        : 'Hata Varyantı: Err(String)'}
                    </div>
                    <div className="text-xs mt-0.5 font-sans opacity-90">
                      {lastResult.result.ok
                        ? `${lastResult.holderName} için ${lastResult.amount.toFixed(2)} TL tutarındaki ${lastResult.type === 'deposit' ? 'para yatırma' : 'para çekme'} işlemi onaylandı.`
                        : lastResult.result.error}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-center text-center p-4 bg-slate-950/60 rounded-xl border border-slate-800 text-slate-500">
                <Sparkles className="w-8 h-8 mb-2 opacity-30 text-orange-400" />
                <p className="text-xs text-slate-400 font-medium">Henüz İşlem Yapılmadı</p>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">
                  Soldaki formdan veya üstteki hazır senaryolardan bir işlem çalıştırdığınızda Rust `match` dallanması burada anlık olarak canlandırılacaktır.
                </p>
              </div>
            )}
          </div>

          <div className="text-[11px] text-slate-500 pt-3 border-t border-slate-800/80 flex items-center justify-between">
            <span>Enes Öztürk Rust Mimari Tasarımı</span>
            <span className="font-mono text-orange-400/80">Result&lt;T, E&gt;</span>
          </div>
        </div>
      </div>
    </div>
  );
};
