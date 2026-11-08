# Döngülerle Üçgen Çizme - Enes Öztürk

![Döngülerle Üçgen Çizme - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Algoritma · döngüler** — tasarım ve geliştirme: **Enes Öztürk**

---

`for` ve `while` döngüleriyle parametrik üçgen çizen fonksiyonu, çıktıyı satır satır üreten interaktif konsol simülatörüyle birlikte sunan ödev uygulaması.

## Öne çıkanlar

- Satır sayısı parametreli üçgen çizimi.
- Her satır için döngü adımlarının gösterimi.
- Konsol çıktısı ve üretilen JavaScript kodu.
- Kenar boşluklu / yıldızlı desen seçenekleri.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "döngülerle-üçgen-çizme---enes-öztürk"
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
döngülerle-üçgen-çizme---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
