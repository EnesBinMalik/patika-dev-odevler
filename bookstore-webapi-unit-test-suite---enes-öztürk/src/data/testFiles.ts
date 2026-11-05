/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * Author: Enes Öztürk
 * Project: BookStore WebApi Unit Testing Suite (.NET Core)
 */

export interface TestFileItem {
  id: string;
  category: 'Book' | 'Genre' | 'Author' | 'Setup';
  title: string;
  filename: string;
  path: string;
  targetService: string;
  author: string;
  code: string;
  sourceCode?: string;
  validatorCode?: string;
  description: string;
  testCount: number;
}

export const TEST_FILES: TestFileItem[] = [
  // ==========================================
  // 1. BOOK SERVICES UNIT TESTS
  // ==========================================
  {
    id: 'delete-book-command-tests',
    category: 'Book',
    title: 'DeleteBookCommand Tests',
    filename: 'DeleteBookCommandTests.cs',
    path: 'Application/BookOperations/Commands/DeleteBook/DeleteBookCommandTests.cs',
    targetService: 'DeleteBookCommand',
    author: 'Enes Öztürk',
    description: 'DeleteBookCommand için veritabanında var olan ve var olmayan kitap id durumlarının xUnit ve FluentAssertions ile birim testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: DeleteBookCommandTests.cs
// Açıklama: DeleteBookCommand için birim testleri (xUnit, FluentAssertions)
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Commands.DeleteBook;
using WebApi.DBOperations;
using Xunit;

namespace Application.BookOperations.Commands.DeleteBook
{
    public class DeleteBookCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public DeleteBookCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenAlreadyExistBookIdIsGiven_Book_ShouldBeDeleted()
        {
            // Arrange (Hazırlık) - Geliştirici: Enes Öztürk
            // Test için veritabanında kesinlikle var olan bir kayıt alınıyor
            var book = _context.Books.First();
            DeleteBookCommand command = new DeleteBookCommand(_context);
            command.BookId = book.Id;

            // Act (Çalıştırma)
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert (Doğrulama)
            var deletedBook = _context.Books.SingleOrDefault(b => b.Id == book.Id);
            deletedBook.Should().BeNull();
        }

        [Fact]
        public void WhenGivenBookIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Var olmayan bir kitap Id'si atanıyor
            DeleteBookCommand command = new DeleteBookCommand(_context);
            command.BookId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Silinecek kitap bulunamadı!");
        }
    }
}`,
    sourceCode: `public class DeleteBookCommand
{
    private readonly IBookStoreDbContext _dbContext;
    public int BookId { get; set; }

    public DeleteBookCommand(IBookStoreDbContext dbContext)
    {
        _dbContext = dbContext;
    }

    public void Handle()
    {
        var book = _dbContext.Books.SingleOrDefault(x => x.Id == BookId);
        if (book is null)
            throw new InvalidOperationException("Silinecek kitap bulunamadı!");

        _dbContext.Books.Remove(book);
        _dbContext.SaveChanges();
    }
}`
  },
  {
    id: 'delete-book-command-validator-tests',
    category: 'Book',
    title: 'DeleteBookCommandValidator Tests',
    filename: 'DeleteBookCommandValidatorTests.cs',
    path: 'Application/BookOperations/Commands/DeleteBook/DeleteBookCommandValidatorTests.cs',
    targetService: 'DeleteBookCommandValidator',
    author: 'Enes Öztürk',
    description: 'DeleteBookCommandValidator için BookId <= 0 ve BookId > 0 sınır değer doğrulama testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: DeleteBookCommandValidatorTests.cs
// Açıklama: DeleteBookCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Commands.DeleteBook;
using Xunit;

namespace Application.BookOperations.Commands.DeleteBook
{
    public class DeleteBookCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int bookId)
        {
            // Arrange - Enes Öztürk
            DeleteBookCommand command = new DeleteBookCommand(null);
            command.BookId = bookId;

            // Act
            DeleteBookCommandValidator validator = new DeleteBookCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            DeleteBookCommand command = new DeleteBookCommand(null);
            command.BookId = 1;

            // Act
            DeleteBookCommandValidator validator = new DeleteBookCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class DeleteBookCommandValidator : AbstractValidator<DeleteBookCommand>
{
    public DeleteBookCommandValidator()
    {
        RuleFor(command => command.BookId).GreaterThan(0);
    }
}`
  },
  {
    id: 'update-book-command-tests',
    category: 'Book',
    title: 'UpdateBookCommand Tests',
    filename: 'UpdateBookCommandTests.cs',
    path: 'Application/BookOperations/Commands/UpdateBook/UpdateBookCommandTests.cs',
    targetService: 'UpdateBookCommand',
    author: 'Enes Öztürk',
    description: 'UpdateBookCommand için geçerli güncelleme ve bulunamayan kitap istisnası birim testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: UpdateBookCommandTests.cs
// Açıklama: UpdateBookCommand için birim testleri
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Commands.UpdateBook;
using WebApi.DBOperations;
using Xunit;

namespace Application.BookOperations.Commands.UpdateBook
{
    public class UpdateBookCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public UpdateBookCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenGivenBookIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            UpdateBookCommand command = new UpdateBookCommand(_context);
            command.BookId = 999999;
            command.Model = new UpdateBookModel { Title = "Geçersiz Başlık", GenreId = 1 };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Güncellenecek kitap bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Book_ShouldBeUpdated()
        {
            // Arrange
            var existingBook = _context.Books.First();
            UpdateBookCommand command = new UpdateBookCommand(_context);
            command.BookId = existingBook.Id;

            UpdateBookModel model = new UpdateBookModel
            {
                Title = "Yapay Zeka ve Yazılım Testleri - Güncellendi",
                GenreId = 2
            };
            command.Model = model;

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var updatedBook = _context.Books.SingleOrDefault(b => b.Id == existingBook.Id);
            updatedBook.Should().NotBeNull();
            updatedBook.Title.Should().Be(model.Title);
            updatedBook.GenreId.Should().Be(model.GenreId);
        }
    }
}`,
    sourceCode: `public class UpdateBookCommand
{
    private readonly IBookStoreDbContext _context;
    public int BookId { get; set; }
    public UpdateBookModel Model { get; set; }

    public UpdateBookCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var book = _context.Books.SingleOrDefault(x => x.Id == BookId);
        if (book is null)
            throw new InvalidOperationException("Güncellenecek kitap bulunamadı!");

        book.GenreId = Model.GenreId != default ? Model.GenreId : book.GenreId;
        book.Title = Model.Title != default ? Model.Title : book.Title;

        _context.SaveChanges();
    }
}`
  },
  {
    id: 'update-book-command-validator-tests',
    category: 'Book',
    title: 'UpdateBookCommandValidator Tests',
    filename: 'UpdateBookCommandValidatorTests.cs',
    path: 'Application/BookOperations/Commands/UpdateBook/UpdateBookCommandValidatorTests.cs',
    targetService: 'UpdateBookCommandValidator',
    author: 'Enes Öztürk',
    description: 'UpdateBookCommandValidator için geçersiz parametre kombinasyonları ve başarılı doğrulama testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: UpdateBookCommandValidatorTests.cs
// Açıklama: UpdateBookCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Commands.UpdateBook;
using Xunit;

namespace Application.BookOperations.Commands.UpdateBook
{
    public class UpdateBookCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(0, "Lord Of The Rings", 1)]
        [InlineData(-1, "Lord Of The Rings", 1)]
        [InlineData(1, "", 1)]
        [InlineData(1, "abc", 1)] // Min length < 4
        [InlineData(1, "Lord Of The Rings", 0)]
        [InlineData(1, "Lord Of The Rings", -1)]
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int bookId, string title, int genreId)
        {
            // Arrange - Enes Öztürk
            UpdateBookCommand command = new UpdateBookCommand(null);
            command.BookId = bookId;
            command.Model = new UpdateBookModel
            {
                Title = title,
                GenreId = genreId
            };

            // Act
            UpdateBookCommandValidator validator = new UpdateBookCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            UpdateBookCommand command = new UpdateBookCommand(null);
            command.BookId = 1;
            command.Model = new UpdateBookModel
            {
                Title = "Geçerli Kitap Başlığı",
                GenreId = 1
            };

            // Act
            UpdateBookCommandValidator validator = new UpdateBookCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class UpdateBookCommandValidator : AbstractValidator<UpdateBookCommand>
{
    public UpdateBookCommandValidator()
    {
        RuleFor(command => command.BookId).GreaterThan(0);
        RuleFor(command => command.Model.GenreId).GreaterThan(0);
        RuleFor(command => command.Model.Title).NotEmpty().MinimumLength(4);
    }
}`
  },
  {
    id: 'get-book-detail-query-tests',
    category: 'Book',
    title: 'GetBookDetailQuery Tests',
    filename: 'GetBookDetailQueryTests.cs',
    path: 'Application/BookOperations/Queries/GetBookDetail/GetBookDetailQueryTests.cs',
    targetService: 'GetBookDetailQuery',
    author: 'Enes Öztürk',
    description: 'GetBookDetailQuery için kitap detayının AutoMapper ile hatasız getirilmesi ve geçersiz id testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: GetBookDetailQueryTests.cs
// Açıklama: GetBookDetailQuery için birim testleri (AutoMapper & EF InMemory)
// =========================================================================

using System;
using System.Linq;
using AutoMapper;
using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Queries.GetBookDetail;
using WebApi.DBOperations;
using Xunit;

namespace Application.BookOperations.Queries.GetBookDetail
{
    public class GetBookDetailQueryTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;
        private readonly IMapper _mapper;

        public GetBookDetailQueryTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
            _mapper = testFixture.Mapper;
        }

        [Fact]
        public void WhenGivenBookIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            GetBookDetailQuery query = new GetBookDetailQuery(_context, _mapper);
            query.BookId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => query.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Kitap bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Book_ShouldBeReturned()
        {
            // Arrange
            var expectedBook = _context.Books.First();
            GetBookDetailQuery query = new GetBookDetailQuery(_context, _mapper);
            query.BookId = expectedBook.Id;

            // Act
            BookDetailViewModel vm = null;
            FluentActions.Invoking(() => vm = query.Handle()).Invoke();

            // Assert
            vm.Should().NotBeNull();
            vm.Title.Should().Be(expectedBook.Title);
            vm.PageCount.Should().Be(expectedBook.PageCount);
            vm.PublishDate.Should().Be(expectedBook.PublishDate.ToString("dd/MM/yyyy"));
        }
    }
}`,
    sourceCode: `public class GetBookDetailQuery
{
    private readonly IBookStoreDbContext _dbContext;
    private readonly IMapper _mapper;
    public int BookId { get; set; }

    public GetBookDetailQuery(IBookStoreDbContext dbContext, IMapper mapper)
    {
        _dbContext = dbContext;
        _mapper = mapper;
    }

    public BookDetailViewModel Handle()
    {
        var book = _dbContext.Books.Include(x => x.Genre).Include(x => x.Author).SingleOrDefault(x => x.Id == BookId);
        if (book is null)
            throw new InvalidOperationException("Kitap bulunamadı!");

        return _mapper.Map<BookDetailViewModel>(book);
    }
}`
  },
  {
    id: 'get-book-detail-query-validator-tests',
    category: 'Book',
    title: 'GetBookDetailQueryValidator Tests',
    filename: 'GetBookDetailQueryValidatorTests.cs',
    path: 'Application/BookOperations/Queries/GetBookDetail/GetBookDetailQueryValidatorTests.cs',
    targetService: 'GetBookDetailQueryValidator',
    author: 'Enes Öztürk',
    description: 'GetBookDetailQueryValidator için BookId doğrulama sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Book Operations
// Dosya: GetBookDetailQueryValidatorTests.cs
// Açıklama: GetBookDetailQueryValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.BookOperations.Queries.GetBookDetail;
using Xunit;

namespace Application.BookOperations.Queries.GetBookDetail
{
    public class GetBookDetailQueryValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidBookIdIsGiven_Validator_ShouldBeReturnErrors(int bookId)
        {
            // Arrange - Enes Öztürk
            GetBookDetailQuery query = new GetBookDetailQuery(null, null);
            query.BookId = bookId;

            // Act
            GetBookDetailQueryValidator validator = new GetBookDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidBookIdIsGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            GetBookDetailQuery query = new GetBookDetailQuery(null, null);
            query.BookId = 1;

            // Act
            GetBookDetailQueryValidator validator = new GetBookDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class GetBookDetailQueryValidator : AbstractValidator<GetBookDetailQuery>
{
    public GetBookDetailQueryValidator()
    {
        RuleFor(query => query.BookId).GreaterThan(0);
    }
}`
  },

  // ==========================================
  // 2. GENRE SERVICES UNIT TESTS
  // ==========================================
  {
    id: 'create-genre-command-tests',
    category: 'Genre',
    title: 'CreateGenreCommand Tests',
    filename: 'CreateGenreCommandTests.cs',
    path: 'Application/GenreOperations/Commands/CreateGenre/CreateGenreCommandTests.cs',
    targetService: 'CreateGenreCommand',
    author: 'Enes Öztürk',
    description: 'CreateGenreCommand için aynı isimde tür eklenememe kuralı ve başarılı tür oluşturma testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: CreateGenreCommandTests.cs
// Açıklama: CreateGenreCommand birim testleri (xUnit, FluentAssertions)
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.CreateGenre;
using WebApi.DBOperations;
using WebApi.Entities;
using Xunit;

namespace Application.GenreOperations.Commands.CreateGenre
{
    public class CreateGenreCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public CreateGenreCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenAlreadyExistGenreNameIsGiven_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            var existingGenre = _context.Genres.First();
            CreateGenreCommand command = new CreateGenreCommand(_context);
            command.Model = new CreateGenreModel { Name = existingGenre.Name };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Kitap türü zaten mevcut!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Genre_ShouldBeCreated()
        {
            // Arrange
            CreateGenreCommand command = new CreateGenreCommand(_context);
            CreateGenreModel model = new CreateGenreModel
            {
                Name = "Cyberpunk Fiction - Enes Öztürk"
            };
            command.Model = model;

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var genre = _context.Genres.SingleOrDefault(g => g.Name == model.Name);
            genre.Should().NotBeNull();
            genre.IsActive.Should().BeTrue();
        }
    }
}`,
    sourceCode: `public class CreateGenreCommand
{
    public CreateGenreModel Model { get; set; }
    private readonly IBookStoreDbContext _context;

    public CreateGenreCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var genre = _context.Genres.SingleOrDefault(x => x.Name == Model.Name);
        if (genre is not null)
            throw new InvalidOperationException("Kitap türü zaten mevcut!");

        genre = new Genre();
        genre.Name = Model.Name;
        _context.Genres.Add(genre);
        _context.SaveChanges();
    }
}`
  },
  {
    id: 'create-genre-command-validator-tests',
    category: 'Genre',
    title: 'CreateGenreCommandValidator Tests',
    filename: 'CreateGenreCommandValidatorTests.cs',
    path: 'Application/GenreOperations/Commands/CreateGenre/CreateGenreCommandValidatorTests.cs',
    targetService: 'CreateGenreCommandValidator',
    author: 'Enes Öztürk',
    description: 'CreateGenreCommandValidator için boş isim ve 4 karakterden kısa isim doğrulama testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: CreateGenreCommandValidatorTests.cs
// Açıklama: CreateGenreCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.CreateGenre;
using Xunit;

namespace Application.GenreOperations.Commands.CreateGenre
{
    public class CreateGenreCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData("")]
        [InlineData(" ")]
        [InlineData("abc")] // 4 karakterden az
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(string name)
        {
            // Arrange - Enes Öztürk
            CreateGenreCommand command = new CreateGenreCommand(null);
            command.Model = new CreateGenreModel { Name = name };

            // Act
            CreateGenreCommandValidator validator = new CreateGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            CreateGenreCommand command = new CreateGenreCommand(null);
            command.Model = new CreateGenreModel { Name = "Science Fiction" };

            // Act
            CreateGenreCommandValidator validator = new CreateGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class CreateGenreCommandValidator : AbstractValidator<CreateGenreCommand>
{
    public CreateGenreCommandValidator()
    {
        RuleFor(command => command.Model.Name).NotEmpty().MinimumLength(4);
    }
}`
  },
  {
    id: 'delete-genre-command-tests',
    category: 'Genre',
    title: 'DeleteGenreCommand Tests',
    filename: 'DeleteGenreCommandTests.cs',
    path: 'Application/GenreOperations/Commands/DeleteGenre/DeleteGenreCommandTests.cs',
    targetService: 'DeleteGenreCommand',
    author: 'Enes Öztürk',
    description: 'DeleteGenreCommand için tür silme ve bulunamayan tür id istisnası testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: DeleteGenreCommandTests.cs
// Açıklama: DeleteGenreCommand birim testleri
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.DeleteGenre;
using WebApi.DBOperations;
using Xunit;

namespace Application.GenreOperations.Commands.DeleteGenre
{
    public class DeleteGenreCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public DeleteGenreCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenGivenGenreIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            DeleteGenreCommand command = new DeleteGenreCommand(_context);
            command.GenreId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Kitap türü bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Genre_ShouldBeDeleted()
        {
            // Arrange
            var genre = _context.Genres.First();
            DeleteGenreCommand command = new DeleteGenreCommand(_context);
            command.GenreId = genre.Id;

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var deletedGenre = _context.Genres.SingleOrDefault(g => g.Id == genre.Id);
            deletedGenre.Should().BeNull();
        }
    }
}`,
    sourceCode: `public class DeleteGenreCommand
{
    public int GenreId { get; set; }
    private readonly IBookStoreDbContext _context;

    public DeleteGenreCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var genre = _context.Genres.SingleOrDefault(x => x.Id == GenreId);
        if (genre is null)
            throw new InvalidOperationException("Kitap türü bulunamadı!");

        _context.Genres.Remove(genre);
        _context.SaveChanges();
    }
}`
  },
  {
    id: 'delete-genre-command-validator-tests',
    category: 'Genre',
    title: 'DeleteGenreCommandValidator Tests',
    filename: 'DeleteGenreCommandValidatorTests.cs',
    path: 'Application/GenreOperations/Commands/DeleteGenre/DeleteGenreCommandValidatorTests.cs',
    targetService: 'DeleteGenreCommandValidator',
    author: 'Enes Öztürk',
    description: 'DeleteGenreCommandValidator için GenreId doğrulama sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: DeleteGenreCommandValidatorTests.cs
// Açıklama: DeleteGenreCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.DeleteGenre;
using Xunit;

namespace Application.GenreOperations.Commands.DeleteGenre
{
    public class DeleteGenreCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int genreId)
        {
            // Arrange - Enes Öztürk
            DeleteGenreCommand command = new DeleteGenreCommand(null);
            command.GenreId = genreId;

            // Act
            DeleteGenreCommandValidator validator = new DeleteGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            DeleteGenreCommand command = new DeleteGenreCommand(null);
            command.GenreId = 1;

            // Act
            DeleteGenreCommandValidator validator = new DeleteGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class DeleteGenreCommandValidator : AbstractValidator<DeleteGenreCommand>
{
    public DeleteGenreCommandValidator()
    {
        RuleFor(command => command.GenreId).GreaterThan(0);
    }
}`
  },
  {
    id: 'update-genre-command-tests',
    category: 'Genre',
    title: 'UpdateGenreCommand Tests',
    filename: 'UpdateGenreCommandTests.cs',
    path: 'Application/GenreOperations/Commands/UpdateGenre/UpdateGenreCommandTests.cs',
    targetService: 'UpdateGenreCommand',
    author: 'Enes Öztürk',
    description: 'UpdateGenreCommand için tür bulunamama, aynı isim çakışması ve başarılı güncelleme testleri.',
    testCount: 3,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: UpdateGenreCommandTests.cs
// Açıklama: UpdateGenreCommand birim testleri
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.UpdateGenre;
using WebApi.DBOperations;
using Xunit;

namespace Application.GenreOperations.Commands.UpdateGenre
{
    public class UpdateGenreCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public UpdateGenreCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenGivenGenreIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            UpdateGenreCommand command = new UpdateGenreCommand(_context);
            command.GenreId = 999999;
            command.Model = new UpdateGenreModel { Name = "Fantasy World" };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Güncellenecek kitap türü bulunamadı!");
        }

        [Fact]
        public void WhenAlreadyExistGenreNameIsGiven_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Veritabanındaki başka bir türün adını kullanmaya çalışıyoruz
            var genres = _context.Genres.Take(2).ToList();
            if (genres.Count >= 2)
            {
                var targetGenre = genres[0];
                var duplicateName = genres[1].Name;

                UpdateGenreCommand command = new UpdateGenreCommand(_context);
                command.GenreId = targetGenre.Id;
                command.Model = new UpdateGenreModel { Name = duplicateName };

                // Act & Assert
                FluentActions.Invoking(() => command.Handle())
                    .Should().Throw<InvalidOperationException>()
                    .And.Message.Should().Be("Aynı isimli bir kitap türü zaten mevcut!");
            }
        }

        [Fact]
        public void WhenValidInputsAreGiven_Genre_ShouldBeUpdated()
        {
            // Arrange
            var existingGenre = _context.Genres.First();
            UpdateGenreCommand command = new UpdateGenreCommand(_context);
            command.GenreId = existingGenre.Id;
            command.Model = new UpdateGenreModel
            {
                Name = "Modern Poetry - Enes Öztürk",
                IsActive = true
            };

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var updatedGenre = _context.Genres.SingleOrDefault(g => g.Id == existingGenre.Id);
            updatedGenre.Should().NotBeNull();
            updatedGenre.Name.Should().Be(command.Model.Name);
            updatedGenre.IsActive.Should().BeTrue();
        }
    }
}`,
    sourceCode: `public class UpdateGenreCommand
{
    public int GenreId { get; set; }
    public UpdateGenreModel Model { get; set; }
    private readonly IBookStoreDbContext _context;

    public UpdateGenreCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var genre = _context.Genres.SingleOrDefault(x => x.Id == GenreId);
        if (genre is null)
            throw new InvalidOperationException("Güncellenecek kitap türü bulunamadı!");

        if (_context.Genres.Any(x => x.Name.ToLower() == Model.Name.ToLower() && x.Id != GenreId))
            throw new InvalidOperationException("Aynı isimli bir kitap türü zaten mevcut!");

        genre.Name = string.IsNullOrEmpty(Model.Name.Trim()) ? genre.Name : Model.Name;
        genre.IsActive = Model.IsActive;
        _context.SaveChanges();
    }
}`
  },
  {
    id: 'update-genre-command-validator-tests',
    category: 'Genre',
    title: 'UpdateGenreCommandValidator Tests',
    filename: 'UpdateGenreCommandValidatorTests.cs',
    path: 'Application/GenreOperations/Commands/UpdateGenre/UpdateGenreCommandValidatorTests.cs',
    targetService: 'UpdateGenreCommandValidator',
    author: 'Enes Öztürk',
    description: 'UpdateGenreCommandValidator için GenreId ve isim uzunluğu sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: UpdateGenreCommandValidatorTests.cs
// Açıklama: UpdateGenreCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Commands.UpdateGenre;
using Xunit;

namespace Application.GenreOperations.Commands.UpdateGenre
{
    public class UpdateGenreCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(0, "Romance")]
        [InlineData(-1, "Romance")]
        [InlineData(1, "abc")] // 4 karakterden az
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int genreId, string name)
        {
            // Arrange - Enes Öztürk
            UpdateGenreCommand command = new UpdateGenreCommand(null);
            command.GenreId = genreId;
            command.Model = new UpdateGenreModel { Name = name };

            // Act
            UpdateGenreCommandValidator validator = new UpdateGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            UpdateGenreCommand command = new UpdateGenreCommand(null);
            command.GenreId = 1;
            command.Model = new UpdateGenreModel { Name = "Dystopian Novel" };

            // Act
            UpdateGenreCommandValidator validator = new UpdateGenreCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class UpdateGenreCommandValidator : AbstractValidator<UpdateGenreCommand>
{
    public UpdateGenreCommandValidator()
    {
        RuleFor(command => command.GenreId).GreaterThan(0);
        RuleFor(command => command.Model.Name).MinimumLength(4).When(x => !string.IsNullOrEmpty(x.Model.Name.Trim()));
    }
}`
  },
  {
    id: 'get-genre-detail-query-tests',
    category: 'Genre',
    title: 'GetGenreDetailQuery Tests',
    filename: 'GetGenreDetailQueryTests.cs',
    path: 'Application/GenreOperations/Queries/GetGenreDetail/GetGenreDetailQueryTests.cs',
    targetService: 'GetGenreDetailQuery',
    author: 'Enes Öztürk',
    description: 'GetGenreDetailQuery için türün getirilmesi ve geçersiz tür Id istisna testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: GetGenreDetailQueryTests.cs
// Açıklama: GetGenreDetailQuery birim testleri (AutoMapper & EF InMemory)
// =========================================================================

using System;
using System.Linq;
using AutoMapper;
using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Queries.GetGenreDetail;
using WebApi.DBOperations;
using Xunit;

namespace Application.GenreOperations.Queries.GetGenreDetail
{
    public class GetGenreDetailQueryTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;
        private readonly IMapper _mapper;

        public GetGenreDetailQueryTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
            _mapper = testFixture.Mapper;
        }

        [Fact]
        public void WhenGivenGenreIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            GetGenreDetailQuery query = new GetGenreDetailQuery(_context, _mapper);
            query.GenreId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => query.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Kitap türü bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Genre_ShouldBeReturned()
        {
            // Arrange
            var expectedGenre = _context.Genres.First();
            GetGenreDetailQuery query = new GetGenreDetailQuery(_context, _mapper);
            query.GenreId = expectedGenre.Id;

            // Act
            GenreDetailViewModel vm = null;
            FluentActions.Invoking(() => vm = query.Handle()).Invoke();

            // Assert
            vm.Should().NotBeNull();
            vm.Name.Should().Be(expectedGenre.Name);
        }
    }
}`,
    sourceCode: `public class GetGenreDetailQuery
{
    public int GenreId { get; set; }
    private readonly IBookStoreDbContext _context;
    private readonly IMapper _mapper;

    public GetGenreDetailQuery(IBookStoreDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public GenreDetailViewModel Handle()
    {
        var genre = _context.Genres.SingleOrDefault(x => x.IsActive && x.Id == GenreId);
        if (genre is null)
            throw new InvalidOperationException("Kitap türü bulunamadı!");

        return _mapper.Map<GenreDetailViewModel>(genre);
    }
}`
  },
  {
    id: 'get-genre-detail-query-validator-tests',
    category: 'Genre',
    title: 'GetGenreDetailQueryValidator Tests',
    filename: 'GetGenreDetailQueryValidatorTests.cs',
    path: 'Application/GenreOperations/Queries/GetGenreDetail/GetGenreDetailQueryValidatorTests.cs',
    targetService: 'GetGenreDetailQueryValidator',
    author: 'Enes Öztürk',
    description: 'GetGenreDetailQueryValidator için GenreId doğrulama sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Genre Operations
// Dosya: GetGenreDetailQueryValidatorTests.cs
// Açıklama: GetGenreDetailQueryValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.GenreOperations.Queries.GetGenreDetail;
using Xunit;

namespace Application.GenreOperations.Queries.GetGenreDetail
{
    public class GetGenreDetailQueryValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidGenreIdIsGiven_Validator_ShouldBeReturnErrors(int genreId)
        {
            // Arrange - Enes Öztürk
            GetGenreDetailQuery query = new GetGenreDetailQuery(null, null);
            query.GenreId = genreId;

            // Act
            GetGenreDetailQueryValidator validator = new GetGenreDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidGenreIdIsGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            GetGenreDetailQuery query = new GetGenreDetailQuery(null, null);
            query.GenreId = 1;

            // Act
            GetGenreDetailQueryValidator validator = new GetGenreDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class GetGenreDetailQueryValidator : AbstractValidator<GetGenreDetailQuery>
{
    public GetGenreDetailQueryValidator()
    {
        RuleFor(query => query.GenreId).GreaterThan(0);
    }
}`
  },

  // ==========================================
  // 3. AUTHOR SERVICES UNIT TESTS (ENES ÖZTÜRK İMZALI)
  // ==========================================
  {
    id: 'create-author-command-tests',
    category: 'Author',
    title: 'CreateAuthorCommand Tests',
    filename: 'CreateAuthorCommandTests.cs',
    path: 'Application/AuthorOperations/Commands/CreateAuthor/CreateAuthorCommandTests.cs',
    targetService: 'CreateAuthorCommand',
    author: 'Enes Öztürk',
    description: 'CreateAuthorCommand için yazar adı çakışması, doğum tarihi gelecekte olamaz kuralı ve yazar ekleme testleri (Enes Öztürk imzalı).',
    testCount: 3,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: CreateAuthorCommandTests.cs
// Açıklama: CreateAuthorCommand birim testleri (xUnit & FluentAssertions)
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.CreateAuthor;
using WebApi.DBOperations;
using WebApi.Entities;
using Xunit;

namespace Application.AuthorOperations.Commands.CreateAuthor
{
    public class CreateAuthorCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public CreateAuthorCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenAlreadyExistAuthorIsGiven_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            var existingAuthor = _context.Authors.First();
            CreateAuthorCommand command = new CreateAuthorCommand(_context);
            command.Model = new CreateAuthorModel
            {
                Name = existingAuthor.Name,
                Surname = existingAuthor.Surname,
                DateOfBirth = existingAuthor.DateOfBirth
            };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Yazar zaten mevcut!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Author_ShouldBeCreated()
        {
            // Arrange - Enes Öztürk imzalı yeni yazar testi
            CreateAuthorCommand command = new CreateAuthorCommand(_context);
            CreateAuthorModel model = new CreateAuthorModel
            {
                Name = "Enes",
                Surname = "Öztürk",
                DateOfBirth = new DateTime(1998, 05, 19)
            };
            command.Model = model;

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var author = _context.Authors.SingleOrDefault(a => a.Name == model.Name && a.Surname == model.Surname);
            author.Should().NotBeNull();
            author.DateOfBirth.Date.Should().Be(model.DateOfBirth.Date);
        }

        [Fact]
        public void WhenAuthorBirthDateIsInTheFuture_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Gelecek tarihli doğum tarihi kuralı
            CreateAuthorCommand command = new CreateAuthorCommand(_context);
            command.Model = new CreateAuthorModel
            {
                Name = "Gelecek",
                Surname = "Yazarı",
                DateOfBirth = DateTime.Now.AddDays(5)
            };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Yazarın doğum tarihi bugünden ileri bir tarih olamaz!");
        }
    }
}`,
    sourceCode: `public class CreateAuthorCommand
{
    public CreateAuthorModel Model { get; set; }
    private readonly IBookStoreDbContext _context;

    public CreateAuthorCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var author = _context.Authors.SingleOrDefault(x => x.Name == Model.Name && x.Surname == Model.Surname);
        if (author is not null)
            throw new InvalidOperationException("Yazar zaten mevcut!");

        if (Model.DateOfBirth > DateTime.Now)
            throw new InvalidOperationException("Yazarın doğum tarihi bugünden ileri bir tarih olamaz!");

        author = new Author
        {
            Name = Model.Name,
            Surname = Model.Surname,
            DateOfBirth = Model.DateOfBirth
        };

        _context.Authors.Add(author);
        _context.SaveChanges();
    }
}`
  },
  {
    id: 'create-author-command-validator-tests',
    category: 'Author',
    title: 'CreateAuthorCommandValidator Tests',
    filename: 'CreateAuthorCommandValidatorTests.cs',
    path: 'Application/AuthorOperations/Commands/CreateAuthor/CreateAuthorCommandValidatorTests.cs',
    targetService: 'CreateAuthorCommandValidator',
    author: 'Enes Öztürk',
    description: 'CreateAuthorCommandValidator için isim/soyisim boşluk kontrolü ve gelecek tarih doğrulama testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: CreateAuthorCommandValidatorTests.cs
// Açıklama: CreateAuthorCommandValidator doğrulama testleri
// =========================================================================

using System;
using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.CreateAuthor;
using Xunit;

namespace Application.AuthorOperations.Commands.CreateAuthor
{
    public class CreateAuthorCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData("", "Öztürk")]
        [InlineData("Enes", "")]
        [InlineData("a", "b")] // Çok kısa
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(string name, string surname)
        {
            // Arrange - Enes Öztürk
            CreateAuthorCommand command = new CreateAuthorCommand(null);
            command.Model = new CreateAuthorModel
            {
                Name = name,
                Surname = surname,
                DateOfBirth = new DateTime(1995, 1, 1)
            };

            // Act
            CreateAuthorCommandValidator validator = new CreateAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange - Enes Öztürk
            CreateAuthorCommand command = new CreateAuthorCommand(null);
            command.Model = new CreateAuthorModel
            {
                Name = "Enes",
                Surname = "Öztürk",
                DateOfBirth = DateTime.Now.Date.AddYears(-25)
            };

            // Act
            CreateAuthorCommandValidator validator = new CreateAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class CreateAuthorCommandValidator : AbstractValidator<CreateAuthorCommand>
{
    public CreateAuthorCommandValidator()
    {
        RuleFor(command => command.Model.Name).NotEmpty().MinimumLength(2);
        RuleFor(command => command.Model.Surname).NotEmpty().MinimumLength(2);
        RuleFor(command => command.Model.DateOfBirth).NotEmpty().LessThan(DateTime.Now.Date);
    }
}`
  },
  {
    id: 'delete-author-command-tests',
    category: 'Author',
    title: 'DeleteAuthorCommand Tests',
    filename: 'DeleteAuthorCommandTests.cs',
    path: 'Application/AuthorOperations/Commands/DeleteAuthor/DeleteAuthorCommandTests.cs',
    targetService: 'DeleteAuthorCommand',
    author: 'Enes Öztürk',
    description: 'DeleteAuthorCommand için kritik iş kuralı (yayında kitabı olan yazar silinemez), bulunamayan yazar ve başarılı silme testleri.',
    testCount: 3,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: DeleteAuthorCommandTests.cs
// Açıklama: DeleteAuthorCommand birim testleri (Önemli İş Kuralı: Kitabı olan yazar silinemez)
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.DeleteAuthor;
using WebApi.DBOperations;
using WebApi.Entities;
using Xunit;

namespace Application.AuthorOperations.Commands.DeleteAuthor
{
    public class DeleteAuthorCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public DeleteAuthorCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenGivenAuthorIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            DeleteAuthorCommand command = new DeleteAuthorCommand(_context);
            command.AuthorId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Silinecek yazar bulunamadı!");
        }

        [Fact]
        public void WhenAuthorHasBooks_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Yayında kitabı bulunan bir yazar seçiliyor (İş Kuralı Doğrulaması)
            var bookWithAuthor = _context.Books.First(b => b.AuthorId > 0);
            DeleteAuthorCommand command = new DeleteAuthorCommand(_context);
            command.AuthorId = bookWithAuthor.AuthorId;

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Yayında kitabı bulunan bir yazar silinemez! Önce yazarın kitaplarını siliniz.");
        }

        [Fact]
        public void WhenAuthorHasNoBooksAndExists_Author_ShouldBeDeleted()
        {
            // Arrange - Kitabı olmayan temiz bir yazar ekliyoruz
            var orphanAuthor = new Author
            {
                Name = "Tekil",
                Surname = "Yazar",
                DateOfBirth = new DateTime(1980, 1, 1)
            };
            _context.Authors.Add(orphanAuthor);
            _context.SaveChanges();

            DeleteAuthorCommand command = new DeleteAuthorCommand(_context);
            command.AuthorId = orphanAuthor.Id;

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var deletedAuthor = _context.Authors.SingleOrDefault(a => a.Id == orphanAuthor.Id);
            deletedAuthor.Should().BeNull();
        }
    }
}`,
    sourceCode: `public class DeleteAuthorCommand
{
    public int AuthorId { get; set; }
    private readonly IBookStoreDbContext _context;

    public DeleteAuthorCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var author = _context.Authors.SingleOrDefault(x => x.Id == AuthorId);
        if (author is null)
            throw new InvalidOperationException("Silinecek yazar bulunamadı!");

        var hasBooks = _context.Books.Any(x => x.AuthorId == AuthorId);
        if (hasBooks)
            throw new InvalidOperationException("Yayında kitabı bulunan bir yazar silinemez! Önce yazarın kitaplarını siliniz.");

        _context.Authors.Remove(author);
        _context.SaveChanges();
    }
}`
  },
  {
    id: 'delete-author-command-validator-tests',
    category: 'Author',
    title: 'DeleteAuthorCommandValidator Tests',
    filename: 'DeleteAuthorCommandValidatorTests.cs',
    path: 'Application/AuthorOperations/Commands/DeleteAuthor/DeleteAuthorCommandValidatorTests.cs',
    targetService: 'DeleteAuthorCommandValidator',
    author: 'Enes Öztürk',
    description: 'DeleteAuthorCommandValidator için AuthorId doğrulama sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: DeleteAuthorCommandValidatorTests.cs
// Açıklama: DeleteAuthorCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.DeleteAuthor;
using Xunit;

namespace Application.AuthorOperations.Commands.DeleteAuthor
{
    public class DeleteAuthorCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int authorId)
        {
            // Arrange - Enes Öztürk
            DeleteAuthorCommand command = new DeleteAuthorCommand(null);
            command.AuthorId = authorId;

            // Act
            DeleteAuthorCommandValidator validator = new DeleteAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            DeleteAuthorCommand command = new DeleteAuthorCommand(null);
            command.AuthorId = 1;

            // Act
            DeleteAuthorCommandValidator validator = new DeleteAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class DeleteAuthorCommandValidator : AbstractValidator<DeleteAuthorCommand>
{
    public DeleteAuthorCommandValidator()
    {
        RuleFor(command => command.AuthorId).GreaterThan(0);
    }
}`
  },
  {
    id: 'update-author-command-tests',
    category: 'Author',
    title: 'UpdateAuthorCommand Tests',
    filename: 'UpdateAuthorCommandTests.cs',
    path: 'Application/AuthorOperations/Commands/UpdateAuthor/UpdateAuthorCommandTests.cs',
    targetService: 'UpdateAuthorCommand',
    author: 'Enes Öztürk',
    description: 'UpdateAuthorCommand için yazar bulunamama ve başarılı yazar güncelleme testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: UpdateAuthorCommandTests.cs
// Açıklama: UpdateAuthorCommand birim testleri
// =========================================================================

using System;
using System.Linq;
using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.UpdateAuthor;
using WebApi.DBOperations;
using Xunit;

namespace Application.AuthorOperations.Commands.UpdateAuthor
{
    public class UpdateAuthorCommandTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;

        public UpdateAuthorCommandTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
        }

        [Fact]
        public void WhenGivenAuthorIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            UpdateAuthorCommand command = new UpdateAuthorCommand(_context);
            command.AuthorId = 999999;
            command.Model = new UpdateAuthorModel { Name = "Görünmez", Surname = "Adam" };

            // Act & Assert
            FluentActions.Invoking(() => command.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Güncellenecek yazar bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Author_ShouldBeUpdated()
        {
            // Arrange
            var existingAuthor = _context.Authors.First();
            UpdateAuthorCommand command = new UpdateAuthorCommand(_context);
            command.AuthorId = existingAuthor.Id;
            command.Model = new UpdateAuthorModel
            {
                Name = "Enes Güncellendi",
                Surname = "Öztürk",
                DateOfBirth = new DateTime(1996, 7, 15)
            };

            // Act
            FluentActions.Invoking(() => command.Handle()).Invoke();

            // Assert
            var updatedAuthor = _context.Authors.SingleOrDefault(a => a.Id == existingAuthor.Id);
            updatedAuthor.Should().NotBeNull();
            updatedAuthor.Name.Should().Be(command.Model.Name);
            updatedAuthor.Surname.Should().Be(command.Model.Surname);
        }
    }
}`,
    sourceCode: `public class UpdateAuthorCommand
{
    public int AuthorId { get; set; }
    public UpdateAuthorModel Model { get; set; }
    private readonly IBookStoreDbContext _context;

    public UpdateAuthorCommand(IBookStoreDbContext context)
    {
        _context = context;
    }

    public void Handle()
    {
        var author = _context.Authors.SingleOrDefault(x => x.Id == AuthorId);
        if (author is null)
            throw new InvalidOperationException("Güncellenecek yazar bulunamadı!");

        author.Name = string.IsNullOrEmpty(Model.Name.Trim()) ? author.Name : Model.Name;
        author.Surname = string.IsNullOrEmpty(Model.Surname.Trim()) ? author.Surname : Model.Surname;
        if (Model.DateOfBirth != default)
            author.DateOfBirth = Model.DateOfBirth;

        _context.SaveChanges();
    }
}`
  },
  {
    id: 'update-author-command-validator-tests',
    category: 'Author',
    title: 'UpdateAuthorCommandValidator Tests',
    filename: 'UpdateAuthorCommandValidatorTests.cs',
    path: 'Application/AuthorOperations/Commands/UpdateAuthor/UpdateAuthorCommandValidatorTests.cs',
    targetService: 'UpdateAuthorCommandValidator',
    author: 'Enes Öztürk',
    description: 'UpdateAuthorCommandValidator için AuthorId ve parametre doğrulama sınır testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: UpdateAuthorCommandValidatorTests.cs
// Açıklama: UpdateAuthorCommandValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Commands.UpdateAuthor;
using Xunit;

namespace Application.AuthorOperations.Commands.UpdateAuthor
{
    public class UpdateAuthorCommandValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(0, "Enes", "Öztürk")]
        [InlineData(-1, "Enes", "Öztürk")]
        [InlineData(1, "a", "Öztürk")] // İsim 2 karakterden kısa
        public void WhenInvalidInputsAreGiven_Validator_ShouldBeReturnErrors(int authorId, string name, string surname)
        {
            // Arrange - Enes Öztürk
            UpdateAuthorCommand command = new UpdateAuthorCommand(null);
            command.AuthorId = authorId;
            command.Model = new UpdateAuthorModel
            {
                Name = name,
                Surname = surname
            };

            // Act
            UpdateAuthorCommandValidator validator = new UpdateAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidInputsAreGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            UpdateAuthorCommand command = new UpdateAuthorCommand(null);
            command.AuthorId = 1;
            command.Model = new UpdateAuthorModel
            {
                Name = "Enes",
                Surname = "Öztürk"
            };

            // Act
            UpdateAuthorCommandValidator validator = new UpdateAuthorCommandValidator();
            var result = validator.Validate(command);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class UpdateAuthorCommandValidator : AbstractValidator<UpdateAuthorCommand>
{
    public UpdateAuthorCommandValidator()
    {
        RuleFor(command => command.AuthorId).GreaterThan(0);
        RuleFor(command => command.Model.Name).MinimumLength(2).When(x => !string.IsNullOrEmpty(x.Model.Name.Trim()));
        RuleFor(command => command.Model.Surname).MinimumLength(2).When(x => !string.IsNullOrEmpty(x.Model.Surname.Trim()));
    }
}`
  },
  {
    id: 'get-author-detail-query-tests',
    category: 'Author',
    title: 'GetAuthorDetailQuery Tests',
    filename: 'GetAuthorDetailQueryTests.cs',
    path: 'Application/AuthorOperations/Queries/GetAuthorDetail/GetAuthorDetailQueryTests.cs',
    targetService: 'GetAuthorDetailQuery',
    author: 'Enes Öztürk',
    description: 'GetAuthorDetailQuery için yazar bulunamama ve AutoMapper ile başarılı detay getirme testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: GetAuthorDetailQueryTests.cs
// Açıklama: GetAuthorDetailQuery birim testleri (AutoMapper & EF InMemory)
// =========================================================================

using System;
using System.Linq;
using AutoMapper;
using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Queries.GetAuthorDetail;
using WebApi.DBOperations;
using Xunit;

namespace Application.AuthorOperations.Queries.GetAuthorDetail
{
    public class GetAuthorDetailQueryTests : IClassFixture<CommonTestFixture>
    {
        private readonly BookStoreDbContext _context;
        private readonly IMapper _mapper;

        public GetAuthorDetailQueryTests(CommonTestFixture testFixture)
        {
            _context = testFixture.Context;
            _mapper = testFixture.Mapper;
        }

        [Fact]
        public void WhenGivenAuthorIdDoesNotExist_InvalidOperationException_ShouldBeReturned()
        {
            // Arrange - Enes Öztürk
            GetAuthorDetailQuery query = new GetAuthorDetailQuery(_context, _mapper);
            query.AuthorId = 999999;

            // Act & Assert
            FluentActions.Invoking(() => query.Handle())
                .Should().Throw<InvalidOperationException>()
                .And.Message.Should().Be("Yazar bulunamadı!");
        }

        [Fact]
        public void WhenValidInputsAreGiven_Author_ShouldBeReturned()
        {
            // Arrange
            var expectedAuthor = _context.Authors.First();
            GetAuthorDetailQuery query = new GetAuthorDetailQuery(_context, _mapper);
            query.AuthorId = expectedAuthor.Id;

            // Act
            AuthorDetailViewModel vm = null;
            FluentActions.Invoking(() => vm = query.Handle()).Invoke();

            // Assert
            vm.Should().NotBeNull();
            vm.Name.Should().Be(expectedAuthor.Name);
            vm.Surname.Should().Be(expectedAuthor.Surname);
            vm.DateOfBirth.Should().Be(expectedAuthor.DateOfBirth.ToString("dd/MM/yyyy"));
        }
    }
}`,
    sourceCode: `public class GetAuthorDetailQuery
{
    public int AuthorId { get; set; }
    private readonly IBookStoreDbContext _context;
    private readonly IMapper _mapper;

    public GetAuthorDetailQuery(IBookStoreDbContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }

    public AuthorDetailViewModel Handle()
    {
        var author = _context.Authors.SingleOrDefault(x => x.Id == AuthorId);
        if (author is null)
            throw new InvalidOperationException("Yazar bulunamadı!");

        return _mapper.Map<AuthorDetailViewModel>(author);
    }
}`
  },
  {
    id: 'get-author-detail-query-validator-tests',
    category: 'Author',
    title: 'GetAuthorDetailQueryValidator Tests',
    filename: 'GetAuthorDetailQueryValidatorTests.cs',
    path: 'Application/AuthorOperations/Queries/GetAuthorDetail/GetAuthorDetailQueryValidatorTests.cs',
    targetService: 'GetAuthorDetailQueryValidator',
    author: 'Enes Öztürk',
    description: 'GetAuthorDetailQueryValidator için AuthorId sınır değer doğrulama testleri.',
    testCount: 2,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk (İmzalı Ödev Kodu)
// Proje: BookStore WebApi Unit Tests - Author Operations
// Dosya: GetAuthorDetailQueryValidatorTests.cs
// Açıklama: GetAuthorDetailQueryValidator doğrulama testleri
// =========================================================================

using FluentAssertions;
using TestSetup;
using WebApi.Application.AuthorOperations.Queries.GetAuthorDetail;
using Xunit;

namespace Application.AuthorOperations.Queries.GetAuthorDetail
{
    public class GetAuthorDetailQueryValidatorTests : IClassFixture<CommonTestFixture>
    {
        [Theory]
        [InlineData(-1)]
        [InlineData(0)]
        public void WhenInvalidAuthorIdIsGiven_Validator_ShouldBeReturnErrors(int authorId)
        {
            // Arrange - Enes Öztürk
            GetAuthorDetailQuery query = new GetAuthorDetailQuery(null, null);
            query.AuthorId = authorId;

            // Act
            GetAuthorDetailQueryValidator validator = new GetAuthorDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().BeGreaterThan(0);
        }

        [Fact]
        public void WhenValidAuthorIdIsGiven_Validator_ShouldNotBeReturnError()
        {
            // Arrange
            GetAuthorDetailQuery query = new GetAuthorDetailQuery(null, null);
            query.AuthorId = 1;

            // Act
            GetAuthorDetailQueryValidator validator = new GetAuthorDetailQueryValidator();
            var result = validator.Validate(query);

            // Assert
            result.Errors.Count.Should().Be(0);
        }
    }
}`,
    validatorCode: `public class GetAuthorDetailQueryValidator : AbstractValidator<GetAuthorDetailQuery>
{
    public GetAuthorDetailQueryValidator()
    {
        RuleFor(query => query.AuthorId).GreaterThan(0);
    }
}`
  },

  // ==========================================
  // 4. TEST SETUP & FIXTURE FILES
  // ==========================================
  {
    id: 'common-test-fixture',
    category: 'Setup',
    title: 'CommonTestFixture & AutoMapper Setup',
    filename: 'CommonTestFixture.cs',
    path: 'TestSetup/CommonTestFixture.cs',
    targetService: 'CommonTestFixture',
    author: 'Enes Öztürk',
    description: 'xUnit IClassFixture ile paylaşılan InMemoryDbContext ve AutoMapper konfigürasyonu.',
    testCount: 0,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Test Infrastructure
// Dosya: CommonTestFixture.cs
// =========================================================================

using AutoMapper;
using Microsoft.EntityFrameworkCore;
using WebApi.Common;
using WebApi.DBOperations;

namespace TestSetup
{
    public class CommonTestFixture
    {
        public BookStoreDbContext Context { get; set; }
        public IMapper Mapper { get; set; }

        public CommonTestFixture()
        {
            var options = new DbContextOptionsBuilder<BookStoreDbContext>()
                .UseInMemoryDatabase(databaseName: "BookStoreTestDB_" + System.Guid.NewGuid().ToString())
                .Options;

            Context = new BookStoreDbContext(options);
            Context.Database.EnsureCreated();

            // Seed Initial Data (Book, Genre, Author) - Hazırlayan: Enes Öztürk
            Context.AddBooks();
            Context.AddGenres();
            Context.AddAuthors();
            Context.SaveChanges();

            // AutoMapper Configuration
            var config = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<MappingProfile>();
            });
            Mapper = config.CreateMapper();
        }
    }
}`
  },
  {
    id: 'authors-seed-setup',
    category: 'Setup',
    title: 'Authors Seed Data Setup',
    filename: 'Authors.cs',
    path: 'TestSetup/Authors.cs',
    targetService: 'TestSetup.Authors',
    author: 'Enes Öztürk',
    description: 'Test ortamı için InMemory veritabanına eklenen başlangıç yazar kayıtları (Enes Öztürk imzalı).',
    testCount: 0,
    code: `// =========================================================================
// Geliştirici: Enes Öztürk
// Proje: BookStore WebApi Unit Tests - Test Infrastructure
// Dosya: Authors.cs (Seed Data)
// =========================================================================

using System;
using WebApi.DBOperations;
using WebApi.Entities;

namespace TestSetup
{
    public static class Authors
    {
        public static void AddAuthors(this BookStoreDbContext context)
        {
            context.Authors.AddRange(
                new Author
                {
                    Name = "Eric",
                    Surname = "Ries",
                    DateOfBirth = new DateTime(1978, 09, 22)
                },
                new Author
                {
                    Name = "Frank",
                    Surname = "Herbert",
                    DateOfBirth = new DateTime(1920, 10, 08)
                },
                new Author
                {
                    Name = "Enes",
                    Surname = "Öztürk",
                    DateOfBirth = new DateTime(1998, 05, 19)
                }
            );
        }
    }
}`
  }
];
