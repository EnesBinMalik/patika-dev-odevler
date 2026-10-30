/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Source Code and Schema Exporter
 */
import React, { useState } from 'react';
import { Copy, Check, FileCode, CheckCircle2, Download, Terminal } from 'lucide-react';
import { codeFiles } from '../graphql/codeExports';

export const CodeViewer: React.FC = () => {
  const [activeFileIndex, setActiveFileIndex] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const activeFile = codeFiles[activeFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(activeFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Title & Author Info */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2 py-0.5 rounded bg-purple-500/10 text-purple-300 border border-purple-500/20 font-medium">
              Ödev Teslim Kaynak Kodları
            </span>
            <span className="text-xs text-slate-400">Patika.dev / Apollo Server Uyumlu</span>
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight mt-1">
            Schema ve Resolvers Dosyaları
          </h2>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Aşağıdaki kodları doğrudan Apollo Server projenize aktarabilir veya GitHub ödev deponuza
            yükleyebilirsiniz. Kodların başında Enes Öztürk imzası yer almaktadır.
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition shadow-lg shadow-purple-600/20"
        >
          {copied ? (
            <>
              <Check className="w-4 h-4 text-emerald-300" />
              <span>Dosya Kopyalandı!</span>
            </>
          ) : (
            <>
              <Copy className="w-4 h-4" />
              <span>{activeFile.name} Kopyala</span>
            </>
          )}
        </button>
      </div>

      {/* File Tabs */}
      <div className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-800 bg-slate-950 px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-2">
            {codeFiles.map((file, idx) => (
              <button
                key={file.name}
                onClick={() => setActiveFileIndex(idx)}
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-mono transition ${
                  activeFileIndex === idx
                    ? 'bg-slate-800 text-purple-300 font-semibold border border-purple-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                }`}
              >
                <FileCode className="w-3.5 h-3.5" />
                <span>{file.name}</span>
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[11px] text-slate-500">{activeFile.description}</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="p-4 bg-slate-950 font-mono text-xs overflow-x-auto max-h-[600px] leading-relaxed">
          <pre className="text-emerald-300 selection:bg-purple-900">
            <code>{activeFile.code}</code>
          </pre>
        </div>
      </div>

      {/* Requirements Checklist Card */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
        <h3 className="text-sm font-bold text-white mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          Ödev 2 Tamamlanan Gereksinimler Listesi (Enes Öztürk)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs text-slate-300">
          <div className="flex items-start gap-2">
            <span className="text-emerald-400">✓</span>
            <span><strong>User:</strong> addUser, updateUser, deleteUser, deleteAllUsers</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-400">✓</span>
            <span><strong>Event:</strong> addEvent, updateEvent, deleteEvent, deleteAllEvents</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-400">✓</span>
            <span><strong>Location:</strong> addLocation, updateLocation, deleteLocation, deleteAllLocations</span>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-emerald-400">✓</span>
            <span><strong>Participant:</strong> addParticipant, updateParticipant, deleteParticipant, deleteAllParticipants</span>
          </div>
        </div>
      </div>
    </div>
  );
};
