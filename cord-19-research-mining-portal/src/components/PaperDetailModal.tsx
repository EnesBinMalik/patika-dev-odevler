import React, { useState } from 'react';
import { Cord19Paper } from '../data/cord19Dataset';
import { X, BookOpen, ExternalLink, Copy, Check, Sparkles, FileText, CheckCircle2 } from 'lucide-react';

interface PaperDetailModalProps {
  paper: Cord19Paper | null;
  onClose: () => void;
  onMinePaper: (query: string) => void;
}

export const PaperDetailModal: React.FC<PaperDetailModalProps> = ({
  paper,
  onClose,
  onMinePaper
}) => {
  const [copied, setCopied] = useState(false);

  if (!paper) return null;

  const bibtex = `@article{${paper.authors[0]?.replace(/\s+/g, '') || 'author'}${paper.publishYear},
  title = {${paper.title}},
  author = {${paper.authors.join(' and ')}},
  journal = {${paper.journal}},
  year = {${paper.publishYear}},
  doi = {${paper.doi}},
  source = {CORD-19 Open Research Dataset}
}`;

  const handleCopyCitation = () => {
    navigator.clipboard.writeText(bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between p-6 border-b border-slate-800 bg-slate-950/60">
          <div className="space-y-1 pr-6">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold">
              <span>{paper.journal}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span>{paper.publishDate}</span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-300">{paper.citations.toLocaleString('tr-TR')} Atıf</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
              {paper.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-300">
          
          {/* Authors Strip */}
          <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 text-xs">
            <span className="font-mono text-slate-500 uppercase text-[11px] block mb-1">
              Araştırma Grubu & Yazarlar:
            </span>
            <span className="text-slate-200 leading-relaxed font-sans">
              {paper.authors.join(', ')}
            </span>
          </div>

          {/* Key Characteristics Matrix */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Çalışma Tasarımı</div>
              <div className="text-xs font-bold text-white mt-1">{paper.studyDesign}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Örneklem (N)</div>
              <div className="text-xs font-bold font-mono text-cyan-300 mt-1">
                {paper.sampleSize ? paper.sampleSize.toLocaleString('tr-TR') : 'Laboratuvar'}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Veri Tabanı Kaynağı</div>
              <div className="text-xs font-bold text-white mt-1">{paper.source}</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800">
              <div className="text-[10px] font-mono uppercase text-slate-400">Resmi DOI</div>
              <a
                href={`https://doi.org/${paper.doi}`}
                target="_blank"
                rel="noreferrer"
                className="text-xs font-bold font-mono text-cyan-400 hover:text-cyan-300 mt-1 inline-flex items-center gap-1 truncate max-w-full"
              >
                <span>{paper.doi}</span>
                <ExternalLink className="w-3 h-3 shrink-0" />
              </a>
            </div>
          </div>

          {/* Abstract */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-cyan-400 font-semibold flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Orijinal Makale Özeti (Abstract)</span>
            </div>
            <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 text-xs sm:text-sm text-slate-200 leading-relaxed font-sans whitespace-pre-line">
              {paper.abstract}
            </div>
          </div>

          {/* NLP Extracted Key Findings */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" />
              <span>NLP Metin Madenciliği ile Çıkarılan Kanıtlar</span>
            </div>
            <div className="space-y-2">
              {paper.keyFindings.map((finding, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-200 flex items-start gap-2"
                >
                  <span className="font-mono text-cyan-400 font-bold shrink-0 mt-0.5">
                    {(idx + 1).toString().padStart(2, '0')}.
                  </span>
                  <span>{finding}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Odds Ratio if available */}
          {paper.oddsRatio && (
            <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60 space-y-2">
              <div className="text-xs font-mono uppercase text-cyan-300 font-semibold">
                İstatistiksel Etki Büyüklüğü (Odds Ratio / Relative Risk)
              </div>
              <div className="flex flex-wrap items-center justify-between text-xs gap-2">
                <span className="text-white font-medium">{paper.oddsRatio.factor}</span>
                <span className="font-mono text-cyan-300 font-bold">
                  OR: {paper.oddsRatio.value} (95% CI: {paper.oddsRatio.ciLower} - {paper.oddsRatio.ciUpper}) · {paper.oddsRatio.pValue}
                </span>
              </div>
            </div>
          )}

          {/* Biomedical Entities */}
          <div className="space-y-2">
            <div className="text-xs font-mono uppercase text-slate-400 font-semibold">
              İndekslenen Biyomedikal Varlıklar (MeSH)
            </div>
            <div className="flex flex-wrap gap-1.5">
              {paper.biomedicalEntities.genesAndProteins.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-cyan-800/50 text-cyan-300 font-mono text-[11px]">
                  Gen/Protein: {item}
                </span>
              ))}
              {paper.biomedicalEntities.drugsAndChemicals.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-emerald-800/50 text-emerald-300 font-mono text-[11px]">
                  İlaç: {item}
                </span>
              ))}
              {paper.biomedicalEntities.biomarkers.map((item, idx) => (
                <span key={idx} className="px-2.5 py-1 rounded bg-slate-950 border border-purple-800/50 text-purple-300 font-mono text-[11px]">
                  Biyobelirteç: {item}
                </span>
              ))}
            </div>
          </div>

          {/* BibTeX Citation Box */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
              <span>Akademik Atıf (BibTeX Formatı)</span>
              <button
                onClick={handleCopyCitation}
                className="text-cyan-400 hover:text-cyan-300 inline-flex items-center gap-1 font-semibold"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Kopyalandı!' : 'BibTeX Kopyala'}</span>
              </button>
            </div>
            <pre className="p-3 bg-slate-950 rounded-xl border border-slate-800 font-mono text-[11px] text-slate-400 overflow-x-auto">
              {bibtex}
            </pre>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/80 flex flex-wrap items-center justify-between gap-3 text-xs">
          <a
            href={`https://doi.org/${paper.doi}`}
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg font-medium transition-colors inline-flex items-center gap-1.5"
          >
            <span>Orijinal Makaleyi Aç (DOI)</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onMinePaper(`"${paper.title}" makalesindeki temel klinik bulguları ve metodolojiyi sentezle`);
              }}
              className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-slate-950 font-bold rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bu Makaleyi Madenle</span>
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-lg transition-colors"
            >
              Kapat
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
