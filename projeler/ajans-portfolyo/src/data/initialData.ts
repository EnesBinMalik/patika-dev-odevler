import { PortfolioItem, ContactMessage } from '../types';

export const INITIAL_PORTFOLIO_ITEMS: PortfolioItem[] = [
  {
    id: 'proj-1',
    title: 'Aurora Studio Web Platformu',
    subtitle: 'Yüksek Performanslı Kurumsal Dijital Deneyim & CMS',
    category: 'Web Tasarım',
    imageUrl: '/assets/images/agency_portfolio_web_1793201690131.jpg',
    client: 'Aurora Creative Media',
    date: '2026-02-18',
    projectUrl: 'https://aurorastudio.example.com',
    description:
      'Aurora Creative Media için geliştirilen bu platformda, PCAT projesindeki dinamik CRUD altyapısı modern React & Node.js mimarisiyle birleştirildi. Proje, yüksek dönüşüm oranları ve ışık hızında sayfa yükleme süreleri (Lighthouse 99) hedefiyle sıfırdan tasarlandı. Dinamik portföy filtreleme, SEO optimizasyonu ve özelleştirilmiş admin paneli içermektedir.',
    technologies: ['React 19', 'Tailwind CSS', 'Node.js', 'Express', 'Vite'],
    featured: true,
    createdAt: '2026-02-18T10:00:00Z',
  },
  {
    id: 'proj-2',
    title: 'Aethel Luxury Kimlik & Ambalaj',
    subtitle: 'Minimalist & Zarif Kurumsal Kimlik Tasarımı',
    category: 'Branding',
    imageUrl: '/assets/images/agency_portfolio_branding_1793201690346.jpg',
    client: 'Aethel Fine Objects (London)',
    date: '2026-01-24',
    projectUrl: 'https://aethel.example.com',
    description:
      'Londra merkezli lüks yaşam tarzı markası Aethel için hazırlanan kurumsal kimlik projesi. Özel sıcak yaldız baskılı kartvizitler, antetli kağıtlar, doğal traverten dokulu marka sunumu ve tipografik hiyerarşi oluşturuldu. Markanın premium konumlandırmasını pekiştiren zamansız bir görsel dil kurgulandı.',
    technologies: ['Adobe Illustrator', 'Figma', 'Marka Stratejisi', 'Baskı Üretimi'],
    featured: true,
    createdAt: '2026-01-24T14:30:00Z',
  },
  {
    id: 'proj-3',
    title: 'Galata Finans Mobil Arayüzü',
    subtitle: 'Yeni Nesil Bireysel Varlık & Portföy Takibi',
    category: 'Mobil Uygulama',
    imageUrl: '/assets/images/agency_portfolio_mobile_1793201690373.jpg',
    client: 'FinTech Labs İstanbul',
    date: '2026-03-05',
    projectUrl: 'https://galatafinans.example.com',
    description:
      'Kullanıcıların nakit akışını, yatırımlarını ve finansal sağlık skorlarını gerçek zamanlı takip edebileceği modern fintech mobil uygulaması. Gece modu odaklı karanlık tema, yumuşak mikro-etkileşimler ve erişilebilir veri görselleştirmeleri ile App Store ve Google Play için hazırlandı.',
    technologies: ['React Native', 'TypeScript', 'Tailwind', 'Chart.js', 'Figma'],
    featured: true,
    createdAt: '2026-03-05T09:15:00Z',
  },
  {
    id: 'proj-4',
    title: 'SmartEdu Akıllı Eğitim Portalı',
    subtitle: 'Dinamik Kurs & Öğrenci İletişim Yönetim Sistemi',
    category: 'Yazılım & API',
    imageUrl: '/assets/images/agency_hero_studio_1793201689310.jpg',
    client: 'SmartEdu Global Academy',
    date: '2025-11-12',
    projectUrl: 'https://smartedu.example.com',
    description:
      'SmartEdu projemizin temelini oluşturan, öğretmen ve öğrencileri buluşturan dinamik eğitim platformu. İletişim formundan gelen taleplerin anlık e-posta ve veri tabanına işlendiği mesajlaşma mimarisi ile kurs yönetim panelleri başarıyla entegre edildi.',
    technologies: ['Node.js', 'Express', 'REST API', 'PostgreSQL', 'EJS/React'],
    featured: false,
    createdAt: '2025-11-12T16:45:00Z',
  },
  {
    id: 'proj-5',
    title: 'PCAT Fotoğraf Galerisi & CRUD',
    subtitle: 'NodeJS & MongoDB Destekli Fotoğraf Paylaşım Platformu',
    category: 'Web Tasarım',
    imageUrl: '/assets/images/agency_portfolio_web_1793201690131.jpg',
    client: 'Görsel Sanatlar Topluluğu',
    date: '2025-08-20',
    projectUrl: 'https://pcat-gallery.example.com',
    description:
      'Fotoğrafçıların çalışmalarını yükleyebildiği, başlık ve açıklama güncelleyebildiği ve sildiği klasik PCAT mimarisinin modern uyarlaması. Dosya yükleme (Multer / Cloudinary), dinamik modal görüntüleyici ve RESTful rota yönetiminin kusursuz örneği.',
    technologies: ['Node.js', 'Express', 'MongoDB / Mongoose', 'Multer', 'Bootstrap'],
    featured: false,
    createdAt: '2025-08-20T11:00:00Z',
  },
  {
    id: 'proj-6',
    title: 'Vortex Studio Tipografi & Poster Serisi',
    subtitle: 'Deneysel Tipografi ve Dijital Sanat Sergisi',
    category: 'Grafik Tasarım',
    imageUrl: '/assets/images/agency_portfolio_branding_1793201690346.jpg',
    client: 'Vortex Kültür & Sanat',
    date: '2025-12-04',
    projectUrl: 'https://vortex.example.com',
    description:
      'Uluslararası tasarım bienali için üretilen sınırlı sayıda serigrafi poster ve dijital afiş serisi. İsviçre tipografik ızgarası ile çağdaş brütalist estetiği harmanlayan özel bir görsel deneyim sunuldu.',
    technologies: ['Graphic Design', 'Editorial', 'Screen Printing', 'Typography'],
    featured: false,
    createdAt: '2025-12-04T13:20:00Z',
  },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@teknolojigrubu.com',
    phone: '+90 532 111 22 33',
    subject: 'Kurumsal Web Sitesi & E-Ticaret Dönüşümü',
    message:
      'Merhaba Enes Bey, PCAT ve SmartEdu projelerinizdeki dinamik yaklaşımınızı çok beğendik. Şirketimiz için kurumsal kimlik ve React tabanlı dinamik portföy platformu geliştirmek istiyoruz. Teklif alabilir miyiz?',
    createdAt: '2026-03-24T11:20:00Z',
    status: 'new',
  },
  {
    id: 'msg-2',
    name: 'Zeynep Kaya',
    email: 'zeynep.kaya@startuphub.io',
    phone: '+90 544 888 99 00',
    subject: 'Fintech Mobil Uygulama Tasarımı',
    message:
      'İyi çalışmalar, Galata Finans arayüz tasarımınız tam aradığımız kalitede. Yeni fintech girişimimiz için 10 ekranlık MVP tasarımı ve prototipleme konusunda görüşmek isteriz.',
    createdAt: '2026-03-22T14:45:00Z',
    status: 'read',
  },
];
