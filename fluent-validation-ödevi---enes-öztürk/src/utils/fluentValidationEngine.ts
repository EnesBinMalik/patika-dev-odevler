export interface ValidationError {
  field: string;
  message: string;
  attemptedValue: any;
  rule: string;
}

export interface ValidationExecutionResult<T> {
  isValid: boolean;
  errors: ValidationError[];
  statusCode: 200 | 400 | 404;
  controllerExecutedBeforeService: boolean;
  serviceMethodCalled: boolean;
  executionSteps: {
    step: number;
    title: string;
    description: string;
    status: 'success' | 'failed' | 'skipped' | 'info';
    timestamp: string;
  }[];
  responsePayload: Record<string, any>;
  data?: T;
}

export interface UpdateProductInput {
  id: number;
  name: string;
  price: number;
  stock: number;
  categoryId: number;
  description: string;
}

export interface DeleteProductInput {
  id: number;
  reason: string;
  deletedBy: string;
  confirmPermanentDelete: boolean;
}

export interface GetByIdInput {
  id: number;
}

// Validation Engine for UpdateProductDto
export function validateUpdateProductDto(dto: UpdateProductInput): ValidationExecutionResult<UpdateProductInput> {
  const errors: ValidationError[] = [];
  const now = () => new Date().toLocaleTimeString('tr-TR', { hour12: false });
  const steps: ValidationExecutionResult<UpdateProductInput>['executionSteps'] = [];

  // Step 1: Controller Received Request
  steps.push({
    step: 1,
    title: 'HTTP PUT İsteği Controller\'a Ulaştı',
    description: `PUT /api/products/${dto.id} endpoint'i tetiklendi. Gövde verisi alındı.`,
    status: 'info',
    timestamp: now(),
  });

  // Step 2: Fluent Validation Manual Execution
  steps.push({
    step: 2,
    title: 'UpdateProductDtoValidator.ValidateAsync() Çalıştırıldı',
    description: 'Controller, servis metodunu çağırmadan önce FluentValidation kurallarını çalıştırdı.',
    status: 'info',
    timestamp: now(),
  });

  // Check 1: Id
  if (!Number.isInteger(dto.id) || dto.id <= 0) {
    errors.push({
      field: 'Id',
      message: "Güncellenecek ürünün Id değeri 0'dan büyük bir pozitif tamsayı olmalıdır.",
      attemptedValue: dto.id,
      rule: 'GreaterThan(0)'
    });
  }

  // Check 2: Name
  if (!dto.name || dto.name.trim().length === 0) {
    errors.push({
      field: 'Name',
      message: 'Ürün adı boş geçilemez.',
      attemptedValue: dto.name,
      rule: 'NotEmpty()'
    });
  } else if (dto.name.trim().length < 3) {
    errors.push({
      field: 'Name',
      message: 'Ürün adı en az 3 karakterden oluşmalıdır.',
      attemptedValue: dto.name,
      rule: 'MinimumLength(3)'
    });
  } else if (dto.name.length > 100) {
    errors.push({
      field: 'Name',
      message: 'Ürün adı en fazla 100 karakter olabilir.',
      attemptedValue: dto.name,
      rule: 'MaximumLength(100)'
    });
  } else if (dto.name.toLowerCase().includes('<script>') || dto.name.toLowerCase().includes('drop table')) {
    errors.push({
      field: 'Name',
      message: 'Ürün adı geçersiz karakterler veya yasaklı ifadeler içeremez.',
      attemptedValue: dto.name,
      rule: 'Must(NotContainForbiddenKeywords)'
    });
  }

  // Check 3: Price
  if (dto.price === undefined || dto.price === null || isNaN(dto.price) || dto.price <= 0) {
    errors.push({
      field: 'Price',
      message: "Ürün fiyatı 0'dan büyük olmalıdır.",
      attemptedValue: dto.price,
      rule: 'GreaterThan(0)'
    });
  } else {
    // Precision scale check: max 2 decimals
    const str = dto.price.toString();
    const parts = str.split('.');
    if (parts.length > 1 && parts[1].length > 2) {
      errors.push({
        field: 'Price',
        message: 'Ürün fiyatı en fazla 2 basamaklı ondalık içerebilir (Örn: 149.90).',
        attemptedValue: dto.price,
        rule: 'PrecisionScale(18, 2)'
      });
    }
  }

  // Check 4: Stock
  if (dto.stock === undefined || isNaN(dto.stock) || !Number.isInteger(dto.stock) || dto.stock < 0) {
    errors.push({
      field: 'Stock',
      message: 'Stok miktarı negatif bir değer olamaz ve tamsayı olmalıdır.',
      attemptedValue: dto.stock,
      rule: 'GreaterThanOrEqualTo(0)'
    });
  } else if (dto.stock > 100000) {
    errors.push({
      field: 'Stock',
      message: 'Tek seferde stok miktarı 100.000 adetten fazla güncellenemez.',
      attemptedValue: dto.stock,
      rule: 'LessThanOrEqualTo(100000)'
    });
  }

  // Check 5: CategoryId
  if (!Number.isInteger(dto.categoryId) || dto.categoryId <= 0) {
    errors.push({
      field: 'CategoryId',
      message: "Geçerli bir kategori seçilmelidir (CategoryId > 0 olmalıdır).",
      attemptedValue: dto.categoryId,
      rule: 'GreaterThan(0)'
    });
  }

  // Check 6: Description (when provided)
  if (dto.description && dto.description.length > 500) {
    errors.push({
      field: 'Description',
      message: 'Ürün açıklaması en fazla 500 karakter olabilir.',
      attemptedValue: `${dto.description.substring(0, 30)}... (${dto.description.length} kr)`,
      rule: 'MaximumLength(500)'
    });
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    steps.push({
      step: 3,
      title: 'Validasyon Başarısız! Servis Metodu Engellendi 🛡️',
      description: `Toplam ${errors.length} adet kural ihlali tespit edildi. IProductService.UpdateAsync() METODU ÇAĞRILMADI. HTTP 400 Bad Request üretildi.`,
      status: 'failed',
      timestamp: now(),
    });

    return {
      isValid: false,
      errors,
      statusCode: 400,
      controllerExecutedBeforeService: true,
      serviceMethodCalled: false,
      executionSteps: steps,
      responsePayload: {
        success: false,
        message: 'Ürün güncelleme validasyon hatası.',
        status: 400,
        errors: errors.map(e => ({
          field: e.field,
          message: e.message,
          rule: e.rule,
          attemptedValue: e.attemptedValue
        })),
        authorSignature: 'Enes Öztürk'
      }
    };
  }

  // If valid:
  steps.push({
    step: 3,
    title: 'Validasyon Başarılı! Servis Metoduna Geçildi ✅',
    description: 'Tüm FluentValidation kuralları sağlandı. Controller, IProductService.UpdateAsync(dto) metodunu başarıyla tetikledi.',
    status: 'success',
    timestamp: now(),
  });

  steps.push({
    step: 4,
    title: 'HTTP 200 OK Yanıtı Üretildi',
    description: 'Veritabanı güncellendi ve istemciye başarı yanıtı döndürüldü.',
    status: 'success',
    timestamp: now(),
  });

  return {
    isValid: true,
    errors: [],
    statusCode: 200,
    controllerExecutedBeforeService: true,
    serviceMethodCalled: true,
    executionSteps: steps,
    responsePayload: {
      success: true,
      message: 'Ürün başarıyla güncellendi.',
      status: 200,
      data: {
        id: dto.id,
        name: dto.name,
        price: dto.price,
        stock: dto.stock,
        categoryId: dto.categoryId,
        description: dto.description || null,
        updatedAt: new Date().toISOString()
      },
      authorSignature: 'Enes Öztürk'
    },
    data: dto
  };
}

// Validation Engine for DeleteProductRequest
export function validateDeleteProductRequest(req: DeleteProductInput): ValidationExecutionResult<DeleteProductInput> {
  const errors: ValidationError[] = [];
  const now = () => new Date().toLocaleTimeString('tr-TR', { hour12: false });
  const steps: ValidationExecutionResult<DeleteProductInput>['executionSteps'] = [];

  steps.push({
    step: 1,
    title: 'HTTP DELETE İsteği Controller\'a Ulaştı',
    description: `DELETE /api/products/${req.id} isteği ve silme onay parametreleri alındı.`,
    status: 'info',
    timestamp: now(),
  });

  steps.push({
    step: 2,
    title: 'DeleteProductRequestValidator.ValidateAsync() Çalıştırıldı',
    description: 'Controller, veritabanı silme servisinden önce silme kurallarını ve güvenlik onayını denetledi.',
    status: 'info',
    timestamp: now(),
  });

  // Check 1: Id
  if (!Number.isInteger(req.id) || req.id <= 0) {
    errors.push({
      field: 'Id',
      message: "Silinecek ürünün ID değeri 0'dan büyük pozitif bir tamsayı olmalıdır.",
      attemptedValue: req.id,
      rule: 'GreaterThan(0)'
    });
  }

  // Check 2: Reason
  if (!req.reason || req.reason.trim().length === 0) {
    errors.push({
      field: 'Reason',
      message: 'Silme gerekçesi (Reason) boş bırakılamaz.',
      attemptedValue: req.reason,
      rule: 'NotEmpty()'
    });
  } else if (req.reason.trim().length < 5) {
    errors.push({
      field: 'Reason',
      message: 'Silme gerekçesi en az 5 karakter uzunluğunda açıklayıcı olmalıdır.',
      attemptedValue: req.reason,
      rule: 'MinimumLength(5)'
    });
  } else if (req.reason.length > 250) {
    errors.push({
      field: 'Reason',
      message: 'Silme gerekçesi 250 karakteri geçemez.',
      attemptedValue: `${req.reason.substring(0, 30)}...`,
      rule: 'MaximumLength(250)'
    });
  }

  // Check 3: DeletedBy (Email)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!req.deletedBy || req.deletedBy.trim().length === 0) {
    errors.push({
      field: 'DeletedBy',
      message: 'İşlemi gerçekleştiren kullanıcı e-posta adresi (DeletedBy) zorunludur.',
      attemptedValue: req.deletedBy,
      rule: 'NotEmpty()'
    });
  } else if (!emailRegex.test(req.deletedBy)) {
    errors.push({
      field: 'DeletedBy',
      message: 'Lütfen geçerli bir kurumsal e-posta adresi giriniz.',
      attemptedValue: req.deletedBy,
      rule: 'EmailAddress()'
    });
  }

  // Check 4: ConfirmPermanentDelete
  if (req.confirmPermanentDelete !== true) {
    errors.push({
      field: 'ConfirmPermanentDelete',
      message: 'Kalıcı silme işlemi için açık onay (ConfirmPermanentDelete = true) verilmelidir.',
      attemptedValue: req.confirmPermanentDelete,
      rule: 'Equal(true)'
    });
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    steps.push({
      step: 3,
      title: 'Validasyon Başarısız! Silme Servisi Engellendi 🛡️',
      description: `Toplam ${errors.length} adet kural ihlali. IProductService.DeleteAsync() METODU ÇAĞRILMADI. Kayıt güvende. HTTP 400 Bad Request.`,
      status: 'failed',
      timestamp: now(),
    });

    return {
      isValid: false,
      errors,
      statusCode: 400,
      controllerExecutedBeforeService: true,
      serviceMethodCalled: false,
      executionSteps: steps,
      responsePayload: {
        success: false,
        message: 'Silme işlemi doğrulama kurallarına takıldı.',
        status: 400,
        errors: errors.map(e => ({
          field: e.field,
          message: e.message,
          rule: e.rule,
          attemptedValue: e.attemptedValue
        })),
        authorSignature: 'Enes Öztürk'
      }
    };
  }

  steps.push({
    step: 3,
    title: 'Validasyon Başarılı! Silme Servisi Tetiklendi ✅',
    description: 'Tüm silme kriterleri ve güvenlik onayları sağlandı. IProductService.DeleteAsync() çağrıldı.',
    status: 'success',
    timestamp: now(),
  });

  steps.push({
    step: 4,
    title: 'HTTP 200 OK (Kayıt Silindi)',
    description: `Ürün (Id: ${req.id}) başarıyla silindi ve denetim loguna kaydedildi.`,
    status: 'success',
    timestamp: now(),
  });

  return {
    isValid: true,
    errors: [],
    statusCode: 200,
    controllerExecutedBeforeService: true,
    serviceMethodCalled: true,
    executionSteps: steps,
    responsePayload: {
      success: true,
      message: `${req.id} ID'li ürün başarıyla silindi.`,
      status: 200,
      details: {
        id: req.id,
        reason: req.reason,
        deletedBy: req.deletedBy,
        deletedAt: new Date().toISOString()
      },
      authorSignature: 'Enes Öztürk'
    },
    data: req
  };
}

// Validation Engine for GetProductByIdRequest
export function validateGetProductByIdRequest(input: GetByIdInput): ValidationExecutionResult<GetByIdInput> {
  const errors: ValidationError[] = [];
  const now = () => new Date().toLocaleTimeString('tr-TR', { hour12: false });
  const steps: ValidationExecutionResult<GetByIdInput>['executionSteps'] = [];

  steps.push({
    step: 1,
    title: 'HTTP GET İsteği Controller\'a Ulaştı',
    description: `GET /api/products/${input.id} isteği route parametresi ile alındı.`,
    status: 'info',
    timestamp: now(),
  });

  steps.push({
    step: 2,
    title: 'GetProductByIdRequestValidator.ValidateAsync() Çalıştırıldı',
    description: 'Controller, veritabanı sorgu servisini çalıştırmadan önce Id parametresini denetledi.',
    status: 'info',
    timestamp: now(),
  });

  // Check 1: Id positive integer
  if (input.id === undefined || input.id === null || isNaN(input.id) || !Number.isInteger(input.id) || input.id <= 0) {
    errors.push({
      field: 'Id',
      message: "Sorgulanacak ürün ID değeri 0'dan büyük pozitif bir tamsayı olmalıdır.",
      attemptedValue: input.id,
      rule: 'GreaterThan(0)'
    });
  } else if (input.id > 2147483647) {
    errors.push({
      field: 'Id',
      message: 'ID değeri azami tamsayı sınırını (2147483647) aşamaz.',
      attemptedValue: input.id,
      rule: 'LessThanOrEqualTo(int.MaxValue)'
    });
  }

  const isValid = errors.length === 0;

  if (!isValid) {
    steps.push({
      step: 3,
      title: 'Validasyon Başarısız! DB Sorgusu Engellendi 🛡️',
      description: 'Geçersiz ID ile veritabanı yorulmadı. IProductService.GetByIdAsync() ÇAĞRILMADI. HTTP 400 Bad Request döndürüldü.',
      status: 'failed',
      timestamp: now(),
    });

    return {
      isValid: false,
      errors,
      statusCode: 400,
      controllerExecutedBeforeService: true,
      serviceMethodCalled: false,
      executionSteps: steps,
      responsePayload: {
        success: false,
        message: 'GetById isteği doğrulanamadı.',
        status: 400,
        errors: errors.map(e => ({
          field: e.field,
          message: e.message,
          rule: e.rule,
          attemptedValue: e.attemptedValue
        })),
        authorSignature: 'Enes Öztürk'
      }
    };
  }

  steps.push({
    step: 3,
    title: 'Validasyon Başarılı! Servis GetByIdAsync() Çağrıldı ✅',
    description: 'ID değeri kurallara uygun. Veritabanından ürün kaydı sorgulanıyor.',
    status: 'success',
    timestamp: now(),
  });

  steps.push({
    step: 4,
    title: 'HTTP 200 OK (Ürün Bulundu)',
    description: 'Ürün verisi başarıyla çekildi ve JSON olarak döndürüldü.',
    status: 'success',
    timestamp: now(),
  });

  return {
    isValid: true,
    errors: [],
    statusCode: 200,
    controllerExecutedBeforeService: true,
    serviceMethodCalled: true,
    executionSteps: steps,
    responsePayload: {
      success: true,
      status: 200,
      data: {
        id: input.id,
        name: `Endüstriyel Akıllı Sensör Modülü X-${input.id}`,
        price: 1850.50,
        stock: 42,
        categoryId: 3,
        description: 'Yüksek hassasiyetli IoT uyumlu sıcaklık ve titreşim sensörü.',
        createdAt: '2025-01-15T08:30:00Z',
        updatedAt: '2025-02-20T14:45:00Z'
      },
      authorSignature: 'Enes Öztürk'
    },
    data: input
  };
}
