/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Java-Style Monadic Optional Implementation
 * Demonstrates OOP encapsulation, type safety, and null safety.
 */

export class Optional<T> {
  private readonly value: T | null | undefined;

  private constructor(value: T | null | undefined) {
    this.value = value;
  }

  /**
   * Returns an Optional describing the specified non-null value.
   */
  public static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.of cannot take null or undefined');
    }
    return new Optional<T>(value);
  }

  /**
   * Returns an Optional describing the specified value, if non-null, otherwise returns an empty Optional.
   */
  public static ofNullable<T>(value: T | null | undefined): Optional<T> {
    return new Optional<T>(value);
  }

  /**
   * Returns an empty Optional instance.
   */
  public static empty<T>(): Optional<T> {
    return new Optional<T>(undefined);
  }

  /**
   * Return true if there is a value present, otherwise false.
   */
  public isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  /**
   * If a value is not present, returns true, otherwise false.
   */
  public isEmpty(): boolean {
    return !this.isPresent();
  }

  /**
   * If a value is present, returns the value, otherwise throws an error.
   */
  public get(): T {
    if (!this.isPresent()) {
      throw new Error('No value present in Optional');
    }
    return this.value as T;
  }

  /**
   * If a value is present, returns the value, otherwise returns other.
   */
  public orElse(other: T): T {
    return this.isPresent() ? (this.value as T) : other;
  }

  /**
   * If a value is present, returns the value, otherwise throws an exception produced by the exception supplying function.
   */
  public orElseThrow(exceptionSupplier?: () => Error): T {
    if (this.isPresent()) {
      return this.value as T;
    }
    throw exceptionSupplier ? exceptionSupplier() : new Error('NoSuchElementException: No value present');
  }

  /**
   * If a value is present, and the value matches the given predicate, returns an Optional describing the value, otherwise returns an empty Optional.
   */
  public filter(predicate: (val: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    }
    return predicate(this.value as T) ? this : Optional.empty<T>();
  }

  /**
   * If a value is present, returns an Optional describing the result of applying the given mapping function to the value.
   */
  public map<U>(mapper: (val: T) => U | null | undefined): Optional<U> {
    if (!this.isPresent()) {
      return Optional.empty<U>();
    }
    return Optional.ofNullable<U>(mapper(this.value as T));
  }

  /**
   * If a value is present, performs the given action with the value, otherwise does nothing.
   */
  public ifPresent(consumer: (val: T) => void): void {
    if (this.isPresent()) {
      consumer(this.value as T);
    }
  }
}
