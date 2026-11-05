import {
  Author,
  Book,
  Genre,
  CreateAuthorModel,
  UpdateAuthorModel,
  AuthorsViewModel,
  AuthorDetailViewModel,
} from '../types';

/**
 * AutoMapper Profile Eşleşmeleri
 * C# MappingProfile : Profile sınıfının işlevini birebir canlandırır.
 * 
 * İmza: Enes Öztürk
 */
export class AutoMapper {
  /**
   * Tarih formatlayıcı: yyyy-MM-dd -> dd.MM.yyyy
   */
  public static formatDate(dateStr: string): string {
    if (!dateStr) return '';
    try {
      const parts = dateStr.split('-');
      if (parts.length === 3) {
        return `${parts[2].padStart(2, '0')}.${parts[1].padStart(2, '0')}.${parts[0]}`;
      }
      const d = new Date(dateStr);
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}.${month}.${year}`;
    } catch {
      return dateStr;
    }
  }

  /**
   * Yaş hesaplayıcı
   */
  public static calculateAge(birthDateStr: string): number {
    if (!birthDateStr) return 0;
    const birth = new Date(birthDateStr);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return Math.max(0, age);
  }

  /**
   * CreateAuthorModel -> Author Entity
   */
  public static mapCreateAuthorToEntity(
    model: CreateAuthorModel,
    nextId: number
  ): Author {
    return {
      id: nextId,
      firstName: model.firstName.trim(),
      lastName: model.lastName.trim(),
      birthDate: model.birthDate,
      createdAt: new Date().toISOString(),
    };
  }

  /**
   * UpdateAuthorModel -> Mevcut Author Entity güncelleme
   */
  public static mapUpdateAuthorToEntity(
    model: UpdateAuthorModel,
    existingAuthor: Author
  ): Author {
    return {
      ...existingAuthor,
      firstName: model.firstName.trim(),
      lastName: model.lastName.trim(),
      birthDate: model.birthDate,
    };
  }

  /**
   * Author Entity + Books -> AuthorsViewModel (Liste görünümü)
   * AutoMapper: CreateMap<Author, AuthorsViewModel>()
   *   .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
   *   .ForMember(dest => dest.BirthDate, opt => opt.MapFrom(src => src.BirthDate.ToString("dd.MM.yyyy")))
   */
  public static mapAuthorToViewModel(
    author: Author,
    authorBooks: Book[]
  ): AuthorsViewModel {
    const publishedBooks = authorBooks.filter((b) => b.isPublished);

    return {
      id: author.id,
      fullName: `${author.firstName} ${author.lastName}`,
      birthDate: this.formatDate(author.birthDate),
      age: this.calculateAge(author.birthDate),
      bookCount: authorBooks.length,
      publishedBookCount: publishedBooks.length,
      bookTitles: authorBooks.map((b) => b.title),
    };
  }

  /**
   * Author Entity + Books + Genres -> AuthorDetailViewModel
   */
  public static mapAuthorToDetailViewModel(
    author: Author,
    authorBooks: Book[],
    genres: Genre[]
  ): AuthorDetailViewModel {
    const genreMap = new Map(genres.map((g) => [g.id, g.name]));

    return {
      id: author.id,
      firstName: author.firstName,
      lastName: author.lastName,
      fullName: `${author.firstName} ${author.lastName}`,
      birthDate: author.birthDate,
      formattedBirthDate: this.formatDate(author.birthDate),
      age: this.calculateAge(author.birthDate),
      books: authorBooks.map((b) => ({
        id: b.id,
        title: b.title,
        genreName: genreMap.get(b.genreId) || 'Belirtilmemiş',
        publishDate: this.formatDate(b.publishDate),
        pageCount: b.pageCount,
        isPublished: b.isPublished,
      })),
    };
  }
}
