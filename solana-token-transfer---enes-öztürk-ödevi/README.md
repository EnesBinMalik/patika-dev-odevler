# Solana Token Transfer — İnteraktif Ödev Laboratuvarı

![Solana token transfer laboratuvarının kapak çizimi](docs/cover.svg)

Token transferi ödevindeki sabit miktar, kullanıcı girdisi ve yetersiz bakiye senaryolarını
rehber, kod görüntüleyici ve tarayıcı simülatörüyle anlatan bir React/TypeScript eğitim arayüzü.

## Öne çıkanlar

- Ödev adımları ve farklı çözüm modları arasında geçiş.
- Rust/Anchor kodu görüntüleyici ve token hesapları transfer simülatörü.
- Eski/hatalı akış ile güncel örneği karşılaştıran terminal temalı test ekranı.
- Teslim kontrolü için ödev rehberi ve modal.

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
├── components/       # Rehber, Rust kodu, Cargo terminali ve transfer simülatörü
├── data/             # Ödev yönergeleri ve örnek içerik
└── types.ts          # Çözüm modu ve arayüz tipleri
```

## Önemli kapsam notu

Bu klasörde `program/`, `Cargo.toml` veya Anchor programı yoktur. Transfer simülatörü ve Cargo test
terminali yalnızca tarayıcıda örnek akışı canlandırır; gerçek cüzdan bağlantısı, Solana işlemi ya da
`cargo test` çalıştırmaz. Gerçek ağda işlem yapmak için kullanılmamalıdır. Depo hakkında daha fazla
bilgi için [ana README'ye](../README.md) bakın.
