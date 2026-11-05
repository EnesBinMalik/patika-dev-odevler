export interface CodeFile {
  id: string;
  name: string;
  path: string;
  category: 'UpdateBook' | 'GetById' | 'Entity' | 'Controller' | 'Common';
  description: string;
  code: string;
}

export const CSHARP_CODE_FILES: CodeFile[] = [
  {
    id: 'update-book-command',
    name: 'UpdateBookCommand.cs',
    path: 'BookOperations/UpdateBook/UpdateBookCommand.cs',
    category: 'UpdateBook',
    description: 'UpdateBook metodu için Input Model (UpdateBookModel) ve Output Model (UpdateBookViewModel) tanımları ve Handler sınıfı.',
    code: `// ============================================================================
// Proje: BookStore Web API
// Ödev: Model Kullanımı (UpdateBook & GetById Input/Output Modelleri)
// Yazar / İmza: Enes Öztürk
// Kural: Proje içerisinde Input/Output olarak Entity KULLANILMAMALIDIR!
// ============================================================================

using System;
using System.Linq;
using AutoMapper;
using BookStoreWebApi.Common;
using BookStoreWebApi.DBOperations;
using BookStoreWebApi.Entities;

namespace BookStoreWebApi.BookOperations.UpdateBook
{
    public class UpdateBookCommand
    {
        public int BookId { get; set; }
        public UpdateBookModel Model { get; set; }

        private readonly BookStoreDbContext _dbContext;
        private readonly IMapper _mapper;

        public UpdateBookCommand(BookStoreDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public UpdateBookViewModel Handle()
        {
            var book = _dbContext.Books.SingleOrDefault(x => x.Id == BookId && !x.IsDeleted);

            if (book is null)
                throw new InvalidOperationException("Güncellenecek kitap bulunamadı!");

            // Entity doğrudan dışarıdan alınmaz! Model üzerinden kontrollü güncelleme yapılır.
            book.GenreId = Model.GenreId != default ? Model.GenreId : book.GenreId;
            book.Title = !string.IsNullOrWhiteSpace(Model.Title) ? Model.Title.Trim() : book.Title;
            book.PageCount = Model.PageCount != default ? Model.PageCount : book.PageCount;
            book.PublishDate = Model.PublishDate != default ? Model.PublishDate : book.PublishDate;
            book.ModifiedDate = DateTime.UtcNow; // DB audit alanı, istemciden asla alınmaz

            _dbContext.SaveChanges();

            // ÇIKTI: Entity ASLA dönülmez! Bunun yerine UpdateBookViewModel dönülür.
            var response = _mapper.Map<UpdateBookViewModel>(book);
            response.Message = "Kitap bilgileri başarıyla güncellendi.";
            return response;
        }

        // --------------------------------------------------------------------
        // INPUT MODEL: İstemciden alınan model (Entity değil!)
        // İstemci Id, CreatedDate, IsDeleted gibi kritik entity alanlarını değiştiremez.
        // --------------------------------------------------------------------
        public class UpdateBookModel
        {
            public string Title { get; set; }
            public int GenreId { get; set; }
            public int PageCount { get; set; }
            public DateTime PublishDate { get; set; }
        }

        // --------------------------------------------------------------------
        // OUTPUT MODEL: İstemciye dönülen ViewModel (Entity değil!)
        // Hassas DB kolonları filtrelenmiş, Genre adı string olarak çözülmüştür.
        // --------------------------------------------------------------------
        public class UpdateBookViewModel
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Genre { get; set; }
            public int PageCount { get; set; }
            public string PublishDate { get; set; }
            public string UpdatedAt { get; set; }
            public string Message { get; set; }
        }
    }
}
`,
  },
  {
    id: 'update-book-validator',
    name: 'UpdateBookCommandValidator.cs',
    path: 'BookOperations/UpdateBook/UpdateBookCommandValidator.cs',
    category: 'UpdateBook',
    description: 'UpdateBookCommand ve UpdateBookModel için FluentValidation kuralları.',
    code: `// ============================================================================
// Yazar / İmza: Enes Öztürk
// Model Doğrulama (FluentValidation)
// ============================================================================

using System;
using FluentValidation;

namespace BookStoreWebApi.BookOperations.UpdateBook
{
    public class UpdateBookCommandValidator : AbstractValidator<UpdateBookCommand>
    {
        public UpdateBookCommandValidator()
        {
            // Route üzerinden gelen BookId kontrolü
            RuleFor(command => command.BookId).GreaterThan(0)
                .WithMessage("Geçersiz kitap kimliği (Id 0'dan büyük olmalıdır)!");

            // Model içindeki alanların doğrulanması
            RuleFor(command => command.Model.GenreId).GreaterThan(0)
                .WithMessage("Lütfen geçerli bir kategori seçiniz!");

            RuleFor(command => command.Model.Title).NotEmpty().MinimumLength(2)
                .WithMessage("Kitap başlığı en az 2 karakter olmalıdır!");

            RuleFor(command => command.Model.PageCount).GreaterThan(0)
                .WithMessage("Sayfa sayısı 0'dan büyük olmalıdır!");

            RuleFor(command => command.Model.PublishDate).NotEmpty().LessThan(DateTime.Now.Date)
                .WithMessage("Yayın tarihi bugünden ileri bir tarih olamaz!");
        }
    }
}
`,
  },
  {
    id: 'get-book-detail-query',
    name: 'GetBookDetailQuery.cs',
    path: 'BookOperations/GetBookDetail/GetBookDetailQuery.cs',
    category: 'GetById',
    description: 'GetById metodu için Input Parametre (BookId) ve Output Model (BookDetailViewModel) yapısı.',
    code: `// ============================================================================
// Proje: BookStore Web API
// Ödev: Model Kullanımı - GetById
// Yazar / İmza: Enes Öztürk
// Kural: Entity yerine BookDetailViewModel dönülür!
// ============================================================================

using System;
using System.Linq;
using AutoMapper;
using BookStoreWebApi.Common;
using BookStoreWebApi.DBOperations;

namespace BookStoreWebApi.BookOperations.GetBookDetail
{
    public class GetBookDetailQuery
    {
        // INPUT MODEL: Sorgu parametresi (Route veya Query ile gelir)
        public int BookId { get; set; }

        private readonly BookStoreDbContext _dbContext;
        private readonly IMapper _mapper;

        public GetBookDetailQuery(BookStoreDbContext dbContext, IMapper mapper)
        {
            _dbContext = dbContext;
            _mapper = mapper;
        }

        public BookDetailViewModel Handle()
        {
            var book = _dbContext.Books.SingleOrDefault(x => x.Id == BookId && !x.IsDeleted);

            if (book is null)
                throw new InvalidOperationException("İstenen kitap bulunamadı!");

            // Entity ASLA dışarı dönülmez!
            // AutoMapper ile Book entity'si BookDetailViewModel'e dönüştürülür.
            BookDetailViewModel viewModel = _mapper.Map<BookDetailViewModel>(book);
            return viewModel;
        }

        // --------------------------------------------------------------------
        // OUTPUT MODEL: İstemciye sunulan ViewModel
        // GenreId yerine Genre (string isim) gösterilir.
        // PublishDate DateTime yerine "dd/MM/yyyy" string formatında sunulur.
        // CreatedDate, IsDeleted, RowVersion gibi DB detayları gizlenmiştir.
        // --------------------------------------------------------------------
        public class BookDetailViewModel
        {
            public int Id { get; set; }
            public string Title { get; set; }
            public string Genre { get; set; }
            public int PageCount { get; set; }
            public string PublishDate { get; set; }
        }
    }
}
`,
  },
  {
    id: 'get-book-detail-validator',
    name: 'GetBookDetailQueryValidator.cs',
    path: 'BookOperations/GetBookDetail/GetBookDetailQueryValidator.cs',
    category: 'GetById',
    description: 'GetBookDetailQuery için FluentValidation kuralları.',
    code: `// ============================================================================
// Yazar / İmza: Enes Öztürk
// GetById Sorgu Doğrulama (FluentValidation)
// ============================================================================

using FluentValidation;

namespace BookStoreWebApi.BookOperations.GetBookDetail
{
    public class GetBookDetailQueryValidator : AbstractValidator<GetBookDetailQuery>
    {
        public GetBookDetailQueryValidator()
        {
            RuleFor(query => query.BookId).GreaterThan(0)
                .WithMessage("Sorgulanacak kitap kimliği (Id) 0'dan büyük bir tamsayı olmalıdır.");
        }
    }
}
`,
  },
  {
    id: 'book-entity',
    name: 'Book.cs',
    path: 'Entities/Book.cs',
    category: 'Entity',
    description: 'Veritabanı Entity sınıfı. SADECE veritabanı ve ORM katmanında kalmalıdır, Controller veya dış dünyaya ASLA açılmaz!',
    code: `// ============================================================================
// DİKKAT: Bu sınıf bir DATABASE ENTITY'sidir.
// Ödev Kuralı: Proje içerisinden Input/Output olarak entity KULLANILMAMALIDIR!
// Bu sınıf controller veya dış istemcilere ASLA doğrudan maruz bırakılmaz.
// Yazar / İmza: Enes Öztürk
// ============================================================================

using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace BookStoreWebApi.Entities
{
    public class Book
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string Title { get; set; }
        public int GenreId { get; set; }
        public int PageCount { get; set; }
        public DateTime PublishDate { get; set; }

        // SADECE VERİTABANINA ÖZEL ALANLAR (Dışarıya sızdırılmamalıdır!)
        public DateTime CreatedDate { get; set; } = DateTime.UtcNow;
        public DateTime? ModifiedDate { get; set; }
        public bool IsDeleted { get; set; } = false;
        public byte[] RowVersion { get; set; }
        public string InternalBarcode { get; set; }
    }
}
`,
  },
  {
    id: 'book-controller',
    name: 'BookController.cs',
    path: 'Controllers/BookController.cs',
    category: 'Controller',
    description: 'REST Controller. Tüm metotlar Input/Output olarak Entity yerine Model (DTO / ViewModel) kullanır.',
    code: `// ============================================================================
// Proje: BookStore Web API
// Ödev: Model Kullanımı
// Yazar / İmza: Enes Öztürk
// Açıklama: Controller seviyesinde hiçbir metot 'Book' entity'si almaz veya dönmez!
// ============================================================================

using AutoMapper;
using BookStoreWebApi.BookOperations.GetBookDetail;
using BookStoreWebApi.BookOperations.UpdateBook;
using BookStoreWebApi.DBOperations;
using FluentValidation;
using Microsoft.AspNetCore.Mvc;

namespace BookStoreWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]s")]
    public class BookController : ControllerBase
    {
        private readonly BookStoreDbContext _context;
        private readonly IMapper _mapper;

        public BookController(BookStoreDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // --------------------------------------------------------------------
        // GET api/books/{id}
        // OUTPUT: BookDetailViewModel (Entity DEĞİL!)
        // --------------------------------------------------------------------
        [HttpGet("{id}")]
        public IActionResult GetById(int id)
        {
            var query = new GetBookDetailQuery(_context, _mapper)
            {
                BookId = id
            };

            var validator = new GetBookDetailQueryValidator();
            validator.ValidateAndThrow(query);

            var result = query.Handle();
            return Ok(result); // Dönen nesne: BookDetailViewModel
        }

        // --------------------------------------------------------------------
        // PUT api/books/{id}
        // INPUT: UpdateBookModel (Entity DEĞİL!)
        // OUTPUT: UpdateBookViewModel (Entity DEĞİL!)
        // --------------------------------------------------------------------
        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] UpdateBookCommand.UpdateBookModel updatedBook)
        {
            var command = new UpdateBookCommand(_context, _mapper)
            {
                BookId = id,
                Model = updatedBook
            };

            var validator = new UpdateBookCommandValidator();
            validator.ValidateAndThrow(command);

            var result = command.Handle();
            return Ok(result); // Dönen nesne: UpdateBookViewModel
        }
    }
}
`,
  },
  {
    id: 'mapping-profile',
    name: 'MappingProfile.cs',
    path: 'Common/MappingProfile.cs',
    category: 'Common',
    description: 'AutoMapper profili: Entity ile Model (ViewModel / DTO) arasındaki güvenli dönüşümler.',
    code: `// ============================================================================
// Yazar / İmza: Enes Öztürk
// AutoMapper Profil Tanımları
// Entity -> ViewModel ve Model -> Entity dönüşümleri burada yönetilir.
// ============================================================================

using AutoMapper;
using BookStoreWebApi.BookOperations.GetBookDetail;
using BookStoreWebApi.BookOperations.UpdateBook;
using BookStoreWebApi.Common;
using BookStoreWebApi.Entities;

namespace BookStoreWebApi.Common
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            // Book Entity -> BookDetailViewModel (GetById Output)
            // GenreId int -> Genre string enum adı eşleşmesi
            // DateTime -> "dd/MM/yyyy" formatlanmış string eşleşmesi
            CreateMap<Book, GetBookDetailQuery.BookDetailViewModel>()
                .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => ((GenreEnum)src.GenreId).ToString()))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate.Date.ToString("dd/MM/yyyy")));

            // Book Entity -> UpdateBookViewModel (UpdateBook Output)
            CreateMap<Book, UpdateBookCommand.UpdateBookViewModel>()
                .ForMember(dest => dest.Genre, opt => opt.MapFrom(src => ((GenreEnum)src.GenreId).ToString()))
                .ForMember(dest => dest.PublishDate, opt => opt.MapFrom(src => src.PublishDate.Date.ToString("dd/MM/yyyy")))
                .ForMember(dest => dest.UpdatedAt, opt => opt.MapFrom(src => (src.ModifiedDate ?? System.DateTime.UtcNow).ToString("dd/MM/yyyy HH:mm:ss")));

            // UpdateBookModel -> Book Entity (Input eşleme - sadece izin verilen alanlar)
            CreateMap<UpdateBookCommand.UpdateBookModel, Book>();
        }
    }
}
`,
  },
  {
    id: 'genre-enum',
    name: 'GenreEnum.cs',
    path: 'Common/GenreEnum.cs',
    category: 'Common',
    description: 'Kategori enum tanımı.',
    code: `// ============================================================================
// Yazar / İmza: Enes Öztürk
// ============================================================================

namespace BookStoreWebApi.Common
{
    public enum GenreEnum
    {
        PersonalGrowth = 1,  // Kişisel Gelişim
        ScienceFiction = 2,  // Bilim Kurgu
        Noval = 3,           // Roman
        History = 4,         // Tarih
        Philosophy = 5       // Felsefe
    }
}
`,
  },
];
