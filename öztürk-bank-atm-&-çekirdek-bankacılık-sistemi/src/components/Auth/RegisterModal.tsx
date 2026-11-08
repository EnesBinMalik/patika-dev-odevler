/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * Yeni Müşteri Kayıt (Register) Ekranı
 */

import React, { useState } from 'react';
import { X, UserPlus, CheckCircle2, AlertCircle } from 'lucide-react';
import { AuthService } from '../../core/services/AuthService';
import { User, Account } from '../../types/models';
import { soundEffects } from '../../utils/soundEffects';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRegisterSuccess: (user: User, account: Account) => void;
}

export const RegisterModal: React.FC<RegisterModalProps> = ({
  isOpen,
  onClose,
  onRegisterSuccess,
}) => {
  const [tcNo, setTcNo] = useState('');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [initialDeposit, setInitialDeposit] = useState('2500');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const authService = new AuthService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (tcNo.length !== 11) {
      setErrorMsg('T.C. Kimlik Numarası 11 haneli olmalıdır.');
      return;
    }

    if (pin.length !== 4) {
      setErrorMsg('ATM PIN kodu tam 4 haneli olmalıdır.');
      return;
    }

    try {
      soundEffects.playKeypadBeep();
      const result = authService.registerCustomer({
        tcNo,
        fullName,
        email,
        phone,
        password,
        pin,
        initialDeposit: Number(initialDeposit) || 0,
      });

      soundEffects.playSuccessChime();
      onRegisterSuccess(result.user, result.account);
      onClose();
    } catch (err: any) {
      soundEffects.playErrorBuzzer();
      setErrorMsg(err.message || 'Kayıt işlemi başarısız oldu.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400">
              <UserPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-100">Yeni Müşteri Kaydı (Hesap Açılışı)</h2>
              <p className="text-[11px] text-slate-400">Öztürk Bank Ailesine Katılın</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-500/15 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">T.C. Kimlik No (11 Hane)</label>
              <input
                type="text"
                required
                maxLength={11}
                value={tcNo}
                onChange={(e) => setTcNo(e.target.value.replace(/\D/g, ''))}
                placeholder="12345678901"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Ad Soyad</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Örn: Caner Korkmaz"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">E-Posta Adresi</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@domain.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">Telefon Numarası</label>
              <input
                type="tel"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+90 5XX XXX XX XX"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">İnternet Şifresi (Maskeli)</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300">ATM PIN Kodu (4 Hane)</label>
              <input
                type="password"
                required
                maxLength={4}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="••••"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors tracking-widest font-mono text-center"
              />
            </div>
          </div>

          <div className="space-y-1 pt-1">
            <label className="text-xs font-semibold text-slate-300">İlk Açılış Bakiyesi (TL)</label>
            <input
              type="number"
              min="0"
              step="50"
              value={initialDeposit}
              onChange={(e) => setInitialDeposit(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-emerald-400 placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500 transition-colors font-mono font-bold"
            />
            <p className="text-[11px] text-slate-400">
              * Otomatik olarak Kadıköy Merkez Şubesine bağlı IBAN, Hesap No ve Sanal Kart üretilecektir.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold rounded-lg text-sm transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <CheckCircle2 className="w-4 h-4" />
            Hesabı Aç ve Kaydı Tamamla
          </button>
        </form>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 text-center text-[11px] text-slate-500">
          Öztürk Bank Çekirdek Bankacılık Sistemi · Otomatik IBAN &amp; Hesap Entegrasyonu
        </div>
      </div>
    </div>
  );
};
