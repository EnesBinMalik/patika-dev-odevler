/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Code Export Templates
 */

export const codeFiles = [
  {
    name: 'schema.graphql',
    language: 'graphql',
    description: 'GraphQL Şeması (Type, Input, Query ve 16 Mutation Tanımları)',
    code: `"""
Hazırlayan: Enes Öztürk
GraphQL Ödev 2 - Şema Tanımları
"""

type User {
  id: ID!
  username: String!
  email: String!
  events: [Event!]!
  participants: [Participant!]!
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

type Location {
  id: ID!
  name: String!
  desc: String!
  lat: Float!
  lng: Float!
  events: [Event!]!
}

type Participant {
  id: ID!
  user_id: ID!
  event_id: ID!
  user: User!
  event: Event!
}

type DeleteAllOutput {
  count: Int!
  message: String
}

input AddUserInput {
  username: String!
  email: String!
}

input UpdateUserInput {
  username: String
  email: String
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

input UpdateEventInput {
  title: String
  desc: String
  date: String
  from: String
  to: String
  location_id: ID
  user_id: ID
}

input AddLocationInput {
  name: String!
  desc: String!
  lat: Float!
  lng: Float!
}

input UpdateLocationInput {
  name: String
  desc: String
  lat: Float
  lng: Float
}

input AddParticipantInput {
  user_id: ID!
  event_id: ID!
}

input UpdateParticipantInput {
  user_id: ID
  event_id: ID
}

type Query {
  users: [User!]!
  user(id: ID!): User
  events: [Event!]!
  event(id: ID!): Event
  locations: [Location!]!
  location(id: ID!): Location
  participants: [Participant!]!
  participant(id: ID!): Participant
}

type Mutation {
  # User
  addUser(data: AddUserInput!): User!
  updateUser(id: ID!, data: UpdateUserInput!): User!
  deleteUser(id: ID!): User!
  deleteAllUsers: DeleteAllOutput!

  # Event
  addEvent(data: AddEventInput!): Event!
  updateEvent(id: ID!, data: UpdateEventInput!): Event!
  deleteEvent(id: ID!): Event!
  deleteAllEvents: DeleteAllOutput!

  # Location
  addLocation(data: AddLocationInput!): Location!
  updateLocation(id: ID!, data: UpdateLocationInput!): Location!
  deleteLocation(id: ID!): Location!
  deleteAllLocations: DeleteAllOutput!

  # Participant
  addParticipant(data: AddParticipantInput!): Participant!
  updateParticipant(id: ID!, data: UpdateParticipantInput!): Participant!
  deleteParticipant(id: ID!): Participant!
  deleteAllParticipants: DeleteAllOutput!
}
`
  },
  {
    name: 'resolvers.js',
    language: 'javascript',
    description: 'Apollo Server Resolvers Dosyası (Tüm Mutation ve Query Mantığı)',
    code: `/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Resolvers
 */
import { nanoid } from 'nanoid';
import { users, events, locations, participants } from './data.js';

export const resolvers = {
  Query: {
    users: () => users,
    user: (_, { id }) => users.find((u) => u.id === id),

    events: () => events,
    event: (_, { id }) => events.find((e) => e.id === id),

    locations: () => locations,
    location: (_, { id }) => locations.find((l) => l.id === id),

    participants: () => participants,
    participant: (_, { id }) => participants.find((p) => p.id === id),
  },

  User: {
    events: (parent) => events.filter((e) => e.user_id === parent.id),
    participants: (parent) => participants.filter((p) => p.user_id === parent.id),
  },

  Event: {
    user: (parent) => users.find((u) => u.id === parent.user_id),
    location: (parent) => locations.find((l) => l.id === parent.location_id),
    participants: (parent) => participants.filter((p) => p.event_id === parent.id),
  },

  Location: {
    events: (parent) => events.filter((e) => e.location_id === parent.id),
  },

  Participant: {
    user: (parent) => users.find((u) => u.id === parent.user_id),
    event: (parent) => events.find((e) => e.id === parent.event_id),
  },

  Mutation: {
    // --- USER MUTATIONS ---
    addUser: (_, { data }) => {
      const newUser = { id: nanoid(), ...data };
      users.push(newUser);
      return newUser;
    },
    updateUser: (_, { id, data }) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('User not found');
      users[index] = { ...users[index], ...data };
      return users[index];
    },
    deleteUser: (_, { id }) => {
      const index = users.findIndex((u) => u.id === id);
      if (index === -1) throw new Error('User not found');
      const [deleted] = users.splice(index, 1);
      return deleted;
    },
    deleteAllUsers: () => {
      const count = users.length;
      users.splice(0, users.length);
      return { count, message: \`\${count} user silindi.\` };
    },

    // --- EVENT MUTATIONS ---
    addEvent: (_, { data }) => {
      const newEvent = { id: nanoid(), ...data };
      events.push(newEvent);
      return newEvent;
    },
    updateEvent: (_, { id, data }) => {
      const index = events.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Event not found');
      events[index] = { ...events[index], ...data };
      return events[index];
    },
    deleteEvent: (_, { id }) => {
      const index = events.findIndex((e) => e.id === id);
      if (index === -1) throw new Error('Event not found');
      const [deleted] = events.splice(index, 1);
      return deleted;
    },
    deleteAllEvents: () => {
      const count = events.length;
      events.splice(0, events.length);
      return { count, message: \`\${count} event silindi.\` };
    },

    // --- LOCATION MUTATIONS ---
    addLocation: (_, { data }) => {
      const newLocation = { id: nanoid(), ...data };
      locations.push(newLocation);
      return newLocation;
    },
    updateLocation: (_, { id, data }) => {
      const index = locations.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Location not found');
      locations[index] = { ...locations[index], ...data };
      return locations[index];
    },
    deleteLocation: (_, { id }) => {
      const index = locations.findIndex((l) => l.id === id);
      if (index === -1) throw new Error('Location not found');
      const [deleted] = locations.splice(index, 1);
      return deleted;
    },
    deleteAllLocations: () => {
      const count = locations.length;
      locations.splice(0, locations.length);
      return { count, message: \`\${count} location silindi.\` };
    },

    // --- PARTICIPANT MUTATIONS ---
    addParticipant: (_, { data }) => {
      const newParticipant = { id: nanoid(), ...data };
      participants.push(newParticipant);
      return newParticipant;
    },
    updateParticipant: (_, { id, data }) => {
      const index = participants.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Participant not found');
      participants[index] = { ...participants[index], ...data };
      return participants[index];
    },
    deleteParticipant: (_, { id }) => {
      const index = participants.findIndex((p) => p.id === id);
      if (index === -1) throw new Error('Participant not found');
      const [deleted] = participants.splice(index, 1);
      return deleted;
    },
    deleteAllParticipants: () => {
      const count = participants.length;
      participants.splice(0, participants.length);
      return { count, message: \`\${count} participant silindi.\` };
    },
  },
};
`
  },
  {
    name: 'index.js',
    language: 'javascript',
    description: 'Apollo Server 4 / Yoga Giriş Dosyası',
    code: `/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Apollo Server Başlatıcı
 */
import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone';
import { readFileSync } from 'fs';
import { resolvers } from './resolvers.js';

const typeDefs = readFileSync('./schema.graphql', { encoding: 'utf-8' });

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 },
});

console.log(\`🚀 Enes Öztürk - GraphQL Server hazır: \${url}\`);
`
  }
];
