/**
 * Java 8+ Benzeri Stream API Sınıfı
 * Mimar: Enes Öztürk
 * Fonksiyonel ve Stream tabanlı veri işleme mimarisi
 */

import { Optional } from './Optional';

export class Stream<T> {
  private constructor(private readonly elements: T[]) {}

  public static of<T>(elements: T[]): Stream<T> {
    return new Stream<T>([...elements]);
  }

  public filter(predicate: (item: T) => boolean): Stream<T> {
    return new Stream<T>(this.elements.filter(predicate));
  }

  public map<R>(mapper: (item: T) => R): Stream<R> {
    return new Stream<R>(this.elements.map(mapper));
  }

  public sorted(comparator?: (a: T, b: T) => number): Stream<T> {
    const copy = [...this.elements];
    copy.sort(comparator);
    return new Stream<T>(copy);
  }

  public limit(maxSize: number): Stream<T> {
    return new Stream<T>(this.elements.slice(0, Math.max(0, maxSize)));
  }

  public skip(n: number): Stream<T> {
    return new Stream<T>(this.elements.slice(Math.max(0, n)));
  }

  public forEach(action: (item: T) => void): void {
    this.elements.forEach(action);
  }

  public count(): number {
    return this.elements.length;
  }

  public findFirst(): Optional<T> {
    return this.elements.length > 0 
      ? Optional.of(this.elements[0]) 
      : Optional.empty<T>();
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

  public reduce(accumulator: (acc: T, current: T) => T, initialValue?: T): Optional<T> {
    if (this.elements.length === 0) {
      return initialValue !== undefined ? Optional.of(initialValue) : Optional.empty<T>();
    }
    if (initialValue !== undefined) {
      return Optional.of(this.elements.reduce(accumulator, initialValue));
    }
    return Optional.of(this.elements.reduce(accumulator));
  }

  public toList(): T[] {
    return [...this.elements];
  }
}
