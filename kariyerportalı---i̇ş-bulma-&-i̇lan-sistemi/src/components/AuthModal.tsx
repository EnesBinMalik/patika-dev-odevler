/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Component: AuthModal
 * Implements Spring Security authentication modal with 3-attempt account lockout and password masking
 */

import React, { useState } from 'react';
import { X, Lock, Mail, AlertTriangle, CheckCircle2, UserPlus, LogIn, ShieldAlert, KeyRound, Building2, User } from 'lucide-react';
import { AuthService } from '../core/services/AuthService.ts';
import { DatabaseService } from '../core/services/DatabaseService.ts';
import { User as UserEntity } from '../core/entities/UserEntity.ts';
import { MilitaryStatus, MilitaryStatusLabels } from '../core/types/enums.ts';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
  onSuccess: (user: UserEntity) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  initialMode,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [registerRole, setRegisterRole] = useState<'CANDIDATE' | 'COMPANY'>('CANDIDATE');

  // Login form state
  const [loginEmail, setLoginEmail] = useState('ahmet.yilmaz@gmail.com');
  const [loginPassword, setLoginPassword] = useState('123456');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [remainingAttempts, setRemainingAttempts] = useState<number | null>(null);
  const [isLockedAccount, setIsLockedAccount] = useState(false);

  // Candidate Registration form state
  const [candEmail, setCandEmail] = useState('');
  const [candPassword, setCandPassword] = useState('');
  const [candFirstName, setCandFirstName] = useState('');
  const [candLastName, setCandLastName] = useState('');
  const [candPhone, setCandPhone] = useState('');
  const [candCity, setCandCity] = useState('İstanbul');
  const [candMilitaryStatus, setCandMilitaryStatus] = useState<MilitaryStatus>(MilitaryStatus.DONE);
  const [candExperienceYears, setCandExperienceYears] = useState(3);
  const [candTitle, setCandTitle] = useState('Fullstack Developer');
  const [candSkills, setCandSkills] = useState('React, Java, Spring Boot, PostgreSQL');

  // Company Registration form state
  const [compEmail, setCompEmail] = useState('');
  const [compPassword, setCompPassword] = useState('');
  const [compFullName, setCompFullName] = useState('');
  const [compPhone, setCompPhone] = useState('');
  const [compName, setCompName] = useState('');
  const [compIndustry, setCompIndustry] = useState('Yazılım & Bilişim');
  const [compTaxNumber, setCompTaxNumber] = useState('');
  const [compCity, setCompCity] = useState('İstanbul');
  const [compWebsite, setCompWebsite] = useState('');

  const [registerSuccessMessage, setRegisterSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const authService = AuthService.getInstance();
  const db = DatabaseService.getInstance();

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setIsLockedAccount(false);

    const result = authService.login(loginEmail, loginPassword);

    if (result.success && result.user) {
      onSuccess(result.user);
      onClose();
    } else {
      setLoginError(result.errorMessage || 'Giriş yapılamadı.');
      if (result.remainingAttempts !== undefined) {
        setRemainingAttempts(result.remainingAttempts);
      }
      if (result.isLocked) {
        setIsLockedAccount(true);
      }
    }
  };

  const handleUnlockCandidate = (email: string) => {
    const userOpt = db.users.findByEmail(email);
    if (userOpt.isPresent()) {
      authService.unlockUser(userOpt.get().getId());
      setIsLockedAccount(false);
      setRemainingAttempts(3);
      setLoginError('Hesabın kilidi admin tarafından açıldı. Şifrenizi girerek tekrar giriş yapabilirsiniz.');
    }
  };

  const handleCandidateRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const skillsArray = candSkills
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    const result = authService.registerCandidate({
      email: candEmail,
      rawPassword: candPassword,
      firstName: candFirstName,
      lastName: candLastName,
      phone: candPhone,
      city: candCity,
      militaryStatus: candMilitaryStatus,
      experienceYears: Number(candExperienceYears),
      currentTitle: candTitle,
      skills: skillsArray,
    });

    if (result.success && result.user) {
      setRegisterSuccessMessage('Aday kaydınız başarıyla oluşturuldu! Şimdi giriş yapabilirsiniz.');
      setLoginEmail(candEmail);
      setLoginPassword(candPassword);
      setMode('login');
    } else {
      setLoginError(result.errorMessage || 'Kayıt oluşturulamadı.');
    }
  };

  const handleCompanyRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const result = authService.registerCompany({
      email: compEmail,
      rawPassword: compPassword,
      fullName: compFullName,
      phone: compPhone,
      companyName: compName,
      industry: compIndustry,
      taxNumber: compTaxNumber,
      city: compCity,
      website: compWebsite,
    });

    if (result.success && result.user) {
      setRegisterSuccessMessage('Şirket yetkili hesabı açıldı! Şimdi giriş yapabilirsiniz.');
      setLoginEmail(compEmail);
      setLoginPassword(compPassword);
      setMode('login');
    } else {
      setLoginError(result.errorMessage || 'Şirket kaydı oluşturulamadı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl max-w-lg w-full max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {mode === 'login' ? <Lock className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {mode === 'login' ? 'Kullanıcı Girişi (Spring Security)' : 'Yeni Kullanıcı Kaydı'}
              </h2>
              <p className="text-xs text-slate-500">
                {mode === 'login'
                  ? '3 hatalı denemede hesap kilitleme güvenliği aktiftir'
                  : 'Aday veya Şirket Yetkilisi hesabı oluşturun'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="p-1 mx-6 mt-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center">
          <button
            onClick={() => {
              setMode('login');
              setLoginError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'login'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Giriş Yap
          </button>
          <button
            onClick={() => {
              setMode('register');
              setLoginError(null);
            }}
            className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
              mode === 'register'
                ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            Kayıt Ol (Yeni Üyelik)
          </button>
        </div>

        {/* Success Banner */}
        {registerSuccessMessage && (
          <div className="mx-6 mt-3 p-3 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
            <span>{registerSuccessMessage}</span>
          </div>
        )}

        {/* Error / Lockout Banner */}
        {loginError && (
          <div
            className={`mx-6 mt-3 p-3 rounded-xl border flex flex-col gap-2 text-xs ${
              isLockedAccount
                ? 'bg-rose-50 dark:bg-rose-950/50 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2">
              {isLockedAccount ? (
                <ShieldAlert className="w-4 h-4 shrink-0 text-rose-600" />
              ) : (
                <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
              )}
              <span className="font-semibold">{loginError}</span>
            </div>

            {isLockedAccount && (
              <div className="pt-2 border-t border-rose-200 dark:border-rose-800 flex items-center justify-between">
                <span>Test için hesabı hemen açmak ister misiniz?</span>
                <button
                  type="button"
                  onClick={() => handleUnlockCandidate(loginEmail)}
                  className="px-2.5 py-1 bg-rose-600 text-white rounded text-[11px] font-semibold hover:bg-rose-700"
                >
                  Kilidi Aç (Reset)
                </button>
              </div>
            )}
          </div>
        )}

        {/* Content based on Mode */}
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                E-Posta Adresi
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={e => setLoginEmail(e.target.value)}
                  placeholder="ornek@alanadi.com"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Şifre (Maskelenmiş Saklanır)
                </label>
                <span className="text-[10px] text-slate-400">Demo şifre: 123456</span>
              </div>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={e => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                />
              </div>
            </div>

            {/* 3 Attempts Notification Box */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-750 text-[11px] text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between font-medium">
                <span>Güvenlik Kuralı:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">
                  3 Yanlış Girişte Hesap Bloke Olur
                </span>
              </div>
              <div className="mt-1 flex items-center justify-between text-slate-500">
                <span>Varsayılan deneme hakkı:</span>
                <span className="font-mono font-semibold">
                  {remainingAttempts !== null ? `${remainingAttempts} / 3` : '3 / 3'}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg shadow-sm text-xs transition-colors flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Sisteme Giriş Yap</span>
              </button>
            </div>

            {/* Quick pre-fill buttons for test convenience */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
              <p className="text-[11px] text-slate-400 mb-2 font-medium">Hızlı Form Doldurucu (Tek Tıkla Dene):</p>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('admin@teknolojias.com');
                    setLoginPassword('123456');
                  }}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800 truncate"
                >
                  🏢 Teknoloji A.Ş. (Admin)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setLoginEmail('ahmet.yilmaz@gmail.com');
                    setLoginPassword('123456');
                  }}
                  className="p-1.5 rounded border border-slate-200 dark:border-slate-800 text-left hover:bg-slate-50 dark:hover:bg-slate-800 truncate"
                >
                  👤 Ahmet Yılmaz (Senior Aday)
                </button>
              </div>
            </div>
          </form>
        ) : (
          <div className="p-6 space-y-4">
            {/* Role selection for registration */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRegisterRole('CANDIDATE')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  registerRole === 'CANDIDATE'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <User className="w-4 h-4 text-indigo-600" />
                  <span>İş Arayan (Aday)</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  Özgeçmiş oluştur, askelik ve deneyim durumunu ekle, iş ara.
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRegisterRole('COMPANY')}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col gap-1 ${
                  registerRole === 'COMPANY'
                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-950/40 text-indigo-900 dark:text-indigo-200'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-1.5 font-semibold text-xs">
                  <Building2 className="w-4 h-4 text-indigo-600" />
                  <span>Şirket (İşveren / Admin)</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  İlan yayınla, veritabanında aday filtrele, başvuruları yönet.
                </span>
              </button>
            </div>

            {registerRole === 'CANDIDATE' ? (
              <form onSubmit={handleCandidateRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Ad
                    </label>
                    <input
                      type="text"
                      required
                      value={candFirstName}
                      onChange={e => setCandFirstName(e.target.value)}
                      placeholder="Mehmet"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={candLastName}
                      onChange={e => setCandLastName(e.target.value)}
                      placeholder="Demir"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      E-Posta
                    </label>
                    <input
                      type="email"
                      required
                      value={candEmail}
                      onChange={e => setCandEmail(e.target.value)}
                      placeholder="mehmet@gmail.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Telefon No
                    </label>
                    <input
                      type="tel"
                      required
                      value={candPhone}
                      onChange={e => setCandPhone(e.target.value)}
                      placeholder="0532 999 8877"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Askerlik Durumu
                    </label>
                    <select
                      value={candMilitaryStatus}
                      onChange={e => setCandMilitaryStatus(e.target.value as MilitaryStatus)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 text-slate-800 dark:text-slate-200"
                    >
                      {Object.values(MilitaryStatus).map(status => (
                        <option key={status} value={status}>
                          {MilitaryStatusLabels[status]}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Deneyim Yılı
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={40}
                      required
                      value={candExperienceYears}
                      onChange={e => setCandExperienceYears(Number(e.target.value))}
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Unvan / Pozisyon
                  </label>
                  <input
                    type="text"
                    required
                    value={candTitle}
                    onChange={e => setCandTitle(e.target.value)}
                    placeholder="Senior Java Developer"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Yetenekler (Virgülle ayırın)
                  </label>
                  <input
                    type="text"
                    value={candSkills}
                    onChange={e => setCandSkills(e.target.value)}
                    placeholder="React, Spring Boot, PostgreSQL, Docker"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Şifre (Spring Security BCrypt ile Hashlenir)
                  </label>
                  <input
                    type="password"
                    required
                    value={candPassword}
                    onChange={e => setCandPassword(e.target.value)}
                    placeholder="En az 4 karakter"
                    className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 font-mono"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Aday Hesabı Oluştur
                </button>
              </form>
            ) : (
              <form onSubmit={handleCompanyRegisterSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Şirket Adı
                    </label>
                    <input
                      type="text"
                      required
                      value={compName}
                      onChange={e => setCompName(e.target.value)}
                      placeholder="Kodline Teknoloji A.Ş."
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Sektör
                    </label>
                    <input
                      type="text"
                      required
                      value={compIndustry}
                      onChange={e => setCompIndustry(e.target.value)}
                      placeholder="Bilişim & Yazılım"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Vergi No
                    </label>
                    <input
                      type="text"
                      required
                      value={compTaxNumber}
                      onChange={e => setCompTaxNumber(e.target.value)}
                      placeholder="1234567890"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Şehir
                    </label>
                    <input
                      type="text"
                      required
                      value={compCity}
                      onChange={e => setCompCity(e.target.value)}
                      placeholder="İstanbul"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Yetkili Ad Soyad
                    </label>
                    <input
                      type="text"
                      required
                      value={compFullName}
                      onChange={e => setCompFullName(e.target.value)}
                      placeholder="Selin Vural (İK)"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Yetkili Telefon
                    </label>
                    <input
                      type="tel"
                      required
                      value={compPhone}
                      onChange={e => setCompPhone(e.target.value)}
                      placeholder="0533 111 2233"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      E-Posta (Giriş İçin)
                    </label>
                    <input
                      type="email"
                      required
                      value={compEmail}
                      onChange={e => setCompEmail(e.target.value)}
                      placeholder="hr@sirketiniz.com"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Şifre
                    </label>
                    <input
                      type="password"
                      required
                      value={compPassword}
                      onChange={e => setCompPassword(e.target.value)}
                      placeholder="En az 4 karakter"
                      className="w-full px-3 py-1.5 text-xs border border-slate-200 dark:border-slate-750 rounded-lg bg-white dark:bg-slate-850 font-mono"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg text-xs transition-colors"
                >
                  Şirket & Admin Hesabı Oluştur
                </button>
              </form>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
