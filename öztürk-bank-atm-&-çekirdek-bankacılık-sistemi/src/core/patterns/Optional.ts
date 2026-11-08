/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Java 8+ java.util.Optional implementasyonu
 * Geliştirici: Enes Öztürk
 *
 * OOP Prensibi: NullPointerException önleme ve fonksiyonel veri akışı
 */

export class Optional<T> {
  private readonly value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.value = value;
  }

  public static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.of(...) null ya da undefined değer kabul etmez!');
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
    if (this.isEmpty()) {
      throw new Error('NoSuchElementException: Optional değeri boş!');
    }
    return this.value as T;
  }

  public orElse(other: T): T {
    return this.isPresent() ? (this.value as T) : other;
  }

  public orElseGet(supplier: () => T): T {
    return this.isPresent() ? (this.value as T) : supplier();
  }

  public orElseThrow<E extends Error>(errorSupplier?: () => E): T {
    if (this.isPresent()) {
      return this.value as T;
    }
    if (errorSupplier) {
      throw errorSupplier();
    }
    throw new Error('NoSuchElementException: Boş Optional değeri!');
  }

  public map<U>(mapper: (val: T) => U | null | undefined): Optional<U> {
    if (this.isEmpty()) {
      return Optional.empty<U>();
    }
    const result = mapper(this.value as T);
    return Optional.ofNullable(result);
  }

  public filter(predicate: (val: T) => boolean): Optional<T> {
    if (this.isEmpty()) {
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
