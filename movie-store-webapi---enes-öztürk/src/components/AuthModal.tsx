/**
 * Authentication Modal: Customer Login & Register
 * Author: Enes Öztürk
 */

import React, { useState } from 'react';
import { X, Lock, Mail, User, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../api/client.ts';
import { CustomerAuthSession, GenreDto } from '../types.ts';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (session: CustomerAuthSession) => void;
  genres: GenreDto[];
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  genres,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('secret123');
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        const session = await api.login({ email, password });
        onSuccess(session);
        onClose();
      } else {
        const session = await api.register({
          firstName,
          lastName,
          email,
          password,
          favoriteGenreIds: selectedGenres,
        });
        onSuccess(session);
        onClose();
      }
    } catch (err: any) {
      setError(err.message || 'Giriş yapılamadı.');
    } finally {
      setLoading(false);
    }
  };

  const toggleGenre = (genreId: number) => {
    setSelectedGenres(prev =>
      prev.includes(genreId) ? prev.filter(id => id !== genreId) : [...prev, genreId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Lock className="w-5 h-5 text-rose-500" />
              {mode === 'login' ? 'Müşteri Girişi' : 'Yeni Müşteri Kaydı'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Film satın almak için Müşteri (Customer) hesabı gereklidir.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-800 bg-slate-950/40">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
              mode === 'login'
                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Giriş Yap
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(null); }}
            className={`flex-1 py-2.5 text-xs font-semibold text-center transition-colors ${
              mode === 'register'
                ? 'text-rose-400 border-b-2 border-rose-500 bg-slate-900/50'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Hesap Oluştur
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <div>{error}</div>
            </div>
          )}

          {mode === 'register' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Ad *</label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    placeholder="Adınız"
                    className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Soyad *</label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Soyadınız"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">E-Posta Adresi *</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="ornek@moviestore.com"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Şifre *</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="En az 6 karakter"
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-rose-500 transition-colors"
              />
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Favori Film Türleri (İsteğe Bağlı)
              </label>
              <div className="flex flex-wrap gap-1.5 max-h-28 overflow-y-auto p-1 bg-slate-950/40 rounded-lg border border-slate-800/80">
                {genres.map(g => {
                  const isSelected = selectedGenres.includes(g.id);
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => toggleGenre(g.id)}
                      className={`px-2.5 py-1 text-[11px] rounded-md transition-colors flex items-center gap-1 ${
                        isSelected
                          ? 'bg-rose-600 text-white font-medium'
                          : 'bg-slate-800/70 text-slate-400 hover:text-slate-200'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3 h-3" />}
                      {g.name}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-indigo-600 hover:from-rose-500 hover:to-indigo-500 text-white font-semibold text-xs transition-all shadow-lg shadow-rose-600/20 disabled:opacity-50"
          >
            {loading ? 'İşleniyor...' : mode === 'login' ? 'Giriş Yap' : 'Kayıt Ol ve Oturum Aç'}
          </button>

          {/* Quick Demo Login shortcuts */}
          {mode === 'login' && (
            <div className="pt-2 border-t border-slate-800/80">
              <p className="text-[11px] text-slate-400 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Hızlı Test Girişi (Hazır Tohum Hesaplar):
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('enes@moviestore.com')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-rose-300 border border-slate-700"
                >
                  👤 Enes Öztürk (Geliştirici)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('ahmet@example.com')}
                  className="px-2.5 py-1 text-[11px] rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700"
                >
                  Ahmet Yılmaz
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};
