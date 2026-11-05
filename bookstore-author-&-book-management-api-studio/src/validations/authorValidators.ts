import {
  CreateAuthorModel,
  UpdateAuthorModel,
  ValidationResult,
  ValidationError,
} from '../types';

/**
 * Fluent Validation Kural Motoru
 * C# FluentValidation: AbstractValidator<T> yapısına birebir karşılık gelir.
 * 
 * Kurallar:
 * 1. Ad (FirstName): Boş olamaz, min 2, max 50 karakter, harflerden oluşmalı
 * 2. Soyad (LastName): Boş olamaz, min 2, max 50 karakter
 * 3. Doğum Tarihi (BirthDate): Boş olamaz, bugünden küçük/geçmişte olmalı, 1800 yılından büyük olmalı
 * 
 * İmza: Enes Öztürk
 */

export class CreateAuthorCommandValidator {
  public static validate(model: CreateAuthorModel): ValidationResult {
    const errors: ValidationError[] = [];

    // FirstName Rules
    if (!model.firstName || model.firstName.trim().length === 0) {
      errors.push({
        propertyName: 'FirstName',
        errorMessage: 'Yazar adı boş bırakılamaz.',
        attemptedValue: model.firstName,
      });
    } else {
      const trimmed = model.firstName.trim();
      if (trimmed.length < 2) {
        errors.push({
          propertyName: 'FirstName',
          errorMessage: 'Yazar adı en az 2 karakter olmalıdır.',
          attemptedValue: model.firstName,
        });
      }
      if (trimmed.length > 50) {
        errors.push({
          propertyName: 'FirstName',
          errorMessage: 'Yazar adı en fazla 50 karakter olabilir.',
          attemptedValue: model.firstName,
        });
      }
      // Yalnızca harfler ve boşluk
      const nameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$/;
      if (!nameRegex.test(trimmed)) {
        errors.push({
          propertyName: 'FirstName',
          errorMessage: 'Yazar adı yalnızca alfabetik karakterlerden oluşmalıdır.',
          attemptedValue: model.firstName,
        });
      }
    }

    // LastName Rules
    if (!model.lastName || model.lastName.trim().length === 0) {
      errors.push({
        propertyName: 'LastName',
        errorMessage: 'Yazar soyadı boş bırakılamaz.',
        attemptedValue: model.lastName,
      });
    } else {
      const trimmed = model.lastName.trim();
      if (trimmed.length < 2) {
        errors.push({
          propertyName: 'LastName',
          errorMessage: 'Yazar soyadı en az 2 karakter olmalıdır.',
          attemptedValue: model.lastName,
        });
      }
      if (trimmed.length > 50) {
        errors.push({
          propertyName: 'LastName',
          errorMessage: 'Yazar soyadı en fazla 50 karakter olabilir.',
          attemptedValue: model.lastName,
        });
      }
      const lastNameRegex = /^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$/;
      if (!lastNameRegex.test(trimmed)) {
        errors.push({
          propertyName: 'LastName',
          errorMessage: 'Yazar soyadı yalnızca alfabetik karakterlerden oluşmalıdır.',
          attemptedValue: model.lastName,
        });
      }
    }

    // BirthDate Rules
    if (!model.birthDate || model.birthDate.trim().length === 0) {
      errors.push({
        propertyName: 'BirthDate',
        errorMessage: 'Yazarın doğum tarihi seçilmelidir.',
        attemptedValue: model.birthDate,
      });
    } else {
      const birth = new Date(model.birthDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (isNaN(birth.getTime())) {
        errors.push({
          propertyName: 'BirthDate',
          errorMessage: 'Geçersiz bir tarih formatı girildi.',
          attemptedValue: model.birthDate,
        });
      } else {
        if (birth >= today) {
          errors.push({
            propertyName: 'BirthDate',
            errorMessage: 'Doğum tarihi bugünden veya gelecek bir tarihte olamaz.',
            attemptedValue: model.birthDate,
          });
        }
        const minYear = 1800;
        if (birth.getFullYear() < minYear) {
          errors.push({
            propertyName: 'BirthDate',
            errorMessage: `Doğum yılı ${minYear} yılından önce olamaz.`,
            attemptedValue: model.birthDate,
          });
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class UpdateAuthorCommandValidator {
  public static validate(id: number, model: UpdateAuthorModel): ValidationResult {
    const errors: ValidationError[] = [];

    if (!id || id <= 0 || !Number.isInteger(id)) {
      errors.push({
        propertyName: 'Id',
        errorMessage: 'Güncellenecek yazar Id değeri 0 dan büyük tam sayı olmalıdır.',
        attemptedValue: id,
      });
    }

    const baseResult = CreateAuthorCommandValidator.validate(model);
    errors.push(...baseResult.errors);

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class DeleteAuthorCommandValidator {
  public static validate(authorId: number): ValidationResult {
    const errors: ValidationError[] = [];

    if (!authorId || authorId <= 0 || !Number.isInteger(authorId)) {
      errors.push({
        propertyName: 'AuthorId',
        errorMessage: 'Silinecek yazar Id değeri 0 dan büyük bir tam sayı olmalıdır.',
        attemptedValue: authorId,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

export class GetAuthorDetailQueryValidator {
  public static validate(authorId: number): ValidationResult {
    const errors: ValidationError[] = [];

    if (!authorId || authorId <= 0 || !Number.isInteger(authorId)) {
      errors.push({
        propertyName: 'AuthorId',
        errorMessage: 'Getirilecek yazar Id değeri 0 dan büyük bir tam sayı olmalıdır.',
        attemptedValue: authorId,
      });
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
