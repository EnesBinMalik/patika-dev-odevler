/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * Executable GraphQL Schema Definition & Resolvers
 */

import { makeExecutableSchema } from '@graphql-tools/schema';
import { db } from './database.ts';
import { pubsub, withFilter } from './pubsub.ts';
import { SUBSCRIPTION_EVENTS } from './types.ts';

export const typeDefs = /* GraphQL */ `
  type User {
    id: ID!
    name: String!
    email: String!
    events: [Event!]!
    participations: [Participant!]!
  }

  type Location {
    id: ID!
    name: String!
    desc: String!
    lat: Float
    lng: Float
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
    location: Location
    user_id: ID!
    user: User!
    participants: [Participant!]!
  }

  input CreateUserInput {
    name: String!
    email: String!
  }

  input CreateEventInput {
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
    createUser(data: CreateUserInput!): User!
    createEvent(data: CreateEventInput!): Event!
    addParticipant(data: AddParticipantInput!): Participant!
    deleteUser(id: ID!): Boolean!
    deleteEvent(id: ID!): Boolean!
    deleteParticipant(id: ID!): Boolean!
    resetData: Boolean!
  }

  type Subscription {
    userCreated: User!
    eventCreated: Event!
    participantAdded(event_id: ID): Participant!
  }
`;

export const resolvers = {
  Query: {
    users: () => db.getUsers(),
    user: (_: any, { id }: { id: string }) => db.getUser(id),
    events: () => db.getEvents(),
    event: (_: any, { id }: { id: string }) => db.getEvent(id),
    locations: () => db.getLocations(),
    location: (_: any, { id }: { id: string }) => db.getLocation(id),
    participants: () => db.getParticipants(),
    participant: (_: any, { id }: { id: string }) => db.getParticipant(id),
  },

  User: {
    events: (parent: { id: string }) => db.getUserEvents(parent.id),
    participations: (parent: { id: string }) => db.getUserParticipations(parent.id),
  },

  Location: {
    // fields match directly
  },

  Event: {
    location: (parent: { location_id: string }) => db.getLocation(parent.location_id),
    user: (parent: { user_id: string }) => db.getUser(parent.user_id),
    participants: (parent: { id: string }) => db.getEventParticipants(parent.id),
  },

  Participant: {
    user: (parent: { user_id: string }) => db.getUser(parent.user_id),
    event: (parent: { event_id: string }) => db.getEvent(parent.event_id),
  },

  Mutation: {
    createUser: (_: any, { data }: { data: { name: string; email: string } }) => {
      return db.createUser(data);
    },
    createEvent: (
      _: any,
      {
        data,
      }: {
        data: {
          title: string;
          desc: string;
          date: string;
          from: string;
          to: string;
          location_id: string;
          user_id: string;
        };
      }
    ) => {
      return db.createEvent(data);
    },
    addParticipant: (
      _: any,
      { data }: { data: { user_id: string; event_id: string } }
    ) => {
      return db.addParticipant(data);
    },
    deleteUser: (_: any, { id }: { id: string }) => db.deleteUser(id),
    deleteEvent: (_: any, { id }: { id: string }) => db.deleteEvent(id),
    deleteParticipant: (_: any, { id }: { id: string }) => db.deleteParticipant(id),
    resetData: () => db.reset(),
  },

  Subscription: {
    userCreated: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.USER_CREATED),
    },
    eventCreated: {
      subscribe: () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.EVENT_CREATED),
    },
    participantAdded: {
      subscribe: withFilter(
        () => pubsub.asyncIterator(SUBSCRIPTION_EVENTS.PARTICIPANT_ADDED),
        (payload: any, variables: { event_id?: string }) => {
          // If no specific event_id is requested, stream all participant additions
          if (!variables || !variables.event_id) {
            return true;
          }
          // Filter by event_id
          return String(payload.participantAdded.event_id) === String(variables.event_id);
        }
      ),
    },
  },
};

export const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});
