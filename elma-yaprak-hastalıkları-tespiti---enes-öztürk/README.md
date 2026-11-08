# Elma Yaprak Hastalıkları Tespiti - Enes Öztürk

![Elma Yaprak Hastalıkları Tespiti - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Makine öğrenmesi · bilgisayarlı görü** — tasarım ve geliştirme: **Enes Öztürk**

---

Kaggle Plant Pathology 2020 (FGVC7) verisiyle elma yaprağı hastalıklarını sınıflandıran modelleri karşılaştıran teşhis ve benchmark platformu.

## Öne çıkanlar

- Sınıflar: sağlıklı, scab, rust ve blotch.
- Model karşılaştırma tablosu (doğruluk, F1, kayıp).
- Karışıklık matrisi ve örnek tahmin kartları.
- Veri seti künyesi ve değerlendirme protokolü.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "elma-yaprak-hastalıkları-tespiti---enes-öztürk"
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
elma-yaprak-hastalıkları-tespiti---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── data/
    └── types/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
