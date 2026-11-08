/**
 * Front-end Types mirroring backend DTOs
 * Author: Enes Öztürk
 */

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
  actors: Array<{ id: number; fullName: string }>;
  price: number;
  isActive: boolean;
  createdAt: string;
}

export interface ActorListDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  moviesCount: number;
}

export interface DirectorListDto {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  directedMoviesCount: number;
}

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

export interface GenreDto {
  id: number;
  name: string;
}

export interface CustomerAuthSession {
  token: string;
  customer: {
    id: number;
    firstName: string;
    lastName: string;
    fullName: string;
    email: string;
    favoriteGenres: string[];
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  category: 'HTTP_REQUEST' | 'HTTP_RESPONSE' | 'VALIDATION' | 'BUSINESS_RULE' | 'SYSTEM' | 'SECURITY';
  message: string;
  metadata?: any;
}

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
