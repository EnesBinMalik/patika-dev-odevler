/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Schema Definition Language (SDL)
 */

export const typeDefs = `#graphql
"""
Hazırlayan: Enes Öztürk
GraphQL Ödev 2 - Event Management Schema
User, Event, Location ve Participant CRUD & Toplu Silme Mutationları
"""

# ----------------- TYPES -----------------

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

# ----------------- INPUTS -----------------

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

# ----------------- ROOT TYPES -----------------

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
  # --- USER MUTATIONS ---
  addUser(data: AddUserInput, username: String, email: String): User!
  updateUser(id: ID!, data: UpdateUserInput, username: String, email: String): User!
  deleteUser(id: ID!): User!
  deleteAllUsers: DeleteAllOutput!

  # --- EVENT MUTATIONS ---
  addEvent(
    data: AddEventInput
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  ): Event!
  updateEvent(
    id: ID!
    data: UpdateEventInput
    title: String
    desc: String
    date: String
    from: String
    to: String
    location_id: ID
    user_id: ID
  ): Event!
  deleteEvent(id: ID!): Event!
  deleteAllEvents: DeleteAllOutput!

  # --- LOCATION MUTATIONS ---
  addLocation(
    data: AddLocationInput
    name: String
    desc: String
    lat: Float
    lng: Float
  ): Location!
  updateLocation(
    id: ID!
    data: UpdateLocationInput
    name: String
    desc: String
    lat: Float
    lng: Float
  ): Location!
  deleteLocation(id: ID!): Location!
  deleteAllLocations: DeleteAllOutput!

  # --- PARTICIPANT MUTATIONS ---
  addParticipant(
    data: AddParticipantInput
    user_id: ID
    event_id: ID
  ): Participant!
  updateParticipant(
    id: ID!
    data: UpdateParticipantInput
    user_id: ID
    event_id: ID
  ): Participant!
  deleteParticipant(id: ID!): Participant!
  deleteAllParticipants: DeleteAllOutput!
}
`;
