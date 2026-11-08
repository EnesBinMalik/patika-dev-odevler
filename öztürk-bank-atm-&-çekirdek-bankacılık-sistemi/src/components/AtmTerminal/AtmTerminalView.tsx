/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Fiziksel ATM Terminali Simülatörü
 * - 3 deneme hakkı koruması
 * - Bakiye yetersizse para çekememe doğrulaması
 * - Banknot yatırma / çekme animasyonu
 * - Donanımsal tuş takımı ve Enes Öztürk imzalı termal dekont
 */

import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  CornerDownLeft,
  Delete,
  XCircle,
  Banknote,
  Receipt,
  AlertCircle,
  CheckCircle2,
  Lock,
  ArrowRight,
  ShieldCheck,
  RotateCcw,
} from 'lucide-react';
import { User, Account, Transaction } from '../../types/models';
import { AccountStatus, Role } from '../../types/enums';
import { LocalStorageBankRepository } from '../../core/repositories/LocalStorageBankRepository';
import { AuthService } from '../../core/services/AuthService';
import { AccountService } from '../../core/services/AccountService';
import { soundEffects } from '../../utils/soundEffects';
import { AtmReceiptModal } from './AtmReceiptModal';

type AtmScreenState =
  | 'INSERT_CARD'
  | 'PIN_ENTRY'
  | 'MAIN_MENU'
  | 'WITHDRAW_AMOUNT'
  | 'WITHDRAW_CUSTOM'
  | 'DEPOSIT_AMOUNT'
  | 'DEPOSIT_CUSTOM'
  | 'TRANSFER_IBAN'
  | 'TRANSFER_AMOUNT'
  | 'BALANCE_VIEW'
  | 'SUCCESS'
  | 'ERROR_BLOCKED';

interface AtmTerminalViewProps {
  currentUser?: User | null;
  currentAccount?: Account | null;
  onRefreshData?: () => void;
  onSwitchToOnlinePortal?: () => void;
}

export const AtmTerminalView: React.FC<AtmTerminalViewProps> = ({
  currentUser,
  currentAccount,
  onRefreshData,
  onSwitchToOnlinePortal,
}) => {
  const repository = LocalStorageBankRepository.getInstance();
  const authService = new AuthService();
  const accountService = new AccountService();

  // Active ATM Session State
  const [screenState, setScreenState] = useState<AtmScreenState>('INSERT_CARD');
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeAccount, setActiveAccount] = useState<Account | null>(null);
  const [enteredPin, setEnteredPin] = useState('');
  const [screenMessage, setScreenMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number>(3);

  // Transfer input state
  const [transferTargetIban, setTransferTargetIban] = useState('');
  const [transferTargetTitle, setTransferTargetTitle] = useState('');
  const [customAmount, setCustomAmount] = useState('');

  // Hardware states
  const [isCardInserted, setIsCardInserted] = useState(false);
  const [isDispenserOpen, setIsDispenserOpen] = useState(false);
  const [dispensedCashNotes, setDispensedCashNotes] = useState<number | null>(null);
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // If user is already logged in on parent, allow instant card insertion
  const allCustomers = repository.findAllUsers().filter((u) => u.role === Role.USER);

  // Select card to insert
  const handleInsertCard = (userToInsert: User) => {
    soundEffects.playCardSlotClick();
    setActiveUser(userToInsert);
    const acc = repository.findAccountByCustomerId(userToInsert.id).orElse(null as any);
    setActiveAccount(acc);
    setIsCardInserted(true);

    if (userToInsert.status === AccountStatus.BLOCKED) {
      soundEffects.playErrorBuzzer();
      setScreenState('ERROR_BLOCKED');
      setErrorMessage(
        'Kartınız güvenlik nedeniyle BLOKE edilmiştir! (3 Hatalı Giriş). Lütfen şube yetkiliniz ile görüşünüz.'
      );
    } else {
      setScreenState('PIN_ENTRY');
      setEnteredPin('');
      setErrorMessage(null);
      setRemainingAttempts(Math.max(1, 3 - userToInsert.failedLoginAttempts));
    }
  };

  // Eject card
  const handleEjectCard = () => {
    soundEffects.playCardSlotClick();
    setIsCardInserted(false);
    setActiveUser(null);
    setActiveAccount(null);
    setEnteredPin('');
    setScreenState('INSERT_CARD');
    setErrorMessage(null);
    setScreenMessage(null);
    setIsDispenserOpen(false);
    setDispensedCashNotes(null);
  };

  // Tactile Keypad Handler
  const handleKeyPress = (key: string) => {
    soundEffects.playKeypadBeep();

    if (screenState === 'PIN_ENTRY') {
      if (key >= '0' && key <= '9') {
        if (enteredPin.length < 4) {
          setEnteredPin((prev) => prev + key);
        }
      } else if (key === 'CLEAR') {
        setEnteredPin('');
      } else if (key === 'CANCEL') {
        handleEjectCard();
      } else if (key === 'ENTER') {
        submitPin();
      }
    } else if (screenState === 'WITHDRAW_CUSTOM' || screenState === 'DEPOSIT_CUSTOM' || screenState === 'TRANSFER_AMOUNT') {
      if (key >= '0' && key <= '9') {
        setCustomAmount((prev) => prev + key);
      } else if (key === 'CLEAR') {
        setCustomAmount('');
      } else if (key === 'CANCEL') {
        setScreenState('MAIN_MENU');
        setCustomAmount('');
      } else if (key === 'ENTER') {
        if (screenState === 'WITHDRAW_CUSTOM') {
          executeWithdraw(Number(customAmount));
        } else if (screenState === 'DEPOSIT_CUSTOM') {
          executeDeposit(Number(customAmount));
        } else if (screenState === 'TRANSFER_AMOUNT') {
          executeTransfer(Number(customAmount));
        }
      }
    } else if (key === 'CANCEL') {
      if (screenState !== 'INSERT_CARD') {
        setScreenState('MAIN_MENU');
        setErrorMessage(null);
      }
    }
  };

  // Automatically submit PIN when 4 digits are reached
  useEffect(() => {
    if (screenState === 'PIN_ENTRY' && enteredPin.length === 4) {
      submitPin();
    }
  }, [enteredPin, screenState]);

  // Submit PIN Verification
  const submitPin = () => {
    if (!activeUser) return;
    try {
      const result = authService.login(activeUser.tcNo, enteredPin, 'ATM');
      soundEffects.playSuccessChime();
      setActiveUser(result.user);
      if (result.account) {
        setActiveAccount(result.account);
      }
      setScreenState('MAIN_MENU');
      setErrorMessage(null);
      onRefreshData?.();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setEnteredPin('');
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }
      if (err.code === 'BANK_ERR_ACCOUNT_BLOCKED') {
        setScreenState('ERROR_BLOCKED');
        setErrorMessage(err.message);
      } else {
        setErrorMessage(err.message);
      }
      onRefreshData?.();
    }
  };

  // Cash Withdrawal Execution
  const executeWithdraw = (amount: number) => {
    if (!activeAccount || !activeUser) return;
    setErrorMessage(null);

    try {
      // Bakiye ve çekim stratejisi kontrolü
      const result = accountService.withdraw(activeAccount.id, amount, 'ATM_TERMINAL');

      // Para sayma efekti ve dispenser açılışı
      soundEffects.playCashDispense();
      setIsDispenserOpen(true);
      setDispensedCashNotes(amount);
      setActiveAccount(result.updatedAccount);
      setLastTransaction(result.transaction);

      soundEffects.playSuccessChime();
      setScreenState('SUCCESS');
      setScreenMessage(
        `${amount.toLocaleString('tr-TR')} ₺ nakit paranız hazırlanmıştır. Lütfen para haznesinden alınız.`
      );
      onRefreshData?.();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Para çekme işlemi gerçekleştirilemedi.');
      // Keep on menu or current view so customer clearly sees why it failed
    }
  };

  // Cash Deposit Execution
  const executeDeposit = (amount: number) => {
    if (!activeAccount || !activeUser) return;
    setErrorMessage(null);

    try {
      soundEffects.playCashDispense();
      setIsDispenserOpen(true);
      setDispensedCashNotes(amount);

      const result = accountService.deposit(
        activeAccount.id,
        amount,
        'ATM_TERMINAL',
        'ATM Nakit Para Yatırma'
      );
      setActiveAccount(result.updatedAccount);
      setLastTransaction(result.transaction);

      soundEffects.playSuccessChime();
      setScreenState('SUCCESS');
      setScreenMessage(
        `${amount.toLocaleString('tr-TR')} ₺ nakit paranız hesabınıza başarıyla yatırılmıştır.`
      );
      onRefreshData?.();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Para yatırma işlemi başarısız.');
    }
  };

  // Transfer Execution
  const executeTransfer = (amount: number) => {
    if (!activeAccount || !activeUser) return;
    setErrorMessage(null);

    try {
      const result = accountService.transfer(
        activeAccount.id,
        transferTargetIban,
        transferTargetTitle || 'Banka Müşterisi',
        amount,
        'ATM Para Transferi',
        'ATM_TERMINAL'
      );
      setActiveAccount(result.sourceAccount);
      setLastTransaction(result.transaction);

      soundEffects.playSuccessChime();
      setScreenState('SUCCESS');
      setScreenMessage(
        `${amount.toLocaleString('tr-TR')} ₺ tutarındaki havale başarıyla aktarılmıştır.`
      );
      onRefreshData?.();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMessage(err.message || 'Transfer gerçekleştirilemedi.');
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* ATM Main Machine Casing */}
      <div className="bg-slate-900 border-4 border-slate-700/80 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
        {/* ATM Top Fascia Branding */}
        <div className="flex items-center justify-between border-b border-slate-700 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-amber-500 rounded-lg flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-amber-500/30">
              Ö
            </div>
            <div>
              <div className="text-xl font-black tracking-wider text-slate-100 flex items-center gap-2">
                ÖZTÜRK BANK
                <span className="text-[11px] font-mono font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                  ATM-3401
                </span>
              </div>
              <div className="text-xs text-slate-400">
                Kadıköy Şubesi · Çekirdek Bankacılık Motoru (Enes Öztürk İmzalı)
              </div>
            </div>
          </div>

          {/* Machine Status Lights */}
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-slate-300">ATM Durumu</div>
              <div className="text-[11px] text-emerald-400 font-mono">ÇEVRİMİÇİ (24/7)</div>
            </div>
            <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-md shadow-emerald-500/50"></div>
          </div>
        </div>

        {/* ATM Middle Core: Screen & Side Hardware */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LCD Screen Section (8 Cols) */}
          <div className="lg:col-span-8 space-y-4">
            {/* The Digital Screen Frame */}
            <div className="relative bg-slate-950 border-4 border-slate-800 rounded-2xl p-6 min-h-[440px] flex flex-col justify-between shadow-inner text-slate-100 font-mono">
              {/* Screen Top Status Bar */}
              <div className="flex items-center justify-between text-xs text-emerald-400 border-b border-emerald-500/20 pb-2 mb-4">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  GÜVENLİ BANKACILIK HATTI
                </span>
                <span>
                  {activeUser ? `Müşteri: ${activeUser.fullName}` : 'LÜTFEN KARTINIZI TAKINIZ'}
                </span>
              </div>

              {/* Error Message Bar if any */}
              {errorMessage && (
                <div className="mb-4 p-3 bg-rose-500/20 border border-rose-500/40 rounded-lg text-rose-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">UYARI: </span>
                    {errorMessage}
                  </div>
                </div>
              )}

              {/* Screen View: INSERT_CARD */}
              {screenState === 'INSERT_CARD' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-20 h-20 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-amber-400 shadow-lg animate-pulse">
                    <CreditCard className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-100">ÖZTÜRK BANK ATM'YE HOŞGELDİNİZ</h3>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm">
                      İşlem yapmak için lütfen aşağıdaki demo kartlardan birini takınız veya kart yuvasını kullanınız.
                    </p>
                  </div>

                  {/* Customer Card Picker for Testing */}
                  <div className="w-full max-w-md pt-2 space-y-2">
                    <div className="text-[11px] text-slate-400 uppercase font-bold text-left">
                      Kart Yuvasına Takılacak Kartı Seçin:
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                      {allCustomers.map((c) => (
                        <button
                          key={c.id}
                          onClick={() => handleInsertCard(c)}
                          className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                            c.status === AccountStatus.BLOCKED
                              ? 'bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60 text-rose-300'
                              : 'bg-slate-900/80 border-slate-800 hover:border-amber-500/50 text-slate-200'
                          }`}
                        >
                          <div className="font-bold flex items-center justify-between">
                            <span className="truncate">{c.fullName}</span>
                            {c.status === AccountStatus.BLOCKED && (
                              <span className="text-[9px] px-1 py-0.5 bg-rose-500/20 text-rose-400 rounded">
                                BLOKE
                              </span>
                            )}
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono mt-1">
                            TC: {c.tcNo} · PIN: {c.fullName.includes('Ahmet') ? '1234' : '••••'}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Screen View: PIN_ENTRY */}
              {screenState === 'PIN_ENTRY' && activeUser && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-5 py-8">
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-amber-400">
                    <Lock className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-100">LÜTFEN 4 HANELİ PIN KODUNUZU GİRİNİZ</h3>
                    <p className="text-xs text-slate-400 mt-1">
                      Sayın <strong>{activeUser.fullName}</strong>, tuş takımını kullanarak şifrenizi giriniz.
                    </p>
                  </div>

                  {/* Masked PIN Display */}
                  <div className="flex items-center gap-3 py-2">
                    {[0, 1, 2, 3].map((idx) => (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold transition-all ${
                          enteredPin.length > idx
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300 shadow-md shadow-amber-500/30'
                            : 'border-slate-800 bg-slate-900 text-slate-600'
                        }`}
                      >
                        {enteredPin.length > idx ? '●' : ''}
                      </div>
                    ))}
                  </div>

                  {/* Remaining attempts notice */}
                  <div className="text-xs text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-lg border border-amber-500/20">
                    Kalan Giriş Hakkı: <strong>{remainingAttempts} / 3</strong> (3 hatalı denemede kart bloke olur)
                  </div>
                </div>
              )}

              {/* Screen View: MAIN_MENU */}
              {screenState === 'MAIN_MENU' && activeUser && activeAccount && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-slate-200">ANA İŞLEM MENÜSÜ</h3>
                    <p className="text-xs text-slate-400">Lütfen yapmak istediğiniz bankacılık işlemini seçiniz:</p>
                  </div>

                  {/* Menu Options Grid with hardware button mapping */}
                  <div className="grid grid-cols-2 gap-3 my-4">
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('DEPOSIT_AMOUNT');
                        setErrorMessage(null);
                      }}
                      className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-emerald-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="text-[11px] text-emerald-400 font-bold mb-1">[F1] PARA YATIRMA</div>
                      <div className="text-xs text-slate-300 font-sans group-hover:text-white">
                        Hesaba Nakit Para Ekleme
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('WITHDRAW_AMOUNT');
                        setErrorMessage(null);
                      }}
                      className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-amber-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="text-[11px] text-amber-400 font-bold mb-1">[F5] PARA ÇEKME</div>
                      <div className="text-xs text-slate-300 font-sans group-hover:text-white">
                        Hazneden Nakit Para Çekme
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('TRANSFER_IBAN');
                        setErrorMessage(null);
                      }}
                      className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="text-[11px] text-sky-400 font-bold mb-1">[F2] HAVALE / EFT</div>
                      <div className="text-xs text-slate-300 font-sans group-hover:text-white">
                        Başka Hesaba Para Transferi
                      </div>
                    </button>

                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('BALANCE_VIEW');
                        setErrorMessage(null);
                      }}
                      className="p-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-violet-500/50 rounded-xl text-left transition-all group"
                    >
                      <div className="text-[11px] text-violet-400 font-bold mb-1">[F6] BAKİYE SORGULAMA</div>
                      <div className="text-xs text-slate-300 font-sans group-hover:text-white">
                        Hesap Detayı &amp; Limitler
                      </div>
                    </button>
                  </div>

                  {/* Balance Snippet Bar */}
                  <div className="p-3 bg-slate-900/80 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
                    <span className="text-slate-400">Kullanılabilir Bakiye:</span>
                    <span className="text-base font-extrabold text-emerald-400">
                      {activeAccount.balance.toLocaleString('tr-TR')} ₺
                    </span>
                  </div>
                </div>
              )}

              {/* Screen View: WITHDRAW_AMOUNT */}
              {screenState === 'WITHDRAW_AMOUNT' && activeAccount && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <h3 className="text-sm font-bold text-amber-400">PARA ÇEKME TUTARINI SEÇİNİZ</h3>
                      <span className="text-xs text-slate-400">
                        Bakiye: <strong className="text-emerald-400">{activeAccount.balance.toLocaleString('tr-TR')} ₺</strong>
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">
                      * Bakiye yetersizse çekim işlemi güvenlik kuralı gereğince onaylanmaz.
                    </p>
                  </div>

                  {/* Fast Cash Buttons */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
                    {[100, 200, 500, 1000, 2000, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => executeWithdraw(amt)}
                        className={`p-3 rounded-xl border text-center transition-all ${
                          activeAccount.balance >= amt
                            ? 'bg-slate-900 hover:bg-amber-500 hover:text-slate-950 border-slate-800 font-bold text-slate-100'
                            : 'bg-slate-950/60 border-slate-800/60 text-slate-500 hover:border-rose-500/40 hover:text-rose-300'
                        }`}
                        title={activeAccount.balance < amt ? 'Yetersiz Bakiye' : ''}
                      >
                        <div className="text-base font-extrabold">{amt.toLocaleString('tr-TR')} ₺</div>
                        {activeAccount.balance < amt && (
                          <div className="text-[10px] text-rose-400">Yetersiz Bakiye</div>
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('WITHDRAW_CUSTOM');
                        setCustomAmount('');
                      }}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Özel Tutar Gir
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                        setErrorMessage(null);
                      }}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs"
                    >
                      Ana Menüye Dön
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: WITHDRAW_CUSTOM */}
              {screenState === 'WITHDRAW_CUSTOM' && (
                <div className="flex-1 flex flex-col justify-center items-center space-y-4 py-8">
                  <h3 className="text-sm font-bold text-amber-400">ÇEKMEK İSTEDİĞİNİZ TUTARI GİRİNİZ</h3>
                  <div className="p-4 bg-slate-900 border-2 border-amber-500/50 rounded-2xl w-full max-w-xs text-center font-bold text-2xl text-emerald-400">
                    {customAmount ? Number(customAmount).toLocaleString('tr-TR') : '0'} ₺
                  </div>
                  <p className="text-xs text-slate-400">
                    * Tuş takımını kullanarak tutarı girin ve [GİRİŞ / ENTER] tuşuna basınız. (10 TL katları)
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeWithdraw(Number(customAmount))}
                      disabled={!customAmount || Number(customAmount) <= 0}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Onayla (Enter)
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: DEPOSIT_AMOUNT */}
              {screenState === 'DEPOSIT_AMOUNT' && activeAccount && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-emerald-400">YATIRMAK İSTEDİĞİNİZ TUTARI SEÇİNİZ</h3>
                    <p className="text-xs text-slate-400">
                      ATM haznesi tüm TL banknotlarını (10, 20, 50, 100, 200 TL) kabul etmektedir.
                    </p>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 my-4">
                    {[100, 250, 500, 1000, 2500, 5000].map((amt) => (
                      <button
                        key={amt}
                        onClick={() => executeDeposit(amt)}
                        className="p-3 bg-slate-900 hover:bg-emerald-500 hover:text-slate-950 border border-slate-800 rounded-xl text-center font-bold text-slate-100 transition-all"
                      >
                        <div className="text-base font-extrabold">{amt.toLocaleString('tr-TR')} ₺</div>
                      </button>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('DEPOSIT_CUSTOM');
                        setCustomAmount('');
                      }}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Farklı Tutar Ekle
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs"
                    >
                      Ana Menü
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: DEPOSIT_CUSTOM */}
              {screenState === 'DEPOSIT_CUSTOM' && (
                <div className="flex-1 flex flex-col justify-center items-center space-y-4 py-8">
                  <h3 className="text-sm font-bold text-emerald-400">YATIRILACAK TUTARI GİRİNİZ</h3>
                  <div className="p-4 bg-slate-900 border-2 border-emerald-500/50 rounded-2xl w-full max-w-xs text-center font-bold text-2xl text-emerald-400">
                    {customAmount ? Number(customAmount).toLocaleString('tr-TR') : '0'} ₺
                  </div>
                  <p className="text-xs text-slate-400">
                    * Tuş takımıyla tutarı girip [GİRİŞ / ENTER] tuşuna basınız.
                  </p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeDeposit(Number(customAmount))}
                      disabled={!customAmount || Number(customAmount) <= 0}
                      className="px-6 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Nakit Yatır
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      İptal
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: TRANSFER_IBAN */}
              {screenState === 'TRANSFER_IBAN' && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-sky-400">HAVALE / EFT: ALICI SEÇİMİ</h3>
                    <p className="text-xs text-slate-400">
                      Kayıtlı diğer müşterilerden birini seçebilir veya IBAN girebilirsiniz:
                    </p>
                  </div>

                  {/* Registered Customer Quick Select */}
                  <div className="space-y-2 my-3">
                    <div className="text-[11px] text-slate-400 font-bold">Hızlı Alıcı Listesi (Diğer Müşteriler):</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allCustomers
                        .filter((c) => c.id !== activeUser?.id)
                        .map((c) => {
                          const cAcc = repository.findAccountByCustomerId(c.id).orElse(null as any);
                          return (
                            <button
                              key={c.id}
                              onClick={() => {
                                soundEffects.playKeypadBeep();
                                setTransferTargetTitle(c.fullName);
                                setTransferTargetIban(cAcc?.iban || '');
                                setScreenState('TRANSFER_AMOUNT');
                                setCustomAmount('');
                              }}
                              className="p-2.5 bg-slate-900 hover:bg-sky-950/40 border border-slate-800 hover:border-sky-500/50 rounded-xl text-left text-xs transition-colors"
                            >
                              <div className="font-bold text-slate-200">{c.fullName}</div>
                              <div className="text-[10px] text-slate-400 truncate">{cAcc?.iban}</div>
                            </button>
                          );
                        })}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-slate-400 rounded-lg text-xs"
                    >
                      İptal / Menüye Dön
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: TRANSFER_AMOUNT */}
              {screenState === 'TRANSFER_AMOUNT' && (
                <div className="flex-1 flex flex-col justify-center items-center space-y-4 py-8">
                  <h3 className="text-sm font-bold text-sky-400">TRANSFER TUTARINI GİRİNİZ</h3>
                  <div className="text-xs text-slate-300">
                    Alıcı: <strong className="text-slate-100">{transferTargetTitle}</strong>
                  </div>
                  <div className="p-4 bg-slate-900 border-2 border-sky-500/50 rounded-2xl w-full max-w-xs text-center font-bold text-2xl text-emerald-400">
                    {customAmount ? Number(customAmount).toLocaleString('tr-TR') : '0'} ₺
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => executeTransfer(Number(customAmount))}
                      disabled={!customAmount || Number(customAmount) <= 0}
                      className="px-6 py-2 bg-sky-500 hover:bg-sky-400 disabled:opacity-50 text-slate-950 font-bold rounded-lg text-xs"
                    >
                      Transferi Onayla
                    </button>
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: BALANCE_VIEW */}
              {screenState === 'BALANCE_VIEW' && activeAccount && activeUser && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-violet-400">HESAP BAKİYE &amp; LİMİT BİLGİLERİ</h3>
                    <p className="text-xs text-slate-400">Kadıköy Merkez Şubesi Vadesiz TL Hesabı</p>
                  </div>

                  <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl space-y-3 my-3">
                    <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-400">Kullanılabilir Bakiye:</span>
                      <span className="text-xl font-black text-emerald-400">
                        {activeAccount.balance.toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                    <div className="border-t border-slate-800 pt-2 flex justify-between text-xs">
                      <span className="text-slate-400">Hesap No:</span>
                      <span className="text-slate-200 font-bold">{activeAccount.accountNumber}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">IBAN:</span>
                      <span className="text-slate-300 text-[11px]">{activeAccount.iban}</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-400">Günlük Kalan Çekim Limiti:</span>
                      <span className="text-amber-400 font-bold">
                        {(activeAccount.dailyWithdrawalLimit - activeAccount.todayWithdrawnAmount).toLocaleString('tr-TR')} ₺
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                      }}
                      className="flex-1 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Menüye Dön
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: SUCCESS */}
              {screenState === 'SUCCESS' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-emerald-400">İŞLEMİNİZ BAŞARIYLA TAMAMLANDI</h3>
                    <p className="text-xs text-slate-300 mt-2 max-w-sm">{screenMessage}</p>
                  </div>

                  <div className="flex flex-wrap gap-2 pt-2">
                    {lastTransaction && activeUser && activeAccount && (
                      <button
                        onClick={() => {
                          soundEffects.playKeypadBeep();
                          setShowReceiptModal(true);
                        }}
                        className="py-2 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <Receipt className="w-4 h-4" />
                        Makbuzu / Dekontu Görüntüle
                      </button>
                    )}
                    <button
                      onClick={() => {
                        soundEffects.playKeypadBeep();
                        setScreenState('MAIN_MENU');
                        setScreenMessage(null);
                        setIsDispenserOpen(false);
                      }}
                      className="py-2 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                    >
                      Başka İşlem Yap
                    </button>
                    <button
                      onClick={handleEjectCard}
                      className="py-2 px-4 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 rounded-lg text-xs border border-rose-500/40"
                    >
                      Kartı İade Et
                    </button>
                  </div>
                </div>
              )}

              {/* Screen View: ERROR_BLOCKED */}
              {screenState === 'ERROR_BLOCKED' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4 py-8">
                  <div className="w-16 h-16 rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center text-rose-400">
                    <XCircle className="w-10 h-10" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-rose-400">KARTINIZ BLOKE EDİLMİŞTİR</h3>
                    <p className="text-xs text-slate-300 mt-2 max-w-sm leading-relaxed">
                      3 kez üst üste hatalı PIN girişi yapıldığı için hesabınız güvenlik protokolü gereğince bloke edilmiştir.
                    </p>
                  </div>
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-400 max-w-sm">
                    Blokenin kaldırılması için lütfen <strong>Banka Yöneticisi (Admin)</strong> ile iletişime geçiniz veya Yönetim Portalinden blokenin açılmasını sağlayınız.
                  </div>
                  <button
                    onClick={handleEjectCard}
                    className="py-2 px-6 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Kartı Çıkar
                  </button>
                </div>
              )}

              {/* Screen Bottom Bar */}
              <div className="flex items-center justify-between text-[11px] text-slate-500 border-t border-slate-900 pt-2 mt-4">
                <span>ÖZTÜRK BANK ATM V4.2</span>
                <span>Geliştirici &amp; Sistem Mimarı: ENES ÖZTÜRK</span>
              </div>
            </div>

            {/* Cash Dispenser / Deposit Tray Animation Area */}
            <div className="bg-slate-950 border-2 border-slate-800 rounded-2xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className={`p-3 rounded-xl border transition-all ${
                    isDispenserOpen
                      ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400 animate-pulse'
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  <Banknote className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-200">Nakit Para Haznesi (Cash Tray)</div>
                  <div className="text-[11px] text-slate-400">
                    {isDispenserOpen && dispensedCashNotes
                      ? `Hazne Açık: ${dispensedCashNotes.toLocaleString('tr-TR')} ₺ teslim ediliyor...`
                      : 'Hazne Kapalı / Güvenlik Devrede'}
                  </div>
                </div>
              </div>

              {isDispenserOpen && (
                <button
                  onClick={() => {
                    soundEffects.playKeypadBeep();
                    setIsDispenserOpen(false);
                    setDispensedCashNotes(null);
                  }}
                  className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold rounded-lg transition-colors"
                >
                  Parayı Al / Kapat
                </button>
              )}
            </div>
          </div>

          {/* Right Hardware: Card Slot, Keypad & Receipt (4 Cols) */}
          <div className="lg:col-span-4 space-y-4 flex flex-col justify-between">
            {/* 1. Card Insertion Slot */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300">KART YUVASI</span>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded font-mono ${
                    isCardInserted
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                  }`}
                >
                  {isCardInserted ? 'KART TAKILI' : 'KART BEKLENİYOR'}
                </span>
              </div>

              {/* Physical Slot Simulation */}
              <div className="relative py-3 flex items-center justify-center">
                <div className="w-full h-3 bg-slate-900 border-2 border-slate-700 rounded-full relative overflow-hidden flex items-center justify-center">
                  <div
                    className={`h-1 transition-all duration-300 rounded-full ${
                      isCardInserted ? 'w-full bg-emerald-500 shadow-sm shadow-emerald-500' : 'w-12 bg-amber-500 animate-pulse'
                    }`}
                  ></div>
                </div>
              </div>

              {isCardInserted ? (
                <button
                  onClick={handleEjectCard}
                  className="w-full py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/40 rounded-lg text-xs font-bold transition-colors"
                >
                  Kartı Çıkar / İade Et
                </button>
              ) : (
                <div className="text-[11px] text-slate-400 text-center">
                  Lütfen sol ekrandan kartınızı takınız.
                </div>
              )}
            </div>

            {/* 2. Tactile 4x4 Numeric ATM Keypad */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800 pb-2">
                <span>DONANIM TUŞ TAKIMI</span>
                <span className="text-[10px] text-slate-500 font-normal">Braille &amp; Bip Destekli</span>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {/* 1, 2, 3 */}
                {['1', '2', '3'].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleKeyPress(n)}
                    className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl font-mono text-base font-bold text-slate-100 shadow-md active:translate-y-0.5 transition-all"
                  >
                    {n}
                  </button>
                ))}
                {/* Cancel (Red) */}
                <button
                  onClick={() => handleKeyPress('CANCEL')}
                  className="h-12 bg-rose-600/90 hover:bg-rose-600 active:bg-rose-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center active:translate-y-0.5 transition-all shadow-md"
                  title="İptal / Cancel"
                >
                  <XCircle className="w-3.5 h-3.5 mb-0.5" />
                  İPTAL
                </button>

                {/* 4, 5, 6 */}
                {['4', '5', '6'].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleKeyPress(n)}
                    className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl font-mono text-base font-bold text-slate-100 shadow-md active:translate-y-0.5 transition-all"
                  >
                    {n}
                  </button>
                ))}
                {/* Clear (Yellow) */}
                <button
                  onClick={() => handleKeyPress('CLEAR')}
                  className="h-12 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold flex flex-col items-center justify-center active:translate-y-0.5 transition-all shadow-md"
                  title="Sil / Clear"
                >
                  <Delete className="w-3.5 h-3.5 mb-0.5" />
                  SİL
                </button>

                {/* 7, 8, 9 */}
                {['7', '8', '9'].map((n) => (
                  <button
                    key={n}
                    onClick={() => handleKeyPress(n)}
                    className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl font-mono text-base font-bold text-slate-100 shadow-md active:translate-y-0.5 transition-all"
                  >
                    {n}
                  </button>
                ))}
                {/* Empty spacer / function */}
                <button
                  onClick={() => soundEffects.playKeypadBeep(500)}
                  className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl font-mono text-xs text-slate-400 active:translate-y-0.5 transition-all"
                >
                  FUNC
                </button>

                {/* Blank, 0, Blank */}
                <button
                  onClick={() => soundEffects.playKeypadBeep(500)}
                  className="h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-mono text-xs text-slate-400"
                >
                  *
                </button>
                <button
                  onClick={() => handleKeyPress('0')}
                  className="h-12 bg-slate-800 hover:bg-slate-700 active:bg-slate-900 border border-slate-700 rounded-xl font-mono text-base font-bold text-slate-100 shadow-md active:translate-y-0.5 transition-all"
                >
                  0
                </button>
                <button
                  onClick={() => soundEffects.playKeypadBeep(500)}
                  className="h-12 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl font-mono text-xs text-slate-400"
                >
                  #
                </button>
                {/* Enter (Green) */}
                <button
                  onClick={() => handleKeyPress('ENTER')}
                  className="h-12 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white rounded-xl text-xs font-bold flex flex-col items-center justify-center active:translate-y-0.5 transition-all shadow-md"
                  title="Giriş / Enter"
                >
                  <CornerDownLeft className="w-3.5 h-3.5 mb-0.5" />
                  GİRİŞ
                </button>
              </div>
            </div>

            {/* 3. Receipt Dispenser Slot */}
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Receipt className="w-4 h-4 text-slate-400" />
                <span className="text-xs text-slate-300">Fiş / Makbuz Yuvası</span>
              </div>
              {lastTransaction && activeUser && activeAccount && (
                <button
                  onClick={() => {
                    soundEffects.playKeypadBeep();
                    setShowReceiptModal(true);
                  }}
                  className="text-xs text-amber-400 hover:underline font-bold"
                >
                  Fişi Al
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Hardware Panel Signature */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between flex-wrap gap-4 text-xs text-slate-400">
          <div>
            ÖZTÜRK BANK A.Ş. ATM AĞI · Seri No: OZTRK-ATM-3401-2026
          </div>
          <div className="text-right">
            Sistem Mimarı: <strong className="text-amber-400">Enes Öztürk</strong>
          </div>
        </div>
      </div>

      {/* Thermal Receipt Modal */}
      {showReceiptModal && lastTransaction && activeUser && activeAccount && (
        <AtmReceiptModal
          isOpen={showReceiptModal}
          onClose={() => setShowReceiptModal(false)}
          transaction={lastTransaction}
          user={activeUser}
          account={activeAccount}
        />
      )}
    </div>
  );
};
