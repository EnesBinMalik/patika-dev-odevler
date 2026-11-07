import React, { useState } from 'react';
import { BIOMEDICAL_GRAPH_DATA, GraphNode } from '../data/cord19Dataset';
import { Network, Info, ArrowRight, ShieldCheck, Filter, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';

interface BiomedicalKnowledgeGraphViewProps {
  onSearchQuery: (query: string) => void;
}

export const BiomedicalKnowledgeGraphView: React.FC<BiomedicalKnowledgeGraphViewProps> = ({
  onSearchQuery
}) => {
  const [selectedNodeId, setSelectedNodeId] = useState<string>('spike-protein');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [zoomLevel, setZoomLevel] = useState<number>(1);

  const selectedNode = BIOMEDICAL_GRAPH_DATA.nodes.find(n => n.id === selectedNodeId) || BIOMEDICAL_GRAPH_DATA.nodes[0];

  const connectedLinks = BIOMEDICAL_GRAPH_DATA.links.filter(
    l => l.source === selectedNode.id || l.target === selectedNode.id
  );

  const connectedNodeIds = new Set<string>();
  connectedLinks.forEach(l => {
    connectedNodeIds.add(l.source);
    connectedNodeIds.add(l.target);
  });

  const nodeColorMap: Record<GraphNode['type'], { bg: string; border: string; text: string }> = {
    virüs: { bg: 'bg-cyan-500/20', border: 'border-cyan-400', text: 'text-cyan-300' },
    konak_reseptör: { bg: 'bg-blue-500/20', border: 'border-blue-400', text: 'text-blue-300' },
    ilaç: { bg: 'bg-emerald-500/20', border: 'border-emerald-400', text: 'text-emerald-300' },
    klinik_sonuç: { bg: 'bg-rose-500/20', border: 'border-rose-400', text: 'text-rose-300' },
    biyobelirteç: { bg: 'bg-purple-500/20', border: 'border-purple-400', text: 'text-purple-300' },
    risk_faktörü: { bg: 'bg-amber-500/20', border: 'border-amber-400', text: 'text-amber-300' }
  };

  const filteredNodes = typeFilter === 'all' 
    ? BIOMEDICAL_GRAPH_DATA.nodes 
    : BIOMEDICAL_GRAPH_DATA.nodes.filter(n => n.type === typeFilter);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-semibold flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5" />
            <span>CORD-19 BİYOMEDİKAL KAVRAM VE ETKİLEŞİM AĞI</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
            Biyomedikal Bilgi Grafiği & Ortak Oluşum Haritası
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
            Virüs proteinleri, insan konak hücre reseptörleri, terapötik ajanlar ve klinik risk faktörleri arasındaki literatür destekli nedensel bağlantılar.
          </p>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <span className="flex items-center gap-1 text-cyan-400">● Virüs</span>
          <span className="flex items-center gap-1 text-blue-400">● Konak Reseptör</span>
          <span className="flex items-center gap-1 text-emerald-400">● Terapötik</span>
          <span className="flex items-center gap-1 text-rose-400">● Klinik Sonuç</span>
          <span className="flex items-center gap-1 text-purple-400">● Biyobelirteç</span>
          <span className="flex items-center gap-1 text-amber-400">● Risk Faktörü</span>
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Visual Graph Matrix Stage */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
          
          {/* Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-3.5 h-3.5 text-slate-400" />
              <span className="text-slate-400 font-mono text-[11px]">Varlık Türü:</span>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-700 rounded-md text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              >
                <option value="all">Tüm Varlıklar ({BIOMEDICAL_GRAPH_DATA.nodes.length})</option>
                <option value="virüs">Virüs & Proteinler</option>
                <option value="konak_reseptör">Konak Hücre Reseptörleri</option>
                <option value="ilaç">Terapötikler & İlaçlar</option>
                <option value="klinik_sonuç">Klinik Sonuçlar (ARDS vb.)</option>
                <option value="biyobelirteç">Biyobelirteçler (D-Dimer vb.)</option>
                <option value="risk_faktörü">Risk Faktörleri</option>
              </select>
            </div>

            <div className="flex items-center gap-1 text-slate-400">
              <button
                onClick={() => setZoomLevel(prev => Math.min(prev + 0.1, 1.4))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Yakınlaştır"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(prev => Math.max(prev - 0.1, 0.7))}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Uzaklaştır"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setZoomLevel(1)}
                className="p-1.5 hover:bg-slate-800 rounded text-slate-300"
                title="Sıfırla"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Interactive Node Canvas Grid */}
          <div
            className="grid grid-cols-2 sm:grid-cols-3 gap-3 min-h-[460px] p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 transition-transform origin-top-left"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {filteredNodes.map((node) => {
              const isSelected = node.id === selectedNode.id;
              const isConnected = connectedNodeIds.has(node.id);
              const colorInfo = nodeColorMap[node.type];

              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${
                    isSelected
                      ? `bg-slate-900 border-2 ${colorInfo.border} shadow-lg shadow-cyan-500/10`
                      : isConnected
                      ? `bg-slate-950/80 border-slate-700 hover:border-slate-600`
                      : `bg-slate-950/40 border-slate-800/60 opacity-75 hover:opacity-100 hover:border-slate-700`
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className={`text-[10px] font-mono uppercase tracking-wider ${colorInfo.text}`}>
                        {node.type.replace('_', ' ')}
                      </span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-cyan-400" />
                      )}
                    </div>
                    <div className="font-bold text-xs sm:text-sm text-white">
                      {node.name}
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400 line-clamp-2 mt-2 leading-relaxed">
                    {node.description}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="text-[11px] text-slate-500 font-mono text-center">
            Etkileşimlerini ve literatürdeki nedensel bağlarını incelemek için herhangi bir düğüme tıklayın.
          </div>
        </div>

        {/* Right Column: Node Inspector & Linked Biomedical Relations */}
        <div className="lg:col-span-4 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-4">
            
            {/* Header info */}
            <div className="space-y-1 pb-3 border-b border-slate-800">
              <span className={`text-xs font-mono uppercase tracking-wider ${nodeColorMap[selectedNode.type].text} font-semibold`}>
                Seçili Biyomedikal Düğüm
              </span>
              <h3 className="text-xl font-bold text-white leading-snug">
                {selectedNode.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed pt-1">
                {selectedNode.description}
              </p>
            </div>

            {/* Relations list */}
            <div className="space-y-2.5">
              <div className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
                Literatür Destekli İlişkiler ({connectedLinks.length})
              </div>
              
              <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
                {connectedLinks.map((link, idx) => {
                  const isSource = link.source === selectedNode.id;
                  const targetId = isSource ? link.target : link.source;
                  const targetNode = BIOMEDICAL_GRAPH_DATA.nodes.find(n => n.id === targetId);

                  return (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 font-mono">
                          {isSource ? 'Hedefe Etki Eder' : 'Tarafından Etkilenir'}
                        </span>
                        <span className="text-cyan-400 font-mono">Güç: {link.strength}/5</span>
                      </div>
                      <div className="font-semibold text-white">
                        {targetNode?.name}
                      </div>
                      <div className="text-slate-300 text-[11px] font-mono bg-slate-900/80 p-1.5 rounded border border-slate-800">
                        "{link.relation}"
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick action button: search this entity in literature */}
            <button
              onClick={() => onSearchQuery(selectedNode.name)}
              className="w-full py-2.5 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 rounded-xl text-xs font-semibold transition-colors flex items-center justify-center gap-1.5"
            >
              <span>Literatürde "{selectedNode.name}" Ara</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </div>
        </div>

      </div>

    </div>
  );
};
