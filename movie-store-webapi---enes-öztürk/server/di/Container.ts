/**
 * Dependency Injection (DI) Container
 * Author: Enes Öztürk
 * Centralizes all application dependencies, decoupling layers and ensuring clean lifecycle management.
 */

import { Database } from '../data/Database.ts';
import { ConsoleLoggerService, ILoggerService } from '../services/LoggerService.ts';
import {
  IMovieService,
  IActorService,
  IDirectorService,
  ICustomerService,
  IOrderService,
  IGenreService,
} from '../services/Interfaces.ts';
import {
  MovieService,
  ActorService,
  DirectorService,
  CustomerService,
  OrderService,
  GenreService,
} from '../services/Services.ts';

export class DIContainer {
  private static instance: DIContainer;

  // Singletons
  private db: Database;
  private logger: ILoggerService;
  private movieService: IMovieService;
  private actorService: IActorService;
  private directorService: IDirectorService;
  private customerService: ICustomerService;
  private orderService: IOrderService;
  private genreService: IGenreService;

  private constructor() {
    // 1. Core infrastructure
    this.db = Database.getInstance();
    this.logger = ConsoleLoggerService.getInstance();

    // 2. Services injected with dependencies
    this.movieService = new MovieService(this.db);
    this.actorService = new ActorService(this.db);
    this.directorService = new DirectorService(this.db);
    this.customerService = new CustomerService(this.db);
    this.orderService = new OrderService(this.db);
    this.genreService = new GenreService(this.db);

    this.logger.info('DI Container initialized successfully with all registered service dependencies.', 'SYSTEM');
  }

  public static getInstance(): DIContainer {
    if (!DIContainer.instance) {
      DIContainer.instance = new DIContainer();
    }
    return DIContainer.instance;
  }

  // Resolvers
  public getDatabase(): Database {
    return this.db;
  }

  public getLogger(): ILoggerService {
    return this.logger;
  }

  public getMovieService(): IMovieService {
    return this.movieService;
  }

  public getActorService(): IActorService {
    return this.actorService;
  }

  public getDirectorService(): IDirectorService {
    return this.directorService;
  }

  public getCustomerService(): ICustomerService {
    return this.customerService;
  }

  public getOrderService(): IOrderService {
    return this.orderService;
  }

  public getGenreService(): IGenreService {
    return this.genreService;
  }
}
