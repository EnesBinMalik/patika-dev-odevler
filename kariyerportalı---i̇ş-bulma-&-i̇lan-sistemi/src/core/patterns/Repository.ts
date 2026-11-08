/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Pattern: Repository Pattern (Spring Data JpaRepository / CrudRepository Simulation)
 * Provides generic CRUD, Stream API querying, and Optional wrappers.
 */

import { BaseEntity } from '../entities/BaseEntity.ts';
import { Optional } from '../types/optional.ts';
import { Stream } from '../types/stream.ts';

export interface IRepository<T extends BaseEntity> {
  save(entity: T): T;
  saveAll(entities: T[]): T[];
  findById(id: string): Optional<T>;
  findAll(): Stream<T>;
  deleteById(id: string): boolean;
  count(): number;
  clear(): void;
}

export abstract class GenericInMemoryRepository<T extends BaseEntity> implements IRepository<T> {
  protected entities: Map<string, T> = new Map();

  public save(entity: T): T {
    entity.updateTimestamp();
    this.entities.set(entity.getId(), entity);
    return entity;
  }

  public saveAll(entities: T[]): T[] {
    return entities.map(e => this.save(e));
  }

  public findById(id: string): Optional<T> {
    const item = this.entities.get(id);
    return Optional.ofNullable(item);
  }

  public findAll(): Stream<T> {
    return Stream.of(Array.from(this.entities.values()));
  }

  public deleteById(id: string): boolean {
    return this.entities.delete(id);
  }

  public count(): number {
    return this.entities.size;
  }

  public clear(): void {
    this.entities.clear();
  }

  public toArray(): T[] {
    return Array.from(this.entities.values());
  }
}
