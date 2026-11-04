# Rust Sahiplik ve Referanslar Laboratuvarı

![Sahiplik ve ödünç alma laboratuvarının kapak çizimi](docs/cover.svg)

Rust'ta `String` sahipliği, ödünç alma (`&str`) ve fonksiyonlara referans aktarmayı etkileşimli
örneklerle öğreten React tabanlı bir eğitim uygulaması. Kod editörü, hazır örnekler, kontrol listesi,
stack/heap görselleştiricisi ve sertifika ekranı tek bir çalışma alanında sunulur.

## Öne çıkanlar

- Kod değişikliklerini analiz eden kontrol listesi ve hazır kod senaryoları.
- Sahiplik aktarımını ve bellek adımlarını açıklayan görselleştirici.
- Rust Playground'a kod göndererek gerçek derleme/çalıştırma; servis erişilemezse tarayıcı içi
  sınırlı analiz ve simülasyon.
- Terminal çıktısı ve tamamlanma sertifikası.

> **Çalıştırma notu:** Uygulama, kodu çalıştır düğmesine basıldığında girilen Rust kodunu
> `play.rust-lang.org` servisine gönderebilir. Servis kullanılamadığında yerel çözüm gerçek `rustc`
> değildir; bu eğitim konusuna özel bir analiz/simülasyon geri dönüşüdür. Gizli veya özel kod
> göndermeyin.

## Başlangıç

Gereksinimler: Node.js ve npm.

```bash
npm install
npm run dev
```

Vite geliştirme sunucusu `http://localhost:3000` adresinde açılır.

| Komut | Açıklama |
| --- | --- |
| `npm run build` | Üretim derlemesini `dist/` klasörüne alır. |
| `npm run lint` | TypeScript tip kontrolünü (`tsc --noEmit`) çalıştırır. |

## Teknoloji ve yapı

React 19 · TypeScript · Vite · Tailwind CSS v4 · `lucide-react`

```text
src/
├── components/       # Editör, rehber, terminal, bellek görselleştiricisi ve sertifika
├── types/rust.ts     # Analiz ve derleme sonucu tipleri
└── utils/            # Rust kod analizi ve Playground/simülatör çalıştırıcısı
docs/cover.svg        # Projeye özel kapak çizimi
```

## Kapsam

Bu klasör, Patika.dev ödev arşivindeki etkileşimli eğitim uygulamasıdır; tek başına bir Rust crate'i
değildir. Rust örneklerini yerel olarak derlemek için `rustc`/Cargo kurup editördeki kodu ayrı bir
Rust projesine aktarmanız gerekir. Depodaki diğer ödevler ve arşivin çalışma notları için
[ana README'ye](../README.md) bakın.
