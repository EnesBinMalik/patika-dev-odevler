# Patika.dev — Node.js Ödev 1

JSONPlaceholder API'sinden belirli bir kullanıcının bilgilerini ve gönderilerini **Axios** ile asenkron olarak çekip tek bir nesnede birleştiren ödev.

**Geliştirici:** Enes Öztürk

## Ne yapıyor?

`src/lib/service.js` içindeki `getData(userId)` fonksiyonu:

1. `https://jsonplaceholder.typicode.com/users/{id}` → kullanıcı bilgilerini çeker,
2. `https://jsonplaceholder.typicode.com/posts?userId={id}` → kullanıcının gönderilerini çeker,
3. İki sonucu `{ ...user, posts }` şeklinde birleştirip döndürür.

Geçersiz bir ID verilirse hata fırlatır; istek hataları `try/catch` ile yakalanır.

## Çalıştırma

### Node.js (ödev)
```bash
npm install
node src/app.js
```

### Web arayüzü (demo)
```bash
npm install
npm run dev
```
Ardından `http://localhost:3000` adresini aç.

## Dosyalar

| Dosya | Açıklama |
|---|---|
| `src/lib/service.js` | `getData(userId)` — API istekleri ve birleştirme |
| `src/app.js` | Servisi çalıştırıp sonucu konsola yazan giriş noktası |
| `src/App.tsx` | Sonucu gösteren React arayüzü (demo) |
| `src/main.tsx` | React giriş noktası |
| `package.json` | Bağımlılıklar ve script'ler |
| `vite.config.ts` | Vite yapılandırması |

## Kullanılan teknolojiler

- Node.js (ES Modules)
- Axios
- Async/Await
- React + Vite + TypeScript (demo arayüzü)

---

**Enes Öztürk** · [GitHub](https://github.com/EnesBinMalik)
