/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Initial Seed Data
 */
import { User, Location, Event, Participant } from './types';

export const initialUsers: User[] = [
  {
    id: "1",
    username: "enes_ozturk",
    email: "enes.ozturk@example.com"
  },
  {
    id: "2",
    username: "ahmet_yilmaz",
    email: "ahmet.yilmaz@example.com"
  },
  {
    id: "3",
    username: "zeynep_kaya",
    email: "zeynep.kaya@example.com"
  },
  {
    id: "4",
    username: "can_demir",
    email: "can.demir@example.com"
  },
  {
    id: "5",
    username: "elif_sahin",
    email: "elif.sahin@example.com"
  }
];

export const initialLocations: Location[] = [
  {
    id: "1",
    name: "Maslak Kongre Merkezi",
    desc: "İstanbul Maslak teknoloji ve bilişim zirveleri merkezi",
    lat: 41.1105,
    lng: 29.0212
  },
  {
    id: "2",
    name: "Kolektif House Levent",
    desc: "Yazılımcılar ve girişimciler için ortak çalışma & etkinlik alanı",
    lat: 41.0825,
    lng: 29.0118
  },
  {
    id: "3",
    name: "ODTÜ Teknokent Konferans Salonu",
    desc: "Ankara teknoloji ve inovasyon merkezi amfisi",
    lat: 39.8897,
    lng: 32.7794
  },
  {
    id: "4",
    name: "İzmir Mimarlık Merkezi",
    desc: "Alsancak tasarım ve atölye etkinlik alanı",
    lat: 38.4382,
    lng: 27.1428
  }
];

export const initialEvents: Event[] = [
  {
    id: "1",
    title: "GraphQL & React Modern Zirvesi 2026",
    desc: "GraphQL Schema, Resolvers ve gerçek zamanlı Subscription mimarileri üzerine derinlemesine atölye.",
    date: "2026-11-15",
    from: "10:00",
    to: "17:00",
    location_id: "1",
    user_id: "1"
  },
  {
    id: "2",
    title: "Node.js & Microservices Meetup",
    desc: "Ölçeklenebilir mikroservisler ve Apollo Federation entegrasyonu.",
    date: "2026-11-22",
    from: "14:00",
    to: "18:30",
    location_id: "2",
    user_id: "2"
  },
  {
    id: "3",
    title: "TypeScript ile Tip Güvenli API Geliştirme",
    desc: "Codegen, GraphQL Code Generator ve uçtan uca tip güvenliği.",
    date: "2026-12-05",
    from: "13:00",
    to: "16:00",
    location_id: "3",
    user_id: "3"
  }
];

export const initialParticipants: Participant[] = [
  {
    id: "1",
    user_id: "1",
    event_id: "1"
  },
  {
    id: "2",
    user_id: "2",
    event_id: "1"
  },
  {
    id: "3",
    user_id: "3",
    event_id: "1"
  },
  {
    id: "4",
    user_id: "4",
    event_id: "2"
  },
  {
    id: "5",
    user_id: "5",
    event_id: "3"
  }
];
