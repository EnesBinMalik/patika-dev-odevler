/**
 * Centralized Logging Service
 * Author: Enes Öztürk
 * The logging mechanism is abstracted behind ILoggerService.
 * If the logging target needs to change (e.g. to Winston, Seq, File, or ElasticSearch),
 * only this single service implementation is modified without touching any other code.
 */

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'HTTP_REQUEST' | 'HTTP_RESPONSE' | 'VALIDATION' | 'BUSINESS_RULE' | 'SYSTEM' | 'SECURITY';
  message: string;
  metadata?: any;
}

export interface ILoggerService {
  info(message: string, category?: LogEntry['category'], metadata?: any): void;
  warn(message: string, category?: LogEntry['category'], metadata?: any): void;
  error(message: string, category?: LogEntry['category'], metadata?: any): void;
  debug(message: string, category?: LogEntry['category'], metadata?: any): void;
  getRecentLogs(limit?: number): LogEntry[];
  clearLogs(): void;
}

export class ConsoleLoggerService implements ILoggerService {
  private static instance: ConsoleLoggerService;
  private logs: LogEntry[] = [];
  private readonly maxLogs: number = 200;

  public static getInstance(): ConsoleLoggerService {
    if (!ConsoleLoggerService.instance) {
      ConsoleLoggerService.instance = new ConsoleLoggerService();
    }
    return ConsoleLoggerService.instance;
  }

  private writeLog(level: LogEntry['level'], message: string, category: LogEntry['category'] = 'SYSTEM', metadata?: any) {
    const timestamp = new Date().toISOString();
    const entry: LogEntry = {
      id: Math.random().toString(36).substring(2, 9),
      timestamp,
      level,
      category,
      message,
      metadata,
    };

    // Keep in-memory buffer for real-time frontend monitoring
    this.logs.unshift(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.pop();
    }

    // Direct formatted output to stdout / console
    const colorReset = '\x1b[0m';
    const colorLevel =
      level === 'ERROR' ? '\x1b[31m' : // Red
      level === 'WARN' ? '\x1b[33m' : // Yellow
      level === 'INFO' ? '\x1b[36m' : // Cyan
      '\x1b[35m'; // Magenta

    const categoryTag = `[\x1b[32m${category}\x1b[0m]`;
    const metaStr = metadata ? ` | ${JSON.stringify(metadata)}` : '';
    console.log(`${colorLevel}[${level}]${colorReset} ${timestamp} ${categoryTag} ${message}${metaStr}`);
  }

  public info(message: string, category: LogEntry['category'] = 'SYSTEM', metadata?: any): void {
    this.writeLog('INFO', message, category, metadata);
  }

  public warn(message: string, category: LogEntry['category'] = 'SYSTEM', metadata?: any): void {
    this.writeLog('WARN', message, category, metadata);
  }

  public error(message: string, category: LogEntry['category'] = 'SYSTEM', metadata?: any): void {
    this.writeLog('ERROR', message, category, metadata);
  }

  public debug(message: string, category: LogEntry['category'] = 'SYSTEM', metadata?: any): void {
    this.writeLog('DEBUG', message, category, metadata);
  }

  public getRecentLogs(limit: number = 50): LogEntry[] {
    return this.logs.slice(0, limit);
  }

  public clearLogs(): void {
    this.logs = [];
  }
}
