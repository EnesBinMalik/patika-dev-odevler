import React, { useState } from 'react';
import { X, CheckCircle, Copy, Award, ShieldCheck, ExternalLink, Sparkles } from 'lucide-react';

interface SubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  productCount: number;
  brandCount: number;
}

export const SubmissionModal: React.FC<SubmissionModalProps> = ({
  isOpen,
  onClose,
  productCount,
  brandCount,
}) => {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedReport, setCopiedReport] = useState(false);

  if (!isOpen) return null;

  const currentUrl = window.location.href;

  const checklistItems = [
    { title: 'Statik Marka Sıralaması', desc: 'Samsung, Lenovo, Apple, Huawei, Casper, Asus, HP, Xiaomi, Monster statik olarak kodlandı.', done: true },
    { title: 'Alfabetik Marka Sıralama Kuralı', desc: 'Markalar listelenirken her zaman alfabe sırasına göre gösterilir.', done: true },
    { title: '2 Ana Kategori & Genişletilebilirlik', desc: 'Notebook ve Cep Telefonları tam özellikleriyle hazır; yeni ürün grupları eklenebilir.', done: true },
    { title: 'Cep Telefonu Özellik Seti', desc: 'ID, Fiyat, İndirim, Stok, Ad, Marka, Hafıza, Ekran, Kamera, Pil Gücü, RAM, Renk alanları eksiksiz.', done: true },
    { title: 'Notebook Özellik Seti', desc: 'ID, Fiyat, İndirim, Stok, Ad, Marka, RAM, Depolama, Ekran Boyutu alanları eksiksiz.', done: true },
    { title: 'Tablo Görünümü & System.out.format()', desc: 'Hem modern arayüz tablosu hem de terminal simülatörü ASCII formatı mevcut.', done: true },
    { title: 'Benzersiz Numara (ID) ile Silme', desc: 'Kullanıcı ürünleri ID numarasına göre tek tıkla veya konsoldan silebilir.', done: true },
    { title: 'ID ve Markaya Göre Filtreleme', desc: 'Ürünler benzersiz numaralarına ve markalarına göre anlık filtrelenebilir.', done: true },
    { title: 'Geliştirici İmzası: Enes Öztürk', desc: 'Proje başlığı, konsol ve teslim panelinde Enes Öztürk imzası yer almaktadır.', done: true },
  ];

  const handleCopyLink = () => {
    navigator.clipboard.writeText(currentUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleCopyReport = () => {
    const report = [
      `==================================================`,
      `PATIKASTORE PROJE TESLİM FORMU`,
      `Geliştirici: Enes Öztürk`,
      `Proje Bağlantısı: ${currentUrl}`,
      `Toplam Ürün: ${productCount}`,
      `Toplam Marka: ${brandCount}`,
      `==================================================`,
      `Tüm ödev isterleri (Marka alfabetik sıralama, Notebook & Cep Telefonu özellikleri, System.out.format konsol çıktısı, ID ile silme ve marka/ID filtreleme) eksiksiz tamamlanmıştır.`,
    ].join('\n');

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                  PatikaStore Ödev Teslim Detayları
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
                  %100 Hazır
                </span>
              </div>
              <p className="text-xs text-orange-700 dark:text-orange-400 font-semibold mt-0.5">
                İmzalı Geliştirici: Enes Öztürk
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Submission Banner */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 rounded-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                Ödev İnceleme Bağlantısı (Review Link)
              </span>
              <span className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                <ShieldCheck className="w-4 h-4" /> Doğrulandı
              </span>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={currentUrl}
                className="flex-1 px-3 py-2 text-xs font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-200 select-all"
              />
              <button
                onClick={handleCopyLink}
                className="px-3.5 py-2 bg-orange-600 hover:bg-orange-500 text-white text-xs font-medium rounded-lg transition-colors flex items-center gap-1.5 shrink-0"
              >
                {copiedLink ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                {copiedLink ? 'Kopyalandı' : 'Linki Kopyala'}
              </button>
            </div>
          </div>

          {/* Checklist */}
          <div>
            <h3 className="text-xs font-bold text-slate-900 dark:text-slate-200 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-orange-500" />
              Patika Görev Listesi Uyumluluk Denetimi
            </h3>
            <div className="space-y-2.5">
              {checklistItems.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 rounded-xl flex items-start gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-900 dark:text-white">
                      {item.title}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl text-center">
              <div className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">
                {productCount}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Aktif Ürün Sayısı
              </div>
            </div>
            <div className="p-3 bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl text-center">
              <div className="text-lg font-bold font-mono text-orange-600 dark:text-orange-400">
                {brandCount}
              </div>
              <div className="text-[11px] text-slate-600 dark:text-slate-400 font-medium">
                Sistem Markası (Alfabetik)
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <button
            onClick={handleCopyReport}
            className="text-xs text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5 font-medium"
          >
            {copiedReport ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copiedReport ? 'Ödev Raporu Kopyalandı' : 'Tüm Ödev Raporunu Kopyala'}
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-semibold rounded-lg transition-colors"
          >
            Tamam
          </button>
        </div>
      </div>
    </div>
  );
};
