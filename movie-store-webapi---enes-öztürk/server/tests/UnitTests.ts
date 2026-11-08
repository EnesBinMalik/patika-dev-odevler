/**
 * Comprehensive Unit Test Suite for Movie Store WebApi
 * Author: Enes Öztürk
 * Covers Validators, AutoMapper, Business Services, Relational Integrity, and Purchase Authorization.
 */

import { Database } from '../data/Database.ts';
import { MovieService, ActorService, DirectorService, CustomerService, OrderService } from '../services/Services.ts';
import { MovieCreateValidator, ActorCreateValidator, CustomerRegisterValidator, OrderCreateValidator } from '../validation/EntityValidators.ts';
import { ValidationException } from '../validation/Validator.ts';
import { AutoMapper, IMappingContext } from '../mapping/AutoMapper.ts';
import { BusinessRuleException, AuthenticationException } from '../exceptions/Exceptions.ts';

export interface TestResultItem {
  id: string;
  category: 'Validation' | 'AutoMapper' | 'Business Logic' | 'Relational Integrity' | 'Authorization';
  testName: string;
  passed: boolean;
  durationMs: number;
  message?: string;
  details?: any;
}

export interface TestSuiteReport {
  timestamp: string;
  totalTests: number;
  passed: number;
  failed: number;
  durationMs: number;
  results: TestResultItem[];
}

export class UnitTestRunner {
  public static async runAllTests(): Promise<TestSuiteReport> {
    const startTime = Date.now();
    const results: TestResultItem[] = [];

    // Temporary test database sandbox
    const db = new Database();
    db.seed();

    const movieService = new MovieService(db);
    const actorService = new ActorService(db);
    const directorService = new DirectorService(db);
    const customerService = new CustomerService(db);
    const orderService = new OrderService(db);

    const runTest = (
      id: string,
      category: TestResultItem['category'],
      testName: string,
      fn: () => void | Promise<void>
    ) => {
      const tStart = Date.now();
      try {
        fn();
        results.push({
          id,
          category,
          testName,
          passed: true,
          durationMs: Date.now() - tStart,
          message: 'Test başarıyla tamamlandı (PASSED).',
        });
      } catch (err: any) {
        results.push({
          id,
          category,
          testName,
          passed: false,
          durationMs: Date.now() - tStart,
          message: err.message || 'Beklenmeyen hata',
          details: err.stack,
        });
      }
    };

    // ==========================================
    // 1. VALIDATION TESTS
    // ==========================================
    runTest('VAL-01', 'Validation', 'MovieCreateValidator: Eksik film adı için doğrulama hatası vermelidir', () => {
      const validator = new MovieCreateValidator();
      const res = validator.validate({
        title: '',
        year: 2022,
        genreId: 1,
        directorId: 1,
        actorIds: [1],
        price: 50,
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'title')) {
        throw new Error('Eksik film adı doğrulamayı geçmemeliydi.');
      }
    });

    runTest('VAL-02', 'Validation', 'MovieCreateValidator: 1888 yılından küçük film yılı reddedilmelidir', () => {
      const validator = new MovieCreateValidator();
      const res = validator.validate({
        title: 'Antik Film',
        year: 1800,
        genreId: 1,
        directorId: 1,
        actorIds: [1],
        price: 50,
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'year')) {
        throw new Error('1888 yılı öncesi reddedilmeliydi.');
      }
    });

    runTest('VAL-03', 'Validation', 'MovieCreateValidator: Fiyat 0 veya negatif ise reddedilmelidir', () => {
      const validator = new MovieCreateValidator();
      const res = validator.validate({
        title: 'Test Movie',
        year: 2020,
        genreId: 1,
        directorId: 1,
        actorIds: [1],
        price: -10,
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'price')) {
        throw new Error('Negatif fiyat kabul edilmemeliydi.');
      }
    });

    runTest('VAL-04', 'Validation', 'MovieCreateValidator: En az 1 oyuncu bulunmalıdır', () => {
      const validator = new MovieCreateValidator();
      const res = validator.validate({
        title: 'Oyuncusuz Film',
        year: 2020,
        genreId: 1,
        directorId: 1,
        actorIds: [],
        price: 30,
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'actorIds')) {
        throw new Error('Oyuncusuz film doğrulama hatası üretmelidir.');
      }
    });

    runTest('VAL-05', 'Validation', 'ActorCreateValidator: 2 karakterden kısa oyuncu adı reddedilmelidir', () => {
      const validator = new ActorCreateValidator();
      const res = validator.validate({ firstName: 'A', lastName: 'Yılmaz' });
      if (res.isValid) {
        throw new Error('Çok kısa ad kabul edilmemeliydi.');
      }
    });

    runTest('VAL-06', 'Validation', 'CustomerRegisterValidator: Geçersiz e-posta formatı reddedilmelidir', () => {
      const validator = new CustomerRegisterValidator();
      const res = validator.validate({
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'gecersiz-email',
        password: 'password123',
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'email')) {
        throw new Error('Geçersiz e-posta kabul edilmemeliydi.');
      }
    });

    runTest('VAL-07', 'Validation', 'CustomerRegisterValidator: 6 karakterden kısa şifre reddedilmelidir', () => {
      const validator = new CustomerRegisterValidator();
      const res = validator.validate({
        firstName: 'Mehmet',
        lastName: 'Kaya',
        email: 'mehmet@example.com',
        password: '123',
      });
      if (res.isValid || !res.errors.some(e => e.propertyName === 'password')) {
        throw new Error('Kısa şifre reddedilmeliydi.');
      }
    });

    runTest('VAL-08', 'Validation', 'OrderCreateValidator: Geçersiz Film ID si reddedilmelidir', () => {
      const validator = new OrderCreateValidator();
      const res = validator.validate({ movieId: 0 });
      if (res.isValid) {
        throw new Error('0 ID li film siparişi reddedilmeliydi.');
      }
    });

    // ==========================================
    // 2. AUTOMAPPER TESTS
    // ==========================================
    runTest('MAP-01', 'AutoMapper', 'AutoMapper: Movie -> MovieListDto ilişkileri ve isimleri çözmelidir', () => {
      const mockContext: IMappingContext = {
        getGenreById: () => ({ id: 1, name: 'Aksiyon' }),
        getDirectorById: () => ({ id: 1, firstName: 'Christopher', lastName: 'Nolan', createdAt: '' }),
        getActorById: (id) => ({ id, firstName: 'Christian', lastName: 'Bale', createdAt: '' }),
        getCustomerById: () => undefined,
        getMovieById: () => undefined,
        getMoviesForActor: () => [],
        getMoviesForDirector: () => [],
        getOrdersForCustomer: () => [],
      };

      const movie = {
        id: 99,
        title: 'Batman Begins',
        year: 2005,
        genreId: 1,
        directorId: 1,
        actorIds: [1],
        price: 40,
        isActive: true,
        createdAt: '',
        updatedAt: '',
      };

      const dto = AutoMapper.toMovieListDto(movie, mockContext);
      if (dto.directorName !== 'Christopher Nolan' || dto.genre !== 'Aksiyon' || !dto.actors.includes('Christian Bale')) {
        throw new Error('AutoMapper ilişki çözümlemesi hatalı.');
      }
    });

    runTest('MAP-02', 'AutoMapper', 'AutoMapper: Customer DTO larında hassas parola verisi asla bulunmamalıdır', () => {
      const mockContext: IMappingContext = {
        getGenreById: () => undefined,
        getDirectorById: () => undefined,
        getActorById: () => undefined,
        getCustomerById: () => undefined,
        getMovieById: () => undefined,
        getMoviesForActor: () => [],
        getMoviesForDirector: () => [],
        getOrdersForCustomer: () => [],
      };

      const customer = {
        id: 1,
        firstName: 'Ali',
        lastName: 'Veli',
        email: 'ali@example.com',
        passwordHash: 'gizli_hash_degeri',
        favoriteGenreIds: [],
        isActive: true,
        createdAt: '',
      };

      const listDto = AutoMapper.toCustomerListDto(customer, mockContext);
      const detailDto = AutoMapper.toCustomerDetailDto(customer, mockContext);

      if ('passwordHash' in listDto || 'passwordHash' in detailDto) {
        throw new Error('Güvenlik ihlali: passwordHash DTO nesnesine sızdı!');
      }
    });

    // ==========================================
    // 3. BUSINESS LOGIC & SERVICES
    // ==========================================
    runTest('BUS-01', 'Business Logic', 'MovieService: Film başarıyla oluşturulabilmeli ve listelenebilmelidir', () => {
      const created = movieService.create({
        title: 'Oppenheimer',
        year: 2023,
        genreId: 3, // Dram
        directorId: 1, // Nolan
        actorIds: [3], // Cillian Murphy
        price: 79.90,
      });

      if (!created || created.title !== 'Oppenheimer' || created.directorName !== 'Christopher Nolan') {
        throw new Error('Film oluşturulamadı veya yönetmen eşleşmedi.');
      }
    });

    runTest('BUS-02', 'Business Logic', 'CustomerService: Mevcut e-posta adresi ile mükerrer kayıt engellenmelidir', () => {
      let threw = false;
      try {
        customerService.register({
          firstName: 'Enes',
          lastName: 'Öztürk',
          email: 'enes@moviestore.com', // Seeded duplicate email
          password: 'password123',
        });
      } catch (err) {
        threw = true;
        if (!(err instanceof BusinessRuleException)) {
          throw new Error('Beklenen BusinessRuleException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('Mükerrer e-posta engellenmedi.');
    });

    runTest('BUS-03', 'Business Logic', 'CustomerService: Yanlış şifre ile giriş engellenmelidir', () => {
      let threw = false;
      try {
        customerService.login({
          email: 'enes@moviestore.com',
          password: 'yanlis_sifre_123',
        });
      } catch (err) {
        threw = true;
        if (!(err instanceof AuthenticationException)) {
          throw new Error('Beklenen AuthenticationException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('Hatalı şifre reddedilmedi.');
    });

    // ==========================================
    // 4. RELATIONAL INTEGRITY (Gereksinim 9)
    // ==========================================
    runTest('REL-01', 'Relational Integrity', 'Veri Tutarlılığı: Aktif filmde oynayan oyuncu SİLİNEMEZ', () => {
      // Leonardo DiCaprio (ID: 1) plays in Inception (ID: 1)
      let threw = false;
      try {
        actorService.delete(1);
      } catch (err) {
        threw = true;
        if (!(err instanceof BusinessRuleException)) {
          throw new Error('Beklenen BusinessRuleException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('İlişkili filmleri bulunan oyuncunun silinmesine izin verildi!');
    });

    runTest('REL-02', 'Relational Integrity', 'Veri Tutarlılığı: Aktif filmi bulunan yönetmen SİLİNEMEZ', () => {
      // Christopher Nolan (ID: 1) directed Inception, Interstellar, The Dark Knight
      let threw = false;
      try {
        directorService.delete(1);
      } catch (err) {
        threw = true;
        if (!(err instanceof BusinessRuleException)) {
          throw new Error('Beklenen BusinessRuleException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('Yönettiği filmler bulunan yönetmenin silinmesine izin verildi!');
    });

    runTest('REL-03', 'Relational Integrity', 'Veri Tutarlılığı: Siparişi bulunan müşteri SİLİNEMEZ', () => {
      // Customer 1 has order history
      let threw = false;
      try {
        customerService.delete(1);
      } catch (err) {
        threw = true;
        if (!(err instanceof BusinessRuleException)) {
          throw new Error('Beklenen BusinessRuleException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('Siparişi bulunan müşteri silinmeye çalışıldığında hata fırlatılmadı!');
    });

    // ==========================================
    // 5. SATIN ALMA, SOFT DELETE & ORDER SNAPSHOT (Gereksinim 5 & 6)
    // ==========================================
    runTest('AUTH-01', 'Authorization', 'OrderService: Müşteri filmi satın alabilmeli ve sipariş oluşturulmalıdır', () => {
      const order = orderService.purchaseMovie(1, { movieId: 3 }); // Customer 1 purchases The Dark Knight
      if (!order || order.movieId !== 3 || order.customerId !== 1) {
        throw new Error('Satın alma siparişi oluşturulamadı.');
      }
    });

    runTest('AUTH-02', 'Authorization', 'OrderService: Müşteri aynı türde veya tekrar film satın alabilir (kısıtlama yok)', () => {
      // Repeat purchase of same movie or genre is permitted as requested in requirements
      const order2 = orderService.purchaseMovie(1, { movieId: 3 });
      if (!order2 || order2.movieId !== 3) {
        throw new Error('Tekrar satın almaya izin verilmedi.');
      }
    });

    runTest('AUTH-03', 'Authorization', 'Soft Delete: Satın alınan film silindiğinde sipariş verisi korunmalıdır', () => {
      // Movie 1 (Inception) has order history
      const deleteResult = movieService.delete(1);
      if (!deleteResult.softDeleted) {
        throw new Error('Sipariş geçmişi olan film soft delete yapılmalıydı.');
      }

      // Check order history: Order still has movieTitleSnapshot and price
      const orders = orderService.getOrdersByCustomerId(1);
      const inceptionOrder = orders.find(o => o.movieId === 1);
      if (!inceptionOrder || inceptionOrder.movieTitle !== 'Inception') {
        throw new Error('Sipariş verisi veya film başlık snapshot ı kayboldu!');
      }

      // Inactive movie cannot be purchased again
      let threw = false;
      try {
        orderService.purchaseMovie(1, { movieId: 1 });
      } catch (err) {
        threw = true;
        if (!(err instanceof BusinessRuleException)) {
          throw new Error('Pasif film satın alma girişiminde BusinessRuleException fırlatılmadı.');
        }
      }
      if (!threw) throw new Error('Pasife alınan filmin satın alınmasına izin verildi!');
    });

    const totalDuration = Date.now() - startTime;
    const passedCount = results.filter(r => r.passed).length;
    const failedCount = results.filter(r => !r.passed).length;

    return {
      timestamp: new Date().toISOString(),
      totalTests: results.length,
      passed: passedCount,
      failed: failedCount,
      durationMs: totalDuration,
      results,
    };
  }
}
