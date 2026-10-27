import React, { useState } from 'react';
import { Printer, Copy, Check, RotateCcw, ShoppingBag } from 'lucide-react';
import { Item, CartState, Language } from '../types';
import { formatCurrency, formatNumber } from '../utils/formatters';
import { INITIAL_BALANCE } from '../data/items';

interface ReceiptProps {
  cart: CartState;
  items: Item[];
  totalSpent: number;
  balance: number;
  language: Language;
  onReset: () => void;
}

export const Receipt: React.FC<ReceiptProps> = ({
  cart,
  items,
  totalSpent,
  balance,
  language,
  onReset,
}) => {
  const [copied, setCopied] = useState(false);
  const isTr = language === 'tr';

  // Filter items that have quantity > 0
  const purchasedItems = items
    .filter((item) => (cart[item.id] || 0) > 0)
    .map((item) => ({
      item,
      quantity: cart[item.id],
      totalPrice: cart[item.id] * item.price,
    }));

  const handleCopy = () => {
    if (purchasedItems.length === 0) return;

    let receiptText = isTr
      ? `=== BILL GATES'IN PARASINI HARCA - ALIŞVERİŞ FİŞİ ===\n`
      : `=== SPEND BILL GATES' MONEY - RECEIPT ===\n`;
    receiptText += `Geliştirici / Developer: Enes Öztürk (Ödev 2)\n`;
    receiptText += `Tarih: ${new Date().toLocaleDateString()}\n`;
    receiptText += `--------------------------------------------------\n`;

    purchasedItems.forEach(({ item, quantity, totalPrice }) => {
      const name = isTr ? item.nameTr : item.name;
      receiptText += `${name} x${formatNumber(quantity)}: ${formatCurrency(totalPrice)}\n`;
    });

    receiptText += `--------------------------------------------------\n`;
    receiptText += `${isTr ? 'TOPLAM HARCANAN' : 'TOTAL SPENT'}: ${formatCurrency(totalSpent)}\n`;
    receiptText += `${isTr ? 'KALAN BAKİYE' : 'REMAINING BALANCE'}: ${formatCurrency(balance)}\n`;
    receiptText += `==================================================\n`;

    navigator.clipboard.writeText(receiptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <section id="receipt" className="py-12 px-4 sm:px-6 bg-slate-50 border-t border-slate-200">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {isTr ? 'Alışveriş Fişiniz' : 'Your Receipt'}
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            {isTr
              ? 'Satın aldığınız ürünlerin dökümü ve harcama detayları'
              : 'Detailed breakdown of items purchased and total expenditure'}
          </p>
        </div>

        {purchasedItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-12 text-center shadow-xs">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-400">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-1">
              {isTr ? 'Sepetiniz Henüz Boş' : 'Your basket is currently empty'}
            </h3>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              {isTr
                ? 'Bill Gates\'in 100 Milyar Dolarını harcamaya başlamak için yukarıdaki ürünlerden "Satın Al" butonuna tıklayın.'
                : 'Click "Buy" on any of the products above to start spending Bill Gates\' 100 Billion Dollars.'}
            </p>
            <a
              href="#catalog"
              className="inline-flex items-center justify-center px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm rounded-lg transition-colors shadow-xs"
            >
              {isTr ? 'Ürünlere Göz At' : 'Browse Products'}
            </a>
          </div>
        ) : (
          <div className="relative bg-white border border-slate-200 rounded-2xl shadow-lg overflow-hidden">
            {/* Receipt Header */}
            <div className="p-6 sm:p-8 border-b border-slate-200 text-center bg-slate-50/50">
              <span className="text-xs font-mono uppercase tracking-widest text-slate-400">
                OFFICIAL RECEIPT #BG-100B
              </span>
              <h3 className="text-2xl font-black text-slate-900 mt-1 tracking-tight">
                {isTr ? "Bill Gates Harcama Fişi" : "Bill Gates' Receipt"}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {new Date().toLocaleDateString(isTr ? 'tr-TR' : 'en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>

            {/* Line items table */}
            <div className="p-6 sm:p-8 overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-xs text-slate-400 font-semibold uppercase">
                    <th className="pb-3">{isTr ? 'Ürün' : 'Item'}</th>
                    <th className="pb-3 text-center">{isTr ? 'Adet' : 'Qty'}</th>
                    <th className="pb-3 text-right">{isTr ? 'Birim Fiyat' : 'Price'}</th>
                    <th className="pb-3 text-right">{isTr ? 'Toplam Bedel' : 'Total'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-mono">
                  {purchasedItems.map(({ item, quantity, totalPrice }) => (
                    <tr key={item.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 font-sans font-medium text-slate-900 flex items-center gap-2">
                        <span className="text-lg select-none">{item.emoji}</span>
                        <span>{isTr ? item.nameTr : item.name}</span>
                      </td>
                      <td className="py-3 text-center text-slate-700 font-semibold tabular-nums">
                        x{formatNumber(quantity)}
                      </td>
                      <td className="py-3 text-right text-slate-500 tabular-nums">
                        {formatCurrency(item.price)}
                      </td>
                      <td className="py-3 text-right font-bold text-emerald-600 tabular-nums">
                        {formatCurrency(totalPrice)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Total & Summary section */}
              <div className="mt-8 pt-6 border-t-2 border-dashed border-slate-300 space-y-3 font-mono">
                <div className="flex justify-between items-center text-base sm:text-lg">
                  <span className="font-bold text-slate-700">
                    {isTr ? 'TOPLAM HARCANAN' : 'TOTAL SPENT'}:
                  </span>
                  <span className="font-extrabold text-emerald-600 text-xl sm:text-2xl tabular-nums">
                    {formatCurrency(totalSpent)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>{isTr ? 'Kalan Servet' : 'Remaining Fortune'}:</span>
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {formatCurrency(balance)}
                  </span>
                </div>

                <div className="flex justify-between items-center text-sm text-slate-500">
                  <span>{isTr ? 'Servetin Harcanma Oranı' : 'Fortune Spent'}:</span>
                  <span className="font-semibold text-slate-700 tabular-nums">
                    {((totalSpent / INITIAL_BALANCE) * 100).toFixed(4)}%
                  </span>
                </div>
              </div>

              {/* Signature Block */}
              <div id="signature" className="mt-8 pt-6 border-t border-slate-200 text-center bg-slate-50/70 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wider text-slate-500 font-semibold mb-1">
                  {isTr ? 'Ödev 2 Proje İmzası' : 'Homework 2 Project Signature'}
                </p>
                <p className="text-base font-extrabold text-slate-900 tracking-wide font-mono">
                  ENES ÖZTÜRK
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {isTr
                    ? 'React · Vite · TypeScript · Tailwind CSS'
                    : 'Developed with React, TypeScript & Tailwind CSS'}
                </p>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex flex-wrap items-center justify-center gap-3 print:hidden">
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>{isTr ? 'Kopyalandı!' : 'Copied!'}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 text-slate-500" />
                      <span>{isTr ? 'Fişi Kopyala' : 'Copy Receipt'}</span>
                    </>
                  )}
                </button>

                <button
                  onClick={handlePrint}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>{isTr ? 'Fişi Yazdır / PDF' : 'Print / Save PDF'}</span>
                </button>

                <button
                  onClick={onReset}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-lg text-sm font-semibold transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isTr ? 'Tümünü Sıfırla' : 'Reset All'}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
