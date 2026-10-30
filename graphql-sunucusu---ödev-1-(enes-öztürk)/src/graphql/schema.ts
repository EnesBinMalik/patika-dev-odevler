import { buildSchema, graphql } from 'graphql';
import initialData from './data.json';

// In-memory relational database state
let db = JSON.parse(JSON.stringify(initialData));

export const resetDatabase = () => {
  db = JSON.parse(JSON.stringify(initialData));
  return true;
};

export const getDatabase = () => db;

export const schemaSDL = `
  """
  Kullanıcı modeli (User)
  Bir User'a ait bir veya birden fazla Event olabilir.
  """
  type User {
    id: ID!
    username: String!
    email: String!
    fullName: String
    avatar: String
    events: [Event!]!

    # Türkçe takma adlar
    kullanici_adi: String!
    eposta: String!
    etkinlikler: [Event!]!
  }

  """
  Konum modeli (Location)
  Bir Event, bir Location ile ilişkili olmalıdır.
  """
  type Location {
    id: ID!
    name: String!
    desc: String
    address: String
    lat: Float
    lng: Float
    events: [Event!]!

    # Türkçe takma adlar
    isim: String!
    aciklama: String
    etkinlikler: [Event!]!
  }

  """
  Katılımcı modeli (Participant)
  Bir Event birden fazla Participant ile ilişkili olmalıdır.
  """
  type Participant {
    id: ID!
    user_id: ID!
    event_id: ID!
    user: User!
    event: Event!
    username: String!

    # Türkçe takma adlar
    kullanici_adi: String!
    kullanici: User!
    etkinlik: Event!
  }

  """
  Etkinlik modeli (Event)
  Bir Event, bir User ile ilişkili olmalıdır.
  Bir Event, bir Location ile ilişkili olmalıdır.
  Bir Event birden fazla Participant ile ilişkili olmalıdır.
  """
  type Event {
    id: ID!
    title: String!
    desc: String
    date: String!
    from: String
    to: String
    location_id: ID!
    user_id: ID!
    user: User!
    location: Location!
    participants: [Participant!]!

    # Türkçe alanlar ve ödev sorgusu varyantları
    baslik: String!
    aciklama: String
    tarih: String!
    baslangic: String
    bitis: String
    konum_id: ID!
    kullanici_id: ID!
    kullanici: User!
    konum: Location!
    katilimcilar: [Participant!]!
    pariticipants: [Participant!]!
  }

  """
  Ödev İmzası & Bilgileri
  """
  type Signature {
    author: String!
    assignment: String!
    version: String!
    description: String!
  }

  """
  Kök Sorgular (Queries)
  Tüm tipler üzerinde tümünü listeleme ve id bazlı tekil kayıt getirme
  """
  type Query {
    # 1. Kullanıcı Sorguları
    users: [User!]!
    user(id: ID!): User

    # 2. Etkinlik Sorguları
    events: [Event!]!
    event(id: ID!): Event

    # 3. Konum Sorguları
    locations: [Location!]!
    location(id: ID!): Location

    # 4. Katılımcı Sorguları
    participants: [Participant!]!
    participant(id: ID!): Participant

    # Türkçe Kök Sorgu Alternatifleri
    kullanicilar: [User!]!
    kullanici(id: ID!): User
    olaylar: [Event!]!
    olay(id: ID!): Event
    etkinlikler: [Event!]!
    etkinlik(id: ID!): Event
    konumlar: [Location!]!
    konum(id: ID!): Location
    katilimcilar: [Participant!]!
    katilimci(id: ID!): Participant

    # İmza
    signature: Signature!
    enes_ozturk: Signature!
  }

  input UserInput {
    username: String!
    email: String!
    fullName: String
    avatar: String
  }

  input EventInput {
    title: String!
    desc: String
    date: String!
    from: String
    to: String
    location_id: ID!
    user_id: ID!
  }

  input LocationInput {
    name: String!
    desc: String
    address: String
    lat: Float
    lng: Float
  }

  input ParticipantInput {
    user_id: ID!
    event_id: ID!
  }

  type Mutation {
    createUser(data: UserInput!): User!
    createEvent(data: EventInput!): Event!
    createLocation(data: LocationInput!): Location!
    createParticipant(data: ParticipantInput!): Participant!
    resetData: Boolean!
  }
`;

export const schema = buildSchema(schemaSDL);

// Type Resolvers
export class UserType {
  id: string;
  username: string;
  email: string;
  fullName?: string;
  avatar?: string;

  constructor(raw: any) {
    this.id = String(raw.id);
    this.username = raw.username;
    this.email = raw.email;
    this.fullName = raw.fullName;
    this.avatar = raw.avatar;
  }

  get kullanici_adi() {
    return this.username;
  }

  get eposta() {
    return this.email;
  }

  events() {
    return db.events
      .filter((e: any) => String(e.user_id) === String(this.id))
      .map((e: any) => new EventType(e));
  }

  get etkinlikler() {
    return this.events();
  }
}

export class LocationType {
  id: string;
  name: string;
  desc?: string;
  address?: string;
  lat?: number;
  lng?: number;

  constructor(raw: any) {
    this.id = String(raw.id);
    this.name = raw.name;
    this.desc = raw.desc;
    this.address = raw.address;
    this.lat = raw.lat;
    this.lng = raw.lng;
  }

  get isim() {
    return this.name;
  }

  get aciklama() {
    return this.desc;
  }

  events() {
    return db.events
      .filter((e: any) => String(e.location_id) === String(this.id))
      .map((e: any) => new EventType(e));
  }

  get etkinlikler() {
    return this.events();
  }
}

export class ParticipantType {
  id: string;
  user_id: string;
  event_id: string;

  constructor(raw: any) {
    this.id = String(raw.id);
    this.user_id = String(raw.user_id);
    this.event_id = String(raw.event_id);
  }

  user() {
    const u = db.users.find((user: any) => String(user.id) === String(this.user_id));
    return u ? new UserType(u) : null;
  }

  get kullanici() {
    return this.user();
  }

  event() {
    const e = db.events.find((ev: any) => String(ev.id) === String(this.event_id));
    return e ? new EventType(e) : null;
  }

  get etkinlik() {
    return this.event();
  }

  get username() {
    const u = db.users.find((user: any) => String(user.id) === String(this.user_id));
    return u?.username || 'Bilinmeyen Kullanıcı';
  }

  get kullanici_adi() {
    return this.username;
  }
}

export class EventType {
  id: string;
  title: string;
  desc?: string;
  date: string;
  from?: string;
  to?: string;
  location_id: string;
  user_id: string;

  constructor(raw: any) {
    this.id = String(raw.id);
    this.title = raw.title;
    this.desc = raw.desc;
    this.date = raw.date;
    this.from = raw.from;
    this.to = raw.to;
    this.location_id = String(raw.location_id);
    this.user_id = String(raw.user_id);
  }

  get baslik() {
    return this.title;
  }

  get aciklama() {
    return this.desc;
  }

  get tarih() {
    return this.date;
  }

  get baslangic() {
    return this.from;
  }

  get bitis() {
    return this.to;
  }

  get konum_id() {
    return this.location_id;
  }

  get kullanici_id() {
    return this.user_id;
  }

  user() {
    const u = db.users.find((user: any) => String(user.id) === String(this.user_id));
    return u ? new UserType(u) : null;
  }

  get kullanici() {
    return this.user();
  }

  location() {
    const loc = db.locations.find((l: any) => String(l.id) === String(this.location_id));
    return loc ? new LocationType(loc) : null;
  }

  get konum() {
    return this.location();
  }

  participants() {
    return db.participants
      .filter((p: any) => String(p.event_id) === String(this.id))
      .map((p: any) => new ParticipantType(p));
  }

  get katilimcilar() {
    return this.participants();
  }

  get pariticipants() {
    return this.participants();
  }
}

// Root resolver object
export const rootValue = {
  // Homework query resolvers (English)
  users: () => db.users.map((u: any) => new UserType(u)),
  user: ({ id }: { id: string | number }) => {
    const u = db.users.find((item: any) => String(item.id) === String(id));
    return u ? new UserType(u) : null;
  },

  events: () => db.events.map((e: any) => new EventType(e)),
  event: ({ id }: { id: string | number }) => {
    const e = db.events.find((item: any) => String(item.id) === String(id));
    return e ? new EventType(e) : null;
  },

  locations: () => db.locations.map((l: any) => new LocationType(l)),
  location: ({ id }: { id: string | number }) => {
    const loc = db.locations.find((item: any) => String(item.id) === String(id));
    return loc ? new LocationType(loc) : null;
  },

  participants: () => db.participants.map((p: any) => new ParticipantType(p)),
  participant: ({ id }: { id: string | number }) => {
    const p = db.participants.find((item: any) => String(item.id) === String(id));
    return p ? new ParticipantType(p) : null;
  },

  // Turkish root aliases
  kullanicilar: () => rootValue.users(),
  kullanici: (args: { id: string | number }) => rootValue.user(args),
  olaylar: () => rootValue.events(),
  olay: (args: { id: string | number }) => rootValue.event(args),
  etkinlikler: () => rootValue.events(),
  etkinlik: (args: { id: string | number }) => rootValue.event(args),
  konumlar: () => rootValue.locations(),
  konum: (args: { id: string | number }) => rootValue.location(args),
  katilimcilar: () => rootValue.participants(),
  katilimci: (args: { id: string | number }) => rootValue.participant(args),

  // Signature
  signature: () => db.signature,
  enes_ozturk: () => db.signature,

  // Mutations
  createUser: ({ data }: { data: any }) => {
    const newId = db.users.length > 0 ? Math.max(...db.users.map((u: any) => Number(u.id))) + 1 : 1;
    const newUser = { id: newId, ...data };
    db.users.push(newUser);
    return new UserType(newUser);
  },

  createEvent: ({ data }: { data: any }) => {
    const newId = db.events.length > 0 ? Math.max(...db.events.map((e: any) => Number(e.id))) + 1 : 1;
    const newEvent = { id: newId, ...data };
    db.events.push(newEvent);
    return new EventType(newEvent);
  },

  createLocation: ({ data }: { data: any }) => {
    const newId = db.locations.length > 0 ? Math.max(...db.locations.map((l: any) => Number(l.id))) + 1 : 1;
    const newLocation = { id: newId, ...data };
    db.locations.push(newLocation);
    return new LocationType(newLocation);
  },

  createParticipant: ({ data }: { data: any }) => {
    const newId = db.participants.length > 0 ? Math.max(...db.participants.map((p: any) => Number(p.id))) + 1 : 1;
    const newParticipant = { id: newId, ...data };
    db.participants.push(newParticipant);
    return new ParticipantType(newParticipant);
  },

  resetData: () => resetDatabase(),
};

/**
 * Execute a GraphQL query or mutation string against the schema
 */
export async function executeGraphQL(
  query: string,
  variables?: Record<string, any> | null,
  operationName?: string | null
): Promise<{ data?: any; errors?: readonly any[] }> {
  try {
    const result = await graphql({
      schema,
      source: query,
      rootValue,
      variableValues: variables || undefined,
      operationName: operationName || undefined,
    });
    return result;
  } catch (error: any) {
    return {
      errors: [
        {
          message: error?.message || 'Bilinmeyen GraphQL Çalıştırma Hatası',
        },
      ],
    };
  }
}
