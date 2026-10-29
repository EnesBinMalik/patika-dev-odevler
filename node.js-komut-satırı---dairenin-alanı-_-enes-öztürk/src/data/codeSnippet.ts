export const NODE_SCRIPT_CODE = `/**
 * Ödev 1: Node.JS Komut Satırı Kullanımı
 * Konu: Dairenin Alanını Konsoldan Parametre Alarak Hesaplama
 * Formül: Alan = π * r^2
 * 
 * Hazırlayan: Enes Öztürk
 * İmzalı & El Emeği Çalışma
 */

// 1. Komut satırından gelen parametreleri alıyoruz
// process.argv dizisinin ilk 2 elemanı:
// [0] -> node motorunun yolu
// [1] -> çalıştırılan javascript dosyasının yolu
// [2] -> komut satırından gönderdiğimiz ilk parametre (yarıçap)
const arguments = process.argv.slice(2);
const yaricap = Number(arguments[0]);

function daireAlaniHesapla(r) {
  // Parametre kontrolü ve hata yönetimi
  if (arguments.length === 0 || isNaN(r) || r < 0) {
    console.log("Hata: Lütfen geçerli ve pozitif bir yarıçap değeri giriniz!");
    console.log("Kullanım: node daireAlani.js <yarıçap>");
    console.log("Örnek  : node daireAlani.js 5");
    return;
  }

  // Dairenin Alanı = π * r^2
  // Javascript'te π sayısı 'Math.PI' sabiti ile temsil edilir.
  // r^2 için 'r * r', 'r ** 2' veya 'Math.pow(r, 2)' kullanılabilir.
  const alan = Math.PI * (r ** 2);

  // İstenen Konsol Çıktısı Formatı:
  // "Yarıçapı (Yarıçap) olan dairenin alanı: (Alan)"
  console.log(\`Yarıçapı (\${r}) olan dairenin alanı: (\${alan})\`);
}

// Fonksiyonu komuttan gelen yarıçap ile çağırıyoruz
daireAlaniHesapla(yaricap);
`;

export const ARGV_BREAKDOWN = [
  {
    index: "process.argv[0]",
    name: "Yürütücü Yolu (Node Binary)",
    example: "/usr/local/bin/node",
    desc: "Node.js çalışma ortamının kurulu olduğu sistem ikili dosyasının tam yoludur.",
  },
  {
    index: "process.argv[1]",
    name: "Dosya Yolu (Script Path)",
    example: "/home/enes/odev1/daireAlani.js",
    desc: "Çalıştırılmakta olan JavaScript dosyasının disk üzerindeki mutlak yoludur.",
  },
  {
    index: "process.argv[2]",
    name: "1. Kullanıcı Parametresi (Yarıçap)",
    example: "5",
    desc: "Kullanıcının terminalde dosya isminden sonra yazdığı ilk argüman. String tipinde gelir, Number() veya parseFloat() ile sayıya dönüştürülür.",
  },
];

export const MATH_EXPLANATION = {
  formula: "A = π · r²",
  piValue: Math.PI,
  steps: [
    {
      title: "Yarıçapın Karesini Alma (r²)",
      desc: "Yarıçap kendisiyle çarpılır: r × r = r²",
    },
    {
      title: "Pi Sabiti ile Çarpım (π)",
      desc: "Math.PI (yaklaşık 3.141592653589793) ile r² değeri çarpılır.",
    },
    {
      title: "Formatlı Konsol Çıktısı",
      desc: "Yarıçapı (Yarıçap) olan dairenin alanı: (Alan) şablonuna yerleştirilir.",
    },
  ],
};
