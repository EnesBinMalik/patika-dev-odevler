/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Terminal, Copy, Check, Info, AlertCircle, CheckCircle, ExternalLink, Laptop } from 'lucide-react';

export const LocalGuide: React.FC = () => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  const handleCopy = (cmd: string, stepIndex: number) => {
    navigator.clipboard.writeText(cmd);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const steps = [
    {
      title: 'Adım 1: Node.js Yüklü Olduğunu Doğrulayın',
      desc: 'Bilgisayarınızda terminal (macOS/Linux) veya Komut İstemi / PowerShell (Windows) açarak Node.js sürümünüzü kontrol edin:',
      cmd: 'node -v',
      note: 'Eğer bir sürüm numarası (örneğin v18.x veya v20.x) görüyorsanız Node.js kuruludur. Çıkmıyorsa nodejs.org adresinden LTS sürümünü kurun.'
    },
    {
      title: 'Adım 2: Ödev İçin Yeni Klasör Oluşturun',
      desc: 'Ödev dosyalarınızı düzenli tutmak için bir çalışma klasörü oluşturup içine girin:',
      cmd: 'mkdir nodejs-odev5 && cd nodejs-odev5',
      note: 'Windows veya Mac üzerinde terminali açtığınız herhangi bir konumda bu komutu çalıştırabilirsiniz.'
    },
    {
      title: 'Adım 3: index.js Dosyasını Oluşturun ve Kodu Kaydedin',
      desc: 'Klasör içinde index.js adında bir dosya oluşturun ve "Kaynak Kod" sekmesindeki kodu bu dosyanın içine yapıştırın:',
      cmd: 'touch index.js',
      cmdWin: 'type nul > index.js  # (Windows için)',
      note: 'İsterseniz "Kaynak Kod" sekmesindeki "index.js İndir" butonuna basarak dosyayı doğrudan bu klasöre de kaydedebilirsiniz.'
    },
    {
      title: 'Adım 4: Web Sunucunuzu Başlatın',
      desc: 'Terminalde index.js dosyasını Node ile çalıştırın:',
      cmd: 'node index.js',
      note: 'Konsolda "Sunucu port 5000\'de başarıyla başlatıldı." ve "Hazırlayan: Enes Öztürk" mesajlarını göreceksiniz.'
    },
    {
      title: 'Adım 5: Tarayıcınızda Sayfaları Test Edin',
      desc: 'Tarayıcınızı (Chrome, Firefox, Edge vb.) açın ve aşağıdaki adresleri sırayla ziyaret edin:',
      links: [
        { url: 'http://localhost:5000', label: 'http://localhost:5000 (Index Sayfası)' },
        { url: 'http://localhost:5000/index', label: 'http://localhost:5000/index (Index Sayfası)' },
        { url: 'http://localhost:5000/hakkimda', label: 'http://localhost:5000/hakkimda (Hakkımda Sayfası)' },
        { url: 'http://localhost:5000/iletisim', label: 'http://localhost:5000/iletisim (İletişim Sayfası)' },
        { url: 'http://localhost:5000/diger', label: 'http://localhost:5000/diger (404 Sayfa Bulunamadı)' }
      ],
      note: 'Her sayfada belirtilen <h2>... sayfasına hoşgeldiniz</h2> başlığının çıktığını göreceksiniz!'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Guide Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-1 rounded bg-teal-500/10 text-teal-400 font-semibold border border-teal-500/20">
              Yerel Bilgisayar Rehberi
            </span>
            <span className="text-xs text-slate-400">Windows • macOS • Linux</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-1.5 flex items-center gap-2">
            <Laptop className="w-5 h-5 text-teal-400" />
            Kendi Bilgisayarında Adım Adım Çalıştırma
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Bu rehber sayesinde hiçbir harici paket (npm install vs.) kurmanıza gerek kalmadan, saf Node.js ile 2 dakika içinde sunucunuzu çalıştırabilirsiniz.
          </p>
        </div>

        <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs text-slate-300 flex items-center gap-2">
          <Info className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>Harici kütüphane gerektirmez (saf <strong className="text-white">http</strong> modülü kullanılır).</span>
        </div>
      </div>

      {/* Step by Step Cards */}
      <div className="space-y-4">
        {steps.map((step, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3 hover:border-slate-700 transition"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                <span className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-xs font-mono">
                  {idx + 1}
                </span>
                {step.title}
              </h3>
            </div>

            <p className="text-xs text-slate-300">{step.desc}</p>

            {/* Command Box */}
            {step.cmd && (
              <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 font-mono text-xs flex items-center justify-between text-slate-200">
                <span className="text-emerald-400 select-all">{step.cmd}</span>
                <button
                  onClick={() => handleCopy(step.cmd, idx)}
                  className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition flex items-center gap-1 text-[11px]"
                  title="Komutu Kopyala"
                >
                  {copiedStep === idx ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-sans">Kopyalandı</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span className="font-sans">Kopyala</span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* Links Box for Step 5 */}
            {step.links && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                {step.links.map((link, lIdx) => (
                  <div
                    key={lIdx}
                    className="p-2.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between text-xs font-mono"
                  >
                    <span className="text-sky-300">{link.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      200 OK
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Note */}
            <p className="text-[11px] text-slate-400 bg-slate-950/40 p-2.5 rounded-lg border border-slate-800/60 flex items-start gap-2">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              <span>{step.note}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Frequently Asked Questions / Common Issues */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-amber-400" />
          Sık Karşılaşılan Durumlar ve Çözümleri
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm">
              1. macOS&apos;ta Port 5000 Hatası (EADDRINUSE)
            </h4>
            <p className="text-slate-400 leading-relaxed">
              macOS Monterey ve sonrasında Apple AirPlay Receiver servisi varsayılan olarak 5000 portunu dinler. Eğer <code className="text-rose-400 font-mono">EADDRINUSE 5000</code> hatası alırsanız:
            </p>
            <p className="text-emerald-300 font-medium">
              Sistem Ayarları → Genel → AirDrop ve Handoff → &quot;AirPlay Alıcısı&quot; seçeneğini geçici olarak kapatabilirsiniz.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm">
              2. Türkçe Karakterlerin Bozuk Çıkması
            </h4>
            <p className="text-slate-400 leading-relaxed">
              &quot;hoşgeldiniz&quot;, &quot;İletişim&quot; gibi kelimelerin tarayıcıda düzgün görünmesi için sunucu yanıt başlığına mutlaka UTF-8 eklenmelidir:
            </p>
            <code className="block bg-slate-900 p-2 rounded text-emerald-400 font-mono text-[11px]">
              res.writeHead(200, &#123; &apos;Content-Type&apos;: &apos;text/html; charset=utf-8&apos; &#125;);
            </code>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm">
              3. Sunucuyu Nasıl Kapatırım?
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Terminalde sunucu çalışırken terminal penceresine odaklanıp klavyenizden <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-white font-mono">Ctrl + C</kbd> (Mac için de Ctrl + C) tuşlarına basarak sunucuyu sonlandırabilirsiniz.
            </p>
          </div>

          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-2">
            <h4 className="font-bold text-slate-200 text-sm">
              4. Neden express veya nodemon kullanmadık?
            </h4>
            <p className="text-slate-400 leading-relaxed">
              Ödev 5 yönergesi doğrudan saf Node.js&apos;in yerleşik <code className="text-sky-300 font-mono">http.createServer</code> fonksiyonunun kavranmasını istemektedir. Bu sayede harici bağımlılık olmadan arka plan mimarisi öğrenilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
