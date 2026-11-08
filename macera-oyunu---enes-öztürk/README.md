# Macera Oyunu - Enes Öztürk

![Macera Oyunu - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Java · oyun mantığı** — tasarım ve geliştirme: **Enes Öztürk**

---

Güvenli Ev, Mağara, Orman, Nehir ve Maden bölgelerinde geçen, savaş ve ganimet sistemli Java 102 macera oyunu.

## Öne çıkanlar

- Beş bölge ve bölgeye özgü düşmanlar.
- %50 ilk vuruş şansı ve hasar hesabı.
- Dinamik ganimet ve mağaza.
- Can, para ve envanter takibi.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "macera-oyunu---enes-öztürk"
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
macera-oyunu---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── assets/
    ├── components/
    ├── data/
    ├── types/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
