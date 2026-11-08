# Rust Enum & Desen Eşleştirme Hesap Makinesi

![Rust Enum & Desen Eşleştirme Hesap Makinesi — kapak](docs/cover.svg)

> **Patika.dev arşivi · Rust · enum & match** — tasarım ve geliştirme: **Enes Öztürk**

---

`enum` ve desen eşleştirme (`match`) ile çalışan interaktif hesap makinesi.

## Öne çıkanlar

- `enum Islem` ile dört işlem.
- `match` bloklarıyla dallanma.
- Sıfıra bölme gibi hata durumları.
- Adım adım kod gösterimi.

## Teknoloji

React · TypeScript · Vite. Her klasör kendi `package.json`'ına sahip bağımsız bir projedir; kök dizinde kurulum yapılmaz.

## Kurulum ve çalıştırma

```bash
cd "rust-enum-&-desen-eşleştirme-hesap-makinesi"
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
rust-enum-&-desen-eşleştirme-hesap-makinesi/
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
