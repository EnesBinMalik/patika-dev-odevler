/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Single Responsibility & Interface Segregation
 * Stream API & Optional<T> ile Kullanıcı Veri Erişim Katmanı (Data Access Layer)
 */

import { IUserRepository } from './interfaces/IUserRepository';
import { UserEntity } from '../types/models';
import { DatabaseContext } from '../database/DatabaseContext';
import { Optional } from '../core/Optional';
import { Stream } from '../core/Stream';
import { Role } from '../types/enums';

export class UserRepository implements IUserRepository {
  private db: DatabaseContext;

  constructor() {
    this.db = DatabaseContext.getInstance();
  }

  public findById(id: string): Optional<UserEntity> {
    const user = this.db.users.get(id);
    return Optional.ofNullable(user);
  }

  public findByUsername(username: string): Optional<UserEntity> {
    return Stream.of(Array.from(this.db.users.values()))
      .filter((u) => u.username.toLowerCase() === username.trim().toLowerCase())
      .findFirst();
  }

  public findByEmail(email: string): Optional<UserEntity> {
    return Stream.of(Array.from(this.db.users.values()))
      .filter((u) => u.email.toLowerCase() === email.trim().toLowerCase())
      .findFirst();
  }

  public findAll(): UserEntity[] {
    return Stream.of(Array.from(this.db.users.values()))
      .sorted((a, b) => b.createdAt.localeCompare(a.createdAt))
      .collectToList();
  }

  public findByRole(role: Role): UserEntity[] {
    return Stream.of(Array.from(this.db.users.values()))
      .filter((u) => u.role === role)
      .collectToList();
  }

  public findByAdminId(adminId: string): UserEntity[] {
    return Stream.of(Array.from(this.db.users.values()))
      .filter((u) => u.adminId === adminId)
      .collectToList();
  }

  public findBlockedUsers(): UserEntity[] {
    return Stream.of(Array.from(this.db.users.values()))
      .filter((u) => u.isBlocked === true || u.failedLoginAttempts >= 3)
      .collectToList();
  }

  public save(user: UserEntity): UserEntity {
    this.db.users.set(user.id, user);
    this.db.persist();
    return user;
  }

  public update(user: UserEntity): UserEntity {
    user.touch();
    this.db.users.set(user.id, user);
    this.db.persist();
    return user;
  }

  public deleteById(id: string): boolean {
    const deleted = this.db.users.delete(id);
    if (deleted) {
      this.db.persist();
    }
    return deleted;
  }

  public count(): number {
    return this.db.users.size;
  }
}
