export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  avatarColor: string;
}

export interface Location {
  id: string;
  name: string;
  desc: string;
  lat: number;
  lng: number;
  address?: string;
}

export interface Participant {
  id: string;
  user_id: string;
  event_id: string;
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

export const initialUsers: User[] = [
  {
    id: '1',
    username: 'enes_ozturk',
    email: 'enes.ozturk@patika.dev',
    role: 'Senior Frontend Developer & Proje Sahibi',
    avatarColor: 'bg-emerald-600',
  },
  {
    id: '2',
    username: 'mehmet_seven',
    email: 'mehmet.seven@kodluyoruz.org',
    role: 'GraphQL Architect & Mentor',
    avatarColor: 'bg-indigo-600',
  },
  {
    id: '3',
    username: 'ayse_kaya',
    email: 'ayse.kaya@techhub.com',
    role: 'DevRel & Community Lead',
    avatarColor: 'bg-purple-600',
  },
  {
    id: '4',
    username: 'can_demir',
    email: 'can.demir@openlabs.io',
    role: 'Cloud & DevOps Engineer',
    avatarColor: 'bg-amber-600',
  },
  {
    id: '5',
    username: 'zeynep_yilmaz',
    email: 'zeynep.yilmaz@devstudio.com',
    role: 'Lead UI/UX Designer',
    avatarColor: 'bg-rose-600',
  },
  {
    id: '6',
    username: 'burak_arslan',
    email: 'burak.arslan@codebase.tr',
    role: 'Fullstack TypeScript Specialist',
    avatarColor: 'bg-sky-600',
  },
];

export const initialLocations: Location[] = [
  {
    id: '1',
    name: 'Kolektif House Levent',
    desc: 'Açık ofis, amfi sunum salonu ve networking alanı, metroya 2 dakika yürüme mesafesinde.',
    lat: 41.0805,
    lng: 29.0112,
    address: 'Esentepe Mah. Talatpaşa Cad. No:5 Şişli / İstanbul',
  },
  {
    id: '2',
    name: 'İTÜ Çekirdek İnovasyon Merkezi',
    desc: 'Teknokent ARI 3 Binası, Girişimcilik ve Teknoloji Konferans Salonu.',
    lat: 41.1082,
    lng: 29.0238,
    address: 'Reşitpaşa Mah. Katar Cad. İTÜ Ayazağa Kampüsü Maslak / İstanbul',
  },
  {
    id: '3',
    name: 'Habita Coworking Space',
    desc: 'Sanayi Mahallesi, endüstriyel mimaride ferah etkinlik atölyesi ve sunum alanı.',
    lat: 41.0967,
    lng: 29.0064,
    address: 'Sanayi Mah. İnönü Cad. No:13 Kağıthane / İstanbul',
  },
  {
    id: '4',
    name: 'Kadıköy Tasarım Atölyesi (TAK)',
    desc: 'Moda Caddesi, tarihi atölye binası, interaktif workshop salonu ve kütüphane.',
    lat: 40.9882,
    lng: 29.0275,
    address: 'Caferağa Mah. Rasimpaşa Sok. No:8 Kadıköy / İstanbul',
  },
];

export const initialEvents: Event[] = [
  {
    id: '1',
    title: 'React & Apollo Client ile GraphQL Workshop',
    desc: 'GraphQL şema tasarımı, Apollo Client önbellek optimizasyonu, useQuery ve useMutation hook pratikleri ile gerçek zamanlı veri akışı.',
    date: '2026-11-15',
    from: '14:00',
    to: '17:30',
    location_id: '1',
    user_id: '1',
  },
  {
    id: '2',
    title: 'Frontend Mimari ve Web Performance Zirvesi',
    desc: 'Büyük ölçekli web uygulamalarında Core Web Vitals iyileştirmeleri, Tree-Shaking, SSR ve Bundle analiz yöntemleri üzerine derinlemesine oturumlar.',
    date: '2026-11-20',
    from: '10:00',
    to: '16:00',
    location_id: '2',
    user_id: '2',
  },
  {
    id: '3',
    title: 'Modern API Tasarımı: REST vs GraphQL Karşılaştırması',
    desc: 'Over-fetching ve under-fetching sorunlarını çözmek, mikroservis mimarisinde GraphQL Gateway kurulumu ve federation yöntemleri.',
    date: '2026-11-28',
    from: '18:30',
    to: '21:00',
    location_id: '3',
    user_id: '1',
  },
  {
    id: '4',
    title: 'İstanbul Açık Kaynak Topluluk Hackathonu',
    desc: 'Geliştiricilerin açık kaynak projelere katkı sağlaması için 24 saatlik kesintisiz geliştirme maratonu, mentorluk ve ödül töreni.',
    date: '2026-12-05',
    from: '09:00',
    to: '22:00',
    location_id: '4',
    user_id: '3',
  },
  {
    id: '5',
    title: 'TypeScript ile Tip Güvenli Veri Akışı ve Schema Doğrulama',
    desc: 'GraphQL Code Generator entegrasyonu, Zod ve TypeScript generics ile derleme anında hata yakalama ve güvenli state yönetimi.',
    date: '2026-12-12',
    from: '13:30',
    to: '16:30',
    location_id: '1',
    user_id: '4',
  },
];

export const initialParticipants: Participant[] = [
  { id: '1', user_id: '2', event_id: '1' },
  { id: '2', user_id: '3', event_id: '1' },
  { id: '3', user_id: '5', event_id: '1' },
  { id: '4', user_id: '6', event_id: '1' },
  { id: '5', user_id: '1', event_id: '2' },
  { id: '6', user_id: '4', event_id: '2' },
  { id: '7', user_id: '5', event_id: '2' },
  { id: '8', user_id: '2', event_id: '3' },
  { id: '9', user_id: '3', event_id: '3' },
  { id: '10', user_id: '6', event_id: '3' },
  { id: '11', user_id: '1', event_id: '4' },
  { id: '12', user_id: '2', event_id: '4' },
  { id: '13', user_id: '5', event_id: '4' },
  { id: '14', user_id: '3', event_id: '5' },
  { id: '15', user_id: '6', event_id: '5' },
];
