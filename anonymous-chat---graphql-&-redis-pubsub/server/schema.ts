import { makeExecutableSchema } from '@graphql-tools/schema';
import { withFilter } from 'graphql-subscriptions';
import { pubsub, redisInfo } from './redis';

export interface Message {
  id: string;
  content: string;
  author: string;
  avatar: string;
  color: string;
  roomId: string;
  createdAt: string;
  likes: number;
  replyToId?: string | null;
  replyToContent?: string | null;
  replyToAuthor?: string | null;
}

export interface Room {
  id: string;
  name: string;
  description: string;
  icon: string;
  messageCount: number;
}

export interface TypingStatus {
  roomId: string;
  author: string;
  isTyping: boolean;
}

// In-memory message store with seed data
const initialRooms: Room[] = [
  {
    id: 'genel',
    name: 'Genel Sohbet',
    description: 'Herkes için açık genel anonim sohbet odası',
    icon: 'MessageSquare',
    messageCount: 0,
  },
  {
    id: 'yazilim',
    name: 'Yazılım & GraphQL',
    description: 'GraphQL, Redis, Node.js ve modern mimariler üzerine tartışmalar',
    icon: 'Code2',
    messageCount: 0,
  },
  {
    id: 'gece',
    name: 'Gece Kuşları',
    description: 'Gece vakti düşünceler, müzik önerileri ve sohbet',
    icon: 'Moon',
    messageCount: 0,
  },
  {
    id: 'itiraf',
    name: 'Anonim İtiraflar',
    description: 'Kimseye anlatamadığın sırlar, tamamen gizli ve anonim',
    icon: 'Flame',
    messageCount: 0,
  },
];

const roomsMap = new Map<string, Room>(initialRooms.map(r => [r.id, r]));

const messages: Message[] = [
  {
    id: 'msg-1',
    content: 'Selam herkese! GraphQL ve Redis PubSub altyapısıyla çalışan anonim chate hoş geldiniz 🚀',
    author: 'Anonim Astronot',
    avatar: 'astronaut',
    color: '#6366f1',
    roomId: 'genel',
    createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    likes: 4,
  },
  {
    id: 'msg-2',
    content: 'Mutation ve Subscription mekanizmaları test edilebilir durumda. Mesaj gönderdiğiniz an Redis PubSub üzerinden anında düşüyor.',
    author: 'Siber Kedi',
    avatar: 'cat',
    color: '#ec4899',
    roomId: 'genel',
    createdAt: new Date(Date.now() - 1000 * 60 * 8).toISOString(),
    likes: 7,
  },
  {
    id: 'msg-3',
    content: 'GraphQL Subscriptions üzerinde WebSocket (graphql-ws) protokolü ve Redis PubSub harika çalışıyor. İmzalı proje: Enes Öztürk!',
    author: 'Gizemli Baykuş',
    avatar: 'owl',
    color: '#10b981',
    roomId: 'yazilim',
    createdAt: new Date(Date.now() - 1000 * 60 * 4).toISOString(),
    likes: 5,
  },
];

// Update room message counts
for (const room of roomsMap.values()) {
  room.messageCount = messages.filter(m => m.roomId === room.id).length;
}

// PubSub Topics
const MESSAGE_ADDED = 'MESSAGE_ADDED';
const MESSAGE_LIKED = 'MESSAGE_LIKED';
const USER_TYPING = 'USER_TYPING';

export const typeDefs = `#graphql
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
`;

const startTime = Date.now();

export const resolvers = {
  Query: {
    messages: (_: any, args: { roomId?: string; limit?: number }) => {
      let filtered = args.roomId
        ? messages.filter(m => m.roomId === args.roomId)
        : messages;
      if (args.limit && args.limit > 0) {
        filtered = filtered.slice(-args.limit);
      }
      return filtered;
    },
    rooms: () => {
      // Refresh count dynamically
      for (const room of roomsMap.values()) {
        room.messageCount = messages.filter(m => m.roomId === room.id).length;
      }
      return Array.from(roomsMap.values());
    },
    stats: () => ({
      totalMessages: messages.length,
      activeRooms: roomsMap.size,
      redisStatus: redisInfo.mode,
      engine: redisInfo.engine,
      signature: redisInfo.signature,
      uptimeSeconds: Math.floor((Date.now() - startTime) / 1000),
    }),
    redisInfo: () =>
      `Redis PubSub Engine: ${redisInfo.engine} (${redisInfo.mode}) - Developed by ${redisInfo.signature}`,
  },

  Mutation: {
    sendMessage: async (
      _: any,
      args: {
        content: string;
        author: string;
        avatar?: string;
        color?: string;
        roomId?: string;
        replyToId?: string;
        replyToContent?: string;
        replyToAuthor?: string;
      }
    ) => {
      const roomId = args.roomId || 'genel';
      const cleanContent = args.content.trim();
      if (!cleanContent) {
        throw new Error('Mesaj içeriği boş olamaz.');
      }

      const newMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        content: cleanContent,
        author: args.author?.trim() || 'Anonim Kullanıcı',
        avatar: args.avatar || 'ghost',
        color: args.color || '#6366f1',
        roomId,
        createdAt: new Date().toISOString(),
        likes: 0,
        replyToId: args.replyToId || null,
        replyToContent: args.replyToContent || null,
        replyToAuthor: args.replyToAuthor || null,
      };

      messages.push(newMessage);

      // Keep max 500 messages in memory to prevent leak
      if (messages.length > 500) {
        messages.splice(0, messages.length - 500);
      }

      // Update room message count
      const room = roomsMap.get(roomId);
      if (room) {
        room.messageCount = messages.filter(m => m.roomId === roomId).length;
      }

      // PUBLISH via Redis PubSub!
      await pubsub.publish(MESSAGE_ADDED, {
        messageAdded: newMessage,
      });

      return newMessage;
    },

    likeMessage: async (_: any, args: { id: string }) => {
      const msg = messages.find(m => m.id === args.id);
      if (!msg) {
        throw new Error('Mesaj bulunamadı.');
      }
      msg.likes += 1;

      // Publish to Redis PubSub
      await pubsub.publish(MESSAGE_LIKED, {
        messageLiked: msg,
      });

      return msg;
    },

    setTyping: async (
      _: any,
      args: { roomId: string; author: string; isTyping: boolean }
    ) => {
      const payload: TypingStatus = {
        roomId: args.roomId,
        author: args.author,
        isTyping: args.isTyping,
      };

      await pubsub.publish(USER_TYPING, {
        userTyping: payload,
      });

      return payload;
    },

    createRoom: (
      _: any,
      args: { id: string; name: string; description: string; icon?: string }
    ) => {
      const normalizedId = args.id
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, '')
        .trim();
      if (!normalizedId) {
        throw new Error('Geçersiz oda ID');
      }
      if (roomsMap.has(normalizedId)) {
        return roomsMap.get(normalizedId)!;
      }

      const newRoom: Room = {
        id: normalizedId,
        name: args.name.trim(),
        description: args.description.trim(),
        icon: args.icon || 'Hash',
        messageCount: 0,
      };
      roomsMap.set(normalizedId, newRoom);
      return newRoom;
    },

    clearRoomMessages: (_: any, args: { roomId: string }) => {
      const initialLength = messages.length;
      const retained = messages.filter(m => m.roomId !== args.roomId);
      messages.length = 0;
      messages.push(...retained);

      const room = roomsMap.get(args.roomId);
      if (room) {
        room.messageCount = 0;
      }
      return initialLength !== retained.length;
    },
  },

  Subscription: {
    messageAdded: {
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator([MESSAGE_ADDED]),
        (payload: any, variables: any) => {
          if (!payload?.messageAdded) return false;
          if (!variables?.roomId) return true;
          return payload.messageAdded.roomId === variables.roomId;
        }
      ),
    },

    messageLiked: {
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator([MESSAGE_LIKED]),
        (payload: any, variables: any) => {
          if (!payload?.messageLiked) return false;
          if (!variables?.roomId) return true;
          return payload.messageLiked.roomId === variables.roomId;
        }
      ),
    },

    userTyping: {
      subscribe: withFilter(
        () => (pubsub as any).asyncIterator([USER_TYPING]),
        (payload: any, variables: any) => {
          if (!payload?.userTyping) return false;
          if (!variables?.roomId) return true;
          return payload.userTyping.roomId === variables.roomId;
        }
      ),
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
