<div align="center">

![Patika.dev Ödevleri ve Proje Arşivi](docs/banner.png)

**Enes Öztürk**

Patika.dev müfredatı ve kurumsal mimari çalışmalarından derlenmiş **78 proje klasörü**, tek çatı altında dizilmiş arşiv.

[![Ödev klasörü](https://img.shields.io/badge/proje%20klas%C3%B6r%C3%BC-78-22d3ee?style=flat-square)](#hat-haritası)
[![Teknoloji hattı](https://img.shields.io/badge/teknoloji%20hattı-9-8b5cf6?style=flat-square)](#hat-haritası)
[![Gerçek sunucu](https://img.shields.io/badge/npm%20start%20ile%20kalkan%20sunucu-9-4ade80?style=flat-square)](#9-gerçek-sunucusu-olan-klasör)
[![İmzalı kapak](https://img.shields.io/badge/imzalı%20kapak%20%2B%20README-78-fbbf24?style=flat-square)](#imzalı-kapaklar)
[![GitHub](https://img.shields.io/badge/GitHub-EnesBinMalik-181717?style=flat-square&logo=github&logoColor=white)](https://github.com/EnesBinMalik)

</div>

---

Bu README deponun **çatısıdır**: hangi klasör neyi içeriyor, nasıl çalıştırılıyor ve hangisi gerçekten
derlenebilir/bağlanabilir kaynak, hangisi arayüzde kod incelemesi — hepsi burada. Bir klasöre girdiğinde
kendi `README.md`'si her zaman daha ayrıntılıdır.

## Hat haritası

| # | Hat | Klasör | İçerik |
|:-:|---|:-:|---|
| 1 | [Node.js temelleri & CLI](#1-nodejs-temelleri--cli) | 6 | `http`, `fs`, modül, Koa ve komut satırı ödevleri |
| 2 | [GraphQL & gerçek zamanlı](#2-graphql--gerçek-zamanlı) | 8 | Şema, resolver, subscription, Apollo, Redis yayını |
| 3 | [Clean Blog — Express & MongoDB](#3-clean-blog--express--mongodb-serisi) | 5 | Express ilk sunucudan Mongoose ve MVC'ye uzanan seri |
| 4 | [Java](#4-java) | 4 | Multithreading, generic `MyList`, Stream API, `Comparable` |
| 5 | [Rust](#5-rust) | 5 | Sahiplik, enum & desen eşleştirme, `Result`, filtreleme |
| 6 | [Web3 & Solana](#6-web3--solana) | 4 | Sayaç, token transferi, restaurant akıllı sözleşmesi |
| 7 | [Algoritma & arayüz egzersizleri](#7-algoritma--arayüz-egzersizleri) | 12 | Bölünebilme, döngü çizimi, OOP, metin araçları, bileşen & test |
| 8 | [Yönetim panelleri & CRUD](#8-yönetim-panelleri--crud-sistemleri) | 10 | LMS, mağaza, envanter, sigorta, turizm, kariyer portalı, HRMS, ATM |
| 9 | [Oyun, API vitrini & kişisel projeler](#9-oyun-api-vitrini--kişisel-projeler) | 12 | Hafıza/macera oyunu, hava durumu, portfolyo, fitness, daması |
| | **Toplam** | **78** | |

## 🚀 Hızlı başlangıç

Her klasör **kendi `package.json`'ına sahip bağımsız bir projedir**; kök dizinde kurulum yapılmaz.

**A) Arayüz klasörleri (54 klasör)** — Vite + React:

```bash
cd <klasör-adi>
npm install
npm run dev          # http://localhost:3000
```

**B) Sunucusu olan klasörler (9 klasör)** — burada `npm run dev` Vite'ı **sunucunun içinden** başlatır
(`vite.middlewares`), yani API ve arayüz aynı portta ayağa kalkar; ayrıca derleme yapmanıza gerek yok:

```bash
cd <klasör-adi>
npm install
npm run dev          # tsx server.ts -> http://localhost:3000 (arayüz + /graphql + /api)
```

Üretim sürümünü (derlenmiş `dist/` üzerinden) görmek isterseniz:

```bash
npm run build && NODE_ENV=production npm run dev
```

Tam liste ve portlar: [9 gerçek sunucusu olan klasör](#9-gerçek-sunucusu-olan-klasör).

## 📚 Hatlar

### 1. Node.js temelleri & CLI

| Klasör | Ödev | Gerçek kaynak | Ne görüyorsun |
|---|---|---|---|
| [nodejs/odev-1](<nodejs/odev-1>) | Ödev 1 · JSONPlaceholder + Axios | `src/app.js`, `src/lib/service.js` | Veri çekme akışının React vitrini |
| [ödev-3_-daire-modülü---enes-öztürk](<ödev-3_-daire-modülü---enes-öztürk>) | Ödev 3 · Daire modülü | `circle.cjs`, `index.cjs`, `odev3/` | `node odev3/index.js` ile çalışan modül |
| [node.js-komut-satırı---dairenin-alanı-_-enes-öztürk](<node.js-komut-satırı---dairenin-alanı-_-enes-öztürk>) | Komut satırı · Dairenin alanı | `daireAlani.js` | `process.argv` ile CLI hesabı |
| [node.js-fs-modülü---ödev-4-_-enes-öztürk](<node.js-fs-modülü---ödev-4-_-enes-öztürk>) | Ödev 4 · `fs` modülü | `index.cjs` + `server.ts` | Dosya okuma/yazma + HTTP uçları |
| [node.js-web-sunucusu-(ödev-5)---enes-öztürk](<node.js-web-sunucusu-(ödev-5)---enes-öztürk>) | Ödev 5 · Web sunucusu | yok (tarayıcı simülasyonu) | `BrowserSimulator` + `codeTemplates.ts` |
| [koa.js-web-sunucusu---ödev-6](<koa.js-web-sunucusu---ödev-6>) | Ödev 6 · Koa.js | `index.cjs`, `index.js` | Koa middleware zinciri |

### 2. GraphQL & gerçek zamanlı

| Klasör | Ödev | Sunucu | Şema nerede çalışıyor |
|---|---|---|---|
| [graphql-sunucusu---ödev-1-(enes-öztürk)](<graphql-sunucusu---ödev-1-(enes-öztürk)>) | Ödev 1 · GraphQL sunucusu | `npm start` → `tsx server.ts` :3000 | Gerçek `graphql-js` sunucusu |
| [graphql-event-manager---ödev-2-(enes-öztürk)](<graphql-event-manager---ödev-2-(enes-öztürk)>) | Ödev 2 · Mutation motoru | yok | İstemci tarafı; Apollo kodu `src/graphql/codeExports.ts` içinde metin |
| [graphql-subscriptions-studio---enes-öztürk](<graphql-subscriptions-studio---enes-öztürk>) | Subscriptions stüdyosu | yok | Tarayıcıda `execute`/`subscribe` (`src/graphql/executor.ts`) |
| [eventhub---apollo-client-&-graphql-etkinlik-portalı](<eventhub---apollo-client-&-graphql-etkinlik-portalı>) | Apollo Client portalı | yok | `ApolloLink` kendi resolver'ı, veri `localStorage` |
| [countries-graphql-api---enes-öztürk](<countries-graphql-api---enes-öztürk>) | Countries GraphQL API | `npm start` → :3000 | İlişkili şema + sorgu stüdyosu |
| [anonymous-chat---graphql-&-redis-pubsub](<anonymous-chat---graphql-&-redis-pubsub>) | GraphQL + Redis PubSub | `npm start` → :3000 | `graphql-ws` + `graphql-redis-subscriptions` |
| [gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi](<gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi>) | Gerçek zamanlı takip | `npm start` → :3000 | `WebSocketServer` + `/api` uçları |
| [realtime-voting-app](<realtime-voting-app>) | Anlık oylama | `npm start` → :3000 | GraphQL Yoga + `createPubSub`; istemci `EventSource` ile SSE |

### 3. Clean Blog — Express & MongoDB serisi

| Klasör | Ödev | Kalıcılık | Sunucu |
|---|---|---|---|
| [clean-blog---ödev-7](<clean-blog---ödev-7>) | Ödev 7 · Express ile ilk sunucu | — | `CleanBlog/app.js` (asıl teslimat) + `server.ts` :3000 |
| [clean-blog---enes-öztürk-(ödev-9)](<clean-blog---enes-öztürk-(ödev-9)>) | Ödev 9 · Mongoose bağlantısı | MongoDB | `server.ts` :3 (yoksa bellek içi listeye düşer) |
| [clean-blog---ödev-10-(enes-öztürk)](<clean-blog---ödev-10-(enes-öztürk)>) | Ödev 10 · Tekil sayfa & yönlendirme | `localStorage` | hash router, sunucu yok |
| [clean-blog---ödev-11-(mvc,-update-&-delete)](<clean-blog---ödev-11-(mvc,-update-&-delete)>) | Ödev 11 · MVC, güncelleme & silme | `localStorage` | MVC/EJS örnekleri kaynakta metin olarak duruyor |
| [clean-blog---ödev-12-(bölüm-6)](<clean-blog---ödev-12-(bölüm-6)>) | Ödev 12 · Dağıtım, yorum & arama | `localStorage` | ⚠️ README'si bir güvenlik bulgusuyla açılıyor |

### 4. Java

| Klasör | Konu | Java kaynağı |
|---|---|---|
| [java-multithreading-ödevi---enes-öztürk](<java-multithreading-ödevi---enes-öztürk>) | Thread / Runnable / ExecutorService | kod React arayüzünde gösteriliyor + 4 thread simülasyonu |
| [java-mylist-generic-sınıfı---enes-öztürk](<java-mylist-generic-sınıfı---enes-öztürk>) | Generic `MyList<T>` | kod React arayüzünde |
| [java-stream-kitap-listesi---enes-öztürk](<java-stream-kitap-listesi---enes-öztürk>) | Stream API ile kitap listesi | kod React arayüzünde |
| [kitap-sıralayıcı](<kitap-sıralayıcı>) | `Comparable` & `TreeSet` | anlatı Java, sıralama TS `.sort()` ile kuruluyor |

> Bu depoda `.java` uzantılı derlenebilir dosya **yok**; Java ödevleri konsepti anlatan React
> uygulamaları olarak teslim edilmiş. `javac` ile çalıştırma iddiası yoktur.

### 5. Rust

| Klasör | Konu | Rust kaynağı |
|---|---|---|
| [rust-bankacılık-sistemi-&-hata-yönetimi](<rust-bankacılık-sistemi-&-hata-yönetimi>) | `Result<(), String>` + `match` | kod inceleme arayüzü + simülasyon |
| [rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk](<rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk>) | `trait` & `struct` | kod inceleme arayüzü |
| [rust-enum-&-desen-eşleştirme-hesap-makinesi](<rust-enum-&-desen-eşleştirme-hesap-makinesi>) | `enum` + desen eşleştirme | mantık TypeScript'te çalışıyor |
| [rust-sahiplik-ve-referanslar-laboratuvarı](<rust-sahiplik-ve-referanslar-laboratuvarı>) | Ownership & borrowing | görsel laboratuvar |
| [rust-özel-filtreleme-laboratuvarı---enes-öztürk](<rust-özel-filtreleme-laboratuvarı---enes-öztürk>) | İteratör & filtreleme | görsel laboratuvar |

### 6. Web3 & Solana

| Klasör | Konu | Program |
|---|---|---|
| [solana-sayaç-programı---enes-öztürk](<solana-sayaç-programı---enes-öztürk>) | Sayaç programı | açıklama + arayüz, on-chain derleme yok |
| [solana-token-transfer---enes-öztürk-ödevi](<solana-token-transfer---enes-öztürk-ödevi>) | Token transferi | arayüz |
| [solana-restaurant-review-dapp-&-smart-contract](<solana-restaurant-review-dapp-&-smart-contract>) | Restoran yorum dApp | **`program/src/*.rs`** — depodaki tek gerçek Rust programı |
| [web3-düşünce-egzersizi_-afet-yardımı-&-depin-analizi---enes-öztürk](<web3-düşünce-egzersizi_-afet-yardımı-&-depin-analizi---enes-öztürk>) | Afet yardımı & DePIN analizi | analiz vitrini |

### 7. Algoritma & arayüz egzersizleri

| Klasör | Konu | Öne çıkan |
|---|---|---|
| [3-ile-bölünebilme-hesaplayıcı](<3-ile-bölünebilme-hesaplayıcı>) | 3'e bölünebilme | `((sayi % 3) + 3) % 3` + rakamlar toplamı |
| [döngülerle-üçgen-çizme---enes-öztürk](<döngülerle-üçgen-çizme---enes-öztürk>) | Döngülerle şekil çizme | iç içe döngü çıktıları |
| [geometrik-şekiller-oop-ödevi---enes-öztürk](<geometrik-şekiller-oop-ödevi---enes-öztürk>) | OOP ile geometrik şekiller | sınıf/alan-çevre hesapları |
| [paragraf-oluşturucu---enes-öztürk](<paragraf-oluşturucu---enes-öztürk>) | Metin üretici | Lorem üretimi |
| [klavye-hız-testi---enes-öztürk](<klavye-hız-testi---enes-öztürk>) | Hız testi | WPM & doğruluk ölçümü |
| [markdown-previewer-pro-—-enes-öztürk-signature](<markdown-previewer-pro-—-enes-öztürk-signature>) | Markdown önizleme | düzenleyici + önizleme |
| [php-dizi-filtreleyici-ve-rastgele-seçici](<php-dizi-filtreleyici-ve-rastgele-seçici>) | Dizi filtreleme | mantık TypeScript'te; `.php` dosyası yok |
| [enes-öztürk-button-component](<enes-öztürk-button-component>) | Bileşen paketi | `packages/` + `build.js` + `server.ts` |
| [react-emoji-search---test-paketi-&-canlı-koşucu](<react-emoji-search---test-paketi-&-canlı-koşucu>) | Emoji arama | test paketi + canlı koşucu |
| [notesapp---enes-öztürk](<notesapp---enes-öztürk>) | Not uygulaması | CRUD + kalıcılık |
| [post-sıralama-ve-post-ekleme---enes-öztürk](<post-sıralama-ve-post-ekleme---enes-öztürk>) | Post sıralama & ekleme | sıralama stratejileri |
| [react/odev-2](<react/odev-2>) | React Ödev 2 · Todo | React 19 · TypeScript · Tailwind |

### 8. Yönetim panelleri & CRUD sistemleri

| Klasör | Panel | Veri |
|---|---|---|
| [etkinlik-portalı---ödev-6](<etkinlik-portalı---ödev-6>) | Etkinlik yönetim portalı | `localStorage` (`src/App.tsx`) |
| [patika-klonu---eğitim-ve-öğrenim-yönetim-platformu](<patika-klonu---eğitim-ve-öğrenim-yönetim-platformu>) | LMS: operatör/eğitmen/öğrenci | Context API + `localStorage` |
| [patikastore---ürün-yönetim-sistemi](<patikastore---ürün-yönetim-sistemi>) | Ürün yönetimi | `localStorage` |
| [paslı-mağaza---envanter-yönetim-sistemi](<paslı-mağaza---envanter-yönetim-sistemi>) | Envanter | `localStorage` |
| [sigorta-yönetim-sistemi](<sigorta-yönetim-sistemi>) | Poliçe & müşteri | bileşen durumu (`useState`) — sayfa yenilenince sıfırlanır |
| [patika-turizm-acente-sistemi](<patika-turizm-acente-sistemi>) | Turizm acente | `localStorage` |
| [fikstür-mobilya-&-i̇ç-mimarlık---enes-öztürk](<fikstür-mobilya-&-i̇ç-mimarlık---enes-öztürk>) | Mobilya & iç mimari vitrini | katalog verisi `localStorage`'da |
| [kariyerportalı---i̇ş-bulma-&-i̇lan-sistemi](<kariyerportalı---i̇ş-bulma-&-i̇lan-sistemi>) | Aday & şirket portalı — ilan, başvuru | katmanlı mimari · `src/core/repositories` (Repository, Factory, Builder, Strategy) |
| [i̇nsan-kaynakları-yönetim-sistemi-(hrms)---enes-öztürk](<i̇nsan-kaynakları-yönetim-sistemi-(hrms)---enes-öztürk>) | HRMS — personel, izin, maaş, denetim | `src/core/database.ts` + dosya I/O (`stream.ts`) |
| [öztürk-bank-atm-&-çekirdek-bankacılık-sistemi](<öztürk-bank-atm-&-çekirdek-bankacılık-sistemi>) | ATM terminali + yönetim portalı | `src/core/repositories` · `Optional`, `Stream`, Strategy, Factory |

### 9. Oyun, API vitrini & kişisel projeler

| Klasör | Ne | Veri kaynağı |
|---|---|---|
| [hafıza-oyunu---enes-öztürk](<hafıza-oyunu---enes-öztürk>) | Kart eşleştirme, joker, puan & rekor | Redux Toolkit |
| [macera-oyunu---enes-öztürk](<macera-oyunu---enes-öztürk>) | Bölüm tabanlı macera + savaş ekranı | istemci tarafı durum |
| [spend-bill-gates'-money](<spend-bill-gates'-money>) | Bütçe harcama oyunu | ürün listesi + confetti |
| [rick-ve-morty-karakter-portalı---enes-öztürk](<rick-ve-morty-karakter-portalı---enes-öztürk>) | Karakter arama | `rickandmortyapi.com/graphql` (`src/services/rickAndMortyApi.ts`) |
| [covid-19-tracker---enes-öztürk](<covid-19-tracker---enes-öztürk>) | Salgın takip panosu | disease.sh API |
| [türkiye-hava-durumu-·-enes-öztürk](<türkiye-hava-durumu-·-enes-öztürk>) | Türkiye hava durumu | Open-Meteo |
| [enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu](<enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu>) | 7 günlük hava durumu | Open-Meteo |
| [projeler/ajans-portfolyo](<projeler/ajans-portfolyo>) | Portföy & web yönetim platformu | `localStorage` |
| [projeler/freelancer-portfolyo](<projeler/freelancer-portfolyo>) | Freelance vitrini + gelen kutusu | `localStorage` |
| [projeler/meteoroloji](<projeler/meteoroloji>) | 81 il, saatlik + 7 günlük hava | Open-Meteo · Context API |
| [projeler/misfit-fitness](<projeler/misfit-fitness>) | Rol bazlı spor yönetimi | Context API · `localStorage` |
| [projeler/turk-damasi](<projeler/turk-damasi>) | İki kişilik Türk Daması | Redux Toolkit · Web Audio |

## Dürüstlük rehberi

### Kod mu, vitrin mi?

Depodaki klasörlerin çoğu Google AI Studio iskeletiyle kurulmuş Vite
uygulamalarıdır; ödevin *kavramını* anlatan arayüz gerçek, ama anlatılan dilin derlenebilir dosyası
her zaman repoda durmuyor. Kesin durum:

| Dil / teknoloji | Gerçek kaynak dosya | Klasör |
|---|---|---|
| Node.js betikleri | ✅ `.cjs` / `.js` | ödev-3 daire modülü, node.js-fs-modülü, koa.js, node.js-komut-satırı, nodejs/odev-1 |
| Express sunucusu | ✅ `server.ts` | 9 klasör (aşağıdaki liste) |
| GraphQL şeması | ✅ sunucuda çalışan şema | anonymous-chat, countries-graphql-api, graphql-sunucusu, realtime-voting-app (+ tarayıcıda çalışan 3 klasör) |
| MongoDB / Mongoose | ✅ | clean-blog---enes-öztürk-(ödev-9) |
| Rust | ✅ `program/src/*.rs` | solana-restaurant-review-dapp-&-smart-contract |
| Java | ❌ `.java` yok | 4 Java klasörü React incelemesi |
| PHP | ❌ `.php` yok | php-dizi-filtreleyici TypeScript'e yazılmış |
| Solidity / on-chain | ❌ derlenen program yok | Solana klasörlerinin üçü arayüz |

### İmzalı kapaklar

Arşivdeki **78 proje klasörünün tamamı** kendi kapağını (`docs/cover.svg`) taşır. İlk sürümde var olan 12 kapak olduğu gibi korundu; kapaksız kalan 66 klasöre Enes Öztürk imza diliyle yeni kapak üretildi. Her README kapağını en üstte gösterir. Kapaklar tek bir üreteçten çıkar — aynı ızgara, tipografi ve imza bloğu; renk yalnızca teknoloji hattını anlatır:

| Hat | Vurgu |
| --- | --- |
| Node.js temelleri & CLI | camgöbeği |
| GraphQL & gerçek zamanlı | mor |
| Clean Blog — Express & MongoDB | yeşil |
| Java | amber |
| Rust & Solana | turuncu |
| Algoritma & arayüz | gök mavisi |
| Yönetim panelleri & CRUD | pembe |
| Oyun, API vitrini & kişisel projeler | camgöbeği |

Kapakları yeniden üretmek için:

```bash
python tools_cover.py             # yalnız eksik kapakları üretir (--force: mevcutlara dokunur)
python tools_readme.py            # eksik/şablon README'leri yeniden yazar
```

README'si kaynakta doğrulanmış, elle yazılmış 19 klasör:

`3-ile-bölünebilme-hesaplayıcı` · `anonymous-chat---graphql-&-redis-pubsub` · `clean-blog---ödev-7` ·
`clean-blog---enes-öztürk-(ödev-9)` · `clean-blog---ödev-10-(enes-öztürk)` ·
`clean-blog---ödev-11-(mvc,-update-&-delete)` · `clean-blog---ödev-12-(bölüm-6)` ·
`countries-graphql-api---enes-öztürk` · `hafıza-oyunu---enes-öztürk` · `java-multithreading-ödevi---enes-öztürk` ·
`patika-klonu---eğitim-ve-öğrenim-yönetim-platformu` · `rust-bankacılık-sistemi-&-hata-yönetimi`

### 9 gerçek sunucusu olan klasör

Hepsinde `npm run dev` bir `server.ts` başlatır (`tsx server.ts` ya da `node server.ts`):

| Klasör | Port | Not |
|---|---|---|
| anonymous-chat---graphql-&-redis-pubsub | 3000 | Redis yoksa `ioredis-mock`'a düşer |
| clean-blog---ödev-7 | 3000 | Asıl teslimat iç klasördeki `CleanBlog/app.js` |
| clean-blog---enes-öztürk-(ödev-9) | **3** | `MONGODB_URI` yoksa sessizce bellek içi listeye geçer |
| countries-graphql-api---enes-öztürk | 3000 | `POST /graphql` |
| enes-öztürk-button-component | 3000 | Paket + sunucu kancası |
| graphql-sunucusu---ödev-1-(enes-öztürk) | 3000 | `graphql-js` sunucusu |
| node.js-fs-modülü---ödev-4-_-enes-öztürk | **3** | `fs` işlemleri + HTTP |
| gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi | 3000 | `WebSocketServer` |
| realtime-voting-app | 3000 | GraphQL Yoga + SSE aboneliği (`EventSource`) |

### Varyant ve yinelenen klasörler

Aynı ödevin birden fazla sürümü duruyor; her biri ayrı bir Patika teslimi olduğu için silmedim:

- Hava durumu: `projeler/meteoroloji` · `enes-öztürk-meteoroloji-_-türkiye-7-günlük-hava-durumu` · `türkiye-hava-durumu-·-enes-öztürk`
- Etkinlik portalları: `etkinlik-portalı---ödev-6` · `eventhub---apollo-client-&-graphql-etkinlik-portalı` · `graphql-event-manager---ödev-2-(enes-öztürk)` · `gerçek-zamanlı-etkinlik-ve-katılımcı-takip-sistemi`
- Rust bankacılık: `rust-bankacılık-sistemi-&-hata-yönetimi` · `rust-bankacılık-sistemi-(traits-&-structs)---enes-öztürk`

## 📐 Depo standartları

- **Kök README** tek giriş noktasıdır; yeni klasör eklerken buradaki hat tablosuna satır ekleyin.
- Her klasör: `README.md` (künye, öne çıkanlar, kurulum, yapı) + `docs/cover.svg` (imza kapak).
- Kök [`.gitignore`](.gitignore) tüm klasörleri kapsar (`node_modules/`, `dist/`, `build/`, `.env*`,
  editör ve log dosyaları).
- Kapak görselleri kodla üretilir, binary elle çizilmez:

  ```bash
  python docs/make_banner.py   # docs/banner.png (1600x640) + docs/social-preview.png (1200x630)
  python tools_cover.py        # her proje için docs/cover.svg + docs/social-preview.svg
  python tools_readme.py       # şablon/zayıf README'leri yeniden yazar
  ```

  `social-preview.png`'i GitHub'da **Settings → Social preview → Upload image** ile bağlayın;
  bağlantı paylaşılırken görünen kart budur.

- Kaynak kodda yazım/davranış değişikliği ayrı bir dalda yapılır; belge commit'leri kodu taşımaz.

## 🛠️ Teknolojiler

![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=node.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat-square&logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)
![Redux](https://img.shields.io/badge/Redux_Toolkit-764ABC?style=flat-square&logo=redux&logoColor=white)
![GraphQL](https://img.shields.io/badge/GraphQL-E10098?style=flat-square&logo=graphql&logoColor=white)
![Apollo](https://img.shields.io/badge/Apollo_Client-311C87?style=flat-square&logo=apollographql&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Koa](https://img.shields.io/badge/Koa.js-2083AD?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-FF4438?style=flat-square&logo=redis&logoColor=white)
![Java](https://img.shields.io/badge/Java-E76F00?style=flat-square&logo=openjdk&logoColor=white)
![Rust](https://img.shields.io/badge/Rust-000000?style=flat-square&logo=rust&logoColor=white)
![Solana](https://img.shields.io/badge/Solana-14F195?style=flat-square&logo=solana&logoColor=black)
![WebSocket](https://img.shields.io/badge/WebSocket-black?style=flat-square)

## 📌 Notlar

- Bu arşivdeki hiçbir kod `GEMINI_API_KEY` veya benzeri bir anahtar okumuyor; o ifade yalnızca AI
  Studio iskelet README'lerinde ve `metadata.json` tanımlayıcılarında geçiyor. 42 klasörün README'sinin
  başına bu gerçeği söyleyen bir uyarı bloğu eklendi.
- İstemci tarafı klasörlerin çoğu veriyi `localStorage`'da tutar; tarayıcı verisini silmek ödev kaydını
  da siler. `sigorta-yönetim-sistemi` bundan ayrı: durumu yalnızca bellekte taşıyor.
- `clean-blog---ödev-12-(bölüm-6)` klasörünün README'si, repoda duran bir MongoDB Atlas bağlantı
  dizesine karşı uyarıyla başlıyor. Bunu görmezden gelmeyin.
- Port çakışması: birden çok sunucu 3000'i kullanır, aynı anda çalıştırırken `PORT` verin.

---

<div align="center">

**Enes Öztürk** · [@EnesBinMalik](https://github.com/EnesBinMalik)

Afiş: [docs/banner.png](docs/banner.png) · Sosyal önizleme: [docs/social-preview.png](docs/social-preview.png) · Üretici: [docs/make_banner.py](docs/make_banner.py)

</div>
