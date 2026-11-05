import React, { useState } from 'react';
import { 
  Code2, 
  Copy, 
  Check, 
  Download, 
  FileCheck, 
  ShieldCheck, 
  Info, 
  CheckCircle2, 
  FolderDown, 
  ExternalLink 
} from 'lucide-react';
import { CSHARP_FILES, CSharpFile } from '../data/csharpCode';

export const CodeExplorer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('update-validator');
  const [copied, setCopied] = useState(false);

  const selectedFile = CSHARP_FILES.find((f) => f.id === selectedFileId) || CSHARP_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const element = document.createElement('a');
    const file = new Blob([selectedFile.code], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = selectedFile.filename;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadAll = () => {
    // Generate combined text document with all C# files
    const allCode = CSHARP_FILES.map(f => 
      `// =========================================================================\n` +
      `// DOSYA: ${f.filename} (${f.title})\n` +
      `// AÇIKLAMA: ${f.description}\n` +
      `// HAZIRLAYAN: Enes Öztürk\n` +
      `// =========================================================================\n\n` +
      f.code + `\n\n`
    ).join('\n');

    const element = document.createElement('a');
    const file = new Blob([allCode], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = 'FluentValidation_Odev_Enes_Ozturk.cs';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <section id="code" className="py-12 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
              C# .NET Kaynak Kodları
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
              Doğrulama Sınıfları ve Controller Uygulaması
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 max-w-2xl">
              Ödev kapsamında yazılan <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Update</code>, <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">Delete</code> ve <code className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-1 py-0.5 rounded text-indigo-600 dark:text-indigo-400">GetById</code> sınıflarını ve Controller içerisindeki metot öncesi validasyon çağrımlarını inceleyin.
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadAll}
              className="px-3.5 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <FolderDown className="w-4 h-4 text-indigo-500" />
              <span>Tüm Projeyi İndir (.cs)</span>
            </button>
          </div>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-200 dark:border-slate-800 no-scrollbar">
          {CSHARP_FILES.map((file) => {
            const isSelected = file.id === selectedFileId;
            return (
              <button
                key={file.id}
                onClick={() => setSelectedFileId(file.id)}
                className={`px-3.5 py-2 text-xs font-mono font-medium rounded-t-lg transition-all flex items-center gap-2 whitespace-nowrap border-b-2 ${
                  isSelected
                    ? 'bg-slate-100 dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 border-indigo-600 dark:border-indigo-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'
                }`}
              >
                <Code2 className="w-3.5 h-3.5 text-slate-400" />
                <span>{file.filename}</span>
              </button>
            );
          })}
        </div>

        {/* Selected File Details Banner */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white font-mono">
                {selectedFile.filename}
              </span>
              <span className="text-xs text-slate-400 font-sans">({selectedFile.title})</span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              {selectedFile.description}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kodu Kopyala'}</span>
            </button>

            <button
              onClick={handleDownloadSingle}
              className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Download className="w-3.5 h-3.5" />
              <span>İndir (.cs)</span>
            </button>
          </div>
        </div>

        {/* Code Display with Line Numbers */}
        <div className="rounded-xl bg-slate-950 border border-slate-800 shadow-md overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/90 border-b border-slate-800 text-xs text-slate-400 font-mono">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-slate-300">{selectedFile.filename}</span>
            </div>
            <div className="text-[11px] text-slate-400 font-sans">
              Hazırlayan: <span className="text-indigo-400 font-semibold">Enes Öztürk</span>
            </div>
          </div>

          <div className="p-4 sm:p-6 overflow-x-auto text-[13px] font-mono leading-relaxed max-h-[580px]">
            <pre className="text-slate-200">
              {selectedFile.code.split('\n').map((line, index) => {
                const lineNum = index + 1;
                // Simple highlight helpers
                const isComment = line.trim().startsWith('//') || line.trim().startsWith('///');
                const isAttribute = line.trim().startsWith('[');
                const isKeyword = line.includes('public') || line.includes('class') || line.includes('async') || line.includes('Task') || line.includes('return') || line.includes('if');

                return (
                  <div key={lineNum} className="table-row hover:bg-slate-900/50">
                    <span className="table-cell select-none text-slate-600 text-right pr-4 pl-1 text-[11px] font-mono tabular-nums">
                      {lineNum}
                    </span>
                    <span className={`table-cell whitespace-pre ${
                      isComment ? 'text-slate-500 italic' :
                      isAttribute ? 'text-amber-400' :
                      line.includes('RuleFor') ? 'text-indigo-300 font-semibold' :
                      line.includes('ValidateAsync') ? 'text-emerald-400 font-semibold' :
                      line.includes('BadRequest') ? 'text-rose-400' :
                      line.includes('Enes Öztürk') ? 'text-indigo-400 font-bold' :
                      'text-slate-200'
                    }`}>
                      {line}
                    </span>
                  </div>
                );
              })}
            </pre>
          </div>

          <div className="px-4 py-2 bg-slate-900/80 border-t border-slate-800 text-xs text-slate-400 flex items-center justify-between font-mono">
            <span>Lines: {selectedFile.code.split('\n').length}</span>
            <span className="text-emerald-400 flex items-center gap-1 font-sans text-xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Production Ready (C# 12 / .NET 8+)</span>
            </span>
          </div>
        </div>

        {/* Educational Rule Summary Card for Selected File */}
        <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-white">
            <Info className="w-4 h-4 text-indigo-500" />
            <span>Bu Sınıfın Kritik Mimari ve Doğrulama Prensipleri:</span>
          </div>

          {selectedFile.id === 'update-validator' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Id Doğrulaması:</strong> Güncellenecek nesnenin veritabanında karşılığı olması için <code className="font-mono text-indigo-600 dark:text-indigo-400">Id &gt; 0</code> şartı aranır.</li>
              <li><strong>PrecisionScale(18, 2):</strong> Fiyat alanının mali standartlara uygun şekilde en fazla 2 basamaklı ondalık içerebilmesi sağlanır.</li>
              <li><strong>Şarta Bağlı Kural (When):</strong> Açıklama alanı boş bırakılabilir ancak doldurulmuşsa en fazla 500 karakter olabilir.</li>
              <li><strong>XSS & Güvenlik Koruması:</strong> <code className="font-mono text-indigo-600 dark:text-indigo-400">Must(NotContainForbiddenKeywords)</code> ile tehlikeli script enjeksiyonları engellenir.</li>
            </ul>
          )}

          {selectedFile.id === 'delete-validator' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Silme Nedeni (Audit Log):</strong> Kurumsal sistemlerde kayıtsız silme yapılmaması için en az 5 karakterlik <code className="font-mono text-indigo-600 dark:text-indigo-400">Reason</code> zorunlu tutulmuştur.</li>
              <li><strong>DeletedBy:</strong> Silme talebini yapan kişinin kurumsal e-posta formatında olması doğrulanır.</li>
              <li><strong>Kalıcı Silme Onayı:</strong> <code className="font-mono text-indigo-600 dark:text-indigo-400">Equal(true)</code> kuralı ile kazara veri kaybı engellenir.</li>
            </ul>
          )}

          {selectedFile.id === 'getbyid-validator' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Fail-Fast İlkesi:</strong> Geçersiz (0 veya negatif) Id ile gereksiz yere veritabanına sorgu atılması engellenir.</li>
              <li><strong>Overflow Güvencesi:</strong> <code className="font-mono text-indigo-600 dark:text-indigo-400">int.MaxValue</code> kontrolü ile tamsayı taşmaları önlenir.</li>
            </ul>
          )}

          {selectedFile.id === 'products-controller' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Metot Öncesi Yürütme:</strong> Ödev gereksinimi uyarınca, her metodun başında <code className="font-mono text-indigo-600 dark:text-indigo-400">await _validator.ValidateAsync(...)</code> manuel olarak çağrılır.</li>
              <li><strong>Servis İzolasyonu:</strong> Validasyon <code className="font-mono text-indigo-600 dark:text-indigo-400">!validationResult.IsValid</code> ise servis çağrısı ASLA yapılmaz, anında <code className="font-mono text-rose-500">400 Bad Request</code> döndürülür.</li>
              <li><strong>Route vs Body Uyuşmazlığı:</strong> URL'deki ID ile gönderilen nesne ID'si eşleşmediğinde güvenlik gereği işlem iptal edilir.</li>
            </ul>
          )}

          {selectedFile.id === 'dtos' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Ayrık Sorumluluk:</strong> Domain Entity'leri doğrudan dışarıya açılmaz; her işlem için özelleştirilmiş DTO'lar kullanılır.</li>
            </ul>
          )}

          {selectedFile.id === 'program-cs' && (
            <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-disc pl-5">
              <li><strong>Otomatik DI Taraması:</strong> <code className="font-mono text-indigo-600 dark:text-indigo-400">AddValidatorsFromAssemblyContaining</code> ile assembly içerisindeki tüm validatörler tek satırda Dependency Injection havuzuna eklenir.</li>
            </ul>
          )}
        </div>

      </div>
    </section>
  );
};
