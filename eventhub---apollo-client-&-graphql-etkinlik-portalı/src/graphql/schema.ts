import { buildSchema, graphql } from 'graphql';
import {
  initialEvents,
  initialLocations,
  initialParticipants,
  initialUsers,
  type Event,
  type Location,
  type Participant,
  type User,
} from './data.ts';

export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    username: String!
    email: String!
    role: String
    avatarColor: String
    events: [Event!]!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float!
    lng: Float!
    address: String
    events: [Event!]!
  }

  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    event: Event!
  }

  type Event {
    id: ID!
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]!
  }

  type Query {
    events: [Event!]!
    event(id: ID!): Event
    users: [User!]!
    user(id: ID!): User
    locations: [Location!]!
    location(id: ID!): Location
    participants: [Participant!]!
  }

  input AddEventInput {
    title: String!
    desc: String!
    date: String!
    from: String!
    to: String!
    location_id: ID!
    user_id: ID!
  }

  input AddParticipantInput {
    user_id: ID!
    event_id: ID!
  }

  type Mutation {
    addEvent(data: AddEventInput!): Event!
    addParticipant(data: AddParticipantInput!): Participant!
    deleteEvent(id: ID!): Event!
  }
`;

export const schema = buildSchema(typeDefs);

const STORAGE_KEY = 'eventhub_graphql_state_v1';

interface State {
  users: User[];
  locations: Location[];
  events: Event[];
  participants: Participant[];
}

function loadState(): State {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed.events && parsed.users && parsed.locations && parsed.participants) {
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return {
    users: [...initialUsers],
    locations: [...initialLocations],
    events: [...initialEvents],
    participants: [...initialParticipants],
  };
}

let currentState: State = loadState();

export function saveState(): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
  } catch {
    // ignore
  }
}

export function resetState(): void {
  currentState = {
    users: [...initialUsers],
    locations: [...initialLocations],
    events: [...initialEvents],
    participants: [...initialParticipants],
  };
  saveState();
}

export function getState(): State {
  return currentState;
}

class UserModel {
  id!: string;
  username!: string;
  email!: string;
  role!: string;
  avatarColor!: string;

  constructor(data: User) {
    Object.assign(this, data);
  }

  events() {
    return currentState.events
      .filter((e) => String(e.user_id) === String(this.id))
      .map((e) => new EventModel(e));
  }
}

class LocationModel {
  id!: string;
  name!: string;
  desc!: string;
  lat!: number;
  lng!: number;
  address?: string;

  constructor(data: Location) {
    Object.assign(this, data);
  }

  events() {
    return currentState.events
      .filter((e) => String(e.location_id) === String(this.id))
      .map((e) => new EventModel(e));
  }
}

class ParticipantModel {
  id!: string;
  user_id!: string;
  event_id!: string;

  constructor(data: Participant) {
    Object.assign(this, data);
  }

  user() {
    const found = currentState.users.find((u) => String(u.id) === String(this.user_id));
    return found ? new UserModel(found) : null;
  }

  event() {
    const found = currentState.events.find((e) => String(e.id) === String(this.event_id));
    return found ? new EventModel(found) : null;
  }
}

class EventModel {
  id!: string;
  title!: string;
  desc!: string;
  date!: string;
  from!: string;
  to!: string;
  location_id!: string;
  user_id!: string;

  constructor(data: Event) {
    Object.assign(this, data);
  }

  user() {
    const found = currentState.users.find((u) => String(u.id) === String(this.user_id));
    return found ? new UserModel(found) : null;
  }

  location() {
    const found = currentState.locations.find((l) => String(l.id) === String(this.location_id));
    return found ? new LocationModel(found) : null;
  }

  participants() {
    return currentState.participants
      .filter((p) => String(p.event_id) === String(this.id))
      .map((p) => new ParticipantModel(p));
  }
}

export const rootValue = {
  events: () => {
    return currentState.events.map((e) => new EventModel(e));
  },
  event: ({ id }: { id: string }) => {
    const found = currentState.events.find((e) => String(e.id) === String(id));
    return found ? new EventModel(found) : null;
  },
  users: () => {
    return currentState.users.map((u) => new UserModel(u));
  },
  user: ({ id }: { id: string }) => {
    const found = currentState.users.find((u) => String(u.id) === String(id));
    return found ? new UserModel(found) : null;
  },
  locations: () => {
    return currentState.locations.map((l) => new LocationModel(l));
  },
  location: ({ id }: { id: string }) => {
    const found = currentState.locations.find((l) => String(l.id) === String(id));
    return found ? new LocationModel(found) : null;
  },
  participants: () => {
    return currentState.participants.map((p) => new ParticipantModel(p));
  },
  addEvent: ({ data }: { data: Omit<Event, 'id'> }) => {
    const newId = String(Date.now());
    const newEvent: Event = {
      id: newId,
      title: data.title,
      desc: data.desc,
      date: data.date,
      from: data.from,
      to: data.to,
      location_id: String(data.location_id),
      user_id: String(data.user_id),
    };
    currentState.events.unshift(newEvent);
    saveState();
    return new EventModel(newEvent);
  },
  addParticipant: ({ data }: { data: { user_id: string; event_id: string } }) => {
    // Check if already participant
    const existing = currentState.participants.find(
      (p) => String(p.user_id) === String(data.user_id) && String(p.event_id) === String(data.event_id)
    );
    if (existing) {
      return new ParticipantModel(existing);
    }
    const newId = String(Date.now());
    const newParticipant: Participant = {
      id: newId,
      user_id: String(data.user_id),
      event_id: String(data.event_id),
    };
    currentState.participants.push(newParticipant);
    saveState();
    return new ParticipantModel(newParticipant);
  },
  deleteEvent: ({ id }: { id: string }) => {
    const index = currentState.events.findIndex((e) => String(e.id) === String(id));
    if (index === -1) {
      throw new Error(`Etkinlik bulunamadı (ID: ${id})`);
    }
    const [deleted] = currentState.events.splice(index, 1);
    currentState.participants = currentState.participants.filter(
      (p) => String(p.event_id) !== String(id)
    );
    saveState();
    return new EventModel(deleted);
  },
};

export async function executeGraphQL(source: string, variableValues?: Record<string, any>) {
  return graphql({
    schema,
    source,
    rootValue,
    variableValues,
  });
}
