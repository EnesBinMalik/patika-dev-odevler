/**
 * Specific Business Validators for Movie Store DTOs
 * Author: Enes Öztürk
 * Every service operation validates its incoming DTO using these classes.
 */

import { AbstractValidator } from './Validator.ts';
import {
  MovieCreateDto,
  MovieUpdateDto,
  ActorCreateDto,
  ActorUpdateDto,
  DirectorCreateDto,
  DirectorUpdateDto,
  CustomerRegisterDto,
  CustomerLoginDto,
  OrderCreateDto,
} from '../dtos/Dtos.ts';

// ---- Movie Validators ----
export class MovieCreateValidator extends AbstractValidator<MovieCreateDto> {
  constructor() {
    super();

    this.ruleFor('title', x => x.title)
      .notEmpty('Film adı boş bırakılamaz.')
      .minLength(2, 'Film adı en az 2 karakter olmalıdır.')
      .maxLength(200, 'Film adı en fazla 200 karakter olabilir.');

    this.ruleFor('year', x => x.year)
      .notEmpty('Film yılı zorunludur.')
      .greaterThanOrEqualTo(1888, 'Film yılı sinemanın icat edildiği 1888 yılından küçük olamaz.')
      .lessThanOrEqualTo(new Date().getFullYear() + 5, 'Film yılı gelecekte makul bir yıl olmalıdır.');

    this.ruleFor('genreId', x => x.genreId)
      .notEmpty('Film türü (genreId) zorunludur.')
      .greaterThan(0, 'Geçerli bir film türü seçilmelidir.');

    this.ruleFor('directorId', x => x.directorId)
      .notEmpty('Yönetmen (directorId) zorunludur.')
      .greaterThan(0, 'Geçerli bir yönetmen seçilmelidir.');

    this.ruleFor('actorIds', x => x.actorIds)
      .notNull('Oyuncular listesi zorunludur.')
      .must(
        (actors) => Array.isArray(actors) && actors.length > 0,
        'Bir filme en az 1 oyuncu atanmalıdır.'
      );

    this.ruleFor('price', x => x.price)
      .notNull('Film fiyatı zorunludur.')
      .greaterThan(0, 'Film fiyatı 0 TL den büyük olmalıdır.');
  }
}

export class MovieUpdateValidator extends AbstractValidator<MovieUpdateDto> {
  constructor() {
    super();

    this.ruleFor('title', x => x.title)
      .must(val => val === undefined || (typeof val === 'string' && val.trim().length >= 2), 'Film adı en az 2 karakter olmalıdır.');

    this.ruleFor('year', x => x.year)
      .must(val => val === undefined || (typeof val === 'number' && val >= 1888), 'Film yılı 1888 den küçük olamaz.');

    this.ruleFor('price', x => x.price)
      .must(val => val === undefined || (typeof val === 'number' && val > 0), 'Film fiyatı 0 dan büyük olmalıdır.');

    this.ruleFor('actorIds', x => x.actorIds)
      .must(val => val === undefined || (Array.isArray(val) && val.length > 0), 'Oyuncu listesi güncelleniyorsa en az 1 oyuncu içermelidir.');
  }
}

// ---- Actor Validators ----
export class ActorCreateValidator extends AbstractValidator<ActorCreateDto> {
  constructor() {
    super();

    this.ruleFor('firstName', x => x.firstName)
      .notEmpty('Oyuncu adı boş bırakılamaz.')
      .minLength(2, 'Oyuncu adı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Oyuncu adı en fazla 50 karakter olabilir.');

    this.ruleFor('lastName', x => x.lastName)
      .notEmpty('Oyuncu soyadı boş bırakılamaz.')
      .minLength(2, 'Oyuncu soyadı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Oyuncu soyadı en fazla 50 karakter olabilir.');
  }
}

export class ActorUpdateValidator extends AbstractValidator<ActorUpdateDto> {
  constructor() {
    super();

    this.ruleFor('firstName', x => x.firstName)
      .notEmpty('Oyuncu adı boş bırakılamaz.')
      .minLength(2, 'Oyuncu adı en az 2 karakter olmalıdır.');

    this.ruleFor('lastName', x => x.lastName)
      .notEmpty('Oyuncu soyadı boş bırakılamaz.')
      .minLength(2, 'Oyuncu soyadı en az 2 karakter olmalıdır.');
  }
}

// ---- Director Validators ----
export class DirectorCreateValidator extends AbstractValidator<DirectorCreateDto> {
  constructor() {
    super();

    this.ruleFor('firstName', x => x.firstName)
      .notEmpty('Yönetmen adı boş bırakılamaz.')
      .minLength(2, 'Yönetmen adı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Yönetmen adı en fazla 50 karakter olabilir.');

    this.ruleFor('lastName', x => x.lastName)
      .notEmpty('Yönetmen soyadı boş bırakılamaz.')
      .minLength(2, 'Yönetmen soyadı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Yönetmen soyadı en fazla 50 karakter olabilir.');
  }
}

export class DirectorUpdateValidator extends AbstractValidator<DirectorUpdateDto> {
  constructor() {
    super();

    this.ruleFor('firstName', x => x.firstName)
      .notEmpty('Yönetmen adı boş bırakılamaz.')
      .minLength(2, 'Yönetmen adı en az 2 karakter olmalıdır.');

    this.ruleFor('lastName', x => x.lastName)
      .notEmpty('Yönetmen soyadı boş bırakılamaz.')
      .minLength(2, 'Yönetmen soyadı en az 2 karakter olmalıdır.');
  }
}

// ---- Customer Validators ----
export class CustomerRegisterValidator extends AbstractValidator<CustomerRegisterDto> {
  constructor() {
    super();

    this.ruleFor('firstName', x => x.firstName)
      .notEmpty('Müşteri adı boş bırakılamaz.')
      .minLength(2, 'Müşteri adı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Müşteri adı en fazla 50 karakter olabilir.');

    this.ruleFor('lastName', x => x.lastName)
      .notEmpty('Müşteri soyadı boş bırakılamaz.')
      .minLength(2, 'Müşteri soyadı en az 2 karakter olmalıdır.')
      .maxLength(50, 'Müşteri soyadı en fazla 50 karakter olabilir.');

    this.ruleFor('email', x => x.email)
      .notEmpty('E-posta adresi boş bırakılamaz.')
      .emailAddress('Lütfen geçerli bir e-posta adresi giriniz.');

    this.ruleFor('password', x => x.password)
      .notEmpty('Şifre alanı zorunludur.')
      .minLength(6, 'Şifre güvenliğiniz için en az 6 karakter olmalıdır.');
  }
}

export class CustomerLoginValidator extends AbstractValidator<CustomerLoginDto> {
  constructor() {
    super();

    this.ruleFor('email', x => x.email)
      .notEmpty('E-posta adresi girilmelidir.')
      .emailAddress('Geçerli bir e-posta formatı olmalıdır.');

    this.ruleFor('password', x => x.password)
      .notEmpty('Şifre alanı girilmelidir.');
  }
}

// ---- Order Validators ----
export class OrderCreateValidator extends AbstractValidator<OrderCreateDto> {
  constructor() {
    super();

    this.ruleFor('movieId', x => x.movieId)
      .notEmpty('Satın alınacak film ID si belirtilmelidir.')
      .greaterThan(0, 'Geçerli bir Film ID girilmelidir.');
  }
}
