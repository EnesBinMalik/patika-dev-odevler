import React, { useState, useRef, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, Sparkles, MapPin, Flag, Layers, Compass, FastForward, CheckCircle2 } from 'lucide-react';
import { MazeAlgorithm, MazeCell } from '../../types';

const ROWS = 16;
const COLS = 28;

export const MazeVisualizer: React.FC = () => {
  const [grid, setGrid] = useState<MazeCell[][]>([]);
  const [startPos, setStartPos] = useState<{ r: number; c: number }>({ r: 2, c: 3 });
  const [endPos, setEndPos] = useState<{ r: number; c: number }>({ r: 13, c: 24 });
  const [isMouseDown, setIsMouseDown] = useState<boolean>(false);
  const [mode, setMode] = useState<'wall' | 'start' | 'end'>('wall');
  const [algorithm, setAlgorithm] = useState<MazeAlgorithm>('bfs');
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [stats, setStats] = useState<{ visitedCount: number; pathLength: number; timeTaken: number }>({
    visitedCount: 0,
    pathLength: 0,
    timeTaken: 0,
  });
  const [dataStructureType, setDataStructureType] = useState<string>('Kuyruk (Queue - FIFO)');
  const [dsElementCount, setDsElementCount] = useState<number>(0);
  const [statusMessage, setStatusMessage] = useState<string>(
    'Labirent hazır. Duvar çizmek için sürükleyebilir veya "Labirent Üret" ile otomatik engel oluşturabilirsiniz.'
  );

  const animationTimeouts = useRef<NodeJS.Timeout[]>([]);

  // Initialize empty grid
  const initializeGrid = (clearWalls: boolean = true) => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
    setIsRunning(false);

    const newGrid: MazeCell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: MazeCell[] = [];
      for (let c = 0; c < COLS; c++) {
        const isStart = r === startPos.r && c === startPos.c;
        const isEnd = r === endPos.r && c === endPos.c;
        const isWall = clearWalls ? false : grid[r]?.[c]?.isWall || false;

        row.push({
          row: r,
          col: c,
          isWall,
          isStart,
          isEnd,
          isVisited: false,
          isPath: false,
          distance: Infinity,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStats({ visitedCount: 0, pathLength: 0, timeTaken: 0 });
    setDsElementCount(0);
  };

  useEffect(() => {
    initializeGrid(true);
  }, []);

  const handleCellClick = (r: number, c: number) => {
    if (isRunning) return;
    if (mode === 'start') {
      if (grid[r][c].isEnd || grid[r][c].isWall) return;
      setStartPos({ r, c });
      setGrid((prev) =>
        prev.map((row) =>
          row.map((cell) => ({
            ...cell,
            isStart: cell.row === r && cell.col === c,
          }))
        )
      );
      setMode('wall');
    } else if (mode === 'end') {
      if (grid[r][c].isStart || grid[r][c].isWall) return;
      setEndPos({ r, c });
      setGrid((prev) =>
        prev.map((row) =>
          row.map((cell) => ({
            ...cell,
            isEnd: cell.row === r && cell.col === c,
          }))
        )
      );
      setMode('wall');
    } else {
      toggleWall(r, c);
    }
  };

  const toggleWall = (r: number, c: number) => {
    if (grid[r][c].isStart || grid[r][c].isEnd) return;
    setGrid((prev) => {
      const next = prev.map((row) => [...row]);
      next[r][c] = { ...next[r][c], isWall: !next[r][c].isWall };
      return next;
    });
  };

  const handleMouseEnter = (r: number, c: number) => {
    if (!isMouseDown || isRunning || mode !== 'wall') return;
    toggleWall(r, c);
  };

  // Generate Maze with recursive backtracking / random obstacles
  const generateMaze = () => {
    initializeGrid(true);
    const newGrid: MazeCell[][] = [];
    for (let r = 0; r < ROWS; r++) {
      const row: MazeCell[] = [];
      for (let c = 0; c < COLS; c++) {
        const isStart = r === startPos.r && c === startPos.c;
        const isEnd = r === endPos.r && c === endPos.c;
        // Generate random walls with ~28% density and corridor carving
        let isWall = false;
        if (!isStart && !isEnd) {
          if (r % 2 === 1 && c % 2 === 1) {
            isWall = true;
          } else if (Math.random() < 0.28) {
            isWall = true;
          }
        }
        row.push({
          row: r,
          col: c,
          isWall,
          isStart,
          isEnd,
          isVisited: false,
          isPath: false,
          distance: Infinity,
        });
      }
      newGrid.push(row);
    }
    setGrid(newGrid);
    setStatusMessage('Prosedürel labirent engelleri oluşturuldu. Arama algoritmasını başlatabilirsiniz.');
  };

  // Clear Path Only (Keep walls)
  const clearPath = () => {
    animationTimeouts.current.forEach(clearTimeout);
    animationTimeouts.current = [];
    setIsRunning(false);
    setGrid((prev) =>
      prev.map((row) =>
        row.map((cell) => ({
          ...cell,
          isVisited: false,
          isPath: false,
          distance: Infinity,
        }))
      )
    );
    setStats({ visitedCount: 0, pathLength: 0, timeTaken: 0 });
    setDsElementCount(0);
    setStatusMessage('Arama yolu temizlendi, duvarlar korundu.');
  };

  // --- Search Algorithms Implementation ---
  const runPathfinding = () => {
    clearPath();
    setIsRunning(true);
    const startTime = performance.now();

    const parentMap: Map<string, { r: number; c: number } | null> = new Map();
    const visitedOrder: { r: number; c: number }[] = [];
    const key = (r: number, c: number) => `${r},${c}`;

    const getNeighbors = (r: number, c: number) => {
      const neighbors: { r: number; c: number }[] = [];
      const dirs = [
        [-1, 0], // Yukarı
        [0, 1],  // Sağ
        [1, 0],  // Aşağı
        [0, -1], // Sol
      ];
      for (const [dr, dc] of dirs) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
          if (!grid[nr][nc].isWall) {
            neighbors.push({ r: nr, c: nc });
          }
        }
      }
      return neighbors;
    };

    let found = false;

    if (algorithm === 'bfs') {
      setDataStructureType('Kuyruk (Queue - FIFO)');
      const queue: { r: number; c: number }[] = [{ r: startPos.r, c: startPos.c }];
      const visited = new Set<string>();
      visited.add(key(startPos.r, startPos.c));
      parentMap.set(key(startPos.r, startPos.c), null);

      while (queue.length > 0) {
        const current = queue.shift()!; // FIFO dequeue
        visitedOrder.push(current);

        if (current.r === endPos.r && current.c === endPos.c) {
          found = true;
          break;
        }

        const neighbors = getNeighbors(current.r, current.c);
        for (const n of neighbors) {
          const k = key(n.r, n.c);
          if (!visited.has(k)) {
            visited.add(k);
            parentMap.set(k, current);
            queue.push(n); // FIFO enqueue
          }
        }
      }
    } else if (algorithm === 'dfs') {
      setDataStructureType('Yığıt (Stack - LIFO)');
      const stack: { r: number; c: number }[] = [{ r: startPos.r, c: startPos.c }];
      const visited = new Set<string>();
      parentMap.set(key(startPos.r, startPos.c), null);

      while (stack.length > 0) {
        const current = stack.pop()!; // LIFO pop
        const kCurrent = key(current.r, current.c);

        if (visited.has(kCurrent)) continue;
        visited.add(kCurrent);
        visitedOrder.push(current);

        if (current.r === endPos.r && current.c === endPos.c) {
          found = true;
          break;
        }

        const neighbors = getNeighbors(current.r, current.c);
        for (const n of neighbors) {
          const k = key(n.r, n.c);
          if (!visited.has(k)) {
            parentMap.set(k, current);
            stack.push(n); // LIFO push
          }
        }
      }
    } else if (algorithm === 'astar' || algorithm === 'dijkstra') {
      setDataStructureType('Öncelik Kuyruğu (Priority Queue / Min-Heap)');
      const manhattan = (r: number, c: number) =>
        algorithm === 'astar' ? Math.abs(r - endPos.r) + Math.abs(c - endPos.c) : 0;

      interface PNode {
        r: number;
        c: number;
        g: number;
        f: number;
      }

      const openSet: PNode[] = [{ r: startPos.r, c: startPos.c, g: 0, f: manhattan(startPos.r, startPos.c) }];
      const gScores: Map<string, number> = new Map();
      gScores.set(key(startPos.r, startPos.c), 0);
      parentMap.set(key(startPos.r, startPos.c), null);
      const visited = new Set<string>();

      while (openSet.length > 0) {
        // Find node with minimum f
        openSet.sort((a, b) => a.f - b.f);
        const current = openSet.shift()!;
        const kCurrent = key(current.r, current.c);

        if (visited.has(kCurrent)) continue;
        visited.add(kCurrent);
        visitedOrder.push({ r: current.r, c: current.c });

        if (current.r === endPos.r && current.c === endPos.c) {
          found = true;
          break;
        }

        const neighbors = getNeighbors(current.r, current.c);
        for (const n of neighbors) {
          const kn = key(n.r, n.c);
          const tentativeG = current.g + 1;
          const currentG = gScores.get(kn) ?? Infinity;

          if (tentativeG < currentG) {
            gScores.set(kn, tentativeG);
            parentMap.set(kn, { r: current.r, c: current.c });
            openSet.push({
              r: n.r,
              c: n.c,
              g: tentativeG,
              f: tentativeG + manhattan(n.r, n.c),
            });
          }
        }
      }
    }

    // Reconstruct shortest path if target was reached
    const shortestPath: { r: number; c: number }[] = [];
    if (found) {
      let curr: { r: number; c: number } | null | undefined = endPos;
      while (curr) {
        shortestPath.unshift(curr);
        curr = parentMap.get(key(curr.r, curr.c));
      }
    }

    // Animate exploration
    const speedMs = 12;
    visitedOrder.forEach((node, idx) => {
      const t = setTimeout(() => {
        setGrid((prev) => {
          const next = prev.map((row) => [...row]);
          next[node.r][node.c] = {
            ...next[node.r][node.c],
            isVisited: true,
          };
          return next;
        });
        setDsElementCount(visitedOrder.length - idx);

        if (idx === visitedOrder.length - 1) {
          // Animation of final path
          if (found) {
            shortestPath.forEach((pNode, pIdx) => {
              const pt = setTimeout(() => {
                setGrid((prevPath) => {
                  const nextP = prevPath.map((row) => [...row]);
                  nextP[pNode.r][pNode.c] = {
                    ...nextP[pNode.r][pNode.c],
                    isPath: true,
                  };
                  return nextP;
                });

                if (pIdx === shortestPath.length - 1) {
                  const elapsed = Math.round(performance.now() - startTime);
                  setIsRunning(false);
                  setStats({
                    visitedCount: visitedOrder.length,
                    pathLength: shortestPath.length,
                    timeTaken: elapsed,
                  });
                  setStatusMessage(
                    `Hedefe ulaşıldı! Ziyaret edilen hücre: ${visitedOrder.length}, Yol uzunluğu: ${shortestPath.length} birim.`
                  );
                }
              }, pIdx * 25);
              animationTimeouts.current.push(pt);
            });
          } else {
            setIsRunning(false);
            setStatusMessage('Hedefe giden yol bulunamadı! Duvarlar labirenti tıkamış.');
          }
        }
      }, idx * speedMs);
      animationTimeouts.current.push(t);
    });
  };

  return (
    <div className="space-y-6">
      {/* Module Banner */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-indigo-400 uppercase tracking-wider font-mono">
              <span>05. Modül</span>
              <span>·</span>
              <span>Graf ve Izgara Arama Algoritmaları</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight mt-1">
              Algoritma Labirenti (Maze Pathfinding Simulator)
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Veri yapılarının gücünü labirent üzerinde gözlemleyin: BFS en kısa yolu bulmak için <strong>Kuyruk (Queue)</strong> kullanırken, DFS derinlemesine arama için <strong>Yığıt (Stack)</strong> kullanır.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={generateMaze}
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Labirent Üret</span>
            </button>
            <button
              onClick={clearPath}
              disabled={isRunning}
              className="px-3 py-2 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
            >
              Yolu Temizle
            </button>
            <button
              onClick={() => initializeGrid(true)}
              disabled={isRunning}
              className="p-2 text-slate-300 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded-lg transition-colors cursor-pointer"
              title="Tümünü Sıfırla"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Control Toolbar */}
      <div className="p-4 bg-slate-900 border border-slate-800 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Algorithms */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono text-slate-400 mr-1">Algoritma:</span>
          {(['bfs', 'dfs', 'astar', 'dijkstra'] as MazeAlgorithm[]).map((algoKey) => (
            <button
              key={algoKey}
              onClick={() => setAlgorithm(algoKey)}
              disabled={isRunning}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                algorithm === algoKey
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white bg-slate-950/60'
              }`}
            >
              {algoKey === 'bfs' && 'BFS (Kuyruk / En Kısa)'}
              {algoKey === 'dfs' && 'DFS (Yığıt / Derin)'}
              {algoKey === 'astar' && 'A* (Sezgisel)'}
              {algoKey === 'dijkstra' && 'Dijkstra'}
            </button>
          ))}
        </div>

        {/* Placing Mode */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400">Çizim:</span>
          <button
            onClick={() => setMode('wall')}
            className={`px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              mode === 'wall' ? 'bg-slate-700 text-white font-bold' : 'text-slate-400'
            }`}
          >
            Duvar (Engel)
          </button>
          <button
            onClick={() => setMode('start')}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              mode === 'start' ? 'bg-emerald-600 text-white font-bold' : 'text-emerald-400'
            }`}
          >
            <MapPin className="w-3 h-3" />
            <span>Başlangıç</span>
          </button>
          <button
            onClick={() => setMode('end')}
            className={`flex items-center gap-1 px-3 py-1 text-xs rounded-md transition-colors cursor-pointer ${
              mode === 'end' ? 'bg-rose-600 text-white font-bold' : 'text-rose-400'
            }`}
          >
            <Flag className="w-3 h-3" />
            <span>Hedef</span>
          </button>
        </div>

        {/* Start Button */}
        <button
          onClick={runPathfinding}
          disabled={isRunning}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-emerald-950 cursor-pointer active:scale-95"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>Labirenti Çöz</span>
        </button>
      </div>

      {/* Main Interactive Maze Stage */}
      <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl">
        {/* Status bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-800 text-xs font-mono">
          <div className="flex items-center gap-4">
            <span className="text-slate-400">
              Kullanılan Veri Yapısı:{' '}
              <strong className="text-indigo-400 font-bold">{dataStructureType}</strong>
            </span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-slate-400">
              Ziyaret Edilen:{' '}
              <strong className="text-cyan-400 font-bold tabular-nums">{stats.visitedCount}</strong>
            </span>
            <span className="text-slate-400">
              Yol Uzunluğu:{' '}
              <strong className="text-amber-400 font-bold tabular-nums">{stats.pathLength}</strong>
            </span>
            <span className="text-slate-400">
              Süre:{' '}
              <strong className="text-emerald-400 font-bold tabular-nums">{stats.timeTaken}ms</strong>
            </span>
          </div>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-4 py-3 text-xs font-mono text-slate-400 border-b border-slate-800/60">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-emerald-500 inline-block"></span>
            Başlangıç
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-rose-500 inline-block"></span>
            Hedef
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-slate-800 border border-slate-700 inline-block"></span>
            Duvar (Engel)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-cyan-600/70 inline-block"></span>
            Taranan (Visited)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded bg-amber-400 inline-block"></span>
            En Kısa Yol (Path)
          </span>
        </div>

        {/* 2D Grid Canvas */}
        <div
          className="mt-4 flex justify-center overflow-x-auto select-none py-2"
          onMouseDown={() => setIsMouseDown(true)}
          onMouseUp={() => setIsMouseDown(false)}
          onMouseLeave={() => setIsMouseDown(false)}
        >
          <div
            className="inline-grid gap-[2px] bg-slate-950 p-2.5 rounded-xl border border-slate-800"
            style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
          >
            {grid.map((row) =>
              row.map((cell) => {
                let cellClass = 'bg-slate-900 hover:bg-slate-800';

                if (cell.isStart) {
                  cellClass = 'bg-emerald-500 shadow-sm shadow-emerald-500';
                } else if (cell.isEnd) {
                  cellClass = 'bg-rose-500 shadow-sm shadow-rose-500';
                } else if (cell.isPath) {
                  cellClass = 'bg-amber-400 animate-pulse shadow-sm shadow-amber-400 scale-95';
                } else if (cell.isVisited) {
                  cellClass = 'bg-cyan-700/80 transition-colors duration-200';
                } else if (cell.isWall) {
                  cellClass = 'bg-slate-800 border border-slate-700';
                }

                return (
                  <div
                    key={`${cell.row}-${cell.col}`}
                    onMouseDown={() => handleCellClick(cell.row, cell.col)}
                    onMouseEnter={() => handleMouseEnter(cell.row, cell.col)}
                    className={`w-6 h-6 sm:w-7 sm:h-7 rounded-sm flex items-center justify-center cursor-pointer transition-all ${cellClass}`}
                  >
                    {cell.isStart && <MapPin className="w-3.5 h-3.5 text-slate-950 font-bold" />}
                    {cell.isEnd && <Flag className="w-3.5 h-3.5 text-white font-bold" />}
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Status Callout */}
        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
          &gt; {statusMessage}
        </div>
      </div>

      {/* Pedagogical Explanation Strip */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs font-mono">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-sm">
            <Layers className="w-4 h-4" />
            <span>BFS & Kuyruk (Queue) İlişkisi:</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            BFS (Breadth-First Search) düğümleri seviye seviye genişletir. İlk keşfedilen komşu ilk incelenmelidir (FIFO). Bu nedenle <strong>Kuyruk (Queue)</strong> veri yapısı olmadan BFS gerçeklenemez. Ağırlıksız graflarda en kısa yolu bulması garanti altındadır.
          </p>
        </div>

        <div className="p-5 bg-slate-900 border border-slate-800 rounded-2xl space-y-2">
          <div className="flex items-center gap-2 text-purple-400 font-bold text-sm">
            <Compass className="w-4 h-4" />
            <span>DFS & Yığıt (Stack) İlişkisi:</span>
          </div>
          <p className="text-slate-400 font-sans leading-relaxed">
            DFS (Depth-First Search) bir yol boyunca çıkmaza girene kadar en derine iner, ardından geri adım atar (Backtracking). Son keşfedilen düğüm ilk incelenir (LIFO). Bu nedenle <strong>Yığıt (Stack)</strong> veya rekürsif fonksiyon çağrı yığını ile çalışır.
          </p>
        </div>
      </div>
    </div>
  );
};
