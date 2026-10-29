/**
 * Ödev 3: Daire Modüler Dosyası
 * Hazırlayan: Enes Öztürk
 * 
 * Fonksiyonlar:
 * - circleArea: Dairenin alanını hesaplar (π * r²) ve konsola yazdırır.
 * - circleCircumference: Dairenin çevresini hesaplar (2 * π * r) ve konsola yazdırır.
 */

// Daire alanı hesaplayan ve konsola yazdıran fonksiyon
function circleArea(r) {
  const area = Math.PI * Math.pow(r, 2);
  const formatted = Number(area.toFixed(2));
  console.log(`Yarıçapı (${r}) olan dairenin alanı: ${formatted} (Tam değer: ${area})`);
  return area;
}

// Daire çevresi hesaplayan ve konsola yazdıran fonksiyon
function circleCircumference(r) {
  const circumference = 2 * Math.PI * r;
  const formatted = Number(circumference.toFixed(2));
  console.log(`Yarıçapı (${r}) olan dairenin çevresi: ${formatted} (Tam değer: ${circumference})`);
  return circumference;
}

// module.exports yöntemi ile fonksiyonları dışa aktarma
module.exports = {
  circleArea,
  circleCircumference,
};
