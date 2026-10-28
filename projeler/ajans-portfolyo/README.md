<div align="center">

# 🏛️ Enes Öztürk Ajans
### Portföy & Web Yönetim Platformu

**Tasarım & Geliştirme:** Enes Öztürk

[![React](https://img.shields.io/badge/React_19-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS_4-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![localStorage](https://img.shields.io/badge/localStorage-Kalıcı_Veri-FFA500?style=flat-square)](https://developer.mozilla.org/docs/Web/API/Window/localStorage)
[![Heroku Ready](https://img.shields.io/badge/Heroku-Hazır-430098?style=flat-square&logo=heroku&logoColor=white)](https://heroku.com)

> **PCAT** ve **SmartEdu** projelerinden gelen CRUD ve iletişim mimarisini tek bir profesyonel ajans ekosisteminde birleştiren modern web uygulaması.

</div>

![Enes Öztürk Ajans — ana sayfa](public/assets/images/agency_hero_studio_1793201689310.jpg)

---

## ✨ Öne Çıkanlar

| | Özellik | Açıklama |
|:-:|---|---|
| 🗂️ | **Dinamik portföy CRUD** | Proje ekleme, düzenleme ve silme; görsel, müşteri, tarih, kategori ve teknoloji etiketleri |
| 🔎 | **Kategori + arama** | Web Tasarım · Grafik Tasarım · Yazılım & API filtreleri ve proje/müşteri adına göre arama |
| ⭐ | **Öne çıkan projeler** | `featured` işaretli çalışmalar vitrinde öne çıkar |
| 🪟 | **Detay modalı** | Müşteri, tarih, açıklama, teknolojiler ve canlı proje bağlantısı |
| ✉️ | **İletişim formu** | Ad, e-posta, konu ve mesaj doğrulaması; gönderimde toast bildirimi |
| 📥 | **Mesaj gelen kutusu** | Formdan gelen mesajları görüntüleme ve silme |
| 🧭 | **Kurumsal bölümler** | Hero + KPI şeridi, hizmetler, hakkında (4 adımlı yol haritası), ekip ve footer |
| ☁️ | **Dağıtım rehberi** | GitHub ve Heroku adımları, kopyalanabilir komutlar |
| 💾 | **JSON yedekleme** | Portföyü `.json` olarak indirme ve geri yükleme |
| 🔁 | **Kalıcı veri** | Tüm değişiklikler `localStorage` üzerinde saklanır; varsayılanlara dönüş |
| 📱 | **Duyarlı tasarım** | Mobil menü, koyu tema ve amber vurgulu kurumsal arayüz |

## 🖼️ Portföyden

| Web Tasarım | Kurumsal Kimlik |
|:-:|:-:|
| <img src="public/assets/images/agency_portfolio_web_1793201690131.jpg" width="100%" alt="Aurora Studio web platformu"> | <img src="public/assets/images/agency_portfolio_branding_1793201690346.jpg" width="100%" alt="Aethel Luxury marka kimliği"> |
| **Aurora Studio** · Yüksek performanslı kurumsal platform | **Aethel Luxury** · Minimalist marka ve ambalaj tasarımı |

| Mobil Uygulama |
|:-:|
| <img src="public/assets/images/agency_portfolio_mobile_1793201690373.jpg" width="60%" alt="Galata Finans mobil arayüzü"> |
| **Galata Finans** · Fintech mobil arayüzü |

## 🧩 Uygulama bölümleri

| Bölüm | İçerik |
|---|---|
| **Hero** | Ajans konumlandırması, CRUD çağrıları ve 4 metrikli KPI şeridi |
| **Hizmetler** | Web & full-stack, marka kimliği, mobil UI/UX ve dinamik CMS kartları |
| **Portföy** | Kategori filtreleri, arama, proje kartları, düzenleme ve silme |
| **Hakkında** | PCAT → SmartEdu → Ajans → Bulut dağıtım yol haritası |
| **Ekip** | Kreatif direktör, backend/DevOps ve UX stratejisti profilleri |
| **İletişim** | Doğrulamalı form ve mesaj gelen kutusu |
| **Footer** | Hızlı bağlantılar, iletişim ve imza |

## 🛠️ Teknolojiler

| Katman | Teknoloji |
|---|---|
| UI | React 19, TypeScript |
| Build | Vite |
| Stil | Tailwind CSS 4 |
| İkonlar | lucide-react |
| Veri | Tarayıcı `localStorage` (sunucusuz) |
| Dağıtım | Heroku (`Procfile` → `web: npm start`), GitHub |

## 🗂️ Proje yapısı

```
projeler/ajans-portfolyo/
├── public/
│   └── assets/images/          # Hero ve portföy görselleri
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Hero.tsx
│   │   ├── ServicesSection.tsx
│   │   ├── PortfolioSection.tsx
│   │   ├── PortfolioDetailModal.tsx
│   │   ├── AddEditProjectModal.tsx
│   │   ├── DeleteConfirmModal.tsx
│   │   ├── MessagesModal.tsx
│   │   ├── DeployGuideModal.tsx
│   │   ├── AboutSection.tsx
│   │   ├── TeamSection.tsx
│   │   ├── ContactSection.tsx
│   │   └── Footer.tsx
│   ├── data/initialData.ts     # Örnek projeler ve mesajlar
│   ├── utils/storage.ts        # localStorage okuma / yazma / sıfırlama
│   ├── types/index.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── Procfile
├── package.json
└── vite.config.ts
```

## 🚀 Çalıştırma

```bash
npm install
npm run dev
```

Ardından `http://localhost:3000` adresini aç.

```bash
npm run build     # üretim derlemesi
npm run preview   # derlemeyi önizle
```

## 💾 Veri & kalıcılık

| Anahtar | İçerik |
|---|---|
| `enes_ozturk_agency_portfolio_v1` | Portföy projeleri |
| `enes_ozturk_agency_messages_v1` | İletişim mesajları |

- İlk açılışta örnek projeler ve mesajlar yüklenir.
- **“Varsayılan örnek projeleri geri yükle”** ile veriler sıfırlanabilir.
- Dağıtım rehberindeki **JSON İndir / JSON Yükle** araçlarıyla portföy yedeklenebilir.

## 📌 Notlar

- Uygulama tamamen istemci tarafında çalışır; veritabanı veya API anahtarı gerektirmez.
- İletişim formu mesajları tarayıcıda saklar (demo amaçlı).
- Portföy görselleri `public/assets/images` altında tutulur; geliştirme ve üretim derlemesinde doğrudan sunulur.

---

<div align="center">

### 👤 Enes Öztürk

**Full Stack Developer · UI/UX · Marka Tasarımı**

[![GitHub](https://img.shields.io/badge/GitHub-EnesBinMalik-181717?style=flat-square&logo=github)](https://github.com/EnesBinMalik)

<sub>Tasarlandı ve geliştirildi — **Enes Öztürk**</sub>

</div>
