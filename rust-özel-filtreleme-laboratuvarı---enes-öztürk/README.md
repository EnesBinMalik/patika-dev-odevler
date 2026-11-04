# Rust Özel Filtreleme Laboratuvarı

![Rust özel filtreleme laboratuvarının kapak çizimi](docs/cover.svg)

Rust'ta closure kullanmadan `FilterCondition` yapısı, `is_match` metodu ve `custom_filter` fonksiyonu
ile koleksiyon filtrelemeyi öğreten etkileşimli bir React/TypeScript uygulaması.

## Öne çıkanlar

- Başlangıç, sayı ve metin örnekleri için hazır kod senaryoları.
- Kod editörü, sonuç terminali ve öğe öğe ilerleyen filtre görselleştiricisi.
- Ödev kontrol listesi ve konu anlatımı.
- Rust Playground erişilemediğinde kısıtlı istemci tarafı simülatörüne geri dönüş.

> **Kod gizliliği:** Çalıştırma sırasında kod `play.rust-lang.org` servisine gönderilebilir.
> Servise erişilemezse uygulama gerçek `rustc` kullanmaz; örnek yapıları analiz ederek temsili çıktı
> üretir. Gizli veya özel kod göndermeyin.

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
├── components/       # Editör, görselleştirici, kontrol listesi, rehber ve terminal
├── data/rustSamples.ts
├── services/         # Rust Playground istemcisi ve yerel eğitim simülatörü
└── types/            # Filtre adımları ve çalışma sonucu tipleri
```

Bu klasör bir Cargo projesi değildir; uygulamanın tarayıcı arayüzü eğitim amaçlıdır. Depo haritası
ve diğer ödevler için [ana README'ye](../README.md) bakın.
