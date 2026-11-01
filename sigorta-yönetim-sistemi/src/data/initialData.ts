/**
 * @author Enes Öztürk
 * Başlangıç Veri Seti - Bireysel & Kurumsal Müşteri Hesapları
 */

import {
  AccountManager,
  BusinessAddress,
  CarInsurance,
  Enterprise,
  HealthInsurance,
  HomeAddress,
  Individual,
  ResidenceInsurance,
  TravelInsurance,
  User,
} from '../types/insurance';

export function createInitialAccountManager(): AccountManager {
  const manager = new AccountManager();

  // 1. Bireysel Hesap (Ahmet Yılmaz)
  const user1 = new User(
    'Ahmet',
    'Yılmaz',
    'ahmet@gmail.com',
    '12345',
    'Bilgisayar Mühendisi',
    34,
    [
      new HomeAddress('Bağdat Caddesi', '42', '8', 'Kadıköy', 'İstanbul', '34710', 'Ahmet Yılmaz'),
      new BusinessAddress('Yılmaz Yazılım Çözümleri', 'Teknopark İstanbul B Blok', 'Kat:3 No:312', 'Pendik', 'İstanbul', '34906', '9876543210')
    ],
    new Date(Date.now() - 3600000 * 4) // 4 saat önce
  );
  const account1 = new Individual(user1);
  account1.addInsurance(
    new HealthInsurance(
      'Özel Sağlık Tam Güvence',
      new Date('2026-01-01'),
      new Date('2027-01-01'),
      user1.age,
      false,
      'VIP'
    )
  );
  account1.addInsurance(
    new CarInsurance(
      'Genişletilmiş Kasko',
      new Date('2026-03-15'),
      new Date('2027-03-15'),
      950000,
      2023,
      false
    )
  );

  // 2. Kurumsal Hesap (Enes Öztürk - Öztürk Holding)
  const user2 = new User(
    'Enes',
    'Öztürk',
    'enes@ozturk.com',
    'enes2026',
    'Holding Yönetim Kurulu Başkanı',
    42,
    [
      new BusinessAddress('Öztürk Holding Genel Merkez', 'Büyükdere Caddesi Levent Plaza', 'Kat:24 No:110', 'Şişli', 'İstanbul', '34394', '3120984561'),
      new HomeAddress('Kandilli Göksu Evleri', 'Villa 14', '1', 'Üsküdar', 'İstanbul', '34684', 'Enes Öztürk')
    ],
    new Date(Date.now() - 3600000 * 1) // 1 saat önce
  );
  const account2 = new Enterprise(user2, 'Öztürk Şirketler Grubu A.Ş.');
  account2.addInsurance(
    new ResidenceInsurance(
      'Köşk & Konut Güvence Poliçesi',
      new Date('2026-02-01'),
      new Date('2027-02-01'),
      380,
      6,
      1
    )
  );
  account2.addInsurance(
    new CarInsurance(
      'Kurumsal Filo Kasko Poliçesi',
      new Date('2026-04-10'),
      new Date('2027-04-10'),
      2800000,
      2025,
      false
    )
  );
  account2.addInsurance(
    new HealthInsurance(
      'Yönetici Grubu Sağlık Sigortası',
      new Date('2026-01-01'),
      new Date('2027-01-01'),
      user2.age,
      false,
      'VIP'
    )
  );

  // 3. Bireysel Hesap 2 (Zeynep Kaya)
  const user3 = new User(
    'Zeynep',
    'Kaya',
    'zeynep@kaya.com',
    'zey123',
    'Mimar & Şehir Plancısı',
    29,
    [
      new HomeAddress('Alsancak Kıbrıs Şehitleri Cad.', '114', '4', 'Konak', 'İzmir', '35220', 'Zeynep Kaya')
    ],
    new Date(Date.now() - 3600000 * 24)
  );
  const account3 = new Individual(user3);
  account3.addInsurance(
    new TravelInsurance(
      'Schengen Çoklu Giriş Seyahat Sigortası',
      new Date('2026-06-01'),
      new Date('2026-06-25'),
      'EUROPE_SCHENGEN',
      2
    )
  );

  manager.addAccount(account1);
  manager.addAccount(account2);
  manager.addAccount(account3);

  return manager;
}
