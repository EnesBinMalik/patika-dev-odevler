/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Patika Turizm Acente Sistemi - Giriş Ekranı
 * Geliştirici: Enes Öztürk
 */

import React, { useState } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { Building2, KeyRound, User, Lock, AlertCircle, Sparkles, CheckCircle2 } from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose?: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, users, setCurrentUser } = useDatabase();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    const res = login(username, password);
    if (!res.success) {
      setErrorMsg(res.message || 'Kullanıcı adı veya şifre hatalı!');
    } else {
      if (onClose) onClose();
    }
  };

  const handleQuickLogin = (uName: string, pass: string) => {
    setUsername(uName);
    setPassword(pass);
    const res = login(uName, pass);
    if (res.success && onClose) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Brand Banner */}
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 text-white p-6 text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-sky-600/30 border border-sky-400/40 text-sky-400 flex items-center justify-center mx-auto shadow-sm">
            <Building2 className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Patika Turizm Acentesi
          </h2>
          <p className="text-xs text-slate-400 max-w-xs mx-auto">
            Otel & Rezervasyon Yönetim Platformu
          </p>
          <div className="pt-1">
            <span className="text-[11px] text-amber-400 font-semibold inline-flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Geliştirici: Enes Öztürk
            </span>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-5">
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMsg && (
              <div className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Kullanıcı Adı
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Kullanıcı adınız"
                  className="w-full pl-9 pr-3 py-2 text-xs font-medium bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-semibold text-slate-700">
                Şifre
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs font-mono bg-slate-50 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-sky-500/20 text-slate-800"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-sky-600 hover:bg-sky-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
            >
              Sisteme Giriş Yap
            </button>
          </form>

          {/* Quick Demo Credentials */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block text-center">
              Tek Tıkla Hızlı Test Girişi
            </span>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleQuickLogin('admin', 'admin123')}
                className="p-2.5 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-indigo-900">Enes Öztürk</div>
                <div className="text-[10px] text-indigo-600 font-medium">Yönetici (Admin)</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">admin / admin123</div>
              </button>

              <button
                type="button"
                onClick={() => handleQuickLogin('personel', '123456')}
                className="p-2.5 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-xl text-left transition-colors"
              >
                <div className="text-xs font-bold text-emerald-900">Ahmet Yılmaz</div>
                <div className="text-[10px] text-emerald-600 font-medium">Acente Personeli</div>
                <div className="text-[10px] text-slate-400 font-mono mt-0.5">personel / 123456</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
