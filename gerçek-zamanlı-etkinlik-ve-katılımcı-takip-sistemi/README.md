# Gerçek Zamanlı Etkinlik ve Katılımcı Takip Sistemi

![Gerçek Zamanlı Etkinlik ve Katılımcı Takip Sistemi — kapak](docs/cover.svg)

> **Patika.dev arşivi · React · Context API** — tasarım ve geliştirme: **Enes Öztürk**

---

Etkinlikleri listelerken katılımcı sayısını anlık güncelleyen takip sistemi.

## Öne çıkanlar

- Etkinlik listesi ve durum göstergeleri.
- Anlık katılımcı sayacı.
- Context ile merkezî durum yönetimi.
- Katılım ve iptal akışı.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi"
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
gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    └── context/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
