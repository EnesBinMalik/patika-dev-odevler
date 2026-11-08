/**
 * Unified API Client for Movie Store WebApi
 * Author: Enes Öztürk
 */

import {
  MovieListDto,
  MovieDetailDto,
  ActorListDto,
  DirectorListDto,
  CustomerListDto,
  OrderListDto,
  GenreDto,
  CustomerAuthSession,
  TestSuiteReport,
  LogEntry,
} from '../types.ts';

const TOKEN_KEY = 'moviestore_auth_token';
const CUSTOMER_KEY = 'moviestore_auth_customer';

class ApiClient {
  private token: string | null = null;
  private currentCustomer: CustomerAuthSession['customer'] | null = null;

  constructor() {
    try {
      this.token = localStorage.getItem(TOKEN_KEY);
      const custStr = localStorage.getItem(CUSTOMER_KEY);
      if (custStr) {
        this.currentCustomer = JSON.parse(custStr);
      }
    } catch {
      // safe fallback
    }
  }

  public getToken(): string | null {
    return this.token;
  }

  public getCurrentCustomer(): CustomerAuthSession['customer'] | null {
    return this.currentCustomer;
  }

  public setSession(session: CustomerAuthSession | null): void {
    if (session) {
      this.token = session.token;
      this.currentCustomer = session.customer;
      localStorage.setItem(TOKEN_KEY, session.token);
      localStorage.setItem(CUSTOMER_KEY, JSON.stringify(session.customer));
    } else {
      this.token = null;
      this.currentCustomer = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(CUSTOMER_KEY);
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const headers = new Headers(options.headers || {});
    headers.set('Content-Type', 'application/json');

    if (this.token) {
      headers.set('Authorization', `Bearer ${this.token}`);
    }

    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || data?.errors?.join(', ') || `HTTP Hatası: ${response.status}`;
      const error: any = new Error(errorMsg);
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data;
  }

  // ---- Movies ----
  public async getMovies(params?: { includeInactive?: boolean; genre?: string; year?: number; search?: string }): Promise<MovieListDto[]> {
    const q = new URLSearchParams();
    if (params?.includeInactive) q.set('includeInactive', 'true');
    if (params?.genre) q.set('genre', params.genre);
    if (params?.year) q.set('year', String(params.year));
    if (params?.search) q.set('search', params.search);

    const queryStr = q.toString() ? `?${q.toString()}` : '';
    const res = await this.request<{ data: MovieListDto[] }>(`/movies${queryStr}`);
    return res.data;
  }

  public async getMovieById(id: number): Promise<MovieDetailDto> {
    const res = await this.request<{ data: MovieDetailDto }>(`/movies/${id}`);
    return res.data;
  }

  public async createMovie(payload: any): Promise<MovieDetailDto> {
    const res = await this.request<{ data: MovieDetailDto }>('/movies', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async updateMovie(id: number, payload: any): Promise<MovieDetailDto> {
    const res = await this.request<{ data: MovieDetailDto }>(`/movies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async deleteMovie(id: number): Promise<{ message: string; softDeleted: boolean }> {
    const res = await this.request<{ message: string; data: { softDeleted: boolean } }>(`/movies/${id}`, {
      method: 'DELETE',
    });
    return { message: res.message, softDeleted: res.data?.softDeleted ?? true };
  }

  // ---- Actors ----
  public async getActors(): Promise<ActorListDto[]> {
    const res = await this.request<{ data: ActorListDto[] }>('/actors');
    return res.data;
  }

  public async getActorById(id: number): Promise<any> {
    const res = await this.request<{ data: any }>(`/actors/${id}`);
    return res.data;
  }

  public async createActor(payload: { firstName: string; lastName: string }): Promise<any> {
    const res = await this.request<{ data: any }>('/actors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async updateActor(id: number, payload: { firstName: string; lastName: string }): Promise<any> {
    const res = await this.request<{ data: any }>(`/actors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async deleteActor(id: number): Promise<{ message: string }> {
    const res = await this.request<{ message: string }>(`/actors/${id}`, {
      method: 'DELETE',
    });
    return { message: res.message };
  }

  // ---- Directors ----
  public async getDirectors(): Promise<DirectorListDto[]> {
    const res = await this.request<{ data: DirectorListDto[] }>('/directors');
    return res.data;
  }

  public async getDirectorById(id: number): Promise<any> {
    const res = await this.request<{ data: any }>(`/directors/${id}`);
    return res.data;
  }

  public async createDirector(payload: { firstName: string; lastName: string }): Promise<any> {
    const res = await this.request<{ data: any }>('/directors', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async updateDirector(id: number, payload: { firstName: string; lastName: string }): Promise<any> {
    const res = await this.request<{ data: any }>(`/directors/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return res.data;
  }

  public async deleteDirector(id: number): Promise<{ message: string }> {
    const res = await this.request<{ message: string }>(`/directors/${id}`, {
      method: 'DELETE',
    });
    return { message: res.message };
  }

  // ---- Customers & Auth ----
  public async getCustomers(): Promise<CustomerListDto[]> {
    const res = await this.request<{ data: CustomerListDto[] }>('/customers');
    return res.data;
  }

  public async register(payload: any): Promise<CustomerAuthSession> {
    const res = await this.request<{ data: CustomerAuthSession }>('/customers/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setSession(res.data);
    return res.data;
  }

  public async login(payload: { email: string; password: string }): Promise<CustomerAuthSession> {
    const res = await this.request<{ data: CustomerAuthSession }>('/customers/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
    this.setSession(res.data);
    return res.data;
  }

  public async deleteCustomer(id: number): Promise<{ message: string }> {
    const res = await this.request<{ message: string }>(`/customers/${id}`, {
      method: 'DELETE',
    });
    return { message: res.message };
  }

  // ---- Orders (Purchases) ----
  public async purchaseMovie(movieId: number): Promise<OrderListDto> {
    const res = await this.request<{ data: OrderListDto }>('/orders', {
      method: 'POST',
      body: JSON.stringify({ movieId }),
    });
    return res.data;
  }

  public async getMyOrders(): Promise<OrderListDto[]> {
    const res = await this.request<{ data: OrderListDto[] }>('/orders/my-orders');
    return res.data;
  }

  public async getAllOrders(): Promise<OrderListDto[]> {
    const res = await this.request<{ data: OrderListDto[] }>('/orders');
    return res.data;
  }

  // ---- Genres ----
  public async getGenres(): Promise<GenreDto[]> {
    const res = await this.request<{ data: GenreDto[] }>('/genres');
    return res.data;
  }

  // ---- Test Runner ----
  public async runUnitTests(): Promise<TestSuiteReport> {
    const res = await this.request<{ data: TestSuiteReport }>('/tests/run');
    return res.data;
  }

  public async resetDatabase(): Promise<{ message: string }> {
    const res = await this.request<{ message: string }>('/database/reset', {
      method: 'POST',
    });
    return { message: res.message };
  }

  // ---- Logs ----
  public async getLogs(limit: number = 80): Promise<LogEntry[]> {
    const res = await this.request<{ data: LogEntry[] }>(`/logs?limit=${limit}`);
    return res.data;
  }

  public async clearLogs(): Promise<void> {
    await this.request('/logs/clear', { method: 'POST' });
  }

  // Generic raw request for Swagger / API Explorer
  public async executeRawRequest(method: string, path: string, body?: any, customToken?: string): Promise<{
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: any;
    durationMs: number;
  }> {
    const startTime = Date.now();
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    const tokenToUse = customToken !== undefined ? customToken : this.token;
    if (tokenToUse) {
      headers['Authorization'] = tokenToUse.startsWith('Bearer ') ? tokenToUse : `Bearer ${tokenToUse}`;
    }

    const init: RequestInit = {
      method,
      headers,
    };
    if (body && ['POST', 'PUT', 'PATCH'].includes(method.toUpperCase())) {
      init.body = typeof body === 'string' ? body : JSON.stringify(body);
    }

    const response = await fetch(`/api${path}`, init);
    const durationMs = Date.now() - startTime;

    const responseHeaders: Record<string, string> = {};
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value;
    });

    let data;
    try {
      data = await response.json();
    } catch {
      data = await response.text();
    }

    return {
      status: response.status,
      statusText: response.statusText,
      headers: responseHeaders,
      data,
      durationMs,
    };
  }
}

export const api = new ApiClient();
