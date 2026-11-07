import React, { useState } from 'react';
import { CORD19_PAPERS, Cord19Paper, CORD19_CHALLENGE_TASKS } from '../data/cord19Dataset';
import { searchPapers } from '../services/miningEngine';
import { Search, Filter, BookOpen, ExternalLink, ArrowUpDown, Tag, Sparkles, CheckCircle2 } from 'lucide-react';

interface LiteratureExplorerViewProps {
  onSelectPaper: (paperId: string) => void;
  onMineQuery: (query: string) => void;
}

export const LiteratureExplorerView: React.FC<LiteratureExplorerViewProps> = ({
  onSelectPaper,
  onMineQuery
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTask, setSelectedTask] = useState('all');
  const [selectedDesign, setSelectedDesign] = useState('all');
  const [sortBy, setSortBy] = useState<'citations' | 'year' | 'sampleSize'>('citations');

  const filteredPapers = searchPapers(searchTerm, selectedTask, selectedDesign).sort((a, b) => {
    if (sortBy === 'citations') return b.citations - a.citations;
    if (sortBy === 'year') return b.publishYear - a.publishYear;
    if (sortBy === 'sampleSize') return (b.sampleSize || 0) - (a.sampleSize || 0);
    return 0;
  });

  const studyDesigns = [
    'Randomize Kontrollü Çalışma (RCT)',
    'Prospektif Kohort',
    'Sistematik Derleme & Meta-Analiz',
    'Yapısal Biyoloji & İn Vitro',
    'Genomik Filogeni & Sürveyans'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title & Toolbar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
            CORD-19 BİYOMEDİKAL KORPUSU
          </div>
          <h2 className="text-2xl font-bold text-white mt-1">
            Literatür ve Makale Keşif Motoru
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Hakemli tıp dergileri (NEJM, The Lancet, Science, JAMA, Cell) ve bioRxiv/medRxiv ön baskılarından derlenen tam metin indeks.
          </p>
        </div>

        {/* Quick stats */}
        <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800">
            FİLTRELENEN: <span className="text-cyan-400 font-bold tabular-nums">{filteredPapers.length}</span> Makale
          </div>
          <button
            onClick={() => onMineQuery(searchTerm || 'COVID-19 genel kanıt sentezi')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 hover:bg-cyan-900/60 text-cyan-300 border border-cyan-800/80 transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Filtreyi Madenle</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 p-4 rounded-xl bg-slate-900/70 border border-slate-800">
        
        {/* Keyword Search */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Başlık, yazar, özet veya gen ara..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Challenge Task Filter */}
        <div>
          <select
            value={selectedTask}
            onChange={(e) => setSelectedTask(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Tüm Öncelikli Görevler (10 Alan)</option>
            {CORD19_CHALLENGE_TASKS.map((t) => (
              <option key={t.id} value={t.id}>
                Görev {t.number}: {t.titleTr.slice(0, 32)}...
              </option>
            ))}
          </select>
        </div>

        {/* Study Design Filter */}
        <div>
          <select
            value={selectedDesign}
            onChange={(e) => setSelectedDesign(e.target.value)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="all">Tüm Çalışma Tasarımları</option>
            {studyDesigns.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <ArrowUpDown className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
          >
            <option value="citations">Atıf Sayısına Göre (En Yüksek)</option>
            <option value="year">Yayın Tarihine Göre (En Yeni)</option>
            <option value="sampleSize">Örneklem Boyutuna Göre (N)</option>
          </select>
        </div>

      </div>

      {/* Papers Listing Grid */}
      <div className="space-y-4">
        {filteredPapers.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400 space-y-3">
            <BookOpen className="w-10 h-10 mx-auto text-slate-600" />
            <div className="text-base font-semibold text-slate-300">Aramanıza uygun makale bulunamadı</div>
            <p className="text-xs text-slate-500 max-w-md mx-auto">
              Arama filtrenizi temizleyerek veya daha genel terimler ("Spike", "ACE2", "Deksametazon", "ARDS") kullanarak tekrar deneyin.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedTask('all');
                setSelectedDesign('all');
              }}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white rounded-lg transition-colors"
            >
              Filtreleri Sıfırla
            </button>
          </div>
        ) : (
          filteredPapers.map((paper) => {
            return (
              <div
                key={paper.id}
                className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800/90 hover:border-slate-700 transition-all space-y-3 group"
              >
                {/* Unboxed Metadata Strip */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-cyan-400">{paper.journal}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums">{paper.publishYear}</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono tabular-nums text-slate-300">{paper.citations.toLocaleString('tr-TR')} Atıf</span>
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="text-slate-300">{paper.studyDesign}</span>
                  {paper.sampleSize && (
                    <>
                      <span aria-hidden="true" className="text-slate-600">·</span>
                      <span className="font-mono text-cyan-300 tabular-nums">N = {paper.sampleSize.toLocaleString('tr-TR')}</span>
                    </>
                  )}
                  <span aria-hidden="true" className="text-slate-600">·</span>
                  <span className="font-mono text-[11px] text-slate-500">DOI: {paper.doi}</span>
                </div>

                {/* Title */}
                <h3
                  onClick={() => onSelectPaper(paper.id)}
                  className="text-base sm:text-lg font-bold text-white group-hover:text-cyan-300 transition-colors cursor-pointer leading-snug"
                >
                  {paper.title}
                </h3>

                {/* Authors */}
                <div className="text-xs text-slate-400 line-clamp-1">
                  Yazarlar: <span className="text-slate-300">{paper.authors.slice(0, 8).join(', ')}{paper.authors.length > 8 ? ' ve ark.' : ''}</span>
                </div>

                {/* Abstract Preview */}
                <p className="text-xs text-slate-300 line-clamp-2 leading-relaxed">
                  {paper.abstract}
                </p>

                {/* Extracted Takeaway Bullet */}
                {paper.keyFindings.length > 0 && (
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400 shrink-0 mt-0.5" />
                    <span className="line-clamp-2"><strong className="text-white">Madenlenen Temel Bulgu:</strong> {paper.keyFindings[0]}</span>
                  </div>
                )}

                {/* Bottom Bar: Mined Entities & Action */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 text-xs border-t border-slate-800/60">
                  <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                    <span className="text-slate-500 font-mono">Biyomedikal Varlıklar:</span>
                    {paper.biomedicalEntities.genesAndProteins.slice(0, 3).map((g, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 font-mono">
                        {g}
                      </span>
                    ))}
                    {paper.biomedicalEntities.drugsAndChemicals.slice(0, 2).map((d, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-slate-800/80 text-emerald-300 font-mono">
                        {d}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => onSelectPaper(paper.id)}
                      className="text-cyan-400 hover:text-cyan-300 font-semibold text-xs transition-colors flex items-center gap-1"
                    >
                      Ayrıntılı İncele <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
