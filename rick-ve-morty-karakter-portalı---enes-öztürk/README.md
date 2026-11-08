# Rick ve Morty Karakter Portalı - Enes Öztürk

![Rick ve Morty Karakter Portalı - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · GraphQL · API istemcisi** — tasarım ve geliştirme: **Enes Öztürk**

---

Rick and Morty GraphQL API'si üzerinden karakter arama, sayfalama ve filtreleme yapan portal.

## Öne çıkanlar

- Ada göre arama.
- Sayfa sayfa gezinme.
- Durum, tür ve cinsiyet filtreleri.
- Karakter detay görünümü.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "rick-ve-morty-karakter-portalı---enes-öztürk"
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
rick-ve-morty-karakter-portalı---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── services/
    ├── types/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
