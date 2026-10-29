import React, { useState } from 'react';
import { X, Check, Sparkles, RefreshCw } from 'lucide-react';
import { AVATARS, COLORS, generateRandomIdentity } from '../lib/avatars';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: {
    nickname: string;
    avatar: string;
    color: string;
  };
  onSaveProfile: (profile: { nickname: string; avatar: string; color: string }) => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile,
}) => {
  const [nickname, setNickname] = useState(currentProfile.nickname);
  const [avatar, setAvatar] = useState(currentProfile.avatar);
  const [color, setColor] = useState(currentProfile.color);

  if (!isOpen) return null;

  const handleRandomize = () => {
    const random = generateRandomIdentity();
    setNickname(random.nickname);
    setAvatar(random.avatar);
    setColor(random.color);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nickname.trim()) return;
    onSaveProfile({
      nickname: nickname.trim(),
      avatar,
      color,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-150">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-md shadow-2xl p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400" />
            <h3 className="font-bold text-sm text-slate-100">
              Anonim Kimliğini Özelleştir
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Avatar Preview & Randomizer */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg shrink-0"
              style={{
                backgroundColor: `${color}25`,
                borderColor: color,
                borderWidth: '2px',
              }}
            >
              {AVATARS.find((a) => a.id === avatar)?.emoji || '👻'}
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-xs font-semibold text-slate-200 block truncate">
                {nickname || 'Anonim Kullanıcı'}
              </span>
              <span className="text-[11px] text-slate-500">
                Tamamen şifreli ve anonim görünüm
              </span>
            </div>
            <button
              type="button"
              onClick={handleRandomize}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-indigo-400 transition"
              title="Rastgele Üret"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Nickname Input */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1 block">
              Anonim Takma Ad
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={24}
              placeholder="Takma adınızı yazın..."
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          {/* Avatar Selector */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Avatar Seçin
            </label>
            <div className="grid grid-cols-5 gap-2">
              {AVATARS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setAvatar(av.id)}
                  className={`p-2 rounded-xl text-xl flex items-center justify-center transition border ${
                    avatar === av.id
                      ? 'border-indigo-500 bg-indigo-950/60 shadow-sm'
                      : 'border-slate-800 hover:border-slate-700 bg-slate-950'
                  }`}
                  title={av.name}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Color Selector */}
          <div>
            <label className="text-xs font-medium text-slate-400 mb-1.5 block">
              Vurgu Rengi
            </label>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition border ${
                    color === c ? 'border-white scale-110' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: c }}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition"
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-xs font-medium bg-indigo-600 hover:bg-indigo-500 text-white shadow-md shadow-indigo-600/30 transition"
            >
              Kaydet ve Kullan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
