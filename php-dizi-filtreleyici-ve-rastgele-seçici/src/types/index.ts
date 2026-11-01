export type ArrayElement = string | null;

export interface PipelineStep {
  name: string;
  func: 'original' | 'array_filter' | 'array_rand' | 'array_map';
  description: string;
  items: Array<{
    originalIndex: number;
    value: string | null;
    isFilteredOut?: boolean;
    isSelected?: boolean;
    newIndex?: number;
  }>;
}

export interface SimulationResult {
  originalArray: ArrayElement[];
  countRequested: number;
  filteredArray: { key: number; value: string }[];
  selectedKeys: number[];
  finalResult: string[];
  phpPrintROutput: string;
  timestamp: number;
}

export interface Preset {
  id: string;
  name: string;
  iconName: string;
  items: ArrayElement[];
  description: string;
}
