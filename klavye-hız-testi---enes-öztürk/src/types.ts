export type TestStatus = 'READY' | 'RUNNING' | 'FINISHED';

export interface WordItem {
  id: number;
  word: string;
  typed?: string;
  status: 'PENDING' | 'CURRENT' | 'CORRECT' | 'WRONG';
}

export interface TimelinePoint {
  second: number;
  wpm: number;
  rawWpm: number;
  errors: number;
}

export interface TestResult {
  duration: number; // e.g. 60
  wpm: number;
  rawWpm: number;
  accuracy: number;
  correctWords: number;
  wrongWords: number;
  correctChars: number;
  wrongChars: number;
  totalKeystrokes: number;
  timeline: TimelinePoint[];
  date: string;
  language: 'tr' | 'en';
}

export type Language = 'tr' | 'en';
export type SoundTheme = 'mechanical' | 'typewriter' | 'soft' | 'off';
