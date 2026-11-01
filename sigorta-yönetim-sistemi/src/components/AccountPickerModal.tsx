import React, { useState } from 'react';
import {
  Account,
  AccountManager,
  Enterprise,
  HomeAddress,
  Individual,
  InvalidAuthenticationException,
  User,
} from '../types/insurance';
import { Shield, Lock, AlertCircle, UserPlus, CheckCircle2 } from 'lucide-react';

interface AccountPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  accountManager: AccountManager;
  onSelectAccount: (account: Account) => void;
}

export const AccountPickerModal: React.FC<AccountPickerModalProps> = ({
  isOpen,
  onClose,
  accountManager,
  onSelectAccount,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'LOGIN' | 'REGISTER'>('LOGIN');

  // Manual Login Form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Register Form
  const [regFirstName, setRegFirstName] = useState('');
  const [regLastName, setRegLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regOccupation, setRegOccupation] = useState('');
  const [regAge, setRegAge] = useState(30);
  const [regType, setRegType] = useState<'INDIVIDUAL' | 'ENTERPRISE'>('INDIVIDUAL');
  const [regCompanyName, setRegCompanyName] = useState('');
  const [regSuccess, setRegSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    try {
      // AccountManager.login try-catch demonstration
      const account = accountManager.login(loginEmail, loginPassword);
      if (account) {
        onSelectAccount(account);
        onClose();
      }
    } catch (err: unknown) {
      if (err instanceof InvalidAuthenticationException) {
        setLoginError(`[InvalidAuthenticationException] ${err.message}`);
      } else {
        setLoginError(`Giriş hatası: ${String(err)}`);
      }
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setRegSuccess(null);

    const newUser = new User(
      regFirstName,
      regLastName,
      regEmail.trim().toLowerCase(),
      regPassword,
      regOccupation || 'Müşteri',
      Number(regAge) || 25,
      [
        new HomeAddress(
          'Cumhuriyet Cad.',
          '15',
          '3',
          'Çankaya',
          'Ankara',
          '06500',
          `${regFirstName} ${regLastName}`
        ),
      ],
      new Date()
    );

    let newAccount: Account;
    if (regType === 'INDIVIDUAL') {
      newAccount = new Individual(newUser);
    } else {
      newAccount = new Enterprise(
        newUser,
        regCompanyName || `${regLastName} Sanayi ve Ticaret A.Ş.`
      );
    }

    const added = accountManager.addAccount(newAccount);
    if (!added) {
      setLoginError('Bu e-posta adresine ait bir hesap zaten kayıtlı!');
      return;
    }

    setRegSuccess('Hesap başarıyla oluşturuldu ve TreeSet listesine eklendi!');
    setTimeout(() => {
      onSelectAccount(newAccount);
      onClose();
    }, 800);
  };

  const accounts = accountManager.getAccounts();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-lg w-full p-6 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Hesap Girişi & TreeSet Seçici
              </h3>
              <p className="text-[11px] text-slate-500">
                AccountManager.login() ve InvalidAuthenticationException
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-xl leading-none"
          >
            &times;
          </button>
        </div>

        {/* Hazır Hesaplar Kartları */}
        <div className="mt-4">
          <label className="text-xs font-semibold text-slate-700 block mb-2">
            Hızlı Giriş (Kayıtlı TreeSet Hesapları)
          </label>
          <div className="space-y-2">
            {accounts.map((acc) => (
              <button
                key={acc.user.email}
                onClick={() => {
                  try {
                    accountManager.login(acc.user.email, acc.user.passwordHash);
                    onSelectAccount(acc);
                    onClose();
                  } catch (err) {
                    console.error(err);
                  }
                }}
                className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50/40 transition-all flex items-center justify-between group"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 group-hover:text-indigo-950">
                      {acc.user.getFullName()}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-semibold ${
                        acc.accountType === 'INDIVIDUAL'
                          ? 'bg-blue-50 text-blue-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {acc.accountType === 'INDIVIDUAL' ? 'Bireysel (%20 Marj)' : 'Kurumsal (%8 Marj)'}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    {acc.user.email} · Şifre: {acc.user.passwordHash}
                  </div>
                </div>

                <span className="text-xs font-semibold text-indigo-600 group-hover:translate-x-0.5 transition-transform">
                  Giriş Yap &rarr;
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Seçimi: Manuel Giriş vs Yeni Hesap */}
        <div className="mt-5 pt-4 border-t border-slate-100">
          <div className="flex items-center gap-2 p-1 bg-slate-100 rounded-lg mb-4">
            <button
              onClick={() => {
                setActiveSubTab('LOGIN');
                setLoginError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'LOGIN'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Manuel Giriş (Test)
            </button>
            <button
              onClick={() => {
                setActiveSubTab('REGISTER');
                setLoginError(null);
              }}
              className={`flex-1 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                activeSubTab === 'REGISTER'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Yeni Müşteri Kaydı
            </button>
          </div>

          {activeSubTab === 'LOGIN' ? (
            <form onSubmit={handleManualLogin} className="space-y-3">
              <div>
                <label className="text-xs text-slate-600 block mb-1">E-Posta Adresi</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  placeholder="ahmet@gmail.com"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Şifre</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg focus:outline-hidden focus:border-indigo-600"
                  required
                />
              </div>

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                Giriş Yap (AccountManager.login)
              </button>
            </form>
          ) : (
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Ad</label>
                  <input
                    type="text"
                    value={regFirstName}
                    onChange={(e) => setRegFirstName(e.target.value)}
                    placeholder="Ali"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Soyad</label>
                  <input
                    type="text"
                    value={regLastName}
                    onChange={(e) => setRegLastName(e.target.value)}
                    placeholder="Demir"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">E-Posta</label>
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="ali@demir.com"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Şifre</label>
                  <input
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="12345"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Meslek</label>
                  <input
                    type="text"
                    value={regOccupation}
                    onChange={(e) => setRegOccupation(e.target.value)}
                    placeholder="Finans Uzmanı"
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Yaş</label>
                  <input
                    type="number"
                    value={regAge}
                    onChange={(e) => setRegAge(Number(e.target.value))}
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                    min="18"
                    max="99"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-600 block mb-1">Hesap Türü</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRegType('INDIVIDUAL')}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                      regType === 'INDIVIDUAL'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Bireysel (%20 Marj)
                  </button>
                  <button
                    type="button"
                    onClick={() => setRegType('ENTERPRISE')}
                    className={`py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                      regType === 'ENTERPRISE'
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-700'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    Kurumsal (%8 Marj)
                  </button>
                </div>
              </div>

              {regType === 'ENTERPRISE' && (
                <div>
                  <label className="text-xs text-slate-600 block mb-1">Şirket Ünvanı</label>
                  <input
                    type="text"
                    value={regCompanyName}
                    onChange={(e) => setRegCompanyName(e.target.value)}
                    placeholder="Demir Grup Lojistik A.Ş."
                    className="w-full text-xs px-3 py-2 border border-slate-200 rounded-lg"
                  />
                </div>
              )}

              {loginError && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <span>{loginError}</span>
                </div>
              )}

              {regSuccess && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{regSuccess}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
              >
                Hesabı Kaydet ve Oturum Aç
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
