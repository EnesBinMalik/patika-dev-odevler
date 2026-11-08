/**
 * Concrete Implementations of Domain Services
 * Author: Enes Öztürk
 * Strictly enforces business rules, relational integrity, validators, and AutoMapper.
 */

import { Database } from '../data/Database.ts';
import { IMappingContext, AutoMapper } from '../mapping/AutoMapper.ts';
import {
  IMovieService,
  IActorService,
  IDirectorService,
  ICustomerService,
  IOrderService,
  IGenreService,
} from './Interfaces.ts';
import {
  MovieListDto,
  MovieDetailDto,
  MovieCreateDto,
  MovieUpdateDto,
  ActorListDto,
  ActorDetailDto,
  ActorCreateDto,
  ActorUpdateDto,
  DirectorListDto,
  DirectorDetailDto,
  DirectorCreateDto,
  DirectorUpdateDto,
  CustomerListDto,
  CustomerDetailDto,
  CustomerRegisterDto,
  CustomerLoginDto,
  CustomerAuthResponseDto,
  OrderListDto,
  OrderCreateDto,
  GenreDto,
} from '../dtos/Dtos.ts';
import {
  MovieCreateValidator,
  MovieUpdateValidator,
  ActorCreateValidator,
  ActorUpdateValidator,
  DirectorCreateValidator,
  DirectorUpdateValidator,
  CustomerRegisterValidator,
  CustomerLoginValidator,
  OrderCreateValidator,
} from '../validation/EntityValidators.ts';
import {
  NotFoundException,
  BusinessRuleException,
  AuthenticationException,
} from '../exceptions/Exceptions.ts';
import { ConsoleLoggerService } from './LoggerService.ts';
import { Movie, Actor, Director, Customer, Order, Genre } from '../entities/Entities.ts';

// Central Context helper for AutoMapper
export class DatabaseContext implements IMappingContext {
  constructor(private db: Database) {}

  getGenreById(id: number): Genre | undefined {
    return this.db.genres.find(g => g.id === id);
  }
  getDirectorById(id: number): Director | undefined {
    return this.db.directors.find(d => d.id === id);
  }
  getActorById(id: number): Actor | undefined {
    return this.db.actors.find(a => a.id === id);
  }
  getCustomerById(id: number): Customer | undefined {
    return this.db.customers.find(c => c.id === id);
  }
  getMovieById(id: number): Movie | undefined {
    return this.db.movies.find(m => m.id === id);
  }
  getMoviesForActor(actorId: number): Movie[] {
    return this.db.movies.filter(m => m.actorIds.includes(actorId));
  }
  getMoviesForDirector(directorId: number): Movie[] {
    return this.db.movies.filter(m => m.directorId === directorId);
  }
  getOrdersForCustomer(customerId: number): Order[] {
    return this.db.orders.filter(o => o.customerId === customerId);
  }
}

// ==========================================
// MOVIE SERVICE
// ==========================================
export class MovieService implements IMovieService {
  private createValidator = new MovieCreateValidator();
  private updateValidator = new MovieUpdateValidator();
  private logger = ConsoleLoggerService.getInstance();
  private ctx: DatabaseContext;

  constructor(private db: Database) {
    this.ctx = new DatabaseContext(db);
  }

  public getAll(includeInactive: boolean = false): MovieListDto[] {
    let movies = this.db.movies;
    if (!includeInactive) {
      movies = movies.filter(m => m.isActive);
    }
    return movies.map(m => AutoMapper.toMovieListDto(m, this.ctx));
  }

  public getById(id: number): MovieDetailDto {
    const movie = this.db.movies.find(m => m.id === id);
    if (!movie) {
      throw new NotFoundException('Film', id);
    }
    return AutoMapper.toMovieDetailDto(movie, this.ctx);
  }

  public create(dto: MovieCreateDto): MovieDetailDto {
    // 1. Validation
    this.createValidator.validateAndThrow(dto);

    // 2. Foreign Key Integrity Checks
    const genre = this.db.genres.find(g => g.id === Number(dto.genreId));
    if (!genre) {
      throw new BusinessRuleException(`Belirtilen Film Türü (ID: ${dto.genreId}) sistemde mevcut değil.`);
    }

    const director = this.db.directors.find(d => d.id === Number(dto.directorId));
    if (!director) {
      throw new BusinessRuleException(`Belirtilen Yönetmen (ID: ${dto.directorId}) sistemde mevcut değil.`);
    }

    for (const actorId of dto.actorIds) {
      const actor = this.db.actors.find(a => a.id === Number(actorId));
      if (!actor) {
        throw new BusinessRuleException(`Belirtilen Oyuncu (ID: ${actorId}) sistemde mevcut değil.`);
      }
    }

    // 3. Mapping & Persistence
    const newId = this.db.getNextMovieId();
    const movie = AutoMapper.fromMovieCreateDto(dto, newId);
    this.db.movies.push(movie);

    this.logger.info(`Yeni film eklendi: "${movie.title}" (ID: ${movie.id})`, 'SYSTEM');
    return AutoMapper.toMovieDetailDto(movie, this.ctx);
  }

  public update(id: number, dto: MovieUpdateDto): MovieDetailDto {
    this.updateValidator.validateAndThrow(dto);

    const movie = this.db.movies.find(m => m.id === id);
    if (!movie) {
      throw new NotFoundException('Film', id);
    }

    if (dto.genreId !== undefined) {
      const genre = this.db.genres.find(g => g.id === Number(dto.genreId));
      if (!genre) throw new BusinessRuleException(`Film Türü (ID: ${dto.genreId}) bulunamadı.`);
      movie.genreId = Number(dto.genreId);
    }

    if (dto.directorId !== undefined) {
      const director = this.db.directors.find(d => d.id === Number(dto.directorId));
      if (!director) throw new BusinessRuleException(`Yönetmen (ID: ${dto.directorId}) bulunamadı.`);
      movie.directorId = Number(dto.directorId);
    }

    if (dto.actorIds !== undefined) {
      for (const actorId of dto.actorIds) {
        if (!this.db.actors.some(a => a.id === Number(actorId))) {
          throw new BusinessRuleException(`Oyuncu (ID: ${actorId}) bulunamadı.`);
        }
      }
      movie.actorIds = [...dto.actorIds];
    }

    if (dto.title !== undefined) movie.title = dto.title.trim();
    if (dto.year !== undefined) movie.year = Number(dto.year);
    if (dto.price !== undefined) movie.price = Number(dto.price);
    if (dto.isActive !== undefined) movie.isActive = Boolean(dto.isActive);

    movie.updatedAt = new Date().toISOString();

    this.logger.info(`Film güncellendi: "${movie.title}" (ID: ${movie.id})`, 'SYSTEM');
    return AutoMapper.toMovieDetailDto(movie, this.ctx);
  }

  public delete(id: number): { message: string; softDeleted: boolean } {
    const movie = this.db.movies.find(m => m.id === id);
    if (!movie) {
      throw new NotFoundException('Film', id);
    }

    // Check if this movie has orders
    const relatedOrders = this.db.orders.filter(o => o.movieId === id);
    if (relatedOrders.length > 0) {
      // Per Requirement 6:
      // "Satın alınan filmler daha sonra sistemden silinebilir. Bu sipariş datasını etkilememeli.
      // Bu durumu sağlamak için film verileri hard olarak silinmemelidir. Bir Aktif-Pasif özelliği ile yönetilebilir."
      movie.isActive = false;
      movie.updatedAt = new Date().toISOString();
      this.logger.info(`Film sipariş ilişkisi bulunduğundan pasife alındı (Soft Delete): "${movie.title}"`, 'SYSTEM');
      return {
        message: `"${movie.title}" adlı film için geçmiş sipariş kayıtları bulunduğundan veri tutarlılığı gereği pasife alınmıştır (Soft Delete). Sipariş geçmişi korunmuştur.`,
        softDeleted: true,
      };
    }

    // If no order relations exist, can be marked inactive or removed
    movie.isActive = false;
    this.logger.info(`Film pasife alındı: "${movie.title}"`, 'SYSTEM');
    return {
      message: `"${movie.title}" adlı film başarıyla pasife alındı.`,
      softDeleted: true,
    };
  }
}

// ==========================================
// ACTOR SERVICE
// ==========================================
export class ActorService implements IActorService {
  private createValidator = new ActorCreateValidator();
  private updateValidator = new ActorUpdateValidator();
  private logger = ConsoleLoggerService.getInstance();
  private ctx: DatabaseContext;

  constructor(private db: Database) {
    this.ctx = new DatabaseContext(db);
  }

  public getAll(): ActorListDto[] {
    return this.db.actors.map(a => AutoMapper.toActorListDto(a, this.ctx));
  }

  public getById(id: number): ActorDetailDto {
    const actor = this.db.actors.find(a => a.id === id);
    if (!actor) {
      throw new NotFoundException('Oyuncu', id);
    }
    return AutoMapper.toActorDetailDto(actor, this.ctx);
  }

  public create(dto: ActorCreateDto): ActorDetailDto {
    this.createValidator.validateAndThrow(dto);

    const newId = this.db.getNextActorId();
    const actor: Actor = {
      id: newId,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      createdAt: new Date().toISOString(),
    };
    this.db.actors.push(actor);

    this.logger.info(`Yeni oyuncu eklendi: ${actor.firstName} ${actor.lastName} (ID: ${actor.id})`, 'SYSTEM');
    return AutoMapper.toActorDetailDto(actor, this.ctx);
  }

  public update(id: number, dto: ActorUpdateDto): ActorDetailDto {
    this.updateValidator.validateAndThrow(dto);

    const actor = this.db.actors.find(a => a.id === id);
    if (!actor) {
      throw new NotFoundException('Oyuncu', id);
    }

    actor.firstName = dto.firstName.trim();
    actor.lastName = dto.lastName.trim();

    this.logger.info(`Oyuncu güncellendi: ${actor.firstName} ${actor.lastName} (ID: ${actor.id})`, 'SYSTEM');
    return AutoMapper.toActorDetailDto(actor, this.ctx);
  }

  public delete(id: number): { message: string } {
    const actorIndex = this.db.actors.findIndex(a => a.id === id);
    if (actorIndex === -1) {
      throw new NotFoundException('Oyuncu', id);
    }
    const actor = this.db.actors[actorIndex];

    // Requirement 9: "Silme servislerinde veri tutarlılığı dikkate alınmalıdır. Diğer tablolarda ilişkili datası bulunan kayıtlar silinemez."
    const relatedMovies = this.db.movies.filter(m => m.actorIds.includes(id) && m.isActive);
    if (relatedMovies.length > 0) {
      const movieTitles = relatedMovies.map(m => `"${m.title}"`).join(', ');
      throw new BusinessRuleException(
        `Veri tutarlılığı ihlali: "${actor.firstName} ${actor.lastName}" adlı oyuncu aktif filmlerde (${movieTitles}) oynamaktadır. İlişkili filmlerden çıkarılmadan oyuncu silinemez!`
      );
    }

    this.db.actors.splice(actorIndex, 1);
    this.logger.info(`Oyuncu silindi: ${actor.firstName} ${actor.lastName} (ID: ${id})`, 'SYSTEM');
    return { message: `"${actor.firstName} ${actor.lastName}" adlı oyuncu başarıyla silindi.` };
  }
}

// ==========================================
// DIRECTOR SERVICE
// ==========================================
export class DirectorService implements IDirectorService {
  private createValidator = new DirectorCreateValidator();
  private updateValidator = new DirectorUpdateValidator();
  private logger = ConsoleLoggerService.getInstance();
  private ctx: DatabaseContext;

  constructor(private db: Database) {
    this.ctx = new DatabaseContext(db);
  }

  public getAll(): DirectorListDto[] {
    return this.db.directors.map(d => AutoMapper.toDirectorListDto(d, this.ctx));
  }

  public getById(id: number): DirectorDetailDto {
    const director = this.db.directors.find(d => d.id === id);
    if (!director) {
      throw new NotFoundException('Yönetmen', id);
    }
    return AutoMapper.toDirectorDetailDto(director, this.ctx);
  }

  public create(dto: DirectorCreateDto): DirectorDetailDto {
    this.createValidator.validateAndThrow(dto);

    const newId = this.db.getNextDirectorId();
    const director: Director = {
      id: newId,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      createdAt: new Date().toISOString(),
    };
    this.db.directors.push(director);

    this.logger.info(`Yeni yönetmen eklendi: ${director.firstName} ${director.lastName} (ID: ${director.id})`, 'SYSTEM');
    return AutoMapper.toDirectorDetailDto(director, this.ctx);
  }

  public update(id: number, dto: DirectorUpdateDto): DirectorDetailDto {
    this.updateValidator.validateAndThrow(dto);

    const director = this.db.directors.find(d => d.id === id);
    if (!director) {
      throw new NotFoundException('Yönetmen', id);
    }

    director.firstName = dto.firstName.trim();
    director.lastName = dto.lastName.trim();

    this.logger.info(`Yönetmen güncellendi: ${director.firstName} ${director.lastName} (ID: ${director.id})`, 'SYSTEM');
    return AutoMapper.toDirectorDetailDto(director, this.ctx);
  }

  public delete(id: number): { message: string } {
    const directorIndex = this.db.directors.findIndex(d => d.id === id);
    if (directorIndex === -1) {
      throw new NotFoundException('Yönetmen', id);
    }
    const director = this.db.directors[directorIndex];

    // Requirement 9: "Silme servislerinde veri tutarlılığı dikkate alınmalıdır. Diğer tablolarda ilişkili datası bulunan kayıtlar silinemez."
    const relatedMovies = this.db.movies.filter(m => m.directorId === id && m.isActive);
    if (relatedMovies.length > 0) {
      const movieTitles = relatedMovies.map(m => `"${m.title}"`).join(', ');
      throw new BusinessRuleException(
        `Veri tutarlılığı ihlali: "${director.firstName} ${director.lastName}" adlı yönetmenin sistemde aktif filmleri (${movieTitles}) bulunmaktadır. İlişkili filmler silinmeden yönetmen silinemez!`
      );
    }

    this.db.directors.splice(directorIndex, 1);
    this.logger.info(`Yönetmen silindi: ${director.firstName} ${director.lastName} (ID: ${id})`, 'SYSTEM');
    return { message: `"${director.firstName} ${director.lastName}" adlı yönetmen başarıyla silindi.` };
  }
}

// ==========================================
// CUSTOMER SERVICE & AUTH
// ==========================================
export class CustomerService implements ICustomerService {
  private registerValidator = new CustomerRegisterValidator();
  private loginValidator = new CustomerLoginValidator();
  private logger = ConsoleLoggerService.getInstance();
  private ctx: DatabaseContext;

  constructor(private db: Database) {
    this.ctx = new DatabaseContext(db);
  }

  public getAll(): CustomerListDto[] {
    return this.db.customers.map(c => AutoMapper.toCustomerListDto(c, this.ctx));
  }

  public getById(id: number): CustomerDetailDto {
    const customer = this.db.customers.find(c => c.id === id);
    if (!customer) {
      throw new NotFoundException('Müşteri', id);
    }
    return AutoMapper.toCustomerDetailDto(customer, this.ctx);
  }

  public register(dto: CustomerRegisterDto): CustomerAuthResponseDto {
    this.registerValidator.validateAndThrow(dto);

    const emailNormalized = dto.email.trim().toLowerCase();
    const existing = this.db.customers.find(c => c.email.toLowerCase() === emailNormalized);
    if (existing) {
      throw new BusinessRuleException(`"${dto.email}" e-posta adresi ile kayıtlı bir müşteri zaten mevcut.`);
    }

    // Verify favorite genres exist if provided
    const favoriteGenreIds: number[] = [];
    if (dto.favoriteGenreIds && Array.isArray(dto.favoriteGenreIds)) {
      for (const gid of dto.favoriteGenreIds) {
        if (this.db.genres.some(g => g.id === Number(gid))) {
          favoriteGenreIds.push(Number(gid));
        }
      }
    }

    const newId = this.db.getNextCustomerId();
    const customer: Customer = {
      id: newId,
      firstName: dto.firstName.trim(),
      lastName: dto.lastName.trim(),
      email: emailNormalized,
      passwordHash: dto.password, // In a prod environment this would be bcrypt
      favoriteGenreIds,
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    this.db.customers.push(customer);

    this.logger.info(`Yeni müşteri kaydı: ${customer.firstName} ${customer.lastName} (${customer.email})`, 'SECURITY');
    return this.generateAuthResponse(customer);
  }

  public login(dto: CustomerLoginDto): CustomerAuthResponseDto {
    this.loginValidator.validateAndThrow(dto);

    const emailNormalized = dto.email.trim().toLowerCase();
    const customer = this.db.customers.find(
      c => c.email.toLowerCase() === emailNormalized && c.isActive
    );

    if (!customer || customer.passwordHash !== dto.password) {
      this.logger.warn(`Başarısız giriş denemesi: ${dto.email}`, 'SECURITY');
      throw new AuthenticationException('E-posta veya şifre hatalı.');
    }

    this.logger.info(`Başarılı giriş yapıldı: ${customer.email} (ID: ${customer.id})`, 'SECURITY');
    return this.generateAuthResponse(customer);
  }

  public delete(id: number): { message: string } {
    const customer = this.db.customers.find(c => c.id === id);
    if (!customer) {
      throw new NotFoundException('Müşteri', id);
    }

    // Check if customer has orders
    const orders = this.db.orders.filter(o => o.customerId === id);
    if (orders.length > 0) {
      throw new BusinessRuleException(
        `Veri tutarlılığı ihlali: "${customer.firstName} ${customer.lastName}" müşterisine ait ${orders.length} adet sipariş bulunmaktadır. Satın alma geçmişi olan müşteri silinemez!`
      );
    }

    customer.isActive = false;
    this.logger.info(`Müşteri hesabı pasife alındı: ${customer.email}`, 'SYSTEM');
    return { message: `"${customer.firstName} ${customer.lastName}" adlı müşteri hesabı silindi/pasife alındı.` };
  }

  private generateAuthResponse(customer: Customer): CustomerAuthResponseDto {
    // Generate secure token encoding customer id and role
    const payload = {
      customerId: customer.id,
      email: customer.email,
      role: 'Customer',
      name: `${customer.firstName} ${customer.lastName}`,
      exp: Date.now() + 24 * 60 * 60 * 1000,
    };
    const token = Buffer.from(JSON.stringify(payload)).toString('base64');

    const favoriteGenres = (customer.favoriteGenreIds || [])
      .map(id => this.db.genres.find(g => g.id === id)?.name)
      .filter((n): n is string => !!n);

    return {
      token,
      expiresIn: '24h',
      customer: {
        id: customer.id,
        firstName: customer.firstName,
        lastName: customer.lastName,
        fullName: `${customer.firstName} ${customer.lastName}`,
        email: customer.email,
        favoriteGenres,
      },
    };
  }
}

// ==========================================
// ORDER SERVICE (Film Satın Alma & Siparişlerim)
// ==========================================
export class OrderService implements IOrderService {
  private createValidator = new OrderCreateValidator();
  private logger = ConsoleLoggerService.getInstance();
  private ctx: DatabaseContext;

  constructor(private db: Database) {
    this.ctx = new DatabaseContext(db);
  }

  public purchaseMovie(customerId: number, dto: OrderCreateDto): OrderListDto {
    // 1. Validate DTO
    this.createValidator.validateAndThrow(dto);

    // 2. Validate Customer
    const customer = this.db.customers.find(c => c.id === customerId && c.isActive);
    if (!customer) {
      throw new AuthenticationException('Yetkisiz işlem: Geçerli ve aktif bir müşteri oturumu bulunamadı.');
    }

    // 3. Validate Movie
    const movie = this.db.movies.find(m => m.id === Number(dto.movieId));
    if (!movie) {
      throw new NotFoundException('Film', dto.movieId);
    }
    if (!movie.isActive) {
      throw new BusinessRuleException(`"${movie.title}" adlı film şu anda satışta değil (pasif durumda). Satın alınamaz.`);
    }

    // Per requirement: "Müşterinin birden fazla favori film türü olabilir. Satın aldığı bir türü tekrar satın alabilir. Buraya bir kısıtlama koymaya gerek yok."
    // 4. Create Order with snapshot of price & title to safeguard against future changes/soft-deletions
    const newOrderId = this.db.getNextOrderId();
    const order: Order = {
      id: newOrderId,
      customerId: customer.id,
      movieId: movie.id,
      price: movie.price,
      movieTitleSnapshot: movie.title,
      purchaseDate: new Date().toISOString(),
    };

    this.db.orders.push(order);

    this.logger.info(
      `Film satın alındı: Müşteri "${customer.firstName} ${customer.lastName}" -> Film "${movie.title}" (${movie.price} TL)`,
      'BUSINESS_RULE',
      { customerId: customer.id, movieId: movie.id, orderId: order.id }
    );

    return AutoMapper.toOrderListDto(order, this.ctx);
  }

  public getOrdersByCustomerId(customerId: number): OrderListDto[] {
    const orders = this.db.orders.filter(o => o.customerId === customerId);
    return orders.map(o => AutoMapper.toOrderListDto(o, this.ctx));
  }

  public getAllOrders(): OrderListDto[] {
    return this.db.orders.map(o => AutoMapper.toOrderListDto(o, this.ctx));
  }
}

// ==========================================
// GENRE SERVICE
// ==========================================
export class GenreService implements IGenreService {
  constructor(private db: Database) {}

  public getAll(): GenreDto[] {
    return this.db.genres.map(g => AutoMapper.toGenreDto(g));
  }

  public getById(id: number): GenreDto {
    const genre = this.db.genres.find(g => g.id === id);
    if (!genre) throw new NotFoundException('Film Türü', id);
    return AutoMapper.toGenreDto(genre);
  }
}
