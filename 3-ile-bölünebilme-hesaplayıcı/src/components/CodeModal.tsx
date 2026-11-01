/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Copy, Check, Terminal, Award, FileCode } from 'lucide-react';

interface CodeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CodeModal: React.FC<CodeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const rawCode = `/**
 * Ödev: 3 ile Bölünebilirlik Kontrolü
 * Hazırlayan: Enes Öztürk
 */

function ucIleBolunebilirlikKontrol(sayiInput) {
  // 1. Boş değer kontrolü
  if (sayiInput === null || sayiInput === undefined || String(sayiInput).trim() === "") {
    return {
      hata: true,
      mesaj: "Değer boş olamaz! Lütfen bir sayı giriniz."
    };
  }

  // 2. Sayıya dönüştürme ve geçerlilik kontrolü
  const sayi = Number(sayiInput);
  if (isNaN(sayi)) {
    return {
      hata: true,
      mesaj: "Lütfen geçerli bir sayısal değer giriniz."
    };
  }

  // 3. 3 ile bölümünden kalanın 0 olup olmadığını kontrol etme
  const kalan = ((sayi % 3) + 3) % 3; // Negatif sayıları da kapsayan pozitif mod

  // 4. Sonuç üretimi ve bölünebilen ilk sayının tespiti
  if (kalan === 0) {
    return {
      hata: false,
      girilenSayi: sayi,
      bolunebilirMi: true,
      mesaj: \`Girdiğiniz sayı (\${sayi}) 3'e tam bölünür.\`,
      imza: "Enes Öztürk"
    };
  } else {
    // 3'e tam bölünebilecek bir sonraki ilk sayıyı bulma
    // Örnek: Sayı 4 ise kalan 1'dir. Fark = 3 - 1 = 2 -> 4 + 2 = 6
    const eklenecek = 3 - kalan;
    const ilkBolunebilenSayi = sayi + eklenecek;

    return {
      hata: false,
      girilenSayi: sayi,
      bolunebilirMi: false,
      kalan: kalan,
      ilkBolunebilenSayi: ilkBolunebilenSayi,
      mesaj: \`Girdiğiniz sayı 3'e bölünemez. Bölünebilecek ilk sayı \${ilkBolunebilenSayi}'dır.\`,
      imza: "Enes Öztürk"
    };
  }
}

// Örnek Test Çağrısı:
// console.log(ucIleBolunebilirlikKontrol("4"));
// Çıktı: "Girdiğiniz sayı 3'e bölünemez. Bölünebilecek ilk sayı 6'dır. - Enes Öztürk"`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(rawCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-3xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <FileCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Ödev Çözüm Kaynak Kodu
              </h3>
              <span className="text-xs text-slate-400">
                JavaScript / TypeScript Fonksiyonu • Enes Öztürk
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400" />
                  <span>Kodu Kopyala</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-6 overflow-y-auto font-mono-code text-xs sm:text-sm bg-slate-950 text-slate-200 leading-relaxed">
          <pre className="overflow-x-auto p-4 rounded-2xl bg-slate-900/80 border border-slate-800/80 text-indigo-200">
            <code>{rawCode}</code>
          </pre>
        </div>

        {/* Modal Footer with Signature */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-400" />
            <span>Ödev Şartnamesine %100 Uygun Geliştirilmiştir</span>
          </div>
          <div className="font-signature text-xl text-amber-300 font-bold">
            Enes Öztürk
          </div>
        </div>
      </div>
    </div>
  );
};
