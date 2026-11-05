export interface CSharpFile {
  id: string;
  filename: string;
  title: string;
  category: 'validator' | 'controller' | 'dto' | 'configuration';
  description: string;
  code: string;
}

export const CSHARP_FILES: CSharpFile[] = [
  {
    id: 'update-validator',
    filename: 'UpdateProductDtoValidator.cs',
    title: 'Update Validasyon Sınıfı',
    category: 'validator',
    description: 'Ürün güncelleme işlemi için FluentValidation kurallarını barındıran AbstractValidator<UpdateProductDto> sınıfı.',
    code: `using FluentValidation;
using App.Domain.DTOs;

namespace App.Application.Validators;

/// <summary>
/// Ürün Güncelleme (Update) işlemi için FluentValidation sınıfı.
/// Hazırlayan: Enes Öztürk
/// </summary>
public class UpdateProductDtoValidator : AbstractValidator<UpdateProductDto>
{
    public UpdateProductDtoValidator()
    {
        // 1. Id Validasyonu (Güncellenecek varlığın geçerli bir ID'ye sahip olması şarttır)
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Güncellenecek ürünün Id değeri 0'dan büyük bir pozitif tamsayı olmalıdır.");

        // 2. Ürün Adı (Name) Validasyonu
        RuleFor(x => x.Name)
            .NotEmpty()
            .WithMessage("Ürün adı boş geçilemez.")
            .MinimumLength(3)
            .WithMessage("Ürün adı en az 3 karakterden oluşmalıdır.")
            .MaximumLength(100)
            .WithMessage("Ürün adı en fazla 100 karakter olabilir.")
            .Must(NotContainForbiddenKeywords)
            .WithMessage("Ürün adı geçersiz karakterler veya yasaklı ifadeler içeremez.");

        // 3. Fiyat (Price) Validasyonu
        RuleFor(x => x.Price)
            .GreaterThan(0)
            .WithMessage("Ürün fiyatı 0'dan büyük olmalıdır.")
            .PrecisionScale(18, 2, ignoreTrailingZeros: false)
            .WithMessage("Ürün fiyatı en fazla 2 basamaklı ondalık içerebilir (Örn: 149.90).");

        // 4. Stok (Stock) Validasyonu
        RuleFor(x => x.Stock)
            .GreaterThanOrEqualTo(0)
            .WithMessage("Stok miktarı negatif bir değer olamaz.")
            .LessThanOrEqualTo(100_000)
            .WithMessage("Tek seferde stok miktarı 100.000 adetten fazla güncellenemez.");

        // 5. Kategori (CategoryId) Validasyonu
        RuleFor(x => x.CategoryId)
            .GreaterThan(0)
            .WithMessage("Geçerli bir kategori seçilmelidir (CategoryId > 0 olmalıdır).");

        // 6. Açıklama (Description) - Şarta bağlı validasyon
        RuleFor(x => x.Description)
            .MaximumLength(500)
            .WithMessage("Ürün açıklaması en fazla 500 karakter olabilir.")
            .When(x => !string.IsNullOrWhiteSpace(x.Description));
    }

    /// <summary>
    /// Özel kural: Yasaklı kelimeleri ve şüpheli script etiketlerini engeller.
    /// </summary>
    private bool NotContainForbiddenKeywords(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return false;
        string lower = name.ToLowerInvariant();
        return !lower.Contains("<script>") && !lower.Contains("drop table") && !lower.Contains("undefined");
    }
}`
  },
  {
    id: 'delete-validator',
    filename: 'DeleteProductRequestValidator.cs',
    title: 'Delete Validasyon Sınıfı',
    category: 'validator',
    description: 'Ürün silme işlemi için Id, silme nedeni ve güvenlik onayı kontrollerini yapan AbstractValidator sınıfı.',
    code: `using FluentValidation;
using App.Domain.DTOs;

namespace App.Application.Validators;

/// <summary>
/// Ürün Silme (Delete) işlemi için FluentValidation sınıfı.
/// Hazırlayan: Enes Öztürk
/// </summary>
public class DeleteProductRequestValidator : AbstractValidator<DeleteProductRequest>
{
    public DeleteProductRequestValidator()
    {
        // 1. Silinecek Ürün ID Validasyonu
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Silinecek ürünün ID değeri 0'dan büyük pozitif bir tamsayı olmalıdır.");

        // 2. Silme Gerekçesi (Audit & Güvenlik logları için zorunludur)
        RuleFor(x => x.Reason)
            .NotEmpty()
            .WithMessage("Silme gerekçesi (Reason) boş bırakılamaz.")
            .MinimumLength(5)
            .WithMessage("Silme gerekçesi en az 5 karakter uzunluğunda açıklayıcı olmalıdır.")
            .MaximumLength(250)
            .WithMessage("Silme gerekçesi 250 karakteri geçemez.");

        // 3. Silme Talebini Yapan Yetkili E-Postası
        RuleFor(x => x.DeletedBy)
            .NotEmpty()
            .WithMessage("İşlemi gerçekleştiren kullanıcı e-posta adresi (DeletedBy) zorunludur.")
            .EmailAddress()
            .WithMessage("Lütfen geçerli bir kurumsal e-posta adresi giriniz.");

        // 4. Kalıcı Silme Güvenlik Onayı
        RuleFor(x => x.ConfirmPermanentDelete)
            .Equal(true)
            .WithMessage("Kalıcı silme işlemi için açık onay (ConfirmPermanentDelete = true) verilmelidir.");
    }
}`
  },
  {
    id: 'getbyid-validator',
    filename: 'GetProductByIdRequestValidator.cs',
    title: 'GetById Validasyon Sınıfı',
    category: 'validator',
    description: 'Tekil kayıt getirme sorguları için Id parametresi doğrulama kurallarını barındıran sınıf.',
    code: `using FluentValidation;
using App.Domain.DTOs;

namespace App.Application.Validators;

/// <summary>
/// GetById (ID ile Kayıt Getirme) metodu için FluentValidation sınıfı.
/// Hazırlayan: Enes Öztürk
/// </summary>
public class GetProductByIdRequestValidator : AbstractValidator<GetProductByIdRequest>
{
    public GetProductByIdRequestValidator()
    {
        RuleFor(x => x.Id)
            .GreaterThan(0)
            .WithMessage("Sorgulanacak ürün ID değeri 0'dan büyük pozitif bir tamsayı olmalıdır.")
            .LessThanOrEqualTo(int.MaxValue)
            .WithMessage($"ID değeri azami tamsayı sınırını ({int.MaxValue}) aşamaz.");
    }
}`
  },
  {
    id: 'products-controller',
    filename: 'ProductsController.cs',
    title: 'ProductsController (Validasyon Çağrımlı)',
    category: 'controller',
    description: 'Update, Delete ve GetById metot çağrımlarından ÖNCE FluentValidation kurallarını manuel çalıştıran Controller.',
    code: `using Microsoft.AspNetCore.Mvc;
using FluentValidation;
using FluentValidation.Results;
using App.Domain.DTOs;
using App.Domain.Entities;
using App.Application.Services;

namespace App.API.Controllers;

/// <summary>
/// Fluent Validation Ödevi - Controller Entegrasyonu
/// Tüm metot çağrımlarından ÖNCE validasyonlar çalıştırılır, geçersiz ise servis metoduna gidilmez.
/// Hazırlayan: Enes Öztürk
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IProductService _productService;
    private readonly IValidator<UpdateProductDto> _updateValidator;
    private readonly IValidator<DeleteProductRequest> _deleteValidator;
    private readonly IValidator<GetProductByIdRequest> _getByIdValidator;

    public ProductsController(
        IProductService productService,
        IValidator<UpdateProductDto> updateValidator,
        IValidator<DeleteProductRequest> deleteValidator,
        IValidator<GetProductByIdRequest> getByIdValidator)
    {
        _productService = productService;
        _updateValidator = updateValidator;
        _deleteValidator = deleteValidator;
        _getByIdValidator = getByIdValidator;
    }

    /// <summary>
    /// ID'ye göre ürün getirir.
    /// Metot çağrımından (servisten) önce GetProductByIdRequestValidator çalıştırılır.
    /// </summary>
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById([FromRoute] int id)
    {
        var request = new GetProductByIdRequest { Id = id };

        // 1. ADIM: Servis çağrılmadan ÖNCE validasyonu çalıştır:
        ValidationResult validationResult = await _getByIdValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            // Validasyon başarısız! Servis çağrısı ASLA YAPILMAZ.
            return BadRequest(new
            {
                Success = false,
                Message = "GetById isteği doğrulanamadı.",
                Errors = validationResult.Errors.Select(e => new
                {
                    Field = e.PropertyName,
                    Message = e.ErrorMessage,
                    AttemptedValue = e.AttemptedValue
                })
            });
        }

        // 2. ADIM: Validasyon geçti, artık servis metodu güvenle çağrılabilir:
        Product? product = await _productService.GetByIdAsync(id);

        if (product is null)
        {
            return NotFound(new { Success = false, Message = $"ID: {id} numaralı ürün bulunamadı." });
        }

        return Ok(new { Success = true, Data = product });
    }

    /// <summary>
    /// Mevcut ürünü günceller.
    /// Servis Update metodu çağrılmadan önce UpdateProductDtoValidator çalıştırılır.
    /// </summary>
    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update([FromRoute] int id, [FromBody] UpdateProductDto dto)
    {
        // 1. ADIM: Route ile Body ID tutarlılık kontrolü
        if (id != dto.Id)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "URL rotasındaki ID ({id}) ile istek gövdesindeki ID ({dto.Id}) eşleşmiyor."
            });
        }

        // 2. ADIM: Servis çağrılmadan ÖNCE FluentValidation çalıştırılır:
        ValidationResult validationResult = await _updateValidator.ValidateAsync(dto);

        if (!validationResult.IsValid)
        {
            // Validasyon başarısız! Servis çağrısı durdurulur ve 400 Bad Request dönülür.
            return BadRequest(new
            {
                Success = false,
                Message = "Ürün güncelleme validasyon hatası.",
                Errors = validationResult.Errors.Select(e => new
                {
                    Field = e.PropertyName,
                    Message = e.ErrorMessage,
                    AttemptedValue = e.AttemptedValue
                })
            });
        }

        // 3. ADIM: Validasyon başarıyla geçti, şimdi servis metodu tetiklenir:
        Product updatedProduct = await _productService.UpdateAsync(dto);

        return Ok(new
        {
            Success = true,
            Message = "Ürün başarıyla güncellendi.",
            Data = updatedProduct
        });
    }

    /// <summary>
    /// Ürünü gerekçe belirterek siler.
    /// Servis Delete metodu çağrılmadan önce DeleteProductRequestValidator çalıştırılır.
    /// </summary>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete([FromRoute] int id, [FromBody] DeleteProductRequest request)
    {
        if (id != request.Id)
        {
            return BadRequest(new
            {
                Success = false,
                Message = "URL parametresi ile gönderilen silme nesnesinin Id değeri eşleşmiyor."
            });
        }

        // 1. ADIM: Servis metot çağrımından ÖNCE validasyonu çalıştır:
        ValidationResult validationResult = await _deleteValidator.ValidateAsync(request);

        if (!validationResult.IsValid)
        {
            // Validasyon başarısız! Silme servisine gidilmez.
            return BadRequest(new
            {
                Success = false,
                Message = "Silme işlemi doğrulama kurallarına takıldı.",
                Errors = validationResult.Errors.Select(e => new
                {
                    Field = e.PropertyName,
                    Message = e.ErrorMessage,
                    AttemptedValue = e.AttemptedValue
                })
            });
        }

        // 2. ADIM: Doğrulama başarılı, servis metodu çağrılır:
        bool isDeleted = await _productService.DeleteAsync(request.Id, request.Reason, request.DeletedBy);

        if (!isDeleted)
        {
            return NotFound(new { Success = false, Message = $"Silinmek istenen {id} ID'li ürün sistemde bulunamadı." });
        }

        return Ok(new
        {
            Success = true,
            Message = $"{id} ID'li ürün başarıyla silindi.",
            Details = new { request.Id, request.Reason, request.DeletedBy, DeletedAt = DateTime.UtcNow }
        });
    }
}`
  },
  {
    id: 'dtos',
    filename: 'ProductDtos.cs',
    title: 'DTO & İstek Modelleri',
    category: 'dto',
    description: 'Validasyona tabi tutulan Update, Delete ve GetById istek modelleri ve Product varlığı.',
    code: `namespace App.Domain.DTOs;

/// <summary>
/// Güncelleme isteği için veri transfer nesnesi (DTO).
/// </summary>
public class UpdateProductDto
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public int Stock { get; set; }
    public int CategoryId { get; set; }
    public string? Description { get; set; }
}

/// <summary>
/// Güvenli silme isteği modeli (Audit ve onay içerir).
/// </summary>
public class DeleteProductRequest
{
    public int Id { get; set; }
    public string Reason { get; set; } = string.Empty;
    public string DeletedBy { get; set; } = string.Empty;
    public bool ConfirmPermanentDelete { get; set; }
}

/// <summary>
/// Tekil sorgulama isteği modeli.
/// </summary>
public class GetProductByIdRequest
{
    public int Id { get; set; }
}

namespace App.Domain.Entities
{
    public class Product
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
        public int Stock { get; set; }
        public int CategoryId { get; set; }
        public string? Description { get; set; }
        public DateTime UpdatedAt { get; set; }
    }
}`
  },
  {
    id: 'program-cs',
    filename: 'Program.cs',
    title: 'Dependency Injection (Program.cs)',
    category: 'configuration',
    description: 'FluentValidation doğrulayıcılarının IoC Container içerisine otomatik kaydedilme konfigürasyonu.',
    code: `using FluentValidation;
using App.Application.Validators;
using App.Application.Services;

var builder = WebApplication.CreateBuilder(args);

// Controller servislerini ekle
builder.Services.AddControllers();

// Swagger / OpenAPI dokümantasyonu
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// =========================================================================
// FLUENT VALIDATION ENTEGRASYONU (Hazırlayan: Enes Öztürk)
// =========================================================================
// Belirtilen assembly içerisindeki tüm AbstractValidator türevlerini (UpdateProductDtoValidator,
// DeleteProductRequestValidator, GetProductByIdRequestValidator vb.) otomatik olarak
// DI konteynerına Transient/Scoped servis olarak kaydeder:
builder.Services.AddValidatorsFromAssemblyContaining<UpdateProductDtoValidator>();

// Uygulama Servisleri
builder.Services.AddScoped<IProductService, ProductService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();`
  }
];
