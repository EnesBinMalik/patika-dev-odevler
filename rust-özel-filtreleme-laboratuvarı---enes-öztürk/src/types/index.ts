export interface ChecklistItem {
  id: number;
  stepNumber: number;
  title: string;
  description: string;
  codeSnippet: string;
  lineHighlight?: [number, number];
  completed: boolean;
  explanation: string;
}

export interface PresetCode {
  id: string;
  title: string;
  tag: string;
  description: string;
  code: string;
  initialItems: (number | string)[];
  initialCondition: number | string;
}

export interface VisualizerStep {
  stepIndex: number;
  currentIndex: number;
  currentItem: number | string;
  conditionValue: number | string;
  isMatch: boolean;
  explanation: string;
  currentResult: (number | string)[];
}

export interface CargoFile {
  name: string;
  path: string;
  icon: string;
  content: string;
  language: string;
}
