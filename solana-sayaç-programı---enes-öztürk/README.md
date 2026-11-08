# Solana Sayaç Programı - Enes Öztürk

![Solana Sayaç Programı - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Solana · Rust programı** — tasarım ve geliştirme: **Enes Öztürk**

---

u32 parametreli `Increment` ve `Decrement` talimatlarıyla sayaç tutan Solana programı ve simülatörü.

## Öne çıkanlar

- Increment / Decrement talimatları.
- u32 taşma (underflow) koruması.
- Sözleşme çağrılarının simülasyonu.
- Rust kaynak kodunun gösterimi.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "solana-sayaç-programı---enes-öztürk"
npm install
npm run dev
```

| Komut | Not |
| --- | --- |
| `npm install` | bağımlılıklar |
| `npm run dev` | http://localhost:3000 |
| `npm run build` | üretim derlemesi |

## Proje yapısı

```
solana-sayaç-programı---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    └── data/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
