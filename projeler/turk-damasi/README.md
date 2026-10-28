# ♟️ Türk Daması — Enes Öztürk Özel Tasarım

Ceviz ve şimşir ağacı dokusundan ilham alan arayüzüyle, aynı cihazda **iki kişilik** oynanan Türk Daması.

**Tasarım & Geliştirme:** Enes Öztürk

---

## ✨ Özellikler

- **Tam Türk Daması kuralları** — çapraz hareket, zorunlu taş yeme ve çoklu yeme zincirleri
- **Dama olma ve uçan dama** — son sıraya ulaşan taş dama olur; 4 yönde sınırsız kare kayabilir
- **Yoz taş kuralları** — geriye hareket yok; dama olan taşın turu biter
- **Hamle yardımı** — seçili taşın geçerli hamleleri ve zorunlu taş yeme durumundaki taşlar vurgulanır
- **Hamle geçmişi** — `a1-b2` / `a1xc3xe5` notasyonuyla, sıra numarası ve zaman bilgisiyle
- **Geri alma (undo)** — snapshot tabanlı, hamle hamle geri dönüş
- **Skor takibi** — beyaz, siyah ve beraberlik sayacı
- **Pes etme ve karşılıklı beraberlik** ilan etme
- **Tahta yönünü çevirme** ve koordinatları gösterme/gizleme
- **Ahşap ses efektleri** — Web Audio API ile sentezlenen taş seçme, hamle, yeme, dama ve zafer sesleri (aç/kapat)
- **Kurallar ve oyun sonu modalleri**
- **Tamamen duyarlı**, ceviz/şimşir temalı özel tasarım

## 📜 Kurallar (özet)

- Oyun 8×8 tahtada, her oyuncunun 16 taşıyla başlar.
- Yoz taşlar yalnızca **çapraz ve ileri** hareket eder; geriye gidemez.
- **Taş yemek zorunludur.** Birden fazla seçenek varsa en çok taş yiyen zincir oynanır.
- Rakibin son sırasına ulaşan taş **Dama** olur ve o tur hamlesi biter.
- Dama, satrançtaki kale gibi dört ana yönde sınırsız boş kare boyunca kayabilir ve uzaktaki taşları yiyebilir.
- Rakibin hamlesi kalmadığında oyun biter; karşılıklı anlaşmayla beraberlik ilan edilebilir.

## 🚀 Çalıştırma

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini aç.

Üretim derlemesi:

```bash
npm run build
npm run preview
```

## 🗂️ Proje yapısı

```
projeler/turk-damasi/
├── src/
│   ├── engine/
│   │   └── damaLogic.ts        # Kurallar: hamle üretimi, yeme zincirleri, dama olma
│   ├── store/
│   │   ├── damaSlice.ts        # Redux Toolkit slice: oyun durumu, undo, skor
│   │   └── index.ts            # Store ve tipli hook'lar
│   ├── components/
│   │   ├── Board.tsx           # Tahta ve hamle vurguları
│   │   ├── PieceView.tsx       # Taş görselleri (yoz / dama, zorunlu yeme)
│   │   ├── PlayerPanel.tsx     # Oyuncu bilgileri, taş/dama sayısı, pes etme
│   │   ├── MoveHistory.tsx     # Hamle geçmişi ve geri alma
│   │   ├── Header.tsx          # Üst bar: yeni oyun, ses, yardım
│   │   ├── RulesModal.tsx      # Oyun kuralları
│   │   └── GameOverModal.tsx   # Oyun sonu ve skor
│   ├── audio/
│   │   └── soundEffects.ts     # Web Audio ile sentezlenen ahşap sesler
│   ├── types/
│   │   └── dama.ts             # Tip tanımları
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
└── vite.config.ts
```

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|---|---|
| UI | React 19, TypeScript |
| Durum yönetimi | Redux Toolkit + React-Redux |
| Build | Vite |
| Stil | Tailwind CSS 4 |
| İkonlar / animasyon | lucide-react, Motion |
| Ses | Web Audio API (harici dosya yok) |

## 📌 Notlar

- İki oyuncu **aynı cihazda** oynar; yapay zekâ veya çevrimiçi mod yoktur.
- Tüm oyun mantığı istemci tarafında çalışır; sunucu veya API anahtarı gerekmez.

---

<div align="center">

**Enes Öztürk** · [GitHub](https://github.com/EnesBinMalik)

</div>
