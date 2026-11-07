export type ActiveModule = 'array' | 'stack' | 'queue' | 'sorting' | 'maze';

export type SortingAlgorithm = 'bubble' | 'quick' | 'selection' | 'insertion' | 'merge';

export interface SortingStep {
  array: number[];
  comparedIndices: number[];
  swappedIndices: number[];
  pivotIndex?: number;
  sortedIndices: number[];
  description: string;
  codeLine: number;
  comparisons: number;
  swaps: number;
}

export interface ArrayElement {
  id: string;
  value: number;
  address: string;
  state: 'idle' | 'highlight' | 'found' | 'target' | 'eliminating' | 'swapping';
}

export interface StackElement {
  id: string;
  value: string | number;
  label?: string;
  isNew?: boolean;
}

export interface QueueElement {
  id: string;
  value: string | number;
  priority?: number;
  isNew?: boolean;
}

export interface CallStackFrame {
  id: string;
  functionName: string;
  line: number;
  args: Record<string, any>;
  returns?: string;
}

export interface EventLoopStep {
  title: string;
  description: string;
  callStack: string[];
  webApis: { id: string; label: string; duration: string }[];
  microtasks: string[];
  macrotasks: string[];
  consoleLogs: string[];
  activePhase: 'idle' | 'stack' | 'webapi' | 'microtask' | 'macrotask';
  codeLine: number;
}

export interface MazeCell {
  row: number;
  col: number;
  isWall: boolean;
  isStart: boolean;
  isEnd: boolean;
  isVisited: boolean;
  isPath: boolean;
  isCurrent?: boolean;
  distance: number;
}

export type MazeAlgorithm = 'bfs' | 'dfs' | 'astar' | 'dijkstra';
