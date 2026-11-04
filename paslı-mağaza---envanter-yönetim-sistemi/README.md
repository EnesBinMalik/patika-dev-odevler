# Paslı Mağaza — Envanter ve Satış Yönetimi

![Paslı Mağaza yönetim paneli için kapak çizimi](docs/cover.svg)

Küçük bir mağazanın ürün, stok, satış ve satın alma akışlarını tarayıcıda deneyimleten etkileşimli
bir React uygulaması. Raporlama, rol bazlı senaryolar ve Rust örnek kodlarıyla envanter yönetimi
kavramlarını öğretir.

## Özellikler

- Ürün ve stok listesini görüntüleme, ekleme, güncelleme ve silme.
- Satış, satın alma, stok uyarıları ve finansal özet/raporlar.
- Yönetici, mağaza müdürü ve kasiyer rolleriyle izin senaryoları.
- JSON dışa/içe aktarma ve tarayıcı `localStorage` alanında kalıcı demo verisi.
- Rust kaynak kodu görüntüleyici ve komut satırı temalı eğitim paneli.

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
├── context/StoreContext.tsx   # Envanter, satış, satın alma ve demo rol durumu
├── data/                      # Başlangıç verileri ve ekranda gösterilen Rust örnekleri
├── components/                # Envanter, satış, satın alma, rapor ve eğitim ekranları
└── types/store.ts             # Ürün, işlem, kullanıcı ve hata tipleri
```

## Demo kapsamı

Bu klasörde gerçek bir Rust crate'i (`Cargo.toml`) veya sunucu tarafı kimlik doğrulama yoktur.
Finansal işlemler ve rol kontrolleri istemci tarafında eğitim amacıyla canlandırılır; gerçek stok,
ödeme ya da erişim kontrolü için kullanılmamalıdır. Veriler yalnızca bu tarayıcı profilindeki
`localStorage` alanında tutulur. Arşivin tamamı için [ana README'ye](../README.md) bakın.
