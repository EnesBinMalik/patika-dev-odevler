import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { X, Lock, Mail, User as UserIcon, Shield, Award, CheckCircle2, AlertCircle } from 'lucide-react';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authModalMode, 
    setAuthModalMode,
    login,
    register,
    users
  } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [specialty, setSpecialty] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isAuthModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Email check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setErrorMsg('Lütfen geçerli bir e-posta adresi giriniz.');
      return;
    }

    if (authModalMode === 'login') {
      const result = login(email, password);
      if (!result.success) {
        setErrorMsg(result.error || 'Giriş yapılamadı.');
      } else {
        setIsAuthModalOpen(false);
        resetForm();
      }
    } else {
      if (name.trim().length < 3) {
        setErrorMsg('Ad Soyad en az 3 karakterden oluşmalıdır.');
        return;
      }
      if (password.length < 3) {
        setErrorMsg('Şifreniz en az 3 karakter olmalıdır.');
        return;
      }

      const result = register({
        name,
        email,
        password,
        role,
        specialty: role === 'trainer' ? (specialty || 'Genel Kondisyon') : undefined
      });

      if (!result.success) {
        setErrorMsg(result.error || 'Kayıt başarısız.');
      } else {
        setIsAuthModalOpen(false);
        resetForm();
      }
    }
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setRole('member');
    setSpecialty('');
    setErrorMsg(null);
  };

  const fillDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('123');
    setErrorMsg(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => {
            setIsAuthModalOpen(false);
            resetForm();
          }}
          className="absolute top-5 right-5 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-display text-2xl font-bold tracking-wide text-white uppercase">
              MISFIT
            </span>
            <span className="text-neutral-500">·</span>
            <span className="text-xs text-amber-400 font-semibold uppercase tracking-wider">
              {authModalMode === 'login' ? 'Giriş Yap' : 'Kayıt Ol'}
            </span>
          </div>
          <p className="text-xs text-neutral-400">
            {authModalMode === 'login' 
              ? 'Antrenmanlarınıza erişmek veya yönetmek için giriş yapın.' 
              : 'Misfit kulübüne üye olun veya antrenör olarak seanslarınızı oluşturun.'}
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="flex items-center p-1 bg-neutral-950 rounded-lg mb-6 border border-neutral-800">
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('login');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              authModalMode === 'login'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => {
              setAuthModalMode('register');
              setErrorMsg(null);
            }}
            className={`flex-1 py-2 text-xs font-semibold rounded-md transition-all ${
              authModalMode === 'register'
                ? 'bg-amber-500 text-neutral-950 shadow-sm'
                : 'text-neutral-400 hover:text-white'
            }`}
          >
            Yeni Hesap Oluştur
          </button>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-rose-950/60 border border-rose-800 text-rose-200 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {authModalMode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Ad Soyad
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Örn: Enes Öztürk"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Hesap Türü (Rol)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRole('member')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      role === 'member'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-400'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-4 h-4" />
                    <span>Üye / Sporcu</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('trainer')}
                    className={`p-2.5 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                      role === 'trainer'
                        ? 'border-amber-400 bg-amber-500/10 text-amber-400'
                        : 'border-neutral-800 bg-neutral-950 text-neutral-400 hover:text-white'
                    }`}
                  >
                    <Award className="w-4 h-4" />
                    <span>Eğitmen / Koç</span>
                  </button>
                </div>
              </div>

              {role === 'trainer' && (
                <div>
                  <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                    Uzmanlık Alanınız
                  </label>
                  <input
                    type="text"
                    value={specialty}
                    onChange={(e) => setSpecialty(e.target.value)}
                    placeholder="Örn: Boks & Fonksiyonel Güç"
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
                  />
                </div>
              )}
            </>
          )}

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              E-posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ad@ornek.com"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-neutral-950 border border-neutral-800 rounded-lg pl-10 pr-3.5 py-2.5 text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400 transition-colors"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 text-xs font-bold rounded-lg transition-colors uppercase tracking-wider shadow-md shadow-amber-500/20"
          >
            {authModalMode === 'login' ? 'Giriş Yap' : 'Hesabı Tamamla & Kaydol'}
          </button>
        </form>

        {/* Demo Fast Login Pills */}
        <div className="mt-6 pt-5 border-t border-neutral-800">
          <p className="text-[11px] text-neutral-400 mb-2 font-medium">Hızlı Test Hesapları (Tek Tıkla Doldur):</p>
          <div className="grid grid-cols-2 gap-1.5">
            <button
              type="button"
              onClick={() => fillDemoAccount('enes@misfit.com')}
              className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-[11px] text-neutral-300 text-left truncate flex items-center gap-1.5"
            >
              <Shield className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Enes (Admin)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('burak@misfit.com')}
              className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-[11px] text-neutral-300 text-left truncate flex items-center gap-1.5"
            >
              <Award className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Burak (Eğitmen)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('selin@misfit.com')}
              className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-[11px] text-neutral-300 text-left truncate flex items-center gap-1.5"
            >
              <Award className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Selin (Eğitmen)</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemoAccount('caner@gmail.com')}
              className="px-2 py-1.5 bg-neutral-950 hover:bg-neutral-800 border border-neutral-800 rounded text-[11px] text-neutral-300 text-left truncate flex items-center gap-1.5"
            >
              <UserIcon className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="truncate">Caner (Üye)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
