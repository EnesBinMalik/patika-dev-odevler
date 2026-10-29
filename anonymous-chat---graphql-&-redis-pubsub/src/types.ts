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

export interface ServerStats {
  totalMessages: IntOrNumber;
  activeRooms: IntOrNumber;
  redisStatus: string;
  engine: string;
  signature: string;
  uptimeSeconds: number;
}

type IntOrNumber = number;

export interface GraphQLLog {
  id: string;
  type: 'QUERY' | 'MUTATION' | 'SUBSCRIPTION';
  name: string;
  payload: any;
  timestamp: string;
}
