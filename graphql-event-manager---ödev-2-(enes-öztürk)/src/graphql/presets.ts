/**
 * @author Enes Öztürk
 * @assignment GraphQL Ödev 2 - Operation Presets
 */

export interface PresetOperation {
  id: string;
  name: string;
  category: 'User' | 'Event' | 'Location' | 'Participant' | 'Query';
  description: string;
  query: string;
  variables?: string;
  defaultIdProvider?: () => string;
}

export const presets: PresetOperation[] = [
  // ==================== USER MUTATIONS ====================
  {
    id: 'add-user',
    name: 'mutation addUser',
    category: 'User',
    description: 'Yeni bir User kaydı oluşturur.',
    query: `mutation addUser($data: AddUserInput!) {
  addUser(data: $data) {
    id
    username
    email
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          username: "enes_ozturk_dev",
          email: "enes.ozturk.dev@example.com"
        }
      },
      null,
      2
    )
  },
  {
    id: 'update-user',
    name: 'mutation updateUser',
    category: 'User',
    description: 'Belirtilen ID\'ye sahip User bilgilerini günceller.',
    query: `mutation updateUser($id: ID!, $data: UpdateUserInput!) {
  updateUser(id: $id, data: $data) {
    id
    username
    email
  }
}`,
    variables: JSON.stringify(
      {
        id: "1",
        data: {
          username: "enes_ozturk_updated",
          email: "enes.updated@example.com"
        }
      },
      null,
      2
    )
  },
  {
    id: 'delete-user',
    name: 'mutation deleteUser',
    category: 'User',
    description: 'Belirtilen ID\'ye sahip User kaydını siler.',
    query: `mutation deleteUser($id: ID!) {
  deleteUser(id: $id) {
    id
    username
    email
  }
}`,
    variables: JSON.stringify(
      {
        id: "5"
      },
      null,
      2
    )
  },
  {
    id: 'delete-all-users',
    name: 'mutation deleteAllUsers',
    category: 'User',
    description: 'Tüm User kayıtlarını ve ilişkili katılımları siler.',
    query: `mutation deleteAllUsers {
  deleteAllUsers {
    count
    message
  }
}`,
    variables: '{}'
  },

  // ==================== EVENT MUTATIONS ====================
  {
    id: 'add-event',
    name: 'mutation addEvent',
    category: 'Event',
    description: 'Yeni bir Event (etkinlik) oluşturur ve User/Location ile bağlar.',
    query: `mutation addEvent($data: AddEventInput!) {
  addEvent(data: $data) {
    id
    title
    desc
    date
    from
    to
    user {
      id
      username
    }
    location {
      id
      name
    }
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          title: "İleri Seviye GraphQL & Apollo Eğitimi",
          desc: "Enes Öztürk önderliğinde GraphQL Mutations & Subscriptions derinlemesine inceleme.",
          date: "2026-12-10",
          from: "11:00",
          to: "15:30",
          location_id: "1",
          user_id: "1"
        }
      },
      null,
      2
    )
  },
  {
    id: 'update-event',
    name: 'mutation updateEvent',
    category: 'Event',
    description: 'Mevcut bir Event\'in detaylarını, saatini veya konumunu günceller.',
    query: `mutation updateEvent($id: ID!, $data: UpdateEventInput!) {
  updateEvent(id: $id, data: $data) {
    id
    title
    desc
    date
    from
    to
  }
}`,
    variables: JSON.stringify(
      {
        id: "1",
        data: {
          title: "GraphQL & React Modern Zirvesi [GÜNCELLENDİ]",
          desc: "Tüm katılımcılar için yeni saat ve güncellenmiş atölye içeriği."
        }
      },
      null,
      2
    )
  },
  {
    id: 'delete-event',
    name: 'mutation deleteEvent',
    category: 'Event',
    description: 'Belirtilen ID\'ye sahip Event\'i ve katılımcı kayıtlarını siler.',
    query: `mutation deleteEvent($id: ID!) {
  deleteEvent(id: $id) {
    id
    title
    desc
  }
}`,
    variables: JSON.stringify(
      {
        id: "3"
      },
      null,
      2
    )
  },
  {
    id: 'delete-all-events',
    name: 'mutation deleteAllEvents',
    category: 'Event',
    description: 'Tüm Event kayıtlarını siler.',
    query: `mutation deleteAllEvents {
  deleteAllEvents {
    count
    message
  }
}`,
    variables: '{}'
  },

  // ==================== LOCATION MUTATIONS ====================
  {
    id: 'add-location',
    name: 'mutation addLocation',
    category: 'Location',
    description: 'Yeni bir Location (etkinlik mekanı/lokasyonu) ekler.',
    query: `mutation addLocation($data: AddLocationInput!) {
  addLocation(data: $data) {
    id
    name
    desc
    lat
    lng
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          name: "Bilişim Vadisi Gebze Konferans Amfisi",
          desc: "Yapay zeka ve yazılım geliştirici kongre merkezi",
          lat: 40.8091,
          lng: 29.3564
        }
      },
      null,
      2
    )
  },
  {
    id: 'update-location',
    name: 'mutation updateLocation',
    category: 'Location',
    description: 'Mevcut bir Location kaydını günceller.',
    query: `mutation updateLocation($id: ID!, $data: UpdateLocationInput!) {
  updateLocation(id: $id, data: $data) {
    id
    name
    desc
    lat
    lng
  }
}`,
    variables: JSON.stringify(
      {
        id: "1",
        data: {
          name: "Maslak Kongre Merkezi [Yenilendi]",
          desc: "Genişletilmiş yüksek kapasiteli teknoloji salonu"
        }
      },
      null,
      2
    )
  },
  {
    id: 'delete-location',
    name: 'mutation deleteLocation',
    category: 'Location',
    description: 'Belirtilen ID\'ye sahip Location kaydını siler.',
    query: `mutation deleteLocation($id: ID!) {
  deleteLocation(id: $id) {
    id
    name
    desc
  }
}`,
    variables: JSON.stringify(
      {
        id: "4"
      },
      null,
      2
    )
  },
  {
    id: 'delete-all-locations',
    name: 'mutation deleteAllLocations',
    category: 'Location',
    description: 'Tüm Location kayıtlarını siler.',
    query: `mutation deleteAllLocations {
  deleteAllLocations {
    count
    message
  }
}`,
    variables: '{}'
  },

  // ==================== PARTICIPANT MUTATIONS ====================
  {
    id: 'add-participant',
    name: 'mutation addParticipant',
    category: 'Participant',
    description: 'Bir kullanıcının bir etkinliğe katılımını (Participant) kaydeder.',
    query: `mutation addParticipant($data: AddParticipantInput!) {
  addParticipant(data: $data) {
    id
    user {
      id
      username
    }
    event {
      id
      title
    }
  }
}`,
    variables: JSON.stringify(
      {
        data: {
          user_id: "4",
          event_id: "1"
        }
      },
      null,
      2
    )
  },
  {
    id: 'update-participant',
    name: 'mutation updateParticipant',
    category: 'Participant',
    description: 'Mevcut bir katılım kaydının kullanıcı veya etkinlik bağını günceller.',
    query: `mutation updateParticipant($id: ID!, $data: UpdateParticipantInput!) {
  updateParticipant(id: $id, data: $data) {
    id
    user_id
    event_id
    user {
      username
    }
    event {
      title
    }
  }
}`,
    variables: JSON.stringify(
      {
        id: "1",
        data: {
          event_id: "2"
        }
      },
      null,
      2
    )
  },
  {
    id: 'delete-participant',
    name: 'mutation deleteParticipant',
    category: 'Participant',
    description: 'Belirtilen ID\'ye sahip Participant kaydını siler.',
    query: `mutation deleteParticipant($id: ID!) {
  deleteParticipant(id: $id) {
    id
    user_id
    event_id
  }
}`,
    variables: JSON.stringify(
      {
        id: "5"
      },
      null,
      2
    )
  },
  {
    id: 'delete-all-participants',
    name: 'mutation deleteAllParticipants',
    category: 'Participant',
    description: 'Tüm Participant kayıtlarını siler.',
    query: `mutation deleteAllParticipants {
  deleteAllParticipants {
    count
    message
  }
}`,
    variables: '{}'
  },

  // ==================== QUERY INSPECTION ====================
  {
    id: 'query-all-data',
    name: 'query getAllData',
    category: 'Query',
    description: 'Tüm kullanıcıları, etkinlikleri, mekanları ve katılımları ilişkileriyle birlikte listeler.',
    query: `query getAllData {
  users {
    id
    username
    email
    events {
      id
      title
    }
  }
  events {
    id
    title
    date
    from
    to
    user {
      username
      email
    }
    location {
      name
      desc
    }
    participants {
      id
      user {
        username
      }
    }
  }
  locations {
    id
    name
    events {
      id
      title
    }
  }
  participants {
    id
    user {
      username
    }
    event {
      title
    }
  }
}`,
    variables: '{}'
  }
];
