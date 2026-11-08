/**
 * WebApi Controllers
 * Author: Enes Öztürk
 * In accordance with Clean Architecture:
 * Controllers DO NOT contain business logic. They solely extract inputs, delegate to injected services, and return DTO responses.
 */

import { Request, Response, NextFunction } from 'express';
import { DIContainer } from '../di/Container.ts';
import { ApiResponse } from '../dtos/Dtos.ts';

const meta = () => ({
  author: 'Enes Öztürk',
  timestamp: new Date().toISOString(),
  version: '1.0.0',
});

// ==========================================
// MOVIE CONTROLLER
// ==========================================
export class MovieController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const movieService = this.container.getMovieService();
      const includeInactive = req.query.includeInactive === 'true';
      const movies = movieService.getAll(includeInactive);

      // Optional filtering
      let result = movies;
      if (req.query.genre) {
        const genreQuery = String(req.query.genre).toLowerCase();
        result = result.filter(m => m.genre.toLowerCase().includes(genreQuery));
      }
      if (req.query.year) {
        const yearQuery = Number(req.query.year);
        result = result.filter(m => m.year === yearQuery);
      }
      if (req.query.search) {
        const q = String(req.query.search).toLowerCase();
        result = result.filter(m =>
          m.title.toLowerCase().includes(q) ||
          m.directorName.toLowerCase().includes(q) ||
          m.actors.some(a => a.toLowerCase().includes(q))
        );
      }

      const response: ApiResponse = {
        success: true,
        data: result,
        meta: meta(),
      };
      res.json(response);
    } catch (err) {
      next(err);
    }
  };

  public getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const movieService = this.container.getMovieService();
      const movie = movieService.getById(id);

      res.json({
        success: true,
        data: movie,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const movieService = this.container.getMovieService();
      const createdMovie = movieService.create(req.body);

      res.status(201).json({
        success: true,
        message: 'Film başarıyla sisteme eklendi.',
        data: createdMovie,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const movieService = this.container.getMovieService();
      const updatedMovie = movieService.update(id, req.body);

      res.json({
        success: true,
        message: 'Film bilgileri başarıyla güncellendi.',
        data: updatedMovie,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const movieService = this.container.getMovieService();
      const result = movieService.delete(id);

      res.json({
        success: true,
        message: result.message,
        data: { softDeleted: result.softDeleted },
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };
}

// ==========================================
// ACTOR CONTROLLER
// ==========================================
export class ActorController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const actorService = this.container.getActorService();
      const actors = actorService.getAll();
      res.json({ success: true, data: actors, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const actorService = this.container.getActorService();
      const actor = actorService.getById(id);
      res.json({ success: true, data: actor, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const actorService = this.container.getActorService();
      const created = actorService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Oyuncu başarıyla eklendi.',
        data: created,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const actorService = this.container.getActorService();
      const updated = actorService.update(id, req.body);
      res.json({
        success: true,
        message: 'Oyuncu başarıyla güncellendi.',
        data: updated,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const actorService = this.container.getActorService();
      const result = actorService.delete(id);
      res.json({
        success: true,
        message: result.message,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };
}

// ==========================================
// DIRECTOR CONTROLLER
// ==========================================
export class DirectorController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const directorService = this.container.getDirectorService();
      const directors = directorService.getAll();
      res.json({ success: true, data: directors, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const directorService = this.container.getDirectorService();
      const director = directorService.getById(id);
      res.json({ success: true, data: director, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public create = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const directorService = this.container.getDirectorService();
      const created = directorService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Yönetmen başarıyla eklendi.',
        data: created,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public update = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const directorService = this.container.getDirectorService();
      const updated = directorService.update(id, req.body);
      res.json({
        success: true,
        message: 'Yönetmen başarıyla güncellendi.',
        data: updated,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const directorService = this.container.getDirectorService();
      const result = directorService.delete(id);
      res.json({
        success: true,
        message: result.message,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };
}

// ==========================================
// CUSTOMER CONTROLLER
// ==========================================
export class CustomerController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customerService = this.container.getCustomerService();
      const customers = customerService.getAll();
      res.json({ success: true, data: customers, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public getById = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const customerService = this.container.getCustomerService();
      const customer = customerService.getById(id);
      res.json({ success: true, data: customer, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public register = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customerService = this.container.getCustomerService();
      const result = customerService.register(req.body);
      res.status(201).json({
        success: true,
        message: 'Müşteri hesabı başarıyla oluşturuldu ve oturum açıldı.',
        data: result,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public login = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customerService = this.container.getCustomerService();
      const result = customerService.login(req.body);
      res.json({
        success: true,
        message: 'Giriş başarılı.',
        data: result,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  public getMe = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customer = req.customer!;
      const customerService = this.container.getCustomerService();
      const detail = customerService.getById(customer.id);
      res.json({ success: true, data: detail, meta: meta() });
    } catch (err) {
      next(err);
    }
  };

  public delete = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const id = Number(req.params.id);
      const customerService = this.container.getCustomerService();
      const result = customerService.delete(id);
      res.json({
        success: true,
        message: result.message,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };
}

// ==========================================
// ORDER CONTROLLER (Satın Alma & Siparişlerim)
// ==========================================
export class OrderController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  // POST /api/orders (Satın alma - Yetkisiz kullanıcı satın alma yapamaz!)
  public purchaseMovie = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customer = req.customer!;
      const orderService = this.container.getOrderService();
      const order = orderService.purchaseMovie(customer.id, req.body);

      res.status(201).json({
        success: true,
        message: `Tebrikler! "${order.movieTitle}" filmi satın alma işleminiz başarıyla tamamlandı.`,
        data: order,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/orders/my-orders (Müşterinin kendi satın alma geçmişi)
  public getMyOrders = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const customer = req.customer!;
      const orderService = this.container.getOrderService();
      const orders = orderService.getOrdersByCustomerId(customer.id);

      res.json({
        success: true,
        data: orders,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };

  // GET /api/orders (Tüm siparişler - Yönetim / Raporlama)
  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const orderService = this.container.getOrderService();
      const orders = orderService.getAllOrders();
      res.json({
        success: true,
        data: orders,
        meta: meta(),
      });
    } catch (err) {
      next(err);
    }
  };
}

// ==========================================
// GENRE CONTROLLER
// ==========================================
export class GenreController {
  constructor(private container: DIContainer = DIContainer.getInstance()) {}

  public getAll = (req: Request, res: Response, next: NextFunction): void => {
    try {
      const genreService = this.container.getGenreService();
      const genres = genreService.getAll();
      res.json({ success: true, data: genres, meta: meta() });
    } catch (err) {
      next(err);
    }
  };
}
