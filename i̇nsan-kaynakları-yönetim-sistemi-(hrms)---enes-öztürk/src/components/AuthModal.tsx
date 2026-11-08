/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Spring Security Kimlik Doğrulama & Kayıt Modalı (Login & Register)
 * Geliştirici: Enes Öztürk
 * 
 * "Login için 3 giriş hakkı vardır yoksa bloke olur"
 * "Şifreler database maskelenmiş şekilde kaydedilmelidir"
 */

import React, { useState } from 'react';
import { 
  Lock, 
  User, 
  Mail, 
  ShieldAlert, 
  Eye, 
  EyeOff, 
  KeyRound, 
  X, 
  CheckCircle2, 
  AlertTriangle,
  Sparkles
} from 'lucide-react';
import { HRService } from '../services/hrService';
import { Department, IUser } from '../models/types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: IUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  if (!isOpen) return null;

  const hrService = HRService.getInstance();
  const [activeTab, setActiveTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Form State
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Form State
  const [regUsername, setRegUsername] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regTcNo, setRegTcNo] = useState('');
  const [regDepartment, setRegDepartment] = useState<Department>(Department.IT);
  const [regPosition, setRegPosition] = useState('');
  const [regPhone, setRegPhone] = useState('');

  // Status & Error Messages
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await hrService.login({
        usernameOrEmail,
        password,
      });

      if (res.success && res.user) {
        setSuccessMessage('Giriş başarılı! Yönlendiriliyorsunuz...');
        setTimeout(() => {
          onLoginSuccess(res.user!);
          onClose();
        }, 600);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Giriş sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');
    setIsLoading(true);

    try {
      const res = await hrService.register({
        username: regUsername,
        email: regEmail,
        password: regPassword,
        firstName: regFirstName,
        lastName: regLastName,
        tcNo: regTcNo,
        department: regDepartment,
        position: regPosition || 'Yazılım Mühendisi',
        phone: regPhone,
      });

      if (res.success && res.user) {
        setSuccessMessage(res.message);
        setTimeout(() => {
          setActiveTab('LOGIN');
          setUsernameOrEmail(regUsername);
          setPassword('');
          setSuccessMessage('');
        }, 1200);
      } else {
        setErrorMessage(res.message);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Kayıt sırasında hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  // Hızlı Demo Girişi Yardımcıları
  const quickFillAdmin = () => {
    setUsernameOrEmail('enes.ozturk');
    setPassword('Admin123!');
  };

  const quickFillUser = () => {
    setUsernameOrEmail('ahmet.yilmaz');
    setPassword('User123!');
  };

  const quickFillLocked = () => {
    setUsernameOrEmail('can.ozkan');
    setPassword('User123!');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative max-h-[92vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 p-1"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Başlık ve İmzası */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-xl flex items-center justify-center mx-auto mb-3 shadow-md">
            <KeyRound className="w-6 h-6 text-indigo-400" />
          </div>
          <h2 className="text-lg font-bold text-slate-900">
            {activeTab === 'LOGIN' ? 'Sisteme Giriş Yap' : 'Yeni Çalışan Kaydı'}
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            İnsan Kaynakları Yönetim Sistemi · Enes Öztürk
          </p>
        </div>

        {/* Tab Butonları */}
        <div className="flex border-b border-slate-200 mb-5">
          <button
            onClick={() => { setActiveTab('LOGIN'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === 'LOGIN' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Giriş Yap (Spring Security)
          </button>
          <button
            onClick={() => { setActiveTab('REGISTER'); setErrorMessage(''); setSuccessMessage(''); }}
            className={`flex-1 pb-2.5 text-xs font-semibold text-center transition-colors border-b-2 ${
              activeTab === 'REGISTER' ? 'border-slate-900 text-slate-900' : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Kayıt Ol (Register)
          </button>
        </div>

        {/* Hata & Başarı Bildirimleri */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}
        {successMessage && (
          <div className="mb-4 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* 1. GİRİŞ FORMU */}
        {activeTab === 'LOGIN' && (
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Kullanıcı Adı veya E-posta
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={usernameOrEmail}
                  onChange={e => setUsernameOrEmail(e.target.value)}
                  placeholder="enes.ozturk veya ahmet.yilmaz"
                  className="w-full pl-9 pr-3 py-2 border border-slate-200 rounded-lg text-xs focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block font-semibold text-slate-700">Şifre</label>
                <span className="text-[10px] text-slate-400">SHA-256 Maskeli</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-9 py-2 border border-slate-200 rounded-lg text-xs font-mono focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong>Güvenlik Protokolü:</strong> Login için <strong>3 hatalı deneme hakkı</strong> vardır. 3 kez yanlış şifre girildiğinde hesap bloke olur ve yalnızca İK Uzmanı tarafından açılabilir.
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Doğrulanıyor...' : 'Giriş Yap'}
            </button>

            {/* Hızlı Demo Hesap Butonları */}
            <div className="pt-3 border-t border-slate-100 space-y-2">
              <span className="text-[11px] font-semibold text-slate-500 block">
                Hızlı Test & Değerlendirme Girişleri:
              </span>
              <div className="grid grid-cols-3 gap-1.5 text-[10px]">
                <button
                  type="button"
                  onClick={quickFillAdmin}
                  className="p-1.5 rounded border border-indigo-200 bg-indigo-50/60 text-indigo-900 font-medium hover:bg-indigo-100"
                >
                  İK Admin (Enes)
                </button>
                <button
                  type="button"
                  onClick={quickFillUser}
                  className="p-1.5 rounded border border-emerald-200 bg-emerald-50/60 text-emerald-900 font-medium hover:bg-emerald-100"
                >
                  Çalışan (Ahmet)
                </button>
                <button
                  type="button"
                  onClick={quickFillLocked}
                  className="p-1.5 rounded border border-rose-200 bg-rose-50/60 text-rose-900 font-medium hover:bg-rose-100"
                >
                  Bloke Hesap (Can)
                </button>
              </div>
            </div>
          </form>
        )}

        {/* 2. KAYIT FORMU */}
        {activeTab === 'REGISTER' && (
          <form onSubmit={handleRegister} className="space-y-3 text-xs">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Ad *</label>
                <input
                  type="text"
                  required
                  value={regFirstName}
                  onChange={e => setRegFirstName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Soyad *</label>
                <input
                  type="text"
                  required
                  value={regLastName}
                  onChange={e => setRegLastName(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">TC Kimlik No *</label>
              <input
                type="text"
                required
                maxLength={11}
                value={regTcNo}
                onChange={e => setRegTcNo(e.target.value)}
                placeholder="11 haneli TC"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Kullanıcı Adı *</label>
                <input
                  type="text"
                  required
                  value={regUsername}
                  onChange={e => setRegUsername(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">E-posta *</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-0.5">Şifre * (SHA-256 ile Hashlenecektir)</label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={e => setRegPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs font-mono"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Departman</label>
                <select
                  value={regDepartment}
                  onChange={e => setRegDepartment(e.target.value as Department)}
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs bg-white"
                >
                  {Object.values(Department).map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold text-slate-700 mb-0.5">Pozisyon</label>
                <input
                  type="text"
                  value={regPosition}
                  onChange={e => setRegPosition(e.target.value)}
                  placeholder="Yazılım Mühendisi"
                  className="w-full px-2.5 py-1.5 border border-slate-200 rounded-lg text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-xs transition-colors mt-2"
            >
              Kayıt Ol ve Personel Oluştur
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
