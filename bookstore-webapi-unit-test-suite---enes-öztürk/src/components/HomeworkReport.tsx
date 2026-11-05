/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileText, CheckCircle2, Award } from 'lucide-react';
import { generateProjectZip } from '../utils/zipExporter';

export const HomeworkReport: React.FC = () => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const markdownReport = `# Ödev Teslim Raporu: .NET Core BookStore WebApi Unit Testing
**Öğrenci / Geliştirici:** Enes Öztürk  
**Tarih:** 2026  
**Ders:** .NET Core WebApi & Birim Testleri (Patika.dev / Kodluyoruz)  
**Kullanılan Kütüphaneler:** xUnit 2.6.2, FluentAssertions 6.12.0, FluentValidation 11.8.0, AutoMapper 12.0.1, EF Core In-Memory  

---

## 1. Tamamlanan Görevler ve Test Kapsamı

### 1.1 Book Servisleri (Bölüm 1)
- [x] **DeleteBookCommandTests**: Var olan kitap ID'si ile silme işlemi ve olmayan kitap için \`InvalidOperationException\` fırlatılması test edildi.
- [x] **DeleteBookCommandValidatorTests**: \`BookId <= 0\` sınır değerleri için hata dönüşü, \`BookId > 0\` için geçerlilik test edildi.
- [x] **UpdateBookCommandTests**: Olmayan kitap güncellemesinde \`InvalidOperationException\` ve geçerli modelle alan güncellemesi test edildi.
- [x] **UpdateBookCommandValidatorTests**: Boş başlık, < 4 karakter başlık, \`GenreId <= 0\` hataları ve geçerli girdi testleri yapıldı.
- [x] **GetBookDetailQueryTests**: Olmayan kitap detayında hata fırlatma ve geçerli kitapta AutoMapper ile \`BookDetailViewModel\` doğrulaması.
- [x] **GetBookDetailQueryValidatorTests**: \`BookId <= 0\` ve \`BookId > 0\` sınır testleri.

### 1.2 Genre Servisleri (Bölüm 2)
- [x] **CreateGenreCommandTests**: Zaten var olan tür adında \`InvalidOperationException\` ("Kitap türü zaten mevcut!") ve yeni tür ekleme testleri.
- [x] **CreateGenreCommandValidatorTests**: Boş isim ve 4 karakterden kısa isim doğrulama testleri.
- [x] **DeleteGenreCommandTests**: Olmayan türde hata fırlatılması ve geçerli tür silinmesi.
- [x] **DeleteGenreCommandValidatorTests**: \`GenreId <= 0\` sınır testleri.
- [x] **UpdateGenreCommandTests**: Olmayan tür, isim çakışması (duplicate name) ve geçerli güncelleme testleri.
- [x] **UpdateGenreCommandValidatorTests**: \`GenreId <= 0\` ve kısa isim sınır testleri.
- [x] **GetGenreDetailQueryTests**: Olmayan tür hatası ve aktif türün AutoMapper ile \`GenreDetailViewModel\` olarak getirilmesi.
- [x] **GetGenreDetailQueryValidatorTests**: \`GenreId <= 0\` ve \`GenreId > 0\` doğrulama testleri.

### 1.3 Author Servisleri (Bölüm 3 - Enes Öztürk İmzalı)
- [x] **CreateAuthorCommandTests**: Var olan yazar çakışması, doğum tarihinin bugünden ileri olamayacağı iş kuralı ve yeni yazar oluşturma testleri.
- [x] **CreateAuthorCommandValidatorTests**: Ad, soyad boş veya < 2 karakter kontrolleri ile doğum tarihi doğrulama testleri.
- [x] **DeleteAuthorCommandTests**: 
  - **Kritik İş Kuralı:** Yayında kitabı bulunan yazar silinemez ("Yayında kitabı bulunan bir yazar silinemez! Önce yazarın kitaplarını siliniz.") kuralı test edildi.
  - Olmayan yazar silme hatası ve kitabı olmayan yazarın başarıyla silinmesi test edildi.
- [x] **DeleteAuthorCommandValidatorTests**: \`AuthorId <= 0\` sınır testleri.
- [x] **UpdateAuthorCommandTests**: Olmayan yazar hatası ve geçerli güncelleme testleri.
- [x] **UpdateAuthorCommandValidatorTests**: \`AuthorId <= 0\` ve ad/soyad uzunluk sınır testleri.
- [x] **GetAuthorDetailQueryTests**: Olmayan yazar hatası ve geçerli yazar detayının \`AuthorDetailViewModel\` ile getirilmesi.
- [x] **GetAuthorDetailQueryValidatorTests**: \`AuthorId <= 0\` sınır testleri.

### 1.4 Test Altyapısı (TestSetup)
- [x] **CommonTestFixture**: Her test sınıfı için izole In-Memory DbContext ve AutoMapper MappingProfile nesneleri oluşturur.
- [x] **Seed Data**: Books, Genres ve Authors başlangıç verileri test ortamına otomatik yüklenir.

---

## 2. Testlerin Çalıştırılması (CLI)
\`\`\`bash
cd BookStore.UnitTests
dotnet test
\`\`\`

**Geliştirici:** Enes Öztürk  
**İmza:** Enes Öztürk Software
`;

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadZip = async () => {
    try {
      setIsDownloading(true);
      const blob = await generateProjectZip();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'BookStore_UnitTests_EnesOzturk.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error(err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>Ödev Teslim Raporu</span>
              <span aria-hidden="true">·</span>
              <span>.NET Core CQRS & Unit Testing</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-400 font-medium">Enes Öztürk</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-white">
              Ödev Teslim Belgeleri ve Test Kapsama Raporu
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Book, Genre ve Author servislerinin tüm gereksinimleri eksiksiz bir şekilde hazırlanmıştır. Raporu kopyalayabilir veya tüm kaynak kodları .zip olarak indirebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopyMarkdown}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-400">Rapor Kopyalandı!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-400" />
                  <span>Raporu Kopyala (MD)</span>
                </>
              )}
            </button>

            <button
              onClick={handleDownloadZip}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Paketleniyor...' : 'Ödevi İndir (.ZIP)'}</span>
            </button>
          </div>
        </div>

        {/* Verification Checklist */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6 pt-6 border-t border-slate-800 text-xs">
          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 font-semibold text-indigo-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>1. Book Servisleri (Tamamlandı)</span>
            </div>
            <ul className="text-slate-300 space-y-1">
              <li>• DeleteBookCommand & Validator</li>
              <li>• UpdateBookCommand & Validator</li>
              <li>• GetBookDetailQuery & Validator</li>
            </ul>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 font-semibold text-indigo-400 mb-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>2. Genre Servisleri (Tamamlandı)</span>
            </div>
            <ul className="text-slate-300 space-y-1">
              <li>• CreateGenreCommand & Validator</li>
              <li>• DeleteGenreCommand & Validator</li>
              <li>• UpdateGenreCommand & Validator</li>
              <li>• GetGenreDetailQuery & Validator</li>
            </ul>
          </div>

          <div className="bg-slate-950/60 p-4 rounded-lg border border-slate-800">
            <div className="flex items-center gap-2 font-semibold text-indigo-400 mb-2">
              <Award className="w-4 h-4 text-amber-400" />
              <span>3. Author Servisleri (Enes Öztürk İmzalı)</span>
            </div>
            <ul className="text-slate-300 space-y-1">
              <li>• CreateAuthorCommand & Validator</li>
              <li>• DeleteAuthorCommand & Validator</li>
              <li>• UpdateAuthorCommand & Validator</li>
              <li>• GetAuthorDetailQuery & Validator</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Markdown Document Viewer */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-4 py-2.5 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <FileText className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-mono text-slate-200">README_ODEV_TESLIM.md</span>
          </div>
          <span className="text-slate-500 font-mono">Enes Öztürk</span>
        </div>
        <div className="p-6 font-mono text-xs text-slate-300 leading-relaxed max-h-[550px] overflow-y-auto bg-slate-950">
          <pre className="whitespace-pre-wrap font-mono">
            {markdownReport}
          </pre>
        </div>
      </div>
    </div>
  );
};
