/**
 * CustomerDashboard - Müşteri İnternet & Mobil Bankacılık Paneli
 * Özellikler: Hesap yönetimi, Para yatırma/çekme, Havale, Sayfalamalı (Paging) Hesap Hareketleri
 * Mimar: Enes Öztürk
 */

import React, { useState, useMemo } from 'react';
import { 
  Wallet, 
  ArrowUpCircle, 
  ArrowDownCircle, 
  Send, 
  Receipt, 
  CreditCard, 
  ChevronLeft, 
  ChevronRight, 
  FileSpreadsheet, 
  Copy, 
  Check, 
  Plus,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { User } from '../core/models/User';
import { Account } from '../core/models/Account';
import { Transaction } from '../core/models/Transaction';
import { DatabaseManager } from '../core/database/DatabaseManager';
import { TransactionService } from '../core/services/TransactionService';
import { PasswordService } from '../core/security/PasswordService';
import { FileIOService } from '../core/services/FileIOService';

interface CustomerDashboardProps {
  currentUser: User;
  onShowReceipt: (tx: Transaction, acc?: Account, usr?: User) => void;
  onRefreshData: () => void;
}

export const CustomerDashboard: React.FC<CustomerDashboardProps> = ({
  currentUser,
  onShowReceipt,
  onRefreshData
}) => {
  const db = DatabaseManager.getInstance();
  const transactionService = new TransactionService();

  // Müşterinin Hesapları
  const userAccounts = useMemo(() => {
    return db.accounts.findByUserId(currentUser.id);
  }, [currentUser.id, db]);

  const [selectedAccountId, setSelectedAccountId] = useState<string>(() => {
    return userAccounts.length > 0 ? userAccounts[0].id : '';
  });

  const selectedAccount = useMemo(() => {
    return userAccounts.find(a => a.id === selectedAccountId) || userAccounts[0];
  }, [userAccounts, selectedAccountId]);

  // Sayfalama (Paging) Durumu
  const [currentPage, setCurrentPage] = useState<number>(0);
  const pageSize = 5;

  // Hesap Hareketleri
  const transactions = useMemo(() => {
    if (!selectedAccount) return [];
    return db.transactions.findByAccountId(selectedAccount.id);
  }, [selectedAccount, db]);

  // Sayfalanmış içerik
  const totalElements = transactions.length;
  const totalPages = Math.ceil(totalElements / pageSize) || 1;
  const pagedTransactions = useMemo(() => {
    const start = currentPage * pageSize;
    return transactions.slice(start, start + pageSize);
  }, [transactions, currentPage, pageSize]);

  // Hızlı İşlem Modal / Form Durumları
  const [actionTab, setActionTab] = useState<'none' | 'deposit' | 'withdraw' | 'transfer'>('none');
  const [amountInput, setAmountInput] = useState<string>('');
  const [transferIbanInput, setTransferIbanInput] = useState<string>('TR330006100522223333444401');
  const [transferRecipientInput, setTransferRecipientInput] = useState<string>('Zeynep Kaya');
  const [transferNoteInput, setTransferNoteInput] = useState<string>('Ödeme');
  const [actionFeedback, setActionFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const [copiedIban, setCopiedIban] = useState<boolean>(false);

  // Toplam Portföy
  const totalBalance = useMemo(() => {
    return userAccounts.reduce((acc, a) => acc + a.balance, 0);
  }, [userAccounts]);

  const copyIban = (iban: string) => {
    navigator.clipboard.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  // İşlem Gerçekleştirme
  const handleExecuteAction = () => {
    if (!selectedAccount) return;
    const amount = parseFloat(amountInput);

    if (isNaN(amount) || amount <= 0) {
      setActionFeedback({ type: 'error', message: 'Lütfen geçerli bir tutar giriniz!' });
      return;
    }

    if (actionTab === 'deposit') {
      const res = transactionService.deposit(selectedAccount.id, amount, currentUser.id, 'İnternet Şubesi Para Yatırma');
      if (res.success && res.transaction) {
        setActionFeedback({ type: 'success', message: res.message });
        setAmountInput('');
        onRefreshData();
      } else {
        setActionFeedback({ type: 'error', message: res.message });
      }
    } else if (actionTab === 'withdraw') {
      const res = transactionService.withdraw(selectedAccount.id, amount, currentUser.id);
      if (res.success && res.transaction) {
        setActionFeedback({ type: 'success', message: res.message });
        setAmountInput('');
        onRefreshData();
      } else {
        setActionFeedback({ type: 'error', message: res.message });
      }
    } else if (actionTab === 'transfer') {
      const res = transactionService.transfer(
        selectedAccount.id,
        transferIbanInput,
        transferRecipientInput,
        amount,
        transferNoteInput,
        currentUser.id
      );
      if (res.success && res.transaction) {
        setActionFeedback({ type: 'success', message: res.message });
        setAmountInput('');
        onRefreshData();
      } else {
        setActionFeedback({ type: 'error', message: res.message });
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Müşteri Karşılama ve Portföy Kartı */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-6 border border-slate-700 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-mono font-bold">
              Bireysel Bankacılık
            </span>
          </div>
          <h1 className="text-2xl font-bold text-white">
            Sayın {currentUser.fullName}
          </h1>
          <p className="text-xs text-slate-400 font-mono">
            TC Kimlik: {PasswordService.maskTcNo(currentUser.tcNo)} | Şube: Kadıköy / İstanbul
          </p>
        </div>

        {/* Toplam Varlık */}
        <div className="bg-slate-950/70 border border-slate-800 p-4 rounded-xl min-w-[240px]">
          <span className="text-xs text-slate-400 block font-medium">Toplam Net Varlık</span>
          <div className="text-2xl font-extrabold text-amber-400 mt-1">
            {totalBalance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
          </div>
          <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            Mevduat Güvencesi Altında
          </span>
        </div>
      </div>

      {/* Hesaplarım & Kartlarım Grid */}
      <div>
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-amber-400" />
          <span>Vadesiz & Vadeli Hesaplarım ({userAccounts.length})</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {userAccounts.map(acc => {
            const isSelected = acc.id === selectedAccountId;
            return (
              <div
                key={acc.id}
                onClick={() => { setSelectedAccountId(acc.id); setCurrentPage(0); }}
                className={`p-5 rounded-2xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-slate-900 to-amber-950/40 border-amber-500 shadow-lg shadow-amber-600/10'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                    {acc.accountType}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                    acc.isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    {acc.isActive ? 'AKTİF' : 'PASİF'}
                  </span>
                </div>

                <div className="text-2xl font-extrabold text-white mb-1">
                  {acc.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                </div>

                <div className="text-xs text-slate-400 font-mono flex items-center justify-between pt-2 border-t border-slate-800">
                  <span>Hesap: {acc.accountNumber}</span>
                  <button
                    onClick={(e) => { e.stopPropagation(); copyIban(acc.iban); }}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300"
                    title="IBAN Kopyala"
                  >
                    {copiedIban ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>IBAN</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500 font-mono mt-1 truncate">
                  {acc.iban}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Hızlı Bankacılık Aksiyonları */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h3 className="font-bold text-white text-base">Hızlı Bankacılık İşlemleri</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setActionTab('deposit'); setActionFeedback(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                actionTab === 'deposit' ? 'bg-emerald-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ArrowUpCircle className="w-4 h-4 text-emerald-400" />
              <span>Para Yatır</span>
            </button>
            <button
              onClick={() => { setActionTab('withdraw'); setActionFeedback(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                actionTab === 'withdraw' ? 'bg-amber-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <ArrowDownCircle className="w-4 h-4 text-amber-400" />
              <span>Para Çek</span>
            </button>
            <button
              onClick={() => { setActionTab('transfer'); setActionFeedback(null); }}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                actionTab === 'transfer' ? 'bg-sky-600 text-white shadow-lg' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Send className="w-4 h-4 text-sky-400" />
              <span>Havale / FAST</span>
            </button>
          </div>
        </div>

        {/* Aksiyon Formu */}
        {actionTab !== 'none' && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-4 bg-slate-950/60 p-4 rounded-xl">
            {actionFeedback && (
              <div className={`p-3 rounded-xl text-xs font-medium flex items-center space-x-2 ${
                actionFeedback.type === 'success' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
              }`}>
                <span>{actionFeedback.message}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">Kaynak Hesap</label>
                <div className="bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono">
                  {selectedAccount?.accountNumber} ({selectedAccount?.balance.toLocaleString('tr-TR')} ₺)
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">İşlem Tutarı (₺)</label>
                <input
                  type="number"
                  placeholder="0.00 ₺"
                  value={amountInput}
                  onChange={e => setAmountInput(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white font-bold focus:border-amber-500"
                />
              </div>

              {actionTab === 'transfer' && (
                <>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Alıcı IBAN</label>
                    <input
                      type="text"
                      value={transferIbanInput}
                      onChange={e => setTransferIbanInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white font-mono focus:border-sky-500"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 block mb-1">Alıcı Ad Soyad</label>
                    <input
                      type="text"
                      value={transferRecipientInput}
                      onChange={e => setTransferRecipientInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-slate-400 block mb-1">Açıklama</label>
                    <input
                      type="text"
                      value={transferNoteInput}
                      onChange={e => setTransferNoteInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white focus:border-sky-500"
                    />
                  </div>
                </>
              )}
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={() => setActionTab('none')}
                className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-xl"
              >
                Kapat
              </button>
              <button
                onClick={handleExecuteAction}
                className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-amber-600/30"
              >
                Onayla ve Gerçekleştir
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ================= HESAP HAREKETLERİ & SAYFALAMA (PAGING) ================= */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-400" />
              <span>Hesap Hareketleri (İşlem Geçmişi)</span>
            </h3>
            <p className="text-xs text-slate-400">
              {selectedAccount?.accountNumber} nolu hesap için toplam {totalElements} hareket bulundu.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg font-mono">
              Sayfalama (Paging): {currentPage + 1} / {totalPages}
            </span>
          </div>
        </div>

        {/* Tablo */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Tarih / Saat</th>
                <th className="py-3 px-4">İşlem Türü</th>
                <th className="py-3 px-4">Açıklama</th>
                <th className="py-3 px-4 text-right">Tutar</th>
                <th className="py-3 px-4 text-right">Kalan Bakiye</th>
                <th className="py-3 px-4 text-center">Dekont</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-sans">
              {pagedTransactions.length > 0 ? (
                pagedTransactions.map(tx => {
                  const isPositive = tx.transactionType === 'DEPOSIT' || tx.transactionType === 'TRANSFER_IN';
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 font-mono text-slate-400">
                        {new Date(tx.createdAt).toLocaleString('tr-TR')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded font-mono font-bold text-[10px] ${
                          isPositive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-300'
                        }`}>
                          {tx.transactionType}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-slate-300 max-w-xs truncate">
                        {tx.description}
                      </td>
                      <td className={`py-3 px-4 text-right font-bold font-mono ${
                        isPositive ? 'text-emerald-400' : 'text-rose-400'
                      }`}>
                        {isPositive ? '+' : '-'}{tx.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="py-3 px-4 text-right font-mono text-slate-300">
                        {tx.balanceAfter.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </td>
                      <td className="py-3 px-4 text-center">
                        <button
                          onClick={() => onShowReceipt(tx, selectedAccount, currentUser)}
                          className="p-1 text-slate-400 hover:text-amber-400 hover:bg-slate-800 rounded transition-colors"
                          title="Resmi Banka Dekontunu Görüntüle ve İndir"
                        >
                          <Receipt className="w-4 h-4 inline" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-slate-500">
                    Bu hesap için henüz bir hareket kaydı bulunmamaktadır.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* SAYFALAMA KONTROLLERİ (PAGING CONTROLS) */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400">
              Gösterilen: {Math.min(currentPage * pageSize + 1, totalElements)} - {Math.min((currentPage + 1) * pageSize, totalElements)} / Toplam: {totalElements}
            </span>

            <div className="flex items-center space-x-1">
              <button
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                disabled={currentPage === 0}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i)}
                  className={`w-8 h-8 rounded-lg font-mono text-xs font-bold transition-all ${
                    currentPage === i
                      ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                      : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white'
                  }`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                disabled={currentPage >= totalPages - 1}
                className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-slate-300 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
