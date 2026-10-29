import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { graphql, execute, subscribe } from 'graphql';
import { WebSocketServer } from 'ws';
import { useServer } from 'graphql-ws/use/ws';
import { schema } from './server/schema';
import { redisInfo } from './server/redis';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProd = process.env.NODE_ENV === 'production';
const PORT = Number(process.env.PORT) || 3000;

async function bootstrap() {
  const app = express();
  const server = http.createServer(app);

  app.use(cors());
  app.use(express.json());

  // GraphQL HTTP endpoint for Queries and Mutations
  app.post('/graphql', async (req, res) => {
    try {
      const { query, variables, operationName } = req.body;
      if (!query) {
        return res.status(400).json({ errors: [{ message: 'No GraphQL query provided.' }] });
      }

      const result = await graphql({
        schema,
        source: query,
        variableValues: variables,
        operationName,
        contextValue: { req },
      });

      return res.json(result);
    } catch (err: any) {
      console.error('GraphQL HTTP error:', err);
      return res.status(500).json({ errors: [{ message: err.message || 'Internal GraphQL error' }] });
    }
  });

  // REST API Info / Status Endpoint
  app.get('/api/status', (_req, res) => {
    res.json({
      status: 'online',
      project: 'Proje 3 - Anonymous Chat',
      developer: 'Enes Öztürk',
      signature: 'enes öztürk',
      engine: 'GraphQL + Redis PubSub',
      redis: redisInfo,
      timestamp: new Date().toISOString(),
    });
  });

  // Schema definition download endpoint
  app.get('/api/schema', (_req, res) => {
    res.type('text/plain').send(`
# Anonymous Chat GraphQL Schema
# Developed by: Enes Öztürk
# Real-time subscriptions powered by Redis PubSub

type Message {
  id: ID!
  content: String!
  author: String!
  avatar: String!
  color: String!
  roomId: String!
  createdAt: String!
  likes: Int!
  replyToId: String
  replyToContent: String
  replyToAuthor: String
}

type Room {
  id: String!
  name: String!
  description: String!
  icon: String!
  messageCount: Int!
}

type TypingStatus {
  roomId: String!
  author: String!
  isTyping: Boolean!
}

type ServerStats {
  totalMessages: Int!
  activeRooms: Int!
  redisStatus: String!
  engine: String!
  signature: String!
  uptimeSeconds: Float!
}

type Query {
  messages(roomId: String, limit: Int): [Message!]!
  rooms: [Room!]!
  stats: ServerStats!
  redisInfo: String!
}

type Mutation {
  sendMessage(
    content: String!
    author: String!
    avatar: String
    color: String
    roomId: String
    replyToId: String
    replyToContent: String
    replyToAuthor: String
  ): Message!
  likeMessage(id: ID!): Message!
  setTyping(roomId: String!, author: String!, isTyping: Boolean!): TypingStatus!
  createRoom(id: String!, name: String!, description: String!, icon: String): Room!
  clearRoomMessages(roomId: String!): Boolean!
}

type Subscription {
  messageAdded(roomId: String): Message!
  messageLiked(roomId: String): Message!
  userTyping(roomId: String): TypingStatus!
}
    `);
  });

  // Set up WebSocket server for GraphQL Subscriptions
  const wsServer = new WebSocketServer({
    server,
    path: '/graphql',
  });

  const serverCleanup = useServer(
    {
      schema,
      execute,
      subscribe,
      onConnect: () => {
        console.log('⚡ GraphQL Subscription Client connected');
      },
      onDisconnect: () => {
        console.log('🔌 GraphQL Subscription Client disconnected');
      },
      onError: (_ctx, _msg, errors) => {
        console.error('GraphQL Subscription error:', errors);
      },
    },
    wsServer
  );

  // Vite middleware in dev or static files in prod
  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Anonymous Chat Server running on http://0.0.0.0:${PORT}`);
    console.log(`📡 GraphQL HTTP & WebSocket Subscriptions ready at /graphql`);
    console.log(`✨ Signature: Enes Öztürk | Redis PubSub Engine Active`);
  });

  // Clean shutdown
  const shutdown = async () => {
    await serverCleanup.dispose();
    server.close();
    process.exit(0);
  };
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

bootstrap().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
