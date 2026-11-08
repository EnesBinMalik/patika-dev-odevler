/**
 * @license
 * Enes Öztürk - KariyerPortalı
 * Katmanlı Mimari - Abstract Base Entity
 * Demonstrates OOP Inheritance, Encapsulation, and Spring Data / JPA @MappedSuperclass concepts
 */

export interface IEntity {
  getId(): string;
  getCreatedAt(): string;
  getUpdatedAt(): string;
  getVersion(): number;
}

export abstract class BaseEntity implements IEntity {
  protected id: string;
  protected createdAt: string;
  protected updatedAt: string;
  protected version: number;

  constructor(id?: string, createdAt?: string, updatedAt?: string, version: number = 1) {
    this.id = id || BaseEntity.generateId();
    const now = new Date().toISOString();
    this.createdAt = createdAt || now;
    this.updatedAt = updatedAt || now;
    this.version = version;
  }

  public getId(): string {
    return this.id;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public getVersion(): number {
    return this.version;
  }

  public updateTimestamp(): void {
    this.updatedAt = new Date().toISOString();
    this.version += 1;
  }

  public static generateId(): string {
    return 'ent_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
  }
}
