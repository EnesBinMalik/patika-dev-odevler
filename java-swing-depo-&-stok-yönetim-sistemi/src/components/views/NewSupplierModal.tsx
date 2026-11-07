import React, { useState } from 'react';
import { Supplier, SwingTheme } from '../../types/warehouse';
import { Building, X, AlertCircle } from 'lucide-react';

interface NewSupplierModalProps {
  isOpen: boolean;
  theme: SwingTheme;
  onClose: () => void;
  onSubmit: (supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export const NewSupplierModal: React.FC<NewSupplierModalProps> = ({
  isOpen,
  theme,
  onClose,
  onSubmit,
}) => {
  const [code, setCode] = useState<string>(`TED-00${Math.floor(5 + Math.random() * 5)}`);
  const [name, setName] = useState<string>('');
  const [contactPerson, setContactPerson] = useState<string>('');
  const [phone, setPhone] = useState<string>('+90 ');
  const [email, setEmail] = useState<string>('');
  const [city, setCity] = useState<string>('İstanbul');
  const [category, setCategory] = useState<string>('Endüstriyel Parça & Otomasyon');
  const [leadTimeDays, setLeadTimeDays] = useState<number>(3);
  const [reliabilityScore, setReliabilityScore] = useState<number>(95);
  const [taxNumber, setTaxNumber] = useState<string>('1234567890');
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const isDark = theme === 'darcula';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !contactPerson.trim()) {
      setError('Lütfen Firma Adı ve İletişim Yetkilisini giriniz.');
      return;
    }

    onSubmit({
      code,
      name: name.trim(),
      contactPerson: contactPerson.trim(),
      phone,
      email: email || `${name.toLowerCase().replace(/[^a-z]/g, '')}@tedarik.com`,
      city,
      category,
      leadTimeDays,
      reliabilityScore,
      taxNumber,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div
        role="dialog"
        className={`w-full max-w-lg shadow-2xl rounded-xs overflow-hidden ${
          isDark
            ? 'bg-[#3c3f41] border border-[#555] text-[#bbb]'
            : 'bg-[#e7eaf0] border border-[#a0a8b5] text-[#2c3e50]'
        }`}
      >
        <div
          className={`flex items-center justify-between px-3 py-1.5 text-xs font-semibold select-none ${
            isDark ? 'bg-[#2b2b2b] text-slate-100 border-b border-[#444]' : 'bg-gradient-to-r from-[#2f5597] to-[#1e3b6d] text-white'
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Building className="w-3.5 h-3.5 text-amber-400" />
            <span>JDialog: Yeni Tedarikçi Firma Tanımla (Supplier Model)</span>
          </div>
          <button onClick={onClose} className="p-0.5 rounded hover:bg-red-600 hover:text-white transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-3 text-xs">
          {error && (
            <div className="p-2 rounded bg-red-950/80 border border-red-700 text-red-300 font-mono text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Tedarikçi Kodu:</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-mono font-bold outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Şehir / Merkez:</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={`w-full p-1.5 rounded-xs outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          <div>
            <label className="block font-medium mb-1">Firma / Şirket Ünvanı:</label>
            <input
              type="text"
              placeholder="Örn: Vestel Elektronik Sanayi A.Ş."
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`w-full p-1.5 rounded-xs outline-hidden border ${
                isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
              }`}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">İletişim Yetkilisi:</label>
              <input
                type="text"
                placeholder="Örn: Selin Kaya"
                value={contactPerson}
                onChange={(e) => setContactPerson(e.target.value)}
                className={`w-full p-1.5 rounded-xs outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Telefon:</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1">Ortalama Tedarik Süresi (Gün):</label>
              <input
                type="number"
                min="1"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(parseInt(e.target.value) || 3)}
                className={`w-full p-1.5 rounded-xs font-mono outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>

            <div>
              <label className="block font-medium mb-1">Güvenilirlik Puanı (%):</label>
              <input
                type="number"
                min="50"
                max="100"
                value={reliabilityScore}
                onChange={(e) => setReliabilityScore(parseInt(e.target.value) || 95)}
                className={`w-full p-1.5 rounded-xs font-mono text-emerald-400 font-bold outline-hidden border ${
                  isDark ? 'bg-[#2b2b2b] border-[#555] text-white' : 'bg-white border-[#888] text-black'
                }`}
                required
              />
            </div>
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-700/50">
            <button
              type="button"
              onClick={onClose}
              className={`px-4 py-1.5 rounded-xs text-xs font-medium transition-colors ${
                isDark ? 'bg-[#4e5254] hover:bg-[#5e6264] text-white' : 'bg-slate-200 hover:bg-slate-300 text-black'
              }`}
            >
              İptal
            </button>
            <button
              type="submit"
              className="px-5 py-1.5 rounded-xs text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white transition-all shadow-xs"
            >
              Tedarikçiyi Kaydet
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
