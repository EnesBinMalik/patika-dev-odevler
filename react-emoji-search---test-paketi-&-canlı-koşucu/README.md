# React Emoji Search - Test Paketi & Canlı Koşucu

![React Emoji Search - Test Paketi & Canlı Koşucu — kapak](docs/cover.svg)

> **Patika.dev arşivi · React · test** — tasarım ve geliştirme: **Enes Öztürk**

---

Emoji arama uygulaması ve React Testing Library ile yazılmış birim testleri; testler arayüzden canlı çalıştırılabilir.

## Öne çıkanlar

- Başlık, liste ve filtreleme testleri.
- Kopyalama davranışının testi.
- Canlı test koşucusu ve sonuç paneli.
- Test paketinin kaynak kodunun gösterimi.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "react-emoji-search---test-paketi-&-canlı-koşucu"
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
react-emoji-search---test-paketi-&-canlı-koşucu/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    ├── data/
    ├── test-runner/
    └── utils/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
