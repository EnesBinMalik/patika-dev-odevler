/**
 * Patika.dev / Kodluyoruz - Node.js Eğitimi
 * Ödev 6: Koa.js ile Web Sunucusu Yazımı
 * 
 * Hazırlayan / İmza: Enes Öztürk
 * Port: 3000
 */

import Koa from 'koa';

const app = new Koa();
const port = 3000;

// Sayfa içerik şablonu (HTML çıktısı ve Enes Öztürk imzası)
const renderPage = (title, content) => `
<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} | Koa.js Ödev 6</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      background: #0f172a;
      color: #f8fafc;
      margin: 0;
      padding: 40px 20px;
      display: flex;
      flex-direction: column;
      align-items: center;
      min-height: 100vh;
      box-sizing: border-box;
    }
    .card {
      background: #1e293b;
      border: 1px solid #334155;
      border-radius: 16px;
      padding: 40px;
      max-width: 600px;
      width: 100%;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
      text-align: center;
    }
    h1 {
      color: #38bdf8;
      margin-top: 0;
      font-size: 2rem;
    }
    nav {
      margin: 24px 0;
      display: flex;
      gap: 12px;
      justify-content: center;
      flex-wrap: wrap;
    }
    nav a {
      color: #94a3b8;
      text-decoration: none;
      padding: 8px 16px;
      border-radius: 8px;
      background: #0f172a;
      border: 1px solid #334155;
      font-weight: 500;
      transition: all 0.2s;
    }
    nav a:hover, nav a.active {
      color: #38bdf8;
      border-color: #38bdf8;
      background: rgba(56, 189, 248, 0.1);
    }
    .signature {
      margin-top: 32px;
      padding-top: 20px;
      border-top: 1px solid #334155;
      color: #64748b;
      font-size: 0.9rem;
    }
    .badge {
      display: inline-block;
      padding: 4px 10px;
      background: rgba(56, 189, 248, 0.15);
      color: #38bdf8;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
  </style>
</head>
<body>
  <div class="card">
    <span class="badge">Koa.js Web Sunucusu • Port ${port}</span>
    ${content}
    <nav>
      <a href="/index">/index</a>
      <a href="/hakkimda">/hakkimda</a>
      <a href="/iletisim">/iletisim</a>
    </nav>
    <div class="signature">
      Ödev 6 — Tasarım ve Kodlama: <strong>Enes Öztürk</strong>
    </div>
  </div>
</body>
</html>
`;

// Koa Middleware: Yönlendirme (Routing) mantığı
app.use(async (ctx) => {
  const url = ctx.url.toLowerCase();
  ctx.type = 'text/html; charset=utf-8';

  if (url === '/' || url === '/index') {
    ctx.status = 200;
    ctx.body = renderPage('Index', '<h1>INDEX sayfasına hoşgeldiniz</h1>');
  } else if (url === '/hakkimda') {
    ctx.status = 200;
    ctx.body = renderPage('Hakkımda', '<h1>HAKKIMDA sayfasına hoşgeldiniz</h1>');
  } else if (url === '/iletisim') {
    ctx.status = 200;
    ctx.body = renderPage('İletişim', '<h1>İLETİŞİM sayfasına hoşgeldiniz</h1>');
  } else {
    ctx.status = 404;
    ctx.body = renderPage('404 Bulunamadı', '<h1>404 - Sayfa Bulunamadı</h1><p style="color:#94a3b8">Aradığınız rota mevcut değil.</p>');
  }
});

// Sunucuyu 3000 portunda dinlemeye alıyoruz
app.listen(port, () => {
  console.log(`========================================`);
  console.log(`🚀 Koa.js Web Sunucusu Başlatıldı!`);
  console.log(`📡 Port: http://localhost:${port}`);
  console.log(`👤 Geliştirici: Enes Öztürk`);
  console.log(`========================================`);
});

export default app;
