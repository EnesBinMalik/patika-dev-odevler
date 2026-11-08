/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Proje: Öztürk Bank ATM & Çekirdek Bankacılık Sistemi
 * Geliştirici: Enes Öztürk
 *
 * ATM Termal Makbuz / Resmi Banka Dekontu Modalı
 */

import React from 'react';
import { X, Printer, Download, CheckCircle, ShieldCheck } from 'lucide-react';
import { Transaction, Account, User } from '../../types/models';
import { FileIoService } from '../../core/services/FileIoService';
import { soundEffects } from '../../utils/soundEffects';

interface AtmReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  user: User;
  account: Account;
}

export const AtmReceiptModal: React.FC<AtmReceiptModalProps> = ({
  isOpen,
  onClose,
  transaction,
  user,
  account,
}) => {
  if (!isOpen) return null;

  const handleDownload = () => {
    soundEffects.playKeypadBeep();
    FileIoService.downloadReceiptFile(transaction, user.fullName, account.accountNumber, account.iban);
  };

  const handlePrint = () => {
    soundEffects.playKeypadBeep();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md bg-white text-slate-900 rounded-lg shadow-2xl overflow-hidden font-mono text-xs my-6 border-t-8 border-amber-500">
        {/* Receipt Header Actions */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-100 border-b border-slate-200">
          <div className="flex items-center gap-1.5 text-slate-700 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>RESMİ ATM DEKONTU</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
              title="Yazdır"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
              title="Dosya Olarak İndir (.TXT)"
            >
              <Download className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Thermal Slip Content */}
        <div className="p-6 space-y-4 bg-amber-50/30">
          {/* Logo / Bank Title */}
          <div className="text-center space-y-1 border-b border-dashed border-slate-300 pb-3">
            <div className="text-sm font-black tracking-widest text-slate-900">ÖZTÜRK BANK A.Ş.</div>
            <div className="text-[10px] text-slate-600">Kadıköy Merkez Şube ATM No: 01</div>
            <div className="text-[10px] text-slate-500">
              {new Date(transaction.createdAt).toLocaleString('tr-TR')}
            </div>
          </div>

          {/* Transaction Metadata */}
          <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between">
              <span className="text-slate-500">Fiş / Ref No:</span>
              <span className="font-bold">{transaction.transactionNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">İşlem Türü:</span>
              <span className="font-bold">{transaction.type}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Müşteri Adı:</span>
              <span className="font-bold">{user.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Hesap No:</span>
              <span>{account.accountNumber}</span>
            </div>
            <div className="flex justify-between text-[11px]">
              <span className="text-slate-500">Kart No:</span>
              <span>•••• •••• •••• {account.cardNumber.slice(-4)}</span>
            </div>
          </div>

          {/* Financial Amounts */}
          <div className="space-y-1.5 border-b border-dashed border-slate-300 pb-3">
            <div className="flex justify-between text-sm font-bold text-slate-900">
              <span>İŞLEM TUTARI:</span>
              <span className="text-emerald-700 font-extrabold">
                {transaction.amount.toLocaleString('tr-TR')} ₺
              </span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Önceki Bakiye:</span>
              <span>{transaction.previousBalance.toLocaleString('tr-TR')} ₺</span>
            </div>
            <div className="flex justify-between text-slate-900 font-bold">
              <span>Kullanılabilir Bakiye:</span>
              <span>{transaction.newBalance.toLocaleString('tr-TR')} ₺</span>
            </div>
            {transaction.targetIban && (
              <div className="flex justify-between text-[10px] text-slate-600 pt-1">
                <span>Alıcı IBAN:</span>
                <span className="truncate max-w-[200px]">{transaction.targetIban}</span>
              </div>
            )}
          </div>

          {/* Barcode Simulation */}
          <div className="text-center pt-2 space-y-2">
            <div className="inline-block py-1 px-4 bg-slate-900 text-white text-[10px] tracking-[0.3em]">
              ||||||| | ||||| || |||||| | |||||||
            </div>
            <div className="text-[9px] text-slate-500">
              GÜVENLİK KODU: OZTRK-{Math.random().toString(36).substring(2, 8).toUpperCase()}-2026
            </div>
          </div>

          {/* Official Signature */}
          <div className="pt-3 border-t border-slate-300 text-center space-y-1">
            <div className="text-[10px] text-slate-500">Sistem Tasarımı &amp; Çekirdek Mimari Onayı:</div>
            <div className="text-xs font-bold text-slate-900 tracking-wider">
              ENES ÖZTÜRK [E-İMZALIDIR]
            </div>
            <div className="text-[9px] text-slate-500">
              Banka Çekirdek Sistemleri Baş Mimarı
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded text-xs font-bold transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" /> Dekontu İndir (.TXT)
          </button>
          <button
            onClick={onClose}
            className="py-2 px-4 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded text-xs font-bold transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
