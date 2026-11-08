/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Java Optional<T> Pattern Uygulaması
 */

export class Optional<T> {
  private constructor(private readonly value: T | null | undefined) {}

  public static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.of(...) değeri null veya undefined olamaz!');
    }
    return new Optional<T>(value);
  }

  public static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return new Optional<T>(value);
  }

  public static empty<T>(): Optional<T> {
    return new Optional<T>(null);
  }

  public isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  public isEmpty(): boolean {
    return !this.isPresent();
  }

  public get(): T {
    if (!this.isPresent()) {
      throw new Error('NoSuchElementException: Optional değeri boş!');
    }
    return this.value as T;
  }

  public orElse(defaultValue: T): T {
    return this.isPresent() ? (this.value as T) : defaultValue;
  }

  public orElseGet(supplier: () => T): T {
    return this.isPresent() ? (this.value as T) : supplier();
  }

  public orElseThrow(errorSupplier?: () => Error): T {
    if (this.isPresent()) {
      return this.value as T;
    }
    throw errorSupplier ? errorSupplier() : new Error('NoSuchElementException: Optional değeri boş!');
  }

  public map<U>(mapper: (val: T) => U | null | undefined): Optional<U> {
    if (!this.isPresent()) {
      return Optional.empty<U>();
    }
    return Optional.ofNullable(mapper(this.value as T));
  }

  public filter(predicate: (val: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    }
    return predicate(this.value as T) ? this : Optional.empty<T>();
  }

  public ifPresent(consumer: (val: T) => void): void {
    if (this.isPresent()) {
      consumer(this.value as T);
    }
  }
}
