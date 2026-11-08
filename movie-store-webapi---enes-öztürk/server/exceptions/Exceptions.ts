/**
 * Standard Domain Exceptions for Movie Store WebApi
 * Author: Enes Öztürk
 */

export class NotFoundException extends Error {
  public statusCode: number = 404;

  constructor(entityName: string, id: number | string) {
    super(`${entityName} (ID: ${id}) bulunamadı.`);
    this.name = 'NotFoundException';
    Object.setPrototypeOf(this, NotFoundException.prototype);
  }
}

export class BusinessRuleException extends Error {
  public statusCode: number = 422; // Unprocessable Entity

  constructor(message: string) {
    super(message);
    this.name = 'BusinessRuleException';
    Object.setPrototypeOf(this, BusinessRuleException.prototype);
  }
}

export class AuthenticationException extends Error {
  public statusCode: number = 401;

  constructor(message: string = 'Geçersiz kimlik bilgileri veya yetkisiz erişim.') {
    super(message);
    this.name = 'AuthenticationException';
    Object.setPrototypeOf(this, AuthenticationException.prototype);
  }
}

export class AuthorizationException extends Error {
  public statusCode: number = 403;

  constructor(message: string = 'Bu işlem için yetkiniz bulunmamaktadır.') {
    super(message);
    this.name = 'AuthorizationException';
    Object.setPrototypeOf(this, AuthorizationException.prototype);
  }
}
