import { createClient, Client } from 'graphql-ws';
import { Message, Room, ServerStats, TypingStatus, GraphQLLog } from '../types';

export const GET_INITIAL_DATA = `
  query GetInitialData($roomId: String) {
    rooms {
      id
      name
      description
      icon
      messageCount
    }
    messages(roomId: $roomId) {
      id
      content
      author
      avatar
      color
      roomId
      createdAt
      likes
      replyToId
      replyToContent
      replyToAuthor
    }
    stats {
      totalMessages
      activeRooms
      redisStatus
      engine
      signature
      uptimeSeconds
    }
  }
`;

export const SEND_MESSAGE_MUTATION = `
  mutation SendMessage(
    $content: String!
    $author: String!
    $avatar: String
    $color: String
    $roomId: String
    $replyToId: String
    $replyToContent: String
    $replyToAuthor: String
  ) {
    sendMessage(
      content: $content
      author: $author
      avatar: $avatar
      color: $color
      roomId: $roomId
      replyToId: $replyToId
      replyToContent: $replyToContent
      replyToAuthor: $replyToAuthor
    ) {
      id
      content
      author
      avatar
      color
      roomId
      createdAt
      likes
      replyToId
      replyToContent
      replyToAuthor
    }
  }
`;

export const LIKE_MESSAGE_MUTATION = `
  mutation LikeMessage($id: ID!) {
    likeMessage(id: $id) {
      id
      likes
    }
  }
`;

export const SET_TYPING_MUTATION = `
  mutation SetTyping($roomId: String!, $author: String!, $isTyping: Boolean!) {
    setTyping(roomId: $roomId, author: $author, isTyping: $isTyping) {
      roomId
      author
      isTyping
    }
  }
`;

export const CREATE_ROOM_MUTATION = `
  mutation CreateRoom($id: String!, $name: String!, $description: String!, $icon: String) {
    createRoom(id: $id, name: $name, description: $description, icon: $icon) {
      id
      name
      description
      icon
      messageCount
    }
  }
`;

export const CLEAR_ROOM_MUTATION = `
  mutation ClearRoomMessages($roomId: String!) {
    clearRoomMessages(roomId: $roomId)
  }
`;

export const MESSAGE_ADDED_SUBSCRIPTION = `
  subscription OnMessageAdded($roomId: String) {
    messageAdded(roomId: $roomId) {
      id
      content
      author
      avatar
      color
      roomId
      createdAt
      likes
      replyToId
      replyToContent
      replyToAuthor
    }
  }
`;

export const MESSAGE_LIKED_SUBSCRIPTION = `
  subscription OnMessageLiked($roomId: String) {
    messageLiked(roomId: $roomId) {
      id
      likes
      roomId
    }
  }
`;

export const USER_TYPING_SUBSCRIPTION = `
  subscription OnUserTyping($roomId: String) {
    userTyping(roomId: $roomId) {
      roomId
      author
      isTyping
    }
  }
`;

// Helper to execute GraphQL POST
export async function executeGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  operationName?: string,
  onLog?: (log: GraphQLLog) => void
): Promise<T> {
  const isMutation = query.trim().startsWith('mutation');
  const type = isMutation ? 'MUTATION' : 'QUERY';
  const nameMatch = query.match(/(query|mutation)\s+([A-Za-z0-9_]+)/);
  const opName = operationName || (nameMatch ? nameMatch[2] : 'AnonymousGraphQL');

  try {
    const res = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables, operationName: opName }),
    });

    const json = await res.json();
    if (json.errors && json.errors.length > 0) {
      throw new Error(json.errors[0].message || 'GraphQL Query Failed');
    }

    if (onLog) {
      onLog({
        id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
        type,
        name: opName,
        payload: { variables, response: json.data },
        timestamp: new Date().toLocaleTimeString(),
      });
    }

    return json.data as T;
  } catch (err: any) {
    console.error('GraphQL HTTP request error:', err);
    throw err;
  }
}

// Global WebSocket client instance
let wsClient: Client | null = null;

export function getGraphQLWsClient(): Client {
  if (wsClient) return wsClient;

  const loc = window.location;
  const protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${protocol}//${loc.host}/graphql`;

  wsClient = createClient({
    url: wsUrl,
    retryAttempts: 15,
    retryWait: async (retries) => {
      // Exponential backoff
      await new Promise((resolve) => setTimeout(resolve, Math.min(1000 * 2 ** retries, 5000)));
    },
    lazy: false,
    on: {
      connected: () => {
        console.log('✅ Connected to GraphQL Subscriptions WebSocket');
      },
      closed: () => {
        console.log('⚠️ GraphQL Subscriptions WebSocket connection closed');
      },
      error: (err) => {
        console.warn('GraphQL Subscriptions WebSocket error:', err);
      },
    },
  });

  return wsClient;
}
