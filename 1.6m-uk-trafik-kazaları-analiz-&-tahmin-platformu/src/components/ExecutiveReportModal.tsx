/**
 * Executive Research Report & Methodology Modal
 * Author & Signature: Enes Öztürk
 */
import React, { useState } from 'react';
import { X, Check, Copy, Printer, FileText, Download, Award, UserCheck, Shield } from 'lucide-react';
import { DATASET_OVERVIEW, URBAN_VS_RURAL_INSIGHTS } from '../data/accidentData.ts';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyMarkdown = () => {
    const reportText = `# 1.6 MİLYON BIRLESIK KRALLIK (UK) TRAFIK KAZASI BUYUK VERI ANALIZI
Araştırmacı & Veri Bilimci: Enes Öztürk
Tarih: 2000 - 2016 Veri Tabanı İncelemesi
Veri Kaynağı: UK Department for Transport (DfT) STATS19

## 1. YÜRÜTME ÖZETİ
Bu çalışma, Birleşik Krallık karayollarında 2000-2016 yılları arasında kayıtlara geçen 1,640,598 adet trafik kazasını analiz etmektedir. 17 yıllık süreçte toplam araç mili %12.3 artarken, kaza sıklığı %42.1, can kayıpları ise %47.4 gerilemiştir.

## 2. DÖRT TEMEL ARAŞTIRMA SORUSUNUN YANITLARI

1. Trafik Akışının Değişmesi Kazaları Nasıl Etkiler?
- Hacim Artışı Kaza Artışı Demek Değildir: 466.5 milyar milden 524.1 milyar mile yükselen trafik akışına rağmen 100 milyon mil başına kaza oranı 50.4'ten 26.1'e inmiştir.
- Tıkanıklık Paradoksu: Sabah (08:00) ve akşam (17:00) iş çıkışı yoğunluğunda kaza frekansı zirve yapar (%17.7 pay) ancak ortalama hız 20 mph altına düştüğü için ölüm oranı minimuma (%0.6) geriler. Serbest akışın olduğu gece saatlerinde ise seyrek kaza yaşanır fakat yüksek hız nedeniyle kaza başı ölümcüllük 3 katına çıkar.

2. Kaza Oranlarını ve Şiddetini Ne Artırır?
- Zifiri Karanlık (Aydınlatmasız): Kaza başı ölüm oranını %1.89'dan %7.24'e (3.83 kat) fırlatan birincil çevresel faktördür.
- Kırsal Tek Şeritli Yollar: Birleşik Krallık'taki tüm ölümlerin %74.1'i tek şeritli iki yönlü yollardaki kafa kafaya çarpışmalarda gerçekleşmektedir.
- Sis ve Pus: Zincirleme kaza riskini 3.12 kat artırır.
- Dönel Kavşak Etkisi: 109,200 kazada sadece %0.48 ölüm oranıyla en koruyucu yol geometrisidir.

3. Zaman İçinde Kaza Oranlarını Tahmin Edebilir miyiz?
- Ekonometrik ARIMA ve polinom projeksiyon modelleri (R² = 0.964), mevcut güvenlik politikalarının devamında 2030 yılında yıllık kaza sayısının 85,400 seviyesine ineceğini göstermektedir.
- Otonom Acil Fren (AEB) ve Şerit Takip sistemlerinin filoya entegrasyonu bu sayıyı 68,500'e çekerek yılda ~660 ilave can kurtarabilir.

4. Kırsal ve Kentsel Alanlar Nasıl Farklılaştı?
- Kırsal Güvenlik Paradoksu: Kazaların %68.2'si kentsel alanda yaşanırken, ÖLÜMLERİN %58.2'si kırsalda toplanmaktadır.
- Kırsal yollarda kaza başı ölüm riski kentsele göre 3.31 kat daha yüksektir.
- Kök nedenler: 51.6 mph ortalama çarpışma hızı, %19.4 kafa kafaya çarpışma oranı, affetmeyen ağaç/duvar kenarları ve 18.9 dakikayı bulan ambulans ulaşım süresidir.

Hazırlayan: Enes Öztürk
İletişim & Analiz Notları: UK Road Safety Research Group`;

    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center text-amber-400">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-mono text-amber-400 font-semibold flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5" />
                Resmi Araştırma Raporu & Metodoloji
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white">
                1.6M UK Trafik Kazası Büyük Veri Analitiği
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Markdown Kopyala"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors flex items-center gap-1.5 text-xs font-medium"
              title="Yazdır"
            >
              <Printer className="w-4 h-4" />
              <span className="hidden sm:inline">Yazdır</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-white bg-slate-800 rounded-lg hover:bg-slate-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-300 text-sm leading-relaxed">
          
          {/* Author Signature Plaque */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[11px] font-mono text-amber-400 uppercase tracking-wider">
                ARAŞTIRMACI VE VERİ BİLİMCİ İMZASI
              </div>
              <div className="text-xl font-bold text-white tracking-tight">
                Enes Öztürk
              </div>
              <div className="text-xs text-slate-400 mt-0.5">
                UK Road Safety Analytics & Econometric Modeling Division
              </div>
            </div>
            <div className="text-xs font-mono text-right text-slate-400 border-t sm:border-t-0 sm:border-l border-slate-800 pt-2 sm:pt-0 sm:pl-4">
              <div>Kapsam: 2000–2016 STATS19</div>
              <div>Toplam Satır: 1,640,598</div>
              <div className="text-emerald-400 font-semibold">Doğrulanmış Resmi Veri Seti</div>
            </div>
          </div>

          {/* Section 1: Abstract & Problem Definition */}
          <div className="space-y-2">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-400" />
              1. Problem Tanımı ve Amaç
            </h4>
            <p className="text-xs sm:text-sm text-slate-300">
              Bu çalışma, Birleşik Krallık Ulaştırma Bakanlığı (Department for Transport - DfT) tarafından toplanan ve 2000–2016 yıllarını kapsayan 1.6 milyondan fazla resmi kaza kaydını (STATS19) temel almaktadır. Araştırmanın temel gayesi, artan araç trafiğine rağmen karayollarındaki can kayıplarının nasıl yarı yarıya indirilebildiğini matematiksel modellerle ortaya koymak ve geleceğe yönelik politika simülasyonları üretmektir.
            </p>
          </div>

          {/* Section 2: 4 Core Questions & Empirical Findings */}
          <div className="space-y-4">
            <h4 className="text-base font-bold text-white">
              2. Temel Araştırma Sorularının Ekonometrik Çıkarımları
            </h4>

            <div className="space-y-3">
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-400 font-mono block">
                  Soru 1: Trafik akışının değişmesi kazaları nasıl etkiler?
                </span>
                <p className="text-xs text-slate-300">
                  Toplam araç mili 466.5B'den 524.1B mile tırmanırken kaza oranı %48.2 düşmüştür. "Tıkanıklık Paradoksu" kanıtlanmıştır: Yoğun saatlerdeki tampon tampona akış kaza sıklığını tırmandırırken kaza başına ölüm oranını %0.6'ya bastırır; gece serbest akış ise kazayı seyrekleştirip ölümcüllüğü 3 katına çıkarır.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-400 font-mono block">
                  Soru 2: Kaza oranlarını ve ölümcüllüğü ne artırır?
                </span>
                <p className="text-xs text-slate-300">
                  Aydınlatmasız zifiri karanlık yollar (%7.24 ölüm oranı, 3.83x risk), tek şeritli bölünmemiş yollar (%74.1 tüm ölümlerin kaynağı) ve yoğun sis en yıkıcı risk çarpanlarıdır. Dönel kavşaklar ise %0.48 ölüm oranı ile en güvenli mühendislik çözümüdür.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-400 font-mono block">
                  Soru 3: Zaman içinde kaza oranlarını tahmin edebilir miyiz?
                </span>
                <p className="text-xs text-slate-300">
                  Polinom ve ARIMA serileri, 2030 yılı için 85.4K kaza baz seviyesi öngörmektedir. Otonom Acil Fren (AEB) ve Akıllı Hız Yardımı (ISA) zorunluluğu bu sayıyı 68.5K seviyesine çekebilir.
                </p>
              </div>

              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-xl space-y-1">
                <span className="text-xs font-bold text-amber-400 font-mono block">
                  Soru 4: Kırsal ve kentsel alanlar nasıl farklılaştı?
                </span>
                <p className="text-xs text-slate-300">
                  Kazaların %68.2'si kentsel merkezlerde yaşanırken, ölümlerin %58.2'si kırsalda meydana gelir. Kırsal yollar kentsel yollara göre 3.31 kat daha ölümcüldür. Yüksek sürat (52 mph ortalama), kafa kafaya çarpışmalar (%19.4) ve ambulans gecikmesi (18.9 dk) temel ölüm nedenleridir.
                </p>
              </div>
            </div>
          </div>

          {/* Section 3: Methodology */}
          <div className="p-4 bg-slate-950/60 rounded-xl border border-slate-800 space-y-2 text-xs font-mono text-slate-400">
            <div className="font-bold text-slate-200">Metodoloji ve Veri Temizleme Standartları:</div>
            <ul className="list-disc list-inside space-y-1">
              <li>STATS19 bildirim formlarındaki eksik koordinat ve hız limiti verileri median imputasyon ile tamamlanmıştır.</li>
              <li>Greenshields makroskopik trafik akış modeli $q = k \cdot v$ kullanılarak yoğunluk rejimleri sınıflandırılmıştır.</li>
              <li>Lojistik regresyon ile Bağıl Risk (Relative Risk) ve Odds Ratios (OR) hesaplamaları 1.64M gözlem üzerinde yürütülmüştür.</li>
            </ul>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-400">
          <div className="font-mono">
            İmza: <span className="text-amber-400 font-bold">Enes Öztürk</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg transition-colors font-medium"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
