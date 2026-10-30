export interface QueryPreset {
  id: string;
  name: string;
  category: 'Ödev Zorunlu' | 'İlişkisel Sorgular' | 'Türkçe Sorgular' | 'İmza & Bilgi' | 'Mutasyonlar';
  description: string;
  query: string;
  variables?: string;
  highlight?: boolean;
}

export const QUERY_PRESETS: QueryPreset[] = [
  {
    id: 'odev-olaylar-full',
    name: '🎯 Ödev Ana Sorgusu (events with relations)',
    category: 'Ödev Zorunlu',
    highlight: true,
    description: 'Ödev metninde özellikle istenen: id, title, user { id, username }, participants { id, username }, location { id, name }',
    query: `query EventsWithRelations {
  events {
    id
    title
    user {
      id
      username
    }
    participants {
      id
      username
    }
    location {
      id
      name
    }
  }
}`,
  },
  {
    id: 'odev-turkce-olaylar',
    name: '🇹🇷 Ödev Türkçe Sözdizimi (sorgu olayları)',
    category: 'Türkçe Sorgular',
    highlight: true,
    description: 'Ödev Türkçe metninde yazılan sözdizimi: olaylar, baslik, kullanici, katilimcilar, konum ve isim alanları',
    query: `query SorguOlaylari {
  olaylar {
    id
    baslik
    user: kullanici {
      id
      kullanici_adi
    }
    pariticipants: katilimcilar {
      id
      kullanici_adi
    }
    konum {
      id
      isim
    }
  }
}`,
  },
  {
    id: 'users-all',
    name: 'query users {}',
    category: 'Ödev Zorunlu',
    description: 'Tüm kullanıcıları listeler. Her kullanıcının düzenlediği etkinlikleri de içerir.',
    query: `query GetAllUsers {
  users {
    id
    username
    email
    fullName
    events {
      id
      title
      date
    }
  }
}`,
  },
  {
    id: 'user-by-id',
    name: 'query user(id: 1) {}',
    category: 'Ödev Zorunlu',
    description: 'ID bazlı tekil kullanıcı kaydı ve o kullanıcının tüm etkinlikleri.',
    query: `query GetUserById {
  user(id: 1) {
    id
    username
    email
    fullName
    events {
      id
      title
      date
      location {
        name
      }
    }
  }
}`,
  },
  {
    id: 'events-all',
    name: 'query events {}',
    category: 'Ödev Zorunlu',
    description: 'Tüm etkinlikleri listeler. İlişkili User, Location ve Katılımcılarla birlikte.',
    query: `query GetAllEvents {
  events {
    id
    title
    desc
    date
    from
    to
    user {
      id
      username
      email
    }
    location {
      id
      name
      address
    }
    participants {
      id
      username
    }
  }
}`,
  },
  {
    id: 'event-by-id',
    name: 'query event(id: 1) {}',
    category: 'Ödev Zorunlu',
    description: 'ID bazlı tekil etkinlik kaydı ve tüm ilişkileri (sahibi, konumu, katılımcıları).',
    query: `query GetEventById {
  event(id: 1) {
    id
    title
    desc
    date
    from
    to
    user {
      id
      username
      email
    }
    location {
      id
      name
      address
      lat
      lng
    }
    participants {
      id
      user_id
      username
      user {
        fullName
        email
      }
    }
  }
}`,
  },
  {
    id: 'locations-all',
    name: 'query locations {}',
    category: 'Ödev Zorunlu',
    description: 'Tüm lokasyonları ve bu lokasyonlarda gerçekleşecek etkinlikleri listeler.',
    query: `query GetAllLocations {
  locations {
    id
    name
    desc
    address
    lat
    lng
    events {
      id
      title
      date
    }
  }
}`,
  },
  {
    id: 'location-by-id',
    name: 'query location(id: 1) {}',
    category: 'Ödev Zorunlu',
    description: 'ID bazlı tekil konum kaydı ve orada düzenlenen etkinlikler.',
    query: `query GetLocationById {
  location(id: 1) {
    id
    name
    desc
    address
    lat
    lng
    events {
      id
      title
      date
      user {
        username
      }
    }
  }
}`,
  },
  {
    id: 'participants-all',
    name: 'query participants {}',
    category: 'Ödev Zorunlu',
    description: 'Tüm katılımcı kayıtlarını ve ilişkili kullanıcı ile etkinlik detaylarını getirir.',
    query: `query GetAllParticipants {
  participants {
    id
    user_id
    event_id
    username
    user {
      fullName
      email
    }
    event {
      id
      title
      date
    }
  }
}`,
  },
  {
    id: 'participant-by-id',
    name: 'query participant(id: 1) {}',
    category: 'Ödev Zorunlu',
    description: 'ID bazlı tekil katılımcı kaydı ve bağlı olduğu User & Event nesneleri.',
    query: `query GetParticipantById {
  participant(id: 1) {
    id
    user_id
    event_id
    username
    user {
      id
      username
      email
    }
    event {
      id
      title
      date
      location {
        name
      }
    }
  }
}`,
  },
  {
    id: 'signature-check',
    name: '✍️ Enes Öztürk İmzası & Sunucu Meta',
    category: 'İmza & Bilgi',
    highlight: true,
    description: 'Ödev sahibi Enes Öztürk imzasını ve sunucu sürüm bilgilerini getiren sorgu.',
    query: `query EnesOzturkSignature {
  signature {
    author
    assignment
    version
    description
  }
  user(id: 1) {
    id
    username
    fullName
    email
  }
}`,
  },
  {
    id: 'deep-nested',
    name: '⚡ Derin İlişkisel Sorgu (3 Seviye Zincir)',
    category: 'İlişkisel Sorgular',
    description: 'Kullanıcı -> Etkinlikler -> Katılımcılar -> Kullanıcı Bilgisi zincirini doğrular.',
    query: `query DeepRelationalChain {
  user(id: 1) {
    username
    events {
      title
      date
      location {
        name
        address
      }
      participants {
        user {
          username
          email
        }
      }
    }
  }
}`,
  },
  {
    id: 'mutation-add-event',
    name: '➕ Yeni Etkinlik Oluştur (Mutation)',
    category: 'Mutasyonlar',
    description: 'Veri setine GraphQL Mutation ile yeni bir etkinlik ekler.',
    query: `mutation CreateNewEvent($data: EventInput!) {
  createEvent(data: $data) {
    id
    title
    date
    user {
      username
    }
    location {
      name
    }
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          title: "İleri Düzey GraphQL & Apollo Federasyonu",
          desc: "Mikroservisler için Birleşik GraphQL Şemaları",
          date: "2026-12-30",
          from: "10:00",
          to: "18:00",
          location_id: "1",
          user_id: "1",
        },
      },
      null,
      2
    ),
  },
];
