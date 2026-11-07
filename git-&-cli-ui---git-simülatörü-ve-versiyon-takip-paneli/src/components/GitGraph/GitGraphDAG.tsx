import React, { useState, useMemo } from 'react';
import { GitState, GitCommit } from '../../types/git';
import { GitBranch, GitCommit as GitCommitIcon, GitMerge, Check, Eye, Tag, Cloud, ArrowRight, CornerDownRight } from 'lucide-react';

interface GitGraphDAGProps {
  gitState: GitState;
  selectedCommitId: string | null;
  onSelectCommit: (commit: GitCommit) => void;
  onCheckoutCommit: (commitId: string) => void;
  onCreateBranchAtCommit: (commitId: string) => void;
}

interface LayoutNode {
  commit: GitCommit;
  lane: number;
  x: number;
  y: number;
  color: string;
  isHead: boolean;
  branchTags: string[];
  remoteTags: string[];
}

const LANE_COLORS = [
  '#10b981', // emerald (main)
  '#06b6d4', // cyan (features)
  '#8b5cf6', // violet (dev / experiment)
  '#f59e0b', // amber (hotfix)
  '#ec4899', // pink
  '#3b82f6', // blue
];

export const GitGraphDAG: React.FC<GitGraphDAGProps> = ({
  gitState,
  selectedCommitId,
  onSelectCommit,
  onCheckoutCommit,
  onCreateBranchAtCommit,
}) => {
  const [viewOrientation, setViewOrientation] = useState<'horizontal' | 'vertical'>('vertical');
  const [hoveredCommitId, setHoveredCommitId] = useState<string | null>(null);

  // Compute topological layout of commits and branch lanes
  const layout = useMemo(() => {
    const commits = Object.values(gitState.commits);
    if (commits.length === 0) return { nodes: [], connections: [], width: 400, height: 300 };

    // Find root commits (no parents)
    // We sort topologically so older commits come first, or reverse for top-down
    const commitMap = new Map<string, GitCommit>(commits.map(c => [c.id, c]));
    
    // Sort commits by dependency/lineage
    const visited = new Set<string>();
    const sorted: GitCommit[] = [];

    const visit = (id: string) => {
      if (visited.has(id)) return;
      visited.add(id);
      const c = commitMap.get(id);
      if (c) {
        c.parents.forEach(p => visit(p));
        sorted.push(c);
      }
    };

    commits.forEach(c => visit(c.id));

    // Reverse for vertical layout: newest at the top (standard git log style)
    const displayList = [...sorted].reverse();

    // Assign lanes to branches
    const branchLanes: Record<string, number> = { main: 0 };
    let nextLane = 1;

    Object.keys(gitState.branches).forEach(b => {
      if (b !== 'main' && branchLanes[b] === undefined) {
        branchLanes[b] = nextLane++;
      }
    });

    // Node dimensions
    const isVertical = viewOrientation === 'vertical';
    const rowHeight = isVertical ? 72 : 90;
    const colWidth = isVertical ? 48 : 110;
    const startX = isVertical ? 40 : 50;
    const startY = isVertical ? 50 : 50;

    const nodes: LayoutNode[] = displayList.map((c, index) => {
      // Determine lane based on commit branchName or fallback
      let lane = branchLanes[c.branchName] ?? 0;
      if (c.parents.length > 1) {
        // Merge commit sits on target branch lane
        lane = branchLanes[c.branchName] ?? 0;
      }

      const x = isVertical ? startX + lane * colWidth : startX + (displayList.length - 1 - index) * colWidth;
      const y = isVertical ? startY + index * rowHeight : startY + lane * rowHeight;
      const color = LANE_COLORS[lane % LANE_COLORS.length];

      // Find which branches point to this commit
      const branchTags: string[] = [];
      Object.entries(gitState.branches).forEach(([bName, bId]) => {
        if (bId === c.id) branchTags.push(bName);
      });

      // Find remote tracking branches
      const remoteTags: string[] = [];
      Object.entries(gitState.remotes.origin?.branches || {}).forEach(([rbName, rbId]) => {
        if (rbId === c.id) remoteTags.push(`origin/${rbName}`);
      });

      const isHead = gitState.head.commitId === c.id;

      return {
        commit: c,
        lane,
        x,
        y,
        color,
        isHead,
        branchTags,
        remoteTags,
      };
    });

    const nodeCoordMap = new Map<string, { x: number; y: number; color: string }>(
      nodes.map(n => [n.commit.id, { x: n.x, y: n.y, color: n.color }])
    );

    // Build connections between commits and their parents
    interface Connection {
      fromId: string;
      toId: string;
      from: { x: number; y: number };
      to: { x: number; y: number };
      color: string;
      isMerge: boolean;
    }

    const connections: Connection[] = [];
    nodes.forEach(childNode => {
      childNode.commit.parents.forEach((parentId, pIdx) => {
        const parentCoord = nodeCoordMap.get(parentId);
        if (parentCoord) {
          connections.push({
            fromId: childNode.commit.id,
            toId: parentId,
            from: { x: childNode.x, y: childNode.y },
            to: { x: parentCoord.x, y: parentCoord.y },
            color: pIdx > 0 ? childNode.color : (parentCoord.color || childNode.color),
            isMerge: childNode.commit.parents.length > 1,
          });
        }
      });
    });

    const maxLane = Math.max(0, ...nodes.map(n => n.lane));
    const width = isVertical
      ? Math.max(500, startX + (maxLane + 1) * colWidth + 400)
      : Math.max(600, startX + nodes.length * colWidth + 100);
    const height = isVertical
      ? Math.max(300, startY + nodes.length * rowHeight + 40)
      : Math.max(250, startY + (maxLane + 1) * rowHeight + 60);

    return { nodes, connections, width, height };
  }, [gitState, viewOrientation]);

  return (
    <div className="flex flex-col h-full bg-slate-900/60 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
      {/* Header Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-950/80 border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <GitBranch className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Görsel Versiyon Ağacı (Git DAG)
            </span>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            {Object.keys(gitState.commits).length} commit · {Object.keys(gitState.branches).length} aktif dal
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Legend indicators */}
          <div className="hidden md:flex items-center gap-3 text-xs text-slate-400 mr-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-emerald-500/30" />
              <span>HEAD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-cyan-500" />
              <span>Branch</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-violet-500" />
              <span>Merge</span>
            </div>
          </div>

          {/* Orientation Toggle */}
          <div className="flex items-center p-0.5 bg-slate-800/90 rounded-lg text-xs">
            <button
              onClick={() => setViewOrientation('vertical')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewOrientation === 'vertical' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Dikey
            </button>
            <button
              onClick={() => setViewOrientation('horizontal')}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                viewOrientation === 'horizontal' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Yatay
            </button>
          </div>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="flex-1 overflow-auto p-4 relative custom-scrollbar">
        {layout.nodes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 space-y-2 py-12">
            <GitCommitIcon className="w-8 h-8 opacity-40 animate-pulse" />
            <p className="text-sm">Henüz commit oluşturulmamış.</p>
            <p className="text-xs text-slate-600">Terminalden <code className="text-slate-400 font-mono">git commit</code> çalıştırın.</p>
          </div>
        ) : (
          <div className="relative min-w-full" style={{ width: layout.width, height: layout.height }}>
            <svg
              className="absolute inset-0 pointer-events-none"
              width={layout.width}
              height={layout.height}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feComposite in="SourceGraphic" in2="blur" operator="over" />
                </filter>
              </defs>

              {/* Connecting Curved Lines */}
              {layout.connections.map((conn, idx) => {
                const { from, to, color } = conn;
                let pathD = '';

                if (viewOrientation === 'vertical') {
                  if (from.x === to.x) {
                    // Straight line down
                    pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                  } else {
                    // Smooth S-curve between lanes
                    const midY = (from.y + to.y) / 2;
                    pathD = `M ${from.x} ${from.y} C ${from.x} ${midY}, ${to.x} ${midY}, ${to.x} ${to.y}`;
                  }
                } else {
                  // Horizontal layout
                  if (from.y === to.y) {
                    pathD = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;
                  } else {
                    const midX = (from.x + to.x) / 2;
                    pathD = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
                  }
                }

                return (
                  <path
                    key={`conn-${conn.fromId}-${conn.toId}-${idx}`}
                    d={pathD}
                    fill="none"
                    stroke={color}
                    strokeWidth="2.5"
                    strokeOpacity="0.75"
                    strokeLinecap="round"
                  />
                );
              })}
            </svg>

            {/* Commit Nodes & Labels */}
            {layout.nodes.map((node) => {
              const isSelected = selectedCommitId === node.commit.id;
              const isHovered = hoveredCommitId === node.commit.id;
              const isMerge = node.commit.parents.length > 1;

              return (
                <div
                  key={node.commit.id}
                  className="absolute"
                  style={{
                    left: `${node.x}px`,
                    top: `${node.y}px`,
                    transform: 'translate(-50%, -50%)',
                  }}
                  onMouseEnter={() => setHoveredCommitId(node.commit.id)}
                  onMouseLeave={() => setHoveredCommitId(null)}
                >
                  {/* The interactive Circle Node */}
                  <button
                    onClick={() => onSelectCommit(node.commit)}
                    title={`Commit: ${node.commit.shortId}\n${node.commit.message}`}
                    className={`relative group flex items-center justify-center rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 ${
                      isSelected
                        ? 'w-7 h-7 ring-4 ring-white/50 scale-110 z-30'
                        : isHovered
                        ? 'w-6 h-6 ring-2 ring-slate-300 scale-105 z-20'
                        : 'w-5 h-5 z-10'
                    }`}
                    style={{
                      backgroundColor: node.color,
                      boxShadow: node.isHead
                        ? `0 0 16px ${node.color}, 0 0 32px ${node.color}50`
                        : undefined,
                    }}
                  >
                    {/* Inner icon / dot */}
                    {isMerge ? (
                      <GitMerge className="w-3 h-3 text-white" />
                    ) : node.isHead ? (
                      <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                    ) : (
                      <div className="w-1.5 h-1.5 rounded-full bg-slate-950/60" />
                    )}

                    {/* Active HEAD indicator ring */}
                    {node.isHead && (
                      <span className="absolute -inset-1 rounded-full border border-emerald-400 animate-ping opacity-30" />
                    )}
                  </button>

                  {/* Commit Information Block (Right-aligned in vertical mode, or bottom-aligned in horizontal) */}
                  {viewOrientation === 'vertical' && (
                    <div
                      className="absolute left-8 top-1/2 -translate-y-1/2 whitespace-nowrap flex items-center gap-2 pointer-events-auto"
                      style={{ width: '420px' }}
                    >
                      {/* HEAD Tag */}
                      {node.isHead && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-500/50 text-[11px] font-mono font-bold text-emerald-300">
                          <span>HEAD</span>
                          {gitState.head.type === 'branch' && (
                            <>
                              <ArrowRight className="w-2.5 h-2.5 opacity-60" />
                              <span>{gitState.head.name}</span>
                            </>
                          )}
                        </div>
                      )}

                      {/* Local Branch Tags */}
                      {node.branchTags
                        .filter(b => !(node.isHead && gitState.head.type === 'branch' && gitState.head.name === b))
                        .map(b => (
                          <div
                            key={b}
                            className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-500/40 text-[11px] font-mono text-cyan-300"
                          >
                            <GitBranch className="w-2.5 h-2.5" />
                            <span>{b}</span>
                          </div>
                        ))}

                      {/* Remote Tags */}
                      {node.remoteTags.map(rb => (
                        <div
                          key={rb}
                          className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-blue-500/20 border border-blue-500/40 text-[11px] font-mono text-blue-300"
                        >
                          <Cloud className="w-2.5 h-2.5" />
                          <span>{rb}</span>
                        </div>
                      ))}

                      {/* Tag label */}
                      {node.commit.tag && (
                        <div className="flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-[11px] font-mono text-amber-300">
                          <Tag className="w-2.5 h-2.5" />
                          <span>{node.commit.tag}</span>
                        </div>
                      )}

                      {/* Commit Hash */}
                      <span className="font-mono text-xs text-slate-400 bg-slate-800/80 px-1 rounded">
                        {node.commit.shortId}
                      </span>

                      {/* Commit Message & Author */}
                      <span
                        onClick={() => onSelectCommit(node.commit)}
                        className={`text-xs truncate cursor-pointer transition-colors max-w-[220px] ${
                          isSelected ? 'text-white font-semibold' : 'text-slate-300 hover:text-white'
                        }`}
                      >
                        {node.commit.message}
                      </span>

                      <span className="text-[11px] text-slate-500 font-mono">
                        {node.commit.timestamp}
                      </span>
                    </div>
                  )}

                  {/* Horizontal mode label */}
                  {viewOrientation === 'horizontal' && (
                    <div className="absolute top-6 left-1/2 -translate-x-1/2 text-center pointer-events-auto">
                      <span className="font-mono text-[10px] text-slate-400 bg-slate-800 px-1 rounded">
                        {node.commit.shortId}
                      </span>
                      {node.isHead && (
                        <div className="mt-1 px-1 py-0.2 rounded bg-emerald-500/20 border border-emerald-500/40 text-[9px] font-mono text-emerald-300 whitespace-nowrap">
                          HEAD
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Quick Action Footer on Selected Commit */}
      {selectedCommitId && gitState.commits[selectedCommitId] && (
        <div className="flex items-center justify-between px-4 py-2 bg-slate-950 border-t border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <span className="font-semibold text-slate-400">Seçili Commit:</span>
            <span className="font-mono text-emerald-400">{selectedCommitId.slice(0, 7)}</span>
            <span className="truncate max-w-xs text-slate-300">
              "{gitState.commits[selectedCommitId].message}"
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onCheckoutCommit(selectedCommitId)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            >
              <CornerDownRight className="w-3 h-3 text-cyan-400" />
              <span>Checkout Yap</span>
            </button>
            <button
              onClick={() => onCreateBranchAtCommit(selectedCommitId)}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors"
            >
              <GitBranch className="w-3 h-3" />
              <span>Buradan Dal Aç</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
