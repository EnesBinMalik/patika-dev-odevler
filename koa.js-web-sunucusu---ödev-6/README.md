# Ödev 6: Koa.js ile Web Sunucusu

Bu proje, **Node.js** ve **Koa.js** kütüphanesi kullanılarak geliştirilmiş bir web sunucusu ödevidir.

> **Geliştirici:** Enes Öztürk  
> **Port:** 3000  
> **Kullanılan Teknolojiler:** Node.js, Koa.js, React, Tailwind CSS

---

## 📋 Ödev Gereksinimleri

1. ✅ `koa` paketini projeye dahil etmek (`npm install koa`).
2. ✅ `index`, `hakkimda` ve `iletisim` sayfalarını oluşturmak.
3. ✅ Sayfalara içerik olarak ilgili `<h1>xxx sayfasına hoşgeldiniz</h1>` başlıklarını yazdırmak:
   - `/` veya `/index` -> `<h1>INDEX sayfasına hoşgeldiniz</h1>`
   - `/hakkimda` -> `<h1>HAKKIMDA sayfasına hoşgeldiniz</h1>`
   - `/iletisim` -> `<h1>İLETİŞİM sayfasına hoşgeldiniz</h1>`
   - Tanımsız rotalar -> `<h1>404 Sayfa Bulunamadı</h1>`
4. ✅ Port numarası olarak **3000**'i kullanmak.
5. ✅ **Enes Öztürk** imzalı olması.

---

## 🚀 Bağımsız Koa Sunucusunu Çalıştırma

Projeyi yerel ortamınızda doğrudan terminalden Koa ile çalıştırmak için:

```bash
# Bağımlılıkları yükleyin
npm install

# Koa sunucusunu başlatın
node index.js
```

Tarayıcınızda veya `curl` ile test edebilirsiniz:
- `http://localhost:3000/` veya `http://localhost:3000/index`
- `http://localhost:3000/hakkimda`
- `http://localhost:3000/iletisim`

---

## 💡 Koa.js Hakkında Önemli Notlar

- **Context (`ctx`):** Koa, Express'teki `req` ve `res` nesnelerini tek bir nesnede birleştirir (`ctx.request`, `ctx.response`, `ctx.body`, `ctx.status`).
- **Async/Await:** Koa'nın çekirdeği modern async/await fonksiyonları üzerine kurulmuştur.
- **Minimalist Yapı:** Express'ten farklı olarak varsayılan bir yönlendirici (routing) ile gelmez; rotalar middleware içinde `ctx.url` incelenerek veya `@koa/router` ile yönetilir.
