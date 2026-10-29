import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';
import { User, Mail, Lock, Phone, MapPin, ArrowRight, ShieldCheck } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register, setActivePage } = useApp();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>('member');
  const [adminSecretKey, setAdminSecretKey] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validations
    if (!name.trim()) {
      setError('Lütfen adınızı ve soyadınızı belirtiniz.');
      return;
    }
    if (!email.trim() || !email.includes('@') || !email.includes('.')) {
      setError('Lütfen geçerli bir e-posta adresi yazınız.');
      return;
    }
    if (password.length < 6) {
      setError('Şifreniz en az 6 karakter olmalıdır.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Girdiğiniz şifreler birbiriyle eşleşmiyor.');
      return;
    }

    if (role === 'admin' && adminSecretKey.trim() !== 'fikstur2025' && adminSecretKey.trim() !== 'admin') {
      setError('Geçersiz Yönetici Yetki Anahtarı. Normal üyelik için "Üye (Rezervasyon Yetkili)" seçiniz veya demo anahtarı "fikstur2025" giriniz.');
      return;
    }

    setLoading(true);
    const result = register(name, email, password, phone, city, role);
    setLoading(false);

    if (result.success) {
      if (role === 'admin') {
        setActivePage('admin');
      } else {
        setActivePage('furnitures');
      }
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="bg-white p-8 rounded-2xl border border-stone-200 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800">
            Fikstür Üyelik Formu
          </span>
          <h1 className="text-2xl font-bold text-stone-900 font-display">
            Yeni Hesap Oluştur
          </h1>
          <p className="text-xs text-stone-500">
            Mobilya rezervasyonları ve özel mimari talepler için kaydolun
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label htmlFor="reg-name" className="block font-semibold text-stone-700 mb-1">
              Ad Soyad *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Örn: Mimar Selin Kaya"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>

          <div>
            <label htmlFor="reg-email" className="block font-semibold text-stone-700 mb-1">
              E-Posta Adresi *
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="reg-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ornek@alanadi.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-phone" className="block font-semibold text-stone-700 mb-1">
                Telefon
              </label>
              <div className="relative">
                <Phone className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-phone"
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="05XX XXX XX XX"
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-city" className="block font-semibold text-stone-700 mb-1">
                Şehir
              </label>
              <div className="relative">
                <MapPin className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-city"
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="İstanbul, TR"
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="reg-password" className="block font-semibold text-stone-700 mb-1">
                Şifre * (En az 6 hane)
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="reg-confirm-password" className="block font-semibold text-stone-700 mb-1">
                Şifre Tekrarı *
              </label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  id="reg-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-2.5 py-2.5 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-stone-900"
                  required
                />
              </div>
            </div>
          </div>

          {/* Role Selection (SmartEdu logic: Member vs Admin) */}
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 space-y-2">
            <span className="block font-semibold text-stone-700 text-xs">Hesap Türü Seçimi:</span>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="member"
                  checked={role === 'member'}
                  onChange={() => setRole('member')}
                  className="accent-stone-900"
                />
                <span className="font-medium text-stone-800">Üye (Rezervasyon Yetkili)</span>
              </label>

              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="accent-stone-900"
                />
                <span className="font-medium text-amber-900">Yönetici (Admin)</span>
              </label>
            </div>

            {role === 'admin' && (
              <div className="pt-2 animate-in fade-in duration-150">
                <label htmlFor="admin-key" className="block text-[11px] font-semibold text-stone-600 mb-1">
                  Yönetici Güvenlik Anahtarı (Demo: <code className="text-amber-800 font-bold">fikstur2025</code>)
                </label>
                <input
                  id="admin-key"
                  type="password"
                  value={adminSecretKey}
                  onChange={(e) => setAdminSecretKey(e.target.value)}
                  placeholder="fikstur2025"
                  className="w-full p-2 text-xs rounded-lg border border-amber-300 bg-amber-50/50 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 font-semibold text-white bg-stone-900 rounded-lg hover:bg-stone-800 transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{loading ? 'Kayıt Yapılıyor...' : 'Kaydı Tamamla ve Giriş Yap'}</span>
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-stone-500">
          Zaten üye misiniz?{' '}
          <button
            onClick={() => setActivePage('login')}
            className="text-stone-900 font-bold hover:underline cursor-pointer"
          >
            Buradan Giriş Yapın
          </button>
        </div>
      </div>
    </div>
  );
};
