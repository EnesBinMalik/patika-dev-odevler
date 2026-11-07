import { ClientSession, RoomInfo, ServerState, TerminalMessage } from '../types';

let msgCounter = 1;
export const createMsg = (
  text: string,
  type: TerminalMessage['type'] = 'info'
): TerminalMessage => {
  const now = new Date();
  const timeStr = now.toTimeString().split(' ')[0];
  return {
    id: `msg-${Date.now()}-${msgCounter++}`,
    text,
    type,
    timestamp: timeStr,
  };
};

export const INITIAL_ROOMS: Record<string, RoomInfo> = {
  '#genel': {
    name: '#genel',
    description: 'Genel Sohbet Odası (Varsayılan)',
    memberUsernames: [],
  },
  '#yazilim': {
    name: '#yazilim',
    description: 'Yazılım ve Teknoloji Odası',
    memberUsernames: [],
  },
  '#oyun': {
    name: '#oyun',
    description: 'Oyun ve Eğlence Odası',
    memberUsernames: [],
  },
};

export const createServerInitialState = (): ServerState => ({
  isRunning: true,
  port: 5000,
  lanIp: '192.168.1.105',
  startedAt: new Date().toLocaleTimeString(),
  serverSocketAlive: true,
  activeHandlerThreads: 0,
  history: [
    createMsg('╔════════════════════════════════════════════════════════════╗', 'banner'),
    createMsg('║   JAVA MULTI-THREAD CONSOLE CHAT - SUNUCU (SERVER)         ║', 'banner'),
    createMsg('║   Teknikler : Soket (Socket) & İplik (Multithreading)      ║', 'banner'),
    createMsg('║   Geliştirici : Enes Öztürk                                ║', 'banner'),
    createMsg('╚════════════════════════════════════════════════════════════╝', 'banner'),
    createMsg('┌── YEREL AĞ (LAN) BAĞLANTI BİLGİLERİ ───────────────────────┐', 'info'),
    createMsg('│  ► Wi-Fi (wlan0) : 192.168.1.105 (Port: 5000)              │', 'info'),
    createMsg('│  ► Loopback      : 127.0.0.1     (Port: 5000)              │', 'info'),
    createMsg('└────────────────────────────────────────────────────────────┘', 'info'),
    createMsg('Sunucu başarıyla başlatıldı. Dinlenen Port: 5000', 'system'),
    createMsg('İstemci bağlantıları bekleniyor (ServerSocket.accept dinlemede)...', 'info'),
  ],
});
