/**
 * Ödev 3: Daire Modüler Dosyası
 * Hazırlayan: Enes Öztürk
 *
 * Fonksiyonlar:
 * 1. circleArea(r): Dairenin alanını hesaplar (π * r²) ve konsola yazdırır.
 * 2. circleCircumference(r): Dairenin çevresini hesaplar (2 * π * r) ve konsola yazdırır.
 *
 * Dışa aktarma: module.exports
 */

function circleArea(r) {
  const area = Math.PI * r * r;
  console.log(`Yarıçapı (${r}) olan dairenin alanı: ${area.toFixed(2)}`);
  return area;
}

function circleCircumference(r) {
  const circumference = 2 * Math.PI * r;
  console.log(`Yarıçapı (${r}) olan dairenin çevresi: ${circumference.toFixed(2)}`);
  return circumference;
}

// module.exports yöntemi ile fonksiyonları dışa aktarıyoruz
module.exports = {
  circleArea,
  circleCircumference,
};
