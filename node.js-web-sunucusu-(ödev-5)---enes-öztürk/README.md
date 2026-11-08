# Node.js Web Sunucusu (Ödev 5) - Enes Öztürk

![Node.js Web Sunucusu (Ödev 5) - Enes Öztürk — kapak](docs/cover.svg)

> **Patika.dev arşivi · Node.js · http sunucusu** — tasarım ve geliştirme: **Enes Öztürk**

---

`http.createServer` ile 5000 portunda kalkan özel web sunucusu ödevi ve simülatörü.

## Öne çıkanlar

- `createServer` ile istek/yanıt döngüsü.
- HTML içerik ve başlık (header) yazımı.
- Port 5000 üzerinde çalıştırma.
- Kod rehberi ve konsol çıktısı.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "node.js-web-sunucusu-(ödev-5)---enes-öztürk"
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
node.js-web-sunucusu-(ödev-5)---enes-öztürk/
├── index.html
├── package.json
├── docs/cover.svg            # imza kapak
└── src/
    ├── App.tsx               # ekranların birleştiği yer
    ├── main.tsx
    ├── components/
    └── data/
```

## Lisans

Ödev ve portföy amaçlı çalışma; tüm hakları **Enes Öztürk**'e aittir.
