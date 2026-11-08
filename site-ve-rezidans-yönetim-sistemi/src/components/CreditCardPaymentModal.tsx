import React, { useState } from 'react';
import { FaturaAidat, Kullanici, Odeme, TestBankaKarti } from '../types';
import { KrediKartiBankaServisi } from '../services/paymentService';
import { TEST_BANKA_KARTLARI } from '../data/initialData';
import { X, CreditCard, ShieldCheck, AlertCircle, CheckCircle2, Lock, ArrowRight, RefreshCw, KeyRound } from 'lucide-react';

interface CreditCardPaymentModalProps {
  fatura: FaturaAidat;
  kullanici: Kullanici;
  onSuccess: (odeme: Odeme) => void;
  onClose: () => void;
}

export const CreditCardPaymentModal: React.FC<CreditCardPaymentModalProps> = ({
  fatura,
  kullanici,
  onSuccess,
  onClose,
}) => {
  const [kartSahibi, setKartSahibi] = useState(kullanici.adSoyad.toUpperCase());
  const [kartNo, setKartNo] = useState('');
  const [sktAy, setSktAy] = useState('12');
  const [sktYil, setSktYil] = useState('28');
  const [cvv, setCvv] = useState('321');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // 3D Secure State
  const [step3D, setStep3D] = useState(false);
  const [otpKod, setOtpKod] = useState('');
  const [pendingOdeme, setPendingOdeme] = useState<Odeme | null>(null);

  // Kart numarasını 4'er haneli formatlama
  const handleKartNoChange = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 16);
    const formatted = raw.replace(/(\d{4})/g, '$1 ').trim();
    setKartNo(formatted);
  };

  // Test kartı seçimi
  const handleSelectTestCard = (card: TestBankaKarti) => {
    setKartNo(card.kartNo);
    setKartSahibi(card.kartSahibi);
    setSktAy(card.sktAy);
    setSktYil(card.sktYil);
    setCvv(card.cvv);
    setErrorMessage(null);
  };

  const handleStartPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    try {
      const res = await KrediKartiBankaServisi.odemeYap({
        fatura,
        kullaniciAdi: kullanici.adSoyad,
        kartSahibi,
        kartNo,
        sktAy,
        sktYil,
        cvv,
      });

      setLoading(false);

      if (!res.basarili || !res.odeme) {
        setErrorMessage(res.hataMesaji || 'Ödeme banka tarafından reddedildi.');
        return;
      }

      // Banka limit/bakiye kontrolü başarılı -> 3D Secure Doğrulama adımına geç
      setPendingOdeme(res.odeme);
      setStep3D(true);
    } catch {
      setLoading(false);
      setErrorMessage('Banka servisine bağlanırken beklenmeyen bir hata oluştu.');
    }
  };

  const handleConfirm3D = (e: React.FormEvent) => {
    e.preventDefault();
    if (otpKod.trim() !== '123456' && otpKod.trim() !== '1234') {
      setErrorMessage('Hatalı SMS doğrulama kodu! Test onay kodu: 123456');
      return;
    }

    if (pendingOdeme) {
      onSuccess(pendingOdeme);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">256-Bit SSL Güvenli Kart Ödemesi</h3>
              <p className="text-xs text-slate-300">.NET WebAPI & MongoDB Banka Servisi</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Invoice Summary Banner */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-4 mb-5 flex items-center justify-between">
            <div>
              <span className="text-xs text-slate-500 block font-medium">Ödenecek Borç Detayı</span>
              <span className="text-sm font-bold text-slate-900">
                {fatura.donemAy} · {fatura.tur} Bedeli
              </span>
              <span className="text-xs text-slate-400 block mt-0.5">
                Son Ödeme: {fatura.sonOdemeTarihi}
              </span>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block font-medium">Toplam Tutar</span>
              <span className="text-2xl font-extrabold text-indigo-600 font-mono">
                {fatura.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
          </div>

          {!step3D ? (
            <div>
              {/* Virtual Credit Card Visual */}
              <div className="w-full h-44 rounded-2xl bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 text-white p-5 shadow-lg relative overflow-hidden mb-5 border border-slate-700">
                <div className="absolute top-0 right-0 -mr-8 -mt-8 w-40 h-40 bg-indigo-500/10 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-6 rounded-sm bg-amber-400/80 border border-amber-300 flex items-center justify-center">
                      <div className="w-4 h-3 border border-amber-600/60 rounded-xs" />
                    </div>
                    <span className="text-xs font-mono tracking-widest text-slate-400 uppercase">Debit / Credit</span>
                  </div>
                  <span className="text-xs font-bold tracking-wider text-slate-300">GÜNEŞTEPE SİTESİ</span>
                </div>

                <div className="mt-5">
                  <span className="font-mono text-xl tracking-wider block font-semibold text-slate-100">
                    {kartNo || '•••• •••• •••• ••••'}
                  </span>
                </div>

                <div className="flex items-end justify-between mt-4">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Kart Sahibi</span>
                    <span className="font-mono text-xs font-medium text-slate-200 tracking-wide uppercase">
                      {kartSahibi || 'AD SOYAD'}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">SKT</span>
                    <span className="font-mono text-xs font-medium text-slate-200">
                      {sktAy || 'MM'}/{sktYil || 'YY'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Test Cards Selector */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs font-semibold text-slate-600">Hızlı Test Banka Kartları (MongoDB Simülasyonu):</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {TEST_BANKA_KARTLARI.map((c, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectTestCard(c)}
                      className="text-left p-2 rounded-lg border border-slate-200 hover:border-indigo-400 bg-white hover:bg-indigo-50/50 transition-colors text-xs"
                    >
                      <div className="flex items-center justify-between font-semibold text-slate-800">
                        <span>{c.bankaAdi}</span>
                        <span className={`text-[10px] ${c.bakiye < fatura.tutar ? 'text-rose-600' : 'text-emerald-600'}`}>
                          {c.bakiye.toLocaleString('tr-TR')} ₺ Bakiye
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono block mt-0.5 truncate">
                        {c.kartNo}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="mb-4 p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold">İşlem Gerçekleştirilemedi</p>
                    <p>{errorMessage}</p>
                  </div>
                </div>
              )}

              {/* Payment Form */}
              <form onSubmit={handleStartPayment} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Kart Üzerindeki Ad Soyad
                  </label>
                  <input
                    type="text"
                    required
                    value={kartSahibi}
                    onChange={(e) => setKartSahibi(e.target.value.toUpperCase())}
                    placeholder="AHMET YILMAZ"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 uppercase"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    16 Haneli Kart Numarası
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={kartNo}
                      onChange={(e) => handleKartNoChange(e.target.value)}
                      placeholder="4543 1234 5678 4112"
                      className="w-full px-3 py-2 pl-9 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <CreditCard className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Son Ay</label>
                    <select
                      value={sktAy}
                      onChange={(e) => setSktAy(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    >
                      {Array.from({ length: 12 }, (_, i) => String(i + 1).padStart(2, '0')).map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Son Yıl</label>
                    <select
                      value={sktYil}
                      onChange={(e) => setSktYil(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
                    >
                      {['26', '27', '28', '29', '30', '31'].map((y) => (
                        <option key={y} value={y}>20{y}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">CVV Kodu</label>
                    <input
                      type="text"
                      maxLength={4}
                      required
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      placeholder="321"
                      className="w-full px-3 py-2 text-xs font-mono border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
                    />
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-slate-500 text-[11px]">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span>MongoDB Banka API & 3D Secure</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                    >
                      İptal
                    </button>
                    <button
                      type="submit"
                      disabled={loading || !kartNo || kartNo.length < 15}
                      className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg transition-colors shadow-xs"
                    >
                      {loading ? (
                        <>
                          <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                          <span>Banka Kontrol Ediliyor...</span>
                        </>
                      ) : (
                        <>
                          <span>3D Secure ile Öde</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            /* 3D Secure Verification Step */
            <div className="space-y-4">
              <div className="p-4 bg-indigo-50 border border-indigo-200 rounded-xl text-center">
                <KeyRound className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-slate-900">Banka 3D Secure Doğrulama</h4>
                <p className="text-xs text-slate-600 mt-1 max-w-sm mx-auto">
                  {kullanici.telefon} numaralı cep telefonunuza gönderilen 6 haneli tek kullanımlık SMS onay şifresini giriniz.
                </p>
                <div className="mt-2 inline-block px-2.5 py-1 bg-white border border-indigo-200 rounded-md text-[11px] font-mono text-indigo-700 font-semibold">
                  Test SMS Kodu: 123456
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <form onSubmit={handleConfirm3D} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1 text-center">
                    SMS Onay Kodu
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    required
                    value={otpKod}
                    onChange={(e) => setOtpKod(e.target.value.replace(/\D/g, ''))}
                    placeholder="123456"
                    className="w-48 mx-auto block px-4 py-2.5 text-center font-mono text-lg tracking-widest font-bold border-2 border-indigo-500 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setStep3D(false);
                      setOtpKod('');
                      setErrorMessage(null);
                    }}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    Geri Dön
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setOtpKod('123456');
                      if (pendingOdeme) onSuccess(pendingOdeme);
                    }}
                    className="px-4 py-2 text-xs font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 rounded-lg border border-indigo-200 transition-colors"
                  >
                    Hızlı Onayla (123456)
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Ödemeyi Tamamla</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
