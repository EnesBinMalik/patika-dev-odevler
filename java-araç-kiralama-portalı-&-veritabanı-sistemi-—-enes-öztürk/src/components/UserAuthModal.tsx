import React, { useState } from 'react';
import { User } from '../types/rental';
import { dbService } from '../services/storage';
import { CITIES } from '../data/initialData';
import { X, UserPlus, LogIn, Check } from 'lucide-react';

interface UserAuthModalProps {
  currentUser: User;
  onClose: () => void;
  onUserChanged: (user: User) => void;
}

export const UserAuthModal: React.FC<UserAuthModalProps> = ({
  currentUser,
  onClose,
  onUserChanged,
}) => {
  const [tab, setTab] = useState<'register' | 'switch'>('register');
  const allUsers = dbService.getUsers();

  // Registration Form
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [driverLicenseNo, setDriverLicenseNo] = useState('');
  const [licenseYear, setLicenseYear] = useState(2020);
  const [city, setCity] = useState(CITIES[0]);
  const [error, setError] = useState<string | null>(null);

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!fullName || !email || !phone || !tcNo || !driverLicenseNo) {
      setError('Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    try {
      const user = dbService.registerUser({
        fullName,
        email,
        phone,
        tcNo,
        driverLicenseNo,
        licenseYear: Number(licenseYear),
        city,
      });

      onUserChanged(user);
      onClose();
    } catch (err: unknown) {
      setError('Kullanıcı kaydedilirken bir hata oluştu.');
    }
  };

  const handleSwitchUser = (userId: string) => {
    dbService.setCurrentUser(userId);
    const user = dbService.getCurrentUser();
    onUserChanged(user);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Kullanıcı Hesabı & Kayıt
            </h3>
            <p className="text-xs text-slate-500">
              Aktif: <strong className="text-slate-800 dark:text-slate-200">{currentUser.fullName}</strong>
            </p>
          </div>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 dark:border-slate-800">
          <button
            onClick={() => setTab('register')}
            className={`flex-1 py-3 text-xs font-semibold text-center transition ${
              tab === 'register'
                ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Yeni Kullanıcı Kaydı
          </button>
          <button
            onClick={() => setTab('switch')}
            className={`flex-1 py-3 text-xs font-semibold text-center transition ${
              tab === 'switch'
                ? 'border-b-2 border-slate-900 dark:border-white text-slate-900 dark:text-white'
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            Kullanıcı Değiştir ({allUsers.length})
          </button>
        </div>

        <div className="p-6">
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              {error && (
                <div className="p-2.5 bg-red-50 text-red-700 text-xs rounded-lg">{error}</div>
              )}

              <div>
                <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Ad Soyad
                </label>
                <input
                  type="text"
                  required
                  placeholder="Örn: Enes Öztürk"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    E-Posta
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="ornek@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Telefon
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="+90 532 ..."
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    T.C. Kimlik No
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={11}
                    placeholder="11 haneli T.C."
                    value={tcNo}
                    onChange={(e) => setTcNo(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ehliyet No
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="TR-..."
                    value={driverLicenseNo}
                    onChange={(e) => setDriverLicenseNo(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Bulunduğu Şehir
                  </label>
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white"
                  >
                    {CITIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Ehliyet Alış Yılı
                  </label>
                  <input
                    type="number"
                    min={1980}
                    max={2026}
                    value={licenseYear}
                    onChange={(e) => setLicenseYear(Number(e.target.value))}
                    className="w-full h-9 px-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-900 dark:text-white font-mono"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-2 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-white rounded-lg text-xs font-bold transition"
              >
                Kullanıcı Kaydını Tamamla
              </button>
            </form>
          )}

          {tab === 'switch' && (
            <div className="space-y-2">
              <p className="text-xs text-slate-500 mb-3">
                Sistemde kayıtlı kullanıcı profillerinden birini aktif profil olarak seçebilirsiniz:
              </p>
              {allUsers.map((u) => {
                const isSelected = u.id === currentUser.id;
                return (
                  <button
                    key={u.id}
                    onClick={() => handleSwitchUser(u.id)}
                    className={`w-full p-3 rounded-lg border text-left flex items-center justify-between transition cursor-pointer ${
                      isSelected
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-slate-800/80'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {u.fullName}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {u.email} · {u.city}
                      </div>
                    </div>
                    {isSelected && <Check className="w-4 h-4 text-emerald-600" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
