# Türkiye Hava Durumu · Enes Öztürk

![Türkiye Hava Durumu · Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · API entegrasyonu** — tasarım ve geliştirme: **Enes Öztürk**

---

81 il için 7 günlük hava durumu tahmini sunan, el emeği tasarımlı meteoroloji uygulaması.

## Öne çıkanlar

- İl seçimi ve anlık durum.
- 7 günlük tahmin kartları.
- Sıcaklık grafiği ve yağış olasılığı.
- Mobil öncelikli yerleşim.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "türkiye-hava-durumu-·-enes-öztürk"
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
türkiye-hava-durumu-·-enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── data/
    ├── services/
    └── types/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
