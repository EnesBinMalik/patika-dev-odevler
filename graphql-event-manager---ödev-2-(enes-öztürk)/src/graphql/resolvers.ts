/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Resolvers Implementation
 * 
 * Bu dosya User, Event, Location ve Participant için:
 * - Query resolvers
 * - Mutation resolvers (add, update, delete, deleteAll)
 * - İlişkisel (relational) resolver wrapper fonksiyonlarını içerir.
 */

import { db } from './database';
import { User, Location, Event, Participant } from './types';

// Helper to wrap User with relational fields
export const wrapUser = (u: User) => {
  if (!u) return null;
  return {
    ...u,
    events: () => {
      const state = db.getState();
      return state.events.filter((e) => e.user_id === u.id).map(wrapEvent);
    },
    participants: () => {
      const state = db.getState();
      return state.participants.filter((p) => p.user_id === u.id).map(wrapParticipant);
    }
  };
};

// Helper to wrap Location with relational fields
export const wrapLocation = (l: Location) => {
  if (!l) return null;
  return {
    ...l,
    events: () => {
      const state = db.getState();
      return state.events.filter((e) => e.location_id === l.id).map(wrapEvent);
    }
  };
};

// Helper to wrap Event with relational fields
export const wrapEvent = (e: Event) => {
  if (!e) return null;
  return {
    ...e,
    user: () => {
      const state = db.getState();
      const user = state.users.find((u) => u.id === e.user_id);
      return user ? wrapUser(user) : null;
    },
    location: () => {
      const state = db.getState();
      const loc = state.locations.find((l) => l.id === e.location_id);
      return loc ? wrapLocation(loc) : null;
    },
    participants: () => {
      const state = db.getState();
      return state.participants.filter((p) => p.event_id === e.id).map(wrapParticipant);
    }
  };
};

// Helper to wrap Participant with relational fields
export const wrapParticipant = (p: Participant) => {
  if (!p) return null;
  return {
    ...p,
    user: () => {
      const state = db.getState();
      const user = state.users.find((u) => u.id === p.user_id);
      return user ? wrapUser(user) : null;
    },
    event: () => {
      const state = db.getState();
      const ev = state.events.find((e) => e.id === p.event_id);
      return ev ? wrapEvent(ev) : null;
    }
  };
};

export const rootResolvers = {
  // ==================== QUERIES ====================
  users: () => {
    return db.getState().users.map(wrapUser);
  },
  user: ({ id }: { id: string }) => {
    const user = db.getState().users.find((u) => u.id === String(id));
    return user ? wrapUser(user) : null;
  },

  events: () => {
    return db.getState().events.map(wrapEvent);
  },
  event: ({ id }: { id: string }) => {
    const ev = db.getState().events.find((e) => e.id === String(id));
    return ev ? wrapEvent(ev) : null;
  },

  locations: () => {
    return db.getState().locations.map(wrapLocation);
  },
  location: ({ id }: { id: string }) => {
    const loc = db.getState().locations.find((l) => l.id === String(id));
    return loc ? wrapLocation(loc) : null;
  },

  participants: () => {
    return db.getState().participants.map(wrapParticipant);
  },
  participant: ({ id }: { id: string }) => {
    const p = db.getState().participants.find((item) => item.id === String(id));
    return p ? wrapParticipant(p) : null;
  },

  // ==================== MUTATIONS: USER ====================
  addUser: (args: any) => {
    const data = args.data || args;
    if (!data.username || !data.email) {
      throw new Error('addUser requires username and email fields');
    }
    const created = db.addUser({
      username: data.username,
      email: data.email
    });
    return wrapUser(created);
  },

  updateUser: (args: any) => {
    const id = args.id;
    const data = args.data || args;
    const updated = db.updateUser(id, {
      username: data.username,
      email: data.email
    });
    return wrapUser(updated);
  },

  deleteUser: ({ id }: { id: string }) => {
    const deleted = db.deleteUser(id);
    return wrapUser(deleted);
  },

  deleteAllUsers: () => {
    return db.deleteAllUsers();
  },

  // ==================== MUTATIONS: EVENT ====================
  addEvent: (args: any) => {
    const data = args.data || args;
    if (!data.title || !data.desc || !data.date || !data.from || !data.to || !data.location_id || !data.user_id) {
      throw new Error('addEvent requires title, desc, date, from, to, location_id and user_id');
    }
    const created = db.addEvent({
      title: data.title,
      desc: data.desc,
      date: data.date,
      from: data.from,
      to: data.to,
      location_id: data.location_id,
      user_id: data.user_id
    });
    return wrapEvent(created);
  },

  updateEvent: (args: any) => {
    const id = args.id;
    const data = args.data || args;
    const updated = db.updateEvent(id, {
      title: data.title,
      desc: data.desc,
      date: data.date,
      from: data.from,
      to: data.to,
      location_id: data.location_id,
      user_id: data.user_id
    });
    return wrapEvent(updated);
  },

  deleteEvent: ({ id }: { id: string }) => {
    const deleted = db.deleteEvent(id);
    return wrapEvent(deleted);
  },

  deleteAllEvents: () => {
    return db.deleteAllEvents();
  },

  // ==================== MUTATIONS: LOCATION ====================
  addLocation: (args: any) => {
    const data = args.data || args;
    if (!data.name || !data.desc || data.lat === undefined || data.lng === undefined) {
      throw new Error('addLocation requires name, desc, lat and lng');
    }
    const created = db.addLocation({
      name: data.name,
      desc: data.desc,
      lat: Number(data.lat),
      lng: Number(data.lng)
    });
    return wrapLocation(created);
  },

  updateLocation: (args: any) => {
    const id = args.id;
    const data = args.data || args;
    const updated = db.updateLocation(id, {
      name: data.name,
      desc: data.desc,
      lat: data.lat !== undefined ? Number(data.lat) : undefined,
      lng: data.lng !== undefined ? Number(data.lng) : undefined
    });
    return wrapLocation(updated);
  },

  deleteLocation: ({ id }: { id: string }) => {
    const deleted = db.deleteLocation(id);
    return wrapLocation(deleted);
  },

  deleteAllLocations: () => {
    return db.deleteAllLocations();
  },

  // ==================== MUTATIONS: PARTICIPANT ====================
  addParticipant: (args: any) => {
    const data = args.data || args;
    if (!data.user_id || !data.event_id) {
      throw new Error('addParticipant requires user_id and event_id');
    }
    const created = db.addParticipant({
      user_id: data.user_id,
      event_id: data.event_id
    });
    return wrapParticipant(created);
  },

  updateParticipant: (args: any) => {
    const id = args.id;
    const data = args.data || args;
    const updated = db.updateParticipant(id, {
      user_id: data.user_id,
      event_id: data.event_id
    });
    return wrapParticipant(updated);
  },

  deleteParticipant: ({ id }: { id: string }) => {
    const deleted = db.deleteParticipant(id);
    return wrapParticipant(deleted);
  },

  deleteAllParticipants: () => {
    return db.deleteAllParticipants();
  }
};
