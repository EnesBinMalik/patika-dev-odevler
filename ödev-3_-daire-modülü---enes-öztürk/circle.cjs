/**
 * Ödev 3: Daire Modüler Dosyası
 * Hazırlayan: Enes Öztürk
 *
 * circleArea: Daire alanı hesaplar (π * r²) ve konsola yazdırır.
 * circleCircumference: Daire çevresi hesaplar (2 * π * r) ve konsola yazdırır.
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

module.exports = {
  circleArea,
  circleCircumference,
};
