export interface BookEntity {
  id: number;
  title: string;
  genreId: number;
  pageCount: number;
  publishDate: string; // ISO string in DB
  // Internal entity-only properties that MUST NEVER be exposed to clients
  createdDate: string;
  modifiedDate: string | null;
  isDeleted: boolean;
  rowVersion: string;
  internalBarcode: string;
}

export interface Genre {
  id: number;
  name: string;
}

// UpdateBook Input Model (Client -> Controller -> Command)
export interface UpdateBookInputModel {
  title: string;
  genreId: number;
  pageCount: number;
  publishDate: string;
}

// UpdateBook Output Model (Command -> Controller -> Client)
export interface UpdateBookOutputModel {
  id: number;
  title: string;
  genre: string;
  pageCount: number;
  publishDate: string;
  updatedAt: string;
  message: string;
}

// GetById Input Model (Route/Query -> Controller -> Query)
export interface GetBookDetailInputModel {
  bookId: number;
}

// GetById Output Model (Query -> Controller -> Client)
export interface BookDetailViewModel {
  id: number;
  title: string;
  genre: string;
  pageCount: number;
  publishDate: string;
}

export interface ValidationError {
  field: string;
  message: string;
}
