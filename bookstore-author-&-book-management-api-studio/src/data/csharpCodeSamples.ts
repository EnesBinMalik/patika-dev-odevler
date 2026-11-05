export interface CodeFile {
  id: string;
  name: string;
  folder: string;
  language: string;
  description: string;
  code: string;
}

export const CSHARP_CODE_FILES: CodeFile[] = [
  {
    id: 'author-controller',
    name: 'AuthorController.cs',
    folder: 'Controllers',
    language: 'csharp',
    description: 'Controller metotları entityleri doğrudan input/output olarak kullanmaz; DTO ve ViewModel yapıları ile haberleşir.',
    code: `// ============================================================================
// Proje: BookStore Web API
// Geliştirici: Enes Öztürk
// Açıklama: Author Controller - Yazar işlemlerini yöneten RESTful API uç noktaları.
// Kurallar: Entityler asla doğrudan dışarı açılmaz, DTO/ViewModel kullanılır.
// ============================================================================

using AutoMapper;
using BookStore.DTOs;
using BookStore.Services;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace BookStore.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthorController : ControllerBase
    {
        private readonly IAuthorService _authorService;
        private readonly IMapper _mapper;

        public AuthorController(IAuthorService authorService, IMapper mapper)
        {
            _authorService = authorService;
            _mapper = mapper;
        }

        /// <summary>
        /// 1. Tüm yazarları DTO formatında listeler
        /// GET /api/author
        /// </summary>
        [HttpGet]
        public IActionResult GetAllAuthors()
        {
            var authors = _authorService.GetAllAuthors();
            Response.Headers.Add("X-Developer", "Enes Öztürk");
            return Ok(authors);
        }

        /// <summary>
        /// 2. Belirtilen Id'ye sahip yazarın detaylarını ve kitaplarını getirir
        /// GET /api/author/{id}
        /// </summary>
        [HttpGet("{id:int}")]
        public IActionResult GetAuthorById(int id)
        {
            var authorDetail = _authorService.GetAuthorById(id);
            return Ok(authorDetail);
        }

        /// <summary>
        /// 3. Yeni bir yazar ekler (FluentValidation & AutoMapper)
        /// POST /api/author
        /// </summary>
        [HttpPost]
        public IActionResult CreateAuthor([FromBody] CreateAuthorModel newAuthor)
        {
            var createdAuthor = _authorService.CreateAuthor(newAuthor);
            return CreatedAtAction(nameof(GetAuthorById), new { id = createdAuthor.Id }, createdAuthor);
        }

        /// <summary>
        /// 4. Mevcut yazar bilgilerini günceller
        /// PUT /api/author/{id}
        /// </summary>
        [HttpPut("{id:int}")]
        public IActionResult UpdateAuthor(int id, [FromBody] UpdateAuthorModel updatedAuthor)
        {
            _authorService.UpdateAuthor(id, updatedAuthor);
            return NoContent();
        }

        /// <summary>
        /// 5. Yazar siler (İş Kuralı: Yayında kitabı olan yazar silinemez!)
        /// DELETE /api/author/{id}
        /// </summary>
        [HttpDelete("{id:int}")]
        public IActionResult DeleteAuthor(int id)
        {
            _authorService.DeleteAuthor(id);
            return NoContent();
        }
    }
}
`,
  },
  {
    id: 'author-entities',
    name: 'Author.cs, Book.cs, Genre.cs',
    folder: 'Entities',
    language: 'csharp',
    description: 'Kitap - Yazar - Tür entity ilişkileri (Bir kitabın yalnızca bir yazarı ve bir türü olabilir).',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: Entity Modelleri ve İlişkileri (EF Core / Code-First)
// ============================================================================

using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStore.Entities
{
    // --- YAZAR ENTITY ---
    public class Author
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string FirstName { get; set; } = string.Empty;

        [Required]
        [MaxLength(50)]
        public string LastName { get; set; } = string.Empty;

        [Required]
        public DateTime BirthDate { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        // Navigation Property: Bir yazarın birden fazla kitabı olabilir
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }

    // --- TÜR ENTITY ---
    public class Genre
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(50)]
        public string Name { get; set; } = string.Empty;

        public bool IsActive { get; set; } = true;

        // Navigation Property: Bir türe ait birden fazla kitap olabilir
        public virtual ICollection<Book> Books { get; set; } = new List<Book>();
    }

    // --- KİTAP ENTITY ---
    public class Book
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; } = string.Empty;

        public int PageCount { get; set; }

        public DateTime PublishDate { get; set; }

        // Yayında olup olmadığı bilgisi (Yazar silme iş kuralı için kritik)
        public bool IsPublished { get; set; } = true;

        // Foreign Key: Tür İlişkisi
        [ForeignKey("Genre")]
        public int GenreId { get; set; }
        public virtual Genre Genre { get; set; } = null!;

        // Foreign Key: Yazar İlişkisi (Bir kitabın yalnızca 1 yazarı olabilir)
        [ForeignKey("Author")]
        public int AuthorId { get; set; }
        public virtual Author Author { get; set; } = null!;
    }
}
`,
  },
  {
    id: 'author-dtos',
    name: 'AuthorDTOs.cs',
    folder: 'DTOs',
    language: 'csharp',
    description: 'Controller ve servislerin dış dünya ile haberleştiği Model ve ViewModel sınıfları.',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: DTO ve ViewModel sınıfları. Entity izolasyonu sağlar.
// ============================================================================

using System;
using System.Collections.Generic;

namespace BookStore.DTOs
{
    /// <summary>
    /// Yeni yazar ekleme isteğinde kullanılan DTO
    /// </summary>
    public class CreateAuthorModel
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
    }

    /// <summary>
    /// Yazar güncelleme isteğinde kullanılan DTO
    /// </summary>
    public class UpdateAuthorModel
    {
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public DateTime BirthDate { get; set; }
    }

    /// <summary>
    /// Tüm yazarları listelemede kullanılan özet ViewModel
    /// </summary>
    public class AuthorsViewModel
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty; // Ad + Soyad
        public string BirthDate { get; set; } = string.Empty; // dd.MM.yyyy formatında
        public int Age { get; set; }
        public int BookCount { get; set; }
        public int PublishedBookCount { get; set; }
        public List<string> BookTitles { get; set; } = new();
    }

    /// <summary>
    /// Tek bir yazarın detaylarını ve kitaplarını sunan detay ViewModel
    /// </summary>
    public class AuthorDetailViewModel
    {
        public int Id { get; set; }
        public string FirstName { get; set; } = string.Empty;
        public string LastName { get; set; } = string.Empty;
        public string FullName { get; set; } = string.Empty;
        public string BirthDate { get; set; } = string.Empty;
        public int Age { get; set; }
        public List<AuthorBookSummaryDto> Books { get; set; } = new();
    }

    public class AuthorBookSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string GenreName { get; set; } = string.Empty;
        public string PublishDate { get; set; } = string.Empty;
        public int PageCount { get; set; }
        public bool IsPublished { get; set; }
    }
}
`,
  },
  {
    id: 'mapping-profile',
    name: 'MappingProfile.cs',
    folder: 'Common',
    language: 'csharp',
    description: 'AutoMapper profili ile Entity ve DTO arasındaki özel dönüşümler.',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: AutoMapper Mapping Profile Konfigürasyonu
// ============================================================================

using AutoMapper;
using BookStore.DTOs;
using BookStore.Entities;
using System.Linq;

namespace BookStore.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // CreateAuthorModel -> Author Entity
            CreateMap<CreateAuthorModel, Author>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName.Trim()))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName.Trim()))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.Date));

            // UpdateAuthorModel -> Author Entity
            CreateMap<UpdateAuthorModel, Author>()
                .ForMember(dest => dest.FirstName, opt => opt.MapFrom(src => src.FirstName.Trim()))
                .ForMember(dest => dest.LastName, opt => opt.MapFrom(src => src.LastName.Trim()))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.Date));

            // Author Entity -> AuthorsViewModel (Liste)
            CreateMap<Author, AuthorsViewModel>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("dd.MM.yyyy")))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => DateTime.Today.Year - src.BirthDate.Year))
                .ForMember(dest => dest.BookCount, opt => opt.MapFrom(src => src.Books.Count))
                .ForMember(dest => dest.PublishedBookCount, opt => opt.MapFrom(src => src.Books.Count(b => b.IsPublished)))
                .ForMember(dest => dest.BookTitles, opt => opt.MapFrom(src => src.Books.Select(b => b.Title).ToList()));

            // Author Entity -> AuthorDetailViewModel (Detay)
            CreateMap<Author, AuthorDetailViewModel>()
                .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
                .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("dd.MM.yyyy")))
                .ForMember(dest => dest.Age, opt => opt.MapFrom(src => DateTime.Today.Year - src.BirthDate.Year))
                .ForMember(dest => dest.Books, opt => opt.MapFrom(src => src.Books));

            // Book Entity -> AuthorBookSummaryDto
            CreateMap<Book, AuthorBookSummaryDto>()
                .ForMember(dest => dest.GenreName, opt => opt.MapFrom(src => src.Genre != null ? src.Genre.Name : "Bilinmiyor"))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate.ToString("dd.MM.yyyy")));
        }
    }
}
`,
  },
  {
    id: 'author-validators',
    name: 'AuthorValidators.cs',
    folder: 'Validations',
    language: 'csharp',
    description: 'FluentValidation ile yazar ekleme, güncelleme ve silme kuralları.',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: FluentValidation Kural Tanımlamaları
// ============================================================================

using BookStore.DTOs;
using FluentValidation;
using System;

namespace BookStore.Validations
{
    /// <summary>
    /// Yazar Ekleme Doğrulama Kuralları
    /// </summary>
    public class CreateAuthorCommandValidator : AbstractValidator<CreateAuthorModel>
    {
        public CreateAuthorCommandValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Yazar adı boş bırakılamaz.")
                .MinimumLength(2).WithMessage("Yazar adı en az 2 karakter olmalıdır.")
                .MaximumLength(50).WithMessage("Yazar adı en fazla 50 karakter olabilir.")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$").WithMessage("Yazar adı yalnızca alfabetik karakterlerden oluşmalıdır.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Yazar soyadı boş bırakılamaz.")
                .MinimumLength(2).WithMessage("Yazar soyadı en az 2 karakter olmalıdır.")
                .MaximumLength(50).WithMessage("Yazar soyadı en fazla 50 karakter olabilir.")
                .Matches(@"^[a-zA-ZğüşıöçĞÜŞİÖÇ\s.'-]+$").WithMessage("Yazar soyadı yalnızca alfabetik karakterlerden oluşmalıdır.");

            RuleFor(x => x.BirthDate)
                .NotEmpty().WithMessage("Yazarın doğum tarihi seçilmelidir.")
                .LessThan(DateTime.Today).WithMessage("Doğum tarihi bugünden veya ileri bir tarihten seçilemez.")
                .GreaterThan(new DateTime(1800, 1, 1)).WithMessage("Doğum tarihi 1800 yılından önce olamaz.");
        }
    }

    /// <summary>
    /// Yazar Güncelleme Doğrulama Kuralları
    /// </summary>
    public class UpdateAuthorCommandValidator : AbstractValidator<UpdateAuthorModel>
    {
        public UpdateAuthorCommandValidator()
        {
            RuleFor(x => x.FirstName)
                .NotEmpty().WithMessage("Yazar adı boş bırakılamaz.")
                .MinimumLength(2).WithMessage("Yazar adı en az 2 karakter olmalıdır.")
                .MaximumLength(50).WithMessage("Yazar adı en fazla 50 karakter olabilir.");

            RuleFor(x => x.LastName)
                .NotEmpty().WithMessage("Yazar soyadı boş bırakılamaz.")
                .MinimumLength(2).WithMessage("Yazar soyadı en az 2 karakter olmalıdır.")
                .MaximumLength(50).WithMessage("Yazar soyadı en fazla 50 karakter olabilir.");

            RuleFor(x => x.BirthDate)
                .NotEmpty().WithMessage("Yazarın doğum tarihi seçilmelidir.")
                .LessThan(DateTime.Today).WithMessage("Doğum tarihi bugünden veya ileri bir tarihten seçilemez.")
                .GreaterThan(new DateTime(1800, 1, 1)).WithMessage("Doğum tarihi 1800 yılından önce olamaz.");
        }
    }

    /// <summary>
    /// Yazar Silme Doğrulama Kuralları
    /// </summary>
    public class DeleteAuthorCommandValidator : AbstractValidator<int>
    {
        public DeleteAuthorCommandValidator()
        {
            RuleFor(authorId => authorId)
                .GreaterThan(0).WithMessage("Silinecek yazar Id değeri 0'dan büyük bir tam sayı olmalıdır.");
        }
    }
}
`,
  },
  {
    id: 'author-service',
    name: 'AuthorService.cs & IAuthorService.cs',
    folder: 'Services',
    language: 'csharp',
    description: 'İş mantığı ve kritik kural: "Kitabı yayında olan bir yazar silinememeli. Öncelikle kitap silinmeli, daha sonra yazar silinebilir."',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: Author İş Mantığı Servisi & Kritik İş Kuralları
// Kural: Kitabı yayında olan yazar SİLİNEMEZ! Anlamlı hata mesajı fırlatılır.
// ============================================================================

using AutoMapper;
using BookStore.Common;
using BookStore.Context;
using BookStore.DTOs;
using BookStore.Entities;
using BookStore.Exceptions;
using BookStore.Validations;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;

namespace BookStore.Services
{
    public interface IAuthorService
    {
        List<AuthorsViewModel> GetAllAuthors();
        AuthorDetailViewModel GetAuthorById(int id);
        AuthorsViewModel CreateAuthor(CreateAuthorModel model);
        void UpdateAuthor(int id, UpdateAuthorModel model);
        void DeleteAuthor(int id);
    }

    public class AuthorService : IAuthorService
    {
        private readonly IBookStoreDbContext _context;
        private readonly IMapper _mapper;

        public AuthorService(IBookStoreDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public List<AuthorsViewModel> GetAllAuthors()
        {
            var authors = _context.Authors
                .Include(a => a.Books)
                .OrderBy(a => a.Id)
                .ToList();

            return _mapper.Map<List<AuthorsViewModel>>(authors);
        }

        public AuthorDetailViewModel GetAuthorById(int id)
        {
            var author = _context.Authors
                .Include(a => a.Books)
                    .ThenInclude(b => b.Genre)
                .SingleOrDefault(a => a.Id == id);

            if (author == null)
            {
                throw new NotFoundException($"Sistemde {id} numaralı ID'ye sahip bir yazar bulunamadı!");
            }

            return _mapper.Map<AuthorDetailViewModel>(author);
        }

        public AuthorsViewModel CreateAuthor(CreateAuthorModel model)
        {
            // 1. Fluent Validation Kontrolü
            var validator = new CreateAuthorCommandValidator();
            validator.ValidateAndThrow(model);

            // 2. İş Kuralı: Aynı ad ve soyada sahip yazar kontrolü
            var exists = _context.Authors.Any(a => 
                a.FirstName.ToLower() == model.FirstName.Trim().ToLower() &&
                a.LastName.ToLower() == model.LastName.Trim().ToLower());

            if (exists)
            {
                throw new BusinessException($"'{model.FirstName} {model.LastName}' adında bir yazar sistemde zaten mevcuttur!");
            }

            // 3. AutoMapper ile Entity'e çevir ve kaydet
            var author = _mapper.Map<Author>(model);
            _context.Authors.Add(author);
            _context.SaveChanges();

            return _mapper.Map<AuthorsViewModel>(author);
        }

        public void UpdateAuthor(int id, UpdateAuthorModel model)
        {
            // 1. Fluent Validation Kontrolü
            var validator = new UpdateAuthorCommandValidator();
            validator.ValidateAndThrow(model);

            // 2. Yazar varlık kontrolü
            var author = _context.Authors.SingleOrDefault(a => a.Id == id);
            if (author == null)
            {
                throw new NotFoundException($"Güncellenmek istenen yazar bulunamadı! (Id: {id})");
            }

            // 3. AutoMapper ile güncelle ve kaydet
            _mapper.Map(model, author);
            _context.SaveChanges();
        }

        /// <summary>
        /// KRİTİK İŞ KURALI (Ödev Madde 3 & 7):
        /// Kitabı yayında olan bir yazar silinememeli.
        /// Öncelikle kitap silinmeli, daha sonra yazar silinebilir.
        /// </summary>
        public void DeleteAuthor(int id)
        {
            // 1. Doğrulama
            var validator = new DeleteAuthorCommandValidator();
            validator.ValidateAndThrow(id);

            // 2. Yazar sorgusu (İlişkili kitaplarıyla beraber)
            var author = _context.Authors
                .Include(a => a.Books)
                .SingleOrDefault(a => a.Id == id);

            if (author == null)
            {
                throw new NotFoundException($"Silinmek istenen yazar bulunamadı! (Id: {id})");
            }

            // 3. KRİTİK KURAL KONTROLÜ: Yayında olan kitap var mı?
            var activePublishedBooks = author.Books.Where(b => b.IsPublished).ToList();
            if (activePublishedBooks.Any())
            {
                var bookTitles = string.Join(", ", activePublishedBooks.Select(b => $"'{b.Title}'"));
                throw new BusinessException(
                    $"KİTABI YAYINDA OLAN BİR YAZAR SİLİNEMEZ! " +
                    $"Yazara ({author.FirstName} {author.LastName}) ait yayında olan {activePublishedBooks.Count} adet kitap bulunmaktadır: [{bookTitles}]. " +
                    $"Öncelikle bu kitap(lar) silinmeli veya yayından kaldırılmalı, daha sonra yazar silinebilir."
                );
            }

            // 4. Kitapları silinmiş veya yayında olmayan yazar güvenle silinebilir
            _context.Authors.Remove(author);
            _context.SaveChanges();
        }
    }
}
`,
  },
  {
    id: 'exception-middleware',
    name: 'CustomExceptionMiddleware.cs',
    folder: 'Middlewares',
    language: 'csharp',
    description: 'Anlamlı hata mesajlarını yakalayan ve Enes Öztürk imzalı standart JSON dönen middleware.',
    code: `// ============================================================================
// Geliştirici: Enes Öztürk
// Açıklama: Global Hata Yönetimi ve Standardize Edilmiş Hata Yanıtları
// ============================================================================

using FluentValidation;
using Microsoft.AspNetCore.Http;
using System;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace BookStore.Middlewares
{
    public class CustomExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public CustomExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            var statusCode = HttpStatusCode.InternalServerError;
            string message = exception.Message;
            object? errors = null;

            switch (exception)
            {
                case ValidationException validationEx:
                    statusCode = HttpStatusCode.BadRequest;
                    message = "Doğrulama hatası gerçekleşti!";
                    errors = validationEx.Errors.Select(e => new
                    {
                        PropertyName = e.PropertyName,
                        ErrorMessage = e.ErrorMessage,
                        AttemptedValue = e.AttemptedValue
                    });
                    break;

                case NotFoundException notFoundEx:
                    statusCode = HttpStatusCode.NotFound;
                    message = notFoundEx.Message;
                    break;

                case BusinessException businessEx:
                    statusCode = HttpStatusCode.UnprocessableEntity; // 422
                    message = businessEx.Message;
                    break;
            }

            context.Response.StatusCode = (int)statusCode;

            var response = new
            {
                StatusCode = (int)statusCode,
                Success = false,
                Message = message,
                Errors = errors,
                DeveloperSignature = "Enes Öztürk",
                Timestamp = DateTime.UtcNow
            };

            return context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
`,
  },
];
