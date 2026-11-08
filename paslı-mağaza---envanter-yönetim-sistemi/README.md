# Paslı Mağaza - Envanter Yönetim Sistemi

![Paslı Mağaza - Envanter Yönetim Sistemi — kapak](docs/cover.svg)

> **Patika.dev arşivi · Rust · envanter yönetimi** — tasarım ve geliştirme: **Enes Öztürk**

---

Rust mantığıyla kurgulanmış perakende envanteri: satış, satın alma, kâr analizi ve raporlama.

## Öne çıkanlar

- Ürün ve stok kartları.
- Satış ve satın alma kayıtları.
- Kâr/maliyet analizi ve rapor görünümü.
- Rust kaynak kodunun gösterimi.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "paslı-mağaza---envanter-yönetim-sistemi"
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
paslı-mağaza---envanter-yönetim-sistemi/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── context/
    ├── data/
    └── types/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
