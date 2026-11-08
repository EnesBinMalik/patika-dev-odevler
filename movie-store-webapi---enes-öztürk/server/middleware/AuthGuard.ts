/**
 * Authentication and Authorization Guards
 * Author: Enes Öztürk
 * Protects endpoints, strictly ensuring purchase and customer operations require Customer role.
 */

import { Request, Response, NextFunction } from 'express';
import { AuthenticationException, AuthorizationException } from '../exceptions/Exceptions.ts';
import { Database } from '../data/Database.ts';

export function customerAuthGuard(req: Request, res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AuthenticationException('Bu işlem için geçerli bir Müşteri (Customer) oturum tokenı (Bearer) gereklidir.');
  }

  const token = authHeader.substring(7).trim();
  try {
    const jsonStr = Buffer.from(token, 'base64').toString('utf-8');
    const payload = JSON.parse(jsonStr);

    if (!payload.customerId || !payload.exp) {
      throw new AuthenticationException('Yetkilendirme tokenı formatı geçersiz.');
    }

    if (Date.now() > payload.exp) {
      throw new AuthenticationException('Oturum süreniz doldu. Lütfen tekrar giriş yapınız.');
    }

    // Role check: Only Customer can use purchase endpoint
    if (payload.role !== 'Customer') {
      throw new AuthorizationException('Bu endpoint sadece Müşteri (Customer) rolüne sahip kullanıcılar tarafından kullanılabilir.');
    }

    const db = Database.getInstance();
    const customer = db.customers.find(c => c.id === payload.customerId && c.isActive);
    if (!customer) {
      throw new AuthenticationException('Token ile ilişkili aktif müşteri kaydı bulunamadı.');
    }

    req.customer = customer;
    next();
  } catch (err: any) {
    if (err instanceof AuthenticationException || err instanceof AuthorizationException) {
      throw err;
    }
    throw new AuthenticationException('Geçersiz veya bozulmuş yetkilendirme anahtarı (Token).');
  }
}
