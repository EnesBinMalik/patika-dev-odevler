export interface Author {
  id: number;
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date YYYY-MM-DD
  createdAt: string;
}

export interface Genre {
  id: number;
  name: string;
  isActive: boolean;
}

export interface Book {
  id: number;
  title: string;
  pageCount: number;
  publishDate: string;
  genreId: number;
  authorId: number;
  isPublished: boolean; // Yayında olup olmadığı
  description?: string;
}

// DTOs & ViewModels (Controller metotları entity'leri doğrudan input/output olarak kullanmaz)

export interface CreateAuthorModel {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface UpdateAuthorModel {
  firstName: string;
  lastName: string;
  birthDate: string;
}

export interface AuthorsViewModel {
  id: number;
  fullName: string;
  birthDate: string; // Formatlanmış string (dd.MM.yyyy)
  age: number;
  bookCount: number;
  publishedBookCount: number;
  bookTitles: string[];
}

export interface AuthorDetailViewModel {
  id: number;
  firstName: string;
  lastName: string;
  fullName: string;
  birthDate: string;
  formattedBirthDate: string;
  age: number;
  books: {
    id: number;
    title: string;
    genreName: string;
    publishDate: string;
    pageCount: number;
    isPublished: boolean;
  }[];
}

export interface CreateBookModel {
  title: string;
  pageCount: number;
  publishDate: string;
  genreId: number;
  authorId: number;
  isPublished: boolean;
  description?: string;
}

// Fluent Validation Sonuç Yapısı
export interface ValidationError {
  propertyName: string;
  errorMessage: string;
  attemptedValue?: unknown;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

// API Response Wrapper
export interface ApiResponse<T = unknown> {
  statusCode: number;
  success: boolean;
  message: string;
  data?: T;
  errors?: ValidationError[];
  signature: string; // "Enes Öztürk"
  timestamp: string;
}
