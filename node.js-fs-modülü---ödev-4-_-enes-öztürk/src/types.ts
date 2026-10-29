export interface FileStatus {
  exists: boolean;
  size: number;
  modifiedAt: string | null;
  createdAt: string | null;
  path: string;
  rawContent: string | null;
  data: any;
  author?: string;
}

export type LogLevel = 'info' | 'success' | 'warn' | 'error' | 'code' | 'signature';

export interface LogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  step?: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE' | 'ALL' | 'STATUS' | 'INIT';
  message: string;
  method?: string;
  payload?: any;
}

export type CodeFlavor = 'callback' | 'async' | 'sync';

export interface HomeworkCodeSnippet {
  id: CodeFlavor;
  title: string;
  badge: string;
  description: string;
  code: string;
}
