/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Java-Style Stream API Implementation
 * Provides functional chaining: filter, map, sorted, reduce, findFirst, collect, etc.
 */

import { Optional } from './optional.ts';

export class Stream<T> {
  private readonly source: T[];

  private constructor(source: T[]) {
    this.source = [...source];
  }

  /**
   * Creates a sequential Stream with the specified elements.
   */
  public static of<T>(source: T[]): Stream<T> {
    return new Stream<T>(source);
  }

  /**
   * Returns a stream consisting of the elements that match the given predicate.
   */
  public filter(predicate: (item: T) => boolean): Stream<T> {
    return new Stream<T>(this.source.filter(predicate));
  }

  /**
   * Returns a stream consisting of the results of applying the given function to the elements.
   */
  public map<R>(mapper: (item: T) => R): Stream<R> {
    return new Stream<R>(this.source.map(mapper));
  }

  /**
   * Returns a stream consisting of the elements sorted according to the provided comparator.
   */
  public sorted(comparator?: (a: T, b: T) => number): Stream<T> {
    const copy = [...this.source];
    copy.sort(comparator);
    return new Stream<T>(copy);
  }

  /**
   * Returns a stream consisting of the remaining elements of this stream after discarding the first n elements.
   */
  public skip(n: number): Stream<T> {
    return new Stream<T>(this.source.slice(n));
  }

  /**
   * Returns a stream consisting of the elements of this stream, truncated to be no longer than maxSize in length.
   */
  public limit(maxSize: number): Stream<T> {
    return new Stream<T>(this.source.slice(0, maxSize));
  }

  /**
   * Returns an Optional describing the first element of this stream, or an empty Optional if the stream is empty.
   */
  public findFirst(): Optional<T> {
    return this.source.length > 0 ? Optional.of(this.source[0]) : Optional.empty<T>();
  }

  /**
   * Returns whether any elements of this stream match the provided predicate.
   */
  public anyMatch(predicate: (item: T) => boolean): boolean {
    return this.source.some(predicate);
  }

  /**
   * Returns whether all elements of this stream match the provided predicate.
   */
  public allMatch(predicate: (item: T) => boolean): boolean {
    return this.source.every(predicate);
  }

  /**
   * Performs a reduction on the elements of this stream using the provided identity and accumulator.
   */
  public reduce<U>(identity: U, accumulator: (acc: U, item: T) => U): U {
    return this.source.reduce(accumulator, identity);
  }

  /**
   * Returns the count of elements in this stream.
   */
  public count(): number {
    return this.source.length;
  }

  /**
   * Terminal operation: collects elements into an array.
   */
  public toList(): T[] {
    return [...this.source];
  }

  /**
   * Collects elements using a collector function.
   */
  public collect<R>(collector: (items: T[]) => R): R {
    return collector(this.source);
  }

  /**
   * Performs an action for each element of this stream.
   */
  public forEach(action: (item: T) => void): void {
    this.source.forEach(action);
  }
}
