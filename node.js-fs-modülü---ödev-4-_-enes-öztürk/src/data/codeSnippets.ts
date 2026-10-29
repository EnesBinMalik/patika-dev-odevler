import { HomeworkCodeSnippet } from '../types';

export const AUTHOR_NAME = 'ENES ÖZTÜRK';

export const CODE_SNIPPETS: HomeworkCodeSnippet[] = [
  {
    id: 'callback',
    title: 'Callback Yöntemi (Klasik / Bootcamp)',
    badge: 'fs (Callback)',
    description: 'Node.js bootcamp ve Kodluyoruz müfredatında en sık istenen Error-First Callback yapısı.',
    code: `/**
 * ÖDEV 4: FS (File System) Modülü CRUD İşlemleri
 * Konu: employees.json üzerinde Create, Read, Update, Delete
 * Geliştirici & İmza: ENES ÖZTÜRK
 */

const fs = require('fs');

// 1. ADIM: employees.json dosyası oluşturalım ve veriyi ekleyelim (YARAT)
const initialData = {
  name: "Employee 1 Name",
  salary: 2000
};

fs.writeFile('employees.json', JSON.stringify(initialData, null, 2), 'utf8', (err) => {
  if (err) {
    console.error('Dosya oluşturulurken hata çıktı:', err);
    return;
  }
  console.log('✓ 1. [YARAT] employees.json dosyası oluşturuldu ve veri yazıldı.');

  // 2. ADIM: Bu veriyi okuyalım (OKU)
  fs.readFile('employees.json', 'utf8', (err, data) => {
    if (err) {
      console.error('Dosya okunurken hata çıktı:', err);
      return;
    }
    console.log('✓ 2. [OKU] employees.json dosyasından okunan veri:');
    const employee = JSON.parse(data);
    console.log(employee);

    // 3. ADIM: Bu veriyi güncelleyelim (GÜNCELLE)
    employee.salary = 2500;
    employee.signature = 'ENES Öztürk';

    fs.writeFile('employees.json', JSON.stringify(employee, null, 2), 'utf8', (err) => {
      if (err) {
        console.error('Dosya güncellenirken hata çıktı:', err);
        return;
      }
      console.log('✓ 3. [GÜNCELLE] Veri güncellendi (Yeni maaş: 2500 TL).');

      // 4. ADIM: Dosyayı silelim (SİL)
      fs.unlink('employees.json', (err) => {
        if (err) {
          console.error('Dosya silinirken hata çıktı:', err);
          return;
        }
        console.log('✓ 4. [SİL] employees.json dosyası başarıyla silindi.');
        console.log('=================================================');
        console.log('Tüm CRUD adımları tamamlandı! İmza: ENES ÖZTÜRK');
        console.log('=================================================');
      });
    });
  });
});
`
  },
  {
    id: 'async',
    title: 'Modern Async / Await (fs/promises)',
    badge: 'fs/promises (ES6+)',
    description: 'Callback Hell olmadan temiz, modern async/await ve try/catch hata yönetimi.',
    code: `/**
 * ÖDEV 4: FS (File System) Modülü CRUD İşlemleri (Modern Async/Await)
 * Geliştirici & İmza: ENES ÖZTÜRK
 */

import fs from 'fs/promises';

async function executeEmployeeCRUD() {
  const fileName = 'employees.json';

  try {
    // 1. ADIM: YARAT (Create)
    const initialEmployee = {
      name: "Employee 1 Name",
      salary: 2000
    };
    await fs.writeFile(fileName, JSON.stringify(initialEmployee, null, 2), 'utf8');
    console.log('1. [YARAT] employees.json dosyası başarıyla oluşturuldu.');

    // 2. ADIM: OKU (Read)
    const rawData = await fs.readFile(fileName, 'utf8');
    const employeeData = JSON.parse(rawData);
    console.log('2. [OKU] Okunan çalışan verisi:', employeeData);

    // 3. ADIM: GÜNCELLE (Update)
    employeeData.salary = 3000;
    employeeData.updatedBy = 'ENES ÖZTÜRK';
    await fs.writeFile(fileName, JSON.stringify(employeeData, null, 2), 'utf8');
    console.log('3. [GÜNCELLE] Çalışan verisi güncellendi:', employeeData);

    // 4. ADIM: SİL (Delete)
    await fs.unlink(fileName);
    console.log('4. [SİL] employees.json dosyası başarıyla silindi.');

    console.log('Tüm işlemler başarıyla yürütüldü. - ENES ÖZTÜRK');
  } catch (error) {
    console.error('FS İşlemi sırasında hata:', error.message);
  }
}

executeEmployeeCRUD();
`
  },
  {
    id: 'sync',
    title: 'Senkron Yöntem (fs Sync)',
    badge: 'fs (Sync)',
    description: 'Bloklayan senkron metodlar (writeFileSync, readFileSync, unlinkSync).',
    code: `/**
 * ÖDEV 4: FS (File System) Modülü CRUD İşlemleri (Senkron)
 * Geliştirici & İmza: ENES ÖZTÜRK
 */

const fs = require('fs');

try {
  // 1. Yarat
  const initial = { name: "Employee 1 Name", salary: 2000 };
  fs.writeFileSync('employees.json', JSON.stringify(initial, null, 2), 'utf8');
  console.log('1. [YARAT] Senkron dosya oluşturuldu.');

  // 2. Oku
  const readData = fs.readFileSync('employees.json', 'utf8');
  const parsed = JSON.parse(readData);
  console.log('2. [OKU] Dosya okundu:', parsed);

  // 3. Güncelle
  parsed.salary = 2500;
  parsed.signed = 'ENES Öztürk';
  fs.writeFileSync('employees.json', JSON.stringify(parsed, null, 2), 'utf8');
  console.log('3. [GÜNCELLE] Senkron güncelleme yapıldı.');

  // 4. Sil
  fs.unlinkSync('employees.json');
  console.log('4. [SİL] Senkron dosya silindi. (ENES Öztürk)');
} catch (err) {
  console.error('Senkron hata:', err.message);
}
`
  }
];
