import React, { useState } from 'react';
import { BankingEngine } from '../services/bankingEngine';
import { AuditLogEntry, GitCommit } from '../types/banking';
import { FileText, GitBranch, Download, Copy, Check, Terminal, Search, Shield, Filter, CheckCircle2 } from 'lucide-react';

interface Module4LoggingGitProps {
  engine: BankingEngine;
  onRefresh: () => void;
}

export const Module4LoggingGit: React.FC<Module4LoggingGitProps> = ({ engine, onRefresh }) => {
  const [activeSubTab, setActiveSubTab] = useState<'logs' | 'git' | 'rawViewer'>('logs');
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCommit, setSelectedCommit] = useState<GitCommit | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [viewerFormat, setViewerFormat] = useState<'txt' | 'json'>('txt');

  const auditLogs = engine.getAuditLogs();
  const gitCommits = engine.getGitCommits();

  const filteredLogs = auditLogs.filter((log) => {
    const matchesLevel = filterLevel === 'ALL' || log.level === filterLevel;
    const matchesQuery =
      searchQuery === '' ||
      log.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.module.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLevel && matchesQuery;
  });

  const handleDownloadTxt = () => {
    const content = engine.generateAuditLogTxt();
    engine.downloadFile('bank_audit_log.txt', content, 'text/plain');
  };

  const handleDownloadJson = () => {
    const content = engine.generateTransactionsJson();
    engine.downloadFile('transactions_export.json', content, 'application/json');
  };

  const handleCopyFileContent = () => {
    const content = viewerFormat === 'txt' ? engine.generateAuditLogTxt() : engine.generateTransactionsJson();
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="p-5 bg-slate-900/80 border border-slate-800 rounded-2xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-yellow-400">
              <span>MODÜL 4</span>
              <span>·</span>
              <span>FILE I/O (.TXT / .JSON)</span>
              <span>·</span>
              <span>GIT VERSION CONTROL</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">Dosyalama, Loglama ve Versiyon Sistemi</h2>
            <p className="text-xs text-slate-400 mt-1 max-w-3xl">
              Tüm finansal hareketlerin <code className="text-emerald-300">.txt</code> ve <code className="text-cyan-300">.json</code> formatlarında
              fiziksel dosyalara stream edildiği, versiyon takibinin Git ile yapıldığı kurumsal geliştirici alanı.
              Tüm commitler ve loglar <strong className="text-white">Enes Öztürk</strong> imzalıdır.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleDownloadTxt}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>.txt İndir</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 rounded-lg transition-colors font-mono"
            >
              <Download className="w-3.5 h-3.5" />
              <span>.json İndir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Sub-tab Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveSubTab('logs')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
            activeSubTab === 'logs'
              ? 'bg-slate-800 text-white font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>Canlı Audit Log Akışı ({auditLogs.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('git')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
            activeSubTab === 'git'
              ? 'bg-slate-800 text-white font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <GitBranch className="w-3.5 h-3.5 text-yellow-400" />
          <span>GIT Versiyon Takibi (Enes Öztürk)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('rawViewer')}
          className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono rounded-lg transition-colors ${
            activeSubTab === 'rawViewer'
              ? 'bg-slate-800 text-white font-bold border border-slate-700'
              : 'text-slate-400 hover:text-slate-200'
          }`}
        >
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>Ham Dosya Önizleyici (TXT / JSON)</span>
        </button>
      </div>

      {/* SUB-TAB 1: LIVE AUDIT LOGS */}
      {activeSubTab === 'logs' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900/90 border border-slate-800 p-3 rounded-xl">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Search className="w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Loglarda ara (hesap, tutar, modül)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-950 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 font-mono outline-none focus:border-slate-600 w-full sm:w-72"
              />
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-mono">Seviye:</span>
              {['ALL', 'INFO', 'WARN', 'ERROR'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setFilterLevel(lvl)}
                  className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors ${
                    filterLevel === lvl
                      ? 'bg-slate-800 text-white font-bold border border-slate-700'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          {/* Logs List Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden">
            <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between text-xs font-mono text-slate-400">
              <span>Görüntülenen: {filteredLogs.length} Kayıt</span>
              <span>Hedef Dosya: C:\BankingSystem\Logs\bank_audit_log.txt</span>
            </div>

            <div className="max-h-[460px] overflow-y-auto divide-y divide-slate-800/60 font-mono text-xs">
              {filteredLogs.length === 0 ? (
                <div className="p-8 text-center text-slate-500">Kriterlere uygun audit kaydı bulunamadı.</div>
              ) : (
                filteredLogs.map((log) => (
                  <div key={log.id} className="p-3 hover:bg-slate-800/40 flex items-start gap-3 transition-colors">
                    <span className="text-slate-500 text-[11px] shrink-0 pt-0.5">{log.timestamp}</span>
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                        log.level === 'INFO'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : log.level === 'WARN'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {log.level}
                    </span>
                    <span className="text-cyan-400 text-[11px] font-semibold shrink-0">
                      [{log.module}]
                    </span>
                    <span className="text-slate-200 flex-1 break-words">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: GIT VERSION TRACKING */}
      {activeSubTab === 'git' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Commits List (7 cols) */}
          <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-yellow-400" />
                <h3 className="text-sm font-bold text-white font-mono">Git Commit Ağacı & Versiyon Takibi</h3>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                branch: main
              </span>
            </div>

            <div className="space-y-3 font-mono text-xs">
              {gitCommits.map((c) => {
                const isSelected = selectedCommit?.hash === c.hash;
                return (
                  <div
                    key={c.hash}
                    onClick={() => setSelectedCommit(c)}
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-slate-800 border-yellow-500/50 text-white'
                        : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-yellow-400 font-bold">{c.hash}</span>
                        <span className="text-slate-500 text-[11px]">{c.date}</span>
                      </div>
                      <span className="text-[11px] text-emerald-400">{c.author.split(' ')[0]} {c.author.split(' ')[1]}</span>
                    </div>

                    <p className="mt-1.5 text-slate-200 font-sans text-xs font-medium">{c.message}</p>

                    <div className="mt-2 flex items-center gap-1.5 text-[10px] text-slate-500">
                      <span>Değişen Dosyalar:</span>
                      <span className="text-slate-400">{c.changedFiles.length} dosya</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Commit Inspector (5 cols) */}
          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-4">
            <h3 className="text-sm font-bold text-white font-mono border-b border-slate-800 pb-2">
              Commit Detay İnceleyici (git show)
            </h3>

            {selectedCommit ? (
              <div className="space-y-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500 block">Commit Hash:</span>
                  <span className="text-yellow-400 font-bold">{selectedCommit.hash}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Geliştirici (Author):</span>
                  <span className="text-emerald-400 font-bold">{selectedCommit.author}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Tarih / Saat:</span>
                  <span className="text-slate-300">{selectedCommit.date}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">Mesaj:</span>
                  <p className="p-2.5 bg-slate-950 rounded border border-slate-800 text-slate-200 font-sans">
                    {selectedCommit.message}
                  </p>
                </div>
                <div>
                  <span className="text-slate-500 block mb-1">Değiştirilen Dosyalar:</span>
                  <div className="p-2 bg-slate-950 rounded border border-slate-800 space-y-1">
                    {selectedCommit.changedFiles.map((file, i) => (
                      <div key={i} className="text-slate-300 text-[11px] flex items-center gap-1.5">
                        <span className="text-emerald-400">+</span>
                        <span>{file}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 text-center text-slate-500 text-xs font-mono">
                Sol listeden bir commit seçerek detaylarını inceleyin.
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: RAW FILE VIEWER */}
      {activeSubTab === 'rawViewer' && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden space-y-0">
          <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewerFormat('txt')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  viewerFormat === 'txt'
                    ? 'bg-slate-800 text-emerald-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                bank_audit_log.txt
              </button>
              <button
                onClick={() => setViewerFormat('json')}
                className={`px-3 py-1 rounded text-xs font-mono transition-colors ${
                  viewerFormat === 'json'
                    ? 'bg-slate-800 text-cyan-400 font-bold border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                transactions_export.json
              </button>
            </div>

            <button
              onClick={handleCopyFileContent}
              className="flex items-center gap-1.5 px-3 py-1 text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 rounded border border-slate-700 font-mono transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Kopyalandı' : 'İçeriği Kopyala'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#0d1117] text-slate-300 font-mono text-xs overflow-x-auto max-h-[480px] leading-relaxed selection:bg-emerald-500/30">
            {viewerFormat === 'txt' ? engine.generateAuditLogTxt() : engine.generateTransactionsJson()}
          </pre>
        </div>
      )}
    </div>
  );
};
