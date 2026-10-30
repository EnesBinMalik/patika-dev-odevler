/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Database State Manager
 */
import { User, Location, Event, Participant } from './types';
import { initialUsers, initialLocations, initialEvents, initialParticipants } from './initialData';

const STORAGE_KEY = 'graphql_odev2_enes_ozturk_db';

export interface DatabaseState {
  users: User[];
  locations: Location[];
  events: Event[];
  participants: Participant[];
}

type Listener = () => void;

class Database {
  private state: DatabaseState;
  private listeners: Set<Listener> = new Set();

  constructor() {
    this.state = this.loadFromStorage();
  }

  private loadFromStorage(): DatabaseState {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (
          Array.isArray(parsed.users) &&
          Array.isArray(parsed.locations) &&
          Array.isArray(parsed.events) &&
          Array.isArray(parsed.participants)
        ) {
          return parsed;
        }
      }
    } catch {
      // Fallback to default
    }
    return {
      users: [...initialUsers],
      locations: [...initialLocations],
      events: [...initialEvents],
      participants: [...initialParticipants]
    };
  }

  private saveToStorage() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
    this.notify();
  }

  public subscribe(listener: Listener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify() {
    this.listeners.forEach((listener) => listener());
  }

  public getState(): DatabaseState {
    return {
      users: [...this.state.users],
      locations: [...this.state.locations],
      events: [...this.state.events],
      participants: [...this.state.participants]
    };
  }

  public resetToDefaults() {
    this.state = {
      users: JSON.parse(JSON.stringify(initialUsers)),
      locations: JSON.parse(JSON.stringify(initialLocations)),
      events: JSON.parse(JSON.stringify(initialEvents)),
      participants: JSON.parse(JSON.stringify(initialParticipants))
    };
    this.saveToStorage();
  }

  // ---------------- USER OPERATIONS ----------------
  public addUser(data: { username: string; email: string }): User {
    const newUser: User = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      username: data.username,
      email: data.email
    };
    this.state.users.push(newUser);
    this.saveToStorage();
    return newUser;
  }

  public updateUser(id: string, data: { username?: string; email?: string }): User {
    const index = this.state.users.findIndex((u) => u.id === String(id));
    if (index === -1) {
      throw new Error(`User with ID '${id}' not found`);
    }
    const updated = {
      ...this.state.users[index],
      ...(data.username !== undefined ? { username: data.username } : {}),
      ...(data.email !== undefined ? { email: data.email } : {})
    };
    this.state.users[index] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteUser(id: string): User {
    const index = this.state.users.findIndex((u) => u.id === String(id));
    if (index === -1) {
      throw new Error(`User with ID '${id}' not found`);
    }
    const [deleted] = this.state.users.splice(index, 1);
    // Cascade delete participants of this user
    this.state.participants = this.state.participants.filter((p) => p.user_id !== String(id));
    this.saveToStorage();
    return deleted;
  }

  public deleteAllUsers(): { count: number; message: string } {
    const count = this.state.users.length;
    this.state.users = [];
    // Clear participants as well
    this.state.participants = [];
    this.saveToStorage();
    return { count, message: `${count} user successfully deleted.` };
  }

  // ---------------- LOCATION OPERATIONS ----------------
  public addLocation(data: { name: string; desc: string; lat: number; lng: number }): Location {
    const newLocation: Location = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      name: data.name,
      desc: data.desc,
      lat: Number(data.lat),
      lng: Number(data.lng)
    };
    this.state.locations.push(newLocation);
    this.saveToStorage();
    return newLocation;
  }

  public updateLocation(
    id: string,
    data: { name?: string; desc?: string; lat?: number; lng?: number }
  ): Location {
    const index = this.state.locations.findIndex((l) => l.id === String(id));
    if (index === -1) {
      throw new Error(`Location with ID '${id}' not found`);
    }
    const updated = {
      ...this.state.locations[index],
      ...(data.name !== undefined ? { name: data.name } : {}),
      ...(data.desc !== undefined ? { desc: data.desc } : {}),
      ...(data.lat !== undefined ? { lat: Number(data.lat) } : {}),
      ...(data.lng !== undefined ? { lng: Number(data.lng) } : {})
    };
    this.state.locations[index] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteLocation(id: string): Location {
    const index = this.state.locations.findIndex((l) => l.id === String(id));
    if (index === -1) {
      throw new Error(`Location with ID '${id}' not found`);
    }
    const [deleted] = this.state.locations.splice(index, 1);
    this.saveToStorage();
    return deleted;
  }

  public deleteAllLocations(): { count: number; message: string } {
    const count = this.state.locations.length;
    this.state.locations = [];
    this.saveToStorage();
    return { count, message: `${count} location successfully deleted.` };
  }

  // ---------------- EVENT OPERATIONS ----------------
  public addEvent(data: {
    title: string;
    desc: string;
    date: string;
    from: string;
    to: string;
    location_id: string;
    user_id: string;
  }): Event {
    const newEvent: Event = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      title: data.title,
      desc: data.desc,
      date: data.date,
      from: data.from,
      to: data.to,
      location_id: String(data.location_id),
      user_id: String(data.user_id)
    };
    this.state.events.push(newEvent);
    this.saveToStorage();
    return newEvent;
  }

  public updateEvent(
    id: string,
    data: {
      title?: string;
      desc?: string;
      date?: string;
      from?: string;
      to?: string;
      location_id?: string;
      user_id?: string;
    }
  ): Event {
    const index = this.state.events.findIndex((e) => e.id === String(id));
    if (index === -1) {
      throw new Error(`Event with ID '${id}' not found`);
    }
    const updated = {
      ...this.state.events[index],
      ...(data.title !== undefined ? { title: data.title } : {}),
      ...(data.desc !== undefined ? { desc: data.desc } : {}),
      ...(data.date !== undefined ? { date: data.date } : {}),
      ...(data.from !== undefined ? { from: data.from } : {}),
      ...(data.to !== undefined ? { to: data.to } : {}),
      ...(data.location_id !== undefined ? { location_id: String(data.location_id) } : {}),
      ...(data.user_id !== undefined ? { user_id: String(data.user_id) } : {})
    };
    this.state.events[index] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteEvent(id: string): Event {
    const index = this.state.events.findIndex((e) => e.id === String(id));
    if (index === -1) {
      throw new Error(`Event with ID '${id}' not found`);
    }
    const [deleted] = this.state.events.splice(index, 1);
    // Cascade delete participants for this event
    this.state.participants = this.state.participants.filter((p) => p.event_id !== String(id));
    this.saveToStorage();
    return deleted;
  }

  public deleteAllEvents(): { count: number; message: string } {
    const count = this.state.events.length;
    this.state.events = [];
    this.state.participants = [];
    this.saveToStorage();
    return { count, message: `${count} event successfully deleted.` };
  }

  // ---------------- PARTICIPANT OPERATIONS ----------------
  public addParticipant(data: { user_id: string; event_id: string }): Participant {
    const newParticipant: Participant = {
      id: String(Date.now() + Math.floor(Math.random() * 100)),
      user_id: String(data.user_id),
      event_id: String(data.event_id)
    };
    this.state.participants.push(newParticipant);
    this.saveToStorage();
    return newParticipant;
  }

  public updateParticipant(
    id: string,
    data: { user_id?: string; event_id?: string }
  ): Participant {
    const index = this.state.participants.findIndex((p) => p.id === String(id));
    if (index === -1) {
      throw new Error(`Participant with ID '${id}' not found`);
    }
    const updated = {
      ...this.state.participants[index],
      ...(data.user_id !== undefined ? { user_id: String(data.user_id) } : {}),
      ...(data.event_id !== undefined ? { event_id: String(data.event_id) } : {})
    };
    this.state.participants[index] = updated;
    this.saveToStorage();
    return updated;
  }

  public deleteParticipant(id: string): Participant {
    const index = this.state.participants.findIndex((p) => p.id === String(id));
    if (index === -1) {
      throw new Error(`Participant with ID '${id}' not found`);
    }
    const [deleted] = this.state.participants.splice(index, 1);
    this.saveToStorage();
    return deleted;
  }

  public deleteAllParticipants(): { count: number; message: string } {
    const count = this.state.participants.length;
    this.state.participants = [];
    this.saveToStorage();
    return { count, message: `${count} participant successfully deleted.` };
  }
}

export const db = new Database();
