/**
 * AutoMapper Library implementation for Movie Store WebApi
 * Implemented by Enes Öztürk
 * Strictly ensures entities are mapped to/from DTOs without leaking internal fields or representations.
 */

import { Movie, Actor, Director, Customer, Order, Genre } from '../entities/Entities.ts';
import {
  MovieListDto,
  MovieDetailDto,
  MovieCreateDto,
  ActorListDto,
  ActorDetailDto,
  DirectorListDto,
  DirectorDetailDto,
  CustomerListDto,
  CustomerDetailDto,
  OrderListDto,
  GenreDto,
} from '../dtos/Dtos.ts';

export interface IMappingContext {
  getGenreById(id: number): Genre | undefined;
  getDirectorById(id: number): Director | undefined;
  getActorById(id: number): Actor | undefined;
  getCustomerById(id: number): Customer | undefined;
  getMovieById(id: number): Movie | undefined;
  getMoviesForActor(actorId: number): Movie[];
  getMoviesForDirector(directorId: number): Movie[];
  getOrdersForCustomer(customerId: number): Order[];
}

export class AutoMapper {
  // ---- Movie Mappings ----
  public static toMovieListDto(movie: Movie, ctx: IMappingContext): MovieListDto {
    const genre = ctx.getGenreById(movie.genreId);
    const director = ctx.getDirectorById(movie.directorId);
    const actorNames = (movie.actorIds || [])
      .map(id => ctx.getActorById(id))
      .filter((a): a is Actor => !!a)
      .map(a => `${a.firstName} ${a.lastName}`);

    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      genre: genre ? genre.name : 'Bilinmiyor',
      directorName: director ? `${director.firstName} ${director.lastName}` : 'Bilinmiyor',
      actors: actorNames,
      price: movie.price,
      isActive: movie.isActive,
    };
  }

  public static toMovieDetailDto(movie: Movie, ctx: IMappingContext): MovieDetailDto {
    const genre = ctx.getGenreById(movie.genreId);
    const director = ctx.getDirectorById(movie.directorId);
    const actors = (movie.actorIds || [])
      .map(id => ctx.getActorById(id))
      .filter((a): a is Actor => !!a)
      .map(a => ({
        id: a.id,
        fullName: `${a.firstName} ${a.lastName}`,
      }));

    return {
      id: movie.id,
      title: movie.title,
      year: movie.year,
      genreId: movie.genreId,
      genreName: genre ? genre.name : 'Bilinmiyor',
      directorId: movie.directorId,
      directorName: director ? `${director.firstName} ${director.lastName}` : 'Bilinmiyor',
      actors,
      price: movie.price,
      isActive: movie.isActive,
      createdAt: movie.createdAt,
    };
  }

  public static fromMovieCreateDto(dto: MovieCreateDto, newId: number): Movie {
    const now = new Date().toISOString();
    return {
      id: newId,
      title: dto.title.trim(),
      year: Number(dto.year),
      genreId: Number(dto.genreId),
      directorId: Number(dto.directorId),
      actorIds: [...dto.actorIds],
      price: Number(dto.price),
      isActive: true,
      createdAt: now,
      updatedAt: now,
    };
  }

  // ---- Actor Mappings ----
  public static toActorListDto(actor: Actor, ctx: IMappingContext): ActorListDto {
    const movies = ctx.getMoviesForActor(actor.id);
    return {
      id: actor.id,
      firstName: actor.firstName,
      lastName: actor.lastName,
      fullName: `${actor.firstName} ${actor.lastName}`,
      moviesCount: movies.length,
    };
  }

  public static toActorDetailDto(actor: Actor, ctx: IMappingContext): ActorDetailDto {
    const movies = ctx.getMoviesForActor(actor.id);
    return {
      id: actor.id,
      firstName: actor.firstName,
      lastName: actor.lastName,
      fullName: `${actor.firstName} ${actor.lastName}`,
      movies: movies.map(m => ({
        id: m.id,
        title: m.title,
        year: m.year,
        roleType: 'actor',
      })),
      createdAt: actor.createdAt,
    };
  }

  // ---- Director Mappings ----
  public static toDirectorListDto(director: Director, ctx: IMappingContext): DirectorListDto {
    const movies = ctx.getMoviesForDirector(director.id);
    return {
      id: director.id,
      firstName: director.firstName,
      lastName: director.lastName,
      fullName: `${director.firstName} ${director.lastName}`,
      directedMoviesCount: movies.length,
    };
  }

  public static toDirectorDetailDto(director: Director, ctx: IMappingContext): DirectorDetailDto {
    const movies = ctx.getMoviesForDirector(director.id);
    return {
      id: director.id,
      firstName: director.firstName,
      lastName: director.lastName,
      fullName: `${director.firstName} ${director.lastName}`,
      directedMovies: movies.map(m => {
        const genre = ctx.getGenreById(m.genreId);
        return {
          id: m.id,
          title: m.title,
          year: m.year,
          genreName: genre ? genre.name : 'Bilinmiyor',
        };
      }),
      createdAt: director.createdAt,
    };
  }

  // ---- Customer Mappings ----
  public static toCustomerListDto(customer: Customer, ctx: IMappingContext): CustomerListDto {
    const favoriteGenres = (customer.favoriteGenreIds || [])
      .map(id => ctx.getGenreById(id)?.name)
      .filter((n): n is string => !!n);
    const orders = ctx.getOrdersForCustomer(customer.id);

    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      favoriteGenres,
      totalOrdersCount: orders.length,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
    };
  }

  public static toCustomerDetailDto(customer: Customer, ctx: IMappingContext): CustomerDetailDto {
    const genreNames = (customer.favoriteGenreIds || [])
      .map(id => ctx.getGenreById(id)?.name)
      .filter((n): n is string => !!n);

    return {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      fullName: `${customer.firstName} ${customer.lastName}`,
      email: customer.email,
      favoriteGenreIds: customer.favoriteGenreIds || [],
      favoriteGenreNames: genreNames,
      isActive: customer.isActive,
      createdAt: customer.createdAt,
    };
  }

  // ---- Order Mappings ----
  public static toOrderListDto(order: Order, ctx: IMappingContext): OrderListDto {
    const customer = ctx.getCustomerById(order.customerId);
    const movie = ctx.getMovieById(order.movieId);

    return {
      id: order.id,
      customerId: order.customerId,
      customerName: customer ? `${customer.firstName} ${customer.lastName}` : 'Kayıtlı Olmayan Müşteri',
      movieId: order.movieId,
      // Use historical snapshot first, fallback to current title
      movieTitle: order.movieTitleSnapshot || (movie ? movie.title : 'Silinmiş/Pasif Film'),
      price: order.price,
      purchaseDate: order.purchaseDate,
      movieIsCurrentlyActive: movie ? movie.isActive : false,
    };
  }

  // ---- Genre Mappings ----
  public static toGenreDto(genre: Genre): GenreDto {
    return {
      id: genre.id,
      name: genre.name,
    };
  }
}
