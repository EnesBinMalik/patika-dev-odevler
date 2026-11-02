# Clean Blog — Ödev 12 (Bölüm 6): Dağıtım Rehberi, Yorumlar ve Arama

![Arayüz mockup'ı](docs/cover.svg)

> **Patika.dev · Node.js patikası — Clean Blog serisi, Ödev 12 / Bölüm 6** · Enes Öztürk
> Seri: [ödev-7 Express](../clean-blog---ödev-7) → [ödev-9 MongoDB](../clean-blog---enes-öztürk-(ödev-9)) → [ödev-10 routing](../clean-blog---ödev-10-(enes-öztürk)) → [ödev-11 MVC](../clean-blog---ödev-11-(mvc,-update-&-delete)) → **[ödev-12 (burada)](../clean-blog---ödev-12-(bölüm-6))**

> ## ⚠️ Önce bu: repoya sızmış görünen bağlantı bilgisi
>
> `src/components/DeploymentHub.tsx` içinde, kullanıcı adı ve **parola içeren** bir MongoDB Atlas
> bağlantı dizesi altı yerde düz metin olarak duruyor: `:63`, `:204`, `:418`, `:421`, `:521`, `:528`
> (biçim: `mongodb+srv://enes_user:••••••••@cluster0.k3v9z.mongodb.net/cleanblog-db?...`).
> Bu depo **halka açık**. Gerçek bir Atlas kullanıcısına aitse:
>
> 1. Atlas'ta o kullanıcının parolasını **hemen döndür** (veya kullanıcıyı sil) — dosyayı düzeltmek
>    geçmiş commit'leri temizlemez.
> 2. Dizeyi `process.env.MONGODB_URI` okumasına taşı, kaynağa sadece `<MONGODB_URI>` yer tutucusu bırak.
> 3. `.env.example` ekle ve gerçek `.env` dosyasını asla commit'leme.
> 4. Geçmişten kazımak istersen `git filter-repo` + **güçlü push** gerekir; bu geri alınamaz bir işlem.
>
> Kod değilleri burada bilinçli olarak tekrarlanmadı.

## Ödevin çıktısı

Seriye **dağıtım (deploy) anlatımı**, **yorum** varlığı ve **arama/kategori filtresi** ekleniyor.
Ayrıca bu ödevde nelerin *yapılmadığı* açıkça söyleniyor: sayfalama ve görsel yükleme
(`AssignmentNotice.tsx:22`, `PaginationNoticeModal.tsx:39`).

## Eklenen özellikler

| Özellik | Nerede |
| --- | --- |
| Oluşturma + güncelleme tek fonksiyonda | `handleSavePost` · `App.tsx:129` |
| Silme onayı | `DeleteConfirmModal.tsx` |
| Yorumlar (2. koleksiyon) | `PostComment` · `types/blog.ts:13-19` · `handleAddComment` `App.tsx:179` · anahtar `clean_blog_comments_v1` `:30` |
| Tam metin araması | `App.tsx:191-198` |
| Kategori filtreleri | `App.tsx:200` |
| İletişim formu | `ContactView.tsx` |
| Dağıtım rehberi (Heroku + Atlas) | `DeploymentHub.tsx` (631 satır) |
| Toast bildirimleri | `App.tsx` |

Veri modeli: `{ id, title, subtitle, detail, author, authorEmail?, dateCreated, readTime, category }`
(`src/types/blog.ts:1-11`), 4 tohum yazı `id: 'post-1'…'post-4'`. Ödev-11'deki MVC gezgini bu klasörde yok.

## Çalıştırma

```bash
npm install
npm run dev          # vite --port=3000 --host=0.0.0.0 → http://localhost:3000
```

Dağıtım sekmesinde anlatılan adımlar **rehber metnidir**, bu klasörde çalışan bir sunucu yoktur:
`Procfile → web: npm start`, `heroku config:set MONGODB_URI=<ATLAS_URI>`, `git push heroku main`.

## Dürüstlük notları

- `DeploymentHub.tsx:343` yanıp sönen yeşil **"CANLI BAĞLANTI DOĞRULANDI"** rozeti ve
  "22 ms gecikme · SSL/TLS 1.3" satırları sabit metin; hiçbir ağ bağlantısı kurulmuyor. `:219`
  "M0 Cluster & Heroku Dyno Aktif" rozeti de aynı şekilde sabit.
- Toast'lar `App.tsx:142`, `:152`, `:166` "MongoDB Atlas üzerinde güncellendi / koleksiyona eklendi /
  veritabanından silindi" diyor; gerçekleşen işlem `localStorage` yazması.
- Tohum yorumlar `App.tsx:70-84` içinde "Müfredat Eğitmeni" ve "Sınıf Arkadaşı" imzasıyla ödevi öven
  uydurma içerikler — kullanıcı üretimi gibi görünüyor.
- `metadata.json` "Node.js & MongoDB Atlas destekli" diyor; sunucu dosyası bile yok.
- `STORAGE_KEY = 'clean_blog_posts_v1'` (`App.tsx:29`) ödev-10 ile aynı, alan adı farklı (`id` vs `_id`) —
  aynı portta açıldığında iki proje birbirinin eski verisini okur.
- "Eski Gönderiler" düğmesi (`App.tsx:358`) sayfalama yapmıyor; `PaginationNoticeModal` zaten bunu itiraf ediyor.
- `@google/genai`, `express`, `@types/express`, `tsx`, `dotenv`, `motion` kullanılmıyor;
  `package.json` adı `react-example`.

## Yapılacaklar

- [ ] Gömülü bağlantı dizesini env'e taşı ve parolayı döndür (yukarıdaki uyarı).
- [ ] Sunucuyu gerçekten ekle (`server.ts` + Mongoose) ve toast/rozetleri gerçek `/api/status` sonucuna bağla.
- [ ] Yorumları gerçek kullanıcı girdisiyle besle; övücü tohum yorumları kaldır.
- [ ] Sayfalama (`limit`/`skip`) ve görsel yükleme (multipart) eksiklerini kapat — Bölüm 6'nın devamı.
- [ ] Depolama anahtarını `clean_blog_odev12_posts` olarak ayır.
- [ ] `dateCreated` tipini tarihi sıralamaya uygun hâle getir.

## Lisans

Ödev amaçlı çalışma; Enes Öztürk'e ait.
