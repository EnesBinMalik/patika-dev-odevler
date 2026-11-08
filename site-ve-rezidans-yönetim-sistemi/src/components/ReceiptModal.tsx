import React from 'react';
import { Odeme, Daire } from '../types';
import { X, Printer, CheckCircle2, Building2, ShieldCheck } from 'lucide-react';

interface ReceiptModalProps {
  odeme: Odeme;
  daire?: Daire;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ odeme, daire, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-900 text-white">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
              EÖ
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">Tahsilat Makbuzu & Dekont</h3>
              <p className="text-xs text-slate-300">Güneştepe Sitesi Yönetimi · Enes Öztürk</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Printable Receipt Body */}
        <div id="receipt-print-area" className="p-6 bg-white text-slate-800 space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4" />
                <span>Ödeme Başarıyla Alındı</span>
              </div>
              <p className="text-xs text-slate-500 mt-0.5">Kredi Kartı / Banka Servisi Onaylı</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Makbuz No</span>
              <span className="font-mono text-sm font-semibold text-slate-900">{odeme.makbuzNo}</span>
            </div>
          </div>

          {/* Amount Showcase */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 text-center">
            <span className="text-xs uppercase tracking-wider text-slate-500 font-semibold block mb-1">
              Tahsil Edilen Toplam Tutar
            </span>
            <span className="text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {odeme.tutar.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
            </span>
            <span className="text-xs text-slate-500 block mt-1 font-medium">
              {odeme.donemAy} {odeme.faturaTuru} Bedeli
            </span>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Sakin (Ödeyen)</span>
              <span className="font-semibold text-slate-800 text-sm">{odeme.kullaniciAdi}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Konut / Daire</span>
              <span className="font-semibold text-slate-800 text-sm">
                {daire ? `${daire.blok} No: ${daire.daireNo} (${daire.kat})` : `Daire ID: ${odeme.daireId}`}
              </span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">İşlem Tarihi</span>
              <span className="font-mono font-medium text-slate-800">{odeme.odemeTarihi}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Banka Referans No</span>
              <span className="font-mono font-medium text-slate-800">{odeme.bankaReferansNo}</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Ödeme Kanalı</span>
              <span className="font-medium text-slate-800">Kredi Kartı (**** {odeme.kartSon4})</span>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg">
              <span className="text-slate-400 block mb-0.5">Kart Sahibi</span>
              <span className="font-medium text-slate-800">{odeme.kartSahibi}</span>
            </div>
          </div>

          {/* Signature and Verification Footer */}
          <div className="border-t border-dashed border-slate-200 pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ShieldCheck className="w-5 h-5 text-indigo-600" />
              <div>
                <p className="font-medium text-slate-700">Elektronik Mali Onaylı</p>
                <p className="text-[11px] text-slate-400">.NET WebAPI & MongoDB Banka Servisi</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-400 block">Site Yönetimi Onayı</span>
              <span className="text-xs font-bold text-slate-800">Enes Öztürk (Yönetici)</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:text-slate-900 bg-white border border-slate-300 rounded-lg hover:bg-slate-100 transition-colors"
          >
            Kapat
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors shadow-xs"
          >
            <Printer className="w-4 h-4" />
            Makbuzu Yazdır
          </button>
        </div>
      </div>
    </div>
  );
};
