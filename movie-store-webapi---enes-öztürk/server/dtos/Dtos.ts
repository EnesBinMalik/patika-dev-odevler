/**
 * Data Transfer Objects (DTOs) and ViewModels
 * Author: Enes Öztürk
 * In accordance with enterprise Clean Architecture:
 * Entities are strictly mapped to/from DTOs. Entities are NEVER exposed.
 */

export interface GenreDto {
  id: number;
  name: string;
}

// ---- Movie DTOs ----
export interface MovieListDto {
  id: number;
  title: string;
  year: number;
  genre: string;
  directorName: string;
  actors: string[];
  price: number;
  isActive: boolean;
}

export interface MovieDetailDto {
  id: number;
  title: string;
  year: number;
  genreId: number;
  genreName: string;
  directorId: number;
  directorName: string;
  actors: Array<{
    id: number;
    fullName: string;
  }>;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface MovieCreateDto {
  title: string;
  year: number;
  genreId: number;
  directorId: number;
  actorIds: number[];
  price: number;
}

export interface MovieUpdateDto {
  title?: string;
  year?: number;
  genreId?: number;
  directorId?: number;
  actorIds?: number[];
  price?: number;
  isActive?: boolean;
}

// ---- Actor DTOs ----
export interface ActorFilmographyItemDto {
  id: number;
  title: string;
  year: number;
  roleType: 'actor';
}

export interface ActorListDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  moviesCount: number;
}

export interface ActorDetailDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  movies: ActorFilmographyItemDto[];
  createdAt: string;
}

export interface ActorCreateDto {
  firstName: string;
  lastName: string;
}

export interface ActorUpdateDto {
  firstName: string;
  lastName: string;
}

// ---- Director DTOs ----
export interface DirectorFilmographyItemDto {
  id: number;
  title: string;
  year: number;
  genreName: string;
}

export interface DirectorListDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  directedMoviesCount: number;
}

export interface DirectorDetailDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  directedMovies: DirectorFilmographyItemDto[];
  createdAt: string;
}

export interface DirectorCreateDto {
  firstName: string;
  lastName: string;
}

export interface DirectorUpdateDto {
  firstName: string;
  lastName: string;
}

// ---- Customer DTOs ----
export interface CustomerListDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  favoriteGenres: string[];
  totalOrdersCount: number;
  isActive: boolean;
  createdAt: string;
}

export interface CustomerDetailDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  favoriteGenreIds: number[];
  favoriteGenreNames: string[];
  isActive: boolean;
  createdAt: string;
}

export interface CustomerRegisterDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  favoriteGenreIds?: number[];
}

export interface CustomerLoginDto {
  email: string;
  password: string;
}

export interface CustomerAuthResponseDto {
  token: string;
  expiresIn: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    favoriteGenres: string[];
  };
}

// ---- Order DTOs ----
export interface OrderCreateDto {
  movieId: number;
}

export interface OrderListDto {
  id: number;
  customerId: number;
  customerName: string;
  movieId: number;
  movieTitle: string;
  price: number;
  purchaseDate: string;
  movieIsCurrentlyActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
  meta?: {
    author: string;
    timestamp: string;
    version: string;
  };
}
