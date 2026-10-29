import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Lock, Mail, ArrowRight, Shield, User as UserIcon, Eye } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login, setActivePage, quickSwitchRole } = useApp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Lütfen e-posta ve şifrenizi giriniz.');
      return;
    }

    if (!email.includes('@')) {
      setError('Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }

    setLoading(true);
    const result = login(email, password);
    setLoading(false);

    if (result.success) {
      setActivePage('furnitures');
    } else {
      setError(result.message);
    }
  };

  const handleQuickDemo = (role: 'admin' | 'member' | 'guest') => {
    if (role === 'guest') {
      quickSwitchRole('guest');
      setActivePage('furnitures');
      return;
    }
    quickSwitchRole(role);
    if (role === 'admin') {
      setActivePage('admin');
    } else {
      setActivePage('furnitures');
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Fikstür Üyelik Sistemi
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-display">
            Giriş Yap
          </h1>
          <p className="text-xs text-stone-500">
            SmartEdu mimarisinde kullanıcı kimlik doğrulama alanı
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="login-email" className="block font-semibold text-stone-700 mb-1">
              E-Posta Adresi
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@fikstur.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="login-password" className="block font-semibold text-stone-700 mb-1">
              Şifre
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{loading ? 'Giriş Yapılıyor...' : 'Oturum Aç'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Logins for reviewers */}
        <div className="pt-4 border-t border-stone-200 space-y-2">
          <p className="text-[11px] font-semibold text-stone-500 text-center uppercase tracking-wider">
            Hızlı Test / Demo Hesapları
          </p>
          <div className="grid grid-cols-1 gap-1.5 text-xs">
            <button
              onClick={() => handleQuickDemo('admin')}
              className="p-2 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Shield className="w-3.5 h-3.5 text-amber-700" />
                <span>Admin: Enes Öztürk</span>
              </div>
              <span className="text-[10px] text-amber-700 font-mono">admin@fikstur.com</span>
            </button>

            <button
              onClick={() => handleQuickDemo('member')}
              className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-800 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <UserIcon className="w-3.5 h-3.5 text-stone-600" />
                <span>Üye: Selin Yılmaz</span>
              </div>
              <span className="text-[10px] text-stone-500 font-mono">selin@fikstur.com</span>
            </button>

            <button
              onClick={() => handleQuickDemo('guest')}
              className="p-2 bg-stone-50 hover:bg-stone-100 border border-stone-200 text-stone-600 rounded-lg font-medium flex items-center justify-between transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 text-stone-500" />
                <span>Misafir Modu</span>
              </div>
              <span className="text-[10px] text-stone-400">Yalnızca Görüntüleme</span>
            </button>
          </div>
        </div>

        <div className="pt-2 text-center text-xs text-stone-500">
          Hesabınız yok mu?{' '}
          <button
            onClick={() => setActivePage('register')}
            className="text-stone-900 font-bold hover:underline cursor-pointer"
          >
            Buradan Kayıt Olun
          </button>
        </div>
      </div>
    </div>
  );
};
