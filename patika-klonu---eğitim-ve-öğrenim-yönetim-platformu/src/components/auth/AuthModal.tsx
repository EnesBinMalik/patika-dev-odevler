import React, { useState } from 'react';
import { UserCheck, LogIn, UserPlus, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultTab = 'login',
}) => {
  const { users, loginAsUser, loginWithEmail, registerStudent } = useApp();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);

  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state (STUDENTS ONLY)
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regFeedback, setRegFeedback] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null
  );

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!loginEmail.trim()) {
      setLoginError('Lütfen e-posta adresinizi giriniz.');
      return;
    }
    const success = loginWithEmail(loginEmail);
    if (success) {
      onClose();
    } else {
      setLoginError('Bu e-posta adresine ait kullanıcı bulunamadı. Lütfen kontrol ediniz.');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setRegFeedback(null);
    const res = registerStudent(regName, regEmail);
    if (res.success) {
      setRegFeedback({ type: 'success', text: res.message });
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      setRegFeedback({ type: 'error', text: res.message });
    }
  };

  const handleQuickLogin = (userId: string) => {
    loginAsUser(userId);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Patika.dev Platformuna Giriş & Kayıt"
      subtitle="ENES ÖZTÜRK İmzalı Rol Bazlı Eğitim Sistemi"
      maxWidth="lg"
    >
      <div className="space-y-6">
        {/* Quick Demo Accounts Banner for Easy Evaluation */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Hızlı Rol Test Hesapları (1 Tıkla Giriş)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {users.map((u) => {
              const roleColors = {
                operator: 'border-amber-500/40 hover:bg-amber-500/10 text-amber-300',
                instructor: 'border-sky-500/40 hover:bg-sky-500/10 text-sky-300',
                student: 'border-emerald-500/40 hover:bg-emerald-500/10 text-emerald-300',
              }[u.role];

              const roleLabel = {
                operator: 'Operatör (Enes Öztürk)',
                instructor: 'Eğitmen',
                student: 'Öğrenci',
              }[u.role];

              return (
                <button
                  key={u.id}
                  onClick={() => handleQuickLogin(u.id)}
                  className={`flex items-center gap-2.5 p-2 rounded-lg border bg-slate-900/60 transition-colors text-left ${roleColors}`}
                >
                  <img
                    src={u.avatar}
                    alt={u.name}
                    className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-100 truncate">{u.name}</p>
                    <p className="text-[10px] text-slate-400 truncate">{roleLabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-1 p-1 bg-slate-950 rounded-lg border border-slate-800">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'login'
                ? 'bg-slate-800 text-white font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            Giriş Yap
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-xs font-medium rounded-md transition-colors ${
              activeTab === 'register'
                ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            Öğrenci Kayıt Ol
          </button>
        </div>

        {/* Tab: LOGIN */}
        {activeTab === 'login' && (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                E-posta Adresi
              </label>
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="Örn: enes@patika.dev veya mustafa@patika.dev"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {loginError && (
              <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-800/50 flex items-center gap-2 text-xs text-rose-300">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Sisteme Giriş Yap
            </button>
          </form>
        )}

        {/* Tab: STUDENT REGISTRATION (ONLY STUDENTS ALLOWED) */}
        {activeTab === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            {/* System Restriction Notice */}
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-start gap-2.5 text-xs text-amber-200 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <strong>Yetki Kuralı:</strong> Bu form üzerinden yalnızca <u>Öğrenciler</u> sisteme kayıt olabilir. Eğitmenler sadece Operatörler tarafından atanır, Operatörler ise yazılımcı (Enes Öztürk) tarafından eklenir.
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Ad Soyad
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="Örn: Mehmet Demir"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Öğrenci E-posta Adresi
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="Örn: mehmet@gmail.com"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-lg text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
              />
            </div>

            {regFeedback && (
              <div
                className={`p-3 rounded-lg border text-xs flex items-center gap-2 ${
                  regFeedback.type === 'success'
                    ? 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                    : 'bg-rose-950/40 border-rose-800/60 text-rose-300'
                }`}
              >
                <span>{regFeedback.text}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Öğrenci Hesabı Oluştur ve Giriş Yap
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
