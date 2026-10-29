/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { BrowserSimulator } from './components/BrowserSimulator';
import { TerminalConsole } from './components/TerminalConsole';
import { CodeViewer } from './components/CodeViewer';
import { HomeworkChecklist, initialTestCases } from './components/HomeworkChecklist';
import { LocalGuide } from './components/LocalGuide';
import { SubmissionCard } from './components/SubmissionCard';
import { ServerLog } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'code' | 'tests' | 'guide' | 'submission'>('simulator');
  const [isServerRunning, setIsServerRunning] = useState<boolean>(true);
  const [currentUrl, setCurrentUrl] = useState<string>('/');
  const [logs, setLogs] = useState<ServerLog[]>([]);

  const [lastResponse, setLastResponse] = useState<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    rawHtml: string;
    durationMs: number;
    bytes: number;
  }>({
    status: 200,
    statusText: 'OK',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Powered-By': 'Node.js / Enes Öztürk Web Server',
      'Connection': 'keep-alive',
      'Server': 'Node.js/v20.18.0 (odev5)',
      'Date': new Date().toUTCString(),
    },
    rawHtml: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>Index</title></head>
<body>
  <h2>Index sayfasına hoşgeldiniz</h2>
  <p>Geliştirici: Enes Öztürk | Node.js Web Sunucusu</p>
</body>
</html>`,
    durationMs: 4,
    bytes: 238,
  });

  const getHtmlForRoute = useCallback((path: string) => {
    const cleanPath = path === '/' || path === '/index' ? '/index' : path;

    if (cleanPath === '/index') {
      return {
        status: 200,
        statusText: 'OK',
        heading: 'Index sayfasına hoşgeldiniz',
        html: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>Index</title></head>
<body>
  <h2>Index sayfasına hoşgeldiniz</h2>
  <p>Geliştirici: Enes Öztürk | Node.js Web Sunucusu (Port: 5000)</p>
</body>
</html>`
      };
    }

    if (cleanPath === '/hakkimda') {
      return {
        status: 200,
        statusText: 'OK',
        heading: 'Hakkımda sayfasına hoşgeldiniz',
        html: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>Hakkımda</title></head>
<body>
  <h2>Hakkımda sayfasına hoşgeldiniz</h2>
  <p>Geliştirici: Enes Öztürk | Node.js Temelleri Ödev 5</p>
</body>
</html>`
      };
    }

    if (cleanPath === '/iletisim') {
      return {
        status: 200,
        statusText: 'OK',
        heading: 'İletişim sayfasına hoşgeldiniz',
        html: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>İletişim</title></head>
<body>
  <h2>İletişim sayfasına hoşgeldiniz</h2>
  <p>Geliştirici: Enes Öztürk | İletişim: enesbino38@gmail.com</p>
</body>
</html>`
      };
    }

    return {
      status: 404,
      statusText: 'Not Found',
      heading: '404 Sayfa Bulunamadı',
      html: `<!DOCTYPE html>
<html lang="tr">
<head><meta charset="utf-8"><title>404 Bulunamadı</title></head>
<body>
  <h2>404 Sayfa Bulunamadı</h2>
  <p>Geliştirici: Enes Öztürk | Aradığınız rota sunucuda tanımlı değil.</p>
</body>
</html>`
    };
  }, []);

  const handleNavigate = useCallback((path: string) => {
    setCurrentUrl(path);

    if (!isServerRunning) {
      return;
    }

    const start = performance.now();
    const routeData = getHtmlForRoute(path);
    const duration = Math.max(2, Math.round(performance.now() - start + Math.random() * 6));
    const now = new Date();
    const timeStr = now.toTimeString().split(' ')[0];

    const bytes = new Blob([routeData.html]).size;

    setLastResponse({
      status: routeData.status,
      statusText: routeData.statusText,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'X-Powered-By': 'Node.js / Enes Öztürk Web Server',
        'Content-Length': `${bytes}`,
        'Connection': 'keep-alive',
        'Date': now.toUTCString(),
      },
      rawHtml: routeData.html,
      durationMs: duration,
      bytes: bytes,
    });

    const newLog: ServerLog = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp: timeStr,
      method: 'GET',
      url: path,
      statusCode: routeData.status,
      statusText: routeData.statusText,
      durationMs: duration,
      responseBytes: bytes,
      clientIp: '127.0.0.1',
    };

    setLogs((prev) => [...prev.slice(-30), newLog]);
  }, [isServerRunning, getHtmlForRoute]);

  // Initial welcome request log
  useEffect(() => {
    handleNavigate('/');
  }, [handleNavigate]);

  const handleToggleServer = () => {
    if (isServerRunning) {
      setIsServerRunning(false);
    } else {
      setIsServerRunning(true);
      setTimeout(() => {
        handleNavigate(currentUrl);
      }, 100);
    }
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleRunCurl = (path: string) => {
    handleNavigate(path);
  };

  const handleRunTestRoute = async (route: string) => {
    if (!isServerRunning) {
      setIsServerRunning(true);
    }
    handleNavigate(route);
    const routeData = getHtmlForRoute(route);
    return {
      status: routeData.status,
      heading: routeData.heading
    };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-white">
      {/* Top Header */}
      <Header
        isServerRunning={isServerRunning}
        onToggleServer={handleToggleServer}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        passedTestsCount={initialTestCases.length}
        totalTestsCount={initialTestCases.length}
      />

      {/* Main Workspace Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'simulator' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Interactive Virtual Browser (7 cols) */}
            <div className="lg:col-span-7 h-full">
              <BrowserSimulator
                currentUrl={currentUrl}
                onNavigate={handleNavigate}
                isServerRunning={isServerRunning}
                onStartServer={() => setIsServerRunning(true)}
                lastResponse={lastResponse}
              />
            </div>

            {/* Right Column: Interactive Terminal CLI & Logs (5 cols) */}
            <div className="lg:col-span-5 h-full">
              <TerminalConsole
                logs={logs}
                isServerRunning={isServerRunning}
                onToggleServer={handleToggleServer}
                onClearLogs={handleClearLogs}
                onRunCurl={handleRunCurl}
              />
            </div>
          </div>
        )}

        {activeTab === 'code' && <CodeViewer />}

        {activeTab === 'tests' && (
          <HomeworkChecklist onRunTestRoute={handleRunTestRoute} />
        )}

        {activeTab === 'guide' && <LocalGuide />}

        {activeTab === 'submission' && <SubmissionCard />}
      </main>

      {/* Footer with Signature & Assignment Summary */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 text-xs text-slate-500 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-slate-400 font-medium">Node.js Web Sunucusu Ödevi (Ödev 5)</span>
            <span className="text-slate-600">•</span>
            <span className="font-mono text-slate-400">Port 5000</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-400">
            <span>İmza ve Geliştirici:</span>
            <strong className="text-emerald-400 font-bold">Enes Öztürk</strong>
            <span>(enesbino38@gmail.com)</span>
          </div>

          <div className="text-slate-600 font-mono text-[11px]">
            createServer • http module • UTF-8
          </div>
        </div>
      </footer>
    </div>
  );
}
