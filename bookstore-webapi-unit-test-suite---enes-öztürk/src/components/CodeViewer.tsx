/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

import React, { useState } from 'react';
import { Copy, Check, Download, FileCode, CheckCircle, Code2, ShieldCheck, ChevronRight } from 'lucide-react';
import { TEST_FILES, TestFileItem } from '../data/testFiles';
import { downloadFile } from '../utils/zipExporter';

export const CodeViewer: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState<string>('delete-book-command-tests');
  const [activeSubTab, setActiveSubTab] = useState<'test' | 'source' | 'validator'>('test');
  const [copied, setCopied] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'All' | 'Book' | 'Genre' | 'Author' | 'Setup'>('All');

  const selectedFile = TEST_FILES.find((f) => f.id === selectedFileId) || TEST_FILES[0];

  const currentContent =
    activeSubTab === 'source' && selectedFile.sourceCode
      ? selectedFile.sourceCode
      : activeSubTab === 'validator' && selectedFile.validatorCode
      ? selectedFile.validatorCode
      : selectedFile.code;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadSingle = () => {
    const ext = selectedFile.filename;
    downloadFile(ext, currentContent, 'text/plain');
  };

  const filteredFiles = TEST_FILES.filter((f) => {
    if (categoryFilter === 'All') return true;
    return f.category === categoryFilter;
  });

  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
              <span>C# 10 / .NET 6</span>
              <span aria-hidden="true">·</span>
              <span>xUnit & FluentAssertions</span>
              <span aria-hidden="true">·</span>
              <span className="text-indigo-400 font-medium">İmza: Enes Öztürk</span>
            </div>
            <h2 className="text-xl font-bold tracking-tight text-white">
              C# Birim Test ve Kaynak Kod Gezgini
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Tüm komut, sorgu ve doğrulayıcı test sınıflarını inceleyebilir, kopyalayabilir veya `.cs` dosyası olarak indirebilirsiniz.
            </p>
          </div>

          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['All', 'Book', 'Genre', 'Author', 'Setup'] as const).map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  categoryFilter === cat
                    ? 'bg-indigo-600 text-white font-semibold'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {cat === 'All' ? 'Tümü' : cat}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Grid: File List (Left) and Code Box (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Side: File Explorer */}
        <div className="lg:col-span-4 space-y-2 max-h-[720px] overflow-y-auto pr-1">
          {filteredFiles.map((file) => {
            const isSelected = file.id === selectedFile.id;
            return (
              <button
                key={file.id}
                onClick={() => {
                  setSelectedFileId(file.id);
                  setActiveSubTab('test');
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all flex items-start gap-3 ${
                  isSelected
                    ? 'bg-slate-800/90 border-indigo-500 shadow-sm'
                    : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                }`}
              >
                <div className="mt-0.5 text-indigo-400 shrink-0">
                  <FileCode className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-xs font-semibold text-white truncate">
                      {file.filename}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono shrink-0">
                      {file.category}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400 truncate mt-0.5">
                    {file.path}
                  </div>
                </div>
                <ChevronRight className={`w-3.5 h-3.5 mt-1 shrink-0 text-slate-500 ${isSelected ? 'text-indigo-400' : ''}`} />
              </button>
            );
          })}
        </div>

        {/* Right Side: Code Window */}
        <div className="lg:col-span-8 bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[720px]">
          {/* Top Bar with Sub-tabs and Copy/Download actions */}
          <div className="bg-slate-900 border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 shrink-0">
            {/* View Sub-Tabs */}
            <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
              <button
                onClick={() => setActiveSubTab('test')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                  activeSubTab === 'test'
                    ? 'bg-indigo-600 text-white'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                <span>Birim Test Kodu (xUnit)</span>
              </button>

              {selectedFile.sourceCode && (
                <button
                  onClick={() => setActiveSubTab('source')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                    activeSubTab === 'source'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <FileCode className="w-3.5 h-3.5" />
                  <span>Servis / Handler</span>
                </button>
              )}

              {selectedFile.validatorCode && (
                <button
                  onClick={() => setActiveSubTab('validator')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded font-medium transition-colors ${
                    activeSubTab === 'validator'
                      ? 'bg-indigo-600 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Validator</span>
                </button>
              )}
            </div>

            {/* Action Buttons: Copy & Download */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded border border-slate-700 transition-colors"
                title="Kodu Panoya Kopyala"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400 font-semibold">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kopyala</span>
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadSingle}
                className="flex items-center gap-1.5 px-3 py-1 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 active:bg-slate-600 rounded border border-slate-700 transition-colors"
                title="Bu .cs dosyasını indir"
              >
                <Download className="w-3.5 h-3.5 text-slate-400" />
                <span>İndir (.cs)</span>
              </button>
            </div>
          </div>

          {/* File path banner & description */}
          <div className="bg-slate-900/60 border-b border-slate-800/80 px-4 py-2 flex items-center justify-between text-xs text-slate-400">
            <span className="font-mono text-indigo-300 truncate">
              {selectedFile.path}
            </span>
            <span className="shrink-0 text-slate-400">
              Geliştirici: <strong className="text-slate-200 font-normal">{selectedFile.author}</strong>
            </span>
          </div>

          {/* Code Textarea / Display */}
          <div className="flex-1 overflow-auto p-4 font-mono text-xs text-slate-200 leading-relaxed bg-slate-950">
            <pre className="overflow-x-auto whitespace-pre">
              <code>{currentContent}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};
