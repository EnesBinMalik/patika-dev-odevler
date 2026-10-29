/**
 * =========================================================================
 * KODLUYORUZ / PATIKA.DEV - NODE.JS BOOTCAMP
 * ÖDEV 4: FS (File System) Modülü CRUD İşlemleri
 * 
 * Görevler:
 * 1. employees.json dosyası oluşturalım ve içerisine 
 *    {"name": "Employee 1 Name", "salary": 2000} verisini ekleyelim. (YARAT)
 * 2. Bu veriyi okuyalım. (OKUYUN)
 * 3. Bu veriyi güncelleyelim. (GÜNCELLE)
 * 4. Dosyayı silelim. (SİL)
 * 
 * İmza: ENES ÖZTÜRK
 * =========================================================================
 */

import fs from 'fs';
const FILE_NAME = 'employees.json';

// Başlangıç verisi
const initialEmployee = {
  name: "Employee 1 Name",
  salary: 2000
};

console.log('--- Ödev 4: Node.js FS Modülü Başlatıldı ---');
console.log('Geliştirici & İmza: ENES ÖZTÜRK\n');

// 1. ADIM: employees.json dosyası oluşturalım ve içerisine veriyi ekleyelim (YARAT)
fs.writeFile(FILE_NAME, JSON.stringify(initialEmployee, null, 2), 'utf8', (err) => {
  if (err) {
    console.error('1. Adım Hatası (Dosya oluşturulamadı):', err);
    return;
  }
  console.log('✓ 1. [YARAT] employees.json dosyası başarıyla oluşturuldu ve veri yazıldı.');
  console.log('Yazılan Veri:', initialEmployee);

  // 2. ADIM: Bu veriyi okuyalım (OKUYUN)
  fs.readFile(FILE_NAME, 'utf8', (err, data) => {
    if (err) {
      console.error('2. Adım Hatası (Dosya okunamadı):', err);
      return;
    }
    console.log('\n✓ 2. [OKU] employees.json dosyası başarıyla okundu.');
    const parsedData = JSON.parse(data);
    console.log('Okunan Veri (JSON Objesi):', parsedData);

    // 3. ADIM: Bu veriyi güncelleyelim (GÜNCELLE)
    parsedData.salary = 2500;
    parsedData.name = 'Employee 1 Name (Güncellendi)';
    parsedData.signature = 'ENES ÖZTÜRK';

    fs.writeFile(FILE_NAME, JSON.stringify(parsedData, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('3. Adım Hatası (Dosya güncellenemedi):', err);
        return;
      }
      console.log('\n✓ 3. [GÜNCELLE] employees.json dosyası başarıyla güncellendi.');
      console.log('Güncellenen Veri:', parsedData);

      // 4. ADIM: Dosyayı silelim (SİL)
      fs.unlink(FILE_NAME, (err) => {
        if (err) {
          console.error('4. Adım Hatası (Dosya silinemedi):', err);
          return;
        }
        console.log('\n✓ 4. [SİL] employees.json dosyası başarıyla silindi.');
        console.log('\n======================================================');
        console.log('Tebrikler! Tüm CRUD işlemleri başarıyla tamamlandı.');
        console.log('İmza: ENES ÖZTÜRK');
        console.log('======================================================');
      });
    });
  });
});
