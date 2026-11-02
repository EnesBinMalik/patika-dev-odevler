import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { EditorTab } from './components/EditorTab';
import { VisualizerTab } from './components/VisualizerTab';
import { ChecklistTab } from './components/ChecklistTab';
import { TheoryTab } from './components/TheoryTab';
import { TerminalTab } from './components/TerminalTab';
import { BEGINNER_CODE, PRESET_OPTIONS, INITIAL_CHECKLIST } from './data/rustSamples';
import { executeRustCode, RunResult } from './services/rustRunner';
import { ChecklistItem } from './types';
import { ShieldCheck, Heart, Terminal, Cpu, FileCode, CheckCircle2, Sparkles } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'editor' | 'visualizer' | 'checklist' | 'theory' | 'terminal'>('editor');
  const [selectedPresetId, setSelectedPresetId] = useState<string>('beginner_i32');
  const [code, setCode] = useState<string>(BEGINNER_CODE);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [checklistItems, setChecklistItems] = useState<ChecklistItem[]>(INITIAL_CHECKLIST);

  // Auto-run on first load so user immediately sees live cargo output!
  useEffect(() => {
    handleRunCode(BEGINNER_CODE);
  }, []);

  const handleRunCode = async (codeToRun: string = code) => {
    setIsRunning(true);
    try {
      const result = await executeRustCode(codeToRun);
      setRunResult(result);
    } catch {
      setRunResult({
        success: false,
        stdout: '',
        stderr: 'Beklenmeyen bir hata oluştu. Lütfen tekrar deneyin.',
        executionTimeMs: 0,
        isOfficialPlayground: false,
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleSelectPreset = (presetId: string) => {
    setSelectedPresetId(presetId);
    const preset = PRESET_OPTIONS.find((p) => p.id === presetId);
    if (preset) {
      setCode(preset.code);
      handleRunCode(preset.code);
    }
  };

  const handleReset = () => {
    const preset = PRESET_OPTIONS.find((p) => p.id === selectedPresetId);
    if (preset) {
      setCode(preset.code);
      handleRunCode(preset.code);
    }
  };

  const handleToggleChecklistItem = (id: number) => {
    setChecklistItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const handleSetAllChecklist = (completed: boolean) => {
    setChecklistItems((prev) => prev.map((item) => ({ ...item, completed })));
  };

  const handleJumpToEditorWithCode = (snippet: string) => {
    setActiveTab('editor');
    // Scroll or bring focus to editor
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activePreset = PRESET_OPTIONS.find((p) => p.id === selectedPresetId) || PRESET_OPTIONS[0];
  const completedChecklistCount = checklistItems.filter((i) => i.completed).length;

  return (
    <div className="min-h-screen bg-[#0a0c12] text-slate-100 flex flex-col font-sans selection:bg-orange-500/30 selection:text-orange-200">
      {/* Top Navigation & Signature Bar */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onRun={() => handleRunCode(code)}
        isRunning={isRunning}
        completedCount={completedChecklistCount}
        totalChecklist={checklistItems.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'editor' && (
          <EditorTab
            code={code}
            setCode={setCode}
            onRun={() => handleRunCode(code)}
            isRunning={isRunning}
            runResult={runResult}
            onSelectPreset={handleSelectPreset}
            selectedPresetId={selectedPresetId}
            onReset={handleReset}
          />
        )}

        {activeTab === 'visualizer' && (
          <VisualizerTab
            initialItems={activePreset.initialItems}
            initialCondition={activePreset.initialCondition}
          />
        )}

        {activeTab === 'checklist' && (
          <ChecklistTab
            items={checklistItems}
            onToggleItem={handleToggleChecklistItem}
            onSetAll={handleSetAllChecklist}
            onJumpToEditorWithCode={handleJumpToEditorWithCode}
          />
        )}

        {activeTab === 'theory' && <TheoryTab />}

        {activeTab === 'terminal' && (
          <TerminalTab onRunMainCode={() => handleRunCode(code)} />
        )}
      </main>

      {/* Global Bottom Signature & Credit Bar */}
      <footer className="border-t border-zinc-800/80 bg-[#0c0e16] py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-400 font-mono font-bold">
              🦀
            </div>
            <div>
              <div className="font-semibold text-zinc-200">
                Rust Özel Filtreleme Laboratuvarı (Kapanışsız Çözüm)
              </div>
              <div className="text-[11px] text-zinc-500">
                FilterCondition • is_match • custom_filter • Vec&lt;T&gt;
              </div>
            </div>
          </div>

          {/* Prominent Enes Öztürk Signature */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-zinc-900 border border-amber-500/30 shadow-sm">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <div className="text-right">
              <span className="text-[10px] text-zinc-400 uppercase tracking-wider block">
                Ödev Hazırlayan & İmzacı
              </span>
              <span className="text-sm font-bold text-amber-300">
                Enes Öztürk
              </span>
            </div>
          </div>

          <div className="text-[11px] text-zinc-500 text-center sm:text-right font-mono">
            Rust 2021 Edition • Cargo my_project
          </div>
        </div>
      </footer>
    </div>
  );
}
