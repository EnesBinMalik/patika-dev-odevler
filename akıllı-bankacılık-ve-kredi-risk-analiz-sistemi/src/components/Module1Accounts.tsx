import React, { useState } from 'react';
import { BankingEngine } from '../services/bankingEngine';
import { AnyAccount, CheckingAccount, SavingsAccount, Customer } from '../types/banking';
import { ShieldCheck, ArrowUpRight, ArrowDownLeft, RefreshCw, Plus, Lock, Info, CheckCircle2, AlertCircle } from 'lucide-react';

interface Module1AccountsProps {
  engine: BankingEngine;
  onRefresh: () => void;
}

export const Module1Accounts: React.FC<Module1AccountsProps> = ({ engine, onRefresh }) => {
  const [selectedCustomerId, setSelectedCustomerId] = useState<string>('CUST-001');
  const [activeModal, setActiveModal] = useState<'deposit' | 'withdraw' | 'transfer' | 'newAccount' | null>(null);
  const [targetAccount, setTargetAccount] = useState<AnyAccount | null>(null);

  // Form states
  const [actionAmount, setActionAmount] = useState<number>(5000);
  const [actionNote, setActionNote] = useState<string>('');
  const [transferTargetAccNum, setTransferTargetAccNum] = useState<string>('');
  const [newAccType, setNewAccType] = useState<'Checking' | 'Savings'>('Checking');
  const [newAccCurrency, setNewAccCurrency] = useState<'TRY' | 'USD' | 'EUR'>('TRY');
  const [newAccBalance, setNewAccBalance] = useState<number>(10000);
  const [newAccMaturity, setNewAccMaturity] = useState<number>(32);
  const [newAccInterest, setNewAccInterest] = useState<number>(45.0);

  // Feedback message
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const customers = engine.getCustomers();
  const currentCustomer = engine.getCustomerById(selectedCustomerId) || customers[0];
  const allAccounts = engine.getAllAccounts();

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccount) return;
    try {
      const tx = engine.deposit(targetAccount.accountNumber, actionAmount, actionNote || 'Mevduat Yatırma');
      setStatusMessage({
        type: 'success',
        text: `Kapsüllenmiş Deposit() metodu çalıştırıldı. ${tx.accountNumber} güncel bakiye: ${tx.balanceAfter.toLocaleString('tr-TR')} ${targetAccount.currency}`,
      });
      setActiveModal(null);
      onRefresh();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccount) return;
    try {
      const tx = engine.withdraw(targetAccount.accountNumber, actionAmount, actionNote || 'Nakit Çekim');
      setStatusMessage({
        type: 'success',
        text: `Polimorfik Withdraw() metodu onaylandı. ${tx.accountNumber} yeni bakiye: ${tx.balanceAfter.toLocaleString('tr-TR')} ${targetAccount.currency}`,
      });
      setActiveModal(null);
      onRefresh();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetAccount) return;
    try {
      const tx = engine.transfer(
        targetAccount.accountNumber,
        transferTargetAccNum,
        actionAmount,
        actionNote || 'Hesaplar Arası Virman'
      );
      setStatusMessage({
        type: 'success',
        text: `Atomik TransferTo() tamamlandı. ${tx.accountNumber} -> ${transferTargetAccNum} (${actionAmount.toLocaleString('tr-TR')} TL)`,
      });
      setActiveModal(null);
      onRefresh();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    }
  };

  const handleNewAccountSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const acc = engine.createAccount(
        currentCustomer.id,
        newAccType,
        newAccCurrency,
        newAccBalance,
        newAccType === 'Savings'
          ? { interestRate: newAccInterest, maturityDays: newAccMaturity }
          : { overdraftLimit: 15000 }
      );
      setStatusMessage({
        type: 'success',
        text: `Yeni polimorfik ${newAccType === 'Checking' ? 'Vadesiz' : 'Vadeli'} hesap açıldı: ${acc.accountNumber}`,
      });
      setActiveModal(null);
      onRefresh();
    } catch (err: unknown) {
      setStatusMessage({ type: 'error', text: (err as Error).message });
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Concept Explainer */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-emerald-400">
              <span>MODÜL 1</span>
              <span>·</span>
              <span>OOP & ENCAPSULATION</span>
              <span>·</span>
              <span>C# POLYMORPHISM</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Müşteri ve Polimorfik Hesap Yönetimi</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Soyut taban sınıf (<code className="text-emerald-300">Account</code>) üzerinden türeyen vadesiz (
              <code className="text-cyan-300">CheckingAccount</code>) ve vadeli (<code className="text-purple-300">SavingsAccount</code>) hesaplar.
              Bakiye alanı <code className="text-amber-300">private _balance</code> ile kapsüllenerek doğrudan dışarıdan değiştirilmesi engellenir.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                setActiveModal('newAccount');
              }}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-900 bg-emerald-400 hover:bg-emerald-300 rounded-lg transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Yeni Hesap Aç</span>
            </button>
          </div>
        </div>
      </div>

      {statusMessage && (
        <div
          className={`p-3 rounded-lg border text-xs flex items-center justify-between gap-2 font-mono ${
            statusMessage.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="text-slate-400 hover:text-slate-200">
            &times;
          </button>
        </div>
      )}

      {/* Customer Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-medium text-slate-400 whitespace-nowrap font-mono">Aktif Müşteri:</span>
        {customers.map((c) => {
          const isSelected = c.id === currentCustomer.id;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCustomerId(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap flex items-center gap-2 ${
                isSelected
                  ? 'bg-slate-800 text-emerald-400 border border-slate-700 shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 border border-transparent'
              }`}
            >
              <span>{c.fullName}</span>
              <span className="text-[10px] px-1 py-0.5 rounded bg-slate-700/60 font-mono text-slate-300">
                {c.customerType}
              </span>
            </button>
          );
        })}
      </div>

      {/* Customer Info Card & Accounts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Customer Profile & Encapsulation Invariant Card */}
        <div className="space-y-4">
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-mono text-slate-400">MÜŞTERİ PROFİLİ</span>
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                TCKN: {currentCustomer.tckn}
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{currentCustomer.fullName}</h3>
              <p className="text-xs text-slate-400 font-mono">{currentCustomer.email}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 text-xs font-mono">
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Aylık Net Gelir</span>
                <span className="text-white font-semibold text-sm tabular-nums">
                  {currentCustomer.monthlyIncome.toLocaleString('tr-TR')} TL
                </span>
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block text-[11px]">Findeks Notu</span>
                <span className="text-emerald-400 font-semibold text-sm tabular-nums">
                  {currentCustomer.findexScore} (AAA)
                </span>
              </div>
            </div>
          </div>

          {/* Encapsulation Invariant Code Block */}
          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded-xl space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <Lock className="w-3.5 h-3.5" />
              <span className="font-semibold">Kapsülleme (Encapsulation) Güvencesi</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Bakiye alanı doğrudan erişime kapalıdır. Yetkisiz bakiye ataması derleme zamanında engellenir:
            </p>
            <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 font-mono text-[11px] text-slate-300 space-y-1 overflow-x-auto">
              <div className="text-rose-400">// ❌ Derleme Hatası (CS0200):</div>
              <div className="line-through text-slate-500">account.Balance = 500000;</div>
              <div className="text-emerald-400 mt-2">// ✓ Doğru Yöntem (İş Kuralı Denetimli):</div>
              <div>account.Deposit(50000);</div>
              <div>account.Withdraw(12000, "Nakit");</div>
            </div>
          </div>
        </div>

        {/* Right 2 Columns: Customer's Accounts List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-200 font-mono">
              Müşteriye Ait Hesaplar ({currentCustomer.accounts.length})
            </h3>
            <span className="text-xs text-slate-400 font-mono">Türetilmiş OOP Modelleri</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentCustomer.accounts.map((acc) => {
              const isChecking = acc.type === 'Checking';
              const chk = isChecking ? (acc as CheckingAccount) : null;
              const sav = !isChecking ? (acc as SavingsAccount) : null;

              return (
                <div
                  key={acc.accountNumber}
                  className="p-4 bg-slate-900/90 border border-slate-800 hover:border-slate-700 rounded-xl space-y-4 transition-colors"
                >
                  {/* Account Header */}
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span
                          className={`text-[10px] font-mono px-2 py-0.5 rounded font-semibold ${
                            isChecking
                              ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                              : 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                          }`}
                        >
                          {isChecking ? 'CheckingAccount (Vadesiz)' : 'SavingsAccount (Vadeli)'}
                        </span>
                        <span className="text-xs text-slate-400 font-mono">{acc.currency}</span>
                      </div>
                      <h4 className="text-base font-bold text-white mt-1.5 font-mono">{acc.accountNumber}</h4>
                      <p className="text-[11px] text-slate-500 font-mono truncate">{acc.iban}</p>
                    </div>
                  </div>

                  {/* Balance Display */}
                  <div className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                    <span className="text-[11px] text-slate-400 block font-mono">Kapsüllenmiş Bakiye</span>
                    <div className="text-2xl font-bold text-emerald-400 font-mono tabular-nums">
                      {acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} {acc.currency}
                    </div>
                  </div>

                  {/* Polymorphic Specific Attributes */}
                  {isChecking && chk && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                      <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                        <span className="block text-[10px] text-slate-500">KMH Limiti</span>
                        <span className="text-slate-200 font-semibold tabular-nums">
                          {chk.overdraftLimit.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                        <span className="block text-[10px] text-slate-500">Kullanılan KMH</span>
                        <span className="text-amber-400 font-semibold tabular-nums">
                          {chk.utilizedOverdraft.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    </div>
                  )}

                  {!isChecking && sav && (
                    <div className="grid grid-cols-2 gap-2 text-xs font-mono text-slate-400">
                      <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                        <span className="block text-[10px] text-slate-500">Faiz Oranı / Vade</span>
                        <span className="text-purple-300 font-semibold">
                          %{sav.interestRateAnnual} · {sav.maturityDays} Gün
                        </span>
                      </div>
                      <div className="p-2 rounded bg-slate-950/60 border border-slate-800">
                        <span className="block text-[10px] text-slate-500">Tahakkuk Eden Faiz</span>
                        <span className="text-emerald-400 font-semibold tabular-nums">
                          +{sav.accruedInterest.toLocaleString('tr-TR')} TL
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
                    <button
                      onClick={() => {
                        setTargetAccount(acc);
                        setActiveModal('deposit');
                      }}
                      className="flex-1 py-1.5 text-xs font-medium bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
                    >
                      <ArrowDownLeft className="w-3.5 h-3.5" />
                      <span>Deposit()</span>
                    </button>
                    <button
                      onClick={() => {
                        setTargetAccount(acc);
                        setActiveModal('withdraw');
                      }}
                      className="flex-1 py-1.5 text-xs font-medium bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
                    >
                      <ArrowUpRight className="w-3.5 h-3.5" />
                      <span>Withdraw()</span>
                    </button>
                    <button
                      onClick={() => {
                        setTargetAccount(acc);
                        const otherAcc = allAccounts.find((a) => a.account.accountNumber !== acc.accountNumber);
                        if (otherAcc) setTransferTargetAccNum(otherAcc.account.accountNumber);
                        setActiveModal('transfer');
                      }}
                      className="py-1.5 px-2.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 rounded-lg transition-colors flex items-center justify-center gap-1 font-mono"
                      title="Hesaplar arası transfer (TransferTo)"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Modal: Deposit */}
      {activeModal === 'deposit' && targetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                Hesaba Para Yatır &middot; Deposit()
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Hedef Hesap: <span className="font-mono text-emerald-400">{targetAccount.accountNumber}</span> ({targetAccount.currency})
            </p>
            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Yatırılacak Tutar ({targetAccount.currency})</label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-emerald-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Açıklama (Opsiyonel)</label>
                <input
                  type="text"
                  placeholder="Mevduat Yatırma"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-emerald-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  Deposit() Çağır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Withdraw */}
      {activeModal === 'withdraw' && targetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                Hesaptan Para Çek &middot; Withdraw()
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Kaynak Hesap: <span className="font-mono text-emerald-400">{targetAccount.accountNumber}</span> (Mevcut: {targetAccount.balance.toLocaleString('tr-TR')} {targetAccount.currency})
            </p>
            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Çekilecek Tutar ({targetAccount.currency})</label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-rose-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Açıklama</label>
                <input
                  type="text"
                  placeholder="Nakit Çekim"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-rose-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-rose-500 text-white rounded-lg hover:bg-rose-400 transition-colors"
                >
                  Withdraw() Çağır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Transfer */}
      {activeModal === 'transfer' && targetAccount && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                Hesaplar Arası Transfer &middot; TransferTo()
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>
            <p className="text-xs text-slate-400">
              Kaynak: <span className="font-mono text-emerald-400">{targetAccount.accountNumber}</span>
            </p>
            <form onSubmit={handleTransferSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Hedef Hesap</label>
                <select
                  value={transferTargetAccNum}
                  onChange={(e) => setTransferTargetAccNum(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs focus:border-cyan-500 outline-none"
                  required
                >
                  {allAccounts
                    .filter((a) => a.account.accountNumber !== targetAccount.accountNumber)
                    .map((a) => (
                      <option key={a.account.accountNumber} value={a.account.accountNumber}>
                        {a.account.accountNumber} ({a.customerName} - {a.account.type})
                      </option>
                    ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Transfer Tutarı ({targetAccount.currency})</label>
                <input
                  type="number"
                  min="1"
                  step="100"
                  value={actionAmount}
                  onChange={(e) => setActionAmount(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono focus:border-cyan-500 outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">İşlem Açıklaması</label>
                <input
                  type="text"
                  placeholder="Kira / Fatura Transferi"
                  value={actionNote}
                  onChange={(e) => setActionNote(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs outline-none focus:border-cyan-500"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-cyan-500 text-slate-950 rounded-lg hover:bg-cyan-400 transition-colors font-mono"
                >
                  TransferTo() Çalıştır
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: New Account */}
      {activeModal === 'newAccount' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white font-mono">
                Yeni Hesap Tanımla (Polymorphic Factory)
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-white">
                &times;
              </button>
            </div>
            <form onSubmit={handleNewAccountSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Hesap Türü (Polymorphic Class)</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setNewAccType('Checking')}
                    className={`py-2 text-xs font-mono rounded-lg border text-center ${
                      newAccType === 'Checking'
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    CheckingAccount (Vadesiz)
                  </button>
                  <button
                    type="button"
                    onClick={() => setNewAccType('Savings')}
                    className={`py-2 text-xs font-mono rounded-lg border text-center ${
                      newAccType === 'Savings'
                        ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-semibold'
                        : 'bg-slate-950 text-slate-400 border-slate-800'
                    }`}
                  >
                    SavingsAccount (Vadeli)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Para Birimi</label>
                  <select
                    value={newAccCurrency}
                    onChange={(e) => setNewAccCurrency(e.target.value as 'TRY' | 'USD' | 'EUR')}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white text-xs font-mono"
                  >
                    <option value="TRY">TRY - Türk Lirası</option>
                    <option value="USD">USD - Dolar</option>
                    <option value="EUR">EUR - Euro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Başlangıç Bakiyesi</label>
                  <input
                    type="number"
                    min="0"
                    step="500"
                    value={newAccBalance}
                    onChange={(e) => setNewAccBalance(parseFloat(e.target.value) || 0)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs"
                    required
                  />
                </div>
              </div>

              {newAccType === 'Savings' && (
                <div className="grid grid-cols-2 gap-3 p-3 bg-purple-950/20 border border-purple-900/30 rounded-lg">
                  <div>
                    <label className="block text-xs font-mono text-purple-300 mb-1">Yıllık Faiz Oranı (%)</label>
                    <input
                      type="number"
                      step="0.5"
                      value={newAccInterest}
                      onChange={(e) => setNewAccInterest(parseFloat(e.target.value) || 0)}
                      className="w-full px-2 py-1.5 bg-slate-950 border border-purple-800/40 rounded text-white font-mono text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-mono text-purple-300 mb-1">Vade (Gün)</label>
                    <select
                      value={newAccMaturity}
                      onChange={(e) => setNewAccMaturity(parseInt(e.target.value))}
                      className="w-full px-2 py-1.5 bg-slate-950 border border-purple-800/40 rounded text-white font-mono text-xs"
                    >
                      <option value={32}>32 Gün</option>
                      <option value={92}>92 Gün</option>
                      <option value={181}>181 Gün</option>
                      <option value={365}>365 Gün</option>
                    </select>
                  </div>
                </div>
              )}

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveModal(null)}
                  className="px-4 py-2 text-xs text-slate-400 hover:text-white"
                >
                  İptal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold bg-emerald-500 text-slate-950 rounded-lg hover:bg-emerald-400 transition-colors"
                >
                  Hesabı Oluştur
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
