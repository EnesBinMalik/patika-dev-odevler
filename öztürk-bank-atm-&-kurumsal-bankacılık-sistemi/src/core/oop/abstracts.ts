/**
 * Öztürk Bank - Core Abstract Classes
 * OOP: Abstraction, Inheritance & Polymorphism
 * Mimar: Enes Öztürk
 */

import { IEntity, IRepository, IPageable, IPage } from './interfaces';
import { Optional } from './Optional';
import { Stream } from './Stream';

/**
 * BaseEntity: Tüm veritabanı varlıklarının miras aldığı temel soyut sınıf
 */
export abstract class BaseEntity implements IEntity {
  public id: string;
  public createdAt: string;
  public updatedAt: string;

  constructor(id?: string, createdAt?: string, updatedAt?: string) {
    const now = new Date().toISOString();
    this.id = id || this.generateUuid();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
  }

  protected generateUuid(): string {
    return 'id-' + Math.random().toString(36).substr(2, 9) + '-' + Date.now().toString(36);
  }

  public touch(): void {
    this.updatedAt = new Date().toISOString();
  }
}

/**
 * AbstractRepository: Generic CRUD & Paging sağlayan soyut repository sınıfı
 */
export abstract class AbstractRepository<T extends BaseEntity> implements IRepository<T> {
  protected storageKey: string;
  protected items: Map<string, T> = new Map();

  constructor(storageKey: string) {
    this.storageKey = storageKey;
    this.loadFromStorage();
  }

  protected abstract deserialize(raw: unknown): T;

  protected loadFromStorage(): void {
    try {
      const dataStr = localStorage.getItem(this.storageKey);
      if (dataStr) {
        const rawArray: unknown[] = JSON.parse(dataStr);
        this.items.clear();
        rawArray.forEach(item => {
          const entity = this.deserialize(item);
          this.items.set(entity.id, entity);
        });
      }
    } catch (e) {
      console.error(`[${this.storageKey}] Veri yüklenirken hata oluştu:`, e);
    }
  }

  protected persistToStorage(): void {
    try {
      const array = Array.from(this.items.values());
      localStorage.setItem(this.storageKey, JSON.stringify(array));
    } catch (e) {
      console.error(`[${this.storageKey}] Veri kaydedilirken hata oluştu:`, e);
    }
  }

  public save(entity: T): T {
    entity.touch();
    this.items.set(entity.id, entity);
    this.persistToStorage();
    return entity;
  }

  public saveAll(entities: T[]): T[] {
    entities.forEach(e => {
      e.touch();
      this.items.set(e.id, e);
    });
    this.persistToStorage();
    return entities;
  }

  public findById(id: string): Optional<T> {
    const item = this.items.get(id);
    return Optional.ofNullable(item);
  }

  public findAll(): T[] {
    return Array.from(this.items.values());
  }

  public stream(): Stream<T> {
    return Stream.of(this.findAll());
  }

  public findAllPaged(pageable: IPageable): IPage<T> {
    let list = this.findAll();

    // Sıralama (Opsiyonel)
    if (pageable.sortField) {
      const field = pageable.sortField as keyof T;
      const dir = pageable.sortDirection === 'DESC' ? -1 : 1;
      list.sort((a, b) => {
        if (a[field] < b[field]) return -1 * dir;
        if (a[field] > b[field]) return 1 * dir;
        return 0;
      });
    }

    const totalElements = list.length;
    const pageIndex = Math.max(0, pageable.page);
    const size = Math.max(1, pageable.size);
    const totalPages = Math.ceil(totalElements / size) || 1;

    const startIndex = pageIndex * size;
    const content = list.slice(startIndex, startIndex + size);

    return {
      content,
      totalElements,
      totalPages,
      pageNumber: pageIndex,
      pageSize: size,
      isFirst: pageIndex === 0,
      isLast: pageIndex >= totalPages - 1,
      hasNext: pageIndex < totalPages - 1,
      hasPrevious: pageIndex > 0
    };
  }

  public deleteById(id: string): boolean {
    const existed = this.items.delete(id);
    if (existed) {
      this.persistToStorage();
    }
    return existed;
  }

  public existsById(id: string): boolean {
    return this.items.has(id);
  }

  public count(): number {
    return this.items.size;
  }

  public clear(): void {
    this.items.clear();
    this.persistToStorage();
  }
}
