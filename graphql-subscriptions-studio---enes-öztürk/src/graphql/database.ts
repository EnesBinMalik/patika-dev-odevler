/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * In-Memory Reactive Database & State Store
 */

import {
  EventItem,
  INITIAL_EVENTS,
  INITIAL_LOCATIONS,
  INITIAL_PARTICIPANTS,
  INITIAL_USERS,
  Location,
  Participant,
  SUBSCRIPTION_EVENTS,
  User,
} from './types.ts';
import { pubsub } from './pubsub.ts';

class DatabaseStore {
  private users: User[] = [...INITIAL_USERS];
  private events: EventItem[] = [...INITIAL_EVENTS];
  private locations: Location[] = [...INITIAL_LOCATIONS];
  private participants: Participant[] = [...INITIAL_PARTICIPANTS];

  private changeListeners: Set<() => void> = new Set();

  subscribe(listener: () => void) {
    this.changeListeners.add(listener);
    return () => {
      this.changeListeners.delete(listener);
    };
  }

  private notify() {
    this.changeListeners.forEach((fn) => {
      try {
        fn();
      } catch (err) {
        console.error('Database listener error', err);
      }
    });
  }

  // Queries
  getUsers(): User[] {
    return [...this.users];
  }

  getUser(id: string): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  getEvents(): EventItem[] {
    return [...this.events];
  }

  getEvent(id: string): EventItem | undefined {
    return this.events.find((e) => e.id === id);
  }

  getLocations(): Location[] {
    return [...this.locations];
  }

  getLocation(id: string): Location | undefined {
    return this.locations.find((l) => l.id === id);
  }

  getParticipants(): Participant[] {
    return [...this.participants];
  }

  getParticipant(id: string): Participant | undefined {
    return this.participants.find((p) => p.id === id);
  }

  // Relations
  getUserEvents(userId: string): EventItem[] {
    return this.events.filter((e) => e.user_id === userId);
  }

  getUserParticipations(userId: string): Participant[] {
    return this.participants.filter((p) => p.user_id === userId);
  }

  getEventParticipants(eventId: string): Participant[] {
    return this.participants.filter((p) => p.event_id === eventId);
  }

  // Mutations
  createUser(data: { name: string; email: string }): User {
    const existing = this.users.find((u) => u.email.toLowerCase() === data.email.toLowerCase());
    if (existing) {
      throw new Error(`Bu e-posta adresi (${data.email}) zaten kayıtlı.`);
    }

    const newUser: User = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
    };

    this.users.unshift(newUser);
    this.notify();

    // Trigger GraphQL Subscription
    pubsub.publish(SUBSCRIPTION_EVENTS.USER_CREATED, {
      userCreated: newUser,
    });

    return newUser;
  }

  createEvent(data: {
    title: string;
    desc: string;
    date: string;
    from: string;
    to: string;
    location_id: string;
    user_id: string;
  }): EventItem {
    const user = this.getUser(data.user_id);
    if (!user) {
      throw new Error(`Geçersiz user_id: ${data.user_id}. Böyle bir kullanıcı bulunamadı.`);
    }

    const location = this.getLocation(data.location_id);
    if (!location) {
      throw new Error(`Geçersiz location_id: ${data.location_id}. Böyle bir lokasyon bulunamadı.`);
    }

    const newEvent: EventItem = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      title: data.title.trim(),
      desc: data.desc.trim(),
      date: data.date,
      from: data.from,
      to: data.to,
      location_id: data.location_id,
      user_id: data.user_id,
    };

    this.events.unshift(newEvent);
    this.notify();

    // Trigger GraphQL Subscription
    pubsub.publish(SUBSCRIPTION_EVENTS.EVENT_CREATED, {
      eventCreated: newEvent,
    });

    return newEvent;
  }

  addParticipant(data: { user_id: string; event_id: string }): Participant {
    const user = this.getUser(data.user_id);
    if (!user) {
      throw new Error(`Geçersiz user_id: ${data.user_id}`);
    }

    const event = this.getEvent(data.event_id);
    if (!event) {
      throw new Error(`Geçersiz event_id: ${data.event_id}`);
    }

    const alreadyJoined = this.participants.some(
      (p) => p.user_id === data.user_id && p.event_id === data.event_id
    );
    if (alreadyJoined) {
      throw new Error(`Kullanıcı (${user.name}) zaten bu etkinliğe (${event.title}) katılmış.`);
    }

    const newParticipant: Participant = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      user_id: data.user_id,
      event_id: data.event_id,
    };

    this.participants.unshift(newParticipant);
    this.notify();

    // Trigger GraphQL Subscription
    pubsub.publish(SUBSCRIPTION_EVENTS.PARTICIPANT_ADDED, {
      participantAdded: newParticipant,
    });

    return newParticipant;
  }

  deleteUser(id: string): boolean {
    const initialLen = this.users.length;
    this.users = this.users.filter((u) => u.id !== id);
    this.participants = this.participants.filter((p) => p.user_id !== id);
    this.events = this.events.filter((e) => e.user_id !== id);
    if (this.users.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  deleteEvent(id: string): boolean {
    const initialLen = this.events.length;
    this.events = this.events.filter((e) => e.id !== id);
    this.participants = this.participants.filter((p) => p.event_id !== id);
    if (this.events.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  deleteParticipant(id: string): boolean {
    const initialLen = this.participants.length;
    this.participants = this.participants.filter((p) => p.id !== id);
    if (this.participants.length !== initialLen) {
      this.notify();
      return true;
    }
    return false;
  }

  reset() {
    this.users = [...INITIAL_USERS];
    this.events = [...INITIAL_EVENTS];
    this.locations = [...INITIAL_LOCATIONS];
    this.participants = [...INITIAL_PARTICIPANTS];
    this.notify();
    return true;
  }
}

export const db = new DatabaseStore();
