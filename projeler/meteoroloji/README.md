# 🌦️ Meteoroloji — Türkiye 7 Günlük Hava Durumu

Türkiye'nin **81 ili** için anlık, saatlik ve 7 günlük hava durumu tahmini sunan React uygulaması.

**Geliştirici:** Enes Öztürk

---

## ✨ Özellikler

- **81 il desteği** — il adı, plaka kodu veya bölgeye göre arama
- **Anlık hava durumu** — sıcaklık, hissedilen sıcaklık, nem, rüzgar, basınç, gündüz/gece değerleri
- **7 günlük tahmin** — günlük min/maks sıcaklık, yağış olasılığı, UV indeksi, rüzgar, gün doğumu/batımı
- **Saatlik tahmin** — seçilen gün için 24 saatlik görünüm
- **Seçilebilir gün** — bir güne tıklayınca saatlik ve detaylı metrikler o güne göre güncellenir
- **Detaylı metrikler** — rüzgar yönü ve hızı, UV indeksi ve korunma önerisi, nem, basınç, gün doğumu/batımı
- **Meteorolojik tavsiyeler** — giyim, yağış, rüzgar ve UV’ye göre günlük öneriler
- **81 il rehberi** — bölgelere ayrılmış il listesinden tek tıkla seçim
- **Konum desteği** — tarayıcı izniyle en yakın ilin hava durumu
- **°C / °F geçişi**
- **Otomatik ve manuel yenileme**
- **Kalıcı tercihler** — son seçilen il ve sıcaklık birimi `localStorage`’da saklanır
- **Duyarlı, koyu tema arayüz**

## 🌐 Veri kaynağı

[Open-Meteo](https://open-meteo.com/) — ücretsiz, **API anahtarı gerektirmeyen** açık hava durumu API’si. Uygulama; anlık, saatlik ve günlük verileri tek istekte çeker, WMO hava durumu kodlarını Türkçe etiketlere ve ikonlara dönüştürür.

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
projeler/meteoroloji/
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── CitySelector.tsx
│   │   ├── CurrentWeatherBanner.tsx
│   │   ├── WeeklyForecastGrid.tsx
│   │   ├── HourlyForecast.tsx
│   │   ├── WeatherMetrics.tsx
│   │   ├── WeatherAdvice.tsx
│   │   ├── ProvinceDirectory.tsx
│   │   ├── WeatherIcon.tsx
│   │   └── Footer.tsx
│   ├── context/
│   │   └── WeatherContext.tsx   # API, seçili il, birim ve konum yönetimi
│   ├── data/
│   │   └── turkeyCities.ts      # 81 il: koordinat, plaka, bölge
│   ├── types/
│   │   └── weather.ts
│   ├── utils/
│   │   └── weatherUtils.ts      # WMO kodu → Türkçe durum, tarih/saat, UV
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
| Durum yönetimi | Context API + custom hook |
| Build | Vite |
| Stil | Tailwind CSS 4 |
| İkonlar / animasyon | lucide-react, Motion |
| Veri | Open-Meteo API (REST) |
| Depolama | localStorage |

## 📌 Notlar

- Gerçek zamanlı veriler için internet bağlantısı gerekir.
- Konum izni verilmezse son seçilen il (yoksa varsayılan il) gösterilir.
- Uygulama tamamen istemci tarafında çalışır; API anahtarı veya sunucu gerektirmez.

---

**Enes Öztürk** · [GitHub](https://github.com/EnesBinMalik)
