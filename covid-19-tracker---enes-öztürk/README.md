# COVID-19 Tracker - Enes Öztürk

![COVID-19 Tracker - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Veri görselleştirme** — tasarım ve geliştirme: **Enes Öztürk**

---

Enfekte, iyileşen, vefat ve aktif hasta sayılarını dünya ve ülke bazında gösteren canlı takip paneli.

## Öne çıkanlar

- Dünya özeti ve ülke seçici.
- Zaman serisi grafikleri ve günlük değişim.
- Ülke detay metrikleri.
- Veri kaynağı ve yöntem notları.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "covid-19-tracker---enes-öztürk"
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
covid-19-tracker---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── assets/
    ├── components/
    ├── services/
    └── types/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
