/**
 * ReceiptModal - Resmi Banka Dekontu Görüntüleyici
 * Mimar: Enes Öztürk
 * I/O Dosya İndirme & Yazdırma Özelliği
 */

import React from 'react';
import { Download, Printer, X, CheckCircle2, ShieldCheck, Building2 } from 'lucide-react';
import { Transaction } from '../core/models/Transaction';
import { Account } from '../core/models/Account';
import { User } from '../core/models/User';
import { FileIOService } from '../core/services/FileIOService';
import { PasswordService } from '../core/security/PasswordService';

interface ReceiptModalProps {
  transaction: Transaction | null;
  account?: Account;
  user?: User;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({
  transaction,
  account,
  user,
  onClose
}) => {
  if (!transaction) return null;

  const handleDownload = () => {
    FileIOService.generateAndDownloadReceipt(transaction, account, user);
  };

  const handlePrint = () => {
    window.print();
  };

  const maskedIban = account ? PasswordService.maskIban(account.iban) : 'TR33 **** **** ****';
  const maskedCard = account ? account.maskCardNumber() : '5421 **** **** ****';
  const maskedTc = user ? PasswordService.maskTcNo(user.tcNo) : '111*****11';

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden text-slate-100 flex flex-col">
        {/* Üst Başlık & Kapat */}
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 px-6 py-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <h3 className="font-bold text-base tracking-wide">Öztürk Bank İşlem Dekontu</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-amber-100 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dekont Gövdesi (Resmi Kağıt Görünümü) */}
        <div className="p-6 bg-slate-950 font-mono text-xs space-y-4 border-b border-slate-800">
          {/* Logo & Kurumsal Başlık */}
          <div className="text-center border-b border-dashed border-slate-700 pb-4">
            <h2 className="text-lg font-extrabold text-amber-400 tracking-wider">
              ÖZTÜRK BANK T.A.Ş.
            </h2>
            <p className="text-[11px] text-slate-400">Genel Müdürlük & ATM Operasyon Merkezi</p>
            <div className="mt-2 inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-semibold border border-emerald-500/30">
              <CheckCircle2 className="w-3 h-3" />
              <span>ELEKTRONİK İŞLEM ONAYLANDI</span>
            </div>
          </div>

          {/* İşlem Künyesi */}
          <div className="grid grid-cols-2 gap-2 text-slate-300">
            <div>
              <span className="text-slate-500 block">Referans No:</span>
              <span className="font-bold text-amber-300">{transaction.transactionNumber}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Tarih / Saat:</span>
              <span>{new Date(transaction.createdAt).toLocaleString('tr-TR')}</span>
            </div>
            <div>
              <span className="text-slate-500 block">İşlem Türü:</span>
              <span className="font-bold text-emerald-400">{transaction.transactionType}</span>
            </div>
            <div>
              <span className="text-slate-500 block">Kanal:</span>
              <span>Akıllı ATM #04 (Kadıköy)</span>
            </div>
          </div>

          <div className="border-t border-dashed border-slate-800 pt-3 space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-400">Müşteri:</span>
              <span className="font-semibold text-slate-200">{user?.fullName || 'Değerli Müşterimiz'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">TC Kimlik No:</span>
              <span>{maskedTc}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Hesap No:</span>
              <span>{account?.accountNumber || '---'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IBAN:</span>
              <span className="text-[11px] text-amber-200">{maskedIban}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Kart No:</span>
              <span>{maskedCard}</span>
            </div>

            {transaction.targetRecipientName && (
              <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800">
                <span className="text-slate-400">Alıcı:</span>
                <span className="text-amber-300 font-semibold">{transaction.targetRecipientName}</span>
              </div>
            )}
            {transaction.targetIban && (
              <div className="flex justify-between bg-slate-900 p-2 rounded border border-slate-800 text-[11px]">
                <span className="text-slate-400">Alıcı IBAN:</span>
                <span className="text-amber-200">{PasswordService.maskIban(transaction.targetIban)}</span>
              </div>
            )}
          </div>

          {/* Tutar & Masraf Özeti */}
          <div className="border-t border-dashed border-slate-700 pt-3 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-300">İşlem Tutarı:</span>
              <span className="font-bold text-white text-base">
                {transaction.amount.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Banka Masrafı:</span>
              <span className="text-slate-300">{transaction.fee.toFixed(2)} ₺</span>
            </div>
            <div className="flex justify-between border-t border-slate-800 pt-1 text-emerald-400 font-semibold">
              <span>Güncel Bakiye:</span>
              <span>{transaction.balanceAfter.toLocaleString('tr-TR', { minimumFractionDigits: 2 })} ₺</span>
            </div>
          </div>

          {/* Resmi İmza & Güvenlik Bildirimi */}
          <div className="border-t border-dashed border-slate-700 pt-4 text-center space-y-1">
            <div className="flex items-center justify-center space-x-1 text-amber-400">
              <ShieldCheck className="w-4 h-4" />
              <span className="font-bold tracking-wider">MİMAR & GÜVENLİK ONAYI</span>
            </div>
            <p className="text-[11px] text-slate-300 font-serif italic">
              Enes Öztürk
            </p>
            <p className="text-[10px] text-slate-500">
              Öztürk Bank Bilgi Teknolojileri ve Sistem Mimarisi Direktörlüğü
            </p>
          </div>
        </div>

        {/* Alt Butonlar */}
        <div className="p-4 bg-slate-900 flex items-center justify-between gap-3">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs py-2.5 px-4 rounded-xl border border-slate-700 font-semibold transition-colors"
          >
            <Printer className="w-4 h-4 text-slate-400" />
            <span>Yazdır</span>
          </button>

          <button
            onClick={handleDownload}
            className="flex-1 flex items-center justify-center space-x-2 bg-amber-600 hover:bg-amber-500 text-white text-xs py-2.5 px-4 rounded-xl font-semibold shadow-lg shadow-amber-600/30 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Dekont İndir (.TXT)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
