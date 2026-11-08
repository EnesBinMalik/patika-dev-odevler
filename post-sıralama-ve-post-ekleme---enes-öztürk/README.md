# Post Sıralama ve Post Ekleme - Enes Öztürk

![Post Sıralama ve Post Ekleme - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · JavaScript · asenkron akış** — tasarım ve geliştirme: **Enes Öztürk**

---

Blog gönderilerini asenkron olarak sıralayan, yenisini ekleyen ve güncel listeyi yazdıran ödev.

## Öne çıkanlar

- Promise zinciriyle sıralı işlem.
- Gönderi ekleme ve listeleme.
- Konsol çıktısının gösterimi.
- Hata ve gecikme simülasyonu.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "post-sıralama-ve-post-ekleme---enes-öztürk"
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
post-sıralama-ve-post-ekleme---enes-öztürk/
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
