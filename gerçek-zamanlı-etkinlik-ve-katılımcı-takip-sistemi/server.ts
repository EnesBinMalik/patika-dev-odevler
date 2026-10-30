import http from 'http';
import path from 'path';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import type { EventItem, Participant, SocketMessage } from './src/types';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const isProduction = process.env.NODE_ENV === 'production';

app.use(express.json());

// Seed data
const initialEvents: EventItem[] = [
  {
    id: 'evt-1',
    title: 'Modern Web & Real-Time Mimariler Çalıştayı',
    description: 'WebSockets, SSE ve Reaktif Durum Yönetimi ile gecikmesiz canlı web uygulamaları geliştirme teknikleri.',
    date: '2026-11-04',
    time: '19:30 - 21:30',
    location: 'Kolektif House Levent, İstanbul (ve Canlı Yayın)',
    category: 'Yazılım & Teknoloji',
    image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    capacity: 60,
    participantsCount: 3,
    status: 'upcoming',
    organizer: 'Enes Öztürk',
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    tags: ['WebSockets', 'GraphQL', 'Real-Time', 'React', 'Node.js'],
    participants: [
      {
        id: 'p-1',
        name: 'Enes Öztürk',
        email: 'enesbino38@gmail.com',
        role: 'Organizatör',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        company: 'Core Dev Studio',
        joinedAt: new Date(Date.now() - 86400000 * 3).toISOString(),
        note: 'Etkinlik moderatörü ve organizatör'
      },
      {
        id: 'p-2',
        name: 'Ayşe Yılmaz',
        email: 'ayse.yilmaz@techcorp.io',
        role: 'Konuşmacı',
        avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
        company: 'Trendyol Tech',
        joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'Büyük ölçekli WebSocket mimarileri üzerine konuşacak'
      },
      {
        id: 'p-3',
        name: 'Burak Demir',
        email: 'burak.d@codehub.dev',
        role: 'Mentor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
        company: 'Getir Tech',
        joinedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: 'Soru-cevap bölümünde mentörlük yapacak'
      }
    ]
  },
  {
    id: 'evt-2',
    title: 'Yeni Nesil UI/UX ve Mikro-Animasyonlar',
    description: 'Kullanıcı deneyimini güçlendiren akıcı geçişler, erişilebilir tasarım sistemleri ve Motion pratikleri.',
    date: '2026-11-08',
    time: '18:00 - 20:00',
    location: 'İTÜ Maslak Teknokent & Google Meet',
    category: 'Tasarım & UI/UX',
    image: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
    capacity: 45,
    participantsCount: 2,
    status: 'upcoming',
    organizer: 'Tasarım Topluluğu & Enes Öztürk',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    tags: ['Figma', 'UI/UX', 'Tailwind CSS', 'Micro-interactions'],
    participants: [
      {
        id: 'p-4',
        name: 'Zeynep Kaya',
        email: 'zeynep.design@craft.co',
        role: 'Konuşmacı',
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
        company: 'Studio Craft',
        joinedAt: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'Tasarım sistemleri lideri'
      },
      {
        id: 'p-5',
        name: 'Kerem Aksoy',
        email: 'kerem.aksoy@freelance.org',
        role: 'Katılımcı',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
        company: 'Bağımsız Ürün Tasarımcısı',
        joinedAt: new Date(Date.now() - 86400000 * 1).toISOString()
      }
    ]
  },
  {
    id: 'evt-3',
    title: 'Yapay Zeka Destekli Uygulama Geliştirme Hackathonu',
    description: '48 saat boyunca Gemini ve modern LLM entegrasyonlarıyla inovatif ürünler geliştiriyoruz.',
    date: '2026-11-14',
    time: '10:00 - 18:00',
    location: 'Habita Coworking, Sanayi Mahallesi',
    category: 'Yapay Zeka',
    image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=1200&q=80',
    capacity: 80,
    participantsCount: 3,
    status: 'active',
    organizer: 'AI Innovators Kulübü',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    tags: ['Gemini', 'GenAI', 'Hackathon', 'Python', 'TypeScript'],
    participants: [
      {
        id: 'p-6',
        name: 'Mert Çelik',
        email: 'mert.celik@ai-lab.io',
        role: 'Organizatör',
        avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80',
        company: 'DeepTech AI',
        joinedAt: new Date(Date.now() - 86400000).toISOString()
      },
      {
        id: 'p-7',
        name: 'Selin Şahin',
        email: 'selin.sahin@startup.io',
        role: 'Geliştirici',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
        company: 'Nova AI',
        joinedAt: new Date(Date.now() - 43200000).toISOString()
      },
      {
        id: 'p-8',
        name: 'Can Vural',
        email: 'can.vural@student.edu.tr',
        role: 'Öğrenci',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=200&q=80',
        company: 'İTÜ Bilgisayar Mühendisliği',
        joinedAt: new Date(Date.now() - 21600000).toISOString()
      }
    ]
  }
];

let events: EventItem[] = JSON.parse(JSON.stringify(initialEvents));

// WebSocket Server
const wss = new WebSocketServer({ server });

function broadcast<T>(type: SocketMessage<T>['type'], payload: T) {
  const msg: SocketMessage<T> = {
    type,
    payload,
    timestamp: Date.now()
  };
  const stringified = JSON.stringify(msg);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(stringified);
    }
  });
}

function broadcastClientCount() {
  broadcast('CLIENTS_COUNT', { count: wss.clients.size });
}

wss.on('connection', (ws) => {
  // Send current state to newly connected client
  const initMsg: SocketMessage<EventItem[]> = {
    type: 'INIT',
    payload: events,
    timestamp: Date.now()
  };
  ws.send(JSON.stringify(initMsg));
  broadcastClientCount();

  ws.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.type === 'PING') {
        ws.send(JSON.stringify({ type: 'PONG', timestamp: Date.now() }));
      }
    } catch {
      // ignore
    }
  });

  ws.on('close', () => {
    broadcastClientCount();
  });
});

// REST API Endpoints
app.get('/api/events', (_req, res) => {
  res.json({
    success: true,
    data: events,
    total: events.length,
    activeConnections: wss.clients.size
  });
});

app.get('/api/events/:id', (req, res) => {
  const event = events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı.' });
  }
  res.json({ success: true, data: event });
});

app.post('/api/events', (req, res) => {
  const { title, description, date, time, location, category, capacity, image, organizer, tags } = req.body;

  if (!title || !description || !date || !location) {
    return res.status(400).json({ success: false, message: 'Lütfen zorunlu alanları doldurunuz.' });
  }

  const newEvent: EventItem = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    title: String(title).trim(),
    description: String(description).trim(),
    date: String(date),
    time: time || '19:00 - 21:00',
    location: String(location).trim(),
    category: category || 'Yazılım & Teknoloji',
    image: image || 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    capacity: Number(capacity) || 50,
    participantsCount: 0,
    participants: [],
    status: 'upcoming',
    organizer: organizer ? String(organizer).trim() : 'Enes Öztürk',
    createdAt: new Date().toISOString(),
    tags: Array.isArray(tags) && tags.length > 0 ? tags : ['Teknoloji', 'Buluşma']
  };

  events.unshift(newEvent);

  // Broadcast real-time EVENT_ADDED to all connected clients
  broadcast('EVENT_ADDED', newEvent);

  res.status(201).json({ success: true, data: newEvent });
});

app.post('/api/events/:id/participants', (req, res) => {
  const { id } = req.params;
  const { name, email, role, company, note, avatar } = req.body;

  const eventIndex = events.findIndex((e) => e.id === id);
  if (eventIndex === -1) {
    return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı.' });
  }

  const event = events[eventIndex];

  if (!name || !email) {
    return res.status(400).json({ success: false, message: 'İsim ve e-posta zorunludur.' });
  }

  // Check if participant is already registered with this email
  const existing = event.participants.find((p) => p.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(409).json({ success: false, message: 'Bu e-posta adresiyle zaten kayıt olunmuş.' });
  }

  const randomAvatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80'
  ];

  const newParticipant: Participant = {
    id: `p-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: String(name).trim(),
    email: String(email).trim().toLowerCase(),
    role: role || 'Katılımcı',
    company: company ? String(company).trim() : undefined,
    note: note ? String(note).trim() : undefined,
    avatar: avatar || randomAvatars[Math.floor(Math.random() * randomAvatars.length)],
    joinedAt: new Date().toISOString()
  };

  event.participants.unshift(newParticipant);
  event.participantsCount = event.participants.length;

  // Broadcast real-time PARTICIPANT_ADDED to all connected clients
  broadcast('PARTICIPANT_ADDED', {
    eventId: id,
    participant: newParticipant,
    participantsCount: event.participantsCount
  });

  res.status(201).json({
    success: true,
    data: newParticipant,
    participantsCount: event.participantsCount
  });
});

app.delete('/api/events/:id', (req, res) => {
  const { id } = req.params;
  const index = events.findIndex((e) => e.id === id);
  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Etkinlik bulunamadı.' });
  }
  events.splice(index, 1);
  broadcast('EVENT_DELETED', { eventId: id });
  res.json({ success: true, message: 'Etkinlik silindi.' });
});

app.post('/api/reset', (_req, res) => {
  events = JSON.parse(JSON.stringify(initialEvents));
  broadcast('INIT', events);
  res.json({ success: true, message: 'Veriler sıfırlandı.', data: events });
});

app.get('/api/stats', (_req, res) => {
  const totalEvents = events.length;
  const totalParticipants = events.reduce((acc, curr) => acc + curr.participantsCount, 0);
  res.json({
    totalEvents,
    totalParticipants,
    connectedClients: wss.clients.size,
    author: 'Enes Öztürk'
  });
});

// Vite or Static Serving
async function startServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR !== 'true',
        watch: process.env.DISABLE_HMR === 'true' ? null : {}
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(process.cwd(), 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(process.cwd(), 'dist', 'index.html'));
    });
  }

  server.listen(PORT, () => {
    console.log(`[Server] Gerçek Zamanlı Sunucu Port ${PORT} üzerinde hazır! (Geliştirici: Enes Öztürk)`);
  });
}

startServer().catch((err) => {
  console.error('[Server Error]', err);
  process.exit(1);
});
