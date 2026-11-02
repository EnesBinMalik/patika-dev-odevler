import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { AssignmentBrief } from './components/AssignmentBrief';
import { ChecklistCard } from './components/ChecklistCard';
import { CodeEditor, CODE_PRESETS } from './components/CodeEditor';
import { TerminalOutput } from './components/TerminalOutput';
import { MemoryVisualizer } from './components/MemoryVisualizer';
import { OwnershipGuide } from './components/OwnershipGuide';
import { CertificateModal } from './components/CertificateModal';
import { analyzeRustCode, generateExecutionSteps } from './utils/rustAnalyzer';
import { executeRustCode } from './utils/rustRunner';
import { CompilationResult } from './types/rust';
import { Award, ShieldCheck, Heart } from 'lucide-react';

export default function App() {
  const [code, setCode] = useState<string>(CODE_PRESETS.default.code);
  const [selectedPreset, setSelectedPreset] = useState<string>('default');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<CompilationResult | null>(null);
  const [isCertificateOpen, setIsCertificateOpen] = useState<boolean>(false);

  // Live code analysis
  const analysis = analyzeRustCode(code);
  const steps = generateExecutionSteps(
    analysis.extractedValues.string1,
    analysis.extractedValues.string2
  );

  // Initial run on mount so student immediately experiences the complete working output
  useEffect(() => {
    handleRunCode(CODE_PRESETS.default.code);
  }, []);

  const handleRunCode = async (codeToRun?: string) => {
    setIsRunning(true);
    const targetCode = codeToRun || code;
    try {
      const res = await executeRustCode(targetCode);
      setResult(res);
    } catch {
      setResult({
        success: false,
        stdout: '',
        stderr: 'Beklenmedik bir hata oluştu.',
        executionTimeMs: 0,
        isRealPlayground: false,
        warnings: [],
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectPreset = (key: string) => {
    setSelectedPreset(key);
    const newCode = CODE_PRESETS[key]?.code || '';
    setCode(newCode);
    handleRunCode(newCode);
  };

  const handleReset = () => {
    handleSelectPreset('default');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/20 selection:text-amber-200">
      {/* Top Bar Navigation conforming to §2 */}
      <Header
        onRun={() => handleRunCode()}
        onReset={handleReset}
        isRunning={isRunning}
        allPassed={analysis.allPassed}
        onOpenCertificate={() => setIsCertificateOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Assignment Brief & Enes Öztürk Signature Block */}
        <AssignmentBrief
          allPassed={analysis.allPassed}
          onOpenCertificate={() => setIsCertificateOpen(true)}
        />

        {/* Live Automated Checklist */}
        <ChecklistCard
          checklist={analysis.checklist}
          allPassed={analysis.allPassed}
        />

        {/* Code Editor and Terminal Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-7">
            <CodeEditor
              code={code}
              onChange={(newVal) => setCode(newVal)}
              onRun={() => handleRunCode()}
              isRunning={isRunning}
              selectedPreset={selectedPreset}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          <div className="lg:col-span-5 flex flex-col gap-6">
            <TerminalOutput
              result={result}
              isRunning={isRunning}
              onClear={() => setResult(null)}
            />

            {/* Quick tips card */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-slate-400 space-y-2">
              <div className="flex items-center gap-2 text-slate-200 font-semibold">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Enes Öztürk'ten Öğrenciye İpucu</span>
              </div>
              <p className="leading-relaxed">
                Rust'ta bir fonksiyona dize aktarırken genel kural olarak <code className="text-amber-300 font-mono">&amp;String</code> yerine daima <code className="text-amber-300 font-mono">&amp;str</code> tercih edin. Bu sayede fonksiyon hem <code className="text-sky-300 font-mono">String</code> referanslarını hem de statik string literallerini (<code className="text-sky-300 font-mono">&amp;'static str</code>) ek dönüştürme yapmadan kabul edebilir.
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Stack & Heap Memory Model Visualizer */}
        <MemoryVisualizer steps={steps} />

        {/* Rust Ownership & Borrowing Deep Dive Guide */}
        <OwnershipGuide />
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-900 bg-slate-950 py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300 font-mono">🦀 Rust Laboratuvarı</span>
            <span aria-hidden="true">·</span>
            <span>Hazırlayan &amp; Onaylayan: <strong className="text-slate-300">Enes Öztürk</strong></span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span>Sahiplik (Ownership)</span>
            <span aria-hidden="true">·</span>
            <span>Ödünç Alma (Borrowing)</span>
            <span aria-hidden="true">·</span>
            <span>Dize Dilimleri (&amp;str)</span>
          </div>

          <div className="text-slate-500 font-mono text-[11px]">
            &copy; 2026 Enes Öztürk. Tüm hakları saklıdır.
          </div>
        </div>
      </footer>

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={isCertificateOpen}
        onClose={() => setIsCertificateOpen(false)}
        passedTasksCount={analysis.checklist.filter((c) => c.passed).length}
      />
    </div>
  );
}
