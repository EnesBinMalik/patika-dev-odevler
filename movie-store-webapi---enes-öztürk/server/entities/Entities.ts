/**
 * Core Domain Entities for Movie Store WebApi
 * Author & Signature: Enes Öztürk
 * Note: Entities are NEVER returned directly as API input or output.
 */

export interface Genre {
  id: number;
  name: string;
}

export interface Actor {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Director {
  id: number;
  firstName: string;
  lastName: string;
  createdAt: string;
}

export interface Movie {
  id: number;
  title: string;
  year: number;
  genreId: number;
  directorId: number;
  actorIds: number[];
  price: number;
  isActive: boolean; // Soft delete flag to preserve order history
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  favoriteGenreIds: number[];
  isActive: boolean;
  createdAt: string;
}

export interface Order {
  id: number;
  customerId: number;
  movieId: number;
  price: number; // Snapshot of price at the moment of purchase
  movieTitleSnapshot: string; // Preserves movie title even if movie is changed/deactivated
  purchaseDate: string;
}
