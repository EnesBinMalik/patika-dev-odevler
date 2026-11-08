# PatikaStore - Ürün Yönetim Sistemi

![PatikaStore - Ürün Yönetim Sistemi — kapak](docs/cover.svg)

> **Patika.dev arşivi · CRUD · mağaza yönetimi** — tasarım ve geliştirme: **Enes Öztürk**

---

Elektronik mağazası için ürün, marka ve kategori yönetim sistemi.

## Öne çıkanlar

- Ürün ekleme, düzenleme ve silme.
- Marka ve kategori yönetimi.
- Fiyat ve stok tablosu.
- Arama ve filtreleme.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "patikastore---ürün-yönetim-sistemi"
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
patikastore---ürün-yönetim-sistemi/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── data/
    ├── types/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
