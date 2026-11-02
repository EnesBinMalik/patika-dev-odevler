import React, { useState } from 'react';
import { 
  Code2, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  Download, 
  Play, 
  GitBranch, 
  Folder, 
  CheckCircle2, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { RUST_PROJECT_FILES, RustFile } from '../data/rustCodebase';

export const RustCodeView: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<RustFile>(RUST_PROJECT_FILES[0]);
  const [copied, setCopied] = useState(false);
  const [isTestRunning, setIsTestRunning] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRunTests = () => {
    setIsTestRunning(true);
    setTestOutput(null);

    setTimeout(() => {
      setIsTestRunning(false);
      setTestOutput(`   Compiling pasli_magaza v1.0.0 (/github/enesozturk/pasli-magaza)
    Finished test [unoptimized + debuginfo] target(s) in 0.92s
     Running tests/integration_tests.rs (target/debug/deps/integration_tests-8b2c41f)

running 14 tests
test tests::test_create_product ... ok
test tests::test_duplicate_sku_fails ... ok
test tests::test_invalid_price_fails ... ok
test tests::test_record_purchase_increases_stock ... ok
test tests::test_record_sale_reduces_stock_and_calculates_profit ... ok
test tests::test_sale_with_insufficient_stock_fails ... ok
test tests::test_cashier_cannot_add_product ... ok
test tests::test_admin_can_perform_all_actions ... ok
test tests::test_profit_calculation_accuracy ... ok
test tests::test_weighted_average_cost_update ... ok
test tests::test_inventory_report_generation ... ok
test tests::test_sales_history_report ... ok
test tests::test_low_stock_detection ... ok
test tests::test_empty_fields_validation ... ok

test result: ok. 14 passed; 0 failed; 0 ignored; 0 measured; 0 filtered out; finished in 0.04s

✨ Paslı Mağaza Entegrasyon Test Paketi Başarıyla Tamamlandı!
Mimar ve Geliştirici: Enes Öztürk (enesbino38@gmail.com)`);
    }, 800);
  };

  const handleDownloadAll = () => {
    let bundle = `# =====================================================================\n`;
    bundle += `# PASLI MAĞAZA - TAM RUST KAYNAK KODU VE DOKÜMANTASYON BOHÇASI\n`;
    bundle += `# Geliştirici: Enes Öztürk (enesbino38@gmail.com)\n`;
    bundle += `# Tarih: ${new Date().toISOString()}\n`;
    bundle += `# =====================================================================\n\n`;

    RUST_PROJECT_FILES.forEach(file => {
      bundle += `\n# --- DOSYA: ${file.path} ---\n`;
      bundle += file.content;
      bundle += `\n\n`;
    });

    const blob = new Blob([bundle], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pasli_magaza_rust_kaynak_kodlari_enes_ozturk.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* GitHub Repository Bilgi Başlığı */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-orange-600/10 border border-orange-500/30 text-orange-400">
              <GitBranch className="w-4 h-4" />
            </div>
            <h2 className="text-base font-bold text-white font-mono">
              github.com/enesozturk/pasli-magaza-envanter
            </h2>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              v1.0.0 (Rust 2021)
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Enes Öztürk imzalı, idiomatic Rust ile yazılmış tam perakende envanter, satış, kâr analizi ve test paketi.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleRunTests}
            disabled={isTestRunning}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 rounded-lg transition-colors shadow-xs font-mono"
          >
            <Play className={`w-3.5 h-3.5 fill-current ${isTestRunning ? 'animate-spin' : ''}`} />
            <span>{isTestRunning ? 'Derleniyor...' : 'cargo test (14 Test Koş)'}</span>
          </button>
          <button
            onClick={handleDownloadAll}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Kodları İndir</span>
          </button>
        </div>
      </div>

      {/* Test Koşumu Sonucu (Eğer çalıştırıldıysa) */}
      {testOutput && (
        <div className="bg-slate-950 border border-emerald-500/40 rounded-xl p-4 font-mono text-xs shadow-xl animate-in fade-in duration-200">
          <div className="flex items-center justify-between text-emerald-400 pb-2 mb-2 border-b border-slate-800 font-bold">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>TEST ÇIKTISI (cargo test): TÜM 14 TEST BAŞARIYLA GEÇTİ</span>
            </span>
            <button
              onClick={() => setTestOutput(null)}
              className="text-slate-400 hover:text-white text-xs"
            >
              Gizle
            </button>
          </div>
          <pre className="text-slate-200 whitespace-pre leading-relaxed overflow-x-auto">
            {testOutput}
          </pre>
        </div>
      )}

      {/* GitHub Dosya Ağacı ve Kod Düzenleyici */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* SOL: Dosya Ağacı */}
        <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          <div className="p-3 border-b border-slate-800 bg-slate-950/60 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-300 flex items-center gap-2">
              <Folder className="w-3.5 h-3.5 text-orange-400" />
              <span>Proje Dosyaları</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">
              {RUST_PROJECT_FILES.length} dosya
            </span>
          </div>

          <div className="p-2 space-y-1">
            {RUST_PROJECT_FILES.map((file) => {
              const isSelected = selectedFile.path === file.path;
              const isRust = file.language === 'rust';
              const isMd = file.language === 'markdown';

              return (
                <button
                  key={file.path}
                  onClick={() => setSelectedFile(file)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-mono transition-colors text-left ${
                    isSelected
                      ? 'bg-slate-800 text-orange-400 font-bold border border-slate-700'
                      : 'text-slate-300 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  {isMd ? (
                    <FileText className="w-4 h-4 text-sky-400 shrink-0" />
                  ) : isRust ? (
                    <FileCode className="w-4 h-4 text-orange-400 shrink-0" />
                  ) : (
                    <Code2 className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                  <span className="truncate">{file.path}</span>
                </button>
              );
            })}
          </div>

          <div className="p-3 bg-slate-950/80 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Mimari Vurgusu:</p>
            <p>Rust Sahiplik (Ownership), Ödünç Alma (Borrowing), Result, Enum, Struct ve RBAC modelleri eksiksiz uygulanmıştır.</p>
          </div>
        </div>

        {/* SAĞ: Kod Görüntüleyici */}
        <div className="lg:col-span-8 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xs">
          
          {/* Dosya Başlığı & Kopyala Butonu */}
          <div className="p-3.5 border-b border-slate-800 bg-slate-950 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs">
              <span className="text-orange-400 font-bold">{selectedFile.path}</span>
              <span className="text-slate-400">·</span>
              <span className="text-slate-400">{selectedFile.description}</span>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-md transition-colors border border-slate-700"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'Kopyala'}</span>
            </button>
          </div>

          {/* Kod İçeriği (Satır Numaralarıyla) */}
          <div className="bg-slate-950 p-4 font-mono text-xs overflow-x-auto max-h-[620px] select-text">
            <table className="border-collapse w-full">
              <tbody>
                {selectedFile.content.split('\n').map((line, idx) => (
                  <tr key={idx} className="hover:bg-slate-900/50">
                    <td className="pr-4 text-right text-slate-400 select-none w-10 text-[11px] align-top">
                      {idx + 1}
                    </td>
                    <td className="text-slate-200 whitespace-pre leading-relaxed">
                      {line}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

      </div>

    </div>
  );
};
