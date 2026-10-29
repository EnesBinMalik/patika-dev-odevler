import { Furniture, User, Reservation, ContactMessage } from '../types';

export const INITIAL_USERS: (User & { passwordHash: string })[] = [
  {
    id: 'user-admin',
    name: 'Enes Öztürk',
    email: 'admin@fikstur.com',
    role: 'admin',
    phone: '+90 (532) 412 89 20',
    city: 'İstanbul, TR',
    passwordHash: 'admin123'
  },
  {
    id: 'user-member-1',
    name: 'Selin Yılmaz',
    email: 'selin@fikstur.com',
    role: 'member',
    phone: '+90 (555) 789 44 11',
    city: 'İzmir, TR',
    passwordHash: '123456'
  },
  {
    id: 'user-member-2',
    name: 'Burak Demir',
    email: 'burak@fikstur.com',
    role: 'member',
    phone: '+90 (542) 230 19 82',
    city: 'Ankara, TR',
    passwordHash: '123456'
  }
];

export const INITIAL_FURNITURES: Furniture[] = [
  {
    id: 'f-1',
    name: 'Kobenhavn Bouclé Berjer',
    category: 'Salon',
    price: 18450,
    image: '/src/assets/images/furniture_nordic_chair_1793204897506.jpg',
    description: 'Doğal masif meşe iskelet ve el dokuması sıcak dokulu bouclé kumaş döşeme. İskandinav organik kıvrımları ile maksimum sırt desteği sunar.',
    dimensions: '82 x 78 x 76 cm',
    material: 'Masif Meşe & Yün Bouclé',
    color: 'Krem / Doğal Meşe',
    stock: 5,
    featured: true,
    designerNote: 'Enes Öztürk imzalı 2025 Form & Denge koleksiyonu parçası.',
    createdAt: '2025-01-15'
  },
  {
    id: 'f-2',
    name: 'Aras Masif Ceviz Yemek Masası',
    category: 'Yemek Odası',
    price: 36800,
    image: '/src/assets/images/furniture_dining_table_1793204898344.jpg',
    description: 'Yuvarlatılmış pahlı kenarları ve heykelsi ayak mimarisiyle 6-8 kişilik salon ve yemek odası için tasarlanan masif ceviz başyapıtı.',
    dimensions: '220 x 100 x 75 cm',
    material: 'Amerikan Masif Ceviz',
    color: 'Doğal Ceviz Mat Cila',
    stock: 3,
    featured: true,
    designerNote: 'Her parça ceviz ağacının özgün dalgalı dokusuna sadık kalınarak elle işlenmiştir.',
    createdAt: '2025-01-18'
  },
  {
    id: 'f-3',
    name: 'Aura Pirinç & Opal Sarkıt Avize',
    category: 'Aydınlatma',
    price: 12900,
    image: '/src/assets/images/furniture_lighting_fixture_1793204897938.jpg',
    description: 'Fırçalanmış antika pirinç çubuklar ve el yapımı üfleme mat opal cam küreler. Yemek masası ve salon alanlarında sıcak ve homojen aydınlatma sağlar.',
    dimensions: '110 x 45 x 90 cm (Ayarlanabilir)',
    material: 'Fırçalanmış Pirinç & Opal Cam',
    color: 'Antik Altın & Buzlu Beyaz',
    stock: 8,
    featured: true,
    designerNote: 'Minimalist geometrik denge ve mimari aydınlatma standardı.',
    createdAt: '2025-02-02'
  },
  {
    id: 'f-4',
    name: 'Vala Kıvrımlı Modüler Koltuk',
    category: 'Salon',
    price: 49500,
    image: '/src/assets/images/hero_furniture_showcase_1793204897342.jpg',
    description: 'Yumuşak kavisli heykelsi hatlar, yüksek yoğunluklu HR sünger dolgusu ve leke tutmaz premium şönil kumaş. Ferah yaşam alanlarının odak noktası.',
    dimensions: '240 x 105 x 72 cm',
    material: 'Fırınlanmış Gürgen & Premium Şönil',
    color: 'Taş Grisi / Kum Beji',
    stock: 2,
    featured: true,
    designerNote: 'Modern mimaride akışkan hacimler oluşturmak için kurgulandı.',
    createdAt: '2025-02-10'
  },
  {
    id: 'f-5',
    name: 'Nord Studio Masif Çalışma Masası',
    category: 'Çalışma & Ofis',
    price: 24700,
    image: '/src/assets/images/furniture_dining_table_1793204898344.jpg',
    description: 'Entegre gizli kablo kanalı, yumuşak kapanan iki adet çekmece ve ergonomik derinlik ölçüleri ile ev-ofis çalışmalarında dingin bir odak sağlar.',
    dimensions: '150 x 70 x 75 cm',
    material: 'Doğal Dişbudak & Mat Siyah Çelik',
    color: 'Açık Ahşap & Siyah Detaylar',
    stock: 4,
    featured: false,
    designerNote: 'Verimli çalışma ergonomisi ve temiz çizgiler.',
    createdAt: '2025-02-14'
  },
  {
    id: 'f-6',
    name: 'Soma Yüzer Karyola & Başlık',
    category: 'Yatak Odası',
    price: 41200,
    image: '/src/assets/images/furniture_nordic_chair_1793204897506.jpg',
    description: 'Gömme taban yapısıyla havada süzülüyormuş hissi veren baza strüktürü, yumuşak kumaş kaplı genişletilmiş mimari başlık paneli.',
    dimensions: '180 x 210 x 95 cm (Yatak: 160x200)',
    material: 'Masif Meşe & Doğal Keten Kumaş',
    color: 'Doğal Keten & Açık Meşe',
    stock: 3,
    featured: false,
    designerNote: 'Huzurlu ve dingin bir uyku atmosferi için monokrom tonlar.',
    createdAt: '2025-02-20'
  }
];

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-101',
    furnitureId: 'f-1',
    furnitureName: 'Kobenhavn Bouclé Berjer',
    furnitureImage: '/src/assets/images/furniture_nordic_chair_1793204897506.jpg',
    furniturePrice: 18450,
    userId: 'user-member-1',
    userName: 'Selin Yılmaz',
    userEmail: 'selin@fikstur.com',
    userPhone: '+90 555 789 44 11',
    date: '2025-03-05',
    deliveryAddress: 'Alsancak Mah. Atatürk Cad. No: 42 D: 6, İzmir',
    notes: 'Yeni salon tadilatımız için rezerve etmek istiyoruz. Hafta sonu teslimatı tercih edilir.',
    status: 'Onaylandı',
    createdAt: '2025-02-24'
  },
  {
    id: 'res-102',
    furnitureId: 'f-3',
    furnitureName: 'Aura Pirinç & Opal Sarkıt Avize',
    furnitureImage: '/src/assets/images/furniture_lighting_fixture_1793204897938.jpg',
    furniturePrice: 12900,
    userId: 'user-member-2',
    userName: 'Burak Demir',
    userEmail: 'burak@fikstur.com',
    userPhone: '+90 542 230 19 82',
    date: '2025-03-12',
    deliveryAddress: 'Çankaya Mah. Simon Bolivar Cad. 14/8, Ankara',
    notes: 'Yemek masası tavan yüksekliği 2.90m, uzatma çubuğu rica olunur.',
    status: 'Beklemede',
    createdAt: '2025-02-26'
  }
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Mimar Kerem Aksoy',
    email: 'kerem@aksoymimarlik.com',
    phone: '+90 533 123 45 67',
    subject: 'Bodrum Butik Otel Projesi İçin Toplu Fikstür & Mobilya Talebi',
    message: 'Merhaba Enes Bey, Bodrum Yalıkavak projemizdeki 14 süit oda için Kobenhavn berjer ve özel boyutta ceviz masalar için teklif ve teslim sürelerinizi öğrenmek istiyoruz.',
    date: '2025-02-25 14:30',
    isRead: false
  },
  {
    id: 'msg-2',
    name: 'Elif Karaca',
    email: 'elif.karaca@gmail.com',
    phone: '+90 530 890 12 34',
    subject: 'Showroom Randevusu ve Kumaş Kartelası',
    message: 'Kobenhavn Berjer modelinizi Moda showroomunuzda canlı görmek ve kumaş dokularını incelemek istiyorum. Cumartesi 14:00 uygun mudur?',
    date: '2025-02-26 11:15',
    isRead: true
  }
];
