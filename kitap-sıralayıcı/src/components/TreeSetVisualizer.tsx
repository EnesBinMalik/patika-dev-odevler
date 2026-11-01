import React, { useState } from 'react';
import { BookItem } from '../types/book';
import { buildTree, TreeNode } from '../utils/treeModel';
import { Network, GitBranch, Info, Play, SkipBack, SkipForward } from 'lucide-react';

interface TreeSetVisualizerProps {
  books: BookItem[];
}

export const TreeSetVisualizer: React.FC<TreeSetVisualizerProps> = ({ books }) => {
  const [treeMode, setTreeMode] = useState<'name' | 'page'>('name');
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [stepIndex, setStepIndex] = useState<number>(books.length);

  // Active subset of books for step-by-step insertion
  const currentBooks = books.slice(0, Math.max(1, Math.min(stepIndex, books.length)));
  const { root, inOrderList } = buildTree(currentBooks, treeMode);

  // Flatten nodes for rendering SVG lines and nodes
  const nodesList: TreeNode[] = [];
  const linesList: { x1: number; y1: number; x2: number; y2: number }[] = [];

  function traverse(node: TreeNode | null) {
    if (!node) return;
    nodesList.push(node);
    if (node.left) {
      linesList.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y });
      traverse(node.left);
    }
    if (node.right) {
      linesList.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y });
      traverse(node.right);
    }
  }

  traverse(root);

  return (
    <section id="tree" className="py-8 border-b border-stone-200 dark:border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400 mb-1">
              <span>Bölüm 02</span>
              <span aria-hidden="true">·</span>
              <span>Veri Yapısı Anatomisi</span>
            </div>
            <h2 className="text-2xl font-serif font-bold text-stone-900 dark:text-stone-100">
              TreeSet İkili Arama Ağacı Görselleştiricisi
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-400 mt-1">
              Java'da <code className="font-mono">TreeSet</code>, arka planda Red-Black Tree (Kırmızı-Siyah İkili Arama Ağacı) kullanır. Elemanlar compareTo veya compare dönüşüne göre yerleşir.
            </p>
          </div>

          {/* Mode Switcher */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="flex items-center p-1 bg-stone-100 dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-lg">
              <button
                onClick={() => {
                  setTreeMode('name');
                  setSelectedNode(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  treeMode === 'name'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                İsim Ağacı (A-Z)
              </button>
              <button
                onClick={() => {
                  setTreeMode('page');
                  setSelectedNode(null);
                }}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors whitespace-nowrap ${
                  treeMode === 'page'
                    ? 'bg-white dark:bg-stone-800 text-stone-900 dark:text-stone-100 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                Sayfa Ağacı (Küçükten Büyüğe)
              </button>
            </div>
          </div>
        </div>

        {/* Step-by-step Insertion Bar */}
        <div className="p-3.5 mb-6 rounded-xl bg-stone-100/70 dark:bg-stone-900/40 border border-stone-200 dark:border-stone-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400">
            <GitBranch className="w-4 h-4 text-stone-700 dark:text-stone-300" />
            <span>Adım Adım Ekleme Simülasyonu:</span>
            <span className="font-mono font-bold text-stone-900 dark:text-stone-100">
              {currentBooks.length} / {books.length} Nesne
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setStepIndex((prev) => Math.max(1, prev - 1))}
              disabled={stepIndex <= 1}
              className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
              title="Önceki Adım"
            >
              <SkipBack className="w-4 h-4" />
            </button>
            <input
              type="range"
              min={1}
              max={books.length}
              value={stepIndex}
              onChange={(e) => setStepIndex(Number(e.target.value))}
              className="w-32 accent-stone-800 dark:accent-stone-200 cursor-pointer"
            />
            <button
              onClick={() => setStepIndex((prev) => Math.min(books.length, prev + 1))}
              disabled={stepIndex >= books.length}
              className="p-1.5 rounded-md hover:bg-stone-200 dark:hover:bg-stone-800 disabled:opacity-40 transition-colors"
              title="Sonraki Adım"
            >
              <SkipForward className="w-4 h-4" />
            </button>
            <button
              onClick={() => setStepIndex(books.length)}
              className="text-xs px-2.5 py-1 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 rounded-md transition-colors"
            >
              Tümünü Göster
            </button>
          </div>
        </div>

        {/* Tree Canvas Stage */}
        <div className="relative w-full h-96 sm:h-[440px] rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/30 overflow-hidden shadow-inner">
          <svg className="w-full h-full absolute inset-0 pointer-events-none">
            {linesList.map((line, idx) => (
              <line
                key={idx}
                x1={`${line.x1}%`}
                y1={`${line.y1}%`}
                x2={`${line.x2}%`}
                y2={`${line.y2}%`}
                stroke="currentColor"
                strokeWidth="2"
                className="text-stone-300 dark:text-stone-700 stroke-dasharray-none"
              />
            ))}
          </svg>

          {/* Node Elements */}
          {nodesList.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)',
                }}
                className={`absolute cursor-pointer transition-all duration-200 p-2 sm:p-2.5 rounded-xl border text-center z-10 max-w-[140px] sm:max-w-[160px] ${
                  isSelected
                    ? 'ring-2 ring-stone-900 dark:ring-stone-100 bg-white dark:bg-stone-800 border-stone-900 dark:border-stone-100 shadow-md scale-105'
                    : 'bg-white dark:bg-stone-800/90 border-stone-200 dark:border-stone-700 hover:border-stone-400 hover:shadow-xs'
                }`}
              >
                <div className="text-xs font-serif font-bold text-stone-900 dark:text-stone-100 truncate">
                  {node.book.name}
                </div>
                <div className="text-[11px] font-mono text-stone-500 dark:text-stone-400 mt-0.5">
                  {treeMode === 'name' ? `${node.book.name[0]} · A-Z` : `${node.book.pageCount} sf`}
                </div>
              </div>
            );
          })}

          {/* Stage Legend / Info Watermark */}
          <div className="absolute left-4 bottom-4 text-xs text-stone-500 dark:text-stone-400 pointer-events-none flex items-center gap-2">
            <Info className="w-3.5 h-3.5" />
            <span>Detay ve karşılaştırma geçmişi için düğümlere tıklayın</span>
          </div>
        </div>

        {/* Selected Node Details Card & In-Order Traversal */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6">
          {/* Left: Selected Node Comparison Trace */}
          <div className="lg:col-span-6 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              Düğüm Analizi & Karşılaştırma Rotası
            </h4>
            {selectedNode ? (
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200 dark:border-stone-800">
                  <span className="font-serif font-bold text-stone-900 dark:text-stone-100 text-sm">
                    {selectedNode.book.name}
                  </span>
                  <span className="font-mono text-stone-600 dark:text-stone-400">
                    {selectedNode.book.pageCount} sayfa · {selectedNode.book.author}
                  </span>
                </div>
                <p className="text-stone-600 dark:text-stone-400 font-medium">Ağaca Eklenme Adımları:</p>
                <ul className="space-y-1.5 pl-3 border-l-2 border-stone-300 dark:border-stone-700">
                  {selectedNode.comparisonHistory?.map((step, idx) => (
                    <li key={idx} className="font-mono text-[11px] text-stone-700 dark:text-stone-300">
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p className="text-xs text-stone-500 py-3">
                Ağaçtaki herhangi bir kitap kutusuna tıklayarak ağaca eklenirken hangi düğümlerle compareTo/compare yapıldığını görün.
              </p>
            )}
          </div>

          {/* Right: In-Order Traversal Explanation */}
          <div className="lg:col-span-6 p-4 rounded-xl border border-stone-200 dark:border-stone-800 bg-stone-100/50 dark:bg-stone-900/50">
            <h4 className="text-xs font-bold text-stone-700 dark:text-stone-300 uppercase tracking-wider mb-2">
              In-Order Dolaşma (Sol Düğüm → Kök → Sağ Düğüm)
            </h4>
            <p className="text-xs text-stone-600 dark:text-stone-400 mb-3">
              İkili Arama Ağacı'nda <em>in-order traversal</em> yapıldığında elemanlar tam olarak sıralı dizilimi verir. Java TreeSet döngüsü bu sırayla elemanları okur:
            </p>
            <div className="flex flex-wrap items-center gap-1.5">
              {inOrderList.map((item, idx) => (
                <React.Fragment key={item.id}>
                  <span className="px-2 py-1 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-md text-xs font-serif font-medium text-stone-900 dark:text-stone-100">
                    {item.name}
                  </span>
                  {idx < inOrderList.length - 1 && (
                    <span className="text-xs text-stone-400 font-mono">→</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
