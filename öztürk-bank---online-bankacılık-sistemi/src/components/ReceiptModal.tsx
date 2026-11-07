import React from 'react';
import {
  X,
  Receipt,
  Printer,
  CheckCircle2,
  Building2,
  ShieldCheck,
  QrCode,
  Share2,
} from 'lucide-react';
import { Islem } from '../models/Islem';

interface ReceiptModalProps {
  islem: Islem;
  onKapat: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ islem, onKapat }) => {
  const json = islem.toJSON();

  const handleYazdir = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-2xl text-slate-100 max-h-[92vh] overflow-y-auto print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Kapat Butonu */}
        <button
          onClick={onKapat}
          className="absolute top-5 right-5 p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors print:hidden"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Dekont Başlığı */}
        <div className="border-b border-slate-800 pb-5 mb-5 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-emerald-600 flex items-center justify-center text-slate-950 shadow-md">
              <Building2 className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white print:text-black">
                Öztürk Bank A.Ş.
              </div>
              <div className="text-xs text-slate-400 font-mono">
                Banka Kodu: 0188 · Dijital Bankacılık Şubesi
              </div>
            </div>
          </div>

          <div className="text-right">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800/80">
              <CheckCircle2 className="w-3 h-3" />
              <span>İşlem Başarılı</span>
            </span>
          </div>
        </div>

        {/* Tutar Göstergesi */}
        <div className="text-center py-4 bg-slate-950/60 rounded-xl border border-slate-800/80 mb-5">
          <div className="text-xs uppercase tracking-wider text-slate-400 font-medium">
            {islem.getTurBasligi()}
          </div>
          <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-1">
            {json.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}{' '}
            <span className="text-lg font-bold text-slate-300">{json.paraBirimi}</span>
          </div>
          <div className="text-[11px] text-slate-500 font-mono mt-1">
            Ref: {json.referansNo}
          </div>
        </div>

        {/* Dekont Bilgi Tablosu */}
        <div className="space-y-3 text-xs mb-6 divide-y divide-slate-800/60">
          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400">İşlem Tarihi / Saati:</span>
            <span className="font-mono text-slate-200">
              {new Date(json.tarih).toLocaleString('tr-TR')}
            </span>
          </div>

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400">Gönderen / Kaynak:</span>
            <span className="font-semibold text-white text-right">{json.gonderenAd}</span>
          </div>

          {json.gonderenIban && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Gönderen IBAN/Hesap:</span>
              <span className="font-mono text-slate-300 text-[11px]">{json.gonderenIban}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400">Alıcı / Tahsil Eden:</span>
            <span className="font-semibold text-emerald-400 text-right">{json.aliciAd}</span>
          </div>

          {json.aliciIban && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Alıcı IBAN/Hesap:</span>
              <span className="font-mono text-slate-300 text-[11px]">{json.aliciIban}</span>
            </div>
          )}

          <div className="flex justify-between items-center pt-2">
            <span className="text-slate-400">Açıklama:</span>
            <span className="text-slate-200 text-right max-w-[240px] truncate">
              {json.aciklama || 'Belirtilmedi'}
            </span>
          </div>

          {json.kalanBakiye !== undefined && (
            <div className="flex justify-between items-center pt-2">
              <span className="text-slate-400">Hesap Kalan Bakiye:</span>
              <span className="font-mono font-semibold text-white">
                {json.kalanBakiye.toLocaleString('tr-TR')} {json.paraBirimi}
              </span>
            </div>
          )}
        </div>

        {/* Resmi Banka Onay & İmza Mührü */}
        <div className="p-4 rounded-xl bg-slate-950 border border-emerald-500/30 flex items-center justify-between mb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <ShieldCheck className="w-4 h-4" />
              <span>Resmi Öztürk Bank Dijital Onayı</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Sistem Mimarı & Genel Müdür: <strong className="text-slate-200">Enes Öztürk</strong>
            </div>
            <div className="text-[10px] text-slate-500 font-mono">
              Elektronik İmzalı Belge · 5070 Sayılı Kanun Uyarınca Geçerlidir
            </div>
          </div>

          <div className="p-2 bg-white rounded-lg shrink-0">
            <QrCode className="w-9 h-9 text-slate-950" />
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex items-center gap-3 print:hidden">
          <button
            onClick={handleYazdir}
            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs rounded-xl transition-colors flex items-center justify-center gap-2 border border-slate-700"
          >
            <Printer className="w-4 h-4" />
            <span>Dekontu Yazdır / PDF</span>
          </button>
          <button
            onClick={onKapat}
            className="flex-1 py-2.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl transition-colors shadow-lg shadow-emerald-500/20"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
