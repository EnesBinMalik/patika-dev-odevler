import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { MessageList } from './components/MessageList';
import { MessageInput } from './components/MessageInput';
import { GraphQLInspectorModal } from './components/GraphQLInspectorModal';
import { ProfileModal } from './components/ProfileModal';
import { CreateRoomModal } from './components/CreateRoomModal';
import { Message, Room, ServerStats, TypingStatus, GraphQLLog } from './types';
import { generateRandomIdentity } from './lib/avatars';
import { playSendSound, playReceiveSound, playLikeSound } from './lib/audio';
import {
  executeGraphQL,
  getGraphQLWsClient,
  GET_INITIAL_DATA,
  SEND_MESSAGE_MUTATION,
  LIKE_MESSAGE_MUTATION,
  SET_TYPING_MUTATION,
  CREATE_ROOM_MUTATION,
  MESSAGE_ADDED_SUBSCRIPTION,
  MESSAGE_LIKED_SUBSCRIPTION,
  USER_TYPING_SUBSCRIPTION,
} from './lib/graphqlClient';

export default function App() {
  // User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('anon_chat_profile');
      if (saved) return JSON.parse(saved);
    } catch {}
    return generateRandomIdentity();
  });

  // Sound preference
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem('anon_chat_sound');
      return saved !== 'false';
    } catch {
      return true;
    }
  });

  // Room & Messages state
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string>('genel');
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<TypingStatus[]>([]);
  const [serverStats, setServerStats] = useState<ServerStats | null>(null);
  const [wsConnected, setWsConnected] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Modals & UI state
  const [isInspectorOpen, setIsInspectorOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<Message | null>(null);
  const [logs, setLogs] = useState<GraphQLLog[]>([]);

  // Log tracker helper
  const addLog = useCallback((log: GraphQLLog) => {
    setLogs((prev) => [log, ...prev].slice(0, 100));
  }, []);

  // Save profile changes
  const handleSaveProfile = (profile: { nickname: string; avatar: string; color: string }) => {
    setUserProfile(profile);
    try {
      localStorage.setItem('anon_chat_profile', JSON.stringify(profile));
    } catch {}
  };

  const handleRerollIdentity = () => {
    const newId = generateRandomIdentity();
    handleSaveProfile(newId);
  };

  const handleToggleSound = () => {
    setSoundEnabled((prev) => {
      const next = !prev;
      try {
        localStorage.setItem('anon_chat_sound', String(next));
      } catch {}
      return next;
    });
  };

  // Initial load: Fetch rooms, messages, and stats
  const fetchInitialData = useCallback(async (roomId: string) => {
    try {
      setIsLoading(true);
      const data = await executeGraphQL<{
        rooms: Room[];
        messages: Message[];
        stats: ServerStats;
      }>(GET_INITIAL_DATA, { roomId }, 'GetInitialData', addLog);

      if (data?.rooms) setRooms(data.rooms);
      if (data?.messages) setMessages(data.messages);
      if (data?.stats) setServerStats(data.stats);
    } catch (err) {
      console.error('Error fetching initial GraphQL data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [addLog]);

  useEffect(() => {
    fetchInitialData(currentRoomId);
  }, [currentRoomId, fetchInitialData]);

  // Set up GraphQL Subscriptions via WebSocket & Redis PubSub
  useEffect(() => {
    const wsClient = getGraphQLWsClient();
    let isSubscribed = true;

    // 1. Message Added Subscription
    const unsubscribeMessage = wsClient.subscribe(
      {
        query: MESSAGE_ADDED_SUBSCRIPTION,
        variables: { roomId: currentRoomId },
      },
      {
        next: (response: any) => {
          if (!isSubscribed) return;
          const newMsg: Message = response.data?.messageAdded;
          if (!newMsg) return;

          // Guard against duplicate messages (Idempotency)
          setMessages((prev) => {
            const exists = prev.some((m) => m.id === newMsg.id);
            if (exists) return prev;
            return [...prev, newMsg];
          });

          // Update room counters
          setRooms((prev) =>
            prev.map((r) =>
              r.id === newMsg.roomId ? { ...r, messageCount: r.messageCount + 1 } : r
            )
          );

          // Play sound
          if (soundEnabled && newMsg.author !== userProfile.nickname) {
            playReceiveSound();
          }

          // Add subscription log
          addLog({
            id: `sub-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            type: 'SUBSCRIPTION',
            name: 'OnMessageAdded (Redis PubSub)',
            payload: newMsg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        error: (err) => {
          console.warn('Subscription error (messageAdded):', err);
          setWsConnected(false);
        },
        complete: () => {},
      }
    );

    // 2. Message Liked Subscription
    const unsubscribeLiked = wsClient.subscribe(
      {
        query: MESSAGE_LIKED_SUBSCRIPTION,
        variables: { roomId: currentRoomId },
      },
      {
        next: (response: any) => {
          if (!isSubscribed) return;
          const likedMsg: Message = response.data?.messageLiked;
          if (!likedMsg) return;

          setMessages((prev) =>
            prev.map((m) => (m.id === likedMsg.id ? { ...m, likes: likedMsg.likes } : m))
          );

          addLog({
            id: `sub-like-${Date.now()}`,
            type: 'SUBSCRIPTION',
            name: 'OnMessageLiked (Redis PubSub)',
            payload: likedMsg,
            timestamp: new Date().toLocaleTimeString(),
          });
        },
        error: (err) => console.warn('Subscription error (messageLiked):', err),
        complete: () => {},
      }
    );

    // 3. User Typing Subscription
    const unsubscribeTyping = wsClient.subscribe(
      {
        query: USER_TYPING_SUBSCRIPTION,
        variables: { roomId: currentRoomId },
      },
      {
        next: (response: any) => {
          if (!isSubscribed) return;
          const status: TypingStatus = response.data?.userTyping;
          if (!status) return;

          // Don't show typing for self
          if (status.author === userProfile.nickname) return;

          setTypingUsers((prev) => {
            if (status.isTyping) {
              const exists = prev.some((u) => u.author === status.author);
              if (exists) return prev;
              return [...prev, status];
            } else {
              return prev.filter((u) => u.author !== status.author);
            }
          });
        },
        error: (err) => console.warn('Subscription error (userTyping):', err),
        complete: () => {},
      }
    );

    setWsConnected(true);

    return () => {
      isSubscribed = false;
      unsubscribeMessage();
      unsubscribeLiked();
      unsubscribeTyping();
    };
  }, [currentRoomId, userProfile.nickname, soundEnabled, addLog]);

  // Send Message Mutation
  const handleSendMessage = async (content: string, replyToMsg?: Message | null) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticMessage: Message = {
      id: tempId,
      content,
      author: userProfile.nickname,
      avatar: userProfile.avatar,
      color: userProfile.color,
      roomId: currentRoomId,
      createdAt: new Date().toISOString(),
      likes: 0,
      replyToId: replyToMsg?.id || null,
      replyToContent: replyToMsg?.content || null,
      replyToAuthor: replyToMsg?.author || null,
    };

    // Optimistic local add
    setMessages((prev) => [...prev, optimisticMessage]);
    if (soundEnabled) playSendSound();

    try {
      const data = await executeGraphQL<{ sendMessage: Message }>(
        SEND_MESSAGE_MUTATION,
        {
          content,
          author: userProfile.nickname,
          avatar: userProfile.avatar,
          color: userProfile.color,
          roomId: currentRoomId,
          replyToId: replyToMsg?.id || null,
          replyToContent: replyToMsg?.content || null,
          replyToAuthor: replyToMsg?.author || null,
        },
        'SendMessage',
        addLog
      );

      // Reconcile optimistic message with authoritative server response
      if (data?.sendMessage) {
        setMessages((prev) =>
          prev.map((m) => (m.id === tempId ? data.sendMessage : m))
        );
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      // Rollback on failure
      setMessages((prev) => prev.filter((m) => m.id !== tempId));
    }
  };

  // Like Message Mutation
  const handleLikeMessage = async (id: string) => {
    // Optimistic like
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, likes: m.likes + 1 } : m))
    );
    if (soundEnabled) playLikeSound();

    try {
      await executeGraphQL(
        LIKE_MESSAGE_MUTATION,
        { id },
        'LikeMessage',
        addLog
      );
    } catch (err) {
      console.error('Failed to like message:', err);
    }
  };

  // Typing Mutation
  const handleTyping = async (isTyping: boolean) => {
    try {
      await executeGraphQL(
        SET_TYPING_MUTATION,
        {
          roomId: currentRoomId,
          author: userProfile.nickname,
          isTyping,
        },
        'SetTyping'
      );
    } catch (err) {
      // Quietly ignore typing reporting errors
    }
  };

  // Create Room Mutation
  const handleCreateRoom = async (roomData: {
    id: string;
    name: string;
    description: string;
    icon: string;
  }) => {
    try {
      const data = await executeGraphQL<{ createRoom: Room }>(
        CREATE_ROOM_MUTATION,
        roomData,
        'CreateRoom',
        addLog
      );

      if (data?.createRoom) {
        setRooms((prev) => [...prev, data.createRoom]);
        setCurrentRoomId(data.createRoom.id);
      }
    } catch (err) {
      console.error('Failed to create room:', err);
    }
  };

  const currentRoom = rooms.find((r) => r.id === currentRoomId) || null;

  return (
    <div className="flex h-screen w-full bg-slate-950 text-slate-100 overflow-hidden font-sans">
      {/* Sidebar with Rooms and Profile */}
      <Sidebar
        rooms={rooms}
        currentRoomId={currentRoomId}
        onSelectRoom={setCurrentRoomId}
        onOpenCreateRoom={() => setIsCreateRoomOpen(true)}
        onOpenProfile={() => setIsProfileOpen(true)}
        onRerollIdentity={handleRerollIdentity}
        userProfile={userProfile}
        serverStats={serverStats}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Chat Workspace */}
      <div className="flex-1 flex flex-col min-w-0 h-full relative">
        {/* Top Header */}
        <Header
          currentRoom={currentRoom}
          wsConnected={wsConnected}
          redisEngine={serverStats?.engine || 'RedisPubSub'}
          soundEnabled={soundEnabled}
          onToggleSound={handleToggleSound}
          onOpenInspector={() => setIsInspectorOpen(true)}
          onOpenSidebar={() => setIsSidebarOpen(true)}
        />

        {/* Message Area */}
        <MessageList
          messages={messages}
          currentUserId={userProfile.nickname}
          typingUsers={typingUsers}
          onLikeMessage={handleLikeMessage}
          onReplyMessage={(msg) => setReplyTo(msg)}
          isLoading={isLoading}
        />

        {/* Input Area */}
        <MessageInput
          onSendMessage={handleSendMessage}
          onTyping={handleTyping}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          disabled={!wsConnected && false}
        />
      </div>

      {/* GraphQL Inspector & Redis PubSub Architecture Modal */}
      <GraphQLInspectorModal
        isOpen={isInspectorOpen}
        onClose={() => setIsInspectorOpen(false)}
        logs={logs}
        serverStats={serverStats}
        onClearLogs={() => setLogs([])}
      />

      {/* Profile Customization Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        currentProfile={userProfile}
        onSaveProfile={handleSaveProfile}
      />

      {/* Create Room Modal */}
      <CreateRoomModal
        isOpen={isCreateRoomOpen}
        onClose={() => setIsCreateRoomOpen(false)}
        onCreateRoom={handleCreateRoom}
      />
    </div>
  );
}
