import React, { useState } from 'react';
import { AUTHOR_NAME, REPORT_DATE, REPORT_TITLE, REPORT_SUBTITLE } from '../data/reportData';
import { X, Download, Printer, Copy, Check, FileText } from 'lucide-react';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullMarkdown = `# ${REPORT_TITLE}
## ${REPORT_SUBTITLE}

**Yazar:** ${AUTHOR_NAME}  
**Tür:** Web3 Düşünce Egzersizi ve Teknik Vaka Analizi  
**Tarih:** ${REPORT_DATE}  
**Durum:** Nihai Değerlendirme Teslimi  

---

### Özet ve Temel Metrikler
- **Fon Takip Şeffaflığı:** %100 (On-Chain Doğrulanabilir Defter)
- **Yardım Ulaştırma Hızı:** < 6 Saat (Milestone Escrow ile otonom takas)
- **İdari Maliyet Sızıntısı:** < %0.8 (Web2'deki %15-20 kayba kıyasla)
- **Afetzede Kimlik Mahremiyeti:** 0 Veri İhlali (zk-SNARKs ile tam koruma)

---

### Bölüm 01: Giriş
Bu düşünce egzersizinde analiz edilen Web3 kullanım vakası; büyük ölçekli doğal afetler ve insani krizler sonrasında ortaya çıkan bağış yönetimi, acil malzeme tedarik zinciri ve afetzede yardım dağıtımını uçtan uca dönüştüren **OpenRelief Protokolü**'dür.

#### Protokol Ne İşe Yarar ve Nasıl Çalışır?
1. **Şartlı Fonlama:** Bağışlar 'Milestone Escrow' akıllı sözleşmelerinde kilitlenir.
2. **Doğrulanabilir Lojistik:** Malzemeler kriptografik mühürler ve IoT sıcaklık sensörleriyle donatılır.
3. **DePIN LoRaWAN Mesh:** Çöken baz istasyonlarına muhtaç olmadan pilli telsiz cihazlarıyla acil durum veri ağı kurulur.
4. **ZKP ile Mahrem Teslimat:** Afetzede açık kimlik vermeden zk-SNARKs ile hak sahipliğini ispatlar; çifte yardım suiistimali engellenir.

#### Seçilme Motivasyonu ve Asıl Amaç
2023 Kahramanmaraş depremleri ve küresel insani krizlerde merkezi sunucuların çökmesi, mükerrer yardımlar, STK'lar arası koordinasyonsuzluk ve bağışların akıbetine dair güvensizlik bu çalışmanın temel itici gücüdür. Amaç; güveni insan inisiyatifinden alıp matematiksel ve kriptografik kesinliğe devretmektir.

---

### Bölüm 02: Problem veya Fırsat (Web2 Sınırlamaları)
BM verilerine göre küresel yardımların %12-25'i bürokratik aracı maliyetleri ve yolsuzlukla kaybolmaktadır.
- **Tek Hata Noktası:** Merkezi SQL veritabanları elektrik/internet kesintisinde çöker.
- **Veri Siloları:** Kurumlar arası veri paylaşımı yapılamaz; mükerrer yardımlar oluşur.
- **Şeffaflık Eksikliği:** Web2 veritabanı yöneticileri kayıtları değiştirebilir; bağımsız denetim imkânsızdır.
- **Afetzede Mahremiyeti:** İnsanların yardım almak için kimlik fotokopisi vermesi kişisel verilerini tehlikeye atar.

---

### Bölüm 03: Çözüm veya Yenilik (Web3 Mimarisi)
- **Merkeziyetsizlik Prensipleri:** Şeffaflık, sansür direnci, değişmezlik ve tam mahremiyet.
- **Temel Teknolojiler:**
  - *Ethereum Layer 2 (Arbitrum / zkSync):* Düşük maliyet ve hızlı kesinlik.
  - *Solidity / Smart Escrow:* Şartlı fon açılımı.
  - *zk-SNARKs (Circom/SnarkJS):* Sıfır bilgi ile kimlik ifşasız hak sahipliği.
  - *DePIN & LoRaWAN:* Hücresel ağsız acil durum telsiz veri iletimi.
  - *IPFS & Arweave:* İrsaliye ve uydu hasar kanıtlarının kalıcı depolanması.
  - *Chainlink Oracles:* Soğuk zincir sensör verilerinin on-chain doğrulanması.

---

### Bölüm 04: Etki veya Değer, Metrikler ve Riskler
- **Paydaş Değeri:** Bağışçı paranın hedefe ulaştığını doğrular; afetzede onurla ve güvenle yardım alır; STK'lar mükerrerliği önler.
- **Başarı Metrikleri (KPI):** On-chain Auditability (%100), Teslimat Süresi (<6 saat), Fon Sızıntısı (<%0.8), Veri İhlali (0).
- **Zorluklar & Çözümler:**
  - *Oracle Problemi:* Çoklu sensör ve multi-sig saha onayı.
  - *UX / Seed Phrase Zorluğu:* ERC-4337 Hesap Soyutlama ve tek kullanımlık NFC bileklikler.
  - *Mevzuat Direnci:* Kamu kurumlarına denetçi (auditor) düğüm yetkisi verilerek hibrit yasal uyum.

---

**Hazırlayan:** ${AUTHOR_NAME}  
**İmza Tarihi:** ${REPORT_DATE}  
`;

  const handleDownloadMarkdown = () => {
    const element = document.createElement("a");
    const file = new Blob([fullMarkdown], { type: "text/markdown;charset=utf-8" });
    element.href = URL.createObjectURL(file);
    element.download = "web3-dusunce-egzersizi-enes-ozturk.md";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleCopyCitation = () => {
    const citation = `Öztürk, E. (2026). Afet Yönetimi ve İnsani Yardım Zincirlerinde Merkeziyetsiz Fiziksel Altyapı (DePIN) ve Sıfır Bilgi İspatları (ZKP) Analizi. Web3 Düşünce Egzersizi Raporu.`;
    navigator.clipboard.writeText(citation);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-xl border border-stone-200 shadow-xl max-w-xl w-full p-6 space-y-6">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-200 pb-4">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-800" />
            <h3 className="font-serif font-bold text-lg text-stone-900">
              Analiz Raporunu Dışa Aktar
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Options */}
        <div className="space-y-4">
          <p className="text-xs text-stone-600 leading-relaxed">
            Bu akademik düşünce egzersizini Enes Öztürk imzasıyla tam formatta kaydedebilir, yazdırabilir veya alıntılayabilirsiniz.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center justify-center gap-2 p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-amber-800" />
              <span>Markdown Olarak İndir (.md)</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 p-3 rounded-lg border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4 text-stone-700" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
          </div>

          {/* Academic Citation Box */}
          <div className="p-4 rounded-lg bg-stone-50 border border-stone-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-stone-500">
              <span>Akademik Alıntı (APA Formatı)</span>
              <button
                onClick={handleCopyCitation}
                className="flex items-center gap-1 text-stone-700 hover:text-stone-900 cursor-pointer font-sans"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
              </button>
            </div>
            <p className="text-xs text-stone-700 font-mono bg-white p-2.5 rounded border border-stone-200/80 select-all">
              Öztürk, E. ({REPORT_DATE}). Afet Yönetimi ve İnsani Yardım Zincirlerinde Merkeziyetsiz Fiziksel Altyapı (DePIN) ve Sıfır Bilgi İspatları (ZKP) Analizi. Web3 Düşünce Egzersizi Raporu.
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="border-t border-stone-200 pt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-stone-700 hover:bg-stone-100 rounded-lg cursor-pointer"
          >
            Kapat
          </button>
        </div>

      </div>
    </div>
  );
};
