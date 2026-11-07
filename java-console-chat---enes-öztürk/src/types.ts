export type ViewTab = 'simulator' | 'architecture' | 'sourcecode' | 'languide';

export interface TerminalMessage {
  id: string;
  text: string;
  type: 'system' | 'error' | 'user' | 'whisper' | 'join' | 'leave' | 'banner' | 'info' | 'prompt';
  timestamp: string;
}

export interface ClientSession {
  id: string;
  username: string;
  clientIp: string;
  clientPort: number;
  currentRoom: string;
  isConnected: boolean;
  history: TerminalMessage[];
  unreadCount?: number;
  readThreadAlive: boolean;
  writeThreadAlive: boolean;
}

export interface ServerState {
  isRunning: boolean;
  port: number;
  lanIp: string;
  startedAt: string | null;
  serverSocketAlive: boolean;
  activeHandlerThreads: number;
  history: TerminalMessage[];
}

export interface RoomInfo {
  name: string;
  description: string;
  memberUsernames: string[];
}
