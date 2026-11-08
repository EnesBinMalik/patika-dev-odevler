/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * Java Stream<T> API Uygulaması (filter, map, sorted, reduce, findFirst, limit, skip, count)
 */

import { Optional } from './Optional';

export class Stream<T> {
  private constructor(private readonly elements: T[]) {}

  public static of<T>(elements: T[]): Stream<T> {
    return new Stream<T>([...elements]);
  }

  public static empty<T>(): Stream<T> {
    return new Stream<T>([]);
  }

  public filter(predicate: (item: T, index: number) => boolean): Stream<T> {
    return new Stream<T>(this.elements.filter(predicate));
  }

  public map<R>(mapper: (item: T, index: number) => R): Stream<R> {
    return new Stream<R>(this.elements.map(mapper));
  }

  public flatMap<R>(mapper: (item: T) => R[]): Stream<R> {
    const flattened = this.elements.reduce<R[]>((acc, item) => acc.concat(mapper(item)), []);
    return new Stream<R>(flattened);
  }

  public distinct(keySelector?: (item: T) => any): Stream<T> {
    if (!keySelector) {
      return new Stream<T>(Array.from(new Set(this.elements)));
    }
    const seen = new Set();
    const result: T[] = [];
    for (const item of this.elements) {
      const key = keySelector(item);
      if (!seen.has(key)) {
        seen.add(key);
        result.push(item);
      }
    }
    return new Stream<T>(result);
  }

  public sorted(comparator?: (a: T, b: T) => number): Stream<T> {
    const copy = [...this.elements];
    if (comparator) {
      copy.sort(comparator);
    } else {
      copy.sort();
    }
    return new Stream<T>(copy);
  }

  public peek(consumer: (item: T) => void): Stream<T> {
    this.elements.forEach(consumer);
    return this;
  }

  public limit(maxSize: number): Stream<T> {
    return new Stream<T>(this.elements.slice(0, Math.max(0, maxSize)));
  }

  public skip(n: number): Stream<T> {
    return new Stream<T>(this.elements.slice(Math.max(0, n)));
  }

  public forEach(consumer: (item: T, index: number) => void): void {
    this.elements.forEach(consumer);
  }

  public collectToList(): T[] {
    return [...this.elements];
  }

  public toArray(): T[] {
    return [...this.elements];
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
    return !this.anyMatch(predicate);
  }

  public reduce(identity: T, accumulator: (acc: T, curr: T) => T): T {
    return this.elements.reduce(accumulator, identity);
  }
}
