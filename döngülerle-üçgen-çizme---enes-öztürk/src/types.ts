export type Language = 'javascript' | 'python' | 'cpp' | 'java' | 'php';

export type TriangleType = 'left' | 'pyramid' | 'inverted';

export interface TraceStep {
  stepNumber: number;
  i: number; // outer while loop variable (row)
  j: number; // inner for loop variable (column)
  currentLine: string;
  accumulatedOutput: string[];
  activeLoop: 'while-check' | 'for-iteration' | 'row-complete' | 'done';
  description: string;
}

export interface HomeworkMetadata {
  studentName: string;
  course: string;
  topic: string;
  functionName: string;
  defaultN: number;
  date: string;
}
