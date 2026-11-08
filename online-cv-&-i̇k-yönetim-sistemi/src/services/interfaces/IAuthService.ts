/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Online CV & İK Yönetim Sistemi
 * Geliştirici: Enes Öztürk
 * S.O.L.I.D: Dependency Inversion - Kimlik Doğrulama Servis Arayüzü
 */

import { UserEntity } from '../../types/models';
import { Optional } from '../../core/Optional';
import { Role } from '../../types/enums';

export interface AuthResult {
  success: boolean;
  message: string;
  user?: UserEntity;
  remainingAttempts?: number;
  isBlocked?: boolean;
}

export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
  role: Role;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface IAuthService {
  login(usernameOrEmail: string, rawPassword: string): Promise<AuthResult>;
  register(dto: RegisterDTO): Promise<AuthResult>;
  logout(): void;
  getCurrentUser(): Optional<UserEntity>;
  unblockUser(userId: string): boolean;
}
