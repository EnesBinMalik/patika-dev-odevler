/**
 * Ödev 3: Daire Modülü Kullanımı
 * Hazırlayan: Enes Öztürk
 *
 * circle.js modülünden require ve object destructuring ile fonksiyonları alıp
 * yarıçapı r = 5 olan dairenin alan ve çevre çıktısını konsola yazdırıyoruz.
 */

// require ve object destructuring (nesne parçalama) kullanarak fonksiyonları içe aktarma
const { circleArea, circleCircumference } = require('./circle');

console.log('==================================================');
console.log('       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       ');
console.log('           Geliştirici: Enes Öztürk               ');
console.log('==================================================\n');

// Yarıçap (r) değeri 5 olarak belirleniyor
const r = 5;

console.log(`> Parametre: Yarıçap (r) = ${r}\n`);

// Fonksiyonları çağırarak konsol çıktılarını alıyoruz
console.log('[1] Daire Alanı Hesaplanıyor:');
circleArea(r);

console.log('\n[2] Daire Çevresi Hesaplanıyor:');
circleCircumference(r);

console.log('\n==================================================');
console.log('  İşlem başarıyla tamamlandı. — İmza: Enes Öztürk  ');
console.log('==================================================');
