/**
 * Enes Öztürk - Ödev 3: GraphQL Subscriptions
 * Domain Types, Event Constants and Default Seed Data
 */

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  lat?: number;
  lng?: number;
}

export interface EventItem {
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

export const SUBSCRIPTION_EVENTS = {
  USER_CREATED: 'USER_CREATED',
  EVENT_CREATED: 'EVENT_CREATED',
  PARTICIPANT_ADDED: 'PARTICIPANT_ADDED',
} as const;

export const INITIAL_LOCATIONS: Location[] = [
  {
    id: '1',
    name: 'İstanbul Kongre Merkezi (ICC)',
    desc: 'Harbiye, Şişli / İstanbul - Ana Konferans Salonu',
    lat: 41.0456,
    lng: 28.9882,
  },
  {
    id: '2',
    name: 'Kolektif House Levent',
    desc: 'Büyükdere Cad. No:199, Levent / İstanbul',
    lat: 41.0812,
    lng: 29.0113,
  },
  {
    id: '3',
    name: 'ODTÜ Teknokent Bilişim İnovasyon Merkezi',
    desc: 'Çankaya / Ankara - Amfi 1',
    lat: 39.8914,
    lng: 32.7825,
  },
];

export const INITIAL_USERS: User[] = [
  {
    id: '1',
    name: 'Enes Öztürk',
    email: 'enes@ozturk.dev',
  },
  {
    id: '2',
    name: 'Ayşe Kaya',
    email: 'ayse.kaya@example.com',
  },
  {
    id: '3',
    name: 'Mehmet Demir',
    email: 'mehmet.demir@example.com',
  },
  {
    id: '4',
    name: 'Zeynep Çelik',
    email: 'zeynep.celik@example.com',
  },
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: '1',
    title: 'GraphQL & Realtime Subscriptions Summit 2026',
    desc: 'WebSocket, PubSub ve modern dağıtık GraphQL mimarisi üzerine derinlemesine atölye.',
    date: '2026-11-15',
    from: '10:00',
    to: '17:30',
    location_id: '1',
    user_id: '1',
  },
  {
    id: '2',
    title: 'React 19 & Next-Gen Frontend Workshop',
    desc: 'React Server Components, Actions ve modern performans optimizasyonları.',
    date: '2026-11-20',
    from: '13:00',
    to: '18:00',
    location_id: '2',
    user_id: '2',
  },
];

export const INITIAL_PARTICIPANTS: Participant[] = [
  { id: '1', user_id: '2', event_id: '1' },
  { id: '2', user_id: '3', event_id: '1' },
  { id: '3', user_id: '4', event_id: '2' },
  { id: '4', user_id: '1', event_id: '2' },
];
