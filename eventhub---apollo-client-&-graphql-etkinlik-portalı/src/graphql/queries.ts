import { gql } from '@apollo/client';

/**
 * Anasayfa için Etkinlik Listesi Sorgusu (Ödev 4 Gereksinimi):
 * Etkinlik adı, açıklaması ve zamanı
 */
export const GET_EVENTS = gql`
  query GetEvents {
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
        role
        avatarColor
      }
      location {
        id
        name
        desc
      }
      participants {
        id
        user {
          id
          username
          avatarColor
        }
      }
    }
  }
`;

/**
 * Etkinlik Detay Sorgusu (Ödev 4 Gereksinimi):
 * Etkinlik detayına gidildiğinde etkinlik sahibi, konum ve katılımcılar görüntülenir
 */
export const GET_EVENT = gql`
  query GetEvent($id: ID!) {
    event(id: $id) {
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
        role
        avatarColor
      }
      location {
        id
        name
        desc
        lat
        lng
        address
      }
      participants {
        id
        user {
          id
          username
          email
          role
          avatarColor
        }
      }
    }
  }
`;

/**
 * Form alanları için Kullanıcılar ve Lokasyonlar
 */
export const GET_METADATA_FOR_NEW_EVENT = gql`
  query GetMetadataForNewEvent {
    users {
      id
      username
      email
      role
    }
    locations {
      id
      name
      address
    }
  }
`;

/**
 * Yeni Etkinlik Ekleme Mutasyonu
 */
export const ADD_EVENT = gql`
  mutation AddEvent($data: AddEventInput!) {
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
  }
`;

/**
 * Etkinliğe Katılma Mutasyonu
 */
export const ADD_PARTICIPANT = gql`
  mutation AddParticipant($data: AddParticipantInput!) {
    addParticipant(data: $data) {
      id
      user_id
      event_id
      user {
        id
        username
        email
        role
      }
    }
  }
`;

/**
 * Etkinlik Silme Mutasyonu
 */
export const DELETE_EVENT = gql`
  mutation DeleteEvent($id: ID!) {
    deleteEvent(id: $id) {
      id
      title
    }
  }
`;
