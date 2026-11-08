/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * İlişkisel Veritabanı Katmanı (PostgreSQL / MySQL / H2 Database Temsili)
 * Spring Data @OneToMany & @ManyToOne İlişki Modeli:
 * Admin (1) <----> (N) User & CandidateCV
 */

import { UserEntity, CandidateCVEntity, AuditLogEntity } from '../types/models';
import { Role, MilitaryStatus, EducationDegree, ApplicationStatus, LogLevel } from '../types/enums';
import { SecurityService } from '../patterns/SecurityService';

export class DatabaseContext {
  private static instance: DatabaseContext | null = null;
  private readonly DB_STORAGE_KEY = 'ONLINE_CV_DB_ENESTK_V2';

  public users: Map<string, UserEntity> = new Map();
  public candidateCVs: Map<string, CandidateCVEntity> = new Map();
  public auditLogs: AuditLogEntity[] = [];

  private constructor() {
    this.initializeDatabase();
  }

  public static getInstance(): DatabaseContext {
    if (!DatabaseContext.instance) {
      DatabaseContext.instance = new DatabaseContext();
    }
    return DatabaseContext.instance;
  }

  private initializeDatabase(): void {
    const persisted = typeof window !== 'undefined' ? localStorage.getItem(this.DB_STORAGE_KEY) : null;
    if (persisted) {
      try {
        const parsed = JSON.parse(persisted);
        
        parsed.users.forEach((u: any) => {
          this.users.set(u.id, new UserEntity(u));
        });

        parsed.candidateCVs.forEach((c: any) => {
          this.candidateCVs.set(c.id, new CandidateCVEntity(c));
        });

        this.auditLogs = (parsed.auditLogs || []).map((l: any) => new AuditLogEntity(l));
        return;
      } catch (err) {
        console.warn('Veritabanı geri yüklenirken hata oluştu, varsayılan tohum veriler yükleniyor.', err);
      }
    }

    this.seedDefaultData();
    this.persist();
  }

  public persist(): void {
    if (typeof window === 'undefined') return;
    try {
      const payload = {
        meta: {
          system: 'Online CV & İnsan Kaynakları Portalı',
          developer: 'Enes Öztürk',
          timestamp: new Date().toISOString(),
        },
        users: Array.from(this.users.values()),
        candidateCVs: Array.from(this.candidateCVs.values()),
        auditLogs: this.auditLogs.slice(-200), // Son 200 log
      };
      localStorage.setItem(this.DB_STORAGE_KEY, JSON.stringify(payload));
    } catch (err) {
      console.error('LocalStorage persistence error:', err);
    }
  }

  public resetToDefault(): void {
    this.users.clear();
    this.candidateCVs.clear();
    this.auditLogs = [];
    this.seedDefaultData();
    this.persist();
  }

  private seedDefaultData(): void {
    // 1. İnsan Kaynakları Yöneticileri (Adminler)
    const admin1 = new UserEntity({
      id: 'admin_hr_01',
      username: 'ik_yonetici',
      email: 'ik@sirket.com',
      passwordHash: SecurityService.hashPassword('admin123'),
      role: Role.ADMIN,
      isBlocked: false,
      failedLoginAttempts: 0,
      adminId: null,
      lastLoginAt: new Date().toISOString(),
    });

    const admin2 = new UserEntity({
      id: 'admin_hr_02',
      username: 'ik_uzman',
      email: 'uzman@sirket.com',
      passwordHash: SecurityService.hashPassword('admin123'),
      role: Role.ADMIN,
      isBlocked: false,
      failedLoginAttempts: 0,
      adminId: null,
      lastLoginAt: null,
    });

    this.users.set(admin1.id, admin1);
    this.users.set(admin2.id, admin2);

    // 2. Normal Kullanıcılar (Adaylar) ve CV'leri
    // Aday 1: Burak Demir - Askerlik Yapıldı, 6 Yıl Deneyim (Arama gereksinimine tam uygun)
    const user1 = new UserEntity({
      id: 'usr_candidate_01',
      username: 'burak.demir',
      email: 'burak.demir@ornek.com',
      passwordHash: SecurityService.hashPassword('user123'),
      role: Role.USER,
      adminId: admin1.id,
      failedLoginAttempts: 0,
      isBlocked: false,
    });
    this.users.set(user1.id, user1);

    const cv1 = new CandidateCVEntity({
      id: 'cv_01',
      userId: user1.id,
      firstName: 'Burak',
      lastName: 'Demir',
      phone: '+90 532 555 1020',
      email: 'burak.demir@ornek.com',
      city: 'İstanbul',
      title: 'Kıdemli Java & Spring Boot Geliştirici',
      summary: '6 yılı aşkın süredir kurumsal Java, Spring Boot microservices, Kafka ve PostgreSQL mimarilerinde deneyimli yazılım mühendisi. S.O.L.I.D prensipleri ve Clean Architecture odaklı çalışırım.',
      totalExperienceYears: 6,
      militaryStatus: MilitaryStatus.DONE,
      kvkkConsentGiven: true,
      kvkkExpiryDate: '2027-12-31',
      applicationStatus: ApplicationStatus.UNDER_REVIEW,
      experiences: [
        {
          id: 'exp_1',
          companyName: 'FinTech Çözümleri A.Ş.',
          position: 'Senior Backend Developer',
          startDate: '2022-01',
          endDate: 'Devam Ediyor',
          years: 3,
          description: 'Spring Cloud, Docker, Kubernetes ve Redis ile dağıtık ödeme geçidi mimarisi geliştirildi.',
        },
        {
          id: 'exp_2',
          companyName: 'Bilişim Vadisi Yazılım',
          position: 'Java Software Engineer',
          startDate: '2019-06',
          endDate: '2021-12',
          years: 3,
          description: 'Spring Boot RESTful servisler, PostgreSQL veritabanı optimizasyonu ve CI/CD pipeline tasarımı.',
        },
      ],
      educations: [
        {
          id: 'edu_1',
          schoolName: 'İstanbul Teknik Üniversitesi (İTÜ)',
          department: 'Bilgisayar Mühendisliği',
          degree: EducationDegree.BACHELOR,
          startYear: 2015,
          graduationYear: 2019,
        },
      ],
      skills: ['Java 21', 'Spring Boot 3', 'Microservices', 'PostgreSQL', 'Docker', 'Kafka', 'Clean Architecture', 'JUnit/Mockito'],
      languages: ['Türkçe (Anadil)', 'İngilizce (İleri Düzey - C1)'],
      hrNotes: 'Ön elemeden başarıyla geçti, teknik mülakat adayı.',
    });
    this.candidateCVs.set(cv1.id, cv1);

    // Aday 2: Ayşe Yılmaz - 4 Yıl Deneyim, Frontend Specialist (Kadın Aday / Muaf)
    const user2 = new UserEntity({
      id: 'usr_candidate_02',
      username: 'ayse.yilmaz',
      email: 'ayse.yilmaz@ornek.com',
      passwordHash: SecurityService.hashPassword('user123'),
      role: Role.USER,
      adminId: admin1.id,
      failedLoginAttempts: 0,
      isBlocked: false,
    });
    this.users.set(user2.id, user2);

    const cv2 = new CandidateCVEntity({
      id: 'cv_02',
      userId: user2.id,
      firstName: 'Ayşe',
      lastName: 'Yılmaz',
      phone: '+90 533 444 3040',
      email: 'ayse.yilmaz@ornek.com',
      city: 'Ankara',
      title: 'Senior Frontend & React Uzmanı',
      summary: 'Kullanıcı dostu arayüzler, React, TypeScript, Next.js ve modern CSS frameworkleri konusunda 4 yıllık tecrübeye sahibim.',
      totalExperienceYears: 4,
      militaryStatus: MilitaryStatus.NOT_APPLICABLE,
      kvkkConsentGiven: true,
      kvkkExpiryDate: '2028-06-30',
      applicationStatus: ApplicationStatus.INTERVIEW_SCHEDULED,
      experiences: [
        {
          id: 'exp_201',
          companyName: 'Dijital Sanat ve Tasarım',
          position: 'Lead Frontend Developer',
          startDate: '2021-03',
          endDate: 'Devam Ediyor',
          years: 4,
          description: 'React, Tailwind CSS ve Redux Toolkit ile e-ticaret platformu ön yüzü sıfırdan tasarlandı.',
        },
      ],
      educations: [
        {
          id: 'edu_201',
          schoolName: 'Orta Doğu Teknik Üniversitesi (ODTÜ)',
          department: 'Yazılım Mühendisliği',
          degree: EducationDegree.BACHELOR,
          startYear: 2016,
          graduationYear: 2020,
        },
      ],
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js', 'Redux', 'Jest', 'UI/UX'],
      languages: ['Türkçe (Anadil)', 'İngilizce (İleri Düzey - B2)'],
      hrNotes: 'Frontend lead görüşmesi planlandı.',
    });
    this.candidateCVs.set(cv2.id, cv2);

    // Aday 3: Mehmet Kaya - 2 Yıl Deneyim, Askerlik Tecilli
    const user3 = new UserEntity({
      id: 'usr_candidate_03',
      username: 'mehmet.kaya',
      email: 'mehmet.kaya@ornek.com',
      passwordHash: SecurityService.hashPassword('user123'),
      role: Role.USER,
      adminId: admin1.id,
      failedLoginAttempts: 0,
      isBlocked: false,
    });
    this.users.set(user3.id, user3);

    const cv3 = new CandidateCVEntity({
      id: 'cv_03',
      userId: user3.id,
      firstName: 'Mehmet',
      lastName: 'Kaya',
      phone: '+90 544 222 5060',
      email: 'mehmet.kaya@ornek.com',
      city: 'İzmir',
      title: 'Junior Java & Backend Geliştirici',
      summary: 'Yeni mezun, 2 yıl staj ve freelance tecrübeli, öğrenmeye istekli ve analitik düşünebilen yazılımcı.',
      totalExperienceYears: 2,
      militaryStatus: MilitaryStatus.POSTPONED,
      kvkkConsentGiven: true,
      kvkkExpiryDate: '2027-01-15',
      applicationStatus: ApplicationStatus.NEW,
      experiences: [
        {
          id: 'exp_301',
          companyName: 'İzmir Teknopark Yazılım',
          position: 'Junior Software Developer',
          startDate: '2023-01',
          endDate: 'Devam Ediyor',
          years: 2,
          description: 'Spring Boot REST API geliştirme ve unit test yazımı.',
        },
      ],
      educations: [
        {
          id: 'edu_301',
          schoolName: 'Ege Üniversitesi',
          department: 'Bilgisayar Mühendisliği',
          degree: EducationDegree.BACHELOR,
          startYear: 2018,
          graduationYear: 2022,
        },
      ],
      skills: ['Java', 'Spring Boot', 'MySQL', 'Git', 'HTML/CSS'],
      languages: ['Türkçe (Anadil)', 'İngilizce (Orta Düzey - B1)'],
      hrNotes: null,
    });
    this.candidateCVs.set(cv3.id, cv3);

    // Aday 4: Canan Koç - 7 Yıl Deneyim, Askerlik Muaf Kadın Aday
    const user4 = new UserEntity({
      id: 'usr_candidate_04',
      username: 'canan.koc',
      email: 'canan.koc@ornek.com',
      passwordHash: SecurityService.hashPassword('user123'),
      role: Role.USER,
      adminId: admin2.id,
      failedLoginAttempts: 0,
      isBlocked: false,
    });
    this.users.set(user4.id, user4);

    const cv4 = new CandidateCVEntity({
      id: 'cv_04',
      userId: user4.id,
      firstName: 'Canan',
      lastName: 'Koç',
      phone: '+90 535 777 8899',
      email: 'canan.koc@ornek.com',
      city: 'İstanbul',
      title: 'Full-Stack Software Architect & Team Lead',
      summary: '7 yıl kurumsal projelerde mimari tasarım, Spring Cloud, React, AWS ve DevOps süreçlerini yönetmiş yazılım lideri.',
      totalExperienceYears: 7,
      militaryStatus: MilitaryStatus.NOT_APPLICABLE,
      kvkkConsentGiven: true,
      kvkkExpiryDate: '2028-11-20',
      applicationStatus: ApplicationStatus.OFFERED,
      experiences: [
        {
          id: 'exp_401',
          companyName: 'Global Cloud Systems',
          position: 'Software Architect',
          startDate: '2020-01',
          endDate: 'Devam Ediyor',
          years: 4,
          description: 'Yüksek trafikli mikroservis mimarisinin sıfırdan tasarımı ve 12 kişilik ekibin yönetimi.',
        },
        {
          id: 'exp_402',
          companyName: 'SoftTech Danışmanlık',
          position: 'Full-Stack Developer',
          startDate: '2017-02',
          endDate: '2019-12',
          years: 3,
          description: 'Java, Spring, Angular ve Oracle DB ile bankacılık altyapı projeleri.',
        },
      ],
      educations: [
        {
          id: 'edu_401',
          schoolName: 'Boğaziçi Üniversitesi',
          department: 'Bilgisayar Mühendisliği',
          degree: EducationDegree.MASTER,
          startYear: 2015,
          graduationYear: 2017,
        },
      ],
      skills: ['Java', 'Spring Cloud', 'React', 'Kubernetes', 'AWS', 'PostgreSQL', 'System Architecture'],
      languages: ['Türkçe (Anadil)', 'İngilizce (Akıcı - C2)', 'Almanca (B1)'],
      hrNotes: 'Teklif aşamasına geçildi.',
    });
    this.candidateCVs.set(cv4.id, cv4);

    // Aday 5: Ali Öztürk - Askerlik Yapıldı, 5 Yıl Deneyim (Tam 5 yıllık arama filtresine uyan profil)
    const user5 = new UserEntity({
      id: 'usr_candidate_05',
      username: 'ali.ozturk',
      email: 'ali.ozturk@ornek.com',
      passwordHash: SecurityService.hashPassword('user123'),
      role: Role.USER,
      adminId: admin1.id,
      failedLoginAttempts: 0,
      isBlocked: false,
    });
    this.users.set(user5.id, user5);

    const cv5 = new CandidateCVEntity({
      id: 'cv_05',
      userId: user5.id,
      firstName: 'Ali',
      lastName: 'Öztürk',
      phone: '+90 538 999 1122',
      email: 'ali.ozturk@ornek.com',
      city: 'Bursa',
      title: 'Kıdemli Backend & DevOps Mühendisi',
      summary: '5 yıllık backend mühendisliği tecrübesi. Askerlik görevimi tamamladım. Mikroservisler, CI/CD ve Spring Boot projelerinde tecrübeliyim.',
      totalExperienceYears: 5,
      militaryStatus: MilitaryStatus.DONE,
      kvkkConsentGiven: true,
      kvkkExpiryDate: '2028-01-01',
      applicationStatus: ApplicationStatus.NEW,
      experiences: [
        {
          id: 'exp_501',
          companyName: 'Bursa Otomotiv & Yazılım',
          position: 'Backend Developer',
          startDate: '2020-01',
          endDate: 'Devam Ediyor',
          years: 5,
          description: 'Spring Boot, Docker, Redis ve PostgreSQL ile IoT telemetri servisleri.',
        },
      ],
      educations: [
        {
          id: 'edu_501',
          schoolName: 'Uludağ Üniversitesi',
          department: 'Yazılım Mühendisliği',
          degree: EducationDegree.BACHELOR,
          startYear: 2015,
          graduationYear: 2019,
        },
      ],
      skills: ['Java', 'Spring Boot', 'Docker', 'PostgreSQL', 'Redis', 'RabbitMQ'],
      languages: ['Türkçe (Anadil)', 'İngilizce (B2)'],
      hrNotes: null,
    });
    this.candidateCVs.set(cv5.id, cv5);

    // 3. Başlangıç Denetim Logları (Audit Logs)
    this.auditLogs.push(
      new AuditLogEntity({
        action: 'SİSTEM_BAŞLATILDI',
        userId: admin1.id,
        username: admin1.username,
        role: Role.ADMIN,
        level: LogLevel.INFO,
        details: 'Veritabanı ve Spring Data ilişkileri başlatıldı. Enes Öztürk imzalı sistem hazır.',
      }),
      new AuditLogEntity({
        action: 'KAYIT_OLUŞTURULDU',
        userId: user1.id,
        username: user1.username,
        role: Role.USER,
        level: LogLevel.INFO,
        details: 'Aday CV profili oluşturuldu ve KVKK onayı verildi.',
      })
    );
  }
}
