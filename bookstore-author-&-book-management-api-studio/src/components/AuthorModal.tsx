import React, { useState, useEffect } from 'react';
import { X, UserPlus, Save, AlertCircle, CheckCircle2, Calendar, ShieldCheck } from 'lucide-react';
import { CreateAuthorModel, UpdateAuthorModel, Author } from '../types';
import { CreateAuthorCommandValidator, UpdateAuthorCommandValidator } from '../validations/authorValidators';

interface AuthorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (model: CreateAuthorModel) => { success: boolean; message?: string };
  initialAuthor?: Author | null;
  mode: 'create' | 'edit';
}

export const AuthorModal: React.FC<AuthorModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialAuthor,
  mode,
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [serverError, setServerError] = useState<string | null>(null);
  const [hasInteracted, setHasInteracted] = useState(false);

  useEffect(() => {
    if (initialAuthor && mode === 'edit') {
      setFirstName(initialAuthor.firstName);
      setLastName(initialAuthor.lastName);
      setBirthDate(initialAuthor.birthDate);
    } else {
      setFirstName('');
      setLastName('');
      setBirthDate('');
    }
    setServerError(null);
    setHasInteracted(false);
  }, [initialAuthor, mode, isOpen]);

  if (!isOpen) return null;

  const currentModel: CreateAuthorModel = {
    firstName,
    lastName,
    birthDate,
  };

  const validation =
    mode === 'edit' && initialAuthor
      ? UpdateAuthorCommandValidator.validate(initialAuthor.id, currentModel as UpdateAuthorModel)
      : CreateAuthorCommandValidator.validate(currentModel);

  const getFieldError = (fieldName: string) => {
    return validation.errors.find((e) => e.propertyName === fieldName)?.errorMessage;
  };

  const firstNameError = hasInteracted ? getFieldError('FirstName') : undefined;
  const lastNameError = hasInteracted ? getFieldError('LastName') : undefined;
  const birthDateError = hasInteracted ? getFieldError('BirthDate') : undefined;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasInteracted(true);

    if (!validation.isValid) {
      setServerError('Lütfen FluentValidation kurallarına uygun veriler giriniz.');
      return;
    }

    const result = onSubmit({
      firstName,
      lastName,
      birthDate,
    });

    if (result.success) {
      onClose();
    } else {
      setServerError(result.message || 'Yazar kaydedilirken bir hata oluştu.');
    }
  };

  // Preset example clicker for quick testing
  const applyPreset = (fName: string, lName: string, bDate: string) => {
    setFirstName(fName);
    setLastName(lName);
    setBirthDate(bDate);
    setHasInteracted(true);
    setServerError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-slate-900 to-indigo-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
              {mode === 'create' ? (
                <UserPlus className="w-4 h-4 text-indigo-300" />
              ) : (
                <Save className="w-4 h-4 text-indigo-300" />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-base">
                {mode === 'create' ? 'Yeni Yazar Ekle (POST /api/author)' : 'Yazar Güncelle (PUT /api/author/{id})'}
              </h3>
              <p className="text-xs text-indigo-200">
                DTO: {mode === 'create' ? 'CreateAuthorModel' : 'UpdateAuthorModel'} &bull; AutoMapper &bull; FluentValidation
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Quick presets for testing */}
          {mode === 'create' && (
            <div className="p-2.5 rounded-lg bg-indigo-50/60 border border-indigo-100 text-xs">
              <span className="font-semibold text-indigo-950 block mb-1">
                Hızlı Test İçin Örnek Yazar Yükle:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => applyPreset('Oğuz', 'Atay', '1934-10-12')}
                  className="px-2 py-1 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded text-indigo-800 text-[11px] font-medium transition cursor-pointer"
                >
                  Oğuz Atay
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Cahit', 'Sıtkı Tarancı', '1910-10-04')}
                  className="px-2 py-1 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded text-indigo-800 text-[11px] font-medium transition cursor-pointer"
                >
                  Cahit Sıtkı Tarancı
                </button>
                <button
                  type="button"
                  onClick={() => applyPreset('Zülfü', 'Livaneli', '1946-06-20')}
                  className="px-2 py-1 bg-white hover:bg-indigo-100/70 border border-indigo-200 rounded text-indigo-800 text-[11px] font-medium transition cursor-pointer"
                >
                  Zülfü Livaneli
                </button>
              </div>
            </div>
          )}

          {serverError && (
            <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">Hata Mesajı:</p>
                <p>{serverError}</p>
              </div>
            </div>
          )}

          {/* Ad (FirstName) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Ad (FirstName) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Min 2, Max 50 karakter</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={firstName}
                onChange={(e) => {
                  setFirstName(e.target.value);
                  setHasInteracted(true);
                  setServerError(null);
                }}
                placeholder="Örn: Sabahattin"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                  firstNameError
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : firstName.trim().length >= 2
                    ? 'border-emerald-300 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-200'
                }`}
              />
              {firstName.trim().length >= 2 && !firstNameError && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-2.5" />
              )}
            </div>
            {firstNameError && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {firstNameError}
              </p>
            )}
          </div>

          {/* Soyad (LastName) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Soyad (LastName) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Min 2, Max 50 karakter</span>
            </div>
            <div className="relative">
              <input
                type="text"
                value={lastName}
                onChange={(e) => {
                  setLastName(e.target.value);
                  setHasInteracted(true);
                  setServerError(null);
                }}
                placeholder="Örn: Ali"
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                  lastNameError
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : lastName.trim().length >= 2
                    ? 'border-emerald-300 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-200'
                }`}
              />
              {lastName.trim().length >= 2 && !lastNameError && (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 absolute right-3 top-2.5" />
              )}
            </div>
            {lastNameError && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {lastNameError}
              </p>
            )}
          </div>

          {/* Doğum Tarihi (BirthDate) */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-700">
                Doğum Tarihi (BirthDate) <span className="text-rose-500">*</span>
              </label>
              <span className="text-[11px] text-slate-400 font-mono">Geçmiş tarih olmalı (&lt; Bugün)</span>
            </div>
            <div className="relative">
              <input
                type="date"
                value={birthDate}
                max={new Date().toISOString().split('T')[0]}
                onChange={(e) => {
                  setBirthDate(e.target.value);
                  setHasInteracted(true);
                  setServerError(null);
                }}
                className={`w-full px-3.5 py-2 text-sm rounded-lg border focus:outline-none focus:ring-2 transition ${
                  birthDateError
                    ? 'border-rose-400 focus:ring-rose-200 bg-rose-50/20'
                    : birthDate
                    ? 'border-emerald-300 focus:ring-emerald-200'
                    : 'border-slate-300 focus:ring-indigo-200'
                }`}
              />
              <Calendar className="w-4 h-4 text-slate-400 absolute right-3 top-2.5 pointer-events-none" />
            </div>
            {birthDateError && (
              <p className="text-[11px] text-rose-600 mt-1 flex items-center gap-1 font-medium">
                <AlertCircle className="w-3 h-3" /> {birthDateError}
              </p>
            )}
          </div>

          {/* FluentValidation Status Box */}
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck
                className={`w-4 h-4 ${validation.isValid ? 'text-emerald-600' : 'text-amber-500'}`}
              />
              <span className="font-medium text-slate-700">FluentValidation Durumu:</span>
            </div>
            <span
              className={`font-semibold px-2 py-0.5 rounded text-[11px] ${
                validation.isValid
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-amber-100 text-amber-800'
              }`}
            >
              {validation.isValid ? 'Kurallar Sağlandı' : `${validation.errors.length} Kural Bekleniyor`}
            </span>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition cursor-pointer"
            >
              İptal
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-2 px-5 py-2 text-xs sm:text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-600/30 transition cursor-pointer"
            >
              {mode === 'create' ? <UserPlus className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {mode === 'create' ? 'Yazarı Kaydet (POST)' : 'Değişiklikleri Güncelle (PUT)'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
