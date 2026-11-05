import React, { useState } from 'react';
import {
  FileCode,
  Copy,
  Check,
  FolderTree,
  ExternalLink,
  ShieldCheck,
  Award,
  Layers,
} from 'lucide-react';
import { CSHARP_CODE_FILES } from '../data/csharpCodeSamples';

export const CodeViewerTab: React.FC = () => {
  const [selectedFileId, setSelectedFileId] = useState(CSHARP_CODE_FILES[0].id);
  const [copied, setCopied] = useState(false);

  const selectedFile =
    CSHARP_CODE_FILES.find((f) => f.id === selectedFileId) || CSHARP_CODE_FILES[0];

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 rounded-2xl p-5 text-white shadow-md">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/30 text-indigo-200 border border-indigo-400/30 mb-2">
              .NET 8 Clean Architecture / Web API
            </span>
            <h2 className="text-xl font-bold tracking-tight">C# Kaynak Kodları &amp; Mimari İnceleme</h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Ödevin tüm maddelerini eksiksiz karşılayan C# sınıfları: Controller, Entityler, DTO modelleri,
              AutoMapper MappingProfile, FluentValidation sınıfları ve Exception Middleware.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-white/10 text-indigo-200 border border-white/10">
              Geliştirici: Enes Öztürk
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Solution Explorer / File Tree (4 cols) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs p-4">
            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-1.5">
              <FolderTree className="w-4 h-4 text-indigo-600" />
              Solution Explorer (BookStore)
            </h3>

            <div className="space-y-1">
              {CSHARP_CODE_FILES.map((file) => {
                const isSelected = file.id === selectedFileId;
                return (
                  <button
                    key={file.id}
                    onClick={() => setSelectedFileId(file.id)}
                    className={`w-full text-left p-2.5 rounded-xl transition flex items-start gap-2.5 cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-50 text-indigo-900 font-semibold border border-indigo-300 shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100 border border-transparent'
                    }`}
                  >
                    <FileCode
                      className={`w-4 h-4 shrink-0 mt-0.5 ${
                        isSelected ? 'text-indigo-600' : 'text-slate-400'
                      }`}
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-mono truncate">{file.name}</span>
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200/80 text-slate-600 font-mono">
                          {file.folder}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5 font-normal">
                        {file.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Architecture Checklist */}
          <div className="bg-gradient-to-br from-indigo-50 to-slate-50 rounded-xl border border-indigo-100 p-4 text-xs space-y-2">
            <h4 className="font-bold text-indigo-950 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Ödev Gereksinim Eşleşmesi:
            </h4>
            <ul className="space-y-1.5 text-slate-600 text-[11px]">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 1:</strong> Author Controller 5 CRUD Uç Noktası
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 2:</strong> Ad, Soyad, Doğum Tarihi Alanları
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 3:</strong> Kitap-Yazar-Tür İlişkisi &amp; Silme Kuralı
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 4:</strong> DTO ve ViewModel İzolasyonu
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 5:</strong> AutoMapper Profile ve Dönüşümler
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 6:</strong> FluentValidation Kural Sınıfları
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <strong>Madde 7:</strong> Anlamlı Hata Mesajları &amp; Enes Öztürk İmzası
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: Code Display (8 cols) */}
        <div className="lg:col-span-8 space-y-3">
          <div className="bg-slate-900 rounded-xl border border-slate-800 shadow-md overflow-hidden">
            {/* Code Header Bar */}
            <div className="px-4 py-3 bg-slate-950 border-b border-slate-800 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <FileCode className="w-4 h-4 text-indigo-400" />
                <span className="font-mono font-bold text-slate-200">{selectedFile.name}</span>
                <span className="text-[11px] text-slate-500 font-mono">
                  BookStore/{selectedFile.folder}
                </span>
              </div>

              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition cursor-pointer"
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                    <span className="text-emerald-400">Kopyalandı!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5 text-slate-400" />
                    <span>Kodu Kopyala</span>
                  </>
                )}
              </button>
            </div>

            {/* Description Banner */}
            <div className="px-4 py-2 bg-slate-900 border-b border-slate-800/80 text-[11px] text-slate-400">
              {selectedFile.description}
            </div>

            {/* Code Content */}
            <div className="p-4 max-h-[600px] overflow-y-auto text-xs font-mono text-slate-200 bg-slate-950 leading-relaxed">
              <pre className="whitespace-pre overflow-x-auto">{selectedFile.code}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
