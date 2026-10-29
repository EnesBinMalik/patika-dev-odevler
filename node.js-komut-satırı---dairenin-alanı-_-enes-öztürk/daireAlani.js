/**
 * @file daireAlani.js
 * @description Node.JS Komut Satırı Kullanımı - Dairenin Alanı Hesaplayıcı
 * @formula Alan = π * r^2
 * @author Enes Öztürk
 * 
 * Konsol çıktısı formatı:
 * Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)
 */

// Konsoldan girilen parametreleri alıyoruz
// process.argv[0]: node dizini
// process.argv[1]: dosya dizini
// process.argv[2]: girilen ilk parametre (yarıçap)
const args = process.argv.slice(2);
const yaricap = Number(args[0]);

function daireAlaniHesapla(r) {
  if (args.length === 0 || isNaN(r) || r < 0) {
    console.log('Hata: Lütfen geçerli bir yarıçap değeri giriniz!');
    console.log('Kullanım: node daireAlani.js <yarıçap>');
    console.log('Örnek  : node daireAlani.js 5');
    return;
  }

  // Alan = π * r^2 (Math.PI * r * r)
  const alan = Math.PI * (r ** 2);

  // İstenen çıktı formatı:
  // Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)
  console.log(`Yarıçapı (${r}) olan dairenin alanı: (${alan})`);
}

daireAlaniHesapla(yaricap);
