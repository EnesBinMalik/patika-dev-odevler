import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { Terminal } from './components/Terminal';
import { CrudControls } from './components/CrudControls';
import { FileInspector } from './components/FileInspector';
import { CodeViewer } from './components/CodeViewer';
import { DocsGuide } from './components/DocsGuide';
import { SubmissionChecklist } from './components/SubmissionChecklist';
import { fsService, AUTHOR_NAME } from './services/fsService';
import { FileStatus, LogEntry } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'docs'>('simulator');
  const [fileStatus, setFileStatus] = useState<FileStatus | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isRunningAll, setIsRunningAll] = useState<boolean>(false);
  const [lastExecutedStep, setLastExecutedStep] = useState<'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | null>(null);

  const [completedSteps, setCompletedSteps] = useState({
    create: false,
    read: false,
    update: false,
    delete: false,
    signed: true,
  });

  const getNow = () => new Date().toLocaleTimeString('tr-TR');

  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: 'init-1',
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      level: 'info',
      step: 'INIT',
      message: 'Node.js FS Modülü çalışma ortamı hazırlandı.',
    },
    {
      id: 'init-2',
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      level: 'signature',
      message: `Ödev 4 Hazırlayan & İmza: ${AUTHOR_NAME}`,
    },
  ]);

  const addLog = useCallback(
    (
      level: LogEntry['level'],
      message: string,
      step?: LogEntry['step'],
      method?: string,
      payload?: any
    ) => {
      setLogs((prev) => [
        ...prev,
        {
          id: Math.random().toString(36).substring(2, 9),
          timestamp: getNow(),
          level,
          step,
          message,
          method,
          payload,
        },
      ]);
    },
    []
  );

  const fetchStatus = useCallback(async () => {
    try {
      const status = await fsService.getStatus();
      setFileStatus(status);
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    fetchStatus();
  }, [fetchStatus]);

  // 1. CREATE
  const handleCreate = async (payload: { name: string; salary: number }) => {
    setIsProcessing(true);
    setLastExecutedStep('CREATE');
    addLog('info', 'employees.json oluşturma komutu gönderiliyor...', 'CREATE', 'fs.writeFile()');

    try {
      const res = await fsService.createFile(payload);
      addLog(
        'success',
        `employees.json başarıyla oluşturuldu ve veriler yazıldı.`,
        'CREATE',
        res.method || 'fs.writeFile("employees.json", data, "utf8")',
        payload
      );
      setCompletedSteps((prev) => ({ ...prev, create: true, signed: true }));
      await fetchStatus();
    } catch (err: any) {
      addLog('error', `Oluşturma başarısız: ${err.message}`, 'CREATE', 'fs.writeFile()');
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. READ
  const handleRead = async () => {
    setIsProcessing(true);
    setLastExecutedStep('READ');
    addLog('info', 'employees.json dosyası okunuyor...', 'READ', 'fs.readFile()');

    try {
      const res = await fsService.readFile();
      addLog(
        'success',
        `employees.json başarıyla okundu. Konsol çıktısı:`,
        'READ',
        res.method || 'fs.readFile("employees.json", "utf8")',
        res.data
      );
      setCompletedSteps((prev) => ({ ...prev, read: true }));
      await fetchStatus();
    } catch (err: any) {
      addLog('error', `Okuma başarısız: ${err.message}`, 'READ', 'fs.readFile()');
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. UPDATE
  const handleUpdate = async (payload: { name: string; salary: number; updatedBy: string }) => {
    setIsProcessing(true);
    setLastExecutedStep('UPDATE');
    addLog('info', 'employees.json içeriği güncelleniyor...', 'UPDATE', 'fs.writeFile()');

    try {
      const res = await fsService.updateFile(payload);
      addLog(
        'success',
        `employees.json verisi güncellendi (Yeni maaş: ${payload.salary} TL, İmza: ${payload.updatedBy}).`,
        'UPDATE',
        res.method || 'fs.writeFile("employees.json", updatedData, "utf8")',
        res.updatedData
      );
      setCompletedSteps((prev) => ({ ...prev, update: true, signed: true }));
      await fetchStatus();
    } catch (err: any) {
      addLog('error', `Güncelleme başarısız: ${err.message}`, 'UPDATE', 'fs.writeFile()');
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. DELETE
  const handleDelete = async () => {
    setIsProcessing(true);
    setLastExecutedStep('DELETE');
    addLog('info', 'employees.json dosyası siliniyor...', 'DELETE', 'fs.unlink()');

    try {
      const res = await fsService.deleteFile();
      addLog(
        'warn',
        `employees.json dosyası başarıyla silindi.`,
        'DELETE',
        res.method || 'fs.unlink("employees.json")'
      );
      setCompletedSteps((prev) => ({ ...prev, delete: true }));
      await fetchStatus();
    } catch (err: any) {
      addLog('error', `Silme başarısız: ${err.message}`, 'DELETE', 'fs.unlink()');
    } finally {
      setIsProcessing(false);
    }
  };

  // RUN ALL AUTOMATED WORKFLOW
  const handleRunAll = async () => {
    if (isRunningAll) return;
    setIsRunningAll(true);
    setActiveTab('simulator');

    addLog(
      'signature',
      `══════ ÖDEV 4: OTOMATİK ÇALIŞTIRMA BAŞLATILDI (İmza: ${AUTHOR_NAME}) ══════`,
      'ALL'
    );

    try {
      // Step 1: CREATE
      await handleCreate({ name: 'Employee 1 Name', salary: 2000 });
      await new Promise((r) => setTimeout(r, 650));

      // Step 2: READ
      await handleRead();
      await new Promise((r) => setTimeout(r, 650));

      // Step 3: UPDATE
      await handleUpdate({
        name: 'Employee 1 Name',
        salary: 2500,
        updatedBy: AUTHOR_NAME,
      });
      await new Promise((r) => setTimeout(r, 650));

      // Step 4: DELETE
      await handleDelete();

      addLog(
        'success',
        `🎉 Tebrikler! Tüm CRUD aşamaları (Yarat, Oku, Güncelle, Sil) başarıyla icra edildi.`,
        'ALL'
      );
      addLog(
        'signature',
        `Teslimat Sahibi: ${AUTHOR_NAME} • Kodluyoruz Node.js Ödev 4`,
        'ALL'
      );
    } catch (err: any) {
      addLog('error', `Otomatik yürütmede hata: ${err.message}`, 'ALL');
    } finally {
      setIsRunningAll(false);
    }
  };

  const handleAddSignatureLog = () => {
    addLog(
      'signature',
      `✓ ONAYLI İMZA: ENES ÖZTÜRK tarafından hazırlanmış Node.js FS CRUD çözümü.`,
      'STATUS'
    );
  };

  const handleClearLogs = () => {
    setLogs([
      {
        id: 'cleared',
        timestamp: getNow(),
        level: 'info',
        message: 'Terminal temizlendi.',
      },
    ]);
  };

  return (
    <div className="min-h-screen bg-[#070a11] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-white">
      {/* Top Bar Header */}
      <Header
        onRunAll={handleRunAll}
        isRunningAll={isRunningAll}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {activeTab === 'simulator' && (
          <div className="space-y-6">
            {/* Top row: CRUD Controls & File Inspector */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              {/* Left Column: Interactive CRUD cards (7 cols) */}
              <div className="lg:col-span-7 space-y-6">
                <CrudControls
                  fileStatus={fileStatus}
                  onCreate={handleCreate}
                  onRead={handleRead}
                  onUpdate={handleUpdate}
                  onDelete={handleDelete}
                  isProcessing={isProcessing || isRunningAll}
                  lastExecutedStep={lastExecutedStep}
                />

                {/* Submission Checklist */}
                <SubmissionChecklist completedSteps={completedSteps} />
              </div>

              {/* Right Column: File System Inspector & Live Terminal (5 cols) */}
              <div className="lg:col-span-5 space-y-6 flex flex-col">
                <FileInspector fileStatus={fileStatus} onRefresh={fetchStatus} />

                <div className="flex-1 min-h-[360px]">
                  <Terminal
                    logs={logs}
                    onClearLogs={handleClearLogs}
                    onAddSignatureLog={handleAddSignatureLog}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'code' && (
          <div className="max-w-5xl mx-auto">
            <CodeViewer />
          </div>
        )}

        {activeTab === 'docs' && (
          <div className="max-w-5xl mx-auto">
            <DocsGuide />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-4 px-4 text-center text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span>Node.js FS Modülü • Ödev 4</span>
            <span className="text-slate-600">|</span>
            <span>employees.json CRUD İşlemleri</span>
          </div>
          <div className="flex items-center gap-1.5 font-mono">
            <span>İmza:</span>
            <strong className="text-emerald-400 font-semibold">{AUTHOR_NAME}</strong>
            <span className="text-slate-600">|</span>
            <span className="text-slate-400">Tüm Hakları Saklıdır</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
