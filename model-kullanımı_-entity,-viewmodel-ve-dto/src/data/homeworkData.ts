import { ConceptDetail, ComparisonRow, CodeTemplate, QuizQuestion } from '../types/modelTypes';

export const CONCEPTS_DATA: ConceptDetail[] = [
  {
    id: 'entity',
    title: 'Entity (Varlık Modeli)',
    badge: 'Veri & Domain Katmanı',
    tagline: 'Veritabanı tablosunun ve iş kurallarının (Domain) birebir yazılımdaki yaşayan karşılığıdır.',
    layer: 'Domain / Data Access Layer (Persistence)',
    purpose: 'Veritabanındaki bir tablo veya koleksiyonun yapısını temsil etmek, birincil anahtar (Primary Key / Id) üzerinden kimlik taşımak ve veri bütünlüğü iş kurallarını (Domain Invariants) korumaktır.',
    keyResponsibilities: [
      'Veritabanı şeması ve ORM (Entity Framework, Hibernate, Prisma) ile doğrudan eşleşir.',
      'Benzersiz bir kimliğe (Id / Primary Key) sahiptir.',
      'Domain mantığını, state değişikliklerini ve iş kurallarını barındırabilir (Rich Domain Model).',
      'Veritabanı ilişkilerini (Navigation Properties: 1-to-N, M-to-N) yönetir.',
      'Audit log bilgilerini (CreatedAt, UpdatedAt, CreatedBy, IsDeleted) içerir.'
    ],
    mustInclude: [
      'Primary Key (Id / Guid / int)',
      'Veritabanı sütunları (Örn: PasswordHash, Salt, RowVersion)',
      'İlişkisel navigasyon özellikleri (Örn: ICollection<Order> Orders)',
      'Domain doğrulama ve durum geçiş metotları'
    ],
    mustNeverInclude: [
      'UI/Arayüz formatlama mantığı veya formatlı metinler (Örn: "₺1.250,00")',
      'Ekran bileşeni gereksinimleri (Örn: Dropdown SelectListItem, IsChecked)',
      'Giriş/Kayıt ekranındaki şifre doğrulama (ConfirmPassword) alanı',
      'Dış dünyaya doğrudan JSON çıktısı olarak serileştirme nitelikleri'
    ],
    commonMistakes: [
      'Entity sınıfını doğrudan Controller endpointinden parametre veya dönüş tipi olarak kullanmak (Mass Assignment zafiyeti).',
      'Entity içerisine UI validasyon kuralları ([Display(Name="Adınız")]) eklemek.',
      'Veritabanı tablosunu her UI değişikliğinde gereksiz kolonlarla kirletmek.'
    ],
    colorScheme: {
      border: 'border-emerald-500/30',
      bg: 'bg-emerald-500/5',
      text: 'text-emerald-800 dark:text-emerald-300',
      accent: 'emerald'
    },
    codeSnippet: `// ENTITY ÖRNEĞİ (Domain & DB Katmanı)
public class User : BaseEntity
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    // GÜVENLİK ALANLARI: Dışarıya ASLA açık dönülmemeli!
    public byte[] PasswordHash { get; set; } = Array.Empty<byte>();
    public byte[] PasswordSalt { get; set; } = Array.Empty<byte>();
    public bool IsAdmin { get; set; } = false;
    
    // Audit & Durum Alanları
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsDeleted { get; set; } = false;
    
    // İlişkisel Veriler
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}`
  },
  {
    id: 'dto',
    title: 'DTO (Data Transfer Object)',
    badge: 'İletişim & API Katmanı',
    tagline: 'Katmanlar arası ya da istemci-sunucu arasında yalnızca gerekli veriyi taşıyan hafif ve zekasız (Anemic) nesnedir.',
    layer: 'Application / API / Service Layer',
    purpose: 'Ağ yükünü azaltmak, hassas verilerin (şifre hashleri, sistem alanları) dışarı sızmasını önlemek, API sözleşmesini veritabanı şemasındaki değişikliklerden izole etmektir.',
    keyResponsibilities: [
      'Yalnızca veri taşır (Data Carrier). İçinde iş mantığı, hesaplama veya metot bulunmaz.',
      'Ağ üzerinden serileştirilip (JSON/XML/gRPC) deserialize edilir.',
      'Request DTO (örn: CreateUserDto) ve Response DTO (örn: UserSummaryDto) olarak iki yönde çalışır.',
      'API versiyonlamasında veritabanını bozmadan geriye dönük uyumluluk sağlar.',
      'Overposting ve Mass Assignment saldırılarına karşı en temel güvenlik kalkanıdır.'
    ],
    mustInclude: [
      'İlgili işlem için istemciden beklenen veya istemciye sunulacak asgari alanlar.',
      'Veri taşıma doğrulamaları (Örn: FluentValidation veya [EmailAddress], [MaxLength]).',
      'Serileştirme özellikleri (JSON property isimleri).'
    ],
    mustNeverInclude: [
      'İş kuralı metotları (Örn: CalculateDiscount(), SaveToDatabase()).',
      'Veritabanı ORM bağımlılıkları (EF Core DbContext, ForeignKey özellikleri).',
      'Hassas iç sistem verileri (PasswordHash, Salt, Dahili Audit verileri).',
      'HTML veya Razor/React bileşen durumları.'
    ],
    commonMistakes: [
      'DTO içerisine iş mantığı veya veri tabanı erişim kodu yerleştirmek.',
      'Tüm entity alanlarını birebir DTO’ya kopyalayarak gereksiz 1:1 çoğaltma yapmak.',
      'Gelen Request DTO’yu doğrulamadan doğrudan Entity’ye kopyalamak.'
    ],
    colorScheme: {
      border: 'border-blue-500/30',
      bg: 'bg-blue-500/5',
      text: 'text-blue-800 dark:text-blue-300',
      accent: 'blue'
    },
    codeSnippet: `// REQUEST DTO (İstemciden gelen veri)
public class CreateUserRequestDto
{
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required, MinLength(8)]
    public string Password { get; set; } = string.Empty;
    
    [Required]
    public string FirstName { get; set; } = string.Empty;
    
    [Required]
    public string LastName { get; set; } = string.Empty;
    // DİKKAT: IsAdmin veya CreatedAt burada YOKTUR! (Güvenlik)
}

// RESPONSE DTO (İstemciye dönen güvenli veri)
public class UserResponseDto
{
    public Guid Id { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FullName { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    // PasswordHash veya Salt ASLA burada yer almaz!
}`
  },
  {
    id: 'viewmodel',
    title: 'ViewModel (Görünüm Modeli)',
    badge: 'Sunum & UI Katmanı',
    tagline: 'Kullanıcı arayüzünün (View) render edilmesi, form kontrolü ve kullanıcı etkileşimi için özelleştirilmiş modeldir.',
    layer: 'Presentation / UI Layer (MVC, MVVM, SPA Frontend)',
    purpose: 'Belirli bir ekranın (View) ihtiyaç duyduğu tüm verileri (birden fazla kaynaktan toplanmış veriler, dropdown seçenekleri, hata mesajları, onay kutuları) tek bir çatıda toplamak ve UI formatlaması sağlamaktır.',
    keyResponsibilities: [
      'Ekranın gereksinimlerine göre özel formatlama yapar (Örn: 1500 -> "1.500,00 TL", Tarih -> "2 saat önce").',
      'Arayüz bileşen verilerini taşır (Örn: Şehirler Listesi, Roller Dropdown SelectListItem, Checkbox durumları).',
      'Kullanıcı giriş doğrulamalarını (Arayüz validasyonları: [Compare("Password")], [Display(Name="...")]) tutar.',
      'Sayfa durumunu (State) ve sekmeleri yönetir.',
      'Karmaşık ekranlarda birden fazla Entity/DTO’yu tek bir ekranda birleştirir (Aggregate View).'
    ],
    mustInclude: [
      'Kullanıcı arayüzünün doğrudan bağlandığı (Data-bound) özellikler.',
      'Kullanıcı dostu etiketler ([Display(Name = "E-Posta Adresiniz")]).',
      'UI bileşen seçenekleri (List<SelectListItem> Roles, Cities).',
      'Çift şifre kontrolü (Password ve ConfirmPassword eşleşmesi).'
    ],
    mustNeverInclude: [
      'Veritabanı bağlantısı veya SQL sorgulama yapıları.',
      'İş mantığı (Business Rules) ve veritabanı CRUD işlemleri.',
      'Mikroservisler arası ağ protokolü taşıyıcıları (Bunun için DTO kullanılır).'
    ],
    commonMistakes: [
      'ViewModel’i doğrudan Service katmanına veya Entity Framework’e parametre olarak göndermek.',
      'Controller veya View içine formatlama kodları saçmak yerine ViewModel formatlama özelliğini kullanmamak.',
      'Tek bir devasa ViewModel yapıp her sayfada tekrar tekrar taşımak.'
    ],
    colorScheme: {
      border: 'border-amber-500/30',
      bg: 'bg-amber-500/5',
      text: 'text-amber-800 dark:text-amber-300',
      accent: 'amber'
    },
    codeSnippet: `// VIEWMODEL ÖRNEĞİ (UI / Sunum Katmanı)
public class UserRegisterViewModel
{
    [Display(Name = "E-Posta Adresi")]
    [Required(ErrorMessage = "E-posta alanı zorunludur.")]
    [EmailAddress(ErrorMessage = "Geçerli bir e-posta giriniz.")]
    public string Email { get; set; } = string.Empty;

    [Display(Name = "Parola")]
    [Required, DataType(DataType.Password)]
    public string Password { get; set; } = string.Empty;

    // UI'ya ÖZEL: Sadece frontend teyidi için gereklidir
    [Display(Name = "Parola Tekrarı")]
    [Compare("Password", ErrorMessage = "Parolalar uyuşmuyor.")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Display(Name = "Kullanıcı Sözleşmesini Kabul Ediyorum")]
    [Range(typeof(bool), "true", "true", ErrorMessage = "Sözleşmeyi onaylamalısınız.")]
    public bool TermsAccepted { get; set; }

    // UI BİLEŞENİ: Dropdown doldurmak için seçenekler
    public List<SelectListItem> AvailableDepartments { get; set; } = new();
}`
  }
];

export const COMPARISON_MATRIX: ComparisonRow[] = [
  {
    feature: 'Temel Amaç',
    entity: 'Veritabanı tablosunu ve domain iş kurallarını temsil etmek',
    dto: 'Katmanlar veya sistemler arasında optimize veri taşımak',
    viewModel: 'Kullanıcı arayüzünü (UI) beslemek ve form girdilerini yönetmek'
  },
  {
    feature: 'Bulunduğu Mimari Katman',
    entity: 'Domain / Data Access Layer (Persistence)',
    dto: 'Application / Service / API Layer',
    viewModel: 'Presentation / UI Layer (MVC, Razor, React/Vue)'
  },
  {
    feature: 'Davranış & Metot İçerir mi?',
    entity: 'Evet, zengin domain modellerinde iş kuralları ve durum metotları içerir',
    dto: 'Hayır, tamamen zekasız (anemic), salt veri taşıyıcı getter/setter barındırır',
    viewModel: 'Kısmen, yalnızca UI formatlama veya hesaplanmış display özellikleri içerir'
  },
  {
    feature: 'Validasyon Türü',
    entity: 'Domain bütünlüğü ve veritabanı kısıtlamaları (Foreign Key, Unique, Check)',
    dto: 'Veri transfer sözleşmesi doğrulaması (FluentValidation, DataAnnotations)',
    viewModel: 'Kullanıcı arayüzü ve form doğrulaması (Compare, DisplayName, Regex)'
  },
  {
    feature: 'Güvenlik & Gizlilik Durumu',
    entity: 'Yüksek riskli: Şifre hashleri, audit alanları ve yetki bayrakları taşır',
    dto: 'Güvenlik kalkanı: Yalnızca izin verilen alanları taşır, Mass Assignment önler',
    viewModel: 'UI güvenli: Sadece kullanıcının görmesi ve girmesi gereken verileri sunar'
  },
  {
    feature: 'UI ve Ekran Bağımlılığı',
    entity: 'Kesinlikle SIFIR (UI değişse bile Entity asla değişmemelidir)',
    dto: 'Sözleşmeye bağlıdır (API kontratı korunduğu sürece UI’dan bağımsızdır)',
    viewModel: '%100 Bağımlıdır (Ekrandaki her dropdown, buton veya metinle senkronize)'
  },
  {
    feature: 'Tipik Örnek İsimlendirme',
    entity: 'User, Order, Product, InvoiceItem',
    dto: 'CreateUserDto, UserResponseDto, OrderFilterDto',
    viewModel: 'UserRegisterViewModel, DashboardCardViewModel, ProductEditViewModel'
  }
];

export const CODE_TEMPLATES: CodeTemplate[] = [
  {
    language: 'csharp',
    title: '.NET 8 / C# (ASP.NET Core & EF Core)',
    files: [
      {
        fileName: 'User.cs',
        modelType: 'entity',
        description: 'Veritabanı tablosu ile eşleşen Domain Varlık Sınıfı',
        code: `namespace Homework.Domain.Entities;

public class User
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    
    // Güvenlik: Asla istemciye gönderilmez!
    public byte[] PasswordHash { get; set; } = null!;
    public byte[] PasswordSalt { get; set; } = null!;
    
    // Sistem Yetkisi: İstemci doğrudan değiştiremez!
    public bool IsAdmin { get; set; } = false;
    
    // Audit Bilgileri
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public bool IsActive { get; set; } = true;
    public bool IsDeleted { get; set; } = false;
    
    // Navigation Property
    public ICollection<Order> Orders { get; set; } = new List<Order>();
}`
      },
      {
        fileName: 'UserDtos.cs',
        modelType: 'dto',
        description: 'API üzerinden gelen ve dönen veri sözleşmeleri',
        code: `namespace Homework.Application.DTOs;

// İstemcinin kayıt olurken gönderdiği veri
public record CreateUserRequestDto(
    string Email,
    string Password,
    string FirstName,
    string LastName
);

// API'nin dışarıya güvenle döndüğü veri
public record UserResponseDto(
    Guid Id,
    string Email,
    string FullName,
    DateTime CreatedAt,
    bool IsActive
);`
      },
      {
        fileName: 'UserRegisterViewModel.cs',
        modelType: 'viewmodel',
        description: 'Kullanıcı arayüzü form kontrolü ve hata mesajları modeli',
        code: `using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace Homework.Web.ViewModels;

public class UserRegisterViewModel
{
    [Display(Name = "E-Posta Adresi")]
    [Required(ErrorMessage = "{0} alanı boş bırakılamaz.")]
    [EmailAddress(ErrorMessage = "Lütfen geçerli bir e-posta adresi yazınız.")]
    public string Email { get; set; } = string.Empty;

    [Display(Name = "Şifre")]
    [Required(ErrorMessage = "{0} zorunludur.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "Şifre en az 8 karakter olmalıdır.")]
    public string Password { get; set; } = string.Empty;

    [Display(Name = "Şifre Tekrarı")]
    [Compare("Password", ErrorMessage = "Girdiğiniz şifreler birbiriyle uyuşmuyor.")]
    public string ConfirmPassword { get; set; } = string.Empty;

    [Display(Name = "Ad")]
    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Display(Name = "Soyad")]
    [Required]
    public string LastName { get; set; } = string.Empty;

    // Arayüz Dropdown Listesi
    public List<SelectListItem> DepartmentList { get; set; } = new();
}`
      },
      {
        fileName: 'UsersController.cs',
        modelType: 'controller',
        description: 'Katmanlar arası güvenli veri dönüşümü ve Controller orkestrasyonu',
        code: `using Microsoft.AspNetCore.Mvc;

namespace Homework.Web.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] CreateUserRequestDto dto)
    {
        // 1. Controller DTO'yu alır (Entity doğrudan ASLA kabul edilmez!)
        // 2. Servis katmanı DTO -> Entity dönüşümünü yapar ve şifreyi hashler
        UserResponseDto response = await _userService.CreateUserAsync(dto);
        
        // 3. Response DTO istemciye döndürülür
        return CreatedAtAction(nameof(GetById), new { id = response.Id }, response);
    }
}`
      }
    ]
  },
  {
    language: 'typescript',
    title: 'TypeScript / Node (NestJS & Prisma)',
    files: [
      {
        fileName: 'user.entity.ts',
        modelType: 'entity',
        description: 'Prisma / TypeORM veritabanı varlık şeması',
        code: `// Prisma / TypeORM Entity Tanımı
export class UserEntity {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  passwordHash: string; // Gizli alan
  isAdmin: boolean;      // Yetki alanı
  createdAt: Date;
  deletedAt: Date | null;
}`
      },
      {
        fileName: 'create-user.dto.ts',
        modelType: 'dto',
        description: 'class-validator ile denetlenen API DTO nesnesi',
        code: `import { IsEmail, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'Geçersiz e-posta formatı' })
  email: string;

  @IsString()
  @MinLength(8, { message: 'Şifre en az 8 karakter olmalıdır' })
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;
  // isAdmin alanı burada YOK! Mass assignment engellenir.
}`
      },
      {
        fileName: 'user-profile.vm.ts',
        modelType: 'viewmodel',
        description: 'Frontend için biçimlendirilmiş sunum modeli',
        code: `export interface UserProfileViewModel {
  userId: string;
  displayFullName: string; // FirstName + ' ' + LastName
  emailBadge: string;
  memberSinceFormatted: string; // "Kasım 2026'dan beri üye"
  avatarPlaceholderUrl: string;
}`
      }
    ]
  },
  {
    language: 'java',
    title: 'Java (Spring Boot 3 & Jakarta JPA)',
    files: [
      {
        fileName: 'User.java',
        modelType: 'entity',
        description: 'JPA @Entity anotasyonlu veritabanı tablosu',
        code: `@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String passwordHash;

    @Column(nullable = false)
    private Boolean isAdmin = false;

    @CreationTimestamp
    private Instant createdAt;

    // Getter ve Setter metotları...
}`
      },
      {
        fileName: 'UserRegisterDto.java',
        modelType: 'dto',
        description: 'Jakarta Validation destekli Request DTO',
        code: `public record UserRegisterDto(
    @NotBlank @Email String email,
    @NotBlank @Size(min = 8) String password,
    @NotBlank String firstName,
    @NotBlank String lastName
) {}`
      }
    ]
  }
];

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    scenario: 'Bir e-ticaret sisteminde yeni ürün ekleme sayfası tasarlanmaktadır. Sayfada kategori seçimi için bir Dropdown (Select listesi) ve onay kutusu (Checkbox) bulunmaktadır.',
    question: 'Kategori dropdown seçeneklerini ve form giriş alanlarını taşımak için mimari olarak en uygun model hangisidir?',
    options: [
      {
        id: 'a',
        text: 'Product Entity',
        isCorrect: false,
        explanation: 'Yanlış. Entity veritabanı tablosudur. Arayüzdeki dropdown seçenekleri (List<SelectListItem>) veritabanındaki Product tablosunun bir kolonu olamaz ve veritabanı şemasını kirletmemelidir.'
      },
      {
        id: 'b',
        text: 'ProductCreateViewModel',
        isCorrect: true,
        explanation: 'Tebrikler, Doğru! ViewModel, arayüzün (UI) tüm özel ihtiyaçlarını (girdi alanları + kategori dropdown seçenekleri + hata mesajları) tek bir çatıda toplamak için tasarlanır.'
      },
      {
        id: 'c',
        text: 'ProductResponseDto',
        isCorrect: false,
        explanation: 'Yanlış. Response DTO yalnızca servis veya API tarafından istemciye veri dönerken kullanılır. Dropdown listesi gibi UI bileşenleri DTO sorumluluğunda değildir.'
      },
      {
        id: 'd',
        text: 'Doğrudan ViewBag / ViewData',
        isCorrect: false,
        explanation: 'Yanlış. ViewBag tip güvenli (type-safe) değildir ve modern mimarilerde spagetti koda yol açar. Güçlü tipli (Strongly-typed) ViewModel tercih edilmelidir.'
      }
    ]
  },
  {
    id: 2,
    scenario: 'Geliştirici, API endpointinde `public IActionResult UpdateUser([FromBody] User user)` şeklinde doğrudan Entity sınıfını parametre olarak almıştır.',
    question: 'Bu kullanım hangi kritik güvenlik zafiyetine (vulnerability) doğrudan kapı aralar?',
    options: [
      {
        id: 'a',
        text: 'SQL Injection Zafiyeti',
        isCorrect: false,
        explanation: 'Yanlış. SQL Injection genellikle parametresiz ham SQL sorgularından kaynaklanır.'
      },
      {
        id: 'b',
        text: 'Overposting / Mass Assignment Zafiyeti',
        isCorrect: true,
        explanation: 'Harika, Doğru! Saldırgan JSON yükünün içine `"IsAdmin": true` veya `"Balance": 999999` ekleyerek sistem yetkisini ele geçirebilir. Entity yerine sadece güncellenmesi istenen alanları içeren DTO kullanılmalıdır.'
      },
      {
        id: 'c',
        text: 'Cross-Site Scripting (XSS)',
        isCorrect: false,
        explanation: 'Yanlış. XSS, zararlı scriptlerin arayüzde filtrelenmeden render edilmesidir.'
      },
      {
        id: 'd',
        text: 'Cross-Site Request Forgery (CSRF)',
        isCorrect: false,
        explanation: 'Yanlış. CSRF oturum taklit etme açığıdır; model bağlama güvenliğiyle doğrudan ilişkili değildir.'
      }
    ]
  },
  {
    id: 3,
    scenario: 'Kullanıcı tablosunda PasswordHash, PasswordSalt ve IdentityNumber gibi hassas kolonlar yer almaktadır.',
    question: 'Kullanıcı listesini mobil uygulamaya gönderirken bu hassas alanların dışarı sızmasını önlemek için ne yapılmalıdır?',
    options: [
      {
        id: 'a',
        text: 'Entity’deki alanlar null yapılıp doğrudan Entity listesi dönülmelidir.',
        isCorrect: false,
        explanation: 'Yanlış. Entity nesnesini değiştirmek yanlışlıkla veritabanına SaveChanges yapıldığında verinin silinmesine yol açabilir ve mimari ilkelere aykırıdır.'
      },
      {
        id: 'b',
        text: 'Yalnızca Id, Email ve FullName içeren bir UserSummaryDto tanımlanıp dönülmelidir.',
        isCorrect: true,
        explanation: 'Kesinlikle Doğru! DTO (Data Transfer Object) hassas verileri filtreleyerek yalnızca istemcinin ihtiyaç duyduğu alanları taşıyan bir güvenlik bariyeridir.'
      },
      {
        id: 'c',
        text: 'Veritabanındaki PasswordHash kolonu şifresiz hale getirilmelidir.',
        isCorrect: false,
        explanation: 'Kesinlikle Yanlış! Şifreler her zaman tek yönlü güvenli hash (BCrypt/Argon2) ile saklanmalıdır.'
      },
      {
        id: 'd',
        text: 'Frontend uygulamasında bu alanlar JavaScript ile ekrandan gizlenmelidir.',
        isCorrect: false,
        explanation: 'Yanlış. Veri bir kez ağ üzerinden JSON olarak gittiyse, tarayıcıda veya ağ trafiğinde (Network tab) herkes tarafından kolayca okunabilir.'
      }
    ]
  },
  {
    id: 4,
    scenario: 'Bir web uygulamasında kayıt formunda "Şifre" ve "Şifre Tekrarı (ConfirmPassword)" alanları yer almaktadır.',
    question: '`ConfirmPassword` özelliği hangi model sınıfının içerisinde yer almalıdır?',
    options: [
      {
        id: 'a',
        text: 'User Entity sınıfı içinde',
        isCorrect: false,
        explanation: 'Yanlış. Veritabanında şifre tekrarı diye bir kolon tutulmaz; veritabanı şemasına eklenmemelidir.'
      },
      {
        id: 'b',
        text: 'UserRegisterViewModel içinde',
        isCorrect: true,
        explanation: 'Doğru! Şifre tekrarı yalnızca kullanıcının formda hata yapmasını engellemek için kullanılan arayüz (UI) odaklı bir kontroldür. `[Compare("Password")]` niteliğiyle ViewModel’de yer alır.'
      },
      {
        id: 'c',
        text: 'UserResponseDto içinde',
        isCorrect: false,
        explanation: 'Yanlış. Response DTO istemciye yanıt dönerken kullanılır, kayıt formunun giriş alanı değildir.'
      },
      {
        id: 'd',
        text: 'DbContext sınıfı içinde',
        isCorrect: false,
        explanation: 'Yanlış. DbContext veritabanı oturumunu yöneten sınıftır, model sınıfı değildir.'
      }
    ]
  },
  {
    id: 5,
    scenario: 'Büyük ölçekli bir projede DTO nesneleri ile Entity nesneleri arasında onlarca alanın birbirine aktarılması gerekmektedir.',
    question: 'Endüstride bu dönüşümü otomatik, hatasız ve temiz yapmak için yaygın olarak hangi araçlar/kütüphaneler kullanılır?',
    options: [
      {
        id: 'a',
        text: 'AutoMapper, Mapster (.NET) veya MapStruct (Java)',
        isCorrect: true,
        explanation: 'Tebrikler, Doğru! Bu eşleme (mapping) kütüphaneleri, aynı isimli alanları otomatik eşleyerek manuel kod kalabalığını ortadan kaldırır ve performansı artırır.'
      },
      {
        id: 'b',
        text: 'Entity Framework Core DbContext',
        isCorrect: false,
        explanation: 'Yanlış. EF Core bir ORM kütüphanesidir, DTO-Entity eşlemesi için değil veritabanı erişimi içindir.'
      },
      {
        id: 'c',
        text: 'JSON.NET (Newtonsoft)',
        isCorrect: false,
        explanation: 'Yanlış. JSON.NET serileştirme (string <-> object) aracıdır, nesneden nesneye dönüşüm aracı değildir.'
      },
      {
        id: 'd',
        text: 'PostgreSQL pg_dump',
        isCorrect: false,
        explanation: 'Yanlış. Bu bir veritabanı yedekleme komutudur.'
      }
    ]
  },
  {
    id: 6,
    scenario: 'Ödev Sorusu: "Arayüzde (UI) tasarım baştan aşağı değişti ve Bootstrap yerine Tailwind CSS ile yeni bir dashboard hazırlandı."',
    question: 'İyi tasarlanmış Clean Architecture prensiplerine göre bu değişiklik veritabanındaki Entity sınıflarını nasıl etkilemelidir?',
    options: [
      {
        id: 'a',
        text: 'Tüm Entity sınıfları yeniden yazılmalı ve veritabanı tabloları güncellenmelidir.',
        isCorrect: false,
        explanation: 'Yanlış. Eğer UI değişikliği Entity’leri etkiliyorsa mimari katmanlar birbirine sıkı sıkıya bağlı (tightly coupled) ve hatalı tasarlanmış demektir.'
      },
      {
        id: 'b',
        text: 'Entity sınıfları ve veritabanı şeması HİÇBİR ŞEKİLDE etkilenmemelidir.',
        isCorrect: true,
        explanation: 'Mükemmel! Doğru cevap. Katmanlı mimarinin temel amacı bağımsızlığı sağlamaktır. UI sadece ViewModel ve DTO ile konuşur; Domain ve Entity katmanı arayüzden tamamen yalıtılmıştır.'
      },
      {
        id: 'c',
        text: 'Entity sınıflarına yeni CSS sınıfları eklenmelidir.',
        isCorrect: false,
        explanation: 'Yanlış. Entity katmanında CSS veya tasarım kodları asla barındırılmaz.'
      },
      {
        id: 'd',
        text: 'Yalnızca Primary Key kolonları güncellenmelidir.',
        isCorrect: false,
        explanation: 'Yanlış. Primary Key kimlik temsilidir, UI ile hiçbir ilgisi yoktur.'
      }
    ]
  }
];

export const HOMEWORK_SUMMARY_DOCUMENT = {
  title: 'Yazılım Mimarisi ve Model Yönetimi Ödevi',
  author: 'Enes Öztürk',
  submissionDate: '2026-11-05',
  course: 'Yazılım Tasarımı, Mimarisi ve Kurumsal Desenler',
  gradeTarget: '100 / 100 Tam Puan Çözüm Şablonu',
  executiveSummary: 'Bu ödev çalışmasında kurumsal yazılım geliştirmede hayati öneme sahip olan üç model türü (Entity, ViewModel ve DTO) kapsamlı olarak analiz edilmiş, mimari katmanlardaki rolleri tanımlanmış, aralarındaki dönüşüm (mapping) süreçleri interaktif simülasyonla test edilmiş ve doğrudan Entity kullanımının yol açtığı Mass Assignment / Overposting güvenlik zafiyeti somut örneklerle kanıtlanmıştır.'
};
