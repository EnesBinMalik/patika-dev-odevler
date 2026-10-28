import { User, Workout, ContactMessage, GalleryItem } from '../types';

export const INITIAL_USERS: User[] = [
  {
    id: 'u-admin',
    name: 'Enes Öztürk',
    email: 'enes@misfit.com',
    password: '123',
    role: 'admin',
    avatar: '/assets/images/trainer_burak_crossfit_1793202971371.jpg',
    bio: 'Misfit & SmartEdu sistem mimarı ve baş yönetici. El emeği ve disiplinle tasarlanmış spor ekosistemi.',
    specialty: 'Sistem Yöneticisi & Baş Koordinatör',
    phone: '+90 532 555 0100',
    joinedAt: '2025-01-10',
    enrolledWorkouts: ['w-1', 'w-2']
  },
  {
    id: 'u-trainer-1',
    name: 'Burak Kaya',
    email: 'burak@misfit.com',
    password: '123',
    role: 'trainer',
    avatar: '/assets/images/trainer_burak_crossfit_1793202971371.jpg',
    bio: '8 yıllık milli halter ve CrossFit Seviye 2 antrenörlük deneyimi ile patlayıcı kuvvet, squat ve deadlift teknikleri.',
    specialty: 'CrossFit & Olimpik Halter',
    phone: '+90 533 111 2233',
    joinedAt: '2025-02-15'
  },
  {
    id: 'u-trainer-2',
    name: 'Selin Demir',
    email: 'selin@misfit.com',
    password: '123',
    role: 'trainer',
    avatar: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    bio: 'Fizyoterapi temelli pilates eğitmeni. Duruş bozuklukları, omurga sağlığı, reformer pilates ve derin esneklik uzmanı.',
    specialty: 'Reformer Pilates & Mobilite',
    phone: '+90 535 444 7788',
    joinedAt: '2025-03-01'
  },
  {
    id: 'u-trainer-3',
    name: 'Deniz Yılmaz',
    email: 'deniz@misfit.com',
    password: '123',
    role: 'trainer',
    avatar: '/assets/images/trainer_deniz_boxing_1793202972640.jpg',
    bio: 'Eski lisanslı boksör ve fonksiyonel kardiyo antrenörü. Ring tecrübesi, ayak oyunları ve nabız yükselten HIIT seansları.',
    specialty: 'Boks & Fonksiyonel HIIT',
    phone: '+90 536 999 4422',
    joinedAt: '2025-03-12'
  },
  {
    id: 'u-member-1',
    name: 'Caner Yıldız',
    email: 'caner@gmail.com',
    password: '123',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    bio: 'Yazılımcı ve aktif CrossFit meraklısı. Haftada 4 gün antrenman yapıyor.',
    phone: '+90 541 222 3344',
    joinedAt: '2025-04-01',
    enrolledWorkouts: ['w-1', 'w-3']
  },
  {
    id: 'u-member-2',
    name: 'Zeynep Aydın',
    email: 'zeynep@gmail.com',
    password: '123',
    role: 'member',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80',
    bio: 'Pilates ve mobilite seansları ile duruşumu güçlendiriyorum.',
    phone: '+90 542 777 8899',
    joinedAt: '2025-04-15',
    enrolledWorkouts: ['w-2']
  }
];

export const INITIAL_WORKOUTS: Workout[] = [
  {
    id: 'w-1',
    title: 'WOD: Patlayıcı Güç & Kondisyon',
    description: 'Kettlebell swing, barfiks, kürek ve halter tekniklerini içeren yüksek yoğunluklu CrossFit antrenmanı. Güç ve metabolik kapasiteyi zirveye taşır.',
    category: 'CrossFit',
    trainerId: 'u-trainer-1',
    trainerName: 'Burak Kaya',
    trainerAvatar: '/assets/images/trainer_burak_crossfit_1793202971371.jpg',
    durationMinutes: 60,
    level: 'İleri Seviye',
    schedule: 'Pazartesi & Çarşamba 19:00',
    capacity: 12,
    enrolledMemberIds: ['u-member-1', 'u-admin'],
    image: '/assets/images/misfit_hero_fitness_1793202969692.jpg',
    location: 'Ana CrossFit Arenası / A Salonu',
    createdAt: '2025-03-01'
  },
  {
    id: 'w-2',
    title: 'Reformer Pilates & Omurga Duruş Hizalama',
    description: 'Masa başı çalışanlar ve duruşunu düzeltmek isteyenler için reformer aletinde odaklı core ve omurga stabilizasyon seansı.',
    category: 'Pilates & Mobilite',
    trainerId: 'u-trainer-2',
    trainerName: 'Selin Demir',
    trainerAvatar: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    durationMinutes: 50,
    level: 'Başlangıç',
    schedule: 'Salı & Perşembe 10:30',
    capacity: 8,
    enrolledMemberIds: ['u-member-2', 'u-admin'],
    image: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    location: 'Pilates Stüdyosu / Reformer Alanı',
    createdAt: '2025-03-05'
  },
  {
    id: 'w-3',
    title: 'Boks Temelleri & 600 Kalori HIIT',
    description: 'Gölge boksu, kum torbası kombinasyonları ve pliometrik egzersizlerle yüksek kalori yakımı ve çeviklik kazandıran seans.',
    category: 'Boks & HIIT',
    trainerId: 'u-trainer-3',
    trainerName: 'Deniz Yılmaz',
    trainerAvatar: '/assets/images/trainer_deniz_boxing_1793202972640.jpg',
    durationMinutes: 55,
    level: 'Orta Seviye',
    schedule: 'Pazartesi & Cuma 18:00',
    capacity: 14,
    enrolledMemberIds: ['u-member-1'],
    image: '/assets/images/trainer_deniz_boxing_1793202972640.jpg',
    location: 'Boks Ringi ve Kum Torbası İstasyonu',
    createdAt: '2025-03-10'
  },
  {
    id: 'w-4',
    title: 'Olimpik Halter & Deadlift Masterclass',
    description: 'Clean & Jerk, Snatch ve geleneksel Deadlift formlarında biomekanik analiz ve ağırlık kaldırma güvenliği eğitimi.',
    category: 'Kondisyon & Güç',
    trainerId: 'u-trainer-1',
    trainerName: 'Burak Kaya',
    trainerAvatar: '/assets/images/trainer_burak_crossfit_1793202971371.jpg',
    durationMinutes: 75,
    level: 'İleri Seviye',
    schedule: 'Cumartesi 11:00',
    capacity: 10,
    enrolledMemberIds: [],
    image: '/assets/images/gallery_gym_community_1793202972765.jpg',
    location: 'Halter Platformları Alanı',
    createdAt: '2025-03-15'
  },
  {
    id: 'w-5',
    title: 'Dinamik Esneklik & Derin Fasya Rahatlatma',
    description: 'Yoğun antrenman yapanlar veya hareket kısıtlılığı yaşayanlar için kalça, omuz ve hamstring esnetme protokolü.',
    category: 'Yoga & Esneklik',
    trainerId: 'u-trainer-2',
    trainerName: 'Selin Demir',
    trainerAvatar: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    durationMinutes: 45,
    level: 'Başlangıç',
    schedule: 'Çarşamba & Cumartesi 17:30',
    capacity: 15,
    enrolledMemberIds: [],
    image: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    location: 'Zen & Mobilite Salonu',
    createdAt: '2025-03-18'
  },
  {
    id: 'w-6',
    title: 'Kondisyon & Sürat İstasyonları',
    description: 'Hız merdiveni, kızak itme (sled push) ve savaş halatları (battle ropes) ile atletik dayanıklılık testi.',
    category: 'Boks & HIIT',
    trainerId: 'u-trainer-3',
    trainerName: 'Deniz Yılmaz',
    trainerAvatar: '/assets/images/trainer_deniz_boxing_1793202972640.jpg',
    durationMinutes: 50,
    level: 'Orta Seviye',
    schedule: 'Salı & Perşembe 19:30',
    capacity: 12,
    enrolledMemberIds: [],
    image: '/assets/images/gallery_gym_community_1793202972765.jpg',
    location: 'Sentetik Çim Koşu ve Kızak Parkuru',
    createdAt: '2025-03-20'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Mert Aksoy',
    email: 'mert.aksoy@gmail.com',
    phone: '+90 532 100 2030',
    subject: 'Birebir Özel Antrenman (PT) Fiyatları',
    message: 'Merhaba, Burak Hoca ile haftada 2 gün özel antrenman almak istiyorum. Paket fiyatlandırmanız hakkında bilgi alabilir miyim?',
    createdAt: '2025-04-20 14:32',
    isRead: false
  },
  {
    id: 'msg-2',
    name: 'Elif Yalçın',
    email: 'elif.yalcin@outlook.com',
    phone: '+90 544 333 4455',
    subject: 'Reformer Pilates Deneme Seansı',
    message: 'Merhaba, Selin Hoca nın seansına katılmadan önce stüdyoyu ziyaret edip deneme seansı yapabiliyor muyuz? Teşekkürler.',
    createdAt: '2025-04-22 10:15',
    isRead: true,
    replyNote: 'Telefonla arandı ve cumartesi günü için randevu oluşturuldu.'
  }
];

export const INITIAL_GALLERY: GalleryItem[] = [
  {
    id: 'gal-1',
    title: 'Ana Halter ve Serbest Ağırlık Platformları',
    category: 'Tesis',
    imageUrl: '/assets/images/misfit_hero_fitness_1793202969692.jpg',
    date: '2025-03-01',
    caption: 'Eleiko barlar, kauçuk zemin ve doğal gün ışığı alan 600m² ferah antrenman sahası.'
  },
  {
    id: 'gal-2',
    title: 'Topluluk WOD & Ekip Ruhu',
    category: 'Grup Seansları',
    imageUrl: '/assets/images/gallery_gym_community_1793202972765.jpg',
    date: '2025-03-10',
    caption: 'Birlikte ter döken, birbirini motive eden ve hedeflerine koşan Misfit üyeleri.'
  },
  {
    id: 'gal-3',
    title: 'Boks Ringi ve Çeviklik İstasyonu',
    category: 'Boks & Ring',
    imageUrl: '/assets/images/trainer_deniz_boxing_1793202972640.jpg',
    date: '2025-03-14',
    caption: 'Profesyonel standartlarda ring, kum torbaları ve eldiven ekipmanları.'
  },
  {
    id: 'gal-4',
    title: 'Aydınlık Pilates & Duruş Stüdyosu',
    category: 'Pilates & Stüdyo',
    imageUrl: '/assets/images/trainer_selin_pilates_1793202972334.jpg',
    date: '2025-03-18',
    caption: 'Meşe parke zemin, ahşap reformer yatakları ve izole huzurlu çalışma alanı.'
  },
  {
    id: 'gal-5',
    title: 'CrossFit & Halter Koçluğu Seansı',
    category: 'Ağırlık & Güç',
    imageUrl: '/assets/images/trainer_burak_crossfit_1793202971371.jpg',
    date: '2025-03-22',
    caption: 'Birebir form düzeltme, video analizi ve güvenli kaldırma disiplini.'
  }
];
