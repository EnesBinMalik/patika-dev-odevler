/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Java 8+ Stream API implementasyonu
 * Geliştirici: Enes Öztürk
 *
 * Stream API ile koleksiyonlar üzerinde bildirimsel (declarative) veri işleme
 */

import { Optional } from './Optional';

export class Stream<T> {
  private items: T[];

  private constructor(items: T[]) {
    this.items = [...items];
  }

  public static of<T>(items: T[]): Stream<T> {
    return new Stream<T>(items || []);
  }

  public filter(predicate: (item: T, index: number) => boolean): Stream<T> {
    this.items = this.items.filter(predicate);
    return this;
  }

  public map<R>(mapper: (item: T, index: number) => R): Stream<R> {
    const mapped = this.items.map(mapper);
    return new Stream<R>(mapped);
  }

  public sorted(comparator?: (a: T, b: T) => number): Stream<T> {
    this.items.sort(comparator);
    return this;
  }

  public distinct(keySelector?: (item: T) => unknown): Stream<T> {
    if (!keySelector) {
      this.items = Array.from(new Set(this.items));
    } else {
      const seen = new Set();
      this.items = this.items.filter((item) => {
        const key = keySelector(item);
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }
    return this;
  }

  public limit(maxSize: number): Stream<T> {
    this.items = this.items.slice(0, maxSize);
    return this;
  }

  public skip(n: number): Stream<T> {
    this.items = this.items.slice(n);
    return this;
  }

  public findFirst(): Optional<T> {
    return this.items.length > 0 ? Optional.of(this.items[0]) : Optional.empty<T>();
  }

  public findAny(): Optional<T> {
    return this.findFirst();
  }

  public anyMatch(predicate: (item: T) => boolean): boolean {
    return this.items.some(predicate);
  }

  public allMatch(predicate: (item: T) => boolean): boolean {
    return this.items.every(predicate);
  }

  public noneMatch(predicate: (item: T) => boolean): boolean {
    return !this.items.some(predicate);
  }

  public count(): number {
    return this.items.length;
  }

  public reduce(accumulator: (prev: T, curr: T) => T, initialValue?: T): T {
    if (initialValue !== undefined) {
      return this.items.reduce(accumulator, initialValue);
    }
    return this.items.reduce(accumulator);
  }

  public collect(): T[] {
    return [...this.items];
  }
}
