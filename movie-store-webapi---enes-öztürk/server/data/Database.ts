/**
 * In-Memory Relational Database with Seed Data & Relational Constraints
 * Author: Enes Öztürk
 */

import { Movie, Actor, Director, Customer, Order, Genre } from '../entities/Entities.ts';

export class Database {
  private static instance: Database;

  public genres: Genre[] = [];
  public directors: Director[] = [];
  public actors: Actor[] = [];
  public movies: Movie[] = [];
  public customers: Customer[] = [];
  public orders: Order[] = [];

  private nextGenreId = 1;
  private nextDirectorId = 1;
  private nextActorId = 1;
  private nextMovieId = 1;
  private nextCustomerId = 1;
  private nextOrderId = 1;

  public static getInstance(): Database {
    if (!Database.instance) {
      Database.instance = new Database();
      Database.instance.seed();
    }
    return Database.instance;
  }

  public reset(): void {
    this.genres = [];
    this.directors = [];
    this.actors = [];
    this.movies = [];
    this.customers = [];
    this.orders = [];
    this.nextGenreId = 1;
    this.nextDirectorId = 1;
    this.nextActorId = 1;
    this.nextMovieId = 1;
    this.nextCustomerId = 1;
    this.nextOrderId = 1;
    this.seed();
  }

  public seed(): void {
    const now = new Date().toISOString();

    // 1. Seed Genres (Varsayılan olarak yaratılır, servislerle yönetilmesine gerek yok)
    this.genres = [
      { id: this.nextGenreId++, name: 'Aksiyon' },
      { id: this.nextGenreId++, name: 'Bilim Kurgu' },
      { id: this.nextGenreId++, name: 'Dram' },
      { id: this.nextGenreId++, name: 'Gerilim' },
      { id: this.nextGenreId++, name: 'Komedi' },
      { id: this.nextGenreId++, name: 'Suç' },
      { id: this.nextGenreId++, name: 'Animasyon' },
      { id: this.nextGenreId++, name: 'Macera' },
    ];

    // 2. Seed Directors
    this.directors = [
      { id: this.nextDirectorId++, firstName: 'Christopher', lastName: 'Nolan', createdAt: now },
      { id: this.nextDirectorId++, firstName: 'Quentin', lastName: 'Tarantino', createdAt: now },
      { id: this.nextDirectorId++, firstName: 'Denis', lastName: 'Villeneuve', createdAt: now },
      { id: this.nextDirectorId++, firstName: 'David', lastName: 'Fincher', createdAt: now },
      { id: this.nextDirectorId++, firstName: 'Martin', lastName: 'Scorsese', createdAt: now },
    ];

    // 3. Seed Actors
    this.actors = [
      { id: this.nextActorId++, firstName: 'Leonardo', lastName: 'DiCaprio', createdAt: now },
      { id: this.nextActorId++, firstName: 'Christian', lastName: 'Bale', createdAt: now },
      { id: this.nextActorId++, firstName: 'Cillian', lastName: 'Murphy', createdAt: now },
      { id: this.nextActorId++, firstName: 'Margot', lastName: 'Robbie', createdAt: now },
      { id: this.nextActorId++, firstName: 'Brad', lastName: 'Pitt', createdAt: now },
      { id: this.nextActorId++, firstName: 'Timothée', lastName: 'Chalamet', createdAt: now },
      { id: this.nextActorId++, firstName: 'Matthew', lastName: 'McConaughey', createdAt: now },
      { id: this.nextActorId++, firstName: 'Anne', lastName: 'Hathaway', createdAt: now },
    ];

    // 4. Seed Movies
    this.movies = [
      {
        id: this.nextMovieId++,
        title: 'Inception',
        year: 2010,
        genreId: 2, // Bilim Kurgu
        directorId: 1, // Nolan
        actorIds: [1, 3], // DiCaprio, Murphy
        price: 49.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.nextMovieId++,
        title: 'Interstellar',
        year: 2014,
        genreId: 2, // Bilim Kurgu
        directorId: 1, // Nolan
        actorIds: [7, 8], // McConaughey, Hathaway
        price: 59.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.nextMovieId++,
        title: 'The Dark Knight',
        year: 2008,
        genreId: 1, // Aksiyon
        directorId: 1, // Nolan
        actorIds: [2, 3], // Bale, Murphy
        price: 44.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.nextMovieId++,
        title: 'Once Upon a Time in Hollywood',
        year: 2019,
        genreId: 5, // Komedi
        directorId: 2, // Tarantino
        actorIds: [1, 4, 5], // DiCaprio, Robbie, Pitt
        price: 39.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.nextMovieId++,
        title: 'Dune: Part One',
        year: 2021,
        genreId: 2, // Bilim Kurgu
        directorId: 3, // Villeneuve
        actorIds: [6], // Chalamet
        price: 64.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: this.nextMovieId++,
        title: 'Fight Club',
        year: 1999,
        genreId: 4, // Gerilim
        directorId: 4, // Fincher
        actorIds: [5], // Brad Pitt
        price: 34.90,
        isActive: true,
        createdAt: now,
        updatedAt: now,
      },
    ];

    // 5. Seed Customers (Customer role)
    // Note: Simple password hash representation for demo & unit testing
    this.customers = [
      {
        id: this.nextCustomerId++,
        firstName: 'Enes',
        lastName: 'Öztürk',
        email: 'enes@moviestore.com',
        passwordHash: 'secret123',
        favoriteGenreIds: [1, 2, 4], // Aksiyon, Bilim Kurgu, Gerilim
        isActive: true,
        createdAt: now,
      },
      {
        id: this.nextCustomerId++,
        firstName: 'Ahmet',
        lastName: 'Yılmaz',
        email: 'ahmet@example.com',
        passwordHash: 'password123',
        favoriteGenreIds: [2, 3], // Bilim Kurgu, Dram
        isActive: true,
        createdAt: now,
      },
      {
        id: this.nextCustomerId++,
        firstName: 'Ayşe',
        lastName: 'Demir',
        email: 'ayse@example.com',
        passwordHash: 'password123',
        favoriteGenreIds: [5, 7], // Komedi, Animasyon
        isActive: true,
        createdAt: now,
      },
    ];

    // 6. Seed Orders (Siparişlerim)
    this.orders = [
      {
        id: this.nextOrderId++,
        customerId: 1,
        movieId: 1,
        price: 49.90,
        movieTitleSnapshot: 'Inception',
        purchaseDate: new Date(Date.now() - 86400000 * 3).toISOString(), // 3 days ago
      },
      {
        id: this.nextOrderId++,
        customerId: 1,
        movieId: 2,
        price: 59.90,
        movieTitleSnapshot: 'Interstellar',
        purchaseDate: new Date(Date.now() - 86400000).toISOString(), // yesterday
      },
      {
        id: this.nextOrderId++,
        customerId: 2,
        movieId: 3,
        price: 44.90,
        movieTitleSnapshot: 'The Dark Knight',
        purchaseDate: new Date(Date.now() - 86400000 * 5).toISOString(),
      },
    ];
  }

  // ID generators
  public getNextMovieId(): number { return this.nextMovieId++; }
  public getNextActorId(): number { return this.nextActorId++; }
  public getNextDirectorId(): number { return this.nextDirectorId++; }
  public getNextCustomerId(): number { return this.nextCustomerId++; }
  public getNextOrderId(): number { return this.nextOrderId++; }
}
