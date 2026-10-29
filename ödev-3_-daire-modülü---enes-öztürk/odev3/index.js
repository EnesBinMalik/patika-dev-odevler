/**
 * Ödev 3: Daire Modülü Kullanımı
 * Hazırlayan: Enes Öztürk
 *
 * circle.js modülünden require ve object destructuring (nesne parçalama)
 * yöntemiyle fonksiyonlar içe aktarılır.
 * Yarıçap (r) = 5 için konsol çıktısı üretilir.
 */

// require ve object destructuring ile fonksiyonları alıyoruz
const { circleArea, circleCircumference } = require('./circle');

console.log('==================================================');
console.log('       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       ');
console.log('           Geliştirici: Enes Öztürk               ');
console.log('==================================================\n');

// Yarıçap (r) 5 olarak belirleniyor
const r = 5;

console.log(`> Belirlenen Yarıçap Değeri: r = ${r}\n`);

// Fonksiyonları çağırarak konsola sonuçları yazdırıyoruz
console.log('[1] circleArea(r) Çağrıldı:');
circleArea(r);

console.log('\n[2] circleCircumference(r) Çağrıldı:');
circleCircumference(r);

console.log('\n==================================================');
console.log('  Tebrikler! Ödev başarıyla tamamlandı.           ');
console.log('  İmza: Enes Öztürk                               ');
console.log('==================================================');
