/**
 * Patika.dev / Kodluyoruz - Node.js Eğitimi
 * Ödev 6: Koa.js ile Web Sunucusu Yazımı (CommonJS Versiyonu)
 * 
 * Hazırlayan / İmza: Enes Öztürk
 * Port: 3000
 */

const Koa = require('koa');
const app = new Koa();
const port = 3000;

app.use(async (ctx) => {
  const url = ctx.url.toLowerCase();
  ctx.type = 'text/html; charset=utf-8';

  if (url === '/' || url === '/index') {
    ctx.status = 200;
    ctx.body = '<h1>INDEX sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else if (url === '/hakkimda') {
    ctx.status = 200;
    ctx.body = '<h1>HAKKIMDA sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else if (url === '/iletisim') {
    ctx.status = 200;
    ctx.body = '<h1>İLETİŞİM sayfasına hoşgeldiniz</h1>' +
               '<p>Enes Öztürk imzalı Koa.js sunucusu</p>';
  } else {
    ctx.status = 404;
    ctx.body = '<h1>404 - Sayfa Bulunamadı</h1>';
  }
});

app.listen(port, () => {
  console.log(`Sunucu port ${port} üzerinde başarıyla çalışmaya başladı...`);
  console.log('İmza: Enes Öztürk');
});
