/**
 * AuthModal - Giriş & Yeni Müşteri Kayıt Modalı
 * 3 Hatalı Girişte Bloke Kuralı & Maskeli Şifre Doğrulaması
 * Mimar: Enes Öztürk
 */

import React, { useState } from 'react';
import { 
  X, 
  LogIn, 
  UserPlus, 
  ShieldAlert, 
  Lock, 
  UserCheck, 
  Building2, 
  CreditCard,
  Eye,
  EyeOff
} from 'lucide-react';
import { AuthService } from '../core/services/AuthService';
import { User } from '../core/models/User';
import { Account } from '../core/models/Account';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, account?: Account) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess
}) => {
  const authService = new AuthService();
  const [tab, setTab] = useState<'login' | 'register'>('login');

  // Login Form
  const [identifier, setIdentifier] = useState<string>('11111111111'); // Varsayılan Ahmet Yılmaz TC
  const [password, setPassword] = useState<string>('1234');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  // Register Form
  const [regTcNo, setRegTcNo] = useState<string>('');
  const [regFullName, setRegFullName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('05');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regInitialDeposit, setRegInitialDeposit] = useState<string>('1000');
  const [regSuccessMsg, setRegSuccessMsg] = useState<string>('');

  if (!isOpen) return null;

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRemainingAttempts(null);

    const result = authService.login(identifier, password, '192.168.1.100');
    if (result.success && result.user) {
      onLoginSuccess(result.user, result.account);
      onClose();
    } else {
      setErrorMessage(result.message);
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
      }
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setRegSuccessMsg('');

    if (regTcNo.length !== 11) {
      setErrorMessage('TC Kimlik Numarası 11 haneli olmalıdır!');
      return;
    }

    if (!regPassword || regPassword.length < 4) {
      setErrorMessage('Şifre en az 4 haneli olmalıdır!');
      return;
    }

    const res = authService.register({
      tcNo: regTcNo,
      fullName: regFullName,
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      initialDeposit: parseFloat(regInitialDeposit) || 0
    });

    if (res.success && res.user) {
      setRegSuccessMsg(res.message);
      setTimeout(() => {
        onLoginSuccess(res.user!, res.account);
        onClose();
      }, 1200);
    } else {
      setErrorMessage(res.message);
    }
  };

  const handlePresetSelect = (tc: string, pass: string) => {
    setIdentifier(tc);
    setPassword(pass);
    setErrorMessage('');
    setRemainingAttempts(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Üst Başlık */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-base tracking-wide">Öztürk Bank Güvenli Giriş</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-amber-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sekmeler (Giriş / Kayıt) */}
        <div className="grid grid-cols-2 bg-slate-950 border-b border-slate-800 text-xs font-bold font-mono">
          <button
            onClick={() => { setTab('login'); setErrorMessage(''); }}
            className={`py-3 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              tab === 'login' ? 'border-amber-500 text-amber-400 bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-4 h-4" />
            <span>Müşteri / Admin Girişi</span>
          </button>
          <button
            onClick={() => { setTab('register'); setErrorMessage(''); }}
            className={`py-3 flex items-center justify-center space-x-2 border-b-2 transition-all ${
              tab === 'register' ? 'border-amber-500 text-amber-400 bg-slate-900/40' : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>Yeni Müşteri Kaydı</span>
          </button>
        </div>

        {/* Hata veya Kalan Hak Uyarısı */}
        {errorMessage && (
          <div className="m-4 mb-0 p-3 bg-rose-500/10 border border-rose-500/30 text-rose-300 rounded-xl text-xs flex items-start space-x-2">
            <ShieldAlert className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
            <div className="space-y-1">
              <span className="font-semibold block">{errorMessage}</span>
              {remainingAttempts !== null && remainingAttempts > 0 && (
                <span className="text-[11px] text-amber-300 block">
                  3 defa yanlış şifre girildiğinde kartınız ve hesabınız otomatik olarak bloke edilecektir.
                </span>
              )}
            </div>
          </div>
        )}

        {regSuccessMsg && (
          <div className="m-4 mb-0 p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 rounded-xl text-xs flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-400" />
            <span>{regSuccessMsg}</span>
          </div>
        )}

        {/* 1. GİRİŞ FORMU */}
        {tab === 'login' ? (
          <div className="p-6 space-y-5">
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  TC Kimlik No veya Kart Numarası
                </label>
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={e => setIdentifier(e.target.value)}
                  placeholder="11 haneli TC veya 16 haneli Kart No"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs text-slate-400 block">
                    Şifre / PIN Kodu (Maskeli)
                  </label>
                  <span className="text-[10px] text-amber-400/80 font-mono">
                    3 Hata = Bloke Koruması
                  </span>
                </div>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="Şifrenizi giriniz"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-amber-500 font-mono pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-500 hover:to-amber-600 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-amber-600/25 transition-all mt-2"
              >
                Sisteme Güvenli Giriş Yap
              </button>
            </form>

            {/* Hızlı Demo Hesap Seçiciler */}
            <div className="pt-2 border-t border-slate-800 space-y-2">
              <span className="text-[11px] text-slate-400 block text-center font-mono">
                — Hızlı Test Hesapları —
              </span>
              <div className="grid grid-cols-3 gap-2 text-[10px] font-mono">
                <button
                  type="button"
                  onClick={() => handlePresetSelect('10000000000', '123456')}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-amber-500/30 text-amber-300 text-center"
                >
                  <span className="block font-bold">Enes Öztürk</span>
                  <span className="text-[9px] text-slate-400">ADMIN (123456)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('11111111111', '1234')}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-emerald-500/30 text-emerald-300 text-center"
                >
                  <span className="block font-bold">Ahmet Yılmaz</span>
                  <span className="text-[9px] text-slate-400">MÜŞTERİ (1234)</span>
                </button>

                <button
                  type="button"
                  onClick={() => handlePresetSelect('33333333333', '1234')}
                  className="p-2 rounded-lg bg-slate-950 hover:bg-slate-800 border border-rose-500/30 text-rose-300 text-center"
                >
                  <span className="block font-bold">Mehmet Demir</span>
                  <span className="text-[9px] text-rose-400">BLOKE TEST</span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* 2. YENİ MÜŞTERİ KAYIT FORMU */
          <form onSubmit={handleRegisterSubmit} className="p-6 space-y-3 text-xs">
            <div>
              <label className="text-slate-400 block mb-1">TC Kimlik Numarası (11 Hane)</label>
              <input
                type="text"
                required
                maxLength={11}
                value={regTcNo}
                onChange={e => setRegTcNo(e.target.value.replace(/\D/g, ''))}
                placeholder="Örn: 98765432101"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
              />
            </div>

            <div>
              <label className="text-slate-400 block mb-1">Ad Soyad</label>
              <input
                type="text"
                required
                value={regFullName}
                onChange={e => setRegFullName(e.target.value)}
                placeholder="Örn: Cengizhan Öztürk"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">E-Posta</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="ornek@mail.com"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">Telefon</label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onChange={e => setRegPhone(e.target.value)}
                  placeholder="05..."
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-slate-400 block mb-1">Şifre / PIN</label>
                <input
                  type="password"
                  required
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="En az 4 hane"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1">İlk Bakiye (₺)</label>
                <input
                  type="number"
                  value={regInitialDeposit}
                  onChange={e => setRegInitialDeposit(e.target.value)}
                  placeholder="1000"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-3 rounded-xl shadow-lg shadow-emerald-600/30 transition-all mt-4"
            >
              Müşteri Hesabını Aç & Kaydet
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
