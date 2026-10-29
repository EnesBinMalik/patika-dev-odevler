/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Ödev 5: Kendi Web Sunucumuzu Yazalım
 * Geliştirici: Enes Öztürk
 * Port: 5000
 */

export const CODE_SNIPPET_IF_ELSE = `/**
 * Ödev 5: Kendi Web Sunucumuzu Yazalım
 * Geliştirici: Enes Öztürk
 * Açıklama: Node.js http modülü ile port 5000 üzerinde çalışan web sunucusu
 */

const http = require('http');

// Sunucunun dinleyeceği port numarası
const port = 5000;

// createServer metodu ile sunucumuzu oluşturuyoruz
const server = http.createServer((req, res) => {
  const url = req.url;

  // Türkçe karakter desteği ve HTML içerik tipi için başlık ayarı
  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });

  // İstenen URL adresine göre sayfa yönlendirmesi
  if (url === '/' || url === '/index') {
    res.write('<h2>Index sayfasına hoşgeldiniz</h2>');
    res.write('<p>Geliştirici: Enes Öztürk | Node.js Web Sunucusu</p>');
  } else if (url === '/hakkimda') {
    res.write('<h2>Hakkımda sayfasına hoşgeldiniz</h2>');
    res.write('<p>Geliştirici: Enes Öztürk | Hakkımda Bölümü</p>');
  } else if (url === '/iletisim') {
    res.write('<h2>İletişim sayfasına hoşgeldiniz</h2>');
    res.write('<p>Geliştirici: Enes Öztürk | İletişim: enesbino38@gmail.com</p>');
  } else {
    // Tanımsız sayfalar için 404 başlığı ve içeriği
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h2>404 Sayfa Bulunamadı</h2>');
    res.write('<p>Aradığınız sayfa bu sunucuda mevcut değil.</p>');
  }

  // Yanıtı tamamlayıp istemciye gönderiyoruz
  res.end();
});

// Sunucumuzu 5000 portunda dinlemeye başlatıyoruz
server.listen(port, () => {
  console.log(\`Sunucu port \${port}'de başarıyla başlatıldı.\`);
  console.log(\`Tarayıcınızdan http://localhost:\${port} adresini ziyaret edebilirsiniz.\`);
  console.log('Hazırlayan: Enes Öztürk');
});
`;

export const CODE_SNIPPET_SWITCH_CASE = `/**
 * Ödev 5: Kendi Web Sunucumuzu Yazalım (Switch/Case Yöntemi)
 * Geliştirici: Enes Öztürk
 * Port: 5000
 */

const http = require('http');
const port = 5000;

const server = http.createServer((req, res) => {
  const url = req.url;

  switch (url) {
    case '/':
    case '/index':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>Index sayfasına hoşgeldiniz</h2>');
      res.write('<p>Geliştirici: Enes Öztürk</p>');
      break;

    case '/hakkimda':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>Hakkımda sayfasına hoşgeldiniz</h2>');
      res.write('<p>Geliştirici: Enes Öztürk</p>');
      break;

    case '/iletisim':
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>İletişim sayfasına hoşgeldiniz</h2>');
      res.write('<p>Geliştirici: Enes Öztürk</p>');
      break;

    default:
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.write('<h2>404 Sayfa Bulunamadı</h2>');
      res.write('<p>Geliştirici: Enes Öztürk</p>');
      break;
  }

  res.end();
});

server.listen(port, () => {
  console.log(\`Sunucu port \${port} üzerinde çalışıyor - Enes Öztürk\`);
});
`;

export const CODE_SNIPPET_ES_MODULE = `/**
 * Ödev 5: Kendi Web Sunucumuzu Yazalım (ES Module - Node.js)
 * Geliştirici: Enes Öztürk
 * Port: 5000
 * Not: package.json içine "type": "module" eklenmelidir.
 */

import http from 'node:http';

const PORT = 5000;

const server = http.createServer((req, res) => {
  const { url } = req;

  if (url === '/' || url === '/index') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(\`
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="utf-8"><title>Index</title></head>
      <body>
        <h2>Index sayfasına hoşgeldiniz</h2>
        <p>Hazırlayan: Enes Öztürk</p>
      </body>
      </html>
    \`);
  } else if (url === '/hakkimda') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(\`
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="utf-8"><title>Hakkımda</title></head>
      <body>
        <h2>Hakkımda sayfasına hoşgeldiniz</h2>
        <p>Hazırlayan: Enes Öztürk</p>
      </body>
      </html>
    \`);
  } else if (url === '/iletisim') {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(\`
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="utf-8"><title>İletişim</title></head>
      <body>
        <h2>İletişim sayfasına hoşgeldiniz</h2>
        <p>Hazırlayan: Enes Öztürk</p>
      </body>
      </html>
    \`);
  } else {
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(\`
      <!DOCTYPE html>
      <html lang="tr">
      <head><meta charset="utf-8"><title>404</title></head>
      <body>
        <h2>404 Sayfa Bulunamadı</h2>
        <p>Hazırlayan: Enes Öztürk</p>
      </body>
      </html>
    \`);
  }
});

server.listen(PORT, () => {
  console.log(\`Sunucu http://localhost:\${PORT} adresinde dinlemede! [Enes Öztürk]\`);
});
`;

export const PACKAGE_JSON_SNIPPET = `{
  "name": "nodejs-web-sunucusu-odev5",
  "version": "1.0.0",
  "description": "Node.js createServer ile port 5000 web sunucusu ödevi",
  "main": "index.js",
  "scripts": {
    "start": "node index.js"
  },
  "author": "Enes Öztürk",
  "license": "MIT"
}
`;

export const README_MD_SNIPPET = `# Ödev 5: Kendi Web Sunucumuzu Yazalım

**Geliştirici:** Enes Öztürk  
**Ders:** Node.js Temelleri (Patika.dev / Kodluyoruz)  
**Port:** 5000  

---

## 📌 Ödev Konusu ve İstenen Özellikler
1. \`createServer\` metodunu kullanmak.
2. \`index\`, \`hakkimda\` ve \`iletisim\` sayfaları oluşturmak.
3. Sayfalara içerik olarak **"xxx sayfasına hoşgeldiniz"** şeklinde \`<h2>\` başlıkları yazdırmak.
4. Port numarası olarak **5000**'i kullanmak.
5. **Enes Öztürk** imzalı olması.

---

## 🚀 Kurulum ve Çalıştırma

1. Proje dizinine gidin:
   \`\`\`bash
   cd odev5
   \`\`\`

2. Sunucuyu başlatın:
   \`\`\`bash
   node index.js
   \`\`\`

3. Tarayıcınızdan aşağıdaki adresleri ziyaret edin:
   - \`http://localhost:5000/\` veya \`http://localhost:5000/index\` -> **<h2>Index sayfasına hoşgeldiniz</h2>**
   - \`http://localhost:5000/hakkimda\` -> **<h2>Hakkımda sayfasına hoşgeldiniz</h2>**
   - \`http://localhost:5000/iletisim\` -> **<h2>İletişim sayfasına hoşgeldiniz</h2>**
   - \`http://localhost:5000/diger\` -> **<h2>404 Sayfa Bulunamadı</h2>**

---

Hazırlayan: **Enes Öztürk**
`;
