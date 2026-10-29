/**
 * =========================================================================
 * KODLUYORUZ / PATIKA.DEV - NODE.JS BOOTCAMP
 * ÖDEV 4: FS (File System) Modülü CRUD İşlemleri (CommonJS)
 * İmza: ENES ÖZTÜRK
 * =========================================================================
 */

const fs = require('fs');
const FILE_NAME = 'employees.json';

const initialEmployee = {
  name: "Employee 1 Name",
  salary: 2000
};

console.log('--- Ödev 4: Node.js FS Modülü (CommonJS) ---');
console.log('Geliştirici & İmza: ENES ÖZTÜRK\n');

// 1. Yarat
fs.writeFile(FILE_NAME, JSON.stringify(initialEmployee, null, 2), 'utf8', (err) => {
  if (err) return console.error('Hata:', err);
  console.log('✓ 1. [YARAT] employees.json dosyası oluşturuldu.');

  // 2. Oku
  fs.readFile(FILE_NAME, 'utf8', (err, data) => {
    if (err) return console.error('Hata:', err);
    console.log('✓ 2. [OKU] Okunan veri:', JSON.parse(data));

    // 3. Güncelle
    const updated = JSON.parse(data);
    updated.salary = 2500;
    updated.signature = 'ENES ÖZTÜRK';

    fs.writeFile(FILE_NAME, JSON.stringify(updated, null, 2), 'utf8', (err) => {
      if (err) return console.error('Hata:', err);
      console.log('✓ 3. [GÜNCELLE] Dosya güncellendi.');

      // 4. Sil
      fs.unlink(FILE_NAME, (err) => {
        if (err) return console.error('Hata:', err);
        console.log('✓ 4. [SİL] employees.json dosyası başarıyla silindi.');
        console.log('İmza: ENES ÖZTÜRK');
      });
    });
  });
});
