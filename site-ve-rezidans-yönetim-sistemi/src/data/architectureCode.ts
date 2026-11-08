export interface CodeSnippet {
  id: string;
  title: string;
  language: 'sql' | 'csharp' | 'json';
  category: 'MSSQL' | 'DotNetMVC' | 'WebApi_MongoDB';
  filename: string;
  description: string;
  code: string;
}

export const ARCHITECTURE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'sql-tables',
    title: 'MS SQL Server - Tablolar, İlişkiler ve İndeksler',
    language: 'sql',
    category: 'MSSQL',
    filename: 'SiteYonetim_CreateTables.sql',
    description: 'Daireler, Kullanıcılar, Faturalar, Ödemeler ve Mesajlar için ilişkisel veritabanı şeması (Enes Öztürk imzalı).',
    code: `-- ========================================================
-- Site ve Rezidans Yönetim Sistemi - MS SQL Server Şeması
-- Hazırlayan: Enes Öztürk
-- ========================================================

CREATE DATABASE SiteYonetimDB;
GO

USE SiteYonetimDB;
GO

-- 1. Kullanıcılar / Sakinler Tablosu
CREATE TABLE Kullanicilar (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    AdSoyad NVARCHAR(100) NOT NULL,
    TCNo CHAR(11) NOT NULL UNIQUE,
    Eposta NVARCHAR(100) NOT NULL,
    Telefon NVARCHAR(20) NOT NULL,
    PlakaNo NVARCHAR(20) NULL,
    SifreHash NVARCHAR(255) NOT NULL, -- Otomatik üretilen şifre
    Rol NVARCHAR(20) NOT NULL DEFAULT 'Kullanici', -- 'Admin' veya 'Kullanici'
    KayitTarihi DATETIME NOT NULL DEFAULT GETDATE(),
    AktifMi BIT NOT NULL DEFAULT 1
);
GO

-- 2. Daireler Tablosu
CREATE TABLE Daireler (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    Blok NVARCHAR(20) NOT NULL, -- 'A Blok', 'B Blok' vb.
    DaireNo NVARCHAR(10) NOT NULL,
    Kat NVARCHAR(20) NOT NULL,
    Tip NVARCHAR(20) NOT NULL, -- '2+1', '3+1', '4+1 Dubleks'
    Durum NVARCHAR(10) NOT NULL DEFAULT 'Boş', -- 'Dolu' veya 'Boş'
    MulkTipi NVARCHAR(20) NOT NULL DEFAULT 'Ev Sahibi', -- 'Ev Sahibi' veya 'Kiracı'
    AlanM2 DECIMAL(8,2) NOT NULL DEFAULT 100.00,
    AtananKullaniciId INT NULL,
    CONSTRAINT FK_Daireler_Kullanicilar FOREIGN KEY (AtananKullaniciId) 
        REFERENCES Kullanicilar(Id) ON DELETE SET NULL,
    CONSTRAINT UQ_Blok_Daire UNIQUE (Blok, DaireNo)
);
GO

-- 3. Aidat ve Faturalar Tablosu (Elektrik, Su, Doğalgaz, Aidat)
CREATE TABLE FaturalarVeAidatlar (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    DaireId INT NOT NULL,
    KullaniciId INT NULL,
    Tur NVARCHAR(20) NOT NULL, -- 'Aidat', 'Elektrik', 'Su', 'Doğalgaz'
    DonemAy NVARCHAR(20) NOT NULL, -- 'Kasım 2026'
    DonemKod CHAR(7) NOT NULL, -- '2026-11'
    Tutar DECIMAL(18,2) NOT NULL,
    SonOdemeTarihi DATE NOT NULL,
    Durum NVARCHAR(20) NOT NULL DEFAULT 'Ödenmedi', -- 'Ödenmedi', 'Ödendi', 'Gecikmede'
    TahakkukTarihi DATETIME NOT NULL DEFAULT GETDATE(),
    Aciklama NVARCHAR(250) NULL,
    CONSTRAINT FK_Faturalar_Daireler FOREIGN KEY (DaireId) 
        REFERENCES Daireler(Id) ON DELETE CASCADE,
    CONSTRAINT FK_Faturalar_Kullanicilar FOREIGN KEY (KullaniciId) 
        REFERENCES Kullanicilar(Id)
);
GO

-- 4. Kredi Kartı Ödemeleri Tablosu (Tahsilat Dekontları)
CREATE TABLE Odemeler (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    FaturaId INT NOT NULL,
    DaireId INT NOT NULL,
    KullaniciId INT NOT NULL,
    Tutar DECIMAL(18,2) NOT NULL,
    OdemeTarihi DATETIME NOT NULL DEFAULT GETDATE(),
    KartSahibi NVARCHAR(100) NOT NULL,
    KartSon4 CHAR(4) NOT NULL,
    MakbuzNo NVARCHAR(50) NOT NULL UNIQUE,
    BankaReferansNo NVARCHAR(50) NOT NULL,
    IslemDurumu NVARCHAR(20) NOT NULL DEFAULT 'Onaylandı',
    CONSTRAINT FK_Odemeler_Faturalar FOREIGN KEY (FaturaId) 
        REFERENCES FaturalarVeAidatlar(Id),
    CONSTRAINT FK_Odemeler_Daireler FOREIGN KEY (DaireId) 
        REFERENCES Daireler(Id),
    CONSTRAINT FK_Odemeler_Kullanicilar FOREIGN KEY (KullaniciId) 
        REFERENCES Kullanicilar(Id)
);
GO

-- 5. Sakin ve Yönetici Mesajları Tablosu
CREATE TABLE Mesajlar (
    Id INT IDENTITY(1,1) PRIMARY KEY,
    KullaniciId INT NOT NULL,
    Kategori NVARCHAR(50) NOT NULL,
    Aciliyet NVARCHAR(20) NOT NULL DEFAULT 'Normal',
    Konu NVARCHAR(150) NOT NULL,
    Icerik NVARCHAR(MAX) NOT NULL,
    Tarih DATETIME NOT NULL DEFAULT GETDATE(),
    Durum NVARCHAR(20) NOT NULL DEFAULT 'Beklemede',
    YoneticiCevabi NVARCHAR(MAX) NULL,
    CevapTarihi DATETIME NULL,
    CONSTRAINT FK_Mesajlar_Kullanicilar FOREIGN KEY (KullaniciId) 
        REFERENCES Kullanicilar(Id)
);
GO

-- Hızlı Arama ve Raporlama İndeksleri
CREATE INDEX IX_Faturalar_Daire_Durum ON FaturalarVeAidatlar(DaireId, Durum);
CREATE INDEX IX_Faturalar_DonemKod ON FaturalarVeAidatlar(DonemKod);
CREATE INDEX IX_Odemeler_FaturaId ON Odemeler(FaturaId);
GO`,
  },
  {
    id: 'sql-procedures',
    title: 'MS SQL Server - Stored Procedures & Borç-Alacak Mizanı',
    language: 'sql',
    category: 'MSSQL',
    filename: 'SiteYonetim_StoredProcedures.sql',
    description: 'Toplu aidat/fatura tahakkuku ve aylık mizan raporu stored procedureleri.',
    code: `-- ========================================================
-- Stored Procedures: Toplu Tahakkuk & Borç-Alacak Raporu
-- Hazırlayan: Enes Öztürk
-- ========================================================

-- A) Toplu Aidat ve Fatura Dağıtım Stored Procedure'ü
CREATE OR ALTER PROCEDURE sp_TopluFaturaAidatTahakkuk
    @Tur NVARCHAR(20),            -- 'Aidat', 'Elektrik', 'Su', 'Doğalgaz'
    @DonemAy NVARCHAR(20),        -- 'Kasım 2026'
    @DonemKod CHAR(7),            -- '2026-11'
    @BirimTutar DECIMAL(18,2),     -- Daire başı tutar
    @SonOdemeTarihi DATE,
    @BlokFiltresi NVARCHAR(20) = NULL, -- NULL ise tüm dolu dairelere
    @Aciklama NVARCHAR(250) = NULL
AS
BEGIN
    SET NOCOUNT ON;

    INSERT INTO FaturalarVeAidatlar 
        (DaireId, KullaniciId, Tur, DonemAy, DonemKod, Tutar, SonOdemeTarihi, Durum, TahakkukTarihi, Aciklama)
    SELECT 
        d.Id,
        d.AtananKullaniciId,
        @Tur,
        @DonemAy,
        @DonemKod,
        @BirimTutar,
        @SonOdemeTarihi,
        'Ödenmedi',
        GETDATE(),
        ISNULL(@Aciklama, @DonemAy + ' Ayı ' + @Tur + ' Bedeli')
    FROM Daireler d
    WHERE d.Durum = 'Dolu'
      AND (@BlokFiltresi IS NULL OR d.Blok = @BlokFiltresi);

    SELECT @@ROWCOUNT AS 'TahakkukEdilenDaireSayisi';
END;
GO

-- B) Aylık Borç - Alacak Mizan Raporu
CREATE OR ALTER PROCEDURE sp_BorcAlacakMizanRaporu
    @DonemKod CHAR(7) = NULL -- Örn: '2026-11'
AS
BEGIN
    SET NOCOUNT ON;

    SELECT 
        d.Blok,
        d.DaireNo,
        d.Kat,
        d.Tip,
        k.AdSoyad AS SakinAdi,
        k.Telefon,
        k.PlakaNo,
        ISNULL(SUM(f.Tutar), 0) AS ToplamTahakkuk,
        ISNULL(SUM(CASE WHEN f.Durum = 'Ödendi' THEN f.Tutar ELSE 0 END), 0) AS ToplamTahsilat,
        ISNULL(SUM(CASE WHEN f.Durum <> 'Ödendi' THEN f.Tutar ELSE 0 END), 0) AS KalanBakiyeBorc
    FROM Daireler d
    LEFT JOIN Kullanicilar k ON d.AtananKullaniciId = k.Id
    LEFT JOIN FaturalarVeAidatlar f ON d.Id = f.DaireId 
        AND (@DonemKod IS NULL OR f.DonemKod = @DonemKod)
    GROUP BY d.Blok, d.DaireNo, d.Kat, d.Tip, k.AdSoyad, k.Telefon, k.PlakaNo
    ORDER BY d.Blok, CAST(d.DaireNo AS INT);
END;
GO`,
  },
  {
    id: 'dotnet-daire-controller',
    title: '.NET 5 MVC - Daire Yönetimi Controller',
    language: 'csharp',
    category: 'DotNetMVC',
    filename: 'DaireController.cs',
    description: '.NET 5 MVC ile daire ekleme, listeleme, güncelleme ve sakin atama mantığı.',
    code: `using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteYonetim.Data;
using SiteYonetim.Models;

namespace SiteYonetim.Controllers
{
    // Enes Öztürk İmzalı Site & Rezidans Yönetimi - Daire Controller
    public class DaireController : Controller
    {
        private readonly SiteDbContext _context;

        public DaireController(SiteDbContext context)
        {
            _context = context;
        }

        // GET: /Daire/Index
        public async Task<IActionResult> Index(string blok)
        {
            var query = _context.Daireler
                .Include(d => d.AtananKullanici)
                .AsQueryable();

            if (!string.IsNullOrEmpty(blok))
            {
                query = query.Where(d => d.Blok == blok);
            }

            var daireler = await query
                .OrderBy(d => d.Blok)
                .ThenBy(d => d.DaireNo)
                .ToListAsync();

            return View(daireler);
        }

        // POST: /Daire/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Daire daire)
        {
            if (ModelState.IsValid)
            {
                _context.Add(daire);
                await _context.SaveChangesAsync();
                TempData["Success"] = "Daire başarıyla kaydedildi.";
                return RedirectToAction(nameof(Index));
            }
            return View(daire);
        }

        // POST: /Daire/KullaniciAta
        [HttpPost]
        public async Task<IActionResult> KullaniciAta(int daireId, int? kullaniciId, string mulkTipi)
        {
            var daire = await _context.Daireler.FindAsync(daireId);
            if (daire == null) return NotFound();

            daire.AtananKullaniciId = kullaniciId;
            daire.Durum = kullaniciId.HasValue ? "Dolu" : "Boş";
            daire.MulkTipi = mulkTipi ?? "Ev Sahibi";

            await _context.SaveChangesAsync();
            return Json(new { success = true, message = "Daire sakin ataması güncellendi." });
        }
    }
}`,
  },
  {
    id: 'dotnet-kullanici-controller',
    title: '.NET 5 MVC - Sakin Yönetimi & Otomatik Şifre',
    language: 'csharp',
    category: 'DotNetMVC',
    filename: 'KullaniciController.cs',
    description: 'Sakin kaydı, TC Kimlik No doğrulaması ve otomatik rastgele şifre oluşturucu servisi.',
    code: `using System;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SiteYonetim.Data;
using SiteYonetim.Models;

namespace SiteYonetim.Controllers
{
    // Enes Öztürk İmzalı Site Yönetimi - Sakin/Kullanıcı Controller
    public class KullaniciController : Controller
    {
        private readonly SiteDbContext _context;

        public KullaniciController(SiteDbContext context)
        {
            _context = context;
        }

        // POST: /Kullanici/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Kullanici model, int? daireId)
        {
            if (ModelState.IsValid)
            {
                // Sistem kullanılmaya başlandığında otomatik şifre oluşturulur
                string generatedPassword = SifreUretici.RastgeleSifreUret(model.AdSoyad);
                model.SifreHash = BCrypt.Net.BCrypt.HashPassword(generatedPassword);
                model.KayitTarihi = DateTime.Now;
                model.Rol = "Kullanici";

                _context.Kullanicilar.Add(model);
                await _context.SaveChangesAsync();

                // Daireye atama
                if (daireId.HasValue)
                {
                    var daire = await _context.Daireler.FindAsync(daireId.Value);
                    if (daire != null)
                    {
                        daire.AtananKullaniciId = model.Id;
                        daire.Durum = "Dolu";
                        await _context.SaveChangesAsync();
                    }
                }

                TempData["GeneratedPass"] = generatedPassword;
                TempData["Success"] = $"{model.AdSoyad} kullanıcısı oluşturuldu. Geçici Şifre: {generatedPassword}";
                return RedirectToAction("Index");
            }
            return View(model);
        }
    }

    public static class SifreUretici
    {
        public static string RastgeleSifreUret(string adSoyad)
        {
            var rnd = new Random();
            string prefix = adSoyad.Length >= 3 ? char.ToUpper(adSoyad[0]) + adSoyad.Substring(1, 2).ToLower() : "Skn";
            char[] specials = new[] { '#', '!', '*', '$' };
            char special = specials[rnd.Next(specials.Length)];
            int num = rnd.Next(1000, 9999);
            return $"{prefix}{special}{num}";
        }
    }
}`,
  },
  {
    id: 'webapi-payment-service',
    title: '.NET WebAPI & MongoDB - Kredi Kartı Servisi',
    language: 'csharp',
    category: 'WebApi_MongoDB',
    filename: 'PaymentApiController.cs',
    description: 'MongoDB banka koleksiyonunda kart bakiye/limit kontrolü yapan bağımsız .NET WebAPI ödeme servisi (Enes Öztürk imzalı).',
    code: `using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using MongoDB.Driver;
using SitePaymentService.Models;

namespace SitePaymentService.Controllers
{
    // ========================================================
    // .NET 5 WebAPI Kredi Kartı ve Banka Ödeme Servisi
    // MongoDB Bakiye & Limit Doğrulama
    // Hazırlayan: Enes Öztürk
    // ========================================================

    [ApiController]
    [Route("api/[controller]")]
    public class PaymentApiController : ControllerBase
    {
        private readonly IMongoCollection<BankAccount> _bankAccounts;
        private readonly IMongoCollection<PaymentTransactionLog> _transactionLogs;

        public PaymentApiController(IMongoDatabase mongoDatabase)
        {
            _bankAccounts = mongoDatabase.GetCollection<BankAccount>("BankAccounts");
            _transactionLogs = mongoDatabase.GetCollection<PaymentTransactionLog>("PaymentTransactions");
        }

        [HttpPost("process-payment")]
        public async Task<IActionResult> ProcessPayment([FromBody] PaymentRequest request)
        {
            string cleanCardNo = request.CardNumber.Replace(" ", "");

            // 1. Kart Format ve Uzunluk Doğrulaması
            if (cleanCardNo.Length < 15 || cleanCardNo.Length > 16)
            {
                return BadRequest(new { Success = false, Message = "Geçersiz kredi kartı numarası." });
            }

            // 2. MongoDB'den Banka & Kart Hesabını Sorgula
            var filter = Builders<BankAccount>.Filter.Eq(x => x.CardNumber, cleanCardNo);
            var account = await _bankAccounts.Find(filter).FirstOrDefaultAsync();

            if (account == null)
            {
                return NotFound(new { Success = false, Message = "Banka kaydı bulunamadı veya kart geçersiz." });
            }

            // 3. SKT ve CVV Doğrulaması
            if (account.Cvv != request.Cvv || account.ExpiryMonth != request.ExpiryMonth || account.ExpiryYear != request.ExpiryYear)
            {
                return BadRequest(new { Success = false, Message = "Kart güvenlik bilgileri (CVV/SKT) eşleşmedi." });
            }

            // 4. Bakiye ve Kredi Kartı Limiti Kontrolü
            if (account.Balance < request.Amount)
            {
                return StatusCode(402, new { 
                    Success = false, 
                    Code = "ERR_INSUFFICIENT_FUNDS",
                    Message = $"Yetersiz Bakiye! Kartınızda {account.Balance:C2} mevcut, gereken tutar {request.Amount:C2}"
                });
            }

            // 5. Bakiyeden Düş ve MongoDB Güncelle
            var update = Builders<BankAccount>.Update
                .Inc(x => x.Balance, -request.Amount)
                .Inc(x => x.UsedLimit, request.Amount);
            await _bankAccounts.UpdateOneAsync(filter, update);

            // 6. MongoDB İşlem Günlüğüne (Log) Kaydet
            var log = new PaymentTransactionLog
            {
                Id = Guid.NewGuid().ToString(),
                InvoiceId = request.InvoiceId,
                ApartmentId = request.ApartmentId,
                Amount = request.Amount,
                CardHolder = request.CardHolder,
                CardLast4 = cleanCardNo.Substring(cleanCardNo.Length - 4),
                TransactionDate = DateTime.UtcNow,
                Status = "Approved",
                BankReferenceNo = "TXN-" + Guid.NewGuid().ToString().Substring(0, 8).ToUpper(),
                ReceiptNo = $"MKB-{DateTime.UtcNow:yyyyMMdd}-{new Random().Next(1000, 9999)}"
            };
            await _transactionLogs.InsertOneAsync(log);

            return Ok(new
            {
                Success = true,
                Message = "Ödeme başarıyla tamamlandı.",
                ReceiptNo = log.ReceiptNo,
                BankReference = log.BankReferenceNo,
                RemainingBalance = account.Balance - request.Amount
            });
        }
    }
}`,
  },
  {
    id: 'mongodb-models',
    title: 'MongoDB - Banka Hesabı ve İşlem Koleksiyon Şeması',
    language: 'csharp',
    category: 'WebApi_MongoDB',
    filename: 'MongoModels.cs',
    description: 'MongoDB NoSQL veritabanında tutulan banka kartı ve ödeme işlem şemaları.',
    code: `using System;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SitePaymentService.Models
{
    // ========================================================
    // MongoDB BankAccounts Koleksiyon Modeli
    // Hazırlayan: Enes Öztürk
    // ========================================================

    public class BankAccount
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("cardNumber")]
        public string CardNumber { get; set; }

        [BsonElement("cardHolder")]
        public string CardHolder { get; set; }

        [BsonElement("expiryMonth")]
        public string ExpiryMonth { get; set; }

        [BsonElement("expiryYear")]
        public string ExpiryYear { get; set; }

        [BsonElement("cvv")]
        public string Cvv { get; set; }

        [BsonElement("balance")]
        public decimal Balance { get; set; }

        [BsonElement("totalLimit")]
        public decimal TotalLimit { get; set; }

        [BsonElement("usedLimit")]
        public decimal UsedLimit { get; set; }

        [BsonElement("bankName")]
        public string BankName { get; set; }
    }

    public class PaymentTransactionLog
    {
        [BsonId]
        public string Id { get; set; }
        public string InvoiceId { get; set; }
        public string ApartmentId { get; set; }
        public decimal Amount { get; set; }
        public string CardHolder { get; set; }
        public string CardLast4 { get; set; }
        public DateTime TransactionDate { get; set; }
        public string Status { get; set; }
        public string BankReferenceNo { get; set; }
        public string ReceiptNo { get; set; }
    }
}`,
  },
  {
    id: 'appsettings-json',
    title: 'appsettings.json - MS SQL & MongoDB Bağlantı Ayarları',
    language: 'json',
    category: 'MSSQL',
    filename: 'appsettings.json',
    description: 'Entity Framework Core MS SQL Server ve MongoDB bağlantı metinleri.',
    code: `{
  "ConnectionStrings": {
    "MsSqlSiteDb": "Server=localhost;Database=SiteYonetimDB;User Id=sa;Password=YourStrongPassword!;TrustServerCertificate=True;",
    "MongoDbPayment": "mongodb://localhost:27017/SiteBankDB"
  },
  "SiteConfig": {
    "Developer": "Enes Öztürk",
    "SiteAdi": "Güneştepe Rezidans ve Konutları",
    "OtomatikSifreGecerlilikGunu": 90
  },
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "AllowedHosts": "*"
}`,
  },
];
