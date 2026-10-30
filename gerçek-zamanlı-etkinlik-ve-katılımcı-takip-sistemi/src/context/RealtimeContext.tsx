import React, { createContext, useContext, useEffect, useState, useRef, useCallback } from 'react';
import type { EventItem, Participant, SocketMessage } from '../types';

export interface ActivityNotification {
  id: string;
  type: 'event_added' | 'participant_added' | 'event_deleted';
  title: string;
  subtitle: string;
  timestamp: Date;
  eventId?: string;
}

interface RealtimeContextType {
  events: EventItem[];
  selectedEventId: string | null;
  selectedEvent: EventItem | null;
  setSelectedEventId: (id: string | null) => void;
  isConnected: boolean;
  activeClientsCount: number;
  activityFeed: ActivityNotification[];
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  addEvent: (payload: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: EventItem['category'];
    capacity: number;
    organizer?: string;
    tags?: string[];
  }) => Promise<{ success: boolean; event?: EventItem; error?: string }>;
  addParticipant: (
    eventId: string,
    participant: {
      name: string;
      email: string;
      role: Participant['role'];
      company?: string;
      note?: string;
    }
  ) => Promise<{ success: boolean; participant?: Participant; error?: string }>;
  deleteEvent: (eventId: string) => Promise<boolean>;
  resetToSeed: () => Promise<void>;
  splitScreenMode: boolean;
  setSplitScreenMode: (active: boolean) => void;
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

// Web Audio API chime generator for real-time notifications
function playChime(type: 'join' | 'new_event') {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'join') {
      // Pleasant high double ping for new participant
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else {
      // Warm chord for new event
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.45);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.45);
    }
  } catch {
    // Audio autoplay restrictions or unsupported
  }
}

export const RealtimeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [activeClientsCount, setActiveClientsCount] = useState<number>(1);
  const [activityFeed, setActivityFeed] = useState<ActivityNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [splitScreenMode, setSplitScreenMode] = useState<boolean>(false);

  const socketRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const broadcastChannelRef = useRef<BroadcastChannel | null>(null);

  // Derive selectedEvent
  const selectedEvent = events.find((e) => e.id === selectedEventId) || null;

  const pushActivity = useCallback((activity: Omit<ActivityNotification, 'id' | 'timestamp'>) => {
    const item: ActivityNotification = {
      ...activity,
      id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      timestamp: new Date()
    };
    setActivityFeed((prev) => [item, ...prev].slice(0, 15));
  }, []);

  // Fetch initial REST data
  const fetchInitialData = useCallback(async () => {
    try {
      const res = await fetch('/api/events');
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setEvents(json.data);
          if (json.activeConnections) {
            setActiveClientsCount(json.activeConnections);
          }
        }
      }
    } catch (err) {
      console.warn('Initial data fetch fallback:', err);
    }
  }, []);

  // Handle incoming socket message
  const handleMessage = useCallback((msg: SocketMessage) => {
    switch (msg.type) {
      case 'INIT': {
        const eventList = msg.payload as EventItem[];
        setEvents(eventList);
        break;
      }
      case 'CLIENTS_COUNT': {
        const count = (msg.payload as { count: number })?.count;
        if (typeof count === 'number') {
          setActiveClientsCount(count);
        }
        break;
      }
      case 'EVENT_ADDED': {
        const newEvt = msg.payload as EventItem;
        setEvents((prev) => {
          // Idempotency: prevent duplicates
          if (prev.some((e) => e.id === newEvt.id)) return prev;
          return [newEvt, ...prev];
        });
        pushActivity({
          type: 'event_added',
          title: 'Yeni Etkinlik Yayında!',
          subtitle: `"${newEvt.title}" listeye eklendi`,
          eventId: newEvt.id
        });
        if (soundEnabled) playChime('new_event');
        break;
      }
      case 'PARTICIPANT_ADDED': {
        const { eventId, participant, participantsCount } = msg.payload as {
          eventId: string;
          participant: Participant;
          participantsCount: number;
        };

        setEvents((prev) =>
          prev.map((evt) => {
            if (evt.id !== eventId) return evt;
            // Prevent duplicate participant insertion
            if (evt.participants.some((p) => p.id === participant.id || p.email === participant.email)) {
              return evt;
            }
            return {
              ...evt,
              participantsCount: participantsCount || evt.participants.length + 1,
              participants: [participant, ...evt.participants]
            };
          })
        );

        pushActivity({
          type: 'participant_added',
          title: 'Yeni Katılımcı Kaydoldu!',
          subtitle: `${participant.name} (${participant.role}) etkinliğe katıldı`,
          eventId
        });

        if (soundEnabled) playChime('join');
        break;
      }
      case 'EVENT_DELETED': {
        const { eventId } = msg.payload as { eventId: string };
        setEvents((prev) => prev.filter((e) => e.id !== eventId));
        if (selectedEventId === eventId) {
          setSelectedEventId(null);
        }
        pushActivity({
          type: 'event_deleted',
          title: 'Etkinlik Kaldırıldı',
          subtitle: `ID: ${eventId} etkinliği silindi`,
          eventId
        });
        break;
      }
    }
  }, [pushActivity, selectedEventId, soundEnabled]);

  // Connect WebSocket
  useEffect(() => {
    fetchInitialData();

    // Setup multi-tab BroadcastChannel
    try {
      const bc = new BroadcastChannel('realtime_events_hw5');
      broadcastChannelRef.current = bc;
      bc.onmessage = (ev) => {
        if (ev.data && ev.data.type) {
          handleMessage(ev.data);
        }
      };
    } catch {
      // BroadcastChannel might not be supported in older envs
    }

    function connectWs() {
      if (typeof window === 'undefined') return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const wsUrl = `${protocol}//${window.location.host}`;

      try {
        const ws = new WebSocket(wsUrl);
        socketRef.current = ws;

        ws.onopen = () => {
          setIsConnected(true);
        };

        ws.onmessage = (event) => {
          try {
            const data: SocketMessage = JSON.parse(event.data);
            handleMessage(data);
          } catch (e) {
            console.error('Failed to parse WS message', e);
          }
        };

        ws.onclose = () => {
          setIsConnected(false);
          // Try to reconnect in 3s
          reconnectTimeoutRef.current = setTimeout(connectWs, 3000);
        };

        ws.onerror = (err) => {
          console.warn('WS error:', err);
          ws.close();
        };
      } catch (e) {
        console.warn('WS connection setup error:', e);
        reconnectTimeoutRef.current = setTimeout(connectWs, 4000);
      }
    }

    connectWs();

    // Heartbeat ping every 25s
    const pingInterval = setInterval(() => {
      if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
        socketRef.current.send(JSON.stringify({ type: 'PING' }));
      }
    }, 25000);

    return () => {
      clearInterval(pingInterval);
      if (reconnectTimeoutRef.current) clearTimeout(reconnectTimeoutRef.current);
      if (socketRef.current) {
        socketRef.current.onclose = null;
        socketRef.current.close();
      }
      if (broadcastChannelRef.current) {
        broadcastChannelRef.current.close();
      }
    };
  }, [fetchInitialData, handleMessage]);

  // Add event API call
  const addEvent = async (payload: {
    title: string;
    description: string;
    date: string;
    time: string;
    location: string;
    category: EventItem['category'];
    capacity: number;
    organizer?: string;
    tags?: string[];
  }) => {
    try {
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Also broadcast via BroadcastChannel for instant local tab sync
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'EVENT_ADDED',
            payload: data.data,
            timestamp: Date.now()
          });
        }
        return { success: true, event: data.data };
      }
      return { success: false, error: data.message || 'Etkinlik eklenemedi' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Bağlantı hatası' };
    }
  };

  // Add participant API call
  const addParticipant = async (
    eventId: string,
    participant: {
      name: string;
      email: string;
      role: Participant['role'];
      company?: string;
      note?: string;
    }
  ) => {
    try {
      const res = await fetch(`/api/events/${eventId}/participants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(participant)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        // Broadcast locally too
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'PARTICIPANT_ADDED',
            payload: {
              eventId,
              participant: data.data,
              participantsCount: data.participantsCount
            },
            timestamp: Date.now()
          });
        }
        return { success: true, participant: data.data };
      }
      return { success: false, error: data.message || 'Katılımcı eklenemedi' };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Bağlantı hatası' };
    }
  };

  // Delete event
  const deleteEvent = async (eventId: string) => {
    try {
      const res = await fetch(`/api/events/${eventId}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'EVENT_DELETED',
            payload: { eventId },
            timestamp: Date.now()
          });
        }
        return true;
      }
      return false;
    } catch {
      return false;
    }
  };

  // Reset data to seed
  const resetToSeed = async () => {
    try {
      const res = await fetch('/api/reset', { method: 'POST' });
      const data = await res.json();
      if (res.ok && data.success) {
        setEvents(data.data);
        if (broadcastChannelRef.current) {
          broadcastChannelRef.current.postMessage({
            type: 'INIT',
            payload: data.data,
            timestamp: Date.now()
          });
        }
      }
    } catch {
      // fallback
    }
  };

  return (
    <RealtimeContext.Provider
      value={{
        events,
        selectedEventId,
        selectedEvent,
        setSelectedEventId,
        isConnected,
        activeClientsCount,
        activityFeed,
        soundEnabled,
        setSoundEnabled,
        addEvent,
        addParticipant,
        deleteEvent,
        resetToSeed,
        splitScreenMode,
        setSplitScreenMode
      }}
    >
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = () => {
  const context = useContext(RealtimeContext);
  if (!context) {
    throw new Error('useRealtime must be used within RealtimeProvider');
  }
  return context;
};
