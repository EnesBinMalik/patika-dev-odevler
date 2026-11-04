# Rust Bankacılık Sistemi — Traits ve Structs

![Rust bankacılık simülatörünün kapak çizimi](docs/cover.svg)

Rust'ta trait, struct, metot uygulama ve `Result` tabanlı işlem akışını canlandıran etkileşimli
bankacılık eğitim uygulaması. Örnek hesaplarda para yatırma/çekme, yeni hesap oluşturma, işlem
geçmişi ve bellek/kod görünümleri sunar.

## Öne çıkanlar

- `BankAccount` örnekleri ve bakiye değişimlerini deneyebileceğiniz simülatör.
- Geçersiz tutar ve yetersiz bakiye senaryolarının `Ok`/`Err` akışları.
- Rust kodu görüntüleyici, trait/bellek anlatımı ve ödev kontrol listesi.
- Örnek işlem kayıtları ve başlangıç durumuna sıfırlama.

## Başlangıç

Gereksinimler: Node.js ve npm.

```bash
npm install
npm run dev
```

Uygulama `http://localhost:3000` adresinde açılır.

| Komut | Açıklama |
| --- | --- |
| `npm run build` | Üretim derlemesini `dist/` klasörüne alır. |
| `npm run lint` | TypeScript tip kontrolünü (`tsc --noEmit`) çalıştırır. |

## Teknoloji ve yapı

React 19 · TypeScript · Vite · Tailwind CSS v4 · `lucide-react`

```text
src/
├── components/       # Banka simülatörü, kod alanı, bellek görselleştiricisi ve checklist
├── data/rustCode.ts  # Arayüzde gösterilen Rust örnek kodu
└── types.ts          # Hesap, işlem ve çalışma günlüğü tipleri
```

## Demo kapsamı

Bu klasörde gerçek bir Cargo/Rust uygulaması yoktur. Bakiye işlemleri ve terminalde görülen Cargo
çıktıları TypeScript arayüzünde simüle edilir; gerçek banka hesabı veya finansal işlem oluşturmaz.
Ödev arşivinin tamamı için [ana README'ye](../README.md) bakın.
