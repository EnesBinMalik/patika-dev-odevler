/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion Prensibi (DIP) - Repository Arayüzü
 */

import { UserEntity } from '../../types/models';
import { Optional } from '../../core/Optional';
import { Role } from '../../types/enums';

export interface IUserRepository {
  findById(id: string): Optional<UserEntity>;
  findByUsername(username: string): Optional<UserEntity>;
  findByEmail(email: string): Optional<UserEntity>;
  findAll(): UserEntity[];
  findByRole(role: Role): UserEntity[];
  findByAdminId(adminId: string): UserEntity[];
  findBlockedUsers(): UserEntity[];
  save(user: UserEntity): UserEntity;
  update(user: UserEntity): UserEntity;
  deleteById(id: string): boolean;
  count(): number;
}
