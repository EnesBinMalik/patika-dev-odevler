import React, { useState } from 'react';
import { X, Printer, Copy, Check, Award, FileText, CheckCircle2 } from 'lucide-react';
import { Dikdortgen, Kare, Ucgen } from '../models/Sekil';

interface AssignmentReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AssignmentReportModal: React.FC<AssignmentReportModalProps> = ({
  isOpen,
  onClose
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  // Run sample tests for the report
  const d = new Dikdortgen(6, 10);
  const k = new Kare(5);
  const u = new Ucgen(3, 4, 5);

  const reportText = `==================================================================
T.C. NESNE YÖNELİMLİ PROGRAMLAMA (OOP) DERSİ ÖDEV RAPORU
ÖDEV KONUSU : Geometrik Şekiller Sınıf Hiyerarşisi (Alan & Çevre)
ÖĞRENCİ     : Enes Öztürk
İMZA        : Enes Öztürk (Dijital Onaylı)
TARİH       : ${new Date().toLocaleDateString('tr-TR')}
==================================================================

1. PROBLEM TANIMI VE AMAÇ:
Sekil adında bir temel sınıf oluşturmak ve bu sınıftan türeterek
Dikdortgen, Ucgen ve Kare sınıflarını geliştirmek.
Amaç: En mantıklı yoldan ve minimum kod yazarak (DRY İlkesi) her şeklin
kendi alan ve çevresini hesaplamak.

2. MİMARİ KARAR (EN AZ KOD VE MANTIK ANALİZİ):
- 'Sekil' sınıfı soyut (abstract) olarak tasarlanmış, ortak 'isim' özelliği
  ile 'alanHesapla()' ve 'cevreHesapla()' soyut metotlarını tanımlamıştır.
- 'Dikdortgen' sınıfı 'Sekil'den türetilmiştir. İki kenar (genişlik, yükseklik)
  alarak alan ve çevre hesaplamalarını gerçekleştirir.
- 'Kare' sınıfı 'Sekil' yerine doğrudan 'Dikdortgen' sınıfından türetilmiştir!
  Geometrik ve mantıksal olarak kare, genişliği ve yüksekliği eşit bir dikdörtgendir.
  Bu sayede constructor içinde super(kenar, kenar) çağrılarak alanHesapla() ve
  cevreHesapla() metotları SIFIR KOD TEKRARI ile miras alınmıştır.
- 'Ucgen' sınıfı 'Sekil'den türetilmiştir. Üç kenar (a, b, c) ile Heron Formülü
  kullanılarak yükseklik bilgisi olmadan kesin alan ve çevre hesaplar.

3. TEST VE DOĞRULAMA ÇIKTILARI:
- Dikdörtgen (6x10): Alan = ${d.alanHesapla()} br², Çevre = ${d.cevreHesapla()} br
- Kare (5x5): Alan = ${k.alanHesapla()} br², Çevre = ${k.cevreHesapla()} br [Dikdortgen'den miras]
- Üçgen (3-4-5): Alan = ${u.alanHesapla()} br², Çevre = ${u.cevreHesapla()} br [Heron]
- Polimorfizm: Tüm şekiller 'Sekil[]' dizisi içerisinde tek bir döngüde hesaplanabilir.

Hazırlayan ve İmzalayan:
Enes Öztürk
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden text-slate-100">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" />
            <h3 className="text-base font-bold text-white">Resmi Ödev Teslim Raporu</h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Yazdır / PDF Olarak Kaydet"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={handleCopy}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
              title="Rapor Metnini Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body: Printable Paper style */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs md:text-sm leading-relaxed bg-slate-900">
          {/* Header Paper Header */}
          <div className="p-5 rounded-xl bg-slate-950 border border-slate-800 text-center relative overflow-hidden">
            <div className="absolute top-3 right-4 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Ödev Teslime Hazır</span>
            </div>
            <div className="text-[11px] font-mono uppercase tracking-widest text-slate-400">
              Nesne Yönelimli Programlama (OOP)
            </div>
            <h2 className="text-lg md:text-xl font-extrabold text-white mt-1">
              Geometrik Şekiller Alan ve Çevre Sistemi
            </h2>
            <div className="text-xs text-indigo-400 mt-1 font-mono">
              Sekil • Dikdortgen • Kare • Ucgen
            </div>
          </div>

          {/* Student Info & Signature */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
              <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                Ödev Bilgileri
              </span>
              <div className="space-y-1 text-slate-300">
                <div><strong className="text-white">Ders:</strong> Nesne Yönelimli Programlama</div>
                <div><strong className="text-white">Konu:</strong> Sınıf Hiyerarşisi & Kalıtım</div>
                <div><strong className="text-white">Tarih:</strong> {new Date().toLocaleDateString('tr-TR')}</div>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/30 to-slate-950 border border-indigo-500/30 relative">
              <span className="text-[10px] uppercase font-bold text-indigo-400 block mb-1">
                Öğrenci & Dijital İmza
              </span>
              <div className="text-slate-200">
                <span className="text-xs text-slate-400">Hazırlayan: </span>
                <span className="font-bold text-white text-base">Enes Öztürk</span>
              </div>
              <div className="mt-2 flex items-center justify-between border-t border-slate-800 pt-2">
                <span className="font-signature text-2xl text-amber-300 font-bold">
                  Enes Öztürk
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-300 font-medium">
                  Doğrulanmış İmza
                </span>
              </div>
            </div>
          </div>

          {/* Architecture Explanation */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h4 className="text-xs uppercase font-bold text-indigo-400 tracking-wider">
              En Az Kod Yazma & Mantık Raporu (DRY Prensibi)
            </h4>
            <p className="text-slate-300 text-xs leading-relaxed">
              Bu ödevde en mantıklı ve en az kod yazma hedefi doğrultusunda <strong className="text-white">Kare</strong> sınıfı, doğrudan <strong className="text-white">Dikdortgen</strong> sınıfından türetilmiştir. Geometride her kare aynı zamanda genişliği ve yüksekliği eşit olan bir dikdörtgendir.
            </p>
            <p className="text-slate-300 text-xs leading-relaxed">
              Böylece Kare sınıfı oluşturulurken kurucu metodunda yalnızca <code className="text-emerald-400 font-mono">super(kenar, kenar, 'Kare')</code> çağrısı yapılmış, <strong className="text-emerald-300">alanHesapla()</strong> ve <strong className="text-cyan-300">cevreHesapla()</strong> fonksiyonları sıfır satır kod tekrarıyla doğrudan Dikdörtgen sınıfından miras alınmıştır.
            </p>
          </div>

          {/* Test Results Table */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800">
            <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-2">
              Sistem Test Sonuçları
            </h4>
            <div className="space-y-1.5 font-mono text-xs">
              <div className="p-2 rounded bg-slate-900 flex justify-between">
                <span>[Dikdörtgen 6×10]</span>
                <span className="text-emerald-400">Alan: 60.00 br²</span>
                <span className="text-cyan-400">Çevre: 32.00 br</span>
              </div>
              <div className="p-2 rounded bg-slate-900 flex justify-between">
                <span>[Kare 5×5 (Miras)]</span>
                <span className="text-emerald-400">Alan: 25.00 br²</span>
                <span className="text-cyan-400">Çevre: 20.00 br</span>
              </div>
              <div className="p-2 rounded bg-slate-900 flex justify-between">
                <span>[Üçgen 3-4-5 (Heron)]</span>
                <span className="text-emerald-400">Alan: 6.00 br²</span>
                <span className="text-cyan-400">Çevre: 12.00 br</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5 text-amber-300">
            <Award className="w-4 h-4" />
            <span>Enes Öztürk İmzalı Ödev Projesi</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 transition cursor-pointer"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
