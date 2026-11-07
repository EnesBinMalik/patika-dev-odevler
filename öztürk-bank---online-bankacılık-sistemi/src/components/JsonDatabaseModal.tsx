import React, { useState } from 'react';
import {
  X,
  FileCode2,
  Download,
  Upload,
  RotateCcw,
  Check,
  Copy,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Banka } from '../models/Banka';
import { BankStorageService } from '../services/BankStorageService';

interface JsonDatabaseModalProps {
  banka: Banka;
  onKapat: () => void;
  onBankaGuncellendi: (yeniBanka: Banka) => void;
}

export const JsonDatabaseModal: React.FC<JsonDatabaseModalProps> = ({
  banka,
  onKapat,
  onBankaGuncellendi,
}) => {
  const [jsonMetni, setJsonMetni] = useState<string>(
    BankStorageService.getRawJSONString(banka)
  );
  const [kopyalandi, setKopyalandi] = useState(false);
  const [hata, setHata] = useState('');
  const [basari, setBasari] = useState('');

  const handleKopyala = () => {
    navigator.clipboard.writeText(jsonMetni);
    setKopyalandi(true);
    setTimeout(() => setKopyalandi(false), 2000);
  };

  const handleIndir = () => {
    const blob = new Blob([jsonMetni], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ozturk_bank_data_${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleJsonKaydet = () => {
    setHata('');
    setBasari('');
    try {
      const guncelBanka = BankStorageService.importFromJSONString(jsonMetni);
      onBankaGuncellendi(guncelBanka);
      setBasari('JSON verisi başarıyla doğrulandı ve sisteme uygulandı!');
    } catch (err: any) {
      setHata(err.message || 'Geçersiz JSON formatı.');
    }
  };

  const handleSifirla = () => {
    if (
      window.confirm(
        'Tüm banka verileri varsayılan başlangıç JSON haline döndürülecek. Emin misiniz?'
      )
    ) {
      const resetBanka = BankStorageService.resetToInitial();
      setJsonMetni(BankStorageService.getRawJSONString(resetBanka));
      onBankaGuncellendi(resetBanka);
      setBasari('Banka verileri varsayılan JSON haline sıfırlandı.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl text-slate-100 max-h-[92vh] flex flex-col">
        {/* Başlık ve Kapat */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-600/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <FileCode2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">JSON Veri Yönetim Masası</h2>
                <span className="text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded">
                  Veritabanı Yok · Saf JSON İşleme
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Projede SQL/NoSQL veritabanı kullanılmaz; tüm banka, müşteri, kart, kredi ve işlem kayıtları JSON formatında okunup işlenir.
              </p>
            </div>
          </div>

          <button
            onClick={onKapat}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Bilgilendirme ve Uyarılar */}
        {hata && (
          <div className="my-3 p-3 bg-rose-950/80 border border-rose-800/80 rounded-xl text-rose-200 text-xs flex items-center gap-2 shrink-0">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{hata}</span>
          </div>
        )}

        {basari && (
          <div className="my-3 p-3 bg-emerald-950/80 border border-emerald-800/80 rounded-xl text-emerald-200 text-xs flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{basari}</span>
          </div>
        )}

        {/* JSON Editör Alanı */}
        <div className="flex-1 my-4 flex flex-col min-h-[300px]">
          <div className="flex items-center justify-between px-3 py-2 bg-slate-950 border border-slate-800 rounded-t-xl text-xs font-mono text-slate-400">
            <span>bank_data.json (Canlı Sistem Verisi)</span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleKopyala}
                className="flex items-center gap-1 hover:text-white transition-colors"
              >
                {kopyalandi ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{kopyalandi ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
          </div>
          <textarea
            value={jsonMetni}
            onChange={(e) => setJsonMetni(e.target.value)}
            className="flex-1 w-full bg-slate-950/90 border border-slate-800 border-t-0 rounded-b-xl p-4 font-mono text-xs text-emerald-400/90 focus:outline-none focus:border-emerald-500 resize-none overflow-y-auto leading-relaxed select-text"
            spellCheck={false}
          />
        </div>

        {/* Alt Aksiyon Butonları */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={handleIndir}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-xl border border-slate-700 transition-colors flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>JSON Olarak İndir</span>
            </button>
            <button
              onClick={handleSifirla}
              className="px-3.5 py-2 bg-slate-800 hover:bg-rose-950/40 text-slate-300 hover:text-rose-300 text-xs font-medium rounded-xl border border-slate-700 hover:border-rose-800 transition-colors flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Varsayılana Sıfırla</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onKapat}
              className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white"
            >
              Kapat
            </button>
            <button
              onClick={handleJsonKaydet}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-all shadow-md shadow-emerald-500/20 flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Değişiklikleri Kaydet & Sisteme Yükle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
