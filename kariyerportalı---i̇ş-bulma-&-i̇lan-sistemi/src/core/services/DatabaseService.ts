/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Pattern: Singleton Pattern - Database Service & In-Memory ORM Engine
 * Coordinates JPA Repositories, Seeds Initial State, and handles persistent storage
 */

import {
  UserRepository,
  CandidateProfileRepository,
  CompanyRepository,
  JobPostingRepository,
  ApplicationRepository,
  AuditLogRepository,
} from '../repositories/ConcreteRepositories.ts';
import { User } from '../entities/UserEntity.ts';
import { CandidateProfile } from '../entities/CandidateProfileEntity.ts';
import { Company } from '../entities/CompanyEntity.ts';
import { JobPosting } from '../entities/JobPostingEntity.ts';
import { Application } from '../entities/ApplicationEntity.ts';
import { AuditLog } from '../entities/AuditLogEntity.ts';
import { Role, MilitaryStatus, WorkType, ExperienceLevel, ApplicationStatus, LogLevel } from '../types/enums.ts';
import { PasswordService } from '../security/PasswordService.ts';

const STORAGE_KEY = 'kariyer_portali_db_v1';

export class DatabaseService {
  private static instance: DatabaseService | null = null;

  public readonly users: UserRepository = new UserRepository();
  public readonly candidates: CandidateProfileRepository = new CandidateProfileRepository();
  public readonly companies: CompanyRepository = new CompanyRepository();
  public readonly jobs: JobPostingRepository = new JobPostingRepository();
  public readonly applications: ApplicationRepository = new ApplicationRepository();
  public readonly logs: AuditLogRepository = new AuditLogRepository();

  private subscribers: Set<() => void> = new Set();

  private constructor() {
    this.initDatabase();
  }

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public subscribe(callback: () => void): () => void {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  public notify(): void {
    this.saveToStorage();
    this.subscribers.forEach(cb => cb());
  }

  private initDatabase(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const data = JSON.parse(raw);
        this.hydrateFromJSON(data);
        return;
      } catch (err) {
        console.error('Failed to parse database from storage, reseeding...', err);
      }
    }
    this.seedDefaultData();
  }

  public seedDefaultData(): void {
    this.users.clear();
    this.candidates.clear();
    this.companies.clear();
    this.jobs.clear();
    this.applications.clear();
    this.logs.clear();

    const defaultPasswordHash = PasswordService.hashPassword('123456');

    // 1. Seed Companies & Company Admin Users
    const admin1 = new User({
      id: 'usr_admin_1',
      email: 'admin@teknolojias.com',
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      fullName: 'Ahmet Karaca (İK Direktörü)',
      phone: '0532 111 2233',
    });

    const comp1 = new Company({
      id: 'cmp_1',
      name: 'Teknoloji A.Ş.',
      industry: 'Bilişim & Yazılım Teknolojileri',
      taxNumber: '1234567890',
      website: 'https://teknolojias.com.tr',
      city: 'İstanbul',
      address: 'Maslak Mah. Büyükdere Cad. No: 142/A, Sarıyer',
      employeeCount: '150-250',
      description: 'Fintech, e-ticaret ve büyük veri analitiği üzerine kurumsal çözümler geliştiren teknoloji şirketi.',
      adminUserId: admin1.getId(),
    });
    admin1.setCompanyId(comp1.getId());

    const admin2 = new User({
      id: 'usr_admin_2',
      email: 'hr@kodline.com',
      passwordHash: defaultPasswordHash,
      role: Role.ADMIN,
      fullName: 'Selin Vural (Talent Partner)',
      phone: '0533 222 3344',
    });

    const comp2 = new Company({
      id: 'cmp_2',
      name: 'Kodline Dijital Sistemler',
      industry: 'Bulut Bilişim ve Mobil Çözümler',
      taxNumber: '9876543210',
      website: 'https://kodline.io',
      city: 'Ankara',
      address: 'ODTÜ Teknokent Bilişim İnovasyon Merkezi Kat: 4',
      employeeCount: '50-100',
      description: 'Mikroservis mimarileri, bulut altyapıları ve mobil ürünler üreten Ar-Ge teknoloji şirketi.',
      adminUserId: admin2.getId(),
    });
    admin2.setCompanyId(comp2.getId());

    this.users.saveAll([admin1, admin2]);
    this.companies.saveAll([comp1, comp2]);

    // 2. Seed Candidates (Job Seekers) with varied experience and military service
    // Candidate 1: Ahmet Yılmaz - Senior Java & Spring, 6 years, Military: DONE
    const candUser1 = new User({
      id: 'usr_cand_1',
      email: 'ahmet.yilmaz@gmail.com',
      passwordHash: defaultPasswordHash,
      role: Role.USER,
      fullName: 'Ahmet Yılmaz',
      phone: '0542 333 4455',
    });
    const candProf1 = new CandidateProfile({
      id: 'prof_1',
      userId: candUser1.getId(),
      firstName: 'Ahmet',
      lastName: 'Yılmaz',
      phone: '0542 333 4455',
      city: 'İstanbul',
      militaryStatus: MilitaryStatus.DONE,
      experienceYears: 6,
      currentTitle: 'Senior Backend Developer (Java / Spring Boot)',
      bio: '6 yılı aşkın süredir kurumsal ölçekli dağıtık mimariler, Spring Boot mikroservisleri ve PostgreSQL üzerinde çalışıyorum.',
      skills: ['Java', 'Spring Boot', 'PostgreSQL', 'Docker', 'Kafka', 'Microservices', 'Clean Code'],
      workExperiences: [
        {
          id: 'exp_1',
          companyName: 'Fintek Çözümleri A.Ş.',
          title: 'Senior Java Geliştirici',
          startDate: '2022-01',
          isCurrent: true,
          description: 'Spring Boot ve Kafka ile ödeme ağ geçidi mikroservislerinin mimarisi ve geliştirilmesi.',
        },
        {
          id: 'exp_2',
          companyName: 'Bilişim Dünyası Ltd.',
          title: 'Backend Developer',
          startDate: '2019-06',
          endDate: '2021-12',
          isCurrent: false,
          description: 'RESTful API servislerinin geliştirilmesi, Hibernate ORM optimizasyonu.',
        },
      ],
      educations: [
        {
          id: 'edu_1',
          institution: 'İstanbul Teknik Üniversitesi (İTÜ)',
          degree: 'Lisans',
          department: 'Bilgisayar Mühendisliği',
          graduationYear: 2019,
        },
      ],
      cvFileName: 'Ahmet_Yilmaz_CV.pdf',
    });
    candUser1.setCandidateProfileId(candProf1.getId());

    // Candidate 2: Zeynep Demir - Senior Fullstack & React, 5 years, Military: EXEMPT (Muaf)
    const candUser2 = new User({
      id: 'usr_cand_2',
      email: 'zeynep.demir@gmail.com',
      passwordHash: defaultPasswordHash,
      role: Role.USER,
      fullName: 'Zeynep Demir',
      phone: '0555 444 5566',
    });
    const candProf2 = new CandidateProfile({
      id: 'prof_2',
      userId: candUser2.getId(),
      firstName: 'Zeynep',
      lastName: 'Demir',
      phone: '0555 444 5566',
      city: 'İzmir',
      militaryStatus: MilitaryStatus.EXEMPT,
      militaryExemptReason: 'Kadın aday / Muaf',
      experienceYears: 5,
      currentTitle: 'Lead Frontend & React Engineer',
      bio: '5 yıldır modern SPA mimarileri, React, TypeScript, Tailwind ve WebGL görselleştirme projeleri yönetiyorum.',
      skills: ['React', 'TypeScript', 'Tailwind CSS', 'Redux', 'Next.js', 'REST API', 'Figma'],
      workExperiences: [
        {
          id: 'exp_3',
          companyName: 'Kreatif Dijital Ajans',
          title: 'Lead Frontend Geliştirici',
          startDate: '2021-03',
          isCurrent: true,
          description: 'Kurumsal SaaS arayüz tasarımı ve performans optimizasyonu (Core Web Vitals).',
        },
      ],
      educations: [
        {
          id: 'edu_2',
          institution: 'Ege Üniversitesi',
          degree: 'Lisans',
          department: 'Yazılım Mühendisliği',
          graduationYear: 2020,
        },
      ],
      cvFileName: 'Zeynep_Demir_Resume.pdf',
    });
    candUser2.setCandidateProfileId(candProf2.getId());

    // Candidate 3: Can Özkan - Mid-Level Developer, 3 years, Military: DEFERRED (Tecilli)
    const candUser3 = new User({
      id: 'usr_cand_3',
      email: 'can.ozkan@gmail.com',
      passwordHash: defaultPasswordHash,
      role: Role.USER,
      fullName: 'Can Özkan',
      phone: '0505 555 6677',
    });
    const candProf3 = new CandidateProfile({
      id: 'prof_3',
      userId: candUser3.getId(),
      firstName: 'Can',
      lastName: 'Özkan',
      phone: '0505 555 6677',
      city: 'Ankara',
      militaryStatus: MilitaryStatus.DEFERRED,
      experienceYears: 3,
      currentTitle: 'Fullstack Web Developer',
      bio: 'React ve Node.js/Spring ekosisteminde çalışan 3 yıllık deneyimli web yazılımcısı.',
      skills: ['React', 'Node.js', 'Spring Boot', 'MySQL', 'Git'],
      workExperiences: [
        {
          id: 'exp_4',
          companyName: 'Ankara Yazılım Evi',
          title: 'Web Developer',
          startDate: '2022-04',
          isCurrent: true,
          description: 'Müşteri portalleri ve CRM entegrasyonları geliştirme.',
        },
      ],
      educations: [
        {
          id: 'edu_3',
          institution: 'Hacettepe Üniversitesi',
          degree: 'Lisans',
          department: 'Bilişim Sistemleri',
          graduationYear: 2022,
        },
      ],
      cvFileName: 'Can_Ozkan_CV.pdf',
    });
    candUser3.setCandidateProfileId(candProf3.getId());

    // Candidate 4: Mehmet Kaya - Junior Developer, 1 year, Military: NOT_DONE
    const candUser4 = new User({
      id: 'usr_cand_4',
      email: 'mehmet.kaya@gmail.com',
      passwordHash: defaultPasswordHash,
      role: Role.USER,
      fullName: 'Mehmet Kaya',
      phone: '0535 666 7788',
    });
    const candProf4 = new CandidateProfile({
      id: 'prof_4',
      userId: candUser4.getId(),
      firstName: 'Mehmet',
      lastName: 'Kaya',
      phone: '0535 666 7788',
      city: 'Bursa',
      militaryStatus: MilitaryStatus.NOT_DONE,
      experienceYears: 1,
      currentTitle: 'Junior Software Engineer',
      bio: 'Yeni mezun, OOP prensiplerine ve katmanlı mimariye hakim hevesli yazılımcı.',
      skills: ['Java', 'React', 'HTML/CSS', 'PostgreSQL'],
      workExperiences: [],
      educations: [
        {
          id: 'edu_4',
          institution: 'Uludağ Üniversitesi',
          degree: 'Lisans',
          department: 'Bilgisayar Mühendisliği',
          graduationYear: 2024,
        },
      ],
      cvFileName: 'Mehmet_Kaya_CV.pdf',
    });
    candUser4.setCandidateProfileId(candProf4.getId());

    // Candidate 5: Ayşe Yıldız - Senior DevOps & Cloud, 7 years, Military: EXEMPT
    const candUser5 = new User({
      id: 'usr_cand_5',
      email: 'ayse.yildiz@gmail.com',
      passwordHash: defaultPasswordHash,
      role: Role.USER,
      fullName: 'Ayşe Yıldız',
      phone: '0544 777 8899',
    });
    const candProf5 = new CandidateProfile({
      id: 'prof_5',
      userId: candUser5.getId(),
      firstName: 'Ayşe',
      lastName: 'Yıldız',
      phone: '0544 777 8899',
      city: 'İstanbul',
      militaryStatus: MilitaryStatus.EXEMPT,
      militaryExemptReason: 'Kadın aday / Muaf',
      experienceYears: 7,
      currentTitle: 'Senior Cloud & DevOps Architect',
      bio: 'Kubernetes, AWS, CI/CD otomasyonları ve mikroservis altyapı yönetimi uzmanı.',
      skills: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD', 'Linux', 'Go'],
      workExperiences: [
        {
          id: 'exp_5',
          companyName: 'BulutNet Çözümleri',
          title: 'Senior DevOps Uzmanı',
          startDate: '2020-01',
          isCurrent: true,
          description: 'Multi-cloud altyapı optimizasyonu ve sıfır kesintili dağıtım süreçleri.',
        },
      ],
      educations: [
        {
          id: 'edu_5',
          institution: 'Boğaziçi Üniversitesi',
          degree: 'Lisans',
          department: 'Elektrik-Elektronik Mühendisliği',
          graduationYear: 2018,
        },
      ],
      cvFileName: 'Ayse_Yildiz_DevOps_CV.pdf',
    });
    candUser5.setCandidateProfileId(candProf5.getId());

    this.users.saveAll([candUser1, candUser2, candUser3, candUser4, candUser5]);
    this.candidates.saveAll([candProf1, candProf2, candProf3, candProf4, candProf5]);

    // 3. Seed Job Postings (Matching specific prompt requirements)
    const job1 = new JobPosting({
      id: 'job_1',
      companyId: comp1.getId(),
      companyName: comp1.getName(),
      title: 'Senior Fullstack Java & React Developer',
      department: 'Yazılım ve Ürün Mühendisliği',
      city: 'İstanbul',
      workType: WorkType.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR,
      minExperienceYears: 5,
      militaryRequirement: MilitaryStatus.DONE, // "askerliğini yapmış, 5 yıllık deneyime sahip"
      salaryMin: 95000,
      salaryMax: 140000,
      currency: 'TL',
      skillsRequired: ['Java', 'Spring Boot', 'React', 'PostgreSQL', 'Docker'],
      description: 'Finansal altyapılarımız için yüksek hacimli Spring Boot mikroservisleri ve React ön yüz bileşenleri geliştirecek Senior Takım Arkadaşı arıyoruz.',
      requirements: [
        'En az 5 yıl kurumsal Java/Spring tecrübesi',
        'Askerlik görevini tamamlamış veya muaf',
        'Spring Boot, JPA/Hibernate ve RESTful API uzmanlığı',
        'Modern React (Hooks, state management) deneyimi',
        'Clean Code ve S.O.L.I.D. prensiplerine bağlılık',
      ],
      isActive: true,
      applicationCount: 2,
    });

    const job2 = new JobPosting({
      id: 'job_2',
      companyId: comp1.getId(),
      companyName: comp1.getName(),
      title: 'Mid-Level Frontend Geliştirici (React & TypeScript)',
      department: 'Web Deneyimi',
      city: 'İstanbul',
      workType: WorkType.HYBRID,
      experienceLevel: ExperienceLevel.MID,
      minExperienceYears: 2,
      militaryRequirement: 'ANY',
      salaryMin: 65000,
      salaryMax: 90000,
      currency: 'TL',
      skillsRequired: ['React', 'TypeScript', 'Tailwind CSS', 'Next.js'],
      description: 'Kullanıcı dostu, modern ve yüksek performanslı kurumsal web arayüzleri inşa edecek Frontend Yazılımcısı aranmaktadır.',
      requirements: [
        'En az 2 yıl React & TypeScript deneyimi',
        'Tailwind CSS veya modern stil kütüphanelerine hakimiyet',
        'Responsive ve erişilebilir (a11y) tasarım kabiliyeti',
      ],
      isActive: true,
      applicationCount: 1,
    });

    const job3 = new JobPosting({
      id: 'job_3',
      companyId: comp2.getId(),
      companyName: comp2.getName(),
      title: 'DevOps & Site Reliability Engineer (SRE)',
      department: 'Altyapı ve Güvenlik',
      city: 'Ankara',
      workType: WorkType.REMOTE,
      experienceLevel: ExperienceLevel.SENIOR,
      minExperienceYears: 5,
      militaryRequirement: 'ANY',
      salaryMin: 110000,
      salaryMax: 160000,
      currency: 'TL',
      skillsRequired: ['Kubernetes', 'Docker', 'AWS', 'Terraform', 'CI/CD'],
      description: 'Bulut tabanlı Ar-Ge ürünlerimizin CI/CD hatlarını ve Kubernetes kümelerini yönetecek deneyimli altyapı mühendisi.',
      requirements: [
        'En az 5 yıl DevOps veya Altyapı tecrübesi',
        'Kubernetes, Helm ve AWS ortamlarında derinlemesine bilgi',
        'Infrastructure as Code (Terraform) tecrübesi',
      ],
      isActive: true,
      applicationCount: 1,
    });

    const job4 = new JobPosting({
      id: 'job_4',
      companyId: comp2.getId(),
      companyName: comp2.getName(),
      title: 'Junior Java & Spring Boot Yazılım Uzmanı',
      department: 'Ar-Ge Mühendisliği',
      city: 'Ankara',
      workType: WorkType.ONSITE,
      experienceLevel: ExperienceLevel.JUNIOR,
      minExperienceYears: 0,
      militaryRequirement: 'ANY',
      salaryMin: 45000,
      salaryMax: 60000,
      currency: 'TL',
      skillsRequired: ['Java', 'Spring Boot', 'MySQL', 'Git'],
      description: 'Kariyerine kurumsal Java projelerinde sağlam adımlarla başlamak isteyen, öğrenmeye açık genç yetenekler arıyoruz.',
      requirements: [
        'Üniversitelerin ilgili mühendislik bölümlerinden mezun',
        'Temel Java OOP ve Katmanlı Mimari bilgisi',
        'Araştırmacı ve takım çalışmasına yatkın',
      ],
      isActive: true,
      applicationCount: 1,
    });

    this.jobs.saveAll([job1, job2, job3, job4]);

    // 4. Seed Applications
    const app1 = new Application({
      id: 'app_1',
      jobId: job1.getId(),
      jobTitle: job1.getTitle(),
      companyId: comp1.getId(),
      companyName: comp1.getName(),
      candidateUserId: candUser1.getId(),
      candidateProfileId: candProf1.getId(),
      candidateFullName: candProf1.getFullName(),
      candidateEmail: candUser1.getEmail(),
      candidatePhone: candProf1.getPhone(),
      status: ApplicationStatus.INTERVIEW,
      coverLetter: 'Merhaba, 6 yıllık Spring Boot ve PostgreSQL tecrübem ile projenize hemen katkı sağlayabilirim. Askerlik vazifemi tamamlamış durumdayım.',
      notes: 'Teknik mülakat için tarih belirlendi (12 Kasım Saat 14:00).',
    });

    const app2 = new Application({
      id: 'app_2',
      jobId: job2.getId(),
      jobTitle: job2.getTitle(),
      companyId: comp1.getId(),
      companyName: comp1.getName(),
      candidateUserId: candUser2.getId(),
      candidateProfileId: candProf2.getId(),
      candidateFullName: candProf2.getFullName(),
      candidateEmail: candUser2.getEmail(),
      candidatePhone: candProf2.getPhone(),
      status: ApplicationStatus.REVIEWING,
      coverLetter: 'React ve modern TypeScript projelerindeki portfolyomu ekte sunuyorum.',
      notes: 'CV inceleniyor, referansları kuvvetli.',
    });

    const app3 = new Application({
      id: 'app_3',
      jobId: job3.getId(),
      jobTitle: job3.getTitle(),
      companyId: comp2.getId(),
      companyName: comp2.getName(),
      candidateUserId: candUser5.getId(),
      candidateProfileId: candProf5.getId(),
      candidateFullName: candProf5.getFullName(),
      candidateEmail: candUser5.getEmail(),
      candidatePhone: candProf5.getPhone(),
      status: ApplicationStatus.ACCEPTED,
      coverLetter: '7 yıllık Kubernetes ve AWS altyapı tecrübemle şirketinizde ölçeklenebilir altyapılar inşa etmek isterim.',
      notes: 'Teklif mektubu iletildi. Aday teklifi kabul etti.',
    });

    const app4 = new Application({
      id: 'app_4',
      jobId: job4.getId(),
      jobTitle: job4.getTitle(),
      companyId: comp2.getId(),
      companyName: comp2.getName(),
      candidateUserId: candUser4.getId(),
      candidateProfileId: candProf4.getId(),
      candidateFullName: candProf4.getFullName(),
      candidateEmail: candUser4.getEmail(),
      candidatePhone: candProf4.getPhone(),
      status: ApplicationStatus.APPLIED,
      coverLetter: 'Yeni mezun olarak Spring Boot ve OOP prensiplerine tutkuyla bağlıyım.',
    });

    this.applications.saveAll([app1, app2, app3, app4]);

    // 5. Seed Audit Logs
    const log1 = new AuditLog({
      level: LogLevel.AUDIT,
      action: 'SYSTEM_BOOTSTRAP',
      details: 'Katmanlı Mimari Veritabanı ve Repository katmanı başarıyla yüklendi. (Enes Öztürk)',
    });
    const log2 = new AuditLog({
      level: LogLevel.INFO,
      action: 'JOB_POSTED',
      userEmail: admin1.getEmail(),
      role: Role.ADMIN,
      details: 'Senior Fullstack Java & React Developer ilanı yayınlandı (İlan ID: job_1).',
    });
    const log3 = new AuditLog({
      level: LogLevel.INFO,
      action: 'APPLICATION_SUBMITTED',
      userEmail: candUser1.getEmail(),
      role: Role.USER,
      details: 'Ahmet Yılmaz, job_1 numaralı ilana başvuruda bulundu.',
    });
    const log4 = new AuditLog({
      level: LogLevel.SECURITY,
      action: 'LOGIN_SUCCESS',
      userEmail: admin1.getEmail(),
      role: Role.ADMIN,
      details: 'Şirket yetkilisi Maslak/İstanbul lokasyonundan başarıyla giriş yaptı.',
    });

    this.logs.saveAll([log1, log2, log3, log4]);

    this.saveToStorage();
  }

  public saveToStorage(): void {
    const dump = this.exportDatabaseToJSON();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dump));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }

  public exportDatabaseToJSON() {
    return {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      architect: 'Enes Öztürk',
      tables: {
        users: this.users.toArray().map(u => u.toJSON()),
        candidate_profiles: this.candidates.toArray().map(c => c.toJSON()),
        companies: this.companies.toArray().map(c => c.toJSON()),
        job_postings: this.jobs.toArray().map(j => j.toJSON()),
        job_applications: this.applications.toArray().map(a => a.toJSON()),
        audit_logs: this.logs.toArray().map(l => l.toJSON()),
      },
    };
  }

  public hydrateFromJSON(dump: any): void {
    if (!dump || !dump.tables) return;

    this.users.clear();
    this.candidates.clear();
    this.companies.clear();
    this.jobs.clear();
    this.applications.clear();
    this.logs.clear();

    const t = dump.tables;

    if (Array.isArray(t.users)) {
      t.users.forEach((item: any) => this.users.save(new User(item)));
    }
    if (Array.isArray(t.candidate_profiles)) {
      t.candidate_profiles.forEach((item: any) => this.candidates.save(new CandidateProfile(item)));
    }
    if (Array.isArray(t.companies)) {
      t.companies.forEach((item: any) => this.companies.save(new Company(item)));
    }
    if (Array.isArray(t.job_postings)) {
      t.job_postings.forEach((item: any) => this.jobs.save(new JobPosting(item)));
    }
    if (Array.isArray(t.job_applications)) {
      t.job_applications.forEach((item: any) => this.applications.save(new Application(item)));
    }
    if (Array.isArray(t.audit_logs)) {
      t.audit_logs.forEach((item: any) => this.logs.save(new AuditLog(item)));
    }
  }
}
