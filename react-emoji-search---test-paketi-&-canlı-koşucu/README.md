# React Emoji Search & Test Koşucusu

<div align="center">
  <img src="docs/cover.svg" alt="React Emoji Search — arama ve test laboratuvarı, Enes Öztürk imzalı" width="100%" />

  **Emoji'leri ara, panoya kopyala ve testleri çalıştır.**

  [![React](https://img.shields.io/badge/React-19-149ECA?style=flat-square&logo=react&logoColor=white)](https://react.dev/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-7-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vite.dev/)
</div>

## Proje hakkında

Emoji aramasıyla test ve kod incelemesini bir araya getiren React uygulaması. Arama sonuçları yazdıkça filtrelenir; emoji seçimi panoya kopyalama akışını gösterir. Test koşucusu, örnek arama davranışlarını etkileşimli biçimde çalıştırır.

## Özellikler

- **Emoji araması:** ad veya anahtar kelimeyle filtreleme ve en fazla 20 sonuç gösterme.
- **Hızlı filtreler:** `Joy`, `Heart`, `Cat`, `100`, `Smile` ve `Fire` aramalarını tek dokunuşla açma.
- **Panoya kopyalama:** emoji sonucuna tıklayıp kopyalama geri bildirimini görme.
- **Test koşucusu:** tüm testleri veya tek bir test senaryosunu çalıştırma, sonuçları sıfırlama.
- **Kod ve ikili görünüm:** test örneklerini inceleme ve arama ile test panelini birlikte kullanma.
- **İmza penceresi:** geliştirici ve test beyanını görüntüleme.

## Çalıştırma

Gereksinim: Node.js ve npm.

```bash
npm install
npm run dev
```

Vite geliştirme sunucusu varsayılan olarak `http://localhost:3000` adresinde açılır. Üretim derlemesi için `npm run build`, derlemeyi yerelde incelemek için `npm run preview` kullanın.

## Testler

Test koşucusunu açıp **Testleri Başlat** düğmesini kullanın. Uygulama test senaryolarını `src/test-runner/` altındaki yerel çalıştırıcıyla işletir; bu arayüzün test koşucusu ayrı bir Jest komut satırı süreci başlatmaz.

## Proje yapısı

```text
src/
├── App.tsx                    # Arama, görünüm seçimi ve test akışı
├── components/                # Arayüz, sonuçlar, test koşucusu ve imza penceresi
├── data/emojiList.json        # Emoji kataloğu
├── test-runner/               # Yerel test verisi ve çalıştırıcı
└── utils/filterEmoji.ts       # Emoji filtreleme
docs/cover.svg                 # Proje kapağı
```

Bu proje Patika.dev ödev arşivinin bir parçasıdır. Depo haritası ve diğer çalışmalar için [üst dizin README](../README.md)'yi ziyaret edin.

---

<div align="center">

**Enes Öztürk** · [@EnesBinMalik](https://github.com/EnesBinMalik)

*Made to search. Built to learn. Signed by Enes Öztürk.*

</div>
