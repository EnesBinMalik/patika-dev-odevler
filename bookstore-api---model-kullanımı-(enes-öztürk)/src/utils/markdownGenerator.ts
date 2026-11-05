import { CSHARP_CODE_FILES } from '../data/csharpCode';

export const generateCompleteAssignmentMarkdown = (): string => {
  return `# ÖDEV TESLİMİ: Model Kullanımı (UpdateBook & GetById)
**Hazırlayan / İmza:** Enes Öztürk  
**Tarih:** Kasım 2026  
**Konu:** .NET Core Web API - Model / DTO ve ViewModel Mimarisi  
**Temel Şart:** *"Proje içerisinden Input/Output olarak entity kullanan bir yapının bulunmuyor olması gerekiyor."*

---

## 1. Giriş ve Mimari Yaklaşım

Bu ödevde, BookStore Web API projesi içerisinde yer alan **UpdateBook** ve **GetById** metotları için özel Input ve Output modelleri geliştirilmiştir.

Katmanlı mimaride ve RESTful servis tasarımında, veritabanı varlıkları olan **Entity** sınıfları doğrudan Controller seviyesine ve istemciye (dış dünyaya) maruz bırakılmamalıdır. Bunun yerine:
- **Input Model (DTO / Command):** İstemciden sadece güncellenmesine veya sorgulanmasına izin verilen alanları taşır.
- **Output Model (ViewModel):** İstemcinin ihtiyaç duyduğu biçimlendirilmiş, zenginleştirilmiş ve hassas alanlardan arındırılmış verileri sunar.

---

## 2. Model Yapıları ve Sözleşmeler

### A. UpdateBook Metodu

1. **Input Model (UpdateBookModel):**
   - \`Title\` (string): Kitabın güncellenecek yeni başlığı.
   - \`GenreId\` (int): Kategori referansı.
   - \`PageCount\` (int): Sayfa sayısı.
   - \`PublishDate\` (DateTime): Yayınlanma tarihi.
   - *Not:* Kitap ID'si rota parametresinden (\`Route\`) alınır. \`Id\`, \`CreatedDate\`, \`IsDeleted\` gibi alanlar istemciden alınmaz.

2. **Output Model (UpdateBookViewModel):**
   - \`Id\` (int): Güncellenen kitabın kimliği.
   - \`Title\` (string): Yeni kitap başlığı.
   - \`Genre\` (string): Sayısal GenreId yerine metinsel kategori adı (Örn: "Bilim Kurgu").
   - \`PageCount\` (int): Sayfa sayısı.
   - \`PublishDate\` (string): "dd/MM/yyyy" formatında tarih.
   - \`UpdatedAt\` (string): Güncellenme zaman damgası.
   - \`Message\` (string): "Kitap bilgileri başarıyla güncellendi."

---

### B. GetById Metodu

1. **Input Model (GetBookDetailQuery):**
   - \`BookId\` (int): Sorgulanan kitabın ID'si. FluentValidation ile \`BookId > 0\` doğrulaması yapılır.

2. **Output Model (BookDetailViewModel):**
   - \`Id\` (int): Kitap ID'si.
   - \`Title\` (string): Kitap başlığı.
   - \`Genre\` (string): Sayısal GenreId yerine string enum / tablo karşılığı.
   - \`PageCount\` (int): Sayfa sayısı.
   - \`PublishDate\` (string): "dd/MM/yyyy" formatlanmış metin.
   - *Gizlenen Entity Kolonları:* \`CreatedDate\`, \`ModifiedDate\`, \`IsDeleted\`, \`RowVersion\`, \`InternalBarcode\` dışarıya sızdırılmaz.

---

## 3. Neden Entity Input/Output Olarak Kullanılmamalıdır?

1. **Over-Posting (Mass Assignment) Güvenlik Açığı:** İstemci doğrudan Entity gönderdiğinde, yetkisiz kolonları (\`Id\`, \`IsDeleted\`, \`CreatedDate\`) ezebilir.
2. **Hassas Veri Sızıntısı (Data Exposure):** Tablodaki dahili barkodlar, versiyon numaraları ve silinme bayrakları istemciye sızdırılmamalıdır.
3. **Circular Reference Çökmesi:** Entity Framework Navigation Property'leri (\`Book.Genre.Books...\`) JSON serileştiricide sonsuz döngü ve HTTP 500 hatası üretir.
4. **Bağımsızlık (Decoupling):** Veritabanı şemasındaki değişiklikler API sözleşmesini kırmaz.
5. **Sunum İhtiyaçları:** İstemci ham sayısal ID'ler yerine okunabilir isimler ve biçimlendirilmiş tarihler talep eder.

---

## 4. C# Kaynak Kodları

${CSHARP_CODE_FILES.map(
  (file) => `### ${file.name} (\`${file.path}\`)
*${file.description}*

\`\`\`csharp
${file.code.trim()}
\`\`\`
`
).join('\n---\n\n')}

---

## 5. Sonuç

Yukarıdaki tasarım ile BookStore projesinde Entity katmanı tamamen izole edilmiş, UpdateBook ve GetById metotları için %100 güvenli, doğrulanabilir ve sürdürülebilir Model/ViewModel mimarisi kurulmuştur.

**İmza:** Enes Öztürk  
`;
};
