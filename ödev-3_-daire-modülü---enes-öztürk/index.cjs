/**
 * Ödev 3: Daire Modülü Kullanımı
 * Hazırlayan: Enes Öztürk
 *
 * require ve object destructuring (nesne parçalama) kullanarak
 * circle.cjs modülünden circleArea ve circleCircumference fonksiyonlarını alıyoruz.
 */

const { circleArea, circleCircumference } = require('./circle.cjs');

console.log('==================================================');
console.log('       NODE.JS ÖDEV 3: DAİRE MODÜLÜ PROJESİ       ');
console.log('           Geliştirici: Enes Öztürk               ');
console.log('==================================================\n');

const r = 5;

console.log(`> Parametre: Yarıçap (r) = ${r}\n`);

console.log('[1] circleArea(r) Çağrıldı:');
circleArea(r);

console.log('\n[2] circleCircumference(r) Çağrıldı:');
circleCircumference(r);

console.log('\n==================================================');
console.log('  İşlem başarıyla tamamlandı. — İmza: Enes Öztürk  ');
console.log('==================================================');
