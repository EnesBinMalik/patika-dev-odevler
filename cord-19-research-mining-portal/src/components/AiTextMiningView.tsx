import React, { useState } from 'react';
import { mineLiterature, MiningResult } from '../services/miningEngine';
import { CORD19_CHALLENGE_TASKS } from '../data/cord19Dataset';
import { Sparkles, Play, Dna, Pill, AlertCircle, FileText, CheckCircle2, Download, RefreshCw, BarChart2, Shield } from 'lucide-react';

interface AiTextMiningViewProps {
  initialQuery?: string;
  onSelectPaper: (paperId: string) => void;
}

export const AiTextMiningView: React.FC<AiTextMiningViewProps> = ({
  initialQuery = '',
  onSelectPaper
}) => {
  const [query, setQuery] = useState(initialQuery || 'COVID-19 hastalarında Deksametazon ve Paxlovid sağkalım etkileri nelerdir?');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('task-4');
  const [isLoading, setIsLoading] = useState(false);
  const [activeMiningMode, setActiveMiningMode] = useState<'synthesis' | 'ner' | 'forestPlot' | 'contradictions'>('synthesis');
  const [miningResult, setMiningResult] = useState<MiningResult | null>(null);

  const predefinedQuestions = [
    { label: 'Deksametazon & Paxlovid Etkililiği', q: 'COVID-19 hastalarında Deksametazon ve Paxlovid sağkalım ve hastaneye yatış etkileri nelerdir?' },
    { label: 'ACE2 ve Hipertansiyon Riski', q: 'SARS-CoV-2 Spike proteininin ACE2 reseptör afinitesi ve kardiyovasküler risk faktörleri ilişkisi nedir?' },
    { label: 'D-Dimer ve Pulmoner Mikrotromboz', q: 'D-Dimer > 1.0 μg/mL düzeyinin ve alveolar mikrovasküler trombüslerin mortaliteye etkisi nedir?' },
    { label: 'Aerosol ve Yüzey Stabilitesi', q: 'SARS-CoV-2 virüsünün aerosollerde ve paslanmaz çelik/plastik yüzeylerdeki yarı ömrü ne kadardır?' },
    { label: 'Pron Pozisyonunun Oksijenasyona Etkisi', q: 'PaO2/FiO2 < 150 olan şiddetli ARDS vakalarında günde 16 saat pron pozisyonunun mortaliteye etkisi nedir?' }
  ];

  const handleRunMining = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim()) return;

    setIsLoading(true);
    try {
      const res = await mineLiterature(q, selectedTaskId);
      setMiningResult(res);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* View Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>BİYOMEDİKAL NLP METİN MADENCİLİĞİ ÇALIŞMA ALANI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Yapay Zeka Destekli Literatür Madenciliği
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Tıp camiasının yüksek öncelikli klinik sorularına CORD-19 korpusu üzerinden otomatik kanıt sentezi, biyomedikal varlık çıkarımı (NER) ve odds ratio havuzlaması gerçekleştirin.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-cyan-400" />
            <span>Enes Öztürk Doğrulamalı</span>
          </div>
        </div>
      </div>

      {/* Query Formulation Console */}
      <div className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <label className="text-xs font-mono uppercase tracking-wider text-slate-300 font-semibold">
            Bilimsel Soru veya Klinik Hipotez Girin
          </label>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-400 font-mono">Hedef Görev:</span>
            <select
              value={selectedTaskId}
              onChange={(e) => setSelectedTaskId(e.target.value)}
              className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-cyan-300 focus:outline-none focus:border-cyan-400"
            >
              {CORD19_CHALLENGE_TASKS.map(t => (
                <option key={t.id} value={t.id}>
                  Görev {t.number}: {t.titleTr.slice(0, 28)}...
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text Input Area */}
        <div className="relative">
          <textarea
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Klinik sorunuzu buraya yazın (Örn: Kritik COVID-19 hastalarında yüksek D-Dimer mortaliteyi nasıl etkiler?)..."
            className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 font-sans leading-relaxed"
          />
        </div>

        {/* Preset Question Pills */}
        <div className="space-y-2">
          <div className="text-[11px] font-mono text-slate-400 uppercase">
            Hızlı Tıbbi Soru Şablonları:
          </div>
          <div className="flex flex-wrap gap-2">
            {predefinedQuestions.map((item, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setQuery(item.q);
                  handleRunMining(item.q);
                }}
                className="px-3 py-1.5 rounded-lg bg-slate-950/80 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-xs text-slate-300 transition-colors text-left"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Trigger Button */}
        <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-slate-800">
          <div className="text-xs text-slate-500 font-mono">
            CORD-19 Tam Metin JSON · MeSH / UMLS Ontolojisi · GRADE İstatistik Metodu
          </div>
          <button
            onClick={() => handleRunMining()}
            disabled={isLoading || !query.trim()}
            className="px-6 py-2.5 bg-cyan-400 hover:bg-cyan-300 disabled:bg-slate-800 disabled:text-slate-600 text-slate-950 font-bold text-xs rounded-xl shadow-md shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 shrink-0"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Korpus Taranıyor & Sentezleniyor...</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Madencilik Analizini Başlat</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Loading Skeleton / Status State */}
      {isLoading && (
        <div className="p-8 rounded-2xl bg-slate-900/60 border border-cyan-500/30 text-center space-y-4 animate-pulse">
          <div className="w-12 h-12 mx-auto rounded-xl bg-cyan-500/10 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
            <RefreshCw className="w-6 h-6 animate-spin" />
          </div>
          <div className="space-y-1">
            <h4 className="text-base font-semibold text-white">CORD-19 Biyomedikal Korpusu Madenleniyor</h4>
            <p className="text-xs text-slate-400">
              Vektörel semantik tarama yapılıyor, 200,000+ makale arasından kanıtlar ve odds rasyoları havuzlanıyor...
            </p>
          </div>
          <div className="max-w-md mx-auto grid grid-cols-4 gap-2 text-[10px] font-mono text-cyan-400/80 pt-2">
            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">1. MeSH Eşleme</div>
            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">2. Tam Metin Filtre</div>
            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">3. NER Varlık Çıkarımı</div>
            <div className="p-1.5 rounded bg-slate-950 border border-slate-800">4. Kanıt Sentezi</div>
          </div>
        </div>
      )}

      {/* Results View */}
      {miningResult && !isLoading && (
        <div className="space-y-6">
          
          {/* Mining Mode Tabs */}
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-900/90 rounded-xl border border-slate-800">
            <button
              onClick={() => setActiveMiningMode('synthesis')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeMiningMode === 'synthesis'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Kanıt Sentezi & Bilimsel Rapor</span>
            </button>
            <button
              onClick={() => setActiveMiningMode('ner')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeMiningMode === 'ner'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Dna className="w-3.5 h-3.5" />
              <span>Biyomedikal Varlıklar (NER)</span>
            </button>
            <button
              onClick={() => setActiveMiningMode('forestPlot')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeMiningMode === 'forestPlot'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <BarChart2 className="w-3.5 h-3.5" />
              <span>Odds Ratio & Forest Plot</span>
            </button>
            <button
              onClick={() => setActiveMiningMode('contradictions')}
              className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-2 ${
                activeMiningMode === 'contradictions'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Çelişkiler & Belirsizlikler</span>
            </button>
          </div>

          {/* Mode 1: Evidence Synthesis */}
          {activeMiningMode === 'synthesis' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              
              {/* Header metrics */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                    Madencilik Sonucu Sentezi
                  </span>
                  <h3 className="text-xl font-bold text-white mt-0.5">
                    "{miningResult.query}"
                  </h3>
                </div>

                <div className="flex items-center gap-3">
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Konsensüs Skoru</div>
                    <div className="text-lg font-bold font-mono text-emerald-400 tabular-nums">
                      %{miningResult.consensusScore}
                    </div>
                  </div>
                  <div className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-right">
                    <div className="text-[10px] font-mono uppercase text-slate-400">Kanıt Derecesi</div>
                    <div className="text-sm font-bold text-cyan-300">
                      {miningResult.evidenceGrade}
                    </div>
                  </div>
                </div>
              </div>

              {/* Synthesized Text */}
              <div className="p-5 rounded-xl bg-slate-950/70 border border-slate-800 text-sm text-slate-200 leading-relaxed font-sans space-y-3">
                <div className="text-xs font-mono uppercase text-cyan-400 font-semibold">
                  Tıbbi Literatür Konsensüs Özeti
                </div>
                <p>{miningResult.synthesizedAnswer}</p>
                <div className="pt-2 text-xs text-slate-400 font-mono border-t border-slate-800/80">
                  {miningResult.scientificConsensus}
                </div>
              </div>

              {/* Key Takeaways */}
              <div className="space-y-3">
                <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Klinik Karar Destek Çıkarımları</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {miningResult.keyTakeaways.map((takeaway, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl bg-slate-950/50 border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-2.5"
                    >
                      <span className="font-mono text-cyan-400 font-bold mt-0.5">
                        {(idx + 1).toString().padStart(2, '0')}.
                      </span>
                      <span>{takeaway}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Matching Papers from Corpus */}
              <div className="space-y-3 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between text-xs font-mono uppercase text-slate-400">
                  <span>Senteze Kaynak Teşkil Eden CORD-19 Makaleleri</span>
                  <span className="text-cyan-400">{miningResult.matchingPapers.length} Yayın Eşleşti</span>
                </div>
                <div className="space-y-2">
                  {miningResult.matchingPapers.map((paper) => (
                    <div
                      key={paper.id}
                      onClick={() => onSelectPaper(paper.id)}
                      className="p-3.5 rounded-xl bg-slate-950/40 hover:bg-slate-950/80 border border-slate-800/80 hover:border-slate-700 cursor-pointer transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                    >
                      <div className="space-y-1">
                        <div className="font-semibold text-white hover:text-cyan-300 transition-colors">
                          {paper.title}
                        </div>
                        <div className="text-slate-400 text-[11px] flex items-center gap-2">
                          <span className="text-cyan-400">{paper.journal}</span>
                          <span>·</span>
                          <span className="font-mono">{paper.publishYear}</span>
                          <span>·</span>
                          <span className="font-mono text-slate-300">{paper.citations.toLocaleString('tr-TR')} Atıf</span>
                        </div>
                      </div>
                      <span className="px-3 py-1.5 rounded-md bg-slate-900 border border-slate-800 text-cyan-300 hover:text-cyan-200 text-xs font-medium whitespace-nowrap self-start sm:self-auto">
                        İncele →
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* Mode 2: Biomedical Named Entity Recognition (NER) */}
          {activeMiningMode === 'ner' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Çıkarılan Biyomedikal Varlıklar (Named Entity Recognition)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  CORD-19 metinlerinden otomatik olarak ayrıştırılan gen/protein, molekül, komorbidite ve biyobelirteç terimleri.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Genes & Proteins */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-semibold">
                    <Dna className="w-4 h-4" />
                    <span>Genler & Protein Hedefleri</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {miningResult.extractedEntities.genesAndProteins.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-cyan-950/40 border border-cyan-800/60 text-cyan-200 font-mono text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Drugs & Therapeutics */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-semibold">
                    <Pill className="w-4 h-4" />
                    <span>İlaçlar & Terapötik Moleküller</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {miningResult.extractedEntities.drugsAndChemicals.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-200 font-mono text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Risk Factors */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-semibold">
                    <AlertCircle className="w-4 h-4" />
                    <span>Klinik Risk Faktörleri & Komorbiditeler</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {miningResult.extractedEntities.riskFactors.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-amber-950/40 border border-amber-800/60 text-amber-200 font-mono text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Biomarkers */}
                <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                  <div className="flex items-center gap-2 text-xs font-mono uppercase text-purple-400 font-semibold">
                    <BarChart2 className="w-4 h-4" />
                    <span>Laboratuvar Biyobelirteçleri & Sinyalleri</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {miningResult.extractedEntities.biomarkers.map((item, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded bg-purple-950/40 border border-purple-800/60 text-purple-200 font-mono text-xs">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Mode 3: Odds Ratio & Forest Plot */}
          {activeMiningMode === 'forestPlot' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-6">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Odds Ratio & Rölatif Risk (Forest Plot Görünümü)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Literatürden derlenen nokta tahminleri ve %95 Güven Aralıkları (Confidence Intervals). 1.0 çizgisi farksızlık (nötr etki) eşiğidir.
                </p>
              </div>

              {miningResult.oddsRatios.length === 0 ? (
                <div className="p-8 text-center text-xs text-slate-500 font-mono">
                  Bu sorgu için doğrudan sayısal Odds Ratio eşleşmesi bulunamadı.
                </div>
              ) : (
                <div className="space-y-4">
                  {miningResult.oddsRatios.map((orItem, idx) => {
                    // Normalize position on scale 0 to 5 for visual forest plot
                    const maxBound = 5;
                    const leftPct = Math.min(Math.max((orItem.ciLower / maxBound) * 100, 2), 95);
                    const rightPct = Math.min(Math.max((orItem.ciUpper / maxBound) * 100, 5), 98);
                    const pointPct = Math.min(Math.max((orItem.value / maxBound) * 100, 2), 95);
                    const neutralPct = (1.0 / maxBound) * 100;

                    return (
                      <div key={idx} className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs gap-2">
                          <div>
                            <span className="font-semibold text-white">{orItem.factor}</span>
                            <span className="text-slate-400 ml-2">({orItem.paperJournal})</span>
                          </div>
                          <div className="font-mono text-cyan-300 font-semibold tabular-nums">
                            OR: {orItem.value} (95% CI: {orItem.ciLower} - {orItem.ciUpper}) · {orItem.pValue}
                          </div>
                        </div>

                        {/* Forest Plot Graphical Bar */}
                        <div className="relative h-8 bg-slate-900 rounded-lg border border-slate-800 flex items-center px-4">
                          {/* Neutral Line (OR = 1.0) */}
                          <div
                            className="absolute top-0 bottom-0 w-0.5 bg-slate-600 border-dashed"
                            style={{ left: `${neutralPct}%` }}
                            title="Nötr Etki Eşiği (1.0)"
                          />

                          {/* CI Horizontal Span */}
                          <div
                            className="absolute h-1 bg-cyan-500/80 rounded"
                            style={{
                              left: `${leftPct}%`,
                              width: `${Math.max(rightPct - leftPct, 2)}%`
                            }}
                          />

                          {/* Whisker Ends */}
                          <div
                            className="absolute w-0.5 h-3 bg-cyan-400"
                            style={{ left: `${leftPct}%` }}
                          />
                          <div
                            className="absolute w-0.5 h-3 bg-cyan-400"
                            style={{ left: `${rightPct}%` }}
                          />

                          {/* Point Estimate Diamond/Circle */}
                          <div
                            className="absolute w-3 h-3 bg-white border-2 border-cyan-400 rounded-full shadow -ml-1.5"
                            style={{ left: `${pointPct}%` }}
                            title={`Nokta Tahmini: ${orItem.value}`}
                          />
                        </div>

                        <div className="flex justify-between text-[10px] font-mono text-slate-500">
                          <span>0.0 (Koruyucu / Azalma)</span>
                          <span>1.0 (Nötr Çizgi)</span>
                          <span>2.5</span>
                          <span>5.0+ (Yüksek Risk)</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Mode 4: Contradictions */}
          {activeMiningMode === 'contradictions' && (
            <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h3 className="text-lg font-bold text-white">Çelişkili Bulgular ve Açık Kalan Sorular</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Literatürde henüz tam konsensüs sağlanamamış, çelişkili veya metodolojik farklılık gösteren konular.
                </p>
              </div>

              <div className="space-y-3">
                {miningResult.openContradictions.map((contradiction, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-amber-950/20 border border-amber-900/40 text-xs text-amber-200/90 leading-relaxed flex items-start gap-3"
                  >
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-amber-300">Araştırma İhtiyacı:</strong> {contradiction}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
