/**
 * AtmView - Gerçekçi Fiziksel ATM Kiosk & Ekran Arayüzü
 * Kurallar:
 * 1. 3 Hatalı Girişte Bloke Kuralı
 * 2. Para Yatırma (Bakiye artar)
 * 3. Para Çekme (Bakiye kontrolü, parası yoksa çekemez)
 * 4. Havale / FAST Transfer
 * 5. Loglama ve Dekont Çıktısı (Enes Öztürk İmzalı)
 * Mimar: Enes Öztürk
 */

import React, { useState } from 'react';
import { 
  CreditCard, 
  ArrowDownCircle, 
  ArrowUpCircle, 
  Send, 
  FileText, 
  LogOut, 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  RefreshCw,
  Wallet,
  Receipt,
  Sparkles,
  Info
} from 'lucide-react';
import { User } from '../core/models/User';
import { Account } from '../core/models/Account';
import { Transaction } from '../core/models/Transaction';
import { AuthService } from '../core/services/AuthService';
import { TransactionService } from '../core/services/TransactionService';
import { DatabaseManager } from '../core/database/DatabaseManager';
import { PasswordService } from '../core/security/PasswordService';

type AtmScreenState = 
  | 'IDLE_INSERT_CARD' 
  | 'PIN_ENTRY' 
  | 'MAIN_MENU' 
  | 'BALANCE_INQUIRY' 
  | 'DEPOSIT' 
  | 'WITHDRAW' 
  | 'TRANSFER' 
  | 'SUCCESS_MESSAGE' 
  | 'BLOCKED_ALERT';

interface AtmViewProps {
  currentUser: User | null;
  onUserLogin: (user: User, account?: Account) => void;
  onUserLogout: () => void;
  onShowReceipt: (tx: Transaction, acc?: Account, usr?: User) => void;
}

export const AtmView: React.FC<AtmViewProps> = ({
  currentUser,
  onUserLogin,
  onUserLogout,
  onShowReceipt
}) => {
  const db = DatabaseManager.getInstance();
  const authService = new AuthService();
  const transactionService = new TransactionService();

  // ATM Durum Değişkenleri
  const [screenState, setScreenState] = useState<AtmScreenState>(
    currentUser ? 'MAIN_MENU' : 'IDLE_INSERT_CARD'
  );

  // Kart & Giriş Durumları
  const [selectedCardNumber, setSelectedCardNumber] = useState<string>('5421883299101111');
  const [enteredPin, setEnteredPin] = useState<string>('');
  const [pinAttemptsRemaining, setPinAttemptsRemaining] = useState<number>(3);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [successInfo, setSuccessInfo] = useState<{ title: string; detail: string; tx?: Transaction } | null>(null);

  // Aktif ATM Hesabı
  const [activeAccount, setActiveAccount] = useState<Account | null>(() => {
    if (currentUser) {
      return db.accounts.findPrimaryByUserId(currentUser.id).orElse(null as unknown as Account);
    }
    return null;
  });

  // İşlem Tutarları
  const [customAmount, setCustomAmount] = useState<string>('');
  const [cashSlotActive, setCashSlotActive] = useState<boolean>(false);

  // Havale Formu
  const [transferIban, setTransferIban] = useState<string>('TR330006100522223333444401');
  const [transferRecipient, setTransferRecipient] = useState<string>('Zeynep Kaya');
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [transferNote, setTransferNote] = useState<string>('Borç Ödemesi');

  // Son Yapılan İşlem Dekontu
  const [lastTransaction, setLastTransaction] = useState<Transaction | null>(null);

  // PIN Pad Tuşuna Basma
  const handlePinPadPress = (key: string) => {
    if (screenState === 'PIN_ENTRY') {
      if (enteredPin.length < 4) {
        setEnteredPin(prev => prev + key);
      }
    } else if (screenState === 'DEPOSIT' || screenState === 'WITHDRAW' || screenState === 'TRANSFER') {
      if (customAmount.length < 6) {
        setCustomAmount(prev => prev + key);
      }
    }
  };

  const handlePinPadClear = () => {
    if (screenState === 'PIN_ENTRY') {
      setEnteredPin('');
    } else {
      setCustomAmount('');
    }
  };

  const handlePinPadCancel = () => {
    if (screenState === 'MAIN_MENU') {
      handleEjectCard();
    } else if (screenState !== 'IDLE_INSERT_CARD') {
      setScreenState('MAIN_MENU');
      setErrorMessage('');
      setCustomAmount('');
    }
  };

  // Kart Takma Simülasyonu
  const handleInsertCard = (cardNum?: string) => {
    const card = cardNum || selectedCardNumber;
    setSelectedCardNumber(card);
    setEnteredPin('');
    setErrorMessage('');

    // Kart sahibini ve hesabını kontrol et
    const accountOpt = db.accounts.findByCardNumber(card);
    if (!accountOpt.isPresent()) {
      setErrorMessage('Geçersiz kart veya hesap bulunamadı!');
      return;
    }

    const account = accountOpt.get();
    const userOpt = db.users.findById(account.userId);
    if (userOpt.isPresent() && userOpt.get().isBlocked) {
      setScreenState('BLOCKED_ALERT');
      setErrorMessage('Bu kart/hesap 3 hatalı giriş sebebiyle BLOKE EDİLMİŞTİR!');
      return;
    }

    setActiveAccount(account);
    setScreenState('PIN_ENTRY');
    setPinAttemptsRemaining(userOpt.isPresent() ? 3 - userOpt.get().failedLoginAttempts : 3);
  };

  // PIN Onaylama (3 Hatalı Giriş Mantığı)
  const handleVerifyPin = () => {
    if (!enteredPin || enteredPin.length < 4) {
      setErrorMessage('Lütfen 4 haneli kart şifrenizi giriniz!');
      return;
    }

    const result = authService.login(selectedCardNumber, enteredPin, '85.105.42.19 (ATM Terminal)');
    if (result.success && result.user) {
      onUserLogin(result.user, result.account);
      setActiveAccount(result.account || null);
      setScreenState('MAIN_MENU');
      setErrorMessage('');
      setEnteredPin('');
    } else {
      setEnteredPin('');
      if (result.isBlocked) {
        setScreenState('BLOCKED_ALERT');
        setErrorMessage(result.message);
      } else {
        setPinAttemptsRemaining(result.remainingAttempts || 0);
        setErrorMessage(result.message);
      }
    }
  };

  // Kart Çıkar / Oturumu Kapat
  const handleEjectCard = () => {
    setScreenState('IDLE_INSERT_CARD');
    setEnteredPin('');
    setActiveAccount(null);
    setErrorMessage('');
    setSuccessInfo(null);
    onUserLogout();
  };

  // Para Yatırma
  const handleDepositSubmit = (amount: number) => {
    if (!activeAccount || !currentUser) return;
    setCashSlotActive(true);

    setTimeout(() => {
      setCashSlotActive(false);
      const res = transactionService.deposit(
        activeAccount.id,
        amount,
        currentUser.id,
        `ATM Nakit Para Yatırma - Kadıköy #04`
      );

      if (res.success && res.transaction) {
        setLastTransaction(res.transaction);
        setActiveAccount(res.sourceAccount || activeAccount);
        setSuccessInfo({
          title: 'Para Yatırma Başarılı!',
          detail: res.message,
          tx: res.transaction
        });
        setScreenState('SUCCESS_MESSAGE');
      } else {
        setErrorMessage(res.message);
      }
    }, 900);
  };

  // Para Çekme (Bakiye Kontrolü)
  const handleWithdrawSubmit = (amount: number) => {
    if (!activeAccount || !currentUser) return;

    // Doğrulama: Müşterinin parası yoksa para çekemez!
    if (activeAccount.balance < amount) {
      setErrorMessage(`Yetersiz Bakiye! Hesabınızda ${activeAccount.balance.toLocaleString('tr-TR')} ₺ bulunmaktadır.`);
      return;
    }

    setCashSlotActive(true);

    setTimeout(() => {
      setCashSlotActive(false);
      const res = transactionService.withdraw(
        activeAccount.id,
        amount,
        currentUser.id
      );

      if (res.success && res.transaction) {
        setLastTransaction(res.transaction);
        setActiveAccount(res.sourceAccount || activeAccount);
        setSuccessInfo({
          title: 'Para Çekme Başarılı!',
          detail: res.message,
          tx: res.transaction
        });
        setScreenState('SUCCESS_MESSAGE');
      } else {
        setErrorMessage(res.message);
      }
    }, 1000);
  };

  // Havale / EFT Gönderme
  const handleTransferSubmit = () => {
    if (!activeAccount || !currentUser) return;
    const amount = parseFloat(transferAmount);

    if (isNaN(amount) || amount <= 0) {
      setErrorMessage('Lütfen geçerli bir transfer tutarı giriniz!');
      return;
    }

    if (activeAccount.balance < amount) {
      setErrorMessage(`Yetersiz Bakiye! Mevcut bakiyeniz: ${activeAccount.balance.toLocaleString('tr-TR')} ₺`);
      return;
    }

    const res = transactionService.transfer(
      activeAccount.id,
      transferIban,
      transferRecipient,
      amount,
      transferNote,
      currentUser.id
    );

    if (res.success && res.transaction) {
      setLastTransaction(res.transaction);
      setActiveAccount(res.sourceAccount || activeAccount);
      setSuccessInfo({
        title: 'Havale / FAST İşlemi Onaylandı!',
        detail: res.message,
        tx: res.transaction
      });
      setScreenState('SUCCESS_MESSAGE');
    } else {
      setErrorMessage(res.message);
    }
  };

  return (
    <div className="py-6 px-4 max-w-6xl mx-auto">
      {/* Üst Bilgi Başlığı */}
      <div className="mb-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 p-4 rounded-2xl border border-slate-800 shadow-lg">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-ping"></span>
            <h1 className="text-xl font-extrabold text-white tracking-tight">
              Öztürk Bank Akıllı ATM Terminali #04
            </h1>
            <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded font-mono font-semibold">
              Kadıköy / İstanbul
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Mimari Kural: 3 Hatalı Girişte Bloke, Bakiye Doğrulama, Para Yatırma/Çekme/Havale ve Dekont Çıktısı.
          </p>
        </div>

        {/* Demo Kart Hızlı Seçim Butonları */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Demo Kart Seç:</span>
          <button
            onClick={() => handleInsertCard('5421883299101111')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-amber-300 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
            title="Ahmet Yılmaz (Normal Aktif Müşteri - PIN: 1234)"
          >
            Ahmet (PIN: 1234)
          </button>
          <button
            onClick={() => handleInsertCard('5421883299102222')}
            className="text-xs bg-slate-800 hover:bg-slate-700 text-emerald-300 border border-slate-700 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
            title="Zeynep Kaya (Aktif Müşteri - PIN: 1234)"
          >
            Zeynep (PIN: 1234)
          </button>
          <button
            onClick={() => handleInsertCard('5421883299103333')}
            className="text-xs bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/60 px-2.5 py-1.5 rounded-lg transition-colors font-mono"
            title="Mehmet Demir (3 Hatalı Girişle BLOKE Edilmiş Kart Testi)"
          >
            Mehmet (BLOKE TEST)
          </button>
        </div>
      </div>

      {/* ATM Cihazı Gövdesi */}
      <div className="bg-gradient-to-b from-slate-800 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-8 border-4 border-slate-700 shadow-2xl relative overflow-hidden">
        {/* ATM Üst Marka Panosu */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-600 rounded-2xl p-4 mb-6 shadow-lg border border-amber-400/30 flex items-center justify-between text-slate-950">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 flex items-center justify-center font-black text-xl shadow">
              ÖB
            </div>
            <div>
              <h2 className="font-black text-lg sm:text-xl tracking-wider text-slate-950">
                ÖZTÜRK BANK ATM
              </h2>
              <p className="text-[11px] font-mono font-bold text-slate-900">
                Sistem Mimarı: Enes Öztürk | 7/24 Kesintisiz Bankacılık
              </p>
            </div>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs bg-slate-950/20 px-2 py-1 rounded font-mono font-bold">
              KULLANILABİLİR
            </span>
          </div>
        </div>

        {/* Ana İç Kiosk Izgarası: Sol = Ekran, Sağ = Kart Girişi, Para Yuvası & PIN Pad */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ================= SOL: DİJİTAL ATM EKRANI (8 Kolon) ================= */}
          <div className="lg:col-span-8 bg-slate-950 border-4 border-slate-800 rounded-2xl p-6 shadow-inner min-h-[460px] flex flex-col justify-between relative overflow-hidden">
            {/* Ekran Üst Durum Şeridi */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs text-slate-400 font-mono">
              <span className="text-amber-400 font-bold">
                {activeAccount ? `HESAP: ${activeAccount.accountNumber}` : 'ÖZTÜRK BANK ATM'}
              </span>
              <span>{new Date().toLocaleTimeString('tr-TR')}</span>
            </div>

            {/* Hata veya Uyarı Mesajı */}
            {errorMessage && (
              <div className="mt-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 p-3 rounded-xl text-xs flex items-center space-x-2 animate-shake">
                <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400" />
                <span className="font-medium">{errorMessage}</span>
              </div>
            )}

            {/* EKRAN İÇERİĞİ DURUM MAKİNESİ */}
            <div className="my-auto py-4">
              {/* 1. KART BEKLENİYOR DURUMU */}
              {screenState === 'IDLE_INSERT_CARD' && (
                <div className="text-center space-y-4 py-8">
                  <div className="w-20 h-20 mx-auto rounded-full bg-amber-500/10 border-2 border-amber-500/30 flex items-center justify-center animate-pulse">
                    <CreditCard className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    Lütfen Kartınızı Takınız
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
                    İşlem yapmak için sağdaki kart yuvasına tıklayarak kartınızı takınız veya yukarıdaki demo kart butonlarından birini seçiniz.
                  </p>
                  <div className="pt-2">
                    <button
                      onClick={() => handleInsertCard('5421883299101111')}
                      className="bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs sm:text-sm px-6 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 transition-all inline-flex items-center space-x-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Hemen Kartımı Tak (Ahmet Yılmaz)</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 2. PIN GİRİŞ EKRANI (3 Hatalı Hak Uyarısı) */}
              {screenState === 'PIN_ENTRY' && (
                <div className="space-y-4 max-w-md mx-auto text-center py-4">
                  <h3 className="text-lg font-bold text-white">
                    Lütfen 4 Haneli Kart Şifrenizi Giriniz
                  </h3>
                  <p className="text-xs text-slate-400">
                    Kart: <span className="font-mono text-amber-300">{PasswordService.maskCardNumber(selectedCardNumber)}</span>
                  </p>

                  {/* Kalan Hak Uyarısı */}
                  <div className={`text-xs px-3 py-1.5 rounded-lg inline-flex items-center space-x-1.5 font-medium ${
                    pinAttemptsRemaining === 1 
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 animate-pulse'
                      : 'bg-amber-500/10 text-amber-300 border border-amber-500/30'
                  }`}>
                    <ShieldAlert className="w-4 h-4" />
                    <span>Kalan Giriş Hakkınız: <strong className="text-white text-sm">{pinAttemptsRemaining}</strong> / 3</span>
                  </div>

                  {/* Maskelenmiş PIN Kutucukları */}
                  <div className="flex justify-center space-x-3 my-4">
                    {[0, 1, 2, 3].map(idx => (
                      <div
                        key={idx}
                        className={`w-12 h-14 rounded-xl border-2 flex items-center justify-center text-2xl font-bold font-mono transition-all ${
                          enteredPin.length > idx
                            ? 'border-amber-400 bg-amber-500/20 text-amber-300'
                            : 'border-slate-700 bg-slate-900 text-slate-600'
                        }`}
                      >
                        {enteredPin.length > idx ? '•' : ''}
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-slate-500 font-mono">
                    (İpucu: Demo kartların varsayılan PIN kodu: <strong>1234</strong>)
                  </p>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={handlePinPadClear}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-4 py-2 rounded-xl border border-slate-700"
                    >
                      Sil
                    </button>
                    <button
                      onClick={handleVerifyPin}
                      disabled={enteredPin.length < 4}
                      className="text-xs bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-emerald-600/30"
                    >
                      Giriş Yap
                    </button>
                  </div>
                </div>
              )}

              {/* 3. BLOKE EDİLDİ UYARISI */}
              {screenState === 'BLOCKED_ALERT' && (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/20 border-2 border-rose-500 flex items-center justify-center animate-bounce">
                    <ShieldAlert className="w-8 h-8 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-black text-rose-400 tracking-wide">
                    KART VE HESAP BLOKE EDİLDİ!
                  </h3>
                  <div className="bg-rose-950/40 border border-rose-800/60 p-4 rounded-xl max-w-md mx-auto text-xs text-rose-200 text-left space-y-2">
                    <p className="font-bold">Güvenlik İhlali Bildirimi:</p>
                    <p>
                      Üst üste 3 defa hatalı şifre girişi yapıldığı için kartınız güvenlik prosedürleri gereğince bloke edilmiştir.
                    </p>
                    <p className="text-slate-400 text-[11px]">
                      Blokeyi kaldırmak için lütfen Öztürk Bank Şubesine başvurunuz veya Admin Paneli üzerinden yetkili onayı alınız.
                    </p>
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleEjectCard}
                      className="bg-slate-800 hover:bg-slate-700 text-white text-xs px-6 py-2.5 rounded-xl border border-slate-700 inline-flex items-center space-x-2"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>Kartımı İade Et</span>
                    </button>
                  </div>
                </div>
              )}

              {/* 4. ANA İŞLEM MENÜSÜ */}
              {screenState === 'MAIN_MENU' && activeAccount && (
                <div className="space-y-6">
                  {/* Müşteri & Bakiye Başlığı */}
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-slate-400">Hoş Geldiniz,</p>
                      <h3 className="font-bold text-white text-base">
                        {currentUser?.fullName}
                      </h3>
                      <p className="text-[11px] text-amber-400 font-mono mt-0.5">
                        {PasswordService.maskIban(activeAccount.iban)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Kullanılabilir Bakiye</p>
                      <p className="text-xl font-extrabold text-emerald-400">
                        {activeAccount.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
                      </p>
                    </div>
                  </div>

                  {/* ATM Butonları Izgarası */}
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      onClick={() => { setScreenState('WITHDRAW'); setErrorMessage(''); setCustomAmount(''); }}
                      className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-amber-600 hover:to-amber-700 text-white p-4 rounded-xl border border-slate-700 hover:border-amber-500 shadow-md flex items-center justify-between transition-all group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm block">Para Çekme</span>
                        <span className="text-[11px] text-slate-400 group-hover:text-amber-100">Nakit çekim</span>
                      </div>
                      <ArrowDownCircle className="w-6 h-6 text-amber-400 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => { setScreenState('DEPOSIT'); setErrorMessage(''); setCustomAmount(''); }}
                      className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-emerald-600 hover:to-emerald-700 text-white p-4 rounded-xl border border-slate-700 hover:border-emerald-500 shadow-md flex items-center justify-between transition-all group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm block">Para Yatırma</span>
                        <span className="text-[11px] text-slate-400 group-hover:text-emerald-100">Hesaba para ekle</span>
                      </div>
                      <ArrowUpCircle className="w-6 h-6 text-emerald-400 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => { setScreenState('TRANSFER'); setErrorMessage(''); setCustomAmount(''); }}
                      className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-sky-600 hover:to-sky-700 text-white p-4 rounded-xl border border-slate-700 hover:border-sky-500 shadow-md flex items-center justify-between transition-all group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm block">Havale / FAST</span>
                        <span className="text-[11px] text-slate-400 group-hover:text-sky-100">Başka hesaba transfer</span>
                      </div>
                      <Send className="w-6 h-6 text-sky-400 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => { setScreenState('BALANCE_INQUIRY'); setErrorMessage(''); }}
                      className="bg-gradient-to-r from-slate-900 to-slate-800 hover:from-purple-600 hover:to-purple-700 text-white p-4 rounded-xl border border-slate-700 hover:border-purple-500 shadow-md flex items-center justify-between transition-all group"
                    >
                      <div className="text-left">
                        <span className="font-bold text-sm block">Bakiye & Bilgi Fişi</span>
                        <span className="text-[11px] text-slate-400 group-hover:text-purple-100">Hesap özeti & fiş</span>
                      </div>
                      <FileText className="w-6 h-6 text-purple-400 group-hover:text-white" />
                    </button>
                  </div>
                </div>
              )}

              {/* 5. PARA YATIRMA MENÜSÜ */}
              {screenState === 'DEPOSIT' && activeAccount && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <ArrowUpCircle className="w-5 h-5 text-emerald-400" />
                      <span>Hesaba Para Yatırma</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Mevcut: <strong className="text-emerald-400">{activeAccount.balance.toLocaleString('tr-TR')} ₺</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Lütfen yatırmak istediğiniz tutarı seçiniz veya özel tutar girip para yatırma gözüne nakit yerleştiriniz:
                  </p>

                  {/* Hızlı Tutar Butonları */}
                  <div className="grid grid-cols-3 gap-3">
                    {[100, 200, 500, 1000, 2500, 5000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleDepositSubmit(amt)}
                        className="bg-slate-900 hover:bg-emerald-600 text-white py-3 px-2 rounded-xl border border-slate-700 hover:border-emerald-500 font-bold text-sm shadow transition-all"
                      >
                        +{amt.toLocaleString('tr-TR')} ₺
                      </button>
                    ))}
                  </div>

                  {/* Özel Tutar Girişi */}
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Farklı Tutar Giriniz (₺)"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <button
                      onClick={() => handleDepositSubmit(parseFloat(customAmount) || 0)}
                      disabled={!customAmount || parseFloat(customAmount) <= 0}
                      className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
                    >
                      Yatır
                    </button>
                  </div>
                </div>
              )}

              {/* 6. PARA ÇEKME MENÜSÜ (Bakiye Doğrulama Kuralı) */}
              {screenState === 'WITHDRAW' && activeAccount && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <ArrowDownCircle className="w-5 h-5 text-amber-400" />
                      <span>Nakit Para Çekme</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Mevcut: <strong className="text-emerald-400">{activeAccount.balance.toLocaleString('tr-TR')} ₺</strong>
                    </span>
                  </div>

                  <p className="text-xs text-slate-300">
                    Lütfen çekmek istediğiniz tutarı seçiniz. (Hesapta para yoksa veya bakiye yetersizse işlem onaylanmaz):
                  </p>

                  {/* Hızlı Çekim Butonları */}
                  <div className="grid grid-cols-3 gap-3">
                    {[50, 100, 200, 500, 1000, 2000].map(amt => (
                      <button
                        key={amt}
                        onClick={() => handleWithdrawSubmit(amt)}
                        disabled={activeAccount.balance < amt}
                        className={`py-3 px-2 rounded-xl font-bold text-sm shadow transition-all border ${
                          activeAccount.balance >= amt
                            ? 'bg-slate-900 hover:bg-amber-600 text-white border-slate-700 hover:border-amber-500'
                            : 'bg-slate-900/50 text-slate-600 border-slate-800 cursor-not-allowed'
                        }`}
                        title={activeAccount.balance < amt ? 'Yetersiz Bakiye' : ''}
                      >
                        {amt.toLocaleString('tr-TR')} ₺
                      </button>
                    ))}
                  </div>

                  {/* Özel Tutar Çekme */}
                  <div className="pt-2 flex items-center gap-3">
                    <input
                      type="number"
                      placeholder="Farklı Tutar Giriniz (₺)"
                      value={customAmount}
                      onChange={e => setCustomAmount(e.target.value)}
                      className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      onClick={() => handleWithdrawSubmit(parseFloat(customAmount) || 0)}
                      disabled={!customAmount || parseFloat(customAmount) <= 0}
                      className="bg-amber-600 hover:bg-amber-500 disabled:opacity-40 text-white font-bold text-xs px-6 py-3 rounded-xl transition-all"
                    >
                      Çek
                    </button>
                  </div>
                </div>
              )}

              {/* 7. HAVALE / FAST TRANSFER MENÜSÜ */}
              {screenState === 'TRANSFER' && activeAccount && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                    <h3 className="font-bold text-white text-base flex items-center gap-2">
                      <Send className="w-5 h-5 text-sky-400" />
                      <span>Havale & FAST Para Transferi</span>
                    </h3>
                    <span className="text-xs text-slate-400">
                      Bakiye: <strong className="text-emerald-400">{activeAccount.balance.toLocaleString('tr-TR')} ₺</strong>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="text-slate-400 block mb-1">Alıcı IBAN</label>
                      <input
                        type="text"
                        value={transferIban}
                        onChange={e => setTransferIban(e.target.value)}
                        placeholder="TR..."
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Alıcı Ad Soyad</label>
                      <input
                        type="text"
                        value={transferRecipient}
                        onChange={e => setTransferRecipient(e.target.value)}
                        placeholder="Ad Soyad"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Transfer Tutarı (₺)</label>
                      <input
                        type="number"
                        value={transferAmount}
                        onChange={e => setTransferAmount(e.target.value)}
                        placeholder="0.00 ₺"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500 font-bold"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Açıklama</label>
                      <input
                        type="text"
                        value={transferNote}
                        onChange={e => setTransferNote(e.target.value)}
                        placeholder="Açıklama"
                        className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white focus:border-sky-500"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      onClick={() => setScreenState('MAIN_MENU')}
                      className="text-xs bg-slate-800 text-slate-300 px-4 py-2 rounded-xl"
                    >
                      İptal
                    </button>
                    <button
                      onClick={handleTransferSubmit}
                      disabled={!transferAmount || parseFloat(transferAmount) <= 0}
                      className="text-xs bg-sky-600 hover:bg-sky-500 disabled:opacity-40 text-white font-bold px-6 py-2 rounded-xl shadow-lg shadow-sky-600/30"
                    >
                      Havale Gönder
                    </button>
                  </div>
                </div>
              )}

              {/* 8. BAKİYE SORGULAMA & HESAP BİLGİSİ */}
              {screenState === 'BALANCE_INQUIRY' && activeAccount && (
                <div className="space-y-4 max-w-md mx-auto text-center py-2">
                  <div className="w-14 h-14 mx-auto rounded-full bg-purple-500/10 border border-purple-500/30 flex items-center justify-center">
                    <Wallet className="w-7 h-7 text-purple-400" />
                  </div>
                  <h3 className="text-base font-bold text-white">Hesap Bakiye Bilgisi</h3>
                  
                  <div className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-left font-mono text-xs space-y-2">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hesap No:</span>
                      <span className="text-slate-200">{activeAccount.accountNumber}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">IBAN:</span>
                      <span className="text-amber-300 text-[11px]">{PasswordService.maskIban(activeAccount.iban)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Hesap Türü:</span>
                      <span className="text-slate-200">{activeAccount.accountType} (TL)</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-800 pt-2 text-sm font-bold text-emerald-400">
                      <span>Kullanılabilir Bakiye:</span>
                      <span>{activeAccount.balance.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
                    </div>
                  </div>

                  <div className="flex justify-center gap-3 pt-2">
                    <button
                      onClick={() => setScreenState('MAIN_MENU')}
                      className="text-xs bg-slate-800 text-slate-300 px-5 py-2.5 rounded-xl border border-slate-700"
                    >
                      Ana Menü
                    </button>
                    {lastTransaction && (
                      <button
                        onClick={() => onShowReceipt(lastTransaction, activeAccount, currentUser || undefined)}
                        className="text-xs bg-purple-600 hover:bg-purple-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-purple-600/30 flex items-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Resmi Dekontu Gör</span>
                      </button>
                    )}
                  </div>
                </div>
              )}

              {/* 9. İŞLEM BAŞARILI BİLDİRİMİ */}
              {screenState === 'SUCCESS_MESSAGE' && successInfo && (
                <div className="text-center space-y-4 py-6">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center">
                    <CheckCircle2 className="w-9 h-9 text-emerald-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white">
                    {successInfo.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
                    {successInfo.detail}
                  </p>
                  
                  <div className="flex justify-center gap-3 pt-3">
                    <button
                      onClick={() => setScreenState('MAIN_MENU')}
                      className="text-xs bg-slate-800 hover:bg-slate-700 text-white font-semibold px-5 py-2.5 rounded-xl border border-slate-700"
                    >
                      Başka İşlem Yap
                    </button>

                    {successInfo.tx && (
                      <button
                        onClick={() => onShowReceipt(successInfo.tx!, activeAccount || undefined, currentUser || undefined)}
                        className="text-xs bg-amber-600 hover:bg-amber-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg shadow-amber-600/30 flex items-center gap-1.5"
                      >
                        <Receipt className="w-4 h-4" />
                        <span>Dekont / Fiş Al</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Ekran Alt Navigasyon Çubuğu */}
            <div className="border-t border-slate-800 pt-3 flex items-center justify-between text-xs">
              {screenState !== 'IDLE_INSERT_CARD' && screenState !== 'PIN_ENTRY' && screenState !== 'BLOCKED_ALERT' && (
                <button
                  onClick={() => setScreenState('MAIN_MENU')}
                  className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Ana Menüye Dön</span>
                </button>
              )}
              {screenState !== 'IDLE_INSERT_CARD' && (
                <button
                  onClick={handleEjectCard}
                  className="ml-auto text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Kart İade / Çıkış</span>
                </button>
              )}
            </div>
          </div>

          {/* ================= SAĞ: FİZİKSEL ATM MEKANİZMASI (4 Kolon) ================= */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* 1. KART YUVASI (Card Reader Slot) */}
            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 shadow-md text-center">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span>KART GİRİŞ YUVASI</span>
                <span className={`w-2.5 h-2.5 rounded-full ${screenState !== 'IDLE_INSERT_CARD' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-600'}`}></span>
              </div>

              {/* Kart Yuvası Açıklığı */}
              <div 
                onClick={() => screenState === 'IDLE_INSERT_CARD' ? handleInsertCard() : handleEjectCard()}
                className={`h-7 rounded-lg border-2 flex items-center justify-center cursor-pointer transition-all ${
                  screenState !== 'IDLE_INSERT_CARD'
                    ? 'border-emerald-500 bg-emerald-950/40 text-emerald-400'
                    : 'border-amber-500/60 bg-amber-950/20 hover:border-amber-400 text-amber-300'
                }`}
                title={screenState !== 'IDLE_INSERT_CARD' ? 'Kartı Çıkarmak İçin Tıklayın' : 'Kart Takmak İçin Tıklayın'}
              >
                <div className="w-3/4 h-2 bg-black rounded-full mx-auto relative overflow-hidden">
                  {screenState !== 'IDLE_INSERT_CARD' && (
                    <div className="w-1/2 h-full bg-emerald-400 rounded-full animate-ping"></div>
                  )}
                </div>
              </div>

              <p className="text-[10px] text-slate-500 mt-2">
                {screenState !== 'IDLE_INSERT_CARD' ? '✓ Kart Takılı (Çıkarmak için tıklayın)' : 'Kart takmak için yuvaya tıklayınız'}
              </p>
            </div>

            {/* 2. PARA YATIRMA & ÇEKME GÖZÜ (Cash Dispenser Slot) */}
            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 shadow-md text-center">
              <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2 font-mono">
                <span>PARA YATIRMA / ÇEKME BÖLMESİ</span>
                <span className={`w-2.5 h-2.5 rounded-full ${cashSlotActive ? 'bg-amber-400 animate-ping' : 'bg-slate-600'}`}></span>
              </div>

              <div className={`h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                cashSlotActive 
                  ? 'border-amber-400 bg-amber-500/30 text-amber-300 animate-pulse' 
                  : 'border-slate-800 bg-slate-900 text-slate-500'
              }`}>
                {cashSlotActive ? (
                  <span className="text-xs font-bold font-mono tracking-wider text-amber-300">
                    BANKNOT GÖZÜ AÇILDI...
                  </span>
                ) : (
                  <span className="text-[11px] font-mono">KAPALI</span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-2">Maksimum tek seferde 40 adet banknot</p>
            </div>

            {/* 3. FİZİKSEL METAL PIN PAD (Taktil Tuş Takımı) */}
            <div className="bg-slate-950 p-4 rounded-2xl border-2 border-slate-800 shadow-xl">
              <div className="text-[11px] text-slate-400 font-mono mb-3 text-center">
                GÜVENLİ TUŞ TAKIMI (EPP EPP4)
              </div>

              <div className="grid grid-cols-3 gap-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map(key => (
                  <button
                    key={key}
                    onClick={() => handlePinPadPress(key)}
                    className="h-11 rounded-lg bg-gradient-to-b from-slate-700 to-slate-800 hover:from-slate-600 hover:to-slate-700 text-slate-100 font-mono font-bold text-base border border-slate-600 shadow-md active:translate-y-0.5 transition-all"
                  >
                    {key}
                  </button>
                ))}
              </div>

              {/* Fonksiyon Tuşları: İptal (Kırmızı), Sil (Sarı), Giriş (Yeşil) */}
              <div className="grid grid-cols-3 gap-2 mt-3 text-xs font-bold">
                <button
                  onClick={handlePinPadCancel}
                  className="py-2.5 rounded-lg bg-rose-700 hover:bg-rose-600 text-white shadow active:translate-y-0.5 transition-all"
                >
                  İPTAL
                </button>
                <button
                  onClick={handlePinPadClear}
                  className="py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 shadow active:translate-y-0.5 transition-all"
                >
                  SİL
                </button>
                <button
                  onClick={screenState === 'PIN_ENTRY' ? handleVerifyPin : undefined}
                  className="py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white shadow active:translate-y-0.5 transition-all"
                >
                  GİRİŞ
                </button>
              </div>
            </div>

          </div>

        </div>

        {/* ATM Alt Bilgi Şeridi */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 font-mono gap-2">
          <span>Öztürk Bank Core Banking Engine v2.4</span>
          <span className="text-amber-400 font-bold">Enes Öztürk İmzalı</span>
          <span>Güvenlik Seviyesi: EMV / PCI-DSS Onaylı</span>
        </div>
      </div>
    </div>
  );
};
