/**
 * FluentValidation Framework for Movie Store WebApi
 * Implemented in TypeScript by Enes Öztürk
 * Provides strong declarative validation, strict error messages, and centralized exception throwing.
 */

export interface ValidationFailure {
  propertyName: string;
  errorMessage: string;
}

export class ValidationResult {
  constructor(public errors: ValidationFailure[] = []) {}

  get isValid(): boolean {
    return this.errors.length === 0;
  }
}

export class ValidationException extends Error {
  public statusCode: number = 400;
  public failures: ValidationFailure[];

  constructor(failures: ValidationFailure[]) {
    const message = failures.map(f => `${f.propertyName}: ${f.errorMessage}`).join('; ');
    super(`Validation failed: ${message}`);
    this.name = 'ValidationException';
    this.failures = failures;
    Object.setPrototypeOf(this, ValidationException.prototype);
  }
}

type PropertyAccessor<T, TProp> = (obj: T) => TProp;

class RuleBuilder<T, TProp> {
  private checks: Array<(obj: T) => ValidationFailure | null> = [];

  constructor(
    private propertyName: string,
    private accessor: PropertyAccessor<T, TProp>
  ) {}

  public notEmpty(customMessage?: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (val === undefined || val === null || (typeof val === 'string' && val.trim() === '') || (Array.isArray(val) && val.length === 0)) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' boş bırakılamaz.`
        };
      }
      return null;
    });
    return this;
  }

  public notNull(customMessage?: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (val === undefined || val === null) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' değeri zorunludur.`
        };
      }
      return null;
    });
    return this;
  }

  public minLength(min: number, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (typeof val === 'string' && val.trim().length < min) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' en az ${min} karakter olmalıdır.`
        };
      }
      return null;
    });
    return this;
  }

  public maxLength(max: number, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (typeof val === 'string' && val.trim().length > max) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' en fazla ${max} karakter olabilir.`
        };
      }
      return null;
    });
    return this;
  }

  public greaterThan(value: number, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = Number(this.accessor(obj));
      if (isNaN(val) || val <= value) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' ${value} değerinden büyük olmalıdır.`
        };
      }
      return null;
    });
    return this;
  }

  public greaterThanOrEqualTo(value: number, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = Number(this.accessor(obj));
      if (isNaN(val) || val < value) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' en az ${value} olmalıdır.`
        };
      }
      return null;
    });
    return this;
  }

  public lessThanOrEqualTo(value: number, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = Number(this.accessor(obj));
      if (isNaN(val) || val > value) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' en fazla ${value} olabilir.`
        };
      }
      return null;
    });
    return this;
  }

  public emailAddress(customMessage?: string): this {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (typeof val === 'string' && !emailRegex.test(val.trim())) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' geçerli bir e-posta adresi olmalıdır.`
        };
      }
      return null;
    });
    return this;
  }

  public matches(pattern: RegExp, customMessage?: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (typeof val === 'string' && !pattern.test(val)) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage || `'${this.propertyName}' beklenen formata uymuyor.`
        };
      }
      return null;
    });
    return this;
  }

  public must(predicate: (val: TProp, entity: T) => boolean, customMessage: string): this {
    this.checks.push((obj) => {
      const val = this.accessor(obj);
      if (!predicate(val, obj)) {
        return {
          propertyName: this.propertyName,
          errorMessage: customMessage
        };
      }
      return null;
    });
    return this;
  }

  public execute(obj: T): ValidationFailure[] {
    const failures: ValidationFailure[] = [];
    for (const check of this.checks) {
      const result = check(obj);
      if (result) {
        failures.push(result);
      }
    }
    return failures;
  }
}

export abstract class AbstractValidator<T> {
  private rules: RuleBuilder<T, any>[] = [];

  protected ruleFor<TProp>(propertyName: string, accessor: PropertyAccessor<T, TProp>): RuleBuilder<T, TProp> {
    const builder = new RuleBuilder<T, TProp>(propertyName, accessor);
    this.rules.push(builder);
    return builder;
  }

  public validate(obj: T): ValidationResult {
    const failures: ValidationFailure[] = [];
    if (!obj || typeof obj !== 'object') {
      return new ValidationResult([{ propertyName: 'Payload', errorMessage: 'İstek gövdesi (body) boş veya geçersiz nesne.' }]);
    }

    for (const rule of this.rules) {
      const ruleFailures = rule.execute(obj);
      failures.push(...ruleFailures);
    }
    return new ValidationResult(failures);
  }

  public validateAndThrow(obj: T): void {
    const result = this.validate(obj);
    if (!result.isValid) {
      throw new ValidationException(result.errors);
    }
  }
}
