/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Java 8+ Stream API ve java.util.Optional Benzetimi (Simulation)
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D & Clean Code mimarisinde veri dönüşümleri ve null güvenliği
 */

/**
 * Java Optional<T> sınıfı uygulaması.
 * NullPointerExceptions engellemek ve veriyi güvenli sarmalamak için kullanılır.
 */
export class Optional<T> {
  private constructor(private readonly value: T | null | undefined) {}

  public static of<T>(value: T): Optional<T> {
    if (value === null || value === undefined) {
      throw new Error('Optional.of() parametresi null veya undefined olamaz! Optional.ofNullable() kullanın.');
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
      throw new Error('NoSuchElementException: Optional değer mevcut değil.');
    }
    return this.value as T;
  }

  public orElse(other: T): T {
    return this.isPresent() ? (this.value as T) : other;
  }

  public orElseGet(supplier: () => T): T {
    return this.isPresent() ? (this.value as T) : supplier();
  }

  public orElseThrow(errorSupplier?: () => Error): T {
    if (!this.isPresent()) {
      throw errorSupplier ? errorSupplier() : new Error('NoSuchElementException: Değer bulunamadı.');
    }
    return this.value as T;
  }

  public ifPresent(consumer: (value: T) => void): void {
    if (this.isPresent()) {
      consumer(this.value as T);
    }
  }

  public map<U>(mapper: (value: T) => U | null | undefined): Optional<U> {
    if (!this.isPresent()) {
      return Optional.empty<U>();
    }
    return Optional.ofNullable(mapper(this.value as T));
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    }
    return predicate(this.value as T) ? this : Optional.empty<T>();
  }
}

/**
 * Java 8 Stream<T> API uygulaması.
 * Fonksiyonel veri akışı, filtreleme, eşleme, sıralama ve indirgeme (reduce) sağlar.
 */
export class Stream<T> {
  private readonly elements: T[];

  private constructor(elements: T[]) {
    this.elements = [...elements];
  }

  public static of<T>(elements: Iterable<T> | T[]): Stream<T> {
    return new Stream<T>(Array.from(elements));
  }

  public filter(predicate: (item: T) => boolean): Stream<T> {
    return new Stream<T>(this.elements.filter(predicate));
  }

  public map<R>(mapper: (item: T, index: number) => R): Stream<R> {
    return new Stream<R>(this.elements.map(mapper));
  }

  public flatMap<R>(mapper: (item: T) => R[]): Stream<R> {
    const flattened: R[] = [];
    for (const item of this.elements) {
      flattened.push(...mapper(item));
    }
    return new Stream<R>(flattened);
  }

  public sorted(comparator?: (a: T, b: T) => number): Stream<T> {
    return new Stream<T>([...this.elements].sort(comparator));
  }

  public distinct(keyExtractor?: (item: T) => any): Stream<T> {
    if (!keyExtractor) {
      return new Stream<T>(Array.from(new Set(this.elements)));
    }
    const seen = new Set();
    const result: T[] = [];
    for (const item of this.elements) {
      const key = keyExtractor(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
    return new Stream<T>(result);
  }

  public skip(n: number): Stream<T> {
    return new Stream<T>(this.elements.slice(n));
  }

  public limit(maxSize: number): Stream<T> {
    return new Stream<T>(this.elements.slice(0, maxSize));
  }

  public forEach(action: (item: T) => void): void {
    this.elements.forEach(action);
  }

  public count(): number {
    return this.elements.length;
  }

  public findFirst(): Optional<T> {
    return this.elements.length > 0 ? Optional.of(this.elements[0]) : Optional.empty<T>();
  }

  public anyMatch(predicate: (item: T) => boolean): boolean {
    return this.elements.some(predicate);
  }

  public allMatch(predicate: (item: T) => boolean): boolean {
    return this.elements.every(predicate);
  }

  public noneMatch(predicate: (item: T) => boolean): boolean {
    return !this.elements.some(predicate);
  }

  public reduce(identity: T, accumulator: (acc: T, curr: T) => T): T {
    return this.elements.reduce(accumulator, identity);
  }

  public toList(): T[] {
    return [...this.elements];
  }

  /**
   * Java Collectors.groupingBy benzetimi
   */
  public groupBy<K extends string | number | symbol>(classifier: (item: T) => K): Record<K, T[]> {
    return this.elements.reduce((acc, item) => {
      const key = classifier(item);
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(item);
      return acc;
    }, {} as Record<K, T[]>);
  }

  /**
   * Toplama (Summing)
   */
  public sum(numberExtractor: (item: T) => number): number {
    return this.elements.reduce((sum, item) => sum + numberExtractor(item), 0);
  }

  /**
   * Ortalama (Averaging)
   */
  public average(numberExtractor: (item: T) => number): number {
    if (this.elements.length === 0) return 0;
    return this.sum(numberExtractor) / this.elements.length;
  }
}
