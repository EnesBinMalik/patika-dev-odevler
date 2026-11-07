import React, { useState, useEffect } from 'react';
import { ClientSession, RoomInfo, ServerState, TerminalMessage } from '../types';
import { TerminalWindow } from './TerminalWindow';
import { createMsg, createServerInitialState, INITIAL_ROOMS } from '../services/simulatorEngine';
import { Plus, Users, LayoutGrid, Layers, RefreshCw, Info, Wifi } from 'lucide-react';

export const TerminalStudio: React.FC = () => {
  const [serverState, setServerState] = useState<ServerState>(createServerInitialState);
  const [rooms, setRooms] = useState<Record<string, RoomInfo>>(INITIAL_ROOMS);
  const [clients, setClients] = useState<ClientSession[]>([]);
  const [activeTabId, setActiveTabId] = useState<string>('server');
  const [layoutMode, setLayoutMode] = useState<'split' | 'tabs'>('split');
  const [nextClientPort, setNextClientPort] = useState(54200);

  // Initialize with default demo session: 1 Server + 2 Clients (Enes Öztürk & Ayşe)
  useEffect(() => {
    startDemoSession();
  }, []);

  const startDemoSession = () => {
    // Reset server
    const srv = createServerInitialState();
    
    // Client 1: Enes Öztürk
    const client1: ClientSession = {
      id: 'client-1',
      username: 'enes',
      clientIp: '192.168.1.100',
      clientPort: 54201,
      currentRoom: '#genel',
      isConnected: true,
      readThreadAlive: true,
      writeThreadAlive: true,
      history: [
        createMsg('╔════════════════════════════════════════════════════════════╗', 'banner'),
        createMsg('║   JAVA MULTI-THREAD CONSOLE CHAT - İSTEMCİ (CLIENT)        ║', 'banner'),
        createMsg('║   Geliştirici : Enes Öztürk                                ║', 'banner'),
        createMsg('║   Mimari      : Java Sockets & İplikler (Threads)          ║', 'banner'),
        createMsg('╚════════════════════════════════════════════════════════════╝', 'banner'),
        createMsg('[192.168.1.105:5000] sunucusuna bağlanılıyor...', 'system'),
        createMsg('✔ Sunucuya başarıyla bağlanıldı!', 'join'),
        createMsg('[SİSTEM] Lütfen sohbete katılmak için bir kullanıcı adı giriniz:', 'system'),
        createMsg('> enes', 'user'),
        createMsg('[SİSTEM] Hoş geldiniz, @enes! Sunucuya başarıyla bağlandınız.', 'system'),
        createMsg('[SİSTEM] Çevrimiçi Kullanıcılar (1): [@enes]', 'system'),
        createMsg('[SİSTEM] \'#genel\' odasına katıldınız! (Genel Sohbet Odası)', 'join'),
        createMsg('[BİLGİ] Komut listesini görmek için /yardim yazabilirsiniz.', 'info'),
        createMsg('────────────────────────────────────────────────────────────', 'info'),
      ],
    };

    // Client 2: Ayşe
    const client2: ClientSession = {
      id: 'client-2',
      username: 'ayse',
      clientIp: '192.168.1.102',
      clientPort: 54202,
      currentRoom: '#genel',
      isConnected: true,
      readThreadAlive: true,
      writeThreadAlive: true,
      history: [
        createMsg('╔════════════════════════════════════════════════════════════╗', 'banner'),
        createMsg('║   JAVA MULTI-THREAD CONSOLE CHAT - İSTEMCİ (CLIENT)        ║', 'banner'),
        createMsg('║   Geliştirici : Enes Öztürk                                ║', 'banner'),
        createMsg('║   Mimari      : Java Sockets & İplikler (Threads)          ║', 'banner'),
        createMsg('╚════════════════════════════════════════════════════════════╝', 'banner'),
        createMsg('[192.168.1.105:5000] sunucusuna bağlanılıyor...', 'system'),
        createMsg('✔ Sunucuya başarıyla bağlanıldı!', 'join'),
        createMsg('[SİSTEM] Lütfen sohbete katılmak için bir kullanıcı adı giriniz:', 'system'),
        createMsg('> ayse', 'user'),
        createMsg('[SİSTEM] Hoş geldiniz, @ayse! Sunucuya başarıyla bağlandınız.', 'system'),
        createMsg('[SİSTEM] Çevrimiçi Kullanıcılar (2): [@ayse, @enes]', 'system'),
        createMsg('[SİSTEM] \'#genel\' odasına katıldınız! (Genel Sohbet Odası)', 'join'),
        createMsg('[BİLGİ] Komut listesini görmek için /yardim yazabilirsiniz.', 'info'),
        createMsg('────────────────────────────────────────────────────────────', 'info'),
      ],
    };

    // Notify client1 that ayse joined
    client1.history.push(createMsg('[#genel] [SİSTEM] >>> @ayse odaya katıldı. (#genel)', 'join'));

    // Server logs
    srv.history.push(
      createMsg('[SUNUCU] Yeni bir istemci bağlandı! IP: 192.168.1.100 (Port: 54201) -> İplik: Istemci-Ipligi-54201', 'system'),
      createMsg('[SUNUCU] Kullanıcı sisteme giriş yaptı: @enes (Toplam Çevrimiçi: 1)', 'info'),
      createMsg('[SUNUCU] Yeni bir istemci bağlandı! IP: 192.168.1.102 (Port: 54202) -> İplik: Istemci-Ipligi-54202', 'system'),
      createMsg('[SUNUCU] Kullanıcı sisteme giriş yaptı: @ayse (Toplam Çevrimiçi: 2)', 'info')
    );
    srv.activeHandlerThreads = 2;

    setServerState(srv);
    setClients([client1, client2]);
    setRooms({
      '#genel': {
        name: '#genel',
        description: 'Genel Sohbet Odası (Varsayılan)',
        memberUsernames: ['enes', 'ayse'],
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
    });
    setNextClientPort(54203);
  };

  const handleToggleServerPower = () => {
    if (serverState.isRunning) {
      // Shutdown
      setServerState((prev) => ({
        ...prev,
        isRunning: false,
        activeHandlerThreads: 0,
        history: [
          ...prev.history,
          createMsg('[SUNUCU] Kapatılıyor... Tüm istemcilere bildirim yapıldı.', 'error'),
          createMsg('[SUNUCU] ServerSocket port 5000 serbest bırakıldı.', 'info'),
        ],
      }));

      // Disconnect all clients
      setClients((prev) =>
        prev.map((c) => ({
          ...c,
          isConnected: false,
          readThreadAlive: false,
          writeThreadAlive: false,
          history: [
            ...c.history,
            createMsg('[SİSTEM] Sunucu bakım için kapatıldı. Soket bağlantısı kesildi.', 'error'),
            createMsg('[BİLGİ] Sunucu ile bağlantı koptu. Program sonlandırıldı.', 'leave'),
          ],
        }))
      );
    } else {
      // Start server
      const newSrv = createServerInitialState();
      setServerState(newSrv);
    }
  };

  // Add a new client terminal
  const handleAddNewClient = (initialName?: string) => {
    const port = nextClientPort;
    setNextClientPort((p) => p + 1);

    const newId = `client-${Date.now()}`;
    const ipSuffix = Math.floor(Math.random() * 80) + 10;
    const clientIp = `192.168.1.${ipSuffix}`;

    const newClient: ClientSession = {
      id: newId,
      username: '',
      clientIp,
      clientPort: port,
      currentRoom: '',
      isConnected: serverState.isRunning,
      readThreadAlive: serverState.isRunning,
      writeThreadAlive: serverState.isRunning,
      history: [
        createMsg('╔════════════════════════════════════════════════════════════╗', 'banner'),
        createMsg('║   JAVA MULTI-THREAD CONSOLE CHAT - İSTEMCİ (CLIENT)        ║', 'banner'),
        createMsg('║   Geliştirici : Enes Öztürk                                ║', 'banner'),
        createMsg('║   Mimari      : Java Sockets & İplikler (Threads)          ║', 'banner'),
        createMsg('╚════════════════════════════════════════════════════════════╝', 'banner'),
      ],
    };

    if (!serverState.isRunning) {
      newClient.history.push(
        createMsg(`[${serverState.lanIp}:${serverState.port}] sunucusuna bağlanılıyor...`, 'system'),
        createMsg(`[HATA] java.net.ConnectException: Connection refused: no further information`, 'error'),
        createMsg('İpucu: ChatServer çalıştırılmamış veya port 5000 kapalı.', 'leave')
      );
    } else {
      newClient.history.push(
        createMsg(`[${serverState.lanIp}:${serverState.port}] sunucusuna bağlanılıyor...`, 'system'),
        createMsg('✔ Sunucuya başarıyla bağlanıldı!', 'join'),
        createMsg('[SİSTEM] Lütfen sohbete katılmak için bir kullanıcı adı giriniz:', 'system')
      );

      // Server log
      setServerState((prev) => ({
        ...prev,
        activeHandlerThreads: prev.activeHandlerThreads + 1,
        history: [
          ...prev.history,
          createMsg(
            `[SUNUCU] Yeni bir istemci bağlandı! IP: ${clientIp} (Port: ${port}) -> İplik: Istemci-Ipligi-${port}`,
            'system'
          ),
        ],
      }));
    }

    setClients((prev) => [...prev, newClient]);
    setActiveTabId(newId);

    // If initialName provided, auto-login
    if (initialName && serverState.isRunning) {
      setTimeout(() => {
        handleClientMessage(newId, initialName);
      }, 150);
    }
  };

  const handleClientMessage = (clientId: string, rawText: string) => {
    const text = rawText.trim();
    if (!text) return;

    setClients((prevClients) => {
      const client = prevClients.find((c) => c.id === clientId);
      if (!client || !client.isConnected) return prevClients;

      // 1. Stage: User has no username yet (Awaiting username)
      if (!client.username) {
        const cleanName = text.replace(/[@# ]/g, '').toLowerCase();
        if (!cleanName) {
          const updated = {
            ...client,
            history: [
              ...client.history,
              createMsg(`> ${text}`, 'user'),
              createMsg('[HATA] Kullanıcı adı geçersiz veya boş olamaz!', 'error'),
            ],
          };
          return prevClients.map((c) => (c.id === clientId ? updated : c));
        }

        // Check if name is taken
        const isTaken = prevClients.some(
          (c) => c.id !== clientId && c.username.toLowerCase() === cleanName && c.isConnected
        );

        if (isTaken) {
          const updated = {
            ...client,
            history: [
              ...client.history,
              createMsg(`> ${text}`, 'user'),
              createMsg(`[HATA] '${cleanName}' kullanıcı adı zaten kullanımda. Farklı bir isim deneyiniz.`, 'error'),
            ],
          };
          return prevClients.map((c) => (c.id === clientId ? updated : c));
        }

        // Registered successfully!
        const onlineList = [
          ...prevClients.filter((c) => c.isConnected && c.username).map((c) => `@${c.username}`),
          `@${cleanName}`,
        ];

        const updatedClient: ClientSession = {
          ...client,
          username: cleanName,
          currentRoom: '#genel',
          history: [
            ...client.history,
            createMsg(`> ${text}`, 'user'),
            createMsg(`[SİSTEM] Hoş geldiniz, @${cleanName}! Sunucuya başarıyla bağlandınız.`, 'system'),
            createMsg(`[SİSTEM] Çevrimiçi Kullanıcılar (${onlineList.length}): [${onlineList.join(', ')}]`, 'system'),
            createMsg(`[SİSTEM] '#genel' odasına katıldınız! (Genel Sohbet Odası)`, 'join'),
            createMsg('[BİLGİ] Komut listesini görmek için /yardim yazabilirsiniz.', 'info'),
            createMsg('────────────────────────────────────────────────────────────', 'info'),
          ],
        };

        // Notify other clients in #genel
        const joinMsg = createMsg(`[#genel] [SİSTEM] >>> @${cleanName} odaya katıldı. (#genel)`, 'join');

        // Update server log
        setServerState((srv) => ({
          ...srv,
          history: [
            ...srv.history,
            createMsg(`[SUNUCU] Kullanıcı sisteme giriş yaptı: @${cleanName} (Toplam Çevrimiçi: ${onlineList.length})`, 'info'),
          ],
        }));

        // Update rooms
        setRooms((prevRooms) => ({
          ...prevRooms,
          '#genel': {
            ...prevRooms['#genel'],
            memberUsernames: [...(prevRooms['#genel']?.memberUsernames || []), cleanName],
          },
        }));

        return prevClients.map((c) => {
          if (c.id === clientId) return updatedClient;
          if (c.isConnected && c.currentRoom === '#genel') {
            return {
              ...c,
              history: [...c.history, joinMsg],
            };
          }
          return c;
        });
      }

      // 2. Stage: User is already logged in and sends commands or chat
      // Handle Commands
      if (text.startsWith('/')) {
        const parts = text.split(' ');
        const cmd = parts[0].toLowerCase();

        if (cmd === '/yardim' || cmd === '/help') {
          const helpHistory = [
            ...client.history,
            createMsg(`> ${text}`, 'user'),
            createMsg('┌── KULLANILABİLİR KOMUTLAR ──────────────────────────────────┐', 'info'),
            createMsg('│  /odalar                 - Aktif sohbet odalarını listeler  │', 'info'),
            createMsg('│  /olustur <oda_adi>      - Yeni bir sohbet odası oluşturur  │', 'info'),
            createMsg('│  /katil <oda_adi>        - Başka bir sohbet odasına geçer   │', 'info'),
            createMsg('│  /kullanicilar           - Çevrimiçi kullanıcıları gösterir │', 'info'),
            createMsg('│  /pm <kullanici> <mesaj> - Belli bir kullanıcıya özel mesaj │', 'info'),
            createMsg('│  /ayril veya /cikis      - Sohbetten güvenli çıkış yapar    │', 'info'),
            createMsg('│  /yardim                 - Bu yardım menüsünü görüntüler    │', 'info'),
            createMsg('└─────────────────────────────────────────────────────────────┘', 'info'),
          ];
          return prevClients.map((c) => (c.id === clientId ? { ...client, history: helpHistory } : c));
        }

        if (cmd === '/odalar' || cmd === '/rooms') {
          const roomLines = Object.values(rooms).map((r) => {
            const count = prevClients.filter((c) => c.isConnected && c.currentRoom === r.name).length;
            const here = client.currentRoom === r.name ? ' (Şu an buradasınız)' : '';
            return `│  ${r.name.padEnd(14)} │ ${count} Üye │ ${r.description.padEnd(24)}${here}`;
          });

          const roomHistory = [
            ...client.history,
            createMsg(`> ${text}`, 'user'),
            createMsg('┌── AKTİF SOHBET ODALARI ─────────────────────────────────────┐', 'info'),
            ...roomLines.map((line) => createMsg(line, 'info')),
            createMsg('└─────────────────────────────────────────────────────────────┘', 'info'),
          ];
          return prevClients.map((c) => (c.id === clientId ? { ...client, history: roomHistory } : c));
        }

        if (cmd === '/kullanicilar' || cmd === '/users') {
          const onlineNames = prevClients.filter((c) => c.isConnected && c.username).map((c) => `@${c.username}`);
          const roomMembers = prevClients
            .filter((c) => c.isConnected && c.currentRoom === client.currentRoom)
            .map((c) => `@${c.username}`);

          const userHistory = [
            ...client.history,
            createMsg(`> ${text}`, 'user'),
            createMsg(`[SİSTEM] Çevrimiçi Kullanıcılar (${onlineNames.length}): [${onlineNames.join(', ')}]`, 'system'),
            createMsg(`[SİSTEM] Bulunduğunuz Odanın (${client.currentRoom}) Üyeleri: [${roomMembers.join(', ')}]`, 'system'),
          ];
          return prevClients.map((c) => (c.id === clientId ? { ...client, history: userHistory } : c));
        }

        if (cmd === '/olustur' || cmd === '/create') {
          const targetRoom = (parts[1]?.startsWith('#') ? parts[1] : `#${parts[1] || ''}`).toLowerCase();
          if (!parts[1]) {
            return prevClients.map((c) =>
              c.id === clientId
                ? {
                    ...client,
                    history: [...client.history, createMsg(`> ${text}`, 'user'), createMsg('[HATA] Kullanım: /olustur <oda_adi>', 'error')],
                  }
                : c
            );
          }

          // Create room
          setRooms((prevR) => {
            if (!prevR[targetRoom]) {
              return {
                ...prevR,
                [targetRoom]: {
                  name: targetRoom,
                  description: `${targetRoom.substring(1)} Odası`,
                  memberUsernames: [],
                },
              };
            }
            return prevR;
          });

          // Join it
          return handleRoomSwitch(clientId, targetRoom, text, prevClients);
        }

        if (cmd === '/katil' || cmd === '/join') {
          const targetRoom = (parts[1]?.startsWith('#') ? parts[1] : `#${parts[1] || ''}`).toLowerCase();
          if (!parts[1]) {
            return prevClients.map((c) =>
              c.id === clientId
                ? {
                    ...client,
                    history: [...client.history, createMsg(`> ${text}`, 'user'), createMsg('[HATA] Kullanım: /katil <oda_adi>', 'error')],
                  }
                : c
            );
          }
          return handleRoomSwitch(clientId, targetRoom, text, prevClients);
        }

        if (cmd === '/pm' || cmd === '/msg' || cmd === '/fildisi') {
          const targetUser = parts[1]?.replace('@', '').toLowerCase();
          const pMessage = parts.slice(2).join(' ');

          if (!targetUser || !pMessage) {
            return prevClients.map((c) =>
              c.id === clientId
                ? {
                    ...client,
                    history: [...client.history, createMsg(`> ${text}`, 'user'), createMsg('[HATA] Kullanım: /pm <kullanici_adi> <mesaj>', 'error')],
                  }
                : c
            );
          }

          const targetClient = prevClients.find((c) => c.isConnected && c.username.toLowerCase() === targetUser);

          if (!targetClient) {
            return prevClients.map((c) =>
              c.id === clientId
                ? {
                    ...client,
                    history: [
                      ...client.history,
                      createMsg(`> ${text}`, 'user'),
                      createMsg(`[HATA] @${targetUser} adında çevrimiçi bir kullanıcı bulunamadı.`, 'error'),
                    ],
                  }
                : c
            );
          }

          const senderMsg = createMsg(`[ÖZEL MESAJ] Siz -> @${targetClient.username}: ${pMessage}`, 'whisper');
          const receiverMsg = createMsg(`[ÖZEL MESAJ] @${client.username} -> Siz: ${pMessage}`, 'whisper');

          return prevClients.map((c) => {
            if (c.id === clientId) {
              return { ...c, history: [...c.history, createMsg(`> ${text}`, 'user'), senderMsg] };
            }
            if (c.id === targetClient.id) {
              return { ...c, history: [...c.history, receiverMsg] };
            }
            return c;
          });
        }

        if (cmd === '/ayril' || cmd === '/cikis' || cmd === '/quit' || cmd === '/exit') {
          return handleClientDisconnect(clientId, prevClients);
        }

        // Unknown command
        return prevClients.map((c) =>
          c.id === clientId
            ? {
                ...client,
                history: [
                  ...client.history,
                  createMsg(`> ${text}`, 'user'),
                  createMsg(`[HATA] Bilinmeyen komut: '${cmd}'. Yardım için /yardim yazınız.`, 'error'),
                ],
              }
            : c
        );
      }

      // Normal Chat Message: broadcast to everyone in the current room
      const formattedChat = `[${client.currentRoom}] @${client.username}: ${text}`;
      const chatMsg = createMsg(formattedChat, 'user');

      // Server log
      setServerState((srv) => ({
        ...srv,
        history: [...srv.history, createMsg(`[SUNUCU] [${client.currentRoom}] @${client.username}: ${text}`, 'info')],
      }));

      return prevClients.map((c) => {
        if (c.isConnected && c.currentRoom === client.currentRoom) {
          return {
            ...c,
            history: [...c.history, chatMsg],
          };
        }
        return c;
      });
    });
  };

  const handleRoomSwitch = (
    clientId: string,
    targetRoom: string,
    rawText: string,
    currentClients: ClientSession[]
  ): ClientSession[] => {
    const client = currentClients.find((c) => c.id === clientId);
    if (!client) return currentClients;

    const oldRoom = client.currentRoom;
    if (oldRoom === targetRoom) {
      return currentClients.map((c) =>
        c.id === clientId
          ? {
              ...client,
              history: [...client.history, createMsg(`> ${rawText}`, 'user'), createMsg(`[BİLGİ] Zaten '${targetRoom}' odasındasınız.`, 'info')],
            }
          : c
      );
    }

    const leaveNotice = createMsg(`[${oldRoom}] [SİSTEM] <<< @${client.username} odadan ayrıldı. (${oldRoom})`, 'leave');
    const joinNotice = createMsg(`[${targetRoom}] [SİSTEM] >>> @${client.username} odaya katıldı. (${targetRoom})`, 'join');

    const roomMembers = [
      ...currentClients.filter((c) => c.id !== clientId && c.isConnected && c.currentRoom === targetRoom).map((c) => `@${c.username}`),
      `@${client.username}`,
    ];

    const updatedClient: ClientSession = {
      ...client,
      currentRoom: targetRoom,
      history: [
        ...client.history,
        createMsg(`> ${rawText}`, 'user'),
        createMsg(`[SİSTEM] '${targetRoom}' odasına geçtiniz.`, 'system'),
        createMsg(`[SİSTEM] Odadaki Üyeler (${roomMembers.length}): [${roomMembers.join(', ')}]`, 'system'),
      ],
    };

    return currentClients.map((c) => {
      if (c.id === clientId) return updatedClient;
      if (c.isConnected && c.currentRoom === oldRoom) {
        return { ...c, history: [...c.history, leaveNotice] };
      }
      if (c.isConnected && c.currentRoom === targetRoom) {
        return { ...c, history: [...c.history, joinNotice] };
      }
      return c;
    });
  };

  const handleClientDisconnect = (clientId: string, currentClients: ClientSession[]): ClientSession[] => {
    const client = currentClients.find((c) => c.id === clientId);
    if (!client) return currentClients;

    const leaveNotice = client.currentRoom && client.username
      ? createMsg(`[${client.currentRoom}] [SİSTEM] <<< @${client.username} sohbetten ayrıldı.`, 'leave')
      : null;

    if (client.username) {
      setServerState((srv) => ({
        ...srv,
        activeHandlerThreads: Math.max(0, srv.activeHandlerThreads - 1),
        history: [
          ...srv.history,
          createMsg(`[SUNUCU] Kullanıcı sistemden ayrıldı: @${client.username}`, 'leave'),
        ],
      }));
    }

    return currentClients.map((c) => {
      if (c.id === clientId) {
        return {
          ...c,
          isConnected: false,
          readThreadAlive: false,
          writeThreadAlive: false,
          history: [
            ...c.history,
            createMsg('[SİSTEM] Sohbetten ayrılıyorsunuz. Hoşça kalın!', 'system'),
            createMsg('[BİLGİ] Soket kapatıldı. Program sonlandırıldı.', 'leave'),
          ],
        };
      }
      if (leaveNotice && c.isConnected && c.currentRoom === client.currentRoom) {
        return { ...c, history: [...c.history, leaveNotice] };
      }
      return c;
    });
  };

  const handleCloseTerminal = (clientId: string) => {
    handleClientDisconnect(clientId, clients);
    setClients((prev) => prev.filter((c) => c.id !== clientId));
    if (activeTabId === clientId) {
      setActiveTabId('server');
    }
  };

  const handleClearHistory = (target: 'server' | string) => {
    if (target === 'server') {
      setServerState((prev) => ({ ...prev, history: [] }));
    } else {
      setClients((prev) =>
        prev.map((c) => (c.id === target ? { ...c, history: [] } : c))
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Studio Header Toolbar */}
      <div className="bg-[#0f172a] border border-slate-800 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4">
        {/* Left: Server and LAN stats */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">Sunucu Durumu:</span>
            <span
              className={`px-2 py-0.5 rounded font-semibold text-[11px] ${
                serverState.isRunning
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
              }`}
            >
              {serverState.isRunning ? '● ÇALIŞIYOR (PORT 5000)' : '○ DURDURULDU'}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Wifi className="w-3.5 h-3.5 text-sky-400" />
            <span>LAN IP:</span>
            <span className="text-sky-300 font-semibold">{serverState.lanIp}</span>
          </div>

          <div className="flex items-center gap-1.5 text-slate-300">
            <Users className="w-3.5 h-3.5 text-emerald-400" />
            <span>Aktif İstemci İplikleri:</span>
            <span className="text-emerald-300 font-semibold">
              {clients.filter((c) => c.isConnected).length} İplik
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Preset Session */}
          <button
            onClick={startDemoSession}
            title="Sıfırla ve 3 Kullanıcılı Demo Başlat"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700/60"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Demoyu Sıfırla</span>
          </button>

          {/* Add Client */}
          <button
            onClick={() => handleAddNewClient()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 rounded-lg transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>+ Yeni İstemci Terminali</span>
          </button>

          {/* Layout Mode */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-0.5">
            <button
              onClick={() => setLayoutMode('split')}
              title="Bölünmüş Izgara Görünümü"
              className={`p-1.5 rounded transition-colors ${
                layoutMode === 'split' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setLayoutMode('tabs')}
              title="Sekmeli Tekil Görünüm"
              className={`p-1.5 rounded transition-colors ${
                layoutMode === 'tabs' ? 'bg-slate-800 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Info Callout */}
      <div className="bg-sky-950/20 border border-sky-800/40 rounded-xl p-3.5 flex items-start gap-3 text-xs text-sky-200/90">
        <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-sky-300">
            Canlı Java Çok İplikli Konsol Simülatörü (Enes Öztürk İmzalı)
          </p>
          <p className="text-slate-300 leading-relaxed">
            Burada aynı yerel ağdaki (LAN) bağımsız terminaller gibi çalışan bir Sunucu (<code className="text-sky-300">ChatServer</code>) ve birden fazla İstemci (<code className="text-sky-300">ChatClient</code>) konsolu yer alır. Bir terminalden yazdığınız mesaj anında odadaki diğer kullanıcılara soket yayını (broadcast) olarak ulaşır. Farklı odalara geçmek için <code className="text-emerald-300">/katil #yazilim</code> veya <code className="text-emerald-300">/olustur #yeni_oda</code> yazabilirsiniz.
          </p>
        </div>
      </div>

      {/* Tab Switcher if in Tabs Mode */}
      {layoutMode === 'tabs' && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 border-b border-slate-800">
          <button
            onClick={() => setActiveTabId('server')}
            className={`px-3 py-1.5 rounded-t-lg font-mono text-xs font-medium transition-colors border-t border-x ${
              activeTabId === 'server'
                ? 'bg-[#090d16] border-slate-700 text-emerald-400'
                : 'bg-slate-900/50 border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            [SUNUCU] ChatServer:5000
          </button>

          {clients.map((c, index) => (
            <button
              key={c.id}
              onClick={() => setActiveTabId(c.id)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-t-lg font-mono text-xs font-medium transition-colors border-t border-x ${
                activeTabId === c.id
                  ? 'bg-[#090d16] border-slate-700 text-cyan-400'
                  : 'bg-slate-900/50 border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <span>{c.username ? `@${c.username}` : `İstemci #${index + 1}`}</span>
              <span className="text-[10px] text-slate-500">{c.currentRoom || 'Giriş Bekliyor'}</span>
            </button>
          ))}
        </div>
      )}

      {/* Terminal Grid or Active Tab */}
      {layoutMode === 'split' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
          {/* 1. Server Terminal */}
          <TerminalWindow
            title="ChatServer.java"
            subtitle={`Port: ${serverState.port} · LAN: ${serverState.lanIp}`}
            isServer={true}
            isConnected={serverState.isRunning}
            history={serverState.history}
            onClearHistory={() => handleClearHistory('server')}
            onTogglePower={handleToggleServerPower}
            placeholder="Sunucu izleme konsoludur. İstemciler bağlanabilir..."
            promptPrefix="server$"
          />

          {/* 2. Client Terminals */}
          {clients.map((client, idx) => (
            <TerminalWindow
              key={client.id}
              title={client.username ? `@${client.username} (ChatClient)` : `İstemci #${idx + 1}`}
              subtitle={`${client.clientIp}:${client.clientPort} · ${client.currentRoom || 'Bağlandı'}`}
              isConnected={client.isConnected}
              history={client.history}
              onSendMessage={(msg) => handleClientMessage(client.id, msg)}
              onClearHistory={() => handleClearHistory(client.id)}
              onClose={() => handleCloseTerminal(client.id)}
              quickCommands={[
                'Selam herkese!',
                '/odalar',
                '/kullanicilar',
                '/katil #yazilim',
                '/yardim',
              ]}
              placeholder={client.username ? 'Mesaj veya /komut yazınız...' : 'Kullanıcı adınızı giriniz...'}
              promptPrefix={`${client.username || 'client'}>`}
            />
          ))}

          {/* Empty Slot to Add More Clients */}
          {clients.length < 6 && (
            <div
              onClick={() => handleAddNewClient()}
              className="h-[520px] rounded-xl border-2 border-dashed border-slate-800 hover:border-emerald-500/50 bg-slate-900/20 hover:bg-slate-900/40 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer group text-slate-500 hover:text-emerald-400"
            >
              <div className="w-12 h-12 rounded-full bg-slate-800/80 group-hover:bg-emerald-500/10 flex items-center justify-center transition-colors">
                <Plus className="w-6 h-6 text-slate-400 group-hover:text-emerald-400" />
              </div>
              <div className="text-center font-mono text-xs">
                <div className="font-semibold text-slate-300 group-hover:text-emerald-300">
                  + Yeni İstemci Terminali Ekle
                </div>
                <div className="text-slate-500 text-[11px] mt-1">
                  LAN üzerinde başka bir bilgisayarı simüle eder
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Tabs Mode: Focused single terminal */
        <div>
          {activeTabId === 'server' ? (
            <TerminalWindow
              title="ChatServer.java (Ana Sunucu Dinleyici İpliği)"
              subtitle={`Port: ${serverState.port} · LAN: ${serverState.lanIp}`}
              isServer={true}
              isConnected={serverState.isRunning}
              history={serverState.history}
              onClearHistory={() => handleClearHistory('server')}
              onTogglePower={handleToggleServerPower}
              promptPrefix="server$"
            />
          ) : (
            (() => {
              const activeClient = clients.find((c) => c.id === activeTabId);
              if (!activeClient) return null;
              return (
                <TerminalWindow
                  title={`@${activeClient.username || 'Yeni İstemci'} (ChatClient.java)`}
                  subtitle={`${activeClient.clientIp}:${activeClient.clientPort} · ${activeClient.currentRoom || 'Giriş'}`}
                  isConnected={activeClient.isConnected}
                  history={activeClient.history}
                  onSendMessage={(msg) => handleClientMessage(activeClient.id, msg)}
                  onClearHistory={() => handleClearHistory(activeClient.id)}
                  onClose={() => handleCloseTerminal(activeClient.id)}
                  quickCommands={[
                    'Selam herkese!',
                    '/odalar',
                    '/kullanicilar',
                    '/katil #yazilim',
                    '/yardim',
                  ]}
                  placeholder={activeClient.username ? 'Mesaj veya /komut yazınız...' : 'Kullanıcı adınızı giriniz...'}
                  promptPrefix={`${activeClient.username || 'client'}>`}
                />
              );
            })()
          )}
        </div>
      )}
    </div>
  );
};
