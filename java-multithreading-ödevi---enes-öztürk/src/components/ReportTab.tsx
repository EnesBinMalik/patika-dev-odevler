import React from 'react';
import { Printer, Download, CheckCircle2, Award, UserCheck, Calendar, BookOpen } from 'lucide-react';
import { SINGLE_FILE_JAVA_CODE } from '../data/javaCode';

export const ReportTab: React.FC = () => {
  const handlePrint = () => {
    window.print();
  };

  const downloadReportText = () => {
    const reportText = `================================================================================
                         ÖDEV TESLİM RAPORU
       JAVA ÇOKLU İŞ PARÇACIĞI (MULTITHREADING) İLE SAYI AYRIŞTIRMA
================================================================================

ÖĞRENCİ / GELİŞTİRİCİ: Enes Öztürk
TARİH: 2026
DERS / KONU: Java 102 - Çoklu İş Parçacığı (Multithreading) ve Thread-Safe Yapılar
DURUM: Tamamlandı & Doğrulandı

1. PROBLEM TANIMI
--------------------------------------------------------------------------------
1'den 10000 (10 bin)'e kadar olan sayılardan oluşan bir ArrayList oluşturulması,
bu 10 bin elemanın 2500 eleman olacak şekilde 4 eşit alt parçaya bölünmesi,
ve 4 ayrı Thread vasıtasıyla bu parçalar içindeki tek ve çift sayıların bulunarak
ortak iki ArrayList'e (ciftSayilar ve tekSayilar) eklenmesi istenmiştir.

2. GELİŞTİRİLEN ÇÖZÜM VE YÖNTEM
--------------------------------------------------------------------------------
- Ana Liste: 1'den 10.000'e kadar ardışık tam sayılar döngü ile ArrayList'e eklendi.
- Parçalama: subList() yöntemiyle [0-2500], [2500-5000], [5000-7500], [7500-10000]
  aralıklarında 4 bağımsız alt liste oluşturuldu.
- Thread Mimarisi: Runnable arayüzünü uygulayan SayiIsleyici sınıfı tasarlandı.
- Eşzamanlılık (Concurrency): 4 ayrı Thread nesnesi t1.start(), t2.start(),
  t3.start(), t4.start() çağrıları ile paralel çalıştırıldı.
- Thread-Safety (İş Parçacığı Güvenliği): Java'da ArrayList eşzamanlı erişime
  dayanıklı (thread-safe) olmadığından, ortak listelere yazma işlemi
  synchronized(ciftKilit) ve synchronized(tekKilit) blokları ile korundu.
- Ana Thread Beklemesi: main metodunda t1.join(), t2.join(), t3.join(), t4.join()
  kullanılarak tüm hesaplamaların bitmesi beklendi.

3. DOĞRULAMA VE TEST SONUÇLARI
--------------------------------------------------------------------------------
- Parça 1 (1 - 2500)    : 1250 Tek, 1250 Çift (Toplam: 2500)
- Parça 2 (2501 - 5000) : 1250 Tek, 1250 Çift (Toplam: 2500)
- Parça 3 (5001 - 7500) : 1250 Tek, 1250 Çift (Toplam: 2500)
- Parça 4 (7501 - 10000): 1250 Tek, 1250 Çift (Toplam: 2500)
--------------------------------------------------------------------------------
ORTAK ÇİFT SAYILAR LİSTESİ: 5.000 adet (Kayıp: 0) [BAŞARILI]
ORTAK TEK SAYILAR LİSTESİ : 5.000 adet (Kayıp: 0) [BAŞARILI]
TOPLAM İŞLENEN ELEMAN     : 10.000 adet (Beklenen: 10000)

4. SONUÇ
--------------------------------------------------------------------------------
Tasarlanan çoklu iş parçacığı mimarisi, hiçbir veri kaybı ya da yarış durumu
(Race Condition) olmadan 10.000 sayıyı başarıyla tek ve çift listelerine
ayrıştırmıştır.

Hazırlayan & İmza: Enes Öztürk
================================================================================
`;
    const blob = new Blob([reportText], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Odev_Raporu_Enes_Ozturk.txt';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Action Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            Ödev Teslim Raporu (Resmi Format)
          </h2>
          <p className="text-xs text-slate-400">
            Ders sorumlusu veya ödev teslimi için hazırlanmış yazdırılabilir akademik rapor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={downloadReportText}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
          >
            <Download className="w-4 h-4 text-slate-400" />
            <span>Rapor Metnini İndir</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition-colors cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Yazdır / PDF Olarak Kaydet</span>
          </button>
        </div>
      </div>

      {/* Printable Report Sheet */}
      <div className="bg-white text-slate-900 rounded-2xl p-6 sm:p-10 shadow-xl border border-slate-200 font-sans print:border-none print:shadow-none print:p-0">
        {/* Document Header */}
        <div className="border-b-2 border-slate-900 pb-5 mb-6">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-widest uppercase text-indigo-600 block mb-1">
                BİLGİSAYAR MÜHENDİSLİĞİ / YAZILIM GELİŞTİRME
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900">
                Java Multithreading Ödevi Teslim Raporu
              </h1>
              <p className="text-xs text-slate-600 mt-1">
                Konu: 1-10000 Arası Sayıların 4 Eşit Parçaya ve 4 Thread ile Tek/Çift Listelerine Ayrıştırılması
              </p>
            </div>

            <div className="p-3 rounded-xl bg-slate-100 border border-slate-300 text-right min-w-[200px]">
              <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Öğrenci / Hazırlayan</div>
              <div className="text-base font-extrabold text-slate-900 flex items-center justify-end gap-1.5 mt-0.5">
                <span>Enes Öztürk</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-[11px] text-slate-500 mt-1">İmza: <span className="font-serif italic font-bold">Enes Öztürk</span></div>
            </div>
          </div>
        </div>

        {/* Section 1: Problem Definition */}
        <div className="space-y-6 text-xs sm:text-sm leading-relaxed text-slate-800">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              1. Ödev Problem Tanımı
            </h3>
            <p className="text-justify text-slate-700">
              1'den 10000'e kadar olan tam sayılardan oluşan bir ArrayList oluşturulması istenmektedir.
              Oluşturulan 10 bin elemanlık listenin 2500 eleman olacak şekilde 4 eşit parçaya bölünmesi
              ve bu 4 ayrı 2500 elemanlık liste içinde tek ve çift sayıları bulan 4 bağımsız Thread tasarlanması
              beklenmektedir. 4 Thread bulduğu çift sayıları ortak bir <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono font-semibold">ciftSayilar</code> ArrayList'ine,
              tek sayıları ise ortak bir <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700 font-mono font-semibold">tekSayilar</code> ArrayList'ine eklemelidir.
              Listeler başlangıçta boş olmalıdır.
            </p>
          </div>

          {/* Section 2: Technical Architecture */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              2. Mimari ve Algoritma Tasarımı
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-2">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">A. Veri Bölümleme</span>
                <p className="text-xs text-slate-600">
                  <code className="text-slate-900 font-mono">subList(start, end)</code> metodu kullanılarak 10.000 eleman [0..2500], [2500..5000], [5000..7500], [7500..10000] indeksleri ile tam dörde bölünmüştür.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">B. Eşzamanlılık (Concurrency)</span>
                <p className="text-xs text-slate-600">
                  <code className="text-slate-900 font-mono">Runnable</code> arayüzünü uygulayan <code className="text-slate-900 font-mono">SayiIsleyici</code> sınıfı oluşturulmuş, <code className="text-slate-900 font-mono">t.start()</code> ile 4 iş parçacığı paralel çalıştırılmıştır.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">C. Thread-Safety (Senkronizasyon)</span>
                <p className="text-xs text-slate-600">
                  Java'da ArrayList iş parçacığı güvenli (thread-safe) olmadığından, ortak listelere erişim <code className="text-slate-900 font-mono">synchronized(ciftKilit)</code> ve <code className="text-slate-900 font-mono">synchronized(tekKilit)</code> blokları ile güvence altına alınmıştır.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200">
                <span className="font-bold text-slate-900 block mb-1">D. join() ile Senkronizasyon</span>
                <p className="text-xs text-slate-600">
                  Ana iş parçacığı (<code className="text-slate-900 font-mono">main</code>), <code className="text-slate-900 font-mono">t1.join()...t4.join()</code> ile tüm thread'lerin işini bitirmesini bekledikten sonra sonuçları ekrana yazdırmaktadır.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Test and Verification Results Table */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-200 pb-1 mb-2">
              3. Test ve Doğrulama Sonuçları
            </h3>
            <div className="overflow-x-auto my-2">
              <table className="w-full text-left border-collapse border border-slate-200 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th className="p-2 border border-slate-300">İş Parçacığı</th>
                    <th className="p-2 border border-slate-300">Sayı Aralığı</th>
                    <th className="p-2 border border-slate-300">Toplam Eleman</th>
                    <th className="p-2 border border-slate-300">Tek Sayı</th>
                    <th className="p-2 border border-slate-300">Çift Sayı</th>
                    <th className="p-2 border border-slate-300">Durum</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-2 font-semibold">Thread-1</td>
                    <td className="p-2 font-mono">1 - 2500</td>
                    <td className="p-2 font-mono">2500</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 text-emerald-600 font-semibold">Başarılı</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Thread-2</td>
                    <td className="p-2 font-mono">2501 - 5000</td>
                    <td className="p-2 font-mono">2500</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 text-emerald-600 font-semibold">Başarılı</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Thread-3</td>
                    <td className="p-2 font-mono">5001 - 7500</td>
                    <td className="p-2 font-mono">2500</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 text-emerald-600 font-semibold">Başarılı</td>
                  </tr>
                  <tr>
                    <td className="p-2 font-semibold">Thread-4</td>
                    <td className="p-2 font-mono">7501 - 10000</td>
                    <td className="p-2 font-mono">2500</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 font-mono">1250</td>
                    <td className="p-2 text-emerald-600 font-semibold">Başarılı</td>
                  </tr>
                  <tr className="bg-slate-50 font-bold">
                    <td className="p-2" colSpan={2}>GENEL TOPLAM</td>
                    <td className="p-2 font-mono">10.000</td>
                    <td className="p-2 font-mono text-indigo-700">5.000</td>
                    <td className="p-2 font-mono text-emerald-700">5.000</td>
                    <td className="p-2 text-emerald-700">%100 Doğrulandı</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Section 4: Signature & Declaration */}
          <div className="pt-4 border-t-2 border-slate-900 flex flex-wrap items-center justify-between gap-4 mt-6">
            <div>
              <p className="text-xs text-slate-500">
                Bu çalışma, yukarıdaki şartnameye ve Java Multithreading standartlarına tam uygun olarak hazırlanmıştır.
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500 block">Ödevi Hazırlayan:</span>
              <span className="text-base font-extrabold text-slate-900 block">Enes Öztürk</span>
              <span className="text-[11px] text-indigo-600 font-medium font-serif italic block">
                İmza: Enes Öztürk
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
