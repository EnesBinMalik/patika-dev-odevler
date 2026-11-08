# NotesApp - Enes Öztürk

![NotesApp - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · React · durum yönetimi** — tasarım ve geliştirme: **Enes Öztürk**

---

Renkli, sabitlenebilir ve filtrelenebilir notlar için hızlı bir not alma uygulaması.

## Öne çıkanlar

- Not ekleme, düzenleme ve silme.
- Renk seçimi ve sabitleme.
- Tümü / sabitlenen / renk filtreleri.
- Arama ve yerel kalıcılık.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "notesapp---enes-öztürk"
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
notesapp---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── constants/
    ├── types/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
