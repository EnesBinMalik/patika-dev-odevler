import React, { useState } from 'react';
import { GitBranch, GitCommit as GitCommitIcon, Play, Download, Terminal, CheckCircle2, FileCode, Award, Share2, Printer, ExternalLink } from 'lucide-react';
import { GIT_COMMITS, NOTEBOOK_CELLS } from '../data/gitAndNotebookData';
import { NotebookCell } from '../types';

interface Module4Props {
  onOpenReportModal: () => void;
}

export const Module4GitStorytelling: React.FC<Module4Props> = ({ onOpenReportModal }) => {
  const [activeSubTab, setActiveSubTab] = useState<'notebook' | 'git_vcs' | 'storytelling'>('storytelling');
  const [selectedBranch, setSelectedBranch] = useState<string>('all');
  const [selectedCommit, setSelectedCommit] = useState(GIT_COMMITS[0]);
  const [cells, setCells] = useState<NotebookCell[]>(NOTEBOOK_CELLS);
  const [executingCellId, setExecutingCellId] = useState<string | null>(null);

  // Filter commits
  const filteredCommits = GIT_COMMITS.filter(
    (c) => selectedBranch === 'all' || c.branch === selectedBranch
  );

  // Run cell simulator
  const handleRunCell = (cellId: string) => {
    setExecutingCellId(cellId);
    setTimeout(() => {
      setCells((prev) =>
        prev.map((c) =>
          c.id === cellId
            ? { ...c, executionCount: (c.executionCount || 0) + 1 }
            : c
        )
      );
      setExecutingCellId(null);
    }, 450);
  };

  // Run all notebook cells
  const handleRunAllCells = () => {
    setExecutingCellId('all');
    setTimeout(() => {
      setCells((prev) =>
        prev.map((c, idx) => ({ ...c, executionCount: idx + 1 }))
      );
      setExecutingCellId(null);
    }, 900);
  };

  // Export Jupyter Notebook (.ipynb format)
  const handleDownloadNotebook = () => {
    const ipynbData = {
      cells: cells.map((c) => ({
        cell_type: c.type,
        metadata: {},
        source: c.content.split('\n').map((line) => line + '\n'),
        execution_count: c.type === 'code' ? c.executionCount || 1 : null,
        outputs: c.output ? [{ output_type: 'stream', name: 'stdout', text: [c.output] }] : [],
      })),
      metadata: {
        language_info: { name: 'python', version: '3.11' },
        authors: [{ name: 'Enes Öztürk', email: 'enesbino38@gmail.com' }],
      },
      nbformat: 4,
      nbformat_minor: 5,
    };

    const blob = new Blob([JSON.stringify(ipynbData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'e_ticaret_segmentasyon_tahminleme_enes_ozturk.ipynb';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Title & Navigation */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-indigo-400 mb-1">
              <span>MODÜL 04</span>
              <span>·</span>
              <span>GIT VERSİYON KONTROLÜ & VERİ HİKAYECİLİĞİ</span>
              <span>·</span>
              <span>ENES ÖZTÜRK</span>
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-slate-100 tracking-tight">
              Kurumsal Dokümantasyon, Git Versiyonlama & Veri Hikayeciliği
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl">
              Tüm analitik aşamaları, Jupyter Notebook kod bloklarını ve modelleme sonuçlarını Git ile versiyonlayarak
              GitHub üzerinde kurumsal bir dille dokümante edin; üst yönetim için stratejik eylem raporu sunun.
            </p>
          </div>

          {/* Sub-tab Switcher */}
          <div className="flex items-center gap-1 p-1 bg-slate-950/80 border border-slate-800 rounded-lg shrink-0">
            <button
              onClick={() => setActiveSubTab('storytelling')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'storytelling' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yönetici Özeti & Hikaye
            </button>
            <button
              onClick={() => setActiveSubTab('notebook')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'notebook' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Jupyter Notebook
            </button>
            <button
              onClick={() => setActiveSubTab('git_vcs')}
              className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                activeSubTab === 'git_vcs' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Git Ağacı & Dökümler
            </button>
          </div>
        </div>
      </div>

      {/* SUB-TAB 1: DATA STORYTELLING & EXECUTIVE REPORT */}
      {activeSubTab === 'storytelling' && (
        <div className="space-y-6">
          {/* Executive Presentation Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 md:p-8 relative overflow-hidden">
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Report Header */}
              <div className="border-b border-slate-800 pb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-indigo-400">
                    Kurumsal Veri Bilimi & Strateji Raporu
                  </span>
                  <h2 className="text-2xl font-bold text-slate-100 mt-1">
                    E-Ticaret Müşteri Segmentasyonu & Satış Tahminleme Analizi
                  </h2>
                  <div className="flex items-center gap-3 text-xs text-slate-400 font-mono mt-2">
                    <span>Yazar: <strong>Enes Öztürk</strong></span>
                    <span>·</span>
                    <span>Tarih: Kasım 2026</span>
                    <span>·</span>
                    <span className="text-emerald-400">Durum: Onaylandı</span>
                  </div>
                </div>

                <button
                  onClick={onOpenReportModal}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition-all shrink-0 self-start sm:self-auto"
                >
                  <Printer className="w-3.5 h-3.5" />
                  Raporu Yazdır / PDF
                </button>
              </div>

              {/* Storytelling Section 1: Executive Findings */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">1</span>
                  Yönetici Özeti ve Temel Çıkarımlar (Core Business Insights)
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed">
                  2026 yılı 1.150 işlem ve 220 kayıtlı müşteri veri tabanı üzerinde gerçekleştirilen SQL destekli
                  ETL ve RFM modelleme çalışmaları, portföyümüzün yüksek konsantrasyona sahip olduğunu ortaya koymaktadır:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400 font-medium">Pareto Kuralı Kanıtı</div>
                    <div className="text-xl font-bold font-mono text-emerald-400 mt-1 tabular-nums">
                      %16 Müşteri = %44 Ciro
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      "Şampiyonlar" segmenti cironun neredeyse yarısını oluşturmaktadır. Bu grubun elde tutulması operasyonel kilit öneme sahiptir.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400 font-medium">Risk Altındaki Gelir Fırsatı</div>
                    <div className="text-xl font-bold font-mono text-rose-400 mt-1 tabular-nums">
                      184.200 ₺ Geri Kazanım
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      90 günden uzun süredir işlem yapmayan 38 yüksek harcamalı müşteri için acil win-back kampanyası tavsiye edilmektedir.
                    </p>
                  </div>

                  <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-xl">
                    <div className="text-xs text-slate-400 font-medium">30 Günlük Satış Projeksiyonu</div>
                    <div className="text-xl font-bold font-mono text-indigo-400 mt-1 tabular-nums">
                      +1.42M ₺ (+%8.2)
                    </div>
                    <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                      Seasonal ARIMA modeli önümüzdeki ay hafta sonu pikleriyle desteklenen %8.2 ciro artışı öngörmektedir.
                    </p>
                  </div>
                </div>
              </div>

              {/* Storytelling Section 2: Mathematical Rigor & ETL Verification */}
              <div className="space-y-3">
                <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-md bg-indigo-500/20 text-indigo-400 text-xs flex items-center justify-center font-bold">2</span>
                  Veri Mühendisliği ve İstatistiksel Doğrulama (Technical Rigor)
                </h3>
                <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-xl space-y-2 text-xs text-slate-300 leading-relaxed font-mono">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> SQL Entegrasyonu:
                  </div>
                  <div className="text-slate-400 pl-6">
                    Müşteri, sipariş ve ürün tabloları INNER/LEFT JOIN ile normalize edilmiş, DATEDIFF ve aggregate fonksiyonları ile snapshot tarihi (2026-11-01) baz alınarak filtrelenmiştir.
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold pt-2">
                    <CheckCircle2 className="w-4 h-4" /> Tukey IQR Aykırı Değer Yönetimi:
                  </div>
                  <div className="text-slate-400 pl-6">
                    Aşırı uç değerler (B2B toplu alımlar) [Q1 - 1.5×IQR, Q3 + 1.5×IQR] formülü ile tespit edilmiş ve modelleme evrenini bozmaması adına izole edilmiştir.
                  </div>
                  <div className="flex items-center gap-2 text-emerald-400 font-bold pt-2">
                    <CheckCircle2 className="w-4 h-4" /> K-Means Doğrulaması (Dirsek Metodu):
                  </div>
                  <div className="text-slate-400 pl-6">
                    Within-Cluster Sum of Squares (Inertia) eğrisi incelenmiş, k=4 noktasında dirsek kırılımı teyit edilmiştir.
                  </div>
                </div>
              </div>

              {/* Storytelling Section 3: Official Signature Block */}
              <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-6 bg-slate-950/40 p-5 rounded-xl border">
                <div>
                  <div className="flex items-center gap-2 text-indigo-400 font-semibold text-xs mb-1">
                    <Award className="w-4 h-4" />
                    Proje Lideri & Rapor Sahibi İmzası
                  </div>
                  <div className="text-lg font-bold text-slate-100 font-serif tracking-wide">
                    Enes Öztürk
                  </div>
                  <div className="text-xs text-slate-400 font-mono mt-0.5">
                    Veri Bilimci & Analitik Modelleme Mühendisi
                  </div>
                  <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                    GitHub: github.com/enesbino38 | E-Posta: enesbino38@gmail.com
                  </div>
                </div>

                <div className="text-right sm:border-l sm:border-slate-800 sm:pl-6">
                  <div className="text-[11px] text-slate-400 font-mono">DİJİTAL DOĞRULAMA KODU</div>
                  <div className="text-xs font-mono font-bold text-slate-200 mt-1">SHA256: c8f42d19842a...</div>
                  <div className="text-[11px] text-emerald-400 font-mono mt-1">✓ Kurumsal Arşive Eklendi</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: INTERACTIVE JUPYTER NOTEBOOK */}
      {activeSubTab === 'notebook' && (
        <div className="space-y-4">
          {/* Notebook Control Toolbar */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <FileCode className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-mono text-slate-200 font-bold">
                e_commerce_segmentation_pipeline.ipynb
              </span>
              <span className="text-[11px] text-slate-500 font-mono">(Python 3.11 Kernel · Idle)</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={handleRunAllCells}
                disabled={executingCellId !== null}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded text-xs font-medium transition-colors"
              >
                <Play className="w-3 h-3 fill-current" />
                {executingCellId === 'all' ? 'Çalıştırılıyor...' : 'Tüm Hücreleri Çalıştır'}
              </button>
              <button
                onClick={handleDownloadNotebook}
                className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-medium transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                .ipynb İndir
              </button>
            </div>
          </div>

          {/* Notebook Cells Flow */}
          <div className="space-y-3">
            {cells.map((cell) => {
              const isExecuting = executingCellId === cell.id || executingCellId === 'all';
              if (cell.type === 'markdown') {
                return (
                  <div key={cell.id} className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-5 text-slate-200 text-xs leading-relaxed space-y-2">
                    <div className="prose prose-invert max-w-none">
                      {cell.content.split('\n').map((line, idx) => (
                        <p key={idx} className={line.startsWith('#') ? 'text-base font-bold text-indigo-300' : 'text-slate-300'}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <div key={cell.id} className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden">
                  {/* Cell Header */}
                  <div className="bg-slate-900/70 px-4 py-2 border-b border-slate-800/80 flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">
                      In [{isExecuting ? '*' : cell.executionCount || ' '}]:
                    </span>
                    <button
                      onClick={() => handleRunCell(cell.id)}
                      disabled={isExecuting}
                      className="inline-flex items-center gap-1 text-[11px] font-mono text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                    >
                      <Play className="w-2.5 h-2.5 fill-current" />
                      Hücreyi Çalıştır
                    </button>
                  </div>

                  {/* Code Editor */}
                  <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs leading-relaxed overflow-x-auto selection:bg-indigo-600/30">
                    {cell.content}
                  </pre>

                  {/* Cell Output */}
                  {cell.output && (
                    <div className="bg-slate-900/50 p-4 border-t border-slate-800/60 font-mono text-xs text-slate-300">
                      <div className="text-[10px] text-slate-500 mb-1">
                        Out [{cell.executionCount || 1}]:
                      </div>
                      <pre className="text-slate-300 whitespace-pre-wrap">{cell.output}</pre>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* SUB-TAB 3: GIT VERSION CONTROL TREE & DIFF INSPECTOR */}
      {activeSubTab === 'git_vcs' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Commits Timeline (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <GitBranch className="w-4 h-4 text-indigo-400" />
                  <span className="text-xs font-bold text-slate-200">Git Dalı (Branch):</span>
                </div>
                <select
                  value={selectedBranch}
                  onChange={(e) => setSelectedBranch(e.target.value)}
                  className="bg-slate-950 border border-slate-800 text-slate-200 text-xs rounded px-2.5 py-1 font-mono"
                >
                  <option value="all">Tüm Dallar (3 branch)</option>
                  <option value="main">main (Üretim)</option>
                  <option value="feature/rfm-clustering">feature/rfm-clustering</option>
                  <option value="feature/sales-forecast">feature/sales-forecast</option>
                </select>
              </div>

              {/* Commits List */}
              <div className="space-y-2 max-h-[520px] overflow-y-auto pr-1">
                {filteredCommits.map((c) => {
                  const isSelected = selectedCommit.hash === c.hash;
                  return (
                    <button
                      key={c.hash}
                      onClick={() => setSelectedCommit(c)}
                      className={`w-full text-left p-3 rounded-xl border transition-all ${
                        isSelected
                          ? 'bg-slate-950 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-mono text-indigo-400 font-semibold">{c.shortHash}</span>
                        <span className="text-[11px] font-mono text-slate-400">{c.branch}</span>
                      </div>
                      <div className="font-medium text-xs text-slate-200 line-clamp-2">{c.message}</div>
                      <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mt-2 pt-2 border-t border-slate-800/80">
                        <span>{c.author.split('<')[0]}</span>
                        <span className="text-emerald-400">+{c.insertions}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right Column: Commit Inspector & Diff View (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden p-5 space-y-4">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-indigo-400 mb-1">
                  <GitCommitIcon className="w-4 h-4" />
                  <span>Commit: {selectedCommit.hash}</span>
                </div>
                <h3 className="text-sm font-bold text-slate-100">{selectedCommit.message}</h3>
                <div className="text-xs text-slate-400 font-mono mt-1">
                  Yazar: {selectedCommit.author} · {selectedCommit.date}
                </div>
              </div>

              {/* Changed files summary */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-slate-300">Değiştirilen Dosyalar ({selectedCommit.filesChanged}):</span>
                <div className="space-y-1.5 font-mono text-xs">
                  {selectedCommit.diffSummary.map((f, i) => (
                    <div key={i} className="flex items-center justify-between p-2 bg-slate-950 rounded-lg border border-slate-800">
                      <span className="text-slate-300 truncate">{f.file}</span>
                      <div className="flex items-center gap-2 text-[11px] shrink-0">
                        <span className="text-emerald-400 font-semibold">+{f.additions}</span>
                        <span className="text-rose-400 font-semibold">-{f.deletions}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Terminal git diff simulator */}
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs text-slate-300">
                <div className="text-slate-500 text-[11px] mb-2">$ git show {selectedCommit.shortHash} --stat</div>
                <div className="text-indigo-400">commit {selectedCommit.hash}</div>
                <div className="text-slate-400">Author: {selectedCommit.author}</div>
                <div className="text-slate-400">Date:   {selectedCommit.date}</div>
                <div className="text-slate-100 mt-2 font-bold">{selectedCommit.message}</div>
                <div className="text-emerald-400 mt-2 font-mono">
                  {selectedCommit.filesChanged} files changed, {selectedCommit.insertions} insertions(+), {selectedCommit.deletions} deletions(-)
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
