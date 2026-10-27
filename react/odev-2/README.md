# Patika.dev — React Ödev 2

Tam işlevsel, iki farklı görünüm modu sunan Todo (yapılacaklar) uygulaması.

**Geliştirici:** Enes Öztürk
**Eğitim:** Patika.dev React Bootcamp

---

## ✨ Özellikler

- **İki görünüm modu:** TodoMVC uyumlu *Klasik* ve modern arayüz — tek tıkla geçiş
- **Görev yönetimi:** ekleme, çift tıklayarak düzenleme, tamamlama ve silme
- **Filtreler:** Tümü / Aktif / Tamamlanan + URL hash desteği (`#/`, `#/active`, `#/completed`)
- **Arama ve kategori filtresi**
- **Öncelik seviyesi:** düşük, orta, yüksek
- **Toplu işlemler:** tümünü tamamla, tamamlananları temizle, tümünü sil
- **Silmeyi geri alma** (undo)
- **JSON dışa/içe aktarma:** görev listesini yedekle veya başka cihaza taşı
- **Kalıcı veri:** `localStorage` ile sayfa yenilense de görevler korunur
- **Konfeti kutlaması:** tüm görevler tamamlandığında
- **Ses efektleri:** Web Audio API ile üretilen, bağımlılık gerektirmeyen geri bildirim (aç/kapat)
- **Klavye kısayolları** ve yardım modalı
- **Duyarlı tasarım** (mobil/masaüstü)

## ⌨️ Klavye kısayolları

| Kısayol | İşlev |
|---|---|
| `Enter` | Yeni görev ekle / düzenlemeyi kaydet |
| `Esc` | Düzenlemeyi iptal et / modalı kapat |
| Çift tıklama | Görevi düzenlemeye başla |
| `#/`, `#/active`, `#/completed` | Filtreleri URL üzerinden değiştir |

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
react/odev-2/
├── src/
│   ├── components/
│   │   ├── classic/        # Klasik (TodoMVC) görünümü
│   │   ├── modern/         # Modern görünüm
│   │   ├── TopNav.tsx
│   │   ├── DeveloperModal.tsx
│   │   ├── ShortcutsModal.tsx
│   │   └── Toast.tsx
│   ├── hooks/
│   │   └── useTodos.ts     # Tüm görev mantığı (state + işlemler)
│   ├── types/
│   │   └── todo.ts         # Tip tanımları
│   ├── utils/
│   │   ├── storage.ts      # localStorage katmanı
│   │   └── sound.ts        # Web Audio ses efektleri
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
| Build | Vite |
| Stil | Tailwind CSS 4, TodoMVC CSS |
| Animasyon | Motion, canvas-confetti |
| İkonlar | lucide-react |
| Ses | Web Audio API (harici dosya yok) |
| Depolama | localStorage |

---

**Enes Öztürk** · [GitHub](https://github.com/EnesBinMalik)
