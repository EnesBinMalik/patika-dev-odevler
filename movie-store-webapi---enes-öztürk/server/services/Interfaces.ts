/**
 * Service Contracts (Interfaces) for Movie Store WebApi
 * Author: Enes Öztürk
 * Controllers interact ONLY with these abstractions via Dependency Injection.
 */

import {
  MovieListDto,
  MovieDetailDto,
  MovieCreateDto,
  MovieUpdateDto,
  ActorListDto,
  ActorDetailDto,
  ActorCreateDto,
  ActorUpdateDto,
  DirectorListDto,
  DirectorDetailDto,
  DirectorCreateDto,
  DirectorUpdateDto,
  CustomerListDto,
  CustomerDetailDto,
  CustomerRegisterDto,
  CustomerLoginDto,
  CustomerAuthResponseDto,
  OrderListDto,
  OrderCreateDto,
  GenreDto,
} from '../dtos/Dtos.ts';

export interface IMovieService {
  getAll(includeInactive?: boolean): MovieListDto[];
  getById(id: number): MovieDetailDto;
  create(dto: MovieCreateDto): MovieDetailDto;
  update(id: number, dto: MovieUpdateDto): MovieDetailDto;
  delete(id: number): { message: string; softDeleted: boolean };
}

export interface IActorService {
  getAll(): ActorListDto[];
  getById(id: number): ActorDetailDto;
  create(dto: ActorCreateDto): ActorDetailDto;
  update(id: number, dto: ActorUpdateDto): ActorDetailDto;
  delete(id: number): { message: string };
}

export interface IDirectorService {
  getAll(): DirectorListDto[];
  getById(id: number): DirectorDetailDto;
  create(dto: DirectorCreateDto): DirectorDetailDto;
  update(id: number, dto: DirectorUpdateDto): DirectorDetailDto;
  delete(id: number): { message: string };
}

export interface ICustomerService {
  getAll(): CustomerListDto[];
  getById(id: number): CustomerDetailDto;
  register(dto: CustomerRegisterDto): CustomerAuthResponseDto;
  login(dto: CustomerLoginDto): CustomerAuthResponseDto;
  delete(id: number): { message: string };
}

export interface IOrderService {
  purchaseMovie(customerId: number, dto: OrderCreateDto): OrderListDto;
  getOrdersByCustomerId(customerId: number): OrderListDto[];
  getAllOrders(): OrderListDto[];
}

export interface IGenreService {
  getAll(): GenreDto[];
  getById(id: number): GenreDto;
}
