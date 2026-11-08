/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Müşteri İnternet Bankacılığı Portali (Online Banking Portal)
 * - Para Yatırma
 * - Para Çekme (Bakiye kontrolü doğrulaması)
 * - Havale / EFT
 * - Sayfalamalı (Paging) İşlem Geçmişi & Dekont İndirme
 */

import React, { useState } from 'react';
import {
  CreditCard,
  ArrowUpRight,
  ArrowDownLeft,
  Send,
  Eye,
  EyeOff,
  Copy,
  Check,
  Search,
  Filter,
  Receipt,
  Download,
  AlertCircle,
  Clock,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Banknote,
  RotateCcw,
} from 'lucide-react';
import { User, Account, Transaction } from '../../types/models';
import { TransactionType } from '../../types/enums';
import { AccountService } from '../../core/services/AccountService';
import { LocalStorageBankRepository } from '../../core/repositories/LocalStorageBankRepository';
import { FileIoService } from '../../core/services/FileIoService';
import { soundEffects } from '../../utils/soundEffects';
import { AtmReceiptModal } from '../AtmTerminal/AtmReceiptModal';

interface CustomerPortalProps {
  user: User;
  account: Account;
  onRefreshData: () => void;
  onSwitchToAtm: () => void;
}

export const CustomerPortal: React.FC<CustomerPortalProps> = ({
  user,
  account,
  onRefreshData,
  onSwitchToAtm,
}) => {
  const repository = LocalStorageBankRepository.getInstance();
  const accountService = new AccountService();

  // Active operation modals
  const [activeModal, setActiveModal] = useState<'DEPOSIT' | 'WITHDRAW' | 'TRANSFER' | null>(null);

  // Form states
  const [amountInput, setAmountInput] = useState('');
  const [transferIban, setTransferIban] = useState('');
  const [transferTitle, setTransferTitle] = useState('');
  const [transferDescription, setTransferDescription] = useState('Borç ödemesi');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Security toggles
  const [isCardDetailsVisible, setIsCardDetailsVisible] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

  // Transaction history filter & pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | TransactionType>('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // Selected receipt modal
  const [selectedTxnForReceipt, setSelectedTxnForReceipt] = useState<Transaction | null>(null);

  // Copy IBAN
  const handleCopyIban = () => {
    soundEffects.playKeypadBeep();
    navigator.clipboard.writeText(account.iban.replace(/\s+/g, ''));
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  // Perform Deposit
  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const amt = Number(amountInput);

    try {
      soundEffects.playKeypadBeep();
      const result = accountService.deposit(account.id, amt, 'ONLINE_BRANCH', 'İnternet Şubesi Para Yatırma');
      soundEffects.playSuccessChime();
      setSuccessMessage(`${amt.toLocaleString('tr-TR')} ₺ hesabınıza başarıyla yatırıldı.`);
      setAmountInput('');
      setActiveModal(null);
      setSelectedTxnForReceipt(result.transaction);
      onRefreshData();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Para yatırma işlemi başarısız.');
    }
  };

  // Perform Withdraw
  const handleWithdrawSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const amt = Number(amountInput);

    try {
      soundEffects.playKeypadBeep();
      // Bakiye ve çekim stratejisi kontrolü
      const result = accountService.withdraw(account.id, amt, 'ONLINE_BRANCH');
      soundEffects.playSuccessChime();
      setSuccessMessage(`${amt.toLocaleString('tr-TR')} ₺ nakit hesabınızdan çekildi.`);
      setAmountInput('');
      setActiveModal(null);
      setSelectedTxnForReceipt(result.transaction);
      onRefreshData();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Para çekme işlemi başarısız.');
    }
  };

  // Perform Transfer
  const handleTransferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    const amt = Number(amountInput);

    try {
      soundEffects.playKeypadBeep();
      const result = accountService.transfer(
        account.id,
        transferIban,
        transferTitle,
        amt,
        transferDescription,
        'ONLINE_BRANCH'
      );
      soundEffects.playSuccessChime();
      setSuccessMessage(`${amt.toLocaleString('tr-TR')} ₺ tutarındaki havale başarıyla gönderildi.`);
      setAmountInput('');
      setTransferIban('');
      setTransferTitle('');
      setActiveModal(null);
      setSelectedTxnForReceipt(result.transaction);
      onRefreshData();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Transfer işlemi gerçekleştirilemedi.');
    }
  };

  // Get transactions with client-side filtering and pagination
  const allTxns = repository.findTransactionsByAccountId(account.id, { page: 1, size: 100 }).content;

  const filteredTxns = allTxns.filter((t) => {
    const matchesSearch =
      t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.transactionNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (t.targetIban && t.targetIban.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredTxns.length / itemsPerPage) || 1;
  const paginatedTxns = filteredTxns.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Other registered accounts for fast transfer selection
  const otherCustomers = repository.findCustomerAccountProjections().filter((c) => c.customerId !== user.id);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex items-center justify-between flex-wrap gap-4 bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <div className="space-y-1">
          <div className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
            Öztürk Bank İnternet Bankacılığı
          </div>
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            Hoş Geldiniz, {user.fullName}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            Müşteri No: {user.tcNo} · Kadıköy Merkez Şubesi
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onSwitchToAtm}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold transition-colors flex items-center gap-2 shadow-sm"
          >
            <Banknote className="w-4 h-4 text-amber-400" />
            Fiziksel ATM Simülatörüne Geç
          </button>
        </div>
      </div>

      {/* Account Overview Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Card 1: Virtual Debit Card Mockup */}
        <div className="relative h-56 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950/40 border border-amber-500/30">
          {/* Card Top */}
          <div className="flex items-center justify-between z-10">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 bg-amber-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-sm">
                Ö
              </div>
              <span className="font-extrabold tracking-widest text-slate-100 text-sm">ÖZTÜRK BANK</span>
            </div>
            <span className="text-[11px] font-mono font-bold text-amber-400/90 tracking-wider">PLATINUM DEBIT</span>
          </div>

          {/* EMV Chip & Contactless */}
          <div className="flex items-center gap-3 z-10 my-1">
            <div className="w-10 h-7 rounded bg-gradient-to-r from-amber-300 to-amber-500/80 border border-amber-200/50 shadow-inner"></div>
            <div className="text-xs text-slate-400 font-mono tracking-tighter">)))</div>
          </div>

          {/* Card Number */}
          <div className="z-10 flex items-center justify-between">
            <div className="font-mono text-base tracking-widest text-slate-100 font-semibold">
              {isCardDetailsVisible ? account.cardNumber : `•••• •••• •••• ${account.cardNumber.slice(-4)}`}
            </div>
            <button
              onClick={() => setIsCardDetailsVisible(!isCardDetailsVisible)}
              className="text-slate-400 hover:text-slate-200 transition-colors"
              title={isCardDetailsVisible ? 'Gizle' : 'Göster'}
            >
              {isCardDetailsVisible ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Card Bottom: Holder Name, Expiry & CVV */}
          <div className="flex items-center justify-between text-xs font-mono text-slate-300 z-10 pt-2 border-t border-slate-700/50">
            <div>
              <div className="text-[9px] text-slate-500 uppercase">Kart Sahibi</div>
              <div className="font-bold tracking-wide uppercase text-slate-200">{user.fullName}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase">Son Kullanma</div>
              <div className="font-bold text-slate-200">{account.cardExpiry}</div>
            </div>
            <div className="text-right">
              <div className="text-[9px] text-slate-500 uppercase">CVV</div>
              <div className="font-bold text-slate-200">{isCardDetailsVisible ? account.cardCvv : '•••'}</div>
            </div>
          </div>
        </div>

        {/* Card 2: Balance & Account Details */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
              <span>Vadesiz TL Hesabı</span>
              <span className="text-emerald-400 font-mono">AKTİF</span>
            </div>
            <div className="text-3xl font-extrabold text-slate-100 font-mono tabular-nums">
              {account.balance.toLocaleString('tr-TR')} <span className="text-amber-400">₺</span>
            </div>
          </div>

          <div className="space-y-2 border-t border-slate-800 pt-3 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Hesap Numarası:</span>
              <span className="font-mono font-bold text-slate-200">{account.accountNumber}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-slate-400 shrink-0">IBAN:</span>
              <div className="flex items-center gap-1.5 truncate">
                <span className="font-mono text-[11px] text-slate-300 truncate">{account.iban}</span>
                <button
                  onClick={handleCopyIban}
                  className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-amber-400 transition-colors"
                  title="IBAN Kopyala"
                >
                  {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex items-center justify-between text-xs font-mono">
            <span className="text-slate-400">Günlük Kalan Çekim:</span>
            <span className="text-amber-400 font-bold">
              {(account.dailyWithdrawalLimit - account.todayWithdrawnAmount).toLocaleString('tr-TR')} ₺
            </span>
          </div>
        </div>

        {/* Card 3: Quick Action Launchers */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
            Hızlı Bankacılık İşlemleri
          </div>

          <div className="space-y-2.5">
            {/* Para Yatır Button */}
            <button
              onClick={() => {
                soundEffects.playKeypadBeep();
                setActiveModal('DEPOSIT');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full py-3 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowDownLeft className="w-4 h-4" />
                <span>Para Yatır (Hesaba Ekle)</span>
              </div>
              <span className="text-[10px] text-emerald-500 font-mono">+ Bakiye</span>
            </button>

            {/* Para Çek Button */}
            <button
              onClick={() => {
                soundEffects.playKeypadBeep();
                setActiveModal('WITHDRAW');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full py-3 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <ArrowUpRight className="w-4 h-4" />
                <span>Para Çek (Hesaptan Düş)</span>
              </div>
              <span className="text-[10px] text-amber-500 font-mono">- Bakiye</span>
            </button>

            {/* Havale / EFT Button */}
            <button
              onClick={() => {
                soundEffects.playKeypadBeep();
                setActiveModal('TRANSFER');
                setErrorMessage(null);
                setSuccessMessage(null);
              }}
              className="w-full py-3 px-4 bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 rounded-xl font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <Send className="w-4 h-4" />
                <span>Havale / EFT / Transfer</span>
              </div>
              <span className="text-[10px] text-sky-500 font-mono">Anlık İletim</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 text-center pt-1 font-mono">
            İşlem Ücreti: 0.00 ₺ (Ücretsiz)
          </div>
        </div>
      </div>

      {/* Success Notification Bar */}
      {successMessage && (
        <div className="p-4 bg-emerald-500/15 border border-emerald-500/30 rounded-2xl text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
          {selectedTxnForReceipt && (
            <button
              onClick={() => setSelectedTxnForReceipt(selectedTxnForReceipt)}
              className="text-xs font-bold text-emerald-300 underline hover:text-emerald-200"
            >
              Dekontu İndir
            </button>
          )}
        </div>
      )}

      {/* Transaction History Section with Sayfalama (Paging) */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              Hesap Hareketleri &amp; Dekont Arşivi
            </h2>
            <p className="text-xs text-slate-400">
              Gerçekleşen tüm para yatırma, çekme ve havale işlemleriniz (Sayfalama Destekli)
            </p>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Açıklama veya Ref No ara..."
                className="pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => {
                  setTypeFilter('ALL');
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === 'ALL' ? 'bg-slate-800 text-slate-100 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Tümü
              </button>
              <button
                onClick={() => {
                  setTypeFilter(TransactionType.DEPOSIT);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === TransactionType.DEPOSIT ? 'bg-slate-800 text-emerald-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Yatırılan
              </button>
              <button
                onClick={() => {
                  setTypeFilter(TransactionType.WITHDRAW);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === TransactionType.WITHDRAW ? 'bg-slate-800 text-amber-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Çekilen
              </button>
              <button
                onClick={() => {
                  setTypeFilter(TransactionType.TRANSFER_OUT);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1 rounded transition-colors ${
                  typeFilter === TransactionType.TRANSFER_OUT ? 'bg-slate-800 text-sky-400 font-bold' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Havale
              </button>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-slate-950/70 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tarih / Saat</th>
                <th className="py-3 px-4">Ref No</th>
                <th className="py-3 px-4">İşlem Türü</th>
                <th className="py-3 px-4">Açıklama</th>
                <th className="py-3 px-4 text-right">Tutar</th>
                <th className="py-3 px-4 text-right">Kalan Bakiye</th>
                <th className="py-3 px-4 text-center">Dekont</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono">
              {paginatedTxns.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500 font-sans">
                    Aramanızla eşleşen işlem bulunamadı.
                  </td>
                </tr>
              ) : (
                paginatedTxns.map((t) => {
                  const isPositive =
                    t.type === TransactionType.DEPOSIT || t.type === TransactionType.TRANSFER_IN;
                  return (
                    <tr key={t.id} className="hover:bg-slate-950/40 transition-colors">
                      <td className="py-3 px-4 text-slate-400">
                        {new Date(t.createdAt).toLocaleString('tr-TR', {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </td>
                      <td className="py-3 px-4 text-slate-400">{t.transactionNumber}</td>
                      <td className="py-3 px-4 font-sans">
                        <span
                          className={`font-semibold ${
                            isPositive ? 'text-emerald-400' : 'text-amber-400'
                          }`}
                        >
                          {t.type === TransactionType.DEPOSIT
                            ? 'Nakit Yatırma'
                            : t.type === TransactionType.WITHDRAW
                            ? 'Nakit Çekme'
                            : t.type === TransactionType.TRANSFER_OUT
                            ? 'Giden Transfer'
                            : 'Gelen Transfer'}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-sans text-slate-300 max-w-xs truncate">
                        {t.description}
                      </td>
                      <td className="py-3 px-4 text-right font-bold tabular-nums">
                        <span className={isPositive ? 'text-emerald-400' : 'text-slate-100'}>
                          {isPositive ? '+' : '-'}
                          {t.amount.toLocaleString('tr-TR')} ₺
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right text-slate-400 tabular-nums">
                        {t.newBalance.toLocaleString('tr-TR')} ₺
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => {
                            soundEffects.playKeypadBeep();
                            setSelectedTxnForReceipt(t);
                          }}
                          className="p-1.5 hover:bg-slate-800 rounded text-amber-400 hover:text-amber-300 transition-colors"
                          title="Resmi Dekontu Gör / İndir"
                        >
                          <Receipt className="w-4 h-4 inline-block" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Paging Footer (Sayfalama Kontrolleri) */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs text-slate-400 flex-wrap gap-3">
          <div>
            Toplam <strong>{filteredTxns.length}</strong> işlem · Sayfa <strong>{currentPage}</strong> / {totalPages}
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <button
                key={num}
                onClick={() => setCurrentPage(num)}
                className={`w-7 h-7 rounded-lg text-xs font-mono font-bold transition-colors ${
                  currentPage === num
                    ? 'bg-amber-500 text-slate-950'
                    : 'bg-slate-950 border border-slate-800 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {num}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="p-1.5 bg-slate-950 border border-slate-800 rounded-lg disabled:opacity-40 hover:bg-slate-800 text-slate-300 transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Modal: Para Yatırma (Deposit) */}
      {activeModal === 'DEPOSIT' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <ArrowDownLeft className="w-5 h-5 text-emerald-400" />
                Hesaba Para Yatırma
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-100">
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-lg">
                {errorMessage}
              </div>
            )}

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Yatırılacak Tutar (TL)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Örn: 1000"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 text-lg font-bold font-mono focus:outline-none focus:border-emerald-500"
                />
              </div>

              {/* Quick Amount Fast Pills */}
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[100, 250, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountInput(val.toString())}
                    className="p-1.5 bg-slate-950 border border-slate-800 hover:border-emerald-500/50 rounded text-slate-300 hover:text-emerald-400 text-center"
                  >
                    +{val} ₺
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Para Yatırmayı Tamamla
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Para Çekme (Withdraw) */}
      {activeModal === 'WITHDRAW' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <ArrowUpRight className="w-5 h-5 text-amber-400" />
                Hesaptan Para Çekme
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-100">
                ✕
              </button>
            </div>

            <div className="text-xs text-slate-400 flex justify-between">
              <span>Mevcut Bakiye:</span>
              <span className="text-emerald-400 font-bold font-mono">
                {account.balance.toLocaleString('tr-TR')} ₺
              </span>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleWithdrawSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Çekilecek Tutar (TL)</label>
                <input
                  type="number"
                  min="10"
                  step="10"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Örn: 500"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-amber-400 text-lg font-bold font-mono focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Quick withdrawal fast pills */}
              <div className="grid grid-cols-4 gap-2 text-xs font-mono">
                {[100, 200, 500, 1000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setAmountInput(val.toString())}
                    className="p-1.5 bg-slate-950 border border-slate-800 hover:border-amber-500/50 rounded text-slate-300 hover:text-amber-400 text-center"
                  >
                    {val} ₺
                  </button>
                ))}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Para Çekmeyi Onayla
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Havale / EFT / Transfer */}
      {activeModal === 'TRANSFER' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 shadow-2xl my-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-slate-100 flex items-center gap-2">
                <Send className="w-5 h-5 text-sky-400" />
                Havale / EFT Gönder
              </h3>
              <button onClick={() => setActiveModal(null)} className="text-slate-400 hover:text-slate-100">
                ✕
              </button>
            </div>

            {errorMessage && (
              <div className="p-3 bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs rounded-lg flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Quick Beneficiary Picker */}
            <div className="space-y-1.5">
              <span className="text-[11px] text-slate-400 uppercase font-semibold">
                Kayıtlı Diğer Banka Müşterileri (Hızlı Seçim):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {otherCustomers.map((c) => (
                  <button
                    key={c.customerId}
                    type="button"
                    onClick={() => {
                      setTransferIban(c.iban);
                      setTransferTitle(c.fullName);
                    }}
                    className="p-2 bg-slate-950 hover:bg-slate-800 border border-slate-800 rounded-lg text-left transition-colors"
                  >
                    <div className="font-bold text-slate-200">{c.fullName}</div>
                    <div className="text-[10px] text-slate-500 truncate">{c.iban}</div>
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={handleTransferSubmit} className="space-y-3 pt-2 border-t border-slate-800">
              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alıcı IBAN</label>
                <input
                  type="text"
                  required
                  value={transferIban}
                  onChange={(e) => setTransferIban(e.target.value)}
                  placeholder="TR34 0006 1000 ..."
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Alıcı Adı Soyadı</label>
                <input
                  type="text"
                  required
                  value={transferTitle}
                  onChange={(e) => setTransferTitle(e.target.value)}
                  placeholder="Örn: Ayşe Demir"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Transfer Tutarı (TL)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={amountInput}
                  onChange={(e) => setAmountInput(e.target.value)}
                  placeholder="Örn: 2500"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-sky-400 text-base font-bold font-mono focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-300 block mb-1">Açıklama</label>
                <input
                  type="text"
                  value={transferDescription}
                  onChange={(e) => setTransferDescription(e.target.value)}
                  placeholder="Örn: Kira bedeli"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 text-xs focus:outline-none focus:border-sky-500"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold rounded-lg text-xs transition-colors"
              >
                Transferi Onayla ve Gönder
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Receipt Modal */}
      {selectedTxnForReceipt && (
        <AtmReceiptModal
          isOpen={!!selectedTxnForReceipt}
          onClose={() => setSelectedTxnForReceipt(null)}
          transaction={selectedTxnForReceipt}
          user={user}
          account={account}
        />
      )}
    </div>
  );
};
