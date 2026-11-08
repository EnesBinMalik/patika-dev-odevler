/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Giriş (Login) Ekranı
 * Kurallar:
 * - Şifreler maskelenmiş olmalıdır.
 * - 3 hatalı denemede hesap otomatik bloke edilir.
 */

import React, { useState } from 'react';
import { X, Lock, ShieldAlert, ArrowRight, UserCheck, AlertTriangle } from 'lucide-react';
import { AuthService } from '../../core/services/AuthService';
import { User, Account } from '../../types/models';
import { soundEffects } from '../../utils/soundEffects';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User, account?: Account) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isBlocked, setIsBlocked] = useState(false);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);

  if (!isOpen) return null;

  const authService = new AuthService();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsBlocked(false);

    try {
      soundEffects.playKeypadBeep();
      const result = authService.login(identifier, password, 'WEB');
      soundEffects.playSuccessChime();
      onLoginSuccess(result.user, result.account);
      onClose();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMsg(err.message || 'Giriş yapılamadı.');
      if (err.remainingAttempts !== undefined) {
        setRemainingAttempts(err.remainingAttempts);
      }
      if (err.code === 'BANK_ERR_ACCOUNT_BLOCKED') {
        setIsBlocked(true);
      }
    }
  };

  // Hızlı test için örnek kullanıcıları doldurma
  const quickFill = (type: 'ADMIN' | 'CUSTOMER_AHMET' | 'CUSTOMER_BLOCKED') => {
    soundEffects.playKeypadBeep(600);
    if (type === 'ADMIN') {
      setIdentifier('enes.ozturk@ozturkbank.com.tr');
      setPassword('admin123');
    } else if (type === 'CUSTOMER_AHMET') {
      setIdentifier('23456789012');
      setPassword('123456');
    } else if (type === 'CUSTOMER_BLOCKED') {
      setIdentifier('56789012345');
      setPassword('123456');
    }
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Öztürk Bank Giriş</h2>
              <p className="text-[11px] text-slate-400">Müşteri veya Banka Yetkilisi Girişi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Security Warning Notice */}
        <div className="px-6 py-2.5 bg-amber-500/10 border-b border-amber-500/20 flex items-center gap-2 text-xs text-amber-300">
          <ShieldAlert className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            Güvenlik: <strong>3 hatalı şifre denemesinde</strong> hesap otomatik olarak bloke edilir.
          </span>
        </div>

        {/* Form Body */}
        <form onSubmit={handleLogin} className="p-6 space-y-4">
          {errorMsg && (
            <div
              className={`p-3 rounded-lg border text-xs flex items-start gap-2.5 ${
                isBlocked
                  ? 'bg-rose-500/15 border-rose-500/30 text-rose-300'
                  : 'bg-amber-500/15 border-amber-500/30 text-amber-300'
              }`}
            >
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{errorMsg}</p>
                {remainingAttempts !== null && remainingAttempts > 0 && (
                  <p className="mt-1 text-slate-300">
                    Kalan Giriş Hakkı: <strong className="text-amber-400">{remainingAttempts}</strong>
                  </p>
                )}
                {isBlocked && (
                  <p className="mt-1 text-slate-300">
                    Hesabınızın blokesini kaldırmak için Banka Yöneticisi (Admin) ile iletişime geçiniz.
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              T.C. Kimlik No / E-posta / Kart No
            </label>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Örn: 23456789012 veya ahmet.yilmaz@gmail.com"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Şifre / PIN (Maskelenmiş)
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-amber-500 transition-colors tracking-widest font-mono"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20"
          >
            Sisteme Güvenli Giriş Yap
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Test Demo Credentials */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Hızlı Test Hesapları (Tek Tıkla Doldur)
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 text-xs">
              <button
                type="button"
                onClick={() => quickFill('ADMIN')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/20 rounded text-left truncate transition-colors"
                title="Admin: Enes Öztürk"
              >
                👑 Admin (Enes)
              </button>
              <button
                type="button"
                onClick={() => quickFill('CUSTOMER_AHMET')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/20 rounded text-left truncate transition-colors"
                title="Müşteri: Ahmet Yılmaz"
              >
                👤 Müşteri (Ahmet)
              </button>
              <button
                type="button"
                onClick={() => quickFill('CUSTOMER_BLOCKED')}
                className="px-2 py-1.5 bg-slate-950 hover:bg-slate-800 text-rose-400 border border-rose-500/20 rounded text-left truncate transition-colors"
                title="Bloke Müşteri: Zeynep Çelik"
              >
                🚫 Bloke (Zeynep)
              </button>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Öztürk Bank Güvenlik Altyapısı · SHA-256 Maskeleme &amp; 3-Hata Koruma Protokolü
        </div>
      </div>
    </div>
  );
};
