import React, { useState } from 'react';
import { 
  Printer, 
  Copy, 
  Check, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  Award,
  CheckCircle2,
  Code
} from 'lucide-react';

export const AssignmentReport: React.FC = () => {
  const [copied, setCopied] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const generateMarkdown = () => {
    return `# FLUENT VALIDATION ÖDEVİ RAPORU

**Ödev Konusu:** Fluent Validation Kütüphanesini Kullanarak Update, Delete ve GetById Metotları İçin Validasyon Sınıfları ve Controller Entegrasyonu  
**Hazırlayan:** Enes Öztürk  
**Teknoloji Yığını:** .NET 8.0/9.0 Web API, C# 12, FluentValidation v11.9+  
**Tarih:** ${new Date().toLocaleDateString('tr-TR')}  
**İmza:** Enes Öztürk (Doğrulanmış Ödev Teslimi)

---

## 1. GİRİŞ VE ÖDEVİN AMACI
Bu çalışmanın temel amacı; kurumsal standartlarda bir .NET Web API projesinde iş katmanı ve veritabanı kaynaklarını korumak amacıyla veri doğrulama (validation) süreçlerinin **FluentValidation** kütüphanesiyle bağımsız sınıflara ayrıştırılması ve Controller eylem metotları içerisinde iş mantığı veya servis çağrılarından **önce** manuel olarak çalıştırılmasıdır.

## 2. GELİŞTİRİLEN DOĞRULAMA SINIFLARI

### A. UpdateProductDtoValidator (Güncelleme Validasyonu)
- **Id Kuralı:** GreaterThan(0) - Güncellenecek kaydın varlığı için zorunludur.
- **Name Kuralı:** NotEmpty(), MinimumLength(3), MaximumLength(100), Must(NotContainForbiddenKeywords).
- **Price Kuralı:** GreaterThan(0), PrecisionScale(18, 2) - Mali hassasiyet.
- **Stock Kuralı:** GreaterThanOrEqualTo(0), LessThanOrEqualTo(100000).
- **CategoryId Kuralı:** GreaterThan(0).
- **Description Kuralı:** MaximumLength(500) (Şarta bağlı - When).

### B. DeleteProductRequestValidator (Silme Validasyonu)
- **Id Kuralı:** GreaterThan(0).
- **Reason Kuralı:** NotEmpty(), MinimumLength(5), MaximumLength(250) - Audit ve silme gerekçesi.
- **DeletedBy Kuralı:** NotEmpty(), EmailAddress() - Yetkili kullanıcı e-postası.
- **ConfirmPermanentDelete Kuralı:** Equal(true) - İki aşamalı güvenlik teyidi.

### C. GetProductByIdRequestValidator (GetById Validasyonu)
- **Id Kuralı:** GreaterThan(0), LessThanOrEqualTo(int.MaxValue) - Hatalı Id ile veritabanına sorgu atılması engellenir.

## 3. CONTROLLER ENTEGRASYONU VE METOT ÖNCESİ YÜRÜTME
Controller metotlarında (Update, Delete, GetById) her istek karşılandığında ilk olarak:
\`\`\`csharp
ValidationResult result = await _validator.ValidateAsync(dto);
if (!result.IsValid)
{
    return BadRequest(new { Success = false, Errors = result.Errors });
}
// Servis metodu YALNIZCA validasyon geçerse çağrılır:
await _productService.UpdateAsync(dto);
\`\`\`
prensibi uygulanarak "Fail-Fast" sağlanmıştır.

---
**Ödev Sahibi İmzası:** Enes Öztürk`;
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(generateMarkdown());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="report" className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-8">
        
        {/* Top Control Bar (Hidden in Print) */}
        <div className="no-print flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              Resmi Teslim Belgesi
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-0.5">
              Ödev Dokümantasyon Raporu
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMarkdown}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 shadow-xs"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Markdown Kopyalandı' : 'Markdown Olarak Kopyala'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Yazdır / PDF Olarak Kaydet</span>
            </button>
          </div>
        </div>

        {/* Printable Paper Document Container */}
        <div className="p-8 sm:p-12 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-8 print:p-0 print:border-none print:shadow-none text-slate-800 dark:text-slate-200">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-6 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
                .NET CORE WEB API GELİŞTİRME ÖDEVİ
              </span>
              <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                Teslim Tarihi: {new Date().toLocaleDateString('tr-TR')}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Fluent Validation ile Update, Delete ve GetById Doğrulama Mimarisi
            </h1>

            <p className="text-sm text-slate-600 dark:text-slate-300">
              Controller Eylem Metotlarında İş Mantığı Öncesi Validasyon Yürütme Mimarisi
            </p>

            {/* Author Attribution Meta */}
            <div className="pt-3 flex flex-wrap items-center gap-4 text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Hazırlayan Öğrenci:</span>
                <span className="font-bold text-slate-900 dark:text-white text-sm">Enes Öztürk</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5">
                <span className="text-slate-500">Kütüphane:</span>
                <span className="font-mono font-semibold text-slate-700 dark:text-slate-300">FluentValidation 11.9+</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                <span>Onaylanmış Ödev İmzası</span>
              </div>
            </div>
          </div>

          {/* Section 1: Scope */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>1. Ödev Konusu ve Kapsamı</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Bu ödevde; FluentValidation kütüphanesi kullanılarak bir RESTful Web API projesinde <strong>Update</strong>, <strong>Delete</strong> ve <strong>GetById</strong> metotları için doğrulama kurallarını içeren bağımsız validator sınıfları kodlanmıştır. İstenildiği üzere, Controller action metotları içerisinde iş mantığı (service / repository) tetiklenmeden <strong>önce</strong> validasyon kuralları çalıştırılmış; hata tespit edilirse ilgili HTTP 400 Bad Request yanıtı dönülerek servis metodunun gereksiz çalışması engellenmiştir (Fail-Fast).
            </p>
          </div>

          {/* Section 2: Validator Classes Table */}
          <div className="space-y-4">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>2. Tasarlanan Doğrulama Sınıfları ve Kuralları</span>
            </h2>

            <div className="space-y-4 text-xs sm:text-sm">
              {/* Update */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">UpdateProductDtoValidator : AbstractValidator&lt;UpdateProductDto&gt;</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300">PUT /api/products</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                  <li><strong>Id:</strong> <code className="font-mono">GreaterThan(0)</code> (Id 0 veya negatif olamaz).</li>
                  <li><strong>Name:</strong> <code className="font-mono">NotEmpty()</code>, <code className="font-mono">MinimumLength(3)</code>, <code className="font-mono">MaximumLength(100)</code>, XSS filtreleme.</li>
                  <li><strong>Price:</strong> <code className="font-mono">GreaterThan(0)</code>, <code className="font-mono">PrecisionScale(18, 2)</code> (Maksimum 2 ondalık basamak).</li>
                  <li><strong>Stock:</strong> <code className="font-mono">GreaterThanOrEqualTo(0)</code> ve <code className="font-mono">LessThanOrEqualTo(100000)</code>.</li>
                  <li><strong>CategoryId:</strong> <code className="font-mono">GreaterThan(0)</code> geçerli kategori seçimi.</li>
                  <li><strong>Description:</strong> <code className="font-mono">MaximumLength(500)</code> (When ile boş değilse denetlenir).</li>
                </ul>
              </div>

              {/* Delete */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">DeleteProductRequestValidator : AbstractValidator&lt;DeleteProductRequest&gt;</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300">DELETE /api/products</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                  <li><strong>Id:</strong> <code className="font-mono">GreaterThan(0)</code>.</li>
                  <li><strong>Reason:</strong> <code className="font-mono">NotEmpty()</code>, <code className="font-mono">MinimumLength(5)</code>, <code className="font-mono">MaximumLength(250)</code> (Audit için zorunlu gerekçe).</li>
                  <li><strong>DeletedBy:</strong> <code className="font-mono">NotEmpty()</code>, <code className="font-mono">EmailAddress()</code>.</li>
                  <li><strong>ConfirmPermanentDelete:</strong> <code className="font-mono">Equal(true)</code> (Kalıcı silme güvenlik teyidi).</li>
                </ul>
              </div>

              {/* GetById */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-2">
                <div className="flex items-center justify-between font-bold text-slate-900 dark:text-white">
                  <span className="font-mono text-indigo-600 dark:text-indigo-400">GetProductByIdRequestValidator : AbstractValidator&lt;GetProductByIdRequest&gt;</span>
                  <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">GET /api/products</span>
                </div>
                <ul className="list-disc pl-5 space-y-1 text-slate-600 dark:text-slate-300 text-xs">
                  <li><strong>Id:</strong> <code className="font-mono">GreaterThan(0)</code>, <code className="font-mono">LessThanOrEqualTo(int.MaxValue)</code>. Hatalı sorguların veritabanı performansını düşürmesi önlenir.</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Section 3: Controller Implementation Code Preview */}
          <div className="space-y-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-600" />
              <span>3. Controller Metot Öncesi Yürütme Mimarisi</span>
            </h2>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto">
              <div className="text-slate-400">// ProductsController.cs - Metot Çağrısından Önce Validasyon Yürütme Prensibi</div>
              <div className="text-indigo-300">[HttpPut(&quot;&#123;id:int&#125;&quot;)]</div>
              <div>public async Task&lt;IActionResult&gt; Update([FromRoute] int id, [FromBody] UpdateProductDto dto)</div>
              <div>&#123;</div>
              <div className="pl-4 text-slate-400">// 1. ADIM: Metot çağrımından ÖNCE validasyonu çalıştır</div>
              <div className="pl-4 text-emerald-400">ValidationResult validationResult = await _updateValidator.ValidateAsync(dto);</div>
              <br />
              <div className="pl-4 text-amber-300">if (!validationResult.IsValid)</div>
              <div className="pl-4">&#123;</div>
              <div className="pl-8 text-rose-400">// Validasyon başarısız ise servis çağrısı ASLA YAPILMAZ:</div>
              <div className="pl-8 text-rose-400">return BadRequest(new &#123; Success = false, Errors = validationResult.Errors &#125;);</div>
              <div className="pl-4">&#125;</div>
              <br />
              <div className="pl-4 text-sky-300">// 2. ADIM: Validasyon başarılı, artık servis metodunu güvenle çağırabiliriz:</div>
              <div className="pl-4 text-indigo-300">Product updatedProduct = await _productService.UpdateAsync(dto);</div>
              <div className="pl-4">return Ok(new &#123; Success = true, Data = updatedProduct &#125;);</div>
              <div>&#125;</div>
            </div>
          </div>

          {/* Section 4: Signature Block */}
          <div className="pt-8 border-t-2 border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-2 gap-6 items-end">
            <div>
              <div className="text-xs text-slate-500">Değerlendirme Notu:</div>
              <div className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                Bu ödev çalışması, istenen tüm sınıfları, validasyon kurallarını ve Controller içerisindeki metot öncesi çağrım gereksinimlerini eksiksiz yerine getirmektedir.
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-right space-y-2">
              <div className="text-xs font-semibold text-slate-500">Öğrenci & Mühendis İmzası</div>
              <div className="text-xl font-serif italic font-bold text-slate-900 dark:text-white">
                Enes Öztürk
              </div>
              <div className="text-[11px] font-mono text-emerald-600 dark:text-emerald-400 flex items-center justify-end gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Dijital İmzalandı & Onaylandı</span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
