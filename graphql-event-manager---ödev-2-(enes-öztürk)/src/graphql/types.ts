/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Type Definitions
 */

export interface User {
  id: string;
  username: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
}

export interface Event {
  id: string;
  title: string;
  desc: string;
  date: string;
  from: string;
  to: string;
  location_id: string;
  user_id: string;
}

export interface Participant {
  id: string;
  user_id: string;
  event_id: string;
}

export interface DeleteAllOutput {
  count: number;
  message?: string;
}

export interface AddUserInput {
  username: string;
  email: string;
}

export interface UpdateUserInput {
  username?: string;
  email?: string;
}

export interface AddLocationInput {
  name: string;
  desc: string;
  lat: number;
  lng: number;
}

export interface UpdateLocationInput {
  name?: string;
  desc?: string;
  lat?: number;
  lng?: number;
}

export interface AddEventInput {
  title: string;
  desc: string;
  date: string;
  from: string;
  to: string;
  location_id: string;
  user_id: string;
}

export interface UpdateEventInput {
  title?: string;
  desc?: string;
  date?: string;
  from?: string;
  to?: string;
  location_id?: string;
  user_id?: string;
}

export interface AddParticipantInput {
  user_id: string;
  event_id: string;
}

export interface UpdateParticipantInput {
  user_id?: string;
  event_id?: string;
}
