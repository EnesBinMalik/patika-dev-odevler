import {
  Author,
  Book,
  Genre,
  CreateAuthorModel,
  UpdateAuthorModel,
  AuthorsViewModel,
  AuthorDetailViewModel,
  CreateBookModel,
  ApiResponse,
} from '../types';
import { INITIAL_AUTHORS, INITIAL_BOOKS, INITIAL_GENRES } from '../data/initialData';
import { AutoMapper } from './autoMapper';
import {
  CreateAuthorCommandValidator,
  UpdateAuthorCommandValidator,
  DeleteAuthorCommandValidator,
  GetAuthorDetailQueryValidator,
} from '../validations/authorValidators';

const SIGNATURE = 'Enes Öztürk';
const AUTHORS_KEY = 'bookstore_authors_data';
const BOOKS_KEY = 'bookstore_books_data';
const GENRES_KEY = 'bookstore_genres_data';

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  endpoint: string;
  statusCode: number;
  durationMs: number;
  requestBody?: unknown;
  responseBody: unknown;
  timestamp: string;
  signature: string;
}

class LibraryService {
  private authors: Author[] = [];
  private books: Book[] = [];
  private genres: Genre[] = [];
  private listeners: (() => void)[] = [];
  private apiLogs: ApiLog[] = [];

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage(): void {
    try {
      const storedAuthors = localStorage.getItem(AUTHORS_KEY);
      const storedBooks = localStorage.getItem(BOOKS_KEY);
      const storedGenres = localStorage.getItem(GENRES_KEY);

      this.authors = storedAuthors ? JSON.parse(storedAuthors) : [...INITIAL_AUTHORS];
      this.books = storedBooks ? JSON.parse(storedBooks) : [...INITIAL_BOOKS];
      this.genres = storedGenres ? JSON.parse(storedGenres) : [...INITIAL_GENRES];
    } catch {
      this.authors = [...INITIAL_AUTHORS];
      this.books = [...INITIAL_BOOKS];
      this.genres = [...INITIAL_GENRES];
    }
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(AUTHORS_KEY, JSON.stringify(this.authors));
      localStorage.setItem(BOOKS_KEY, JSON.stringify(this.books));
      localStorage.setItem(GENRES_KEY, JSON.stringify(this.genres));
    } catch {
      // Storage error fallback
    }
    this.notify();
  }

  public subscribe(listener: () => void): () => void {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener);
    };
  }

  private notify(): void {
    this.listeners.forEach((l) => l());
  }

  public resetToDefault(): void {
    this.authors = JSON.parse(JSON.stringify(INITIAL_AUTHORS));
    this.books = JSON.parse(JSON.stringify(INITIAL_BOOKS));
    this.genres = JSON.parse(JSON.stringify(INITIAL_GENRES));
    this.saveToStorage();
  }

  public getApiLogs(): ApiLog[] {
    return [...this.apiLogs];
  }

  public clearApiLogs(): void {
    this.apiLogs = [];
    this.notify();
  }

  private recordLog(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    endpoint: string,
    statusCode: number,
    requestBody: unknown,
    responseBody: unknown,
    startTime: number
  ): void {
    const log: ApiLog = {
      id: Math.random().toString(36).substring(2, 9),
      method,
      endpoint,
      statusCode,
      durationMs: Math.max(1, Math.round(performance.now() - startTime)),
      requestBody,
      responseBody,
      timestamp: new Date().toLocaleTimeString('tr-TR'),
      signature: SIGNATURE,
    };
    this.apiLogs.unshift(log);
    if (this.apiLogs.length > 50) this.apiLogs.pop();
    this.notify();
  }

  // =========================================================================
  // AUTHOR CONTROLLER & SERVICE IMPLEMENTATION
  // =========================================================================

  /**
   * 1. GET /api/authors
   * DTO: AuthorsViewModel listesi
   */
  public getAllAuthors(): ApiResponse<AuthorsViewModel[]> {
    const startTime = performance.now();
    try {
      const viewModels: AuthorsViewModel[] = this.authors.map((author) => {
        const authorBooks = this.books.filter((b) => b.authorId === author.id);
        return AutoMapper.mapAuthorToViewModel(author, authorBooks);
      });

      const response: ApiResponse<AuthorsViewModel[]> = {
        statusCode: 200,
        success: true,
        message: `${viewModels.length} adet yazar başarıyla listelendi.`,
        data: viewModels,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };

      this.recordLog('GET', '/api/authors', 200, null, response, startTime);
      return response;
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : 'Yazarlar listelenirken beklenmeyen bir hata oluştu.';
      const errResponse: ApiResponse<AuthorsViewModel[]> = {
        statusCode: 500,
        success: false,
        message: errMsg,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('GET', '/api/authors', 500, null, errResponse, startTime);
      return errResponse;
    }
  }

  /**
   * 2. GET /api/authors/{id}
   * DTO: AuthorDetailViewModel
   */
  public getAuthorById(id: number): ApiResponse<AuthorDetailViewModel> {
    const startTime = performance.now();
    const endpoint = `/api/authors/${id}`;

    // 1. Fluent Validation
    const validation = GetAuthorDetailQueryValidator.validate(id);
    if (!validation.isValid) {
      const badResponse: ApiResponse<AuthorDetailViewModel> = {
        statusCode: 400,
        success: false,
        message: 'Doğrulama hatası gerçekleşti! Geçersiz yazar ID parametresi.',
        errors: validation.errors,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('GET', endpoint, 400, { id }, badResponse, startTime);
      return badResponse;
    }

    // 2. Entity lookup
    const author = this.authors.find((a) => a.id === id);
    if (!author) {
      const notFoundResponse: ApiResponse<AuthorDetailViewModel> = {
        statusCode: 404,
        success: false,
        message: `Sistemde ${id} numaralı ID'ye sahip bir yazar bulunamadı!`,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('GET', endpoint, 404, { id }, notFoundResponse, startTime);
      return notFoundResponse;
    }

    // 3. AutoMapper to Detail ViewModel
    const authorBooks = this.books.filter((b) => b.authorId === author.id);
    const detail = AutoMapper.mapAuthorToDetailViewModel(author, authorBooks, this.genres);

    const okResponse: ApiResponse<AuthorDetailViewModel> = {
      statusCode: 200,
      success: true,
      message: `'${detail.fullName}' adlı yazarın detayları ve eserleri getirildi.`,
      data: detail,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
    this.recordLog('GET', endpoint, 200, { id }, okResponse, startTime);
    return okResponse;
  }

  /**
   * 3. POST /api/authors
   * DTO Input: CreateAuthorModel
   * DTO Output: AuthorsViewModel
   */
  public createAuthor(model: CreateAuthorModel): ApiResponse<AuthorsViewModel> {
    const startTime = performance.now();
    const endpoint = '/api/authors';

    // 1. Fluent Validation
    const validation = CreateAuthorCommandValidator.validate(model);
    if (!validation.isValid) {
      const valResponse: ApiResponse<AuthorsViewModel> = {
        statusCode: 400,
        success: false,
        message: 'FluentValidation: Yazar bilgileri doğrulama kurallarını karşılamıyor!',
        errors: validation.errors,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('POST', endpoint, 400, model, valResponse, startTime);
      return valResponse;
    }

    // 2. Business Rule: Duplicate author check
    const normalizedFirst = model.firstName.trim().toLowerCase();
    const normalizedLast = model.lastName.trim().toLowerCase();
    const duplicate = this.authors.find(
      (a) => a.firstName.toLowerCase() === normalizedFirst && a.lastName.toLowerCase() === normalizedLast
    );

    if (duplicate) {
      const dupResponse: ApiResponse<AuthorsViewModel> = {
        statusCode: 422,
        success: false,
        message: `İş Kuralı Hatası: '${model.firstName.trim()} ${model.lastName.trim()}' adında bir yazar sistemde zaten kayıtlıdır!`,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('POST', endpoint, 422, model, dupResponse, startTime);
      return dupResponse;
    }

    // 3. AutoMapper to Entity & Persist
    const nextId = this.authors.length > 0 ? Math.max(...this.authors.map((a) => a.id)) + 1 : 1;
    const newAuthor = AutoMapper.mapCreateAuthorToEntity(model, nextId);
    this.authors.push(newAuthor);
    this.saveToStorage();

    // 4. Return ViewModel
    const viewModel = AutoMapper.mapAuthorToViewModel(newAuthor, []);
    const createdResponse: ApiResponse<AuthorsViewModel> = {
      statusCode: 201,
      success: true,
      message: `Yeni yazar '${viewModel.fullName}' başarıyla oluşturuldu ve sisteme kaydedildi.`,
      data: viewModel,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };

    this.recordLog('POST', endpoint, 201, model, createdResponse, startTime);
    return createdResponse;
  }

  /**
   * 4. PUT /api/authors/{id}
   * DTO Input: UpdateAuthorModel
   */
  public updateAuthor(id: number, model: UpdateAuthorModel): ApiResponse<void> {
    const startTime = performance.now();
    const endpoint = `/api/authors/${id}`;

    // 1. Fluent Validation
    const validation = UpdateAuthorCommandValidator.validate(id, model);
    if (!validation.isValid) {
      const valResponse: ApiResponse<void> = {
        statusCode: 400,
        success: false,
        message: 'FluentValidation: Güncellenecek yazar bilgileri geçersiz!',
        errors: validation.errors,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('PUT', endpoint, 400, { id, ...model }, valResponse, startTime);
      return valResponse;
    }

    // 2. Existing Author Check
    const index = this.authors.findIndex((a) => a.id === id);
    if (index === -1) {
      const notFoundResponse: ApiResponse<void> = {
        statusCode: 404,
        success: false,
        message: `Güncellenmek istenen yazar bulunamadı! (Id: ${id})`,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('PUT', endpoint, 404, { id, ...model }, notFoundResponse, startTime);
      return notFoundResponse;
    }

    // 3. AutoMapper update entity
    const existing = this.authors[index];
    const updated = AutoMapper.mapUpdateAuthorToEntity(model, existing);
    this.authors[index] = updated;
    this.saveToStorage();

    const okResponse: ApiResponse<void> = {
      statusCode: 200,
      success: true,
      message: `'${updated.firstName} ${updated.lastName}' yazar bilgileri başarıyla güncellendi.`,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
    this.recordLog('PUT', endpoint, 200, { id, ...model }, okResponse, startTime);
    return okResponse;
  }

  /**
   * 5. DELETE /api/authors/{id}
   * 
   * KRİTİK İŞ KURALI (Ödev Madde 3 & 7):
   * "Kitabı yayında olan bir yazar silinememeli. Öncelikle kitap silinmeli, daha sonra yazar silinebilir."
   * Anlamlı hata mesajı fırlatılmalıdır.
   */
  public deleteAuthor(id: number): ApiResponse<void> {
    const startTime = performance.now();
    const endpoint = `/api/authors/${id}`;

    // 1. Fluent Validation
    const validation = DeleteAuthorCommandValidator.validate(id);
    if (!validation.isValid) {
      const valResponse: ApiResponse<void> = {
        statusCode: 400,
        success: false,
        message: 'Doğrulama hatası: Geçersiz yazar ID değeri.',
        errors: validation.errors,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('DELETE', endpoint, 400, { id }, valResponse, startTime);
      return valResponse;
    }

    // 2. Entity lookup
    const author = this.authors.find((a) => a.id === id);
    if (!author) {
      const notFoundResponse: ApiResponse<void> = {
        statusCode: 404,
        success: false,
        message: `Silinmek istenen yazar sistemde bulunamadı! (Id: ${id})`,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('DELETE', endpoint, 404, { id }, notFoundResponse, startTime);
      return notFoundResponse;
    }

    // 3. KRİTİK İŞ KURALI KONTROLÜ: Yayında olan kitap var mı?
    const authorBooks = this.books.filter((b) => b.authorId === id);
    const activePublishedBooks = authorBooks.filter((b) => b.isPublished);

    if (activePublishedBooks.length > 0) {
      const bookTitles = activePublishedBooks.map((b) => `'${b.title}'`).join(', ');
      const ruleErrorResponse: ApiResponse<void> = {
        statusCode: 422, // Unprocessable Entity
        success: false,
        message:
          `KİTABI YAYINDA OLAN BİR YAZAR SİLİNEMEZ! ` +
          `Yazara (${author.firstName} ${author.lastName}) ait yayında olan ${activePublishedBooks.length} adet kitap bulunmaktadır: [${bookTitles}]. ` +
          `Öncelikle bu kitap(lar) silinmeli veya yayından kaldırılmalı, daha sonra yazar silinebilir.`,
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
      this.recordLog('DELETE', endpoint, 422, { id }, ruleErrorResponse, startTime);
      return ruleErrorResponse;
    }

    // 4. Kitapları silinmiş veya hiç yayında kitabı olmayan yazar güvenle silinebilir
    // Varsa yayında olmayan taslak kitapları da temizleyebilir veya kaldırabiliriz
    this.books = this.books.filter((b) => b.authorId !== id);
    this.authors = this.authors.filter((a) => a.id !== id);
    this.saveToStorage();

    const okResponse: ApiResponse<void> = {
      statusCode: 200,
      success: true,
      message: `'${author.firstName} ${author.lastName}' adlı yazar başarıyla silindi. (Yazara ait yayında kitap bulunmadığı doğrulandı)`,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
    this.recordLog('DELETE', endpoint, 200, { id }, okResponse, startTime);
    return okResponse;
  }

  // =========================================================================
  // BOOK & GENRE YARDIMCI METOTLARI (Test edebilmek ve ilişkiyi yönetmek için)
  // =========================================================================

  public getRawAuthors(): Author[] {
    return [...this.authors];
  }

  public getBooks(): Book[] {
    return [...this.books];
  }

  public getGenres(): Genre[] {
    return [...this.genres];
  }

  public createBook(model: CreateBookModel): ApiResponse<Book> {
    const author = this.authors.find((a) => a.id === model.authorId);
    if (!author) {
      return {
        statusCode: 400,
        success: false,
        message: 'Seçilen yazar bulunamadı!',
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
    }

    const nextId = this.books.length > 0 ? Math.max(...this.books.map((b) => b.id)) + 1 : 1;
    const newBook: Book = {
      id: nextId,
      title: model.title.trim(),
      pageCount: model.pageCount,
      publishDate: model.publishDate,
      genreId: model.genreId,
      authorId: model.authorId,
      isPublished: model.isPublished,
      description: model.description || '',
    };

    this.books.push(newBook);
    this.saveToStorage();

    return {
      statusCode: 201,
      success: true,
      message: `'${newBook.title}' adlı kitap başarıyla eklendi.`,
      data: newBook,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
  }

  public toggleBookPublishStatus(bookId: number): ApiResponse<boolean> {
    const book = this.books.find((b) => b.id === bookId);
    if (!book) {
      return {
        statusCode: 404,
        success: false,
        message: 'Kitap bulunamadı!',
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
    }

    book.isPublished = !book.isPublished;
    this.saveToStorage();

    return {
      statusCode: 200,
      success: true,
      message: `'${book.title}' kitabının yayım durumu '${book.isPublished ? 'Yayında' : 'Yayından Kaldırıldı (Taslak)'}' olarak güncellendi.`,
      data: book.isPublished,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
  }

  public deleteBook(bookId: number): ApiResponse<void> {
    const index = this.books.findIndex((b) => b.id === bookId);
    if (index === -1) {
      return {
        statusCode: 404,
        success: false,
        message: 'Silinmek istenen kitap bulunamadı!',
        signature: SIGNATURE,
        timestamp: new Date().toISOString(),
      };
    }

    const removed = this.books[index];
    this.books.splice(index, 1);
    this.saveToStorage();

    return {
      statusCode: 200,
      success: true,
      message: `'${removed.title}' kitabı silindi. Artık yazarının başka yayında kitabı kalmadıysa yazar silinebilir!`,
      signature: SIGNATURE,
      timestamp: new Date().toISOString(),
    };
  }
}

export const libraryStore = new LibraryService();
